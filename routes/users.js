import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Actualizar la última visita del usuario
router.patch("/:id/last-visit", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { lastVisit } = req.body;
    if (!lastVisit) {
      return res.status(400).json({ error: "lastVisit es requerido" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { lastVisit },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Última visita actualizada", user });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
