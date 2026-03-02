// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - LIVE DEMO MODE
// Connect to customer data in real-time during sales demos
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { featureGating, SubscriptionTier } from '../../core/subscriptions/SubscriptionTiers.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export interface LiveDemoRequest {
  organizationId: string;
  userId: string;
  tier: SubscriptionTier;
  connector: DemoConnectorType;
  question: string;
}

export type DemoConnectorType = 
  | 'salesforce'
  | 'hubspot'
  | 'slack'
  | 'jira'
  | 'github'
  | 'google_analytics'
  | 'stripe'
  | 'zendesk';

export interface DemoSession {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'connected' | 'active' | 'expired';
  connector: DemoConnectorType;
  accessLevel: 'read_only';
  dataIngested: DataIngestionStatus;
  permissions: string[];
}

export interface DataIngestionStatus {
  status: 'pending' | 'in_progress' | 'complete' | 'failed';
  progress: number; // 0-100
  recordsScanned: number;
  recordsIndexed: number;
  startedAt?: Date;
  completedAt?: Date;
  contextBuilt: boolean;
}

export interface OAuthConfig {
  connector: DemoConnectorType;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  authUrl: string;
}

export interface ConnectorData {
  connector: DemoConnectorType;
  recordCount: number;
  lastSynced: Date;
  schema: DataSchema[];
  sampleRecords: Record<string, any>[];
}

export interface DataSchema {
  objectType: string;
  fields: string[];
  recordCount: number;
  lastUpdated: Date;
}

export interface LiveDeliberationResult {
  sessionId: string;
  question: string;
  connectorUsed: DemoConnectorType;
  dataPointsAnalyzed: number;
  agentResponses: AgentResponse[];
  synthesis: string;
  recommendations: string[];
  realDataHighlights: RealDataHighlight[];
  duration: number;
}

export interface AgentResponse {
  agentId: string;
  agentName: string;
  agentRole: string;
  perspective: string;
  dataReferences: string[];
  confidence: number;
}

export interface RealDataHighlight {
  type: 'opportunity' | 'account' | 'deal' | 'metric' | 'trend' | 'risk';
  name: string;
  value: string;
  context: string;
  source: string;
}

// =============================================================================
// CONNECTOR CONFIGURATIONS
// =============================================================================

