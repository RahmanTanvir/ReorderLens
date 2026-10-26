"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { ForecastChart } from "@/components/ForecastChart";
import { ErrorRetry } from "@/components/ErrorRetry";
import { LimitationsPanel } from "@/components/LimitationsPanel";
import { formatInteger, formatMae, formatShortDate, formatUnits } from "@/lib/format";

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
        <section className="rounded-2xl border border-[#DEE6EB] bg-white p-6 sm:p-8 shadow-2xs">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-[#102034]">
              Demand forecast
            </h1>
            <p className="mt-1 text-sm text-[#536579]">
              Compare leakage-safe recursive 14-day Ridge regression forecasts against a 7-day seasonal-naive baseline using chronological 14-day validation MAE.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-[#DEE6EB] bg-[#F6F8FA] p-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F6F4] text-[#087F78]">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-base font-semibold text-[#102034]">
              Load sales history to generate 14-day forecasts
            </h2>
            <p className="mx-auto mt-1 max-w-lg text-xs leading-relaxed text-[#536579]">
              Import a daily sales CSV or load the 3-product sample dataset (`Illustrative synthetic demo data — not real retailer records`) to inspect product demand curves.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void loadSyntheticDemo()}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 rounded-xl bg-[#087F78] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition hover:bg-[#0B746E] disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>{isAnalyzing ? "Loading sample…" : "Explore sample data"}</span>
              </button>
              <Link
                href="/import"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DEE6EB] bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
              >
                <FileSpreadsheet className="h-4 w-4 text-[#536579]" aria-hidden="true" />
                <span>Import CSV</span>
              </Link>
            </div>
          </div>
        </section>
        <LimitationsPanel />
      </div>
    );
  }

  const activeProduct =
    analysis.products.find((p) => p.product_id === selectedProductId) ??
    analysis.products[0] ??
    null;

  const forecastTotal = activeProduct
    ? activeProduct.forecast.reduce((sum, pt) => sum + pt.units, 0)
    : 0;

  const forecastStart = activeProduct?.forecast[0]?.date ?? "";
  const forecastEnd =
    activeProduct?.forecast[activeProduct.forecast.length - 1]?.date ?? "";

  return (
    <div className="space-y-5">
      {/* Compact Header + SKU Selector + Top Metric Strip */}
      <section className="rounded-2xl border border-[#DEE6EB] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col gap-4 border-b border-[#DEE6EB] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102034]">
                Demand forecast
              </h1>
              {provenance === "synthetic_demo" ? (
                <span className="rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-0.5 text-xs font-medium text-[#A65C06]">
                  Illustrative synthetic demo data — not real retailer records
                </span>
              ) : (
                <span className="rounded-full border border-[#DEE6EB] bg-[#EFF4F6] px-2.5 py-0.5 text-xs font-medium text-[#102034]">
                  Uploaded CSV ({sourceFilename ?? "upload.csv"})
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[#536579]">
              Recursive 14-day point forecast selected via chronological 14-day holdout MAE (StandardScaler + Ridge vs. 7-day seasonal naive).
            </p>
          </div>

          {/* SKU Picker & Next Step Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <label
                htmlFor="sku-picker"
                className="text-xs font-semibold text-[#536579]"
              >
                Product:
              </label>
              <select
                id="sku-picker"
                value={activeProduct?.product_id ?? ""}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] px-3 py-2 text-xs sm:text-sm font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
              >
                {analysis.products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_name} ({p.product_id}) —{" "}
                    {p.chosen_method === "ridge"
                      ? "Ridge"
                      : p.chosen_method === "seasonal_naive"
                      ? "Seasonal naive"
                      : "No forecast"}
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/recommendations"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#087F78] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition hover:bg-[#0B746E]"
            >
              <span>Calculate reorder</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {activeProduct && (
          <div className="mt-4 space-y-5">
            {/* Compact Hero Metric Strip (Above the Chart) */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] px-4 py-3">
                <div className="text-xs font-medium text-[#536579]">
                  14-day forecast total
                </div>
                <div className="mt-1 text-xl sm:text-2xl font-bold text-[#087F78] tabular-nums">
                  {activeProduct.forecast.length > 0
                    ? `${formatUnits(forecastTotal, 1)} units`
                    : "—"}
                </div>
                <div className="mt-0.5 text-[11px] text-[#536579] tabular-nums">
                  {activeProduct.forecast.length > 0
                    ? `Avg ${formatUnits(forecastTotal / 14, 1)} units / day`
                    : "Requires ≥14 history days"}
                </div>
              </div>

              <div className="rounded-xl border border-[#087F78]/25 bg-[#E8F6F4]/60 px-4 py-3">
                <div className="text-xs font-medium text-[#536579]">
                  Chosen method
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-base sm:text-lg font-bold text-[#102034]">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#087F78]"
                    aria-hidden="true"
                  />
                  <span>
                    {activeProduct.chosen_method === "ridge"
                      ? "Ridge regression"
                      : activeProduct.chosen_method === "seasonal_naive"
                      ? "Seasonal naive"
                      : "None"}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-[#536579]">
                  Status:{" "}
                  <code className="font-mono text-[#102034]">
                    {activeProduct.status}
                  </code>{" "}
                  ({formatInteger(activeProduct.history.length)}d history)
                </div>
              </div>

              <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] px-4 py-3">
                <div className="text-xs font-medium text-[#536579]">
                  Model-selection holdout MAE
                </div>
                {activeProduct.validation ? (
                  <>
                    <div className="mt-1 text-xl sm:text-2xl font-bold text-[#102034] tabular-nums">
                      {formatMae(activeProduct.validation.selected_method_mae)}{" "}
                      <span className="text-xs font-normal text-[#536579]">
                        units
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-[#536579] tabular-nums">
                      Ridge {formatMae(activeProduct.validation.ridge_mae)} vs Naive{" "}
                      {formatMae(activeProduct.validation.seasonal_naive_mae)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-1 text-sm font-semibold text-[#102034]">
                      Not evaluated (&lt;60 days)
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#536579]">
                      Requires ≥60 consecutive days
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] px-4 py-3">
                <div className="text-xs font-medium text-[#536579]">
                  Forecast horizon
                </div>
                <div className="mt-1 text-base sm:text-lg font-bold text-[#102034]">
                  {forecastStart && forecastEnd
                    ? `${formatShortDate(forecastStart)} – ${formatShortDate(
                        forecastEnd,
                        true
                      )}`
                    : "—"}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[#536579]">
                  {forecastStart && forecastEnd
                    ? `${forecastStart} → ${forecastEnd}`
                    : "No forecast dates"}
                </div>
              </div>
            </div>

            {/* Status Callouts when baseline_only or insufficient_history */}
            {activeProduct.status === "baseline_only" && (
              <div
                role="status"
                className="rounded-xl border border-[#F5D08A] bg-[#FFF6E8] p-4 text-xs text-[#A65C06]"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#A65C06]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[#102034]">
                      Baseline-only forecast mode (14–59 consecutive days)
                    </p>
                    <p className="mt-0.5">
                      This SKU has {activeProduct.history.length} consecutive daily observations (fewer than the 60 days required for chronological ML holdout validation). A 7-day seasonal-naive baseline is shown.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeProduct.status === "insufficient_history" && (
              <div
                role="alert"
                className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] p-4 text-xs text-[#B42318]"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#B42318]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[#102034]">
                      Insufficient daily history (&lt;14 consecutive days)
                    </p>
                    <p className="mt-0.5">
                      This SKU has only {activeProduct.history.length} consecutive daily observation(s). At least 14 consecutive daily records are required to generate a 14-day forecast.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Visual: Recharts Plot Immediately Below Top Strip */}
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

            {/* Below the Chart: Side-by-Side Model Validation Comparison & Selection Rationale */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4 lg:col-span-5">
                <h2 className="text-sm font-semibold text-[#102034]">
                  14-day chronological holdout comparison
                </h2>
                <p className="mt-0.5 text-xs text-[#536579]">
                  Evaluated recursively on the last 14 observed days without reading withheld actuals.
                </p>

                {activeProduct.validation ? (
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div
                      className={`flex items-center justify-between rounded-lg border p-2.5 ${
                        activeProduct.chosen_method === "ridge"
                          ? "border-[#087F78] bg-[#E8F6F4]/70"
                          : "border-[#DEE6EB] bg-white"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-[#102034]">
                          Ridge regression{" "}
                          {activeProduct.chosen_method === "ridge" && (
                            <span className="ml-1 rounded bg-[#087F78] px-1.5 py-0.5 text-[10px] font-bold text-white">
                              WINNER
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#536579]">
                          Lags 1 &amp; 7, 7d/14d rolling means, weekday indicators
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-[#102034] tabular-nums">
                        {formatMae(activeProduct.validation.ridge_mae)} MAE
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-lg border p-2.5 ${
                        activeProduct.chosen_method === "seasonal_naive"
                          ? "border-[#087F78] bg-[#E8F6F4]/70"
                          : "border-[#DEE6EB] bg-white"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-[#102034]">
                          7-day seasonal-naive baseline{" "}
                          {activeProduct.chosen_method === "seasonal_naive" && (
                            <span className="ml-1 rounded bg-[#087F78] px-1.5 py-0.5 text-[10px] font-bold text-white">
                              WINNER
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#536579]">
                          Repeats same-weekday demand from 7 days prior
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-[#102034] tabular-nums">
                        {formatMae(activeProduct.validation.seasonal_naive_mae)} MAE
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-[#536579]">
                    Holdout MAE comparison is only computed for SKUs with at least 60 consecutive days of history.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4 lg:col-span-7">
                <h2 className="text-sm font-semibold text-[#102034]">
                  Why this method was selected
                </h2>
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-[#536579]">
                  {activeProduct.notes.map((note, idx) => (
                    <li key={idx} className="text-[#102034]">
                      {note}
                    </li>
                  ))}
                  <li>
                    <strong className="font-semibold text-[#102034]">
                      Model-selection holdout vs. production accuracy:
                    </strong>{" "}
                    Reported MAE values compare candidate models on the last 14 withheld days; they are not an independent test guarantee.
                  </li>
                </ul>
              </div>
            </div>

            {/* Accessible Tabular Forecast & Recent Observed History */}
            {activeProduct.forecast.length > 0 && (
              <details
                open
                className="group rounded-xl border border-[#DEE6EB] bg-white text-xs"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-2 rounded-xl px-4 py-3 font-semibold text-[#102034] transition hover:bg-[#EFF4F6]/60">
                  <span>
                    Accessible data tables: 14-day forecast values &amp; last 14 observed days ({activeProduct.product_id})
                  </span>
                  <ChevronDown
                    className="h-4 w-4 text-[#536579] transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="grid grid-cols-1 gap-6 border-t border-[#DEE6EB] p-4 lg:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#536579]">
                      14-Day Point Forecast ({activeProduct.chosen_method})
                    </h3>
                    <div className="mt-2 overflow-x-auto rounded-lg border border-[#DEE6EB]">
                      <table className="min-w-full divide-y divide-[#DEE6EB] text-left text-xs">
                        <thead className="bg-[#EFF4F6] font-semibold text-[#536579]">
                          <tr>
                            <th scope="col" className="px-3 py-2">
                              Horizon
                            </th>
                            <th scope="col" className="px-3 py-2">
                              Forecast date
                            </th>
                            <th scope="col" className="px-3 py-2 text-right">
                              Predicted units
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEE6EB] bg-white tabular-nums">
                          {activeProduct.forecast.map((pt, idx) => (
                            <tr key={pt.date} className="hover:bg-[#F6F8FA]">
                              <td className="px-3 py-1.5 font-mono text-[#536579]">
                                Day +{idx + 1}
                              </td>
                              <td className="px-3 py-1.5 font-mono font-medium text-[#102034]">
                                {pt.date}
                              </td>
                              <td className="px-3 py-1.5 text-right font-mono font-semibold text-[#087F78]">
                                {formatUnits(pt.units, 2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#536579]">
                      Last 14 Observed Historical Days (Holdout Window)
                    </h3>
                    <div className="mt-2 overflow-x-auto rounded-lg border border-[#DEE6EB]">
                      <table className="min-w-full divide-y divide-[#DEE6EB] text-left text-xs">
                        <thead className="bg-[#EFF4F6] font-semibold text-[#536579]">
                          <tr>
                            <th scope="col" className="px-3 py-2">
                              Observed date
                            </th>
                            <th scope="col" className="px-3 py-2 text-right">
                              Actual units sold
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEE6EB] bg-white tabular-nums">
                          {activeProduct.history.slice(-14).map((pt) => (
                            <tr key={pt.date} className="hover:bg-[#F6F8FA]">
                              <td className="px-3 py-1.5 font-mono font-medium text-[#102034]">
                                {pt.date}
                              </td>
                              <td className="px-3 py-1.5 text-right font-mono text-[#102034]">
                                {formatInteger(pt.units)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </details>
            )}
          </div>
        )}
      </section>

      <LimitationsPanel />
    </div>
  );
}
