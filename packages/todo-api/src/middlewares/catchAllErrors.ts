import { ErrorRequestHandler } from 'express';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';

export const catchAllErrors: ErrorRequestHandler = function (err, req, res, next) {
  console.error('Error Details:', '\n', err);
  if (!(err instanceof ResourceNotFoundError)) {
    if (!err.statusCode) err.statusCode = 500;
  }
  res.status(err.statusCode).json({
    message: err.message,
    errors: err.errors ?? []
  });
};
