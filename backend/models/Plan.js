import mongoose from "mongoose";
const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1 },
}, { timestamps: true });
export default mongoose.model("Plan", planSchema);
