// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Datacendia Platform — Backend API Server (Express)
 *
 * Application entrypoint. Initializes Express with security middleware (Helmet,
 * CORS, rate limiting, CSRF), mounts all API route handlers, connects to
 * PostgreSQL via Prisma, Redis for caching, and starts a Socket.IO WebSocket
 * server for real-time Council deliberation updates.
 *
 * @module index
 * @see {@link config/index} for environment configuration
 * @see {@link routes/} for all API route definitions
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { SocketServer } from './websocket/SocketServer.js';
import { rateLimit } from 'express-rate-limit';

import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/database.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { redis } from './config/redis.js';
import { neo4j } from './config/neo4j.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import cookieParser from 'cookie-parser';

// Security Hardening
import { 
  threatDetectionMiddleware,
  // advancedRateLimitMiddleware, // Available for future use
  // createAuditLog // Available for future use
} from './security/SecurityHardening.js';
import { customSecurityHeaders } from './security/headers.js';
import { 
  masterSecurityMiddleware,
  preventDataExfiltration,
  preventReplayAttack 
} from './security/DefenseInDepth.js';
import { honeypotMiddleware } from './security/Honeypot.js';
import { csrfProtection, csrfTokenHandler, ensureCsrfToken } from './middleware/csrf.js';
import { 
  inputSanitizationMiddleware,
  pathTraversalMiddleware,
  sqlInjectionMiddleware,
} from './middleware/SecurityMiddleware.js';

// Telemetry & Enterprise Services
import { initTracing } from './telemetry/tracing.js';
import { sentry } from './telemetry/sentry.js';
import { policyEngine } from './security/PolicyEngine.js';
import { databaseBackupService } from './services/backup/index.js';
import { vectorDB } from './services/vectordb/index.js';

// Initialize OpenTelemetry tracing (must be before other imports that need instrumentation)
initTracing();

// Domain Routers - 14 logical groups replacing 110+ individual route imports
import {
  authDomain,
  councilDomain,
  dataDomain,
  governanceDomain,
  securityDomain,
  sovereignDomain,
  enterpriseDomain,
  legalDomain,
  verticalsDomain,
  platformDomain,
  simulationDomain,
  workflowsDomain,
  intelligenceDomain,
  demoDomain,
} from './routes/domains/index.js';

// Special routes that need non-standard mounting
import prometheusRoutes from './routes/prometheus.js';
import recallRoutes from './routes/recall.js';
import euBankingRoutes from './routes/eu-banking.js';
import kafkaRoutes from './routes/kafka.js';
import guardrailsRoutes from './routes/guardrails.js';
import opaRoutes from './routes/opa.js';
import temporalRoutes from './routes/temporal.js';
import openbaoRoutes from './routes/openbao.js';
import rapidsRoutes from './routes/rapids.js';
import flinkRoutes from './routes/flink.js';
import { registerPlatformServices } from './core/services/PlatformServices.js';
import { applyPerformanceIndexes } from './startup/applyIndexes.js';
import { apiCache, CACHE_TTLS } from './middleware/cacheMiddleware.js';

// WebSocket handlers
import { setupWebSocketHandlers } from './websocket/index.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with Redis adapter for scaling
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Security middleware
// =============================================================================
// LIVENESS PROBE - Must be before ALL middleware for Kubernetes/Docker health checks
// =============================================================================
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/liveness', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/readiness', async (_req, res) => {
  // Basic readiness - could add DB/Redis checks here
  res.status(200).send('OK');
});

// Prometheus metrics - before middleware so scraping works without auth
app.use('/metrics', prometheusRoutes);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS configuration - allow any localhost/127.0.0.1 origin in development
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost or 127.0.0.1 origin
    if (config.nodeEnv === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // Check against configured origins
    if (config.corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Data-Source-Id', 'x-data-source-id'],
}));

// Rate limiting (higher limit for dev/test)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: config.nodeEnv === 'production' ? 100 : 1000, // Higher limit in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  skip: () => config.nodeEnv === 'test', // Skip in test environment
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for CSRF tokens
app.use(cookieParser());

// Compression
app.use(compression());

// Request logging
app.use(requestLogger);

