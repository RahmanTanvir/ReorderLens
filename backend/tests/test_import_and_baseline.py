from __future__ import annotations

import datetime as dt
from pathlib import Path

from fastapi.testclient import TestClient

from app import app
from csv_processing import MAX_FILE_BYTES

client = TestClient(app)


def _make_csv_bytes(rows: list[str], header: str = "date,product_id,product_name,quantity_sold") -> bytes:
    lines = [header, *rows]
    return ("\n".join(lines) + "\n").encode("utf-8")


def test_generated_demo_sales_csv_valid_and_analyzes() -> None:
    repo_root = Path(__file__).resolve().parent.parent.parent
    demo_csv_path = repo_root / "web" / "public" / "demo-sales.csv"
    assert demo_csv_path.exists(), "demo-sales.csv must exist in web/public/"

    raw_bytes = demo_csv_path.read_bytes()
    assert len(raw_bytes) <= MAX_FILE_BYTES

    response = client.post(
        "/v1/analyze",
        files={"file": ("demo-sales.csv", raw_bytes, "text/csv")},
    )
    assert response.status_code == 200
    data = response.json()

    assert data["data_kind"] == "user_upload"
    assert data["summary"]["input_rows"] == 360
    assert data["summary"]["accepted_rows"] == 360
    assert data["summary"]["aggregated_daily_rows"] == 360
    assert data["summary"]["products_total"] == 3
    assert data["summary"]["products_with_forecast"] == 3
    assert data["product_errors"] == []

    for prod in data["products"]:
        assert prod["status"] == "evaluated"
        assert prod["chosen_method"] in ("ridge", "seasonal_naive")
        assert prod["validation"] is not None
        assert prod["validation"]["window_days"] == 14
        assert prod["validation"]["ridge_mae"] >= 0.0
        assert prod["validation"]["seasonal_naive_mae"] >= 0.0
        if prod["chosen_method"] == "ridge":
            assert prod["validation"]["selected_method_mae"] == prod["validation"]["ridge_mae"]
        else:
            assert prod["validation"]["selected_method_mae"] == prod["validation"]["seasonal_naive_mae"]
        assert len(prod["history"]) == 120
        assert len(prod["forecast"]) == 14
        # Verify explicit 0-sales days exist in history
        assert any(pt["units"] == 0 for pt in prod["history"])
        # Verify 14 forecast dates are contiguous after 2026-10-26
        assert prod["forecast"][0]["date"] == "2026-10-27"
        assert prod["forecast"][-1]["date"] == "2026-11-09"
        for fpt in prod["forecast"]:
            assert fpt["units"] >= 0


