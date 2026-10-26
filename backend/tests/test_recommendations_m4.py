from __future__ import annotations

import datetime as dt
from pathlib import Path

from fastapi.testclient import TestClient

from app import app
from inventory import compute_recommendations_from_payload
from models import ApiError

client = TestClient(app)


def _make_14_day_forecast(
    daily_units: float | int = 10,
    start: dt.date = dt.date(2026, 10, 27),
) -> list[dict[str, object]]:
    return [
        {
            "date": (start + dt.timedelta(days=i)).isoformat(),
            "units": daily_units,
        }
        for i in range(14)
    ]


def test_worked_example_10_per_day_lead5_stock30_safety10() -> None:
    payload = {
        "items": [
            {
                "product_id": "sku-a",
                "stock_on_hand": 30,
                "lead_time_days": 5,
                "safety_stock_units": 10,
                "forecast": _make_14_day_forecast(10),
            }
        ]
    }
    resp = client.post("/v1/recommendations", json=payload)
    assert resp.status_code == 200
    item = resp.json()["items"][0]
    assert item["product_id"] == "sku-a"
    assert item["expected_lead_time_demand"] == 50
    assert item["projected_shortage_units"] == 20
    assert item["reorder_quantity_units"] == 30
    assert item["risk_level"] == "high"
    assert "50 units" in item["explanation"]
    assert "30 units" in item["explanation"]


def test_overstock_stock65_produces_zero_reorder_and_low_risk() -> None:
    payload = {
        "items": [
            {
                "product_id": "sku-a",
                "stock_on_hand": 65,
                "lead_time_days": 5,
                "safety_stock_units": 10,
                "forecast": _make_14_day_forecast(10),
            }
        ]
    }
    resp = client.post("/v1/recommendations", json=payload)
    assert resp.status_code == 200
    item = resp.json()["items"][0]
    assert item["expected_lead_time_demand"] == 50
    assert item["projected_shortage_units"] == 0
    assert item["reorder_quantity_units"] == 0
    assert item["risk_level"] == "low"


def test_medium_risk_with_safety_stock_and_zero_stock_cases() -> None:
    # Demand = 50, stock = 55, safety = 10 -> no shortage (<50 is false), but below 50+10=60 -> medium risk, reorder 5
    payload_med = {
        "items": [
            {
                "product_id": "sku-med",
                "stock_on_hand": 55,
                "lead_time_days": 5,
                "safety_stock_units": 10,
                "forecast": _make_14_day_forecast(10),
            },
            {
                "product_id": "sku-zero-stock",
                "stock_on_hand": 0,
                "lead_time_days": 3,
                "safety_stock_units": 0,
                "forecast": _make_14_day_forecast(7.2),
            },
        ]
    }
    resp = client.post("/v1/recommendations", json=payload_med)
    assert resp.status_code == 200
    items = resp.json()["items"]

    assert items[0]["risk_level"] == "medium"
    assert items[0]["projected_shortage_units"] == 0
    assert items[0]["reorder_quantity_units"] == 5

    # 3 * 7.2 = 21.6 -> ceil(21.6) = 22
    assert items[1]["expected_lead_time_demand"] == 21.6
    assert items[1]["projected_shortage_units"] == 22
    assert items[1]["reorder_quantity_units"] == 22
    assert items[1]["risk_level"] == "high"


def test_lead_time_1_vs_14_alters_demand_and_reorder() -> None:
    fc = _make_14_day_forecast(8)
    r1 = client.post(
        "/v1/recommendations",
        json={
            "items": [
                {
                    "product_id": "sku-1",
                    "stock_on_hand": 10,
                    "lead_time_days": 1,
                    "safety_stock_units": 0,
                    "forecast": fc,
                }
            ]
        },
    )
    r14 = client.post(
        "/v1/recommendations",
        json={
            "items": [
                {
                    "product_id": "sku-1",
                    "stock_on_hand": 10,
                    "lead_time_days": 14,
                    "safety_stock_units": 0,
                    "forecast": fc,
                }
            ]
        },
    )
    assert r1.status_code == 200 and r14.status_code == 200
    i1 = r1.json()["items"][0]
    i14 = r14.json()["items"][0]

    assert i1["expected_lead_time_demand"] == 8
    assert i1["reorder_quantity_units"] == 0
    assert i1["risk_level"] == "low"

    assert i14["expected_lead_time_demand"] == 112
    assert i14["projected_shortage_units"] == 102
    assert i14["reorder_quantity_units"] == 102
    assert i14["risk_level"] == "high"


