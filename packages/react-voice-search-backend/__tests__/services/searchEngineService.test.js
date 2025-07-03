import { extractWords, runSearch } from "../../services/searchEngineService.js";
import { searchInDB } from "../../utils/db.js";

jest.mock("../../utils/db.js");

describe("searchLogic service", () => {
  describe("extractWords", () => {
    it("should extract words longer than 2 characters and lowercase them", () => {
      const input = "AI is transforming the world!";
      const result = extractWords(input);
      expect(result).toEqual(["transforming", "the", "world"]);
    });

    it("should remove punctuation", () => {
      const input = "Hello, world! It's a great day.";
      const result = extractWords(input);
      expect(result).toEqual(["hello", "world", "its", "great", "day"]);
    });

    it("should return empty array for non-string", () => {
      expect(extractWords(null)).toEqual([]);
      expect(extractWords(1234)).toEqual([]);
      expect(extractWords(undefined)).toEqual([]);
    });

    it("should return empty array if all words are < 3 chars", () => {
      const input = "it is an ai to be in";
      const result = extractWords(input);
      expect(result).toEqual([]);
    });
  });

  describe("runSearch", () => {
    it("should return empty array if no valid words", async () => {
      const result = await runSearch("on at of");
      expect(result).toEqual([]);
      expect(searchInDB).not.toHaveBeenCalled();
    });

    it("should return formatted results with matchedWords", async () => {
      const mockQuery = "artificial intelligence and robots";
      const mockQueryWords = ["artificial", "intelligence", "and", "robots"];

      const mockDBResults = [
        { id: "1", name: "AI Revolution", category: "Tech" },
        { id: "2", name: "Robotics Future", category: "Science" },
      ];

      searchInDB.mockResolvedValue(mockDBResults);

      const results = await runSearch(mockQuery);

      expect(searchInDB).toHaveBeenCalledWith(mockQueryWords);
      expect(results).toEqual([
        {
          id: "1",
          name: "AI Revolution",
          category: "Tech",
          matchedWords: mockQueryWords,
        },
        {
          id: "2",
          name: "Robotics Future",
          category: "Science",
          matchedWords: mockQueryWords,
        },
      ]);
    });

    it("should throw if searchInDB fails", async () => {
      searchInDB.mockRejectedValue(new Error("DB down"));

      await expect(runSearch("hello world")).rejects.toThrow("DB down");
    });
  });
});
