# 04 — Milestone 4: forecast-driven inventory intelligence

```text
Implement ReorderLens AI Milestone 04. Read AGENTS.md, docs/02_SCOPE_AND_UX.md, docs/04_DATA_AND_AI.md, docs/05_API_CONTRACTS.md and docs/06_TESTING_AND_ACCEPTANCE.md; inspect current backend and existing tests. Do not rework forecast training. Add deterministic inventory service and editable UI only.

Backend POST /v1/recommendations, stateless JSON input exactly per docs/05_API_CONTRACTS.md. For each item check 14 consecutive future forecast dates with finite nonnegative forecast units, max 10 items, stock_on_hand integer >=0, safety_stock_units integer >=0 default 0, lead_time_days integer 1..14. Compute:
  lead_demand = sum(first L forecast units)
  shortage = max(0, ceil(lead_demand - stock))
  reorder = ceil(max(0, lead_demand + safety_stock - stock))
  risk = high if stock < lead_demand, medium if stock < lead_demand+safety, else low
Return exact expected_lead_time_demand, projected_shortage_units, reorder_quantity_units, risk_level and data-bound arithmetic explanation. This is a point-forecast scenario, NOT a true stockout probability. Never auto place orders, call an LLM to do numeric math, or persist settings.

Frontend /recommendations must use forecasts from actual /v1/analyze shared state; provide SKU picker, numeric stock, 1..14 lead days, safety stock=0 default, calculate/recalculate button, loading and API error states, risk text, exact arithmetic breakdown. Changing stock or lead days must call recommendation endpoint and visibly alter the result, without retraining forecasts. If data absent, guide user to /import; if SKU has no valid forecast, explain why.

Write actual pytest arithmetic cases: 10/day x5 stock30 safety10 ⇒ demand50, shortage20, reorder30; stock65 ⇒ reorder0; lead time1 vs14; 0 stock; medium risk with safety; rejects negatives/NaNs/too many items/noncontiguous dates/out-of-horizon. Run integration test using forecast output from real sample analysis as recommendation input; run frontend lint/types/build. Update docs/DEVELOPMENT_LOG.md, describe what was tested and stop for human review.
```

## M4 acceptance
Demonstrated working import→forecast→reorder connection with editable numbers; recommendation engine uses real API response, no hardcoded card values; invalid settings explicitly rejected; no autonomous purchase button.
