import express from "express";
import {
  listUsers,
  promoteUserToAdmin,
  deleteUserById,
  updateUserByAdmin,
  blockUser,
  unblockUser,
} from "../controllers/adminController.js";
import { requireSuperAdmin, requireAdminOrSuperAdmin } from "../middlewares/authMiddleware.js";
import {
  getUserSearchHistory,
  deleteSearchHistoryEntry,
} from "../controllers/adminHistoryController.js";

const router = express.Router();

// GET /api/admin/users - List all users (superadmin only)
router.get("/users", requireAdminOrSuperAdmin, listUsers);

// PUT /api/admin/users/:id/promote - Promote user to admin
router.put("/users/:id/promote", requireSuperAdmin, promoteUserToAdmin);

// DELETE /api/admin/users/:id - Delete a user
router.delete("/users/:id", requireAdminOrSuperAdmin, deleteUserById);

// Edit /api/users/:id - edit user info (name, country and phone)
router.put("/users/:id", requireAdminOrSuperAdmin, updateUserByAdmin);

// block /api/users/:id/block - block a user
router.put("/users/:id/block", requireAdminOrSuperAdmin, blockUser);

// unblock /api/users/:id/unblock - unblock a user
router.put("/users/:id/unblock", requireAdminOrSuperAdmin, unblockUser);

// get history /api/users/:id/history - history of a  user
router.get("/users/:id/history", requireAdminOrSuperAdmin,  getUserSearchHistory);

// delete history /api/users/:id/history/:historyId - delete hisdtory of a  user
router.delete("/users/:id/history/:historyId", requireAdminOrSuperAdmin,  deleteSearchHistoryEntry);
export default router;
