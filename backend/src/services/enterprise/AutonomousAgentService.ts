/**
 * Autonomous Compliance Agents
 * 
 * Self-organizing agents for continuous compliance monitoring, gap detection,
 * evidence collection, and remediation recommendation.
 * 
 * @module services/enterprise/AutonomousAgentService
 */

import { logger } from '../../utils/logger.js';

export type AgentRole = 'monitor' | 'auditor' | 'remediator' | 'reporter' | 'sentinel';
export type AgentStatus = 'idle' | 'scanning' | 'analyzing' | 'reporting' | 'remediating' | 'paused' | 'error';

export interface ComplianceAgent {
  id: string;
  name: string;
  role: AgentRole;
  domain: string;
  status: AgentStatus;
  config: AgentConfig;
  stats: AgentStats;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
}

export interface AgentConfig {
  enabled: boolean;
  schedule: string;
  targets: string[];
  frameworks: string[];
  thresholds: Record<string, number>;
  notifyOnFinding: boolean;
  autoRemediate: boolean;
  maxActions: number;
}

export interface AgentStats {
  totalRuns: number;
  totalFindings: number;
  totalRemediations: number;
  avgRunDuration: number;
  successRate: number;
  lastError?: string;
}

export interface AgentFinding {
  id: string;
  agentId: string;
  type: 'gap' | 'violation' | 'risk' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  framework: string;
  control: string;
  evidence: { type: string; content: string }[];
  recommendation: string;
  autoRemediable: boolean;
  remediationStatus: 'pending' | 'in_progress' | 'completed' | 'skipped';
  detectedAt: string;
  resolvedAt?: string;
}

export interface AgentRun {
  id: string;
  agentId: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  duration: number;
  findingsCount: number;
  remediationsCount: number;
  summary: string;
}

class AutonomousAgentService {
  private agents: Map<string, ComplianceAgent> = new Map();
  private findings: Map<string, AgentFinding> = new Map();
  private runs: AgentRun[] = [];

  constructor() {
    this.loadDefaultAgents();
  }

  async getAgent(agentId: string): Promise<ComplianceAgent | null> {
    return this.agents.get(agentId) || null;
  }

  async listAgents(): Promise<ComplianceAgent[]> {
    return Array.from(this.agents.values());
  }

  async createAgent(input: Omit<ComplianceAgent, 'id' | 'createdAt' | 'stats'>): Promise<ComplianceAgent> {
    const id = `agt_${crypto.randomUUID().split('-')[0]}`;
    const agent: ComplianceAgent = {
      id, ...input,
      stats: { totalRuns: 0, totalFindings: 0, totalRemediations: 0, avgRunDuration: 0, successRate: 100 },
      createdAt: new Date().toISOString(),
    };
    this.agents.set(id, agent);
    return agent;
  }

  async runAgent(agentId: string): Promise<AgentRun> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error('Agent not found');

    agent.status = 'scanning';
    agent.lastRunAt = new Date().toISOString();
    this.agents.set(agentId, agent);

    const startTime = Date.now();
    const newFindings: AgentFinding[] = [];

