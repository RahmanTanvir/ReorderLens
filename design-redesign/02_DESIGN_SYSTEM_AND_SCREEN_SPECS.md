# ReorderLens AI — Premium product design specification

This is a **design reference**. The implementing agent must map it onto existing components, APIs and Tailwind strategy after inspecting actual files. Do not overwrite established tokens blindly; do not recreate working pages with static mocks.

## Product point of view: “Inventory, in focus”

A quiet, editorial, data-forward inventory intelligence workstation for small retail operators. Premium through restraint, precision and usability—not glassmorphism, gradients or excessive animation.

**Brand personality:** calm, decisive, credible, human-understandable. **Copy principle:** the retailer's question comes before the ML term. For example, “What should I reorder?” precedes “Ridge vs seasonal-naive validation.”

### Proposed semantic tokens (check contrast in implementation)

| Role | Token | Intent |
|---|---|---|
| App canvas | `#F6F8FA` | cool neutral, less washed out than pure white |
| Surface | `#FFFFFF` | primary content containers |
| Raised subtle | `#EFF4F6` | muted statistic/group backgrounds |
| Strong ink | `#102034` | text and primary dark navigation |
| Muted ink | `#536579` | secondary text |
| Border | `#DEE6EB` | understated separator |
| Primary accent | `#087F78` | confident teal (white text contrast ~4.86:1) |
| Hover/darker accent | `#0B746E` | selected/hover |
| Primary faint | `#E8F6F4` | teal tinted emphasis |
| Info | `#1E6C8A` | informational messages |
| Caution text | `#A65C06` | amber warning, not artificial certainty |
| Caution tint | `#FFF6E8` | warning background |
| Danger text | `#B42318` | invalid/failed/risk context |
| Danger tint | `#FEF3F2` | error background |
| Positive text | `#027A48` | success only for verifiably healthy state |
| Chart history | `#2C4B66` | observed series |
| Chart prediction | `#087F78` | forecast (dash beyond cutoff optional) |
| Chart baseline | `#8095A8` | comparator/secondary |

**Typography:** existing Geist/Inter/system sans if already available (avoid a new font download just for aesthetics). Headings 28–32/600 max on desktop, page subtitles 14–16/400, card metric 30–36/650 tabular-nums, body 14–15/400, table 13–14. Use 1.4–1.55 line height and avoid giant paragraph slabs. Technical method strings may use understated monospace as secondary info only.

**Spacing:** 8px base rhythm; page shell padding 24–32 desktop, 16 tablet/mobile; section gap 20–28; card padding 20–24; compact table rows 48–56. Border radius 12 cards, 9 buttons/inputs; subtle shadows (e.g. `0 4px 18px rgba(16,32,52,.04)`); no thick card outlines. Motion 120–180ms for hover/expand, respect `prefers-reduced-motion`.

## Shared shell & components

- **Desktop:** fixed/collapsible left nav 224–240px if compatible with actual structure; content to remaining width with cap ~1280px. Top utility row: breadcrumb/current view on left, active dataset and `Demo mode` contextual status + compact backend health on right. If costly to reorganize into a sidebar, a well-spaced single-row top nav with same hierarchy is acceptable; consistent information architecture matters more than a particular pattern.
- **Mobile:** accessible menu drawer or compact bottom navigation; no sideways document overflow; sticky or easy-to-reach primary action. Content controls stack in a sensible reading order.
- **Brand:** `ReorderLens` wordmark + small teal square/lens motif (existing initials mark can be restyled). `DemandIQ / Competition prototype` as secondary label, not equal prominence.
- **Demo-state indicator:** one short visible status: `Sample data · Not saved` with expandable/explained detail. Keep provenance visible in Import and Docs, and by chart/source label; no blanket removal.
- **Backend-health indicator:** tiny labeled status (“API connected” / “API unavailable”) with accessible details/retry, not a full-width green banner on every page. Must reflect actual health responses and handle errors.
- **Reusable components:** AppShell, PageHeader, StatusChip, InlineNotice, MetricTile, SectionCard, DataTable, ProductSelector, ModelBadge, SkeletonCard, EmptyState, ErrorBanner, FormField, InformationPopover and ChartFrame. Names may differ: reuse/refactor existing equivalents.
- **Interaction feedback:** no fake success toasts; loading states for API calls, actionable errors with retry, success messages tied to actual completed operations. All controls keyboard reachable and visibly focused.
- **Content style:** sentence case, concise task-first text, accurate units and dates, contextual help where truly needed. Use `Intl.NumberFormat`, never pass binary floating-point output straight into tables. Model errors can be rounded for display but preserve underlying raw values and CSV precision contract.
- **Table behavior:** sticky header if helpful; `overflow-x-auto` in bounded table container only; meaningful column priority on small screens; no auto-hidden critical product/reorder information. Add empty/error/loading states.

