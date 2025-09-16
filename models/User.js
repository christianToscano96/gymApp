import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  dni: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["administrator", "user", "staff", "trainer"],
    default: "administrator",
  },
  dueDate: {
    type: String,
    default: null,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  lastVisit: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["activo", "vencido", "pendiente"],
    default: "activo",
  },
  avatar: {
    type: String,
    default: null,
  },
  qrCode: {
    type: String,
    default: null,
  },
  qrImage: {
    type: String,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ["efectivo", "transferencia", "qr"],
    default: null,
  },
  amount: {
    type: Number,
    default: null,
  },
});
export default mongoose.model("User", userSchema);
