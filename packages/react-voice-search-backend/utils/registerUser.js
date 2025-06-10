import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { MONGODB_URI } from "../utils/config.js";

const registerUser = async () => {
  await mongoose.connect(MONGODB_URI);
  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("User already exists");
    process.exit(0);
  }

  const password = await bcrypt.hash("admin123", 10);
  const user = new User({ username: "admin", password });
  await user.save();
  console.log("User created: admin");
  process.exit(0);
};

registerUser();
