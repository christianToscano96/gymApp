import express from "express";
import cors from "cors";
import connectDB from "./models/connectDB.js";
import User from "./models/User.js";
import staffRoutes from "./routes/staff.js";
import paymentRoutes from "./routes/payments.js";
import accessLogRoutes from "./routes/accessLogs.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Endpoint básico para crear usuario
app.post("/api/users", async (req, res) => {
  try {
    // Si el usuario ya existe, no sobrescribir el rol
    const { email, role, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      // No modificar el rol si ya es administrator
      if (userExists.role === "administrator") {
        return res.status(400).json({
          error: "El usuario ya es administrador y no se puede cambiar el rol.",
        });
      }
      // Si no es administrador, puedes actualizar otros campos pero no el rol
      Object.assign(userExists, req.body, { role: userExists.role });
      await userExists.save();
      return res.status(200).json(userExists);
    }
    // Si es nuevo usuario, respeta el rol enviado
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint para obtener todos los usuarios
// Endpoint para obtener usuario por ID
// Endpoint para actualizar usuario por ID
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Solo permitir actualizar dueDate si el rol es 'user'
    if (user.role === "user" && req.body.dueDate !== undefined) {
      user.dueDate = req.body.dueDate;
    }
  // Actualizar otros campos permitidos
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.email = req.body.email ?? user.email;
  user.status = req.body.status ?? user.status;
  user.membership = req.body.membership ?? user.membership;
  user.lastVisit = req.body.lastVisit ?? user.lastVisit;
  user.avatar = req.body.avatar ?? user.avatar;
  user.joinDate = req.body.joinDate ?? user.joinDate;
  user.qrCode = req.body.qrCode ?? user.qrCode;
  user.dni = req.body.dni ?? user.dni;
    // No permitir cambiar el rol ni el password desde aquí
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Endpoint para eliminar usuario por ID
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rutas adicionales
app.use("/api/staff", staffRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/access-logs", accessLogRoutes);
app.use("/api/auth", authRoutes);

// Ejemplo de ruta protegida
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acceso autorizado", user: req.user });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
