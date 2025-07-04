import { useEffect, useState } from "react";
import { HistoryEntry } from "../types/types";
import {
  getSearchHistory,
  deleteOwnSearchEntry,
} from "../services/historyService";

export const useSearchHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSearchHistory();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history", err);
      }
    };
    fetchHistory();
  }, []);

  const deleteSearch = async (historyId: string) => {
    try {
      await deleteOwnSearchEntry(historyId);
      setHistory((prev) => prev.filter((item) => item._id !== historyId));
    } catch (err) {
      console.error("Error deleting history entry", err);
    }
  };

  return { history, deleteSearch, deleteOwnSearchEntry };
};
