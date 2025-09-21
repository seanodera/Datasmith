import re
import dateparser
import pandas as pd
import datetime


def detect_field_type(value: any) -> str:
    if pd.isna(value):
        return "Null"

    # If already datetime-like
    if isinstance(value, (datetime.date, datetime.datetime, pd.Timestamp)):
        return "date"

    val_str = str(value).strip()

    # Boolean check
    if val_str.lower() in ["true", "false", "yes", "no", "0", "1"]:
        return "boolean"

    # Currency check (must have symbol/code, not just digits)
    currency_pattern = re.compile(
        r"^(?:[$€£¥]|USD|EUR|GBP|JPY)\s?-?\d{1,3}(?:,?\d{3})*(?:\.\d+)?$"
    )
    if currency_pattern.match(val_str):
        return "currency"

    # Flight number check (e.g., EK721, AA145)
    if re.match(r"^[A-Z]{2}\d{2,4}$", val_str):
        return "flight_number"

    # Email check
    if re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", val_str):
        return "email"

    # URL check
    if re.match(r"^https?://[^\s/$.?#].[^\s]*$", val_str):
        return "url"

    # Phone number check (basic international + local)
    if re.match(r"^\+?\d{7,15}$", val_str):
        return "phone_number"

    # Numeric check
    try:
        float(val_str.replace(",", ""))
        return "numeric"
    except ValueError:
        pass

    # Date check (only if it looks like a date)
    date_pattern = re.compile(
        r"[\-/:\s]|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)", re.I
    )
    if date_pattern.search(val_str):
        parsed = dateparser.parse(val_str)
        if parsed:
            return "date"

    return "string"


def infer_column_semantic_type(series: pd.Series, sample_size: int = 100) -> str:
    """Infer the semantic type of a pandas Series by sampling values"""
    series = series.dropna()
    if series.empty:
        return "unknown"

    samples = series.astype(str).sample(
        n=min(sample_size, len(series)), random_state=42
    )
    detected_types = [detect_field_type(v) for v in samples]

    if not detected_types:
        return "unknown"

    most_common_type = max(set(detected_types), key=detected_types.count)

    # Trust semantic detections first
    if most_common_type in ["currency", "date", "boolean"]:
        return most_common_type

    # ID detection
    unique_ratio = series.nunique() / len(series)
    if unique_ratio > 0.95:
        # Check for sequential numeric (like 1..N)
        try:
            nums = pd.to_numeric(series, errors="coerce").dropna()
            if len(nums) == len(series):
                sorted_nums = sorted(nums)
                if sorted_nums == list(range(int(min(nums)), int(max(nums)) + 1)):
                    return "id"
        except Exception:
            pass

        # Otherwise, still id-like if unique
        return "id"

    # ✅ Otherwise, fallback
    return most_common_type