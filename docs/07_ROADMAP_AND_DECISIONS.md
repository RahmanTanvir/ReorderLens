# 07 — Roadmap, scope approvals and change control

## Current approvals (owner messages, 26 October 2026)
- Four-member team, target submit October 27, product **ReorderLens AI**, challenge **DemandIQ**, Vercel target.
- Owner approved four-screen CSV → forecast → stock/reorder → explain rapid MVP.
- Owner explicitly approved the expanded rapid MVP plan and requested Antigravity implementation documentation/prompts. This **authorizes package creation**, not unattended public deployment, expense or architecture deviations.

## Prioritized milestones and exit criteria

| Milestone | Depends | Deliverable | Exit condition | Agent prompt |
|---|---|---|---|---|
| 01 foundation | inspected workspace | Single monorepo `web/` + `backend/`, health API, typed client shell | Local Next.js to Python `/backend/health` responds; lint/build and health test verified | `prompts/01_FOUNDATION.md` |
| 02 CSV import | 01 | Upload/parse/error, synthetic fixture, session state | Demo CSV imported via real server pipeline, bad data rejected; upload boundary tests | `prompts/02_IMPORT.md` |
| 03 demand ML | 02 | Ridge + recursive seasonal baseline, validation and 14-day forecast | Actual product-dependent predictions and measured per-upload validation MAEs; tests | `prompts/03_FORECAST.md` |
| 04 inventory | 03 | Deterministic calculation API and interactive recommendation view | Editing stock/lead alters result; test arithmetic and API | `prompts/04_RECOMMENDATIONS.md` |
| 05 UX and docs | 04 | Four polished usable screens, accessible plots, optional `/docs` | No fake stats, no dead controls, responsive/mobile | `prompts/05_UI_AND_DOCS.md` |
| 06 verify/deploy | 05 | Reproducible tests, two Vercel project deployments if approved | Live workflow is smoke-tested or correctly declared local-only | `prompts/06_VERIFY_DEPLOY.md` |
| 07 audit / fixes | 06 | Focused bug fixes, release blockers assessed | Every known P0 addressed or demo limited and disclosed | `prompts/07_FIX_AND_AUDIT.md` |
| 08 submission rehearsal | 07 | Video walkthrough, one-page evidence checklist, provenance | ≤3 min factual story and link/video manually verified | `prompts/08_RELEASE_VIDEO.md` |

## Minimum slice ahead of polish
Functional `analyze` API + minimal CSV upload + a forecast + one recommendation is more valuable than fully styled static pages. If clock pressure mounts, skip `/docs`, exports and fancy charts; **never** skip real input→forecast→recommendation or honest disclosures. Prepare video even if Vercel blocked (state local-only).

## Implementation assumptions to test early
- New repo unless actual existing source inspected.
- Python 3.12+, Node current LTS, Vercel accounts and Antigravity installed **not verified**.
- Two Vercel projects are feasible with the owner's plan; external rewrite works after environment config.
- Model/data processing fits request latency and Python bundle; must test rather than assume.

## Decision controls

| ID | Decision | Authority | Change gate |
|---|---|---|---|
| D1 | Product name ReorderLens AI | Owner-confirmed | Explicit owner approval |
| D2 | Selected challenge DemandIQ / CommerceSphere AI | Owner-confirmed | Not reopened without material contradiction |
| D3 | Four screens and end-to-end proof | Owner-approved rapid plan | Explicit owner approval for reduction of the core |
| D4 | Next.js + TS / FastAPI + Python / Vercel | Approved rapid plan | Owner approval for major hosting/language changes |
| D5 | Small stateless demo, no auth or DB | Approved rapid plan | Owner approval for scope expansion after functional core |
| D6 | Ridge + baseline method selection on validation | Approved rapid plan, concretized here | Must disclose changed method; substantive redesign consult owner |
| D7 | One Git repo / two Vercel Projects + external rewrite | Engineering implementation detail of Vercel target; test live | If beta multi-service, one-project switch, other hosts or paid plans proposed: review first |
| D8 | Illustrative synthetic fixture clearly labeled | Approved honest demonstration approach | Real authorized data optional but must check licenses/privacy |
| D9 | 14-day forecast/lead time capped at 14 | Implementation constraint for coherent inventory math | Document and approve changing horizon |

## Unresolved and not permission to invent
- Exact bound preliminary deadline in account and timezone; form/portal may demand extra artifacts.
- Owner's final actual submission answers vs previous drafts, including whether `/docs` commitment checked.
- Binding Congress judging criteria; screenshots and organizer posts conflict.
- Whether local machine, Vercel account and code repo are ready; no repository has been inspected at authoring time.
- Actual model generalization; no real retailer field data or KPI uplift.

## Change control template
Before a material deviation, summarize: **observed blocker → smallest alternatives → effect on approved criteria and demo → costs/security impact → proposed choice → owner approval**. Update contracts/decisions, then code; don't silently drift. Fixing bugs within approved architecture does not require a new planning round.
