import mongoose from "mongoose";
const accessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["permitido", "denegado"], required: true },
}, { timestamps: true });
export default mongoose.model("AccessLog", accessLogSchema);
