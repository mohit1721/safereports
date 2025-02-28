import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PolicePrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // ✅ Agar user authenticated hai aur police role ka hai toh access de
  if (user && user.role === "POLICESTATION") return children;
  
  // ❌ Otherwise, redirect to login
  return <Navigate to="/login" />;
};

export default PolicePrivateRoute;