def test_rejects_invalid_inputs_negatives_nan_lead_bounds_and_noncontiguous_dates() -> None:
    fc = _make_14_day_forecast(10)

    # Negative stock
    r_neg = client.post(
        "/v1/recommendations",
        json={"items": [{"product_id": "s", "stock_on_hand": -1, "lead_time_days": 5, "forecast": fc}]},
    )
    assert r_neg.status_code == 422
    assert r_neg.json()["error"]["code"] == "INVALID_FORECAST_INPUT"

    # Lead time 0 and 15 (outside 1..14)
    for bad_lead in (0, 15):
        r_lead = client.post(
            "/v1/recommendations",
            json={"items": [{"product_id": "s", "stock_on_hand": 10, "lead_time_days": bad_lead, "forecast": fc}]},
        )
        assert r_lead.status_code == 422
        assert r_lead.json()["error"]["code"] == "INVALID_FORECAST_INPUT"

    # > 10 items
    many_items = [
        {"product_id": f"s-{i}", "stock_on_hand": 10, "lead_time_days": 5, "forecast": fc}
        for i in range(11)
    ]
    r_many = client.post("/v1/recommendations", json={"items": many_items})
    assert r_many.status_code == 422

    # Non-contiguous dates in forecast
    bad_fc = list(fc)
    bad_fc[5] = {"date": "2026-12-01", "units": 10}
    r_dates = client.post(
        "/v1/recommendations",
        json={"items": [{"product_id": "s", "stock_on_hand": 10, "lead_time_days": 5, "forecast": bad_fc}]},
    )
    assert r_dates.status_code == 422
    assert r_dates.json()["error"]["code"] == "INVALID_FORECAST_INPUT"

    # Wrong forecast horizon length (13 days instead of 14)
    r_short = client.post(
        "/v1/recommendations",
        json={"items": [{"product_id": "s", "stock_on_hand": 10, "lead_time_days": 5, "forecast": fc[:13]}]},
    )
    assert r_short.status_code == 422

    # NaN / Infinity in forecast units via direct service call
    nan_fc = list(fc)
    nan_fc[0] = {"date": fc[0]["date"], "units": float("nan")}
    try:
        compute_recommendations_from_payload(
            {"items": [{"product_id": "s", "stock_on_hand": 10, "lead_time_days": 5, "forecast": nan_fc}]}
        )
        assert False, "Expected ApiError for NaN forecast units"
    except ApiError as exc:
        assert exc.status_code == 422
        assert exc.code == "INVALID_FORECAST_INPUT"


def test_integration_analyze_demo_csv_then_compute_recommendations() -> None:
    repo_root = Path(__file__).resolve().parent.parent.parent
    demo_bytes = (repo_root / "web" / "public" / "demo-sales.csv").read_bytes()

    analyze_res = client.post(
        "/v1/analyze",
        files={"file": ("demo-sales.csv", demo_bytes, "text/csv")},
    )
    assert analyze_res.status_code == 200
    products = analyze_res.json()["products"]
    assert len(products) == 3

    # Low stock (0) with 7-day lead time -> positive reorder for all 3 selling SKUs
    low_stock_items = [
        {
            "product_id": p["product_id"],
            "stock_on_hand": 0,
            "lead_time_days": 7,
            "safety_stock_units": 5,
            "forecast": p["forecast"],
        }
        for p in products
    ]
    rec_low = client.post("/v1/recommendations", json={"items": low_stock_items})
    assert rec_low.status_code == 200
    for item in rec_low.json()["items"]:
        assert item["expected_lead_time_demand"] > 0
        assert item["reorder_quantity_units"] > 0
        assert item["risk_level"] == "high"

    # High stock (500) -> 0 reorder and low risk
    high_stock_items = [
        {
            "product_id": p["product_id"],
            "stock_on_hand": 500,
            "lead_time_days": 7,
            "safety_stock_units": 5,
            "forecast": p["forecast"],
        }
        for p in products
    ]
    rec_high = client.post("/v1/recommendations", json={"items": high_stock_items})
    assert rec_high.status_code == 200
    for item in rec_high.json()["items"]:
        assert item["projected_shortage_units"] == 0
        assert item["reorder_quantity_units"] == 0
        assert item["risk_level"] == "low"
