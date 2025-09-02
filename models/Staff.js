import mongoose from 'mongoose';
const staffSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  position: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Staff', staffSchema);
