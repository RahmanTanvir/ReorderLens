# ReorderLens AI — Premium UI Redesign Implementation Kit

**Purpose:** Direct Google Antigravity to redesign the **actual existing application**, not generate a replacement screenshot, mock, or unrelated new app. Created from the seven user-provided screenshots and the previously approved ReorderLens AI MVP design/engineering instructions.

**Important source-access status:** The seven screenshots and the original *documentation kit* were available for review. The **actual generated Next.js/FastAPI source repository was not provided or mounted in this conversation**. Consequently, this kit is a grounded redesign specification and runnable-in-the-user-workspace Antigravity instruction set, **not completed code edits or validated deployment**. Antigravity must inspect the actual repository before touching anything.

## How to use, without risking the current application

1. Extract this ZIP to an easy-to-find location. Copy `reference/current-ui/` and the Markdown files to your ReorderLens AI repository, preferably inside `design-redesign/`. **Do not replace the existing `AGENTS.md` or application source files with files from this ZIP.**
2. Open the **existing working ReorderLens AI repository** in Google Antigravity. Confirm the current working app still launches. Commit a known-good baseline or save a reversible checkpoint.
3. Give Antigravity the entire contents of [`03_ANTIGRAVITY_IMPLEMENT_FULL_REDESIGN.md`](03_ANTIGRAVITY_IMPLEMENT_FULL_REDESIGN.md) as its task prompt. It will inspect files, assess the screenshots and docs, and modify **your real app**. This prompt is designed to complete the full redesign rather than just return a theoretical plan.
4. Verify the changes on the actual web app. Run the separate [`04_REGRESSION_AND_VISUAL_QA.md`](04_REGRESSION_AND_VISUAL_QA.md) as an independent second-pass audit; do not accept a “looks done” response without screenshots and functioning requests.
5. Record the 180-second demo with [`05_VIDEO_PATH.md`](05_VIDEO_PATH.md) only after the actual end-to-end workflow works.

## Contents

| File | Purpose |
|---|---|
| `01_SCREENSHOT_AUDIT.md` | Evidence-grounded problems in all seven screenshots; design priorities. |
| `02_DESIGN_SYSTEM_AND_SCREEN_SPECS.md` | Cohesive visual identity, semantic tokens, detailed page layouts and behaviors. |
| `03_ANTIGRAVITY_IMPLEMENT_FULL_REDESIGN.md` | Ready-to-paste **implementation** prompt that operates on actual repository. |
| `04_REGRESSION_AND_VISUAL_QA.md` | Pass/fail matrix for behavior, responsiveness, functionality, accessibility and visual quality. |
| `05_VIDEO_PATH.md` | Proposed 180-second screen capture with product value visible immediately. |
| `reference/current-ui/*.png` | Seven exact screenshots supplied by user, labeled by screen for comparison. |

## Product truth to preserve

- Product **ReorderLens AI**, official challenge **DemandIQ**, domain **CommerceSphere AI**, team **The White Hole**.
- CSV import and explicit synthetic demo dataset (screenshots show **3 SKUs, 120 days each, 360 accepted records, 5,074 historical units** for the built-in dataset; do not hardcode these as universal stats).
- Actual backend forecasts: Ridge-versus-seasonal-naive comparison with chronological validation; do not change training, model selection or evaluation results just to improve appearance.
- Explainable 14-day forecast and deterministic lead-time reorder recommendation. No calibrated stockout probability, validated revenue impact, historical demand certainty, persistence, or autonomous purchasing should be claimed.
- Frontend visible as Next.js/React/TypeScript/Tailwind/Recharts; FastAPI backend accessed through `/backend/...` same-origin rewrite; maintain contracts, limits, in-memory session.
- No invented users, proof, testimonials, savings or “live production” claims. Demo remains a prototype and user data is not stored.

**Definition of done:** All **five** visible navigation destinations share one design system, real APIs continue to work, responsive layouts pass visual inspection, and the video journey is reliable. This cannot be honestly verified until the actual repo is supplied or Antigravity executes the changes in the owner's workspace.
