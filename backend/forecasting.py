from __future__ import annotations

import datetime as dt
import math
from dataclasses import dataclass

import numpy as np
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from models import DailyPoint, ForecastMethod, ProductStatus, ValidationMetrics

MIN_FORECAST_HISTORY_DAYS = 14
MIN_ML_EVALUATION_DAYS = 60
VALIDATION_WINDOW_DAYS = 14
FORECAST_HORIZON_DAYS = 14
MIN_FEATURE_LAG_DAYS = 14


@dataclass
class ForecastExecutionResult:
    status: ProductStatus
    chosen_method: ForecastMethod
    forecast: list[DailyPoint]
    validation: ValidationMetrics | None
    notes: list[str]
    fitted_ridge_coef: list[float] | None = None


def compute_seasonal_naive_raw(
    history_units: list[float],
    horizon_days: int = FORECAST_HORIZON_DAYS,
) -> list[float]:
    """
    Compute recursive 7-day seasonal-naive predictions for `horizon_days` steps.
    Uses only `history_units` and its own prior predictions.
    """
    if len(history_units) < 7:
        raise ValueError("Seasonal-naive forecast requires at least 7 daily observations.")

    buffer: list[float] = [float(u) for u in history_units]
    preds: list[float] = []
    for _ in range(horizon_days):
        val = buffer[-7]
        if not math.isfinite(val) or val < 0.0:
            val = 0.0
        buffer.append(val)
        preds.append(val)
    return preds


def compute_seasonal_naive_forecast(
    history_dates: list[dt.date],
    history_units: list[int | float],
    horizon_days: int = FORECAST_HORIZON_DAYS,
) -> list[DailyPoint]:
    last_date = history_dates[-1]
    raw_preds = compute_seasonal_naive_raw([float(u) for u in history_units], horizon_days)
    points: list[DailyPoint] = []
    for step, val in enumerate(raw_preds, start=1):
        target_date = last_date + dt.timedelta(days=step)
        rounded = round(val, 2)
        units_out: int | float = int(rounded) if rounded.is_integer() else rounded
        points.append(DailyPoint(date=target_date.isoformat(), units=units_out))
    return points


def _build_feature_row(buffer: list[float], target_date: dt.date) -> list[float]:
    """
    Construct leak-free features for `target_date` using strictly prior values in `buffer`.
    Requires `len(buffer) >= 14`.
    Features:
      - lag_1: yesterday's demand (buffer[-1])
      - lag_7: same weekday 7 days earlier (buffer[-7])
      - rolling_mean_7: mean of previous 7 days (buffer[-7:])
      - rolling_mean_14: mean of previous 14 days (buffer[-14:])
      - weekday one-hot (7 binary indicators for Monday=0 .. Sunday=6)
    """
    lag_1 = float(buffer[-1])
    lag_7 = float(buffer[-7])
    rolling_7 = float(sum(buffer[-7:]) / 7.0)
    rolling_14 = float(sum(buffer[-14:]) / 14.0)
    weekday = target_date.weekday()
    weekday_one_hot = [1.0 if weekday == w else 0.0 for w in range(7)]
    return [lag_1, lag_7, rolling_7, rolling_14, *weekday_one_hot]


def build_supervised_dataset(
    dates: list[dt.date],
    units: list[float],
) -> tuple[np.ndarray, np.ndarray]:
    """
    Build supervised training matrix (X, y) from a chronological series.
    Each target index `t` (from 14 to len(units)-1) uses only `units[:t]`.
    """
    if len(dates) != len(units) or len(units) <= MIN_FEATURE_LAG_DAYS:
        raise ValueError("Series must have > 14 observations to build supervised features.")

    X_rows: list[list[float]] = []
    y_vals: list[float] = []

    for t in range(MIN_FEATURE_LAG_DAYS, len(units)):
        prior_slice = units[:t]
        X_rows.append(_build_feature_row(prior_slice, dates[t]))
        y_vals.append(float(units[t]))

    return np.asarray(X_rows, dtype=np.float64), np.asarray(y_vals, dtype=np.float64)


