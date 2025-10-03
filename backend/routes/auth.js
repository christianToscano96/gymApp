import express from "express";
import * as authController from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/check", authMiddleware, authController.check);

export default router;
