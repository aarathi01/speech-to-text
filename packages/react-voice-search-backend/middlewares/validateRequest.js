// For validating req.params
export const validateParams = (schema) => {
  return (req, res, next) => {
    // Uses Joi to check if req.body matches the schema, { convert: true } Automatically casts values (e.g., string "5" to number 5 or "true" into a boolean.)
    const { error, value } = schema.validate(req.params, { convert: true });
    if (error) {
      // If Joi finds a mismatch, it sends a 400 response
      return res.status(400).json({ error: error.details[0].message });
    }
    // overwrite , To replace the raw, potentially unsafe data with Joi’s cleaned, sanitized version.
    req.params = value;
    // Passes control to the next middleware or controller
    next();
  };
};

// For validating req.body
// It validates req.body against a Joi schema. If invalid, it responds with status 400 and the error message.
// If valid, it replaces req.body with the validated version.
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { convert: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Replaces the request body with the validated and cleaned version
    req.body = value;
    next();
  };
};

// For validating req.query
// Validates URL query strings, like ?limit=10&page=2
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { convert: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // This ensures we don't overwrite req.query completely, but extend it.
    Object.assign(req.query, value);
    next();
  };
};
