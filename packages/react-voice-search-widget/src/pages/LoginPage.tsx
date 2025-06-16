import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { login } from "../services/authService";
import { validateField } from "../utils/validators";
import { showError, showSuccess } from "../utils/errorHandler";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateInputs = (): boolean => {
    if (!email || !password) {
      showError("Email and password are required.");
      return false;
    }

    const emailError = validateField("email", email);
    if (emailError) {
      showError(emailError);
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.data.token);
      showSuccess("Login successful");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.userTextArea}>
            <input
              className={styles.inputField}
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={styles.button} type="submit">
            Sign-In
          </button>
        </form>
        <p className={styles.toggle} onClick={() => navigate("/register")}>
          Don’t have an account? Register
        </p>
      </div>
    </div>
  );
};

export default Login;
