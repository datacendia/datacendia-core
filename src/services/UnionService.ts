// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA UNION™ — EMPLOYEE RIGHTS & ADVOCACY MODULE
// First AI product marketed as union-grade protection
// Digital labor rights with audit trail, burnout scoring, and negotiation prep
// =============================================================================

import { ollamaService } from '../lib/ollama';
import { mean } from '../lib/algorithms/statistics';

// =============================================================================
// TYPES
// =============================================================================

export type EmployeeStatus = 'active' | 'on_leave' | 'probation' | 'notice_period' | 'terminated';
export type BurnoutLevel = 'healthy' | 'caution' | 'warning' | 'critical' | 'emergency';
export type RightType =
  | 'compensation'
  | 'time_off'
  | 'workload'
  | 'safety'
  | 'privacy'
  | 'dignity'
  | 'growth'
  | 'voice';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  level: string;
  startDate: Date;
  status: EmployeeStatus;
  managerId?: string;

  // Compensation
  salary: number;
  bonus?: number;
  equity?: number;
  lastRaiseDate?: Date;
  lastRaisePercent?: number;

  // Workload metrics
  avgHoursPerWeek: number;
  overtimeHoursThisMonth: number;
  ptoDaysRemaining: number;
  ptoUsedThisYear: number;

  // Burnout indicators
  burnoutScore: number; // 0-100
  burnoutLevel: BurnoutLevel;
  burnoutFactors: BurnoutFactor[];

  // Rights tracking
  rightsViolations: RightsViolation[];
  pendingRequests: EmployeeRequest[];
  advocacySessions: AdvocacySession[];
}

export interface BurnoutFactor {
  id: string;
  category:
    | 'workload'
    | 'work_life'
    | 'compensation'
    | 'recognition'
    | 'growth'
    | 'autonomy'
    | 'relationships'
    | 'values';
  name: string;
  score: number; // 0-100 (higher = worse)
  weight: number;
  indicators: string[];
  recommendations: string[];
  detectedAt: Date;
}

export interface RightsViolation {
  id: string;
  type: RightType;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  description: string;
  occurredAt: Date;
  reportedAt?: Date;
  status: 'detected' | 'reported' | 'investigating' | 'resolved' | 'escalated';
  resolution?: string;
  compensationOwed?: number;
  auditTrail: AuditEntry[];
}

export interface EmployeeRequest {
  id: string;
  type:
    | 'raise'
    | 'promotion'
    | 'time_off'
    | 'transfer'
    | 'accommodation'
    | 'grievance'
    | 'feedback';
  title: string;
  description: string;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'negotiating';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  aiPrepared: boolean;
  negotiationBrief?: NegotiationBrief;
  outcome?: string;
  resolvedAt?: Date;
}

export interface AdvocacySession {
  id: string;
  type: 'preparation' | 'coaching' | 'review' | 'debrief';
  topic: string;
  scheduledAt: Date;
  completedAt?: Date;
  summary?: string;
  recommendations: string[];
  confidential: boolean;
}

export interface NegotiationBrief {
  id: string;
  generatedAt: Date;
  context: string;

  // Market data
  marketSalaryRange: { min: number; median: number; max: number };
  marketPosition: 'below' | 'at' | 'above';
  marketPercentile: number;

  // Performance
  performanceRating: number;
  performanceHighlights: string[];
  impactMetrics: { metric: string; value: string; comparison: string }[];

  // Leverage points
  leveragePoints: { point: string; strength: 'weak' | 'moderate' | 'strong' }[];
  riskFactors: { factor: string; mitigation: string }[];

  // Strategy
  askRange: { minimum: number; target: number; stretch: number };
  talkingPoints: string[];
  objectionHandlers: { objection: string; response: string }[];
  walkawayConditions: string[];

  // Timing
  bestTimeToAsk: string;
  budgetCycleContext: string;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  details: Record<string, any>;
  hash: string;
}

