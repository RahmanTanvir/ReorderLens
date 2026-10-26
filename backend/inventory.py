from __future__ import annotations

import datetime as dt
import math
from typing import Any

from models import (
    ApiError,
    RecommendationResponse,
    RecommendationResponseItem,
    RiskLevel,
)

MAX_RECOMMENDATION_ITEMS = 10
REQUIRED_FORECAST_DAYS = 14
MIN_LEAD_TIME_DAYS = 1
MAX_LEAD_TIME_DAYS = 14
MAX_INVENTORY_UNITS = 1_000_000
MAX_FORECAST_DAILY_UNITS = 1_000_000
MAX_PRODUCT_ID_LEN = 64


def _validate_strict_int(val: Any, field_name: str, item_idx: int) -> int:
    if isinstance(val, bool) or val is None:
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message=f"Item {item_idx}: '{field_name}' must be an integer.",
            details=[f"Item {item_idx}: Invalid type for '{field_name}'."],
        )
    if isinstance(val, int):
        return val
    if isinstance(val, float):
        if not math.isfinite(val) or not val.is_integer():
            raise ApiError(
                status_code=422,
                code="INVALID_FORECAST_INPUT",
                message=f"Item {item_idx}: '{field_name}' must be a whole integer, got {val}.",
                details=[f"Item {item_idx}: Fractional or non-finite values are not allowed for '{field_name}'."],
            )
        return int(val)
    raise ApiError(
        status_code=422,
        code="INVALID_FORECAST_INPUT",
        message=f"Item {item_idx}: '{field_name}' must be an integer.",
        details=[f"Item {item_idx}: Expected integer for '{field_name}'."],
    )


def _validate_iso_date(raw_date: Any, item_idx: int, day_idx: int) -> dt.date:
    if not isinstance(raw_date, str) or len(raw_date) != 10:
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message=f"Item {item_idx}, forecast[{day_idx}]: Date must be ISO YYYY-MM-DD.",
            details=[f"Expected 10-character YYYY-MM-DD date string."],
        )
    try:
        return dt.date.fromisoformat(raw_date)
    except ValueError as exc:
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message=f"Item {item_idx}, forecast[{day_idx}]: Invalid calendar date '{raw_date}'.",
            details=[str(exc)],
        ) from exc


def _validate_forecast_units(raw_units: Any, item_idx: int, day_idx: int) -> float:
    if isinstance(raw_units, bool) or not isinstance(raw_units, (int, float)):
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message=f"Item {item_idx}, forecast[{day_idx}]: 'units' must be a finite nonnegative number.",
            details=["Forecast units must be numeric."],
        )
    val = float(raw_units)
    if not math.isfinite(val) or val < 0.0 or val > MAX_FORECAST_DAILY_UNITS:
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message=(
                f"Item {item_idx}, forecast[{day_idx}]: 'units' must be finite and between 0 and {MAX_FORECAST_DAILY_UNITS}."
            ),
            details=[f"Received invalid forecast units value: {raw_units}."],
        )
    return val


