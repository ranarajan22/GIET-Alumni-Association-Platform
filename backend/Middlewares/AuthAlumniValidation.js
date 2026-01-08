const Joi = require('joi');

// Signup validation middleware for Alumni
const signupAlumniValidation = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required().messages({
      'string.empty': 'Full Name is required',
      'string.min': 'Full Name must be at least 3 characters long',
    }),
    graduationYear: Joi.number().integer().min(1900).max(2100).required().messages({
      'number.base': 'Graduation year must be a valid number',
      'number.min': 'Graduation year must be at least 1900',
      'number.max': 'Graduation year cannot be beyond 2100',
    }),
    collegeEmail: Joi.string()
      .pattern(/^[0-9]{2}[a-z]{3}[0-9]{3}\.[a-z0-9]+@giet\.edu$/i)
      .required()
      .messages({
        'string.empty': 'College Email is required',
        'string.pattern.base': 'Please provide a valid GIET email address (e.g., 21cse123.username@giet.edu)',
      }),
    registrationNumber: Joi.string().min(3).required().messages({
      'string.empty': 'Registration Number is required',
      'string.min': 'Registration Number must be at least 3 characters long',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password must match password',
    }),
    linkedin: Joi.string().uri().optional().messages({
      'string.uri': 'LinkedIn must be a valid URL',
    }),
    github: Joi.string().uri().optional().messages({
      'string.uri': 'GitHub must be a valid URL',
    }),
    degreeCertificate: Joi.any().optional(), // Optional field for uploading degree certificate link
    degreeCertificateImage: Joi.any().optional(), // Optional field for uploading degree certificate image
    profilePhoto: Joi.any().optional(), // Optional field for uploading profile photo
  });

  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((detail) => detail.message),
    });
  }

  next(); // Proceed to the next middleware if validation passed
};

// Login validation middleware for Alumni
const loginAlumniValidation = (req, res, next) => {
  const schema = Joi.object({
    collegeEmail: Joi.string()
      .pattern(/^[0-9]{2}[a-z]{3}[0-9]{3}\.[a-z0-9]+@giet\.edu$/i)
      .required()
      .messages({
        'string.empty': 'College Email is required',
        'string.pattern.base': 'Please provide a valid GIET email address (e.g., 22cse211.username@giet.edu)',
      }),
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

  next(); // Proceed to the next middleware if validation passed
};

module.exports = {
  signupAlumniValidation,
  loginAlumniValidation,
};
