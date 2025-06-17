import SearchHistory from "../models/SearchHistory.js";

export const saveSearchQuery = async (req, res) => {
  const { query, response } = req.body;
  console.log(".............");
  console.log(response);
  const userId = req.user.id;

  if (!query || !response) {
    return res.status(400).json({ error: "Missing query or response" });
  }

  try {
    const filteredResponse = response.map((item) => {
      const { id, matchedWords, ...rest } = item;
      return rest;
    });
    const saved = await SearchHistory.create({
      userId,
      query,
      response: filteredResponse,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving search history", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSearchHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const history = await SearchHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