// CendiaCrucible™ Security Middleware - Adversarial Defense
app.use(pathTraversalMiddleware);
app.use(sqlInjectionMiddleware);
app.use('/api/v1/council', inputSanitizationMiddleware); // Prompt injection defense

// Custom security headers
app.use(customSecurityHeaders);

// Honeypot/deception - catches attackers probing for vulnerabilities
app.use(honeypotMiddleware);

// Master security middleware (all attack protections)
if (config.nodeEnv === 'production') {
  app.use(masterSecurityMiddleware);
  app.use(preventReplayAttack);
  app.use(preventDataExfiltration);
  app.use(threatDetectionMiddleware);
}
// NOTE: Threat detection disabled in dev - SQL patterns too aggressive for AI content

// Legal Research API - Public access for testing (no auth required in dev)
// Must be BEFORE CSRF middleware to allow unauthenticated access
// Enterprise module — loaded dynamically for Community Edition compatibility
if (config.nodeEnv === 'development') {
  import('./routes/legal-research.js').then(mod => {
    app.use('/api/v1/legal-research', mod.default as any);
    logger.info('📚 Legal Research API available at /api/v1/legal-research (no auth in dev)');
  }).catch(() => { /* Enterprise module not available */ });
}

// CSRF Protection - apply to state-changing API routes
// Token endpoint is exempt so clients can get initial token
app.get('/api/v1/csrf-token', csrfTokenHandler);
app.use('/api/', ensureCsrfToken);
if (config.nodeEnv === 'production') {
  app.use('/api/', csrfProtection);
}

// NOTE: /health endpoint is defined BEFORE middleware (line ~143) for liveness probes

// OpenAPI/Swagger Documentation (dev only)
if (config.nodeEnv === 'development') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Datacendia API Documentation',
  }));
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  logger.info('📚 API Documentation available at /api/docs');
}

// =============================================================================
// UNIVERSAL REDIS CACHE - Applied to all GET requests (40-60% faster responses)
// Automatically invalidates on POST/PUT/DELETE mutations
// =============================================================================
app.use('/api/v1', apiCache({
  ttl: CACHE_TTLS.DECISIONS,
  varyByOrg: true,
  excludePaths: [
    /\/auth\//,
    /\/csrf-token/,
    /\/upload/,
    /\/ws/,
    /\/stream/,
    /\/council\/query/,   // Never cache active deliberation queries
    /\/marketing-studio/, // Never cache AI generation responses
    /\/platform-assistant/, // Never cache AI assistant responses
  ],
}));

// =============================================================================
// API ROUTES - Domain Routers (14 domains, ~110 route modules)
// All paths remain identical: /api/v1/{original-path}
// =============================================================================
app.use('/api/v1', authDomain);        // auth, users, organizations
app.use('/api/v1', councilDomain);     // council, deliberations, decisions, veto, union, dissent, vox, echo
app.use('/api/v1', dataDomain);        // metrics, alerts, forecasts, data-sources, lineage, druid, rag, graph, horizon
app.use('/api/v1', governanceDomain);  // compliance, govern, panopticon, pillars, responsibility, constitutional-court
app.use('/api/v1', securityDomain);    // crucible, aegis, kms, post-quantum, zkp, adversarial-redteam, redteam
app.use('/api/v1', sovereignDomain);   // sovereign-organs, sovereign-infra, sovereign-arch, vault, evidence, mesh, eternal
app.use('/api/v1', enterpriseDomain);  // enterprise, ledger, audit-packages, ai-insurance, cascade, connectors, hr
app.use('/api/v1', legalDomain);       // legal, legal-research, legal-services
app.use('/api/v1', verticalsDomain);   // financial, healthcare, insurance, energy, defense, sports, vertical-agents
app.use('/api/v1', platformDomain);    // platform, core, cortex, admin, settings, health, i18n, notifications, upload
app.use('/api/v1', simulationDomain);  // sgas, scge, collapse
app.use('/api/v1', workflowsDomain);   // workflows, integrations, scheduler
app.use('/api/v1', intelligenceDomain); // persona, autopilot, decision-intel, gnosis, apotheosis, visualization
app.use('/api/v1', demoDomain);        // leads, premium, demo, consolidated
// Express Intelligence — enterprise route loaded dynamically
import('./routes/express.js').then(mod => {
  app.use('/api/v1/express', mod.default as any);
}).catch(() => { /* Enterprise module not available */ });
app.use('/api/v1', recallRoutes);          // CendiaRecall™ - Decision Outcome Tracking
app.use('/api/v1/eu-banking', euBankingRoutes); // EU Banking - Basel III + EU AI Act compliance
app.use('/api/v1/kafka', kafkaRoutes);               // Kafka admin & monitoring
app.use('/api/v1/guardrails', guardrailsRoutes);     // NeMo Guardrails admin & evaluation
app.use('/api/v1/opa', opaRoutes);                   // Open Policy Agent policy-as-code
app.use('/api/v1/temporal', temporalRoutes);         // Temporal.io workflow orchestration
app.use('/api/v1/openbao', openbaoRoutes);           // OpenBao/Vault secrets & KMS
app.use('/api/v1/rapids', rapidsRoutes);             // NVIDIA RAPIDS GPU analytics + Confidential Computing
app.use('/api/v1/flink', flinkRoutes);               // Apache Flink CEP stream processing

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Resource not found' },
  });
});

