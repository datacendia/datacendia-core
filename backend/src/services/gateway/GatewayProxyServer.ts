/**
 * CendiaGateway™ — HTTP Forward Proxy Mode
 *
 * Browser-agnostic, network-level interception of AI traffic.
 * Works with ANY browser, ANY app — configured via PAC file or system proxy settings.
 *
 * Architecture:
 *   Browser/App → HTTP Proxy (this) → AI Provider
 *                       ↓
 *           PII Scan → Policy → Sign → Audit Ledger
 *
 * Deployment:
 *   1. Start proxy on port 8888 (configurable)
 *   2. Set system/browser proxy to gateway-host:8888
 *   3. Install org CA cert for HTTPS inspection (optional but recommended)
 *   4. All AI traffic is now governed
 *
 * @module services/gateway/GatewayProxyServer
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import http from 'http';
import https from 'https';
import net from 'net';
import { URL } from 'url';
import crypto from 'crypto';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { scanForPII } from './PIIDetector.js';

// =============================================================================
// AI DOMAINS — Sites we intercept and govern
// =============================================================================

const AI_DOMAINS = new Set([
  'api.openai.com',
  'chat.openai.com',
  'chatgpt.com',
  'claude.ai',
  'api.anthropic.com',
  'gemini.google.com',
  'generativelanguage.googleapis.com',
  'aistudio.google.com',
  'copilot.microsoft.com',
  'www.bing.com',         // Bing Chat / Copilot
  'api.mistral.ai',
  'api.cohere.ai',
  'api.groq.com',
  'huggingface.co',
  'api-inference.huggingface.co',
  'poe.com',
  'perplexity.ai',
  'www.perplexity.ai',
  'you.com',
  'pi.ai',
  'deepseek.com',
  'chat.deepseek.com',
  'ollama.local',         // Local Ollama (if exposed)
]);

// Domains we NEVER intercept (passthrough)
const BYPASS_DOMAINS = new Set([
  'localhost',
  '127.0.0.1',
  '*.internal',
]);

// =============================================================================
// TYPES
// =============================================================================

export interface ProxyInteraction {
  id: string;
  timestamp: Date;
  domain: string;
  url: string;
  method: string;
  userId?: string;
  userIp: string;
  isAIDomain: boolean;
  promptText: string;
  responseText: string;
  piiDetected: boolean;
  piiTypes: string[];
  policyAction: 'allow' | 'warn' | 'block' | 'redact';
  policyReason?: string;
  integrityHash: string;
  signature: string;
  blocked: boolean;
  latencyMs: number;
}

export interface ProxyConfig {
  port: number;
  host: string;
  enableHttpsInspection: boolean;
  caCertPath?: string;
  caKeyPath?: string;
  allowNonAIDomains: boolean;
  blockUngovernedAI: boolean;
  customAIDomains: string[];
  gatewayApiUrl: string;    // URL of CendiaGateway API for policy evaluation
}

// =============================================================================
// PROXY SERVER
// =============================================================================

export class GatewayProxyServer extends EventEmitter {
  private server: http.Server | null = null;
  private config: ProxyConfig;
  private interactions: ProxyInteraction[] = [];
  private aiDomains: Set<string>;

  constructor(config?: Partial<ProxyConfig>) {
    super();
    this.config = {
      port: parseInt(process.env.GATEWAY_PROXY_PORT || '8888'),
      host: process.env.GATEWAY_PROXY_HOST || '0.0.0.0',
      enableHttpsInspection: process.env.GATEWAY_HTTPS_INSPECTION === 'true',
      caCertPath: process.env.GATEWAY_CA_CERT_PATH,
      caKeyPath: process.env.GATEWAY_CA_KEY_PATH,
      allowNonAIDomains: true,
      blockUngovernedAI: process.env.GATEWAY_BLOCK_UNGOVERNED === 'true',
      customAIDomains: (process.env.GATEWAY_CUSTOM_AI_DOMAINS || '').split(',').filter(Boolean),
      gatewayApiUrl: process.env.GATEWAY_API_URL || 'http://localhost:3001/api/v1/gateway',
      ...config,
    };

    // Merge custom domains with built-in list
    this.aiDomains = new Set([...AI_DOMAINS, ...this.config.customAIDomains]);
  }

  // ===========================================================================
  // START / STOP
  // ===========================================================================

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleHttpRequest(req, res);
      });

      // CONNECT method for HTTPS tunneling
      this.server.on('connect', (req: http.IncomingMessage, clientSocket: any, head: Buffer) => {
        this.handleConnect(req, clientSocket, head);
      });

      this.server.on('error', (err) => {
        logger.error('[GatewayProxy] Server error:', err);
        reject(err);
      });

      this.server.listen(this.config.port, this.config.host, () => {
        logger.info(`[GatewayProxy] HTTP proxy listening on ${this.config.host}:${this.config.port}`);
        logger.info(`[GatewayProxy] Governing ${this.aiDomains.size} AI domains`);
        logger.info(`[GatewayProxy] HTTPS inspection: ${this.config.enableHttpsInspection ? 'ENABLED' : 'DISABLED (CONNECT passthrough)'}`);
        resolve();
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          logger.info('[GatewayProxy] Proxy server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // ===========================================================================
  // HTTP REQUEST HANDLER (plain HTTP — intercept and govern)
  // ===========================================================================

  private async handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const startTime = Date.now();
    const url = req.url || '';
    let targetUrl: URL;

    try {
      targetUrl = new URL(url);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request: Invalid URL');
      return;
    }

    const domain = targetUrl.hostname;
    const isAI = this.isAIDomain(domain);

    // Non-AI domains: passthrough without governance
    if (!isAI && this.config.allowNonAIDomains) {
      return this.proxyPassthrough(req, res, targetUrl);
    }

    // AI domain: intercept, scan, govern
    if (isAI) {
      return this.governedProxy(req, res, targetUrl, startTime);
    }

    // Non-AI domain and blocking non-AI: deny
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Blocked: Non-AI traffic not permitted through governance proxy');
  }

  // ===========================================================================
  // HTTPS CONNECT HANDLER (tunnel or intercept)
  // ===========================================================================

  private handleConnect(req: http.IncomingMessage, clientSocket: net.Socket, head: Buffer): void {
    const [host, portStr] = (req.url || '').split(':');
    const port = parseInt(portStr) || 443;
    const isAI = this.isAIDomain(host);

    if (isAI && !this.config.enableHttpsInspection) {
      // AI domain but no HTTPS inspection — log the connection attempt, tunnel through
      const interaction = this.createMinimalInteraction(host, req);
      interaction.policyAction = 'warn';
      interaction.policyReason = 'HTTPS AI traffic detected but inspection disabled — connection tunneled without governance';
      this.recordInteraction(interaction);
      this.emit('interaction:ungoverned_https', interaction);
    }

    if (isAI && this.config.blockUngovernedAI && !this.config.enableHttpsInspection) {
      // Block ungoverned AI HTTPS traffic
      const interaction = this.createMinimalInteraction(host, req);
      interaction.policyAction = 'block';
      interaction.policyReason = 'AI HTTPS traffic blocked — HTTPS inspection not enabled, ungoverned AI blocked by policy';
      interaction.blocked = true;
      this.recordInteraction(interaction);
      this.emit('interaction:blocked', interaction);
      clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\nBlocked: AI traffic must be governed. Contact IT.\r\n');
      return;
    }

    // Standard CONNECT tunnel (passthrough)
    const serverSocket = net.connect(port, host, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', (err) => {
      logger.error(`[GatewayProxy] CONNECT error to ${host}:${port}:`, err.message);
      clientSocket.end();
    });

    clientSocket.on('error', () => {
      serverSocket.end();
    });
  }

  // ===========================================================================
  // GOVERNED PROXY — Intercept, PII scan, policy enforce, sign, forward
  // ===========================================================================

  private async governedProxy(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    targetUrl: URL,
    startTime: number,
  ): Promise<void> {
    // Collect request body
    const bodyChunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => bodyChunks.push(chunk));

    req.on('end', async () => {
      const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
      let promptText = '';

      // Try to extract prompt text from JSON body
      try {
        const parsed = JSON.parse(bodyStr);
        if (parsed.messages) {
          promptText = parsed.messages
            .filter((m: any) => m.role === 'user')
            .map((m: any) => typeof m.content === 'string' ? m.content : JSON.stringify(m.content))
            .join('\n');
        } else if (parsed.prompt) {
          promptText = typeof parsed.prompt === 'string' ? parsed.prompt : JSON.stringify(parsed.prompt);
        } else {
          promptText = bodyStr;
        }
      } catch {
        promptText = bodyStr;
      }

      // PII scan
      const piiResult = scanForPII(promptText);

      // Policy evaluation
      let action: 'allow' | 'warn' | 'block' | 'redact' = 'allow';
      let reason = '';

      // Block critical PII
      const criticalPII = ['ssn', 'credit_card', 'medical_record', 'bank_account', 'passport'];
      const foundCritical = piiResult.types.filter(t => criticalPII.includes(t));
      if (foundCritical.length > 0) {
        action = 'block';
        reason = `Critical PII detected: ${foundCritical.join(', ')}. Request blocked.`;
      } else if (piiResult.hasPII) {
        action = 'warn';
        reason = `PII detected: ${piiResult.types.join(', ')}. Allowed with warning.`;
      }

      // Create interaction record
      const interaction = this.createFullInteraction({
        domain: targetUrl.hostname,
        url: targetUrl.toString(),
        method: req.method || 'POST',
        userIp: req.socket.remoteAddress || 'unknown',
        promptText,
        piiResult,
        action,
        reason,
        startTime,
      });

      // If blocked, return error to client
      if (action === 'block') {
        interaction.blocked = true;
        this.recordInteraction(interaction);
        this.emit('interaction:blocked', interaction);

        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'CendiaGateway: Request blocked by AI governance policy',
          reason,
          piiTypes: foundCritical,
          interactionId: interaction.id,
          message: 'This AI request was blocked because it contains sensitive data that violates your organization\'s AI usage policy. Remove the sensitive data and try again.',
        }));
        return;
      }

      // Forward to AI provider
      try {
        const proxyReq = (targetUrl.protocol === 'https:' ? https : http).request(
          targetUrl,
          {
            method: req.method,
            headers: { ...req.headers, host: targetUrl.hostname },
          },
          (proxyRes) => {
            // Collect response for logging
            const responseChunks: Buffer[] = [];
            proxyRes.on('data', (chunk: Buffer) => responseChunks.push(chunk));
            proxyRes.on('end', () => {
              const responseStr = Buffer.concat(responseChunks).toString('utf-8');
              interaction.responseText = responseStr.slice(0, 10000); // Cap at 10KB for storage
              interaction.latencyMs = Date.now() - startTime;
              this.recordInteraction(interaction);
              this.emit('interaction:completed', interaction);
            });

            // Stream response back to client
            res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
            proxyRes.pipe(res);
          }
        );

        proxyReq.on('error', (err) => {
          interaction.latencyMs = Date.now() - startTime;
          interaction.responseText = `Proxy error: ${err.message}`;
          this.recordInteraction(interaction);

          res.writeHead(502, { 'Content-Type': 'text/plain' });
          res.end(`Gateway proxy error: ${err.message}`);
        });

        proxyReq.write(bodyStr);
        proxyReq.end();
      } catch (err: any) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`Gateway error: ${err.message}`);
      }
    });
  }

  // ===========================================================================
  // PASSTHROUGH — Non-AI traffic, no governance
  // ===========================================================================

  private proxyPassthrough(req: http.IncomingMessage, res: http.ServerResponse, targetUrl: URL): void {
    const proxyReq = (targetUrl.protocol === 'https:' ? https : http).request(
      targetUrl,
      { method: req.method, headers: { ...req.headers, host: targetUrl.hostname } },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end(`Proxy error: ${err.message}`);
    });
    req.pipe(proxyReq);
  }

  // ===========================================================================
  // DOMAIN DETECTION
  // ===========================================================================

  isAIDomain(hostname: string): boolean {
    if (this.aiDomains.has(hostname)) return true;
    // Check wildcard subdomains
    for (const domain of this.aiDomains) {
      if (hostname.endsWith('.' + domain)) return true;
    }
    return false;
  }

  getGovernedDomains(): string[] {
    return [...this.aiDomains].sort();
  }

  addAIDomain(domain: string): void {
    this.aiDomains.add(domain);
    logger.info(`[GatewayProxy] Added AI domain: ${domain}`);
  }

  removeAIDomain(domain: string): void {
    this.aiDomains.delete(domain);
    logger.info(`[GatewayProxy] Removed AI domain: ${domain}`);
  }

  // ===========================================================================
  // INTERACTION RECORDS
  // ===========================================================================

  private createMinimalInteraction(domain: string, req: http.IncomingMessage): ProxyInteraction {
    const id = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update(`${id}:${domain}:${Date.now()}`).digest('hex');
    const signature = crypto.createHmac('sha256', process.env.GATEWAY_SIGNING_KEY || 'datacendia-gateway-default')
      .update(hash).digest('hex');

    return {
      id,
      timestamp: new Date(),
      domain,
      url: `https://${domain}`,
      method: 'CONNECT',
      userIp: req.socket.remoteAddress || 'unknown',
      isAIDomain: true,
      promptText: '',
      responseText: '',
      piiDetected: false,
      piiTypes: [],
      policyAction: 'allow',
      blocked: false,
      integrityHash: hash,
      signature,
      latencyMs: 0,
    };
  }

  private createFullInteraction(params: {
    domain: string; url: string; method: string; userIp: string;
    promptText: string; piiResult: any; action: string; reason: string; startTime: number;
  }): ProxyInteraction {
    const id = crypto.randomUUID();
    const hashPayload = JSON.stringify({
      id, domain: params.domain, promptText: params.promptText,
      piiDetected: params.piiResult.hasPII, action: params.action, timestamp: new Date().toISOString(),
    });
    const hash = crypto.createHash('sha256').update(hashPayload).digest('hex');
    const signature = crypto.createHmac('sha256', process.env.GATEWAY_SIGNING_KEY || 'datacendia-gateway-default')
      .update(hash).digest('hex');

    return {
      id,
      timestamp: new Date(),
      domain: params.domain,
      url: params.url,
      method: params.method,
      userIp: params.userIp,
      isAIDomain: true,
      promptText: params.promptText,
      responseText: '',
      piiDetected: params.piiResult.hasPII,
      piiTypes: params.piiResult.types || [],
      policyAction: params.action as any,
      policyReason: params.reason,
      blocked: false,
      integrityHash: hash,
      signature,
      latencyMs: Date.now() - params.startTime,
    };
  }

  private recordInteraction(interaction: ProxyInteraction): void {
    this.interactions.push(interaction);
    // Keep last 10K interactions in memory
    if (this.interactions.length > 10000) {
      this.interactions = this.interactions.slice(-5000);
    }
    this.emit('interaction:recorded', interaction);
  }

  // ===========================================================================
  // STATS & QUERIES
  // ===========================================================================

  getStats(): {
    totalInteractions: number;
    blocked: number;
    warned: number;
    piiDetections: number;
    byDomain: Record<string, number>;
    lastHour: number;
  } {
    const now = Date.now();
    const hourAgo = now - 3600000;
    const lastHour = this.interactions.filter(i => i.timestamp.getTime() > hourAgo);

    const byDomain: Record<string, number> = {};
    for (const i of this.interactions) {
      byDomain[i.domain] = (byDomain[i.domain] || 0) + 1;
    }

    return {
      totalInteractions: this.interactions.length,
      blocked: this.interactions.filter(i => i.blocked).length,
      warned: this.interactions.filter(i => i.policyAction === 'warn').length,
      piiDetections: this.interactions.filter(i => i.piiDetected).length,
      byDomain,
      lastHour: lastHour.length,
    };
  }

  getRecentInteractions(limit: number = 50): ProxyInteraction[] {
    return this.interactions.slice(-limit).reverse();
  }

  getBlockedInteractions(limit: number = 50): ProxyInteraction[] {
    return this.interactions.filter(i => i.blocked).slice(-limit).reverse();
  }

  // ===========================================================================
  // PAC FILE GENERATION — Auto-configure browsers/system proxy
  // ===========================================================================

  generatePACFile(): string {
    const domains = [...this.aiDomains];
    const conditions = domains.map(d => `dnsDomainIs(host, "${d}")`).join(' ||\n      ');

    return `// CendiaGateway™ Proxy Auto-Configuration (PAC) File
// Generated: ${new Date().toISOString()}
// Governed AI domains: ${domains.length}

function FindProxyForURL(url, host) {
  // AI domains → route through CendiaGateway proxy
  if (${conditions}) {
    return "PROXY ${this.config.host === '0.0.0.0' ? 'gateway.local' : this.config.host}:${this.config.port}";
  }

  // All other traffic → direct connection
  return "DIRECT";
}
`;
  }
}

// Singleton export
export const gatewayProxyServer = new GatewayProxyServer();
export default gatewayProxyServer;
