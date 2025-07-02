import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";
import { useAuth } from "../context/useAuth";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    _id: "",
    role: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    setCurrentUser({
      _id: user?._id || "",
      role: user?.role || "",
      email: user?.email || "",
      username: user?.username || "",
    });
  }, [user]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.userInfoBlock}>
        <div className={styles.profilePic}>{/* todo: add profile pic */}</div>
        <div className={styles.userText}>
          <strong>{currentUser.username}</strong>
          <span>{currentUser.email}</span>
        </div>
      </div>

      <ul className={styles.menu}>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li
          onClick={() => {
            if (user?.role === "admin" || user?.role === "superadmin") {
              navigate("/admin-voice");
            } else {
              navigate("/voice");
            }
          }}
        >
          Voice Search
        </li>
        <li onClick={() => navigate("/admin")}>User Management</li>
      </ul>
    </div>
  );
};

export default Sidebar;
