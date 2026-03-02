// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Business metrics and KPI management
 */

/**
 * @swagger
 * /api/v1/metrics:
 *   get:
 *     summary: Get all metrics for organization
 *     description: Retrieves all business metrics and KPIs configured for the organization
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [financial, operational, customer, hr, compliance]
 *         description: Filter by metric category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [healthy, warning, critical]
 *         description: Filter by health status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of metrics to return
 *     responses:
 *       200:
 *         description: List of metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Metric'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/v1/metrics/{id}:
 *   get:
 *     summary: Get metric by ID
 *     description: Retrieves a specific metric with its current value and history
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Metric ID
 *     responses:
 *       200:
 *         description: Metric details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/v1/metrics/{id}/history:
 *   get:
 *     summary: Get metric history
 *     description: Retrieves historical values for a metric over time
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Metric ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for history range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for history range
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [hourly, daily, weekly, monthly]
 *           default: daily
 *         description: Time granularity for aggregation
 *     responses:
 *       200:
 *         description: Metric history data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       value:
 *                         type: number
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/v1/metrics:
 *   post:
 *     summary: Create a new metric
 *     description: Creates a new metric definition for tracking
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Metric display name
 *               code:
 *                 type: string
 *                 description: Unique metric code
 *               description:
 *                 type: string
 *                 description: Metric description
 *               category:
 *                 type: string
 *                 enum: [financial, operational, customer, hr, compliance]
 *               type:
 *                 type: string
 *                 enum: [currency, percentage, count, ratio, score]
 *               thresholds:
 *                 type: object
 *                 properties:
 *                   warning:
 *                     type: number
 *                   critical:
 *                     type: number
 *                   target:
 *                     type: number
 *     responses:
 *       201:
 *         description: Metric created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/v1/metrics/{id}:
 *   put:
 *     summary: Update a metric
 *     description: Updates an existing metric definition
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               thresholds:
 *                 type: object
 *     responses:
 *       200:
 *         description: Metric updated
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/v1/metrics/{id}/record:
 *   post:
 *     summary: Record a metric value
 *     description: Records a new value for a metric
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Value recorded
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/v1/metrics/dashboard:
 *   get:
 *     summary: Get metrics dashboard
 *     description: Retrieves a summary dashboard of all key metrics
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
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
 *                     totalMetrics:
 *                       type: integer
 *                     healthyCount:
 *                       type: integer
 *                     warningCount:
 *                       type: integer
 *                     criticalCount:
 *                       type: integer
 *                     byCategory:
 *                       type: object
 *                     topMetrics:
 *                       type: array
 */
