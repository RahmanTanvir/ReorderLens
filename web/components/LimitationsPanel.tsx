import React from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

interface LimitationsPanelProps {
  compact?: boolean;
  defaultOpen?: boolean;
}

export function LimitationsPanel({
  compact = false,
  defaultOpen = false,
}: LimitationsPanelProps) {
  if (compact) {
    return (
      <section
        aria-label="Methodology and prototype boundaries"
        className="rounded-xl border border-[#DEE6EB] bg-white px-4 py-3 text-xs text-[#536579]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="h-4 w-4 shrink-0 text-[#087F78]"
              aria-hidden="true"
            />
            <span className="font-semibold text-[#102034]">
              Methodology &amp; boundaries:
            </span>
            <span>
              Point-forecast scenario only · Censored stockout history not inferred · Stateless session (no saved records or auto-orders).
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-[#DEE6EB] bg-white text-xs text-[#536579] shadow-2xs"
    >
      <summary className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3.5 font-medium text-[#102034] transition hover:bg-[#EFF4F6]/60">
        <div className="flex flex-wrap items-center gap-2">
          <ShieldCheck
            className="h-4 w-4 shrink-0 text-[#087F78]"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-[#102034]">
            Methodology, scientific boundaries &amp; privacy notes
          </span>
          <span className="rounded-full border border-[#DEE6EB] bg-[#F6F8FA] px-2 py-0.5 text-[11px] font-normal text-[#536579]">
            Point forecast · Censored sales caveat · Stateless MVP
          </span>
        </div>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-[#536579] transition-transform duration-150 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-[#DEE6EB] px-4 py-3.5">
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <li className="rounded-lg bg-[#F6F8FA] p-2.5">
            <strong className="font-semibold text-[#102034]">
              Point-forecast scenario only:
            </strong>{" "}
            Projected shortages and risk levels reflect deterministic arithmetic on the 14-day point forecast, not calibrated stockout probabilities or prediction intervals.
          </li>
          <li className="rounded-lg bg-[#F6F8FA] p-2.5">
            <strong className="font-semibold text-[#102034]">
              Censored historical demand:
            </strong>{" "}
            Sales CSVs record completed transactions only; past stockouts or store closures can understate true customer demand.
          </li>
          <li className="rounded-lg bg-[#F6F8FA] p-2.5">
            <strong className="font-semibold text-[#102034]">
              Model-selection holdout MAE:
            </strong>{" "}
            The 14-day chronological holdout MAE compares Ridge regression against the 7-day seasonal-naive baseline for model selection; it is not an independent field test guarantee.
          </li>
          <li className="rounded-lg bg-[#F6F8FA] p-2.5">
            <strong className="font-semibold text-[#102034]">
              Human review &amp; stateless session:
            </strong>{" "}
            No automatic supplier orders are placed, and no uploaded CSVs or inventory inputs are persisted to a database or browser storage.
          </li>
        </ul>
      </div>
    </details>
  );
}
