import jwt from "jsonwebtoken";
import cookie from "cookie";
import { JWT_SECRET } from "./config.js";

export const verifyWebSocketToken = (req, ws) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    ws.close(4001, "Missing authentication token"); 
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    ws.close(4002, "Invalid or expired token");
    return null;
  }
};
