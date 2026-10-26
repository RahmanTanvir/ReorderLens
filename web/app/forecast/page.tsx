"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { ForecastChart } from "@/components/ForecastChart";
import { ErrorRetry } from "@/components/ErrorRetry";
import { LimitationsPanel } from "@/components/LimitationsPanel";

export default function ForecastPage() {
  const {
    analysis,
    provenance,
    sourceFilename,
    selectedProductId,
    setSelectedProductId,
    isAnalyzing,
    error,
    loadSyntheticDemo,
  } = useAnalysis();

  if (!analysis) {
    return (
      <div className="space-y-6">
        {error && (
          <ErrorRetry
            title="Forecast Dataset Load Error"
            code={error.code}
            message={error.message}
            details={error.details}
            onRetry={() => void loadSyntheticDemo()}
            retrying={isAnalyzing}
          />
        )}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h1 className="text-xl font-bold text-slate-900">14-Day Demand Forecast</h1>
          <p className="mt-1 text-sm text-slate-600">
            Compare leakage-safe recursive 14-day Ridge regression forecasts against a 7-day seasonal-naive baseline using chronological 14-day validation MAE.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold text-slate-900">
              No Active Forecast Analysis in Memory
            </h2>
            <p className="mx-auto mt-1 max-w-xl text-xs text-slate-600">
              Import a daily sales CSV or load the built-in synthetic demo dataset to compute SKU forecasts. Refreshing the browser tab resets in-memory session state.
            </p>
            <p className="mx-auto mt-2 max-w-md rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-950">
              Illustrative synthetic demo data — not real retailer records
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void loadSyntheticDemo()}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-800 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isAnalyzing ? "Loading demo..." : "Load synthetic demo"}</span>
              </button>
              <Link
                href="/import"
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100"
              >
                Go to Import Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const activeProduct =
    analysis.products.find((p) => p.product_id === selectedProductId) ??
    analysis.products[0] ??
    null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                14-Day Demand Forecast &amp; Validation Comparison
              </h1>
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
            <p className="mt-1 text-xs text-slate-600">
              For SKUs with ≥60 consecutive daily records, the last 14 observed days are withheld for recursive chronological validation comparing StandardScaler + Ridge regression (lags 1 &amp; 7, 7- &amp; 14-day rolling means, weekday indicators) against a 7-day seasonal-naive baseline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="sku-picker" className="text-xs font-semibold text-slate-700">
                Product (SKU):
              </label>
              <select
                id="sku-picker"
                value={activeProduct?.product_id ?? ""}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              >
                {analysis.products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_id} — {p.product_name} ({p.chosen_method ?? "no forecast"})
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/recommendations"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <span>Inventory Recommendations</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {activeProduct && (
          <div className="mt-6 space-y-6">
            {/* Status & Validation Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Evaluation Status</div>
                <div className="mt-1 font-mono text-sm font-bold text-slate-900">
                  {activeProduct.status}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  {activeProduct.history.length} consecutive daily records (
                  {activeProduct.history[0]?.date} →{" "}
                  {activeProduct.history[activeProduct.history.length - 1]?.date})
                </div>
              </div>

              <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-4">
                <div className="text-xs font-medium text-indigo-900">
                  Chosen Forecast Method
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-sm font-bold text-indigo-950">
                  <CheckCircle2 className="h-4 w-4 text-indigo-700" aria-hidden="true" />
                  <span>{activeProduct.chosen_method ?? "none"}</span>
                </div>
                <div className="mt-1 text-[11px] text-indigo-900">
                  {activeProduct.chosen_method === "ridge"
                    ? "Selected via lower 14-day validation MAE"
                    : activeProduct.chosen_method === "seasonal_naive"
                    ? activeProduct.status === "evaluated"
                      ? "Baseline beat or tied Ridge on validation MAE"
                      : "Fallback baseline (14–59 history days)"
                    : "Requires ≥14 consecutive days"}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">
                  14-Day Validation MAE (Model Selection)
                </div>
                {activeProduct.validation ? (
                  <div className="mt-1 space-y-0.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ridge MAE:</span>
                      <span className="font-bold text-slate-900">
                        {activeProduct.validation.ridge_mae.toFixed(2)} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Seasonal-Naive MAE:</span>
                      <span className="font-bold text-slate-900">
                        {activeProduct.validation.seasonal_naive_mae.toFixed(2)} units
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-0.5 text-indigo-900">
                      <span>Selected MAE:</span>
                      <span className="font-bold">
                        {activeProduct.validation.selected_method_mae.toFixed(2)} units
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-slate-600">
                    Not available (<code className="font-mono">validation: null</code>). Requires ≥60 consecutive daily observations.
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">
                  14-Day Point Forecast Total
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-slate-900">
                  {activeProduct.forecast.length > 0
                    ? `${
                        Math.round(
                          activeProduct.forecast.reduce((s, pt) => s + pt.units, 0) * 100
                        ) / 100
                      } units`
                    : "—"}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  {activeProduct.forecast.length > 0
                    ? `${activeProduct.forecast[0].date} → ${
                        activeProduct.forecast[activeProduct.forecast.length - 1].date
                      }`
                    : "No 14-day forecast available"}
                </div>
              </div>
            </div>

            {/* Status-specific banners */}
            {activeProduct.status === "baseline_only" && (
              <div
                role="status"
                className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">
                      Baseline-Only Forecast Mode (14–59 Consecutive Days)
                    </p>
                    <p className="mt-0.5">
                      This SKU has {activeProduct.history.length} consecutive daily observations (fewer than the 60 days required for chronological ML validation). A 7-day seasonal-naive baseline is shown without validation MAE.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeProduct.status === "insufficient_history" && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 p-4 text-xs text-red-950"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">
                      Insufficient Daily History (&lt;14 Consecutive Days)
                    </p>
                    <p className="mt-0.5">
                      This SKU has only {activeProduct.history.length} consecutive daily observation(s). At least 14 consecutive daily records are required to generate a 14-day forecast.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes & Limitations */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-900">
                    Model Selection Notes &amp; Scientific Limitations:
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    {activeProduct.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                    <li>
                      <strong>Validation vs. Test Accuracy:</strong> Reported MAE values are computed on the last 14 withheld chronological days for model selection; they are not an independent unbiased test score or field accuracy guarantee.
                    </li>
                    <li>
                      <strong>Demand Censoring:</strong> Historical sales reflect observed transactions and may understate true demand if the item was previously out of stock. Promotions, holidays, and supplier disruptions are not modeled in this MVP.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recharts Plot */}
            {activeProduct.forecast.length > 0 && (
              <ForecastChart
                productId={activeProduct.product_id}
                productName={activeProduct.product_name}
                history={activeProduct.history}
                forecast={activeProduct.forecast}
                chosenMethod={activeProduct.chosen_method}
                isSyntheticDemo={provenance === "synthetic_demo"}
              />
            )}

            {/* Accessible Forecast & Recent History Tables */}
            {activeProduct.forecast.length > 0 && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    14-Day Point Forecast Table ({activeProduct.chosen_method})
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Screen-reader-accessible daily forecast values following last observed date{" "}
                    <code className="font-mono">
                      {activeProduct.history[activeProduct.history.length - 1]?.date}
                    </code>.
                  </p>
                  <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                      <thead className="bg-slate-100 font-semibold text-slate-700">
                        <tr>
                          <th scope="col" className="px-3 py-2">Horizon Day</th>
                          <th scope="col" className="px-3 py-2">Forecast Date</th>
                          <th scope="col" className="px-3 py-2 text-right">
                            Predicted Units
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {activeProduct.forecast.map((pt, idx) => (
                          <tr key={pt.date} className="hover:bg-slate-50">
                            <td className="px-3 py-1.5 font-mono text-slate-600">
                              Day +{idx + 1}
                            </td>
                            <td className="px-3 py-1.5 font-mono font-medium text-slate-900">
                              {pt.date}
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono font-semibold text-indigo-900">
                              {pt.units}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Last 14 Observed Historical Days (Validation Window Reference)
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Most recent 14 daily observations in submitted CSV for{" "}
                    <code className="font-mono">{activeProduct.product_id}</code>.
                  </p>
                  <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                      <thead className="bg-slate-100 font-semibold text-slate-700">
                        <tr>
                          <th scope="col" className="px-3 py-2">Observed Date</th>
                          <th scope="col" className="px-3 py-2 text-right">
                            Actual Units Sold
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {activeProduct.history.slice(-14).map((pt) => (
                          <tr key={pt.date} className="hover:bg-slate-50">
                            <td className="px-3 py-1.5 font-mono font-medium text-slate-900">
                              {pt.date}
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono text-slate-800">
                              {pt.units}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      <LimitationsPanel />
    </div>
  );
}
