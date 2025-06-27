import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.title}>Admin</h3>
      <ul className={styles.menu}>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li onClick={() =>{
        navigate("/voice")}}>Voice Search</li>
        <li onClick={() => navigate("/admin")}>User Management</li>
      </ul>
    </div>
  );
};

export default Sidebar;
