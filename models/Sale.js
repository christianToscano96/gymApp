import mongoose from 'mongoose';
const saleSchema = new mongoose.Schema({
	staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
	saleDate: { type: Date, required: true },
	total: { type: Number, required: true },
});
export default mongoose.model('Sale', saleSchema);
