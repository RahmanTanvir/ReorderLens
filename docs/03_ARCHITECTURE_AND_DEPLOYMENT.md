# 03 — Architecture, local development and Vercel deployment

## Architecture decision: two Vercel projects in one Git repository

```
reorderlens-ai/                        ← one Git repository, root AGENTS.md
├── web/                               ← Vercel project #1, Next.js/TypeScript
│   ├── app/                            ← /, /import, /forecast, /recommendations, maybe /docs
│   ├── components/
│   ├── lib/                            ← typed client and in-memory React Context
│   ├── public/demo-sales.csv           ← labeled synthetic CSV produced in M2
│   ├── next.config.ts                  ← /backend/:path* → ${BACKEND_URL}/:path*
│   └── package.json
├── backend/                           ← Vercel project #2, Python/FastAPI
│   ├── app.py                          ← exported FastAPI `app` at recognized root
│   ├── models.py                       ← Pydantic request/response
│   ├── csv_processing.py               ← schema and dense-day validation
│   ├── forecasting.py                  ← validation + recursive predictions
│   ├── inventory.py                    ← deterministic formula
│   ├── requirements.txt                ← minimal runtime requirements
│   └── tests/                          ← pytest
├── docs/ ...
├── prompts/ ...
└── AGENTS.md
```

**Why two deployments?** Vercel documents separate Root Directory projects for monorepos. Its multi-service *single-project* option is documented as private beta; don't depend on access. Both frontend and FastAPI still run on Vercel. The frontend uses same-origin external **Next.js rewrites**, so browser requests to `/backend/v1/analyze` are forwarded to the API deployment, removing client CORS dependency. The API is also accessible at its own public URL; don't pretend a rewrite provides authentication.

```
Browser ── HTTPS ──► web Vercel (Next.js)
                         │ GET /, /forecast ...
                         └─ /backend/v1/* rewrite ──► backend Vercel (FastAPI)
                                                       ├─ parse/validate CSV in memory
                                                       ├─ sklearn ridge vs naive
                                                       └─ deterministic reorder calculations
                                                          (stateless JSON response)
```

**Source references:** https://vercel.com/docs/monorepos ; https://vercel.com/docs/frameworks/backend/fastapi ; https://vercel.com/docs/services ; https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites ; https://vercel.com/docs/functions/limitations . Verify actual live provider behavior when deploying.

## Strict boundaries
- No PostgreSQL for overnight demo. Results in React Context memory and API is stateless; no false persistent inventory claims.
- Python FastAPI accepts multipart CSV `POST /v1/analyze`, and JSON `POST /v1/recommendations`; `GET /health`. Authoritative contract `docs/05_API_CONTRACTS.md`.
- One separate forecasting execution per upload, limited to ≤1 MB, 2,000 rows, 10 SKUs. User settings changes should call inventory only, not retrain forecast.
- The browser never supplies secrets; `BACKEND_URL` is a server configuration variable, not necessarily a secret but keep it nonpublic environment config (no `NEXT_PUBLIC_` prefix). API doesn't require third-party AI keys.
- Avoid server writes and background tasks. Production serverless requests don't reliably preserve process memory or local filesystem across invocations.

## Dependency selection
- **Web:** Next.js App Router, React, TypeScript, Tailwind, shadcn/ui *only for components necessary*, Recharts. Confirm actual package and Node versions in environment before installation; commit lockfile. Avoid extra animation/theme builders.
- **API:** Python 3.12+, `fastapi`, `uvicorn` (local), `python-multipart` (upload), `pandas`, `numpy` (required by scientific stack), `scikit-learn`, `pydantic`, `pytest` for tests. Keep requirements minimal; don't bundle Jupyter, huge data files or model checkpoints.
- The ridge model trains in memory per request; no cost-bearing hosted LLM/feature store/managed DB.

## Environment examples
`web/.env.local` (local only; do not commit):

```dotenv
BACKEND_URL=http://127.0.0.1:8000
```

Vercel Web project: set `BACKEND_URL=https://<ACTUAL-DEPLOYED-API-ORIGIN>` (no trailing slash), then redeploy web so rewrites point at the deployed API. Use a real stable production API deployment URL; never paste placeholder into working configuration. Add `BACKEND_URL` to `web/.env.example` without real host.

The Next.js rewrite implementation should validate the URL and fail loudly on misconfiguration in production, while defaulting to `http://127.0.0.1:8000` only for local development. **Do not** expose Python environment secrets through browser bundles.

## Local run / test plan (once implementation exists)
1. Backend from `backend/`:
   ```bash
   python -m venv .venv
   # macOS/Linux: source .venv/bin/activate
   # Windows PowerShell: .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python -m uvicorn app:app --reload --port 8000
   ```
2. Frontend from `web/`:
   ```bash
   npm install
   # Create .env.local from .env.example; set BACKEND_URL as above
   npm run dev
   ```
3. Verify Python http://127.0.0.1:8000/health and frontend http://localhost:3000/backend/health, then complete UI workflow.
4. Focused validation:
   ```bash
   # backend/
   python -m pytest -q
   # web/
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
   Antigravity must establish package scripts and test runner first; these commands are **instructions**, not evidence of existing passing tests.

## Vercel deployment — human-approved public release step
1. Commit tested source to Git (without `.env.local`, recordings, uploads, or secrets).
2. Vercel dashboard **Add New Project** → import same repository → Root Directory `backend` → detect **FastAPI** with root `app.py` exporting `app`. Confirm Python/runtime dependency build and `/health` on real preview URL. Check runtime errors/bundle sizes.
3. Deploy API production when owner approves public release; copy actual stable API origin. Keep minimal public endpoints. No wildcard production CORS; same-origin web rewrite is preferred.
4. Add second Vercel project from same Git repo → Root Directory `web` → Next.js; configure `BACKEND_URL=https://<stable-api-origin>` for production and preview appropriately. Build/redeploy. Confirm `/backend/health` from web origin reaches API.
5. Verify uploaded sample from web origin; call `/backend/v1/analyze`; change recommendation inputs; check a mobile viewport; verify meaningful errors; inspect public HTTP and function logs without revealing raw sales or secrets.
6. Save deployed URLs in `docs/DEVELOPMENT_LOG.md` and verify actual date/status. If no successful public deployment, record and demonstrate a **locally running** real app without claiming it is hosted.

## Deployment failure gates
- If Vercel cannot package `pandas`/`scikit-learn` or model timing exceeds acceptable limits: inspect logs, reduce dependencies or request sizes; do **not** quietly replace ML with hardcoded results.
- A TypeScript-only service, external Python hosting provider, additional database or paid plan would be an **architectural deviation requiring owner approval**. The allowed immediate fallback is a truthful local prototype demonstration; the long-term Vercel objective remains.
- Vercel Function request/response limit documented at **4.5 MB**; our stricter 1 MB CSV and bounded JSON avoid most upload problems, but must still be verified live.
- No plan for large UCI Excel workbook directly uploaded to this demo. That source may be used later after lawful conversion/cleaning and proper data disclosure.

## Observability
Use backend logs for endpoint status, latency, counts of accepted/failed rows and model method *without raw rows, names or uploaded data*. Respond with stable error codes, not stack traces. Browser shows human-readable error + retry option. Avoid adding analytics and tracking SDKs tonight.
