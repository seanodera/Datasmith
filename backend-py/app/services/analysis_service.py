import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, Optional
import uuid

def analyze_dataframe(df: pd.DataFrame, group_by_column: Optional[str] = None) -> Dict[str, Any]:
    """
    Comprehensive analysis of DataFrame for duplicates and statistical measures.
    
    Args:
        df: pandas DataFrame to analyze
        group_by_column: Optional column name for group-wise analysis
    
    Returns:
        Dictionary containing comprehensive analysis results
    """
    results = {
        'analysis_id': str(uuid.uuid4()),
        'analysis_timestamp': datetime.utcnow().isoformat(),
        'metadata': {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'columns': list(df.columns),
            'data_types': {col: str(df[col].dtype) for col in df.columns},
            'memory_usage': f"{df.memory_usage(deep=True).sum() / 1024 / 1024:.2f} MB"
        },
        'duplicate_analysis': {},
        'numerical_analysis': {},
        'categorical_analysis': {},
        'data_quality': {
            'complete_duplicates_count': df.duplicated().sum(),
            'total_missing_values': df.isnull().sum().sum(),
            'missing_values_by_column': df.isnull().sum().to_dict()
        }
    }
    print(f"DataFrame has {len(df)} rows and {len(df.columns)} columns.")
    # Analyze each column
    for column in df.columns:
        print(f"Analyzing column: {column}")
        # Duplicate analysis for all columns
        duplicate_count = df.duplicated(subset=[column]).sum()
        results['duplicate_analysis'][column] = {
            'duplicate_count': duplicate_count,
            'unique_count': df[column].nunique(),
            'duplicate_percentage': (duplicate_count / len(df)) * 100 if len(df) > 0 else 0,
            'most_common_value': _get_most_common_value(df[column]),
            'most_common_count': _get_most_common_count(df[column])
        }
        
            # Numerical column analysis
        def _safe_float(val):
            if pd.isna(val) or np.isinf(val):
                return None
            return float(val)

        if pd.api.types.is_numeric_dtype(df[column]):
            print(f"Performing numerical analysis for column: {column}")
            results['numerical_analysis'][column] = {
                'mean': _safe_float(df[column].mean()),
                'median': _safe_float(df[column].median()),
                'min': _safe_float(df[column].min()),
                'max': _safe_float(df[column].max()),
                'std': _safe_float(df[column].std()),
                'q1': _safe_float(df[column].quantile(0.25)),
                'q3': _safe_float(df[column].quantile(0.75)),
                'missing_values': int(df[column].isnull().sum()),
                'zero_values': int((df[column] == 0).sum()) if df[column].dtype != 'bool' else 0
            }
        
        # Categorical column analysis
        elif pd.api.types.is_string_dtype(df[column]) or pd.api.types.is_categorical_dtype(df[column]):
            value_counts = df[column].value_counts().to_dict()
            print(f"Performing categorical analysis for column: {column}")
            results['categorical_analysis'][column] = {
                'unique_values': len(value_counts),
                'value_distribution': value_counts,
                'most_common_value': max(value_counts, key=value_counts.get) if value_counts else None,
                'most_common_count': max(value_counts.values()) if value_counts else 0,
                'missing_values': int(df[column].isnull().sum())
            }
    
    # Group analysis if specified
    if group_by_column and group_by_column in df.columns:
        results['group_analysis'] = _perform_group_analysis(df, group_by_column)
    def convert_to_serializable(obj):
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64)):
            if pd.isna(obj) or np.isinf(obj):
                return None
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return [convert_to_serializable(x) for x in obj.tolist()]
        elif isinstance(obj, pd.Timestamp):
            return obj.isoformat()
        elif isinstance(obj, pd.Interval):
            return str(obj)
        elif isinstance(obj, dict):
            return {k: convert_to_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_to_serializable(item) for item in obj]
        else:
            return obj
    
    serializable_results = convert_to_serializable(results)
    return serializable_results

def _get_most_common_value(series: pd.Series) -> Any:
    """Get the most common value in a series"""
    mode = series.mode()
    return mode.iloc[0] if not mode.empty else None

def _get_most_common_count(series: pd.Series) -> int:
    """Get the count of the most common value"""
    value_counts = series.value_counts()
    return value_counts.iloc[0] if not value_counts.empty else 0

def _perform_group_analysis(df: pd.DataFrame, group_column: str) -> Dict[str, Any]:
    """Perform group-wise analysis"""
    group_results = {}
    
    try:
        if pd.api.types.is_numeric_dtype(df[group_column]):
            # For numerical grouping, create bins
            df_grouped = df.copy()
            try:
                df_grouped['group_bin'] = pd.qcut(df_grouped[group_column], q=4, duplicates='drop')
                groups = df_grouped.groupby('group_bin')
            except:
                df_grouped['group_bin'] = pd.cut(df_grouped[group_column], bins=5)
                groups = df_grouped.groupby('group_bin')
        else:
            groups = df.groupby(group_column)
        
        for group_name, group_data in groups:
            group_stats = {}
            
            # Calculate statistics for numerical columns in this group
            numerical_cols = group_data.select_dtypes(include=[np.number]).columns
            for num_col in numerical_cols:
                if num_col != group_column:
                    group_stats[num_col] = {
                        'mean': float(group_data[num_col].mean()),
                        'count': int(group_data[num_col].count()),
                        'min': float(group_data[num_col].min()),
                        'max': float(group_data[num_col].max())
                    }
            
            group_results[str(group_name)] = {
                'row_count': len(group_data),
                'numerical_stats': group_stats
            }
            
    except Exception as e:
        group_results['error'] = f"Group analysis failed: {str(e)}"
    
    return group_results