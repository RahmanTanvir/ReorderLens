"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { LimitationsPanel } from "@/components/LimitationsPanel";

export default function DocsPage() {
  const { analysis, provenance } = useAnalysis();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Technical &amp; Provenance Documentation</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              ReorderLens AI — Architecture, Forecasting Math &amp; Evidence
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Challenge: <strong>DemandIQ (CommerceSphere AI)</strong> • International AI Builders Congress 2026 • Team: <strong>The White Hole</strong> (4 human members)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/import"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Import Sales
            </Link>
            <Link
              href="/forecast"
              className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Open Forecast View
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Architecture */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <GitBranch className="h-4 w-4 text-slate-700" aria-hidden="true" />
              <h2>1. Split Monorepo &amp; Same-Origin Proxy Architecture</h2>
            </div>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-700">
              <li>
                <strong>Frontend (<code className="font-mono">web/</code>):</strong> Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Recharts. Holds sanitized analysis responses in in-memory React Context only.
              </li>
              <li>
                <strong>Backend (<code className="font-mono">backend/</code>):</strong> Stateless Python FastAPI service (<code className="font-mono">app.py</code> exporting <code className="font-mono">app</code>), Pydantic v2, NumPy, Pandas, and scikit-learn.
              </li>
              <li>
                <strong>Routing:</strong> <code className="font-mono">web/next.config.ts</code> rewrites <code className="font-mono">/backend/:path*</code> to <code className="font-mono">{"${BACKEND_URL}/:path*"}</code> so browser requests stay same-origin without exposing third-party keys or requiring wildcard CORS.
              </li>
              <li>
                <strong>Deployment Target:</strong> Two separate Vercel projects linked to one Git repository (<code className="font-mono">web</code> and <code className="font-mono">backend</code> root directories).
              </li>
            </ul>
          </div>

          {/* Forecasting & Validation */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Cpu className="h-4 w-4 text-slate-700" aria-hidden="true" />
              <h2>2. Leakage-Safe Forecasting &amp; Baseline Selection</h2>
            </div>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-700">
              <li>
                <strong>≥ 60 Consecutive Days (<code className="font-mono">evaluated</code>):</strong> The last 14 observed days are withheld for chronological validation. A <code className="font-mono">StandardScaler + Ridge(alpha=1.0)</code> pipeline is fit strictly on the training period using leak-free features: yesterday demand (<code className="font-mono">lag_1</code>), same-weekday demand (<code className="font-mono">lag_7</code>), prior 7-day rolling mean, prior 14-day rolling mean, and 7 weekday indicators.
              </li>
              <li>
                <strong>Recursive 14-Day Validation:</strong> Both Ridge and the 7-day seasonal-naive baseline predict 14 validation steps recursively from the cutoff without reading withheld actuals.
              </li>
              <li>
                <strong>Honest Winner Selection:</strong> The method with lower 14-day validation MAE is selected (ties prefer simpler <code className="font-mono">seasonal_naive</code>) and refit on all observed history to forecast the next 14 consecutive calendar days.
              </li>
              <li>
                <strong>14–59 Days (<code className="font-mono">baseline_only</code>) &amp; &lt;14 Days (<code className="font-mono">insufficient_history</code>):</strong> Explicit fallback statuses; never fabricates validation MAE.
              </li>
            </ul>
          </div>

          {/* Deterministic Inventory Math */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Database className="h-4 w-4 text-slate-700" aria-hidden="true" />
              <h2>3. Deterministic Inventory Arithmetic &amp; CSV Contract</h2>
            </div>
            <div className="mt-2.5 space-y-2 text-xs leading-relaxed text-slate-700">
              <p>
                Given the 14-day point forecast, integer <code className="font-mono">stock_on_hand ≥ 0</code>, <code className="font-mono">lead_time_days (L ∈ 1..14)</code>, and <code className="font-mono">safety_stock_units ≥ 0</code>:
              </p>
              <pre className="overflow-x-auto rounded bg-slate-900 p-2.5 font-mono text-[11px] text-slate-100">
{`expected_lead_time_demand = sum(forecast[0:L].units)
projected_shortage_units  = max(0, ceil(expected_lead_time_demand - stock_on_hand))
reorder_quantity_units    = ceil(max(0, expected_lead_time_demand + safety_stock_units - stock_on_hand))`}
              </pre>
              <p>
                <strong>CSV Bounds:</strong> UTF-8 <code className="font-mono">date,product_id,product_name,quantity_sold</code>, ≤1 MB, ≤2,000 rows, ≤10 SKUs, dense daily dates with explicit <code className="font-mono">0</code> rows on zero-sales days. Missing calendar dates trigger <code className="font-mono">DATA_GAPS</code> and are never silently filled with zero.
              </p>
            </div>
          </div>

          {/* Provenance & Localization */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Globe className="h-4 w-4 text-slate-700" aria-hidden="true" />
              <h2>4. Dataset Provenance, AI Disclosure &amp; Localization</h2>
            </div>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-700">
              <li>
                <strong>Synthetic Demo Fixture:</strong> <code className="font-mono">web/public/demo-sales.csv</code> is deterministically generated by <code className="font-mono">backend/generate_demo_csv.py</code> (seed <code className="font-mono">20261026</code>, 3 SKUs × 120 days = 360 rows) and labeled <em>&ldquo;Illustrative synthetic demo data — not real retailer records&rdquo;</em> across all surfaces.
              </li>
              <li>
                <strong>AI Development Tools Used:</strong> ChatGPT was used by the project owner for initial challenge analysis and specification drafting; Google Antigravity was used to implement the Next.js/FastAPI codebase and execute automated tests under human review. No LLM is called at runtime.
              </li>
              <li>
                <strong>Bangladesh SME Context &amp; Localization:</strong> Designed for small retail inventory workflows (staples and FMCG SKUs). The preliminary prototype is English-first; full Bangla (<span lang="bn">বাংলা</span>) interface localization and local festival/calendar regressors are scoped for post-preliminary pilot work.
              </li>
            </ul>
          </div>
        </div>

        {/* Verified Run Evidence Table */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900">
                5. Verified Evaluation Results on Built-in Synthetic Fixture (<code className="font-mono">demo-sales.csv</code>)
              </h2>
            </div>
            <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-950">
              Illustrative synthetic demo data — not real retailer records
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Actual output from <code className="font-mono">POST /v1/analyze</code> on the 360-row synthetic fixture (120 consecutive days per SKU, <code className="font-mono">2026-06-29</code> to <code className="font-mono">2026-10-26</code>):
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th scope="col" className="px-3 py-2">SKU ID</th>
                  <th scope="col" className="px-3 py-2">Status</th>
                  <th scope="col" className="px-3 py-2 text-right">Ridge 14d Val MAE</th>
                  <th scope="col" className="px-3 py-2 text-right">Seasonal-Naive 14d Val MAE</th>
                  <th scope="col" className="px-3 py-2">Chosen Method</th>
                  <th scope="col" className="px-3 py-2">Selection Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-mono">
                <tr>
                  <td className="px-3 py-2 font-semibold text-slate-900">rice-1kg</td>
                  <td className="px-3 py-2">evaluated</td>
                  <td className="px-3 py-2 text-right">2.06</td>
                  <td className="px-3 py-2 text-right font-bold text-emerald-800">1.43</td>
                  <td className="px-3 py-2 font-bold text-slate-900">seasonal_naive</td>
                  <td className="px-3 py-2 font-sans text-slate-600">
                    Seasonal-naive baseline achieved lower validation MAE (1.43 vs 2.06)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-slate-900">soap-100g</td>
                  <td className="px-3 py-2">evaluated</td>
                  <td className="px-3 py-2 text-right font-bold text-indigo-800">1.67</td>
                  <td className="px-3 py-2 text-right">2.29</td>
                  <td className="px-3 py-2 font-bold text-indigo-900">ridge</td>
                  <td className="px-3 py-2 font-sans text-slate-600">
                    Ridge regression achieved lower validation MAE (1.67 vs 2.29)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-slate-900">tea-250g</td>
                  <td className="px-3 py-2">evaluated</td>
                  <td className="px-3 py-2 text-right font-bold text-indigo-800">1.26</td>
                  <td className="px-3 py-2 text-right">1.79</td>
                  <td className="px-3 py-2 font-bold text-indigo-900">ridge</td>
                  <td className="px-3 py-2 font-sans text-slate-600">
                    Ridge regression achieved lower validation MAE (1.26 vs 1.79)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {analysis && (
            <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50/60 p-3 text-xs text-indigo-950">
              <div className="flex items-center gap-1.5 font-semibold">
                <FileCode2 className="h-4 w-4 text-indigo-700" aria-hidden="true" />
                <span>
                  Active Session State Detected ({analysis.summary.products_total} SKUs,{" "}
                  {provenance === "synthetic_demo"
                    ? "Illustrative synthetic demo data"
                    : "User-uploaded CSV"}
                  )
                </span>
              </div>
              <p className="mt-1">
                Accepted rows: {analysis.summary.accepted_rows} • Aggregated daily rows:{" "}
                {analysis.summary.aggregated_daily_rows} • SKUs with 14-day forecast:{" "}
                {analysis.summary.products_with_forecast}.
              </p>
            </div>
          )}
        </div>
      </section>

      <LimitationsPanel />
    </div>
  );
}
