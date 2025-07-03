import { authenticateUser, registerUser } from "../../services/authService.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";

jest.mock("../../models/User.js");
jest.mock("bcryptjs");
jest.mock("../../utils/jwt.js");

describe("authService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticateUser", () => {
    it("should authenticate user and return token", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        password: "hashedPassword",
        role: "user",
        isBlocked: false,
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue("mockedToken");

      const result = await authenticateUser("test@example.com", "plainpass");

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("plainpass", mockUser.password);
      expect(generateToken).toHaveBeenCalledWith({ id: "user123", role: "user" });
      expect(result).toEqual({ user: mockUser, token: "mockedToken" });
    });

    it("should throw 400 for invalid password", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com", password: "wrong" });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authenticateUser("test@example.com", "badpass")).rejects.toEqual({
        statusCode: 400,
        message: "Invalid email or password",
      });
    });

    it("should throw 400 if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authenticateUser("noone@example.com", "somepass")).rejects.toEqual({
        statusCode: 400,
        message: "Invalid email or password",
      });
    });

    it("should throw 403 if user is blocked", async () => {
      const blockedUser = {
        _id: "user123",
        email: "test@example.com",
        password: "hashed",
        role: "user",
        isBlocked: true,
      };

      User.findOne.mockResolvedValue(blockedUser);
      bcrypt.compare.mockResolvedValue(true);

      await expect(authenticateUser("test@example.com", "any")).rejects.toEqual({
        statusCode: 403,
        message: "This account is blocked. Please contact admin.",
      });
    });
  });

  describe("registerUser", () => {
    it("should register new user and return token", async () => {
      const newUser = {
        _id: "newuser123",
        username: "kunju",
        email: "kunju@example.com",
        phone: "1234567890",
        country: "India",
        role: "user",
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.create.mockResolvedValue(newUser);
      generateToken.mockReturnValue("newToken");

      const result = await registerUser({
        username: "kunju",
        email: "kunju@example.com",
        password: "rawpass",
        phone: "1234567890",
        country: "India",
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: "kunju@example.com" });
      expect(bcrypt.hash).toHaveBeenCalledWith("rawpass", 10);
      expect(User.create).toHaveBeenCalledWith({
        username: "kunju",
        email: "kunju@example.com",
        password: "hashedPassword",
        phone: "1234567890",
        country: "India",
        role: "user",
      });
      expect(generateToken).toHaveBeenCalledWith({ id: newUser._id, role: "user" });
      expect(result).toEqual({ user: newUser, token: "newToken" });
    });

    it("should throw 409 if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      await expect(
        registerUser({
          username: "kunju",
          email: "test@example.com",
          password: "pass",
          phone: "1111",
          country: "India",
        })
      ).rejects.toEqual({
        statusCode: 409,
        message: "Email already exists!",
      });
    });

    it("should throw if User.create fails", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed");
      User.create.mockRejectedValue(new Error("DB Error"));

      await expect(
        registerUser({
          username: "kunju",
          email: "fail@example.com",
          password: "pass",
          phone: "000",
          country: "India",
        })
      ).rejects.toThrow("DB Error");
    });
  });
});
