"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { ErrorRetry } from "@/components/ErrorRetry";
import { LimitationsPanel } from "@/components/LimitationsPanel";
import { formatInteger, formatMae, formatShortDate, formatUnits } from "@/lib/format";

export default function ImportSalesPage() {
  const {
    analysis,
    provenance,
    sourceFilename,
    isAnalyzing,
    error,
    uploadCustomCsv,
    loadSyntheticDemo,
    clearAnalysis,
    setSelectedProductId,
  } = useAnalysis();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<"demo" | "upload" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnalyzing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isAnalyzing) return;
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    if (droppedFile) {
      setSelectedFile(droppedFile);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLastAction("upload");
    await uploadCustomCsv(selectedFile);
  };

  const handleLoadDemo = async () => {
    setLastAction("demo");
    await loadSyntheticDemo();
  };

  const handleRetry = () => {
    if (lastAction === "demo") {
      void handleLoadDemo();
    } else if (lastAction === "upload" && selectedFile) {
      void uploadCustomCsv(selectedFile);
    }
  };

  const maxHistoryDays = analysis
    ? analysis.products.reduce(
        (max, p) => Math.max(max, p.history.length),
        0
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Main Import & Stepper Section */}
      <section className="rounded-2xl border border-[#DEE6EB] bg-white p-6 sm:p-7 shadow-2xs">
        {/* 3-Step Progress Indicator */}
        <nav aria-label="Import workflow steps" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#536579]">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F6F4] px-3 py-1 font-semibold text-[#087F78]">
              <span className="font-mono">1</span>
              <span>Add sales</span>
            </li>
            <span aria-hidden="true" className="text-[#8095A8]">
              →
            </span>
            <li
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                analysis
                  ? "bg-[#ECFDF3] font-semibold text-[#027A48]"
                  : "bg-[#EFF4F6] text-[#536579]"
              }`}
            >
              <span className="font-mono">2</span>
              <span>Check data</span>
            </li>
            <span aria-hidden="true" className="text-[#8095A8]">
              →
            </span>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF4F6] px-3 py-1 text-[#536579]">
              <span className="font-mono">3</span>
              <span>View forecast</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#102034]">
              Bring in your sales history
            </h1>
            <p className="mt-1 max-w-[65ch] text-sm text-[#536579]">
              Upload a daily product sales CSV or load the 3-product sample dataset. Validation and model selection run in memory via{" "}
              <code className="rounded bg-[#EFF4F6] px-1.5 py-0.5 font-mono text-xs text-[#102034]">
                POST /backend/v1/analyze
              </code>
              .
            </p>
          </div>
          <a
            href="/demo-sales.csv"
            download="demo-sales.csv"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#DEE6EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#102034] transition hover:bg-[#EFF4F6]"
          >
            <Download className="h-3.5 w-3.5 text-[#087F78]" aria-hidden="true" />
            <span>Download sample CSV</span>
          </a>
        </div>

        {/* Two-Column Action Grid: Primary Upload (7 cols) + Secondary Sample Card (5 cols) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Primary Card: Upload Your Own Sales CSV */}
          <form
            onSubmit={(e) => void handleUploadSubmit(e)}
            className="flex flex-col justify-between rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] p-5 lg:col-span-7"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DEE6EB] bg-white px-2.5 py-0.5 text-xs font-semibold text-[#102034]">
                  <Upload className="h-3.5 w-3.5 text-[#087F78]" aria-hidden="true" />
                  <span>Custom CSV upload</span>
                </span>
                <span className="text-xs text-[#536579]">In-memory session only</span>
              </div>

              <h2 className="mt-3 text-base font-semibold text-[#102034]">
                Upload daily sales CSV
              </h2>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-3 rounded-xl border-2 border-dashed p-5 text-center transition ${
                  isDragging
                    ? "border-[#087F78] bg-[#E8F6F4]/60"
                    : "border-[#DEE6EB] bg-white hover:border-[#8095A8]"
                }`}
              >
                <FileSpreadsheet
                  className="mx-auto h-7 w-7 text-[#087F78]"
                  aria-hidden="true"
                />
                <label
                  htmlFor="csv-file-input"
                  className="mt-2 block cursor-pointer text-sm font-semibold text-[#102034]"
                >
                  Drop your CSV file here, or{" "}
                  <span className="text-[#087F78] underline">browse from device</span>
                </label>
                <p className="mt-1 text-xs text-[#536579]">
                  Columns:{" "}
                  <code className="font-mono text-[#102034]">
                    date, product_id, product_name, quantity_sold
                  </code>{" "}
                  · Max 1 MB · Up to 10 products
                </p>

                <input
                  ref={fileInputRef}
                  id="csv-file-input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  disabled={isAnalyzing}
                  className="mt-3 block w-full text-xs text-[#536579] file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-[#DEE6EB] file:bg-[#EFF4F6] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#102034] hover:file:bg-[#DEE6EB]"
                />

                {selectedFile && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#E8F6F4] px-3 py-1 text-xs font-medium text-[#087F78]">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      Selected: {selectedFile.name} (
                      {Math.max(1, Math.round(selectedFile.size / 1024))} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={isAnalyzing || !selectedFile}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#102034] px-4 py-2.5 text-sm font-semibold text-white shadow-2xs transition hover:bg-[#102034]/90 disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing && lastAction === "upload" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Validating &amp; analyzing CSV…</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                    <span>Analyze uploaded CSV</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Secondary Card: Try the Sample Dataset */}
          <div className="flex flex-col justify-between rounded-xl border border-[#087F78]/30 bg-[#E8F6F4]/50 p-5 lg:col-span-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#087F78]/15 px-2.5 py-0.5 text-xs font-semibold text-[#087F78]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Synthetic · 3 products · 120 daily observations each</span>
              </div>

              <h2 className="text-base font-semibold text-[#102034]">
                Try the sample dataset
              </h2>

              <p className="text-xs leading-relaxed text-[#536579]">
                Loads <code className="font-mono text-[#102034]">/demo-sales.csv</code>{" "}
                (3 retail staple SKUs from <code className="font-mono">2026-06-29</code> to{" "}
                <code className="font-mono">2026-10-26</code>, 360 rows with explicit zero-sales days) through the live backend analyzer.
              </p>

              <div className="rounded-lg border border-[#F5D08A] bg-[#FFF6E8] px-3 py-2 text-xs font-medium text-[#A65C06]">
                Illustrative synthetic demo data — not real retailer records
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => void handleLoadDemo()}
                disabled={isAnalyzing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#087F78] px-4 py-2.5 text-sm font-semibold text-white shadow-2xs transition hover:bg-[#0B746E] disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing && lastAction === "demo" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Analyzing sample dataset…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>Load sample dataset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible CSV Format & Validation Rules */}
        <details className="group mt-5 rounded-xl border border-[#DEE6EB] bg-[#F6F8FA] text-xs text-[#536579]">
          <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-semibold text-[#102034] transition hover:bg-[#EFF4F6]">
            <span>CSV format &amp; validation limits (schema, dense calendar dates, duplicate aggregation)</span>
            <ChevronDown
              className="h-4 w-4 text-[#536579] transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="border-t border-[#DEE6EB] px-4 py-3.5">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 list-disc pl-5">
              <li>
                <strong className="text-[#102034]">Exact UTF-8 header:</strong>{" "}
                <code className="font-mono font-semibold text-[#102034]">
                  date,product_id,product_name,quantity_sold
                </code>
              </li>
              <li>
                <strong className="text-[#102034]">Payload limits:</strong> Max <strong>1 MB</strong> file size, up to <strong>2,000</strong> data rows, and up to <strong>10</strong> unique SKUs.
              </li>
              <li>
                <strong className="text-[#102034]">Dense daily dates required:</strong> Include an explicit row with <code className="font-mono">0</code> on zero-sales days. Missing calendar dates are flagged as <code className="font-mono">DATA_GAPS</code> and never silently filled with zero.
              </li>
              <li>
                <strong className="text-[#102034]">Duplicate transaction rows:</strong> Multiple rows for the same SKU and calendar date are safely summed into a daily total and disclosed in warnings.
              </li>
            </ul>
          </div>
        </details>

        {error && (
          <div className="mt-5">
            <ErrorRetry
              title="CSV Import & Validation Error"
              code={error.code}
              message={error.message}
              details={error.details}
              onRetry={lastAction ? handleRetry : undefined}
              retrying={isAnalyzing}
            />
          </div>
        )}
      </section>

      {/* Validated Dataset Summary & Preview Table */}
      {analysis && (
        <section
          aria-labelledby="import-results-heading"
          className="space-y-6 rounded-2xl border border-[#DEE6EB] bg-white p-6 sm:p-7 shadow-2xs"
        >
          {/* Crisp Validation Callout */}
          <div className="flex flex-col gap-4 rounded-xl border border-[#D1FADF] bg-[#ECFDF3]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-[#027A48]"
                  aria-hidden="true"
                />
                <h2
                  id="import-results-heading"
                  className="text-base font-bold text-[#102034]"
                >
                  Sales history validated and ready for forecasting.
                </h2>
                {provenance === "synthetic_demo" ? (
                  <span className="rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-0.5 text-xs font-medium text-[#A65C06]">
                    Illustrative synthetic demo data — not real retailer records
                  </span>
                ) : (
                  <span className="rounded-full border border-[#DEE6EB] bg-white px-2.5 py-0.5 text-xs font-medium text-[#102034]">
                    User CSV ({sourceFilename ?? "upload.csv"})
                  </span>
                )}
              </div>
              <p className="text-xs text-[#536579] tabular-nums">
                <strong className="font-semibold text-[#102034]">
                  {formatInteger(analysis.summary.products_total)} products
                </strong>{" "}
                ({formatInteger(analysis.summary.products_with_forecast)} forecast-ready) ·{" "}
                <strong className="font-semibold text-[#102034]">
                  {formatInteger(maxHistoryDays)} days of history
                </strong>{" "}
                ·{" "}
                <strong className="font-semibold text-[#102034]">
                  {formatInteger(analysis.summary.accepted_rows)} records accepted
                </strong>{" "}
                ({formatInteger(analysis.summary.aggregated_daily_rows)} daily observations from{" "}
                {formatInteger(analysis.summary.input_rows)} input rows)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearAnalysis}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DEE6EB] bg-white px-3 py-2 text-xs font-semibold text-[#536579] transition hover:bg-[#EFF4F6] hover:text-[#102034] cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear session</span>
              </button>
              <Link
                href="/forecast"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087F78] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition hover:bg-[#0B746E]"
              >
                <span>Explore forecasts</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Warnings */}
          {analysis.summary.warnings.length > 0 && (
            <div
              role="region"
              aria-label="Import warnings and disclosures"
              className="rounded-xl border border-[#F5D08A] bg-[#FFF6E8] p-4 text-xs text-[#A65C06]"
            >
              <div className="flex items-center gap-2 font-semibold text-[#102034]">
                <AlertCircle className="h-4 w-4 text-[#A65C06]" aria-hidden="true" />
                <span>Import disclosures &amp; warnings</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {analysis.summary.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Rejected SKUs (e.g. DATA_GAPS) */}
          {analysis.product_errors.length > 0 && (
            <div
              role="region"
              aria-label="Rejected SKU series"
              className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] p-4 text-xs text-[#B42318]"
            >
              <p className="font-semibold text-[#102034]">
                Rejected product series ({analysis.product_errors.length}):
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {analysis.product_errors.map((pe) => (
                  <li key={pe.product_id}>
                    <code className="font-mono font-semibold">{pe.product_id}</code>{" "}
                    [<code className="font-mono">{pe.code}</code>]: {pe.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clean SKU Summary Table */}
          <div>
            <h3 className="text-base font-semibold text-[#102034]">
              Validated product series &amp; 14-day forecast preview
            </h3>
            <div className="mt-3 overflow-x-auto rounded-xl border border-[#DEE6EB]">
              <table className="min-w-full divide-y divide-[#DEE6EB] text-left text-sm">
                <thead className="bg-[#EFF4F6] text-xs font-semibold uppercase tracking-wider text-[#536579]">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Product
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Date range
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Days
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Total units
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Selected model
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      14-day forecast
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE6EB] bg-white">
                  {analysis.products.map((prod) => {
                    const startDate = prod.history[0]?.date ?? "";
                    const endDate =
                      prod.history[prod.history.length - 1]?.date ?? "";
                    const totalHistoryUnits = prod.history.reduce(
                      (acc, pt) => acc + pt.units,
                      0
                    );
                    const totalForecastUnits = prod.forecast.reduce(
                      (acc, pt) => acc + pt.units,
                      0
                    );

                    return (
                      <tr
                        key={prod.product_id}
                        className="transition hover:bg-[#F6F8FA]"
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-[#102034]">
                            {prod.product_name}
                          </div>
                          <div className="font-mono text-xs text-[#536579]">
                            {prod.product_id}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-[#536579]">
                          {startDate && endDate ? (
                            <>
                              <div className="font-medium text-[#102034]">
                                {formatShortDate(startDate)} –{" "}
                                {formatShortDate(endDate, true)}
                              </div>
                              <div className="font-mono text-[11px]">
                                {startDate} → {endDate}
                              </div>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-sm text-[#102034] tabular-nums">
                          {formatInteger(prod.history.length)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-sm text-[#102034] tabular-nums">
                          {formatInteger(totalHistoryUnits)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {prod.chosen_method === "ridge" ? (
                              <span className="inline-flex items-center rounded-full border border-[#087F78]/30 bg-[#E8F6F4] px-2.5 py-0.5 text-xs font-semibold text-[#087F78]">
                                Ridge regression
                              </span>
                            ) : prod.chosen_method === "seasonal_naive" ? (
                              <span className="inline-flex items-center rounded-full border border-[#DEE6EB] bg-[#EFF4F6] px-2.5 py-0.5 text-xs font-semibold text-[#102034]">
                                Seasonal naive
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-0.5 text-xs font-medium text-[#A65C06]">
                                Insufficient history
                              </span>
                            )}
                          </div>
                          {prod.validation && (
                            <div className="mt-1 font-mono text-[11px] text-[#536579] tabular-nums">
                              Holdout MAE: Ridge {formatMae(prod.validation.ridge_mae)} vs Naive{" "}
                              {formatMae(prod.validation.seasonal_naive_mae)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-[#102034] tabular-nums">
                          {prod.forecast.length > 0
                            ? `${formatUnits(totalForecastUnits, 1)} units`
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {prod.forecast.length > 0 ? (
                            <Link
                              href="/forecast"
                              onClick={() => setSelectedProductId(prod.product_id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#DEE6EB] bg-white px-2.5 py-1 text-xs font-semibold text-[#087F78] transition hover:bg-[#E8F6F4]"
                            >
                              <span>View forecast</span>
                              <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </Link>
                          ) : (
                            <span className="text-xs text-[#536579]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <LimitationsPanel />
    </div>
  );
}
