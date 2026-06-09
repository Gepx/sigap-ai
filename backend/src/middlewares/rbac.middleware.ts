import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware.js";

// Note: To use this middleware, req.user must have been populated by auth.middleware.ts
// and you must either fetch the user's permissions here or inject them during authentication.
// Since permissions check requires querying the DB or caching them in the JWT,
// ensure your token contains the user's allowed routes/methods, or fetch them here.

export const rbacMiddleware = (requiredRoute: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return next(new AppError("Unauthorized - No user context found", 401));
      }

      // For a robust implementation, you should query the user's permissions from the DB here
      // Example: const hasPermission = await checkUserPermission(user.uuid, requiredRoute, req.method);
      // For now, we allow it to pass but you should implement the exact DB check based on your needs.
      
      const hasPermission = true; // Replace with actual DB/JWT check

      if (!hasPermission) {
        return next(new AppError("Forbidden - You do not have permission to access this resource", 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
