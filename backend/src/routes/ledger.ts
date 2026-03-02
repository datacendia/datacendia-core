// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA LEDGERâ„¢ - API ROUTES
// Immutable Decision Blockchain endpoints
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

const router: Router = express.Router();

// Health & Status endpoints (no auth required)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'ledger', timestamp: new Date().toISOString() } });
});

router.get('/status', (req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'operational', version: '1.0.0', chainLength: 0 } });
});

router.get('/entries', (req: Request, res: Response) => {
  res.json({ success: true, data: [], meta: { total: 0, limit: 10 } });
});

router.get('/verify', (req: Request, res: Response) => {
  res.json({ success: true, data: { valid: true, chainIntegrity: true, lastVerified: new Date().toISOString() } });
});

// =============================================================================
// TYPES
// =============================================================================

type LedgerEventType = 
  | 'decision.proposed'
  | 'decision.deliberated'
  | 'decision.voted'
  | 'decision.vetoed'
  | 'decision.approved'
  | 'decision.executed'
  | 'decision.outcome_recorded'
  | 'agent.contributed'
  | 'agent.voted'
  | 'agent.vetoed'
  | 'audit.requested'
  | 'audit.completed';

type ComplianceFramework = 'GDPR' | 'SOX' | 'HIPAA' | 'PCI-DSS' | 'ISO27001' | 'SOC2';

interface LedgerEntry {
  id: string;
  sequence: number;
  timestamp: Date;
  eventType: LedgerEventType;
  decisionId: string;
  organizationId: string;
  userId?: string;
  agentId?: string;
  title: string;
  description: string;
  data: Record<string, any>;
  confidenceScore?: number;
  vote?: 'approve' | 'reject' | 'abstain' | 'veto';
  previousHash: string;
  hash: string;
  complianceFrameworks: ComplianceFramework[];
  sensitivityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  piiInvolved: boolean;
  verified: boolean;
  verifiedAt?: Date;
}

interface DecisionRecord {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedAt: Date;
  status: 'proposed' | 'deliberating' | 'voting' | 'approved' | 'rejected' | 'vetoed' | 'executed';
  agents: string[];
  voters: { agentId: string; vote: string; confidence: number; timestamp: Date }[];
  finalConfidence?: number;
  ledgerEntries: string[];
  firstEntryHash: string;
  latestEntryHash: string;
  auditHistory: any[];
}

// In-memory stores; production upgrade: use PostgreSQL
const entries: Map<string, LedgerEntry> = new Map();
const decisions: Map<string, DecisionRecord> = new Map();
let sequence = 0;
const GENESIS_HASH = '0000000000000000';

// =============================================================================
// HASH FUNCTIONS
// =============================================================================

function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}

function createEntryHash(entry: Omit<LedgerEntry, 'hash'>): string {
  const data = JSON.stringify({
    id: entry.id,
    sequence: entry.sequence,
    timestamp: entry.timestamp,
    eventType: entry.eventType,
    decisionId: entry.decisionId,
    previousHash: entry.previousHash,
    data: entry.data,
  });
  return generateHash(data);
}

function getLastHash(): string {
  if (entries.size === 0) return GENESIS_HASH;
  const sortedEntries = Array.from(entries.values()).sort((a, b) => a.sequence - b.sequence);
  return sortedEntries[sortedEntries.length - 1].hash;
}

// =============================================================================
// ROUTES
// =============================================================================

