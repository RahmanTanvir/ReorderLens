# 09 — Three-minute video, preliminary summary, evidence register

**Source requirement:** Organizer Submission Rules v1.1 published at https://cloudcampbd.com/events/ai-builders-congress/policies/submission . Prelim submission calls for **one-page structured summary** and **three-minute concept/prototype demo**. The official dashboard's live cutoff/upload mechanism has not been inspected. This document is a *rehearsal framework*, not a finished slide deck or asserted uploaded submission.

## Recording plan (≤180 seconds)

| Time | Visuals | Spoken message objective |
|---|---|---|
| 0:00–0:25 | Product name, problem illustration (plain text) | Bangladesh SMEs may restock by intuition; stockouts and excess tie up sales/cash (general problem, not invented survey). |
| 0:25–0:45 | Overview / visible demo label | What ReorderLens AI does: imports sales, estimates demand, recommends replenishment; no guaranteed uplift claim. |
| 0:45–1:10 | Import screen, click labeled sample CSV | Show *actual server import* and accepted records; explicitly say synthetic sample is illustrative. |
| 1:10–1:45 | Forecast screen / choose SKU | Show historical and 14-day forecast, chosen method and validation MAE versus baseline; state model selection and limitations accurately. |
| 1:45–2:20 | Recommendation screen | Enter stock, lead days, safety stock, show actual recalculation and explanation; increase stock to show output changes. |
| 2:20–2:40 | `/docs` if shipped, or architecture graphic | Briefly explain Python/FastAPI ML engine, Next.js, deterministic inventory rules, human approval and data boundaries. |
| 2:40–3:00 | Summary + disclosure/next steps | Potential of reducing avoidable shortages; limitations, real-data validation, authentication/DB to follow; no invented impact. |

## Video capture rules
- Capture the browser and real network-backed responses. Do not animate a fake forecast, splice unrelated screens as if one transaction, or describe untested features as operational.
- Hide browser accounts/tokens, private URLs and uploaded confidential data. Record at 1080p if possible; readable zoom; cursor motion intentional.
- Make sure synthetic provenance is visible **on screen** and **spoken** at least once.
- If live deployed URL fails, show a real locally running prototype and correctly label it as local. Don't claim Vercel deployment succeeded.
- The owner or a human team member must record/edit/publish and verify that the video plays, runs ≤3 min, has readable visuals and correct audio.

## One-page structured summary outline (write/validate later from real state)
1. **Title / track:** ReorderLens AI — DemandIQ, CommerceSphere AI, The White Hole (four human members).
2. **Problem / customer:** practical SME stocking decisions; risk of under/overstock.
3. **Solution and demonstrable flow:** sales CSV → quality checks → product-level 14-day forecasting → explainable reorder suggestions.
4. **AI approach:** ridge regression vs seasonal naive; time-ordered 14-day validation; select by observed MAE, fallback for insufficient history. State actual achieved results only if tests recorded.
5. **Architecture:** Next.js/React/TypeScript frontend; Python FastAPI backend; stateless prototype; Vercel only if deployed and checked.
6. **Responsible AI / localization:** clearly synthetic sample, no private data, no automated purchasing, Bangladesh target and Bangla localization consideration, forecast/censored-sales limitations.
7. **Measured evidence / KPIs:** actual functional checks and validation on sample, not fabricated accuracy or economic benefit. Future KPIs: forecast MAE relative to simple baseline, simulated stockout days under documented assumptions, field stockouts and excess inventory only after real pilot.
8. **Next steps:** real retailer validation, data rights, login/multi-tenant storage, broader demand drivers, rigorous testing and outcome evaluation.

## Claim-to-evidence checklist (populate when done)

| Claim for video/summary | Required real evidence | Status at kit creation |
|---|---|---|
| “CSV importer works” | Successful file upload + preview/log/HTTP 200 | Not established |
| “We predict demand” | Real algorithm + changing predictions when input changes | Not established |
| “We compare models” | Executed ridge/baseline validation with actual output MAEs | Not established |
| “Reorders update with stock” | Recording of input change and API response | Not established |
| “Hosted on Vercel” | Publicly loaded web and functional API deployment URLs | Not established |
| “Improves revenue/reduces stockouts” | Actual controlled field evidence (or properly labeled simulation for theoretical scenario only) | **Do not claim as achieved** |
| “AI tools used” | Actual tool usage/provenance log | ChatGPT planning confirmed; Antigravity execution pending |

## Submission go/no-go
Confirm owner sees authenticated portal deadline and required fields; one-page actual file and three-minute actual video exist; AI contributions/data use accurately disclosed; four people properly registered; links open without login if organizer expects public; submit, then retain time-stamped receipt. This kit cannot confirm an upload or organizer acceptance.
