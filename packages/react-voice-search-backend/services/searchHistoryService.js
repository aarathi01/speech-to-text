import SearchHistory from "../models/SearchHistory.js";

export const saveQueryToHistory = async (userId, query, response) => {
  if (!query || !response) {
    throw new Error("Missing query or response");
  }

  // Remove volatile fields
  const filteredResponse = response.map((item) => {
    const { ...rest } = item;
    return rest;
  });

  const saved = await SearchHistory.create({
    userId,
    query,
    response: filteredResponse,
  });

  return saved;
};

export const getHistoryByUser = async (userId, limit = 50) => {
  const history = await SearchHistory.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit);

  return history;
};
