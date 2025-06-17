import express from "express";
import { saveSearchQuery, getSearchHistory } from "../controllers/historyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveSearchQuery);
router.get("/get", authMiddleware, getSearchHistory);

export default router;
