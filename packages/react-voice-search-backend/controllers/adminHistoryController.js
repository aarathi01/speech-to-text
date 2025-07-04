import SearchHistory from "../models/SearchHistory.js";

export const getUserSearchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await SearchHistory.find({ userId: id }).sort({
      timestamp: -1,
    });
    res.json(history);
  } catch (err) {
    console.error("Error inside getUserSearchHistory : ", err);
    res.status(500).json({ message: "Failed to fetch search history" });
  }
};

export const deleteSearchHistoryEntry = async (req, res) => {
  try {
    const { historyId } = req.params;
    await SearchHistory.findByIdAndDelete(historyId);
    res.json({ message: "Entry deleted" });
  } catch (err) {
    console.error("Error inside deleteSearchHistoryEntry : ", err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
};
