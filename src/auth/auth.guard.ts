import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './auth.service.js';
import { config } from '../config/index.js';
import prisma from '../config/database.js';
import type { JwtPayload, Role } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid or missing token.' }
    });
    return;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.' }
    });
  }
}

export function requireRole(...roles: Role[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
      return;
    }
    
    const userPhone = req.user.phone;
    const isOwner = userPhone === config.owner.phone;
    const isAdmin = isOwner || (await checkIsAdmin(userPhone));
    
    if (isOwner || roles.includes('admin') && isAdmin) {
      req.user.role = isOwner ? 'owner' : 'admin';
      next();
      return;
    }
    
    if (roles.includes(req.user.role)) {
      next();
      return;
    }
    
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Insufficient permissions.' }
    });
  };
}

async function checkIsAdmin(phone: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({
    where: { phone }
  });
  return !!admin;
}
