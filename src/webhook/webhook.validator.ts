import crypto from 'crypto';
import { config } from '../config/index.js';

export function verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
  if (!signature || !signature.startsWith('sha256=')) {
    return false;
  }
  
  const expectedSignature = Buffer.from(signature.substring(7), 'hex');
  const computedSignature = Buffer.from(
    crypto
      .createHmac('sha256', (config.meta.accessToken as string) || '')
      .update(rawBody)
      .digest('hex'),
    'hex'
  );
  
  if (expectedSignature.length !== computedSignature.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(expectedSignature, computedSignature);
}

export function verifyWebhookToken(token: string): boolean {
  return token === config.meta.webhookVerifyToken;
}
