import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoiceInput from "./components/VoiceInput";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <VoiceInput />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
