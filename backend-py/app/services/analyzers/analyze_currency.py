import re
import pandas as pd


def analyze_currency(series: pd.Series) -> dict:
    if series.empty:
        return {"error": "Empty series"}

    # Preserve original for symbol detection + examples
    original = series.dropna().astype(str)
    missing_values = int(series.isnull().sum())

    if original.empty:
        return {"error": "No valid currency values"}

    # Detect the most common symbol (e.g., $, €, £)
    symbols = original.str.extract(r"([^0-9\.\-\s])")[0].dropna()
    common_symbol = symbols.mode().iloc[0] if not symbols.empty else ""

    # Remove symbols, commas, spaces → keep only numeric parts
    cleaned = original.str.replace(r"[^\d\.\-]", "", regex=True)
    numeric = pd.to_numeric(cleaned, errors="coerce").dropna()

    if numeric.empty:
        return {
            "error": "No valid currency values",
            "symbol": common_symbol,
            "example_values": original.head(5).tolist(),
            "missing_values": missing_values,
        }

    return {
        "symbol": common_symbol,
        "count": int(numeric.count()),
        "total_sum": float(numeric.sum()),
        "mean": float(numeric.mean()),
        "median": float(numeric.median()),
        "min": float(numeric.min()),
        "max": float(numeric.max()),
        "std_dev": float(numeric.std()),
        "q1": float(numeric.quantile(0.25)),
        "q3": float(numeric.quantile(0.75)),
        "unique_values": int(numeric.nunique()),
        "missing_values": missing_values,
        "example_values": original.head(5).tolist(),
    }