import mongoose from 'mongoose';
const accessLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accessType: { type: String, enum: ['entry', 'exit'] },
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('AccessLog', accessLogSchema);
