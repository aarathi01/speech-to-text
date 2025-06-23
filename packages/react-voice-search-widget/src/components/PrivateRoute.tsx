import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type PrivateRouteProps = {
  children: React.ReactNode;
  role?: ("user" | "admin" | "superadmin")[];
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const { user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && !role.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