def test_duplicate_same_day_transactions_aggregated_and_disclosed() -> None:
    start = dt.date(2026, 10, 1)
    rows: list[str] = []
    for i in range(14):
        d = (start + dt.timedelta(days=i)).isoformat()
        rows.append(f"{d},sku-1,Test Product,5")
    # Add two extra same-day transactions on 2026-10-01 and one zero transaction on 2026-10-02
    rows.append("2026-10-01,sku-1,Test Product,3")
    rows.append("2026-10-01,sku-1,Test Product,2")
    rows.append("2026-10-02,sku-1,Test Product,0")

    resp = client.post(
        "/v1/analyze",
        files={"file": ("dup.csv", _make_csv_bytes(rows), "text/csv")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["summary"]["input_rows"] == 17
    assert body["summary"]["accepted_rows"] == 17
    assert body["summary"]["aggregated_daily_rows"] == 14
    assert any("Aggregated 3 duplicate" in w for w in body["summary"]["warnings"])

    prod = body["products"][0]
    assert prod["history"][0] == {"date": "2026-10-01", "units": 10}
    assert prod["history"][1] == {"date": "2026-10-02", "units": 5}
    assert any("Aggregated 3 duplicate" in n for n in prod["notes"])


def test_missing_date_does_not_fill_zero_and_flags_data_gaps() -> None:
    # Single SKU with a missing day (2026-10-05 omitted) -> 422 DATA_GAPS
    start = dt.date(2026, 10, 1)
    rows = [
        f"{(start + dt.timedelta(days=i)).isoformat()},sku-gap,Gap Product,4"
        for i in range(20)
        if i != 4
    ]
    resp = client.post(
        "/v1/analyze",
        files={"file": ("gap.csv", _make_csv_bytes(rows), "text/csv")},
    )
    assert resp.status_code == 422
    err = resp.json()["error"]
    assert err["code"] == "DATA_GAPS"
    assert "2026-10-05" in err["details"][0]


def test_multi_sku_partial_data_gaps_returns_valid_sku_and_product_error() -> None:
    start = dt.date(2026, 10, 1)
    rows: list[str] = []
    # Valid SKU (14 consecutive days)
    for i in range(14):
        d = (start + dt.timedelta(days=i)).isoformat()
        rows.append(f"{d},sku-ok,Valid Product,{i % 7}")
    # Gapped SKU (missing day index 3)
    for i in range(14):
        if i == 3:
            continue
        d = (start + dt.timedelta(days=i)).isoformat()
        rows.append(f"{d},sku-bad,Gapped Product,5")

    resp = client.post(
        "/v1/analyze",
        files={"file": ("mixed.csv", _make_csv_bytes(rows), "text/csv")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["summary"]["products_total"] == 2
    assert body["summary"]["products_with_forecast"] == 1
    assert len(body["products"]) == 1
    assert body["products"][0]["product_id"] == "sku-ok"
    assert len(body["product_errors"]) == 1
    assert body["product_errors"][0]["product_id"] == "sku-bad"
    assert body["product_errors"][0]["code"] == "DATA_GAPS"


def test_insufficient_history_under_14_days() -> None:
    start = dt.date(2026, 10, 1)
    rows = [
        f"{(start + dt.timedelta(days=i)).isoformat()},sku-short,Short SKU,7"
        for i in range(10)
    ]
    resp = client.post(
        "/v1/analyze",
        files={"file": ("short.csv", _make_csv_bytes(rows), "text/csv")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["summary"]["products_total"] == 1
    assert body["summary"]["products_with_forecast"] == 0
    prod = body["products"][0]
    assert prod["status"] == "insufficient_history"
    assert prod["chosen_method"] is None
    assert prod["validation"] is None
    assert prod["forecast"] == []
    assert len(prod["history"]) == 10


def test_history_over_180_days_truncated_to_most_recent_180() -> None:
    start = dt.date(2026, 1, 1)
    rows = [
        f"{(start + dt.timedelta(days=i)).isoformat()},sku-long,Long SKU,{i % 5}"
        for i in range(200)
    ]
    resp = client.post(
        "/v1/analyze",
        files={"file": ("long.csv", _make_csv_bytes(rows), "text/csv")},
    )
    assert resp.status_code == 200
    body = resp.json()
    prod = body["products"][0]
    assert len(prod["history"]) == 180
    # 200 days starting 2026-01-01 -> first 20 truncated, starts at day index 20 (2026-01-21)
    assert prod["history"][0]["date"] == "2026-01-21"
    assert any("truncated 20 older" in w for w in body["summary"]["warnings"])


def test_invalid_schema_and_malformed_csv_rejected() -> None:
    # Missing required column quantity_sold
    bad_header = b"date,product_id,product_name\n2026-10-01,a,Prod A\n"
    r1 = client.post("/v1/analyze", files={"file": ("bad.csv", bad_header, "text/csv")})
    assert r1.status_code == 400
    assert r1.json()["error"]["code"] == "INVALID_SCHEMA"

    # Invalid UTF-8 bytes
    bad_utf8 = b"\xff\xfe\x00\x00invalid"
    r2 = client.post("/v1/analyze", files={"file": ("bad.csv", bad_utf8, "text/csv")})
    assert r2.status_code == 400
    assert r2.json()["error"]["code"] == "INVALID_CSV"


def test_invalid_dates_quantities_and_name_conflicts_rejected() -> None:
    # Malformed date
    r_date = client.post(
        "/v1/analyze",
        files={"file": ("d.csv", _make_csv_bytes(["10/01/2026,sku-1,Prod,5"]), "text/csv")},
    )
    assert r_date.status_code == 422
    assert r_date.json()["error"]["code"] == "INVALID_VALUES"

    # Negative quantity
    r_neg = client.post(
        "/v1/analyze",
        files={"file": ("n.csv", _make_csv_bytes(["2026-10-01,sku-1,Prod,-3"]), "text/csv")},
    )
    assert r_neg.status_code == 422
    assert r_neg.json()["error"]["code"] == "INVALID_VALUES"

    # Fractional quantity
    r_flt = client.post(
        "/v1/analyze",
        files={"file": ("f.csv", _make_csv_bytes(["2026-10-01,sku-1,Prod,4.5"]), "text/csv")},
    )
    assert r_flt.status_code == 422
    assert r_flt.json()["error"]["code"] == "INVALID_VALUES"

    # Conflicting product_name for same product_id
    r_conflict = client.post(
        "/v1/analyze",
        files={
            "file": (
                "c.csv",
                _make_csv_bytes(
                    [
                        "2026-10-01,sku-1,Name One,5",
                        "2026-10-02,sku-1,Name Two,6",
                    ]
                ),
                "text/csv",
            )
        },
    )
    assert r_conflict.status_code == 422
    assert r_conflict.json()["error"]["code"] == "INVALID_VALUES"


def test_limits_file_size_row_count_and_sku_count() -> None:
    # > 1 MB file
    huge_bytes = b"date,product_id,product_name,quantity_sold\n" + (b"2026-10-01,a,b,1\n" * 65000)
    assert len(huge_bytes) > MAX_FILE_BYTES
    r_size = client.post("/v1/analyze", files={"file": ("huge.csv", huge_bytes, "text/csv")})
    assert r_size.status_code == 413
    assert r_size.json()["error"]["code"] == "FILE_TOO_LARGE"

    # > 2000 rows (under 1 MB)
    start = dt.date(2020, 1, 1)
    many_rows = [
        f"{(start + dt.timedelta(days=i)).isoformat()},sku-1,Prod,1"
        for i in range(2001)
    ]
    r_rows = client.post(
        "/v1/analyze",
        files={"file": ("rows.csv", _make_csv_bytes(many_rows), "text/csv")},
    )
    assert r_rows.status_code == 413
    assert r_rows.json()["error"]["code"] == "TOO_MANY_ROWS"

    # > 10 SKUs
    sku_rows = [f"2026-10-01,sku-{i},Prod {i},5" for i in range(11)]
    r_skus = client.post(
        "/v1/analyze",
        files={"file": ("skus.csv", _make_csv_bytes(sku_rows), "text/csv")},
    )
    assert r_skus.status_code == 422
    assert r_skus.json()["error"]["code"] == "INVALID_VALUES"
