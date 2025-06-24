import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const RedirectDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "superadmin") {
      navigate("/admin");
    } else if (user?.role === "user") {
      navigate("/voice");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null;
};

export default RedirectDashboard;
