"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Download,
  Info,
  Loader2,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import {
  ApiClientError,
  RecommendationResponseItem,
  fetchRecommendations,
} from "@/lib/api";
import { ErrorRetry } from "@/components/ErrorRetry";
import { LimitationsPanel } from "@/components/LimitationsPanel";

export default function RecommendationsPage() {
  const {
    analysis,
    provenance,
    sourceFilename,
    selectedProductId,
    setSelectedProductId,
    isAnalyzing,
    loadSyntheticDemo,
    recommendationsBySku,
    settingsBySku,
    recordRecommendationResult,
  } = useAnalysis();

  const activeProduct =
    analysis?.products.find((p) => p.product_id === selectedProductId) ??
    analysis?.products[0] ??
    null;

  const [stockInput, setStockInput] = useState<string>("25");
  const [leadDaysInput, setLeadDaysInput] = useState<string>("7");
  const [safetyStockInput, setSafetyStockInput] = useState<string>("0");

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calcError, setCalcError] = useState<{
    code?: string;
    message: string;
    details?: string[];
  } | null>(null);

  // Sync input fields when user switches SKU
  useEffect(() => {
    if (!activeProduct) return;
    const saved = settingsBySku[activeProduct.product_id];
    if (saved) {
      setStockInput(String(saved.stock_on_hand));
      setLeadDaysInput(String(saved.lead_time_days));
      setSafetyStockInput(String(saved.safety_stock_units));
    } else {
      setStockInput("25");
      setLeadDaysInput("7");
      setSafetyStockInput("0");
    }
    setCalcError(null);
  }, [activeProduct?.product_id, activeProduct, settingsBySku]);

  const executeRecommendationCalculation = useCallback(
    async (
      rawStock: string,
      rawLead: string,
      rawSafety: string
    ): Promise<void> => {
      if (!activeProduct || activeProduct.forecast.length !== 14) return;

      const trimmedStock = rawStock.trim();
      const trimmedLead = rawLead.trim();
      const trimmedSafety = rawSafety.trim() === "" ? "0" : rawSafety.trim();

      const parsedStock = Number(trimmedStock);
      const parsedLead = Number(trimmedLead);
      const parsedSafety = Number(trimmedSafety);

      if (
        trimmedStock === "" ||
        !Number.isInteger(parsedStock) ||
        parsedStock < 0 ||
        parsedStock > 1_000_000
      ) {
        setCalcError({
          code: "INVALID_STOCK_INPUT",
          message:
            "Current stock on hand must be a whole integer between 0 and 1,000,000 units.",
          details: ["Negative, fractional, or empty stock values are not allowed."],
        });
        return;
      }

      if (
        trimmedLead === "" ||
        !Number.isInteger(parsedLead) ||
        parsedLead < 1 ||
        parsedLead > 14
      ) {
        setCalcError({
          code: "INVALID_LEAD_TIME",
          message:
            "Supplier lead time must be an integer between 1 and 14 days (matching the 14-day forecast horizon).",
          details: ["Enter an integer from 1 to 14."],
        });
        return;
      }

      if (
        !Number.isInteger(parsedSafety) ||
        parsedSafety < 0 ||
        parsedSafety > 1_000_000
      ) {
        setCalcError({
          code: "INVALID_SAFETY_STOCK",
          message:
            "Safety stock buffer must be a whole integer between 0 and 1,000,000 units.",
          details: ["Default safety stock is 0 units."],
        });
        return;
      }

      setIsCalculating(true);
      setCalcError(null);

      try {
        const res = await fetchRecommendations({
          items: [
            {
              product_id: activeProduct.product_id,
              stock_on_hand: parsedStock,
              lead_time_days: parsedLead,
              safety_stock_units: parsedSafety,
              forecast: activeProduct.forecast,
            },
          ],
        });
        const first = res.items[0];
        if (first) {
          recordRecommendationResult(
            activeProduct.product_id,
            {
              stock_on_hand: parsedStock,
              lead_time_days: parsedLead,
              safety_stock_units: parsedSafety,
            },
            first
          );
        }
      } catch (err) {
        if (err instanceof ApiClientError) {
          setCalcError({
            code: err.code,
            message: err.message,
            details: err.details,
          });
        } else {
          setCalcError({
            code: "RECOMMENDATION_ERROR",
            message:
              err instanceof Error
                ? err.message
                : "Unexpected error calculating inventory recommendation.",
          });
        }
      } finally {
        setIsCalculating(false);
      }
    },
    [activeProduct, recordRecommendationResult]
  );

  // Auto-calculate initial recommendation once when a forecastable SKU is first viewed
  useEffect(() => {
    if (
      activeProduct &&
      activeProduct.forecast.length === 14 &&
      !recommendationsBySku[activeProduct.product_id] &&
      !isCalculating
    ) {
      void executeRecommendationCalculation("25", "7", "0");
    }
  }, [
    activeProduct,
    recommendationsBySku,
    isCalculating,
    executeRecommendationCalculation,
  ]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeRecommendationCalculation(
      stockInput,
      leadDaysInput,
      safetyStockInput
    );
  };

  const sanitizeCsvCell = (val: string | number): string => {
    const str = String(val);
    const safe = /^[=+\-@]/.test(str) ? `'${str}` : str;
    if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
      return `"${safe.replace(/"/g, '""')}"`;
    }
    return safe;
  };

  const handleExportRecommendationsCsv = () => {
    const entries = Object.values(recommendationsBySku);
    if (entries.length === 0) return;

    const header = [
      "product_id",
      "stock_on_hand",
      "lead_time_days",
      "safety_stock_units",
      "expected_lead_time_demand",
      "projected_shortage_units",
      "reorder_quantity_units",
      "risk_level",
      "provenance_note",
    ].join(",");

    const provLabel =
      provenance === "synthetic_demo"
        ? "Illustrative synthetic demo data - not real retailer records"
        : "User-uploaded CSV session (estimate only)";

    const rows = entries.map((item) => {
      const s = settingsBySku[item.product_id] ?? {
        stock_on_hand: 0,
        lead_time_days: 7,
        safety_stock_units: 0,
      };
      return [
        sanitizeCsvCell(item.product_id),
        sanitizeCsvCell(s.stock_on_hand),
        sanitizeCsvCell(s.lead_time_days),
        sanitizeCsvCell(s.safety_stock_units),
        sanitizeCsvCell(item.expected_lead_time_demand),
        sanitizeCsvCell(item.projected_shortage_units),
        sanitizeCsvCell(item.reorder_quantity_units),
        sanitizeCsvCell(item.risk_level),
        sanitizeCsvCell(provLabel),
      ].join(",");
    });

    const csvContent = [header, ...rows].join("\n") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reorderlens-recommendations.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!analysis) {
    return (
      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h1 className="text-xl font-bold text-slate-900">
            Inventory Reorder Recommendations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Enter current stock on hand, supplier lead days (1–14), and optional safety stock to compute deterministic reorder quantities from the 14-day forecast via{" "}
            <code className="font-mono text-xs">POST /backend/v1/recommendations</code>.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <PackageCheck className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold text-slate-900">
              No Forecast Loaded in Session
            </h2>
            <p className="mx-auto mt-1 max-w-xl text-xs text-slate-600">
              Import a daily sales CSV or load the built-in synthetic demo dataset first so that SKU forecasts are available for inventory calculation.
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

  const currentResult: RecommendationResponseItem | null = activeProduct
    ? recommendationsBySku[activeProduct.product_id] ?? null
    : null;
  const appliedSettings = activeProduct
    ? settingsBySku[activeProduct.product_id] ?? null
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Deterministic Inventory Reorder Recommendations
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
              Computes expected demand over supplier lead time (<code className="font-mono">1–14 days</code>), projected point-forecast shortage, and suggested reorder quantity via{" "}
              <code className="font-mono">POST /backend/v1/recommendations</code> without retraining the forecast model.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="rec-sku-picker" className="text-xs font-semibold text-slate-700">
              Select SKU:
            </label>
            <select
              id="rec-sku-picker"
              value={activeProduct?.product_id ?? ""}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-slate-500 focus:outline-none"
            >
              {analysis.products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_id} — {p.product_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeProduct && activeProduct.forecast.length !== 14 ? (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-5 text-xs text-amber-950"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <div>
                <p className="font-bold text-sm">
                  No Valid 14-Day Forecast Available for {activeProduct.product_id}
                </p>
                <p className="mt-1">
                  Status: <code className="font-mono font-semibold">{activeProduct.status}</code>. Inventory recommendations require a 14-day forecast (at least 14 consecutive daily historical observations without date gaps).
                </p>
              </div>
            </div>
          </div>
        ) : (
          activeProduct && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Editable Inventory Inputs */}
              <form
                onSubmit={(e) => void handleFormSubmit(e)}
                noValidate
                className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 lg:col-span-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    Inventory &amp; Lead-Time Parameters
                  </h2>
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[11px] text-slate-800">
                    {activeProduct.product_id}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="stock-on-hand-input"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Current Stock on Hand (units)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Whole nonnegative integer (0 to 1,000,000)
                  </p>
                  <input
                    id="stock-on-hand-input"
                    type="number"
                    min={0}
                    max={1000000}
                    step={1}
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-time-days-input"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Supplier Lead Time (days, 1–14)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Sums the first L days of the 14-day forecast
                  </p>
                  <input
                    id="lead-time-days-input"
                    type="number"
                    min={1}
                    max={14}
                    step={1}
                    value={leadDaysInput}
                    onChange={(e) => setLeadDaysInput(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="safety-stock-input"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Safety Stock Buffer (units, default 0)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Optional buffer added above expected lead-time demand
                  </p>
                  <input
                    id="safety-stock-input"
                    type="number"
                    min={0}
                    max={1000000}
                    step={1}
                    value={safetyStockInput}
                    onChange={(e) => setSafetyStockInput(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Calculating via /backend/v1/recommendations...</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4" aria-hidden="true" />
                        <span>Calculate Reorder Recommendation</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick scenario presets for demo walkthrough convenience */}
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-[11px] font-semibold text-slate-600">
                    Quick Scenario Presets (calls live API):
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={isCalculating}
                      onClick={() => {
                        setStockInput("0");
                        setLeadDaysInput("7");
                        setSafetyStockInput("10");
                        void executeRecommendationCalculation("0", "7", "10");
                      }}
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Low Stock (Stock=0, Lead=7d, Safety=10)
                    </button>
                    <button
                      type="button"
                      disabled={isCalculating}
                      onClick={() => {
                        setStockInput("300");
                        setLeadDaysInput("7");
                        setSafetyStockInput("10");
                        void executeRecommendationCalculation("300", "7", "10");
                      }}
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Well-Stocked (Stock=300, Lead=7d)
                    </button>
                    <button
                      type="button"
                      disabled={isCalculating}
                      onClick={() => {
                        setStockInput("25");
                        setLeadDaysInput("14");
                        setSafetyStockInput("5");
                        void executeRecommendationCalculation("25", "14", "5");
                      }}
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      14-Day Lead Time (Stock=25, Lead=14d)
                    </button>
                  </div>
                </div>
              </form>

              {/* Right Column: Calculated API Output & Formula Breakdown */}
              <div className="space-y-4 lg:col-span-7">
                {calcError && (
                  <ErrorRetry
                    title="Recommendation Calculation Rejected"
                    code={calcError.code}
                    message={calcError.message}
                    details={calcError.details}
                    onRetry={() =>
                      void executeRecommendationCalculation(
                        stockInput,
                        leadDaysInput,
                        safetyStockInput
                      )
                    }
                    retrying={isCalculating}
                  />
                )}

                {currentResult && appliedSettings && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                        <h3 className="text-base font-bold text-slate-900">
                          Calculated Replenishment Result ({currentResult.product_id})
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold uppercase ${
                            currentResult.risk_level === "high"
                              ? "border-red-300 bg-red-100 text-red-950"
                              : currentResult.risk_level === "medium"
                              ? "border-amber-300 bg-amber-100 text-amber-950"
                              : "border-emerald-300 bg-emerald-100 text-emerald-950"
                          }`}
                        >
                          Projected Risk Scenario: {currentResult.risk_level}
                        </span>
                        <button
                          type="button"
                          onClick={handleExportRecommendationsCsv}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                        <div className="text-xs text-slate-500">
                          Expected Lead-Time Demand ({appliedSettings.lead_time_days}d)
                        </div>
                        <div className="mt-1 font-mono text-2xl font-bold text-slate-900">
                          {currentResult.expected_lead_time_demand}
                          <span className="ml-1 text-xs font-normal text-slate-600">
                            units
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                        <div className="text-xs text-slate-500">
                          Projected Shortage Scenario
                        </div>
                        <div className="mt-1 font-mono text-2xl font-bold text-slate-900">
                          {currentResult.projected_shortage_units}
                          <span className="ml-1 text-xs font-normal text-slate-600">
                            units
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-3.5">
                        <div className="text-xs font-semibold text-indigo-950">
                          Suggested Reorder Quantity
                        </div>
                        <div className="mt-1 font-mono text-2xl font-bold text-indigo-950">
                          {currentResult.reorder_quantity_units}
                          <span className="ml-1 text-xs font-normal text-indigo-800">
                            units
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Backend Explanation */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
                      <p className="font-semibold text-slate-900">
                        Backend Explanation:
                      </p>
                      <p className="mt-1 leading-relaxed">
                        {currentResult.explanation}
                      </p>
                    </div>

                    {/* Deterministic Arithmetic Breakdown */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs">
                      <p className="font-semibold text-slate-900">
                        Deterministic Formula Breakdown (No LLM Arithmetic):
                      </p>
                      <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-700">
                        <div>
                          1. expected_lead_time_demand = sum(forecast[0 :{" "}
                          {appliedSettings.lead_time_days}]) ={" "}
                          <strong>{currentResult.expected_lead_time_demand}</strong>
                        </div>
                        <div>
                          2. projected_shortage_units = max(0, ceil(
                          {currentResult.expected_lead_time_demand} -{" "}
                          {appliedSettings.stock_on_hand})) ={" "}
                          <strong>{currentResult.projected_shortage_units}</strong>
                        </div>
                        <div>
                          3. reorder_quantity_units = ceil(max(0,{" "}
                          {currentResult.expected_lead_time_demand} +{" "}
                          {appliedSettings.safety_stock_units} -{" "}
                          {appliedSettings.stock_on_hand})) ={" "}
                          <strong>{currentResult.reorder_quantity_units}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Non-automatic ordering & Risk Disclosure */}
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
                      <div className="flex items-start gap-2">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" aria-hidden="true" />
                        <p>
                          <strong>Human-in-the-Loop Decision Notice:</strong>{" "}
                          Projected shortage and risk level (<code className="font-mono">{currentResult.risk_level}</code>) indicate whether current stock covers the point-forecast demand over the {appliedSettings.lead_time_days}-day lead window. They are{" "}
                          <strong>not a calibrated stockout probability</strong>. ReorderLens AI never places automatic supplier orders; review supplier pack sizes, budget, and physical inventory before ordering.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </section>

      <LimitationsPanel />
    </div>
  );
}
