# ReorderLens AI — permanent workspace rules for Antigravity

These rules apply to the repository and all future Antigravity sessions. Read `README.md`, `docs/07_ROADMAP_AND_DECISIONS.md`, and the phase-specific requirements before editing code. **Only root `AGENTS.md` is used**; avoid conflicting duplicate root `GEMINI.md`.

## Purpose and status
- Build **ReorderLens AI**, a DemandIQ preliminary prototype for small retailers. Four honest screens; actual input-driven demand forecast and deterministic stock recommendations.
- The owner approved the emergency plan, **not** arbitrary new features or unbounded scope. Challenge selection and product name are final unless owner approves a change.
- This repository starts with **instructions only**, unless actual source files already exist. Inspect first; never report tests/deployment that were not run.

## Code constraints
1. One monorepo: `web/` Next.js App Router with TypeScript, Tailwind, Recharts; `backend/` FastAPI, Pandas, scikit-learn, Pydantic; `docs/`, `prompts/` remain at root. Preserve existing projects if already present; report conflicts.
2. **Two distinct Vercel projects** configured with Git root directories `web` and `backend`. Do not assume multi-runtime "Services" (private-beta feature) is available. `web/next.config.*` same-origin rewrite `/backend/:path*` to the `BACKEND_URL` origin. Browser never needs to know the backend origin directly. The backend exports FastAPI `app` from `backend/app.py` or recognized entrypoint.
3. Backend is stateless: parse limited CSV in memory, create forecast response, accept forecasts + settings to compute recommendations. No database, auth, persistent uploads or supplier ordering in MVP. Don't write uploaded raw data to durable files or logs.
4. Source-of-truth for payload schemas = `docs/05_API_CONTRACTS.md`; product behavior = `docs/02_SCOPE_AND_UX.md`; model/math = `docs/04_DATA_AND_AI.md`. Keep matching TS/Pydantic contracts.
5. Forecast must be **genuinely computed** from submitted sales. Use ridge regression with historical lag/rolling/calendar features when enough dense daily history exists, compare against transparent seasonal-naive baseline using recursive chronological 14-day validation. Select lower-MAE method; disclose when baseline wins. Predictions nonnegative, finite; never hallucinate confidence, accuracy or business effects.
6. Inventory decisions use input-driven deterministic math, no LLM for arithmetic. Never display "stockout probability" without calibrated probability. Label projected shortage/risk as scenario from point forecast. Lead time strictly 1–14 days for the 14-day horizon; nonnegative stock/safety inputs; `ceil(max(0, expected_lead_time_demand + safety_stock - stock))`.
7. Synthetic data is conspicuously labeled **"Illustrative synthetic demo data — not real retailer records"** in sample loader, charts, documentation and video. No fictional customer testimonials, revenue claims or unverifiable live production metrics.
8. Restrict CSV to 1 MB and at most 2,000 data rows and 10 SKUs. Reject invalid dates, non-finite or negative units, unknown schema and ambiguous missing days. Do not quietly assume absent days mean zero. Product-specific duplicate date rows may be aggregated (transaction rows). Preview must disclose aggregation.
9. Validate ALL user-controlled inputs server-side; return structured API errors. Bound training CPU and payload complexity. Do not ship secrets, credentials, open CORS wildcard, client-to-vendor API keys, or personal customer data in fixtures.
10. Accessible keyboard navigation, labels, meaningful loading/empty/errors, responsive screens; charts paired with text/table summary. Don't sacrifice core function for animation or cosmetic perfection.
11. Every agent edit must list files touched, exact commands executed, actual test results, unverified behavior and next needed action. Update `docs/DEVELOPMENT_LOG.md`. Do not mark unrun checks as passed.
12. Avoid unrelated refactors, destructive commands, surprise installs/cloud provisioning/spending/public releases. Ask human approval for architectural deviations or costs. Do not automatically deploy publicly.
13. After each phase, run available focused tests, then lint/type/build as appropriate. The owner must review output before next prompt. On build failure, fix cause; never hide it with ignore flags, `any`, skipped tests or fake mock data.

## Non-goals until authorized
Full authentication/tenant separation, PostgreSQL persistence, RAG, agents, MCP, automatic supplier ordering, payments, production claims, custom LLM explainers, large-file storage, unsupported zero-shot production predictions, or arbitrary additional dashboards.

## How to work
First inspect workspace and dependencies; summarize concise implementation plan; then change only files needed for current milestone. Run checks and provide proof. Don't introduce more frameworks/providers without necessity. Record blockers immediately and prefer a truthful smaller demo to an unverified feature.
