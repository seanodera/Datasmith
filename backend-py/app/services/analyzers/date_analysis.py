import pandas as pd


def date_analysis(series: pd.Series):
    series = pd.to_datetime(series, errors='coerce').dropna()
    if series.empty:
        return {}

    series_sorted = series.sort_values()
    diffs = series_sorted.diff().dropna()

    return {
        "min_date": series.min(),
        "max_date": series.max(),
        "range_days": (series.max() - series.min()).days,
        "median_date": series.median(),
        "most_common_date": series.mode().iloc[0] if not series.mode().empty else None,
        "counts_by_year": series.dt.year.value_counts().to_dict(),
        "counts_by_month": series.dt.month.value_counts().to_dict(),
        "counts_by_weekday": series.dt.day_name().value_counts().to_dict(),
        "average_gap_days": diffs.mean().days if not diffs.empty else None,
        "min_gap_days": diffs.min().days if not diffs.empty else None,
        "max_gap_days": diffs.max().days if not diffs.empty else None,
        "std_gap_days": diffs.std().days if not diffs.empty else None
    }