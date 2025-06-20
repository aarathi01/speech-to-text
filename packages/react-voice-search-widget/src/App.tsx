import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import VoiceInput from "./components/VoiceInput";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import "react-toastify/dist/ReactToastify.css";
import { IdleTimerProvider } from "react-idle-timer";
import { ToastContainer } from "react-toastify";
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
      <>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
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
      </>
    </IdleTimerProvider>
  );
};

export default App;
