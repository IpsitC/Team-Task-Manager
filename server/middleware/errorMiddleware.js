import { validationResult } from 'express-validator';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  const error = new Error(errors.array().map((item) => item.msg).join(', '));
  error.statusCode = 422;
  next(error);
};

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    statusCode
  });
};
