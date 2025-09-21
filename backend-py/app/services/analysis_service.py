import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, Optional
import uuid

from .field_detector import infer_column_semantic_type
from .analyzers import (
    date_analysis,
    analyze_currency,
    analyze_boolean,
    analyze_numeric,
    analyze_string,
    analyze_id
)


def analyze_dataframe(df: pd.DataFrame, group_by_column: Optional[str] = None) -> Dict[str, Any]:
    """
    Comprehensive analysis of DataFrame for duplicates, data quality, and semantic insights.
    """

    results = {
        "analysis_id": str(uuid.uuid4()),
        "analysis_timestamp": datetime.utcnow().isoformat(),
        "metadata": {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": list(df.columns),
            "data_types": {col: str(df[col].dtype) for col in df.columns},
            "memory_usage": f"{df.memory_usage(deep=True).sum() / 1024 / 1024:.2f} MB",
        },
        "duplicate_analysis": {},
        "numerical_analysis": {},
        "data_quality": {
            "complete_duplicates_count": df.duplicated().sum(),
            "total_missing_values": int(df.isnull().sum().sum()),
            "missing_values_by_column": df.isnull().sum().to_dict(),
        },
        "columns": [],
    }

    for column in df.columns:
        col_series = df[column]
        semantic_type = infer_column_semantic_type(col_series)

        # Duplicate + frequency profile
        results["duplicate_analysis"][column] = {
            "duplicate_count": df.duplicated(subset=[column]).sum(),
            "unique_count": col_series.nunique(),
            "duplicate_percentage": (df.duplicated(subset=[column]).sum() / len(df)) * 100 if len(df) else 0,
            "most_common_value": _get_most_common_value(col_series),
            "most_common_count": _get_most_common_count(col_series),
            "unique_values": col_series.dropna().unique().tolist(),
            "value_distribution": col_series.value_counts(dropna=False).to_dict(),
            "missing_values": int(col_series.isnull().sum()),
        }

        # Run semantic-specific analyzers
        analyzers = {
            "date": date_analysis,
            "currency": analyze_currency,
            "boolean": analyze_boolean,
            "numeric": analyze_numeric,
            "string": analyze_string,
            "id": analyze_id,
        }
        print(f"Analyzing column {column} with semantic type {semantic_type}")


        if semantic_type in analyzers:
            analysis = analyzers[semantic_type](col_series)
            results["columns"].append(
                {"name": column, "type": semantic_type, "analysis": analysis}
            )

        # Generic numeric analysis (for true numeric dtype)
        if pd.api.types.is_numeric_dtype(col_series):
            results["numerical_analysis"][column] = _summarize_numeric(col_series)

    # Optional group-by analysis
    if group_by_column and group_by_column in df.columns:
        results["group_analysis"] = _perform_group_analysis(df, group_by_column)

    return _make_serializable(results)


def _summarize_numeric(series: pd.Series) -> Dict[str, Any]:
    """Basic stats for numeric columns."""
    def _safe(val):
        return None if pd.isna(val) or np.isinf(val) else float(val)

    return {
        "mean": _safe(series.mean()),
        "median": _safe(series.median()),
        "min": _safe(series.min()),
        "max": _safe(series.max()),
        "std": _safe(series.std()),
        "q1": _safe(series.quantile(0.25)),
        "q3": _safe(series.quantile(0.75)),
        "missing_values": int(series.isnull().sum()),
        "zero_values": int((series == 0).sum()) if series.dtype != "bool" else 0,
    }


def _get_most_common_value(series: pd.Series) -> Any:
    mode = series.mode()
    return mode.iloc[0] if not mode.empty else None


def _get_most_common_count(series: pd.Series) -> int:
    value_counts = series.value_counts()
    return int(value_counts.iloc[0]) if not value_counts.empty else 0


def _perform_group_analysis(df: pd.DataFrame, group_column: str) -> Dict[str, Any]:
    """Perform group-wise analysis with stats per group."""
    group_results = {}
    try:
        if pd.api.types.is_numeric_dtype(df[group_column]):
            df_grouped = df.copy()
            try:
                df_grouped["group_bin"] = pd.qcut(df_grouped[group_column], q=4, duplicates="drop")
            except Exception:
                df_grouped["group_bin"] = pd.cut(df_grouped[group_column], bins=5)
            groups = df_grouped.groupby("group_bin")
        else:
            groups = df.groupby(group_column)

        for group_name, group_data in groups:
            stats = {}
            for num_col in group_data.select_dtypes(include=[np.number]).columns.drop(group_column, errors="ignore"):
                stats[num_col] = {
                    "mean": float(group_data[num_col].mean()),
                    "count": int(group_data[num_col].count()),
                    "min": float(group_data[num_col].min()),
                    "max": float(group_data[num_col].max()),
                }
            group_results[str(group_name)] = {
                "row_count": len(group_data),
                "numerical_stats": stats,
            }
    except Exception as e:
        group_results["error"] = f"Group analysis failed: {e}"
    return group_results


def _make_serializable(obj):
    """Convert numpy/pandas types to JSON serializable."""
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return None if pd.isna(obj) or np.isinf(obj) else float(obj)
    if isinstance(obj, (pd.Timestamp,)):
        return obj.isoformat()
    if isinstance(obj, (pd.Interval,)):
        return str(obj)
    if isinstance(obj, (np.ndarray, list, tuple)):
        return [_make_serializable(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _make_serializable(v) for k, v in obj.items()}
    return obj