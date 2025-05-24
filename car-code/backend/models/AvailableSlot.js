const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema({
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // HH:mm
  isBooked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('AvailableSlot', availableSlotSchema);