"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  Lock,
  Loader2,
  PackageCheck,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { ErrorRetry } from "@/components/ErrorRetry";
import { LimitationsPanel } from "@/components/LimitationsPanel";
import { formatInteger, formatUnits } from "@/lib/format";

export default function OverviewPage() {
  const {
    analysis,
    provenance,
    sourceFilename,
    isAnalyzing,
    error,
    loadSyntheticDemo,
    setSelectedProductId,
    recommendationsBySku,
    settingsBySku,
  } = useAnalysis();

  const evaluatedRecs = Object.values(recommendationsBySku);
  const reorderNeededCount = evaluatedRecs.filter(
    (r) => r.reorder_quantity_units > 0
  ).length;
  const atRiskCount = evaluatedRecs.filter(
    (r) => r.risk_level === "high" || r.risk_level === "medium"
  ).length;

  const totalHistoricalUnits = analysis
    ? analysis.products.reduce(
        (sum, p) => sum + p.history.reduce((s, pt) => s + pt.units, 0),
        0
      )
    : 0;

  const totalForecastUnits = analysis
    ? analysis.products.reduce(
        (sum, p) => sum + p.forecast.reduce((s, pt) => s + pt.units, 0),
        0
      )
    : 0;

  const maxHistoryDays = analysis
    ? analysis.products.reduce(
        (max, p) => Math.max(max, p.history.length),
        0
      )
    : 0;

  return (
    <div className="space-y-6">
      {error && (
        <ErrorRetry
          title="Unable to Load Dataset"
          code={error.code}
          message={error.message}
          details={error.details}
          onRetry={() => void loadSyntheticDemo()}
          retrying={isAnalyzing}
        />
      )}

      {!analysis ? (
        <>
          {/* Empty State: Executive Hero Panel */}
          <section
            aria-labelledby="overview-hero-heading"
            className="rounded-2xl border border-[#DEE6EB] bg-white p-6 sm:p-8 shadow-2xs"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left 7 columns: Value Proposition & Primary Actions */}
              <div className="space-y-5 lg:col-span-7">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#DEE6EB] bg-[#F6F8FA] px-3 py-1 text-xs font-medium text-[#536579]">
                  <span className="h-2 w-2 rounded-full bg-[#087F78]" aria-hidden="true" />
                  <span>DemandIQ · Retail inventory operations cockpit</span>
                </div>

                <div className="space-y-2.5">
                  <h1
                    id="overview-hero-heading"
                    className="text-2xl font-bold tracking-tight text-[#102034] sm:text-3xl lg:text-[32px] lg:leading-[1.18]"
                  >
                    Smarter reordering starts with your sales history.
                  </h1>
                  <p className="max-w-[62ch] text-sm sm:text-base leading-relaxed text-[#536579]">
                    Forecast 14-day product demand with leakage-safe model selection and calculate deterministic reorder quantities from current stock and supplier lead times.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => void loadSyntheticDemo()}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#087F78] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0B746E] disabled:opacity-50 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Loading sample dataset…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        <span>Explore sample data</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/import"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#DEE6EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-[#536579]" aria-hidden="true" />
                    <span>Import CSV</span>
                  </Link>
                </div>

                <p className="text-xs text-[#536579]">
                  Sample data is labeled{" "}
                  <strong className="font-medium text-[#102034]">
                    &ldquo;Illustrative synthetic demo data — not real retailer records&rdquo;
                  </strong>
                  . This session processes files in memory and does not save records.
                </p>
              </div>

              {/* Right 5 columns: Compact 3-Step Workflow Rail */}
              <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-5 lg:col-span-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#536579]">
                  How the workflow operates
                </h2>
                <ol className="mt-3.5 space-y-3.5">
                  <li className="flex items-start gap-3 rounded-lg border border-[#DEE6EB] bg-white p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F6F4] font-mono text-xs font-bold text-[#087F78]">
                      1
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#102034]">
                        Import sales
                      </div>
                      <p className="mt-0.5 text-xs text-[#536579]">
                        Upload a dense daily CSV or load the 3-product sample dataset (120 days each).
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg border border-[#DEE6EB] bg-white p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F6F4] font-mono text-xs font-bold text-[#087F78]">
                      2
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#102034]">
                        Forecast demand
                      </div>
                      <p className="mt-0.5 text-xs text-[#536579]">
                        Compare Ridge regression against a 7-day seasonal-naive baseline on a 14-day holdout.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg border border-[#DEE6EB] bg-white p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F6F4] font-mono text-xs font-bold text-[#087F78]">
                      3
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#102034]">
                        Review reorder amounts
                      </div>
                      <p className="mt-0.5 text-xs text-[#536579]">
                        Enter stock on hand and supplier lead time (1–14 days) to compute exact order quantities.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Trust & Scope Strip (3 concise micro-cards) */}
          <section
            aria-label="Scientific and operational principles"
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div className="rounded-xl border border-[#DEE6EB] bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#102034]">
                <TrendingUp className="h-4 w-4 text-[#087F78]" aria-hidden="true" />
                <h3>Point-forecast estimates</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#536579]">
                Shortage indicators reflect deterministic scenarios from the 14-day demand forecast—never uncalibrated stockout probabilities.
              </p>
            </div>

            <div className="rounded-xl border border-[#DEE6EB] bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#102034]">
                <Scale className="h-4 w-4 text-[#087F78]" aria-hidden="true" />
                <h3>Transparent math</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#536579]">
                Chronological validation MAE and exact reorder formulas are shown for every SKU; baseline wins when it outperforms Ridge.
              </p>
            </div>

            <div className="rounded-xl border border-[#DEE6EB] bg-white p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#102034]">
                <Lock className="h-4 w-4 text-[#087F78]" aria-hidden="true" />
                <h3>Private, stateless session</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#536579]">
                All analysis runs in memory without database storage or automatic supplier ordering. Refreshing clears the session.
              </p>
            </div>
          </section>
        </>
      ) : (
        /* Loaded State: Operations Cockpit */
        <section
          aria-labelledby="active-dataset-heading"
          className="space-y-6 rounded-2xl border border-[#DEE6EB] bg-white p-6 shadow-2xs"
        >
          {/* Loaded Header Row */}
          <div className="flex flex-col gap-4 border-b border-[#DEE6EB] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D1FADF] bg-[#ECFDF3] px-2.5 py-0.5 text-xs font-semibold text-[#027A48]">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {provenance === "synthetic_demo"
                      ? `Demo data · ${analysis.summary.products_total} products · ${maxHistoryDays} days`
                      : `Uploaded CSV (${sourceFilename ?? "upload.csv"}) · ${analysis.summary.products_total} products`}
                  </span>
                </span>
                {provenance === "synthetic_demo" && (
                  <span className="rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-0.5 text-xs font-medium text-[#A65C06]">
                    Illustrative synthetic demo data — not real retailer records
                  </span>
                )}
              </div>
              <h1
                id="active-dataset-heading"
                className="text-2xl font-bold tracking-tight text-[#102034]"
              >
                Ready to review inventory.
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/forecast"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DEE6EB] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
              >
                <BarChart3 className="h-4 w-4 text-[#536579]" aria-hidden="true" />
                <span>Inspect forecasts</span>
              </Link>
              <Link
                href="/recommendations"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087F78] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition hover:bg-[#0B746E]"
              >
                <PackageCheck className="h-4 w-4" aria-hidden="true" />
                <span>
                  {evaluatedRecs.length > 0 ? "Review reorder plan" : "Set stock levels"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* 4 Compact Metric Tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
              <div className="text-xs font-medium text-[#536579]">Products</div>
              <div className="mt-1.5 text-2xl font-bold text-[#102034] tabular-nums">
                {formatInteger(analysis.summary.products_total)}
              </div>
              <div className="mt-1 text-xs text-[#536579]">
                {analysis.summary.products_with_forecast ===
                analysis.summary.products_total
                  ? `All ${analysis.summary.products_total} forecast-ready`
                  : `${analysis.summary.products_with_forecast} of ${analysis.summary.products_total} forecast-ready`}
              </div>
            </div>

            <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
              <div className="text-xs font-medium text-[#536579]">
                Historical units
              </div>
              <div className="mt-1.5 text-2xl font-bold text-[#102034] tabular-nums">
                {formatInteger(totalHistoricalUnits)}
              </div>
              <div className="mt-1 text-xs text-[#536579]">
                {formatInteger(analysis.summary.aggregated_daily_rows)} daily observations
              </div>
            </div>

            <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
              <div className="text-xs font-medium text-[#536579]">
                Next 14-day forecast
              </div>
              <div className="mt-1.5 text-2xl font-bold text-[#087F78] tabular-nums">
                {formatUnits(totalForecastUnits, 1)}{" "}
                <span className="text-sm font-medium text-[#536579]">units</span>
              </div>
              <div className="mt-1 text-xs text-[#536579]">
                Combined across {analysis.summary.products_with_forecast} products
              </div>
            </div>

            <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
              <div className="text-xs font-medium text-[#536579]">
                Shortage check
              </div>
              {evaluatedRecs.length > 0 ? (
                <>
                  <div className="mt-1.5 text-2xl font-bold text-[#102034] tabular-nums">
                    {reorderNeededCount} of {evaluatedRecs.length}
                  </div>
                  <div className="mt-1 text-xs text-[#536579]">
                    {atRiskCount} with high/medium point-forecast risk
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-1.5 text-sm font-semibold text-[#102034]">
                    Add stock to check shortages
                  </div>
                  <div className="mt-1.5">
                    <Link
                      href="/recommendations"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#087F78] hover:underline"
                    >
                      <span>Enter stock &amp; lead days</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Primary SKU Decision Table */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#102034]">
                Product forecast &amp; replenishment summary
              </h2>
              <span className="text-xs text-[#536579]">
                Select any product to inspect its 14-day curve or calculate order amounts
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DEE6EB]">
              <table className="min-w-full divide-y divide-[#DEE6EB] text-left text-sm">
                <thead className="bg-[#EFF4F6] text-xs font-semibold uppercase tracking-wider text-[#536579]">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Product
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      History
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Selected model
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Next 14-day demand
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Replenishment status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE6EB] bg-white">
                  {analysis.products.map((prod) => {
                    const histSum = prod.history.reduce(
                      (s, pt) => s + pt.units,
                      0
                    );
                    const fcSum = prod.forecast.reduce(
                      (s, pt) => s + pt.units,
                      0
                    );
                    const rec = recommendationsBySku[prod.product_id];
                    const savedSettings = settingsBySku[prod.product_id];

                    return (
                      <tr
                        key={prod.product_id}
                        className="transition hover:bg-[#F6F8FA]"
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-[#102034]">
                            {prod.product_name}
                          </div>
                          <div className="mt-0.5 font-mono text-xs text-[#536579]">
                            {prod.product_id}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right tabular-nums">
                          <div className="font-medium text-[#102034]">
                            {formatInteger(histSum)} units
                          </div>
                          <div className="text-xs text-[#536579]">
                            {formatInteger(prod.history.length)} days
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {prod.chosen_method === "ridge" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#087F78]/30 bg-[#E8F6F4] px-2.5 py-0.5 text-xs font-semibold text-[#087F78]">
                              Ridge regression
                            </span>
                          ) : prod.chosen_method === "seasonal_naive" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DEE6EB] bg-[#EFF4F6] px-2.5 py-0.5 text-xs font-semibold text-[#102034]">
                              Seasonal naive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-0.5 text-xs font-medium text-[#A65C06]">
                              Insufficient history
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-[#102034] tabular-nums">
                          {prod.forecast.length > 0
                            ? `${formatUnits(fcSum, 1)} units`
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          {rec && savedSettings ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  rec.risk_level === "high"
                                    ? "bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]"
                                    : rec.risk_level === "medium"
                                    ? "bg-[#FFF6E8] text-[#A65C06] border border-[#F5D08A]"
                                    : "bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]"
                                }`}
                              >
                                Reorder {formatInteger(rec.reorder_quantity_units)} units
                              </span>
                              <span className="text-xs text-[#536579]">
                                (stock {savedSettings.stock_on_hand}, {savedSettings.lead_time_days}d lead)
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#536579]">
                              Not calculated yet
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Link
                              href="/forecast"
                              onClick={() => setSelectedProductId(prod.product_id)}
                              className="rounded-lg border border-[#DEE6EB] bg-white px-2.5 py-1 text-xs font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
                            >
                              View forecast
                            </Link>
                            {prod.forecast.length === 14 && (
                              <Link
                                href="/recommendations"
                                onClick={() => setSelectedProductId(prod.product_id)}
                                className="rounded-lg bg-[#E8F6F4] px-2.5 py-1 text-xs font-semibold text-[#087F78] transition hover:bg-[#087F78] hover:text-white"
                              >
                                Set stock
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Collapsible Ingestion & Validation Details */}
          <details className="group rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] text-xs text-[#536579]">
            <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-medium text-[#102034]">
              <span>
                Dataset ingestion details ({formatInteger(analysis.summary.input_rows)} input rows ·{" "}
                {formatInteger(analysis.summary.accepted_rows)} accepted ·{" "}
                {formatInteger(analysis.summary.aggregated_daily_rows)} aggregated daily rows)
              </span>
              <ChevronDown
                className="h-4 w-4 text-[#536579] transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="space-y-2 border-t border-[#DEE6EB] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  Source:{" "}
                  <strong className="font-semibold text-[#102034]">
                    {provenance === "synthetic_demo"
                      ? "demo-sales.csv (synthetic fixture)"
                      : sourceFilename ?? "user upload"}
                  </strong>
                </span>
                <Link
                  href="/import"
                  className="font-semibold text-[#087F78] hover:underline"
                >
                  Manage or replace dataset →
                </Link>
              </div>
              {analysis.summary.warnings.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-[#A65C06]">
                  {analysis.summary.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </section>
      )}

      <LimitationsPanel />
    </div>
  );
}
