import { verifyToken } from "../utils/jwt.js";

// Middleware to check if any authenticated user
// authMiddleware ensures the user is logged in (has a valid token).
export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token; // Checks for the token in cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }

  const payload = verifyToken(token); // Verifies the token using verifyToken()
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired token" }); // If missing or invalid, responds with 401
  }

  // we store the decoded payload in req.user, So that downstream route handlers can access req.user.id or req.user.role easily, without decoding the token again.
  req.user = payload; // { id, role } , If valid, attaches decoded payload to req.user
  next();
};

// Middleware to restrict access to SuperAdmins
// requireSuperAdmin adds another layer: only users with role === "superadmin" can access.
export const requireSuperAdmin = (req, res, next) => {
  const token = req.cookies?.token;
  const payload = verifyToken(token);

  // checks if user’s role is exactly superadmin
  if (!payload || payload.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin access only" }); // Responds with 403 (forbidden) if unauthorized
  }

  req.user = payload;
  next();
};

// Middleware to allow admin and superadmin
export const requireAdminOrSuperAdmin = (req, res, next) => {
  const token = req.cookies?.token;
  const payload = verifyToken(token);

  // Allows access to both admin and superadmin
  if (!payload || !["admin", "superadmin"].includes(payload.role)) {
    return res.status(403).json({ message: "Admin or Superadmin access only" }); // Responds with 403 if unauthorized
  }

  req.user = payload;
  next();
};
