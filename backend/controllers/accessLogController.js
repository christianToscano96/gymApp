import * as accessLogService from "../services/accessLogService.js";

export const createAccessLog = async (req, res) => {
  try {
    const log = await accessLogService.createAccessLog(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllAccessLogs = async (req, res) => {
  try {
    const logs = await accessLogService.getAllAccessLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAccessLogsByUser = async (req, res) => {
  try {
    const logs = await accessLogService.getAccessLogsByUser(req.params.userId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAccessLog = async (req, res) => {
  try {
    const log = await accessLogService.deleteAccessLog(req.params.id);
    if (!log) return res.status(404).json({ error: "Log no encontrado" });
    res.json({ message: "Log eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
