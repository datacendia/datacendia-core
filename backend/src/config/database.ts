// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { PrismaClient } from '@prisma/client';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: config.nodeEnv === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
});

if (config.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Middleware for logging slow queries
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  const duration = after - before;
  if (duration > 100) {
    logger.warn(`Slow query detected: ${params.model}.${params.action} took ${duration}ms`);
  }
  
  return result;
});

export default prisma;
