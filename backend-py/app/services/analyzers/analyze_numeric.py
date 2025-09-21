import numpy as np
import pandas as pd


def analyze_numeric(series: pd.Series) -> dict:
    series = pd.to_numeric(series, errors='coerce')
    series = series.dropna()
    if series.empty:
        return {}

    desc = series.describe()
    q1, q3 = series.quantile([0.25, 0.75])
    iqr = q3 - q1

    # Outliers (1.5 * IQR rule)
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    outliers = series[(series < lower_bound) | (series > upper_bound)]

    return {
        "count": int(desc["count"]),
        "mean": float(desc["mean"]),
        "median": float(series.median()),
        "min": float(desc["min"]),
        "max": float(desc["max"]),
        "std_dev": float(desc["std"]),
        "variance": float(series.var()),
        "q1": float(q1),
        "q3": float(q3),
        "iqr": float(iqr),
        "coefficient_of_variation": float(desc["std"] / desc["mean"]) if desc["mean"] != 0 else None,
        "skewness": float(series.skew()),
        "kurtosis": float(series.kurtosis()),
        "missing_values": int(series.isnull().sum()),
        "unique_values": int(series.nunique()),
        "zero_count": int((series == 0).sum()),
        "positive_count": int((series > 0).sum()),
        "negative_count": int((series < 0).sum()),
        "outlier_count": int(len(outliers)),
        "outlier_percentage": float(len(outliers) / len(series) * 100) if len(series) > 0 else 0,
        "outlier_examples": outliers.head(5).tolist()  # just a preview
    }