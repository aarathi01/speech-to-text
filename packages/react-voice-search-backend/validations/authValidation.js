import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  country: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.empty": "Country is required",
      "string.pattern.base": "Country can only contain letters and spaces",
    }),

  password: Joi.string().min(6).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
