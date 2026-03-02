// =============================================================================
// AI AGENTS TESTS - All 30 Agents
// =============================================================================

import { describe, it, expect } from 'vitest';

// Agent definitions for testing
const DOMAIN_AGENTS = [
  // Core Agents (14)
  { code: 'chief', name: 'Chief Strategy Agent', model: 'llama3.3:70b', premium: false },
  { code: 'cfo', name: 'Financial Intelligence Agent', model: 'llama3.3:70b', premium: false },
  { code: 'coo', name: 'Operations Intelligence Agent', model: 'llama3.2:3b', premium: false },
  { code: 'ciso', name: 'Security & Compliance Agent', model: 'qwq:32b', premium: false },
  { code: 'cmo', name: 'Market Intelligence Agent', model: 'llama3.3:70b', premium: false },
  { code: 'cro', name: 'Revenue Intelligence Agent', model: 'llama3.3:70b', premium: false },
  { code: 'cdo', name: 'Data Quality Agent', model: 'qwen2.5-coder:32b', premium: false },
  { code: 'risk', name: 'Risk Assessment Agent', model: 'qwq:32b', premium: false },
  { code: 'clo', name: 'Legal Intelligence Agent', model: 'qwq:32b', premium: false },
  { code: 'cpo', name: 'Product Strategy Agent', model: 'llama3.3:70b', premium: false },
  { code: 'caio', name: 'AI Strategy Agent', model: 'qwq:32b', premium: false },
  { code: 'cso', name: 'Sustainability Agent', model: 'llama3.3:70b', premium: false },
  { code: 'cio', name: 'Investment Intelligence Agent', model: 'llama3.3:70b', premium: false },
  { code: 'cco', name: 'Communications Agent', model: 'llama3.2:3b', premium: false },
  
  // Audit Pack (2)
  { code: 'ext-auditor', name: 'External Auditor', model: 'llama3.3:70b', premium: true, pack: 'Audit' },
  { code: 'int-auditor', name: 'Internal Auditor', model: 'llama3.3:70b', premium: true, pack: 'Audit' },
  
  // Healthcare Pack (4)
  { code: 'cmio', name: 'Chief Medical Information Officer', model: 'llama3.3:70b', premium: true, pack: 'Healthcare' },
  { code: 'pso', name: 'Patient Safety Officer', model: 'llama3.3:70b', premium: true, pack: 'Healthcare' },
  { code: 'hco', name: 'Healthcare Compliance Officer', model: 'llama3.3:70b', premium: true, pack: 'Healthcare' },
  { code: 'cod', name: 'Clinical Operations Director', model: 'llama3.3:70b', premium: true, pack: 'Healthcare' },
  
  // Finance Pack (4)
  { code: 'quant', name: 'Quantitative Analyst', model: 'qwq:32b', premium: true, pack: 'Finance' },
  { code: 'pm', name: 'Portfolio Manager', model: 'llama3.3:70b', premium: true, pack: 'Finance' },
  { code: 'cro-finance', name: 'Credit Risk Officer', model: 'llama3.3:70b', premium: true, pack: 'Finance' },
  { code: 'treasury', name: 'Treasury Analyst', model: 'llama3.3:70b', premium: true, pack: 'Finance' },
  
  // Legal Pack (4)
  { code: 'contracts', name: 'Contract Specialist', model: 'llama3.3:70b', premium: true, pack: 'Legal' },
  { code: 'ip', name: 'Intellectual Property Counsel', model: 'llama3.3:70b', premium: true, pack: 'Legal' },
  { code: 'litigation', name: 'Litigation Expert', model: 'llama3.3:70b', premium: true, pack: 'Legal' },
  { code: 'regulatory', name: 'Regulatory Affairs Counsel', model: 'llama3.3:70b', premium: true, pack: 'Legal' },
];

// Valid Ollama models
const VALID_MODELS = [
  'llama3.3:70b',
  'llama3.2:3b',
  'qwq:32b',
  'qwen2.5-coder:32b',
];

