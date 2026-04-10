/**
 * Enterprise Service Base — shared Prisma document-store helpers
 * All Cendia* services use service_records as their typed document store.
 */

import { createHash } from 'crypto';
import prisma from '../../config/database.js';

export { prisma };

export function computeHash(data: unknown): string {
  return createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export async function sr_create<T extends { id: string }>(
  serviceName: string,
  recordType: string,
  data: T,
  orgId?: string,
  referenceId?: string
): Promise<T> {
  await prisma.service_records.create({
    data: {
      service_name: serviceName,
      record_type: recordType,
      organization_id: orgId,
      reference_id: referenceId ?? data.id,
      data: data as any,
      hash: computeHash(data),
    },
  });
  return data;
}

export async function sr_update<T extends { id: string }>(
  serviceName: string,
  recordType: string,
  id: string,
  data: T
): Promise<T> {
  await prisma.service_records.updateMany({
    where: { service_name: serviceName, record_type: recordType, reference_id: id },
    data: { data: data as any, hash: computeHash(data) },
  });
  return data;
}

export async function sr_list<T>(
  serviceName: string,
  recordType: string,
  orgId?: string
): Promise<T[]> {
  const records = await prisma.service_records.findMany({
    where: {
      service_name: serviceName,
      record_type: recordType,
      ...(orgId ? { organization_id: orgId } : {}),
    },
    orderBy: { created_at: 'desc' },
  });
  return records.map((r) => r.data as T);
}

export async function sr_get<T>(
  serviceName: string,
  recordType: string,
  id: string
): Promise<T | undefined> {
  const record = await prisma.service_records.findFirst({
    where: { service_name: serviceName, record_type: recordType, reference_id: id },
  });
  return record ? (record.data as T) : undefined;
}

export async function sr_delete(
  serviceName: string,
  recordType: string,
  id: string
): Promise<void> {
  await prisma.service_records.deleteMany({
    where: { service_name: serviceName, record_type: recordType, reference_id: id },
  });
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}
