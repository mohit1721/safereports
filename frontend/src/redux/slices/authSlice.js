import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiconnector } from "../../services/apiconnector";
import { handleAsyncThunk } from "../handleAsyncThunk";

// ✅ UsadminReducer from "../slices/adminSlice";Police Station Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await apiconnector({
        method: "POST",
        url: "/auth/login",
        data: { email, password },
        withCredentials: true,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Logout Function
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      return await apiconnector({
        method: "POST",
        url: "/auth/logout",
        withCredentials: true,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Auth Slice Definition
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    // ✅ Reusable reducers
    handleAsyncThunk(builder, loginUser, (state, payload) => {
      state.user = payload.user;
    });

    handleAsyncThunk(builder, logoutUser, (state) => {
      state.user = null;
    });
  },
});

export default authSlice.reducer;
