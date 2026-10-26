"use client";

import React, { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DailyPoint } from "@/lib/api";

interface ForecastChartProps {
  productId: string;
  productName: string;
  history: DailyPoint[];
  forecast: DailyPoint[];
  chosenMethod: "ridge" | "seasonal_naive" | null;
  isSyntheticDemo: boolean;
}

interface ChartDatum {
  date: string;
  historicalUnits: number | null;
  forecastUnits: number | null;
}

export function ForecastChart({
  productId,
  productName,
  history,
  forecast,
  chosenMethod,
  isSyntheticDemo,
}: ForecastChartProps) {
  // Show up to the most recent 60 historical days on the chart so the 14-day horizon is visually clear,
  // while bridging the last historical point to the first forecast point for visual continuity.
  const chartData = useMemo<ChartDatum[]>(() => {
    const recentHistory = history.slice(-60);
    const points: ChartDatum[] = recentHistory.map((pt) => ({
      date: pt.date,
      historicalUnits: pt.units,
      forecastUnits: null,
    }));

    if (recentHistory.length > 0 && forecast.length > 0) {
      // Connect the transition at the last observed date so the forecast line starts smoothly from the cutoff
      points[points.length - 1] = {
        ...points[points.length - 1],
        forecastUnits: recentHistory[recentHistory.length - 1].units,
      };
    }

    for (const fpt of forecast) {
      points.push({
        date: fpt.date,
        historicalUnits: null,
        forecastUnits: fpt.units,
      });
    }

    return points;
  }, [history, forecast]);

  const methodLabel =
    chosenMethod === "ridge"
      ? "14-Day Forecast (Ridge Regression)"
      : "14-Day Forecast (Seasonal-Naive Baseline)";

  return (
    <figure
      aria-label={`Demand history and 14-day forecast chart for ${productName} (${productId})`}
      className="rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Historical Daily Sales (Recent 60 Days) vs. 14-Day Point Forecast —{" "}
            <span className="font-mono">{productId}</span>
          </h3>
          <p className="text-xs text-slate-600">
            Y-axis: Daily units sold / predicted • X-axis: ISO Calendar Date (YYYY-MM-DD)
          </p>
        </div>
        {isSyntheticDemo && (
          <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-950">
            Illustrative synthetic demo data — not real retailer records
          </span>
        )}
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#475569" }}
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#475569" }}
              allowDecimals={false}
              label={{
                value: "Units",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#475569" },
              }}
            />
            <Tooltip
              contentStyle={{
                fontSize: "12px",
                borderRadius: "8px",
                borderColor: "#cbd5e1",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Line
              type="monotone"
              dataKey="historicalUnits"
              name="Observed Historical Sales (Units)"
              stroke="#0f172a"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="forecastUnits"
              name={methodLabel}
              stroke="#4f46e5"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-2 text-[11px] text-slate-500">
        Solid dark line shows observed daily unit sales up to{" "}
        <code className="font-mono">{history[history.length - 1]?.date ?? "—"}</code>.
        Dashed indigo line shows the 14-day recursive point forecast (
        <code className="font-mono">{forecast[0]?.date ?? "—"}</code> to{" "}
        <code className="font-mono">{forecast[forecast.length - 1]?.date ?? "—"}</code>).
      </figcaption>
    </figure>
  );
}
