import Joi from "joi";

// MongoDB ObjectId validator (24 hex chars)
export const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const adminDeleteHistorySchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "any.required": "User ID is required",
    "string.length": "User ID must be 24 characters",
    "string.hex": "Invalid User ID format",
  }),
  historyId: Joi.string().length(24).hex().required().messages({
    "any.required": "History ID is required",
    "string.length": "History ID must be 24 characters",
    "string.hex": "Invalid History ID format",
  }),
});

export const historyIdParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "any.required": "History ID is required",
    "string.length": "History ID must be 24 characters",
    "string.hex": "Invalid history ID format",
  }),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  country: Joi.string().pattern(/^[a-zA-Z\s]+$/),
  phone: Joi.string().pattern(/^\d{10}$/),
}).min(1); // At least one field must be present
