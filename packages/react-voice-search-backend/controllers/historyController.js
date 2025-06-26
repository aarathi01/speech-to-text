import SearchHistory from "../models/SearchHistory.js";
import {
  saveQueryToHistory,
  getHistoryByUser,
} from "../services/searchHistoryService.js";

export const saveSearchQuery = async (req, res) => {
  const { query, response } = req.body;
  const userId = req.user.id;

  try {
    const saved = await saveQueryToHistory(userId, query, response);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving search history", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

export const getSearchHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await getHistoryByUser(userId);
    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching search history", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const deleteOwnHistoryEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const historyId = req.params.id;
    const history = await SearchHistory.findById(historyId);

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    if (!history.userId || history.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this entry" });
    }

    await SearchHistory.findByIdAndDelete(historyId);
    return res.status(200).json({ message: "History deleted successfully" });
  } catch (error) {
    next(error);
  }
};
