# ReorderLens AI — Antigravity rapid MVP implementation kit

**Challenge:** DemandIQ — CommerceSphere AI, International AI Builders Congress 2026  
**Team:** The White Hole, four human members (owner-provided)  
**Product:** ReorderLens AI  
**Prepared:** 26 October 2026 (Asia/Dhaka)  
**Objective:** functional preliminary prototype + truthful three-minute concept/demo video  
**Internal submission target:** 27 October 2026 (owner-provided); organizer-published preliminary date in earlier sources: 31 October 2026, exact portal cutoff not reverified  
**Status:** this kit is *approved implementation instructions and planning documentation*. It is **not** an implemented, tested, or deployed application.

## Open this first

1. Unzip this package into a **new or existing ReorderLens AI Git repository**. Do **not** replace existing source files without reviewing differences. The files in this package describe and prompt implementation; they do not themselves constitute working app code.
2. Open that folder as your Antigravity **Project/workspace**. Keep root `AGENTS.md` where it is: Antigravity recognizes root `AGENTS.md` or `GEMINI.md` as workspace rules according to its [Rules documentation](https://antigravity.google/docs/rules/). We deliberately provide **one** root rules file to avoid conflicts.
3. Open [`prompts/00_START_HERE.md`](prompts/00_START_HERE.md). Paste **its first prompt** into Antigravity. Start at milestone 01. Do not paste every phase prompt together.
4. After each milestone: inspect diffs, run the stated checks, complete manual checks, commit a known-good checkpoint, and update [`docs/DEVELOPMENT_LOG.md`](docs/DEVELOPMENT_LOG.md).
5. Deploy **backend Vercel project first**; then set the frontend backend-origin variable and deploy **frontend Vercel project**. This is intentionally **two Vercel projects linked to one Git repository**, not an unverified single-project multi-runtime configuration.
6. Record the video **only after** seeing the real end-to-end flow run; use [`docs/09_DEMO_AND_SUBMISSION.md`](docs/09_DEMO_AND_SUBMISSION.md).

## Document map (source of truth)

| Path | Authority / purpose |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Binding developer/Antigravity code-editing rules for this approved rapid MVP. |
| [`docs/01_PRODUCT_AND_COMPETITION.md`](docs/01_PRODUCT_AND_COMPETITION.md) | Challenge alignment, authentic value proposition, label of approved/unknown. |
| [`docs/02_SCOPE_AND_UX.md`](docs/02_SCOPE_AND_UX.md) | P0 product behavior, four screens, accessibility and state coverage. |
| [`docs/03_ARCHITECTURE_AND_DEPLOYMENT.md`](docs/03_ARCHITECTURE_AND_DEPLOYMENT.md) | Approved MVP technical design, Vercel split deployments and proxy routing. |
| [`docs/04_DATA_AND_AI.md`](docs/04_DATA_AND_AI.md) | CSV conventions, leakage-safe forecasting, selection metrics and inventory formula. |
| [`docs/05_API_CONTRACTS.md`](docs/05_API_CONTRACTS.md) | Authoritative HTTP contracts and typed JSON shapes. |
| [`docs/06_TESTING_AND_ACCEPTANCE.md`](docs/06_TESTING_AND_ACCEPTANCE.md) | Non-negotiable automated/manual test matrix and release criteria. |
| [`docs/07_ROADMAP_AND_DECISIONS.md`](docs/07_ROADMAP_AND_DECISIONS.md) | Milestones, approvals, fallback boundaries, decision log. |
| [`docs/08_SECURITY_AND_PROVENANCE.md`](docs/08_SECURITY_AND_PROVENANCE.md) | Demo data labeling, privacy, secure uploads and AI disclosures. |
| [`docs/09_DEMO_AND_SUBMISSION.md`](docs/09_DEMO_AND_SUBMISSION.md) | Three-minute video, one-page outline, honesty/evidence checklist. |
| [`docs/10_EVIDENCE_SOURCES.md`](docs/10_EVIDENCE_SOURCES.md) | Official/reference links and unresolved judging/submission claims. |
| [`docs/DEVELOPMENT_LOG.md`](docs/DEVELOPMENT_LOG.md) | Real progress and test evidence; initially empty by design. |
| [`prompts/00_START_HERE.md`](prompts/00_START_HERE.md) | Operating procedure and first Antigravity prompt. |
| [`prompts/01_FOUNDATION.md`](prompts/01_FOUNDATION.md) ... [`prompts/08_RELEASE_VIDEO.md`](prompts/08_RELEASE_VIDEO.md) | Self-contained, sequential agent prompts; review each before moving on. |
| [`reference/`](reference/) | Prior handover/master instructions and submission drafts; **historical context**, superseded by approved emergency MVP where conflicting. |
| [`examples/`](examples/) | Illustrative sample CSV header and environment variable examples; not real training data or credentials. |

## Explicitly approved in this conversation

- Official challenge **DemandIQ**; product name **ReorderLens AI**; team **The White Hole** with **four members**.
- Four-screen rapid MVP: overview, CSV import, demand forecasting, inventory recommendations; genuine computation and interpretable results.
- Next.js/TypeScript + Tailwind/shadcn/ui/Recharts; Python/FastAPI/Pandas/scikit-learn; Vercel host; small scoped datasets; stateless preliminary proof of concept; optional `/docs` if achievable.
- Human-reviewed purchasing advice, meaningful baseline comparison, accurate synthetic-demo labeling; **no false deployed/pilot/accuracy claims**.
- **Implementation plan approved** on 26 October 2026; user expressly authorized creating Antigravity docs and prompts.

## Crucial reality check

No application repository/code, model, integration, automated tests, or Vercel deployment was provided for inspection **when this kit was authored**. Antigravity must inspect the user's actual workspace first. Do not mark tasks done because they are described here. The final saved competition-form answers, authenticated account deadline and exact binding rubric are **not verified**.

## Minimal successful demo

**Load clearly labeled sample CSV → inspect accepted records → choose an SKU → display a genuine 14-day forecast + baseline validation → edit current stock and lead time → show recomputed shortage/reorder quantity and explanation.** The live deployment must survive refreshing and returning to a graceful empty/demo-start state; unpersisted data **must not be represented as stored**.
