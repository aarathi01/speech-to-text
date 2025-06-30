import express from "express";
import {
  saveSearchQuery,
  getSearchHistory,
  deleteOwnHistoryEntry,
} from "../controllers/historyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateParams, validateRequest } from "../middlewares/validateRequest.js";
import { saveHistorySchema } from "../validations/historyValidation.js";
import { historyIdParamSchema } from "../validations/adminValidation.js";

const router = express.Router();

router.post(
  "/save",
  authMiddleware,
  validateRequest(saveHistorySchema),
  saveSearchQuery
);

router.get("/get", authMiddleware, getSearchHistory);

router.delete(
  "/:id",
  authMiddleware,
  validateParams(historyIdParamSchema),
  deleteOwnHistoryEntry
);

export default router;
