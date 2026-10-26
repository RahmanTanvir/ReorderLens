# 06 — Tests, QA evidence and definition of done

**Not implemented at kit creation.** Mark checkboxes only after running checks on the actual repo. Automated tests do not replace a human browser demo.

## Milestone gates

| Gate | Automated checks (when files exist) | Manual proof required |
|---|---|---|
| M1 foundation | Python FastAPI test client checks `GET /health`; web TypeScript check and build; proxy health accessible from UI origin | Web opens, nav works, backend route reachable; save console/network evidence. |
| M2 import | CSV schema tests, 1 MB rejection, row/SKU limits, missing dates, negative values, duplicate daily transaction aggregation, 0-sales rows, name conflicts, invalid UTF-8 | Built-in synthetic example and CSV upload use identical `/v1/analyze` endpoint; visible result/error. |
| M3 forecast | Synthetic data tests; Ridge trains on ≥60 days; 14-day recursive validation; baseline; no leakage; fallback on 14–59 days; insufficient <14; non-finite handling | Chart changes when edited dataset changes, no hardcoded line, shows real chosen method + MAE, baseline wins on at least one controlled test if appropriate. |
| M4 inventory | 0 stock, safety 0/positive, lead time 1 & 14, overstock, correct expected demand, 14-day limit, invalid negative/NaN, 14 contiguous forecast dates | Changing stock and lead inputs visibly recalculates response from API. |
| M5 readiness | `python -m pytest -q`; `npm run lint` (if script), `npx tsc --noEmit`, `npm run build`; deploy smoke /health /analyze /recommendations | 4-screen end-to-end demo locally AND (if claimed) at actual Vercel URL; mobile; no console exception; `/docs` only if really shipped. |

## Required unit tests (backend)
1. CSV with full dense daily 120-day history; parse/aggregate rows, types, result consistent.
2. Missing required column, malformed dates, negative/non-integer quantities, UTF-8 problem, oversized uploads, too many SKUs/rows, sparse day series and inconsistent names.
3. Duplicate same-day transactions aggregate correctly (including zero days); no double-counting unrelated SKUs.
4. Forecast on simple repeating weekday fixture: seasonal naive recursive behavior exactly match expected repetition; Ridge execution produces nonnegative finite forecast.
5. Validation uses historical cutoff: perturb withheld future values and verify **feature construction / model fit from training period is unchanged**. Recursive predictions cannot read held-out actuals, though resulting **MAE** changes with withheld targets.
6. Compare two validation MAEs and select lower; tie selects naive. Baseline-only and insufficient statuses correctly labeled. Unstable Ridge errors use declared fallback and notes.
7. Example inventory: demand 10 × 5 days, stock 30, safety 10 ⇒ lead demand 50, shortfall 20, reorder 30. Stock 65 ⇒ risk low, reorder 0. Lead 1 vs 14 changes demand/reorder.
8. All input limits, negative floats, NaN/infinity, invalid horizon dates produce 4xx structured errors, never a silent 200 with bad data.

## Integration / contract tests
- FastAPI TestClient file upload triggers genuine pipeline; check output JSON structure, 14 future dates, data status, chosen method and numeric bounds.
- API recommendation JSON built from actual analyze response gives arithmetic invariants; change stock input and assert new recommended quantity.
- Browser data import has stable session behavior; after hard refresh, show empty state **not** fabricated persisted data; built-in fixture can be reloaded.
- API failure: unplug backend or use failing fixture; UI shows real retry and clear error, never endless spinner.

## Browser acceptance walkthrough (capture evidence)
1. Open actual web URL; see product/label, no fake KPI cards.
2. Click **Load synthetic demo**; display explicit synthetic disclosure; accepted row counts make sense.
3. Navigate Forecast: choose at least two products; confirm distinct, computed histories/forecasts and selected method; forecast starts after last historical date.
4. Navigate Recommendations: stock 0 and lead 7 produce positive reorder for a selling product; increasing stock past anticipated demand+safety makes reorder 0; reducing lead to 1 reduces lead demand appropriately.
5. Upload intentionally invalid CSV and show useful rejection.
6. Test mobile (~375px) and desktop viewport, tab navigation and readable chart/table labels.
7. Hard refresh => truthful empty state; sample reload works.
8. Check that Vercel/API status and error logs don't contain uploaded raw rows or secrets.

## Release blocking conditions
- Fake or static forecast not derived from submitted CSV.
- Forecasting claims unmeasured 95% accuracy, causal uplift, stockout probability or guaranteed ROI.
- An interactive control which cannot complete its named action.
- A broken data/reorder flow, uncaught exception, wrong arithmetic, silent invalid input or fabricated KPI.
- Stating a public deployment was tested without actually visiting its real URL.
- Publishing secrets, confidential retailer CSV or customer-identifying data.

## Exit report template (actual results only)

```
Milestone: M#
Changed files: <real paths>
Implementation evidence: <feature + route + screenshot reference>
Commands actually run: <exact commands>
Automated results: <pass/fail, number; include errors>
Manual checks performed: <which steps, by whom>
Browser/Deployed URL checked: <actual URL if any>
Known defects / deviations: <issues>
Remaining to gate: <list>
Owner checkpoint: pending / approved / changes requested
```
