import React, { useState, useRef, useEffect } from "react";
import styles from "./DashboardCard.module.css";
import { DashboardCardProps } from "../types/types";

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, infoText }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTooltip]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>

      <div className={styles.link} onClick={() => setShowTooltip((prev) => !prev)}>
        More info →
      </div>

      {showTooltip && (
        <div className={styles.tooltip} ref={tooltipRef}>
          {infoText || "No additional information available."}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