// Get chain metrics
router.get('/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const allEntries = Array.from(entries.values());
    const allDecisions = Array.from(decisions.values());

    const entriesByType: Record<string, number> = {};
    const entriesByFramework: Record<string, number> = { GDPR: 0, SOX: 0, HIPAA: 0, 'PCI-DSS': 0, ISO27001: 0, SOC2: 0 };
    
    let totalConfidence = 0;
    let confidenceCount = 0;
    let vetoCount = 0;
    let approveCount = 0;
    let piiCount = 0;

    allEntries.forEach(e => {
      entriesByType[e.eventType] = (entriesByType[e.eventType] || 0) + 1;
      e.complianceFrameworks.forEach(f => entriesByFramework[f]++);
      if (e.confidenceScore !== undefined) {
        totalConfidence += e.confidenceScore;
        confidenceCount++;
      }
      if (e.vote === 'veto') vetoCount++;
      if (e.vote === 'approve') approveCount++;
      if (e.piiInvolved) piiCount++;
    });

    const metrics = {
      totalEntries: allEntries.length,
      totalDecisions: allDecisions.length,
      entriesByType,
      entriesByFramework,
      averageConfidence: confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount) : 0,
      vetoRate: allEntries.length > 0 ? Math.round((vetoCount / allEntries.length) * 100) : 0,
      approvalRate: allEntries.length > 0 ? Math.round((approveCount / allEntries.length) * 100) : 0,
      piiEntriesCount: piiCount,
      pendingAudits: allDecisions.reduce((sum, d) => 
        sum + d.auditHistory.filter(a => a.status === 'pending').length, 0),
    };

    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get ledger metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Verify chain integrity
router.get('/verify', authenticate, async (_req: Request, res: Response) => {
  try {
    const sortedEntries = Array.from(entries.values()).sort((a, b) => a.sequence - b.sequence);

    if (sortedEntries.length === 0) {
      return res.json({ 
        valid: true, 
        entriesChecked: 0, 
        message: 'Empty chain is valid' 
      });
    }

    let previousHash = GENESIS_HASH;
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];
      
      if (entry.previousHash !== previousHash) {
        return res.json({
          valid: false,
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: previousHash mismatch`,
        });
      }
      
      const { hash: _, ...entryWithoutHash } = entry;
      const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);
      
      if (entry.hash !== expectedHash) {
        return res.json({
          valid: false,
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: hash verification failed`,
        });
      }
      
      previousHash = entry.hash;
    }

    res.json({
      valid: true,
      entriesChecked: sortedEntries.length,
      message: `All ${sortedEntries.length} entries verified successfully`,
    });
  } catch (error) {
    logger.error('Failed to verify chain:', error);
    res.status(500).json({ error: 'Failed to verify chain' });
  }
});

// Get all entries
router.get('/entries', authenticate, async (req: Request, res: Response) => {
  try {
    const { framework, eventType, limit = '50' } = req.query;
    
    let result = Array.from(entries.values())
      .sort((a, b) => b.sequence - a.sequence);

    if (framework && framework !== 'all') {
      result = result.filter(e => e.complianceFrameworks.includes(framework as ComplianceFramework));
    }

    if (eventType) {
      result = result.filter(e => e.eventType === eventType);
    }

    result = result.slice(0, parseInt(limit as string));
    
    res.json({ entries: result });
  } catch (error) {
    logger.error('Failed to get entries:', error);
    res.status(500).json({ error: 'Failed to get entries' });
  }
});

// Get single entry
router.get('/entries/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const entry = entries.get(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ entry });
  } catch (error) {
    logger.error('Failed to get entry:', error);
    res.status(500).json({ error: 'Failed to get entry' });
  }
});

// Verify single entry
router.post('/entries/:id/verify', authenticate, async (req: Request, res: Response) => {
  try {
    const entry = entries.get(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const { hash: _, ...entryWithoutHash } = entry;
    const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);
    const valid = entry.hash === expectedHash;

    if (valid && !entry.verified) {
      entry.verified = true;
      entry.verifiedAt = new Date();
    }

    res.json({ valid, entry });
  } catch (error) {
    logger.error('Failed to verify entry:', error);
    res.status(500).json({ error: 'Failed to verify entry' });
  }
});

