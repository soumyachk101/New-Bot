import prisma from '../config/database.js';
import type { Group } from '../types/index.js';

export async function findGroupById(waGroupId: string): Promise<Group | null> {
  const group = await prisma.group.findUnique({
    where: { waGroupId }
  });
  return group as Group | null;
}

export async function findOrCreateGroup(waGroupId: string, name?: string): Promise<Group> {
  let group = await findGroupById(waGroupId);
  if (!group) {
    group = await prisma.group.create({
      data: { waGroupId, name }
    }) as Group;
  }
  return group;
}

export async function setGroupBotEnabled(waGroupId: string, enabled: boolean): Promise<Group> {
  const group = await prisma.group.update({
    where: { waGroupId },
    data: { botEnabled: enabled }
  });
  return group as Group;
}

export async function listGroups(): Promise<Group[]> {
  const groups = await prisma.group.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return groups as Group[];
}
