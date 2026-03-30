/**
 * Toyota Sandbox Config
 * Access: /sandbox/toyota (Key: TY-73)
 * @module pages/sandbox/configs/toyota
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Toyota',
  accessKey: 'TY-73',
  sessionKey: 'toyota-sandbox-unlocked',
  accent: 'red',
  accentColor: 'text-red-400',
  accentHover: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
  ringColor: 'focus:ring-red-500/30',
  borderColor: 'border-red-500/30',
  gradientFrom: 'from-red-600/20',
  gradientTo: 'to-red-900/20',
  footerNote: 'Toyota AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Toyota systems or incidents.',

  scenarios: [
    // SCENARIO 1 — TOYOTA: AUTONOMOUS DRIVING AI SAFETY VALIDATION
    {
      id: 'toyota-ads-safety',
      title: 'Toyota Teammate — ADS Edge Case Failure',
      subtitle: 'Level 3 autonomous · Pedestrian detection gap · MLIT recall · 2.4M vehicles affected',
      banner: 'Simulating the autonomous driving safety crisis: Toyota\'s Teammate Advanced Drive (Level 3) fails to detect a pedestrian in a specific edge case — a person wearing reflective clothing at dusk. The AI\'s training data underrepresents this scenario. Japan\'s MLIT orders a safety recall affecting 2.4M vehicles.',
      risk: 'Critical',
      scenarioNum: 'ADS',
      icon: 'truck',
      color: 'text-red-400',
      agents: [
        { id: 'teammate-ai', name: 'Teammate AI Agent', role: 'Autonomous Driving Perception & Planning', icon: '🚗', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'safety-eng', name: 'Safety Engineering Agent', role: 'Functional Safety & ISO 26262', icon: '🔧', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'mlit-agent', name: 'MLIT Investigation Agent', role: 'Japanese Road Transport Safety & Recall', icon: '🏛️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'liability-agent', name: 'Product Liability Agent', role: 'PL Act & Manufacturer Responsibility', icon: '⚖️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Teammate AI', status: 'connected', type: 'ADS Perception', icon: 'cpu', detail: 'Level 3 autonomous: pedestrian detection confidence 99.2% — except edge case' },
        { name: 'Edge Case DB', status: 'connected', type: 'Safety Validation', icon: 'database', detail: 'Reflective clothing + dusk lighting: 34% detection rate (FAIL)' },
        { name: 'MLIT Safety Portal', status: 'connected', type: 'Recall System', icon: 'shield', detail: 'Safety recall order pending: 2.4M Teammate-equipped vehicles' },
        { name: 'ISO 26262 Module', status: 'syncing', type: 'Functional Safety', icon: 'check-circle', detail: 'ASIL D requirement: systematic failure detection and mitigation' },
      ],
      script: [
        { agentId: 'teammate-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Toyota Teammate Advanced Drive (Level 3) perception system analysis. Overall pedestrian detection: 99.2% confidence across 48M test kilometres. Edge case discovered: pedestrian wearing hi-vis reflective vest at civil twilight (dusk/dawn). The reflective material creates sensor confusion — LiDAR returns are anomalous (high reflectivity misclassified as static infrastructure), camera contrast is reduced at twilight, and radar cross-section is distorted. Detection rate for this edge case: 34%. This means in 66% of encounters: the ADS does not detect the pedestrian. The edge case is particularly dangerous because construction workers, emergency responders, and cyclists commonly wear reflective clothing — and twilight is a peak accident period. Training data analysis: the 48M km dataset contains only 847 instances of reflective-clothing-at-twilight (0.002% of pedestrian encounters). The AI was never adequately trained on this scenario.' },
        { agentId: 'safety-eng', phase: 'phase1', type: 'warning', delay: 2500, content: 'SAFETY ENGINEERING ALERT. ISO 26262 analysis: (1) Teammate Advanced Drive is classified ASIL D (highest automotive safety integrity level). ASIL D requires: systematic failure detection with a target metric of <10^-8 failures per hour for safety-critical functions. Pedestrian detection IS a safety-critical function. (2) A 34% detection rate for ANY pedestrian category violates ISO 26262 requirements. The system should achieve >99% detection for all anticipated pedestrian appearances. (3) ISO/PAS 21448 (SOTIF — Safety of the Intended Functionality): specifically addresses performance limitations in AI-based driving systems. SOTIF requires identification of "triggering conditions" — scenarios where the system performs inadequately. Reflective clothing at twilight is a textbook triggering condition that should have been identified during SOTIF analysis. (4) Toyota\'s SOTIF analysis listed 2,400 triggering conditions. Reflective clothing at twilight was NOT among them. The SOTIF analysis was incomplete.' },
        { agentId: 'mlit-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. MLIT enforcement: (1) Japan\'s Road Transport Vehicle Act Article 63-3 authorises MLIT to order recalls for safety defects. A 34% pedestrian detection rate is a safety defect. (2) MLIT recall scope: ALL vehicles equipped with Teammate Advanced Drive — 2.4M vehicles across Japan, Europe, and North America. (3) Recall options: (a) OTA software update to disable Level 3 in twilight conditions — reduces functionality but eliminates risk. (b) Full perception system retrain and revalidation — takes 6-12 months. (c) Hardware supplement (additional sensor) — $400/vehicle × 2.4M = $960M. (4) MLIT will also require Toyota to submit a "comprehensive safety assurance plan" for ALL Teammate AI functions — not just the twilight edge case. Every triggering condition must be re-validated. (5) International impact: NHTSA (US) and UNECE WP.29 (Europe) will issue parallel investigations based on the MLIT finding.' },
        { agentId: 'liability-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PRODUCT LIABILITY. Japan\'s Product Liability Act (PL Act 1994): the manufacturer is strictly liable for defects causing injury. A 34% detection rate for a class of pedestrians IS a defect. If a pedestrian in reflective clothing is injured: Toyota\'s liability is automatic under PL Act. No need to prove negligence. Damages: unlimited under Japanese law. Without CendiaSupervision: the edge case is discovered after an incident. Recall is reactive. Liability is established. The "Toyota Way" safety reputation — built over 80 years — is damaged. With CendiaSupervision: edge case coverage analysis identifies the reflective-at-twilight gap during pre-deployment validation. The training data is augmented. The detection rate is raised to 99.4% before any vehicle is delivered.' },
        { agentId: 'teammate-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Teammate + CendiaSupervision ADS Safety Governance: (1) EDGE CASE COVERAGE ANALYSIS: CendiaSupervision maps ALL pedestrian appearance categories against detection rates. Any category below 99% triggers mandatory data augmentation and retraining. (2) SOTIF COMPLETENESS CHECK: CendiaSupervision verifies the SOTIF triggering condition list against real-world incident databases (NHTSA, MLIT, Euro NCAP). Missing triggering conditions are flagged. (3) CONTINUOUS VALIDATION: Post-deployment, fleet telemetry data identifies new edge cases in real-time. Detection confidence below threshold triggers an OTA update pipeline. (4) SENSOR FUSION AUDIT: CendiaSupervision verifies that LiDAR, camera, and radar agree on pedestrian detection. Sensor disagreement triggers cautious behaviour (slow/stop) even if one sensor is confident. (5) REGULATORY PRE-NOTIFICATION: If an edge case is found post-deployment, CendiaSupervision generates MLIT/NHTSA/UNECE notification packages within 24 hours — demonstrating proactive safety management.' },
        { agentId: 'mlit-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Edge case coverage analysis catches the reflective-at-twilight gap during validation. Training data augmented with 12,000 synthetic and 3,400 real-world instances. Detection rate: 34% → 99.4%. SOTIF triggering condition list expanded from 2,400 to 3,100. No recall needed. For Toyota: CendiaSupervision = the safety governance layer that protects both lives and the Toyota safety brand. "Every Teammate AI edge case is validated against 3,100 triggering conditions before deployment" — the safety guarantee that differentiates Toyota from every autonomous driving competitor.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ty10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ty20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Teammate AI + Edge case coverage + SOTIF check + Sensor fusion audit)',
        complianceLabel: 'Safety Status',
        complianceValue: 'EDGE CASE RESOLVED — 99.4% DETECTION',
        complianceThreshold: 'ASIL D: >99% all pedestrian categories, 3,100 triggering conditions',
        agents: ['Teammate AI Agent', 'Safety Engineering Agent', 'MLIT Investigation Agent', 'Product Liability Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Toyota Teammate — ADS Safety Governance',
        guaranteeBody: 'Edge case detected pre-deployment: reflective clothing at twilight, 34% → 99.4%. SOTIF expanded to 3,100 conditions. ISO 26262 ASIL D maintained. MLIT recall avoided. 2.4M vehicles safe.',
        evidenceChain: 'Teammate AI (34% edge case) → Coverage analysis → Data augmentation → Retrained → 99.4% → SOTIF expanded → ASIL D verified → No recall → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Toyota Teammate + CendiaSupervision catches an autonomous driving edge case before deployment — preventing a 2.4M vehicle recall.',
      phaseLabels: ['Edge Case Discovery & 34% Detection', 'MLIT Recall & Product Liability', 'Coverage Analysis & SOTIF Expansion'],
    },

    // SCENARIO 2 — TOYOTA: JAPANESE APPI AI GOVERNANCE
    {
      id: 'toyota-appi',
      title: 'Toyota Connected — APPI Utilization Purpose Violation',
      subtitle: 'Connected vehicle data · Purpose limitation breach · PPC order · Driver trust crisis',
      banner: 'Simulating the Japanese privacy crisis: Toyota Connected collects driving data for "safety improvement." The AI uses this data for insurance pricing partnerships — a purpose NOT disclosed to drivers. Japan\'s Personal Information Protection Commission (PPC) finds a utilization purpose violation under the amended APPI.',
      risk: 'High',
      scenarioNum: 'APPI',
      icon: 'shield',
      color: 'text-amber-400',
      agents: [
        { id: 'connected-ai', name: 'Toyota Connected Agent', role: 'Vehicle Telemetry & Data Analytics', icon: '🚗', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'appi-counsel', name: 'APPI Counsel Agent', role: 'Japanese Privacy Law & Purpose Limitation', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'ppc-agent', name: 'PPC Investigation Agent', role: 'Personal Information Protection Commission', icon: '🏛️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'driver-trust', name: 'Driver Trust Agent', role: 'Consumer Confidence & Brand Impact', icon: '👤', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Toyota Connected', status: 'connected', type: 'Vehicle Data', icon: 'cpu', detail: '18M connected vehicles — driving behaviour, location, maintenance data' },
        { name: 'APPI Compliance', status: 'connected', type: 'Purpose Limitation', icon: 'shield', detail: 'Disclosed purpose: "safety improvement" — actual use includes insurance pricing' },
        { name: 'Insurance Partnership', status: 'connected', type: 'Data Sharing', icon: 'briefcase', detail: 'Tokio Marine partnership: driving scores shared for premium calculation' },
        { name: 'PPC Portal', status: 'syncing', type: 'Investigation', icon: 'alert-triangle', detail: 'PPC investigation: utilization purpose violation under Art. 17-18' },
      ],
      script: [
        { agentId: 'connected-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Toyota Connected platform: 18M connected vehicles transmitting telemetry data — acceleration patterns, braking behaviour, cornering forces, speed profiles, location history, and maintenance alerts. Disclosed utilization purpose (per APPI Art. 17): "To improve vehicle safety systems and provide maintenance reminders." Actual AI utilization: (1) Safety improvement — as disclosed. (2) Insurance partnership with Tokio Marine — driving behaviour scores calculated and shared for usage-based insurance premium calculation. NOT DISCLOSED. (3) Traffic pattern analytics sold to municipal governments for urban planning. NOT DISCLOSED. APPI Art. 18: "A business operator shall not handle personal information beyond the scope necessary for the achievement of the utilization purpose." Insurance pricing and traffic analytics are OUTSIDE the disclosed purpose of "safety improvement and maintenance." 18M drivers did not consent to these uses.' },
        { agentId: 'appi-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'APPI COMPLIANCE ALERT. (1) Art. 17: utilization purpose must be "specified to the extent possible." "Safety improvement" is vague — but it clearly does NOT encompass insurance pricing or traffic analytics. (2) Art. 18(1): handling beyond the utilization purpose requires CONSENT. Toyota did not obtain consent for insurance or traffic uses. (3) The 2022 APPI amendment added Art. 27-2: "pseudonymized information" rules. Even if Toyota pseudonymized the data before sharing with Tokio Marine — the driving behaviour profiles linked to VIN numbers can be re-identified. VIN → registered owner is trivial in Japan. (4) Art. 23: third-party provision requires consent OR an opt-out mechanism. Toyota provided neither for the insurance partnership. (5) PPC enforcement: Art. 145 — the PPC can issue administrative orders. Art. 173 — criminal penalties for knowing violations: up to ¥100M for corporate entities. The insurance partnership was a deliberate business decision — not an accident. This may qualify as a knowing violation.' },
        { agentId: 'ppc-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. PPC enforcement analysis: (1) The PPC received 340 complaints from Toyota owners who discovered their driving data was used for insurance pricing through Tokio Marine premium notices that referenced "Toyota driving score." (2) PPC investigation scope: ALL Toyota Connected data uses — not just insurance. If traffic analytics to municipalities are also found: multiple violations. (3) PPC administrative order: cease insurance data sharing immediately, delete all driving scores shared with Tokio Marine, and re-obtain consent for any non-safety use of vehicle data. (4) Criminal referral: if PPC determines the insurance partnership was a knowing violation of Art. 18: criminal prosecution under Art. 173. Toyota executives face personal criminal liability. (5) Trust impact: Japan\'s automotive culture is built on manufacturer trust. If Toyota drivers believe their cars are "spying" on them for insurance companies: connected vehicle adoption drops. Toyota\'s competitive advantage in connected vehicles evaporates.' },
        { agentId: 'driver-trust', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — DRIVER TRUST. Japanese consumers trust Toyota more than any other brand. The 2024 Brand Trust Survey: Toyota #1 in Japan for 22 consecutive years. If this trust is broken by secret data sharing: (1) Connected vehicle opt-out rate spikes. Toyota loses the data advantage that powers its AI development. (2) Competitors (Honda, Nissan) market "privacy-first connected vehicles" — stealing Toyota\'s market position. (3) The damage extends beyond Japan: EU GDPR authorities will investigate whether European Toyota vehicles have similar undisclosed data sharing. Without CendiaSupervision: the insurance partnership continues until PPC enforcement. Trust is broken. With CendiaSupervision: every data use is checked against the disclosed utilization purpose. Insurance pricing use is flagged BEFORE data is shared. Toyota obtains proper consent or abandons the partnership.' },
        { agentId: 'connected-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Toyota Connected + CendiaSupervision APPI Governance: (1) PURPOSE-USE MAPPING: Every AI use of connected vehicle data is mapped against the disclosed utilization purpose. Uses outside the purpose = HARD STOP until consent is obtained. (2) CONSENT MANAGEMENT: When new data uses are proposed (insurance, traffic analytics), CendiaSupervision generates a consent request for affected drivers — transparent, specific, and easy to decline. (3) THIRD-PARTY SHARING GATE: Data sharing with partners (Tokio Marine, municipalities) requires: purpose verification, consent confirmation, pseudonymization verification, and re-identification risk assessment. (4) DRIVER DASHBOARD: Each Toyota owner sees exactly how their data is used — "Your driving data is used for: safety improvement ✓, maintenance reminders ✓, insurance pricing ✗ (not consented)." (5) PPC AUDIT READINESS: Every data processing activity is logged with: purpose basis, consent status, third-party recipients, and retention period.' },
        { agentId: 'ppc-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Purpose-use mapping catches the insurance partnership before data is shared. Toyota obtains explicit consent from drivers who want usage-based insurance — 34% opt in (a strong conversion rate when trust is maintained). Drivers who decline: their data is used only for safety. PPC investigation finds Toyota exceeds APPI requirements. For Toyota: CendiaSupervision = the data governance layer that preserves driver trust. "Toyota Connected: you control your data" — the message that strengthens Toyota\'s #1 trust position while enabling data-driven business models WITH consent.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ty30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ty40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Connected vehicle data + Purpose-use mapping + Consent management + Driver dashboard)',
        complianceLabel: 'APPI Status',
        complianceValue: 'PURPOSE-COMPLIANT — CONSENT OBTAINED',
        complianceThreshold: 'Art. 17-18: all uses within disclosed purpose or consented',
        agents: ['Toyota Connected Agent', 'APPI Counsel Agent', 'PPC Investigation Agent', 'Driver Trust Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Toyota Connected — APPI Purpose Governance',
        guaranteeBody: 'Purpose-use mapping enforced. Insurance partnership: consent obtained (34% opt-in). Traffic analytics: paused pending consent. Driver dashboard deployed. PPC audit-ready. Trust preserved.',
        evidenceChain: 'Connected data (18M vehicles) → Purpose-use mapping → Insurance: outside purpose → Consent requested → 34% opt-in → Dashboard deployed → PPC compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Toyota Connected + CendiaSupervision catches an APPI purpose violation — preserving driver trust while enabling consented data partnerships.',
      phaseLabels: ['Purpose Violation & Secret Data Sharing', 'PPC Investigation & Trust Crisis', 'Purpose-Use Mapping & Driver Dashboard'],
    },
  ],
};

export default config;
