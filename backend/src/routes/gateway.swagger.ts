/**
 * API Routes — Gateway Swagger
 *
 * Express route handler defining REST endpoints.
 * @module routes/gateway.swagger
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * @swagger
 * tags:
 *   - name: Gateway
 *     description: CendiaGateway — AI governance proxy, PII detection, shadow AI monitoring
 *
 * /gateway/test-pii:
 *   post:
 *     summary: Test PII detection
 *     description: Scan text for personally identifiable information using regex + heuristic NER
 *     tags: [Gateway]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to scan for PII
 *                 example: "Contact John Smith at john@example.com or 555-123-4567"
 *     responses:
 *       200:
 *         description: PII scan results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     hasPII:
 *                       type: boolean
 *                       description: Whether PII was detected
 *                     findings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: email
 *                           value:
 *                             type: string
 *                             example: john@example.com
 *                           confidence:
 *                             type: number
 *                             example: 0.99
 *                           start:
 *                             type: integer
 *                           end:
 *                             type: integer
 *                     redacted:
 *                       type: string
 *                       description: Text with PII replaced by [REDACTED]
 *
 * /gateway/stats:
 *   get:
 *     summary: Gateway statistics
 *     description: Get usage statistics for the AI governance proxy
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: Gateway stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRequests:
 *                       type: integer
 *                     piiDetections:
 *                       type: integer
 *                     blockedRequests:
 *                       type: integer
 *
 * /gateway/interactions:
 *   get:
 *     summary: List AI interactions
 *     description: Get logged AI interactions passing through the gateway
 *     tags: [Gateway]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of interactions
 *
 * /gateway/policies:
 *   get:
 *     summary: List governance policies
 *     description: Get active AI governance policies
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: List of policies
 */

export {};
