import dotenv from "dotenv";
import fs from "fs";

jest.mock("fs");
jest.mock("dotenv");

describe("config.js", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Reset the module registry to reload config
    process.env = { ...ORIGINAL_ENV }; // Clone original env
    dotenv.config.mockClear();
    fs.existsSync.mockClear();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV; // Restore env
  });

  it("logs a warning if env file does not exist", () => {
    process.env.NODE_ENV = "prod";
    fs.existsSync.mockReturnValue(false);

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    jest.isolateModules(() => {
      require("../../utils/config.js");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Env file prod.env not found. Using default .env values"
    );
    consoleSpy.mockRestore();
  });

  it("exports environment variables correctly", () => {
    process.env.BASE_URL = "http://localhost";
    process.env.SAMPLE_RATE = "16000";
    process.env.JWT_SECRET = "secret";
    process.env.MONGODB_URI = "mongodb://localhost";
    process.env.PORT = "3000";

    jest.isolateModules(() => {
      const cfg = require("../../utils/config.js");

      expect(cfg.BASE_URL).toBe("http://localhost");
      expect(cfg.SAMPLE_RATE).toBe("16000");
      expect(cfg.JWT_SECRET).toBe("secret");
      expect(cfg.MONGODB_URI).toBe("mongodb://localhost");
      expect(cfg.PORT).toBe("3000");
    });
  });
});
