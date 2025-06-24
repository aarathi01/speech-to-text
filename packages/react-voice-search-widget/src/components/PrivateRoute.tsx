import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { PrivateRouteProps } from "../types/userTypes";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, loading  } = useAuth();

  if (loading) return null; //Prevent redirect until loaded

   const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";


  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && !role.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
