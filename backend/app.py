from fastapi import FastAPI, File, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from csv_processing import MAX_FILE_BYTES, analyze_csv_bytes
from inventory import compute_recommendations_from_payload
from models import (
    AnalyzeResponse,
    ApiError,
    ErrorBody,
    ErrorResponse,
    HealthResponse,
    RecommendationResponse,
)

app = FastAPI(
    title="ReorderLens AI API",
    version="mvp-1",
    description="Stateless demand forecasting and deterministic inventory recommendation API for ReorderLens AI.",
)


@app.exception_handler(ApiError)
async def handle_api_error(_request: Request, exc: ApiError) -> JSONResponse:
    payload = ErrorResponse(
        error=ErrorBody(
            code=exc.code,
            message=exc.message,
            details=exc.details,
        )
    )
    return JSONResponse(status_code=exc.status_code, content=payload.model_dump())


@app.exception_handler(RequestValidationError)
async def handle_request_validation_error(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    details = []
    for err in exc.errors():
        loc = ".".join(str(part) for part in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        details.append(f"{loc}: {msg}" if loc else msg)
    payload = ErrorResponse(
        error=ErrorBody(
            code="INVALID_SCHEMA",
            message="Request payload validation failed.",
            details=details,
        )
    )
    return JSONResponse(status_code=400, content=payload.model_dump())


@app.exception_handler(Exception)
async def handle_unexpected_error(_request: Request, _exc: Exception) -> JSONResponse:
    payload = ErrorResponse(
        error=ErrorBody(
            code="INTERNAL_ERROR",
            message="An unexpected server error occurred while processing the request.",
            details=[],
        )
    )
    return JSONResponse(status_code=500, content=payload.model_dump())


@app.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="reorderlens-api",
        version="mvp-1",
    )


@app.post("/v1/analyze", response_model=AnalyzeResponse)
async def post_analyze(file: UploadFile = File(...)) -> AnalyzeResponse:
    # Read in bounded chunks up to MAX_FILE_BYTES + 1 to decline oversized uploads safely in memory
    chunks: list[bytes] = []
    total_bytes = 0
    chunk_size = 65_536

    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        total_bytes += len(chunk)
        if total_bytes > MAX_FILE_BYTES:
            raise ApiError(
                status_code=413,
                code="FILE_TOO_LARGE",
                message="Uploaded CSV exceeds the 1 MB (1,048,576 bytes) size limit.",
                details=[f"Maximum allowed size is {MAX_FILE_BYTES} bytes."],
            )
        chunks.append(chunk)

    raw_bytes = b"".join(chunks)
    return analyze_csv_bytes(raw_bytes)


@app.post("/v1/recommendations", response_model=RecommendationResponse)
async def post_recommendations(request: Request) -> RecommendationResponse:
    try:
        payload = await request.json()
    except Exception as exc:
        raise ApiError(
            status_code=400,
            code="INVALID_SCHEMA",
            message="Request body is not valid JSON.",
            details=[str(exc)],
        ) from exc

    return compute_recommendations_from_payload(payload)
