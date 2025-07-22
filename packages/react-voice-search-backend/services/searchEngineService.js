import { searchInDB } from "../utils/db.js";

// Accepts a string like "Find nearby restaurants!"
// To clean the raw user input by lowercasing it, removing punctuation, splitting it into words, and ignoring trivial words with less than 3 characters.
export function extractWords(text) {
  if (typeof text !== "string") return [];
  return text
    .toLowerCase() //Converts to lowercase
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(/\s+/) // split into words
    .filter((word) => word.length >= 3); // Filters out short words (like is, a, at). Short words like “in”, “on”, “a” often appear frequently and don’t help refine results. Removing them improves search accuracy and performance.
}

export const runSearch = async (query) => {
  const queryWords = extractWords(query); // Extracts clean words from the user query
  if (!queryWords.length) return []; // If no valid words, returns empty array

  const results = await searchInDB(queryWords); //a custom DB search utility

  // Transforms the result docs into a consistent structure
  return results.map((doc) => ({
    id: doc.id,
    name: doc.name,
    category: doc.category,
    matchedWords: queryWords, // To indicate which keywords were used for matching — this can be helpful for highlighting results or debugging search behavior.
  }));
};
