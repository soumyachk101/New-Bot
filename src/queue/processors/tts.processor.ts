import { Worker, Job } from 'bullmq';
import { config } from '../../config/index.js';

const worker = new Worker('tts', async (job: Job) => {
  const { text, language, phone } = job.data;
  console.log(`Processing TTS job for ${phone}: [${language}] ${text}`);
  // TODO: Implement TTS provider call (Google/Azure)
}, {
  connection: { url: config.redisUrl }
});

worker.on('failed', (job, err) => {
  console.error(`TTS job ${job?.id} failed:`, err);
});

export default worker;
