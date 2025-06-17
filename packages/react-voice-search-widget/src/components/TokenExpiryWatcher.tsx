import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenExpiry"; 

const TokenExpiryWatcher: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  });

  return null; 
};

export default TokenExpiryWatcher;
