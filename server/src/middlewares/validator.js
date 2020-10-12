import { check, validationResult } from 'express-validator/check';

const getErrors = (req, next) => {
  const errors = validationResult(req)
    .array()
    .map(error => error.msg);
  if (!errors.length) {
    return next();
  }
  return errors;
};

export const handleValidation = async (req, res, next) => {
  const result = getErrors(req, next);
  return Array.isArray(result) ? res.status(400).json({ errors: result, status: 'error' }) : result;
};

export const validateLogin = [
  check('email')
    .trim()
    .isEmail()
    .withMessage('Email not provided or invalid'),
  check('password')
    .isString()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters'),
];

export const validateSignup = [
  ...validateLogin,
  check('fullname')
    .isString()
    .withMessage('Fullname is required')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Fullname should not be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Fullname should be at least 6 characters and not more than 50'),
];

