import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // nombre del usuario
  date: { type: Date, required: true }, // fecha de pago
  dueDate: { type: Date, required: true }, // fecha de vencimiento
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  method: { type: String, required: true },
  concept: { type: String, required: false },
  expirationType: { type: String, required: false },
});
export default mongoose.model("Payment", paymentSchema);
