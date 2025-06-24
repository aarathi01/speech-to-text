import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./AuthContext";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const isAuthenticated =
          localStorage.getItem("isAuthenticated") === "true";
        const storedUser = localStorage.getItem("user");

        if (!isAuthenticated || !storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user", err);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
