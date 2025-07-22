import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { PrivateRouteProps } from "../types/userTypes";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Prevent premature redirect until auth data is fully loaded, avoids flickering or incorrect redirects

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Simple boolean check to see if user is logged in. This flag is usually set in authService on login

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If role prop is given (e.g., ["admin"]) and the user’s role is not included, redirect them to homepage (/)
  if (role && !role.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected component/page
  return <>{children}</>;
};

export default PrivateRoute;
