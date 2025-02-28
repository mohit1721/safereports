import axios from "axios";

// ✅ AXIOS INSTANCE (Reusable for Frontend-Backend Connection)
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Default API URL
    timeout: 10000, // 10s timeout
    headers: { "Content-Type": "application/json" },
});

// ✅ API CONNECTOR FUNCTION
export const apiconnector = async ({ method, url, data = null, headers = {}, params = {} }) => {
    try {
        const response = await axiosInstance({
            method,
            url,
            data,
            headers,
            params
        });
        return response.data; // ✅ Returning only the relevant data
    } catch (error) {
        console.error("API Request Error:", error?.response?.data || error.message);
        throw error?.response?.data || { success: false, message: "Something went wrong!" };
    }
};
