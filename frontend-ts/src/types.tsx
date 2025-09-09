export interface AnalysisResponse {
  filename: string;
  analysis_id: string;
  results: AnalysisResults;
}

export interface AnalysisResults {
  analysis_id: string;
  analysis_timestamp: string;
  metadata: Metadata;
  duplicate_analysis: Record<string, DuplicateAnalysis>;
  numerical_analysis: Record<string, NumericalAnalysis>;
  categorical_analysis: Record<string, CategoricalAnalysis>;
  data_quality: DataQuality;
}

export interface Metadata {
  total_rows: number;
  total_columns: number;
  columns: string[];
  data_types: Record<string, string>;
  memory_usage: string;
}

export interface DuplicateAnalysis {
  duplicate_count: number;
  unique_count: number;
  duplicate_percentage: number;
  most_common_value: string | number | null;
  most_common_count: number;
}

export interface NumericalAnalysis {
  mean: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  std: number | null;
  q1: number | null;
  q3: number | null;
  missing_values: number;
  zero_values: number;
}

export interface CategoricalAnalysis {
  unique_values: number;
  value_distribution: Record<string, number>;
  most_common_value: string | null;
  most_common_count: number;
  missing_values: number;
}

export interface DataQuality {
  complete_duplicates_count: number;
  total_missing_values: number;
  missing_values_by_column: Record<string, number>;
}