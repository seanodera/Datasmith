from fastapi import APIRouter, UploadFile, File, HTTPException, status, Query
from fastapi.responses import JSONResponse
from typing import Optional
import pandas as pd
from ..services.analysis_service import analyze_dataframe
from ..utils import validate_csv_file, read_csv_from_upload

analysis_router = APIRouter()

@analysis_router.post("/analyze", summary="Analyze CSV file for duplicates and averages")
async def upload_file(
    file: UploadFile = File(..., description="CSV file to analyze"),
    group_by: Optional[str] = Query(None, description="Column name to group analysis by")
):
    """
    Upload a CSV file and get analysis of duplicates and numerical averages.
    
    Returns:
    - Metadata about the dataset
    - Duplicate analysis for each column
    - Statistical analysis for numerical columns
    - Categorical analysis for text columns
    - Optional group-wise analysis
    """
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}")
    try:
        # Validate file
        validation_error = validate_csv_file(file)
        if validation_error:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=validation_error)
        
        # Read CSV file
        df = read_csv_from_upload(file)
        if df.empty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Uploaded file is empty or could not be parsed"
            )
        
        # Perform analysis
        analysis_results = analyze_dataframe(df, group_by_column=group_by)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "filename": file.filename,
                "analysis_id": analysis_results.get("analysis_id"),
                "results": analysis_results
            }
        )
        
    except pd.errors.EmptyDataError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The CSV file appears to be empty"
        )
    except pd.errors.ParserError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not parse the CSV file. Please check the format."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during analysis: {str(e)}"
        )

@analysis_router.get("/analyze/sample", summary="Get sample analysis data")
async def get_sample_analysis():
    """
    Returns sample analysis data for testing purposes.
    """
    import pandas as pd
    import numpy as np
    
    # Create sample data
    sample_data = {
        'id': [1, 2, 3, 4, 5, 2, 6],
        'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Bob', 'Frank'],
        'age': [25, 30, 35, 40, 28, 30, 45],
        'salary': [50000, 60000, 70000, 80000, 55000, 62000, 90000],
        'department': ['HR', 'IT', 'IT', 'Finance', 'HR', 'IT', 'Finance']
    }
    
    df = pd.DataFrame(sample_data)
    analysis_results = analyze_dataframe(df, group_by_column='department')
    
    return {
        "filename": "sample_data.csv",
        "results": analysis_results
    }