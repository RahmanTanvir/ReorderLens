from __future__ import annotations

import csv
import datetime as dt
import io
import math
from collections import defaultdict

from forecasting import (
    FORECAST_HORIZON_DAYS,
    MIN_FORECAST_HISTORY_DAYS,
    compute_seasonal_naive_forecast,
    evaluate_and_forecast_sku,
)
from models import (
    AnalysisSummary,
    AnalyzeResponse,
    ApiError,
    DailyPoint,
    ProductAnalysis,
    ProductError,
)

MAX_FILE_BYTES = 1_048_576  # 1 MB
MAX_DATA_ROWS = 2_000
MAX_SKUS = 10
MAX_HISTORY_DAYS = 180
MAX_QUANTITY_PER_ROW = 100_000
MAX_DAILY_AGGREGATED_QUANTITY = 1_000_000
MAX_PRODUCT_ID_LEN = 64
MAX_PRODUCT_NAME_LEN = 120

REQUIRED_COLUMNS = ["date", "product_id", "product_name", "quantity_sold"]


def _parse_iso_date(raw_date: str, row_num: int) -> dt.date:
    if len(raw_date) != 10:
        raise ApiError(
            status_code=422,
            code="INVALID_VALUES",
            message=f"Row {row_num}: Invalid date '{raw_date}'. Dates must use ISO format YYYY-MM-DD.",
            details=[f"Row {row_num}: Expected YYYY-MM-DD date format."],
        )
    try:
        return dt.date.fromisoformat(raw_date)
    except ValueError as exc:
        raise ApiError(
            status_code=422,
            code="INVALID_VALUES",
            message=f"Row {row_num}: Invalid calendar date '{raw_date}'. Dates must use ISO format YYYY-MM-DD.",
            details=[f"Row {row_num}: {exc}"],
        ) from exc


def _parse_quantity(raw_qty: str, row_num: int) -> int:
    if not raw_qty:
        raise ApiError(
            status_code=422,
            code="INVALID_VALUES",
            message=f"Row {row_num}: Missing quantity_sold value.",
            details=[f"Row {row_num}: quantity_sold must be an integer between 0 and {MAX_QUANTITY_PER_ROW}."],
        )
    # Reject signs like '+' or decimals/exponents or non-digits (except leading '-' to report negative)
    if raw_qty.startswith("-"):
        try:
            val = int(raw_qty)
        except ValueError:
            val = None
        if val is not None and val < 0:
            raise ApiError(
                status_code=422,
                code="INVALID_VALUES",
                message=f"Row {row_num}: Negative quantity_sold ({raw_qty}) is not allowed.",
                details=[f"Row {row_num}: quantity_sold must be >= 0."],
            )
    if not raw_qty.isdigit():
        raise ApiError(
            status_code=422,
            code="INVALID_VALUES",
            message=f"Row {row_num}: Invalid quantity_sold '{raw_qty}'. Must be a nonnegative integer.",
            details=[f"Row {row_num}: Fractional, non-numeric, or negative quantities are rejected."],
        )

    qty = int(raw_qty)
    if qty < 0 or qty > MAX_QUANTITY_PER_ROW:
        raise ApiError(
            status_code=422,
            code="INVALID_VALUES",
            message=f"Row {row_num}: quantity_sold ({qty}) exceeds maximum allowed ({MAX_QUANTITY_PER_ROW}).",
            details=[f"Row {row_num}: quantity_sold must be between 0 and {MAX_QUANTITY_PER_ROW}."],
        )
    return qty


