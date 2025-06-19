import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies
});

// Use a consistent toast ID to prevent duplicates
const TOAST_ID = "global-toast";

const showToast = (message: string) => {
  if (!toast.isActive(TOAST_ID)) {
    toast.error(message, { toastId: TOAST_ID });
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    switch (status) {
      case 400:
        showToast(message || "Bad request");
        break;
      case 401:
        showToast("Unauthorized. Please log in again.");
        localStorage.removeItem("isAuthenticated");
        window.location.href = "/login";
        break;
      case 403:
        showToast("Access denied.");
        break;
      case 404:
        showToast("Resource not found.");
        break;
      case 409:
        showToast("Email already exists!");
        break;
      case 500:
        showToast("Internal Server Error.");
        break;
      default:
        showToast(message);
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
