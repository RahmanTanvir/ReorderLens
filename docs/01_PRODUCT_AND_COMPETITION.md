# 01 — Product, competition and evidence status

## Product identity and constraints
- **Competition**: International AI Builders Congress 2026, Idea to Unicorn / Team-Built Product; organizer identified in handover as CloudCamp Bangladesh in cooperation with Daffodil International University.
- **Challenge**: **DemandIQ**, domain **CommerceSphere AI**. Official screenshot subtitle: **“Demand forecasting and inventory intelligence for SMEs”**; specific ask **“Revenue up, stockouts down”**; technical direction **“Time-series ML + dashboards + APIs”**. The screenshot supplies illustrative advanced techniques, *not mandatory algorithms*.
- **Brand**: **ReorderLens AI** (owner approved; DemandIQ is the challenge label, not UI product name).
- **Team**: **The White Hole**; four human members, user-confirmed October 26. Prior notes identify one primary human developer; do not attribute unverified code or contributions to other members.
- **Primary audience**: small and medium retail businesses, Bangladesh-first. Target is a hypothesis; no customer interviews or traction verified.
- **Target outcome**: aid stock decisions, potentially reduce shortages and overstock. **Do not assert achieved revenue gain, fewer stockouts, or accurate forecasting before tests/pilots.**
- **Internal target**: user wants working prototype and video for October 27, 2026. Previous organizer-published team deadline was October 31, 2026, with exact portal cutoff not independently verified. User internal target takes priority for scheduling.

## Competition prelim requirements (from organizer submission policy v1.1)
One-page structured summary and a **three-minute** concept/prototype demonstration, covering target users/problem, AI solution, prototype/flow, data/tools/workflow, potential outcomes/KPIs and next steps; show system thinking; localization consideration; originality, lawful data use and transparent provenance. Video may show a prototype or system walkthrough, but **fabricated functionality/results are prohibited**. Final form wording and upload portal still must be checked by owner.

## Known rubric conflict — DO NOT pretend resolved
Earlier Congress organizer-authored article describes 5 x 20% areas; screenshot supplied to previous conversation describes 6 categories (20/20/20/20/10/10), possibly derived from a different organizer competition. Neither should silently be used as the binding current scoring grid. For MVP prioritize credible innovation, working technical demonstration, business logic, ethical AI, and presentation without assigning official numeric scores. Full details and links: `reference/DEMANDIQ_MASTER_CONTEXT.md`, `docs/10_EVIDENCE_SOURCES.md`.

## User-confirmed / owner-approved versus unverified

| Claim | Classification |
|---|---|
| DemandIQ / CommerceSphere AI selected | Approved + owner provided screenshot evidence |
| ReorderLens AI brand | Approved |
| Four human team members | User-provided; registration details still portal-dependent |
| Four-screen MVP, Next.js, Python/FastAPI, Vercel | Approved *for emergency prototype*, not an assertion that code exists |
| Three-minute video and one-page summary | Organizer published requirement |
| Draft form answers | Drafts only; final saved/submitted version not available |
| Real trained/deployed forecast, measured accuracy, retailer validation | **Not established** |
| Exact authenticated deadline, binding rubric | **Unresolved** |

## Core demonstration promise
For a single small retailer, accept authorized daily sales CSV; show a product's history and a real 14-day point forecast; compare ML to a baseline using time-order validation; take stock and lead days and show projected shortage and simple reorder quantity with explanations. Decision remains with retailer.

## Required honest limitation statement
"This is a preliminary single-user demonstration using illustrative synthetic sales data. Predictions and reorder quantities are model-based estimates, not guarantees. Sales history may understate demand when products were unavailable. The demo does not yet provide authentication, persistent cloud inventory records, validated field impact or automated purchasing."
