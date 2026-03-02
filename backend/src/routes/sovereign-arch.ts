// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SOVEREIGN ARCHITECTURE API ROUTES
// Exposes all 11 enterprise platinum sovereign services
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';

// Import sovereign services
import { dataDiodeService } from '../services/sovereign/DataDiodeService.js';
import { localRLHFService } from '../services/sovereign/LocalRLHFService.js';
import { decisionDNAService } from '../services/sovereign/DecisionDNAService.js';
import { shadowCouncilService } from '../services/sovereign/ShadowCouncilService.js';
import { deterministicReplayService } from '../services/sovereign/DeterministicReplayService.js';
import { qrAirGapBridgeService } from '../services/sovereign/QRAirGapBridgeService.js';
import { canaryTripwireService } from '../services/sovereign/CanaryTripwireService.js';
import { tpmAttestationService } from '../services/sovereign/TPMAttestationService.js';
import { timeLockService } from '../services/sovereign/TimeLockService.js';
import { federatedMeshService } from '../services/sovereign/FederatedMeshService.js';
import { portableInstanceService } from '../services/sovereign/PortableInstanceService.js';

const router = Router();

// Health endpoint (before auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'sovereign-arch', timestamp: new Date().toISOString() } });
});

router.use(devAuth);

// =============================================================================
// SOVEREIGN SERVICES STATUS
// =============================================================================

router.get('/status', async (_req: Request, res: Response) => {
  const diodeStats = dataDiodeService.getStatistics();
  const meshNode = federatedMeshService.getThisNode();
  const tpmKey = tpmAttestationService.getAttestationKey();
  
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      services: {
        dataDiode: { 
          enabled: true, 
          sourcesCount: dataDiodeService.getSources().length,
          totalIngested: diodeStats.totalIngested,
          totalRejected: diodeStats.totalRejected,
        },
        localRLHF: { 
          enabled: true, 
          feedbackCount: localRLHFService.getFeedbackRecords('', 1000).length,
          datasetsCount: localRLHFService.getDatasets('').length,
        },
        decisionDNA: { 
          enabled: true,
        },
        shadowCouncil: { 
          enabled: true, 
          activeSessions: shadowCouncilService.listSessions('').filter((s: { status: string }) => s.status === 'active').length,
          totalSessions: shadowCouncilService.listSessions('').length,
        },
        deterministicReplay: { 
          enabled: true, 
          capturedStates: deterministicReplayService.listStates('').length,
        },
        qrAirGapBridge: { 
          enabled: true,
        },
        canaryTripwires: { 
          enabled: true, 
          deployedCanaries: canaryTripwireService.listCanaries('').filter((c: { status: string }) => c.status === 'active').length,
          triggeredAlerts: canaryTripwireService.listAlerts('').length,
        },
        tpmAttestation: { 
          enabled: true, 
          initialized: tpmKey !== null,
          keyType: tpmKey?.type || null,
        },
        timeLock: { 
          enabled: true, 
          activeVaults: timeLockService.listVaults('').filter((v: { status: string }) => v.status === 'locked').length,
          totalVaults: timeLockService.listVaults('').length,
        },
        federatedMesh: { 
          enabled: true, 
          initialized: meshNode !== null,
          nodeId: meshNode?.id || null,
          knownNodes: federatedMeshService.listNodes().length,
          pendingDeltas: federatedMeshService.listDeltas({ applied: false }).length,
        },
        portableInstance: { 
          enabled: true, 
          configsCount: portableInstanceService.listConfigs('').length,
          imagesCount: portableInstanceService.listImages('').length,
        },
      },
    },
  });
});

// =============================================================================
// DATA DIODE - Unidirectional Ingest
// =============================================================================

router.post('/diode/sources', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const source = await dataDiodeService.registerSource(req.body);
    res.status(201).json({ success: true, data: source });
  } catch (error) {
    next(error);
  }
});

router.get('/diode/sources', async (_req: Request, res: Response) => {
  res.json({ success: true, data: dataDiodeService.getSources() });
});

router.get('/diode/events', async (_req: Request, res: Response) => {
  const limit = 100;  // Fixed limit for simplicity
  res.json({ success: true, data: dataDiodeService.getRecentEvents(limit) });
});

router.get('/diode/statistics', async (_req: Request, res: Response) => {
  res.json({ success: true, data: dataDiodeService.getStatistics() });
});

// =============================================================================
// LOCAL RLHF - Zero-Cloud Learning
// =============================================================================

router.post('/rlhf/feedback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await localRLHFService.recordFeedback({
      ...req.body,
      organizationId: req.organizationId!,
      userId: req.user?.id || 'anonymous',
    });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.get('/rlhf/stats', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: localRLHFService.getFeedbackStats(orgId) });
});