export interface WorkforceMetrics {
  totalEmployees: number;
  avgBurnoutScore: number;
  burnoutDistribution: Record<BurnoutLevel, number>;
  avgTenure: number;
  turnoverRate: number;
  openViolations: number;
  pendingRequests: number;
  avgSalaryVsMarket: number;
  overtimeAverage: number;
  ptoUtilization: number;
  rightsByType: Record<RightType, { violations: number; resolved: number }>;
}

export interface EmployeeInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'violation' | 'milestone' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedEmployees: string[];
  suggestedAction: string;
  detectedAt: Date;
}

// =============================================================================
// STORAGE KEY
// =============================================================================

const STORAGE_KEY = 'datacendia_union_service';

// =============================================================================
// BURNOUT CALCULATION
// =============================================================================

function calculateBurnoutScore(employee: Partial<Employee>): {
  score: number;
  level: BurnoutLevel;
  factors: BurnoutFactor[];
} {
  const factors: BurnoutFactor[] = [];
  let totalScore = 0;
  let totalWeight = 0;

  // Workload factor
  const workloadScore = Math.min(
    100,
    ((employee.avgHoursPerWeek || 40) - 40) * 5 + (employee.overtimeHoursThisMonth || 0) * 2
  );
  if (workloadScore > 20) {
    factors.push({
      id: `factor-workload-${Date.now()}`,
      category: 'workload',
      name: 'Excessive Work Hours',
      score: workloadScore,
      weight: 0.25,
      indicators: [
        `${employee.avgHoursPerWeek || 40} hours/week average`,
        `${employee.overtimeHoursThisMonth || 0} overtime hours this month`,
      ],
      recommendations: [
        'Review workload distribution',
        'Consider delegation opportunities',
        'Evaluate project priorities',
      ],
      detectedAt: new Date(),
    });
    totalScore += workloadScore * 0.25;
    totalWeight += 0.25;
  }

  // Work-life balance (PTO usage)
  const ptoScore =
    employee.ptoUsedThisYear !== undefined && employee.ptoDaysRemaining !== undefined
      ? Math.max(
          0,
          100 -
            (employee.ptoUsedThisYear / (employee.ptoUsedThisYear + employee.ptoDaysRemaining)) *
              100
        )
      : 50;
  if (ptoScore > 60) {
    factors.push({
      id: `factor-pto-${Date.now()}`,
      category: 'work_life',
      name: 'Low PTO Utilization',
      score: ptoScore,
      weight: 0.15,
      indicators: [
        `${employee.ptoDaysRemaining || 0} PTO days remaining`,
        `${employee.ptoUsedThisYear || 0} days used this year`,
      ],
      recommendations: [
        'Encourage taking time off',
        'Schedule vacation proactively',
        'Review workload allowing breaks',
      ],
      detectedAt: new Date(),
    });
    totalScore += ptoScore * 0.15;
    totalWeight += 0.15;
  }

  // Compensation fairness: estimate market position from salary and tenure
  // Score 0-100 where higher = more underpaid (more burnout risk)
  // Uses salary vs estimated market midpoint (salary × 1.05) and tenure penalty
  const tenureYears = employee.startDate
    ? (Date.now() - employee.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000)
    : 1;
  const expectedGrowthRate = Math.min(tenureYears * 3, 25); // ~3% per year, max 25%
  const marketMid = (employee.salary || 70000) * 1.05;
  const salaryGap = Math.max(0, 1 - ((employee.salary || 70000) / marketMid));
  const compensationScore = Math.min(100, Math.round(salaryGap * 200 + expectedGrowthRate));
  if (compensationScore > 20) {
    factors.push({
      id: `factor-comp-${Date.now()}`,
      category: 'compensation',
      name: 'Below-Market Compensation',
      score: compensationScore,
      weight: 0.2,
      indicators: [
        `Salary vs market midpoint: ${(100 - salaryGap * 100).toFixed(0)}%`,
        `Tenure: ${tenureYears.toFixed(1)} years`,
      ],
      recommendations: [
        'Conduct market rate comparison',
        'Review compensation band placement',
        'Consider equity or bonus adjustment',
      ],
      detectedAt: new Date(),
    });
  }
  totalScore += compensationScore * 0.2;
  totalWeight += 0.2;

  // Growth opportunities
  const growthScore = employee.lastRaiseDate
    ? Math.min(
        100,
        ((Date.now() - employee.lastRaiseDate.getTime()) / (365 * 24 * 60 * 60 * 1000)) * 30
      )
    : 50;
  if (growthScore > 50) {
    factors.push({
      id: `factor-growth-${Date.now()}`,
      category: 'growth',
      name: 'Stagnant Career Progression',
      score: growthScore,
      weight: 0.2,
      indicators: [
        employee.lastRaiseDate
          ? `Last raise: ${employee.lastRaiseDate.toLocaleDateString()}`
          : 'No raise on record',
      ],
      recommendations: [
        'Schedule career development discussion',
        'Review promotion timeline',
        'Identify skill development opportunities',
      ],
      detectedAt: new Date(),
    });
    totalScore += growthScore * 0.2;
    totalWeight += 0.2;
  }

  // Normalize score
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

  // Determine level
  let level: BurnoutLevel;
  if (finalScore >= 80) {
    level = 'emergency';
  } else if (finalScore >= 65) {
    level = 'critical';
  } else if (finalScore >= 50) {
    level = 'warning';
  } else if (finalScore >= 30) {
    level = 'caution';
  } else {
    level = 'healthy';
  }

  return { score: finalScore, level, factors };
}

