import express from "express";
import { userRoutes } from "./routes/user.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import accessLogRoutes from "./routes/accessLogs.js";
import paymentsRoutes from "./routes/payments.js";
import cors from "cors";
import corsOptions from "./config/cors.js";

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/access-logs", accessLogRoutes);
app.use("/api/payments", paymentsRoutes);

export default app;
