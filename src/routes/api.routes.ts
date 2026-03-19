import { Router } from 'express';
import { getWebhookRouter } from '../webhook/webhook.controller.js';

const router = Router();

// Webhook routes
router.use('/webhook', getWebhookRouter());

// TODO: Other API routes (users, admins, broadcast, groups)
// router.use('/users', userRouter);
// router.use('/admins', adminRouter);
// router.use('/broadcast', broadcastRouter);
// router.use('/groups', groupRouter);

export default router;
