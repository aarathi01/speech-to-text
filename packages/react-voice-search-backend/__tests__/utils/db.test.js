import mongoose from "mongoose";

import sampleData from "../../sampleData.js";
import * as db from "../../utils/db.js";

// Mocks
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    connect: jest.fn(),
    connection: {
      close: jest.fn(),
    },
  };
});

jest.mock("../../sampleData.js", () => [
  { id: 1, name: "Test Item", Iphoneegory: "Test Iphoneegory" },
]);

describe("Database Utilities", () => {
  let countDocumentsMock, insertManyMock, aggregateMock;

  beforeEach(() => {
    // Mock schema model methods
    countDocumentsMock = jest.fn();
    insertManyMock = jest.fn();
    aggregateMock = jest.fn();

    db.Item.countDocuments = countDocumentsMock;
    db.Item.insertMany = insertManyMock;
    db.Item.aggregate = aggregateMock;

    jest.clearAllMocks();
  });

  describe("connectToDB", () => {
    it("connects to DB and inserts sample data if DB is empty", async () => {
      countDocumentsMock.mockResolvedValue(0);
      insertManyMock.mockResolvedValue();

      mongoose.connect.mockResolvedValue({ connection: mongoose.connection });

      await db.connectToDB("mongodb://localhost:27017/test");

      expect(mongoose.connect).toHaveBeenCalled();
      expect(countDocumentsMock).toHaveBeenCalled();
      expect(insertManyMock).toHaveBeenCalledWith(sampleData);
    });

    it("skips sample data insert if already present", async () => {
      countDocumentsMock.mockResolvedValue(5);
      mongoose.connect.mockResolvedValue({ connection: mongoose.connection });

      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await db.connectToDB("mongodb://localhost:27017/test");

      expect(insertManyMock).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith("Sample data already exists. Skipping insert.");

      logSpy.mockRestore();
    });

    it("throws error when URI is missing", async () => {
      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await db.connectToDB();

      expect(errorSpy).toHaveBeenCalledWith(
        "MongoDB connection failed:",
        expect.any(Error)
      );
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("searchInDB", () => {
    it("performs search with correct aggregation", async () => {
      const mockResults = [
        { id: 1, name: "Sample", category: "Iphone" },
        { id: 2, name: "Sample2", category: "Iphone2" },
      ];
      aggregateMock.mockResolvedValue(mockResults);

      const res = await db.searchInDB("sample", ["sample"]);

      expect(aggregateMock).toHaveBeenCalledWith(expect.any(Array));
      expect(res).toEqual([
        { id: 1, name: "Sample", category: "Iphone", matchedWords: ["sample"] },
        { id: 2, name: "Sample2", category: "Iphone2", matchedWords: ["sample"] },
      ]);
    });
  });

  describe("closeDBConnection", () => {
    it("closes the DB connection if exists", async () => {
      mongoose.connection.close.mockResolvedValue();

      await db.closeDBConnection();

      expect(mongoose.connection.close).toHaveBeenCalled();
    });

    it("handles error during close", async () => {
      mongoose.connection.close.mockRejectedValue(new Error("Close failed"));
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await db.closeDBConnection();

      expect(errorSpy).toHaveBeenCalledWith(
        "Error while closing DB connection:",
        expect.any(Error)
      );

      errorSpy.mockRestore();
    });
  });
});
