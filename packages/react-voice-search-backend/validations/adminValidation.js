import Joi from "joi";

// MongoDB ObjectId validator (24 hex chars)
export const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const historyIdParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
  historyId: Joi.string().length(24).hex().required(),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  country: Joi.string().pattern(/^[a-zA-Z\s]+$/),
  phone: Joi.string().pattern(/^\d{10}$/),
}).min(1); // At least one field must be present
