import React, { useRef, useState, useEffect } from "react";
import styles from "./UserActionDropdown.module.css";

interface Props {
  onPromote?: () => void;
  onHistory: () => void;
  onBlockToggle: () => void;
  onDelete: () => void;
  role: string;
  targetUserRole: string; 
  isBlocked: boolean;
  isCurrentUser: boolean;
  canPromote: boolean;
}

const UserActionDropdown: React.FC<Props> = ({
  onPromote,
  onHistory,
  onBlockToggle,
  onDelete,
  role,
  targetUserRole,
  isBlocked,
  isCurrentUser,
  canPromote,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    const handlePosition = () => {
      const rect = dropdownRef.current?.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 130; // approx height of the dropdown
      if (rect && rect.bottom + dropdownHeight > viewportHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    };

    handlePosition();
    window.addEventListener("resize", handlePosition);
    return () => window.removeEventListener("resize", handlePosition);
  }, []);

  const isActionDisabled = targetUserRole === "superadmin" || isCurrentUser;

  return (
    <div
      className={`${styles.dropdown} ${openUpward ? styles.openUp : ""}`}
      ref={dropdownRef}
    >
      <button className={styles.dropbtn}>⋮</button>
      <div className={styles.dropdownContent}>
        <button onClick={onHistory}>View History</button>

        {(role === "admin" || role === "superadmin") && (
          <>
            <button onClick={onBlockToggle} disabled={isActionDisabled}>
              {isBlocked ? "Unblock" : "Block"}
            </button>
            <button onClick={onDelete} disabled={isActionDisabled}>
              Delete
            </button>
          </>
        )}

        {canPromote && onPromote && (
          <button onClick={onPromote}>Promote to Admin</button>
        )}
      </div>
    </div>
  );
};

export default UserActionDropdown;
