import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ["administrator", "user", "staff"],
    default: "administrator",
  },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  lastVisit: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["activo", "vencido", "pendiente"],
    default: "activo",
  },
});
export default mongoose.model("User", userSchema);
