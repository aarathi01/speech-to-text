import Joi from "joi";

export const searchSchema = Joi.object({
  q: Joi.string().trim().min(1).required().messages({
    "string.empty": "Search query is required",
    "any.required": "Search query is required",
  }),
});
