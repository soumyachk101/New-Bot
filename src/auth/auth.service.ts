import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import type { JwtPayload, Role } from '../types/index.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function generateTokens(phone: string, role: Role): TokenPair {
  const payload: JwtPayload = { phone, role };
  
  const accessToken = jwt.sign(payload as object, config.auth.jwt.secret as string, {
    expiresIn: 3600,
  });
  
  const refreshToken = jwt.sign(payload as object, config.auth.jwt.refreshSecret as string, {
    expiresIn: 604800,
  });
  
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.auth.jwt.secret as string) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, config.auth.jwt.refreshSecret as string) as JwtPayload;
}

export function refreshAccessToken(refreshToken: string): TokenPair | null {
  try {
    const payload = verifyRefreshToken(refreshToken);
    return generateTokens(payload.phone, payload.role);
  } catch {
    return null;
  }
}
