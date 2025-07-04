import express from "express";

import {
  deleteOwnHistoryEntry,
  getSearchHistory,
  saveSearchQuery,
} from "../controllers/historyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateParams, validateRequest } from "../middlewares/validateRequest.js";
import { historyIdParamSchema } from "../validations/adminValidation.js";
import { saveHistorySchema } from "../validations/historyValidation.js";

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
