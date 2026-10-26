"use client";

import React, { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DailyPoint } from "@/lib/api";
import { formatShortDate, formatUnits } from "@/lib/format";

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
  shortDate: string;
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
  const chartData = useMemo<ChartDatum[]>(() => {
    const recentHistory = history.slice(-60);
    const points: ChartDatum[] = recentHistory.map((pt) => ({
      date: pt.date,
      shortDate: formatShortDate(pt.date),
      historicalUnits: pt.units,
      forecastUnits: null,
    }));

    if (recentHistory.length > 0 && forecast.length > 0) {
      points[points.length - 1] = {
        ...points[points.length - 1],
        forecastUnits: recentHistory[recentHistory.length - 1].units,
      };
    }

    for (const fpt of forecast) {
      points.push({
        date: fpt.date,
        shortDate: formatShortDate(fpt.date),
        historicalUnits: null,
        forecastUnits: Number(fpt.units.toFixed(2)),
      });
    }

    return points;
  }, [history, forecast]);

  const cutoffDate = history[history.length - 1]?.date;

  const methodLabel =
    chosenMethod === "ridge"
      ? "14-day forecast (Ridge regression)"
      : "14-day forecast (Seasonal-naive baseline)";

  return (
    <figure
      aria-label={`Demand history and 14-day forecast chart for ${productName} (${productId})`}
      className="rounded-xl border border-[#DEE6EB] bg-white p-4 sm:p-5 shadow-2xs"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-[#102034]">
              Daily unit demand: recent 60 days &amp; next 14-day forecast
            </h2>
            <span className="rounded-md bg-[#EFF4F6] px-2 py-0.5 font-mono text-xs font-medium text-[#536579]">
              {productId}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#536579]">
            Solid slate line shows observed daily unit sales · Dashed teal line shows the recursive 14-day point forecast
          </p>
        </div>

        {isSyntheticDemo && (
          <span className="rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-1 text-[11px] font-medium text-[#A65C06]">
            Illustrative synthetic demo data — not real retailer records
          </span>
        )}
      </div>

      <div className="h-76 sm:h-84 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 12, right: 20, left: 4, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#DEE6EB"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(val: string) => formatShortDate(val)}
              tick={{ fontSize: 11, fill: "#536579" }}
              axisLine={{ stroke: "#DEE6EB" }}
              tickLine={{ stroke: "#DEE6EB" }}
              minTickGap={28}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#536579" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={42}
              label={{
                value: "Units / day",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#536579" },
              }}
            />
            {cutoffDate && (
              <ReferenceLine
                x={cutoffDate}
                stroke="#8095A8"
                strokeDasharray="4 4"
                label={{
                  value: "Forecast start",
                  position: "insideTopRight",
                  fill: "#536579",
                  fontSize: 11,
                }}
              />
            )}
            <Tooltip
              formatter={(value, name) => [
                `${formatUnits(Number(value), 2)} units`,
                String(name),
              ]}
              labelFormatter={(label) => `Date: ${String(label)}`}
              contentStyle={{
                fontSize: "12px",
                borderRadius: "10px",
                borderColor: "#DEE6EB",
                backgroundColor: "#FFFFFF",
                color: "#102034",
                boxShadow: "0 4px 12px rgba(16, 32, 52, 0.08)",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "10px",
                color: "#102034",
              }}
            />
            <Line
              type="monotone"
              dataKey="historicalUnits"
              name="Observed daily sales"
              stroke="#2C4B66"
              strokeWidth={2}
              dot={{ r: 2, fill: "#2C4B66" }}
              activeDot={{ r: 4 }}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="forecastUnits"
              name={methodLabel}
              stroke="#087F78"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={{ r: 3, fill: "#087F78" }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#DEE6EB] pt-2.5 text-xs text-[#536579]">
        <span>
          Observed history ends{" "}
          <code className="font-mono font-medium text-[#102034]">
            {cutoffDate ?? "—"}
          </code>{" "}
          · 14-day forecast covers{" "}
          <code className="font-mono font-medium text-[#102034]">
            {forecast[0]?.date ?? "—"}
          </code>{" "}
          to{" "}
          <code className="font-mono font-medium text-[#102034]">
            {forecast[forecast.length - 1]?.date ?? "—"}
          </code>
          .
        </span>
        <span className="text-[11px]">
          Point-forecast series (tabular fallback available below)
        </span>
      </figcaption>
    </figure>
  );
}