def analyze_csv_bytes(raw_bytes: bytes) -> AnalyzeResponse:
    if len(raw_bytes) > MAX_FILE_BYTES:
        raise ApiError(
            status_code=413,
            code="FILE_TOO_LARGE",
            message="Uploaded CSV exceeds the 1 MB (1,048,576 bytes) size limit.",
            details=[f"Maximum allowed size is {MAX_FILE_BYTES} bytes."],
        )

    if len(raw_bytes) == 0:
        raise ApiError(
            status_code=400,
            code="INVALID_CSV",
            message="Uploaded CSV file is empty.",
            details=["Expected UTF-8 CSV with header: date,product_id,product_name,quantity_sold"],
        )

    if b"\x00" in raw_bytes:
        raise ApiError(
            status_code=400,
            code="INVALID_CSV",
            message="Uploaded file contains null bytes and is not a valid UTF-8 CSV.",
            details=["Upload a plain UTF-8 encoded text CSV file."],
        )

    try:
        text = raw_bytes.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ApiError(
            status_code=400,
            code="INVALID_CSV",
            message="Uploaded file is not valid UTF-8 encoded text.",
            details=["Save the CSV file with UTF-8 encoding and retry."],
        ) from exc

    stream = io.StringIO(text, newline="")
    try:
        reader = csv.reader(stream)
        header_row = next(reader, None)
    except csv.Error as exc:
        raise ApiError(
            status_code=400,
            code="INVALID_CSV",
            message="Malformed CSV syntax could not be parsed.",
            details=[str(exc)],
        ) from exc

    if header_row is None:
        raise ApiError(
            status_code=400,
            code="INVALID_CSV",
            message="Uploaded CSV file contains no header row.",
            details=["Expected header: date,product_id,product_name,quantity_sold"],
        )

    normalized_header = [col.strip() for col in header_row]
    if normalized_header != REQUIRED_COLUMNS:
        missing = [c for c in REQUIRED_COLUMNS if c not in normalized_header]
        extra = [c for c in normalized_header if c not in REQUIRED_COLUMNS]
        detail_parts = ["Expected: date,product_id,product_name,quantity_sold"]
        if missing:
            detail_parts.append(f"Missing column(s): {', '.join(missing)}")
        if extra:
            detail_parts.append(f"Unexpected column(s): {', '.join(extra)}")
        raise ApiError(
            status_code=400,
            code="INVALID_SCHEMA",
            message="CSV header does not match required schema.",
            details=detail_parts,
        )

    input_rows = 0
    empty_rows = 0
    accepted_rows = 0

    product_names: dict[str, str] = {}
    product_order: list[str] = []
    daily_totals: dict[str, dict[dt.date, int]] = defaultdict(lambda: defaultdict(int))
    raw_row_counts_per_sku: dict[str, int] = defaultdict(int)

    try:
        for row_idx, row in enumerate(reader, start=2):
            input_rows += 1

            # Check if entire row is empty/whitespace
            if not row or all(cell.strip() == "" for cell in row):
                empty_rows += 1
                continue

            if len(row) != 4:
                raise ApiError(
                    status_code=400,
                    code="INVALID_CSV",
                    message=f"Row {row_idx}: Expected exactly 4 columns, found {len(row)}.",
                    details=["Each data row must have 4 fields: date,product_id,product_name,quantity_sold"],
                )

            accepted_rows += 1
            if accepted_rows > MAX_DATA_ROWS:
                raise ApiError(
                    status_code=413,
                    code="TOO_MANY_ROWS",
                    message=f"CSV exceeds the maximum limit of {MAX_DATA_ROWS} data rows.",
                    details=[f"Upload at most {MAX_DATA_ROWS} data rows across up to {MAX_SKUS} SKUs."],
                )

            raw_date, raw_pid, raw_pname, raw_qty = (cell.strip() for cell in row)

            if not raw_pid or len(raw_pid) > MAX_PRODUCT_ID_LEN:
                raise ApiError(
                    status_code=422,
                    code="INVALID_VALUES",
                    message=f"Row {row_idx}: product_id must be 1–{MAX_PRODUCT_ID_LEN} non-empty characters.",
                    details=[f"Row {row_idx}: Invalid product_id."],
                )

            if not raw_pname or len(raw_pname) > MAX_PRODUCT_NAME_LEN:
                raise ApiError(
                    status_code=422,
                    code="INVALID_VALUES",
                    message=f"Row {row_idx}: product_name must be 1–{MAX_PRODUCT_NAME_LEN} non-empty characters.",
                    details=[f"Row {row_idx}: Invalid product_name for product_id '{raw_pid}'."],
                )

            parsed_date = _parse_iso_date(raw_date, row_idx)
            parsed_qty = _parse_quantity(raw_qty, row_idx)

            if raw_pid not in product_names:
                if len(product_names) >= MAX_SKUS:
                    raise ApiError(
                        status_code=422,
                        code="INVALID_VALUES",
                        message=f"CSV exceeds the maximum limit of {MAX_SKUS} unique product_id values.",
                        details=[f"Found more than {MAX_SKUS} distinct SKUs (offending row {row_idx}: '{raw_pid}')."],
                    )
                product_names[raw_pid] = raw_pname
                product_order.append(raw_pid)
            elif product_names[raw_pid] != raw_pname:
                raise ApiError(
                    status_code=422,
                    code="INVALID_VALUES",
                    message=(
                        f"Row {row_idx}: Inconsistent product_name for product_id '{raw_pid}'. "
                        f"Found '{raw_pname}', expected '{product_names[raw_pid]}'."
                    ),
                    details=[
                        f"Each product_id must map to a single consistent product_name across all rows."
                    ],
                )

            new_total = daily_totals[raw_pid][parsed_date] + parsed_qty
            if new_total > MAX_DAILY_AGGREGATED_QUANTITY:
                raise ApiError(
                    status_code=422,
                    code="INVALID_VALUES",
                    message=(
                        f"Row {row_idx}: Aggregated daily quantity for '{raw_pid}' on {parsed_date.isoformat()} "
                        f"exceeds {MAX_DAILY_AGGREGATED_QUANTITY}."
                    ),
                    details=["Daily aggregated quantity exceeds supported bound."],
                )

            daily_totals[raw_pid][parsed_date] = new_total
            raw_row_counts_per_sku[raw_pid] += 1
    except csv.Error as exc:
        raise ApiError(
            status_code=400,
            code="INVALID_CSV",
            message="Malformed CSV row could not be parsed.",
            details=[str(exc)],
        ) from exc

    if accepted_rows == 0:
        raise ApiError(
            status_code=422,
            code="NO_USABLE_HISTORY",
            message="CSV contains no valid sales data rows.",
            details=["Provide at least one SKU with dense daily sales records."],
        )

    warnings: list[str] = []
    if empty_rows > 0:
        warnings.append(f"Skipped {empty_rows} empty row(s) in uploaded CSV.")

    aggregated_daily_rows = sum(len(dates_map) for dates_map in daily_totals.values())
    duplicate_rows_total = accepted_rows - aggregated_daily_rows
    if duplicate_rows_total > 0:
        warnings.append(
            f"Aggregated {duplicate_rows_total} duplicate same-day transaction row(s) into daily SKU totals."
        )

    products: list[ProductAnalysis] = []
    product_errors: list[ProductError] = []

    for pid in product_order:
        pname = product_names[pid]
        sku_date_map = daily_totals[pid]
        sorted_dates = sorted(sku_date_map.keys())
        min_date = sorted_dates[0]
        max_date = sorted_dates[-1]
        expected_span_days = (max_date - min_date).days + 1
        actual_days = len(sorted_dates)

        # Check for ambiguous missing calendar dates within [min_date, max_date]
        if actual_days != expected_span_days:
            present_set = set(sorted_dates)
            missing_dates: list[str] = []
            cursor = min_date
            while cursor <= max_date and len(missing_dates) < 5:
                if cursor not in present_set:
                    missing_dates.append(cursor.isoformat())
                cursor += dt.timedelta(days=1)
            missing_count = expected_span_days - actual_days
            sample_str = ", ".join(missing_dates)
            if missing_count > len(missing_dates):
                sample_str += f", ... ({missing_count} missing day(s) total)"

            err_msg = (
                f"SKU '{pid}' ({pname}) is missing {missing_count} calendar date(s) between "
                f"{min_date.isoformat()} and {max_date.isoformat()} (e.g., {sample_str}). "
                f"Missing dates are not silently assumed to be zero; include explicit 0 rows for zero-sales days."
            )
            product_errors.append(
                ProductError(
                    product_id=pid,
                    code="DATA_GAPS",
                    message=err_msg,
                )
            )
            warnings.append(
                f"SKU '{pid}' excluded from forecasting due to {missing_count} missing calendar date(s) (DATA_GAPS)."
            )
            continue

        sku_notes: list[str] = []
        sku_dups = raw_row_counts_per_sku[pid] - actual_days
        if sku_dups > 0:
            sku_notes.append(
                f"Aggregated {sku_dups} duplicate transaction row(s) into daily totals for this SKU."
            )

        if actual_days > MAX_HISTORY_DAYS:
            truncated_count = actual_days - MAX_HISTORY_DAYS
            sorted_dates = sorted_dates[-MAX_HISTORY_DAYS:]
            trunc_msg = (
                f"Retained most recent {MAX_HISTORY_DAYS} consecutive daily observations for '{pid}' "
                f"(truncated {truncated_count} older daily record(s))."
            )
            sku_notes.append(trunc_msg)
            warnings.append(trunc_msg)

        retained_units = [sku_date_map[d] for d in sorted_dates]
        history_points = [
            DailyPoint(date=d.isoformat(), units=sku_date_map[d]) for d in sorted_dates
        ]

        exec_result = evaluate_and_forecast_sku(
            dates=sorted_dates,
            units=retained_units,
            existing_notes=sku_notes,
        )
        products.append(
            ProductAnalysis(
                product_id=pid,
                product_name=pname,
                status=exec_result.status,
                history=history_points,
                forecast=exec_result.forecast,
                chosen_method=exec_result.chosen_method,
                validation=exec_result.validation,
                notes=exec_result.notes,
            )
        )

    if len(products) == 0 and len(product_errors) > 0:
        raise ApiError(
            status_code=422,
            code="DATA_GAPS",
            message="No SKU could be analyzed because every submitted product series has missing calendar dates.",
            details=[err.message for err in product_errors],
        )

    products_with_forecast = sum(1 for p in products if len(p.forecast) > 0)

    summary = AnalysisSummary(
        input_rows=input_rows,
        accepted_rows=accepted_rows,
        aggregated_daily_rows=aggregated_daily_rows,
        products_total=len(product_order),
        products_with_forecast=products_with_forecast,
        warnings=warnings,
    )

    return AnalyzeResponse(
        data_kind="user_upload",
        summary=summary,
        products=products,
        product_errors=product_errors,
    )
