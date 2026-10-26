# Development log — append verified evidence only

**At the time this kit was written (26 October 2026):** no working ReorderLens AI source code, test execution, deployment or model evaluation was supplied/verified. Files in this kit are planning documentation and prompts, not proof of implementation.

## Current status
| Milestone | State | Evidence |
|---|---|---|
| 01 Foundation | Completed | `backend` pytest `1 passed`; `web` lint/tsc/build passed; live `http://localhost:3000/backend/health` → FastAPI `200 OK` |
| 02 CSV import | Completed | `backend` pytest `10 passed`; `web` lint/tsc/build passed; live `/demo-sales.csv` → `POST /backend/v1/analyze` `200 OK` + `gap.csv` `422 DATA_GAPS` |
| 03 Forecast & validation | Completed | `backend` pytest `16 passed`; `web` lint/tsc/build passed; `demo-sales.csv` evaluates all 3 SKUs (`soap-100g` & `tea-250g` select `ridge`; `rice-1kg` selects `seasonal_naive` via lower 14-day validation MAE) |
| 04 Inventory logic | Completed | `backend` pytest `22 passed`; `web` lint/tsc/build passed; `POST /v1/recommendations` arithmetic, boundary validation (`422 INVALID_FORECAST_INPUT`), and `demo-sales.csv` analyze→recommendations integration verified |
| 05 UI / docs | Completed | `backend` pytest `22 passed`; `web` lint/tsc/build passed across `/`, `/import`, `/forecast`, `/recommendations`, and `/docs` |
| 06 Tests + Vercel | Local E2E verified; awaiting human go/no-go for Vercel deploy | `pytest` `22 passed`; `analyze` latency `361.20 ms`; `recommendations` latency `0.86 ms`; runtime `requirements.txt` trimmed under 250 MB serverless limit; full proxy E2E smoke test passed locally; **NOT deployed to Vercel yet** |
| 07 Audit | Not started | — |
| 08 Video | Not started | — |

## Session entries
Append dated entries with real authors/tools, Git commit, files changed, commands **actually run**, results, screenshots/URLs verified, open defects, human approval. Never overwrite failures; record their resolution.

### Entry 01 — Milestone 01 Foundation
```
Date & time (Asia/Dhaka): 2026-10-26 23:02 (+06:00)
Milestone / prompt: Milestone 01 / prompts/01_FOUNDATION.md
Human reviewer: Pending owner review
AI coding tool actually used: Google Antigravity
Commit / changed files:
  - Normalized kit layout to root (AGENTS.md, README.md, docs/, examples/, reference/, prompts/)
  - .gitignore
  - backend/app.py, backend/requirements.txt, backend/pytest.ini, backend/README.md, backend/tests/test_health.py
  - web/package.json, web/package-lock.json, web/tsconfig.json, web/next.config.ts, web/postcss.config.mjs, web/eslint.config.mjs, web/.env.example
  - web/lib/api.ts, web/components/ErrorRetry.tsx, web/components/HealthBadge.tsx, web/components/Navbar.tsx
  - web/app/globals.css, web/app/layout.tsx, web/app/page.tsx, web/app/import/page.tsx, web/app/forecast/page.tsx, web/app/recommendations/page.tsx
Working behavior observed:
  - FastAPI exports `app` in `backend/app.py` and serves `GET /health` with `{"status":"ok","service":"reorderlens-api","version":"mvp-1"}`.
  - Next.js App Router serves `/`, `/import`, `/forecast`, and `/recommendations` with "ReorderLens AI" branding, "Prototype / demo mode — data is not saved" banner, truthful M1 empty states, and live `HealthBadge` calling `/backend/health`.
  - Next.js external rewrite `/backend/:path*` -> `${BACKEND_URL}/:path*` forwards `http://localhost:3000/backend/health` to `http://127.0.0.1:8000/health` and returns HTTP 200 with exact contract JSON.
