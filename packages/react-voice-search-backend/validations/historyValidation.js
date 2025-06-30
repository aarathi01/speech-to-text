import Joi from "joi";

// For save
export const saveHistorySchema = Joi.object({
  query: Joi.string().trim().min(1).required().messages({
    "string.empty": "Query is required",
    "any.required": "Query is required",
  }),

  response: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        name: Joi.string().required(),
        category: Joi.string().required(),
        matchedWords: Joi.array().items(Joi.string()).optional(), 
      }).unknown(true) // Allow additional fields if any
    )
    .required(),
});

// For DELETE /:id
export const historyIdParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "any.required": "History ID is required",
    "string.length": "Invalid history ID",
    "string.hex": "Invalid history ID format",
  }),
});
