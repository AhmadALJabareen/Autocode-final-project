const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().optional(),
  phone: Joi.string().pattern(/^[0-9]{8,15}$/).optional(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});