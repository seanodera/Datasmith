from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class AnalysisResponse(BaseModel):
    filename: str
    analysis_id: str
    results: Dict[str, Any]

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

class HealthCheckResponse(BaseModel):
    status: str
    timestamp: str

class SampleAnalysisRequest(BaseModel):
    include_numerical: bool = True
    include_categorical: bool = True
    row_count: int = 100