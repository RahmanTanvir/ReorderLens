const unitFormatter1 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const unitFormatter2 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const maeFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a unit count cleanly using Intl.NumberFormat without floating-point representation tails
 * (e.g. 89.29999999999998 -> "89.3", 340 -> "340", 5074 -> "5,074").
 */
export function formatUnits(value: number, maxDecimals: 1 | 2 = 1): string {
  if (!Number.isFinite(value)) return "0";
  const cleaned = Math.abs(value) < 1e-9 ? 0 : value;
  return maxDecimals === 2
    ? unitFormatter2.format(cleaned)
    : unitFormatter1.format(cleaned);
}

/**
 * Formats a whole integer value (e.g. stock on hand, safety stock, reorder units, row counts).
 */
export function formatInteger(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return integerFormatter.format(Math.round(value));
}

/**
 * Formats validation MAE to 2 decimal places (e.g. 2.27, 2.36).
 */
export function formatMae(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return maeFormatter.format(value);
}

/**
 * Formats an ISO YYYY-MM-DD date string into a readable short label (e.g. "Oct 26, 2026" or "Oct 26").
 */
export function formatShortDate(isoDate: string, includeYear = false): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const date = new Date(Date.UTC(year, month, day));
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(date);
}
