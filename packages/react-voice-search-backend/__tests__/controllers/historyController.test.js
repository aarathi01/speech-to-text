import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as historyController from "../../controllers/historyController.js";
import SearchHistory from "../../models/SearchHistory.js";

jest.mock("../../models/SearchHistory.js");

let server;
const PORT = 5556; // use a different test port
const baseURL = `http://localhost:${PORT}`;

// Set up express app
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Fake auth middleware
app.use((req, res, next) => {
  req.user = { id: "mock-user-id" };
  next();
});

// Routes
app.post("/history", historyController.saveSearchQuery);
app.get("/history", historyController.getSearchHistory);

describe("History Controller (Full Server)", () => {
  beforeAll((done) => {
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("POST /history", () => {
    it("should return 400 if query or response is missing", async () => {
      const res = await request(baseURL).post("/history").send({ query: "test" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Missing query or response");
    });

    it("should save history and return 201", async () => {
      const mockResponse = [
        { title: "Result 1", score: 0.9, matchedWords: ["test"], id: "abc123" },
        { title: "Result 2", score: 0.8, matchedWords: ["test2"], id: "def456" },
      ];

      const expectedSaved = {
        _id: "history123",
        userId: "mock-user-id",
        query: "test query",
        response: [
          { title: "Result 1", score: 0.9 },
          { title: "Result 2", score: 0.8 },
        ],
      };

      SearchHistory.create.mockResolvedValue(expectedSaved);

      const res = await request(baseURL).post("/history").send({
        query: "test query",
        response: mockResponse,
      });

      expect(res.status).toBe(201);
      expect(res.body.query).toBe("test query");
      expect(SearchHistory.create).toHaveBeenCalledWith({
        userId: "mock-user-id",
        query: "test query",
        response: expectedSaved.response,
      });
    });

    it("should return 500 on DB error", async () => {
      SearchHistory.create.mockRejectedValue(new Error("DB error"));

      const res = await request(baseURL).post("/history").send({
        query: "test",
        response: [{ title: "Res", score: 1 }],
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal Server Error");
    });
  });

  describe("GET /history", () => {
    it("should return search history list", async () => {
      const mockHistory = [
        { _id: "1", query: "test1", response: [], timestamp: "2025-06-20T06:43:17.083Z" },
        { _id: "2", query: "test2", response: [], timestamp: "2025-06-20T06:43:17.083Z" },
      ];

      SearchHistory.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockHistory),
      });

      const res = await request(baseURL).get("/history");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockHistory);
      expect(SearchHistory.find).toHaveBeenCalledWith({ userId: "mock-user-id" });
    });

    it("should return 500 on fetch error", async () => {
      SearchHistory.find.mockImplementation(() => ({
        sort: () => ({
          limit: () => Promise.reject(new Error("DB fetch error")),
        }),
      }));

      const res = await request(baseURL).get("/history");
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to fetch history");
    });
  });
});
