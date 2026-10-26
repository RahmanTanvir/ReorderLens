# Antigravity Implementation Task — Full ReorderLens AI Premium Redesign

**PASTE THE FOLLOWING TASK INTO GOOGLE ANTIGRAVITY WHILE THE EXISTING WORKING REORDERLENS AI REPOSITORY IS OPEN.** Place this Markdown and its `reference/current-ui/` sibling files under e.g. `design-redesign/` in the same repository so the agent can read them. The user has approved a full front-end redesign preserving the current product's scope; do not await a second approval for routine styling/component changes. Ask before genuinely major architecture changes, spending money, deleting data or deploying publicly.

---

You are the principal UX engineer, design-system lead, and senior frontend developer for ReorderLens AI. **This is an IMPLEMENTATION request, not an abstract design critique.** Redesign ALL existing routes and their responsive/interactions in the existing codebase. Do not merely return recommendations or a mockup.

## 0. Authoritative context and inspection gate

Before editing anything:

1. Read root `AGENTS.md`, `README.md`, `docs/02_SCOPE_AND_UX.md`, `docs/04_DATA_AND_AI.md`, `docs/05_API_CONTRACTS.md`, `docs/06_TESTING_AND_ACCEPTANCE.md`, `docs/08_SECURITY_AND_PROVENANCE.md` **where present**. If actual names differ, report findings rather than pretending to have read them.
2. Read `design-redesign/01_SCREENSHOT_AUDIT.md` and `design-redesign/02_DESIGN_SYSTEM_AND_SCREEN_SPECS.md`, plus inspect all seven `design-redesign/reference/current-ui/*.png`. These reference images show current state, NOT target.
3. Inventory actual frontend routes, `package.json`, CSS/global styles, Tailwind setup, layout/navigation, components, API client, charting code, loaded/empty/error states and any current tests. Inspect actual backend schema/health/recommendations as necessary, **without changing ML algorithms or API contracts**.
4. Launch or inspect baseline app if possible. Confirm what is verified to work. Create a reversible Git checkpoint (a commit only if local workspace policies permit and changes are clean; never push without permission). Preserve all secrets, `.env*` and infrastructure settings.
5. Give a short **observed codebase audit** and a prioritized edit map **based on real files** (not guesses), then proceed to implement the full redesign in this same task. Do not stop after delivering a plan unless you discover an architectural conflict that could break behavior.

## 1. Core product mission

ReorderLens AI is a preliminary **DemandIQ** competition prototype: retailers import daily sales → compare forecast methods → view a 14-day product demand estimate → supply stock and lead days → receive transparent, deterministic reorder advice. Current demo is stateless and uses conspicuously **synthetic** sample data. No authentication/persistence/confirmed revenue uplift/automatic supplier orders/calibrated stockout probability. **Preserve full functionality, scientific limits and provenance.** The screenshots currently show 3 demo SKUs and historical counts; derive every metric and result from actual state/API, not constants.

**Design direction:** "Inventory, in focus." An elegant, calm, confident inventory operations cockpit. Near-white canvas, midnight ink, deep-teal signature color, thoughtful amber/red caution states, excellent typography, compact readable labels, restrained borders/shadows, prominent useful charts. No giant gradients, neon, glassmorphism, animated background, generic AI chatbot vibes, fake dashboards or decorative controls. Match the visual and interaction conventions defined in the provided spec.

## 2. Refactor design system and app shell, without breaking architecture

- Implement coherent semantic color tokens and consistent type scale/spacing/radii from `02_DESIGN_SYSTEM_AND_SCREEN_SPECS.md`. Integrate into existing global CSS/Tailwind; do not introduce a separate conflicting styling framework.
- Build/refactor reusable layout and UI primitives (navigation, headers, callouts, metrics, dataset context, status badges, buttons, inputs, table, chart frame, empty/loading/error states), **only when helpful to the existing component structure**. Avoid duplicated JSX/theme styles. Reuse existing icon library and dependencies. Do not add packages unless the dependency is genuinely needed and explain why.
- Replace the overprominent full-width API connection panel with a compact but accessible status element that still makes real backend checks and retry available. Consolidate repeated demo/persistence/science banners into one visible trust status plus contextual links; keep full details in Docs.
- Maintain a discoverable nav for all actual routes: Overview, Import Sales, Demand Forecast, Recommendations, Docs & Provenance. A responsive left sidebar or clean modern top shell is acceptable if coherent. Never lose routes, reload session state on navigation, or change existing URLs without updating callers.
- Use true accessible focus/hover/error/disabled states and meaningful feedback. Avoid fake "functional" buttons. Format numerical values with `Intl.NumberFormat` (e.g., eliminate `89.29999999999998 units`) while keeping full computational precision and truthful unit labeling.

## 3. Redesign EVERY screen completely

### A. Overview (empty)
- High-quality first-run welcome with an immediate value proposition and two obvious real actions: `Explore sample data` and `Upload sales CSV`.
- Explain 3-step process succinctly; synthetic/no-persistence context visible but not a 120-word warning panel.
- Empty state should look intentional and useful, not an enormous dashed placeholder; do not show invented KPIs before upload.

### B. Overview (loaded)
- Decision-oriented top headline and a **real** summarized dataset badge. Show useful product/forecast metrics from API; display stockout/risk metric only if stock inputs allow it.
- Product action table optimized for reading: SKU, product, history/next-14-day demand, selected method, action. Unit formatting and column priority for mobile.
- Primary "View forecast" / "Set stock levels" path works. Keep advanced caveats discoverable but not visually dominant.

