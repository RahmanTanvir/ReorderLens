"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { LimitationsPanel } from "@/components/LimitationsPanel";
import { formatInteger } from "@/lib/format";

const ANCHOR_SECTIONS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#data-and-models", label: "Data & models" },
  { href: "#safety-and-limitations", label: "Safety & limitations" },
  { href: "#system-architecture", label: "System architecture" },
];

export default function DocsPage() {
  const { analysis, provenance } = useAnalysis();

  return (
    <div className="space-y-6">
      {/* Editorial Header & Anchor Navigation */}
      <section className="rounded-2xl border border-[#DEE6EB] bg-white p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-4 border-b border-[#DEE6EB] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DEE6EB] bg-[#F6F8FA] px-3 py-0.5 text-xs font-semibold text-[#087F78]">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Technical &amp; Provenance Reference</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#102034]">
              Architecture, forecasting methodology &amp; evidence
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#536579]">
              Challenge:{" "}
              <strong className="font-semibold text-[#102034]">
                DemandIQ (CommerceSphere AI)
              </strong>{" "}
              · International AI Builders Congress 2026 · Team:{" "}
              <strong className="font-semibold text-[#102034]">
                The White Hole
              </strong>{" "}
              (4 human members)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/import"
              className="rounded-xl border border-[#DEE6EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
            >
              Import sales
            </Link>
            <Link
              href="/forecast"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#087F78] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0B746E]"
            >
              <span>Open forecast view</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* 4 In-Page Anchor Tabs */}
        <nav
          aria-label="Documentation sections"
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          {ANCHOR_SECTIONS.map((sec) => (
            <a
              key={sec.href}
              href={sec.href}
              className="rounded-lg border border-[#DEE6EB] bg-[#F6F8FA] px-3 py-1.5 text-xs font-semibold text-[#102034] transition hover:border-[#087F78] hover:bg-[#E8F6F4] hover:text-[#087F78]"
            >
              {sec.label}
            </a>
          ))}
        </nav>

        {/* Active Session Banner if loaded */}
        {analysis && (
          <div className="mt-5 rounded-xl border border-[#087F78]/30 bg-[#E8F6F4]/60 p-3.5 text-xs text-[#102034]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold">
                <FileCode2
                  className="h-4 w-4 shrink-0 text-[#087F78]"
                  aria-hidden="true"
                />
                <span>
                  Active in-memory session:{" "}
                  {formatInteger(analysis.summary.products_total)} products (
                  {provenance === "synthetic_demo"
                    ? "Illustrative synthetic demo data — not real retailer records"
                    : "User-uploaded CSV"}
                  )
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#536579] tabular-nums">
                {formatInteger(analysis.summary.accepted_rows)} accepted rows ·{" "}
                {formatInteger(analysis.summary.aggregated_daily_rows)} daily observations
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Section 1: How It Works (Visual Pipeline Flow) */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="scroll-mt-24 rounded-2xl border border-[#DEE6EB] bg-white p-6 shadow-2xs"
      >
        <div className="flex items-center gap-2 text-base font-bold text-[#102034]">
          <Cpu className="h-4 w-4 text-[#087F78]" aria-hidden="true" />
          <h2 id="how-it-works-heading">1. How it works — end-to-end decision pipeline</h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-[#536579]">
          Every forecast and replenishment quantity is computed deterministically at request time from submitted sales records—never hardcoded or delegated to an LLM.
        </p>

        {/* HTML/CSS Visual Flow Diagram */}
        <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <li className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-3.5">
            <div className="font-mono text-xs font-bold text-[#087F78]">
              STEP 01
            </div>
            <div className="mt-1 text-sm font-semibold text-[#102034]">
              Daily sales CSV
            </div>
            <p className="mt-1 text-xs text-[#536579]">
              UTF-8 CSV (<code className="font-mono">≤1 MB</code>, <code className="font-mono">≤2,000 rows</code>, <code className="font-mono">≤10 SKUs</code>) parsed in memory.
            </p>
          </li>

          <li className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-3.5">
            <div className="font-mono text-xs font-bold text-[#087F78]">
              STEP 02
            </div>
            <div className="mt-1 text-sm font-semibold text-[#102034]">
              Dense date check
            </div>
            <p className="mt-1 text-xs text-[#536579]">
              Aggregates same-day transactions; flags missing calendar dates as <code className="font-mono">DATA_GAPS</code> instead of filling zero.
            </p>
          </li>

          <li className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-3.5">
            <div className="font-mono text-xs font-bold text-[#087F78]">
              STEP 03
            </div>
            <div className="mt-1 text-sm font-semibold text-[#102034]">
              14-day holdout MAE
            </div>
            <p className="mt-1 text-xs text-[#536579]">
              For <code className="font-mono">≥60d</code> series, compares recursive Ridge vs. 7-day seasonal naive on the last 14 observed days.
            </p>
          </li>

          <li className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-3.5">
            <div className="font-mono text-xs font-bold text-[#087F78]">
              STEP 04
            </div>
            <div className="mt-1 text-sm font-semibold text-[#102034]">
              Refit &amp; 14d forecast
            </div>
            <p className="mt-1 text-xs text-[#536579]">
              Refits the lower-MAE method on 100% of history and predicts the next 14 calendar days recursively.
            </p>
          </li>

          <li className="rounded-xl border border-[#087F78]/30 bg-[#E8F6F4]/60 p-3.5">
            <div className="font-mono text-xs font-bold text-[#087F78]">
              STEP 05
            </div>
            <div className="mt-1 text-sm font-semibold text-[#102034]">
              Deterministic reorder
            </div>
            <p className="mt-1 text-xs text-[#536579]">
              Applies exact lead-time demand and safety stock arithmetic from user-entered inventory levels.
            </p>
          </li>
        </ol>
      </section>

      {/* Section 2: Data & Models + Verified 3-SKU Evaluation Table */}
      <section
        id="data-and-models"
        aria-labelledby="data-models-heading"
        className="scroll-mt-24 space-y-5 rounded-2xl border border-[#DEE6EB] bg-white p-6 shadow-2xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-base font-bold text-[#102034]">
            <Database className="h-4 w-4 text-[#087F78]" aria-hidden="true" />
            <h2 id="data-models-heading">
              2. Data contract, model features &amp; verified evaluation evidence
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-0.5 text-xs font-medium text-[#A65C06]">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>Illustrative synthetic demo data — not real retailer records</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4 text-xs leading-relaxed text-[#536579]">
            <h3 className="text-sm font-semibold text-[#102034]">
              Leakage-safe Ridge regression vs. seasonal-naive baseline
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-[#102034]">Evaluated tier (≥60 days):</strong>{" "}
                Withholds the last 14 observed days for validation. Fits{" "}
                <code className="font-mono text-[#102034]">
                  StandardScaler + Ridge(alpha=1.0)
                </code>{" "}
                strictly on the training split using <code className="font-mono">lag_1</code>,{" "}
                <code className="font-mono">lag_7</code>, prior 7-day rolling mean, prior 14-day rolling mean, and 7 weekday indicators.
              </li>
              <li>
                <strong className="text-[#102034]">Honest baseline selection:</strong>{" "}
                Compares 14-step recursive validation MAE against the 7-day seasonal-naive baseline. Ties and wins select <code className="font-mono">seasonal_naive</code>—never forcing ML when the baseline is more accurate.
              </li>
              <li>
                <strong className="text-[#102034]">Fallback tiers:</strong>{" "}
                14–59 days return <code className="font-mono">baseline_only</code> (<code className="font-mono">validation: null</code>); &lt;14 days return <code className="font-mono">insufficient_history</code>.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4 text-xs leading-relaxed text-[#536579]">
            <h3 className="text-sm font-semibold text-[#102034]">
              Deterministic replenishment equations
            </h3>
            <p className="mt-1">
              For supplier lead time <code className="font-mono text-[#102034]">L ∈ 1..14</code>, whole integer <code className="font-mono text-[#102034]">stock_on_hand ≥ 0</code>, and <code className="font-mono text-[#102034]">safety_stock_units ≥ 0</code>:
            </p>
            <pre className="mt-2.5 overflow-x-auto rounded-lg bg-[#102034] p-3 font-mono text-[11px] text-white">
{`expected_lead_time_demand = sum(forecast[0:L].units)
projected_shortage_units  = max(0, ceil(expected_lead_time_demand - stock_on_hand))
reorder_quantity_units    = ceil(max(0, expected_lead_time_demand + safety_stock_units - stock_on_hand))`}
            </pre>
          </div>
        </div>

        {/* Verified Run Evidence Table */}
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#027A48]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-[#102034]">
              Verified evaluation results on built-in synthetic fixture (
              <code className="font-mono">demo-sales.csv</code>, 360 rows)
            </h3>
          </div>
          <div className="mt-2.5 overflow-x-auto rounded-xl border border-[#DEE6EB]">
            <table className="min-w-full divide-y divide-[#DEE6EB] text-left text-xs">
              <thead className="bg-[#EFF4F6] font-semibold uppercase tracking-wider text-[#536579]">
                <tr>
                  <th scope="col" className="px-4 py-2.5">
                    SKU ID
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right">
                    Ridge 14d holdout MAE
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right">
                    Seasonal-naive 14d MAE
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Chosen method
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Selection rationale
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DEE6EB] bg-white font-mono tabular-nums">
                <tr>
                  <td className="px-4 py-3 font-semibold text-[#102034]">
                    rice-1kg
                  </td>
                  <td className="px-4 py-3 text-[#536579]">evaluated</td>
                  <td className="px-4 py-3 text-right text-[#536579]">2.06</td>
                  <td className="px-4 py-3 text-right font-bold text-[#027A48]">
                    1.43
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-[#DEE6EB] bg-[#EFF4F6] px-2.5 py-0.5 font-sans text-xs font-semibold text-[#102034]">
                      seasonal_naive
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-[#536579]">
                    Seasonal-naive baseline achieved lower holdout MAE (1.43 vs 2.06)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-[#102034]">
                    soap-100g
                  </td>
                  <td className="px-4 py-3 text-[#536579]">evaluated</td>
                  <td className="px-4 py-3 text-right font-bold text-[#087F78]">
                    1.67
                  </td>
                  <td className="px-4 py-3 text-right text-[#536579]">2.29</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-[#087F78]/30 bg-[#E8F6F4] px-2.5 py-0.5 font-sans text-xs font-semibold text-[#087F78]">
                      ridge
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-[#536579]">
                    Ridge regression achieved lower holdout MAE (1.67 vs 2.29)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-[#102034]">
                    tea-250g
                  </td>
                  <td className="px-4 py-3 text-[#536579]">evaluated</td>
                  <td className="px-4 py-3 text-right font-bold text-[#087F78]">
                    1.26
                  </td>
                  <td className="px-4 py-3 text-right text-[#536579]">1.79</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-[#087F78]/30 bg-[#E8F6F4] px-2.5 py-0.5 font-sans text-xs font-semibold text-[#087F78]">
                      ridge
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-[#536579]">
                    Ridge regression achieved lower holdout MAE (1.26 vs 1.79)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 3: Safety, Provenance & Limitations */}
      <section
        id="safety-and-limitations"
        aria-labelledby="safety-heading"
        className="scroll-mt-24 rounded-2xl border border-[#DEE6EB] bg-white p-6 shadow-2xs"
      >
        <div className="flex items-center gap-2 text-base font-bold text-[#102034]">
          <Globe className="h-4 w-4 text-[#087F78]" aria-hidden="true" />
          <h2 id="safety-heading">
            3. Dataset provenance, AI tool disclosure &amp; localization scope
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 text-xs leading-relaxed text-[#536579]">
          <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
            <h3 className="font-semibold text-[#102034]">
              Synthetic fixture provenance
            </h3>
            <p className="mt-1">
              <code className="font-mono text-[#102034]">
                web/public/demo-sales.csv
              </code>{" "}
              is deterministically generated by{" "}
              <code className="font-mono text-[#102034]">
                backend/generate_demo_csv.py
              </code>{" "}
              (seed <code className="font-mono">20261026</code>, 3 SKUs × 120 days = 360 rows) and labeled{" "}
              <em>
                &ldquo;Illustrative synthetic demo data — not real retailer records&rdquo;
              </em>{" "}
              across all surfaces.
            </p>
          </div>

          <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
            <h3 className="font-semibold text-[#102034]">
              AI development tools disclosure
            </h3>
            <p className="mt-1">
              ChatGPT assisted the project owner with challenge analysis and specification drafting; Google Antigravity assisted with implementing the Next.js/FastAPI codebase and running automated verification under human review. No LLM is called at runtime.
            </p>
          </div>

          <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
            <h3 className="font-semibold text-[#102034]">
              Bangladesh SME context &amp; localization
            </h3>
            <p className="mt-1">
              Designed for small retail staple and FMCG replenishment workflows. This preliminary prototype is English-first; full Bangla (<span lang="bn">বাংলা</span>) interface localization and festival calendar regressors are planned for post-preliminary pilot work.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: System Architecture */}
      <section
        id="system-architecture"
        aria-labelledby="arch-heading"
        className="scroll-mt-24 rounded-2xl border border-[#DEE6EB] bg-white p-6 shadow-2xs"
      >
        <div className="flex items-center gap-2 text-base font-bold text-[#102034]">
          <GitBranch className="h-4 w-4 text-[#087F78]" aria-hidden="true" />
          <h2 id="arch-heading">
            4. Split monorepo &amp; same-origin proxy architecture
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 text-xs leading-relaxed text-[#536579]">
          <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
            <h3 className="font-semibold text-[#102034]">
              Frontend (<code className="font-mono">web/</code>) &amp; proxy routing
            </h3>
            <p className="mt-1">
              Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, and Recharts.{" "}
              <code className="font-mono text-[#102034]">web/next.config.ts</code>{" "}
              rewrites <code className="font-mono text-[#102034]">/backend/:path*</code> to{" "}
              <code className="font-mono text-[#102034]">{"${BACKEND_URL}/:path*"}</code>{" "}
              so browser requests remain strictly same-origin without exposing backend URLs or requiring wildcard CORS.
            </p>
          </div>

          <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
            <h3 className="font-semibold text-[#102034]">
              Backend (<code className="font-mono">backend/</code>) &amp; two-project Vercel deployment
            </h3>
            <p className="mt-1">
              Stateless Python FastAPI service (<code className="font-mono text-[#102034]">app.py</code> exporting{" "}
              <code className="font-mono text-[#102034]">app</code>), Pydantic v2, NumPy, and scikit-learn. Deployed as two separate Vercel projects from one Git repository (<code className="font-mono">backend</code> and <code className="font-mono">web</code> Root Directories).
            </p>
          </div>
        </div>
      </section>

      <LimitationsPanel defaultOpen />
    </div>
  );
}
