import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import LogoutIcon from "../assets/logout.svg";
import styles from "../components/Dashboard.module.css";
import { getDashboardStats } from "../services/dashboardService";
import { logout } from "../services/authService";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    totalSearches: 0,
    adminCount: 0,
    superadminCount: 0,
    recentQueries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.headerRow}>
          <div className="icon-with-tooltip">
            <img
              className="logout-icon"
              src={LogoutIcon}
              alt="Logout"
              onClick={logout}
            />
            <span className="tooltip-text-bottom">Logout</span>
          </div>
        </div>

        <h2 className={styles.heading}>Dashboard</h2>
        <div className={styles.grid}>
          <DashboardCard
            title="Total Users"
            value={stats.totalUsers}
            infoText="All registered users including active and blocked."
          />
          <DashboardCard
            title="Blocked Users"
            value={stats.blockedUsers}
            infoText="Users who are restricted from logging in."
          />
          <DashboardCard
            title="Search History"
            value={stats.totalSearches}
            infoText="Total number of voice search queries made."
          />
          <DashboardCard
            title="Superadmins"
            value={stats.superadminCount}
            infoText="Users with full system privileges."
          />
          <DashboardCard
            title="Admins"
            value={stats.adminCount}
            infoText="Users with admin rights excluding role promotions."
          />
          <DashboardCard
            title="Recent Queries"
            value={stats.recentQueries}
            infoText="Count of searches made in the last 24 hours."
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
