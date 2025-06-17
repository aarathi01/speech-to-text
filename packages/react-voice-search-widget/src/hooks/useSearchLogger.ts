import { useCallback } from "react";
import { saveSearchHistory } from "../services/historyService";
import { Result } from "../types/types";

export const useSaveSearch = () => {
  const saveSearch = useCallback(async (query: string, response: Result[]) => {
    if (!query) return;
    try {
      await saveSearchHistory({ query, response });
    } catch (err) {
      console.error("Failed to save search log", err);
    }
  }, []);

  return { saveSearch };
};
