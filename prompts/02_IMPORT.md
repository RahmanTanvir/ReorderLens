# 02 — Milestone 2: CSV validation, importer and genuine naive baseline

```text
Implement Milestone 02 of ReorderLens AI. Read root AGENTS.md, docs/02_SCOPE_AND_UX.md, docs/04_DATA_AND_AI.md, docs/05_API_CONTRACTS.md, docs/06_TESTING_AND_ACCEPTANCE.md and current code/tests. First inspect what M1 really implemented; fix M1 regressions before adding features. Change only data import/parse/preview and a REAL simple baseline; do not implement ridge yet.

Backend: build `csv_processing.py` with 1MB UTF-8 CSV cap, ≤2000 rows, ≤10 SKUs, required headers date/product_id/product_name/quantity_sold; ISO dates, nonnegative integer units, length/numeric bounds. Aggregate duplicate product/date transactions safely. Treat absent dates as ambiguous: flag data gaps for that SKU and do not quietly fill zero. Require consistent name per SKU. Retain at most 180 latest daily points and communicate truncation. Give human-readable structured errors.

Add `POST /v1/analyze` multipart file with current schema from docs/05_API_CONTRACTS.md. For now, compute an ACTUAL recursive 7-day seasonal naive forecast for 14 future days on each valid SKU with >=14 consecutive days, and set `status='baseline_only'`, `chosen_method='seasonal_naive'`, `validation=null`, notes indicating "baseline-only; ridge model pending Milestone 03". For <14 valid days, `status='insufficient_history'`, forecast=[], chosen_method=null. Once M3 is implemented, ≥60-day SKUs will be evaluated and choose model from validation. This interim baseline is honest, not a hardcoded mock.

Create a deterministic generator/script for `web/public/demo-sales.csv` with 3 synthetic SKUs, exactly 120 consecutive daily dates per SKU, seeded varying sales patterns and explicit zero rows; labels everywhere "Illustrative synthetic demo data — not real retailer records". The sample loader fetches this file and uploads it via EXACT SAME multipart endpoint as custom CSVs; do not bypass backend with hardcoded JSON. UI /import: file picker, upload progress/loading, validation errors/retry, accepted counts and product table. Use shared React in-memory Context for analysis; hard reload resets to honest empty state. /overview can show true product count after import. No data persistence.

Build pytest tests for valid import, duplicate transactions, missing day, 0 daily sales, malformed date/header, huge input, negative/unit type, conflicting names, >10 SKU, insufficient/baseline statuses and baseline forecast 14 dates. Add frontend handling tests if existing runner available. Run relevant Python/TS/build checks. Report actual commands/results, current API sample output, paths changed and known limitations. Update docs/DEVELOPMENT_LOG.md. Stop for human review; NO ridge model, inventory endpoint, deployment, or unnecessary UI polish.
```

## M2 acceptance
- One button loads **same actual API** as uploaded file; backend produces product histories and calculated **naive** 14-day forecast.
- Missing dates do not silently become zero; errors surfaced.
- User can navigate away and return without losing in-memory analysis until hard refresh; hard refresh shows useful empty screen.
- Ridge not falsely advertised at this intermediate gate.
