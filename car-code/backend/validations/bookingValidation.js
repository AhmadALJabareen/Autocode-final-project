const Joi = require('joi');

exports.bookingCreateSchema = Joi.object({
  mechanicId: Joi.string().hex().length(24).optional(), // يمكن للمستخدم تحديد ميكانيكي معين أو تركه فاضي
  serviceType: Joi.string().valid('home', 'workshop').required(),
  location: Joi.string().min(3).required(),
  date: Joi.date().greater('now').required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/).required(), 
  notes: Joi.string().max(500).optional(),
  // slotId: Joi.string().hex().length(24).required(),
  slotId: Joi.string().hex().length(24).optional(),
});

