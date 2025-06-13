import { searchInDB } from "../utils/db.js";

function extractWords(text) {
  if (typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(/\s+/) // split into words
    .filter((word) => word.length >= 3);
}

export const searchHandler = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ error: "Query 'q' is required" });

    const queryWords = extractWords(query);
    if (!queryWords.length) return res.json({ results: [] });

    const results = await searchInDB(queryWords);
    const highlighted = results.map((doc) => ({
      id: doc.id,
      name: doc.name,
      category: doc.category,
      matchedWords: queryWords,
    }));

    res.json({ results: highlighted });
  } catch (err) {
    next(err);
  }
};
