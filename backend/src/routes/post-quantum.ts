/**
 * API Routes — Post Quantum
 *
 * Express route handler defining REST endpoints.
 * @module routes/post-quantum
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaPostQuantumKMS™ API Routes
 * 
 * Post-Quantum Cryptographic Signatures
 */

import { Router, Request, Response } from 'express';
import { postQuantumKMSService, PQAlgorithm } from '../services/security/PostQuantumKMSService.js';

const router = Router();

/**
 * GET /api/v1/post-quantum/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaPostQuantumKMS',
    status: 'healthy',
    quantumResistant: true,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/post-quantum/algorithms
 */
router.get('/algorithms', (_req: Request, res: Response) => {
  try {
    const algorithms = postQuantumKMSService.getSupportedAlgorithms();
    res.json({ success: true, data: algorithms });
  } catch (error) {
    console.error('Error getting algorithms:', error);
    res.status(500).json({ success: false, error: 'Failed to get algorithms' });
  }
});

/**
 * GET /api/v1/post-quantum/recommend/:useCase
 */
router.get('/recommend/:useCase', (req: Request, res: Response): void => {
  try {
    const useCase = req.params['useCase'] as 'general' | 'high-security' | 'compact' | 'hybrid';
    const recommendation = postQuantumKMSService.getRecommendation(useCase);
    res.json({ success: true, data: { useCase, recommendation } });
  } catch (error) {
    console.error('Error getting recommendation:', error);
    res.status(500).json({ success: false, error: 'Failed to get recommendation' });
  }
});

/**
 * POST /api/v1/post-quantum/keys
 */
router.post('/keys', async (req: Request, res: Response): Promise<void> => {
  try {
    const { algorithm, strength, expiresInDays } = req.body;

    const keyPair = await postQuantumKMSService.generateKeyPair({
      algorithm: algorithm as PQAlgorithm,
      strength,
      expiresInDays,
    });

    // Return without private key
    const { privateKey, ...metadata } = keyPair;
    res.status(201).json({ success: true, data: metadata });
  } catch (error) {
    console.error('Error generating key pair:', error);
    res.status(500).json({ success: false, error: 'Failed to generate key pair' });
  }
});

/**
 * GET /api/v1/post-quantum/keys
 */
router.get('/keys', (_req: Request, res: Response) => {
  try {
    const keys = postQuantumKMSService.listKeys();
    res.json({ success: true, data: keys });
  } catch (error) {
    console.error('Error listing keys:', error);
    res.status(500).json({ success: false, error: 'Failed to list keys' });
  }
});

/**
 * GET /api/v1/post-quantum/keys/:id
 */
router.get('/keys/:id', (req: Request, res: Response): void => {
  try {
    const metadata = postQuantumKMSService.getKeyMetadata(req.params['id']!);
    if (!metadata) {
      res.status(404).json({ success: false, error: 'Key not found' });
      return;
    }
    res.json({ success: true, data: metadata });
  } catch (error) {
    console.error('Error getting key:', error);
    res.status(500).json({ success: false, error: 'Failed to get key' });
  }
});

/**
 * POST /api/v1/post-quantum/keys/:id/rotate
 */
router.post('/keys/:id/rotate', async (req: Request, res: Response): Promise<void> => {
  try {
    const newKey = await postQuantumKMSService.rotateKey(req.params['id']!);
    const { privateKey, ...metadata } = newKey;
    res.json({ success: true, data: metadata, message: 'Key rotated successfully' });
  } catch (error) {
    console.error('Error rotating key:', error);
    res.status(500).json({ success: false, error: 'Failed to rotate key' });
  }
});

/**
 * DELETE /api/v1/post-quantum/keys/:id
 */
router.delete('/keys/:id', (req: Request, res: Response): void => {
  try {
    const deleted = postQuantumKMSService.deleteKey(req.params['id']!);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Key not found' });
      return;
    }
    res.json({ success: true, message: 'Key deleted' });
  } catch (error) {
    console.error('Error deleting key:', error);
    res.status(500).json({ success: false, error: 'Failed to delete key' });
  }
});

/**
 * POST /api/v1/post-quantum/sign
 */
router.post('/sign', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, keyId } = req.body;

    if (!data) {
      res.status(400).json({ success: false, error: 'data is required' });
      return;
    }

    const signature = await postQuantumKMSService.sign(data, keyId);
    res.json({ success: true, data: signature });
  } catch (error) {
    console.error('Error signing:', error);
    res.status(500).json({ success: false, error: 'Failed to sign data' });
  }
});

/**
 * POST /api/v1/post-quantum/verify
 */
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, signature } = req.body;

    if (!data || !signature) {
      res.status(400).json({ success: false, error: 'data and signature are required' });
      return;
    }

    const result = await postQuantumKMSService.verify(data, signature);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error verifying:', error);
    res.status(500).json({ success: false, error: 'Failed to verify signature' });
  }
});

export default router;
