import * as groupRepo from './group.repository.js';
import type { Group } from '../types/index.js';

export async function getOrCreateGroup(waGroupId: string, name?: string): Promise<Group> {
  return groupRepo.findOrCreateGroup(waGroupId, name);
}

export async function isGroupBotEnabled(waGroupId: string): Promise<boolean> {
  const group = await groupRepo.findGroupById(waGroupId);
  return group?.botEnabled ?? true;
}

export async function enableGroupBot(waGroupId: string): Promise<Group> {
  return groupRepo.setGroupBotEnabled(waGroupId, true);
}

export async function disableGroupBot(waGroupId: string): Promise<Group> {
  return groupRepo.setGroupBotEnabled(waGroupId, false);
}

export async function listGroups(): Promise<Group[]> {
  return groupRepo.listGroups();
}