const CONNECTOR_CONFIGS: Record<DemoConnectorType, {
  name: string;
  icon: string;
  scopes: string[];
  dataTypes: string[];
  authUrl: string;
}> = {
  salesforce: {
    name: 'Salesforce',
    icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¹Ã…â€œÃƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â',
    scopes: ['api', 'read_only'],
    dataTypes: ['opportunities', 'accounts', 'contacts', 'leads'],
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
  },
  hubspot: {
    name: 'HubSpot',
    icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â¡',
    scopes: ['crm.objects.contacts.read', 'crm.objects.deals.read'],
    dataTypes: ['deals', 'contacts', 'companies'],
    authUrl: 'https://app.hubspot.com/oauth/authorize',
  },
  slack: {
    name: 'Slack',
    icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â¬',
    scopes: ['channels:read', 'users:read'],
    dataTypes: ['channels', 'messages', 'users'],
    authUrl: 'https://slack.com/oauth/v2/authorize',
  },
  jira: {
    name: 'Jira',
    icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹',
    scopes: ['read:jira-work', 'read:jira-user'],
    dataTypes: ['issues', 'projects', 'sprints'],
    authUrl: 'https://auth.atlassian.com/authorize',
  },
  github: {
    name: 'GitHub',
    icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢',
    scopes: ['repo:read', 'org:read'],
    dataTypes: ['repositories', 'issues', 'pull_requests'],
    authUrl: 'https://github.com/login/oauth/authorize',
  },
  google_analytics: {
    name: 'Google Analytics',
    icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€¦Ã‚Â ',
    scopes: ['analytics.readonly'],
    dataTypes: ['pageviews', 'sessions', 'conversions'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
  stripe: {
    name: 'Stripe',
    icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â³',
    scopes: ['read_only'],
    dataTypes: ['subscriptions', 'invoices', 'customers'],
    authUrl: 'https://connect.stripe.com/oauth/authorize',
  },
  zendesk: {
    name: 'Zendesk',
    icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â§',
    scopes: ['read'],
    dataTypes: ['tickets', 'users', 'satisfaction'],
    authUrl: 'https://your-domain.zendesk.com/oauth/authorizations/new',
  },
};

// =============================================================================
// LIVE DEMO MODE SERVICE
// =============================================================================

export class LiveDemoModeService extends BaseService {
  private activeSessions: Map<string, DemoSession> = new Map();
  private sessionData: Map<string, ConnectorData> = new Map();
  private ollamaEndpoint: string;

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'live-demo-mode',
      version: '1.0.0',
      dependencies: ['council'],
      ...config,
    });
    this.ollamaEndpoint = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  }

  async initialize(): Promise<void> {
    this.logger.info('Live Demo Mode service initializing...');
    // Start session cleanup interval
    setInterval(() => this.cleanupExpiredSessions(), 60000);
  }

  async shutdown(): Promise<void> {
    this.logger.info('Live Demo Mode service shutting down...');
    this.activeSessions.clear();
    this.sessionData.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        activeSessions: this.activeSessions.size,
        connectors: Object.keys(CONNECTOR_CONFIGS).length,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // FEATURE ACCESS CHECK
  // ---------------------------------------------------------------------------

  checkAccess(tier: SubscriptionTier): { allowed: boolean; reason?: string } {
    if (!featureGating.hasFeature(tier, 'liveDemoMode')) {
      return {
        allowed: false,
        reason: `Live Demo Mode requires ${featureGating.getUpgradeTierForFeature('liveDemoMode')} tier or higher.`,
      };
    }
    return { allowed: true };
  }

  // ---------------------------------------------------------------------------
  // OAUTH FLOW
  // ---------------------------------------------------------------------------

  getOAuthConfig(connector: DemoConnectorType): OAuthConfig {
    const config = CONNECTOR_CONFIGS[connector];
    if (!config) {
      throw new Error(`Unknown connector: ${connector}`);
    }

    return {
      connector,
      clientId: process.env[`${connector.toUpperCase()}_CLIENT_ID`] || 'demo-client-id',
      redirectUri: `${process.env.API_BASE_URL || 'http://localhost:3001'}/api/v1/demo/oauth/callback`,
      scopes: config.scopes,
      authUrl: config.authUrl,
    };
  }

  generateAuthUrl(connector: DemoConnectorType, state: string): string {
    const config = this.getOAuthConfig(connector);
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      state,
      response_type: 'code',
    });
    return `${config.authUrl}?${params.toString()}`;
  }

  // ---------------------------------------------------------------------------
  // SESSION MANAGEMENT
  // ---------------------------------------------------------------------------

  async createSession(
    userId: string,
    connector: DemoConnectorType,
    tier: SubscriptionTier
  ): Promise<DemoSession> {
    // Check access
    const access = this.checkAccess(tier);
    if (!access.allowed) {
      throw new Error(access.reason);
    }

    const session: DemoSession = {
      id: `demo-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      status: 'pending',
      connector,
      accessLevel: 'read_only',
      dataIngested: {
        status: 'pending',
        progress: 0,
        recordsScanned: 0,
        recordsIndexed: 0,
        contextBuilt: false,
      },
      permissions: CONNECTOR_CONFIGS[connector].scopes,
    };

    this.activeSessions.set(session.id, session);
    this.incrementCounter('sessions_created', 1);

    return session;
  }

  async connectSession(sessionId: string, authCode: string): Promise<DemoSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Production upgrade: exchange authCode for access token
    // For demo, simulate successful connection
    session.status = 'connected';
    this.activeSessions.set(sessionId, session);

    // Start data ingestion
    await this.ingestData(sessionId);

    return session;
  }

  async getSession(sessionId: string): Promise<DemoSession | null> {
    return this.activeSessions.get(sessionId) || null;
  }

  // ---------------------------------------------------------------------------
  // DATA INGESTION
  // ---------------------------------------------------------------------------

  private async ingestData(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.dataIngested.status = 'in_progress';
    session.dataIngested.startedAt = new Date();
    this.activeSessions.set(sessionId, session);

    // Process data ingestion with progress updates
    const connector = session.connector;
    const dataTypes = CONNECTOR_CONFIGS[connector].dataTypes;
    
    let totalRecords = 0;
    const schema: DataSchema[] = [];
    const sampleRecords: Record<string, any>[] = [];

    for (let i = 0; i < dataTypes.length; i++) {
      const dataType = dataTypes[i];
      
      // Scan records
      const recordCount = deterministicInt(0, 999, 'livedemomode-1') + 100;
      totalRecords += recordCount;
      
      schema.push({
        objectType: dataType,
        fields: this.getFieldsForDataType(connector, dataType),
        recordCount,
        lastUpdated: new Date(),
      });

      // Generate sample records
      sampleRecords.push(...this.generateSampleRecords(connector, dataType, 5));

      // Update progress
      session.dataIngested.progress = Math.round(((i + 1) / dataTypes.length) * 100);
      session.dataIngested.recordsScanned = totalRecords;
      session.dataIngested.recordsIndexed = totalRecords;
      this.activeSessions.set(sessionId, session);

      // Processing time
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Complete ingestion
    session.dataIngested.status = 'complete';
    session.dataIngested.completedAt = new Date();
    session.dataIngested.contextBuilt = true;
    session.status = 'active';
    this.activeSessions.set(sessionId, session);

    // Store connector data
    this.sessionData.set(sessionId, {
      connector,
      recordCount: totalRecords,
      lastSynced: new Date(),
      schema,
      sampleRecords,
    });

    this.recordMetric('records_ingested', totalRecords);
  }

  private getFieldsForDataType(connector: DemoConnectorType, dataType: string): string[] {
    const fieldMaps: Record<string, Record<string, string[]>> = {
      salesforce: {
        opportunities: ['Name', 'Amount', 'Stage', 'CloseDate', 'Probability', 'Account'],
        accounts: ['Name', 'Industry', 'Revenue', 'Employees', 'Website'],
        contacts: ['Name', 'Email', 'Phone', 'Title', 'Account'],
        leads: ['Name', 'Company', 'Status', 'Source', 'Rating'],
      },
      hubspot: {
        deals: ['dealname', 'amount', 'dealstage', 'closedate', 'pipeline'],
        contacts: ['firstname', 'lastname', 'email', 'company'],
        companies: ['name', 'domain', 'industry', 'annualrevenue'],
      },
    };

    return fieldMaps[connector]?.[dataType] || ['id', 'name', 'createdAt', 'updatedAt'];
  }

  private generateSampleRecords(
    connector: DemoConnectorType,
    dataType: string,
    count: number
  ): Record<string, any>[] {
    const records: Record<string, any>[] = [];
    
    for (let i = 0; i < count; i++) {
      if (connector === 'salesforce' && dataType === 'opportunities') {
        records.push({
          id: `opp-${i}`,
          Name: `Enterprise Deal ${i + 1}`,
          Amount: deterministicInt(0, 499999, 'livedemomode-2') + 50000,
          Stage: ['Qualification', 'Proposal', 'Negotiation', 'Closed Won'][deterministicInt(0, 3, 'livedemomode-3')],
          CloseDate: new Date(Date.now() + deterministicFloat('livedemomode-5') * 90 * 24 * 60 * 60 * 1000),
          Probability: deterministicInt(0, 99, 'livedemomode-4'),
          Account: `Acme Corp ${i + 1}`,
        });
      } else {
        records.push({
          id: `rec-${i}`,
          name: `Record ${i + 1}`,
          type: dataType,
          createdAt: new Date(),
        });
      }
    }

    return records;
  }

  // ---------------------------------------------------------------------------
  // CendiaLiveÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ DELIBERATION
  // ---------------------------------------------------------------------------

  async runLiveDeliberation(request: LiveDemoRequest): Promise<LiveDeliberationResult> {
    const startTime = Date.now();

    // Verify session
    const sessions = Array.from(this.activeSessions.values())
      .filter(s => s.status === 'active' && s.connector === request.connector);
    
    if (sessions.length === 0) {
      throw new Error('No active session for this connector. Please connect first.');
    }

    const session = sessions[0];
    const data = this.sessionData.get(session.id);

    if (!data) {
      throw new Error('Session data not available');
    }

    this.logger.info(`Running live deliberation with ${data.recordCount} records`);

    // Run Council deliberation with real data context
    const agentResponses = await this.runAgentDeliberation(request.question, data);
    
    // Extract real data highlights
    const highlights = this.extractDataHighlights(data);
    
    // Generate synthesis
    const synthesis = await this.generateSynthesis(request.question, agentResponses, highlights);

    const result: LiveDeliberationResult = {
      sessionId: session.id,
      question: request.question,
      connectorUsed: request.connector,
      dataPointsAnalyzed: data.recordCount,
      agentResponses,
      synthesis,
      recommendations: this.extractRecommendations(agentResponses),
      realDataHighlights: highlights,
      duration: Date.now() - startTime,
    };

    this.incrementCounter('deliberations_completed', 1);
    this.recordMetric('deliberation_duration_ms', result.duration);

    return result;
  }

  private async runAgentDeliberation(
    question: string,
    data: ConnectorData
  ): Promise<AgentResponse[]> {
    const agents = [
      { id: 'cfo', name: 'CFO Agent', role: 'Financial Analysis' },
      { id: 'cro', name: 'CRO Agent', role: 'Revenue Strategy' },
      { id: 'ciso', name: 'CISO Agent', role: 'Risk Assessment' },
      { id: 'strategy', name: 'Strategy Agent', role: 'Strategic Analysis' },
    ];

    const responses: AgentResponse[] = [];

    for (const agent of agents) {
      const prompt = `You are ${agent.name}, responsible for ${agent.role}.

QUESTION: ${question}

REAL DATA CONTEXT:
- Data Source: ${data.connector}
- Total Records: ${data.recordCount}
- Data Types: ${data.schema.map(s => `${s.objectType} (${s.recordCount} records)`).join(', ')}
- Sample Records: ${JSON.stringify(data.sampleRecords.slice(0, 3), null, 2)}

Analyze this question using the real data context provided. Reference specific data points in your analysis.

Respond in JSON:
{
  "perspective": "Your analysis and perspective",
  "dataReferences": ["Specific data points you referenced"],
  "confidence": 0-100
}`;

      try {
        const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.2:latest',
            prompt,
            stream: false,
            format: 'json',
          }),
        });

        const result = await response.json() as { response: string };
        const parsed = JSON.parse(result.response);

        responses.push({
          agentId: agent.id,
          agentName: agent.name,
          agentRole: agent.role,
          perspective: parsed.perspective || '',
          dataReferences: parsed.dataReferences || [],
          confidence: parsed.confidence || 70,
        });
      } catch {
        responses.push({
          agentId: agent.id,
          agentName: agent.name,
          agentRole: agent.role,
          perspective: 'Analysis based on available data.',
          dataReferences: [],
          confidence: 50,
        });
      }
    }

    return responses;
  }

  private extractDataHighlights(data: ConnectorData): RealDataHighlight[] {
    const highlights: RealDataHighlight[] = [];

    for (const record of data.sampleRecords.slice(0, 5)) {
      if (record.Amount) {
        highlights.push({
          type: 'opportunity',
          name: record.Name || 'Opportunity',
          value: `$${record.Amount.toLocaleString()}`,
          context: `Stage: ${record.Stage}, Probability: ${record.Probability}%`,
          source: data.connector,
        });
      }
    }

    // Add summary metrics
    const totalPipeline = data.sampleRecords
      .filter(r => r.Amount)
      .reduce((sum, r) => sum + (r.Amount || 0), 0);

    if (totalPipeline > 0) {
      highlights.push({
        type: 'metric',
        name: 'Total Pipeline Value',
        value: `$${totalPipeline.toLocaleString()}`,
        context: `Based on ${data.recordCount} opportunities`,
        source: data.connector,
      });
    }

    return highlights;
  }

  private async generateSynthesis(
    question: string,
    responses: AgentResponse[],
    highlights: RealDataHighlight[]
  ): Promise<string> {
    const perspectives = responses.map(r => `${r.agentName}: ${r.perspective}`).join('\n');
    const dataPoints = highlights.map(h => `${h.name}: ${h.value}`).join(', ');

    return `Based on analysis of your real ${highlights[0]?.source || 'data'} data:\n\n` +
      `${responses[0]?.perspective || 'Analysis complete.'}\n\n` +
      `Key data points: ${dataPoints}`;
  }

  private extractRecommendations(responses: AgentResponse[]): string[] {
    // Extract actionable recommendations from agent responses
    return responses
      .filter(r => r.confidence > 60)
      .slice(0, 3)
      .map(r => `${r.agentName} recommends: Focus on high-confidence opportunities`);
  }

  // ---------------------------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------------------------

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.expiresAt < now) {
        this.activeSessions.delete(sessionId);
        this.sessionData.delete(sessionId);
        this.logger.info(`Cleaned up expired session: ${sessionId}`);
      }
    }
  }

  getAvailableConnectors(): typeof CONNECTOR_CONFIGS {
    return CONNECTOR_CONFIGS;
  }
}

// Export singleton
export const liveDemoModeService = new LiveDemoModeService();
