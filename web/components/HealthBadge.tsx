"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { ApiClientError, fetchHealth, HealthResponse } from "@/lib/api";
import { ErrorRetry } from "@/components/ErrorRetry";

export function HealthBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<{
    code?: string;
    message: string;
    details?: string[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" aria-hidden="true" />
        <span>Checking backend via /backend/health...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-2">
        <ErrorRetry
          title="Backend API Unreachable"
          code={error.code}
          message={error.message}
          details={error.details}
          onRetry={() => void checkBackendHealth()}
          retrying={loading}
        />
      </div>
    );
  }

  if (health) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex flex-wrap items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-900"
      >
        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        <span className="font-medium">Backend API live:</span>
        <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[11px]">
          {health.service} ({health.version}) — status: {health.status}
        </code>
        <button
          type="button"
          onClick={() => void checkBackendHealth()}
          disabled={loading}
          aria-label="Re-check backend health"
          className="ml-1 inline-flex items-center gap-1 rounded border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>Re-check</span>
        </button>
      </div>
    );
  }

  return null;
}
