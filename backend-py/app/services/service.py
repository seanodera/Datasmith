import pandas as pd
import numpy as np
import json
from collections import defaultdict


def analyze_dataframe(df, group_by_column=None):
    """
    Parameters:
    df: pandas DataFrame
    group_by_column: column to use for group-wise analysis
    """
    
    results = {
        'metadata': {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'columns': list(df.columns),
            'data_types': {col: str(df[col].dtype) for col in df.columns}
        },
        'duplicate_analysis': {},
        'average_analysis': {},
        'column_statistics': {}
    }
    
    # Analyze each column for duplicates
    for column in df.columns:
        col_results = {
            'total_values': len(df[column]),
            'unique_values': df[column].nunique(),
            'duplicate_count': df.duplicated(subset=[column]).sum(),
            'duplicate_percentage': (df.duplicated(subset=[column]).sum() / len(df)) * 100,
            'most_common_value': df[column].mode().iloc[0] if not df[column].mode().empty else None,
            'most_common_count': df[column].value_counts().iloc[0] if not df[column].value_counts().empty else 0
        }
        
        # Get duplicate details for the first 5 duplicates
        duplicates = df[df.duplicated(subset=[column], keep=False)]
        if not duplicates.empty:
            col_results['duplicate_examples'] = duplicates[column].value_counts().head().to_dict()
        
        results['duplicate_analysis'][column] = col_results
    
    # Analyze numerical columns for averages and statistics
    numerical_columns = df.select_dtypes(include=[np.number]).columns
    
    for column in numerical_columns:
        col_stats = {
            'average': float(df[column].mean()),
            'median': float(df[column].median()),
            'min': float(df[column].min()),
            'max': float(df[column].max()),
            'std_dev': float(df[column].std()),
            'count': int(df[column].count()),
            'missing_values': int(df[column].isnull().sum())
        }
        
        results['average_analysis'][column] = col_stats
        results['column_statistics'][column] = col_stats
    
    # Analyze categorical columns
    categorical_columns = df.select_dtypes(include=['object', 'category']).columns
    
    for column in categorical_columns:
        value_counts = df[column].value_counts().to_dict()
        col_stats = {
            'unique_categories': len(value_counts),
            'value_distribution': value_counts,
            'most_common_category': max(value_counts, key=value_counts.get) if value_counts else None,
            'missing_values': int(df[column].isnull().sum())
        }
        results['column_statistics'][column] = col_stats
    
    # Group-wise analysis if specified
    if group_by_column and group_by_column in df.columns:
        results['group_analysis'] = {}
        
        if group_by_column in numerical_columns:
            # If group_by is numerical, create bins
            df_grouped = df.copy()
            df_grouped['group_bin'] = pd.qcut(df_grouped[group_by_column], q=4, duplicates='drop')
            groups = df_grouped.groupby('group_bin')
        else:
            groups = df.groupby(group_by_column)
        
        for group_name, group_data in groups:
            group_stats = {}
            
            # Calculate averages for numerical columns in this group
            for num_col in numerical_columns:
                if num_col != group_by_column:
                    group_stats[num_col] = {
                        'average': float(group_data[num_col].mean()),
                        'count': int(group_data[num_col].count())
                    }
            
            results['group_analysis'][str(group_name)] = {
                'row_count': len(group_data),
                'averages': group_stats
            }
    
    # Find complete duplicate rows
    complete_duplicates = df[df.duplicated(keep=False)]
    results['complete_duplicates'] = {
        'count': len(complete_duplicates),
        'examples': complete_duplicates.head().to_dict('records') if not complete_duplicates.empty else []
    }
    
    return results

def save_analysis_to_json(results, filename='data_analysis_report.json'):
    """Save analysis results to JSON file"""
    
    # Convert numpy types to native Python types for JSON serialization
    def convert_to_serializable(obj):
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
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

    
    print(f"Analysis complete. Results saved to {serializable_results}")
    return serializable_results

# Run the automated analysis
# print("Running automated analysis...")
# analysis_results = analyze_dataframe(df, group_by_column='department')



