import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import reportReducer from "./slices/reportSlice";
import policeStationReducer from "./slices/policeStationSlice";
import adminReducer from "./slices/adminSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
    policeStations: policeStationReducer,
    admin: adminReducer
  },
});

export default store;
