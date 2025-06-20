import { errorHandler } from "../../middlewares/errorHandler.js";

describe("errorHandler middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("handles generic errors with 500 status", () => {
    const error = new Error("Something went wrong");

    errorHandler(error, req, res, next);

    expect(console.error).toHaveBeenCalledWith("ErrorHandler:", error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });

  it("handles Mongoose ValidationError with 400 status", () => {
    const error = new Error("Invalid input");
    error.name = "ValidationError";

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid input" });
  });

  it("handles UnauthorizedError with 401 status", () => {
    const error = new Error();
    error.name = "UnauthorizedError";

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("handles Mongo duplicate key error (code 11000)", () => {
    const error = { code: 11000 };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Duplicate entry" });
  });

  it("handles custom error with statusCode and message", () => {
    const error = {
      statusCode: 403,
      message: "Forbidden access"
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden access" });
  });
});
