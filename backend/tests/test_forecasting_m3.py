from __future__ import annotations

import datetime as dt
import math

import numpy as np
from fastapi.testclient import TestClient

from app import app
from forecasting import (
    VALIDATION_WINDOW_DAYS,
    build_supervised_dataset,
    evaluate_and_forecast_sku,
    fit_ridge_pipeline,
    predict_ridge_recursive,
)

client = TestClient(app)


def _make_dates(n_days: int, start: dt.date = dt.date(2026, 7, 1)) -> list[dt.date]:
    return [start + dt.timedelta(days=i) for i in range(n_days)]


def test_validation_cutoff_strictly_prevents_data_leakage() -> None:
    """
    Perturbing the withheld last 14 days must NOT alter training features, scaler parameters,
    fitted Ridge weights, or the 14-step recursive validation predictions from the cutoff.
    Only the resulting validation MAE changes because the held-out targets changed.
    """
    dates = _make_dates(90)
    base_units = [10 + (i % 7) * 2 + (i // 7) for i in range(90)]
    perturbed_units = list(base_units)
    # Dramatically alter the withheld last 14 days
    for idx in range(90 - VALIDATION_WINDOW_DAYS, 90):
        perturbed_units[idx] = base_units[idx] + 500

    train_dates_1 = dates[:-VALIDATION_WINDOW_DAYS]
    train_units_1 = [float(u) for u in base_units[:-VALIDATION_WINDOW_DAYS]]

    train_dates_2 = dates[:-VALIDATION_WINDOW_DAYS]
    train_units_2 = [float(u) for u in perturbed_units[:-VALIDATION_WINDOW_DAYS]]

    X1, y1 = build_supervised_dataset(train_dates_1, train_units_1)
    X2, y2 = build_supervised_dataset(train_dates_2, train_units_2)
    assert np.array_equal(X1, X2)
    assert np.array_equal(y1, y2)

    pipe1 = fit_ridge_pipeline(train_dates_1, train_units_1)
    pipe2 = fit_ridge_pipeline(train_dates_2, train_units_2)
    assert np.allclose(
        pipe1.named_steps["scaler"].mean_, pipe2.named_steps["scaler"].mean_
    )
    assert np.allclose(
        pipe1.named_steps["ridge"].coef_, pipe2.named_steps["ridge"].coef_
    )

    val_preds_1 = predict_ridge_recursive(
        pipe1, train_dates_1, train_units_1, VALIDATION_WINDOW_DAYS
    )
    val_preds_2 = predict_ridge_recursive(
        pipe2, train_dates_2, train_units_2, VALIDATION_WINDOW_DAYS
    )
    assert val_preds_1 == val_preds_2

    res1 = evaluate_and_forecast_sku(dates, base_units)
    res2 = evaluate_and_forecast_sku(dates, perturbed_units)
    assert res1.fitted_ridge_coef == res2.fitted_ridge_coef
    assert res1.validation is not None and res2.validation is not None
    assert res1.validation.ridge_mae != res2.validation.ridge_mae


def test_ridge_wins_on_trending_autoregressive_series() -> None:
    """
    On a steadily trending series, 7-day seasonal-naive systematically lags behind by 7 days' growth,
    while Ridge with rolling mean & lag-1 tracks the level and achieves lower validation MAE.
    """
    dates = _make_dates(100)
    # Steady upward trend of +2 units/day so lag-7 naive is always off by ~14..28 units
    units = [10 + 2 * i for i in range(100)]
    res = evaluate_and_forecast_sku(dates, units)

    assert res.status == "evaluated"
    assert res.validation is not None
    assert res.validation.ridge_mae < res.validation.seasonal_naive_mae
    assert res.chosen_method == "ridge"
    assert res.validation.selected_method_mae == res.validation.ridge_mae
    assert len(res.forecast) == 14


def test_seasonal_naive_wins_ties_on_exact_weekly_cycle() -> None:
    """
    On a pure noiseless 7-day repeating cycle, seasonal-naive has 0.0 validation MAE and
    must be selected (tie or strictly lower MAE prefers simpler seasonal_naive).
    """
    dates = _make_dates(84)
    weekly_pattern = [5, 8, 12, 6, 20, 25, 0]
    units = [weekly_pattern[i % 7] for i in range(84)]

    res = evaluate_and_forecast_sku(dates, units)
    assert res.status == "evaluated"
    assert res.validation is not None
    assert res.validation.seasonal_naive_mae == 0.0
    assert res.chosen_method == "seasonal_naive"
    assert res.validation.selected_method_mae == 0.0
    assert [pt.units for pt in res.forecast] == weekly_pattern * 2


def test_constant_and_all_zero_series_produce_finite_nonnegative_forecasts() -> None:
    dates = _make_dates(70)
    zero_units = [0 for _ in range(70)]
    res_zero = evaluate_and_forecast_sku(dates, zero_units)
    assert res_zero.status == "evaluated"
    assert len(res_zero.forecast) == 14
    for pt in res_zero.forecast:
        assert math.isfinite(pt.units)
        assert pt.units == 0

    const_units = [15 for _ in range(70)]
    res_const = evaluate_and_forecast_sku(dates, const_units)
    assert res_const.status == "evaluated"
    assert len(res_const.forecast) == 14
    for pt in res_const.forecast:
        assert math.isfinite(pt.units)
        assert pt.units >= 0


def test_different_input_histories_produce_changed_forecasts() -> None:
    dates = _make_dates(80)
    low_units = [5 + (i % 7) for i in range(80)]
    high_units = [50 + (i % 7) * 5 for i in range(80)]

    res_low = evaluate_and_forecast_sku(dates, low_units)
    res_high = evaluate_and_forecast_sku(dates, high_units)

    low_sum = sum(pt.units for pt in res_low.forecast)
    high_sum = sum(pt.units for pt in res_high.forecast)
    assert high_sum > low_sum * 5


def test_baseline_only_for_14_to_59_days_and_insufficient_under_14() -> None:
    dates_30 = _make_dates(30)
    units_30 = [10 + (i % 7) for i in range(30)]
    res_30 = evaluate_and_forecast_sku(dates_30, units_30)
    assert res_30.status == "baseline_only"
    assert res_30.chosen_method == "seasonal_naive"
    assert res_30.validation is None
    assert len(res_30.forecast) == 14
    assert res_30.forecast[0].date == (dates_30[-1] + dt.timedelta(days=1)).isoformat()

    dates_10 = _make_dates(10)
    units_10 = [10 for _ in range(10)]
    res_10 = evaluate_and_forecast_sku(dates_10, units_10)
    assert res_10.status == "insufficient_history"
    assert res_10.chosen_method is None
    assert res_10.validation is None
    assert res_10.forecast == []
