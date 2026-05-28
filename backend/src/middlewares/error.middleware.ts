import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { logger } from "../config/logger.js";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (res.headersSent) {
    return _next(err);
  }
  logger.error(`[${req.method}] ${req.path} - ${err.name}: ${err.message}`);

  if (process.env.NODE_ENV === "development") {
    logger.error(err.stack);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Problem occurs in server.";

  res.status(500).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