### C. Import Sales (empty and loaded)
- One primary CSV input / visible demo loader; elegant drag/drop optional but must retain button/keyboard operation. Show exact schema and file bounds within expandable help.
- Same real `/backend/v1/analyze` flow; show loading, error and success correctly. Do not replace with static data.
- Show compact validation stats and SKU summary after successful import; prominent path to forecast; retain detailed data errors and correctly identify synthetic vs uploaded data.

### D. Demand Forecast
- Real chart is the hero—visible near top, with selected SKU, clear observed/forecast boundary, 14-day total and method selection.
- Surface model comparison honestly (some SKUs use seasonal_naive, others ridge) including actual holdout MAE where available. Do not claim independent holdout performance or actual stockout probabilities.
- Place technical feature list/censoring caveats in expandable method section without removing access. Accessible tooltip/date axis/units and textual series summary. Loading/insufficient-history fallback should be coherent.

### E. Recommendations
- Visually strongest screen: decision-first headline `Reorder X units` from the **real API**, near parameters driving it, with short explanations of expected lead-time demand, on-hand stock and projected shortage. Current example from screenshots: for Rice/7-day lead/25 stock/0 safety the actual result shows expected demand 170, reorder 145; this is only reference context, **not a constant**.
- Keep true input validation and 1–14 day limit. Button must call existing backend recommendations endpoint. Export CSV must export current computed result. Display backend failure/retry states accurately.
- Make arithmetic legible in a formula strip; do not present projected risk class as calibrated likelihood. No automated ordering button.

### F. Docs & Provenance
- Turn dense wall-of-text into clean technical editorial docs with concise anchored section navigation and progressive disclosure: architecture, forecasting selection, data lineage/privacy, constraints and caveats, system status. Preserve ALL meaningful factual content, though copy may become clearer.
- Explain the actual FastAPI/Next.js architecture, sample data, chronological validation and baseline selections, no-persistence limit, stockout censoring and no demonstrated field ROI. Links/buttons navigate correctly.

## 4. Functional integrity (highest priority)

- Backend endpoints, payload shapes, user CSV rules, the model comparison, calculated forecast, stock recommendation math and export stay unchanged unless a **confirmed** defect requires a minimal compatible fix.
- Keep the actual 3-SKU demo fixture, derived historical units, per-SKU selected algorithm, 14-day forecast values and data provenance dynamic; do not hardcode screenshot numbers. If the user uploads the separate 5-SKU sample, UI should adapt.
- Never hide error states, mock responses, or mark API healthy from static UI. Session state remains in-memory only, and a refresh can return to the documented empty state.
- Guard against reading NaN/Infinity or long floating artifacts. Display nonnegative predicted units with appropriate decimals. Do not round underlying calculations before recommendation math.
- Preserve any existing direct browser path and deep-link behavior where possible. Do not change Next.js routing/backend rewrites simply to achieve a prettier nav.

## 5. Responsive, accessible, testable design

- Verify layouts at **1440×900, 1280×800, 768×1024, 390×844, and 320×568** (browser or Playwright screenshot tools if available). Document actual viewports inspected; if you cannot inspect live viewport, label as unverified.
- No page-level horizontal scrollbar at 390px; no clipped table buttons or input labels; reasonable tap targets; mobile nav usable without hover.
- Inputs labeled and keyboard accessible, status/error live announcements when useful, visible focus outlines, normal-text contrast target WCAG AA, charts have text/legend alternatives, respect reduced-motion preference.
- Use progressive disclosure to remove excessive first-fold technical content without deleting scientific warnings.

## 6. Implementation and final independent validation

Work to completion across ALL five pages. Suggested order: shared shell/tokens → Overview → Import → Forecast → Recommendations → Docs → mobile cleanup → regression tests and screenshot comparison. Do not stop after styling one screen. At every stage keep tests running and preserve the working import→forecast→reorder path.

Then run applicable commands found in actual scripts, typically:
- `npm run lint` (only if defined), `npx tsc --noEmit`, `npm run build` inside actual frontend directory.
- Existing backend test suite, e.g. `python -m pytest -q`, **only if dependencies/setup permit**.
- Start actual dev app and verify API health from browser, import builtin synthetic data, check 3 SKU values, select SKU, inspect chart, enter stock 25 + lead 7 + safety 0 and calculate recommendation, change stock to 250 and recompute, navigate Docs, try invalid CSV, check session reset semantics.
- Inspect 5 listed viewports with screenshots if browser tooling allows. Fix discovered overflow, clipping, contrast and visual inconsistency. Report any test that cannot be run; never claim passed based on inspection alone.
- Save before/after screenshots to a workspace path such as `design-redesign/results/` if possible. Do not replace the screenshot references.

## 7. Required final report

Return in this order:
1. **Inspected actual source files / framework and existing functional paths.**
2. **Implemented redesign summary covering every screen and shared components.**
3. **File-level diff list and changes to dependencies/configuration (if any).**
4. **Exact build/test commands and pass/fail outputs** (do not invent).
5. **Manual workflow tests with actual values and screenshot/viewport results.**
6. **Remaining blockers / known visual flaws / unverified behaviors.**
7. **Video readiness: READY / NOT READY, with factual reasons.**

Add a short, factual note to `docs/DEVELOPMENT_LOG.md` if that file exists. Keep source code editable and maintainable. **Do not push changes, deploy publicly, spend money or remove files without permission.**

This request is authorized for implementing the UI redesign throughout the already approved MVP. It does **not** authorize a new product scope or changing the ML model/DB strategy.
