import { Request, Response, NextFunction } from 'express';
import { isAdmin, isOwner } from './admin.service.js';

export async function adminGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const phone = (req as any).user?.phone;
  
  if (!phone) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
    });
    return;
  }
  
  if (await isAdmin(phone)) {
    next();
    return;
  }
  
  res.status(403).json({
    error: { code: 'FORBIDDEN', message: 'Admin privileges required.' }
  });
}

export async function ownerGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const phone = (req as any).user?.phone;
  
  if (!phone) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
    });
    return;
  }
  
  if (await isOwner(phone)) {
    next();
    return;
  }
  
  res.status(403).json({
    error: { code: 'FORBIDDEN', message: 'Owner privileges required.' }
  });
}
