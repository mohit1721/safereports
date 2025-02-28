import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiconnector } from "../../services/apiconnector";
import { handleAsyncThunk } from "../handleAsyncThunk";

// ✅ Fetch Police Reports (Async Thunk)
export const fetchPoliceReports = createAsyncThunk(
  "reports/fetchPoliceReports",
  async ({ status, type, reportName, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      return await apiconnector({
        method: "GET",
        url: "/reports/police",
        params: { status, type, reportName, page, limit },
        withCredentials: true,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Update Report Status (Async Thunk)
export const updateReportStatus = createAsyncThunk(
  "reports/updateReportStatus",
  async ({ reportId, status }, { rejectWithValue }) => {
    try {
      return await apiconnector({
        method: "PUT",
        url: `/reports/${reportId}/status`,
        data: { status },
        withCredentials: true,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Redux Slice
const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ Reusable Reducer Utility
    handleAsyncThunk(builder, fetchPoliceReports);
    handleAsyncThunk(builder, updateReportStatus, (state, updatedReport) => {
      state.reports = state.reports.map((report) =>
        report._id === updatedReport._id ? updatedReport : report
      );
    });
  },
});

export const { clearErrors } = reportSlice.actions;
export default reportSlice.reducer;
