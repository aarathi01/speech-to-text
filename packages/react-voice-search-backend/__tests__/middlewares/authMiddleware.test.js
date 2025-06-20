import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { authMiddleware } from "../../middlewares/authMiddleware.js";

// Mock JWT secret and methods
jest.mock("jsonwebtoken");

const app = express();
app.use(cookieParser());
app.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
});

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 if no token is present", async () => {
    const res = await request(app).get("/protected");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized. Token missing." });
  });

  it("returns 401 for invalid token", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=invalid");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid or expired token" });
    expect(jwt.verify).toHaveBeenCalledWith("invalid", expect.any(String));
  });

  it("allows access for valid token", async () => {
    const mockUser = { id: "user123" };
    jwt.verify.mockReturnValue(mockUser);

    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=validtoken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Access granted", user: mockUser });
    expect(jwt.verify).toHaveBeenCalledWith("validtoken", expect.any(String));
  });
});
