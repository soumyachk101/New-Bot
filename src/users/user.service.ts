import * as userRepo from './user.repository.js';
import type { User } from '../types/index.js';

export async function getUser(phone: string): Promise<User | null> {
  return userRepo.findUserByPhone(phone);
}

export async function getOrCreateUser(phone: string, name?: string): Promise<User> {
  return userRepo.findOrCreateUser(phone, name);
}

export async function isUserBanned(phone: string): Promise<boolean> {
  const user = await userRepo.findUserByPhone(phone);
  return user?.banned ?? false;
}

export async function setUserLanguage(phone: string, language: string): Promise<User> {
  const validLanguages = ['en', 'hi', 'mr'];
  if (!validLanguages.includes(language)) {
    throw new Error(`Invalid language. Supported: ${validLanguages.join(', ')}`);
  }
  return userRepo.updateUserLanguage(phone, language);
}

export async function banUser(phone: string, adminPhone: string): Promise<User> {
  return userRepo.banUser(phone, adminPhone);
}

export async function unbanUser(phone: string): Promise<User> {
  return userRepo.unbanUser(phone);
}

export async function listUsers(page: number, limit: number) {
  return userRepo.listUsers(page, limit);
}