// =============================================================================
// UNION SERVICE
// =============================================================================

class UnionService {
  private employees: Map<string, Employee> = new Map();
  private insights: EmployeeInsight[] = [];
  private ollamaAvailable: boolean = false;

  constructor() {
    this.loadFromStorage();
    this.checkOllamaStatus();
  }

  private async checkOllamaStatus(): Promise<void> {
    try {
      this.ollamaAvailable = await ollamaService.checkAvailability();
    } catch {
      this.ollamaAvailable = false;
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        data.employees?.forEach((e: Employee) => {
          e.startDate = new Date(e.startDate);
          if (e.lastRaiseDate) {
            e.lastRaiseDate = new Date(e.lastRaiseDate);
          }
          e.burnoutFactors.forEach((f) => (f.detectedAt = new Date(f.detectedAt)));
          e.rightsViolations.forEach((v) => {
            v.occurredAt = new Date(v.occurredAt);
            if (v.reportedAt) {
              v.reportedAt = new Date(v.reportedAt);
            }
            v.auditTrail.forEach((a) => (a.timestamp = new Date(a.timestamp)));
          });
          e.pendingRequests.forEach((r) => {
            r.submittedAt = new Date(r.submittedAt);
            if (r.resolvedAt) {
              r.resolvedAt = new Date(r.resolvedAt);
            }
          });
          e.advocacySessions.forEach((s) => {
            s.scheduledAt = new Date(s.scheduledAt);
            if (s.completedAt) {
              s.completedAt = new Date(s.completedAt);
            }
          });
          this.employees.set(e.id, e);
        });
        this.insights = data.insights || [];
      }
    } catch (error) {
      console.error('Failed to load union data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        employees: Array.from(this.employees.values()),
        insights: this.insights,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save union data:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // EMPLOYEE MANAGEMENT
  // ---------------------------------------------------------------------------

  addEmployee(
    employeeData: Omit<
      Employee,
      | 'id'
      | 'burnoutScore'
      | 'burnoutLevel'
      | 'burnoutFactors'
      | 'rightsViolations'
      | 'pendingRequests'
      | 'advocacySessions'
    >
  ): Employee {
    const id = `emp-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    const burnout = calculateBurnoutScore(employeeData);

    const employee: Employee = {
      ...employeeData,
      id,
      burnoutScore: burnout.score,
      burnoutLevel: burnout.level,
      burnoutFactors: burnout.factors,
      rightsViolations: [],
      pendingRequests: [],
      advocacySessions: [],
    };

    this.employees.set(id, employee);
    this.saveToStorage();
    return employee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const employee = this.employees.get(id);
    if (!employee) {
      return null;
    }

    Object.assign(employee, updates);

    // Recalculate burnout
    const burnout = calculateBurnoutScore(employee);
    employee.burnoutScore = burnout.score;
    employee.burnoutLevel = burnout.level;
    employee.burnoutFactors = burnout.factors;

    this.saveToStorage();
    return employee;
  }

  getEmployee(id: string): Employee | undefined {
    return this.employees.get(id);
  }

  getAllEmployees(): Employee[] {
    return Array.from(this.employees.values());
  }

  getEmployeesByBurnoutLevel(level: BurnoutLevel): Employee[] {
    return this.getAllEmployees().filter((e) => e.burnoutLevel === level);
  }

  getAtRiskEmployees(): Employee[] {
    return this.getAllEmployees().filter(
      (e) =>
        e.burnoutLevel === 'warning' ||
        e.burnoutLevel === 'critical' ||
        e.burnoutLevel === 'emergency'
    );
  }

  // ---------------------------------------------------------------------------
  // BURNOUT ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeBurnout(
    employeeId: string
  ): Promise<{
    score: number;
    level: BurnoutLevel;
    factors: BurnoutFactor[];
    recommendations: string[];
  }> {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const burnout = calculateBurnoutScore(employee);

    let recommendations: string[] = burnout.factors.flatMap((f) => f.recommendations);

    if (this.ollamaAvailable) {
      try {
        const prompt = `As an employee wellness AI, analyze this burnout assessment and provide 3-5 specific, actionable recommendations:

Employee: ${employee.name}
Role: ${employee.role}
Burnout Score: ${burnout.score}/100 (${burnout.level})

Factors:
${burnout.factors.map((f) => `- ${f.name}: ${f.score}/100 - ${f.indicators.join(', ')}`).join('\n')}

Provide recommendations in JSON format:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

        const response = await ollamaService.generate({ prompt, model: 'llama3.2:latest' });
        const jsonMatch = (response.response || '').match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          recommendations = parsed.recommendations || recommendations;
        }
      } catch (error) {
        console.error('Ollama burnout analysis failed:', error);
      }
    }

