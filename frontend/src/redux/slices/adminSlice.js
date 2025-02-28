import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiconnector } from "../../services/apiconnector"; // ✅ Reusable API Connector
import { handleAsyncThunk } from "../handleAsyncThunk"; //// ✅ Utility function to handle async thunk states
 


// ✅ Add Police Station (Only Admin)
export const addPoliceStation = createAsyncThunk(
    "admin/addPoliceStation",
    async (policeStationData, { rejectWithValue }) => {
        try {
            return await apiconnector({
                method: "POST",
                url: "/police-stations",
                data: policeStationData,
            });
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ✅ Get All Police Stations (Only Admin)
export const getAllPoliceStations = createAsyncThunk(
    "admin/getAllPoliceStations",
    async ({ district, state, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            return await apiconnector({
                method: "GET",
                url: "/police-stations",
                params: { district, state, page, limit },
            });
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ✅ Fetch Reports (Only Admin)
export const fetchAdminReports = createAsyncThunk(
    "reports/fetchAdminReports",
    async (filters, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            return await apiconnector({
                method: "GET",
                url: `/reports?${queryParams}`,
            });
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ✅ Slice Definition
const adminSlice = createSlice({
    name: "admin",
    initialState: { policeStations: [], reports: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        handleAsyncThunk(builder, addPoliceStation, "policeStations");
        handleAsyncThunk(builder, getAllPoliceStations, "policeStations");
        handleAsyncThunk(builder, fetchAdminReports, "reports");
    },
});

export default adminSlice.reducer;
