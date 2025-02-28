import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiconnector } from "../../services/apiconnector";
import { handleAsyncThunk } from "../handleAsyncThunk";

// ✅ Create Report (Async Thunk)
export const createReport = createAsyncThunk(
  "report/createReport",
  async (reportData, { rejectWithValue }) => {
    try {
      return await apiconnector({
        method: "POST",
        url: "/report/create",
        data: reportData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Get Report by ID (Async Thunk)
export const getReportById = createAsyncThunk(
  "report/getReportById",
  async (reportId, { rejectWithValue }) => {
    try {
      return await apiconnector({
        method: "GET",
        url: `/report/${reportId}`,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Report Slice Definition
const reportSlice = createSlice({
  name: "report",
  initialState: {
    reports: [],
    selectedReport: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Reusable reducer handlers
    handleAsyncThunk(builder, createReport, (state, payload) => {
      state.reports.push(payload.report);
    });

    handleAsyncThunk(builder, getReportById, (state, payload) => {
      state.selectedReport = payload.report;
    });
  },
});

export default reportSlice.reducer;
