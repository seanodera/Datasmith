from fastapi import UploadFile, HTTPException, status
import pandas as pd
import io

def validate_csv_file(file: UploadFile) -> str:
    """
    Validate uploaded CSV file
    
    Returns:
        str: Error message if invalid, empty string if valid
    """
    if not file:
        return "No file uploaded"
    
    if not file.filename:
        return "Invalid file name"
    
    if not file.filename.lower().endswith('.csv'):
        return "Invalid file type. Only CSV files are allowed."
    
    # Check file size (limit to 10MB)
    max_size = 10 * 1024 * 1024  # 10MB
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > max_size:
        return f"File too large. Maximum size is {max_size/1024/1024}MB"
    
    if file_size == 0:
        return "File is empty"
    
    return ""

def read_csv_from_upload(file: UploadFile) -> pd.DataFrame:
    """
    Read CSV file from UploadFile object
    
    Args:
        file: FastAPI UploadFile object
    
    Returns:
        pandas DataFrame
    """
    try:
        # Read file content
        content = file.file.read()
        
        # Try different encodings if necessary
        try:
            df = pd.read_csv(io.BytesIO(content))
        except UnicodeDecodeError:
            # Try with different encoding
            df = pd.read_csv(io.BytesIO(content), encoding='latin-1')
        
        return df
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error reading CSV file: {str(e)}"
        )
    finally:
        file.file.close()