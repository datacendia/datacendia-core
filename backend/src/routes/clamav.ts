// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CLAMAV API ROUTES — Malware Scanning for DataDiode
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { clamAVIntegration } from '../services/sovereign/ClamAVIntegration.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// Health (no auth)
router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'healthy', service: 'clamav', timestamp: new Date().toISOString() } });
});

router.get('/status', async (_req: Request, res: Response) => {
  const stats = clamAVIntegration.getStats();
  res.json({ success: true, data: stats });
});

router.use(devAuth);

// =============================================================================
// SCANNING
// =============================================================================

router.post('/scan', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided. Use multipart/form-data with field name "file".' });
    }
    const result = await clamAVIntegration.scan(req.file.buffer, req.file.originalname);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/scan/buffer', async (req: Request, res: Response) => {
  try {
    const { data, filename } = req.body;
    if (!data || !filename) {
      return res.status(400).json({ success: false, error: 'Missing "data" (base64) and "filename" fields' });
    }
    const buffer = Buffer.from(data, 'base64');
    const result = await clamAVIntegration.scan(buffer, filename);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// =============================================================================
// DAEMON MANAGEMENT
// =============================================================================

router.post('/ping', async (_req: Request, res: Response) => {
  try {
    const available = await clamAVIntegration.ping();
    res.json({ success: true, data: { available, engine: available ? 'ClamAV' : 'Heuristic' } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