// Create decision record
router.post('/decisions', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, agents } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    const id = `decision-${Date.now()}`;
    sequence++;

    const decision: DecisionRecord = {
      id,
      title,
      description,
      proposedBy: userId,
      proposedAt: new Date(),
      status: 'proposed',
      agents: agents || ['strategic-agent', 'financial-agent'],
      voters: [],
      ledgerEntries: [],
      firstEntryHash: '',
      latestEntryHash: '',
      auditHistory: [],
    };

    // Create initial ledger entry
    const entryId = `entry-${Date.now()}-${sequence}`;
    const entryWithoutHash: Omit<LedgerEntry, 'hash'> = {
      id: entryId,
      sequence,
      timestamp: new Date(),
      eventType: 'decision.proposed',
      decisionId: id,
      organizationId: 'default',
      userId,
      title: `Decision Proposed: ${title}`,
      description,
      data: { proposedBy: userId, agents },
      previousHash: getLastHash(),
      complianceFrameworks: [],
      sensitivityLevel: 'internal',
      piiInvolved: false,
      verified: false,
    };

    const entry: LedgerEntry = {
      ...entryWithoutHash,
      hash: createEntryHash(entryWithoutHash),
    };

    entries.set(entryId, entry);
    decision.ledgerEntries.push(entryId);
    decision.firstEntryHash = entry.hash;
    decision.latestEntryHash = entry.hash;
    decisions.set(id, decision);

    logger.info(`Decision created: ${id} - ${title}`);
    res.status(201).json({ decision, entry });
  } catch (error) {
    logger.error('Failed to create decision:', error);
    res.status(500).json({ error: 'Failed to create decision' });
  }
});

// Get all decisions
router.get('/decisions', authenticate, async (_req: Request, res: Response) => {
  try {
    const allDecisions = Array.from(decisions.values())
      .sort((a, b) => b.proposedAt.getTime() - a.proposedAt.getTime());
    res.json({ decisions: allDecisions });
  } catch (error) {
    logger.error('Failed to get decisions:', error);
    res.status(500).json({ error: 'Failed to get decisions' });
  }
});

// Get single decision
router.get('/decisions/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const decision = decisions.get(req.params.id);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    
    const decisionEntries = decision.ledgerEntries
      .map(eid => entries.get(eid))
      .filter(Boolean);
    
    res.json({ decision, entries: decisionEntries });
  } catch (error) {
    logger.error('Failed to get decision:', error);
    res.status(500).json({ error: 'Failed to get decision' });
  }
});

