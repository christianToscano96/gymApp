import mongoose from 'mongoose';
const accessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entryDate: { type: Date },
  exitDate: { type: Date },
});
export default mongoose.model('AccessLog', accessLogSchema);
