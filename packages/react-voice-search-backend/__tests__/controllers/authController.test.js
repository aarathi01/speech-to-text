import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as authService from "../../services/authService.js";
import * as authController from "../../controllers/authController.js";

jest.mock("../../services/authService.js"); 
//Mock only the service layer (authenticateUser, registerUser), not the controller itself

const mockToken = "mocked-jwt-token";
const mockUser = {
  _id: "user123",
  email: "testuser@gmail.com",
  username: "testuser",
  role: "user",
  phone: "1234567890",
  country: "India",
};

let app, server;
const PORT = 5555; // Any available test port
const baseURL = `http://localhost:${PORT}`;

beforeAll((done) => {
  // Setup real app instance
  app = express();
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.post("/api/auth/login", authController.login);
  app.post("/api/auth/register", authController.register);

  // GLOBAL ERROR HANDLER
  app.use((err, _req, res) => {
    console.error("Test caught error:", err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Internal server error" });
  });

  server = app.listen(PORT, () => {
    console.log(`Test server running on ${PORT}`);
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

describe("AuthController", () => {
  describe("POST /api/auth/register", () => {
    it("should register successfully", async () => {
      authService.registerUser.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const res = await request(baseURL).post("/api/auth/register").send({
        email: mockUser.email,
        password: "testpass",
        username: mockUser.username,
        phone: mockUser.phone,
        country: mockUser.country,
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Registered and logged in successfully");
      expect(res.body.user).toMatchObject({
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
        username: mockUser.username,
        phone: mockUser.phone,
        country: mockUser.country,
      });
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 409 if email exists", async () => {
      authService.registerUser.mockRejectedValue({
        statusCode: 409,
        message: "Email already exists!",
      });

      const res = await request(baseURL).post("/api/auth/register").send({
        email: mockUser.email,
        password: "testpass",
        username: mockUser.username,
        phone: mockUser.phone,
        country: mockUser.country,
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe("Email already exists!");
    });

    it("should return DB Error", async () => {
      authService.registerUser.mockRejectedValue(new Error("DB Error"));

      const res = await request(baseURL).post("/api/auth/register").send({
        email: "fail@test.com",
        password: "123",
        username: "fail",
        phone: "000",
        country: "Nowhere",
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("DB Error");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      authService.authenticateUser.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const res = await request(baseURL).post("/api/auth/login").send({
        email: mockUser.email,
        password: "testpass",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.user).toMatchObject({
        id: mockUser._id,
        email: mockUser.email,
        username: mockUser.username,
        role: mockUser.role,
      });
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 400 if login fails due to invalid credentials", async () => {
      authService.authenticateUser.mockRejectedValue({
        statusCode: 400,
        message: "Invalid email or password",
      });

      const res = await request(baseURL).post("/api/auth/login").send({
        email: mockUser.email,
        password: "wrongpass",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should return 500 on internal login error", async () => {
      authService.authenticateUser.mockRejectedValue(new Error("Internal server error"));

      const res = await request(baseURL).post("/api/auth/login").send({
        email: "fail@test.com",
        password: "testpass",
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Internal server error");
    });
  });
});
