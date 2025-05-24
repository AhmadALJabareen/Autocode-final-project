const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workshopName: { type: String },
  specializations: [{ type: String }], 
  experienceYears: { type: Number, min: 0 }, 
  workSchedule: [{
    day: { type: String, enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] },
    hours: [{ start: String, end: String }], 
  }],
  pricing: {
    homeService: { type: Number, min: 0 }, 
    workshopService: { type: Number, min: 0 },
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }, 
    createdAt: { type: Date, default: Date.now }
  }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Mechanic', mechanicSchema);