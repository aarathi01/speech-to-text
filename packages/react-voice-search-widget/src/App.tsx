import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { IdleTimerProvider } from "react-idle-timer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import UserManagementPanel from "./pages/UserManagementPanel";
import AdminDashboard from "./pages/AdminDashboard";
import VoiceInput from "./components/VoiceInput";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import RedirectDashboard from "./components/userManagement/RedirectDashboard";
import AuthProvider from "./context/AuthProvider";
import { logout } from "./services/authService";
import { showError } from "./utils/errorHandler";

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
          {/* Dasboard Panel Route (role-based protection) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role={["admin", "superadmin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* Voice search route*/}
          <Route
            path="/voice"
            element={
              <PrivateRoute role={["user"]}>
                <VoiceInput />
              </PrivateRoute>
            }
          />
          {/* Admin-voice  */}
          <Route
            path="/admin-voice"
            element={
              <PrivateRoute role={["admin", "superadmin"]}>
                <VoiceInput />
              </PrivateRoute>
            }
          />
          {/* Login */}
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
