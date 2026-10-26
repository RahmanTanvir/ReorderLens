"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Download,
  FileSpreadsheet,
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
import { formatInteger, formatUnits } from "@/lib/format";

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
          details: [
            "Negative, fractional, or empty stock values are not allowed.",
          ],
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
        <section className="rounded-2xl border border-[#DEE6EB] bg-white p-6 sm:p-8 shadow-2xs">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-[#102034]">
              Turn forecasts into stock decisions
            </h1>
            <p className="mt-1 text-sm text-[#536579]">
              Enter current stock on hand, supplier lead time (1–14 days), and optional safety stock to compute deterministic reorder quantities from the 14-day forecast.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-[#DEE6EB] bg-[#F6F8FA] p-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F6F4] text-[#087F78]">
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-base font-semibold text-[#102034]">
              No active forecast in session
            </h2>
            <p className="mx-auto mt-1 max-w-lg text-xs leading-relaxed text-[#536579]">
              Import a daily sales CSV or load the 3-product sample dataset (`Illustrative synthetic demo data — not real retailer records`) first so SKU forecasts are ready for replenishment math.
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

  const currentResult: RecommendationResponseItem | null = activeProduct
    ? recommendationsBySku[activeProduct.product_id] ?? null
    : null;
  const appliedSettings = activeProduct
    ? settingsBySku[activeProduct.product_id] ?? null
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#DEE6EB] bg-white p-5 sm:p-6 shadow-2xs">
        {/* Header Bar + SKU Picker */}
        <div className="flex flex-col gap-4 border-b border-[#DEE6EB] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102034]">
                Turn forecasts into stock decisions
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
              Deterministic replenishment math over your supplier lead window (<code className="font-mono text-[#102034]">1–14 days</code>) via{" "}
              <code className="font-mono text-[#102034]">POST /backend/v1/recommendations</code>—without retraining the forecast model.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label
              htmlFor="rec-sku-picker"
              className="text-xs font-semibold text-[#536579]"
            >
              Select product:
            </label>
            <select
              id="rec-sku-picker"
              value={activeProduct?.product_id ?? ""}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] px-3 py-2 text-xs sm:text-sm font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
            >
              {analysis.products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name} ({p.product_id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeProduct && activeProduct.forecast.length !== 14 ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-[#F5D08A] bg-[#FFF6E8] p-5 text-xs text-[#A65C06]"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-[#A65C06]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-bold text-[#102034]">
                  No valid 14-day forecast available for {activeProduct.product_id}
                </p>
                <p className="mt-1">
                  Status:{" "}
                  <code className="font-mono font-semibold">
                    {activeProduct.status}
                  </code>
                  . Inventory recommendations require a 14-day forecast (at least 14 consecutive daily historical observations without date gaps).
                </p>
              </div>
            </div>
          </div>
        ) : (
          activeProduct && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column (5 cols): Inventory & Lead-Time Inputs */}
              <form
                onSubmit={(e) => void handleFormSubmit(e)}
                noValidate
                className="space-y-4 rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-5 lg:col-span-5"
              >
                <div className="flex items-center justify-between border-b border-[#DEE6EB] pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#102034]">
                      Inventory &amp; lead-time inputs
                    </h2>
                    <p className="text-xs text-[#536579]">
                      {activeProduct.product_name}
                    </p>
                  </div>
                  <span className="rounded-md border border-[#DEE6EB] bg-white px-2 py-0.5 font-mono text-xs font-medium text-[#102034]">
                    {activeProduct.product_id}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="stock-on-hand-input"
                    className="block text-xs font-semibold text-[#102034]"
                  >
                    Current stock on hand (units)
                  </label>
                  <p className="text-[11px] text-[#536579]">
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
                    className="mt-1.5 block w-full rounded-xl border border-[#DEE6EB] bg-white px-3.5 py-2 font-mono text-sm font-semibold text-[#102034] shadow-2xs tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-time-days-input"
                    className="block text-xs font-semibold text-[#102034]"
                  >
                    Supplier lead time (days, 1–14)
                  </label>
                  <p className="text-[11px] text-[#536579]">
                    Sums the first L days of the 14-day forecast horizon
                  </p>
                  <input
                    id="lead-time-days-input"
                    type="number"
                    min={1}
                    max={14}
                    step={1}
                    value={leadDaysInput}
                    onChange={(e) => setLeadDaysInput(e.target.value)}
                    className="mt-1.5 block w-full rounded-xl border border-[#DEE6EB] bg-white px-3.5 py-2 font-mono text-sm font-semibold text-[#102034] shadow-2xs tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="safety-stock-input"
                    className="block text-xs font-semibold text-[#102034]"
                  >
                    Safety stock buffer (units, default 0)
                  </label>
                  <p className="text-[11px] text-[#536579]">
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
                    className="mt-1.5 block w-full rounded-xl border border-[#DEE6EB] bg-white px-3.5 py-2 font-mono text-sm font-semibold text-[#102034] shadow-2xs tabular-nums"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#087F78] px-4 py-2.5 text-sm font-semibold text-white shadow-2xs transition hover:bg-[#0B746E] disabled:opacity-50 cursor-pointer"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Calculating recommendation…</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4" aria-hidden="true" />
                        <span>Calculate recommendation</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Scenario Presets */}
                <div className="border-t border-[#DEE6EB] pt-3">
                  <p className="text-[11px] font-semibold text-[#536579]">
                    Quick scenario presets (calls live API):
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={isCalculating}
                      onClick={() => {
                        setStockInput("0");
                        setLeadDaysInput("7");
                        setSafetyStockInput("10");
                        void executeRecommendationCalculation("0", "7", "10");
                      }}
                      className="rounded-lg border border-[#DEE6EB] bg-white px-2.5 py-1 text-xs font-medium text-[#102034] transition hover:bg-[#EFF4F6] cursor-pointer"
                    >
                      Out of stock (0 on hand, 7d)
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
                      className="rounded-lg border border-[#DEE6EB] bg-white px-2.5 py-1 text-xs font-medium text-[#102034] transition hover:bg-[#EFF4F6] cursor-pointer"
                    >
                      Well-stocked (300 on hand, 7d)
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
                      className="rounded-lg border border-[#DEE6EB] bg-white px-2.5 py-1 text-xs font-medium text-[#102034] transition hover:bg-[#EFF4F6] cursor-pointer"
                    >
                      14-day lead (25 on hand, 14d)
                    </button>
                  </div>
                </div>
              </form>

              {/* Right Column (7 cols): Decision-First Hero Card */}
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
                  <div className="space-y-5 rounded-xl border border-[#DEE6EB] bg-white p-5 sm:p-6 shadow-2xs">
                    {/* Top Bar: Risk Scenario Badge + Export CSV */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DEE6EB] pb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                          currentResult.risk_level === "high"
                            ? "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
                            : currentResult.risk_level === "medium"
                            ? "border-[#F5D08A] bg-[#FFF6E8] text-[#A65C06]"
                            : "border-[#D1FADF] bg-[#ECFDF3] text-[#027A48]"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            currentResult.risk_level === "high"
                              ? "bg-[#B42318]"
                              : currentResult.risk_level === "medium"
                              ? "bg-[#A65C06]"
                              : "bg-[#027A48]"
                          }`}
                          aria-hidden="true"
                        />
                        <span>
                          Point-forecast risk scenario:{" "}
                          <span className="uppercase">
                            {currentResult.risk_level}
                          </span>
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={handleExportRecommendationsCsv}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#DEE6EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#102034] transition hover:bg-[#EFF4F6] cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-[#087F78]" aria-hidden="true" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    {/* Hero Decision Headline */}
                    <div className="rounded-xl border border-[#087F78]/30 bg-[#E8F6F4]/70 p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#087F78]">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>Suggested replenishment order</span>
                      </div>
                      <div className="mt-1.5 text-3xl sm:text-4xl font-bold tracking-tight text-[#102034] tabular-nums">
                        {currentResult.reorder_quantity_units > 0
                          ? `Reorder ${formatInteger(
                              currentResult.reorder_quantity_units
                            )} units`
                          : "No reorder needed (0 units)"}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#536579]">
                        For{" "}
                        <strong className="font-semibold text-[#102034]">
                          {activeProduct.product_name}
                        </strong>{" "}
                        (<code className="font-mono">{activeProduct.product_id}</code>) across a{" "}
                        <strong className="font-semibold text-[#102034]">
                          {appliedSettings.lead_time_days}-day
                        </strong>{" "}
                        supplier lead window
                      </p>
                    </div>

                    {/* Supporting Triplet */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-3.5">
                        <div className="text-xs font-medium text-[#536579]">
                          Expected {appliedSettings.lead_time_days}-day demand
                        </div>
                        <div className="mt-1 font-mono text-2xl font-bold text-[#102034] tabular-nums">
                          {formatUnits(currentResult.expected_lead_time_demand, 2)}
                          <span className="ml-1 font-sans text-xs font-normal text-[#536579]">
                            units
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-3.5">
                        <div className="text-xs font-medium text-[#536579]">
                          Current stock on hand
                        </div>
                        <div className="mt-1 font-mono text-2xl font-bold text-[#102034] tabular-nums">
                          {formatInteger(appliedSettings.stock_on_hand)}
                          <span className="ml-1 font-sans text-xs font-normal text-[#536579]">
                            units
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-3.5">
                        <div className="text-xs font-medium text-[#536579]">
                          Projected shortage
                        </div>
                        <div
                          className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
                            currentResult.projected_shortage_units > 0
                              ? "text-[#B42318]"
                              : "text-[#027A48]"
                          }`}
                        >
                          {formatInteger(currentResult.projected_shortage_units)}
                          <span className="ml-1 font-sans text-xs font-normal text-[#536579]">
                            units
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skimmable 1-Line Arithmetic Ribbon */}
                    <div className="rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-4">
                      <div className="text-xs font-semibold text-[#102034]">
                        Deterministic arithmetic breakdown (no LLM math)
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-[#DEE6EB] bg-white px-3.5 py-2.5 font-mono text-xs sm:text-sm text-[#102034] tabular-nums">
                        <span>
                          <strong>
                            {formatUnits(currentResult.expected_lead_time_demand, 2)}
                          </strong>{" "}
                          expected demand
                        </span>
                        <span className="text-[#536579]">+</span>
                        <span>
                          <strong>
                            {formatInteger(appliedSettings.safety_stock_units)}
                          </strong>{" "}
                          safety stock
                        </span>
                        <span className="text-[#536579]">−</span>
                        <span>
                          <strong>
                            {formatInteger(appliedSettings.stock_on_hand)}
                          </strong>{" "}
                          on hand
                        </span>
                        <span className="text-[#536579]">=</span>
                        <span className="rounded bg-[#E8F6F4] px-2 py-0.5 font-bold text-[#087F78]">
                          {formatInteger(currentResult.reorder_quantity_units)} suggested
                          (ceil)
                        </span>
                      </div>

                      <p className="mt-2.5 text-xs leading-relaxed text-[#536579]">
                        <strong className="font-semibold text-[#102034]">
                          API explanation:
                        </strong>{" "}
                        {currentResult.explanation}
                      </p>

                      <div className="mt-2 font-mono text-[11px] text-[#536579]">
                        Formula:{" "}
                        <code>
                          ceil(max(0, expected_lead_time_demand + safety_stock_units -
                          stock_on_hand))
                        </code>
                      </div>
                    </div>

                    {/* Human-in-the-Loop Decision Notice */}
                    <div className="rounded-xl border border-[#F5D08A] bg-[#FFF6E8] p-3.5 text-xs text-[#A65C06]">
                      <div className="flex items-start gap-2">
                        <Info
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#A65C06]"
                          aria-hidden="true"
                        />
                        <p className="leading-relaxed">
                          <strong className="font-semibold text-[#102034]">
                            Human-in-the-loop scenario notice:
                          </strong>{" "}
                          Projected shortage and risk level (
                          <code className="font-mono font-semibold">
                            {currentResult.risk_level}
                          </code>
                          ) indicate whether current stock covers point-forecast demand over the{" "}
                          {appliedSettings.lead_time_days}-day lead window. They are{" "}
                          <strong className="font-semibold text-[#102034]">
                            not a calibrated stockout probability
                          </strong>
                          . ReorderLens AI never places automatic supplier orders.
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
