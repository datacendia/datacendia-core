/**
 * Config — Service Info Definitions
 *
 * Centralized definitions for all Datacendia service pages.
 * Used by the ServiceInfoDropdown component on each service page.
 *
 * @module config/serviceInfo
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import type { ServiceInfoConfig } from '../components/ui/ServiceInfoDropdown';

// =============================================================================
// FOUNDATION TIER
// =============================================================================

export const councilInfo: ServiceInfoConfig = {
  whatItIs: 'The Council is Datacendia\'s multi-agent deliberation engine — a panel of specialized AI advisors that debate your question from competing perspectives before reaching a collective decision.',
  whatItDoes: [
    'Assembles domain-specific AI agents (CFO, Legal Counsel, Risk Analyzer, etc.) tailored to your question',
    'Runs adversarial multi-round deliberation with formal dissent mechanisms',
    'Produces a cryptographically sealed Regulator\'s Receipt for every decision',
    'Supports multiple council modes: Standard, Adversarial, Crisis, and Custom',
  ],
  howToUse: [
    { step: 'Ask a question', detail: 'Type your business question into the query bar. Be specific — include context, constraints, and stakes.' },
    { step: 'Select council mode', detail: 'Choose Standard for balanced deliberation, Adversarial for stress-testing, or Crisis for time-sensitive decisions.' },
    { step: 'Review agent responses', detail: 'Watch agents deliberate in real-time. Each agent provides analysis, citations, and a confidence score.' },
    { step: 'Check for dissents', detail: 'Review any formal dissents — these highlight risks the majority may overlook.' },
    { step: 'Accept or override', detail: 'Approve the council\'s recommendation, override with your own decision, or send back for further deliberation.' },
  ],
};

export const replayInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaReplay™ is a forensic decision playback engine that lets you watch past council deliberations unfold frame-by-frame, like watching a movie of your organization\'s decision-making process.',
  whatItDoes: [
    'Replays complete deliberation sessions with full agent dialogue and reasoning',
    'Provides variable-speed playback (0.5x to 2x) with timeline scrubbing',
    'Highlights key moments: dissents, consensus points, citations, and vote changes',
    'Exports replay sessions for audit, training, or regulatory review',
  ],
  howToUse: [
    { step: 'Select a deliberation', detail: 'Browse recent deliberations from the session list. Filter by outcome, date, or consensus status.' },
    { step: 'Watch the replay', detail: 'Press play to watch agents deliberate in sequence. Each frame shows one agent\'s contribution.' },
    { step: 'Use the timeline', detail: 'Click any event in the timeline sidebar to jump directly to that moment.' },
    { step: 'Adjust playback speed', detail: 'Use the speed controls (0.5x–2x) to slow down critical moments or fast-forward routine sections.' },
    { step: 'Export for review', detail: 'Download the replay as an audit package for compliance review or team training.' },
  ],
};

export const chronosInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaChronos™ is an enterprise decision time machine — explore your organization\'s complete decision history along an interactive timeline with pivotal moment detection and what-if branching.',
  whatItDoes: [
    'Visualizes your entire decision history on an interactive chronological timeline',
    'Detects pivotal moments — decisions that had outsized impact on outcomes',
    'Enables diff-view comparison between any two points in time',
    'Supports multi-branch timeline comparison for what-if scenario analysis',
    'Generates cryptographically sealed audit packages for any time range',
  ],
  howToUse: [
    { step: 'Navigate the timeline', detail: 'Scroll horizontally through your decision history. Zoom in/out to focus on specific periods.' },
    { step: 'Explore pivotal moments', detail: 'Yellow markers indicate AI-detected pivotal decisions. Click to see impact analysis.' },
    { step: 'Compare timelines', detail: 'Select two or more dates to see a side-by-side diff of decisions, outcomes, and metrics.' },
    { step: 'Run what-if scenarios', detail: 'Branch from any historical decision to simulate alternate outcomes.' },
    { step: 'Export audit packages', detail: 'Select a date range and export a tamper-proof audit package with cryptographic signatures.' },
  ],
};

export const dciiInfo: ServiceInfoConfig = {
  whatItIs: 'DCII (Decision Crisis Immunization Infrastructure) is a cryptographic integrity layer that provides an IISS (Institutional Integrity & Sovereignty Score) for your organization\'s decision-making health.',
  whatItDoes: [
    'Calculates your organization\'s IISS score across 6 dimensions of decision integrity',
    'Monitors decision patterns for anomalies, bias drift, and governance gaps',
    'Provides early warning for institutional decision-making degradation',
    'Generates compliance-ready integrity reports for regulators',
  ],
  howToUse: [
    { step: 'Review your IISS score', detail: 'Your overall integrity score is displayed prominently — aim for 80+ across all dimensions.' },
    { step: 'Drill into dimensions', detail: 'Click each dimension (Truth, Memory, Witness, etc.) to see detailed scoring breakdowns.' },
    { step: 'Address flagged issues', detail: 'Red and amber items require attention. Click through for remediation recommendations.' },
    { step: 'Track trends', detail: 'Monitor your score over time to ensure decision integrity is improving, not degrading.' },
  ],
};

export const gatewayInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaGateway™ is an AI governance gateway that acts as the control plane for all AI interactions within your organization — enforcing policies, logging decisions, and ensuring compliance before any AI action executes.',
  whatItDoes: [
    'Intercepts and evaluates every AI request against your governance policies',
    'Enforces role-based access controls and content safety filters',
    'Logs all AI interactions into the immutable audit ledger',
    'Provides real-time policy violation alerts and automated remediation',
  ],
  howToUse: [
    { step: 'Configure policies', detail: 'Define your AI governance rules — content restrictions, approval thresholds, and escalation triggers.' },
    { step: 'Connect AI services', detail: 'Route your AI endpoints through the gateway. Supports OpenAI, Anthropic, and custom models.' },
    { step: 'Monitor traffic', detail: 'Watch real-time AI request flows, policy evaluations, and compliance status on the dashboard.' },
    { step: 'Review violations', detail: 'Investigate policy violations with full context — request, evaluation, and remediation steps.' },
  ],
};

// =============================================================================
// ENTERPRISE TIER
// =============================================================================

export const gapScannerInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaGapScan™ is a compliance gap analysis engine that scans your AI governance posture against 8 major regulatory frameworks and identifies specific gaps with remediation guidance.',
  whatItDoes: [
    'Scans against EU AI Act, NIST AI RMF, ISO 42001, SOX, GDPR, HIPAA, SR 11-7, and more',
    'Identifies specific compliance gaps with severity ratings (Critical, High, Medium, Low)',
    'Provides actionable remediation steps for each identified gap',
    'Generates framework-specific compliance reports for auditors and regulators',
  ],
  howToUse: [
    { step: 'Run a scan', detail: 'Click "Run Scan" to analyze your current governance posture against all supported frameworks.' },
    { step: 'Filter results', detail: 'Use framework and severity filters to focus on the most critical gaps first.' },
    { step: 'Review findings', detail: 'Click each finding to see detailed analysis, affected areas, and evidence.' },
    { step: 'Apply remediations', detail: 'Follow the step-by-step remediation guidance for each gap. Track progress in the dashboard.' },
    { step: 'Export reports', detail: 'Generate PDF or JSON compliance reports for auditors or regulatory submissions.' },
  ],
};

export const escrowInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaEscrow™ is a cryptographic decision escrow system that seals sensitive decisions using AES-256-GCM encryption with Shamir Secret Sharing and Verifiable Delay Function (VDF) time-locks.',
  whatItDoes: [
    'Seals decisions with AES-256-GCM encryption — no single person can access the content',
    'Distributes decryption keys using Shamir Secret Sharing (k-of-n threshold scheme)',
    'Enforces time-locks via VDF — decisions cannot be revealed before the specified date',
    'Provides a full audit trail of seal creation, share distribution, and unsealing events',
  ],
  howToUse: [
    { step: 'Create a sealed decision', detail: 'Select a deliberation outcome and configure encryption parameters (threshold, shareholders, time-lock).' },
    { step: 'Distribute shares', detail: 'Assign key shares to designated shareholders. Each receives a unique Shamir share.' },
    { step: 'Wait for time-lock', detail: 'The VDF time-lock ensures the decision remains sealed until the configured release date.' },
    { step: 'Submit shares to unseal', detail: 'When ready, k-of-n shareholders submit their shares to reconstruct the decryption key.' },
    { step: 'Verify integrity', detail: 'The system verifies the unsealed decision matches the original cryptographic commitment.' },
  ],
};

export const complianceMonitorInfo: ServiceInfoConfig = {
  whatItIs: 'Continuous Compliance Monitor tracks your organization\'s regulatory compliance posture in real-time, alerting you to drift, violations, and emerging risks across all applicable frameworks.',
  whatItDoes: [
    'Monitors compliance status across multiple regulatory frameworks simultaneously',
    'Detects compliance drift and alerts before violations occur',
    'Tracks remediation progress and generates trend reports',
    'Integrates with your audit calendar for proactive compliance management',
  ],
  howToUse: [
    { step: 'Review the dashboard', detail: 'The main view shows your compliance posture across all frameworks with color-coded status indicators.' },
    { step: 'Investigate alerts', detail: 'Click red or amber alerts to see detailed context, root cause, and recommended actions.' },
    { step: 'Track remediations', detail: 'Monitor open remediation items and their progress toward resolution.' },
    { step: 'Generate reports', detail: 'Export compliance status reports for board meetings, auditors, or regulatory submissions.' },
  ],
};

export const pulseInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaPulse™ is a real-time AI agent activity monitor that visualizes every agent action, decision, compliance check, and risk assessment as it happens across your Datacendia deployment.',
  whatItDoes: [
    'Streams real-time agent activity with sub-second latency via WebSocket',
    'Visualizes compliance enforcement and risk scoring for every agent action',
    'Provides drill-down into individual agent behavior, performance, and anomalies',
    'Supports configurable alert thresholds for automated incident response',
  ],
  howToUse: [
    { step: 'Watch the live feed', detail: 'The main panel streams agent actions in real-time. Each entry shows the agent, action type, and compliance status.' },
    { step: 'Filter by agent or type', detail: 'Use filters to focus on specific agents, action types, or risk levels.' },
    { step: 'Drill into events', detail: 'Click any event to see full context — the request, agent reasoning, and compliance evaluation.' },
    { step: 'Set alert thresholds', detail: 'Configure alerts for anomalous behavior, policy violations, or performance degradation.' },
  ],
};

export const governInfo: ServiceInfoConfig = {
  whatItIs: 'The Governance module provides constitutional-grade oversight of your AI decision-making through Decision Packets, Constitutional Court review, and DDGI (Data-Driven Governance Intelligence) scoring.',
  whatItDoes: [
    'Packages every decision into a structured Decision Packet with full provenance',
    'Enables Constitutional Court review for high-stakes or contested decisions',
    'Calculates DDGI scores to quantify governance effectiveness',
    'Maintains the immutable governance ledger for audit and compliance',
  ],
  howToUse: [
    { step: 'Review Decision Packets', detail: 'Browse the queue of decisions requiring governance review. Priority-sorted by risk and impact.' },
    { step: 'Assess governance posture', detail: 'Check your DDGI score and identify areas where governance processes need strengthening.' },
    { step: 'Escalate to Constitutional Court', detail: 'Flag contested or high-stakes decisions for formal Constitutional Court review.' },
    { step: 'Audit the ledger', detail: 'Search the governance ledger by date, topic, outcome, or involved agents.' },
  ],
};

// =============================================================================
// STRATEGIC TIER
// =============================================================================

export const collapseInfo: ServiceInfoConfig = {
  whatItIs: 'COLLAPSE is an adversarial policy stress-testing engine that simulates catastrophic failure scenarios to identify weaknesses in your AI governance policies before real crises expose them.',
  whatItDoes: [
    'Simulates multi-vector attack scenarios against your governance policies',
    'Tests policy resilience under extreme conditions (data poisoning, model drift, adversarial inputs)',
    'Identifies single points of failure in your decision-making infrastructure',
    'Generates resilience scorecards with prioritized remediation recommendations',
  ],
  howToUse: [
    { step: 'Select a scenario', detail: 'Choose from pre-built attack scenarios or create custom stress tests targeting specific policies.' },
    { step: 'Configure parameters', detail: 'Set attack intensity, duration, and the specific governance components to test.' },
    { step: 'Run the simulation', detail: 'Execute the stress test and watch your policies respond to adversarial conditions in real-time.' },
    { step: 'Analyze results', detail: 'Review the resilience scorecard — identify which policies held and which collapsed under stress.' },
    { step: 'Harden defenses', detail: 'Apply recommended policy updates and re-run to verify improvements.' },
  ],
};

export const sgasInfo: ServiceInfoConfig = {
  whatItIs: 'SGAS (Synthetic Governance Agent System) creates and manages synthetic governance agents that continuously probe, test, and validate your AI governance infrastructure.',
  whatItDoes: [
    'Deploys synthetic agents that act as independent governance auditors',
    'Continuously probes decision-making processes for bias, drift, and policy violations',
    'Generates real-time governance health metrics from synthetic agent observations',
    'Provides recommendations based on synthetic agent behavioral analysis',
  ],
  howToUse: [
    { step: 'Deploy synthetic agents', detail: 'Configure and launch synthetic governance agents targeted at specific governance domains.' },
    { step: 'Monitor agent activity', detail: 'Watch synthetic agents probe your infrastructure and report findings in real-time.' },
    { step: 'Review findings', detail: 'Analyze governance health reports generated by synthetic agent observations.' },
    { step: 'Act on recommendations', detail: 'Implement recommended governance improvements based on synthetic agent analysis.' },
  ],
};

// =============================================================================
// CROWN JEWELS
// =============================================================================

export const echoInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaEcho™ is a decision outcome tracking system that follows your decisions from the moment they\'re made through their real-world impact, creating a closed feedback loop for organizational learning.',
  whatItDoes: [
    'Tracks decision outcomes over configurable time horizons (30/60/90/365 days)',
    'Correlates decisions with measurable business outcomes and KPIs',
    'Identifies patterns in successful vs. unsuccessful decisions',
    'Feeds outcome data back into the deliberation engine to improve future decisions',
  ],
  howToUse: [
    { step: 'Configure tracking', detail: 'Set outcome metrics and tracking periods for each decision category.' },
    { step: 'Log outcomes', detail: 'Record real-world results as they materialize — revenue impact, risk events, compliance status.' },
    { step: 'Review the feedback loop', detail: 'See how past decisions performed and what patterns emerge across your decision portfolio.' },
    { step: 'Apply learnings', detail: 'The system automatically incorporates outcome data to improve future agent recommendations.' },
  ],
};

export const gnosisInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaGnosis™ is a sovereign education engine and knowledge graph explorer that maps the relationships between your decisions, agents, outcomes, and governance frameworks into a navigable knowledge structure.',
  whatItDoes: [
    'Builds a knowledge graph from your decision history, agent interactions, and outcomes',
    'Enables natural-language exploration of institutional knowledge',
    'Identifies hidden connections between decisions, risks, and opportunities',
    'Provides educational content and training modules for governance best practices',
  ],
  howToUse: [
    { step: 'Explore the graph', detail: 'Navigate the interactive knowledge graph — click nodes to expand relationships and connections.' },
    { step: 'Search with natural language', detail: 'Ask questions like "What decisions led to our Q3 revenue increase?" to traverse the graph.' },
    { step: 'Discover patterns', detail: 'Use AI-powered pattern detection to surface hidden relationships in your decision data.' },
    { step: 'Access training modules', detail: 'Complete governance training modules tailored to your organization\'s specific needs.' },
  ],
};

export const redTeamInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaRedTeam™ is an automated adversarial testing system that attacks your AI council\'s decisions from every angle — finding vulnerabilities, biases, and failure modes before they manifest in production.',
  whatItDoes: [
    'Automatically generates adversarial attacks against council decisions',
    'Tests for prompt injection, reasoning flaws, bias amplification, and policy circumvention',
    'Provides severity-rated vulnerability reports with exploitation details',
    'Enables custom red team scenarios targeting specific decision domains',
  ],
  howToUse: [
    { step: 'Select a target', detail: 'Choose a deliberation, policy, or agent to red-team test.' },
    { step: 'Configure attack vectors', detail: 'Select which attack types to include — adversarial inputs, prompt injection, edge cases, etc.' },
    { step: 'Run the assessment', detail: 'Launch the red team exercise and watch attack results stream in real-time.' },
    { step: 'Review vulnerabilities', detail: 'Each finding includes severity, attack vector, exploitation steps, and remediation guidance.' },
    { step: 'Remediate and re-test', detail: 'Apply fixes and re-run the red team to confirm vulnerabilities are resolved.' },
  ],
};

// =============================================================================
// DCII SERVICES
// =============================================================================

export const dciiMemoryInfo: ServiceInfoConfig = {
  whatItIs: 'The DCII Memory service ensures your organization\'s institutional memory is cryptographically preserved — every decision, deliberation, and outcome is immutably recorded.',
  whatItDoes: [
    'Maintains a cryptographically sealed record of all institutional decisions',
    'Prevents historical revisionism through tamper-evident hashing',
    'Enables full-text search across your entire decision memory',
    'Supports compliance requirements for decision record retention',
  ],
  howToUse: [
    { step: 'Browse memory records', detail: 'Search or filter your institutional memory by date, topic, outcome, or involved agents.' },
    { step: 'Verify integrity', detail: 'Click any record to verify its cryptographic hash chain is intact.' },
    { step: 'Export for compliance', detail: 'Generate compliance-ready exports of memory records for auditors or regulators.' },
  ],
};

export const dciiNotaryInfo: ServiceInfoConfig = {
  whatItIs: 'The DCII Notary service provides digital notarization for all decisions — applying Ed25519 signatures and RFC 3161 timestamps to create legally defensible proof of decision provenance.',
  whatItDoes: [
    'Applies Ed25519 + ML-DSA-65 dual signatures to every decision',
    'Generates RFC 3161 compliant timestamps for legal defensibility',
    'Maintains a Merkle tree of all notarized decisions for efficient verification',
    'Provides verifiable proof that a decision existed at a specific point in time',
  ],
  howToUse: [
    { step: 'View notarized decisions', detail: 'Browse all notarized decisions with their signature status and timestamps.' },
    { step: 'Verify a signature', detail: 'Click any decision to verify its Ed25519 signature and RFC 3161 timestamp.' },
    { step: 'Export notarization proof', detail: 'Download the cryptographic proof package for any decision — suitable for legal proceedings.' },
  ],
};

export const dciiTruthInfo: ServiceInfoConfig = {
  whatItIs: 'The DCII Truth service verifies factual accuracy of agent claims during deliberation by cross-referencing citations, data sources, and logical consistency.',
  whatItDoes: [
    'Cross-references agent citations against verified data sources',
    'Detects logical inconsistencies and unsupported claims in deliberations',
    'Assigns truth confidence scores to individual agent statements',
    'Flags hallucinations and fabricated citations for human review',
  ],
  howToUse: [
    { step: 'Review truth scores', detail: 'Each deliberation shows truth confidence scores — green (verified), amber (uncertain), red (disputed).' },
    { step: 'Drill into citations', detail: 'Click any citation to see its verification status and original source.' },
    { step: 'Resolve disputes', detail: 'Flagged claims require human adjudication — review the evidence and mark as confirmed or rejected.' },
  ],
};

export const dciiWitnessInfo: ServiceInfoConfig = {
  whatItIs: 'The DCII Witness service creates independent observability into the deliberation process — an impartial record of who said what, when, and with what evidence.',
  whatItDoes: [
    'Records every agent interaction with millisecond-precision timestamps',
    'Captures the full evidence chain for each agent statement',
    'Provides tamper-evident witness logs for dispute resolution',
    'Supports regulatory requirements for AI decision-making transparency',
  ],
  howToUse: [
    { step: 'Browse witness logs', detail: 'View the chronological record of all deliberation events with full context.' },
    { step: 'Filter by agent or phase', detail: 'Focus on specific agents or deliberation phases to track behavior patterns.' },
    { step: 'Export witness records', detail: 'Generate formatted witness logs for compliance, audit, or legal review.' },
  ],
};

export const dciiSimilarityInfo: ServiceInfoConfig = {
  whatItIs: 'The DCII Similarity service uses TF-IDF and semantic analysis to find precedent decisions — identifying historical decisions similar to the current one for context and consistency.',
  whatItDoes: [
    'Searches your decision history for similar past decisions using semantic matching',
    'Calculates similarity scores and highlights key differences between decisions',
    'Surfaces relevant precedents during active deliberations to improve consistency',
    'Detects when new decisions contradict established institutional patterns',
  ],
  howToUse: [
    { step: 'Enter a query', detail: 'Describe the decision context or paste a question to find similar historical decisions.' },
    { step: 'Review matches', detail: 'Browse ranked results by similarity score. Each match shows the original outcome and key differences.' },
    { step: 'Apply precedent', detail: 'Reference relevant precedents during deliberation to ensure institutional consistency.' },
  ],
};

export const dciiTimestampInfo: ServiceInfoConfig = {
  whatItIs: 'The DCII Timestamp service provides RFC 3161-compliant timestamping for all decisions, creating cryptographic proof of exactly when each decision was made.',
  whatItDoes: [
    'Generates RFC 3161 trusted timestamps for every decision event',
    'Maintains a timestamp authority chain for legal defensibility',
    'Supports bulk timestamp verification for audit periods',
    'Integrates with external TSA providers for independent verification',
  ],
  howToUse: [
    { step: 'View timestamp records', detail: 'Browse all timestamped events with their RFC 3161 certificates.' },
    { step: 'Verify a timestamp', detail: 'Click any event to cryptographically verify its timestamp against the TSA chain.' },
    { step: 'Export for legal', detail: 'Download timestamp certificates suitable for legal proceedings or regulatory submission.' },
  ],
};

export const lensInfo: ServiceInfoConfig = {
  whatItIs: 'CendiaLens™ is a deep-analysis tool that provides multi-dimensional views into your decision data — from high-level dashboards to granular drill-downs across risk, compliance, and performance dimensions.',
  whatItDoes: [
    'Provides multi-dimensional analysis across risk, compliance, performance, and governance metrics',
    'Enables drill-down from portfolio-level views to individual decision details',
    'Generates executive-ready visualizations and trend reports',
    'Supports custom lens configurations for different stakeholder perspectives',
  ],
  howToUse: [
    { step: 'Select a lens', detail: 'Choose from pre-configured lenses (Risk, Compliance, Performance) or create a custom view.' },
    { step: 'Set the scope', detail: 'Filter by date range, department, decision type, or governance framework.' },
    { step: 'Explore the data', detail: 'Click any chart element to drill down into the underlying decisions and details.' },
    { step: 'Export insights', detail: 'Generate PDF reports or schedule automated delivery to stakeholders.' },
  ],
};

// =============================================================================
// LOOKUP MAP — for dynamic access by page key
// =============================================================================

export const SERVICE_INFO: Record<string, ServiceInfoConfig> = {
  council: councilInfo,
  replay: replayInfo,
  chronos: chronosInfo,
  dcii: dciiInfo,
  gateway: gatewayInfo,
  'gap-scanner': gapScannerInfo,
  escrow: escrowInfo,
  'compliance-monitor': complianceMonitorInfo,
  pulse: pulseInfo,
  govern: governInfo,
  collapse: collapseInfo,
  sgas: sgasInfo,
  echo: echoInfo,
  gnosis: gnosisInfo,
  'red-team': redTeamInfo,
  'dcii-memory': dciiMemoryInfo,
  'dcii-notary': dciiNotaryInfo,
  'dcii-truth': dciiTruthInfo,
  'dcii-witness': dciiWitnessInfo,
  'dcii-similarity': dciiSimilarityInfo,
  'dcii-timestamp': dciiTimestampInfo,
  lens: lensInfo,
};
