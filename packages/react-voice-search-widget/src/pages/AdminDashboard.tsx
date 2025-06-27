import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import styles from "../components/Dashboard.module.css";
import { getDashboardStats } from "../services/dashboardService";

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
    <div className={styles.wrapper}>
      <Sidebar />

      <div className={styles.content}>
        <h2 className={styles.heading}>Dashboard</h2>
        <div className={styles.grid}>
          <DashboardCard title="Total Users" value={stats.totalUsers} />
          <DashboardCard title="Blocked Users" value={stats.blockedUsers} />
          <DashboardCard title="Search History" value={stats.totalSearches} />
          <DashboardCard title="Superadmins" value={stats.superadminCount} />
          <DashboardCard title="Admins" value={stats.adminCount} />
          <DashboardCard title="Recent Queries" value={stats.recentQueries} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
