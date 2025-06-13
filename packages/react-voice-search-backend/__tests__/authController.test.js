import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import * as authController from "../controllers/authController.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const app = express();
app.use(bodyParser.json());
app.post("/auth/login", authController.login);
app.post("/auth/register", authController.register);

// Mocks
jest.mock("../models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockToken = "mocked-token";

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("registers a user successfully", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-pass");
      User.create.mockResolvedValue({ _id: "user123" });
      jwt.sign.mockReturnValue(mockToken);

      const res = await request(app).post("/auth/register").send({
        email: "testuser.gmail.com",
        password: "testpass",
        username: "testuser",
        phone: "1234567890",
        country: "India",
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toBe(mockToken);
      expect(User.findOne).toHaveBeenCalledWith({
        email: "testuser@gmail.com",
      });
      expect(User.create).toHaveBeenCalled();
    });

    it("fails if email is missing", async () => {
      const res = await request(app).post("/auth/register").send({
        password: "testpass",
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Username cant be empty!");
    });

    it("fails if email already exists", async () => {
      User.findOne.mockResolvedValue({ email: "testuser@gmail.com" });

      const res = await request(app).post("/auth/register").send({
        email: "testuser@gmail.com",
        password: "testpass",
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Username already exist!");
    });
  });

  describe("login", () => {
    it("logs in successfully", async () => {
      User.findOne.mockResolvedValue({ _id: "user123", password: "hashed" });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const res = await request(app).post("/auth/login").send({
        email: "testuser@gmail.com",
        password: "testpass",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe(mockToken);
    });

    it("fails on invalid credentials", async () => {
      User.findOne.mockResolvedValue({ _id: "user123", password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post("/auth/login").send({
        email: "testuser@gmail.com",
        password: "wrongpass",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid email or password");
    });

    it("fails if user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app).post("/auth/login").send({
        email: "nouser@gmail.com",
        password: "testpass",
      });

      expect(res.status).toBe(401);
    });
  });
});