## Information architecture (existing five destinations remain intact)

1. **Overview:** `Overview` — executive actionable home, demo loader when no dataset.
2. **Import Sales:** `Import sales` — upload CSV, demo data route, validation summary.
3. **Demand Forecast:** `Forecast` — chart first, model selection evidence second.
4. **Recommendations:** `Reorder plan` — stock/lead inputs, shortage, recommended units.
5. **Docs & Provenance:** `How it works` or `Methods & sources` — scientific integrity and limitations.

Renaming **visible** nav labels is acceptable only if route URLs and automated tests remain compatible. Maintain direct navigation after successful data import without losing in-memory context.

## Page A — Overview: before dataset

**Above fold:** headline `Smarter reordering starts with your sales history.` Subhead one sentence: `Upload daily sales or explore a transparent sample to see what demand might look like—and what to order next.` Main CTA **Explore sample data**, secondary **Import CSV**. One line immediately visible beneath: `Sample data is synthetic. This session does not save records.` Keep no giant dashed void.

Below CTA: compact three-step workflow with icons / 1 line each: `Import sales`, `Forecast demand`, `Review reorder amounts`. Small trust strip: `Forecast methods compared against a seasonal baseline · Recommendations use transparent math.` Do not claim verified performance.

## Page B — Overview: after import

**Top:** small dataset chip (`Demo data · 3 products · 120 days`), `Ready to review inventory.` Main CTA `Review reorder plan` if current stocks entered, otherwise `Set stock levels`. Current real data summary tiles: `Products: 3`, `Historical units: 5,074`, `Next 14-day forecast: calculated from actual response; round to appropriate unit`. Avoid `At-risk SKU count` until stock and lead time are available; show `Add stock to check shortages` as state, not fake zero.

**Main focus:** a compact product table/card row with Product, trend or small history sparkline if feasible, next-14-day total, chosen method, action `View forecast`. Each value must derive from backend response, and unresolved input shows `Not yet evaluated`, not a static number. Put ingestion-record counts and advanced validation into expandable dataset-details area.

**Optional small panel:** `Why this matters` explanation focused on decisions, not generalized ROI.

## Page C — Import sales

Headline `Bring in your sales history`. Intro `A few columns are enough to start a first forecast.` Primary drag/drop-or-browse upload with accessible keyboard/button fallback; ensure it really sends the selected file through existing API (not merely drag animation). Secondary controlled route `Try sample dataset`, clearly `Synthetic · 3 products · 120 daily observations each` **only if built-in fixture has those attributes**.

Collapsible `CSV format & limits` showing exact columns `date,product_id,product_name,quantity_sold`, 1MB, 2000 rows, 10 SKUs, dense calendar dates and zero rows on no-sales days; inline downloadable example CSV only if actual existing link works.

Loaded state: single success line, 2–3 concise data stats and expandable SKU validation table. Prominent `Explore forecasts` CTA. Do not alter input-processing rules, rejected rows, aggregation or error details. Distinguish loaded demo fixture from user-uploaded CSV.

