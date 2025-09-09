import mongoose from 'mongoose';
const saleDetailSchema = new mongoose.Schema({
	saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
	productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
	quantity: { type: Number, required: true },
	unitPrice: { type: Number, required: true },
});
export default mongoose.model('SaleDetail', saleDetailSchema);
