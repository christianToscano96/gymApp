import * as authService from "../services/authService.js";
import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("administrator", "user", "staff", "trainer")
    .required(),
  phone: Joi.string().allow(null, ""),
  dni: Joi.string().allow(null, ""),
  dueDate: Joi.date().iso().allow(null, ""),
  avatar: Joi.string().allow(null, ""),
  paymentMethod: Joi.string()
    .valid("efectivo", "transferencia", "qr")
    .allow(null, ""),
  amount: Joi.number().min(0).allow(null, ""),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Error interno del servidor" });
  }
};

export const check = async (req, res) => {
  try {
    const result = await authService.check(req.user.id);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Error interno del servidor" });
  }
};
