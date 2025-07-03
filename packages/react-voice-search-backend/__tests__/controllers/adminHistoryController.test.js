import express from "express";
import request from "supertest";
import SearchHistory from "../../models/SearchHistory.js";
import {
  getUserSearchHistory,
  deleteSearchHistoryEntry,
} from "../../controllers/adminHistoryController.js";

jest.mock("../../models/SearchHistory.js");

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());

  // Route setup using actual controller handlers
  app.get("/admin/history/:id", getUserSearchHistory);
  app.delete("/admin/history/:historyId", deleteSearchHistoryEntry);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Admin Search History Integration", () => {
  describe("GET /admin/history/:id", () => {
    it("should return user's search history", async () => {
      const mockData = [
        { _id: "1", query: "hello" },
        { _id: "2", query: "world" },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockData);
      SearchHistory.find.mockReturnValue({ sort: mockSort });

      const res = await request(app).get("/admin/history/user123");

      expect(SearchHistory.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(mockSort).toHaveBeenCalledWith({ timestamp: -1 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it("should return 500 if fetching fails", async () => {
      SearchHistory.find.mockImplementation(() => {
        throw new Error("DB error");
      });

      const res = await request(app).get("/admin/history/user123");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Failed to fetch search history" });
    });
  });

  describe("DELETE /admin/history/:historyId", () => {
    it("should delete search history entry", async () => {
      SearchHistory.findByIdAndDelete.mockResolvedValue({ _id: "history456" });

      const res = await request(app).delete("/admin/history/history456");

      expect(SearchHistory.findByIdAndDelete).toHaveBeenCalledWith("history456");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Entry deleted" });
    });

    it("should return 500 if delete fails", async () => {
      SearchHistory.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

      const res = await request(app).delete("/admin/history/history456");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Failed to delete entry" });
    });
  });
});
