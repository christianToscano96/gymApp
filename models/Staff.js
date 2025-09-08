import { Phone } from "lucide-react";
import mongoose from "mongoose";
const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String },
  status: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
});
export default mongoose.model("Staff", staffSchema);
