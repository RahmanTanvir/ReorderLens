export interface HealthResponse {
  status: "ok" | string;
  service: string;
  version: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: string[];
}

export interface DailyPoint {
  date: string;
  units: number;
}

export interface ValidationMetrics {
  window_days: number;
  ridge_mae: number;
  seasonal_naive_mae: number;
  selected_method_mae: number;
}

export type ProductStatus = "evaluated" | "baseline_only" | "insufficient_history";
export type ForecastMethod = "ridge" | "seasonal_naive" | null;
export type RiskLevel = "high" | "medium" | "low";

export interface ProductAnalysis {
  product_id: string;
  product_name: string;
  status: ProductStatus;
  history: DailyPoint[];
  forecast: DailyPoint[];
  chosen_method: ForecastMethod;
  validation: ValidationMetrics | null;
  notes: string[];
}

export interface ProductError {
  product_id: string;
  code: string;
  message: string;
}

export interface AnalysisSummary {
  input_rows: number;
  accepted_rows: number;
  aggregated_daily_rows: number;
  products_total: number;
  products_with_forecast: number;
  warnings: string[];
}

export interface AnalyzeResponse {
  data_kind: "user_upload";
  summary: AnalysisSummary;
  products: ProductAnalysis[];
  product_errors: ProductError[];
}

export interface RecommendationRequestItem {
  product_id: string;
  stock_on_hand: number;
  lead_time_days: number;
  safety_stock_units: number;
  forecast: DailyPoint[];
}

export interface RecommendationRequest {
  items: RecommendationRequestItem[];
}

export interface RecommendationResponseItem {
  product_id: string;
  expected_lead_time_demand: number;
  projected_shortage_units: number;
  reorder_quantity_units: number;
  risk_level: RiskLevel;
  explanation: string;
}

export interface RecommendationResponse {
  items: RecommendationResponseItem[];
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: string[];

  constructor(status: number, code: string, message: string, details: string[] = []) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function parseErrorResponse(
  response: Response,
  fallbackMessage: string
): Promise<ApiClientError> {
  let errorBody: { error?: ApiErrorDetail } | null = null;
  try {
    errorBody = (await response.json()) as { error?: ApiErrorDetail };
  } catch {
    // Ignore non-JSON body
  }
  const code = errorBody?.error?.code ?? `HTTP_${response.status}`;
  const message = errorBody?.error?.message ?? fallbackMessage;
  const details = Array.isArray(errorBody?.error?.details)
    ? errorBody.error.details
    : [];
  return new ApiClientError(response.status, code, message, details);
}

export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  let response: Response;
  try {
    response = await fetch("/backend/health", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
  } catch (err) {
    throw new ApiClientError(
      0,
      "NETWORK_ERROR",
      err instanceof Error
        ? `Unable to reach backend via /backend/health: ${err.message}`
        : "Unable to reach backend via /backend/health."
    );
  }

  if (!response.ok) {
    throw await parseErrorResponse(
      response,
      `Backend health check returned HTTP ${response.status}.`
    );
  }

  const data = (await response.json()) as Partial<HealthResponse>;
  if (
    typeof data?.status !== "string" ||
    typeof data?.service !== "string" ||
    typeof data?.version !== "string"
  ) {
    throw new ApiClientError(
      502,
      "INVALID_HEALTH_PAYLOAD",
      "Backend returned an unexpected health payload shape."
    );
  }

  return {
    status: data.status,
    service: data.service,
    version: data.version,
  };
}

export async function analyzeCsvFile(
  file: File | Blob,
  filename = "upload.csv"
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file, filename);

  let response: Response;
  try {
    response = await fetch("/backend/v1/analyze", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
  } catch (err) {
    throw new ApiClientError(
      0,
      "NETWORK_ERROR",
      err instanceof Error
        ? `Network error calling /backend/v1/analyze: ${err.message}`
        : "Network error calling /backend/v1/analyze."
    );
  }

  if (!response.ok) {
    throw await parseErrorResponse(
      response,
      `CSV analysis failed with HTTP ${response.status}.`
    );
  }

  return (await response.json()) as AnalyzeResponse;
}

export async function loadAndAnalyzeDemoCsv(): Promise<AnalyzeResponse> {
  let demoResponse: Response;
  try {
    demoResponse = await fetch("/demo-sales.csv", { cache: "no-store" });
  } catch (err) {
    throw new ApiClientError(
      0,
      "DEMO_FETCH_FAILED",
      err instanceof Error
        ? `Failed to fetch built-in synthetic fixture /demo-sales.csv: ${err.message}`
        : "Failed to fetch built-in synthetic fixture /demo-sales.csv."
    );
  }

  if (!demoResponse.ok) {
    throw new ApiClientError(
      demoResponse.status,
      "DEMO_FETCH_FAILED",
      `Could not load /demo-sales.csv (HTTP ${demoResponse.status}).`
    );
  }

  const csvText = await demoResponse.text();
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  return analyzeCsvFile(blob, "demo-sales.csv");
}

export async function fetchRecommendations(
  payload: RecommendationRequest
): Promise<RecommendationResponse> {
  let response: Response;
  try {
    response = await fetch("/backend/v1/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (err) {
    throw new ApiClientError(
      0,
      "NETWORK_ERROR",
      err instanceof Error
        ? `Network error calling /backend/v1/recommendations: ${err.message}`
        : "Network error calling /backend/v1/recommendations."
    );
  }

  if (!response.ok) {
    throw await parseErrorResponse(
      response,
      `Inventory recommendation calculation failed with HTTP ${response.status}.`
    );
  }

  return (await response.json()) as RecommendationResponse;
}
