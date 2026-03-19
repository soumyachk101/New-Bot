import 'dotenv/config';
import './queue/processors/tts.processor.js';
import './queue/processors/media.processor.js';
import './queue/processors/broadcast.processor.js';
import { cleanupExpiredMedia } from './media/media.service.js';

console.log('Worker service started');

setInterval(async () => {
  try {
    const count = await cleanupExpiredMedia();
    if (count > 0) {
      console.log(`Cleaned up ${count} expired media files`);
    }
  } catch (error) {
    console.error('Media cleanup error:', error);
  }
}, 60 * 60 * 1000);

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
