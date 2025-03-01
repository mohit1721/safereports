import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://safereports.onrender.com/api";
  //  || "http://localhost:5000/api" .....
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, { withCredentials: true ,
        headers: { "Content-Type": "application/json" },

    });

    if (response.data.success) {
      // Store token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return { success: true, user: response.data.user };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.error || "Login failed" };
  }
};
