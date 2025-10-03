import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    paymentDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, required: true },
    method: { type: String, required: true },
    concept: { type: String },
    expirationType: { type: String },
  },
  { timestamps: true }
);
export default mongoose.model("Payment", paymentSchema);
