# 01 — Milestone 1: project foundation and web-to-API connectivity

**Paste the following prompt into Antigravity only after completing the `00_START_HERE.md` inspection and reviewing its plan.**

```text
Implement Milestone 01 of the owner-approved ReorderLens AI rapid MVP. Before code edits, read AGENTS.md, docs/02_SCOPE_AND_UX.md, docs/03_ARCHITECTURE_AND_DEPLOYMENT.md, docs/05_API_CONTRACTS.md, docs/06_TESTING_AND_ACCEPTANCE.md, docs/07_ROADMAP_AND_DECISIONS.md. Inspect current repository and git status; preserve existing working code and dependencies. Do not silently migrate a pre-existing project. Show small plan, then implement only foundation.

Architecture: single Git repository with web/ (Next.js App Router, TypeScript, Tailwind) and backend/ (Python 3.12+ FastAPI, Pydantic); two separate future Vercel Projects using these folders as Root Directory. Do NOT use experimental Vercel Services and do NOT add auth, DB, model, fake KPI or billing dependencies.

Backend:
- Recognized FastAPI entrypoint backend/app.py exporting variable `app`.
- GET /health returns exact JSON contract in docs/05_API_CONTRACTS.md.
- Add minimal requirements.txt and local startup instructions; a pytest/TestClient health test.

Frontend:
- Working Next.js app shell with product name ReorderLens AI, clear "Prototype / demo mode — data is not saved" label and navigation to /, /import, /forecast, /recommendations; empty states explicitly indicate future functionality until implementation. No decorative buttons pretending to work.
- next.config.ts or next.config.js external rewrite `/backend/:path*` to `BACKEND_URL/:path*`; for local only default `http://127.0.0.1:8000`. Validate env in production; preserve base paths.
- A genuine front-to-back health check component that calls `/backend/health` and displays actual response/error, and reusable error/retry component. Do not embed static "API connected" status.
- web/.env.example with nonsecret local BACKEND_URL and .gitignore excluding local env and venv/node_modules.

Test and report: establish dependencies and package scripts, run python -m pytest -q from backend, npm run lint if installed, npx tsc --noEmit, npm run build; start local services if tools permit, verify http://localhost:3000/backend/health calls FastAPI. If the environment prevents a check, say "NOT RUN" and why. Update docs/DEVELOPMENT_LOG.md with real commands/results. Summarize files changed, actual working behavior, blockers. Ask for human review, stop; do not implement CSV or forecast yet.
```

## M1 acceptance gate
- `backend/app.py` exports app; `/health` real.
- `web/` starts, all four routes reachable, truthful empty states; `/backend/health` via Next rewrite succeeds locally.
- No secret or fake business metric; no user-supplied files destroyed.
- Checks genuinely run/reported; if tests fail, stay in M1.
