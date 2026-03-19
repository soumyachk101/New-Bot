import { Worker, Job } from 'bullmq';
import { config } from '../../config/index.js';

const worker = new Worker('broadcast', async (job: Job) => {
  const { broadcastId, message, targetGroups } = job.data;
  console.log(`Processing broadcast job ${broadcastId}: to ${targetGroups}`);
  // TODO: Implement broadcast message delivery
}, {
  connection: { url: config.redisUrl }
});

worker.on('failed', (job, err) => {
  console.error(`Broadcast job ${job?.id} failed:`, err);
});

export default worker;
