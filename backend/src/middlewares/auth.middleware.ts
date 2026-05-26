import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};

export const requirePermission = (routeReq: string, methodReq: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = req.user?.roleId;
      if (!roleId) {
        res.status(403).json({ success: false, message: 'Forbidden: No role assigned' });
        return;
      }

      const query = `
        SELECT p.id 
        FROM roles r
        JOIN permissions p ON p.id = ANY(r.permission_id)
        WHERE r.id = $1 AND p.route = $2 AND $3 = ANY(p.method)
      `;
      
      const result = await db.query(query, [roleId, routeReq, methodReq]);

      if (result.rows.length === 0) {
        res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
        return;
      }

      next();
    } catch (error) {
      console.error('[RBAC Error]', error);
      res.status(500).json({ success: false, message: 'Internal Server Error during authorization' });
    }
  };
};
