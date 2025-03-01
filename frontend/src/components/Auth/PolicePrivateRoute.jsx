import React from "react";
 import { Navigate } from "react-router-dom";

const PolicePrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Agar user authenticated hai aur police role ka hai toh access de
  if (user && user.role === "POLICESTATION") return children;
  
  // ❌ Otherwise, redirect to login
  return <Navigate to="/login" />;
};

export default PolicePrivateRoute;
