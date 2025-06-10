import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET;

// Generates a token for a given user object (can be username or ID)
export const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

// Verifies a token and returns the payload
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};
