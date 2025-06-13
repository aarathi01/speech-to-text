import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    // User is already logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
