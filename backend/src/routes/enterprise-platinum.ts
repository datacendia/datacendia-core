/**
 * API Routes — Enterprise Platinum Innovative Features
 * 
 * Consolidated routes for:
 * - Self-Healing Compliance
 * - Governance Graph
 * - Regulatory Simulation
 * - Ethics Sentinel
 * - Data Sovereignty
 * - HITL Orchestration
 * - Trust Score API
 * - Autonomous Agents
 * - ZKP Compliance Verification
 * - Compliance Marketplace
 * 
 * @module routes/enterprise-platinum
 */

import { Router, Request, Response } from 'express';
import { selfHealingCompliance } from '../services/enterprise/SelfHealingComplianceService.js';
import { governanceGraph } from '../services/enterprise/GovernanceGraphService.js';
import { regulatorySimulation } from '../services/enterprise/RegulatorySimulationService.js';
import { ethicsSentinel } from '../services/enterprise/EthicsSentinelService.js';
import { dataSovereignty } from '../services/enterprise/DataSovereigntyService.js';
import { hitlOrchestration } from '../services/enterprise/HITLOrchestrationService.js';
import { trustScoreService } from '../services/enterprise/TrustScoreService.js';
import { autonomousAgents } from '../services/enterprise/AutonomousAgentService.js';
import { zkpCompliance } from '../services/enterprise/ZKPComplianceService.js';
import { complianceMarketplace } from '../services/enterprise/ComplianceMarketplaceService.js';

const router = Router();

// =============================================================================
// SELF-HEALING COMPLIANCE
// =============================================================================

router.get('/self-healing/drifts', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await selfHealingCompliance.listDrifts({ severity: req.query.severity as any, type: req.query.type as any }) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list drifts' }); }
});

router.post('/self-healing/detect', async (req: Request, res: Response) => {
  try {
    const drift = await selfHealingCompliance.detectDrift(req.body.resource, req.body.expectedState, req.body.actualState);
    res.json({ success: true, data: drift });
  } catch (e) { res.status(500).json({ success: false, error: 'Detection failed' }); }
});

router.post('/self-healing/remediate', async (req: Request, res: Response) => {
  try {
    const exec = await selfHealingCompliance.executeRemediation(req.body.driftId, req.body.playbookId);
    res.json({ success: true, data: exec });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/self-healing/playbooks', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await selfHealingCompliance.listPlaybooks() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list playbooks' }); }
});

router.post('/self-healing/playbooks', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await selfHealingCompliance.createPlaybook(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to create playbook' }); }
});

router.get('/self-healing/executions', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await selfHealingCompliance.listExecutions(req.query.driftId as string) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list executions' }); }
});

// =============================================================================
// GOVERNANCE GRAPH
// =============================================================================

router.get('/governance-graph', async (req: Request, res: Response) => {
  try {
    const query = {
      nodeTypes: req.query.nodeTypes ? (req.query.nodeTypes as string).split(',') as any : undefined,
      edgeTypes: req.query.edgeTypes ? (req.query.edgeTypes as string).split(',') as any : undefined,
      rootNodeId: req.query.rootNodeId as string,
      depth: req.query.depth ? parseInt(req.query.depth as string) : undefined,
      includeProofs: req.query.includeProofs === 'true',
    };
    res.json({ success: true, data: await governanceGraph.getGraph(query) });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get graph' }); }
});

router.post('/governance-graph/nodes', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await governanceGraph.addNode(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to add node' }); }
});

router.post('/governance-graph/edges', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await governanceGraph.addEdge(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to add edge' }); }
});

router.get('/governance-graph/trace', async (req: Request, res: Response) => {
  try {
    const result = await governanceGraph.traceLineage(req.query.from as string, req.query.to as string);
    if (!result) return res.status(404).json({ success: false, error: 'Path not found' });
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: 'Trace failed' }); }
});

router.get('/governance-graph/nodes/:id/neighbors', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await governanceGraph.getNodeNeighbors(req.params.id) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get neighbors' }); }
});

// =============================================================================
// REGULATORY SIMULATION
// =============================================================================

router.get('/reg-sim/regulations', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await regulatorySimulation.listRegulatoryChanges() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list regulations' }); }
});

router.post('/reg-sim/regulations', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await regulatorySimulation.createRegulatoryChange(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to create regulation' }); }
});

router.post('/reg-sim/scenarios', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await regulatorySimulation.createScenario(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to create scenario' }); }
});

router.post('/reg-sim/scenarios/:id/run', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await regulatorySimulation.runSimulation(req.params.id) }); }
  catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/reg-sim/results', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await regulatorySimulation.listResults() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list results' }); }
});

router.get('/reg-sim/results/:id', async (req: Request, res: Response) => {
  try {
    const result = await regulatorySimulation.getResult(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: 'Result not found' });
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get result' }); }
});

// =============================================================================
// ETHICS SENTINEL
// =============================================================================

router.get('/ethics/dashboard', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await ethicsSentinel.getDashboard() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get dashboard' }); }
});

router.post('/ethics/monitors', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await ethicsSentinel.configureMonitor(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to configure monitor' }); }
});

