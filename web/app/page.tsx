"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { ErrorRetry } from "@/components/ErrorRetry";
import { LimitationsPanel } from "@/components/LimitationsPanel";

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
  } = useAnalysis();

  const evaluatedRecs = Object.values(recommendationsBySku);
  const atRiskCount = evaluatedRecs.filter(
    (r) => r.risk_level === "high" || r.risk_level === "medium"
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Overview</span>
          <span>•</span>
          <span>DemandIQ Prototype</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          ReorderLens AI — Demand Forecasting &amp; Inventory Intelligence
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Upload a supported daily sales CSV or load the labeled synthetic demo dataset to inspect SKU history, compute a 14-day demand forecast, and calculate deterministic reorder quantities from current stock and supplier lead days.
        </p>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
            <p>
              <strong>Honest Limitation Notice:</strong> This is a preliminary single-user demonstration using illustrative synthetic sales data. Predictions and reorder quantities are model-based estimates, not guarantees. Sales history may understate demand when products were unavailable. The demo does not yet provide authentication, persistent cloud inventory records, validated field impact, or automated purchasing.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <ErrorRetry
          title="Failed to Load Dataset"
          code={error.code}
          message={error.message}
          details={error.details}
          onRetry={() => void loadSyntheticDemo()}
          retrying={isAnalyzing}
        />
      )}

      {!analysis ? (
        <section
          aria-labelledby="empty-dataset-heading"
          className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <FileSpreadsheet className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 id="empty-dataset-heading" className="mt-4 text-lg font-semibold text-slate-900">
            Import CSV or Load Demo Data
          </h2>
          <p className="mx-auto mt-1 max-w-lg text-sm text-slate-600">
            No sales dataset is currently loaded in memory. Load the built-in synthetic demo dataset (3 SKUs × 120 consecutive days) or upload a custom CSV via{" "}
            <code className="font-mono text-xs">POST /backend/v1/analyze</code>.
          </p>
          <p className="mx-auto mt-2 max-w-md rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-950">
            Illustrative synthetic demo data — not real retailer records
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => void loadSyntheticDemo()}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Loading synthetic demo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>Load synthetic demo</span>
                </>
              )}
            </button>
            <Link
              href="/import"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-2xs transition hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:outline-none"
            >
              <span>Go to Import Sales</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : (
        <section
          aria-labelledby="active-dataset-heading"
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h2 id="active-dataset-heading" className="text-lg font-bold text-slate-900">
                Active Session Dataset Overview
              </h2>
              {provenance === "synthetic_demo" ? (
                <span className="rounded-md border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
                  Illustrative synthetic demo data — not real retailer records
                </span>
              ) : (
                <span className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                  User-uploaded CSV ({sourceFilename ?? "upload.csv"})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/import"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Manage Import
              </Link>
              <Link
                href="/forecast"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Open Demand Forecast</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Total Products (SKUs)</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {analysis.summary.products_total}
              </div>
              <div className="mt-1 text-[11px] text-slate-600">
                {analysis.summary.products_with_forecast} with 14-day forecast
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Accepted Sales Rows</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {analysis.summary.accepted_rows}
              </div>
              <div className="mt-1 text-[11px] text-slate-600">
                {analysis.summary.aggregated_daily_rows} daily SKU observations
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Total Historical Units</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {analysis.products
                  .reduce(
                    (sum, p) => sum + p.history.reduce((s, pt) => s + pt.units, 0),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-slate-600">
                Summed across accepted SKUs
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">At-Risk SKU Count</div>
              {evaluatedRecs.length > 0 ? (
                <>
                  <div className="mt-1 text-2xl font-bold text-slate-900">
                    {atRiskCount} / {evaluatedRecs.length}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600">
                    SKUs with high/medium point-forecast risk from entered stock
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    Requires stock &amp; lead-time inputs
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600">
                    Enter stock on /recommendations to compute risk
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th scope="col" className="px-3 py-2.5">SKU ID</th>
                  <th scope="col" className="px-3 py-2.5">Product Name</th>
                  <th scope="col" className="px-3 py-2.5 text-right">History Days</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Historical Units</th>
                  <th scope="col" className="px-3 py-2.5">Current Forecast Method</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Next 14-Day Forecast</th>
                  <th scope="col" className="px-3 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {analysis.products.map((prod) => {
                  const histSum = prod.history.reduce((s, pt) => s + pt.units, 0);
                  const fcSum = prod.forecast.reduce((s, pt) => s + pt.units, 0);
                  return (
                    <tr key={prod.product_id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-mono font-medium text-slate-900">
                        {prod.product_id}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-800">
                        {prod.product_name}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono">
                        {prod.history.length}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono">
                        {histSum.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5 font-mono">
                        {prod.chosen_method ?? "none"} ({prod.status})
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold">
                        {prod.forecast.length > 0 ? `${fcSum} units` : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <Link
                          href="/forecast"
                          onClick={() => setSelectedProductId(prod.product_id)}
                          className="font-semibold text-indigo-700 hover:underline"
                        >
                          Inspect forecast →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <LimitationsPanel />
    </div>
  );
}
