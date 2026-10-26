import React from "react";
import { ShieldAlert } from "lucide-react";

interface LimitationsPanelProps {
  compact?: boolean;
}

export function LimitationsPanel({ compact = false }: LimitationsPanelProps) {
  return (
    <section
      aria-labelledby="limitations-panel-heading"
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700"
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-700"
          aria-hidden="true"
        />
        <div className="space-y-1.5">
          <h2
            id="limitations-panel-heading"
            className="font-semibold text-slate-900"
          >
            Scientific, Operational &amp; Privacy Boundaries (Preliminary MVP)
          </h2>
          {compact ? (
            <p className="leading-relaxed">
              This is a preliminary single-user demonstration using illustrative synthetic sales data. Predictions and reorder quantities are model-based estimates, not guarantees. Sales history may understate demand when products were unavailable. The demo does not yet provide authentication, persistent cloud inventory records, validated field impact, or automated purchasing.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-1.5 pl-4 list-disc sm:grid-cols-2">
              <li>
                <strong>Point-Forecast Scenario Only:</strong> Projected shortages and risk levels reflect deterministic arithmetic on the 14-day point forecast, not calibrated stockout probabilities or confidence intervals.
              </li>
              <li>
                <strong>Censored Historical Demand:</strong> Sales CSVs record completed transactions only; past stockouts or store closures can understate true customer demand.
              </li>
              <li>
                <strong>Validation vs. Field Accuracy:</strong> The 14-day chronological MAE compares Ridge regression against the 7-day seasonal-naive baseline for model selection; it is not an independent test score or real-world ROI guarantee.
              </li>
              <li>
                <strong>Human Review &amp; Stateless Session:</strong> No automatic supplier orders are placed, and no uploaded CSVs or inventory inputs are persisted to a database or browser storage.
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
