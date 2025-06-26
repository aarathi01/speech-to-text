import { verifyToken } from "../utils/jwt.js";

// Middleware to check if any authenticated user
export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = payload; // { id, role }
  next();
};

// Middleware to restrict access to SuperAdmins
export const requireSuperAdmin = (req, res, next) => {
  const token = req.cookies?.token;
  const payload = verifyToken(token);

  if (!payload || payload.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin access only" });
  }

  req.user = payload;
  next();
};

// Middleware to allow admin and superadmin
export const requireAdminOrSuperAdmin = (req, res, next) => {
  const token = req.cookies?.token;
  const payload = verifyToken(token);

  if (!payload || !["admin", "superadmin"].includes(payload.role)) {
    return res.status(403).json({ message: "Admin or Superadmin access only" });
  }

  req.user = payload;
  next();
};
