import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Support guest/demo fallback if needed, or enforce 401
      return res.status(401).json({ error: 'Authorization token missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'viroai_jwt_super_secret_key_2026_marketing_agents';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role?: string };

    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
}

// Optional auth for public preview/demo endpoints
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'viroai_jwt_super_secret_key_2026_marketing_agents';
      const decoded = jwt.verify(token, secret) as { id: string; email: string; role?: string };
      req.user = decoded;
    }
  } catch {
    // silently proceed as guest
  }
  next();
}
