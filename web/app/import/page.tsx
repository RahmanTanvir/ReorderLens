"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
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
  const [lastAction, setLastAction] = useState<"demo" | "upload" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
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

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Import Sales CSV</h1>
            <p className="mt-1 text-sm text-slate-600">
              Upload a daily SKU sales CSV or load the built-in synthetic demo dataset. Both paths execute{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                POST /backend/v1/analyze
              </code>{" "}
              in memory without saving files to disk or database.
            </p>
          </div>
          <a
            href="/demo-sales.csv"
            download="demo-sales.csv"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download synthetic CSV fixture</span>
          </a>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">
            Required CSV Schema &amp; Dense Time-Series Rules:
          </p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            <li>
              Exact UTF-8 header:{" "}
              <code className="font-mono font-semibold">
                date,product_id,product_name,quantity_sold
              </code>
            </li>
            <li>
              Bounds: <strong>≤ 1 MB</strong> file size, <strong>≤ 2,000</strong> data rows,{" "}
              <strong>≤ 10</strong> unique SKUs, ISO dates (<code className="font-mono">YYYY-MM-DD</code>), nonnegative integer quantities (<code className="font-mono">0..100000</code>).
            </li>
            <li>
              <strong>Dense daily dates required:</strong> Include an explicit row with{" "}
              <code className="font-mono">0</code> on days with zero sales. Missing calendar dates are flagged as{" "}
              <code className="font-mono">DATA_GAPS</code> and never silently assumed to be zero.
            </li>
            <li>
              Multiple transactions for the same SKU and date are automatically summed into a daily total and disclosed in warnings.
            </li>
          </ul>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Option 1: Synthetic Demo Loader */}
          <div className="flex flex-col justify-between rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-900">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Built-in Demo Fixture</span>
              </div>
              <h2 className="mt-2.5 text-base font-bold text-slate-900">
                Load Synthetic Demo Dataset
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                Fetches <code className="font-mono">/demo-sales.csv</code> (3 SKUs, 120 consecutive days from{" "}
                <code className="font-mono">2026-06-29</code> to{" "}
                <code className="font-mono">2026-10-26</code>, 360 rows including explicit zero-sales days) and uploads it to{" "}
                <code className="font-mono">POST /backend/v1/analyze</code>.
              </p>
              <p className="mt-2 rounded border border-amber-300 bg-amber-100/80 px-2.5 py-1.5 text-[11px] font-semibold text-amber-950">
                Illustrative synthetic demo data — not real retailer records
              </p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => void handleLoadDemo()}
                disabled={isAnalyzing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
              >
                {isAnalyzing && lastAction === "demo" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Analyzing demo CSV on backend...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>Load synthetic demo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Option 2: Custom CSV File Picker */}
          <form
            onSubmit={(e) => void handleUploadSubmit(e)}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Custom CSV Upload</span>
              </div>
              <h2 className="mt-2.5 text-base font-bold text-slate-900">
                Upload Your Own Sales CSV
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Select a local <code className="font-mono">.csv</code> file (max 1 MB). Processed strictly in memory for this browser session; do not upload confidential production data to a public demo.
              </p>

              <div className="mt-3">
                <label
                  htmlFor="csv-file-input"
                  className="block text-xs font-medium text-slate-700"
                >
                  Choose CSV file
                </label>
                <input
                  ref={fileInputRef}
                  id="csv-file-input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  disabled={isAnalyzing}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={isAnalyzing || !selectedFile}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
              >
                {isAnalyzing && lastAction === "upload" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Uploading &amp; validating CSV...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                    <span>Analyze Uploaded CSV</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mt-6">
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

      {analysis && (
        <section
          aria-labelledby="import-results-heading"
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <h2 id="import-results-heading" className="text-lg font-bold text-slate-900">
                  Validated Dataset Summary
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
              <p className="mt-1 text-xs text-slate-600">
                Held in React memory only. Refreshing the browser tab resets this session.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearAnalysis}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear session data</span>
              </button>
              <Link
                href="/forecast"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <span>Inspect 14-Day Forecast</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Summary Counters */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Input Rows</div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {analysis.summary.input_rows}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Accepted Rows</div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {analysis.summary.accepted_rows}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Aggregated Daily Rows</div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {analysis.summary.aggregated_daily_rows}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Total SKUs</div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {analysis.summary.products_total}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">SKUs With Forecast</div>
              <div className="mt-1 text-xl font-bold text-emerald-700">
                {analysis.summary.products_with_forecast}
              </div>
            </div>
          </div>

          {/* Global Warnings */}
          {analysis.summary.warnings.length > 0 && (
            <div
              role="region"
              aria-label="Import warnings and disclosures"
              className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950"
            >
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 text-amber-700" aria-hidden="true" />
                <span>Import Disclosures &amp; Warnings</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {analysis.summary.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Per-Product Errors (e.g. DATA_GAPS on specific SKUs) */}
          {analysis.product_errors.length > 0 && (
            <div
              role="region"
              aria-label="Rejected SKU series"
              className="rounded-lg border border-red-300 bg-red-50 p-4 text-xs text-red-950"
            >
              <p className="font-semibold">
                Rejected SKU Series ({analysis.product_errors.length}):
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

          {/* Grouped Product Preview Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Accepted SKU Series &amp; Baseline Forecast Preview
            </h3>
            <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th scope="col" className="px-3 py-2.5">SKU ID</th>
                    <th scope="col" className="px-3 py-2.5">Product Name</th>
                    <th scope="col" className="px-3 py-2.5">Observed Date Range</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Daily Points</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Total History Units</th>
                    <th scope="col" className="px-3 py-2.5">Status / Method</th>
                    <th scope="col" className="px-3 py-2.5 text-right">14-Day Forecast Total</th>
                    <th scope="col" className="px-3 py-2.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {analysis.products.map((prod) => {
                    const startDate = prod.history[0]?.date ?? "—";
                    const endDate = prod.history[prod.history.length - 1]?.date ?? "—";
                    const totalHistoryUnits = prod.history.reduce(
                      (acc, pt) => acc + pt.units,
                      0
                    );
                    const totalForecastUnits = prod.forecast.reduce(
                      (acc, pt) => acc + pt.units,
                      0
                    );

                    return (
                      <tr key={prod.product_id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 font-mono font-medium text-slate-900">
                          {prod.product_id}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-800">
                          {prod.product_name}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">
                          {startDate} → {endDate}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-800">
                          {prod.history.length}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-800">
                          {totalHistoryUnits.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-block rounded px-2 py-0.5 font-mono text-[11px] font-medium ${
                              prod.status === "insufficient_history"
                                ? "bg-amber-100 text-amber-900"
                                : prod.status === "evaluated"
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-blue-100 text-blue-900"
                            }`}
                          >
                            {prod.status}
                            {prod.chosen_method ? ` (${prod.chosen_method})` : ""}
                          </span>
                          {prod.validation && (
                            <div className="mt-1 font-mono text-[10px] text-slate-600">
                              MAE — Ridge: {prod.validation.ridge_mae.toFixed(2)} | Naive:{" "}
                              {prod.validation.seasonal_naive_mae.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-900">
                          {prod.forecast.length > 0
                            ? `${Math.round(totalForecastUnits * 100) / 100} units`
                            : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">
                          <div className="space-y-1">
                            {prod.notes.map((n, i) => (
                              <p key={i}>{n}</p>
                            ))}
                            {prod.forecast.length > 0 && (
                              <Link
                                href="/forecast"
                                onClick={() => setSelectedProductId(prod.product_id)}
                                className="inline-block font-semibold text-indigo-700 hover:underline"
                              >
                                View 14-day series →
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
        </section>
      )}
      <LimitationsPanel />
    </div>
  );
}
