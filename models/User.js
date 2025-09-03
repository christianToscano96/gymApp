import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, enum: ["administrator", "user", "staff"], default: "administrator" },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("User", userSchema);
