# ReorderLens AI — Independent visual and regression QA

Use as a second Antigravity prompt **after** code edits. Test actual app, not screenshots or promises.

## QA instruction (paste after implementation)

> Independently audit the actual ReorderLens AI application after the premium redesign. Read root `AGENTS.md`, `design-redesign/02_DESIGN_SYSTEM_AND_SCREEN_SPECS.md`, `docs/05_API_CONTRACTS.md` and `docs/06_TESTING_AND_ACCEPTANCE.md` where present. Start frontend/backend, exercise all existing routes and API flows, and inspect 1440×900, 1280×800, 768×1024, 390×844 and 320×568 layouts. Repair defects within approved scope, rerun failing checks, and report exact commands and screenshot evidence. Do not fabricate results, mask errors, hardcode synthetic metrics or modify forecasting math for visual polish. Mark every test PASS/FAIL/NOT RUN, with reproducible evidence and any unresolved blocker. Include CSV/forecast/reorder/export/docs navigation and keyboard-only smoke tests. Do not deploy without permission.

## Test matrix

| ID | Scenario | Expected evidence |
|---|---|---|
| F01 | First visit/empty session | First-run value and CTAs visible; no invented stats; synthetic and no-save label present; healthy/unhealthy API status accurate. |
| F02 | Click `Explore sample data` | Real analysis request completes; 3 demo SKUs / 360 rows (if same fixture); UI renders actual result; time series and selected methods correct. |
| F03 | Upload valid 4-column CSV | Accepted/uploaded label correct, loading/validation state and actual API response. |
| F04 | Invalid CSV (bad header/date/negative units/absent dates) | Helpful errors; no fake success; preserved limits. |
| F05 | Navigation through 5 screens | In-memory data survives route navigation; all links and CTAs work. |
| F06 | Overview loaded state | Numeric formatting no long floats; table readable; risk count not fabricated without stock inputs. |
| F07 | Forecast inspect Rice | Real 14-day prediction/chart; selected method truthfully seasonal_naive where backend says so; MAEs accurately displayed. |
| F08 | Forecast inspect Soap or Tea | Model badge/MAEs reflect per-SKU backend response, not a universal static message. |
| F09 | Recommendation: rice stock 25, lead 7, safety 0 | With screenshot fixture: expected lead demand 170, shortage 145, reorder 145 **only if actual response matches**; computed values visibly linked to inputs. |
| F10 | Recommendation: same forecast, stock 250 | Reorder falls to 0 where expected under 7-day case, after actual backend action. |
| F11 | Recommendation: lead 1–14 and bounds | Invalid values rejected with meaningful error and no stale results misrepresented as new. |
| F12 | Export CSV | Export contains actual selected SKU/result and relevant fields; no static placeholder. |
| F13 | Docs & provenance | Route works; architecture and caveats reachable; no false persistence or confidence statements. |
| F14 | API down/error | Connected indicator reflects failure; action shows understandable recoverable error, not green success. |
| F15 | Refresh app | Returns to documented stateless demo start; no claim of saved records. |
| V01 | Desktop 1440×900 | Brand, primary action and/or decision insight visible at top; hierarchy professional; no giant disclaimer block. |
| V02 | Laptop 1280×800 | Forecast summary/chart near top; no overlapping nav/cards. |
| V03 | Tablet 768×1024 | Responsive nav, tables, filters and chart fit/reflow without lost actions. |
| V04 | Mobile 390×844 | No page horizontal overflow; input labels/buttons visible; nav usable; table action accessible. |
| V05 | Small mobile 320×568 | No unreadable truncation or clipped dialog; safe scrolling/stacking. |
| A01 | Keyboard navigation | Visible focus, interactive elements reachable and usable with Enter/Space/Escape as applicable. |
| A02 | Contrast | Normal text roughly WCAG AA target; warning/error distinguishable by text/icon, not color alone. |
| A03 | Screen reader semantics | Real form labels, headings in order, table headers, chart text alternative, errors announced where feasible. |
| T01 | Type/lint/build | Exact relevant commands execute and pass, or failures documented. |
| T02 | Existing backend tests | Executed without ML logic regression, or explicitly NOT RUN with reason. |

## Specific screenshot comparison checks

1. Original screenshot `01` has a huge empty placeholder; updated empty Overview should prioritize CTA within upper portion.
2. Original screenshot `02` displays floating-point tails and a verbose “requires stock input” metric; new Overview should not.
3. Original screenshot `03` puts upload rules ahead of task; new Import puts upload first, requirements second.
4. Original screenshot `04` shows a heavy row-by-row ML table inside Import; new Import keeps validation summary concise with expanded detail available.
5. Original screenshot `05` buries line chart under methods prose; new Forecast brings it up front.
6. Original screenshot `06` buries actionable reorder decision; new Recommendations highlights result and explanation.
7. Original screenshot `07` uses equal-weight technical blocks; new Docs gets in-page navigation and readable hierarchy.

## Release criterion

Mark **READY FOR RECORDING** only if F01/F02/F05/F07/F09/F10/F13, mobile V04, and frontend build T01 actually pass; additionally test upload F03 if it will be shown in the video. If the public URL is being recorded, run the same tests against that URL. An app build alone is **not** evidence of working production endpoints.