def fit_ridge_pipeline(dates: list[dt.date], units: list[float]) -> Pipeline:
    """
    Fit a StandardScaler + Ridge regression pipeline strictly on the provided series.
    """
    X_train, y_train = build_supervised_dataset(dates, units)
    pipeline = Pipeline(
        [
            ("scaler", StandardScaler()),
            ("ridge", Ridge(alpha=1.0, random_state=42)),
        ]
    )
    pipeline.fit(X_train, y_train)
    return pipeline


def predict_ridge_recursive(
    pipeline: Pipeline,
    history_dates: list[dt.date],
    history_units: list[float],
    horizon_days: int = FORECAST_HORIZON_DAYS,
) -> list[float]:
    """
    Produce a genuine recursive multi-step forecast starting after `history_dates[-1]`.
    Steps > 1 use previously predicted values in the lag/rolling buffer (never withheld actuals).
    Intermediate predictions are clipped to finite >= 0.0 and NOT rounded.
    """
    buffer: list[float] = [float(u) for u in history_units]
    last_date = history_dates[-1]
    preds: list[float] = []

    for step in range(1, horizon_days + 1):
        target_date = last_date + dt.timedelta(days=step)
        feat = np.asarray([_build_feature_row(buffer, target_date)], dtype=np.float64)
        raw_pred = float(pipeline.predict(feat)[0])
        if not math.isfinite(raw_pred):
            raise ValueError("Ridge produced non-finite prediction.")
        clipped_pred = max(0.0, raw_pred)
        buffer.append(clipped_pred)
        preds.append(clipped_pred)

    return preds


def _compute_mae(actuals: list[float], predictions: list[float]) -> float:
    if len(actuals) != len(predictions) or len(actuals) == 0:
        raise ValueError("MAE requires non-empty equal-length lists.")
    total_abs_err = sum(abs(float(a) - float(p)) for a, p in zip(actuals, predictions))
    return total_abs_err / float(len(actuals))


