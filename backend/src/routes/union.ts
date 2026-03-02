// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA UNIONÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ - API ROUTES
// Employee Rights & Advocacy Module endpoints
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import ollama from '../services/ollama.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router: Router = express.Router();

// =============================================================================
// TYPES
// =============================================================================

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  level: string;
  startDate: Date;
  status: 'active' | 'on_leave' | 'probation' | 'notice_period' | 'terminated';
  salary: number;
  avgHoursPerWeek: number;
  overtimeHoursThisMonth: number;
  ptoDaysRemaining: number;
  ptoUsedThisYear: number;
  burnoutScore: number;
  burnoutLevel: 'healthy' | 'caution' | 'warning' | 'critical' | 'emergency';
  burnoutFactors: any[];
  rightsViolations: any[];
  pendingRequests: any[];
}

interface NegotiationBrief {
  id: string;
  generatedAt: Date;
  marketSalaryRange: { min: number; median: number; max: number };
  marketPosition: 'below' | 'at' | 'above';
  marketPercentile: number;
  askRange: { minimum: number; target: number; stretch: number };
  leveragePoints: { point: string; strength: string }[];
  talkingPoints: string[];
  objectionHandlers: { objection: string; response: string }[];
}

// In-memory store; production upgrade: use PostgreSQL
const employees: Map<string, Employee> = new Map();

// =============================================================================
// BURNOUT CALCULATION
// =============================================================================

function calculateBurnout(emp: Partial<Employee>): { score: number; level: string; factors: any[] } {
  const factors: any[] = [];
  let score = 0;

  // Workload factor
  const workloadScore = Math.min(100, ((emp.avgHoursPerWeek || 40) - 40) * 5 + (emp.overtimeHoursThisMonth || 0) * 2);
  if (workloadScore > 20) {
    factors.push({
      id: `factor-workload-${Date.now()}`,
      category: 'workload',
      name: 'Excessive Work Hours',
      score: workloadScore,
      weight: 0.25,
    });
    score += workloadScore * 0.25;
  }

  // PTO factor
  const ptoScore = emp.ptoUsedThisYear !== undefined && emp.ptoDaysRemaining !== undefined
    ? Math.max(0, 100 - (emp.ptoUsedThisYear / (emp.ptoUsedThisYear + emp.ptoDaysRemaining + 1)) * 100)
    : 50;
  if (ptoScore > 60) {
    factors.push({
      id: `factor-pto-${Date.now()}`,
      category: 'work_life',
      name: 'Low PTO Utilization',
      score: ptoScore,
      weight: 0.15,
    });
    score += ptoScore * 0.15;
  }

  score = Math.min(100, Math.round(score));
  
  let level: string;
  if (score >= 80) level = 'emergency';
  else if (score >= 65) level = 'critical';
  else if (score >= 50) level = 'warning';
  else if (score >= 30) level = 'caution';
  else level = 'healthy';

  return { score, level, factors };
}

// =============================================================================
// ROUTES
// =============================================================================

