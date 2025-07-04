import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import { register } from "../services/authService";
import { validateField } from "../utils/validators";
import { showError, showSuccess } from "../utils/errorHandler";
import { useAuth } from "../context/useAuth";

const RegisterPage: React.FC = () => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    password: "",
    phone: "",
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

      const userData = await register(payload);
      if (!userData || !userData.role) {
        showError("Registration succeeded, but failed to retrieve user info.");
        return;
      }

      setUser(userData);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      showSuccess("Registration successful! You are now logged in.");
      navigate("/voice");
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

          <button
            aria-label="Submit action"
            className={styles.button}
            type="submit"
          >
            Sign-Up
          </button>
        </form>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
