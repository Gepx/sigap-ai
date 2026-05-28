import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware.js";
import { verifyToken, type DecodedToken } from "../utils/tokenHelper.js";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized - No token provided", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Unauthorized - Malformed token", 401));
    }

    const decodedToken = verifyToken(token);
    req.user = decodedToken;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError("Unauthorized - Invalid token", 401));
  }
}
