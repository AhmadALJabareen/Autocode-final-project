// const Joi = require('joi');

// exports.codeCreateSchema = Joi.object({
//   code: Joi.string().alphanum().min(4).max(8).required(),
//   problem: Joi.string().required(),
//   solution: Joi.string().required(),
//   suggestedParts: Joi.array().items(Joi.string().hex().length(24)).optional(),
// });

const Joi = require('joi');

exports.codeSearchSchema = Joi.object({
  code: Joi.string().alphanum().min(4).max(8).required(),
});