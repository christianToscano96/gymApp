import express from 'express';
import AccessLog from '../models/AccessLog.js';
const router = express.Router();

// Registrar acceso
router.post('/', async (req, res) => {
  try {
    const log = new AccessLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar accesos
router.get('/', async (req, res) => {
  try {
    const logs = await AccessLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