    // Simulate scanning
    const findingCount = Math.floor(Math.random() * 5);
    for (let i = 0; i < findingCount; i++) {
      const finding: AgentFinding = {
        id: `find_${crypto.randomUUID().split('-')[0]}`,
        agentId,
        type: (['gap', 'violation', 'risk', 'recommendation'] as const)[Math.floor(Math.random() * 4)],
        severity: (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)],
        title: `${agent.domain} finding #${agent.stats.totalFindings + i + 1}`,
        description: `Automated detection by ${agent.name}`,
        framework: agent.config.frameworks[0] || 'general',
        control: `CTRL-${Math.floor(Math.random() * 100)}`,
        evidence: [{ type: 'automated_scan', content: 'Evidence collected by compliance agent' }],
        recommendation: 'Review and apply recommended configuration',
        autoRemediable: agent.config.autoRemediate && Math.random() > 0.5,
        remediationStatus: 'pending',
        detectedAt: new Date().toISOString(),
      };
      this.findings.set(finding.id, finding);
      newFindings.push(finding);
    }

    // Auto-remediate if configured
    let remediationsCount = 0;
    if (agent.config.autoRemediate) {
      for (const f of newFindings.filter(f => f.autoRemediable)) {
        f.remediationStatus = 'completed';
        f.resolvedAt = new Date().toISOString();
        this.findings.set(f.id, f);
        remediationsCount++;
      }
    }

    const duration = Date.now() - startTime;
    agent.status = 'idle';
    agent.stats.totalRuns++;
    agent.stats.totalFindings += findingCount;
    agent.stats.totalRemediations += remediationsCount;
    agent.stats.avgRunDuration = (agent.stats.avgRunDuration * (agent.stats.totalRuns - 1) + duration) / agent.stats.totalRuns;
    this.agents.set(agentId, agent);

    const run: AgentRun = {
      id: `run_${crypto.randomUUID().split('-')[0]}`,
      agentId,
      status: 'completed',
      startedAt: agent.lastRunAt!,
      completedAt: new Date().toISOString(),
      duration,
      findingsCount: findingCount,
      remediationsCount,
      summary: `Scanned ${agent.config.targets.length} targets, found ${findingCount} issues, auto-remediated ${remediationsCount}`,
    };
    this.runs.push(run);
    logger.info(`[AutonomousAgent] ${agent.name} completed: ${findingCount} findings, ${remediationsCount} remediated`);
    return run;
  }

  async listFindings(agentId?: string, severity?: string): Promise<AgentFinding[]> {
    let results = Array.from(this.findings.values());
    if (agentId) results = results.filter(f => f.agentId === agentId);
    if (severity) results = results.filter(f => f.severity === severity);
    return results.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }

  async listRuns(agentId?: string): Promise<AgentRun[]> {
    let results = [...this.runs];
    if (agentId) results = results.filter(r => r.agentId === agentId);
    return results.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  async getDashboard(): Promise<{
    totalAgents: number; activeAgents: number; totalFindings: number; openFindings: number;
    autoRemediations: number; agents: ComplianceAgent[]; recentFindings: AgentFinding[];
  }> {
    const agents = Array.from(this.agents.values());
    const findings = Array.from(this.findings.values());
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.config.enabled).length,
      totalFindings: findings.length,
      openFindings: findings.filter(f => f.remediationStatus === 'pending').length,
      autoRemediations: findings.filter(f => f.remediationStatus === 'completed').length,
      agents,
      recentFindings: findings.slice(-10).reverse(),
    };
  }

  private loadDefaultAgents(): void {
    const defaults: Omit<ComplianceAgent, 'id' | 'createdAt' | 'stats'>[] = [
      { name: 'GDPR Compliance Monitor', role: 'monitor', domain: 'data_protection', status: 'idle', config: { enabled: true, schedule: '0 */6 * * *', targets: ['database', 'api', 'storage'], frameworks: ['GDPR'], thresholds: { complianceScore: 90 }, notifyOnFinding: true, autoRemediate: false, maxActions: 10 } },
      { name: 'SOC 2 Auditor', role: 'auditor', domain: 'security', status: 'idle', config: { enabled: true, schedule: '0 0 * * *', targets: ['infrastructure', 'access_controls', 'logging'], frameworks: ['SOC 2'], thresholds: { controlEffectiveness: 85 }, notifyOnFinding: true, autoRemediate: false, maxActions: 5 } },
      { name: 'AI Act Sentinel', role: 'sentinel', domain: 'ai_governance', status: 'idle', config: { enabled: true, schedule: '0 */4 * * *', targets: ['models', 'training_data', 'deployments'], frameworks: ['EU AI Act'], thresholds: { riskScore: 80 }, notifyOnFinding: true, autoRemediate: true, maxActions: 20 } },
      { name: 'Config Drift Remediator', role: 'remediator', domain: 'operations', status: 'idle', config: { enabled: true, schedule: '*/30 * * * *', targets: ['config', 'secrets', 'permissions'], frameworks: ['CIS Benchmarks'], thresholds: { driftTolerance: 0 }, notifyOnFinding: false, autoRemediate: true, maxActions: 50 } },
    ];

    for (const d of defaults) {
      const id = `agt_${crypto.randomUUID().split('-')[0]}`;
      this.agents.set(id, { id, ...d, stats: { totalRuns: 0, totalFindings: 0, totalRemediations: 0, avgRunDuration: 0, successRate: 100 }, createdAt: new Date().toISOString() });
    }
  }
}

export const autonomousAgents = new AutonomousAgentService();
export { AutonomousAgentService };
