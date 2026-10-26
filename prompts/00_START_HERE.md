# 00 — Using the prompts safely in Google Antigravity

## Before first prompt
1. Put *this kit's contents* in your ReorderLens AI project folder, preserving root `AGENTS.md` and all `docs/` and `prompts/` paths. If application code already exists, inspect it and do not overwrite. Create a Git repository/checkpoint if needed.
2. Open the folder as an Antigravity Project; confirm rules are active. Google officially supports root `AGENTS.md` as a workspace instruction file: https://antigravity.google/docs/rules/ . There is intentionally **no** duplicate `GEMINI.md`.
3. The owner approved the emergency MVP plan, not cloud charges/public release. Keep agent tool execution and code diffs under review. No background autonomous agents making unrelated edits.
4. Paste the **first prompt** below, let it inspect and propose changes, then continue in sequence `01` to `08`, **one at a time**. Each phase file is a self-contained instruction to paste into Antigravity, not executable source code.

## First prompt — inspect and prepare, before modifying app code

```text
You are working in the ReorderLens AI project for the DemandIQ competition challenge. The human owner explicitly approved a narrow rapid MVP and authorized this implementation package. Before changing anything, read root AGENTS.md, README.md, docs/01_PRODUCT_AND_COMPETITION.md, docs/02_SCOPE_AND_UX.md, docs/03_ARCHITECTURE_AND_DEPLOYMENT.md, docs/04_DATA_AND_AI.md, docs/05_API_CONTRACTS.md, docs/06_TESTING_AND_ACCEPTANCE.md, docs/07_ROADMAP_AND_DECISIONS.md and docs/08_SECURITY_AND_PROVENANCE.md. Inspect the actual entire workspace, existing source, git status, installed runtimes and package managers. Do not assume there is already working code. Summarize: (1) what exists, (2) missing dependencies/accounts, (3) conflicts with approved MVP, (4) precise changes for Milestone 01 only, (5) tests and commands you will execute. Do not deploy, buy services, delete user work, or rewrite the architecture. If no source exists, propose clean web/ and backend/ folders, with two separately deployable Vercel projects. Stop after this concise plan so I can review it, then perform the M1 work from prompts/01_FOUNDATION.md only when I direct you to proceed.
```

## Universal execution contract for every phase
- Inspect actual current files/dependencies before changing them; read required docs. If a material architecture or API contract conflict appears, **stop and present choice**.
- Change only the current milestone; avoid imaginary demos and unrelated refactors.
- Create focused tests, run them and report exact output. If the environment lacks dependencies/network, state what wasn't checked. Never mark skipped checks as passed.
- Maintain current product name, real calculation pipeline and synthetic-demo labels. Never store uploaded records persistently or expose API keys.
- End with concise `Changed / Implemented / Tests actually run / Manual checks / Failing or unverified / Next` and append verified facts to `docs/DEVELOPMENT_LOG.md`.
- Request human milestone review before moving forward.

## Emergency prioritization
P0 = functionality: sample upload, real baseline, ridge selection, inventory calculation. P1 = styling, docs, deployment once functioning. If interrupted, save the functional baseline prototype and record exactly what is and isn't built; it can still support an honest video.
