import SearchHistory from "../../models/SearchHistory.js";
import {
  saveQueryToHistory,
  getHistoryByUser,
} from "../../services/searchHistoryService.js";

jest.mock("../../models/SearchHistory.js");

describe("searchService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("saveQueryToHistory", () => {
    it("should save search history and return it", async () => {
      const userId = "user123";
      const query = "what is MOBILE";
      const response = [
        { id: "r1", title: "MOBILE Explained", matchedWords: ["MOBILE"], score: 99 },
        { id: "r2", title: "What is MOBILE?", matchedWords: ["MOBILE"], score: 95 },
      ];

      const expectedFiltered = [
        { title: "MOBILE Explained", score: 99 },
        { title: "What is MOBILE?", score: 95 },
      ];

      const mockSaved = { _id: "history123", userId, query, response: expectedFiltered };

      SearchHistory.create.mockResolvedValue(mockSaved);

      const result = await saveQueryToHistory(userId, query, response);

      expect(SearchHistory.create).toHaveBeenCalledWith({
        userId,
        query,
        response: expectedFiltered,
      });

      expect(result).toEqual(mockSaved);
    });

    it("should throw error if query or response missing", async () => {
      await expect(saveQueryToHistory("user1", "", [{}])).rejects.toThrow("Missing query or response");
      await expect(saveQueryToHistory("user1", "query", null)).rejects.toThrow("Missing query or response");
    });
  });

  describe("getHistoryByUser", () => {
    it("should return search history for a user", async () => {
      const userId = "user123";
      const mockHistory = [
        { _id: "1", query: "hello" },
        { _id: "2", query: "world" },
      ];

      const mockLimit = jest.fn().mockResolvedValue(mockHistory);
      const mockSort = jest.fn(() => ({ limit: mockLimit }));
      SearchHistory.find.mockReturnValue({ sort: mockSort });

      const result = await getHistoryByUser(userId, 2);

      expect(SearchHistory.find).toHaveBeenCalledWith({ userId });
      expect(mockSort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(mockLimit).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockHistory);
    });
  });
});
