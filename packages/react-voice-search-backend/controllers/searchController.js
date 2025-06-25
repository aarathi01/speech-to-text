import { runSearch } from "../services/searchEngineService.js";

export const searchHandler = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ error: "Query 'q' is required" });

    const results = await runSearch(query);
    res.json({ results });
  } catch (err) {
    next(err);
  }
};
