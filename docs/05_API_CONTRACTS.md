# 05 — Authoritative API contracts (MVP v1)

Backend: FastAPI `app`, directly `/health`, `/v1/analyze`, `/v1/recommendations` at its Vercel origin. Frontend calls same-origin proxy `/backend/...`. Use exact schema on both ends, Pydantic response models and typed TypeScript interfaces. If the implementation needs a change, edit **this file and tests first** and report it.

## GET `/health`

HTTP 200 JSON:
```json
{"status":"ok","service":"reorderlens-api","version":"mvp-1"}
```
No user data or secrets.

## POST `/v1/analyze`

`Content-Type: multipart/form-data`; field `file`: UTF-8 `.csv`, **≤1 MB**; no other required params. Decline oversized files before fully processing if feasible; stream-read with upper bound. The API must not persist uploads.

**Example minimal CSV (only for schema illustration; not enough records for fitting):**
```csv
date,product_id,product_name,quantity_sold
2026-10-01,sku-a,Example Product A,5
2026-10-02,sku-a,Example Product A,0
2026-10-03,sku-a,Example Product A,8
```

HTTP 200 response schema illustration (numbers are **illustrative**, actual returned values must be calculated):

```json
{
  "data_kind": "user_upload",
  "summary": {
    "input_rows": 120,
    "accepted_rows": 120,
    "aggregated_daily_rows": 120,
    "products_total": 1,
    "products_with_forecast": 1,
    "warnings": []
  },
  "products": [{
    "product_id": "sku-a",
    "product_name": "Example Product A",
    "status": "evaluated",
    "history": [{"date":"2026-06-01","units":5}],
    "forecast": [{"date":"2026-10-27","units":7.3}],
    "chosen_method": "ridge",
    "validation": {
      "window_days": 14,
      "ridge_mae": 2.6,
      "seasonal_naive_mae": 3.2,
      "selected_method_mae": 2.6
    },
    "notes": ["14-day recursive validation on uploaded series."]
  }],
  "product_errors": []
}
```

**Contract invariants:**
- `products[].history` includes actual daily data (≤180 most recent daily points); `forecast` exactly 14 future consecutive dated points when forecast available; dates ISO, amounts finite nonnegative.
- `data_kind`: backend defaults to `"user_upload"` (it cannot verify provenance). **Frontend must set a separate presentation flag** to `"synthetic_demo"` when its built-in fixture is loaded, and **never** imply the server independently verified provenance. Never let uploaded data silently acquire synthetic label from filename alone.
- `status`: `evaluated`, `baseline_only`, or `insufficient_history`.
- `chosen_method`: `ridge`, `seasonal_naive`, or `null`.
- `validation`: object with MAEs only for `evaluated`; otherwise `null`. `selected_method_mae` equals one of the measured MAEs, not a guessed score.
- For data gaps: return warnings or `product_errors` with IDs and codes; omit forecast for affected SKU. For truly invalid global input return 422.
- `products_with_forecast` counts products whose `forecast` is non-empty. The example above is *illustrative* and abridged; actual response must include 14 forecast dates and full daily history, not just one point.
- `data_kind` for built-in fixture should remain `user_upload` at API level; UI's synthetic-demo label is authoritative for provenance of the static fixture.

## POST `/v1/recommendations`

`Content-Type: application/json`. This endpoint does **not** accept raw sales, refit models, or persist inventory. Client sends forecasts from current analysis with user inputs. Example:

```json
{
  "items": [
    {
      "product_id": "sku-a",
      "stock_on_hand": 30,
      "lead_time_days": 5,
      "safety_stock_units": 10,
      "forecast": [
        {"date":"2026-10-27","units":10},
        {"date":"2026-10-28","units":10},
        {"date":"2026-10-29","units":10},
        {"date":"2026-10-30","units":10},
        {"date":"2026-10-31","units":10},
        {"date":"2026-11-01","units":10},
        {"date":"2026-11-02","units":10},
        {"date":"2026-11-03","units":10},
        {"date":"2026-11-04","units":10},
        {"date":"2026-11-05","units":10},
        {"date":"2026-11-06","units":10},
        {"date":"2026-11-07","units":10},
        {"date":"2026-11-08","units":10},
        {"date":"2026-11-09","units":10}
      ]
    }
  ]
}
```

Response HTTP 200:

```json
{
  "items": [{
    "product_id": "sku-a",
    "expected_lead_time_demand": 50,
    "projected_shortage_units": 20,
    "reorder_quantity_units": 30,
    "risk_level": "high",
    "explanation": "Estimated demand for 5 days: 50 units. Current stock: 30. Safety stock: 10. Suggested reorder: 30 units. This is an estimate, not an automatic purchase."
  }]
}
```

Pydantic validation: exactly **14 contiguous forecast dates** sorted by date (future relative to the uploaded history, not necessarily future relative to today for dated demo fixtures); zero or more `items` limited to 10 (empty rejected); product IDs nonempty/length-limited; finite units ≥0 and reasonably bounded; integers for inventory/lead/safety; `lead_time_days` 1–14; stock/safety 0–1,000,000. Reject non-finite floats and stale/duplicate forecast date sequences. **No authentication** in demo: public API is not appropriate for confidential retailer data. Sample fixture only for public demonstration.

## Errors

Return consistent JSON for browser errors, for example:

```json
{
  "error": {
    "code": "INVALID_SCHEMA",
    "message": "Required column quantity_sold is missing.",
    "details": ["Expected: date,product_id,product_name,quantity_sold"]
  }
}
```

| Status | Code examples | Meaning |
|---|---|---|
| 400 | `INVALID_CSV`, `INVALID_SCHEMA` | Unreadable format/header |
| 413 | `FILE_TOO_LARGE`, `TOO_MANY_ROWS` | Bounded upload/data limit |
| 422 | `INVALID_VALUES`, `DATA_GAPS`, `NO_USABLE_HISTORY`, `INVALID_FORECAST_INPUT` | Data syntactically valid but unusable or settings invalid |
| 429 | `RATE_LIMITED` | Only if actually configured; don't invent a working limiter |
| 500 | `INTERNAL_ERROR` | No stack trace, secrets or raw CSV exposed |

Framework-generated 422 validation details may be transformed by an exception handler to the common shape. When multiple products are uploaded and only some are invalid, HTTP 200 can return usable products plus `product_errors` for rejected SKU series.

## Example frontend semantics
- `fetch('/backend/v1/analyze', { method:'POST', body: FormData })` — don't manually set multipart `Content-Type`, browser sets boundary.
- `fetch('/backend/v1/recommendations', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })`.
- Frontend must not invent missing product forecasts or hardcode derived KPIs; display returned values verbatim with formatting.
- API JSON responses should not include personally identifying information or unbounded raw error data.
