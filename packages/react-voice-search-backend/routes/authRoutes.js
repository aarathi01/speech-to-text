import express from "express";
import { login, register } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;
