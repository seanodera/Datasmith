import pandas as pd


def analyze_boolean(series: pd.Series) -> dict:
    series = series.dropna()
    if series.empty:
        return {}

    # Normalize to True/False
    if series.dtype != "bool":
        series = series.astype(str).str.lower().map(
            {"true": True, "false": False, "1": True, "0": False, "yes": True, "no": False})

    value_counts = series.value_counts(dropna=False).to_dict()

    return {
        "count": int(len(series)),
        "true_count": int((series == True).sum()),
        "false_count": int((series == False).sum()),
        "true_percentage": float((series == True).mean() * 100),
        "false_percentage": float((series == False).mean() * 100),
        "missing_values": int(series.isnull().sum()),
        "distribution": {str(k): int(v) for k, v in value_counts.items()}
    }