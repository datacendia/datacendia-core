// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// HSM API ROUTES — Hardware Security Module (PKCS#11 + Software Fallback)
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { hsmAdapter } from '../services/security/HSMAdapter.js';

const router = Router();

// Health (no auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'hsm', timestamp: new Date().toISOString() } });
});

router.get('/status', (_req: Request, res: Response) => {
  res.json({ success: true, data: hsmAdapter.getStatus() });
});

router.use(devAuth);

// =============================================================================
// INITIALIZATION
// =============================================================================

router.post('/initialize', async (_req: Request, res: Response) => {
  try {
    const result = await hsmAdapter.initialize();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// =============================================================================
// KEY MANAGEMENT
// =============================================================================

router.post('/keys', async (req: Request, res: Response) => {
  try {
    const { algorithm, label, extractable } = req.body;
    if (!algorithm || !label) {
      return res.status(400).json({ success: false, error: 'Missing "algorithm" and "label"' });
    }
    const key = await hsmAdapter.generateKey({ algorithm, label, extractable });
    // Strip software key material from response for security
    const { _softwareKey, ...safeKey } = key;
    res.json({ success: true, data: safeKey });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.get('/keys', (_req: Request, res: Response) => {
  const keys = hsmAdapter.listKeys().map(({ _softwareKey, ...k }) => k);
  res.json({ success: true, data: keys });
});

router.get('/keys/:keyId', (req: Request, res: Response) => {
  const key = hsmAdapter.getKey(req.params.keyId);
  if (!key) return res.status(404).json({ success: false, error: 'Key not found' });
  const { _softwareKey, ...safeKey } = key;
  res.json({ success: true, data: safeKey });
});

// =============================================================================
// CRYPTOGRAPHIC OPERATIONS
// =============================================================================

router.post('/sign', async (req: Request, res: Response) => {
  try {
    const { keyId, data } = req.body;
    if (!keyId || !data) {
      return res.status(400).json({ success: false, error: 'Missing "keyId" and "data" (base64)' });
    }
    const buffer = Buffer.from(data, 'base64');
    const result = await hsmAdapter.sign(keyId, buffer);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { keyId, data, signature } = req.body;
    if (!keyId || !data || !signature) {
      return res.status(400).json({ success: false, error: 'Missing "keyId", "data" (base64), and "signature" (base64)' });
    }
    const buffer = Buffer.from(data, 'base64');
    const valid = await hsmAdapter.verify(keyId, buffer, signature);
    res.json({ success: true, data: { valid } });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.post('/wrap', async (req: Request, res: Response) => {
  try {
    const { keyToWrapId, wrappingKeyId } = req.body;
    if (!keyToWrapId || !wrappingKeyId) {
      return res.status(400).json({ success: false, error: 'Missing "keyToWrapId" and "wrappingKeyId"' });
    }
    const result = await hsmAdapter.wrapKey(keyToWrapId, wrappingKeyId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

router.post('/random', async (req: Request, res: Response) => {
  try {
    const length = req.body.length || 32;
    const result = await hsmAdapter.generateRandom(length);
    res.json({ success: true, data: { data: result.data.toString('base64'), source: result.source, entropyBits: result.entropyBits } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
