import axios from "axios";

export async function fileHandler(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file); // The key 'file' must match your FastAPI endpoint

    const response = await axios.post('http://localhost:8000/api/v1/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('File uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Re-throw the error so calling code can handle it
  }
}