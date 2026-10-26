# 04 — Data ingestion, genuine forecasting and inventory math

## Input contract and confidentiality
CSV UTF-8 header, exact field names: `date,product_id,product_name,quantity_sold`. No customer IDs, names, payment data, secrets or sensitive fields. Accepted date format ISO `YYYY-MM-DD`; integer nonnegative `quantity_sold` ≤100000; product IDs/names trimmed and length-limited; ≤1 MB encoded file, ≤2,000 data rows, ≤10 unique product IDs; demo spans 120 daily records per SKU; max 180 calendar days per SKU used in model (if more supplied within row limit, take most recent 180 and disclose).

**Critical time-series subtlety:** A missing date may mean **closed store, missing export, or genuinely zero sales**. Never assume zero silently. For tonight require *dense daily records for every calendar date in each SKU's min–max range, including an explicit row with 0 if no sales*. Multiple transactions for an identical SKU/date are summed, with a visible “aggregated transactions” note. A missing day triggers `DATA_GAPS` for that SKU and inhibits its forecast; other valid SKUs may still be analyzed with per-SKU errors. Do not reject empty rows without counting/reporting them. Product name must be consistent per product ID (or reject conflict).

If no products can be forecast, return 422 with an actionable error. Distinguish malformed CSV (400), size (413), and valid syntax but unusable data (422). The importer displays accepted and rejected products and row counts. For a static historical demo fixture, “future forecast” means the days following that file’s latest observed date, even if the current calendar date has since moved on; visibly label the fixture date range. No hidden demo path bypasses validation.

## Illustrative demo dataset — not actual retail evidence
Generate deterministic seeded sample **using an implementation script**, e.g., three SKU labels (`rice-1kg`, `soap-100g`, `tea-250g`) over 120 consecutive calendar days ending at a fixed date on/before 2026-10-26. Give varying plausible patterns (weekday, trend, noise), clamp sales to nonnegative integers and generate an explicit zero row for every zero-sales day. **Do not fabricate real partner store records**. UI must label it “Illustrative synthetic demo data — not real retailer records”. Store small static `web/public/demo-sales.csv`, with an adjacent README/disclosure. Run the generated CSV through same real API as user uploads; no hardcoded forecast path.

## Forecast implementation specification
Goal: produce a real 14-day **point forecast per SKU** using time-ordered evaluation. Keep deterministic and interpretable, not chase best ML score.

1. Parse/aggregate daily SKU series in ascending dates; detect gaps. No look-ahead when creating training features.
2. For ≥60 **consecutive** daily observations per SKU, reserve the **last 14 days** for chronological **validation**. All rows before that form the training period. Each supervised training example can use only values from days strictly before its own prediction target. Candidate `Ridge` with a `StandardScaler` (fit on training inputs only), using yesterday demand (lag 1), same-weekday previous demand (lag 7), previous 7-day mean, previous 14-day mean, and weekday represented numerically or one-hot.
3. Use an honest *recursive* 14-day validation forecast from the cutoff for Ridge; forecast inputs after day 1 use previous predicted sales **not the withheld actual future sales**. Clip output to finite ≥0. Do not round intermediate predictions (round only presentation if desired).
4. Seasonal-naive comparison: next-day value copied from the same weekday 7 days earlier, recursively using the observed history or earlier baseline predictions, for full 14 days. The naive baseline uses no withheld future actuals. If the baseline is unsuitable on small/flat series, a 7-day historical mean can be a documented fallback, but report it by the method actually used.
5. Compute **validation MAE** for both candidate methods on the same 14 withheld dates. No random train/test shuffle, no leakage into scaler, and no interpolation of withheld values. Choose the method with lower validation MAE; ties prefer the simpler baseline. This is **model selection on validation**, not a fully independent unbiased test or real-world production accuracy claim.
6. Refit/recalculate the chosen method on **all available observed history** and predict the next 14 calendar days recursively. Return chosen method, historical demand, forecasted units/date, both validation MAEs, sample counts, and transparent notes. Ridge is genuinely trained; when naive wins, **say so**.
7. For 14–59 consecutive daily observations, provide **baseline-only** forecasts and an explicit `baseline_only` status with “not enough daily history to evaluate ML reliably”; do not report invented validation MAE. Fewer than 14 days: `insufficient_history`, no 14-day forecast; show a useful explanation.
8. Guard against constant series, all-zero series, invalid/noisy inputs, model errors, NaN, overflow, and CPU spikes. With valid but degenerate data, use labeled simple fallback and record error warning; never silently return pre-scripted values.

**Note:** This quick ML design is a **technical design choice for the approved emergency MVP**. The final model may be reconsidered after evidence. It is not guaranteed to beat the baseline. Per-SKU validation metrics are only based on the uploaded data (possibly synthetic). Report exactly what ran.

## Example derived inventory math
Inputs: `forecast` for 14 future dates, `stock_on_hand` integer ≥0, `lead_time_days` integer 1–14, optional `safety_stock_units` integer ≥0 (default 0). No pending purchase orders, reserved stock, variable lead times or backorders considered in emergency demo.

Let `D_L` be the sum of the forecasted `units` on the **first L future days** (forecast days ordered, not calendar data from the past). Then:

```
expected_lead_time_demand = sum(forecast[0:L].units)
projected_shortage_units = max(0, ceil(expected_lead_time_demand - stock_on_hand))
reorder_quantity_units  = ceil(max(0, expected_lead_time_demand + safety_stock_units - stock_on_hand))
```

For risk labels: **high** if `stock_on_hand < expected_lead_time_demand`, **medium** if `stock_on_hand < expected_lead_time_demand + safety_stock_units` (but not high), else **low**. For safety stock=0, medium often does not occur — acceptable. Explain that "high" means projected deficit **based on point estimate**, not measured chance/probability of stockout. Negative quantities prohibited; finite checks mandatory.

Simple worked example: demand estimated 10/day × lead time 5 days = 50, stock 30, safety stock 10; projected shortage 20, reorder recommendation 30. This is illustrative arithmetic, **not validated commercial impact**.

## Known scientific limitations
- Sales histories are **censored demand** when the product previously stocked out; the model cannot recover lost demand without availability records.
- Promotions, holidays, store closure, extreme seasonality, supplier delays, purchase orders and stock adjustments are not modeled in MVP.
- A short synthetic time series cannot prove performance on Bangladeshi retailers. Display uncertainty/limitations in plain English; do not invent confidence intervals.
- Model fit should be computationally bounded, with outcome determined by observed dataset and model comparison; never preselect Ridge only to market as AI superiority.

## Testing requirements
- Deterministic synthetic dataset with seed; true historical input changes alter forecasts on reasonable test cases.
- Validation cutoff excludes future information. Fit transforms only to train. Recursive predictions use predicted, not withheld actuals.
- Seasonal naive expected results on repeating weekly fixture.
- Deterministic inventory unit tests for high/medium/low, 0 stock, 0/positive safety and 1/14 lead time, negative/NaN/oversized rejected.
- Missing date input does not silently become zero; malformed and sparse series produce explicit warning/errors.
- For small data, label fallback visibly; no fake "95% accurate" percentage.
