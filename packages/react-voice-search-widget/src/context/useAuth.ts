import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Creates a custom React hook called useAuth.
// This hook gives you direct access to the user, setUser, and loading values from anywhere in the app.

export const useAuth = () => useContext(AuthContext);
