import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import * as searchController from "../../controllers/searchController.js";
import { searchInDB } from "../../utils/db.js";

jest.mock("../../utils/db.js");

const app = express();
app.use(bodyParser.json());
app.get("/search", searchController.searchHandler);

describe("Search Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if query is missing", async () => {
    const res = await request(app).get("/search");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Query 'q' is required");
  });

  it("should return empty array if query has no valid words", async () => {
    const res = await request(app).get("/search?q=to an it is!");
    expect(res.status).toBe(200);
    expect(res.body.results).toEqual([]);
  });

  it("should return search results with highlighted words", async () => {
    const mockResults = [
      { id: 1, name: "Sample One", category: "Books" },
      { id: 2, name: "Sample Two", category: "Articles" },
    ];

    searchInDB.mockResolvedValue(mockResults);

    const res = await request(app).get("/search?q=Sample test");

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBe(2);
    expect(res.body.results[0]).toMatchObject({
      id: 1,
      name: "Sample One",
      category: "Books",
      matchedWords: ["sample", "test"],
    });

    expect(searchInDB).toHaveBeenCalledWith(["sample", "test"]);
  });

  it("should handle DB errors gracefully", async () => {
    searchInDB.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/search?q=test");

    expect(res.status).toBe(500);
  });
});
