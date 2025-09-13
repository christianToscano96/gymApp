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
  membership: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
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
});
export default mongoose.model("User", userSchema);
