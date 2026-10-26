# 08 — Responsible AI, privacy, provenance and tool disclosure

## MVP security posture — explicitly *not* production-ready
The emergency prototype has **no login, no tenant isolation, no durable data store, no supplier ordering**. Therefore **only synthetic or explicitly authorized non-sensitive CSV files** should be used on the publicly accessible demo. Do not invite real SMEs to upload confidential sales to an unauthenticated endpoint. The fact that the demo uses HTTPS does not make it production secure.

### Technical controls required
- Bound uploaded file size (1MB), rows (2,000), SKUs (10), per-SKU days, training work and response size. Parse CSV as **data**, never evaluate uploaded text as code; avoid formula-cell interpretation if exporting.
- Validate data/date/numeric types strictly on server. Limit malformed rows and error output. Reject unknown fields instead of dumping them in error responses.
- Pydantic validation on recommendation input; require finite numbers and valid next-14-dates. Ensure code does not trust client-provided forecast claims as independently verified: recommendations are explicitly conditional on supplied forecast.
- No raw data or secrets in logs. Avoid storing raw file in filesystem, analytics, cookies, localStorage or background job; React Context may hold computed response until refresh/tab close.
- If exposing API publicly, acknowledge potential abuse; use Vercel-provided platform limits/firewall **if configured** and keep algorithm compute bounded. Do **not** claim active rate limiting unless deployed and tested.
- No `Access-Control-Allow-Origin: *` as a substitute for authorization. Same-origin Next.js rewrite is preferred; API origin remains separately public.
- `.env*` files with credentials excluded from version control; provide `.env.example` with placeholders only.
- Public demo includes visible "Prototype / Demo mode / No saved data" notice.

## AI interpretation, limits, oversight
- ML forecasts are estimates based on historical **observed sales**, not uncensored customer demand. Inventory shortages can censor historical sales.
- Model compares ridge vs seasonal-naive on last 14 chronological days **for validation/model selection**; selected result is *not* evidence of field impact or an unbiased independent test.
- Reorder math is deterministic; text explanation derives from numeric backend outputs, not invented LLM reasoning. Retailer reviews before purchasing.
- No claims of calibrated probabilities, guaranteed savings, real customers, human interviews, trained production LLM, RAG or automated agents.
- No user-specific personal customer data required for input schema.

## AI-assisted development provenance
The owner has documented ChatGPT use for challenge evaluation, drafting and design. Google Antigravity is selected for coding, but no Antigravity code run is verified at kit creation. Prior form checkboxes for Gemini/DeepSeek/Llama/Qwen and visual builders **do not independently prove actual usage**; disclose only tools genuinely used, tasks performed and human review. Capture in `docs/DEVELOPMENT_LOG.md`:

| Date | Human/AI tool | Purpose | Output files | Human review/test | Disclosure note |
|---|---|---|---|---|---|
| Before implementation | ChatGPT | Requirements comparison, approved scope, architecture and this instruction kit | Markdown documentation kit | User approved plan; code not produced | Planning assistance only |

Add lines only after real implementation. Four human registered members is user-confirmed; **do not invent particular team members' contributions**.

## Dataset provenance
Built-in fixture is **deterministic generated synthetic**, clearly labeled in all surfaces. Public candidate UCI Online Retail II, CC BY 4.0, is mentioned in draft material but **is not integrated into this MVP**. Any later UCI-derived material must retain attribution, check original terms, and disclose cleaning/limitations. External retailer data must be permissioned and protected; not suitable for this unauthenticated emergency demo.

## Risk review before demo
- Verify client-visible labels are not removed by theme changes.
- Upload unknown CSVs only as permitted test cases, never confidential company sales.
- Browser development tools should not reveal secrets, PII, endpoint stack traces or misleading saved state.
- Clarify whether cloud provider processes data in its region; do **not** promise data residency or comprehensive regulatory compliance without actual evidence.
