const Joi = require('joi');

exports.createSlotSchema = Joi.object({
  date: Joi.date().greater('now').required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/).required(), // HH:mm
});