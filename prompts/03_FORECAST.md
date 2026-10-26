# 03 — Milestone 3: authentic ridge regression, chronological evaluation and forecast page

```text
Implement Milestone 03, genuine demand forecasting, for ReorderLens AI. Read AGENTS.md, docs/04_DATA_AND_AI.md, docs/05_API_CONTRACTS.md and docs/06_TESTING_AND_ACCEPTANCE.md. Inspect M2 implementation, git diff and actual test results first. Preserve the sample through the real CSV pipeline. Do not hardcode forecast values or claim an ML result without execution.

Extend backend/forecasting.py and POST /v1/analyze per contract:
- Valid dense daily SKU series with >=60 days: withhold LAST 14 actual days as validation; fit a pipeline with training-only StandardScaler + sklearn Ridge on leak-free lags (1,7), previous 7- and 14-day rolling means (strictly before target), weekday features. Build features only when enough history exists.
- Produce a full **recursive** 14-day validation forecast from cutoff using prior predicted values, never withheld actuals as lag/rolling inputs. Independently produce full 14-day **recursive seasonal-naive baseline** from same cutoff. Compute MAE from both against the 14 true held-out days. Choose lower MAE; ties choose seasonal naive. Clearly call these VALIDATION metrics, not independent test accuracy.
- Refit winner on all valid history and forecast next 14 real future dates; return nonnegative finite values, exact method, history, validation MAEs, notes and evaluated status. Baseline wins when it is better; do not force Ridge for marketing.
- 14–59 days: label seasonal baseline only, validation null. <14: insufficient. Constant/all-zero histories: stable documented fallback. No NaN/Infinity or crash. Dates strictly consecutive and after latest historical date.
- Bound training and runtime; no in-request expensive grid search, no external LLM API, no background jobs, no data persistence.

Implement /forecast screen with product picker, historical vs distinct 14-day forecast (Recharts), legend, units/date axes, accessible table, explicit "chosen method" and side-by-side validation MAEs when present; explain synthetic-data limitation if built-in CSV. Show baseline_only and insufficient states accurately; never render a random mock chart or fake percent accuracy.

Add tests proving cutoff prevents data leakage, recursive validation behavior, baseline selection, finite outputs, 14 chronological future dates, different input gives changed forecasts, and validation fields null for insufficient history. Run full backend pytest, frontend lint/types/build and local integrated flow if possible. Update log with real checks and code changes, stop for human review.
```

## M3 acceptance
- At least one SKU from generated 120-day data gets a **calculated model-vs-baseline validation result** (Ridge actually trained); chosen method can be naive.
- Difference between uploaded datasets alters model/forecast output as expected; no hardcoded forecasts.
- The withheld 14 days are never included in training/recursive feature inputs.
