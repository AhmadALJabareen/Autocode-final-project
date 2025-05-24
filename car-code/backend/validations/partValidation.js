const Joi = require('joi');

exports.partCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  condition: Joi.string().valid('new', 'used').default('new'),
  available: Joi.boolean().default(true),
});