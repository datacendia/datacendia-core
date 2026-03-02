// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// HR INTEGRATION API ROUTES
// Endpoints for Workday, BambooHR, and other HRIS connections
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import hrIntegrationService, { HRProvider, HRCredentials } from '../services/HRIntegrationService.js';

const router: Router = express.Router();

// =============================================================================
// CONNECTION MANAGEMENT
// =============================================================================

// Get all connection statuses
router.get('/connections', authenticate, async (_req: Request, res: Response) => {
  try {
    const statuses = hrIntegrationService.getAllConnectionStatuses();
    res.json({ connections: statuses });
  } catch (error) {
    logger.error('Failed to get HR connections:', error);
    res.status(500).json({ error: 'Failed to get connections' });
  }
});

// Get single connection status
router.get('/connections/:provider', authenticate, async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider as HRProvider;
    const status = hrIntegrationService.getConnectionStatus(provider);
    res.json({ connection: status });
  } catch (error) {
    logger.error('Failed to get HR connection status:', error);
    res.status(500).json({ error: 'Failed to get connection status' });
  }
});

// Connect to provider
router.post('/connections/:provider/connect', authenticate, async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider as HRProvider;
    const { apiKey, clientId, clientSecret, subdomain, tenantId, refreshToken } = req.body;

    const credentials: HRCredentials = {
      provider,
      apiKey,
      clientId,
      clientSecret,
      subdomain,
      tenantId,
      refreshToken,
    };

    const status = await hrIntegrationService.connect(credentials);
    
    if (status.connected) {
      logger.info(`Connected to ${provider}`);
      res.json({ connection: status });
    } else {
      res.status(400).json({ error: status.error || 'Connection failed' });
    }
  } catch (error) {
    logger.error('Failed to connect to HR provider:', error);
    res.status(500).json({ error: 'Failed to connect' });
  }
});

// Disconnect from provider
router.post('/connections/:provider/disconnect', authenticate, async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider as HRProvider;
    await hrIntegrationService.disconnect(provider);
    res.json({ success: true, message: `Disconnected from ${provider}` });
  } catch (error) {
    logger.error('Failed to disconnect from HR provider:', error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

// =============================================================================
// SYNC OPERATIONS
// =============================================================================

// Sync employees from provider
router.post('/sync/:provider', authenticate, async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider as HRProvider;
    const result = await hrIntegrationService.syncEmployees(provider);
    
    logger.info(`HR sync complete: ${result.employeesProcessed} employees from ${provider}`);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to sync HR data:', error);
    res.status(500).json({ error: 'Failed to sync' });
  }
});

// Sync all connected providers
router.post('/sync', authenticate, async (_req: Request, res: Response) => {
  try {
    const results = await hrIntegrationService.syncAll();
    res.json({ results });
  } catch (error) {
    logger.error('Failed to sync all HR providers:', error);
    res.status(500).json({ error: 'Failed to sync' });
  }
});

// =============================================================================
// EMPLOYEE DATA
// =============================================================================

// Get all employees
router.get('/employees', authenticate, async (req: Request, res: Response) => {
  try {
    const { provider } = req.query;
    const employees = hrIntegrationService.getAllEmployees(provider as HRProvider | undefined);
    res.json({ employees, count: employees.length });
  } catch (error) {
    logger.error('Failed to get employees:', error);
    res.status(500).json({ error: 'Failed to get employees' });
  }
});

// Get single employee
router.get('/employees/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const employee = hrIntegrationService.getEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ employee });
  } catch (error) {
    logger.error('Failed to get employee:', error);
    res.status(500).json({ error: 'Failed to get employee' });
  }
});

// Get employees by department
router.get('/departments/:department/employees', authenticate, async (req: Request, res: Response) => {
  try {
    const employees = hrIntegrationService.getEmployeesByDepartment(req.params.department);
    res.json({ employees, count: employees.length });
  } catch (error) {
    logger.error('Failed to get employees by department:', error);
    res.status(500).json({ error: 'Failed to get employees' });
  }
});

// Get employee time off
router.get('/employees/:id/time-off', authenticate, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const timeOff = await hrIntegrationService.getEmployeeTimeOff(req.params.id, start, end);
    res.json({ timeOff });
  } catch (error) {
    logger.error('Failed to get employee time off:', error);
    res.status(500).json({ error: 'Failed to get time off' });
  }
});

// Get employee PTO balance
router.get('/employees/:id/pto-balance', authenticate, async (req: Request, res: Response) => {
  try {
    const balance = await hrIntegrationService.getEmployeePTOBalance(req.params.id);
    res.json({ balance });
  } catch (error) {
    logger.error('Failed to get PTO balance:', error);
    res.status(500).json({ error: 'Failed to get PTO balance' });
  }
});

// =============================================================================
// ANALYTICS
// =============================================================================

// Get workforce metrics
router.get('/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = hrIntegrationService.getWorkforceMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get workforce metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

export default router;