router.get('/ethics/monitors/:modelId', async (req: Request, res: Response) => {
  try {
    const config = await ethicsSentinel.getMonitorConfig(req.params.modelId);
    if (!config) return res.status(404).json({ success: false, error: 'Monitor not found' });
    res.json({ success: true, data: config });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get monitor' }); }
});

router.post('/ethics/evaluate', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await ethicsSentinel.evaluateModel(req.body.modelId, req.body.predictions) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Evaluation failed' }); }
});

router.get('/ethics/metrics/:modelId', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await ethicsSentinel.getMetricsHistory(req.params.modelId) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get metrics' }); }
});

router.get('/ethics/alerts', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await ethicsSentinel.listAlerts({ modelId: req.query.modelId as string, severity: req.query.severity as string, status: req.query.status as string }) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list alerts' }); }
});

router.post('/ethics/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const alert = await ethicsSentinel.acknowledgeAlert(req.params.id, userId);
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    res.json({ success: true, data: alert });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to acknowledge' }); }
});

router.post('/ethics/alerts/:id/resolve', async (req: Request, res: Response) => {
  try {
    const alert = await ethicsSentinel.resolveAlert(req.params.id, req.body.mitigationAction);
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    res.json({ success: true, data: alert });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to resolve' }); }
});

// =============================================================================
// DATA SOVEREIGNTY
// =============================================================================

router.get('/sovereignty/policies', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await dataSovereignty.listPolicies() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list policies' }); }
});

router.post('/sovereignty/policies', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await dataSovereignty.createPolicy(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to create policy' }); }
});

router.post('/sovereignty/route', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await dataSovereignty.routeData(req.body.dataClassification, req.body.sourceRegion, req.body.userContext) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Routing failed' }); }
});

router.get('/sovereignty/regions', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await dataSovereignty.getRegionStatuses() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get regions' }); }
});

router.get('/sovereignty/history', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await dataSovereignty.getRoutingHistory(parseInt(req.query.limit as string) || 100) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get history' }); }
});

// =============================================================================
// HITL ORCHESTRATION
// =============================================================================

router.get('/hitl/workflows', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await hitlOrchestration.listWorkflows() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list workflows' }); }
});

router.post('/hitl/workflows', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await hitlOrchestration.createWorkflow(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to create workflow' }); }
});

router.post('/hitl/reviews', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await hitlOrchestration.initiateReview(req.body.workflowId, req.body.entityType, req.body.entityId) }); }
  catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/hitl/reviews', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await hitlOrchestration.listInstances({ status: req.query.status as any, entityType: req.query.entityType as string }) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list reviews' }); }
});

router.get('/hitl/reviews/:id', async (req: Request, res: Response) => {
  try {
    const instance = await hitlOrchestration.getInstance(req.params.id);
    if (!instance) return res.status(404).json({ success: false, error: 'Review not found' });
    res.json({ success: true, data: instance });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get review' }); }
});

router.post('/hitl/reviews/:id/decide', async (req: Request, res: Response) => {
  try {
    const instance = await hitlOrchestration.submitDecision(req.params.id, req.body);
    if (!instance) return res.status(404).json({ success: false, error: 'Review not found' });
    res.json({ success: true, data: instance });
  } catch (e) { res.status(500).json({ success: false, error: 'Decision failed' }); }
});

router.post('/hitl/reviews/:id/override', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const instance = await hitlOrchestration.overrideDecision(req.params.id, userId, req.body.reason);
    if (!instance) return res.status(404).json({ success: false, error: 'Review not found' });
    res.json({ success: true, data: instance });
  } catch (e) { res.status(500).json({ success: false, error: 'Override failed' }); }
});

// =============================================================================
// TRUST SCORE API
// =============================================================================

router.post('/trust-score/:orgId/calculate', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await trustScoreService.calculateTrustScore(req.params.orgId) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Calculation failed' }); }
});

router.get('/trust-score/:orgId', async (req: Request, res: Response) => {
  try {
    const score = await trustScoreService.getTrustScore(req.params.orgId);
    if (!score) return res.status(404).json({ success: false, error: 'Trust score not found. Call POST /calculate first.' });
    res.json({ success: true, data: score });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get trust score' }); }
});

router.get('/trust-score/:orgId/history', async (req: Request, res: Response) => {
  try {
    const history = await trustScoreService.getHistory(req.params.orgId);
    res.json({ success: true, data: history });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get history' }); }
});

router.post('/trust-score/:orgId/verify', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await trustScoreService.verifyTrustScore(req.params.orgId, req.body.cryptoProof) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Verification failed' }); }
});

router.get('/trust-score/:orgId/badge', async (req: Request, res: Response) => {
  try {
    const badge = await trustScoreService.generateBadge(req.params.orgId);
    if (!badge) return res.status(404).json({ success: false, error: 'Calculate trust score first' });
    res.json({ success: true, data: badge });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to generate badge' }); }
});

router.post('/trust-score/compare', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await trustScoreService.compareTrustScores(req.body.organizationIds) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Comparison failed' }); }
});

// =============================================================================
// AUTONOMOUS COMPLIANCE AGENTS
// =============================================================================

router.get('/agents/dashboard', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await autonomousAgents.getDashboard() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get dashboard' }); }
});