router.post('/rlhf/datasets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataset = await localRLHFService.generateDataset({
      organizationId: req.organizationId!,
      ...req.body,
    });
    res.status(201).json({ success: true, data: dataset });
  } catch (error) {
    next(error);
  }
});

router.get('/rlhf/datasets', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: localRLHFService.getDatasets(orgId) });
});

router.post('/rlhf/lora', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await localRLHFService.createLoraConfig({
      organizationId: req.organizationId!,
      ...req.body,
    });
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
});

router.get('/rlhf/lora/:id/script', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) return res.status(400).json({ success: false, error: 'Missing id parameter' });
    const scriptPath = await localRLHFService.generateTrainingScript(id);
    return res.json({ success: true, data: { scriptPath } });
  } catch (error) {
    return next(error);
  }
});

// =============================================================================
// DECISION DNA - Audit Export
// =============================================================================

router.post('/dna/generate/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberationId = req.params['deliberationId'];
    if (!deliberationId) return res.status(400).json({ success: false, error: 'Missing deliberationId' });
    const dna = await decisionDNAService.generateDNA(deliberationId, req.body);
    return res.json({ success: true, data: dna });
  } catch (error) {
    return next(error);
  }
});

router.post('/dna/export/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberationId = req.params['deliberationId'];
    if (!deliberationId) return res.status(400).json({ success: false, error: 'Missing deliberationId' });
    const dna = await decisionDNAService.generateDNA(deliberationId, req.body);
    const bundlePath = await decisionDNAService.exportAsBundle(dna);
    return res.json({ success: true, data: { dna, bundlePath } });
  } catch (error) {
    return next(error);
  }
});

router.post('/dna/verify', async (req: Request, res: Response) => {
  const result = decisionDNAService.verifyIntegrity(req.body);
  res.json({ success: true, data: result });
});

// =============================================================================
// SHADOW COUNCIL - Sandbox Deliberation
// =============================================================================

router.post('/shadow/sessions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await shadowCouncilService.createSession({
      organizationId: req.organizationId!,
      createdBy: req.user?.id || 'anonymous',
      ...req.body,
    });
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

router.get('/shadow/sessions', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: shadowCouncilService.listSessions(orgId, req.user?.id) });
});

router.get('/shadow/sessions/:id', async (req: Request, res: Response) => {
  const id = req.params['id'];
  if (!id) return res.status(400).json({ success: false, error: 'Missing id parameter' });
  const session = shadowCouncilService.getSession(id);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  return res.json({ success: true, data: session });
});

router.post('/shadow/sessions/:id/deliberate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params['id'];
    if (!sessionId) return res.status(400).json({ success: false, error: 'Missing id parameter' });
    const deliberation = await shadowCouncilService.startDeliberation({
      sessionId,
      ...req.body,
    });
    return res.status(201).json({ success: true, data: deliberation });
  } catch (error) {
    return next(error);
  }
});

router.post('/shadow/sessions/:id/close', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) return res.status(400).json({ success: false, error: 'Missing id parameter' });
    await shadowCouncilService.closeSession(id);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

router.post('/shadow/compare', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shadowDeliberationId, officialDeliberationId } = req.body;
    const result = await shadowCouncilService.compareToOfficial(shadowDeliberationId, officialDeliberationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// DETERMINISTIC REPLAY - Reproducibility
// =============================================================================

router.post('/replay/capture/start', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stateId = await deterministicReplayService.beginCapture({
      organizationId: req.organizationId!,
      ...req.body,
    });
    res.status(201).json({ success: true, data: { stateId } });
  } catch (error) {
    next(error);
  }
});

router.post('/replay/capture/:stateId/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stateId = req.params['stateId'];
    if (!stateId) return res.status(400).json({ success: false, error: 'Missing stateId' });
    const state = await deterministicReplayService.completeCapture(stateId);
    return res.json({ success: true, data: state });
  } catch (error) {
    return next(error);
  }
});

router.post('/replay/:stateId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stateId = req.params['stateId'];
    if (!stateId) return res.status(400).json({ success: false, error: 'Missing stateId' });
    const result = await deterministicReplayService.replay(stateId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/replay/:stateId/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stateId = req.params['stateId'];
    if (!stateId) return res.status(400).json({ success: false, error: 'Missing stateId' });
    const result = await deterministicReplayService.verifyState(stateId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/replay/states', async (req: Request, res: Response) => {
  const orgId = req.query['organizationId'] as string || '';
  res.json({ success: true, data: deterministicReplayService.listStates(orgId) });
});

// =============================================================================
// QR AIR-GAP BRIDGE - Zero-Media Transfer
// =============================================================================

router.post('/qr/payload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await qrAirGapBridgeService.createPayload(req.body);
    res.status(201).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
});

