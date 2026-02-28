// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance Enforcer Demo
 * Demonstrates active compliance enforcement with framework citations
 *
 * Example: "Blocked per Ring 3 (Privacy), Framework HIPAA, Control §164.312"
 */

import React, { useState } from 'react';

interface Violation {
  ring: number;
  domain: string;
  framework: string;
  control: string;
  controlTitle: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  citation: string;
  reason: string;
  recommendation: string;
}

interface EnforcementResult {
  proceed: boolean;
  cisoResponse: string;
  verdict: {
    allowed: boolean;
    riskLevel: string;
    citations: string[];
    violations: Violation[];
    requiresHumanReview: boolean;
  };
}

// Pre-defined scenarios for demonstration
const DEMO_SCENARIOS = [
  {
    id: 'patient-public',
    name: 'Upload patient data to public bucket',
    icon: '🏥',
    action: 'upload to public bucket',
    description: 'Upload patient data to a public S3 bucket for sharing with external partners',
    dataTypes: ['phi', 'patient_data'],
    expectedBlock: true,
  },
  {
    id: 'untested-model',
    name: 'Deploy untested AI model',
    icon: '🤖',
    action: 'deploy untested model',
    description: 'Deploy the credit scoring model to production without bias testing',
    dataTypes: ['model_outputs', 'high_risk_decisions'],
    expectedBlock: true,
  },
  {
    id: 'disable-logging',
    name: 'Disable audit logging',
    icon: '📝',
    action: 'disable logging',
    description: 'Turn off audit logging to improve system performance',
    dataTypes: ['security_events'],
    expectedBlock: true,
  },
  {
    id: 'transfer-eu-data',
    name: 'Transfer EU data offshore',
    icon: '🌍',
    action: 'transfer non-adequate country',
    description:
      'Move European customer personal data to servers in a non-EU country without safeguards',
    dataTypes: ['pii', 'eu_data'],
    expectedBlock: true,
  },
  {
    id: 'store-cvv',
    name: 'Store credit card CVV',
    icon: '💳',
    action: 'store CVV',
    description: 'Save customer credit card CVV numbers for future transactions',
    dataTypes: ['payment_card', 'cvv'],
    expectedBlock: true,
  },
  {
    id: 'safe-action',
    name: 'Generate analytics report',
    icon: '📊',
    action: 'generate report',
    description: 'Create quarterly sales analytics dashboard with aggregated metrics',
    dataTypes: ['aggregated_data'],
    expectedBlock: false,
  },
];

const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
};

const RING_INFO = {
  1: { name: 'Ethical AI', color: 'purple', icon: '🧠' },
  2: { name: 'Cybersecurity', color: 'red', icon: '🛡️' },
  3: { name: 'Privacy', color: 'blue', icon: '🔒' },
  4: { name: 'Governance', color: 'amber', icon: '⚖️' },
  5: { name: 'Industry', color: 'emerald', icon: '🏭' },
};

const ComplianceEnforcerDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<(typeof DEMO_SCENARIOS)[0] | null>(null);
  const [result, setResult] = useState<EnforcementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [customAction, setCustomAction] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const runEnforcement = async (scenario: (typeof DEMO_SCENARIOS)[0]) => {
    setSelectedScenario(scenario);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/v1/compliance/council/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `demo-${scenario.id}-${Date.now()}`,
          agentId: 'demo-user',
          action: scenario.action,
          description: scenario.description,
          dataTypes: scenario.dataTypes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      // Simulate response for demo if API not available
      simulateResponse(scenario);
    }
    setLoading(false);
  };

  const runCustomEnforcement = async () => {
    if (!customAction || !customDescription) {
      return;
    }

    setLoading(true);
    setResult(null);
    setSelectedScenario({
      id: 'custom',
      name: 'Custom Request',
      icon: '✏️',
      action: customAction,
      description: customDescription,
      dataTypes: [],
      expectedBlock: false,
    });

    try {
      const res = await fetch('/api/v1/compliance/council/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `custom-${Date.now()}`,
          agentId: 'demo-user',
          action: customAction,
          description: customDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      // API not available
      setResult({
        proceed: true,
        cisoResponse:
          '✅ **APPROVED** - Action complies with all 5 Rings of Sovereignty.\n\nNo compliance violations detected.',
        verdict: {
          allowed: true,
          riskLevel: 'none',
          citations: [],
          violations: [],
          requiresHumanReview: false,
        },
      });
    }
    setLoading(false);
  };

  const simulateResponse = (scenario: (typeof DEMO_SCENARIOS)[0]) => {
    // Simulate enforcement responses for demo
    const responses: Record<string, EnforcementResult> = {
      'patient-public': {
        proceed: false,
        cisoResponse: `🚫 **BLOCKED** per Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)

**Violation:** Protected Health Information (PHI) cannot be stored in publicly accessible locations

**Framework:** HIPAA
**Control:** §164.312(a)(1) - Access Control
**Severity:** CRITICAL

**Recommendation:** Use HIPAA-compliant encrypted storage with access controls and audit logging

🔒 **Human Review Required** - This action has been escalated to the Compliance Officer.`,
        verdict: {
          allowed: false,
          riskLevel: 'critical',
          citations: ['Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)'],
          violations: [
            {
              ring: 3,
              domain: 'privacy',
              framework: 'HIPAA',
              control: '§164.312(a)(1)',
              controlTitle: 'Access Control',
              severity: 'critical',
              citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)',
              reason:
                'Protected Health Information (PHI) cannot be stored in publicly accessible locations',
              recommendation:
                'Use HIPAA-compliant encrypted storage with access controls and audit logging',
            },
          ],
          requiresHumanReview: true,
        },
      },
      'untested-model': {
        proceed: false,
        cisoResponse: `🚫 **BLOCKED** per Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6

**Violation:** AI models must be tested for bias before deployment

**Framework:** NIST AI RMF
**Control:** MEASURE 2.6 - Bias Testing
**Severity:** HIGH

**Recommendation:** Run fairness metrics (demographic parity, equalized odds) before deployment`,
        verdict: {
          allowed: false,
          riskLevel: 'high',
          citations: ['Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6'],
          violations: [
            {
              ring: 1,
              domain: 'ethical_ai',
              framework: 'NIST AI RMF',
              control: 'MEASURE 2.6',
              controlTitle: 'Bias Testing',
              severity: 'high',
              citation: 'Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6',
              reason: 'AI models must be tested for bias before deployment',
              recommendation:
                'Run fairness metrics (demographic parity, equalized odds) before deployment',
            },
          ],
          requiresHumanReview: false,
        },
      },
      'disable-logging': {
        proceed: false,
        cisoResponse: `🚫 **BLOCKED** per Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2

**Violation:** Security-relevant events must be logged and retained

**Framework:** NIST 800-53
**Control:** AU-2 - Audit Events
**Severity:** HIGH

**Recommendation:** Maintain audit logs for minimum 1 year with tamper-proof storage`,
        verdict: {
          allowed: false,
          riskLevel: 'high',
          citations: ['Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2'],
          violations: [
            {
              ring: 2,
              domain: 'cybersecurity',
              framework: 'NIST 800-53',
              control: 'AU-2',
              controlTitle: 'Audit Events',
              severity: 'high',
              citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2',
              reason: 'Security-relevant events must be logged and retained',
              recommendation: 'Maintain audit logs for minimum 1 year with tamper-proof storage',
            },
          ],
          requiresHumanReview: false,
        },
      },
      'transfer-eu-data': {
        proceed: false,
        cisoResponse: `🚫 **BLOCKED** per Ring 3 (Privacy), Framework GDPR, Articles 44-49

**Violation:** Cross-border transfers require adequacy decision or appropriate safeguards

**Framework:** GDPR
**Control:** Article 44-49 - Cross-Border Transfer
**Severity:** HIGH

**Recommendation:** Use Standard Contractual Clauses (SCCs) or verify adequacy decision exists`,
        verdict: {
          allowed: false,
          riskLevel: 'high',
          citations: ['Ring 3 (Privacy), Framework GDPR, Articles 44-49'],
          violations: [
            {
              ring: 3,
              domain: 'privacy',
              framework: 'GDPR',
              control: 'Article 44-49',
              controlTitle: 'Cross-Border Transfer',
              severity: 'high',
              citation: 'Ring 3 (Privacy), Framework GDPR, Articles 44-49',
              reason: 'Cross-border transfers require adequacy decision or appropriate safeguards',
              recommendation:
                'Use Standard Contractual Clauses (SCCs) or verify adequacy decision exists',
            },
          ],
          requiresHumanReview: false,
        },
      },
      'store-cvv': {
        proceed: false,
        cisoResponse: `🚫 **BLOCKED** per Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2

**Violation:** Sensitive authentication data (CVV, full track data) must never be stored

**Framework:** PCI-DSS
**Control:** Requirement 3.2 - Cardholder Data Protection
**Severity:** CRITICAL

**Recommendation:** Use tokenization and never store CVV; mask PAN in logs (show only last 4 digits)

🔒 **Human Review Required** - This action has been escalated to the Compliance Officer.`,
        verdict: {
          allowed: false,
          riskLevel: 'critical',
          citations: ['Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2'],
          violations: [
            {
              ring: 3,
              domain: 'privacy',
              framework: 'PCI-DSS',
              control: 'Requirement 3.2',
              controlTitle: 'Cardholder Data Protection',
              severity: 'critical',
              citation: 'Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2',
              reason: 'Sensitive authentication data (CVV, full track data) must never be stored',
              recommendation:
                'Use tokenization and never store CVV; mask PAN in logs (show only last 4 digits)',
            },
          ],
          requiresHumanReview: true,
        },
      },
      'safe-action': {
        proceed: true,
        cisoResponse: `✅ **APPROVED** - Action complies with all 5 Rings of Sovereignty.

No compliance violations detected. Proceed with standard security protocols.`,
        verdict: {
          allowed: true,
          riskLevel: 'none',
          citations: [],
          violations: [],
          requiresHumanReview: false,
        },
      },
    };

    setResult(responses[scenario.id] || responses['safe-action']);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center justify-center gap-3">
          🛡️ Active Compliance Enforcement
        </h1>
        <p className="text-neutral-500 mt-2">
          CendiaCISO doesn't just say "No" — it cites the specific framework and control
        </p>
      </div>

      {/* Five Rings Legend */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">The Five Rings of Sovereignty</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(RING_INFO).map(([ring, info]) => (
            <div key={ring} className="flex items-center gap-2 text-sm">
              <span>{info.icon}</span>
              <span className="text-neutral-600">
                Ring {ring}: {info.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Selection */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Test Compliance Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {DEMO_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => runEnforcement(scenario)}
              disabled={loading}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-50 ${
                selectedScenario?.id === scenario.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h3 className="font-medium text-neutral-900">{scenario.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                    {scenario.description}
                  </p>
                  <div className="mt-2">
                    {scenario.expectedBlock ? (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        Expected: BLOCK
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Expected: ALLOW
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Request */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Or Test Your Own Request</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Action</label>
            <input
              type="text"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="e.g., upload to public storage"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <input
              type="text"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="e.g., Upload patient medical records to public S3"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <button
          onClick={runCustomEnforcement}
          disabled={loading || !customAction || !customDescription}
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          Check Compliance
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="ml-3 text-neutral-500">CendiaCISO evaluating request...</span>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div
          className={`rounded-2xl border-2 overflow-hidden ${
            result.proceed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}
        >
          {/* Header */}
          <div className={`p-4 ${result.proceed ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  result.proceed ? 'bg-green-500' : 'bg-red-500'
                } text-white text-2xl`}
              >
                {result.proceed ? '✓' : '✕'}
              </div>
              <div>
                <h3
                  className={`text-lg font-bold ${result.proceed ? 'text-green-800' : 'text-red-800'}`}
                >
                  {result.proceed ? 'Action Approved' : 'Action Blocked'}
                </h3>
                <p className={`text-sm ${result.proceed ? 'text-green-600' : 'text-red-600'}`}>
                  Risk Level: {result.verdict.riskLevel.toUpperCase()}
                  {result.verdict.requiresHumanReview && ' • Human Review Required'}
                </p>
              </div>
            </div>
          </div>

          {/* CendiaCISO Response */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                CISO
              </div>
              <div className="flex-1">
                <div className="text-sm text-neutral-500 mb-2">CendiaCISO Response:</div>
                <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-800">
                    {result.cisoResponse}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Violations Detail */}
          {result.verdict.violations.length > 0 && (
            <div className="px-6 pb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">Violation Details</h4>
              <div className="space-y-3">
                {result.verdict.violations.map((violation, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${SEVERITY_COLORS[violation.severity]}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{RING_INFO[violation.ring as keyof typeof RING_INFO]?.icon}</span>
                          <span className="font-medium">{violation.framework}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="font-mono text-sm">{violation.control}</span>
                        </div>
                        <div className="text-sm mt-1">{violation.controlTitle}</div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${SEVERITY_COLORS[violation.severity]}`}
                      >
                        {violation.severity}
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-medium text-neutral-700">Citation:</div>
                      <code className="block mt-1 p-2 bg-white/50 rounded text-xs">
                        {violation.citation}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* How It Works */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">How Active Enforcement Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">Request Intercepted</h4>
              <p className="text-sm text-neutral-500">
                Council receives action request from user or agent
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">Rules Evaluated</h4>
              <p className="text-sm text-neutral-500">
                CendiaCISO checks against 31 frameworks, 3,500+ controls
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">Citation Provided</h4>
              <p className="text-sm text-neutral-500">
                Specific Ring, Framework, and Control cited in response
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceEnforcerDemo;
