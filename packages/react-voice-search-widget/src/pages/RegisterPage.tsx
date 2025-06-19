import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import { validateField } from "../utils/validators";
import { register } from "../services/authService";
import { showError, showSuccess } from "../utils/errorHandler";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    password: "",
    phone: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate as user types
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateInputs = (): boolean => {
    const { name, email, password, country, phone } = formData;
    if (!name || !email || !password || !country || !phone) {
      showError("All fields are required.");
      return false;
    }
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const payload = {
        username: formData.name,
        email: formData.email,
        country: formData.country,
        phone: formData.phone,
        password: formData.password,
      };

      await register(payload);

      // Set auth flag to allow navigation to protected routes
      localStorage.setItem("isAuthenticated", "true");

      showSuccess("Registration successful! You are now logged in.");
      navigate("/");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        (err instanceof Error
          ? err.message
          : "Registration failed. Please try again.");
      showError(errorMsg);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.userTextArea}>
            {["name", "email", "country", "phone", "password"].map((field) => (
              <div key={field}>
                <input
                  className={styles.inputField}
                  type={field === "password" ? "password" : "text"}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                />
                {errors[field] && (
                  <div className={styles.error}>{errors[field]}</div>
                )}
              </div>
            ))}
          </div>

          <button className={styles.button} type="submit">
            Sign-Up
          </button>
        </form>
        <p className={styles.toggle} onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
