import { extractWords, highlightText } from "../utils/highlightUtils.js";
import { searchInDB } from "../utils/db.js";

export const searchHandler = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ error: "Query 'q' is required" });

    const queryWords = extractWords(query);
    if (!queryWords.length) return res.json({ results: [] });

    const results = await searchInDB(queryWords);
    const highlighted = results.map((doc) => ({
      id: doc.id,
      name: highlightText(doc.name, queryWords),
      category: highlightText(doc.category, queryWords),
      matchedWords: queryWords,
    }));

    res.json({ results: highlighted });
  } catch (err) {
    next(err);
  }
};
