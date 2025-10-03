import mongoose from 'mongoose';
const saleSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  saleDate: { type: Date, required: true },
  total: { type: Number, required: true, min: 0 },
}, { timestamps: true });
export default mongoose.model('Sale', saleSchema);
