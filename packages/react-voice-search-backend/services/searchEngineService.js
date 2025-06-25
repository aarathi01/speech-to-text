import { searchInDB } from "../utils/db.js";

export function extractWords(text) {
  if (typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(/\s+/) // split into words
    .filter((word) => word.length >= 3);
}

export const runSearch = async (query) => {
  const queryWords = extractWords(query);

  if (!queryWords.length) return [];

  const results = await searchInDB(queryWords);

  return results.map((doc) => ({
    id: doc.id,
    name: doc.name,
    category: doc.category,
    matchedWords: queryWords,
  }));
};
