import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { getWebhookRouter } from './webhook/webhook.controller.js';
import apiRoutes from './routes/api.routes.js';
import { config } from './config/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

const webhookLimiter = rateLimit({
  windowMs: config.rateLimit.webhook.windowMs,
  max: config.rateLimit.webhook.max,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/webhook', webhookLimiter);

app.use('/api/v1', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'WhatsApp Bot',
    version: '1.0.0',
    status: 'running'
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' }
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Web service listening on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
