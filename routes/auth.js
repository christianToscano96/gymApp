import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { generateQr } from "../lib/qr.js";
import Joi from "joi";
dotenv.config();

const router = express.Router();

// Schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("administrator", "user", "staff").required(),
  phone: Joi.string().allow(null, ""),
  dni: Joi.string().allow(null, ""),
  dueDate: Joi.date().iso().allow(null, ""),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1d",
  });
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || null,
    dni: user.dni || null,
    status: user.status,
    membership: user.membership,
    avatar: user.avatar || null,
    lastVisit: user.lastVisit || null,
    dueDate: user.dueDate || null,
    joinDate: user.joinDate,
    qrCode: user.qrCode || "",
    qrImage: user.qrImage || "",
  };
}

// Registro
router.post("/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { name, email, password, role, phone, dni, dueDate } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "Email ya registrado" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      dni,
      joinDate: new Date(),
      dueDate: dueDate || null,
    });
    await user.save();
    // Generar QR después de guardar el usuario
    const { qrCode, qrImage } = await generateQr(user._id.toString());
    user.qrCode = qrCode;
    user.qrImage = qrImage;
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: formatUser(user),
      qrImage,
      qrCode,
    });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Credenciales inválidas" });
    const token = generateToken(user._id);
    res.json({
      token,
      user: formatUser(user),
      qrImage: user.qrImage,
      qrCode: user.qrCode,
    });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
