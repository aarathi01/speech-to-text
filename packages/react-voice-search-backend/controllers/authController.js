import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    let isMatch;
    const user = await User.findOne({ username });
    if (user) isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      return res.status(500).json({ error: "Username cant be empty!" });
    } else if (!password) {
      return res.status(500).json({ error: "Password cant be empty!" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exist!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
