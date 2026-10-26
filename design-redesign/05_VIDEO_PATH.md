# Polished 180-second narrated website demo — recording path

This is a **shot sequence**, not an assertion that the redesigned site is working. Use real UI and actual calculated outputs. All scenes should retain clear demo/provenance status without flooding the screen with warnings.

| Time | On screen | What the judges should learn |
|---|---|---|
| **0:00–0:18** | Premium Overview before data: focused value headline and CTAs. | Small retailers must choose when and how much to reorder with limited analytics. |
| **0:18–0:35** | Click `Explore sample data` (or Import → built-in demo). Show dataset labeled synthetic. | The workflow begins with actual daily SKU sales, not fabricated dashboard numbers. |
| **0:35–0:53** | Import success: product count, accepted rows and next CTA. | Real validation and processing take place through the backend. |
| **0:53–1:30** | Forecast chart and model comparisons: Rice, then a product where Ridge wins if the backend reports that. | Forecast methods are compared against baseline on chronological validation, and the chosen method is transparent. |
| **1:30–2:15** | Reorder plan: select Rice; stock 25, lead 7, safety 0; click Calculate; show big result and arithmetic; then set stock 250 and recalculate. | Predictions are transformed into input-driven reorder advice, not just charts. Numbers shown must reflect actual API results (the current fixture screenshot shows 170 expected demand and 145 reorder for stock 25). |
| **2:15–2:34** | Methods & provenance: skim the architecture flow and limits; synthetic and no-persistence badge visible. | The system distinguishes ML estimates, rules-based arithmetic and human control. |
| **2:34–3:00** | Return to dashboard/reorder result and product identity. | Present potential value and next steps without implying proven revenue lift, successful pilots or production persistence. |

**Narration note:** Record voice separately and match the edit to actual interface timings. Keep the total file at or below 180 seconds. Never say “we improved revenue by X%” or “our model is X% accurate” without independent evidence. Technical model-selection MAE on illustrative data is not independent field accuracy. If upload or Vercel deployment does not work, do not fake the action; show only verified local function and disclose prototype status.

**Screen capture checklist:** browser zoom 90–100% so content is readable; stable resolution 1920×1080 or 1600×900; no development-console overlays; clean cursor motion; hover/click only on real controls; record test takes before final narration; never expose secrets or private files.
