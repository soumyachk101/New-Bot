import prisma from '../config/database.js';
import { addBroadcastJob } from '../queue/queue.module.js';
import type { Broadcast } from '../types/index.js';

export interface CreateBroadcastInput {
  message: string;
  language: string;
  createdBy: string;
  targetGroups?: string[];
  scheduledAt?: Date;
}

export async function createBroadcast(input: CreateBroadcastInput): Promise<Broadcast> {
  const broadcast = await prisma.broadcast.create({
    data: {
      message: input.message,
      language: input.language,
      createdBy: input.createdBy,
      targetGroups: input.targetGroups || [],
      scheduledAt: input.scheduledAt,
      status: input.scheduledAt ? 'pending' : 'scheduled'
    }
  });
  
  if (!input.scheduledAt) {
    await addBroadcastJob({
      broadcastId: broadcast.id,
      message: input.message,
      language: input.language,
      targetGroups: input.targetGroups || []
    });
  } else {
    await addBroadcastJob({
      broadcastId: broadcast.id,
      message: input.message,
      language: input.language,
      targetGroups: input.targetGroups || []
    }, input.scheduledAt);
  }
  
  return broadcast as Broadcast;
}

export async function getBroadcast(id: number): Promise<Broadcast | null> {
  const broadcast = await prisma.broadcast.findUnique({
    where: { id }
  });
  return broadcast as Broadcast | null;
}

export async function listBroadcasts(): Promise<Broadcast[]> {
  const broadcasts = await prisma.broadcast.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  return broadcasts as Broadcast[];
}
