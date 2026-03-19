import { Queue, QueueEvents } from 'bullmq';
import { config } from '../config/index.js';

// Connection configuration
const connection = {
  url: config.redisUrl
};

// Queue instances
export const ttsQueue = new Queue('tts', { connection });
export const mediaQueue = new Queue('media', { connection });
export const broadcastQueue = new Queue('broadcast', { connection });

// Job addition helpers
export async function addTTSJob(data: { text: string; language: string; phone: string }) {
  return ttsQueue.add('tts-job', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}

export async function addMediaJob(data: { waMediaId: string; type: string; phone: string }) {
  return mediaQueue.add('media-job', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}

export async function addBroadcastJob(data: { broadcastId: number; message: string; language: string; targetGroups: string[] }, scheduledAt?: Date) {
  const options: any = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  };

  if (scheduledAt) {
    const delay = scheduledAt.getTime() - Date.now();
    if (delay > 0) {
      options.delay = delay;
    }
  }

  return broadcastQueue.add('broadcast-job', data, options);
}

// Queue Events (optional, for monitoring)
export const ttsEvents = new QueueEvents('tts', { connection });
export const mediaEvents = new QueueEvents('media', { connection });
export const broadcastEvents = new QueueEvents('broadcast', { connection });