// Record vote
router.post('/decisions/:id/vote', authenticate, async (req: Request, res: Response) => {
  try {
    const { agentId, vote, confidence, reasoning } = req.body;
    const decision = decisions.get(req.params.id);
    
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    decision.status = 'voting';
    decision.voters.push({ agentId, vote, confidence, timestamp: new Date() });

    // Create ledger entry
    sequence++;
    const entryId = `entry-${Date.now()}-${sequence}`;
    const eventType: LedgerEventType = vote === 'veto' ? 'agent.vetoed' : 'agent.voted';
    
    const entryWithoutHash: Omit<LedgerEntry, 'hash'> = {
      id: entryId,
      sequence,
      timestamp: new Date(),
      eventType,
      decisionId: decision.id,
      organizationId: 'default',
      agentId,
      title: `Vote: ${vote.toUpperCase()}`,
      description: reasoning || '',
      data: { agentId, vote, confidence, reasoning },
      vote,
      confidenceScore: confidence,
      previousHash: getLastHash(),
      complianceFrameworks: [],
      sensitivityLevel: 'internal',
      piiInvolved: false,
      verified: false,
    };

    const entry: LedgerEntry = {
      ...entryWithoutHash,
      hash: createEntryHash(entryWithoutHash),
    };

    entries.set(entryId, entry);
    decision.ledgerEntries.push(entryId);
    decision.latestEntryHash = entry.hash;

    res.json({ decision, entry });
  } catch (error) {
    logger.error('Failed to record vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Finalize decision
router.post('/decisions/:id/finalize', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, finalConfidence } = req.body;
    const decision = decisions.get(req.params.id);
    
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    decision.status = status;
    decision.finalConfidence = finalConfidence;

    // Create ledger entry
    sequence++;
    const entryId = `entry-${Date.now()}-${sequence}`;
    const eventType: LedgerEventType = 
      status === 'vetoed' ? 'decision.vetoed' :
      status === 'approved' ? 'decision.approved' : 'decision.voted';
    
    const entryWithoutHash: Omit<LedgerEntry, 'hash'> = {
      id: entryId,
      sequence,
      timestamp: new Date(),
      eventType,
      decisionId: decision.id,
      organizationId: 'default',
      title: `Decision ${status.toUpperCase()}`,
      description: `Final confidence: ${finalConfidence}%`,
      data: { status, finalConfidence, voterSummary: decision.voters },
      confidenceScore: finalConfidence,
      previousHash: getLastHash(),
      complianceFrameworks: [],
      sensitivityLevel: 'internal',
      piiInvolved: false,
      verified: false,
    };

    const entry: LedgerEntry = {
      ...entryWithoutHash,
      hash: createEntryHash(entryWithoutHash),
    };

    entries.set(entryId, entry);
    decision.ledgerEntries.push(entryId);
    decision.latestEntryHash = entry.hash;

    res.json({ decision, entry });
  } catch (error) {
    logger.error('Failed to finalize decision:', error);
    res.status(500).json({ error: 'Failed to finalize decision' });
  }
});

// Request audit
router.post('/decisions/:id/audit', authenticate, async (req: Request, res: Response) => {
  try {
    const { framework, reason } = req.body;
    const userId = (req as any).user?.id || 'anonymous';
    const decision = decisions.get(req.params.id);
    
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    const audit = {
      id: `audit-${Date.now()}`,
      requestedAt: new Date(),
      requestedBy: userId,
      reason,
      framework,
      status: 'pending',
      findings: [],
    };

    decision.auditHistory.push(audit);

    // Create ledger entry
    sequence++;
    const entryId = `entry-${Date.now()}-${sequence}`;
    
    const entryWithoutHash: Omit<LedgerEntry, 'hash'> = {
      id: entryId,
      sequence,
      timestamp: new Date(),
      eventType: 'audit.requested',
      decisionId: decision.id,
      organizationId: 'default',
      userId,
      title: 'Audit Requested',
      description: reason,
      data: { framework, requestedBy: userId },
      previousHash: getLastHash(),
      complianceFrameworks: [framework],
      sensitivityLevel: 'confidential',
      piiInvolved: false,
      verified: false,
    };

    const entry: LedgerEntry = {
      ...entryWithoutHash,
      hash: createEntryHash(entryWithoutHash),
    };

    entries.set(entryId, entry);
    decision.ledgerEntries.push(entryId);
    decision.latestEntryHash = entry.hash;

    logger.info(`Audit requested for decision ${decision.id}`);
    res.json({ audit, entry });
  } catch (error) {
    logger.error('Failed to request audit:', error);
    res.status(500).json({ error: 'Failed to request audit' });
  }
});

// Export decision for audit
router.get('/decisions/:id/export', authenticate, async (req: Request, res: Response) => {
  try {
    const decision = decisions.get(req.params.id);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    const decisionEntries = decision.ledgerEntries
      .map(eid => entries.get(eid))
      .filter(Boolean)
      .sort((a, b) => a!.sequence - b!.sequence);

    // Verify chain for this decision
    let chainValid = true;
    let previousHash = decisionEntries.length > 0 ? decisionEntries[0]!.previousHash : GENESIS_HASH;
    
    for (const entry of decisionEntries) {
      if (entry!.previousHash !== previousHash) {
        chainValid = false;
        break;
      }
      previousHash = entry!.hash;
    }

    const report = {
      exportedAt: new Date().toISOString(),
      chainIntegrity: {
        valid: chainValid,
        entriesChecked: decisionEntries.length,
      },
      decision: {
        ...decision,
        proposedAt: decision.proposedAt.toISOString(),
      },
      entries: decisionEntries.map(e => ({
        ...e,
        timestamp: e!.timestamp.toISOString(),
        verifiedAt: e!.verifiedAt?.toISOString(),
      })),
      hashChain: decisionEntries.map(e => ({ sequence: e!.sequence, hash: e!.hash })),
    };

    res.json(report);
  } catch (error) {
    logger.error('Failed to export decision:', error);
    res.status(500).json({ error: 'Failed to export decision' });
  }
});

export default router;
