import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./LoginPage.module.css";
import config from "../config/apiConfig";

const Login: React.FC = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const BASE_URL = config.BASE_URL;

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      const errorMsg = err?.response?.data?.error || "Login failed";
      alert(`Login Failed: ${errorMsg}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.userTextArea}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.inputField}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         </div>
        <button className={styles.button} onClick={handleLogin}>
          Sign-In
        </button>
        <p className={styles.toggle} onClick={() => navigate("/register")}>
          Don’t have an account? Register
        </p>       
      </div>
    </div>
  );
};

export default Login;
