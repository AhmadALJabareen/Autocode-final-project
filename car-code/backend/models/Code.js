const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // مثال: P0420
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  suggestedParts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Part' }]
}, { timestamps: true });

module.exports = mongoose.model('Code', codeSchema);