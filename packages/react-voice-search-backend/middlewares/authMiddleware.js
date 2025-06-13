import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; //req.user = decoded full JWT payload
    // Later to support user-specific search history or want to log who transcribed something
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
