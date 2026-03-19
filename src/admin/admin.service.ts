import prisma from '../config/database.js';
import { config } from '../config/index.js';
import type { Admin } from '../types/index.js';

export async function isOwner(phone: string): Promise<boolean> {
  return phone === config.owner.phone;
}

export async function isAdmin(phone: string): Promise<boolean> {
  if (await isOwner(phone)) return true;
  
  const admin = await prisma.admin.findUnique({
    where: { phone }
  });
  
  return !!admin;
}

export async function addAdmin(phone: string, addedBy: string, name?: string): Promise<Admin> {
  const admin = await prisma.admin.create({
    data: { phone, addedBy, name }
  });
  return admin as Admin;
}

export async function removeAdmin(phone: string): Promise<void> {
  await prisma.admin.delete({
    where: { phone }
  });
}

export async function listAdmins(): Promise<Admin[]> {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return admins as Admin[];
}
