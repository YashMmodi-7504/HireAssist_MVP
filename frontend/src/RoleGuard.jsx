import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ role, children }) {
  const currentRole = localStorage.getItem("role");

  if (!currentRole) {
    return <Navigate to="/roles" replace />;
  }

  if (currentRole !== role) {
    return <Navigate to={`/${currentRole}`} replace />;
  }

  return children;
}
