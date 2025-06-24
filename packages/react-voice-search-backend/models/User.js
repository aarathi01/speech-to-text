import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // store hashed passwords
  email: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
});

export default mongoose.model("User", userSchema);
