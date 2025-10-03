import { Router } from "express";
import * as accessLogController from "../controllers/accessLogController.js";
import authMiddleware, { authorizeRoles } from "../middleware/auth.js";

const router = Router();

// Crear log de acceso (puede ser público o protegido según tu lógica)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("administrator", "staff"),
  accessLogController.createAccessLog
);

// Listar todos los logs (solo admin)
router.get(
  "/",
  authMiddleware,
  authorizeRoles("administrator"),
  accessLogController.getAllAccessLogs
);

// Listar logs por usuario
router.get(
  "/user/:userId",
  authMiddleware,
  authorizeRoles("administrator", "staff"),
  accessLogController.getAccessLogsByUser
);

// Eliminar log
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("administrator"),
  accessLogController.deleteAccessLog
);

export default router;
