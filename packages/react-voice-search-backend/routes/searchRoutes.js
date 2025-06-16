import express from "express";
import { searchHandler } from "../controllers/searchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/search",authMiddleware, searchHandler);

export default router;
