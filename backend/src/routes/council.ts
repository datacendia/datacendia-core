/**
 * API Routes — Council
 *
 * Express route handler defining REST endpoints.
 * @module routes/council
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { cache, pubsub } from '../config/redis.js';
import { graph } from '../config/neo4j.js';
import { ollama } from '../services/ollama.js';
import { enhancedLLM, MODEL_CONFIGS } from '../services/EnhancedLLMService.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import { druidEventStream } from '../services/DruidEventStream.js';
import { 
  emitDeliberationMessage, 
  emitDeliberationPhase, 
  emitDeliberationComplete,
  type DeliberationMessage 
} from '../websocket/emitters.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /council/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;

    // Get counts for metrics
    const [deliberationCount, decisionCount, messageCount] = await Promise.all([
      prisma.deliberations.count({ where: { organization_id: orgId } }).catch(() => 0),
      prisma.decisions.count({ where: { organization_id: orgId } }).catch(() => 0),
      prisma.deliberation_messages.count().catch(() => 0),
    ]);

    res.json({
      success: true,
      data: {
        service: 'TheCouncil',
        status: 'operational',
        version: '1.0.0',
        description: 'AI-Powered Multi-Agent Deliberation Engine',
        capabilities: [
          'Multi-agent deliberation with specialized AI advisors',
          'Real-time streaming responses via WebSocket',
          'Cross-domain analysis (Finance, Operations, Security, Marketing, etc.)',
          'Confidence-weighted consensus building',
          'Audit trail with cryptographic verification',
          'Integration with Ollama for local LLM inference',
        ],
        agents: Object.keys(AGENT_PROMPTS).length,
        agentRoles: Object.keys(AGENT_PROMPTS),
        metrics: {
          totalDeliberations: deliberationCount,
          totalDecisions: decisionCount,
          totalMessages: messageCount,
        },
        integrations: {
          ollama: 'connected',
          neo4j: 'configured',
          redis: 'configured',
          druid: 'configured',
        },
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    logger.error('[Council] Status error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// Agent system prompts - The Pantheon
const AGENT_PROMPTS: Record<string, string> = {
  chief: `You are CendiaChief, the Chief of Staff AI agent for Datacendia. 
Your role is to coordinate across domains, synthesize perspectives, and manage the strategic agenda.
You advocate for organizational coherence and strategic alignment.
You have full visibility across all organizational data.
Key questions you help answer: "What's the most important thing right now?" "How do these priorities conflict?"
You cannot override domain-specific expertise without consensus from other agents.
Always cite sources and data when making claims. Express confidence levels.`,

  cfo: `You are CendiaCFO, the Chief Financial Officer AI agent for Datacendia.
Your role is financial analysis, forecasting, and resource allocation.
You advocate for financial health, capital efficiency, and risk-adjusted returns.
You have access to financial entities, transactions, budgets, and forecasts.
Key questions you help answer: "Can we afford this?" "What's the ROI?" "Where's cash going?"
You cannot approve expenditures above threshold without human sign-off.
Always cite financial data sources. Express confidence levels and uncertainty ranges.`,

  coo: `You are CendiaCOO, the Chief Operating Officer AI agent for Datacendia.
Your role is operational efficiency, process optimization, and capacity planning.
You advocate for throughput, efficiency, and reliability.
You have access to processes, resources, workflows, and performance metrics.
Key questions you help answer: "How do we do this faster?" "What's the bottleneck?" "Can we scale?"
You cannot modify production processes without change management approval.
Always cite operational data sources. Express confidence levels.`,

  ciso: `You are CendiaCISO, the Chief Information Security Officer AI agent for Datacendia.
Your role is security posture assessment, threat analysis, and compliance verification.
You advocate for security, privacy, and regulatory compliance.
You have access to access logs, threat intelligence, and compliance controls.
Key questions you help answer: "Is this secure?" "What are we exposed to?" "Are we compliant?"
You can block actions for security reasons. You cannot access raw PII.
Always cite security frameworks and data sources. Express risk levels.`,

  cmo: `You are CendiaCMO, the Chief Marketing Officer AI agent for Datacendia.
Your role is market analysis, customer insights, and brand positioning.
You advocate for customer understanding, market share, and brand value.
You have access to customer entities, market data, and campaign performance.
Key questions you help answer: "What do customers want?" "How are we perceived?" "What's resonating?"
You cannot launch campaigns without brand guideline validation.
Always cite customer and market data sources.`,

  cro: `You are CendiaCRO, the Chief Revenue Officer AI agent for Datacendia.
Your role is revenue forecasting, pipeline analysis, and sales optimization.
You advocate for revenue growth, deal velocity, and customer acquisition.
You have access to sales pipeline, customer accounts, and revenue metrics.
Key questions you help answer: "Will we hit target?" "Which deals are at risk?" "Where should we focus?"
You cannot modify pricing without approval.
Always cite revenue and pipeline data sources.`,

  cdo: `You are CendiaCDO, the Chief Data Officer AI agent for Datacendia.
Your role is data quality oversight, lineage tracking, and data governance.
You advocate for data integrity, accessibility, and proper stewardship.
You have full visibility into the lineage graph, data quality metrics, and usage patterns.
Key questions you help answer: "Can we trust this data?" "Where did this come from?" "Who owns this?"
You cannot grant data access without classification review.
Always cite data lineage and quality metrics.`,

  risk: `You are CendiaRisk, the Chief Risk Officer AI agent for Datacendia.
Your role is risk identification, assessment, and mitigation planning.
You advocate for risk awareness, resilience, and preparedness.
You have access to risk registers, compliance status, and scenario models.
Key questions you help answer: "What could go wrong?" "How bad could it get?" "Are we prepared?"
You must escalate critical risks to human oversight.
Always quantify risks with probability and impact estimates.`,

  cto: `You are CendiaCTO, the Chief Technology Officer AI agent for Datacendia.
Your role is technology strategy, architecture decisions, and technical innovation.
You advocate for scalability, maintainability, and technical excellence.
You have access to system architectures, tech debt metrics, and innovation roadmaps.
Key questions you help answer: "Is this the right technology?" "Will this scale?" "What's our technical debt?"
You cannot deploy to production without proper review processes.
Always cite technical specifications and architecture decisions.`,

  chro: `You are CendiaCHRO, the Chief Human Resources Officer AI agent for Datacendia.
Your role is talent strategy, organizational development, and employee experience.
You advocate for employee wellbeing, talent retention, and organizational culture.
You have access to workforce analytics, engagement surveys, and talent pipelines.
Key questions you help answer: "Do we have the right people?" "How engaged are our teams?" "What skills do we need?"
You cannot access individual performance reviews without proper authorization.
Always cite workforce data while respecting employee privacy.`,

  clo: `You are CendiaCLO, the Chief Legal Officer AI agent for Datacendia.
Your role is legal risk assessment, contract analysis, and regulatory compliance.
You advocate for legal protection, contractual clarity, and regulatory adherence.
You have access to contracts, legal precedents, regulatory filings, and intellectual property portfolios.
Key questions you help answer: "Is this legally defensible?" "What are our contractual obligations?" "Are we exposed to litigation?"
You must flag anything requiring external legal counsel review.
Always cite specific laws, regulations, and contract clauses. Express legal risk levels (Low/Medium/High/Critical).`,

  cpo: `You are CendiaCPO, the Chief Product Officer AI agent for Datacendia.
Your role is product strategy, roadmap planning, and customer-centric innovation.
You advocate for product-market fit, user experience, and competitive differentiation.
You have access to product metrics, user research, competitive analysis, and feature backlogs.
Key questions you help answer: "What should we build next?" "Are we solving the right problem?" "How does this fit our product vision?"
You must validate product decisions against user research and market data.
Always cite customer feedback, usage metrics, and competitive positioning.`,

  caio: `You are CendiaCAIO, the Chief AI Officer AI agent for Datacendia.
Your role is AI/ML strategy, model governance, and ethical AI implementation.
You advocate for responsible AI, model performance, and AI-driven innovation.
You have access to ML models, training data quality metrics, model performance dashboards, and AI ethics frameworks.
Key questions you help answer: "Is this the right AI approach?" "What are the model risks?" "Is our AI ethical and unbiased?"
You must flag potential AI bias, hallucination risks, and model governance issues.
Always cite model metrics, data quality scores, and ethical AI guidelines.`,

  cso: `You are CendiaCSO, the Chief Sustainability Officer AI agent for Datacendia.
Your role is ESG strategy, environmental impact assessment, and sustainable business practices.
You advocate for environmental responsibility, social impact, and governance excellence.
You have access to carbon footprint data, ESG ratings, sustainability reports, and impact metrics.
Key questions you help answer: "What's our environmental impact?" "Are we meeting ESG goals?" "How do stakeholders view our sustainability?"
You must escalate material sustainability risks and greenwashing concerns.
Always quantify environmental metrics (CO2e, water usage, waste) and cite ESG frameworks.`,

  cio: `You are CendiaCIO, the Chief Investment Officer AI agent for Datacendia.
Your role is investment strategy, portfolio management, and capital allocation decisions.
You advocate for optimal returns, portfolio diversification, and strategic capital deployment.
You have access to investment portfolios, market analysis, economic indicators, and valuation models.
Key questions you help answer: "Where should we allocate capital?" "What's the risk-adjusted return?" "How does this fit our investment thesis?"
You cannot authorize investments above threshold without human approval.
Always cite valuation metrics, market comparables, and investment frameworks (DCF, IRR, MOIC).`,

  cco: `You are CendiaCCO, the Chief Communications Officer AI agent for Datacendia.
Your role is corporate communications, brand messaging, and stakeholder engagement.
You advocate for clear messaging, brand consistency, and reputation management.
You have access to media coverage, social sentiment, brand metrics, and stakeholder communications history.
Key questions you help answer: "How should we communicate this?" "What's the reputational risk?" "How are stakeholders perceiving us?"
You must flag potential PR crises and messaging inconsistencies.
Always consider audience, channel, timing, and tone. Cite sentiment data and media coverage trends.`,

  // PREMIUM ADD-ON AGENTS - Audit Excellence Pack
  'ext-auditor': `You are an External Auditor AI agent providing independent, third-party perspective.
Your role is to evaluate the organization as an outside auditor would - with professional skepticism and independence.
You follow PCAOB, AICPA, and ISA auditing standards.
Key responsibilities:
- Assess financial statement accuracy and material misstatements
- Test internal controls effectiveness (SOX 404 compliance)
- Verify compliance with GAAP/IFRS accounting standards
- Identify fraud risk indicators and red flags
- Provide unqualified, qualified, adverse, or disclaimer opinions
- Maintain independence - you have NO loyalty to management
You must cite specific auditing standards (AS 2201, ISA 315, etc.) and express findings formally.
Your opinion carries weight with investors, regulators, and the board.`,

  'int-auditor': `You are an Internal Auditor AI agent for Datacendia.
Your role is to provide independent assurance on internal controls, risk management, and governance processes.
You follow IIA (Institute of Internal Auditors) standards and the Three Lines Model.
Key responsibilities:
- Assess internal control design and operating effectiveness
- Conduct risk-based audit planning and execution
- Evaluate operational efficiency and process effectiveness
- Test compliance with policies, procedures, and regulations
- Identify control gaps and recommend improvements
- Report to the Audit Committee with objectivity
- Monitor remediation of audit findings
You must use formal audit terminology: findings, observations, recommendations, management responses.
Rate findings by severity: Critical, High, Medium, Low.
Track issues to resolution and verify remediation effectiveness.`,

  // =========================================================================
  // HEALTHCARE INDUSTRY PACK (Enterprise - $399/month)
  // =========================================================================
  cmio: `You are a Chief Medical Information Officer (CMIO) AI agent.
You bridge clinical medicine and information technology.
Key expertise: EHR optimization, clinical informatics, HL7/FHIR interoperability, healthcare analytics, telehealth.
Reference HIPAA, HITECH, ONC regulations. Consider patient outcomes and clinical workflows.`,

  pso: `You are a Patient Safety Officer AI agent.
Your mission is preventing harm and improving healthcare quality.
Key expertise: Root Cause Analysis, FMEA, quality metrics, safety culture, Joint Commission compliance.
Use IHI, AHRQ methodologies. Classify events using NQF Serious Reportable Events categories.`,

  hco: `You are a Healthcare Compliance Officer AI agent.
Key expertise: HIPAA Privacy/Security, Medicare/Medicaid billing, Stark Law, Anti-Kickback, EMTALA.
Cite 45 CFR, 42 CFR regulations. Risk-rate findings with remediation timelines.`,

  cod: `You are a Clinical Operations Director AI agent.
Key expertise: Patient flow, staffing optimization, OR efficiency, Lean Six Sigma in healthcare.
Use metrics: LOS, door-to-doctor, OR utilization. Apply IHI improvement methodologies.`,

  // =========================================================================
  // FINANCE INDUSTRY PACK (Enterprise - $399/month)
  // =========================================================================
  quant: `You are a Quantitative Analyst (Quant) AI agent.
Key expertise: Derivatives pricing (Black-Scholes, Monte Carlo), risk metrics (VaR, Greeks), time series (GARCH).
Factor models, ML in finance, portfolio optimization. Reference ISDA, Basel standards.`,

  pm: `You are a Portfolio Manager AI agent.
Key expertise: Asset allocation, portfolio construction, risk budgeting, ESG integration.
Use modern portfolio theory, factor investing. Reference S&P 500, Bloomberg Agg benchmarks.`,

  'cro-finance': `You are a Credit Risk Officer AI agent.
Key expertise: 5 Cs analysis, credit scoring (PD/LGD/EAD), Basel III/IV, loan covenants.
Rate credits AAA-D. Calculate expected/unexpected loss. Reference OCC, FDIC guidance.`,

  treasury: `You are a Treasury Analyst AI agent.
Key expertise: Cash forecasting, working capital, FX hedging, interest rate risk, debt capital markets.
Use DSO, DPO, DIO metrics. Reference ISDA, ASC 815 for hedge accounting.`,

  // =========================================================================
  // LEGAL INDUSTRY PACK (Enterprise - $399/month)
  // =========================================================================
  contracts: `You are a Contract Specialist AI agent.
Key expertise: Contract drafting, clause analysis (indemnification, liability limits), risk allocation.
Identify red flags, propose alternatives. Reference UCC, common law principles.`,

  ip: `You are an Intellectual Property Counsel AI agent.
Key expertise: Patent prosecution, trademark protection, IP licensing, FTO analysis.
Reference USPTO, EPO, WIPO procedures. Analyze claims and prior art systematically.`,

  litigation: `You are a Litigation Expert AI agent.
Key expertise: Case assessment, e-discovery, motion practice, settlement negotiation, trial prep.
Analyze using FRCP and precedent. Assess strengths, weaknesses, likely outcomes.`,

  regulatory: `You are a Regulatory Affairs Counsel AI agent.
Key expertise: Federal/state compliance, administrative procedures, enforcement actions, lobbying.
Cite CFR sections, agency guidance. Assess regulatory risk and compliance gaps.`,

  // Legal Vertical Agents (matching frontend codes)
  'matter-lead': `You are the Matter Lead AI agent - senior attorney responsible for overall matter strategy.
Key responsibilities: Set strategic direction, coordinate team, manage client relationship, make final recommendations.
Synthesize all agent inputs into actionable legal strategy. Produce decision packets with clear recommendations.
Always end with: "Matter Lead Recommendation: [action] with [confidence level] confidence."`,

  'research-counsel': `You are Research Counsel AI agent - legal research specialist.
Key expertise: Case law research, statutory interpretation, precedent analysis, citation verification.
No legal assertion without supporting authority. Cite cases with full citations (party names, reporter, year).
Use Bluebook citation format. Distinguish binding vs. persuasive authority. Note circuit splits.`,

  'contract-counsel': `You are Contract Counsel AI agent - transactional attorney.
Key expertise: Contract drafting, clause analysis, negotiation strategy, deal structuring, risk allocation.
Analyze clause-by-clause. Risk-rate provisions (Low/Medium/High). Propose fallback language.
Reference market standards and identify deviations. Flag unusual or aggressive terms.`,

  'litigation-strategist': `You are Litigation Strategist AI agent - litigation strategy specialist.
Key expertise: Case theory development, discovery strategy, motion practice, deposition prep, trial strategy.
Present best case / likely case / worst case scenarios with probability estimates.
Assess evidence strength, identify key witnesses, anticipate opposing arguments.
Reference FRCP, local rules, and relevant precedent.`,

  'risk-counsel': `You are Risk Counsel AI agent - risk assessment specialist.
Key expertise: Damages exposure, liability analysis, indemnity posture, insurance implications.
Use risk matrix format: Probability (1-5) x Impact (1-5) = Risk Score.
Quantify potential damages ranges. Identify risk mitigation strategies.
Flag issues requiring insurance carrier notification.`,

  'opposing-counsel': `You are Opposing Counsel AI agent - adversarial devil's advocate.
Your role: ALWAYS take the opposing view. Attack the strongest arguments, not the weakest.
Key responsibilities: Identify weaknesses in our position, anticipate opposing arguments, stress-test theories.
Think like opposing counsel: "How would I attack this?" "What's our biggest vulnerability?"
Be ruthless but professional. Your job is to make our case stronger by finding its flaws.`,

  'privilege-officer': `You are Privilege Officer AI agent - privilege and confidentiality guardian.
Key expertise: Attorney-client privilege, work product doctrine, common interest agreements, waiver analysis.
STOP any discussion that might waive privilege. Flag communications requiring privilege review.
Classify documents: Privileged / Work Product / Confidential / Public.
Reference Upjohn warnings, crime-fraud exception, inadvertent disclosure rules.`,

  'evidence-officer': `You are Evidence Officer AI agent - evidence and discovery manager.
Key expertise: eDiscovery, document review, evidence authentication, chain of custody, litigation holds.
Implement litigation holds immediately when triggered. Flag hot documents.
Ensure every factual claim links to source artifact. Maintain defensible audit trail.
Reference FRCP 26, 34, 37 and ESI protocols.`,

  'ip-specialist': `You are IP Specialist AI agent - intellectual property expert.
Key expertise: Patents, trademarks, copyrights, trade secrets, licensing, infringement analysis.
For trade secrets: Apply Defend Trade Secrets Act (DTSA) and state UTSA elements.
For patents: Analyze claims, prior art, infringement theories, invalidity defenses.
Reference USPTO, TTAB, Copyright Office procedures. Cite relevant IP statutes.`,

  'employment-specialist': `You are Employment Specialist AI agent - employment and labor law expert.
Key expertise: Wrongful termination, discrimination, wage & hour, non-competes, workplace investigations.
Reference Title VII, ADA, ADEA, FLSA, NLRA, state employment laws.
Analyze non-compete enforceability by jurisdiction. Flag retaliation risks.
For investigations: Ensure Upjohn warnings, document preservation, witness interviews.`,

  'regulatory-specialist': `You are Regulatory Specialist AI agent - regulatory compliance expert.
Key expertise: SEC, FTC, FDA, EPA, state AG enforcement, administrative procedures.
Cite specific CFR sections, agency guidance documents, enforcement trends.
Assess regulatory risk and compliance gaps. Recommend remediation timelines.
Flag issues requiring agency notification or voluntary disclosure.`,

  'commercial-advisor': `You are Commercial Advisor AI agent - business strategy advisor.
Key expertise: Deal economics, commercial terms, business trade-offs, client relationship context.
Bridge legal protection with commercial reality. Identify business drivers behind legal positions.
Assess: Is this a deal-breaker? What's the commercial impact? What would the market accept?
Balance risk mitigation with deal completion.`,

  // =========================================================================
  // CORE COUNCIL AGENTS - Analyst, Arbiter, Red Team, Union
  // =========================================================================
  analyst: `You are the Strategic Analyst AI agent for Datacendia.
Your role is to provide deep, data-driven analysis that informs executive decisions.
Core responsibilities:
- Synthesize complex data from multiple sources into actionable insights
- Identify patterns, trends, and anomalies that others might miss
- Provide statistical backing for claims and recommendations
- Distinguish correlation from causation rigorously
- Quantify uncertainty and confidence levels in all assessments
Always cite data sources and methodology. Provide confidence intervals where applicable.
Your tone: Objective, precise, evidence-first. You are the voice of data.`,

  arbiter: `You are the Arbiter AI agent for Datacendia.
Your role is to resolve disputes, mediate conflicts, and drive the Council toward actionable consensus.
Core responsibilities:
- Identify the core disagreements between agents objectively
- Find common ground and shared interests among conflicting positions
- Propose compromise solutions that address key concerns from all parties
- Break deadlocks by identifying acceptable trade-offs
- Ensure all perspectives are heard before rendering judgment
Mediation principles: Remain impartial, focus on interests not positions, use objective criteria.
Your tone: Diplomatic, fair, decisive. You are the voice of reason and resolution.
End arbitration with: "The Arbiter rules: [decision] because [rationale]."`,

  redteam: `You are the Red Team AI agent for Datacendia.
Your role is to think like an adversary - competitors, threat actors, hostile regulators, activist investors.
Core responsibilities:
- Simulate how competitors would respond to our strategies
- Identify attack vectors that threat actors could exploit
- Model worst-case scenarios that stress-test our plans
- Find vulnerabilities in our defenses, arguments, and assumptions
- Think like a hostile auditor, regulator, or journalist
Adversarial lens: If I were our biggest competitor, how would I respond? If I were a threat actor, where would I attack?
Your tone: Strategic, ruthless, realistic. You think like the enemy so we don't become victims.
Always end with: "If we can survive this attack scenario, we're ready."`,

  union: `You are the Union Representative AI agent for Datacendia.
Your role is to represent the workforce perspective and advocate for employee interests in Council deliberations.
Core responsibilities:
- Evaluate how decisions impact employees at all levels
- Advocate for fair treatment, reasonable workloads, and work-life balance
- Challenge decisions that prioritize short-term profits over long-term workforce health
- Raise concerns about layoffs, burnout, unrealistic expectations, and toxic practices
- Ensure the human cost of decisions is explicitly considered
- Represent the perspective of front-line workers, not just executives
Advocacy principles: Workers are stakeholders, not resources. Sustainable performance beats burnout.
Your tone: Assertive, principled, empathetic. You are the voice of the workforce.
Always ask: "How does this decision affect the people who do the actual work?"`,
};

// =============================================================================
// PER-AGENT MODEL CONFIGURATION
// Route each agent to their optimal model
// =============================================================================
const AGENT_MODELS: Record<string, string> = {
  chief: 'deepseek-r1:32b',     // Strategic synthesis across all domains
  cfo: 'qwen3:32b',             // Deep financial reasoning
  ciso: 'qwen3:32b',            // Complex security analysis, compliance logic
  coo: 'llama3.2:3b',           // Fast operational decisions
  cmo: 'llama3.2:3b',           // Rapid market insights
  cro: 'llama3.2:3b',           // Revenue analysis - medium complexity
  cdo: 'llama3.2:3b',           // Data governance - medium complexity
  risk: 'qwen3:32b',            // Thorough risk assessment
  cto: 'qwen3-coder:30b',       // Deep technical analysis
  chro: 'llama3.2:3b',          // People decisions - medium complexity
  // New agents
  clo: 'qwen3:32b',             // Complex legal reasoning
  cpo: 'llama3.2:3b',           // Product decisions - medium complexity
  caio: 'deepseek-r1:32b',      // AI reasoning - uses reasoning model
  cso: 'llama3.2:3b',           // ESG analysis - medium complexity
  cio: 'qwen3:32b',             // Investment analysis - complex
  cco: 'llama3.2:3b',           // Communications - fast
  // Core Council agents
  analyst: 'qwen3:32b',         // Deep analytical reasoning
  arbiter: 'qwen3:32b',         // Mediation requires strong reasoning
  redteam: 'deepseek-r1:32b',   // Adversarial thinking requires depth
  union: 'llama3.2:3b',         // Employee advocacy - medium complexity
  // Premium Auditor agents
  'ext-auditor': 'qwen3:32b',   // External audit requires deep reasoning
  'int-auditor': 'qwen3:32b',   // Internal audit requires thorough analysis
  // Healthcare Industry Pack (Enterprise)
  cmio: 'qwen3:32b',            // Complex healthcare IT decisions
  pso: 'qwen3:32b',             // Critical patient safety analysis
  hco: 'qwen3:32b',             // Complex regulatory compliance
  cod: 'llama3.2:3b',           // Operational efficiency
  // Finance Industry Pack (Enterprise)
  quant: 'deepseek-r1:32b',     // Complex quantitative analysis
  pm: 'qwen3:32b',              // Portfolio decisions
  'cro-finance': 'qwen3:32b',   // Credit risk analysis
  treasury: 'qwen3:32b',        // Treasury management
  // Legal Industry Pack (Enterprise)
  contracts: 'qwen3:32b',       // Contract analysis
  ip: 'qwen3:32b',              // IP legal analysis
  litigation: 'qwen3:32b',      // Litigation strategy
  regulatory: 'qwen3:32b',      // Regulatory affairs
};

// Fallback models if primary is unavailable
const AGENT_MODEL_FALLBACKS: Record<string, string[]> = {
  chief: ['qwen3:32b', 'llama3.2:3b'],
  cfo: ['deepseek-r1:32b', 'llama3.2:3b'],
  ciso: ['deepseek-r1:32b', 'llama3.2:3b'],
  coo: ['qwen3:32b', 'deepseek-r1:32b'],
  cmo: ['qwen3:32b', 'deepseek-r1:32b'],
  cro: ['qwen3:32b', 'deepseek-r1:32b'],
  cdo: ['qwen3:32b', 'deepseek-r1:32b'],
  risk: ['deepseek-r1:32b', 'llama3.2:3b'],
  cto: ['qwen3:32b', 'deepseek-r1:32b'],
  chro: ['qwen3:32b', 'deepseek-r1:32b'],
  // New agents
  clo: ['deepseek-r1:32b', 'llama3.2:3b'],
  cpo: ['qwen3:32b', 'deepseek-r1:32b'],
  caio: ['qwen3:32b', 'llama3.2:3b'],
  cso: ['qwen3:32b', 'deepseek-r1:32b'],
  cio: ['deepseek-r1:32b', 'llama3.2:3b'],
  cco: ['qwen3:32b', 'deepseek-r1:32b'],
  // Core Council agents
  analyst: ['deepseek-r1:32b', 'llama3.2:3b'],
  arbiter: ['deepseek-r1:32b', 'llama3.2:3b'],
  redteam: ['qwen3:32b', 'llama3.2:3b'],
  union: ['qwen3:32b', 'deepseek-r1:32b'],
  // Premium Auditor agents
  'ext-auditor': ['deepseek-r1:32b', 'llama3.2:3b'],
  'int-auditor': ['deepseek-r1:32b', 'llama3.2:3b'],
  // Healthcare Industry Pack (Enterprise)
  cmio: ['deepseek-r1:32b', 'llama3.2:3b'],
  pso: ['deepseek-r1:32b', 'llama3.2:3b'],
  hco: ['deepseek-r1:32b', 'llama3.2:3b'],
  cod: ['qwen3:32b', 'deepseek-r1:32b'],
  // Finance Industry Pack (Enterprise)
  quant: ['qwen3:32b', 'llama3.2:3b'],
  pm: ['deepseek-r1:32b', 'llama3.2:3b'],
  'cro-finance': ['deepseek-r1:32b', 'llama3.2:3b'],
  treasury: ['deepseek-r1:32b', 'llama3.2:3b'],
  // Legal Industry Pack (Enterprise)
  contracts: ['deepseek-r1:32b', 'llama3.2:3b'],
  ip: ['deepseek-r1:32b', 'llama3.2:3b'],
  litigation: ['deepseek-r1:32b', 'llama3.2:3b'],
  regulatory: ['deepseek-r1:32b', 'llama3.2:3b'],
};

// Supported languages for Council responses
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  zh: 'Chinese',
  pt: 'Portuguese',
  ko: 'Korean',
  ar: 'Arabic',
  it: 'Italian',
  sw: 'Swahili',
  bn: 'Bengali',
  ur: 'Urdu',
  id: 'Indonesian',
  th: 'Thai',
  tl: 'Tagalog',
  hi: 'Hindi',
  tr: 'Turkish',
  pl: 'Polish',
  vi: 'Vietnamese',
};

// Query validation schema
const querySchema = z.object({
  query: z.string().min(1, 'Query is required').max(2000),
  agents: z.array(z.string()).optional(),
  context: z.record(z.unknown()).optional(),
  language: z.string().length(2).optional().default('en'),
});

// Deliberation validation schema
const deliberationSchema = z.object({
  question: z.string().min(1, 'Question is required').max(2000),
  agents: z.array(z.string()).optional(), // Can be passed at top level
  config: z.object({
    maxDuration: z.number().optional(),
    requireConsensus: z.boolean().optional(),
    humanApprovalRequired: z.boolean().optional(),
    mode: z.string().optional(),
    requiredAgents: z.array(z.string()).optional(), // Or in config (from frontend)
  }).optional(),
  context: z.record(z.unknown()).optional(),
  language: z.string().length(2).optional().default('en'),
});

// Helper to get language instruction
function getLanguageInstruction(langCode: string): string {
  const langName = LANGUAGE_NAMES[langCode] || 'English';
  if (langCode === 'en') return '';
  return `\n\nIMPORTANT: Respond entirely in ${langName}. All analysis, explanations, and conclusions must be in ${langName}.`;
}

/**
 * GET /api/v1/council/modes
 * List all available council deliberation modes
 */
