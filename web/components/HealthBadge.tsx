"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import { ApiClientError, fetchHealth, HealthResponse } from "@/lib/api";

export function HealthBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<{
    code?: string;
    message: string;
    details?: string[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);

  const checkBackendHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHealth();
      setHealth(result);
    } catch (err) {
      setHealth(null);
      if (err instanceof ApiClientError) {
        setError({
          code: err.code,
          message: err.message,
          details: err.details,
        });
      } else {
        setError({
          code: "UNKNOWN_ERROR",
          message:
            err instanceof Error
              ? err.message
              : "Unexpected error checking /backend/health.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkBackendHealth();
  }, [checkBackendHealth]);

  if (loading && !health && !error) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#DEE6EB] bg-[#EFF4F6] px-2.5 py-1 text-xs font-medium text-[#536579]"
      >
        <Loader2 className="h-3 w-3 animate-spin text-[#536579]" aria-hidden="true" />
        <span>Checking API…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative inline-flex items-center gap-1.5" role="alert">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#FECDCA] bg-[#FEF3F2] px-2.5 py-1 text-xs font-medium text-[#B42318] transition hover:bg-[#FEE4E2]"
        >
          <AlertCircle className="h-3.5 w-3.5 text-[#B42318]" aria-hidden="true" />
          <span>API unavailable</span>
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => void checkBackendHealth()}
          disabled={loading}
          aria-label="Retry backend health check"
          className="inline-flex items-center gap-1 rounded-full border border-[#DEE6EB] bg-white px-2.5 py-1 text-xs font-medium text-[#102034] transition hover:bg-[#EFF4F6] disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>Retry</span>
        </button>
        {expanded && (
          <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-[#FECDCA] bg-white p-3.5 text-xs text-[#102034] shadow-lg">
            <div className="flex items-center justify-between gap-2 font-semibold text-[#B42318]">
              <span>Backend Proxy Unreachable</span>
              {error.code && (
                <code className="rounded bg-[#FEF3F2] px-1.5 py-0.5 font-mono text-[11px]">
                  {error.code}
                </code>
              )}
            </div>
            <p className="mt-1.5 text-[#536579] leading-relaxed">{error.message}</p>
            <div className="mt-2.5 flex items-center justify-between border-t border-[#DEE6EB] pt-2 text-[11px] text-[#536579]">
              <span>Route: /backend/health</span>
              <button
                type="button"
                onClick={() => void checkBackendHealth()}
                disabled={loading}
                className="font-semibold text-[#087F78] hover:underline"
              >
                Re-check now
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (health) {
    return (
      <div className="relative inline-flex items-center" role="status" aria-live="polite">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          title={`Service: ${health.service} (${health.version}) — click for connection details`}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#D1FADF] bg-[#ECFDF3] px-2.5 py-1 text-xs font-medium text-[#027A48] transition hover:bg-[#D1FADF]/60"
        >
          <span
            className="h-2 w-2 rounded-full bg-[#027A48]"
            aria-hidden="true"
          />
          <span>API connected</span>
          <ChevronDown className="h-3 w-3 opacity-75" aria-hidden="true" />
        </button>

        {expanded && (
          <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-xl border border-[#DEE6EB] bg-white p-3.5 text-xs text-[#102034] shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#027A48]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                FastAPI Service Online
              </span>
              <button
                type="button"
                onClick={() => void checkBackendHealth()}
                disabled={loading}
                aria-label="Re-check backend health"
                className="inline-flex items-center gap-1 rounded-md border border-[#DEE6EB] bg-[#F6F8FA] px-2 py-0.5 text-[11px] font-medium text-[#102034] hover:bg-[#EFF4F6] disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                <span>Re-check</span>
              </button>
            </div>
            <dl className="mt-2.5 space-y-1 border-t border-[#DEE6EB] pt-2 text-[11px] text-[#536579]">
              <div className="flex justify-between">
                <dt>Proxy path</dt>
                <dd className="font-mono text-[#102034]">/backend/health</dd>
              </div>
              <div className="flex justify-between">
                <dt>Service</dt>
                <dd className="font-mono text-[#102034]">
                  {health.service} v{health.version}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Status</dt>
                <dd className="font-mono font-semibold text-[#027A48]">{health.status}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    );
  }

  return null;
}
