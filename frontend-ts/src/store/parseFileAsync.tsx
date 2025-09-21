import {createAsyncThunk} from "@reduxjs/toolkit";
import Papa from "papaparse";

type ParsedFile = {
  data: Record<string, string | number>[];
  columns: { title: string; dataIndex: string; key: string }[];
};

export const parseFileAsync = createAsyncThunk<
    ParsedFile, // ✅ Return type
    { currentFile: File; header?: boolean; skipEmptyLines?: boolean }, // ✅ Argument type
    { rejectValue: string } // ✅ Rejection type
>(
    "main/parseFile",
    async (
        {currentFile, header = true, skipEmptyLines = false},
        {rejectWithValue}
    ) => {
        try {
            if (!currentFile) {
                return rejectWithValue("File not selected");
            }

            const result = await new Promise<ParsedFile>((resolve, reject) => {
                Papa.parse(currentFile, {
                    header,
                    skipEmptyLines,
                    complete: (results) => {
                        const rows = results.data;

                        if (!rows || rows.length === 0) {
                            return resolve({data: [], columns: []});
                        }

                        const columns = Object.keys(rows[0] as object).map((key) => ({
                            title: key,
                            dataIndex: key,
                            key,
                        }));

                        resolve({data: rows as Record<string, string | number>[], columns});
                    },
                    error: (err) => reject(err),
                });
            });

            return result;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);