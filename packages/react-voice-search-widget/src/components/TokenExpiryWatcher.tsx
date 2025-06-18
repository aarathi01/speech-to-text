import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenExpiry";

const TokenExpiryWatcher: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");

      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [navigate]);

  return null;
};

export default TokenExpiryWatcher;
