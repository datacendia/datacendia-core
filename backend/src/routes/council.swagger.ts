// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * @swagger
 * /council/agents:
 *   get:
 *     summary: List all AI agents
 *     description: Get all available AI agents in the council
 *     tags: [Council]
 *     responses:
 *       200:
 *         description: List of agents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Agent'
 *
 * /council/deliberations:
 *   get:
 *     summary: List deliberations
 *     description: Get all deliberations for the organization
 *     tags: [Council]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, FAILED, CANCELLED]
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
 *         description: List of deliberations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deliberations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Deliberation'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *   post:
 *     summary: Start new deliberation
 *     description: Create and start a new AI council deliberation
 *     tags: [Council]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question]
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question to deliberate
 *                 example: "Should we expand into the European market?"
 *               context:
 *                 type: object
 *                 description: Additional context for deliberation
 *               config:
 *                 type: object
 *                 properties:
 *                   mode:
 *                     type: string
 *                     enum: [consensus, debate, advisory, voting]
 *                   requiredAgents:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Deliberation started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deliberation:
 *                   $ref: '#/components/schemas/Deliberation'
 *
 * /council/deliberations/{id}:
 *   get:
 *     summary: Get deliberation details
 *     description: Get details of a specific deliberation
 *     tags: [Council]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deliberation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deliberation:
 *                   $ref: '#/components/schemas/Deliberation'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 * /council/deliberations/{id}/cancel:
 *   post:
 *     summary: Cancel deliberation
 *     description: Cancel an in-progress deliberation
 *     tags: [Council]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deliberation cancelled
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 * /council/query:
 *   post:
 *     summary: Quick query to council
 *     description: Ask a quick question without full deliberation
 *     tags: [Council]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [query]
 *             properties:
 *               query:
 *                 type: string
 *               agents:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Query response
 */

export {};