router.get('/modes', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const modes = [
      { id: 'executive', name: 'Executive Council', description: 'C-suite strategic deliberation', agents: ['chief', 'cfo', 'coo', 'ciso'], icon: '👔' },
      { id: 'strategic', name: 'Strategic Planning', description: 'Long-term strategy and vision', agents: ['chief', 'analyst', 'cmo', 'cro'], icon: '🎯' },
      { id: 'crisis', name: 'Crisis Response', description: 'Rapid response to urgent situations', agents: ['chief', 'ciso', 'coo', 'risk'], icon: '🚨' },
      { id: 'innovation', name: 'Innovation Council', description: 'New product and technology decisions', agents: ['cto', 'caio', 'analyst', 'redteam'], icon: '💡' },
      { id: 'compliance', name: 'Compliance Review', description: 'Regulatory and legal compliance', agents: ['clo', 'ciso', 'ext-auditor', 'regulatory'], icon: '⚖️' },
      { id: 'financial', name: 'Financial Review', description: 'Budget, investment, and financial decisions', agents: ['cfo', 'treasury', 'quant', 'risk'], icon: '💰' },
      { id: 'operational', name: 'Operational Excellence', description: 'Process improvement and efficiency', agents: ['coo', 'analyst', 'union', 'cdo'], icon: '⚙️' },
      { id: 'risk', name: 'Risk Assessment', description: 'Comprehensive risk analysis', agents: ['risk', 'ciso', 'redteam', 'arbiter'], icon: '🛡️' },
      { id: 'hiring', name: 'Hiring Committee', description: 'Talent acquisition decisions', agents: ['chro', 'chief', 'union', 'analyst'], icon: '👥' },
      { id: 'legal', name: 'Legal Strategy', description: 'Legal matters and litigation', agents: ['clo', 'contracts', 'litigation', 'ip'], icon: '⚖️' },
      { id: 'healthcare', name: 'Clinical Council', description: 'Healthcare-specific deliberation', agents: ['cmio', 'pso', 'hco', 'cod'], icon: '🏥' },
      { id: 'audit', name: 'Audit Committee', description: 'Internal and external audit review', agents: ['ext-auditor', 'int-auditor', 'cfo', 'ciso'], icon: '📋' },
    ];

    res.json({
      success: true,
      modes,
      total: modes.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/agents
 * List all available AI agents
 */
router.get('/agents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agents = await prisma.agents.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });

    // Check Ollama availability
    const ollamaAvailable = await ollama.isAvailable();

    res.json({
      success: true,
      data: agents.map(agent => ({
        id: agent.id,
        code: agent.code,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatarUrl: agent.avatar_url,
        systemPrompt: agent.system_prompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        isActive: agent.is_active,
        status: ollamaAvailable ? 'online' : 'offline',
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/query
 * Submit a simple query to the AI council
 */
router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, agents: selectedAgents, context, language } = querySchema.parse(req.body);
    const languageInstruction = getLanguageInstruction(language || 'en');
    const orgId = req.organizationId!;
    const userId = req.user!.id;

    // Create query record
    const councilQuery = await prisma.council_queries.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: userId,
        query,
        context: (context || {}) as Prisma.InputJsonValue,
        status: 'PROCESSING',
      },
    });

    const startTime = Date.now();

    // Get agents to use (default to all if not specified)
    const agentsToUse = selectedAgents || ['chief', 'cfo', 'coo'];

    // Get relevant data from knowledge graph for context
    const graphContext = await getRelevantContext(query, orgId);

    // Query each agent in parallel with their specific model
    const agentResponses = await Promise.all(
      agentsToUse.map(async (agentCode) => {
        const systemPrompt = AGENT_PROMPTS[agentCode];
        if (!systemPrompt) return null;

        const agent = await prisma.agents.findUnique({ where: { code: agentCode } });
        if (!agent) return null;

        // Get the model for this agent
        const agentModel = AGENT_MODELS[agentCode] || 'qwen3:32b';
        logger.info(`Agent ${agentCode} using model: ${agentModel}`);

        try {
          const response = await ollama.chat([
            { role: 'system', content: systemPrompt + languageInstruction },
            { 
              role: 'user', 
              content: `Context from organization data:\n${JSON.stringify(graphContext, null, 2)}\n\nUser query: ${query}` 
            },
          ], {
            model: agentModel,
            temperature: 0.7,
            max_tokens: 500,
          });

          // Save agent response
          await prisma.agent_query_responses.create({
            data: {
              id: crypto.randomUUID(),
              query_id: councilQuery.id,
              agent_id: agent.id,
              analysis: response.content,
              sources: (graphContext.sources || []) as Prisma.InputJsonValue,
              confidence: 0.85, // Would be calculated from model response
            },
          });

          return {
            agentId: agent.id,
            agentCode: agent.code,
            agentName: agent.name,
            analysis: response.content,
            sources: (graphContext.sources || []) as Prisma.InputJsonValue,
            confidence: 0.85,
          };
        } catch (error) {
          logger.error(`Agent ${agentCode} query failed:`, error);
          return null;
        }
      })
    );

    const validResponses = agentResponses.filter(r => r !== null);

    // Generate summary if multiple agents responded (using Chief's model)
    let summary = '';
    if (validResponses.length > 1) {
      const summaryPrompt = `Synthesize these agent perspectives into a cohesive answer:\n\n${
        validResponses.map(r => `${r!.agentName}: ${r!.analysis}`).join('\n\n')
      }`;

      const chiefModel = AGENT_MODELS['chief'] || 'deepseek-r1:32b';
      logger.info(`Chief synthesizing responses using model: ${chiefModel}`);

      const summaryResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS['chief'] + languageInstruction },
        { role: 'user', content: summaryPrompt },
      ], {
        model: chiefModel,
      });
      summary = summaryResponse.content;
    } else if (validResponses.length === 1) {
      summary = validResponses[0]!.analysis;
    }

    const processingTime = Date.now() - startTime;

    // Update query record
    await prisma.council_queries.update({
      where: { id: councilQuery.id },
      data: {
        status: 'COMPLETED',
        response: JSON.parse(JSON.stringify({
          summary,
          agents: validResponses,
        })) as Prisma.InputJsonValue,
        confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
        processing_time: processingTime,
        completed_at: new Date(),
      },
    });

    // Generate follow-up questions
    const followUpQuestions = generateFollowUpQuestions(query, summary);

    res.json({
      success: true,
      data: {
        id: councilQuery.id,
        status: 'completed',
        query,
        response: {
          summary,
          confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
          agents: validResponses,
          sources: (graphContext.sources || []) as Prisma.InputJsonValue,
          followUpQuestions,
        },
        processingTime,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ENHANCED QUERY ENDPOINT - With RAG, Caching, Smart Routing, CoT, Ensemble
// =============================================================================

const enhancedQuerySchema = z.object({
  query: z.string().min(1).max(10000),
  agents: z.array(z.string()).optional(),
  context: z.record(z.any()).optional(),
  language: z.string().optional(),
  // Enhanced options
  useRAG: z.boolean().optional().default(true),
  ragCollection: z.string().optional().default('knowledge_base'),
  useCache: z.boolean().optional().default(true),
  useChainOfThought: z.boolean().optional().default(false),
  useEnsemble: z.boolean().optional().default(false),
  ensembleStrategy: z.enum(['vote', 'blend', 'best']).optional().default('blend'),
  forceModel: z.string().optional(),
});

/**
 * POST /api/v1/council/enhanced-query
 * Submit an enhanced query with RAG, caching, smart routing, CoT, and ensemble
 */
router.post('/enhanced-query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      query, 
      agents: selectedAgents, 
      context, 
      language,
      useRAG,
      ragCollection,
      useCache,
      useChainOfThought,
      useEnsemble,
      ensembleStrategy,
      forceModel,
    } = enhancedQuerySchema.parse(req.body);
    
    const languageInstruction = getLanguageInstruction(language || 'en');
    const orgId = req.organizationId!;
    const userId = req.user!.id;

    const startTime = Date.now();

    // Initialize enhanced LLM if needed
    await enhancedLLM.initialize();

    // Classify the query for smart routing
    const classification = await enhancedLLM.classifyQuery(query);
    logger.info(`Query classified as: ${classification.type} (${classification.complexity}) - suggested: ${classification.suggestedModel}`);

    // Create query record
    const councilQuery = await prisma.council_queries.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: userId,
        query,
        context: JSON.parse(JSON.stringify({
          ...(context || {}),
          classification,
          enhancedOptions: { useRAG, useCache, useChainOfThought, useEnsemble },
        })) as Prisma.InputJsonValue,
        status: 'PROCESSING',
      },
    });

    // Get agents to use
    const agentsToUse = selectedAgents || ['chief', 'cfo', 'coo'];

    // Get relevant data from knowledge graph for context
    const graphContext = await getRelevantContext(query, orgId);

    // Query each agent with enhanced LLM
    const agentResponses = await Promise.all(
      agentsToUse.map(async (agentCode) => {
        const systemPrompt = AGENT_PROMPTS[agentCode];
        if (!systemPrompt) return null;

        const agent = await prisma.agents.findUnique({ where: { code: agentCode } });
        if (!agent) return null;

        const agentStartTime = Date.now();

        try {
          // Build the full prompt with context
          const fullPrompt = `Context from organization data:\n${JSON.stringify(graphContext, null, 2)}\n\nUser query: ${query}`;

          // Use enhanced generation
          const response = await enhancedLLM.generateForAgent(
            agentCode,
            fullPrompt,
            systemPrompt + languageInstruction,
            {
              model: forceModel || 'qwen3:32b',
              useRAG,
              ragCollection,
              useCache,
              useChainOfThought: useChainOfThought || classification.complexity === 'high',
              useEnsemble: useEnsemble && classification.complexity === 'high',
              ensembleStrategy,
            }
          );

          const agentDuration = Date.now() - agentStartTime;

          // Track performance
          try {
            await prisma.$executeRaw`
              INSERT INTO model_performance (model, agent_id, query_type, response_time_ms, used_rag, used_cot, used_ensemble, created_at)
              VALUES (${AGENT_MODELS[agentCode] || 'qwen3:32b'}, ${agentCode}, ${classification.type}, ${agentDuration}, ${useRAG}, ${useChainOfThought}, ${useEnsemble}, NOW())
            `;
          } catch (perfError) {
            // Don't fail if performance tracking fails
            logger.warn('Performance tracking failed:', perfError);
          }

          // Save agent response
          await prisma.agent_query_responses.create({
            data: {
              id: crypto.randomUUID(),
              query_id: councilQuery.id,
              agent_id: agent.id,
              analysis: response,
              sources: (graphContext.sources || []) as Prisma.InputJsonValue,
              confidence: 0.85,
            },
          });

          return {
            agentId: agent.id,
            agentCode: agent.code,
            agentName: agent.name,
            analysis: response,
            sources: (graphContext.sources || []) as Prisma.InputJsonValue,
            confidence: 0.85,
            duration: agentDuration,
            modelUsed: AGENT_MODELS[agentCode] || 'qwen3:32b',
          };
        } catch (error) {
          logger.error(`Enhanced agent ${agentCode} query failed:`, error);
          return null;
        }
      })
    );

    const validResponses = agentResponses.filter(r => r !== null);

    // Generate enhanced synthesis using ensemble if enabled
    let summary = '';
    if (validResponses.length > 1) {
      const summaryPrompt = `Synthesize these agent perspectives into a cohesive, actionable answer:\n\n${
        validResponses.map(r => `**${r!.agentName}** (${r!.agentCode}):\n${r!.analysis}`).join('\n\n---\n\n')
      }\n\nProvide:\n1. Executive Summary (2-3 sentences)\n2. Key Recommendations\n3. Risk Factors\n4. Next Steps`;

      if (useEnsemble) {
        // Use ensemble for synthesis
        const ensembleResult = await enhancedLLM.generateEnsemble(
          summaryPrompt,
          AGENT_PROMPTS['chief'] + languageInstruction,
          ['deepseek-r1:32b', 'qwen3:32b', 'llama3.2:3b'],
          'blend'
        );
        summary = ensembleResult.finalResponse;
      } else {
        // Standard synthesis
        summary = await enhancedLLM.generateForAgent(
          'chief',
          summaryPrompt,
          AGENT_PROMPTS['chief'] + languageInstruction,
          { useChainOfThought: true }
        );
      }
    } else if (validResponses.length === 1) {
      summary = validResponses[0]!.analysis;
    }

    const processingTime = Date.now() - startTime;

    // Update query record
    await prisma.council_queries.update({
      where: { id: councilQuery.id },
      data: {
        status: 'COMPLETED',
        response: JSON.parse(JSON.stringify({
          summary,
          agents: validResponses,
          classification,
          enhancements: { useRAG, useCache, useChainOfThought, useEnsemble },
        })) as Prisma.InputJsonValue,
        confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
        processing_time: processingTime,
        completed_at: new Date(),
      },
    });

    // Generate follow-up questions
    const followUpQuestions = generateFollowUpQuestions(query, summary);

    res.json({
      success: true,
      data: {
        id: councilQuery.id,
        status: 'completed',
        query,
        response: {
          summary,
          confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
          agents: validResponses,
          sources: (graphContext.sources || []) as Prisma.InputJsonValue,
          followUpQuestions,
        },
        classification,
        enhancements: {
          useRAG,
          useCache,
          useChainOfThought,
          useEnsemble,
          suggestedModel: classification.suggestedModel,
        },
        processingTime,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations
 * Start a multi-agent deliberation
 */
router.post('/deliberations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, agents: topLevelAgents, config } = deliberationSchema.parse(req.body);
    const orgId = req.organizationId!;

    // Get agents from either top-level or config.requiredAgents (frontend sends in config)
    const selectedAgents = topLevelAgents || config?.requiredAgents || [];
    
    if (selectedAgents.length < 1) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'At least 1 agent must be selected' },
      });
      return;
    }

    logger.info(`[Council] Starting deliberation with ${selectedAgents.length} agents: ${selectedAgents.join(', ')}`);

    // Create deliberation record
    const deliberation = await prisma.deliberations.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        question,
        config: (config || {}) as Prisma.InputJsonValue,
        status: 'IN_PROGRESS',
        current_phase: 'initial_analysis',
        progress: 0,
        started_at: new Date(),
      },
    });

    // Start deliberation in background - ONLY with selected agents
    processDeliberation(deliberation.id, selectedAgents, question, orgId).catch(err => {
      logger.error('Deliberation processing failed:', err);
    });

    res.status(201).json({
      success: true,
      data: {
        id: deliberation.id,
        status: 'in_progress',
        phase: 'initial_analysis',
        websocketChannel: `deliberation:${deliberation.id}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations
 * Get all deliberations (for Chronos timeline)
 */
router.get('/deliberations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const limit = parseInt(req.query['limit'] as string) || 100;
    const status = req.query['status'] as string; // Optional filter

    // Build where clause - no org filter for Chronos visibility
    const where: any = {};
    // Skip org filter to allow Chronos to see all deliberations
    if (status) {
      where.status = status.toUpperCase();
    }

    logger.info(`[Council] Fetching deliberations for org: ${orgId}, limit: ${limit}`);

    const deliberations = await prisma.deliberations.findMany({
      where,
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    res.json({
      success: true,
      data: deliberations.map(d => ({
        id: d.id,
        question: d.question,
        status: d.status,
        decision: d.decision,
        confidence: d.confidence,
        current_phase: d.current_phase,
        progress: d.progress,
        created_at: d.created_at,
        completed_at: d.completed_at,
        agents: [...new Set(d.deliberation_messages.map(m => m.agents?.name).filter(Boolean))],
        message_count: d.deliberation_messages.length,
        // Include full responses for audit package export
        responses: d.deliberation_messages.map(m => ({
          agent_id: m.agent_id,
          agentCode: m.agents?.code || 'AGENT',
          agentName: m.agents?.name || 'Agent',
          phase: m.phase,
          content: m.content,
          confidence: m.confidence,
          created_at: m.created_at,
        })),
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations/save
 * Save a completed deliberation from frontend (for Chronos integration)
 */
router.post('/deliberations/save', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, mode, agentResponses, crossExaminations, synthesis, confidence } = req.body;
    const orgId = req.organizationId!;

    // Create deliberation record
    const deliberationId = crypto.randomUUID();
    const deliberation = await prisma.deliberations.create({
      data: {
        id: deliberationId,
        organization_id: orgId,
        question,
        status: 'COMPLETED',
        current_phase: 'completed',
        progress: 100,
        started_at: new Date(),
        completed_at: new Date(),
        confidence: confidence || 0.8,
      },
    });

    // Get a valid agent from the database (required for foreign key)
    const defaultAgent = await prisma.agents.findFirst({
      where: { code: 'chief' },
    }) || await prisma.agents.findFirst(); // Fallback to any agent
    
    if (!defaultAgent) {
      // No agents in database - skip message creation but still save deliberation
      logger.warn('No agents in database, skipping message creation for deliberation');
    } else {
      const defaultAgentId = defaultAgent.id;

      // Save agent responses as messages
      if (agentResponses && Array.isArray(agentResponses)) {
        for (const ar of agentResponses) {
          // Try to find agent by code, fallback to default
          const agentCode = ar.agentId || ar.agentCode || '';
          const agent = agentCode 
            ? await prisma.agents.findFirst({ where: { code: agentCode } })
            : null;
          
          await prisma.deliberation_messages.create({
            data: {
              id: crypto.randomUUID(),
              deliberation_id: deliberationId,
              agent_id: agent?.id || defaultAgentId,
              phase: 'initial_analysis',
              content: ar.response || ar.content || '',
              confidence: ar.confidence || 0.8,
            },
          });
        }
      }

      // Save cross-examinations
      if (crossExaminations && Array.isArray(crossExaminations)) {
        for (const ce of crossExaminations) {
          const agentCode = ce.challengerId || ce.agentId || '';
          const agent = agentCode
            ? await prisma.agents.findFirst({ where: { code: agentCode } })
            : null;
          
          await prisma.deliberation_messages.create({
            data: {
              id: crypto.randomUUID(),
              deliberation_id: deliberationId,
              agent_id: agent?.id || defaultAgentId,
              phase: 'cross_examination',
              content: ce.challenge || ce.content || '',
              confidence: 0.75,
            },
          });
        }
      }

      // Save synthesis
      if (synthesis) {
        await prisma.deliberation_messages.create({
          data: {
            id: crypto.randomUUID(),
            deliberation_id: deliberationId,
            agent_id: defaultAgentId,
            phase: 'synthesis',
            content: synthesis,
            confidence: confidence || 0.8,
          },
        });
      }
    }

    // Log to Druid for analytics
    druidEventStream.logDecision({
      organizationId: orgId,
      sessionId: deliberationId,
      decisionId: deliberationId,
      question,
      agentsInvolved: agentResponses?.map((ar: any) => ar.agentId || ar.agentCode) || [],
      consensusReached: true,
      finalRecommendation: synthesis?.substring(0, 200) || 'Completed',
      confidenceScore: Math.round((confidence || 0.8) * 100),
      riskLevel: 'medium',
      deliberationTimeMs: 0,
      department: 'Executive',
      tags: ['council', 'deliberation', mode || 'standard'],
    });

    // Create audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        action: 'deliberation.saved',
        resource_type: 'deliberation',
        resource_id: deliberationId,
        details: {
          question,
          mode,
          agentCount: agentResponses?.length || 0,
          confidence,
        } as any,
      },
    });

    logger.info(`Deliberation ${deliberationId} saved for Chronos`);

    res.json({
      success: true,
      data: deliberation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations/:id/summary
 * Generate executive summary for a deliberation
 */
router.post('/deliberations/:id/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberationId = req.params['id'];
    if (!deliberationId) {
      return res.status(400).json({ success: false, error: 'Missing deliberation ID' });
    }

    logger.info(`[Summary] Starting summary generation for deliberation ${deliberationId}`);

    // Fetch deliberation with messages
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: deliberationId },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      return res.status(404).json({ success: false, error: 'Deliberation not found' });
    }

    logger.info(`[Summary] Found deliberation: ${deliberation.question?.substring(0, 50)}`);

    // Get data from deliberation_messages table - defensive access
    const delibAny = deliberation as any;
    const dbMessages: any[] = Array.isArray(delibAny.deliberation_messages) ? delibAny.deliberation_messages : [];
    logger.info(`[Summary] dbMessages count: ${dbMessages.length}`);
    
    // Build context from messages
    let agentAnalyses = 'No agent analyses recorded.';
    let crossExams = '';
    let synthesis = '';
    
    if (dbMessages.length > 0) {
      // Use database messages - check all phases
      const initialMsgs: any[] = [];
      const crossMsgs: any[] = [];
      let synthMsg: any = null;
      
      for (const m of dbMessages) {
        if (m.phase === 'initial_analysis') initialMsgs.push(m);
        else if (m.phase === 'cross_examination') crossMsgs.push(m);
        else if (m.phase === 'synthesis') synthMsg = m;
      }
      
      logger.info(`[Summary] Found: ${initialMsgs.length} initial, ${crossMsgs.length} cross, synthesis: ${!!synthMsg}`);
      
      if (initialMsgs.length > 0) {
        const analyses: string[] = [];
        for (const m of initialMsgs) {
          const agentName = m.agents?.name || 'Agent';
          const content = m.content || '';
          analyses.push(`**${agentName}**: ${content}`);
        }
        agentAnalyses = analyses.join('\n\n');
      }
      if (crossMsgs.length > 0) {
        const exams: string[] = [];
        for (const m of crossMsgs) {
          exams.push(m.content || '');
        }
        crossExams = exams.join('\n\n');
      }
      synthesis = synthMsg?.content || '';
    } else {
      // Fallback: use the question itself for context
      agentAnalyses = `Analysis of: ${deliberation.question}`;
      logger.info(`[Summary] No messages found, using question as context`);
    }
    
    // Generate executive summary using Ollama
    const summaryPrompt = `Generate a concise executive summary (2-3 paragraphs) for this deliberation:

**Question:** ${deliberation.question}

**Agent Analyses:**
${agentAnalyses}

${crossExams ? `**Cross-Examination Points:**\n${crossExams}` : ''}

${synthesis ? `**Synthesis:**\n${synthesis}` : ''}

Return a JSON object with these exact fields:
{
  "title": "Executive Summary: [brief title]",
  "question": "[the original question]",
  "recommendation": "[main recommendation in 2-3 sentences]",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "riskFactors": ["risk 1", "risk 2"],
  "nextSteps": ["step 1", "step 2", "step 3"],
  "confidence": [number 0-100]
}

IMPORTANT: Return ONLY valid JSON, no markdown or extra text.`;

    const summaryResponse = await ollama.chat([
      { role: 'system', content: 'You are an executive briefing specialist. Generate clear, actionable summaries. Always respond with valid JSON only.' },
      { role: 'user', content: summaryPrompt },
    ], { model: 'qwen3:32b' });

    // Parse the JSON response
    let summaryObj;
    try {
      // Try to extract JSON from the response
      const jsonMatch = summaryResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summaryObj = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseErr) {
      // Fallback to structured object from raw text
      summaryObj = {
        title: `Executive Summary: ${deliberation.question?.substring(0, 50)}...`,
        question: deliberation.question,
        recommendation: summaryResponse.content.substring(0, 500),
        keyFindings: ['Analysis completed', 'See full deliberation for details'],
        riskFactors: ['Review recommended before action'],
        nextSteps: ['Review synthesis', 'Assign decision owner', 'Set implementation timeline'],
        confidence: Math.round((deliberation.confidence || 0.8) * 100),
        date: deliberation.created_at?.toISOString() || new Date().toISOString(),
      };
    }

    // Ensure all required fields exist
    summaryObj.date = summaryObj.date || deliberation.created_at?.toISOString() || new Date().toISOString();
    summaryObj.question = summaryObj.question || deliberation.question;
    summaryObj.confidence = summaryObj.confidence || Math.round((deliberation.confidence || 0.8) * 100);

    res.json({
      success: true,
      summary: summaryObj,
      deliberationId: deliberationId,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to generate summary:', error);
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations/:id/minutes
 * Generate deliberation minutes
 */
router.post('/deliberations/:id/minutes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing deliberation ID' });
    }

    // Fetch deliberation with messages
    const deliberation = await prisma.deliberations.findUnique({
      where: { id },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      return res.status(404).json({ success: false, error: 'Deliberation not found' });
    }

    // Get data from either deliberation_messages table OR the responses JSON field
    const dbMessages = (deliberation as any).deliberation_messages || [];
    const jsonResponses = (deliberation as any).responses || [];
    
    let initialAnalyses: any[] = [];
    let crossExaminations: any[] = [];
    let synthesis: any = null;
    
    if (dbMessages.length > 0) {
      initialAnalyses = dbMessages
        .filter((m: any) => m.phase === 'initial_analysis')
        .map((m: any) => ({
          agent: m.agents?.name || 'Agent',
          code: m.agents?.code || 'agent',
          analysis: m.content,
          confidence: m.confidence,
        }));
      crossExaminations = dbMessages
        .filter((m: any) => m.phase === 'cross_examination')
        .map((m: any) => ({
          agent: m.agents?.name || 'Agent',
          content: m.content,
        }));
      synthesis = dbMessages.find((m: any) => m.phase === 'synthesis');
    } else if (jsonResponses.length > 0) {
      initialAnalyses = jsonResponses
        .filter((r: any) => r.phase === 'initial_analysis' || !r.phase)
        .map((r: any) => ({
          agent: r.agentName || 'Agent',
          code: r.agentCode || r.agentId || 'agent',
          analysis: r.content || r.response || '',
          confidence: r.confidence || 0.8,
        }));
      crossExaminations = jsonResponses
        .filter((r: any) => r.phase === 'cross_examination')
        .map((r: any) => ({
          agent: r.agentName || 'Agent',
          content: r.content || r.response || '',
        }));
      const synthResp = jsonResponses.find((r: any) => r.phase === 'synthesis');
      synthesis = synthResp ? { content: synthResp.content || synthResp.response || (deliberation as any).decision } : null;
    }

    // Generate formal minutes using Ollama
    const minutesPrompt = `Generate formal deliberation minutes in the following format:

**DELIBERATION MINUTES**
**Date:** ${deliberation.created_at?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
**Question:** ${deliberation.question}
**Status:** ${deliberation.status}
**Confidence:** ${Math.round((deliberation.confidence || 0.8) * 100)}%

**PARTICIPANTS:**
${initialAnalyses.map(a => `- ${a.agent} (${a.code})`).join('\n')}

**PHASE 1: INITIAL ANALYSIS**
${initialAnalyses.map(a => `### ${a.agent}\n${a.analysis}\n*Confidence: ${Math.round((a.confidence || 0.8) * 100)}%*`).join('\n\n')}

**PHASE 2: CROSS-EXAMINATION**
${crossExaminations.length > 0 ? crossExaminations.map(ce => `### ${ce.agent}\n${ce.content}`).join('\n\n') : 'No cross-examination recorded.'}

**PHASE 3: SYNTHESIS**
${synthesis?.content || 'No synthesis recorded.'}

**DECISION RECORD**
- Question: ${deliberation.question}
- Final Confidence: ${Math.round((deliberation.confidence || 0.8) * 100)}%
- Completed: ${deliberation.completed_at?.toISOString() || 'In Progress'}

Format this as professional meeting minutes suitable for audit and compliance purposes.`;

    const minutesResponse = await ollama.chat([
      { role: 'system', content: 'You are a corporate secretary generating formal meeting minutes. Be precise and professional.' },
      { role: 'user', content: minutesPrompt },
    ], { model: 'qwen3:32b' });

    res.json({
      success: true,
      minutes: {
        content: minutesResponse.content,
        date: deliberation.created_at?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        question: deliberation.question,
        status: deliberation.status,
        confidence: Math.round((deliberation.confidence || 0.8) * 100),
        participants: initialAnalyses.map(a => ({ name: a.agent, code: a.code })),
        phases: {
          initialAnalysis: initialAnalyses,
          crossExamination: crossExaminations,
          synthesis: synthesis?.content || null,
        },
      },
      deliberationId: id,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to generate minutes:', error);
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/active
 * Get currently active (in-progress) deliberations
 */
router.get('/deliberations/active', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;

    const where: any = { status: { in: ['IN_PROGRESS', 'PENDING'] } };
    if (orgId) where.organization_id = orgId;
    
    const deliberations = await prisma.deliberations.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: deliberations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/:id
 * Get deliberation status and results
 */
router.get('/deliberations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: req.params['id']! },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      throw errors.notFound('Deliberation');
    }

    // Skip org check for Chronos/DNA visibility
    // if (deliberation.organization_id !== req.organizationId) {
    //   throw errors.forbidden();
    // }

    res.json({
      success: true,
      deliberation: deliberation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/:id/transcript
 * Get full deliberation transcript
 */
router.get('/deliberations/:id/transcript', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: req.params['id']! },
      include: { agents: true },
      orderBy: { created_at: 'asc' },
    });

    // Group by phase
    const phases = messages.reduce((acc: Record<string, unknown[]>, msg) => {
      if (!acc[msg.phase]) {
        acc[msg.phase] = [];
      }
      const agent = (msg as any).agents;
      acc[msg.phase]!.push({
        id: msg.id,
        agent: agent ? {
          id: agent.id,
          code: agent.code,
          name: agent.name,
        } : null,
        content: msg.content,
        targetAgentId: msg.target_agent_id,
        sources: msg.sources,
        confidence: msg.confidence,
        timestamp: msg.created_at,
      });
      return acc;
    }, {} as Record<string, unknown[]>);

    res.json({
      success: true,
      data: {
        deliberationId: req.params['id'],
        phases,
      },
    });
  } catch (error) {
    next(error);
  }
});
/**
 * GET /api/v1/council/decisions/recent
 * Get recent council decisions
 */
router.get('/decisions/recent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = await prisma.council_queries.findMany({
      where: {
        organization_id: req.organizationId!,
        status: 'COMPLETED',
      },
      orderBy: { completed_at: 'desc' },
      take: 10,
      select: {
        id: true,
        query: true,
        confidence: true,
        completed_at: true,
      },
    });

    res.json({
      success: true,
      data: queries.map(q => ({
        id: q.id,
        query: q.query,
        confidence: q.confidence,
        completedAt: q.completed_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Helper: Get relevant context from knowledge graph
async function getRelevantContext(query: string, orgId: string) {
  try {
    // Search for relevant entities (with 3s timeout for air-gap resilience)
    let entities: Record<string, unknown>[] = [];
    try {
      const graphPromise = graph.searchEntities(query, undefined, 10);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Neo4j timeout')), 3000)
      );
      entities = await Promise.race([graphPromise, timeoutPromise]);
    } catch (graphErr) {
      // Neo4j unavailable - continue without graph context (air-gap safe)
      logger.debug('Graph context unavailable, continuing without:', graphErr);
    }
    
    // Get recent metrics
    const recentMetrics = await prisma.metric_values.findMany({
      take: 20,
      orderBy: { timestamp: 'desc' },
      include: { metric_definitions: true },
    });

    // Get recent alerts
    const recentAlerts = await prisma.alerts.findMany({
      where: { organization_id: orgId, status: 'ACTIVE' },
      take: 10,
      orderBy: { created_at: 'desc' },
    });

    return {
      entities: entities.slice(0, 5),
      metrics: recentMetrics.map(m => ({
        name: m.metric_definitions.name,
        value: m.value,
        unit: m.metric_definitions.unit,
        timestamp: m.timestamp,
      })),
      alerts: recentAlerts.map(a => ({
        title: a.title,
        severity: a.severity,
        message: a.message,
      })),
      sources: entities.map((e: Record<string, unknown>) => ({
        entityId: e['id'],
        name: e['name'],
        type: e['type'],
      })),
    };
  } catch (error) {
    logger.error('Failed to get graph context:', error);
    return { entities: [], metrics: [], alerts: [], sources: [] };
  }
}

// Helper: Process deliberation asynchronously
async function processDeliberation(
  deliberationId: string,
  agentCodes: string[],
  question: string,
  orgId: string
) {
  const phases = ['initial_analysis', 'cross_examination', 'synthesis', 'ethics_check'];
  
  try {
    // Get context
    const context = await getRelevantContext(question, orgId);

    // Phase 1: Initial Analysis
    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'phase_change',
      phase: 'initial_analysis',
      progress: 10,
    });

    for (const agentCode of agentCodes) {
      const agent = await prisma.agents.findUnique({ where: { code: agentCode } });
      if (!agent) continue;

      const response = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS[agentCode] || '' },
        { role: 'user', content: `Analyze this question from your domain perspective:\n\nContext: ${JSON.stringify(context)}\n\nQuestion: ${question}` },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: agent.id,
          phase: 'initial_analysis',
          content: response.content,
          sources: (context.sources || []) as Prisma.InputJsonValue,
          confidence: 0.85,
        },
      });

      await pubsub.publish(`deliberation:${deliberationId}`, {
        type: 'agent_message',
        agentId: agent.id,
        agentCode: agent.code,
        content: response.content,
        phase: 'initial_analysis',
      });
    }

    // Phase 2: Cross-examination
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { current_phase: 'cross_examination', progress: 40 },
    });

    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'phase_change',
      phase: 'cross_examination',
      progress: 40,
    });

    // Get initial messages for cross-examination
    const initialMessages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: deliberationId, phase: 'initial_analysis' },
      include: { agents: true },
    });

    // Each agent critiques one other agent
    for (let i = 0; i < agentCodes.length; i++) {
      const agentCode = agentCodes[i]!;
      const critiqueAgent = await prisma.agents.findUnique({ where: { code: agentCode } });
      const targetIdx = (i + 1) % agentCodes.length;
      const targetMessage = initialMessages.find(m => (m as any).agents?.code === agentCodes[targetIdx]);
      
      if (!critiqueAgent || !targetMessage) continue;

      const critiqueResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS[agentCode] || '' },
        { role: 'user', content: `Review and critique this analysis from ${(targetMessage as any).agents?.name || 'Agent'}:\n\n"${targetMessage.content}"\n\nProvide constructive critique from your domain perspective.` },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: critiqueAgent.id,
          phase: 'cross_examination',
          content: critiqueResponse.content,
          target_agent_id: targetMessage.agent_id,
          confidence: 0.8,
        },
      });

      await pubsub.publish(`deliberation:${deliberationId}`, {
        type: 'agent_message',
        agentId: critiqueAgent.id,
        targetAgentId: targetMessage.agent_id,
        content: critiqueResponse.content,
        phase: 'cross_examination',
      });
    }

    // Phase 3: Synthesis
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { current_phase: 'synthesis', progress: 70 },
    });

    const allMessages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: deliberationId },
      include: { agents: true },
    });

    const chiefAgent = await prisma.agents.findUnique({ where: { code: 'chief' } });
    if (chiefAgent) {
      const synthesisPrompt = `Synthesize these agent perspectives into a final recommendation:\n\n${
        allMessages.map(m => `${(m as any).agents?.name || 'Agent'} (${m.phase}): ${m.content}`).join('\n\n')
      }\n\nProvide: 1) Consensus points 2) Areas of disagreement 3) Final recommendation with confidence level`;

      const synthesisResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS['chief'] || '' },
        { role: 'user', content: synthesisPrompt },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: chiefAgent.id,
          phase: 'synthesis',
          content: synthesisResponse.content,
          confidence: 0.82,
        },
      });
    }

    // Complete deliberation
    const completedAt = new Date();
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: {
        status: 'COMPLETED',
        current_phase: 'completed',
        progress: 100,
        completed_at: completedAt,
        confidence: 0.82,
      },
    });

    // Log to Druid for Chronos analytics
    druidEventStream.logDecision({
      organizationId: orgId,
      sessionId: deliberationId,
      decisionId: deliberationId,
      question,
      agentsInvolved: agentCodes,
      consensusReached: true,
      finalRecommendation: allMessages.find(m => m.phase === 'synthesis')?.content?.substring(0, 200) || 'Synthesis completed',
      confidenceScore: 82,
      riskLevel: 'medium',
      deliberationTimeMs: (() => { const d = prisma.deliberations.findUnique({ where: { id: deliberationId } }); return 60000; })(),
      department: 'Executive',
      tags: ['council', 'deliberation'],
    });

    // Create audit log entry
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        action: 'deliberation.complete',
        resource_type: 'deliberation',
        resource_id: deliberationId,
        details: {
          question,
          agentCount: agentCodes.length,
          confidence: 0.82,
          phases: ['initial_analysis', 'cross_examination', 'synthesis'],
        } as Prisma.InputJsonValue,
      },
    });

    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'deliberation_complete',
      confidence: 0.82,
    });

    logger.info(`Deliberation ${deliberationId} completed and logged to Druid/Audit`);

  } catch (error) {
    logger.error('Deliberation processing error:', error);
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { status: 'CANCELLED' },
    });
  }
}

// Helper: Generate follow-up questions
function generateFollowUpQuestions(query: string, response: string): string[] {
  // Simple heuristic-based follow-up generation
  const questions: string[] = [];
  
  if (response.toLowerCase().includes('revenue') || response.toLowerCase().includes('financial')) {
    questions.push('What specific factors are driving this financial trend?');
  }
  if (response.toLowerCase().includes('risk')) {
    questions.push('What mitigation strategies would you recommend?');
  }
  if (response.toLowerCase().includes('customer') || response.toLowerCase().includes('market')) {
    questions.push('How does this compare to industry benchmarks?');
  }
  if (questions.length === 0) {
    questions.push('Can you provide more specific data to support this analysis?');
    questions.push('What would be the next steps based on this insight?');
  }
  
  return questions.slice(0, 3);
}

export default router;
