import React, { useEffect, useState } from "react";
import { AuthContextType } from "./AuthContext";
import { AuthContext } from "./AuthContext";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null); // Stores the authenticated user (`null` by default).
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const isAuthenticated =
          localStorage.getItem("isAuthenticated") === "true"; // Reads from localStorage to check if a user session exists.
        const storedUser = localStorage.getItem("user");

        // If no user info or the auth flag is missing → skip login state.
        if (!isAuthenticated || !storedUser) {
          setLoading(false); // Ends the loading state immediately.
          return;
        }

        const parsedUser = JSON.parse(storedUser); // Converts the user JSON string into an object.
        setUser(parsedUser); // Saves it in user state so the rest of the app can use it.
      } catch (err) {
        // Handles corrupted or invalid JSON in localStorage
        console.error("Failed to parse user", err);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        // Cleans up invalid session state.
        setUser(null);
      } finally {
        setLoading(false); // Ensures loading is set to false regardless of success/failure. Prevents the app from staying in a blocked state.
      }
    };

    initUser();
  }, []);

  if (loading) return null; // Avoid rendering the app until auth state is fully known. Prevents access or redirection glitches.

  // Makes user, setUser, and loading available to any component inside the app (via useAuth() hook).
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
