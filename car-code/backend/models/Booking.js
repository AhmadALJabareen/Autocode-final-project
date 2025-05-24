const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mechanic: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic" },
    serviceType: { type: String, enum: ["home", "workshop"], required: true },
    location: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    payment: {
      paid: { type: Boolean, default: false },
      method: { type: String }, 
      receiptUrl: { type: String },
    },
    notes: { type: String },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "AvailableSlot" },
    completedAt: { type: Date }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