def compute_recommendations_from_payload(payload: dict[str, Any]) -> RecommendationResponse:
    if not isinstance(payload, dict) or "items" not in payload:
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message="Request JSON must be an object containing an 'items' list.",
            details=["Expected shape: {\"items\": [...]}"],
        )

    raw_items = payload.get("items")
    if not isinstance(raw_items, list) or len(raw_items) == 0:
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message="Request 'items' must be a non-empty list of SKU recommendation inputs.",
            details=["Provide between 1 and 10 items."],
        )

    if len(raw_items) > MAX_RECOMMENDATION_ITEMS:
        raise ApiError(
            status_code=422,
            code="INVALID_FORECAST_INPUT",
            message=f"Request exceeds maximum of {MAX_RECOMMENDATION_ITEMS} items per call.",
            details=[f"Submitted {len(raw_items)} items; maximum allowed is {MAX_RECOMMENDATION_ITEMS}."],
        )

    results: list[RecommendationResponseItem] = []

    for idx, item in enumerate(raw_items):
        if not isinstance(item, dict):
            raise ApiError(
                status_code=422,
                code="INVALID_FORECAST_INPUT",
                message=f"Item {idx}: Each entry in 'items' must be a JSON object.",
                details=[],
            )

        raw_pid = item.get("product_id")
        if not isinstance(raw_pid, str) or not raw_pid.strip() or len(raw_pid.strip()) > MAX_PRODUCT_ID_LEN:
            raise ApiError(
                status_code=422,
                code="INVALID_FORECAST_INPUT",
                message=f"Item {idx}: 'product_id' must be a non-empty string (1–{MAX_PRODUCT_ID_LEN} chars).",
                details=[],
            )
        product_id = raw_pid.strip()

        stock_on_hand = _validate_strict_int(item.get("stock_on_hand"), "stock_on_hand", idx)
        if stock_on_hand < 0 or stock_on_hand > MAX_INVENTORY_UNITS:
            raise ApiError(
                status_code=422,
                code="INVALID_FORECAST_INPUT",
                message=f"Item {idx} ({product_id}): 'stock_on_hand' must be between 0 and {MAX_INVENTORY_UNITS}.",
                details=[f"stock_on_hand={stock_on_hand} is out of bounds."],
            )

        lead_time_days = _validate_strict_int(item.get("lead_time_days"), "lead_time_days", idx)
        if lead_time_days < MIN_LEAD_TIME_DAYS or lead_time_days > MAX_LEAD_TIME_DAYS:
            raise ApiError(
                status_code=422,
                code="INVALID_FORECAST_INPUT",
                message=(
                    f"Item {idx} ({product_id}): 'lead_time_days' must be between "
                    f"{MIN_LEAD_TIME_DAYS} and {MAX_LEAD_TIME_DAYS} days for the 14-day forecast horizon."
                ),
                details=[f"lead_time_days={lead_time_days} is outside supported range 1..14."],
            )

        raw_safety = item.get("safety_stock_units", 0)
        safety_stock_units = _validate_strict_int(raw_safety, "safety_stock_units", idx)
        if safety_stock_units < 0 or safety_stock_units > MAX_INVENTORY_UNITS:
            raise ApiError(
                status_code=422,
                code="INVALID_FORECAST_INPUT",
                message=f"Item {idx} ({product_id}): 'safety_stock_units' must be between 0 and {MAX_INVENTORY_UNITS}.",
                details=[f"safety_stock_units={safety_stock_units} is out of bounds."],
            )

        raw_forecast = item.get("forecast")
        if not isinstance(raw_forecast, list) or len(raw_forecast) != REQUIRED_FORECAST_DAYS:
            raise ApiError(
                status_code=422,
                code="INVALID_FORECAST_INPUT",
                message=(
                    f"Item {idx} ({product_id}): 'forecast' must contain exactly {REQUIRED_FORECAST_DAYS} daily points."
                ),
                details=[
                    f"Expected {REQUIRED_FORECAST_DAYS} consecutive forecast dates; received "
                    f"{len(raw_forecast) if isinstance(raw_forecast, list) else 'non-list'}."
                ],
            )

        parsed_dates: list[dt.date] = []
        parsed_units: list[float] = []

        for d_idx, pt in enumerate(raw_forecast):
            if not isinstance(pt, dict):
                raise ApiError(
                    status_code=422,
                    code="INVALID_FORECAST_INPUT",
                    message=f"Item {idx} ({product_id}), forecast[{d_idx}]: Must be an object with 'date' and 'units'.",
                    details=[],
                )
            d_val = _validate_iso_date(pt.get("date"), idx, d_idx)
            u_val = _validate_forecast_units(pt.get("units"), idx, d_idx)
            if d_idx > 0:
                expected_date = parsed_dates[-1] + dt.timedelta(days=1)
                if d_val != expected_date:
                    raise ApiError(
                        status_code=422,
                        code="INVALID_FORECAST_INPUT",
                        message=(
                            f"Item {idx} ({product_id}): Forecast dates must be strictly consecutive ascending days. "
                            f"Expected {expected_date.isoformat()} at index {d_idx}, got {d_val.isoformat()}."
                        ),
                        details=["Ensure all 14 forecast dates are contiguous and sorted."],
                    )
            parsed_dates.append(d_val)
            parsed_units.append(u_val)

        # Deterministic inventory arithmetic over the first L forecast days
        lead_slice = parsed_units[:lead_time_days]
        lead_demand_exact = round(sum(lead_slice), 6)
        lead_demand_display = round(lead_demand_exact, 2)
        expected_lead_time_demand: int | float = (
            int(lead_demand_display)
            if lead_demand_display.is_integer()
            else lead_demand_display
        )

        projected_shortage_units = max(
            0, int(math.ceil(round(lead_demand_exact - float(stock_on_hand), 6)))
        )
        reorder_quantity_units = int(
            math.ceil(
                max(
                    0.0,
                    round(
                        lead_demand_exact + float(safety_stock_units) - float(stock_on_hand),
                        6,
                    ),
                )
            )
        )

        if float(stock_on_hand) < lead_demand_exact - 1e-9:
            risk_level: RiskLevel = "high"
        elif float(stock_on_hand) < lead_demand_exact + float(safety_stock_units) - 1e-9:
            risk_level = "medium"
        else:
            risk_level = "low"

        horizon_start = parsed_dates[0].isoformat()
        horizon_end = parsed_dates[lead_time_days - 1].isoformat()
        day_word = "day" if lead_time_days == 1 else "days"

        explanation = (
            f"Estimated demand for {lead_time_days} {day_word} ({horizon_start} to {horizon_end}): "
            f"{expected_lead_time_demand} units. Current stock: {stock_on_hand}. "
            f"Safety stock: {safety_stock_units}. Projected shortage: {projected_shortage_units} units. "
            f"Suggested reorder: {reorder_quantity_units} units. "
            f"This is a deterministic scenario estimate from the point forecast, not a calibrated stockout probability or an automatic purchase."
        )

        results.append(
            RecommendationResponseItem(
                product_id=product_id,
                expected_lead_time_demand=expected_lead_time_demand,
                projected_shortage_units=projected_shortage_units,
                reorder_quantity_units=reorder_quantity_units,
                risk_level=risk_level,
                explanation=explanation,
            )
        )

    return RecommendationResponse(items=results)
