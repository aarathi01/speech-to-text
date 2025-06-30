// For validating req.params
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { convert: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.params = value;
    next();
  };
};

// For validating req.body
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { convert: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
  };
};

// For validating req.query
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { convert: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    Object.assign(req.query, value);
    next();
  };
};