router.get('/agents', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await autonomousAgents.listAgents() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list agents' }); }
});

router.post('/agents', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await autonomousAgents.createAgent(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to create agent' }); }
});

router.get('/agents/:id', async (req: Request, res: Response) => {
  try {
    const agent = await autonomousAgents.getAgent(req.params.id);
    if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
    res.json({ success: true, data: agent });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get agent' }); }
});

router.post('/agents/:id/run', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await autonomousAgents.runAgent(req.params.id) }); }
  catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/agents/findings', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await autonomousAgents.listFindings(req.query.agentId as string, req.query.severity as string) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list findings' }); }
});

router.get('/agents/runs', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await autonomousAgents.listRuns(req.query.agentId as string) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list runs' }); }
});

// =============================================================================
// ZKP COMPLIANCE VERIFICATION
// =============================================================================

router.get('/zkp/dashboard', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await zkpCompliance.getDashboard() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get dashboard' }); }
});

router.post('/zkp/proofs', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await zkpCompliance.generateProof(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to generate proof' }); }
});

router.get('/zkp/proofs', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await zkpCompliance.listProofs({ type: req.query.type as any, subject: req.query.subject as string, issuer: req.query.issuer as string, status: req.query.status as string }) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list proofs' }); }
});

router.get('/zkp/proofs/:id', async (req: Request, res: Response) => {
  try {
    const proof = await zkpCompliance.getProof(req.params.id);
    if (!proof) return res.status(404).json({ success: false, error: 'Proof not found' });
    res.json({ success: true, data: proof });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get proof' }); }
});

router.post('/zkp/proofs/:id/verify', async (req: Request, res: Response) => {
  try {
    const verifier = (req as any).user?.id || 'external';
    res.json({ success: true, data: await zkpCompliance.verifyProof(req.params.id, verifier) });
  } catch (e) { res.status(500).json({ success: false, error: 'Verification failed' }); }
});

router.post('/zkp/proofs/:id/revoke', async (req: Request, res: Response) => {
  try {
    const revoker = (req as any).user?.id || 'system';
    const proof = await zkpCompliance.revokeProof(req.params.id, revoker, req.body.reason);
    if (!proof) return res.status(404).json({ success: false, error: 'Proof not found' });
    res.json({ success: true, data: proof });
  } catch (e) { res.status(500).json({ success: false, error: 'Revocation failed' }); }
});

router.get('/zkp/templates', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await zkpCompliance.listTemplates() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list templates' }); }
});

router.get('/zkp/audit', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: zkpCompliance.getAuditLog(req.query.proofId as string) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get audit log' }); }
});

// =============================================================================
// COMPLIANCE MARKETPLACE
// =============================================================================

router.get('/marketplace/dashboard', async (_req: Request, res: Response) => {
  try { res.json({ success: true, data: await complianceMarketplace.getDashboard() }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get dashboard' }); }
});

router.get('/marketplace/packages', async (req: Request, res: Response) => {
  try {
    const result = await complianceMarketplace.search({
      query: req.query.q as string,
      type: req.query.type as any,
      category: req.query.category as string,
      framework: req.query.framework as string,
      pricing: req.query.pricing as string,
      sortBy: (req.query.sortBy as any) || 'popular',
    });
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: 'Search failed' }); }
});

router.get('/marketplace/packages/:id', async (req: Request, res: Response) => {
  try {
    const pkg = await complianceMarketplace.getPackage(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to get package' }); }
});

router.post('/marketplace/packages', async (req: Request, res: Response) => {
  try { res.status(201).json({ success: true, data: await complianceMarketplace.publishPackage(req.body) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to publish package' }); }
});

router.post('/marketplace/packages/:id/install', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'system';
    const result = await complianceMarketplace.installPackage(req.params.id, req.body.organizationId || 'default', userId);
    if (!result) return res.status(404).json({ success: false, error: 'Package not found' });
    res.status(201).json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, error: 'Installation failed' }); }
});

router.get('/marketplace/packages/:id/reviews', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await complianceMarketplace.getPackageReviews(req.params.id) }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to get reviews' }); }
});

router.post('/marketplace/packages/:id/reviews', async (req: Request, res: Response) => {
  try {
    const review = await complianceMarketplace.addReview(req.params.id, req.body);
    if (!review) return res.status(404).json({ success: false, error: 'Package not found' });
    res.status(201).json({ success: true, data: review });
  } catch (e) { res.status(500).json({ success: false, error: 'Failed to add review' }); }
});

router.get('/marketplace/installed', async (req: Request, res: Response) => {
  try { res.json({ success: true, data: await complianceMarketplace.getInstalledPackages(req.query.organizationId as string || 'default') }); }
  catch (e) { res.status(500).json({ success: false, error: 'Failed to list installed' }); }
});

router.delete('/marketplace/installed/:id', async (req: Request, res: Response) => {
  try {
    await complianceMarketplace.uninstallPackage(req.query.organizationId as string || 'default', req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: 'Uninstall failed' }); }
});

export default router;
