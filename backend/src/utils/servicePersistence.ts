// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Shared Service Persistence Utility
 * 
 * Provides a lightweight persistence layer using the generic `service_records`
 * table. Services that don't need their own dedicated tables can use this
 * to persist records to Prisma with minimal boilerplate.
 */

import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { logger } from './logger.js';

/**
 * Persist a record to the generic service_records table.
 * Non-blocking — logs warnings on failure but never throws.
 */
export async function persistServiceRecord(params: {
  serviceName: string;
  recordType: string;
  organizationId?: string;
  referenceId?: string;
  data: unknown;
}): Promise<string | null> {
  try {
    const dataStr = JSON.stringify(params.data);
    const hash = crypto.createHash('sha256').update(dataStr).digest('hex');

    const record = await prisma.service_records.create({
      data: {
        service_name: params.serviceName,
        record_type: params.recordType,
        organization_id: params.organizationId || null,
        reference_id: params.referenceId || null,
        data: JSON.parse(dataStr),
        hash,
      },
    });
    return record.id;
  } catch (err) {
    logger.warn(`[ServicePersistence] Failed to persist ${params.serviceName}/${params.recordType}: ${(err as Error).message}`);
    return null;
  }
}

/**
 * Load records from the generic service_records table.
 */
export async function loadServiceRecords(params: {
  serviceName: string;
  recordType?: string;
  organizationId?: string;
  referenceId?: string;
  limit?: number;
  orderBy?: 'asc' | 'desc';
}): Promise<Array<{ id: string; data: unknown; hash: string | null; createdAt: Date }>> {
  try {
    const where: Record<string, unknown> = { service_name: params.serviceName };
    if (params.recordType) where.record_type = params.recordType;
    if (params.organizationId) where.organization_id = params.organizationId;
    if (params.referenceId) where.reference_id = params.referenceId;

    const records = await prisma.service_records.findMany({
      where,
      orderBy: { created_at: params.orderBy || 'desc' },
      take: params.limit || 100,
      select: { id: true, data: true, hash: true, created_at: true },
    });

    return records.map(r => ({ id: r.id, data: r.data, hash: r.hash, createdAt: r.created_at }));
  } catch (err) {
    logger.warn(`[ServicePersistence] Failed to load ${params.serviceName}: ${(err as Error).message}`);
    return [];
  }
}

/**
 * Count records for a service.
 */
export async function countServiceRecords(params: {
  serviceName: string;
  recordType?: string;
  organizationId?: string;
}): Promise<number> {
  try {
    const where: Record<string, unknown> = { service_name: params.serviceName };
    if (params.recordType) where.record_type = params.recordType;
    if (params.organizationId) where.organization_id = params.organizationId;

    return await prisma.service_records.count({ where });
  } catch {
    return 0;
  }
}
