import express from "express";
import { searchHandler } from "../controllers/searchController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateQuery } from "../middlewares/validateRequest.js";
import { searchSchema } from "../validations/searchValidation.js";

const router = express.Router();

router.get("/", authMiddleware, validateQuery(searchSchema), searchHandler);

export default router;
