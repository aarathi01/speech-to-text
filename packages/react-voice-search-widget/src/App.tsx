import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import VoiceInput from "./components/VoiceInput";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import UserManagementPanel from "./pages/UserManagementPanel";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { IdleTimerProvider } from "react-idle-timer";
import { ToastContainer } from "react-toastify";
import { logout } from "./services/authService";
import { showError } from "./utils/errorHandler";
import "react-toastify/dist/ReactToastify.css";
import RedirectDashboard from "./components/userManagement/RedirectDashboard";

const App: React.FC = () => {
  const navigate = useNavigate();

  const handleIdle = () => {
    logout();
    showError("Logged out due to inactivity.");
    navigate("/login");
  };

  return (
    <IdleTimerProvider
      timeout={1000 * 60 * 15} // 15 minutes of inactivity
      onIdle={handleIdle}
      crossTab // sync across tabs
    >
      <AuthProvider>
        <Routes>
          {/* Dashboard redirection based on role */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <RedirectDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Panel Route (role-based protection) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role={["admin", "superadmin"]}>
                <UserManagementPanel />
              </PrivateRoute>
            }
          />

          {/* Login */}
          <Route
            path="/voice"
            element={
              <PrivateRoute role={["user"]}>
                <VoiceInput />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          {/* Registration */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </AuthProvider>
    </IdleTimerProvider>
  );
};

export default App;
