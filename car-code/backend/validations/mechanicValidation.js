const Joi = require('joi');

exports.mechanicCreateSchema = Joi.object({
  workshopName: Joi.string().required(),
  workSchedule: Joi.array().items(
    Joi.object({
      day: Joi.string().required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
    })
  ).optional(),
});