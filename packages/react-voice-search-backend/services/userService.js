import User from "../models/User.js";

export const findAllUsers = () => User.find({});

export const promoteToAdmin = (id) =>
  User.findByIdAndUpdate(id, { role: "admin" });

export const deleteUser = (id) => User.findByIdAndDelete(id);

export const updateUserFields = (id, updates) =>
  User.findByIdAndUpdate(id, updates, { new: true });

export const blockUserById = (id) =>
  User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });

export const unblockUserById = (id) =>
  User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
