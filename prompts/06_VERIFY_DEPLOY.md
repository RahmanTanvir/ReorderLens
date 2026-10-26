# 06 — Milestone 6: rigorous testing and the two Vercel deployments

```text
ReorderLens AI Milestone 06, validation and deployment preparation. Read AGENTS.md, docs/03_ARCHITECTURE_AND_DEPLOYMENT.md, docs/05_API_CONTRACTS.md, docs/06_TESTING_AND_ACCEPTANCE.md, docs/07_ROADMAP_AND_DECISIONS.md, docs/08_SECURITY_AND_PROVENANCE.md. Inspect git diff, dependencies, files, real runtime versions and previous test logs. DO NOT invent a deployment or make one without explicit human confirmation of target Vercel account and publication.

First produce a concise deployment-ready audit: run and report exact `python -m pytest -q` from backend, `npm run lint` (if script) + `npx tsc --noEmit` + `npm run build` from web. Run a real localhost health proxy, CSV import, 14-day forecast, inventory recalculation and error/empty state end-to-end. Verify no environment secrets or confidential uploads checked into git. Check model latency and dependency/bundle size where possible; report actual numbers only. Fix only genuine blockers, don't silence TS/lint/test errors with suppression flags.

Then prepare TWO Vercel project deployments from same Git repo: backend project Root Directory backend with FastAPI app.py and minimal requirements, web project Root Directory web with Next.js. Verify separate Root Directory support and API health at real deployment URL. Set web `BACKEND_URL` to *actual API origin* (no slash), use Next.js rewrite `/backend/:path*` forwarding to API, redeploy web. Deploy API first, then web. No experimental Vercel multi-services, no surprise other cloud provider. If cloud login/permissions/provisioning require human, stop and provide precise dashboard actions rather than claiming them complete.

If the human owner explicitly authorizes production/public deploy, make change using existing authorized account, then VERIFY public web origin + /backend/health, import fixture, chosen method + MAEs, stock and lead recomputation, error handling, no console errors. Capture actual URLs and smoke-test results. If Vercel fails, preserve a real localhost working prototype as truthful video fallback; report deployment failed, not "deployed". Don't switch away from Python/Vercel stack without approval.

Update docs/DEVELOPMENT_LOG.md with exact build, deploy and browser test evidence. End by listing blockers and asking human go/no-go for public link and recording; stop, do not start video generation by yourself.
```

## M6 acceptance
Tests/reports are actual; Vercel public status is *verified URL+working user flow* or transparently *not deployed*. Empty state after refresh is a documented expected limitation.
