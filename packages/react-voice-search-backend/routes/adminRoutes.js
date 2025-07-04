import express from "express";

import {
  blockUser,
  deleteUserById,
  getAdminStats,
  listUsers,
  promoteUserToAdmin,
  unblockUser,
  updateUserByAdmin,
} from "../controllers/adminController.js";
import {
  deleteSearchHistoryEntry,
  getUserSearchHistory,
} from "../controllers/adminHistoryController.js";
import {
  requireAdminOrSuperAdmin,
  requireSuperAdmin,
} from "../middlewares/authMiddleware.js";
import {
  validateParams,
  validateQuery,
} from "../middlewares/validateRequest.js";
import {
  adminDeleteHistorySchema,
  idParamSchema,
} from "../validations/adminValidation.js";
import { paginationSchema } from "../validations/commonValidation.js";

const router = express.Router();

// GET /api/admin/users - List all users (superadmin only)
router.get(
  "/users",
  requireAdminOrSuperAdmin,
  validateQuery(paginationSchema),
  listUsers
);

// PUT /api/admin/users/:id/promote - Promote user to admin
router.put(
  "/users/:id/promote",
  requireSuperAdmin,
  validateParams(idParamSchema),
  promoteUserToAdmin
);

// DELETE /api/admin/users/:id - Delete a user
router.delete(
  "/users/:id",
  requireAdminOrSuperAdmin,
  validateParams(idParamSchema),
  deleteUserById
);

// Edit /api/users/:id - edit user info (name, country and phone)
router.put(
  "/users/:id",
  requireAdminOrSuperAdmin,
  validateParams(idParamSchema),
  updateUserByAdmin
);

// block /api/users/:id/block - block a user
router.put(
  "/users/:id/block",
  requireAdminOrSuperAdmin,
  validateParams(idParamSchema),
  blockUser
);

// unblock /api/users/:id/unblock - unblock a user
router.put(
  "/users/:id/unblock",
  requireAdminOrSuperAdmin,
  validateParams(idParamSchema),
  unblockUser
);

// get history /api/users/:id/history - history of a  user
router.get(
  "/users/:id/history",
  requireAdminOrSuperAdmin,
  validateParams(idParamSchema),
  validateQuery(paginationSchema),
  getUserSearchHistory
);

// delete history /api/users/:id/history/:historyId - delete hisdtory of a  user
router.delete(
  "/users/:id/history/:historyId",
  requireAdminOrSuperAdmin,
  validateParams(adminDeleteHistorySchema),
  deleteSearchHistoryEntry
);

// Admin dashboard stats route
router.get("/stats", requireAdminOrSuperAdmin, getAdminStats);
export default router;
