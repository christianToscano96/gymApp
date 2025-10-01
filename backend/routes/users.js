import { Router } from "express";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/qr/:qrCode", userController.findByQrCode);
router.patch("/:id/last-visit", userController.updateLastVisit);
router.post("/", userController.createOrUpdateUser);
router.put("/:id", userController.updateUser);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);

export default router;
