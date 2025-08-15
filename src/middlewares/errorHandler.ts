import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default to 500 Internal Server Error
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Optionally log the error
  console.error(err);

  res.status(status).json({
    success: false,
    error: {
      message,
    },
  });
}