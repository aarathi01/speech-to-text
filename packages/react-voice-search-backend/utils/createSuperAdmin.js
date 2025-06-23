import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const createSuperAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "superadmin@example.com" });
  if (existing) {
    console.log("Superadmin already exists.");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("Super@123", 10);
  await User.create({
    username: "Super Admin",
    email: "superadmin@example.com",
    password: hashedPassword,
    phone: "9999999999",
    country: "India",
    role: "superadmin",
  });

  console.log("Superadmin created");
  process.exit();
};

createSuperAdmin();
