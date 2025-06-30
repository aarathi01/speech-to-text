import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    _id: "",
    role: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser({
      _id: userInfo?._id || "",
      role: userInfo?.role || "",
      email: userInfo?.email || "",
      username: userInfo?.username || "",
    });
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.userInfoBlock}>
        <div className={styles.profilePic}>
          {/* todo: add profile pic */}
        </div>
        <div className={styles.userText}>
          <strong>{currentUser.username}</strong>
          <span>{currentUser.email}</span>
        </div>
      </div>

      <ul className={styles.menu}>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li
          onClick={() => {
            const role = JSON.parse(localStorage.getItem("user") || "{}")?.role;
            if (role === "admin" || role === "superadmin") {
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
