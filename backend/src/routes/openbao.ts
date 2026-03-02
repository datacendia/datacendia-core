// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// OpenBao/Vault KMS ADMIN & SECRETS API ROUTES
// Mounted at /api/v1/openbao
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { openBao } from '../services/vault/OpenBaoService.js';

const router = Router();
router.use(devAuth);

// ─── Health & Stats ────────────────────────────────────────────────────

router.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = await openBao.checkHealth();
    res.json({ success: true, data: health });
  } catch (error) { next(error); }
});

router.get('/stats', (_req: Request, res: Response) => {
  res.json({ success: true, data: openBao.getStats() });
});

// ─── KV Secrets ────────────────────────────────────────────────────────

router.get('/secrets/*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = req.params[0] || '';
    const mount = (req.query.mount as string) || 'secret';

    if (!path) {
      const keys = await openBao.listSecrets('', mount);
      res.json({ success: true, data: { keys } });
      return;
    }

    const secret = await openBao.readSecret(path, mount);
    if (!secret) {
      res.status(404).json({ success: false, error: 'Secret not found' });
      return;
    }
    res.json({ success: true, data: secret });
  } catch (error) { next(error); }
});

router.put('/secrets/*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = req.params[0] || '';
    const mount = (req.query.mount as string) || 'secret';
    const { data } = req.body;

    if (!path || !data) {
      res.status(400).json({ success: false, error: 'Path and data are required' });
      return;
    }

    const success = await openBao.writeSecret(path, data, mount);
    logger.info(`[OpenBao API] Secret written to ${path} by ${req.user?.email || 'unknown'}`);
    res.json({ success, data: { path, written: success } });
  } catch (error) { next(error); }
});

router.delete('/secrets/*', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = req.params[0] || '';
    const mount = (req.query.mount as string) || 'secret';

    const success = await openBao.deleteSecret(path, mount);
    res.json({ success, data: { path, deleted: success } });
  } catch (error) { next(error); }
});

// ─── Transit Engine ────────────────────────────────────────────────────

router.post('/transit/encrypt', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyName, plaintext, mount } = req.body;
    if (!keyName || !plaintext) {
      res.status(400).json({ success: false, error: 'keyName and plaintext are required' });
      return;
    }

    const ciphertext = await openBao.transitEncrypt(keyName, plaintext, mount);
    res.json({ success: !!ciphertext, data: { ciphertext } });
  } catch (error) { next(error); }
});

router.post('/transit/decrypt', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyName, ciphertext, mount } = req.body;
    if (!keyName || !ciphertext) {
      res.status(400).json({ success: false, error: 'keyName and ciphertext are required' });
      return;
    }

    const plaintext = await openBao.transitDecrypt(keyName, ciphertext, mount);
    res.json({ success: !!plaintext, data: { plaintext } });
  } catch (error) { next(error); }
});

router.post('/transit/keys', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyName, type, mount } = req.body;
    if (!keyName) {
      res.status(400).json({ success: false, error: 'keyName is required' });
      return;
    }

    const key = await openBao.transitCreateKey(keyName, type, mount);
    res.json({ success: !!key, data: key });
  } catch (error) { next(error); }
});

router.post('/transit/keys/:keyName/rotate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mount = (req.query.mount as string) || undefined;
    const success = await openBao.transitRotateKey(req.params.keyName!, mount);
    res.json({ success, data: { keyName: req.params.keyName, rotated: success } });
  } catch (error) { next(error); }
});

// ─── PKI ───────────────────────────────────────────────────────────────

router.post('/pki/issue', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commonName, altNames, ttl, role, mount } = req.body;
    if (!commonName) {
      res.status(400).json({ success: false, error: 'commonName is required' });
      return;
    }

    const cert = await openBao.issueCertificate({ commonName, altNames, ttl, role, mount });
    if (!cert) {
      res.status(503).json({ success: false, error: 'PKI engine unavailable' });
      return;
    }

    logger.info(`[OpenBao API] Certificate issued for ${commonName} by ${req.user?.email || 'unknown'}`);
    res.json({ success: true, data: cert });
  } catch (error) { next(error); }
});

// ─── Dynamic Credentials ───────────────────────────────────────────────

router.get('/database/creds/:role', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mount = (req.query.mount as string) || undefined;
    const cred = await openBao.getDatabaseCredentials(req.params.role!, mount);

    if (!cred) {
      res.status(503).json({ success: false, error: 'Database engine unavailable' });
      return;
    }

    logger.info(`[OpenBao API] Dynamic DB cred issued for role ${req.params.role} by ${req.user?.email || 'unknown'}`);
    res.json({ success: true, data: cred });
  } catch (error) { next(error); }
});

// ─── Leases ────────────────────────────────────────────────────────────

router.get('/leases', (_req: Request, res: Response) => {
  const leases = openBao.getActiveLeases();
  res.json({ success: true, data: { leases, count: leases.length } });
});

router.post('/leases/:leaseId/renew', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await openBao.renewLease(req.params.leaseId!);
    res.json({ success, data: { leaseId: req.params.leaseId, renewed: success } });
  } catch (error) { next(error); }
});

router.post('/leases/:leaseId/revoke', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await openBao.revokeLease(req.params.leaseId!);
    res.json({ success, data: { leaseId: req.params.leaseId, revoked: success } });
  } catch (error) { next(error); }
});

// ─── Policies ──────────────────────────────────────────────────────────

router.get('/policies', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const policies = await openBao.listPolicies();
    res.json({ success: true, data: { policies } });
  } catch (error) { next(error); }
});

router.get('/policies/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const policy = await openBao.getPolicy(req.params.name!);
    if (!policy) {
      res.status(404).json({ success: false, error: 'Policy not found' });
      return;
    }
    res.json({ success: true, data: policy });
  } catch (error) { next(error); }
});

router.put('/policies/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rules } = req.body;
    if (!rules) {
      res.status(400).json({ success: false, error: 'rules (HCL string) is required' });
      return;
    }

    const success = await openBao.putPolicy(req.params.name!, rules);
    logger.info(`[OpenBao API] Policy '${req.params.name}' updated by ${req.user?.email || 'unknown'}`);
    res.json({ success, data: { name: req.params.name, updated: success } });
  } catch (error) { next(error); }
});

router.delete('/policies/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await openBao.deletePolicy(req.params.name!);
    res.json({ success, data: { name: req.params.name, deleted: success } });
  } catch (error) { next(error); }
});

export default router;
