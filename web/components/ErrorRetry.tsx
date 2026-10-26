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
      className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] p-4 text-sm text-[#B42318]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2.5">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#B42318]"
            aria-hidden="true"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 font-semibold text-[#102034]">
              <span>{title}</span>
              {code && (
                <span className="rounded bg-[#FEE4E2] px-1.5 py-0.5 font-mono text-xs font-medium text-[#B42318]">
                  {code}
                </span>
              )}
            </div>
            <p className="mt-1 text-[#B42318] leading-relaxed">{message}</p>
            {details.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[#B42318]">
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
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#FECDCA] bg-white px-3 py-1.5 text-xs font-semibold text-[#B42318] shadow-2xs transition hover:bg-[#FEE4E2] disabled:opacity-50"
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
