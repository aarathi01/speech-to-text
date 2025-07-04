import bcrypt from "bcryptjs";

import User from "../models/User.js";

export const initSuperAdmin = async () => {
  console.log("Inside initSuperAdmin ");
  const email = process.env.SUPERADMIN_EMAIL?.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Superadmin already existys. Skipping creation.");
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);

  const superAdmin = new User({
    username: process.env.SUPERADMIN_USERNAME || "Super Admin",
    email,
    password: hashedPassword,
    phone: "9999999999",
    country: "India",
    role: "superadmin",
  });

  await superAdmin.save();
  console.log("Superadmin created:", email);
};
