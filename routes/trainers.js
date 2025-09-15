// routes/trainers.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// PUT /api/trainers/:id/trainees
router.put("/:id/trainees", async (req, res) => {
  const { id } = req.params;
  const { trainees } = req.body;
  try {
    console.log("[PUT /api/trainers/:id/trainees] IDs recibidos:", trainees);
    const trainer = await User.findById(id);
    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ error: "Trainer not found" });
    }
    trainer.trainerData = trainer.trainerData || {};
    trainer.trainerData.trainees = trainees;
    await trainer.save();
    console.log("[PUT /api/trainers/:id/trainees] IDs guardados:", trainer.trainerData.trainees);
    res.json({ success: true, trainer });
  } catch (err) {
    console.error("[PUT /api/trainers/:id/trainees] Error:", err);
    res.status(500).json({ error: "Error updating trainees" });
  }
});

export default router;
