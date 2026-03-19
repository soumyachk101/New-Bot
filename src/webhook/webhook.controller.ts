import { Router, Request, Response } from 'express';
import { config } from '../config/index.js';

export function getWebhookRouter(): Router {
  const router = Router();

  // GET /webhook - Meta verification challenge
  router.get('/', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.meta.webhookVerifyToken) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge);
      return;
    }

    res.status(403).end();
  });

  // POST /webhook - Handle inbound messages
  router.post('/', (req: Request, res: Response) => {
    // TODO: Implement signature validation (HMAC-SHA256)
    // TODO: Implement payload parsing and async processing
    console.log('Received webhook payload:', JSON.stringify(req.body, null, 2));
    res.status(200).send('EVENT_RECEIVED');
  });

  return router;
}
