import express from "express";
import { saveSearchQuery, getSearchHistory, deleteOwnHistoryEntry } from "../controllers/historyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveSearchQuery);
router.get("/get", authMiddleware, getSearchHistory);
router.delete("/:id", authMiddleware, deleteOwnHistoryEntry);

export default router;
