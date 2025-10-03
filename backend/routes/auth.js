import express from "express";
import * as authController from "../controllers/authController.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", upload.single("paymentProof"), authController.register);
router.post("/login", authController.login);
router.post("/check", authMiddleware, authController.check);

export default router;
