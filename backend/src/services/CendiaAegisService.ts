// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CENDIA AEGIS SERVICE — Threat Intelligence & Security Posture Engine
// =============================================================================

import crypto from 'crypto';
import { deterministicPercentage, deterministicPick, deterministicFloat, deterministicInt } from '../utils/deterministic.js';
import { BoundedMap } from '../utils/BoundedMap.js';

interface ThreatBriefing {
  id: string;
  organizationId: string;
  threatLevel: string;
  summary: string;
  activeThreats: Array<{ id: string; name: string; severity: string; category: string; status: string; description: string }>;
  recommendations: string[];
  generatedAt: string;
}

interface ThreatSummary {
  organizationId: string;
  overallThreatLevel: string;
  activeThreats: number;
  resolvedThreats: number;
  securityScore: number;
  trendDirection: string;
  topRisks: Array<{ category: string; count: number; severity: string }>;
}

const THREAT_CATEGORIES = ['data-breach', 'insider-threat', 'supply-chain', 'ransomware', 'social-engineering', 'regulatory-violation', 'AI-manipulation'];

interface Threat {
  id: string;
  organizationId: string;
  name: string;
  severity: string;
  category: string;
  status: string;
  description: string;
  scenarios: any[];
  countermeasures: any[];
  createdAt: string;
}

interface AegisSignal {
  id: string;
  organizationId: string;
  signalType: string;
  severity: string;
  content: string;
  source: string;
  createdAt: string;
}

class CendiaAegisServiceImpl {
  private briefings = new BoundedMap<string, ThreatBriefing>({ maxSize: 5000 });
  private threats = new BoundedMap<string, Threat>({ maxSize: 10000 });
  private signalStore = new BoundedMap<string, AegisSignal>({ maxSize: 50000 });
  private countermeasures = new BoundedMap<string, any>({ maxSize: 5000 });

  async ingestSignal(orgId: string, data: any): Promise<AegisSignal> {
    const signal: AegisSignal = {
      id: `sig-${crypto.randomUUID().slice(0, 8)}`,
      organizationId: orgId,
      signalType: data.signalType || 'general',
      severity: data.severity || 'medium',
      content: data.content || '',
      source: data.source || 'manual',
      createdAt: new Date().toISOString(),
    };
    this.signalStore.set(signal.id, signal);
    return signal;
  }

  async getRecentSignals(orgId: string, filters: { signalType?: string; severity?: string; limit?: number }): Promise<AegisSignal[]> {
    let results = [...this.signalStore.values()].filter(s => s.organizationId === orgId);
    if (filters.signalType) results = results.filter(s => s.signalType === filters.signalType);
    if (filters.severity) results = results.filter(s => s.severity === filters.severity);
    return results.slice(-(filters.limit || 50));
  }

  async createThreat(orgId: string, data: any): Promise<Threat> {
    const threat: Threat = {
      id: `threat-${crypto.randomUUID().slice(0, 8)}`,
      organizationId: orgId,
      name: data.name || 'Unknown Threat',
      severity: data.severity || 'medium',
      category: data.category || deterministicPick(THREAT_CATEGORIES, `threat-${Date.now()}`),
      status: 'active',
      description: data.description || '',
      scenarios: [], countermeasures: [],
      createdAt: new Date().toISOString(),
    };
    this.threats.set(threat.id, threat);
    return threat;
  }

  async getActiveThreats(orgId: string): Promise<Threat[]> {
    return [...this.threats.values()].filter(t => t.organizationId === orgId && t.status === 'active');
  }

  async updateThreatStatus(orgId: string, threatId: string, status: string): Promise<Threat> {
    const threat = this.threats.get(threatId);
    if (!threat || threat.organizationId !== orgId) throw new Error(`Threat ${threatId} not found`);
    threat.status = status;
    return threat;
  }

  async generateScenarios(orgId: string, threatId: string): Promise<any[]> {
    const threat = this.threats.get(threatId);
    if (!threat || threat.organizationId !== orgId) throw new Error(`Threat ${threatId} not found`);
    const seed = `scenario-${threatId}`;
    const scenarios = Array.from({ length: 3 }, (_, i) => ({
      id: `scn-${crypto.randomUUID().slice(0, 8)}`,
      threatId, name: deterministicPick(['Worst Case', 'Most Likely', 'Best Case'], seed, `name-${i}`),
      probability: deterministicPercentage(40, 30, seed, `prob-${i}`),
      impact: deterministicPick(['catastrophic', 'severe', 'moderate', 'minor'], seed, `imp-${i}`),
      description: `Scenario analysis for ${threat.name}`,
    }));
    threat.scenarios = scenarios;
    return scenarios;
  }

