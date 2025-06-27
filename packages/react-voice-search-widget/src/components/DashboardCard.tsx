import React from "react";
import styles from "./Dashboard.module.css";

interface Props {
  title: string;
  value: number | string;
  onClick?: () => void;
}

const DashboardCard: React.FC<Props> = ({ title, value, onClick }) => (
  <div className={styles.card} onClick={onClick}>
    <div className={styles.value}>{value}</div>
    <div className={styles.title}>{title}</div>
    <div className={styles.link}>More info &rarr;</div>
  </div>
);

export default DashboardCard;
