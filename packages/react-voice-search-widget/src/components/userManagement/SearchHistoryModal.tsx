import React, { useEffect, useState } from "react";
import {
  getUserSearchHistory,
  deleteUserSearchEntry,
} from "../../services/historyService";
import styles from "./SearchHistoryModal.module.css";

interface Props {
  userId: string;
  onClose: () => void;
}

const SearchHistoryModal: React.FC<Props> = ({ userId, onClose }) => {
  const [history, setHistory] = useState([]);

  const handleDelete = async (historyId: string) => {
    try {
      await deleteUserSearchEntry(userId, historyId);
      setHistory((prev) => prev.filter((entry) => entry._id !== historyId));
    } catch {
      alert("Failed to delete entry");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserSearchHistory(userId);
        setHistory(res.data);
      } catch (err) {
        console.log(err);
        console.error("Failed to fetch history");
      }
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Search History</h3>
        <div className={styles.scrollContainer}>
          {history.length === 0 ? (
            <p>No history found</p>
          ) : (
            history.map((entry) => (
              <div key={entry._id} className={styles.historyItem}>
                <div>
                  <div>
                    <strong>Query:</strong> {entry.query}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <button
                    aria-label="Delete action"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(entry._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          aria-label="Close action"
          className={styles.closeButton}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchHistoryModal;
