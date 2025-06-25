import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const authenticateUser = async (email, password) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  const isMatch = user && (await bcrypt.compare(password, user.password));

  if (!user || !isMatch) {
    throw { statusCode: 400, message: "Invalid email or password" };
  }

  if (user.isBlocked) {
    throw { statusCode: 403, message: "This account is blocked. Please contact admin." };
  }

  const token = generateToken({ id: user._id, role: user.role });

  return { user, token };
};

export const registerUser = async ({ username, email, password, phone, country }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw { statusCode: 409, message: "Email already exists!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    country,
    role: "user",
  });

  const token = generateToken({ id: user._id, role: "user" });

  return { user, token };
};
