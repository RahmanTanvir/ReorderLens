from typing import Literal
from pydantic import BaseModel, Field

ProductStatus = Literal["evaluated", "baseline_only", "insufficient_history"]
ForecastMethod = Literal["ridge", "seasonal_naive"] | None
RiskLevel = Literal["high", "medium", "low"]


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[str] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    error: ErrorBody


class DailyPoint(BaseModel):
    date: str
    units: int | float


class ValidationMetrics(BaseModel):
    window_days: int = 14
    ridge_mae: float
    seasonal_naive_mae: float
    selected_method_mae: float


class ProductAnalysis(BaseModel):
    product_id: str
    product_name: str
    status: ProductStatus
    history: list[DailyPoint]
    forecast: list[DailyPoint]
    chosen_method: ForecastMethod = None
    validation: ValidationMetrics | None = None
    notes: list[str] = Field(default_factory=list)


class ProductError(BaseModel):
    product_id: str
    code: str
    message: str


class AnalysisSummary(BaseModel):
    input_rows: int
    accepted_rows: int
    aggregated_daily_rows: int
    products_total: int
    products_with_forecast: int
    warnings: list[str] = Field(default_factory=list)


class AnalyzeResponse(BaseModel):
    data_kind: Literal["user_upload"] = "user_upload"
    summary: AnalysisSummary
    products: list[ProductAnalysis]
    product_errors: list[ProductError] = Field(default_factory=list)


class RecommendationRequestItem(BaseModel):
    product_id: str
    stock_on_hand: int
    lead_time_days: int
    safety_stock_units: int = 0
    forecast: list[DailyPoint]


class RecommendationRequest(BaseModel):
    items: list[RecommendationRequestItem]


class RecommendationResponseItem(BaseModel):
    product_id: str
    expected_lead_time_demand: int | float
    projected_shortage_units: int
    reorder_quantity_units: int
    risk_level: RiskLevel
    explanation: str


class RecommendationResponse(BaseModel):
    items: list[RecommendationResponseItem]


class ApiError(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: list[str] | None = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or []
