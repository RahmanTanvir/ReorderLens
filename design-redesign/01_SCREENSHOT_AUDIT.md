# Screenshot-grounded UX and visual audit

**Evidence:** Seven supplied screenshots preserved in `reference/current-ui/`. These are direct visual observations, not source-code findings or confirmed bugs. Interactions, accessibility, builds and responsive layouts cannot be established from screenshots alone.

## Structural issues across all pages (P0)

1. **Poor first-use narrative.** The opening viewport is dominated by infrastructure status, disclaimers and broad feature copy; the actual retailer payoff (forecast-to-reorder decision) appears late or below the fold. The product looks like a technical proof-of-concept rather than an inventory decisions cockpit.
2. **Repeated status/disclosure bars.** Stateless, synthetic-data, backend status and scientific caveats recur in prominent full-width panels. Preserve all disclosures, but relocate/detail them intelligently: one persistent subtle status strip and focused context-specific tooltips/links; full language remains in Docs & Provenance.
3. **No clear design hierarchy.** Similar white bordered rectangles, title sizes, overly wide textual areas and repetitive tables make critical numbers indistinguishable from supporting details. Hero insight, primary task and next recommended action should have clear visual priority.
4. **Top navigation competes with content.** Wide horizontal nav and bulky technical green connectivity panel eat space. Use a coherent app shell and a small accessible API health indicator with detail on demand.
5. **Dense developer-facing copy in primary flows.** Backend route paths, ML pipeline feature names, data structure restrictions and legal/methodology paragraphs belong in details, inline help or Docs, not as the largest page elements. Preserve technical credibility without forcing all users to read internals.
6. **Raw numerical artifacts.** Examples include `89.29999999999998` and `208.89000000000001` in the loaded Overview. This is a **visible defect**: format presentation consistently (e.g., `89.3 units`, `208.9 units`), without silently rounding values used for computation.
7. **Accessibility and responsive risks to verify.** Tables and two-column forms look potentially cramped on phones; screenshots do not prove a bug, but these screens need explicit breakpoints, focus states, keyboard labels, contrast, legends and non-color indicators.

## Screenshot-by-screenshot findings

| Screenshot | Visible issue | Change required | Priority |
|---|---|---|---|
| `01-overview-empty.png` | Header plus system-connectivity banner and lengthy product/disclaimer cards; primary action appears inside a massive empty dashed box low in viewport. | Intentional first-run welcome with concise value headline, dominant **Try sample dataset** and secondary **Upload your CSV**; microcopy for no-persistence and synthetic status; three-step “How it works” compact rail. Move backend health into small shell status. | P0 |
| `02-overview-loaded.png` | Product stats and all-SKU table look utilitarian; “At-risk count” displays a wall of instruction text; raw float totals. Validation/science panel dominates lower screen. | Business-first summary: uploaded dataset chip, concise “Next 14 days” context, big compact 3 KPI cards, prioritized SKU decision table with action column, in-context stock setup CTA. Format units; keep detailed caveats in short info/help and Docs. No fake risk counts without stock inputs. | P0 |
| `03-import-empty.png` | Long restriction panel at top, separate heavy equal-weight cards for demo and custom file, lengthy route/HTTP implementation text. | Simple stepper `1 Add sales → 2 Check data → 3 View forecast`; visually focused dropzone/button, sample-data route clearly separate; show schema preview and limits in collapsible “CSV requirements”; clear 1MB/2000 row limits when useful. | P0 |
| `04-import-loaded.png` | Five similar KPI blocks and huge table dominate; validation details look like raw engineering diagnostics. | Success callout + “3 products · 120 days of history · 360 records accepted” in clean compact metrics; SKU summary table/cards; primary **See forecasts** button. Keep per-model MAE accessible but not overload import page. | P1 |
| `05-forecast.png` | Multiple paragraph-length methods/limitations above the chart, pushing most meaningful graph below fold. | Move chart directly after heading, SKU selector, forecast summary and model badge. Place validation comparison in a neat card alongside/below chart; method details in accordion. Historic vs predicted legend differentiated by hue + line style + clear forecast transition. | P0 |
| `06-recommendations.png` | Functional logic apparent, but technical vocabulary dominates title; sparse cards; primary recommendation `145` not framed as a decision; formula feels disconnected from user question. | Decision-first layout: prominent `Reorder 145 units` result for selected SKU in summary, `Expected next 7-day demand 170`, `On hand 25`, `Projected shortage 145`; controls on left, result on right, explanation beneath. Keep calculation and CSV export functionality. Show risk as **point forecast scenario**, not probability. | P0 |
| `07-docs.png` | Large blocks of architecture and math; undifferentiated gray cards; difficult for a judge to find provenance or limitations rapidly. | Editorial documentation view with concise 4-section table of contents: How it works, Forecast validation, Data & privacy, Limitations & evidence. Clear anchor links/accordions and “Architecture at a glance” readable system flow. Preserve specific details and disclosures. | P1 |

## Strengths to protect

- The demo is upfront about being stateless and synthetic, and does not fake real ROI. **Do not remove this honesty** to achieve visual polish.
- Actual CSV, backend health, forecasting selection and reorder paths are visible. Preserve the working path end to end.
- Comparing Ridge and seasonal-naive on time-ordered holdout is more scientifically defensible than vague “AI prediction” labels; keep it accessible.
- Method choice legitimately differs by product. Do not imply all products use the same model.
- Existing requested dataset (3 SKUs) differs from an earlier supplied 5-SKU CSV. Display the **actual loaded dataset**, not a fixed storyboard.

## Measurable visual goals (not claimed as already met)

- At 1440×900, user can identify what the product does, the next action and demo-data status within **10 seconds** of opening Overview.
- On Forecast, the selected 14-day chart and headline 14-day total appear **above the fold** or with minimal scroll at common desktop dimensions.
- No float precision artifacts, invalid unit formatting, clipped controls or horizontal page overflow on 390px mobile.
- Each page has one immediately identifiable primary action; shared layout/tokens/components; no empty decorative buttons.
- Status and disclaimers are accessible without dominating first-screen real estate.
