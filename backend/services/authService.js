import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateQr } from "../lib/qr.js";
import { sendUserCreatedEmail } from "../lib/email.js";

function generateToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", {
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
    avatar: user.avatar || null,
    lastVisit: user.lastVisit || null,
    dueDate: user.dueDate || null,
    joinDate: user.joinDate,
    qrCode: user.qrCode || "",
    qrImage: user.qrImage || "",
  };
}

export const register = async (userData) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    dni,
    dueDate,
    avatar,
    paymentMethod,
    amount,
  } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email ya registrado");

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
    avatar: avatar || null,
    paymentMethod: paymentMethod || null,
    amount: amount || null,
  });
  await user.save();

  // Solo generar QR si el rol es "user"
  let qrCode = null;
  let qrImage = null;
  if (role === "user") {
    const qr = await generateQr(user._id.toString());
    user.qrCode = qr.qrCode;
    user.qrImage = qr.qrImage;
    qrCode = qr.qrCode;
    qrImage = qr.qrImage;
    await user.save();
  }

  // Enviar email de notificación al usuario
  try {
    await sendUserCreatedEmail(user.email, user.name, user.dni);
  } catch (emailError) {
    console.error("Error enviando email de alta de usuario:", emailError);
  }

  const token = generateToken(user._id, user.role);
  return {
    token,
    user: formatUser(user),
    qrImage,
    qrCode,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Credenciales inválidas");
  // Validar que la contraseña sean los últimos 4 dígitos del DNI
  const dni = user.dni || "";
  const last4Dni = dni.slice(-4);
  if (password !== last4Dni) {
    throw new Error("Credenciales inválidas");
  }
  const token = generateToken(user._id, user.role);
  return {
    token,
    user: formatUser(user),
    qrImage: user.qrImage,
    qrCode: user.qrCode,
  };
};

export const check = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");
  return { user: formatUser(user) };
};