    // Update employee
    employee.burnoutScore = burnout.score;
    employee.burnoutLevel = burnout.level;
    employee.burnoutFactors = burnout.factors;
    this.saveToStorage();

    return { ...burnout, recommendations };
  }

  // ---------------------------------------------------------------------------
  // RIGHTS VIOLATIONS
  // ---------------------------------------------------------------------------

  reportViolation(
    employeeId: string,
    type: RightType,
    severity: RightsViolation['severity'],
    description: string
  ): RightsViolation {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const violation: RightsViolation = {
      id: `violation-${Date.now()}`,
      type,
      severity,
      description,
      occurredAt: new Date(),
      reportedAt: new Date(),
      status: 'reported',
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date(),
          action: 'Violation reported',
          actor: 'system',
          details: { type, severity, description },
          hash: this.generateHash({ type, severity, description, timestamp: Date.now() }),
        },
      ],
    };

    employee.rightsViolations.push(violation);
    this.saveToStorage();

    // Generate insight
    this.addInsight({
      type: 'violation',
      severity: severity === 'critical' ? 'critical' : severity === 'severe' ? 'warning' : 'info',
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Rights Violation Reported`,
      description,
      affectedEmployees: [employeeId],
      suggestedAction: 'Review and investigate the reported violation',
    });

    return violation;
  }

  updateViolationStatus(
    employeeId: string,
    violationId: string,
    status: RightsViolation['status'],
    resolution?: string
  ): RightsViolation | null {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      return null;
    }

    const violation = employee.rightsViolations.find((v) => v.id === violationId);
    if (!violation) {
      return null;
    }

    violation.status = status;
    if (resolution) {
      violation.resolution = resolution;
    }

    violation.auditTrail.push({
      id: `audit-${Date.now()}`,
      timestamp: new Date(),
      action: `Status updated to ${status}`,
      actor: 'system',
      details: { status, resolution },
      hash: this.generateHash({ status, resolution, timestamp: Date.now() }),
    });

    this.saveToStorage();
    return violation;
  }

  private generateHash(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  // ---------------------------------------------------------------------------
  // EMPLOYEE REQUESTS
  // ---------------------------------------------------------------------------

  createRequest(
    employeeId: string,
    type: EmployeeRequest['type'],
    title: string,
    description: string,
    priority: EmployeeRequest['priority'] = 'medium'
  ): EmployeeRequest {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const request: EmployeeRequest = {
      id: `request-${Date.now()}`,
      type,
      title,
      description,
      submittedAt: new Date(),
      status: 'draft',
      priority,
      aiPrepared: false,
    };

    employee.pendingRequests.push(request);
    this.saveToStorage();
    return request;
  }

  async prepareNegotiation(employeeId: string, requestId: string): Promise<NegotiationBrief> {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const request = employee.pendingRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Calculate market data (simplified - would normally use external APIs)
    const marketRange = {
      min: Math.round(employee.salary * 0.85),
      median: Math.round(employee.salary * 1.05),
      max: Math.round(employee.salary * 1.25),
    };

    const marketPosition: 'below' | 'at' | 'above' =
      employee.salary < marketRange.min
        ? 'below'
        : employee.salary > marketRange.max
          ? 'above'
          : 'at';

    const marketPercentile = Math.round(
      ((employee.salary - marketRange.min) / (marketRange.max - marketRange.min)) * 100
    );

    const brief: NegotiationBrief = {
      id: `brief-${Date.now()}`,
      generatedAt: new Date(),
      context: `Negotiation preparation for ${request.type} request`,
      marketSalaryRange: marketRange,
      marketPosition,
      marketPercentile,
      performanceRating: 4.2, // Would come from performance system
      performanceHighlights: [
        'Consistently meets deadlines',
        'Strong team collaboration',
        'Key contributor to recent project',
      ],
      impactMetrics: [
        {
          metric: 'Tenure',
          value: `${Math.round((Date.now() - employee.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000))} years`,
          comparison: 'above average',
        },
        {
          metric: 'Overtime',
          value: `${employee.overtimeHoursThisMonth} hrs/month`,
          comparison: 'shows dedication',
        },
      ],
      leveragePoints: [
        {
          point: 'Market rate is higher than current compensation',
          strength: marketPosition === 'below' ? 'strong' : 'moderate',
        },
        { point: 'Institutional knowledge and relationships', strength: 'moderate' },
        { point: 'Proven track record', strength: 'strong' },
      ],
      riskFactors: [
        {
          factor: 'Budget constraints may limit approval',
          mitigation: 'Propose phased increase or alternative compensation',
        },
        {
          factor: 'Timing may not align with review cycle',
          mitigation: 'Document for next cycle with interim benefits',
        },
      ],
      askRange: {
        minimum: Math.round(employee.salary * 1.05),
        target: Math.round(employee.salary * 1.12),
        stretch: Math.round(employee.salary * 1.18),
      },
      talkingPoints: [
        'I have consistently delivered high-quality work over the past year',
        'My contributions have directly impacted team success',
        'Market research shows my current compensation is below industry standards',
      ],
      objectionHandlers: [
        {
          objection: 'Budget is tight this year',
          response: 'I understand. Could we discuss a phased approach or non-monetary benefits?',
        },
        {
          objection: "Your performance hasn't justified a raise",
          response:
            "I'd like to understand what specific achievements would warrant reconsideration",
        },
      ],
      walkawayConditions: [
        'No increase offered after multiple discussions',
        'Proposed increase less than 3% with no timeline for more',
      ],
      bestTimeToAsk: 'After successful project completion or during annual review',
      budgetCycleContext: 'Q4 typically has most budget flexibility for next year planning',
    };

    // Enhance with AI if available
    if (this.ollamaAvailable) {
      try {
        const prompt = `As a career negotiation coach, enhance this raise negotiation brief with 3 additional talking points and 2 objection handlers specific to this situation:

Employee: ${employee.name}
Role: ${employee.role}, Level: ${employee.level}
Department: ${employee.department}
Tenure: ${Math.round((Date.now() - employee.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000))} years
Current Salary: $${employee.salary.toLocaleString()}
Market Position: ${marketPosition} market (${marketPercentile}th percentile)
Last Raise: ${employee.lastRaiseDate ? employee.lastRaiseDate.toLocaleDateString() : 'No record'}

Respond in JSON:
{
  "additionalTalkingPoints": ["point1", "point2", "point3"],
  "additionalObjectionHandlers": [
    {"objection": "...", "response": "..."},
    {"objection": "...", "response": "..."}
  ]
}`;

        const response = await ollamaService.generate({ prompt, model: 'llama3.2:latest' });
        const jsonMatch = (response.response || '').match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.additionalTalkingPoints) {
            brief.talkingPoints.push(...parsed.additionalTalkingPoints);
          }
          if (parsed.additionalObjectionHandlers) {
            brief.objectionHandlers.push(...parsed.additionalObjectionHandlers);
          }
        }
      } catch (error) {
        console.error('AI enhancement failed:', error);
      }
    }

    request.negotiationBrief = brief;
    request.aiPrepared = true;
    this.saveToStorage();
    return brief;
  }

  submitRequest(employeeId: string, requestId: string): EmployeeRequest | null {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      return null;
    }

    const request = employee.pendingRequests.find((r) => r.id === requestId);
    if (!request) {
      return null;
    }

    request.status = 'submitted';
    this.saveToStorage();
    return request;
  }

  // ---------------------------------------------------------------------------
  // ADVOCACY SESSIONS
  // ---------------------------------------------------------------------------

  scheduleAdvocacySession(
    employeeId: string,
    type: AdvocacySession['type'],
    topic: string,
    scheduledAt: Date
  ): AdvocacySession {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const session: AdvocacySession = {
      id: `session-${Date.now()}`,
      type,
      topic,
      scheduledAt,
      recommendations: [],
      confidential: true,
    };

    employee.advocacySessions.push(session);
    this.saveToStorage();
    return session;
  }

  // ---------------------------------------------------------------------------
  // INSIGHTS
  // ---------------------------------------------------------------------------

  private addInsight(insight: Omit<EmployeeInsight, 'id' | 'detectedAt'>): void {
    this.insights.push({
      ...insight,
      id: `insight-${Date.now()}`,
      detectedAt: new Date(),
    });
    this.saveToStorage();
  }

  getInsights(): EmployeeInsight[] {
    return this.insights.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getWorkforceMetrics(): WorkforceMetrics {
    const employees = this.getAllEmployees();

    if (employees.length === 0) {
      return {
        totalEmployees: 0,
        avgBurnoutScore: 0,
        burnoutDistribution: { healthy: 0, caution: 0, warning: 0, critical: 0, emergency: 0 },
        avgTenure: 0,
        turnoverRate: 0,
        openViolations: 0,
        pendingRequests: 0,
        avgSalaryVsMarket: 0,
        overtimeAverage: 0,
        ptoUtilization: 0,
        rightsByType: {
          compensation: { violations: 0, resolved: 0 },
          time_off: { violations: 0, resolved: 0 },
          workload: { violations: 0, resolved: 0 },
          safety: { violations: 0, resolved: 0 },
          privacy: { violations: 0, resolved: 0 },
          dignity: { violations: 0, resolved: 0 },
          growth: { violations: 0, resolved: 0 },
          voice: { violations: 0, resolved: 0 },
        },
      };
    }

    const burnoutDistribution: Record<BurnoutLevel, number> = {
      healthy: 0,
      caution: 0,
      warning: 0,
      critical: 0,
      emergency: 0,
    };
    employees.forEach((e) => burnoutDistribution[e.burnoutLevel]++);

    const rightsByType: Record<RightType, { violations: number; resolved: number }> = {
      compensation: { violations: 0, resolved: 0 },
      time_off: { violations: 0, resolved: 0 },
      workload: { violations: 0, resolved: 0 },
      safety: { violations: 0, resolved: 0 },
      privacy: { violations: 0, resolved: 0 },
      dignity: { violations: 0, resolved: 0 },
      growth: { violations: 0, resolved: 0 },
      voice: { violations: 0, resolved: 0 },
    };
    employees.forEach((e) => {
      e.rightsViolations.forEach((v) => {
        rightsByType[v.type].violations++;
        if (v.status === 'resolved') {
          rightsByType[v.type].resolved++;
        }
      });
    });

    const avgBurnoutScore =
      employees.reduce((sum, e) => sum + e.burnoutScore, 0) / employees.length;
    const avgTenure =
      employees.reduce(
        (sum, e) => sum + (Date.now() - e.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000),
        0
      ) / employees.length;
    const overtimeAverage =
      employees.reduce((sum, e) => sum + e.overtimeHoursThisMonth, 0) / employees.length;

    const openViolations = employees.reduce(
      (sum, e) => sum + e.rightsViolations.filter((v) => v.status !== 'resolved').length,
      0
    );
    const pendingRequests = employees.reduce(
      (sum, e) =>
        sum +
        e.pendingRequests.filter((r) => r.status !== 'approved' && r.status !== 'denied').length,
      0
    );

    // Turnover rate: % of employees on notice or terminated vs total
    const terminatedOrNotice = employees.filter(
      (e) => e.status === 'notice_period' || e.status === 'terminated'
    ).length;
    const turnoverRate = employees.length > 0
      ? Math.round((terminatedOrNotice / employees.length) * 1000) / 10
      : 0;

    // Avg salary vs market: use market range midpoint (salary × 1.05) as benchmark
    // Ratio < 100 means below market, > 100 means above market
    const salaryRatios = employees.map((e) => {
      const marketMid = e.salary * 1.05;
      return marketMid > 0 ? (e.salary / marketMid) * 100 : 100;
    });
    const avgSalaryVsMarket = Math.round(mean(salaryRatios) * 10) / 10;

    // PTO utilization: actual PTO used / (used + remaining) × 100
    const ptoRatios = employees
      .filter((e) => (e.ptoUsedThisYear || 0) + (e.ptoDaysRemaining || 0) > 0)
      .map((e) => {
        const total = (e.ptoUsedThisYear || 0) + (e.ptoDaysRemaining || 0);
        return ((e.ptoUsedThisYear || 0) / total) * 100;
      });
    const ptoUtilization = ptoRatios.length > 0 ? Math.round(mean(ptoRatios)) : 0;

    return {
      totalEmployees: employees.length,
      avgBurnoutScore: Math.round(avgBurnoutScore),
      burnoutDistribution,
      avgTenure: Math.round(avgTenure * 10) / 10,
      turnoverRate,
      openViolations,
      pendingRequests,
      avgSalaryVsMarket,
      overtimeAverage: Math.round(overtimeAverage),
      ptoUtilization,
      rightsByType,
    };
  }

  // ---------------------------------------------------------------------------
  // OLLAMA STATUS
  // ---------------------------------------------------------------------------

  isOllamaAvailable(): boolean {
    return this.ollamaAvailable;
  }

  async refreshOllamaStatus(): Promise<boolean> {
    await this.checkOllamaStatus();
    return this.ollamaAvailable;
  }
}

// Singleton
export const unionService = new UnionService();
export default unionService;
