// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'mechanic', 'admin'], default: 'user' },
//   location: { type: String },
//   phone: { type: String },
//   image: { type: String },
//   searchHistory: [{ type: String }], 
//   bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
//   partsForSale: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Part' }],
//   maintenanceHistory: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Booking'
//   }],
//   notifications: [{
//     type: String,
//     createdAt: { type: Date, default: Date.now }
//   }]
// }, { timestamps: true });


// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'mechanic', 'admin'], default: 'user' },
  location: { type: String },
  phone: { type: String },
  image: { type: String },
  searchHistory: [{ type: String }], 
  freeSearchCount: { type: Number, default: 0 }, 
  subscription: {
    type: { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
    expiresAt: { type: Date, default: null }, 
    stripeCustomerId: { type: String }, 
    stripeSubscriptionId: { type: String } 
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  partsForSale: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Part' }],
  maintenanceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  notifications: [{
    type: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);