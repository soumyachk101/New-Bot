import { Worker, Job } from 'bullmq';
import { config } from '../../config/index.js';

const worker = new Worker('media', async (job: Job) => {
  const { waMediaId, type, phone } = job.data;
  console.log(`Processing media job for ${phone}: [${type}] ${waMediaId}`);
  // TODO: Implement media processing (download, transcode, upload)
}, {
  connection: { url: config.redisUrl }
});

worker.on('failed', (job, err) => {
  console.error(`Media job ${job?.id} failed:`, err);
});

export default worker;
