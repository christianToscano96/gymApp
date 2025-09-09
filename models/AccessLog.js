import mongoose from "mongoose";
const accessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["permitido", "denegado"], required: true },
  name: { type: String },
  avatar: { type: String },
});
export default mongoose.model("AccessLog", accessLogSchema);
