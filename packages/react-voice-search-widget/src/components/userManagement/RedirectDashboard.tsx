import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const RedirectDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // - Role-based redirection:
    // - `admin`/`superadmin` → `/dashboard`
    // - `user` → `/voice`
    // - anything else or undefined → `/login`
    if (user?.role === "admin" || user?.role === "superadmin") {
      navigate("/dashboard");
    } else if (user?.role === "user") {
      navigate("/voice");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // - This component is not meant to render anything — it just runs logic and redirects.
  // - Returning `null` ensures nothing appears on screen.
  return null;
};

export default RedirectDashboard;
