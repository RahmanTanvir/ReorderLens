"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorRetryProps {
  title?: string;
  code?: string;
  message: string;
  details?: string[];
  onRetry?: () => void;
  retrying?: boolean;
}

export function ErrorRetry({
  title = "Request Failed",
  code,
  message,
  details = [],
  onRetry,
  retrying = false,
}: ErrorRetryProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
            aria-hidden="true"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 font-semibold">
              <span>{title}</span>
              {code && (
                <span className="rounded bg-red-200/80 px-1.5 py-0.5 font-mono text-xs text-red-900">
                  {code}
                </span>
              )}
            </div>
            <p className="mt-1 text-red-800">{message}</p>
            {details.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-800">
                {details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-800 shadow-xs transition hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{retrying ? "Checking..." : "Retry"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