router.post('/qr/sequence/:payloadId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payloadId = req.params['payloadId'];
    if (!payloadId) return res.status(400).json({ success: false, error: 'Missing payloadId' });
    const sequence = await qrAirGapBridgeService.generateSequence(payloadId);
    return res.json({ success: true, data: sequence });
  } catch (error) {
    return next(error);
  }
});

router.post('/qr/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await qrAirGapBridgeService.quickExport(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/qr/capture/start', async (req: Request, res: Response) => {
  const session = qrAirGapBridgeService.startCaptureSession(req.body.expectedPayloadId);
  res.status(201).json({ success: true, data: session });
});

router.post('/qr/capture/:sessionId/scan', async (req: Request, res: Response) => {
  const sessionId = req.params['sessionId'];
  if (!sessionId) return res.status(400).json({ success: false, error: 'Missing sessionId' });
  const result = qrAirGapBridgeService.processCapturedQR(sessionId, req.body.qrData);
  return res.json({ success: true, data: result });
});

router.get('/qr/capture/:sessionId/decode', async (req: Request, res: Response) => {
  const sessionId = req.params['sessionId'];
  if (!sessionId) return res.status(400).json({ success: false, error: 'Missing sessionId' });
  const result = qrAirGapBridgeService.decodeCapturedData(
    sessionId, 
    req.query['decryptionKey'] as string
  );
  return res.json({ success: true, data: result });
});

// =============================================================================
// CANARY TRIPWIRES - Exfiltration Detection
// =============================================================================

router.post('/canary/deploy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const canary = await canaryTripwireService.deployCanary({
      organizationId: req.organizationId!,
      ...req.body,
    });
    res.status(201).json({ success: true, data: canary });
  } catch (error) {
    next(error);
  }
});

router.post('/canary/deploy-network', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const canaries = await canaryTripwireService.deployCanaryNetwork({
      organizationId: req.organizationId!,
      ...req.body,
    });
    res.status(201).json({ success: true, data: canaries });
  } catch (error) {
    next(error);
  }
});

router.get('/canary/list', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: canaryTripwireService.listCanaries(orgId) });
});

router.get('/canary/alerts', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: canaryTripwireService.listAlerts(orgId) });
});

router.get('/canary/status', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: canaryTripwireService.getDeploymentStatus(orgId) });
});

router.post('/canary/trigger', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alert = await canaryTripwireService.reportTrigger(req.body);
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// TPM ATTESTATION - Hardware Signing
// =============================================================================

router.post('/tpm/initialize', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const key = await tpmAttestationService.initialize();
    res.json({ success: true, data: key });
  } catch (error) {
    next(error);
  }
});

router.get('/tpm/key', async (_req: Request, res: Response) => {
  const key = tpmAttestationService.getAttestationKey();
  res.json({ success: true, data: key });
});

router.post('/tpm/sign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signed = await tpmAttestationService.signDecision({
      organizationId: req.organizationId!,
      ...req.body,
    });
    res.json({ success: true, data: signed });
  } catch (error) {
    next(error);
  }
});

router.get('/tpm/verify/:signedId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signedId = req.params['signedId'];
    if (!signedId) return res.status(400).json({ success: false, error: 'Missing signedId' });
    const result = await tpmAttestationService.verifySignature(signedId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/tpm/signatures', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: tpmAttestationService.listSignedDecisions(orgId) });
});

router.get('/tpm/export/:signedId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signedId = req.params['signedId'];
    if (!signedId) return res.status(400).json({ success: false, error: 'Missing signedId' });
    const bundle = await tpmAttestationService.exportVerificationBundle(signedId);
    return res.json({ success: true, data: bundle });
  } catch (error) {
    return next(error);
  }
});

// =============================================================================
// TIME-LOCK - Cryptographic Embargo
// =============================================================================

router.post('/timelock/vaults', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vault = await timeLockService.createVault({
      organizationId: req.organizationId!,
      createdBy: req.user?.id || 'anonymous',
      ...req.body,
    });
    res.status(201).json({ success: true, data: vault });
  } catch (error) {
    next(error);
  }
});

router.get('/timelock/vaults', async (req: Request, res: Response) => {
  const orgId = req.organizationId!;
  res.json({ success: true, data: timeLockService.listVaults(orgId) });
});

router.get('/timelock/vaults/:id', async (req: Request, res: Response) => {
  const id = req.params['id'];
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
  const vault = timeLockService.getVault(id);
  if (!vault) {
    return res.status(404).json({ success: false, error: 'Vault not found' });
  }
  return res.json({ success: true, data: vault });
});

router.post('/timelock/vaults/:id/unlock', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
    const progress = await timeLockService.startUnlock(id);
    return res.json({ success: true, data: progress });
  } catch (error) {
    return next(error);
  }
});