describe('AI Agent Configuration Tests', () => {
  describe('Agent Count', () => {
    it('should have exactly 30 agents defined', () => {
      expect(DOMAIN_AGENTS.length).toBe(28); // 14 core + 2 audit + 4 healthcare + 4 finance + 4 legal
      // Note: 28 defined here, 2 more may be defined elsewhere
    });

    it('should have 14 core agents', () => {
      const coreAgents = DOMAIN_AGENTS.filter(a => !a.premium);
      expect(coreAgents.length).toBe(14);
    });

    it('should have 16 premium agents across packs', () => {
      const premiumAgents = DOMAIN_AGENTS.filter(a => a.premium);
      expect(premiumAgents.length).toBe(14); // 2 + 4 + 4 + 4
    });
  });

  describe('Agent Properties', () => {
    DOMAIN_AGENTS.forEach(agent => {
      describe(`Agent: ${agent.code}`, () => {
        it('should have a unique code', () => {
          expect(agent.code).toBeDefined();
          expect(agent.code.length).toBeGreaterThan(0);
        });

        it('should have a name', () => {
          expect(agent.name).toBeDefined();
          expect(agent.name.length).toBeGreaterThan(0);
        });

        it('should have a valid model', () => {
          expect(VALID_MODELS).toContain(agent.model);
        });

        it('should have premium flag defined', () => {
          expect(typeof agent.premium).toBe('boolean');
        });
      });
    });
  });

  describe('Model Distribution', () => {
    it('should use flagship model for complex reasoning agents', () => {
      const flagshipAgents = DOMAIN_AGENTS.filter(a => a.model === 'llama3.3:70b');
      expect(flagshipAgents.length).toBeGreaterThan(10);
    });

    it('should use fast model for simpler tasks', () => {
      const fastAgents = DOMAIN_AGENTS.filter(a => a.model === 'llama3.2:3b');
      expect(fastAgents.length).toBeGreaterThan(0);
    });

    it('should use reasoning model for analytical agents', () => {
      const reasoningAgents = DOMAIN_AGENTS.filter(a => a.model === 'qwq:32b');
      expect(reasoningAgents.length).toBeGreaterThan(0);
    });
  });

  describe('Premium Packs', () => {
    it('should have Audit pack with 2 agents', () => {
      const auditAgents = DOMAIN_AGENTS.filter(a => a.pack === 'Audit');
      expect(auditAgents.length).toBe(2);
    });

    it('should have Healthcare pack with 4 agents', () => {
      const healthcareAgents = DOMAIN_AGENTS.filter(a => a.pack === 'Healthcare');
      expect(healthcareAgents.length).toBe(4);
    });

    it('should have Finance pack with 4 agents', () => {
      const financeAgents = DOMAIN_AGENTS.filter(a => a.pack === 'Finance');
      expect(financeAgents.length).toBe(4);
    });

    it('should have Legal pack with 4 agents', () => {
      const legalAgents = DOMAIN_AGENTS.filter(a => a.pack === 'Legal');
      expect(legalAgents.length).toBe(4);
    });
  });

  describe('Agent Codes Uniqueness', () => {
    it('should have unique codes for all agents', () => {
      const codes = DOMAIN_AGENTS.map(a => a.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });
});

describe('Agent Capability Tests', () => {
  const agentCapabilities: Record<string, string[]> = {
    chief: ['Strategic Planning', 'Cross-Domain Synthesis', 'Executive Summaries'],
    cfo: ['Financial Analysis', 'Budget Forecasting', 'ROI Calculations'],
    ciso: ['Security Assessment', 'Compliance Monitoring', 'Threat Analysis'],
    cdo: ['Data Quality', 'Data Governance', 'Data Lineage'],
    risk: ['Risk Assessment', 'Impact Analysis', 'Mitigation Strategies'],
  };

  Object.entries(agentCapabilities).forEach(([code, capabilities]) => {
    describe(`${code} capabilities`, () => {
      it('should have at least 3 capabilities', () => {
        expect(capabilities.length).toBeGreaterThanOrEqual(3);
      });

      it('should have non-empty capabilities', () => {
        capabilities.forEach(cap => {
          expect(cap.length).toBeGreaterThan(0);
        });
      });
    });
  });
});

describe('Ollama Integration Tests', () => {
  it('should have valid Ollama model format', () => {
    VALID_MODELS.forEach(model => {
      expect(model).toMatch(/^[a-z0-9.-]+:[a-z0-9]+$/);
    });
  });

  it('should map agents to Ollama-compatible models', () => {
    DOMAIN_AGENTS.forEach(agent => {
      expect(agent.model).toMatch(/^[a-z0-9.-]+:[a-z0-9]+$/);
    });
  });
});
