import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import {
  authMiddleware,
  requireSuperAdmin,
  requireAdminOrSuperAdmin,
} from "../../middlewares/authMiddleware.js";

jest.mock("jsonwebtoken");

const createAppWithRoute = (middleware) => {
  const app = express();
  app.use(cookieParser());
  app.get("/protected", middleware, (req, res) => {
    res.status(200).json({ message: "Access granted", user: req.user });
  });
  return app;
};

describe("authMiddleware integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 if token is missing", async () => {
    const app = createAppWithRoute(authMiddleware);
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized. Token missing." });
  });

  it("returns 401 for invalid/expired token", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const app = createAppWithRoute(authMiddleware);
    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=invalidtoken");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid or expired token" });
  });

  it("passes and attaches user for valid token", async () => {
    const mockUser = { id: "u1", role: "user" };
    jwt.verify.mockReturnValue(mockUser);

    const app = createAppWithRoute(authMiddleware);
    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=validtoken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Access granted",
      user: mockUser,
    });
  });
});

describe("requireSuperAdmin integration", () => {
  it("denies access if token is not superadmin", async () => {
    jwt.verify.mockReturnValue({ id: "admin", role: "admin" });

    const app = createAppWithRoute(requireSuperAdmin);
    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=fakeadmin");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Superadmin access only" });
  });

  it("grants access to superadmin", async () => {
    const mockUser = { id: "super1", role: "superadmin" };
    jwt.verify.mockReturnValue(mockUser);

    const app = createAppWithRoute(requireSuperAdmin);
    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=superadminToken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Access granted",
      user: mockUser,
    });
  });
});

describe("requireAdminOrSuperAdmin integration", () => {
  it("denies access to non-admin user", async () => {
    jwt.verify.mockReturnValue({ id: "u2", role: "user" });

    const app = createAppWithRoute(requireAdminOrSuperAdmin);
    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=userToken");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Admin or Superadmin access only" });
  });

  it("grants access to admin", async () => {
    const mockUser = { id: "a1", role: "admin" };
    jwt.verify.mockReturnValue(mockUser);

    const app = createAppWithRoute(requireAdminOrSuperAdmin);
    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=adminToken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Access granted", user: mockUser });
  });

  it("grants access to superadmin", async () => {
    const mockUser = { id: "s1", role: "superadmin" };
    jwt.verify.mockReturnValue(mockUser);

    const app = createAppWithRoute(requireAdminOrSuperAdmin);
    const res = await request(app)
      .get("/protected")
      .set("Cookie", "token=superadminToken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Access granted", user: mockUser });
    expect(jwt.verify).toHaveBeenCalledWith("validtoken", expect.any(String));
  });
});