router.get('/timelock/vaults/:id/progress', async (req: Request, res: Response) => {
  const id = req.params['id'];
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
  const progress = timeLockService.getUnlockProgress(id);
  return res.json({ success: true, data: progress });
});

router.get('/timelock/vaults/:id/content', async (req: Request, res: Response) => {
  const id = req.params['id'];
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
  const userId = req.user?.id || 'anonymous';
  const content = timeLockService.getVaultContent(id, userId);
  if (content === null) {
    return res.status(403).json({ success: false, error: 'Vault not accessible' });
  }
  return res.json({ success: true, data: { content } });
});

router.post('/timelock/vaults/:id/revoke', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
    await timeLockService.revokeVault(id, req.user?.id || 'anonymous');
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

// =============================================================================
// FEDERATED MESH - Multi-Site Learning
// =============================================================================

router.post('/mesh/initialize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await federatedMeshService.initializeNode({
      organizationId: req.organizationId!,
      ...req.body,
    });
    res.json({ success: true, data: node });
  } catch (error) {
    next(error);
  }
});

router.get('/mesh/node', async (_req: Request, res: Response) => {
  res.json({ success: true, data: federatedMeshService.getThisNode() });
});

router.get('/mesh/nodes', async (_req: Request, res: Response) => {
  res.json({ success: true, data: federatedMeshService.listNodes() });
});

router.post('/mesh/nodes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await federatedMeshService.registerRemoteNode(req.body);
    res.status(201).json({ success: true, data: node });
  } catch (error) {
    next(error);
  }
});

router.post('/mesh/deltas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const delta = await federatedMeshService.createModelDelta({
      ...req.body,
      deltaData: Buffer.from(req.body.deltaData, 'base64'),
    });
    res.status(201).json({ success: true, data: delta });
  } catch (error) {
    next(error);
  }
});

router.get('/mesh/deltas', async (req: Request, res: Response) => {
  const appliedParam = req.query['applied'];
  // Build filters object conditionally to satisfy exactOptionalPropertyTypes
  const filters: { deltaType?: any; applied?: boolean; baseModel?: string } = {};
  if (req.query['deltaType']) filters.deltaType = req.query['deltaType'] as any;
  if (appliedParam === 'true') filters.applied = true;
  else if (appliedParam === 'false') filters.applied = false;
  if (req.query['baseModel']) filters.baseModel = req.query['baseModel'] as string;
  res.json({ success: true, data: federatedMeshService.listDeltas(filters) });
});

router.post('/mesh/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await federatedMeshService.createExportManifest(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/mesh/import', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await federatedMeshService.importFromManifest(req.body.importPath);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/mesh/deltas/:id/apply', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
    const result = await federatedMeshService.applyDelta(id, req.body.targetModel);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/mesh/statistics', async (_req: Request, res: Response) => {
  res.json({ success: true, data: federatedMeshService.getStatistics() });
});

// =============================================================================
// PORTABLE INSTANCE - USB Deployment
// =============================================================================

router.post('/portable/configs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await portableInstanceService.createConfig({
      organizationId: req.organizationId!,
      createdBy: req.user?.id || 'anonymous',
      ...req.body,
    });
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
});

router.get('/portable/configs', async (req: Request, res: Response) => {
  const orgId = req.query['organizationId'] as string || '';
  res.json({ success: true, data: portableInstanceService.listConfigs(orgId) });
});

router.get('/portable/configs/:id', async (req: Request, res: Response) => {
  const id = req.params['id'];
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
  const config = portableInstanceService.getConfig(id);
  if (!config) {
    return res.status(404).json({ success: false, error: 'Config not found' });
  }
  return res.json({ success: true, data: config });
});

router.post('/portable/build/:configId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configId = req.params['configId'];
    if (!configId) return res.status(400).json({ success: false, error: 'Missing configId' });
    const image = await portableInstanceService.buildImage(configId);
    return res.status(201).json({ success: true, data: image });
  } catch (error) {
    return next(error);
  }
});

router.get('/portable/images', async (req: Request, res: Response) => {
  const configId = req.query['configId'] as string || '';
  res.json({ success: true, data: portableInstanceService.listImages(configId) });
});

router.get('/portable/images/:id', async (req: Request, res: Response) => {
  const id = req.params['id'];
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
  const image = portableInstanceService.getImage(id);
  if (!image) {
    return res.status(404).json({ success: false, error: 'Image not found' });
  }
  return res.json({ success: true, data: image });
});

router.get('/portable/images/:id/progress', async (req: Request, res: Response) => {
  const id = req.params['id'];
  if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
  const progress = portableInstanceService.getBuildProgress(id);
  return res.json({ success: true, data: progress });
});

router.get('/portable/images/:id/download', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'];
    if (!id) return res.status(400).json({ success: false, error: 'Missing id' });
    const result = await portableInstanceService.downloadImage(id);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

export default router;
