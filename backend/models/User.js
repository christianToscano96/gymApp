import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /.+@.+\..+/ },
  password: { type: String, required: false, default: null },
  phone: { type: String },
  dni: { type: String, unique: true, required: true },
  role: {
    type: String,
    enum: ["administrator", "user", "staff", "trainer"],
    default: "administrator",
  },
  dueDate: { type: String, default: null },
  expirationType: { type: String, enum: ["1", "15", "monthly"], default: null },
  joinDate: { type: Date, default: Date.now },
  lastVisit: { type: String, default: null },
  status: { type: String, enum: ["activo", "vencido", "pendiente"], default: "activo" },
  avatar: { type: String, default: null },
  qrCode: { type: String, default: null },
  qrImage: { type: String, default: null },
  paymentMethod: { type: String, enum: ["efectivo", "transferencia", "qr"], default: null },
  paymentProof: { type: String, default: null }, // Ruta del comprobante de pago
  amount: { type: Number, default: null, min: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model("User", userSchema);