// Get workforce metrics
router.get('/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const allEmployees = Array.from(employees.values());
    
    const burnoutDistribution = { healthy: 0, caution: 0, warning: 0, critical: 0, emergency: 0 };
    allEmployees.forEach(e => {
      burnoutDistribution[e.burnoutLevel as keyof typeof burnoutDistribution]++;
    });

    const metrics = {
      totalEmployees: allEmployees.length,
      avgBurnoutScore: allEmployees.length > 0 
        ? Math.round(allEmployees.reduce((sum, e) => sum + e.burnoutScore, 0) / allEmployees.length) 
        : 0,
      burnoutDistribution,
      atRiskCount: allEmployees.filter(e => ['warning', 'critical', 'emergency'].includes(e.burnoutLevel)).length,
      openViolations: allEmployees.reduce((sum, e) => sum + e.rightsViolations.filter(v => v.status !== 'resolved').length, 0),
      pendingRequests: allEmployees.reduce((sum, e) => sum + e.pendingRequests.filter(r => !['approved', 'denied'].includes(r.status)).length, 0),
    };

    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get workforce metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Get all employees
router.get('/employees', authenticate, async (_req: Request, res: Response) => {
  try {
    const allEmployees = Array.from(employees.values())
      .sort((a, b) => b.burnoutScore - a.burnoutScore);
    res.json({ employees: allEmployees });
  } catch (error) {
    logger.error('Failed to get employees:', error);
    res.status(500).json({ error: 'Failed to get employees' });
  }
});

// Get at-risk employees
router.get('/employees/at-risk', authenticate, async (_req: Request, res: Response) => {
  try {
    const atRisk = Array.from(employees.values())
      .filter(e => ['warning', 'critical', 'emergency'].includes(e.burnoutLevel))
      .sort((a, b) => b.burnoutScore - a.burnoutScore);
    res.json({ employees: atRisk });
  } catch (error) {
    logger.error('Failed to get at-risk employees:', error);
    res.status(500).json({ error: 'Failed to get at-risk employees' });
  }
});

// Add employee
router.post('/employees', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, email, department, role, level, startDate, salary, avgHoursPerWeek, ptoDaysRemaining } = req.body;

    if (!name || !email || !department || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = `emp-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    const burnout = calculateBurnout({ avgHoursPerWeek, ptoDaysRemaining, ptoUsedThisYear: 0 });

    const employee: Employee = {
      id,
      name,
      email,
      department,
      role,
      level: level || 'Individual Contributor',
      startDate: new Date(startDate || Date.now()),
      status: 'active',
      salary: salary || 0,
      avgHoursPerWeek: avgHoursPerWeek || 40,
      overtimeHoursThisMonth: 0,
      ptoDaysRemaining: ptoDaysRemaining || 20,
      ptoUsedThisYear: 0,
      burnoutScore: burnout.score,
      burnoutLevel: burnout.level as Employee['burnoutLevel'],
      burnoutFactors: burnout.factors,
      rightsViolations: [],
      pendingRequests: [],
    };

    employees.set(id, employee);
    logger.info(`Employee added: ${id} - ${name}`);
    res.status(201).json({ employee });
  } catch (error) {
    logger.error('Failed to add employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Get single employee
router.get('/employees/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const employee = employees.get(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ employee });
  } catch (error) {
    logger.error('Failed to get employee:', error);
    res.status(500).json({ error: 'Failed to get employee' });
  }
});

// Analyze burnout
router.post('/employees/:id/analyze-burnout', authenticate, async (req: Request, res: Response) => {
  try {
    const employee = employees.get(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const burnout = calculateBurnout(employee);
    employee.burnoutScore = burnout.score;
    employee.burnoutLevel = burnout.level as Employee['burnoutLevel'];
    employee.burnoutFactors = burnout.factors;

    let recommendations: string[] = burnout.factors.flatMap((f: any) => [
      `Address ${f.name}`,
      'Consider workload redistribution',
    ]);

    // Try AI recommendations
    const ollamaAvailable = await ollama.isAvailable();
    if (ollamaAvailable) {
      try {
        const prompt = `As an employee wellness AI, provide 3 specific recommendations for an employee with:
- Burnout score: ${burnout.score}/100
- Level: ${burnout.level}
- Factors: ${burnout.factors.map((f: any) => f.name).join(', ')}

Respond with JSON: { "recommendations": ["rec1", "rec2", "rec3"] }`;

        const response = await ollama.generate(prompt, { model: 'llama3.2:latest' });
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          recommendations = parsed.recommendations || recommendations;
        }
      } catch (error) {
        logger.error('AI burnout analysis failed:', error);
      }
    }

    res.json({ 
      burnout: { ...burnout, recommendations },
      employee 
    });
  } catch (error) {
    logger.error('Failed to analyze burnout:', error);
    res.status(500).json({ error: 'Failed to analyze burnout' });
  }
});

// Report rights violation
router.post('/employees/:id/violations', authenticate, async (req: Request, res: Response) => {
  try {
    const { type, severity, description } = req.body;
    const employee = employees.get(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const violation = {
      id: `violation-${Date.now()}`,
      type,
      severity,
      description,
      occurredAt: new Date(),
      reportedAt: new Date(),
      status: 'reported',
    };

    employee.rightsViolations.push(violation);
    logger.info(`Violation reported for ${employee.id}: ${type}`);
    res.status(201).json({ violation });
  } catch (error) {
    logger.error('Failed to report violation:', error);
    res.status(500).json({ error: 'Failed to report violation' });
  }
});

// Create request (raise, promotion, etc.)
router.post('/employees/:id/requests', authenticate, async (req: Request, res: Response) => {
  try {
    const { type, title, description, priority } = req.body;
    const employee = employees.get(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const request = {
      id: `request-${Date.now()}`,
      type,
      title,
      description,
      submittedAt: new Date(),
      status: 'draft',
      priority: priority || 'medium',
      aiPrepared: false,
    };

    employee.pendingRequests.push(request);
    res.status(201).json({ request });
  } catch (error) {
    logger.error('Failed to create request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Prepare negotiation brief
router.post('/employees/:id/requests/:requestId/prepare', authenticate, async (req: Request, res: Response) => {
  try {
    const employee = employees.get(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const request = employee.pendingRequests.find(r => r.id === req.params.requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Calculate market data
    const marketRange = {
      min: Math.round(employee.salary * 0.85),
      median: Math.round(employee.salary * 1.05),
      max: Math.round(employee.salary * 1.25),
    };

    const marketPosition: 'below' | 'at' | 'above' = 
      employee.salary < marketRange.min ? 'below' :
      employee.salary > marketRange.max ? 'above' : 'at';

    const brief: NegotiationBrief = {
      id: `brief-${Date.now()}`,
      generatedAt: new Date(),
      marketSalaryRange: marketRange,
      marketPosition,
      marketPercentile: Math.round(((employee.salary - marketRange.min) / (marketRange.max - marketRange.min)) * 100),
      askRange: {
        minimum: Math.round(employee.salary * 1.05),
        target: Math.round(employee.salary * 1.12),
        stretch: Math.round(employee.salary * 1.18),
      },
      leveragePoints: [
        { point: 'Tenure and institutional knowledge', strength: 'moderate' },
        { point: 'Proven track record', strength: 'strong' },
      ],
      talkingPoints: [
        'I have consistently delivered high-quality work',
        'My contributions have directly impacted team success',
        'Market research shows my compensation is competitive but could be stronger',
      ],
      objectionHandlers: [
        { objection: 'Budget is tight', response: 'Could we discuss a phased approach?' },
        { objection: 'Need more time', response: 'What timeline would work, and can we document this?' },
      ],
    };

    // Enhance with AI if available
    const ollamaAvailable = await ollama.isAvailable();
    if (ollamaAvailable) {
      try {
        const prompt = `As a negotiation coach, enhance this raise brief with 2 more talking points for:
- Role: ${employee.role}
- Tenure: ${Math.round((Date.now() - employee.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000))} years
- Current: $${employee.salary.toLocaleString()}
- Market position: ${marketPosition}

Respond with JSON: { "talkingPoints": ["point1", "point2"] }`;

        const response = await ollama.generate(prompt, { model: 'llama3.2:latest' });
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.talkingPoints) {
            brief.talkingPoints.push(...parsed.talkingPoints);
          }
        }
      } catch (error) {
        logger.error('AI brief enhancement failed:', error);
      }
    }

    request.negotiationBrief = brief;
    request.aiPrepared = true;

    logger.info(`Negotiation brief prepared for ${employee.id}`);
    res.json({ brief });
  } catch (error) {
    logger.error('Failed to prepare negotiation brief:', error);
    res.status(500).json({ error: 'Failed to prepare brief' });
  }
});

// Get insights
router.get('/insights', authenticate, async (_req: Request, res: Response) => {
  try {
    const allEmployees = Array.from(employees.values());
    const insights: any[] = [];

    // High burnout insight
    const criticalBurnout = allEmployees.filter(e => e.burnoutLevel === 'critical' || e.burnoutLevel === 'emergency');
    if (criticalBurnout.length > 0) {
      insights.push({
        id: `insight-burnout-${Date.now()}`,
        type: 'risk',
        severity: 'critical',
        title: `${criticalBurnout.length} employees at critical burnout levels`,
        description: 'Immediate intervention recommended',
        affectedEmployees: criticalBurnout.map(e => e.id),
        suggestedAction: 'Schedule wellness check-ins',
        detectedAt: new Date(),
      });
    }

    // Open violations insight
    const openViolations = allEmployees.flatMap(e => e.rightsViolations.filter(v => v.status !== 'resolved'));
    if (openViolations.length > 0) {
      insights.push({
        id: `insight-violations-${Date.now()}`,
        type: 'violation',
        severity: 'warning',
        title: `${openViolations.length} unresolved rights violations`,
        description: 'Review and address reported violations',
        suggestedAction: 'Escalate to HR leadership',
        detectedAt: new Date(),
      });
    }

    res.json({ insights });
  } catch (error) {
    logger.error('Failed to get insights:', error);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

export default router;