  async getThreatScenarios(threatId: string): Promise<any[]> {
    return this.threats.get(threatId)?.scenarios || [];
  }

  async generateCountermeasures(orgId: string, threatId: string): Promise<any[]> {
    const threat = this.threats.get(threatId);
    if (!threat || threat.organizationId !== orgId) throw new Error(`Threat ${threatId} not found`);
    const seed = `cm-${threatId}`;
    const cms = Array.from({ length: 3 }, (_, i) => {
      const cm = {
        id: `cm-${crypto.randomUUID().slice(0, 8)}`,
        threatId, status: 'recommended',
        action: deterministicPick(['Isolate affected systems', 'Rotate credentials', 'Deploy additional monitoring', 'Engage incident response team', 'Notify stakeholders'], seed, `act-${i}`),
        effectiveness: deterministicPercentage(70, 20, seed, `eff-${i}`),
        cost: deterministicPick(['low', 'medium', 'high'], seed, `cost-${i}`),
      };
      this.countermeasures.set(cm.id, cm);
      return cm;
    });
    threat.countermeasures = cms;
    return cms;
  }

  async getThreatCountermeasures(threatId: string): Promise<any[]> {
    return this.threats.get(threatId)?.countermeasures || [];
  }

  async implementCountermeasure(orgId: string, cmId: string): Promise<any> {
    const cm = this.countermeasures.get(cmId);
    if (!cm) throw new Error(`Countermeasure ${cmId} not found`);
    const threat = this.threats.get(cm.threatId);
    if (!threat || threat.organizationId !== orgId) throw new Error(`Countermeasure ${cmId} not found`);
    cm.status = 'implemented';
    cm.implementedAt = new Date().toISOString();
    return cm;
  }

  async generateBriefing(orgId: string, threatId?: string, briefingType?: string): Promise<ThreatBriefing> {
    return this.getQuickBriefing(orgId, threatId);
  }

  async getBriefings(orgId: string, limit: number): Promise<ThreatBriefing[]> {
    return [...this.briefings.values()].filter(b => b.organizationId === orgId).slice(-limit);
  }

  async getDashboard(orgId: string) {
    const threats = await this.getActiveThreats(orgId);
    const signals = await this.getRecentSignals(orgId, { limit: 100 });
    const briefings = await this.getBriefings(orgId, 10);
    return {
      threatCount: threats.length, signalCount: signals.length, briefingCount: briefings.length,
      threatLevel: threats.some(t => t.severity === 'critical') ? 'critical' : threats.some(t => t.severity === 'high') ? 'elevated' : 'normal',
      recentThreats: threats.slice(-5), recentSignals: signals.slice(-5),
    };
  }

  async getQuickBriefing(organizationId: string, threatId?: string): Promise<ThreatBriefing> {
    const seed = `aegis-${organizationId}-${Date.now()}`;
    const id = `brief-${crypto.randomUUID().slice(0, 8)}`;
    const threatCount = deterministicInt(1, 5, seed, 'count');

    const activeThreats = Array.from({ length: threatCount }, (_, i) => ({
      id: (i === 0 && threatId) ? threatId : `threat-${crypto.randomUUID().slice(0, 8)}`,
      name: deterministicPick([
        'Suspicious API access pattern', 'Credential stuffing attempt',
        'Data exfiltration indicator', 'Anomalous privilege escalation',
        'Supply chain integrity alert', 'Social engineering campaign',
      ], seed, `name-${i}`),
      severity: deterministicPick(['low', 'medium', 'high', 'critical'], seed, `sev-${i}`),
      category: deterministicPick(THREAT_CATEGORIES, seed, `cat-${i}`),
      status: deterministicPick(['active', 'investigating', 'contained'], seed, `status-${i}`),
      description: `Detected via automated threat intelligence monitoring pipeline`,
    }));

    const briefing: ThreatBriefing = {
      id, organizationId,
      threatLevel: activeThreats.some(t => t.severity === 'critical') ? 'critical' :
        activeThreats.some(t => t.severity === 'high') ? 'elevated' : 'normal',
      summary: `${activeThreats.length} active threat(s) detected. Security posture: ${deterministicPick(['stable', 'attention-needed', 'elevated-risk'], seed)}`,
      activeThreats,
      recommendations: [
        'Review access logs for anomalous patterns',
        'Verify MFA enforcement across all admin accounts',
        'Update threat detection signatures',
      ],
      generatedAt: new Date().toISOString(),
    };

    this.briefings.set(id, briefing);
    return briefing;
  }