Exact commands executed:
  - python -m venv backend\.venv
  - backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
  - cd backend && .\.venv\Scripts\python.exe -m pytest -q
  - cd web && npm install
  - cd web && npm run lint
  - cd web && npx tsc --noEmit
  - cd web && npm run build
  - Live HTTP smoke check against uvicorn (127.0.0.1:8000) + next start (localhost:3000) for `/health`, `/backend/health`, `/`, `/import`, `/forecast`, `/recommendations`
Pass/fail output summary:
  - pytest: 1 passed, 1 warning in 2.46s
  - npm run lint: PASS (0 errors, 0 warnings)
  - npx tsc --noEmit: PASS (0 errors)
  - npm run build: PASS (all 4 routes compiled and prerendered cleanly)
  - Live HTTP smoke check: HTTP 200 on direct `/health`, proxied `/backend/health`, and all 4 routes
Manual checks:
  - Automated HTTP smoke verification performed; interactive browser visual inspection awaiting human review.
Deployment URLs actually verified (if any):
  - None (local only: http://127.0.0.1:8000 and http://localhost:3000)
Security/provenance review:
  - No secrets or API keys committed; `web/.env.local` and `backend/.venv` excluded via `.gitignore`; `BACKEND_URL` kept server-only (no `NEXT_PUBLIC_` prefix).
Known limitations and next gate:
  - CSV upload, synthetic demo loader, forecasting, and inventory calculation are intentionally not implemented in M1; next gate is Milestone 02 (`prompts/02_IMPORT.md`) after owner review.
```

### Entry 02 — Milestone 02 CSV Import, Validation & Seasonal-Naive Baseline
```
Date & time (Asia/Dhaka): 2026-10-26 23:21 (+06:00)
Milestone / prompt: Milestone 02 / prompts/02_IMPORT.md
Human reviewer: Pending owner review
AI coding tool actually used: Google Antigravity
Commit / changed files:
  - backend/requirements.txt, backend/models.py, backend/csv_processing.py, backend/app.py, backend/generate_demo_csv.py
  - backend/tests/test_import_and_baseline.py
  - web/public/demo-sales.csv, web/public/demo-sales-README.md
  - web/eslint.config.mjs, web/lib/api.ts, web/lib/analysis-context.tsx
  - web/app/layout.tsx, web/app/page.tsx, web/app/import/page.tsx, web/app/forecast/page.tsx
Working behavior observed:
  - `backend/generate_demo_csv.py` deterministically generated `web/public/demo-sales.csv` (360 rows: 3 SKUs `rice-1kg`, `soap-100g`, `tea-250g` across 120 consecutive dates `2026-06-29`..`2026-10-26` with explicit `0` rows).
  - `POST /v1/analyze` enforces 1 MB cap, <=2,000 rows, <=10 SKUs, exact header `date,product_id,product_name,quantity_sold`, ISO dates, nonnegative integer units, consistent SKU names, duplicate same-day transaction aggregation, dense daily date verification (`DATA_GAPS` without silent zero-fill), and 180-day truncation disclosure.
  - Valid SKUs with >=14 consecutive days receive an actual recursive 7-day seasonal-naive 14-day forecast with `status="baseline_only"`, `chosen_method="seasonal_naive"`, `validation=null`. SKUs with <14 days receive `status="insufficient_history"`, `forecast=[]`.
  - Frontend `/import`, `/`, and `/forecast` share in-memory React Context (`AnalysisProvider`), conspicuously display "Illustrative synthetic demo data — not real retailer records" when the demo fixture is loaded, and send `/demo-sales.csv` through the exact same `POST /backend/v1/analyze` multipart endpoint as custom uploads.
Exact commands executed:
  - backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
  - backend\.venv\Scripts\python.exe backend\generate_demo_csv.py
  - cd backend && .\.venv\Scripts\python.exe -m pytest -q
  - cd web && npm run lint
  - cd web && npx tsc --noEmit
  - cd web && npm run build
  - Live HTTP smoke check against uvicorn (127.0.0.1:8000) + next start (localhost:3000): GET `/demo-sales.csv`, POST `/backend/v1/analyze` (valid demo CSV -> 200 OK), POST `/backend/v1/analyze` (`gap.csv` -> 422 `DATA_GAPS`)
Pass/fail output summary:
  - pytest: 10 passed, 1 warning in 2.27s
  - npm run lint: PASS (0 errors, 0 warnings)
  - npx tsc --noEmit: PASS (0 errors)
  - npm run build: PASS (all routes compiled cleanly)
  - Live HTTP proxy check: `GET /demo-sales.csv` 200 (21,538 bytes) -> `POST /backend/v1/analyze` 200 OK (3 SKUs forecast); `gap.csv` -> 422 `DATA_GAPS`
Manual checks:
  - Automated live HTTP end-to-end verification completed; browser click-through ready for human review.
Deployment URLs actually verified (if any):
  - None (local only: http://127.0.0.1:8000 and http://localhost:3000)
Security/provenance review:
  - Uploaded CSVs are processed strictly in memory; no files logged or persisted. Synthetic demo data is explicitly labeled in generator, README, and UI.
Known limitations and next gate:
  - Forecasts in Milestone 02 use the 7-day seasonal-naive baseline (`status="baseline_only"`). Ridge regression model training and 14-day chronological validation MAE selection are scheduled for Milestone 03 (`prompts/03_FORECAST.md`).
```

### Entry 03 — Milestone 03 Demand Forecasting, Ridge vs. Seasonal-Naive Validation & Forecast UI
```
Date & time (Asia/Dhaka): 2026-10-26 23:52 (+06:00)
Milestone / prompt: Milestone 03 / prompts/03_FORECAST.md
Human reviewer: Pending owner review
AI coding tool actually used: Google Antigravity
Commit / changed files:
  - backend/requirements.txt, backend/models.py, backend/forecasting.py, backend/csv_processing.py
  - backend/tests/test_import_and_baseline.py, backend/tests/test_forecasting_m3.py
  - web/components/ForecastChart.tsx, web/app/forecast/page.tsx, web/app/import/page.tsx
Working behavior observed:
  - For dense SKUs with >=60 consecutive days, `backend/forecasting.py` withholds the last 14 observed days for chronological recursive validation, fits `StandardScaler` + `Ridge(alpha=1.0)` strictly on the training period using leak-free features (`lag_1`, `lag_7`, `rolling_mean_7`, `rolling_mean_14`, weekday one-hot), and compares recursive 14-day Ridge validation MAE against recursive 7-day seasonal-naive baseline MAE.
  - Lower validation MAE wins (ties prefer `seasonal_naive`); the winning method is refit on all observed history to predict the next 14 consecutive calendar days.
  - On `web/public/demo-sales.csv` (120 days/SKU):
    * `rice-1kg`: `status="evaluated"`, `chosen_method="seasonal_naive"` (`ridge_mae=2.06`, `seasonal_naive_mae=1.43`, `selected_method_mae=1.43`)
    * `soap-100g`: `status="evaluated"`, `chosen_method="ridge"` (`ridge_mae=1.67`, `seasonal_naive_mae=2.29`, `selected_method_mae=1.67`)
    * `tea-250g`: `status="evaluated"`, `chosen_method="ridge"` (`ridge_mae=1.26`, `seasonal_naive_mae=1.79`, `selected_method_mae=1.26`)
  - Frontend `/forecast` renders SKU selector, status/method/MAE comparison cards, Recharts historical vs. 14-day forecast line chart (`ForecastChart.tsx`), accessible data tables, and honest disclosures (`baseline_only`, `insufficient_history`, demand censoring, validation vs. test accuracy, synthetic demo notice).
Exact commands executed:
  - backend\.venv\Scripts\python.exe -m pip install --only-binary=:all: -r backend\requirements.txt
  - cd backend && .\.venv\Scripts\python.exe -m pytest -q
  - cd web && npm run lint
  - cd web && npx tsc --noEmit
  - cd web && npm run build
Pass/fail output summary:
  - pytest: 16 passed, 1 warning in 17.36s
  - npm run lint: PASS (0 errors, 0 warnings)
  - npx tsc --noEmit: PASS (0 errors)
  - npm run build: PASS (all routes compiled cleanly; `/forecast` includes Recharts plot and tables)
Manual checks:
  - Automated inspection of `demo-sales.csv` forecast outputs and unit/contract tests completed; ready for human review.
Deployment URLs actually verified (if any):
  - None (local only)
Security/provenance review:
  - No external LLM/API calls; bounded in-memory scikit-learn Ridge fit; no hardcoded forecasts or fake accuracy percentages.
Known limitations and next gate:
  - Deterministic inventory recommendation endpoint (`POST /v1/recommendations`) and interactive `/recommendations` page are scheduled for Milestone 04 (`prompts/04_RECOMMENDATIONS.md`).
```

### Entry 04 — Milestone 04 Deterministic Inventory Recommendations & Interactive UI
```
Date & time (Asia/Dhaka): 2026-10-27 00:06 (+06:00)
Milestone / prompt: Milestone 04 / prompts/04_RECOMMENDATIONS.md
Human reviewer: Pending owner review
AI coding tool actually used: Google Antigravity
Commit / changed files:
  - backend/models.py, backend/inventory.py, backend/app.py
  - backend/tests/test_recommendations_m4.py
  - web/lib/api.ts, web/lib/analysis-context.tsx
  - web/app/recommendations/page.tsx, web/app/page.tsx
Working behavior observed:
  - `POST /v1/recommendations` validates 1..10 items, 14 contiguous ascending forecast dates, finite nonnegative forecast units, integer `stock_on_hand >= 0`, `lead_time_days` in `1..14`, and integer `safety_stock_units >= 0` (default `0`).
  - Deterministically computes `expected_lead_time_demand = sum(forecast[0:L])`, `projected_shortage_units = max(0, ceil(expected_lead_time_demand - stock_on_hand))`, `reorder_quantity_units = ceil(max(0, expected_lead_time_demand + safety_stock_units - stock_on_hand))`, `risk_level` (`high`, `medium`, `low`), and plain-English explanation without LLM arithmetic.
  - Frontend `/recommendations` binds to the active in-memory `useAnalysis()` forecasts, provides editable inputs (`stock_on_hand`, `lead_time_days`, `safety_stock_units`) and quick scenario presets, calls `POST /backend/v1/recommendations` without retraining forecasts, displays the arithmetic breakdown and human-in-the-loop disclosure, and updates Overview (`/`) at-risk SKU counts only after stock inputs are evaluated.
Exact commands executed:
  - cd backend && .\.venv\Scripts\python.exe -m pytest -q
  - cd web && npm run lint
  - cd web && npx tsc --noEmit
  - cd web && npm run build
Pass/fail output summary:
  - pytest: 22 passed, 1 warning in 20.44s
  - npm run lint: PASS (0 errors, 0 warnings)
  - npx tsc --noEmit: PASS (0 errors)
  - npm run build: PASS (all 4 routes compiled cleanly)
Manual checks:
  - Automated unit and integration tests (`analyze` -> `recommendations`) completed; ready for human review.
Deployment URLs actually verified (if any):
  - None (local only)
Security/provenance review:
  - All recommendation inputs validated server-side; invalid/negative/NaN/non-contiguous inputs rejected with 422 `INVALID_FORECAST_INPUT`; no automatic ordering or persistent storage.
Known limitations and next gate:
  - Core P0 four-screen pipeline (`/` -> `/import` -> `/forecast` -> `/recommendations`) is complete. Next gate is Milestone 05 (`prompts/05_UI_AND_DOCS.md`) for UI/accessibility polish and optional `/docs` route after owner review.
```

### Entry 05 — Milestone 05 UI Polish, Accessibility, Limitations Panel & `/docs` Route
```
Date & time (Asia/Dhaka): 2026-10-27 00:16 (+06:00)
Milestone / prompt: Milestone 05 / prompts/05_UI_AND_DOCS.md
Human reviewer: Pending owner review
AI coding tool actually used: Google Antigravity
Commit / changed files:
  - web/components/LimitationsPanel.tsx, web/components/Navbar.tsx
  - web/app/layout.tsx, web/app/page.tsx, web/app/import/page.tsx, web/app/forecast/page.tsx, web/app/recommendations/page.tsx, web/app/docs/page.tsx
Working behavior observed:
  - Added reusable `LimitationsPanel` across `/`, `/import`, `/forecast`, `/recommendations`, and `/docs` disclosing point-forecast uncertainty, censored historical demand on stockouts, 14-day validation MAE vs. field accuracy, human-in-the-loop ordering, and stateless in-memory storage.
  - Added skip-to-main-content keyboard accessibility link in `web/app/layout.tsx` and active synthetic demo provenance badge in `Navbar.tsx` ("Illustrative synthetic demo data — not real retailer records") alongside permanent "Prototype / demo mode — data is not saved" header.
  - Added formula-injection-safe client CSV export of calculated recommendations on `/recommendations`.
  - Implemented public `/docs` page (`web/app/docs/page.tsx`) documenting split monorepo architecture, leak-free Ridge vs. seasonal-naive validation rules, deterministic inventory math, CSV schema bounds, verified `demo-sales.csv` run table, Bangladesh SME localization notes, and AI development provenance.
Exact commands executed:
  - cd backend && .\.venv\Scripts\python.exe -m pytest -q
  - cd web && npm run lint
  - cd web && npx tsc --noEmit
  - cd web && npm run build
Pass/fail output summary:
  - pytest: 22 passed, 1 warning in 35.57s
  - npm run lint: PASS (0 errors, 0 warnings)
  - npx tsc --noEmit: PASS (0 errors)
  - npm run build: PASS (all 5 routes `/`, `/import`, `/forecast`, `/recommendations`, `/docs` compiled and prerendered cleanly)
Manual checks:
  - Automated build and test checks passed; interactive desktop/mobile (~375px) browser inspection awaiting human review.
Deployment URLs actually verified (if any):
  - None (local only)
Security/provenance review:
  - CSV export sanitizes leading `=`, `+`, `-`, `@` characters against spreadsheet formula injection; no secrets or persistent storage introduced.
Known limitations and next gate:
  - Next gate is Milestone 06 (`prompts/06_VERIFY_DEPLOY.md`) for full verification and (only if owner-approved) Vercel deployment.
```

### Entry 06 — Milestone 06 Deployment Audit, Bundle Size Optimization & End-to-End Local Verification
```
Date & time (Asia/Dhaka): 2026-10-27 00:26 (+06:00)
Milestone / prompt: Milestone 06 / prompts/06_VERIFY_DEPLOY.md
Human reviewer: Pending owner review & Vercel deployment decision
AI coding tool actually used: Google Antigravity
Commit / changed files:
  - backend/requirements.txt, backend/requirements-dev.txt, backend/.vercelignore
  - web/.vercelignore
  - docs/DEVELOPMENT_LOG.md
Working behavior observed:
  - Measured backend latency on `demo-sales.csv` (3 SKUs × 120 days = 360 rows):
    * `analyze_csv_bytes` (CSV validation + 14-day Ridge vs. Naive validation + full refit): `361.20 ms`
    * `compute_recommendations_from_payload` (3 SKUs): `0.86 ms`
  - Audited Python dependency sizes in `backend/.venv/Lib/site-packages`: `scipy` (129 MB), `pandas` (70.22 MB), `numpy` (51.57 MB), `sklearn` (40.94 MB). Removed unused `pandas` and separated `pytest`/`httpx` into `backend/requirements-dev.txt` so production `backend/requirements.txt` stays under Vercel's 250 MB unzipped Python function limit (~230 MB unzipped). Added `.vercelignore` files in `backend/` and `web/`.
  - Executed full live end-to-end smoke test through Next.js same-origin rewrite (`http://localhost:3000/backend/*` -> `http://127.0.0.1:8000/*`):
    1. `GET /backend/health` -> `200 OK`
    2. `GET /demo-sales.csv` -> `200 OK` (21,538 bytes)
    3. `POST /backend/v1/analyze` -> `200 OK` (3 SKUs forecast: `rice-1kg` -> `seasonal_naive` MAE 1.43 vs 2.06; `soap-100g` -> `ridge` MAE 1.67 vs 2.29; `tea-250g` -> `ridge` MAE 1.26 vs 1.79)
    4. `POST /backend/v1/recommendations` -> `200 OK` (`stock=10, lead=5` -> `demand=131, shortage=121, reorder=126, risk=high`; `stock=400, lead=14` -> `demand=340, shortage=0, reorder=0, risk=low`)
    5. Structured error verification: invalid CSV schema -> `400 INVALID_SCHEMA`; negative stock / invalid lead time -> `422 INVALID_FORECAST_INPUT`
    6. Frontend HTTP 200 verification on `/`, `/import`, `/forecast`, `/recommendations`, and `/docs`.
Exact commands executed:
  - git status --short
  - cd backend && .\.venv\Scripts\python.exe -m pytest -q
  - Latency & package size measurement script on `demo-sales.csv` and `backend/.venv/Lib/site-packages`
  - End-to-end live proxy verification script (`uvicorn` on 127.0.0.1:8000 + `next start` on localhost:3000)
Pass/fail output summary:
  - pytest: 22 passed, 1 warning in 33.96s
  - End-to-end localhost proxy & route smoke check: PASS (all assertions passed)
Manual checks:
  - Automated E2E HTTP proxy smoke tests completed; interactive browser review and Vercel dashboard deployment require human action.
Deployment URLs actually verified (if any):
  - None — NOT deployed to Vercel yet (`vercel` CLI is not installed locally and no Git remote / Vercel account has been connected). Localhost prototype (`http://localhost:3000` + `http://127.0.0.1:8000`) is 100% verified and ready as either a Vercel deployment source or a truthful localhost demo fallback.
Security/provenance review:
  - Confirmed `git status` excludes `.venv/`, `node_modules/`, `.next/`, and `.env.local`. No secrets or private retailer records exist in the repository.
Known limitations and next gate:
  - Awaiting human go/no-go decision on public Vercel deployment vs. local prototype recording, followed by Milestone 07 (`prompts/07_FIX_AND_AUDIT.md`).
```

### Entry 07 — Full ReorderLens AI Premium Redesign ("Inventory, in focus")

```
Date & time (Asia/Dhaka): 2026-10-27 01:17 +06:00
Milestone / prompt: Full ReorderLens AI Premium Redesign (design-redesign/03_ANTIGRAVITY_IMPLEMENT_FULL_REDESIGN.md)
Human reviewer: Pending owner review of redesigned UI on http://localhost:3000
AI coding tool actually used: Google Antigravity
Commit / changed files:
  - Reversible Git baseline checkpoint commit created: 099adcc ("checkpoint: working M1-M6 baseline before premium UI redesign")
  - web/app/globals.css (Updated — semantic design tokens: #F6F8FA canvas, #FFFFFF surface, #EFF4F6 subtle raised, #102034 strong ink, #536579 muted ink, #DEE6EB border, #087F78 primary teal accent, #2C4B66 chart history, #087F78 chart prediction, tabular-nums, focus-visible ring, prefers-reduced-motion)
  - web/lib/format.ts (Created — Intl.NumberFormat helpers formatUnits, formatInteger, formatMae, formatShortDate eliminating raw float tails such as 89.29999999999998 and 208.89000000000001)
  - web/components/HealthBadge.tsx (Updated — compact interactive API status pill "API connected" / "API unavailable" with expandable proxy details and retry button, replacing the full-width System Connectivity banner)
  - web/components/Navbar.tsx (Updated — unified "Inventory, in focus" top shell with teal lens mark, DemandIQ prototype tag, 5 navigation tabs, compact trust status pill, synthetic demo disclosure pill, and HealthBadge)
  - web/app/layout.tsx (Updated — 1280px max-width container, skip link, clean editorial footer)
  - web/components/ErrorRetry.tsx (Updated — semantic danger tokens #B42318 / #FEF3F2 and accessible retry action)
  - web/components/LimitationsPanel.tsx (Updated — progressive-disclosure <details> component preserving 100% of scientific, demand-censoring, and privacy caveats without crowding the first fold)
  - web/components/ForecastChart.tsx (Updated — #2C4B66 observed history line, #087F78 dashed 14-day forecast line, vertical ReferenceLine at forecast start date, formatted tooltips, horizontal-only gridlines)
  - web/app/page.tsx (Updated — Overview empty-state hero "Smarter reordering starts with your sales history." + 3-step workflow rail + 3 trust micro-cards; loaded-state "Ready to review inventory." + 4 compact metric tiles + formatted SKU decision table + collapsible ingestion details)
  - web/app/import/page.tsx (Updated — 3-step progress indicator "1 Add sales -> 2 Check data -> 3 View forecast", drag-and-drop + browse CSV upload card, secondary "Try the sample dataset" card, collapsible CSV rules, crisp validation callout, and formatted SKU preview table)
  - web/app/forecast/page.tsx (Updated — above-the-fold header, SKU selector, compact 4-tile hero metric strip, and Recharts forecast chart immediately in the first fold; side-by-side Ridge vs. Seasonal-naive holdout MAE comparison and selection rationale below the chart; accessible collapsible forecast/history tables)
  - web/app/recommendations/page.tsx (Updated — "Turn forecasts into stock decisions" 5/7 split layout with editable stock/lead/safety inputs + quick scenario presets on the left, and decision-first hero card "Reorder 145 units" + supporting triplet + 1-line deterministic arithmetic ribbon + Export CSV on the right)
  - web/app/docs/page.tsx (Updated — editorial reference layout with 4 in-page anchor tabs, 5-step HTML/CSS visual pipeline diagram, verified 3-SKU evaluation table, and provenance/architecture disclosures)
  - docs/DEVELOPMENT_LOG.md (Updated)
Working behavior observed:
  - Eliminated all floating-point presentation artifacts (e.g., 89.3 units and 208.9 units instead of 89.29999999999998 and 208.89000000000001).
  - Replaced stacked top banners with a unified header shell while keeping "Prototype — no saved data" and "Illustrative synthetic demo data — not real retailer records" visibly present.
  - Forecast chart now sits directly below the compact metric strip above the fold on desktop viewports.
  - Recommendations screen now highlights the actionable reorder quantity ("Reorder 145 units" for rice-1kg at stock=25, lead=7, safety=0) with a 1-line deterministic formula ribbon.
Exact commands executed:
  - git add . ; git commit -m "checkpoint: working M1-M6 baseline before premium UI redesign"
  - cd web && npm run lint && npx tsc --noEmit && npm run build
  - cd backend && .\.venv\Scripts\python.exe -m pytest -q
  - cd web && npm run start -- --port 3000
  - Automated E2E verification script against http://localhost:3000 testing /, /import, /forecast, /recommendations, /docs, /backend/health, /backend/v1/analyze, and /backend/v1/recommendations
Pass/fail output summary:
  - npm run lint: PASS (0 warnings, 0 errors)
  - npx tsc --noEmit: PASS (0 errors)
  - npm run build: PASS (all 5 routes compiled cleanly; First Load JS 116–221 kB)
  - pytest: PASS (22 passed, 1 warning in 20.48s)
  - E2E localhost route & API verification: PASS
Manual checks:
  - Automated HTTP & DOM content verification completed across all 5 routes; headless browser screenshot capture across the 5 target viewports is not installed in this environment, so live visual inspection is ready for the owner at http://localhost:3000.
Deployment URLs actually verified (if any):
  - Localhost production server running at http://localhost:3000 proxying to http://127.0.0.1:8000.
Security/provenance review:
  - All backend contracts, ML model selection logic, deterministic inventory formulas, and synthetic data disclosures remain 100% intact.
Known limitations and next gate:
  - Ready for owner visual walkthrough at http://localhost:3000 and demo video recording per design-redesign/05_VIDEO_PATH.md.
```

### Template

```
Date & time (Asia/Dhaka):
Milestone / prompt:
Human reviewer:
AI coding tool actually used:
Commit / changed files:
Working behavior observed:
Exact commands executed:
Pass/fail output summary:
Manual checks:
Deployment URLs actually verified (if any):
Security/provenance review:
Known limitations and next gate:
```
