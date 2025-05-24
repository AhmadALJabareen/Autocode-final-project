const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  specifications: { type: String },
  carModel: { type: String },
  condition: { type: String, enum: ['جديد', 'مستعمل'] },
  status: { type: String, enum: ['متاح', 'مباع'], default: 'متاح' },
  state: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Part', partSchema);