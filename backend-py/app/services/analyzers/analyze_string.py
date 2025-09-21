import pandas as pd


def analyze_string(series: pd.Series) -> dict:
    series = series.dropna().astype(str)
    if series.empty:
        return {}

    lengths = series.str.len()
    desc = lengths.describe()

    return {
        "count": int(desc["count"]),
        "unique_values": int(series.nunique()),
        "most_common_value": series.mode().iloc[0] if not series.mode().empty else None,
        "most_common_count": int(series.value_counts().iloc[0]) if not series.value_counts().empty else 0,
        "avg_length": float(desc["mean"]),
        "min_length": int(desc["min"]),
        "max_length": int(desc["max"]),
        "median_length": float(lengths.median()),
        "empty_string_count": int((series == "").sum()),
        "whitespace_ratio": float((series.str.strip() == "").mean()),
        "example_values": series.head(5).tolist()
    }