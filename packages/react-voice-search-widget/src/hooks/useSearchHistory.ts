import { useEffect, useState } from "react";
import { HistoryEntry } from "../types/types";
import {
  getSearchHistory,
  deleteOwnSearchEntry,
} from "../services/historyService";

// Fetches search history entries for the current user
export const useSearchHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]); // Initializes an empty history array

  useEffect(() => {
    // Fetches the user's search history once, on initial mount, It uses an async IIFE pattern (because useEffect itself can’t be async)
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

  // Provides a method to delete individual entries
  const deleteSearch = async (historyId: string) => {
    try {
      await deleteOwnSearchEntry(historyId); // Sends a DELETE request to remove a search item
      setHistory((prev) => prev.filter((item) => item._id !== historyId)); // Then updates the local history state to reflect the change (without refetching)
    } catch (err) {
      console.error("Error deleting history entry", err);
    }
  };

  // history: the data to display
  return { history, deleteSearch, deleteOwnSearchEntry };
};
