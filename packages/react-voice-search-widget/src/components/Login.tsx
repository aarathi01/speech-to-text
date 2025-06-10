import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
       const errorMsg = err?.response?.data?.error
      || (err instanceof Error ? err.message: "Login failed");
      alert(`Login Failed: ${errorMsg}`);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Registration Successfull.");
    } catch (err) {
        const errorMsg = err?.response?.data?.error
      || (err instanceof Error ? err.message : "Registration failed");
      alert(`Registration Failed: ${errorMsg}`);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <div className="user-text-area">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {isRegistering ? (
        <button onClick={handleRegister}>Register</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      <p className="toggle" onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default Login;
