// Actualiza la última visita del usuario
export const updateLastVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { lastVisit } = req.body;
    const user = await userService.updateLastVisit(id, lastVisit);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
import * as userService from "../services/userService.js";

export const findByQrCode = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const user = await userService.findByQrCode(qrCode);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrUpdateUser = async (req, res) => {
  try {
    const user = await userService.createOrUpdateUser(req.body);
    res.status(user.isNew ? 201 : 200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    if (err.message === "Usuario no encontrado") {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