## Page D — Demand Forecast

Heading `Demand forecast`; context `14-day outlook based on sales history` and SKU selector. **Within first screen**: 14-day total as major metric, chosen method as short badge, validation MAE as secondary metric labeled **model-selection holdout**, not independent test accuracy. Chart **dominates**: historical recent 60 days versus 14 predicted days with forecast boundary, axis units, hover tooltip with dates, accessible textual summary. Dates and product names from real response. A visible small `Illustrative synthetic data` label when applicable.

Below chart: side-by-side validation comparison (`Ridge` vs `Seasonal naive`) and `Why this method?` explanation with actual computed MAEs; if baseline wins, communicate that it outperformed the ML candidate for this SKU and **do not conceal it**. Detailed formulas/features, demand censoring and lack of confidence intervals in collapsed `Methodology & limitations` section linking to Docs. Display only measurements actually computed; precision formatted e.g. 2 decimal MAE, 0–1 decimal quantity as appropriate.

## Page E — Reorder plan

Heading `Turn forecasts into stock decisions`. Product selector and 2-column desktop grid: **left inputs** stock on hand (integer), supplier lead time 1–14 days, safety stock; **right decision result** big action statement `Reorder 145 units` in the screenshot's example, small triplet `Expected 7-day demand 170` / `Current stock 25` / `Projected shortage 145` and a clear explanation using those exact data. Button `Calculate recommendation` runs real API; if using auto-update, debounce and show pending indicator. **Do not fabricate a change or hardcode sample values**.

Below: formula breakdown in a compact, skimmable one-line arithmetic ribbon (`170 expected demand + 0 safety stock − 25 on hand = 145 suggested`), with advanced detail expandable; `Export CSV` remains a functioning export of current response. Risk is a **point-forecast scenario only**; never present it as calibrated probability. When stock raised to 250, computed reorder is expected to go to 0 **for the same forecast / 7-day horizon**. Preserve server arithmetic and input bounds.

## Page F — Methods & provenance

Professional editorial layout: short introduction, in-page anchors/tabs: `How it works`, `Data & models`, `Safety & limitations`, `System architecture`. Small understandable flow diagram (`Daily sales → Validation → Ridge/baseline forecasts → Stock inputs → Deterministic reorder`) built with accessible HTML/CSS; no image needed. Keep technical specifics available below or in disclosures: split Vercel projects; same-origin proxy; source data labels; chronological recursive 14-day validation; Ridge features; baseline tie-breaking; fallback history statuses; CSV constraints; no durable storage; no ROI validation. Prefer tables and compact callouts to giant technical paragraphs. Copy must not suggest unimplemented capabilities.

## Responsive definitions & observable acceptance

- **1440×900 / 1280×800:** meaningful content and first CTA visible without scrolling; selected forecast chart visible near top; no full-width debug banners.
- **768×1024:** sidebar collapses or nav reflows; cards become 2 columns; form/result stacks gracefully if needed.
- **390×844 / 320×568:** no body overflow; nav accessible, inputs at least ~44px target where feasible, chart can scroll or adapt within panel with descriptive summary, no cut-off table action; text readable at common zoom.
- **A11y:** keyboard access including nav/dialog/upload, visible focus rings, semantic labels and table headings, aria-live on API completion/errors where useful, contrast ≥4.5:1 for normal text, chart legend and summary not depending on color alone, motion preference honored.

## Redesign non-goals

- Do not modify backend ML math for visual reasons, relabel synthetic data as real, introduce revenue savings metrics or stockout probabilities, implement login/DB/purchasing just for UI, or replace API calls with mocks.
- Do not add unnecessary icon/theme/chart/form packages. Prefer existing dependencies and current component conventions.
- Do not hide scientific limitations entirely; **reorganize them** so users and judges can access them without being overwhelmed.
