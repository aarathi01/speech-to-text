import SearchHistory from "../models/SearchHistory.js";
import User from "../models/User.js";
import {
  blockUserById,
  deleteUser,
  promoteToAdmin,
  unblockUserById,
  updateUserFields,
} from "../services/userService.js";

export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit; //calculate skip

    const totalUsers = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({ users, page, totalPages });
  } catch (err) {
    console.error("Error inside listusers : ", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const promoteUserToAdmin = async (req, res) => {
  try {
    await promoteToAdmin(req.params.id);
    res.json({ message: "User promoted to admin" });
  } catch (err) {
    console.error("Error inside promoteUserToAdmin : ", err);
    res.status(500).json({ message: "Failed to promote user" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error inside deleteUserById : ", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const allowedFields = ["phone", "username", "country"];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await updateUserFields(req.params.id, updates);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await blockUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User blocked", user });
  } catch (err) {
    console.error("Error inside blockUser : ", err);
    res.status(500).json({ message: "Failed to block user" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await unblockUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unblocked", user });
  } catch (err) {
    console.error("Error inside unblockUser : ", err);
    res.status(500).json({ message: "Failed to unblock user" });
  }
};

export const getAdminStats = async (req, res) => {
  const [users, SearchHistories] = await Promise.all([
    User.find({}),
    SearchHistory.find({}),
  ]);

  const totalUsers = users.length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const superadminCount = users.filter((u) => u.role === "superadmin").length;
  const totalSearches = SearchHistories.length;
  const recentQueries = SearchHistories.filter(
    (s) => new Date(s.timestamp) > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;

  res.json({
    totalUsers,
    blockedUsers,
    totalSearches,
    adminCount,
    superadminCount,
    recentQueries,
  });
};
