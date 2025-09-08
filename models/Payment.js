import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  paymentDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
});
export default mongoose.model('Payment', paymentSchema);