// Sentry error tracking middleware (must be BEFORE errorHandler to capture errors)
if (sentry.isEnabled()) {
  app.use(sentry.errorHandler());
}

// Global error handler
app.use(errorHandler);

// Setup WebSocket handlers
setupWebSocketHandlers(io);

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  httpServer.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await prisma.$disconnect();
      logger.info('PostgreSQL connection closed');
      
      await redis.quit();
      logger.info('Redis connection closed');
      
      await neo4j.close();
      logger.info('Neo4j connection closed');

      await vectorDB.shutdown();
      logger.info('Qdrant connection closed');

      databaseBackupService.stopScheduler();
      logger.info('Backup scheduler stopped');
      
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Global SocketServer instance
let socketServer: SocketServer | null = null;

// Start server
const startServer = async () => {
  try {
    const listenHost = config.nodeEnv === 'development' && process.platform === 'win32'
      ? '127.0.0.1'
      : undefined;

    // ── Auth Mode Guard ─────────────────────────────────────────────────
    if (config.nodeEnv === 'production' && !config.requireAuth) {
      logger.error('⛔ SECURITY: REQUIRE_AUTH is not enabled in production. Set REQUIRE_AUTH=true.');
      logger.error('⛔ Dev auth bypass could be active. Refusing to start.');
      process.exit(1);
    }
    const authMode = config.requireAuth ? 'enforced' : (config.nodeEnv === 'development' ? 'dev-bypass' : 'enforced');
    logger.info(`🔐 Auth mode: ${authMode} (REQUIRE_AUTH=${config.requireAuth}, NODE_ENV=${config.nodeEnv})`);

    httpServer.listen(config.port, listenHost, () => {
      logger.info(`🚀 Datacendia API running on port ${config.port}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
    });

    // Initialize WebSocket server after HTTP server starts
    try {
      socketServer = new SocketServer(httpServer);
      logger.info('[WebSocket] Real-time streaming enabled');
    } catch (error) {
      logger.error('[WebSocket] Failed to initialize:', error);
    }

    // Test database connections with timeouts
    const timeout = (ms: number, promise: Promise<any>, name: string) =>
      Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`${name} connection timeout`)), ms)
        ),
      ]);

    // PostgreSQL
    try {
      await timeout(5000, prisma.$connect(), 'PostgreSQL');
      logger.info('Connected to PostgreSQL');

      // Auto-apply performance indexes (idempotent - safe to run every startup)
      try {
        await applyPerformanceIndexes(prisma);
      } catch (indexErr) {
        logger.warn('Performance indexes could not be applied:', indexErr);
      }
    } catch (e) {
      logger.warn('PostgreSQL connection failed - some features may be unavailable:', e);
    }

    // Redis
    try {
      await timeout(3000, redis.ping(), 'Redis');
      logger.info('Connected to Redis');
    } catch (e) {
      logger.warn('Redis connection failed - caching disabled:', e);
    }

    // Neo4j (optional - don't block startup)
    try {
      const neo4jSession = neo4j.session();
      await timeout(3000, neo4jSession.run('RETURN 1'), 'Neo4j');
      await neo4jSession.close();
      logger.info('Connected to Neo4j');
    } catch (e) {
      logger.warn('Neo4j connection failed - graph features disabled:', e);
    }

    // Qdrant Vector Database (optional - degrades gracefully to TF-IDF)
    try {
      const vectorReady = await vectorDB.initialize();
      if (vectorReady) {
        logger.info('Connected to Qdrant — CendiaVector™ neural search enabled');
      } else {
        logger.warn('Qdrant unavailable — using TF-IDF fallback for similarity search');
      }
    } catch (e) {
      logger.warn('Qdrant initialization failed — vector search disabled:', e);
    }

    // Register platform services with health monitoring
    try {
      await registerPlatformServices();
      logger.info('Platform services registered');
    } catch (e) {
      logger.warn('Platform services registration failed:', e);
    }

    // Initialize Casbin policy engine
    try {
      await policyEngine.initialize();
      logger.info('Policy engine initialized');
    } catch (e) {
      logger.warn('Policy engine initialization failed:', e);
    }

    // Kafka durable event streaming (optional — set KAFKA_ENABLED=true)
    try {
      const { kafka: kafkaService } = await import('./services/kafka/KafkaService.js');
      await kafkaService.connect();
      const { kafkaEventBridge } = await import('./services/kafka/KafkaEventBridge.js');
      await kafkaEventBridge.initialize();
      logger.info('[Kafka] Durable event streaming initialized');
    } catch (e) {
      logger.warn('[Kafka] Event streaming initialization failed — using in-memory buffer:', e);
    }

    // Temporal.io durable workflow orchestration (optional — set TEMPORAL_ENABLED=true)
    try {
      const { temporal: temporalService } = await import('./services/temporal/TemporalService.js');
      await temporalService.connect();
      logger.info('[Temporal] Workflow orchestration initialized');
    } catch (e) {
      logger.warn('[Temporal] Workflow orchestration initialization failed — using embedded mode:', e);
    }

    // OpenBao/Vault secrets management (optional — set OPENBAO_ENABLED=true)
    try {
      const { openBao } = await import('./services/vault/OpenBaoService.js');
      await openBao.connect();
      logger.info('[OpenBao] Secrets management initialized');
    } catch (e) {
      logger.warn('[OpenBao] Secrets management initialization failed:', e);
    }

    // NVIDIA RAPIDS GPU analytics (optional — set RAPIDS_ENABLED=true)
    try {
      const { rapids } = await import('./services/gpu/RAPIDSService.js');
      await rapids.connect();
      logger.info('[RAPIDS] GPU analytics initialized');
    } catch (e) {
      logger.warn('[RAPIDS] GPU analytics initialization failed — using CPU fallback:', e);
    }

    // Start Chronos Event Bus flush scheduler (retries failed event writes)
    try {
      const { chronosEventBus } = await import('./services/ChronosEventBus.js');
      chronosEventBus.startFlushScheduler(30000); // Every 30 seconds
      logger.info('[Chronos] Event bus flush scheduler started');
    } catch (e) {
      logger.warn('[Chronos] Event bus scheduler failed to start:', e);
    }

    // Start Echo automated outcome collection scheduler
    try {
      const { echoService } = await import('./services/echoService.js');
      echoService.startCollectionScheduler(60 * 60 * 1000); // Every hour
      logger.info('[Echo] Automated collection scheduler started');
    } catch (e) {
      logger.warn('[Echo] Collection scheduler failed to start:', e);
    }

    // Start automated database backup scheduler (production only)
    try {
      if (databaseBackupService.isEnabled()) {
        databaseBackupService.startScheduler();
        logger.info('[CendiaBackup] Automated backup scheduler started');
      } else {
        logger.info('[CendiaBackup] Backups disabled (set BACKUP_ENABLED=true for production)');
      }
    } catch (e) {
      logger.warn('[CendiaBackup] Backup scheduler failed to start:', e);
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io, socketServer };
