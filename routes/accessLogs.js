import express from 'express';
import AccessLog from '../models/AccessLog.js';
import authMiddleware, { authorizeRoles } from '../middleware/auth.js';
const router = express.Router();

// Registrar acceso (solo admin y staff)
router.post('/', authMiddleware, authorizeRoles('administrator', 'staff'), async (req, res) => {
  try {
    const { userId, status, name, avatar } = req.body;
    if (!userId || !status) {
      return res.status(400).json({ error: 'userId y status son requeridos' });
    }
    const log = new AccessLog({ userId, status, name, avatar });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar accesos (solo admin y staff)
router.get('/', authMiddleware, authorizeRoles('administrator', 'staff'), async (req, res) => {
  try {
    const logs = await AccessLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
