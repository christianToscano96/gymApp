import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  status: { type: String, enum: ['pending', 'paid', 'failed'] },
  method: String,
  paidAt: Date,
  expiresAt: Date
});
export default mongoose.model('Payment', paymentSchema);
