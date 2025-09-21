import {AnalysisResponse} from "@/types";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import {parseFileAsync} from "@/store/parseFileAsync.tsx";

const serverUrl = import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:8000';
interface MainState {
  analysisData: null | AnalysisResponse;
  header: boolean, // first row = column headers
  skipEmptyLines: boolean,
  theme: 'light' | 'dark',
  currentFile: null | File;
  loading: boolean;
  error: null | string;
  progress: number; // upload progress
  data?: Record<string, string | number>[];
  columns?: { title: string; dataIndex: string; key: string; }[];
  perPage?: number;
  parsing: boolean;
}

const initialState: MainState = {
  analysisData: null,
  header: true, // first row = column headers
  skipEmptyLines: true,
  currentFile: null,
  loading: false,
  error: null,
  progress: 0,
  theme: "light",
  parsing: false
};

// Async thunk with Axios upload progress
export const UploadFileAsync = createAsyncThunk<
  AnalysisResponse,
  File,
  { rejectValue: string }
>("main/uploadFile", async (file: File, { rejectWithValue, dispatch }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<AnalysisResponse>(
      `${serverUrl}/api/v1/analyze`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setProgress(percent));
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Server responded with a status other than 2xx
        return rejectWithValue(
          `Upload failed: ${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else if (axiosError.request) {
        // Request was made but no response received
        return rejectWithValue("No response from server.");
      } else {
        // Something happened in setting up the request
        return rejectWithValue(`Error: ${axiosError.message}`);
      }
    }
    // Non-Axios error
    const err = error as Error; 
    return rejectWithValue( err.message);
  }
});





const MainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setUploadFile(state, action: PayloadAction<File | null>) {
      state.currentFile = action.payload;
    },
    setFileOptions(state, action: PayloadAction<{header: boolean, skipEmptyLines: boolean}>) {
      state.header = action.payload.header;
      state.skipEmptyLines = action.payload.skipEmptyLines;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    resetState(state) {
      const theme = state.theme;
      state = {...initialState,theme};
      console.log("Resetting state...", state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UploadFileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.progress = 0;
      })
      .addCase(UploadFileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisData = action.payload;
        state.progress = 100; // final step
      })
      .addCase(UploadFileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder.addCase(parseFileAsync.pending, (state) => {
      state.parsing = true;
      state.data = undefined;
      state.columns = undefined;
    })
        .addCase(parseFileAsync.fulfilled, (state,action) => {
          state.parsing = false;
          state.data = action.payload.data;
          state.columns = action.payload.columns;
        })
        .addCase(parseFileAsync.rejected, (state,action) => {
          state.parsing = false;
          state.error = action.payload as string;
          state.data= undefined;
          state.columns = undefined;
        })
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setUploadFile, setProgress, resetState,setFileOptions,setTheme } = MainSlice.actions;
export default MainSlice.reducer;