import { useEffect, useState } from "react";
import { Result } from "../types/types";
import { searchText } from "../services/searchService";

export const useSearch = (query: string) => {
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      try {
        const response = await searchText(query);
        const data = response.data;
        if (!data.results?.length) {
          setError("No results found");
          setSearchResults([]);
        } else {
          setSearchResults(data.results);
        }
      } catch (err) {
        const errorMsg =
          err?.response?.data?.error ||
          (err instanceof Error ? err.message : "Search failed.");
        setError(errorMsg || "Search failed");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetch, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  return { searchResults, loading, error };
};
