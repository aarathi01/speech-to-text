import express from "express";
import {
  listUsers,
  promoteUserToAdmin,
  deleteUserById,
  updateUserByAdmin,
  blockUser,
  unblockUser,
} from "../controllers/adminController.js";
import { requireSuperAdmin } from "../middlewares/authMiddleware.js";
import {
  getUserSearchHistory,
  deleteSearchHistoryEntry,
} from "../controllers/adminHistoryController.js";

const router = express.Router();

// GET /api/admin/users - List all users (superadmin only)
router.get("/users", requireSuperAdmin, listUsers);

// PUT /api/admin/users/:id/promote - Promote user to admin
router.put("/users/:id/promote", requireSuperAdmin, promoteUserToAdmin);

// DELETE /api/admin/users/:id - Delete a user
router.delete("/users/:id", requireSuperAdmin, deleteUserById);

// Edit /api/users/:id - edit user info (name, country and phone)
router.put("/users/:id", requireSuperAdmin, updateUserByAdmin);

// block /api/users/:id/block - block a user
router.put("/users/:id/block", requireSuperAdmin, blockUser);

// unblock /api/users/:id/unblock - unblock a user
router.put("/users/:id/unblock", requireSuperAdmin, unblockUser);

// get history /api/users/:id/history - history of a  user
router.get("/users/:id/history", requireSuperAdmin,  getUserSearchHistory);

// delete history /api/users/:id/history/:historyId - delete hisdtory of a  user
router.delete("/users/:id/history/:historyId", requireSuperAdmin,  deleteSearchHistoryEntry);
export default router;
