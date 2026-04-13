/**
 * Configuration — Index
 *
 * Application configuration and service initialization.
 *
 * @exports config, Config
 * @module config/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore TS1470: import.meta used with CommonJS output (runtime uses tsx/ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3001),
  
  // Authentication mode
  requireAuth: z.string().optional().transform(v => v !== undefined && v !== '' && v !== '0' && v.toLowerCase() !== 'false').default('false'),
  demoMode: z.string().optional().transform(v => v !== undefined && v !== '' && v !== '0' && v.toLowerCase() !== 'false').default('false'),
  
  // Database
  databaseUrl: z.string().url(),
  
  // Redis
  redisUrl: z.string(),
  
  // Neo4j
  neo4jUri: z.string().default('bolt://localhost:7687'),
  neo4jUser: z.string().default('neo4j'),
  neo4jPassword: z.string().default('neo4j'),
  
  // Inference Provider (ollama | triton | nim)
  inferenceProvider: z.enum(['ollama', 'triton', 'nim']).default('ollama'),
  inferenceFailover: z.string().default('false'),

  // Ollama (default provider)
  ollamaBaseUrl: z.string().url().default('http://127.0.0.1:11434'),
  ollamaModel: z.string().default('qwen3:32b'),
  ollamaModelLarge: z.string().default('llama3.3:70b'),
  ollamaModelReasoning: z.string().default('deepseek-r1:32b'),
  ollamaModelCoder: z.string().default('qwen3-coder:30b'),
  ollamaModelFast: z.string().default('llama3.2:3b'),
  ollamaModelVision: z.string().default('qwen3-vl:30b'),

  // NVIDIA Triton Inference Server
  tritonBaseUrl: z.string().url().default('http://localhost:8000'),
  tritonModelName: z.string().default('ensemble'),

  // NVIDIA NIM (self-hosted)
  nimBaseUrl: z.string().url().default('http://localhost:8000'),
  nimModelName: z.string().default('meta/llama-3.1-70b-instruct'),
  
  // JWT
  jwtSecret: z.string().min(32),
  jwtRefreshSecret: z.string().min(32).optional(),
  jwtExpiresIn: z.string().default('1h'),
  jwtRefreshExpiresIn: z.string().default('30d'),
  
  // CORS
  corsOrigins: z.string().transform((val) => val.split(',').map((s) => s.trim())),
  
  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
});

// Build Redis URL from component env vars (no hardcoded password fallback)
const getRedisUrl = (): string => {
  if (process.env['REDIS_URL']) {
    return process.env['REDIS_URL'];
  }
  const redisPassword = process.env['REDIS_PASSWORD'];
  const redisHost = process.env['REDIS_HOST'] || 'localhost';
  const redisPort = process.env['REDIS_PORT'] || '6380';
  if (redisPassword) {
    return `redis://:${redisPassword}@${redisHost}:${redisPort}`;
  }
  return `redis://${redisHost}:${redisPort}`;
};

const envVars = {
  nodeEnv: process.env['NODE_ENV'],
  port: process.env['PORT'] || '3001',  // Default to 3001 if not set
  requireAuth: process.env.REQUIRE_AUTH,
  demoMode: process.env.DEMO_MODE,
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: getRedisUrl(),
  neo4jUri: process.env.NEO4J_URI,
  neo4jUser: process.env.NEO4J_USER,
  neo4jPassword: process.env.NEO4J_PASSWORD,
  inferenceProvider: process.env.INFERENCE_PROVIDER,
  inferenceFailover: process.env.INFERENCE_FAILOVER,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
  ollamaModel: process.env.OLLAMA_MODEL,
  ollamaModelFlagship: process.env.OLLAMA_MODEL_FLAGSHIP,
  ollamaModelFast: process.env.OLLAMA_MODEL_FAST,
  tritonBaseUrl: process.env.TRITON_BASE_URL,
  tritonModelName: process.env.TRITON_MODEL_NAME,
  nimBaseUrl: process.env.NIM_BASE_URL,
  nimModelName: process.env.NIM_MODEL_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000',
  logLevel: process.env.LOG_LEVEL,
};

const parsed = configSchema.safeParse(envVars);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  if (process.env.NODE_ENV === 'test') {
    throw new Error('Invalid environment variables: ' + JSON.stringify(parsed.error.flatten().fieldErrors));
  }
  process.exit(1);
}

// In production, require an independent JWT refresh secret
if (parsed.data.nodeEnv === 'production' && !parsed.data.jwtRefreshSecret) {
  console.error('❌ JWT_REFRESH_SECRET must be set in production (must differ from JWT_SECRET)');
  process.exit(1);
}

// In development/test, derive refresh secret from main secret if not provided
if (!parsed.data.jwtRefreshSecret) {
  (parsed.data as any).jwtRefreshSecret = parsed.data.jwtSecret + '-dev-refresh';
}

// In production, enforce authentication by default
if (parsed.data.nodeEnv === 'production' && !parsed.data.requireAuth && !parsed.data.demoMode) {
  console.warn('⚠️  REQUIRE_AUTH not set in production — defaulting to true. Set REQUIRE_AUTH=false explicitly to disable.');
  (parsed.data as any).requireAuth = true;
}

export const config = parsed.data as z.infer<typeof configSchema> & { jwtRefreshSecret: string };

export type Config = z.infer<typeof configSchema>;
