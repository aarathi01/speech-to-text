import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

export default PublicRoute;
