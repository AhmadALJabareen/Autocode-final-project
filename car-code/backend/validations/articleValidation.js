const Joi = require('joi');

exports.articleCreateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});