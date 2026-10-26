# 02 — MVP product scope, UX and interaction states

## Core user story
As a small retailer, I can upload a supported sales CSV or explicitly load labeled demo data, see a product forecast that was computed from those records, enter current stock and supplier lead days, and receive an understandable estimated replenishment quantity without any automatic ordering.

## Four committed screens

| Route | Visible elements | Real interaction and states |
|---|---|---|
| `/` Overview | ReorderLens AI logo/name, demo label, dataset status, simple sales overview, product count, at-risk counts only after stock inputs, navigation CTA | Empty: “Import CSV or load demo data”; dataset loaded: compute summaries from active analysis. No invented percentages, customer counts, savings or live feed. |
| `/import` Import Sales | Header and CSV example/download, file picker, “Load synthetic demo” button, validation errors, accepted row counts, grouped product preview | Upload ≤1 MB; normalizing rows executes backend `POST /backend/v1/analyze`; spinner; actionable 4xx errors; success state; demo action loads same pipeline. Warn unsaved session resets on refresh. |
| `/forecast` Demand Forecast | Product picker, 14-day horizon, historical series + predicted series visually distinct, chosen method (ridge or naive), model/baseline 14-day validation MAE, data limitations | Select product, plot real API response, concise legend and accessible table; explain model-vs-baseline selection; don't call validation “test accuracy”; warnings when only baseline available. |
| `/recommendations` Inventory Recommendations | Selected product, current stock units, supplier lead days (1–14), safety stock (default 0), “Calculate” action or debounced recompute, reorder units, predicted lead-time demand, projected risk label, arithmetic explanation | Change stock or lead days and recompute using `POST /backend/v1/recommendations`; show response values, not hardcoded. No buy button; retain review control. Prevent negative/NaN entries and unsupported lead times. |

### Optional high-priority `/docs`
A short, truthful public page may explain dataset labels, model candidates vs chosen method, validation metrics from actual run, deterministic inventory math, limitations, and AI development provenance. Earlier portal discussion recommended shipping `/docs` but no proof of final checkbox. Implement if core four screens are working and video time permits.

## UX guidance
- Clean retail analytics, light theme, responsive sidebar/top-nav; never imitate an unrelated product. Avoid animations interfering with recording.
- English-first tonight, include Bangla/localization consideration as future scope or a small verified Bengali section if low risk; **do not promise full Bangla translation if absent**.
- Every chart has explicit actual/forecast legend, y-axis units and screen-reader-accessible table; indicators also labeled in text (not color only).
- Graceful states: no data, uploading, processing, partial validation failure, insufficient history, backend unavailable, invalid settings, calculation in progress, empty forecast, demo data clear/reset, navigation after refresh.
- No persistent user data in MVP. Store sanitized analysis response only in in-memory React Context (not localStorage/cookies). A full page refresh resets to empty/helpful sample loader; **this is expected and disclosed**.
- Sales/import stats must come from returned records. Forecast error is genuine calculation on last 14 withheld dates when possible. A projected shortage is **not** a calibrated stockout probability.

## Scope guardrails
### P0 — required before filming
- Four routes, functional sample + import, valid/invalid CSV handling, product selection, real model or labeled fallback, 14-day predictions, validation comparison, inventory recommendations, explanations, all errors visible, local tests, end-to-end proof.

### P1 — only after P0
- `/docs` truthful docs, responsive polish and reusable components, simple CSV export of recommendation if already working, deployment and smoke tests.

### Excluded from preliminary
- Login/multi-tenant, PostgreSQL, external POS, OCR, real-time streaming, notifications, supplier checkout, LLM chat, RAG/agents/MCP, expensive model training, user analytics, simulations of **real** revenue effects.

## Demo walkthrough acceptance
User enters `/`, clicks demo data, sees validated import summary, opens `/forecast`, selects one SKU, observes computed 14-day forecast with method and MAEs, goes `/recommendations`, sets stock low to show reorder quantity >0, increases stock to show quantity falls (often 0), changes lead time and sees revised lead demand. Every number is calculated by the application; synthetic nature visible.
