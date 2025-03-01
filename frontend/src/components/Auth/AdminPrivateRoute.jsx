import React from "react";
import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  // ✅ LocalStorage se user data parse karo
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("logged user in local storage", user)
  // ✅ Agar user authenticated hai aur role "ADMIN" hai toh access do
  if (user && user.role === "ADMIN") return children;
  
  // ❌ Otherwise, redirect to login
  return <Navigate to="/login" />;
};

export default AdminPrivateRoute;
