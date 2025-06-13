import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RegisterPage.module.css";
import config from "../config/apiConfig";
import { validateField } from "../utils/validators";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const BASE_URL = config.BASE_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate as user types
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        username: formData.name,
        email: formData.email,
        country: formData.country,
        phone: formData.phone,
        password: formData.password,
      };

      await axios.post(`${BASE_URL}/auth/register`, payload);
      alert("Registered successfully! Please login using your email.");
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        (err instanceof Error ? err.message : "Registration failed");
      alert(`Registration Failed: ${errorMsg}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Register</h2>
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

        <button className={styles.button} onClick={handleSubmit}>
          Sign-Up
        </button>
        <p className={styles.toggle} onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