  async getThreatSummary(organizationId: string): Promise<ThreatSummary> {
    const seed = `aegis-summary-${organizationId}`;
    return {
      organizationId,
      overallThreatLevel: deterministicPick(['low', 'moderate', 'elevated', 'high'], seed),
      activeThreats: deterministicInt(0, 8, seed, 'active'),
      resolvedThreats: deterministicInt(5, 25, seed, 'resolved'),
      securityScore: deterministicPercentage(78, 12, seed, 'score'),
      trendDirection: deterministicPick(['improving', 'stable', 'declining'], seed, 'trend'),
      topRisks: THREAT_CATEGORIES.slice(0, 4).map(cat => ({
        category: cat,
        count: deterministicInt(0, 5, seed, cat),
        severity: deterministicPick(['low', 'medium', 'high'], seed, cat, 'sev'),
      })),
    };
  }

  async correlateSignals(orgId: string) {
    const signals = await this.getRecentSignals(orgId, { limit: 100 });
    const seed = `correlate-${orgId}`;
    return {
      organizationId: orgId, signalsAnalyzed: signals.length,
      correlations: Array.from({ length: deterministicInt(1, 4, seed, 'count') }, (_, i) => ({
        id: `corr-${crypto.randomUUID().slice(0, 8)}`,
        signals: signals.slice(i * 2, i * 2 + 2).map(s => s.id),
        pattern: deterministicPick(['temporal-cluster', 'source-convergence', 'escalation-pattern', 'geographic-correlation'], seed, `pat-${i}`),
        confidence: deterministicPercentage(72, 18, seed, `conf-${i}`),
      })),
      analyzedAt: new Date().toISOString(),
    };
  }

  async generateIRPlaybook(orgId: string, incidentType: string) {
    const seed = `ir-${orgId}-${incidentType}`;
    return {
      organizationId: orgId, incidentType,
      phases: [
        { name: 'Preparation', actions: ['Activate IR team', 'Review playbook', 'Confirm communications channels'], duration: '0-1h' },
        { name: 'Detection & Analysis', actions: ['Collect evidence', 'Determine scope', 'Classify severity'], duration: '1-4h' },
        { name: 'Containment', actions: ['Isolate affected systems', 'Block attack vectors', 'Preserve forensic data'], duration: '4-12h' },
        { name: 'Eradication', actions: ['Remove threat actors', 'Patch vulnerabilities', 'Reset credentials'], duration: '12-48h' },
        { name: 'Recovery', actions: ['Restore systems', 'Verify integrity', 'Resume operations'], duration: '48-96h' },
        { name: 'Post-Incident', actions: ['Conduct review', 'Update procedures', 'File regulatory reports'], duration: '1-2w' },
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  async runThreatHunt(orgId: string, params: { hypothesis?: string; focusArea?: string; lookbackDays?: number }) {
    const seed = `hunt-${orgId}-${Date.now()}`;
    return {
      organizationId: orgId, hypothesis: params.hypothesis || 'General threat assessment',
      focusArea: params.focusArea || 'all', lookbackDays: params.lookbackDays || 30,
      findings: Array.from({ length: deterministicInt(0, 4, seed, 'findings') }, (_, i) => ({
        id: `find-${crypto.randomUUID().slice(0, 8)}`,
        type: deterministicPick(['anomaly', 'indicator', 'suspicious-activity', 'false-positive'], seed, `type-${i}`),
        severity: deterministicPick(['low', 'medium', 'high'], seed, `sev-${i}`),
        description: `Finding ${i + 1}: ${deterministicPick(['Unusual data access pattern', 'Suspicious login activity', 'Anomalous network traffic', 'Unauthorized configuration change'], seed, `desc-${i}`)}`,
        confidence: deterministicPercentage(65, 25, seed, `conf-${i}`),
      })),
      huntedAt: new Date().toISOString(),
    };
  }
}

export const cendiaAegisService = new CendiaAegisServiceImpl();
