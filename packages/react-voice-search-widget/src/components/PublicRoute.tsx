import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type PublicRouteProps = {
  children: JSX.Element;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated && user ? (
    <Navigate to="/voice" replace />
  ) : (
    <>{children}</>
  );
};

export default PublicRoute;
