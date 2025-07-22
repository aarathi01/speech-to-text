import cookie from "cookie";

import { verifyToken } from "./jwt.js";

// This ensures only authenticated users can stream audio for transcription.
// It's a custom function, likely decoding a JWT or cookie and mapping it to a user.
// Without this, anyone could flood your backend with fake audio.
export const verifyWebSocketToken = (req, ws) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    ws.close(4002, "Missing authentication token");
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    ws.close(4002, "Invalid or expired token");
    return null;
  }
  return decoded;
};
