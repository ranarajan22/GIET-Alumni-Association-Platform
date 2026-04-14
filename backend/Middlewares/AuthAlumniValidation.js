const Joi = require('joi');

// Signup validation middleware for Alumni
const signupAlumniValidation = (req, res, next) => {
  // Registration is disabled by policy; keep middleware pass-through.
  return next();
};

// Login validation middleware for Alumni
const loginAlumniValidation = (req, res, next) => {
  const schema = Joi.object({
    identifier: Joi.string().trim().allow('').optional(),
    collegeEmail: Joi.string().trim().allow('').optional(),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    }),
  });

  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((detail) => detail.message),
    });
  }

  const hasIdentifier = Boolean((req.body.identifier || '').trim() || (req.body.collegeEmail || '').trim());
  if (!hasIdentifier) {
    return res.status(400).json({
      message: 'Validation error',
      details: ['Roll number or email is required'],
    });
  }

  next(); // Proceed to the next middleware if validation passed
};

module.exports = {
  signupAlumniValidation,
  loginAlumniValidation,
};