def evaluate_and_forecast_sku(
    dates: list[dt.date],
    units: list[int],
    existing_notes: list[str] | None = None,
) -> ForecastExecutionResult:
    """
    Execute the ReorderLens AI forecasting contract for a single dense daily SKU series:
      - < 14 days: `insufficient_history`, forecast=[], chosen_method=None, validation=None
      - 14..59 days: `baseline_only`, chosen_method='seasonal_naive', validation=None
      - >= 60 days: withhold last 14 days for chronological recursive validation comparing
        StandardScaler+Ridge vs 7-day seasonal-naive baseline; choose lower validation MAE
        (ties prefer seasonal_naive); refit winner on all observed history and predict next 14 days.
    """
    notes = list(existing_notes) if existing_notes else []
    n_obs = len(dates)

    if n_obs < MIN_FORECAST_HISTORY_DAYS:
        notes.append(
            f"Insufficient daily history ({n_obs} consecutive days; minimum {MIN_FORECAST_HISTORY_DAYS} required for a 14-day forecast)."
        )
        return ForecastExecutionResult(
            status="insufficient_history",
            chosen_method=None,
            forecast=[],
            validation=None,
            notes=notes,
        )

    float_units = [float(u) for u in units]

    if n_obs < MIN_ML_EVALUATION_DAYS:
        forecast_pts = compute_seasonal_naive_forecast(
            history_dates=dates,
            history_units=float_units,
            horizon_days=FORECAST_HORIZON_DAYS,
        )
        notes.append(
            f"Not enough daily history to evaluate ML reliably ({n_obs} consecutive days; minimum {MIN_ML_EVALUATION_DAYS} required). "
            f"Using 7-day seasonal-naive baseline without validation MAE."
        )
        return ForecastExecutionResult(
            status="baseline_only",
            chosen_method="seasonal_naive",
            forecast=forecast_pts,
            validation=None,
            notes=notes,
        )

    # >= 60 consecutive days: chronological validation on last 14 observed days
    train_dates = dates[:-VALIDATION_WINDOW_DAYS]
    train_units = float_units[:-VALIDATION_WINDOW_DAYS]
    val_dates = dates[-VALIDATION_WINDOW_DAYS:]
    val_actuals = float_units[-VALIDATION_WINDOW_DAYS:]

    naive_val_preds = compute_seasonal_naive_raw(train_units, VALIDATION_WINDOW_DAYS)
    naive_mae_raw = _compute_mae(val_actuals, naive_val_preds)

    try:
        val_pipeline = fit_ridge_pipeline(train_dates, train_units)
        ridge_val_preds = predict_ridge_recursive(
            val_pipeline, train_dates, train_units, VALIDATION_WINDOW_DAYS
        )
        ridge_mae_raw = _compute_mae(val_actuals, ridge_val_preds)
        ridge_coef = [
            float(c) for c in val_pipeline.named_steps["ridge"].coef_.tolist()
        ]
    except Exception as exc:
        # Degenerate or numerically unstable series fallback
        forecast_pts = compute_seasonal_naive_forecast(
            history_dates=dates,
            history_units=float_units,
            horizon_days=FORECAST_HORIZON_DAYS,
        )
        notes.append(
            f"Ridge validation encountered numerical fallback ({exc}); defaulted to 7-day seasonal-naive baseline."
        )
        return ForecastExecutionResult(
            status="baseline_only",
            chosen_method="seasonal_naive",
            forecast=forecast_pts,
            validation=None,
            notes=notes,
        )

    ridge_mae = round(ridge_mae_raw, 2)
    seasonal_naive_mae = round(naive_mae_raw, 2)

    # Compare full-precision MAE (with tie-breaking in favor of simpler seasonal_naive)
    # Also ensure that if rounded MAEs are equal, seasonal_naive wins ties cleanly
    if ridge_mae_raw < naive_mae_raw - 1e-9 and ridge_mae < seasonal_naive_mae:
        chosen_method: ForecastMethod = "ridge"
        selected_mae = ridge_mae
    else:
        chosen_method = "seasonal_naive"
        selected_mae = seasonal_naive_mae

    validation_metrics = ValidationMetrics(
        window_days=VALIDATION_WINDOW_DAYS,
        ridge_mae=ridge_mae,
        seasonal_naive_mae=seasonal_naive_mae,
        selected_method_mae=selected_mae,
    )

    # Refit chosen method on ALL observed history and predict next 14 calendar dates
    last_date = dates[-1]
    if chosen_method == "ridge":
        try:
            full_pipeline = fit_ridge_pipeline(dates, float_units)
            future_raw = predict_ridge_recursive(
                full_pipeline, dates, float_units, FORECAST_HORIZON_DAYS
            )
            forecast_pts = []
            for step, val in enumerate(future_raw, start=1):
                target_date = last_date + dt.timedelta(days=step)
                rounded = round(val, 2)
                forecast_pts.append(
                    DailyPoint(date=target_date.isoformat(), units=rounded)
                )
            notes.append(
                f"14-day chronological recursive validation ({val_dates[0].isoformat()} to {val_dates[-1].isoformat()}): "
                f"Ridge MAE ({ridge_mae:.2f}) beat Seasonal-Naive MAE ({seasonal_naive_mae:.2f}). "
                f"Refit Ridge regression on all {n_obs} observed days."
            )
        except Exception as exc:
            chosen_method = "seasonal_naive"
            validation_metrics.selected_method_mae = seasonal_naive_mae
            forecast_pts = compute_seasonal_naive_forecast(
                history_dates=dates,
                history_units=float_units,
                horizon_days=FORECAST_HORIZON_DAYS,
            )
            notes.append(
                f"Full-series Ridge refit fallback ({exc}); using 7-day seasonal-naive baseline."
            )
    else:
        forecast_pts = compute_seasonal_naive_forecast(
            history_dates=dates,
            history_units=float_units,
            horizon_days=FORECAST_HORIZON_DAYS,
        )
        notes.append(
            f"14-day chronological recursive validation ({val_dates[0].isoformat()} to {val_dates[-1].isoformat()}): "
            f"Seasonal-Naive baseline MAE ({seasonal_naive_mae:.2f}) beat or tied Ridge MAE ({ridge_mae:.2f}). "
            f"Selected simpler seasonal-naive baseline."
        )

    return ForecastExecutionResult(
        status="evaluated",
        chosen_method=chosen_method,
        forecast=forecast_pts,
        validation=validation_metrics,
        notes=notes,
        fitted_ridge_coef=ridge_coef,
    )
