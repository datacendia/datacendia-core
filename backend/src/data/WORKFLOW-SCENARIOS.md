# Datacendia Workflow Scenarios Guide

> **Version:** 1.0  
> **Total Workflows:** 250 Enterprise Decision Workflows  
> **Framework:** Datacendia Workflow Ingestion Framework v1.0

This guide explains how to use, understand, and extend the Datacendia Workflow Scenarios system. Each workflow represents a real-world enterprise decision that can be processed through the AI Council for deliberation and action.

---

## Table of Contents

1. [Overview](#overview)
2. [How Workflows Operate](#how-workflows-operate)
3. [Workflow Structure](#workflow-structure)
4. [Council Modes](#council-modes)
5. [Service Registry](#service-registry)
6. [Priority Levels](#priority-levels)
7. [Running the Ingestion Test](#running-the-ingestion-test)
8. [Example Workflows by Category](#example-workflows-by-category)
9. [Creating Custom Workflows](#creating-custom-workflows)
10. [API Endpoints](#api-endpoints)

---

## Overview

The Datacendia Workflow Scenarios system provides **250 pre-built enterprise decision workflows** that demonstrate how the AI Council can be used to make complex business decisions. Each workflow:

- **Defines a business problem** that requires multi-stakeholder input
- **Specifies the services** needed to gather data and analysis
- **Outlines step-by-step actions** to prepare for a Council decision
- **Poses a Council question** that frames the decision to be made
- **Sets expectations** for the outcome and timeline

### Key Benefits

- 🚀 **Rapid Deployment**: Pre-built workflows for common enterprise scenarios
- 🎯 **Best Practices**: Each workflow follows proven decision-making patterns
- 🔄 **Reproducible**: Deterministic execution with full audit trails
- 🛡️ **Compliant**: Built-in governance and compliance checkpoints

---

## How Workflows Operate

### Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW EXECUTION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. TRIGGER                                                      │
│     └─→ User initiates workflow or automated trigger fires       │
│                                                                  │
│  2. DATA GATHERING (Steps 1-4)                                   │
│     └─→ Services collect and analyze relevant data               │
│     └─→ Each step produces an output for the next step           │
│                                                                  │
│  3. COUNCIL DELIBERATION (Final Step)                            │
│     └─→ Council receives the councilQuestion                     │
│     └─→ AI agents debate based on their personas                 │
│     └─→ Consensus or dissent is recorded                         │
│                                                                  │
│  4. DECISION OUTPUT                                              │
│     └─→ Decision is recorded in the Decision Ledger              │
│     └─→ Audit trail is created via CendiaDNA                     │
│     └─→ Actions are triggered based on decision                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Execution

Each workflow contains **5 ordered steps**:

| Step | Purpose | Typical Service |
|------|---------|-----------------|
| 1 | **Identify/Detect** - Find the problem or opportunity | Domain-specific service |
| 2 | **Analyze** - Gather historical context and patterns | CendiaChronos |
| 3 | **Assess** - Evaluate options and risks | Domain-specific service |
| 4 | **Prepare** - Generate recommendations or plans | Domain-specific service |
| 5 | **Decide** - Present to Council for approval | CendiaCouncil |

### Data Flow Between Steps

```json
{
  "steps": [
    {"order": 1, "action": "Identify expiring contracts", "service": "CendiaProcure", "output": "contract_list"},
    {"order": 2, "action": "Analyze spending patterns", "service": "CendiaChronos", "output": "spending_trends"},
    {"order": 3, "action": "Calculate savings opportunities", "service": "CendiaProcure", "output": "savings_analysis"},
    {"order": 4, "action": "Generate negotiation points", "service": "CendiaProcure", "output": "leverage_points"},
    {"order": 5, "action": "Present to council", "service": "CendiaCouncil", "output": "decision"}
  ]
}
```

Each step's `output` becomes available as input context for subsequent steps.

---

## Workflow Structure

Every workflow follows this JSON schema:

```json
{
  "id": "WF-XXX",
  "name": "Human-readable workflow name",
  "category": "Business category",
  "councilMode": "Mode for Council deliberation",
  "services": ["Array", "of", "services", "used"],
  "steps": [
    {
      "order": 1,
      "action": "What this step does",
      "service": "ServiceName",
      "output": "output_variable_name"
    }
  ],
  "councilQuestion": "The specific question posed to the Council",
  "expectedOutcome": "What the workflow should produce",
  "priority": "critical|high|medium|low",
  "estimatedDuration": "Time estimate (e.g., '2 hours', '1 week')",
  "tags": ["searchable", "tags"]
}
```

### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier in format `WF-XXX` |
| `name` | ✅ | Descriptive name for the workflow |
| `category` | ✅ | Business domain (e.g., "Procurement", "Security") |
| `councilMode` | ✅ | How the Council should deliberate |
| `services` | ✅ | List of Datacendia services involved |
| `steps` | ✅ | Ordered array of execution steps |
| `councilQuestion` | ✅ | The decision question for the Council |
| `expectedOutcome` | ✅ | What success looks like |
| `priority` | ✅ | Urgency level |
| `estimatedDuration` | ✅ | Expected time to complete |
| `tags` | ⚠️ | Searchable keywords (recommended) |

---

## Council Modes

The `councilMode` determines how the AI Council deliberates on the decision:

| Mode | Use Case | Deliberation Style |
|------|----------|-------------------|
| **war-room** | High-stakes, time-sensitive decisions | Rapid, focused, executive-level |
| **due-diligence** | M&A, investments, major commitments | Thorough, risk-focused, comprehensive |
| **innovation-lab** | New ideas, experiments, R&D | Creative, exploratory, risk-tolerant |
| **compliance** | Regulatory, legal, audit matters | Conservative, documentation-heavy |
| **crisis** | Emergencies, incidents, urgent issues | Fast, decisive, action-oriented |
| **execution** | Implementation, launch, deployment | Practical, checklist-driven |
| **research** | Analysis, investigation, discovery | Data-driven, hypothesis-testing |
| **investment** | Budget, resource allocation, ROI | Financial, quantitative |
| **stakeholder** | Multi-party, employee, customer issues | Balanced, empathetic |
| **rapid** | Quick decisions, time-boxed | Streamlined, 80/20 rule |
| **advisory** | Strategic guidance, mentorship | Wisdom-focused, long-term |
| **governance** | Board, policy, organizational | Formal, procedural |

### Mode Selection Guide

```
Is it an emergency?
  └─ YES → crisis or rapid
  └─ NO → Continue...

Does it involve money/resources?
  └─ YES → investment or due-diligence
  └─ NO → Continue...

Is it about rules/regulations?
  └─ YES → compliance or governance
  └─ NO → Continue...

Is it about people/relationships?
  └─ YES → stakeholder or advisory
  └─ NO → Continue...

Is it about building/creating?
  └─ YES → execution or innovation-lab
  └─ NO → research (default analytical mode)
```

---

## Service Registry

### Enterprise Services

| Service | Description | Common Use Cases |
|---------|-------------|------------------|
| **CendiaProcure** | Procurement & vendor management | Contracts, negotiations, suppliers |
| **CendiaGuardian** | Customer success & health monitoring | Churn prevention, customer care |
| **CendiaNerve** | IT infrastructure & operations | System health, incidents, capacity |
| **CendiaDocket** | Legal & compliance management | Contracts, litigation, regulations |
| **CendiaEquity** | Investor relations & market intelligence | Earnings, shareholders, valuation |
| **CendiaNetMesh** | Organizational network analysis | Culture, collaboration, influence |
| **CendiaFactory** | Manufacturing & production | OEE, quality, maintenance |
| **CendiaTransit** | Travel & logistics | Executive travel, supply chain |
| **CendiaAcademy** | Learning & skill development | Training, upskilling, competencies |
| **CendiaResonance** | Communications & messaging | PR, internal comms, crisis response |
| **CendiaInventum** | Innovation & IP management | Patents, R&D, ideas |
| **CendiaHabitat** | Workplace & facilities | Space utilization, BioSync |
| **CendiaRegent** | Executive advisory & Shadow Cabinet | Strategic advice, mentorship |
| **CendiaRainmaker** | Sales intelligence & pipeline | Deals, forecasting, revenue |
| **CendiaScout** | Talent acquisition & recruiting | Hiring, candidates, compensation |

### Intelligence Services

| Service | Description | Common Use Cases |
|---------|-------------|------------------|
| **CendiaChronos** | Time-travel analytics & historical patterns | Trends, predictions, what-if |
| **CendiaPanopticon** | Executive dashboards & visualization | KPIs, metrics, reporting |
| **CendiaAegis** | Security & threat intelligence | Threats, vulnerabilities, defense |
| **CendiaEternal** | Knowledge preservation & succession | Institutional memory, expertise |
| **CendiaSymbiont** | Integration health & ecosystem | APIs, connectors, data flows |
| **CendiaVox** | Voice of customer/employee analysis | Feedback, sentiment, themes |
| **CendiaEcho** | Pattern recognition & anomaly detection | Recurring issues, early warnings |
| **CendiaRedTeam** | Adversarial testing & security | Penetration testing, vulnerabilities |
| **CendiaGnosis** | Knowledge extraction & documentation | Tacit knowledge, documentation |

### Sovereign Services

| Service | Description | Common Use Cases |
|---------|-------------|------------------|
| **CendiaDiode** | Data diode & secure ingestion | Air-gapped data transfer |
| **CendiaRLHF** | Local reinforcement learning | Model fine-tuning, feedback |
| **CendiaDNA** | Decision audit trails | Compliance, reproducibility |
| **CendiaShadow** | Shadow Council sandbox | Testing, what-if scenarios |
| **CendiaReplay** | Deterministic decision replay | Audits, verification |
| **CendiaBridge** | Air-gap QR bridge | Secure data transfer |
| **CendiaCanary** | Tripwire & leak detection | Security monitoring |
| **CendiaAttest** | Hardware attestation | TPM, integrity verification |
| **CendiaTimeLock** | Cryptographic time-locks | Embargoes, scheduled releases |
| **CendiaFederated** | Federated learning mesh | Privacy-preserving ML |
| **CendiaPortable** | USB-bootable instances | Field deployment |

### Core Services

| Service | Description | Common Use Cases |
|---------|-------------|------------------|
| **CendiaCascade** | Butterfly effect modeling | Consequence analysis |
| **CendiaApotheosis** | AI self-improvement | Model optimization |
| **CendiaDissent** | Formal dissent handling | Employee voice |
| **CendiaTranslate** | Multi-language translation | International operations |
| **CendiaCouncil** | AI Council deliberation | All final decisions |

---

## Priority Levels

| Priority | Response Time | Use Cases |
|----------|--------------|-----------|
| **critical** | < 4 hours | Security breaches, P1 incidents, crisis communications |
| **high** | < 24 hours | Customer churn, compliance deadlines, executive decisions |
| **medium** | < 1 week | Strategic planning, optimization, research |
| **low** | < 1 month | Long-term initiatives, nice-to-haves |

---

## Running the Ingestion Test

The ingestion test validates all workflow scenarios before they can be used in production.

### Prerequisites

```bash
cd backend
npm install
```

### Run the Test

```bash
npx ts-node src/data/workflow-ingestion-test.ts
```

### Expected Output

```
================================================================================
WORKFLOW SCENARIOS INGESTION TEST REPORT
================================================================================

## Summary
Total Scenarios: 250
Valid Scenarios: 250
Invalid Scenarios: 0
Validation Rate: 100.0%

## Category Distribution
  Security: 25
  Customer Success: 20
  Manufacturing: 18
  ...

## Council Mode Distribution
  crisis: 35
  compliance: 30
  investment: 28
  ...

## Priority Distribution
  high: 85
  critical: 60
  medium: 75
  low: 30

================================================================================
✅ ALL SCENARIOS VALID - READY FOR INGESTION
================================================================================
```

### Validation Rules

The test checks for:

1. **Required fields** - All mandatory fields are present
2. **Valid council modes** - Mode is one of the 12 allowed values
3. **Valid priorities** - Priority is critical/high/medium/low
4. **Sequential steps** - Steps are numbered 1, 2, 3, 4, 5
5. **Known services** - All services are in the registry
6. **Unique IDs** - No duplicate workflow IDs
7. **ID format** - IDs match pattern `WF-XXX`
8. **Council final step** - Last step should involve CendiaCouncil

---

## Example Workflows by Category

### 🛡️ Security

**WF-010: IT Incident Response Activation**
```
Mode: crisis | Priority: critical | Duration: 2 hours

Steps:
1. Detect and classify incident severity (CendiaNerve)
2. Assess security threat indicators (CendiaAegis)
3. Activate Lazarus Protocol if needed (CendiaNerve)
4. Prepare stakeholder communications (CendiaResonance)
5. Council authorization for escalation (CendiaCouncil)

Question: "We have detected a P1 incident affecting our payment processing 
system. Initial analysis suggests potential data exfiltration. Should we 
activate full Lazarus Protocol ($50K) or attempt targeted remediation?"
```

### 💰 Procurement

**WF-001: Quarterly Vendor Contract Renegotiation**
```
Mode: investment | Priority: high | Duration: 2 weeks

Steps:
1. Identify expiring contracts in next 90 days (CendiaProcure)
2. Analyze historical spending patterns (CendiaChronos)
3. Calculate potential savings opportunities (CendiaProcure)
4. Generate negotiation leverage points (CendiaProcure)
5. Present to council for approval (CendiaCouncil)

Question: "We have 12 vendor contracts expiring with $4.2M combined value. 
Analysis shows $380K potential savings. Should we proceed with aggressive 
renegotiation or maintain relationships with moderate asks?"
```

### 👥 Human Resources

**WF-032: Butterfly Effect Analysis for Layoffs**
```
Mode: stakeholder | Priority: critical | Duration: 1 week

Steps:
1. Model second-order effects of workforce reduction (CendiaCascade)
2. Identify critical skill dependencies (CendiaAcademy)
3. Prepare stakeholder communication plan (CendiaResonance)
4. Identify mitigation strategies (CendiaCascade)
5. Council decision on restructuring scope (CendiaCouncil)

Question: "Proposed 15% reduction shows $8M savings but Cascade predicts 
23% productivity drop and 40% increase in remaining employee attrition. 
Should we proceed, reduce scope, or find alternative cost cuts?"
```

### 📊 Strategy

**WF-034: Pivotal Moment Detection and Response**
```
Mode: war-room | Priority: critical | Duration: 48 hours

Steps:
1. Detect pivotal moments in market data (CendiaChronos)
2. Visualize impact across departments (CendiaPanopticon)
3. Gather strategic advisor perspectives (CendiaRegent)
4. Identify response options and timelines (CendiaChronos)
5. Council decision on strategic response (CendiaCouncil)

Question: "Chronos detected a pivotal moment: our largest competitor just 
announced acquisition of a key technology partner. Should we accelerate 
our own M&A, pivot product strategy, or double down on organic development?"
```

---

## Creating Custom Workflows

### Step 1: Choose a Template

Start with an existing workflow that's similar to your use case.

### Step 2: Define Your Workflow

```json
{
  "id": "WF-251",
  "name": "Your Custom Workflow Name",
  "category": "Your Category",
  "councilMode": "appropriate-mode",
  "services": ["Service1", "Service2", "CendiaCouncil"],
  "steps": [
    {"order": 1, "action": "First action", "service": "Service1", "output": "step1_output"},
    {"order": 2, "action": "Second action", "service": "Service2", "output": "step2_output"},
    {"order": 3, "action": "Third action", "service": "Service1", "output": "step3_output"},
    {"order": 4, "action": "Fourth action", "service": "Service2", "output": "step4_output"},
    {"order": 5, "action": "Council decision", "service": "CendiaCouncil", "output": "decision"}
  ],
  "councilQuestion": "Frame your decision question clearly with context and options",
  "expectedOutcome": "What success looks like",
  "priority": "high",
  "estimatedDuration": "1 week",
  "tags": ["relevant", "tags"]
}
```

### Step 3: Validate

Run the ingestion test to ensure your workflow is valid:

```bash
npx ts-node src/data/workflow-ingestion-test.ts
```

### Step 4: Add to Scenario File

Add your workflow to `workflow-scenarios.json` or `workflow-scenarios-part2.json`.

### Best Practices

1. **Clear Council Questions**: Include specific numbers, options, and trade-offs
2. **Logical Step Flow**: Each step should build on the previous
3. **Appropriate Mode**: Match the mode to the decision type
4. **Realistic Duration**: Be honest about time requirements
5. **Useful Tags**: Add tags that help with search and filtering

---

## API Endpoints

### Workflow Ingestion

```
POST /api/v1/workflows/ingest
Content-Type: application/json

{
  "scenarios": [/* array of workflow objects */]
}
```

### Workflow Validation

```
POST /api/v1/workflows/validate
Content-Type: application/json

{
  "scenario": {/* single workflow object */}
}
```

### Workflow Execution

```
POST /api/v1/workflows/execute
Content-Type: application/json

{
  "workflowId": "WF-001",
  "context": {
    "additionalData": "any relevant context"
  }
}
```

### List Workflows

```
GET /api/v1/workflows?category=Security&priority=critical
```

### Get Workflow by ID

```
GET /api/v1/workflows/WF-001
```

---

## File Structure

```
backend/src/data/
├── workflow-scenarios.json       # Workflows WF-001 to WF-125
├── workflow-scenarios-part2.json # Workflows WF-126 to WF-250
├── workflow-ingestion-test.ts    # Validation test framework
└── WORKFLOW-SCENARIOS.md         # This documentation
```

---

## Quick Reference Card

### Starting a Workflow

1. Identify the business problem
2. Find a matching workflow by category or tags
3. Review the Council question and expected outcome
4. Execute via API or UI
5. Review Council decision and take action

### Workflow Lifecycle

```
DRAFT → VALIDATED → QUEUED → EXECUTING → DELIBERATING → DECIDED → ARCHIVED
```

### Common Troubleshooting

| Issue | Solution |
|-------|----------|
| Validation fails | Check required fields and valid values |
| Service not found | Verify service name matches registry |
| Steps out of order | Ensure steps are numbered 1-5 sequentially |
| Duplicate ID | Use unique WF-XXX identifier |

---

## Support

For questions about workflows:
- Check the [Council Modes Cheatsheet](/docs/council/council-modes-cheatsheet.md)
- Review [Architecture Diagrams](/docs/diagrams/)
- Contact the Datacendia team

---

*Last Updated: December 2024*
