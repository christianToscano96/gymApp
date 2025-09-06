import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
  const { name, email, password, role, phone, dni } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "Email ya registrado" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Validar el role recibido, solo permitir valores válidos
    const validRoles = ["administrator", "user", "staff"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      dni,
      joinDate: new Date(),
    });
    await user.save();
    // Si quieres devolver también un token, puedes generarlo aquí
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        dni: user.dni || "",
        status: user.status,
        membership: user.membership,
        avatar: user.avatar || null,
        lastVisit: user.lastVisit || null,
        dueDate: user.dueDate || null,
        joinDate: user.joinDate,
        qrCode: user.qrCode || "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Credenciales inválidas" });
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        status: user.status,
        membership: user.membership,
        avatar: user.avatar || null,
        lastVisit: user.lastVisit || null,
        dueDate: user.dueDate || null,
        qrCode: user.qrCode || "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
