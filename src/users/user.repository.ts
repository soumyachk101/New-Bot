import prisma from '../config/database.js';
import type { User } from '../types/index.js';

export async function findUserByPhone(phone: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { phone }
  });
  return user as User | null;
}

export async function createUser(phone: string, name?: string): Promise<User> {
  const user = await prisma.user.create({
    data: { phone, name }
  });
  return user as User;
}

export async function findOrCreateUser(phone: string, name?: string): Promise<User> {
  let user = await findUserByPhone(phone);
  if (!user) {
    user = await createUser(phone, name);
  }
  return user;
}

export async function updateUserLanguage(phone: string, language: string): Promise<User> {
  const user = await prisma.user.update({
    where: { phone },
    data: { language }
  });
  return user as User;
}

export async function banUser(phone: string, bannedBy: string): Promise<User> {
  const user = await prisma.user.update({
    where: { phone },
    data: {
      banned: true,
      bannedBy,
      bannedAt: new Date()
    }
  });
  return user as User;
}

export async function unbanUser(phone: string): Promise<User> {
  const user = await prisma.user.update({
    where: { phone },
    data: {
      banned: false,
      bannedBy: null,
      bannedAt: null
    }
  });
  return user as User;
}

export async function listUsers(page: number = 1, limit: number = 20): Promise<{ data: User[]; total: number; page: number; limit: number }> {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);
  
  return {
    data: users as User[],
    total,
    page,
    limit
  };
}
