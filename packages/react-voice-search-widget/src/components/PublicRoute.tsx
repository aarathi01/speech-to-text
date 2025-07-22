import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type PublicRouteProps = {
  children: JSX.Element;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  // - Ensures no redirects or render logic until the `user` is fully loaded.
  // - Prevents race conditions and flickering during auth status check.
  if (loading) return null;

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Checks if the user is considered "logged in" using the flag in localStorage.

  // If the user is logged in, redirect them to `/voice`.
  // If not logged in, render the public page (e.g., `<Login />` or `<Register />`).
  // This ensures that logged-in users can’t see or revisit login/register pages.

  return isAuthenticated && user ? (
    <Navigate to="/voice" replace />
  ) : (
    <>{children}</>
  );
};

export default PublicRoute;
