import { Router } from "express";
import * as paymentController from "../controllers/paymentController.js";
import authMiddleware, { authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("administrator", "staff"),
  paymentController.createPayment
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("administrator"),
  paymentController.getAllPayments
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("administrator", "staff"),
  paymentController.updatePayment
);

export default router;
