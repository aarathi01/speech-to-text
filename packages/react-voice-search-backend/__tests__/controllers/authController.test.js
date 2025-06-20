import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import * as authController from "../../controllers/authController.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Setup express app
const app = express();
app.use(bodyParser.json());
app.post("/api/auth/login", authController.login);
app.post("/api/auth/register", authController.register);

// Mocks
jest.mock("../../models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockToken = "mocked-token";

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
     jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("POST /api/auth/register", () => {
    it("should register user successfully", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-pass");
      User.create.mockResolvedValue({ _id: "user123" });
      jwt.sign.mockReturnValue(mockToken);

      const res = await request(app).post("/api/auth/register").send({
        email: "testuser@gmail.com",
        password: "testpass",
        username: "testuser",
        phone: "1234567890",
        country: "India",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Registered and logged in successfully");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 409 if email already exists", async () => {
      User.findOne.mockResolvedValue({ email: "testuser@gmail.com" });

      const res = await request(app).post("/api/auth/register").send({
        email: "testuser@gmail.com",
        password: "testpass",
        username: "testuser",
        phone: "1234567890",
        country: "India",
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe("Email already exists!");
    });

    it("should handle registration errors", async () => {
      User.findOne.mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/api/auth/register").send({
        email: "fail@gmail.com",
        password: "pass",
        username: "failuser",
        phone: "000",
        country: "Nowhere",
      });

      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      User.findOne.mockResolvedValue({ _id: "user123", password: "hashedpass" });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const res = await request(app).post("/api/auth/login").send({
        email: "testuser@gmail.com",
        password: "testpass",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should fail login on invalid password", async () => {
      User.findOne.mockResolvedValue({ _id: "user123", password: "hashedpass" });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post("/api/auth/login").send({
        email: "testuser@gmail.com",
        password: "wrongpass",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should fail login when user not found", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        email: "nouser@gmail.com",
        password: "testpass",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should handle login errors", async () => {
      User.findOne.mockRejectedValue(new Error("DB down"));

      const res = await request(app).post("/api/auth/login").send({
        email: "fail@gmail.com",
        password: "test",
      });

      expect(res.status).toBe(500);
    });
  });
});
