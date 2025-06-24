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

const router = express.Router();

// GET /api/admin/users - List all users (superadmin only)
router.get("/users", requireSuperAdmin, listUsers);

// PUT /api/admin/users/:id/promote - Promote user to admin
router.put("/users/:id/promote", requireSuperAdmin, promoteUserToAdmin);

// DELETE /api/admin/users/:id - Delete a user
router.delete("/users/:id", requireSuperAdmin, deleteUserById);

// Edit /api/users/:id - edit user info (name, country and phone)
router.put("/users/:id", requireSuperAdmin, updateUserByAdmin);

// block /api/users/:id - block a user
router.put("/users/:id/block", requireSuperAdmin, blockUser);

// unblock /api/users/:id - unblock a user
router.put("/users/:id/unblock", requireSuperAdmin, unblockUser);
export default router;  
