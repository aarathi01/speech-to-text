import { useEffect, useState } from "react";
import { getSearchHistory } from "../services/historyService";
import { HistoryEntry } from "../types/types";


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
  return { history };
};
