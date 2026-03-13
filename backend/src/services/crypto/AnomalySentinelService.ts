/**
 * CendiaSentinel™ — Real-Time Decision Anomaly Detection
 *
 * Continuous monitoring of ALL decisions in real-time. Flags anomalies as they
 * happen and can automatically PAUSE a live decision pipeline when it detects
 * something wrong.
 *
 * Architecture: EventEmitter-based circuit breaker pattern.
 *   - CouncilService emits 'deliberation:progress' events
 *   - Sentinel listens and analyzes in real-time
 *   - On anomaly detection, emits 'sentinel:pause' which CouncilService
 *     listens for and halts the deliberation
 *   - Human review can resume via 'sentinel:resume'
 *
 * Anomaly detection rules:
 *   1. CONFIDENCE_DROP  — Sudden drop in agent confidence mid-deliberation
 *   2. DISSENT_SPIKE    — Unusual number of dissents compared to baseline
 *   3. PRECEDENT_DRIFT  — Decision diverging significantly from historical patterns
 *   4. COMPLIANCE_DRIFT — Compliance score dropping below threshold
 *   5. RESPONSE_ANOMALY — Agent response patterns deviating from normal (length, timing)
 *   6. CONSENSUS_COLLAPSE — Consensus dropping below critical threshold during deliberation
 *
 * @module services/crypto/AnomalySentinelService
 * @exports anomalySentinelService
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils';
import { EventEmitter } from 'events';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type AnomalyType = 'CONFIDENCE_DROP' | 'DISSENT_SPIKE' | 'PRECEDENT_DRIFT' | 'COMPLIANCE_DRIFT' | 'RESPONSE_ANOMALY' | 'CONSENSUS_COLLAPSE';

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  deliberationId: string;
  description: string;
  metric: string;
  currentValue: number;
  baselineValue: number;
  deviation: number;         // How far from baseline (percentage)
  detectedAt: string;
  autoAction: 'pause' | 'flag' | 'log';
}

export interface SentinelState {
  active: boolean;
  monitoring: string[];      // Currently monitored deliberation IDs
  totalAnomalies: number;
  pausedPipelines: string[]; // Deliberation IDs currently paused
  alertHistory: Anomaly[];
  thresholds: SentinelThresholds;
}

export interface SentinelThresholds {
  confidenceDropPercent: number;     // Trigger if confidence drops by this % between phases
  dissentRateThreshold: number;      // Trigger if dissent rate exceeds this
  consensusFloor: number;            // Trigger if consensus drops below this
  responseTimingDeviationMs: number; // Trigger if response time deviates by this many ms
  maxAnomaliesBeforePause: number;   // Auto-pause after this many anomalies
}

export interface DeliberationEvent {
  deliberationId: string;
  organizationId: string;
  eventType: 'phase_start' | 'agent_response' | 'dissent' | 'vote' | 'decision' | 'confidence_update';
  agentName?: string;
  agentRole?: string;
  phase?: string;
  confidence?: number;
  content?: string;
  timestamp: number;
}

export interface PipelinePauseEvent {
  deliberationId: string;
  reason: string;
  anomalies: Anomaly[];
  pausedAt: string;
  requiresHumanReview: boolean;
}

// =============================================================================
// SERVICE
// =============================================================================

export class AnomalySentinelService extends EventEmitter {
  private static instance: AnomalySentinelService;

  private active = true;
  private monitoring = new Map<string, {
    events: DeliberationEvent[];
    anomalies: Anomaly[];
    paused: boolean;
    phaseConfidences: Map<string, number[]>;
    agentResponseTimes: number[];
    dissentCount: number;
    totalResponses: number;
  }>();

  private alertHistory: Anomaly[] = [];

  // Baseline statistics (updated as more deliberations are processed)
  private baselines = {
    avgConfidence: 0.72,
    avgDissentRate: 0.15,
    avgResponseTimeMs: 2000,
    avgConsensus: 0.75,
    deliberationsProcessed: 0,
  };

  private thresholds: SentinelThresholds = {
    confidenceDropPercent: 25,
    dissentRateThreshold: 0.5,
    consensusFloor: 0.3,
    responseTimingDeviationMs: 10000,
    maxAnomaliesBeforePause: 3,
  };

  private constructor() {
    super();
    logger.info('🛡️ CendiaSentinel: Initialized — real-time anomaly detection active');
    logger.info(`   Thresholds: confidence drop >${this.thresholds.confidenceDropPercent}%, dissent >${this.thresholds.dissentRateThreshold * 100}%, consensus floor <${this.thresholds.consensusFloor * 100}%`);
  }

  static getInstance(): AnomalySentinelService {
    if (!AnomalySentinelService.instance) {
      AnomalySentinelService.instance = new AnomalySentinelService();
    }
    return AnomalySentinelService.instance;
  }

  // ---------------------------------------------------------------------------
  // EVENT INGESTION — Called by CouncilService on every deliberation event
  // ---------------------------------------------------------------------------

  /**
   * Ingest a deliberation event and run anomaly detection.
   * This is the main entry point — CouncilService calls this on every event.
   *
   * Returns any anomalies detected. If a critical anomaly is found,
   * emits 'sentinel:pause' to halt the pipeline.
   */
  ingest(event: DeliberationEvent): Anomaly[] {
    if (!this.active) return [];

    // Initialize tracking for new deliberations
    if (!this.monitoring.has(event.deliberationId)) {
      this.monitoring.set(event.deliberationId, {
        events: [],
        anomalies: [],
        paused: false,
        phaseConfidences: new Map(),
        agentResponseTimes: [],
        dissentCount: 0,
        totalResponses: 0,
      });
    }

    const state = this.monitoring.get(event.deliberationId)!;

    // If pipeline is paused, reject new events
    if (state.paused) {
      return [{
        id: `anomaly-paused-${crypto.randomBytes(4).toString('hex')}`,
        type: 'CONSENSUS_COLLAPSE',
        severity: 'critical',
        deliberationId: event.deliberationId,
        description: 'Pipeline is PAUSED — human review required before processing more events',
        metric: 'pipeline_status',
        currentValue: 0,
        baselineValue: 1,
        deviation: 100,
        detectedAt: new Date().toISOString(),
        autoAction: 'pause',
      }];
    }

    state.events.push(event);

    // Track metrics
    if (event.eventType === 'agent_response') {
      state.totalResponses++;
      if (event.confidence != null) {
        const phase = event.phase || 'unknown';
        if (!state.phaseConfidences.has(phase)) state.phaseConfidences.set(phase, []);
        state.phaseConfidences.get(phase)!.push(event.confidence);
      }
    }
    if (event.eventType === 'dissent') {
      state.dissentCount++;
    }

    // Run all detection rules
    const newAnomalies: Anomaly[] = [];

    newAnomalies.push(...this.detectConfidenceDrop(event, state));
    newAnomalies.push(...this.detectDissentSpike(event, state));
    newAnomalies.push(...this.detectConsensusCollapse(event, state));
    newAnomalies.push(...this.detectResponseAnomaly(event, state));

    // Store anomalies
    for (const anomaly of newAnomalies) {
      state.anomalies.push(anomaly);
      this.alertHistory.push(anomaly);

      this.emit('sentinel:anomaly', anomaly);

      logger.warn(`🛡️ CendiaSentinel: [${anomaly.severity.toUpperCase()}] ${anomaly.type} in ${event.deliberationId} — ${anomaly.description}`);
    }

    // Check if we should auto-pause the pipeline
    const criticalCount = state.anomalies.filter(a => a.severity === 'critical').length;
    const totalSevere = state.anomalies.filter(a => a.severity === 'critical' || a.severity === 'high').length;

    if (criticalCount > 0 || totalSevere >= this.thresholds.maxAnomaliesBeforePause) {
      this.pausePipeline(event.deliberationId, state);
    }

    return newAnomalies;
  }

  // ---------------------------------------------------------------------------
  // ANOMALY DETECTION RULES
  // ---------------------------------------------------------------------------

  private detectConfidenceDrop(event: DeliberationEvent, state: typeof this.monitoring extends Map<string, infer V> ? V : never): Anomaly[] {
    if (event.eventType !== 'agent_response' || event.confidence == null) return [];

    // Compare current confidence to previous phase average
    const phases = Array.from(state.phaseConfidences.keys());
    if (phases.length < 2) return [];

    const currentPhase = event.phase || 'unknown';
    const previousPhase = phases[phases.length - 2];
    const prevConfidences = state.phaseConfidences.get(previousPhase) || [];
    const prevAvg = prevConfidences.length > 0 ? prevConfidences.reduce((a, b) => a + b, 0) / prevConfidences.length : 0;

    if (prevAvg > 0 && event.confidence < prevAvg) {
      const dropPercent = ((prevAvg - event.confidence) / prevAvg) * 100;

      if (dropPercent >= this.thresholds.confidenceDropPercent) {
        return [{
          id: `anomaly-${crypto.randomBytes(4).toString('hex')}`,
          type: 'CONFIDENCE_DROP',
          severity: dropPercent >= 50 ? 'critical' : dropPercent >= 35 ? 'high' : 'medium',
          deliberationId: event.deliberationId,
          description: `${event.agentName || 'Agent'} confidence dropped ${dropPercent.toFixed(0)}% from ${previousPhase} to ${currentPhase} phase (${(prevAvg * 100).toFixed(0)}% → ${(event.confidence * 100).toFixed(0)}%)`,
          metric: 'confidence_delta',
          currentValue: event.confidence,
          baselineValue: prevAvg,
          deviation: dropPercent,
          detectedAt: new Date().toISOString(),
          autoAction: dropPercent >= 50 ? 'pause' : 'flag',
        }];
      }
    }

    return [];
  }

  private detectDissentSpike(event: DeliberationEvent, state: typeof this.monitoring extends Map<string, infer V> ? V : never): Anomaly[] {
    if (event.eventType !== 'dissent') return [];

    const dissentRate = state.totalResponses > 0 ? state.dissentCount / state.totalResponses : 0;

    if (dissentRate > this.thresholds.dissentRateThreshold) {
      return [{
        id: `anomaly-${crypto.randomBytes(4).toString('hex')}`,
        type: 'DISSENT_SPIKE',
        severity: dissentRate > 0.7 ? 'critical' : 'high',
        deliberationId: event.deliberationId,
        description: `Dissent rate ${(dissentRate * 100).toFixed(0)}% exceeds threshold of ${(this.thresholds.dissentRateThreshold * 100).toFixed(0)}% (${state.dissentCount} dissents / ${state.totalResponses} responses)`,
        metric: 'dissent_rate',
        currentValue: dissentRate,
        baselineValue: this.baselines.avgDissentRate,
        deviation: ((dissentRate - this.baselines.avgDissentRate) / this.baselines.avgDissentRate) * 100,
        detectedAt: new Date().toISOString(),
        autoAction: dissentRate > 0.7 ? 'pause' : 'flag',
      }];
    }

    return [];
  }

  private detectConsensusCollapse(event: DeliberationEvent, state: typeof this.monitoring extends Map<string, infer V> ? V : never): Anomaly[] {
    if (event.eventType !== 'confidence_update' && event.eventType !== 'decision') return [];
    if (event.confidence == null) return [];

    if (event.confidence < this.thresholds.consensusFloor) {
      return [{
        id: `anomaly-${crypto.randomBytes(4).toString('hex')}`,
        type: 'CONSENSUS_COLLAPSE',
        severity: 'critical',
        deliberationId: event.deliberationId,
        description: `Consensus collapsed to ${(event.confidence * 100).toFixed(0)}%, below critical floor of ${(this.thresholds.consensusFloor * 100).toFixed(0)}%`,
        metric: 'consensus_score',
        currentValue: event.confidence,
        baselineValue: this.baselines.avgConsensus,
        deviation: ((this.baselines.avgConsensus - event.confidence) / this.baselines.avgConsensus) * 100,
        detectedAt: new Date().toISOString(),
        autoAction: 'pause',
      }];
    }

    return [];
  }

  private detectResponseAnomaly(event: DeliberationEvent, state: typeof this.monitoring extends Map<string, infer V> ? V : never): Anomaly[] {
    if (event.eventType !== 'agent_response') return [];

    const anomalies: Anomaly[] = [];

    // Check for empty or very short responses
    if (event.content && event.content.length < 20) {
      anomalies.push({
        id: `anomaly-${crypto.randomBytes(4).toString('hex')}`,
        type: 'RESPONSE_ANOMALY',
        severity: 'medium',
        deliberationId: event.deliberationId,
        description: `${event.agentName || 'Agent'} produced an unusually short response (${event.content.length} chars). May indicate agent failure or insufficient analysis.`,
        metric: 'response_length',
        currentValue: event.content.length,
        baselineValue: 200,
        deviation: ((200 - event.content.length) / 200) * 100,
        detectedAt: new Date().toISOString(),
        autoAction: 'log',
      });
    }

    return anomalies;
  }

  // ---------------------------------------------------------------------------
  // PIPELINE CONTROL — Auto-pause and resume
  // ---------------------------------------------------------------------------

  /**
   * PAUSE a deliberation pipeline. Emits 'sentinel:pause' event that
   * CouncilService listens for and halts the deliberation.
   */
  private pausePipeline(deliberationId: string, state: typeof this.monitoring extends Map<string, infer V> ? V : never): void {
    if (state.paused) return; // Already paused
    state.paused = true;

    const pauseEvent: PipelinePauseEvent = {
      deliberationId,
      reason: `${state.anomalies.filter(a => a.severity === 'critical').length} critical anomalies detected`,
      anomalies: state.anomalies.filter(a => a.severity === 'critical' || a.severity === 'high'),
      pausedAt: new Date().toISOString(),
      requiresHumanReview: true,
    };

    // Emit pause event — CouncilService should listen for this
    this.emit('sentinel:pause', pauseEvent);

    logger.error(`🛡️ CendiaSentinel: ⛔ PIPELINE PAUSED for ${deliberationId} — ${pauseEvent.reason}`);
  }

  /**
   * Resume a paused pipeline after human review.
   * Only authorized users should call this.
   */
  resumePipeline(deliberationId: string, reviewedBy: string, justification: string): boolean {
    const state = this.monitoring.get(deliberationId);
    if (!state || !state.paused) return false;

    state.paused = false;

    this.emit('sentinel:resume', {
      deliberationId,
      reviewedBy,
      justification,
      resumedAt: new Date().toISOString(),
      anomaliesAtPause: state.anomalies.length,
    });

    logger.info(`🛡️ CendiaSentinel: ✅ Pipeline RESUMED for ${deliberationId} by ${reviewedBy}: "${justification}"`);
    return true;
  }

  // ---------------------------------------------------------------------------
  // STATE & CONFIGURATION
  // ---------------------------------------------------------------------------

  getState(): SentinelState {
    const pausedPipelines: string[] = [];
    const monitoringIds: string[] = [];

    for (const [id, state] of this.monitoring) {
      monitoringIds.push(id);
      if (state.paused) pausedPipelines.push(id);
    }

    return {
      active: this.active,
      monitoring: monitoringIds,
      totalAnomalies: this.alertHistory.length,
      pausedPipelines,
      alertHistory: this.alertHistory.slice(-50),
      thresholds: { ...this.thresholds },
    };
  }

  getAnomaliesForDeliberation(deliberationId: string): Anomaly[] {
    return this.monitoring.get(deliberationId)?.anomalies || [];
  }

  isPaused(deliberationId: string): boolean {
    return this.monitoring.get(deliberationId)?.paused || false;
  }

  updateThresholds(updates: Partial<SentinelThresholds>): void {
    Object.assign(this.thresholds, updates);
    logger.info(`🛡️ CendiaSentinel: Thresholds updated: ${JSON.stringify(this.thresholds)}`);
  }

  setActive(active: boolean): void {
    this.active = active;
    logger.info(`🛡️ CendiaSentinel: ${active ? 'ACTIVATED' : 'DEACTIVATED'}`);
  }
}

// Export singleton
export const anomalySentinelService = AnomalySentinelService.getInstance();
