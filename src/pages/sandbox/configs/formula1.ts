/**
 * FIA / Formula 1 Sandbox Config
 *
 * 5 fully scripted multi-agent deliberation scenarios for motorsport governance.
 * Access: /sandbox/f1 (Key: F1-FIA-26)
 *
 * @module pages/sandbox/configs/formula1
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'FIA / Formula 1',
  accessKey: 'F1-FIA-26',
  sessionKey: 'f1-sandbox-unlocked',

  accent: 'red',
  accentColor: 'text-red-400',
  accentHover: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
  ringColor: 'focus:ring-red-500/30',
  borderColor: 'border-red-500/30',
  gradientFrom: 'from-red-600/20',
  gradientTo: 'to-red-900/20',

  footerNote: '27 regulatory scenarios mapped for FIA / Formula 1 · Full architecture document available on request',

  scenarios: [
    // =========================================================================
    // SCENARIO 1 — COST CAP ENFORCEMENT: THE RED BULL PRECEDENT
    // =========================================================================
    {
      id: 'cost-cap',
      title: 'Cost Cap Enforcement — The Red Bull Precedent',
      subtitle: '$140M cap · Red Bull £1.8M breach (2022) · 10 teams audited · CAS appeal-ready',
      banner: 'Simulating an FIA cost cap audit where a constructor is suspected of exceeding the $140M cap through creative accounting. The platform must build a CAS-ready evidence bundle that distinguishes legitimate costs from cap circumvention — learning from the Red Bull breach precedent.',
      risk: 'Critical',
      scenarioNum: 'Cost Cap',
      icon: 'banknote',
      color: 'text-red-400',
      agents: [
        { id: 'cost-auditor', name: 'Cost Cap Auditor Agent', role: 'FIA Financial Regulations & Line-Item Analysis', icon: '📊', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'legal-f1', name: 'Legal Agent', role: 'CAS Appeals & FIA International Sporting Code', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'technical', name: 'Technical Agent', role: 'Engineering Cost Classification & R&D Boundaries', icon: '🔧', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'precedent-f1', name: 'Precedent Agent', role: 'Red Bull 2022 Case Study & Consistency Analysis', icon: '📋', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
      ],
      connectors: [
        { name: 'FIA Cost Cap Submissions', status: 'connected', type: 'Financial Compliance Data', icon: 'banknote', detail: 'Constructor X: $138.7M declared (97.6% of cap)' },
        { name: 'Engineering Cost Database', status: 'connected', type: 'R&D Classification Engine', icon: 'cpu', detail: '14,200 cost line items to classify' },
        { name: 'Red Bull 2022 Precedent', status: 'connected', type: 'Breach Case Study', icon: 'database', detail: 'ABA finding: £1.8M minor overspend, $7M fine + 10% ATR reduction' },
        { name: 'CAS Motorsport Archive', status: 'syncing', type: 'Arbitration Precedent', icon: 'scale', detail: '127 FIA-related CAS cases indexed' },
      ],
      script: [
        { agentId: 'cost-auditor', phase: 'phase1', type: 'warning', delay: 800, content: 'COST CAP AUDIT INITIATED. Constructor X has declared $138.7M against the $140M cap — apparently compliant with a $1.3M margin. However, AI-driven forensic analysis of 14,200 cost line items has flagged 3 categories of concern: (1) Staff catering and hospitality: $4.2M declared as "non-F1 activity" (excluded from cap) but 78% of the expenses correlate with race weekends and factory test days — should be included, (2) Technology licensing from parent company: $8.7M for IP transfer priced at cost — FIA benchmarking suggests market rate is $12.4M (the $3.7M discount is effectively a subsidy circumventing the cap), (3) Seconded staff from sister company: 23 engineers officially employed by the road car division but working >60% on F1 projects — estimated cap-relevant cost: $6.8M unallocated. If reclassified, Constructor X\'s actual spend is $153.4M — $13.4M over the cap. This is not a minor breach.' },
        { agentId: 'precedent-f1', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Red Bull 2022 precedent analysis: Red Bull\'s £1.8M breach was classified as "minor" (under 5% overspend) by the FIA Cost Cap Administration. Sanctions: $7M fine + 10% Aerodynamic Testing Restriction (ATR) reduction for 12 months. Key factors: (1) Red Bull cooperated fully with the investigation, (2) The breach was caused by "genuine accounting differences" (tax treatment, staff gardening leave), (3) No intent to circumvent the cap was found. Constructor X\'s situation is categorically different: (1) The catering reclassification suggests deliberate cost-shifting, (2) The IP licensing discount from the parent company is structural circumvention, (3) The 23 seconded engineers represent sustained cap avoidance. If found in breach, Constructor X faces "material breach" sanctions (>5%): potential points deduction, championship exclusion, or reduced budget cap. This is the most significant cost cap case since the regulations were introduced.' },
        { agentId: 'legal-f1', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Before issuing findings, we must anticipate Constructor X\'s CAS defence: (1) Catering — they will argue FIA guidance on "non-F1 activity" is ambiguous and their interpretation is reasonable. In the Red Bull case, the FIA acknowledged that guidance was unclear. (2) IP licensing — they will argue transfer pricing at cost is standard practice within corporate groups and the FIA has no authority to mandate arm\'s-length pricing. This is a novel legal question with no CAS precedent. (3) Seconded staff — the 60% threshold for "primarily F1" is an FIA guideline, not a regulation. Constructor X will argue the regulation only covers employees, not secondees. Each argument has a 15-25% probability of succeeding individually. If even ONE category is overturned at CAS, the breach drops below the 5% threshold and becomes "minor" — radically changing sanctions.' },
        { agentId: 'technical', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. The 23 seconded engineers deserve specific technical scrutiny. I have cross-referenced their work outputs (technical reports, simulation runs, wind tunnel test requests) against Constructor X\'s F1 and road car programmes. Findings: (1) 18 of 23 engineers accessed F1-specific CFD simulation tools >80% of their working hours, (2) 14 engineers authored technical reports classified under the F1 car development programme, (3) Only 5 engineers have substantive road car programme outputs. The technical evidence strongly supports reclassification of at least 18 engineers as F1 employees — $5.3M in unallocated cost. This is not an accounting ambiguity — it is a structural arrangement designed to place F1 resources outside the cap. The engineering evidence is more damning than the financial evidence.' },
        { agentId: 'cost-auditor', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Cost Cap Evidence Protocol: (1) All 14,200 cost line items are sealed with the AI classification methodology — transparent, replicable, and available to Constructor X for challenge. (2) The catering reclassification uses time-correlation analysis (race weekend/test day correlation at 78%) with documented methodology that CAS has accepted in financial fraud cases. (3) IP licensing benchmarking uses 47 comparable technology licensing agreements across F1 and automotive sectors — sealed as objective FMV evidence. (4) The 23 engineers\' work output analysis (CFD access logs, technical reports, simulation runs) is sealed with ML-DSA-65 — proving the technical evidence is contemporaneous, not reconstructed. (5) CendiaPrecedent comparison with Red Bull 2022 case documents exactly why this case warrants material breach classification. Every finding is CAS-ready before Constructor X\'s lawyers see it.' },
        { agentId: 'legal-f1', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Datacendia evidence bundle addresses all 3 CAS defence vectors: (1) Catering ambiguity — the 78% time-correlation analysis provides objective classification that doesn\'t rely on subjective FIA guidance. (2) IP licensing — the 47 comparable agreements establish arm\'s-length market rate objectively, bypassing the "cost vs market" legal debate. (3) Seconded staff — the engineering work output evidence (CFD logs, technical reports) proves F1 allocation regardless of employment classification. CAS appeal probability for Constructor X drops from 22% (on ambiguity grounds) to 4.1% (on the technical evidence). The FIA can issue material breach findings with confidence that the sanctions will survive CAS scrutiny. This is how cost cap enforcement achieves credibility.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:f10123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'f20123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (14,200 line items + Engineering work logs + IP benchmarks + Red Bull precedent)',
        complianceLabel: 'Cost Cap Finding',
        complianceValue: '$13.4M OVERSPEND',
        complianceThreshold: 'Material breach (>5% of $140M cap)',
        agents: ['Cost Cap Auditor Agent', 'Legal Agent', 'Technical Agent', 'Precedent Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'FIA Cost Cap — Material Breach Evidence CAS-Ready',
        guaranteeBody: 'This cryptographic bundle seals the complete cost cap investigation: 14,200 line-item classifications, catering time-correlation analysis (78%), IP licensing benchmarking (47 comparables), and 23-engineer work output evidence (CFD logs, technical reports). Red Bull 2022 precedent comparison documents material vs minor breach distinction. CAS appeal probability: 4.1%. Cost cap enforcement credibility depends on evidence quality — this bundle delivers it.',
        evidenceChain: '14,200 line items → AI classification → Catering reclassification (78% correlation) → IP licensing benchmark (47 comparables) → Engineer work output (CFD/reports) → Red Bull precedent comparison → Material breach finding → CAS defence simulation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will audit a Formula 1 constructor\'s $140M cost cap submission — uncovering creative accounting through engineering evidence and building a CAS-ready prosecution.',
      phaseLabels: ['Forensic Line-Item Analysis', 'CAS Defence Simulation', 'Evidence Sealing & Finding'],
    },

    // =========================================================================
    // SCENARIO 2 — RACE STEWARD CONSISTENCY: THE SILVERSTONE PROBLEM
    // =========================================================================
    {
      id: 'steward-consistency',
      title: 'Race Steward Consistency — The Silverstone Problem',
      subtitle: 'Penalty inconsistency · Hamilton/Verstappen precedent · Telemetry AI · Fan trust crisis',
      banner: 'Simulating a race steward penalty decision where AI-assisted incident analysis must produce consistent outcomes. After the Hamilton/Verstappen Silverstone 2021 controversy, F1 needs provably consistent steward decisions to maintain fan trust and survive CAS challenges.',
      risk: 'High',
      scenarioNum: 'Stewards',
      icon: 'gavel',
      color: 'text-amber-400',
      agents: [
        { id: 'steward-ai', name: 'Steward Analysis Agent', role: 'Telemetry-Based Incident Reconstruction', icon: '📡', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'precedent-steward', name: 'Precedent Agent', role: 'CendiaPrecedent — 2,400+ Incident Comparison', icon: '📋', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'legal-steward', name: 'Legal Agent', role: 'FIA ISC & International Court of Appeal', icon: '⚖️', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'bias-f1', name: 'Cognitive Bias Agent', role: 'Driver Reputation & Championship Impact Bias', icon: '🧠', color: 'text-rose-400', borderColor: 'border-rose-500/40', bgColor: 'bg-rose-500/10' },
      ],
      connectors: [
        { name: 'F1 Telemetry System', status: 'connected', type: 'Car Data & GPS Tracking', icon: 'activity', detail: 'Incident: Turn 4 contact, Lap 23 — 2 cars involved' },
        { name: 'CendiaPrecedent Database', status: 'connected', type: 'Historical Incident Analysis', icon: 'database', detail: '2,487 steward incidents indexed (2010-2026)' },
        { name: 'Onboard Camera Feed', status: 'connected', type: 'Multi-Angle Video Analysis', icon: 'eye', detail: '6 camera angles available for incident reconstruction' },
        { name: 'FIA Steward Panel', status: 'syncing', type: 'Decision Recording', icon: 'gavel', detail: '4-person panel: 3 appointed + 1 permanent (retired driver)' },
      ],
      script: [
        { agentId: 'steward-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Incident reconstruction from telemetry. Turn 4, Lap 23: Driver A (championship leader) and Driver B (title rival) entered the corner side-by-side. Telemetry analysis: (1) Driver A braking point: 87m before apex — 3m later than their baseline, (2) Driver A minimum speed through corner: 178 km/h — 12 km/h faster than their average lap, (3) Driver A steering input: 2.3° less than required for the racing line — car understeered into Driver B\'s space, (4) Driver B position: fully alongside at turn-in with front axle ahead — entitled to racing room under FIA Driving Standards Guidelines (DSG) Appendix L, Chapter IV. Contact occurred at apex: Driver A\'s front-right wheel to Driver B\'s rear-left — sending Driver B into the gravel with terminal damage. Driver A continued with front wing damage, pitted, and finished P5. Championship implications: if Driver B DNFs with no penalty to Driver A, the championship gap widens from 12 to 37 points.' },
        { agentId: 'precedent-steward', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. CendiaPrecedent has identified the 5 most comparable incidents from 2,487 indexed cases: (1) Hamilton/Verstappen Silverstone 2021 — 10-second time penalty (predominantly at fault), (2) Verstappen/Hamilton Monza 2021 — 3-place grid penalty (next race), (3) Leclerc/Verstappen Austria 2019 — no investigation necessary, (4) Ricciardo/Verstappen Baku 2018 — both drivers reprimanded, (5) Rosberg/Hamilton Spain 2016 — racing incident, no penalty. The comparable precedents range from NO PENALTY to 10-SECOND PENALTY — a massive inconsistency gap. The steward decision in comparable incidents has depended more on WHO was driving than on WHAT happened. This is the Silverstone Problem: identical physics, different outcomes based on driver identity.' },
        { agentId: 'bias-f1', phase: 'phase2', type: 'warning', delay: 2000, content: 'COGNITIVE BIAS ALERT — 3 BIASES DETECTED: (1) Championship impact bias — stewards are subconsciously influenced by the championship implications. A penalty for Driver A effectively decides the championship; no penalty keeps it alive. Stewards will be tempted to issue a lenient penalty to "let the championship be decided on track." (2) Driver reputation bias — Driver A has a clean racing reputation (2 penalties in 3 seasons). Driver B has a more aggressive reputation (7 penalties in 3 seasons). Stewards subconsciously associate aggression with fault, even when the telemetry shows Driver A caused the contact. (3) Outcome bias — Driver B retired, Driver A continued. Stewards tend to penalise more harshly when the outcome is severe, regardless of the action\'s severity. The telemetry-based assessment should be IDENTICAL regardless of outcome.' },
        { agentId: 'legal-steward', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISSENT LOGGED. If the stewards issue a lenient penalty (reprimand or 5-second penalty) that is inconsistent with the Silverstone 2021 precedent (where a 10-second penalty was given for near-identical telemetry), the affected team will appeal to the FIA International Court of Appeal (ICA). The ICA challenge will argue: (1) The telemetry profiles are statistically identical (braking point, corner speed, steering input), (2) The penalty should therefore be identical, (3) Any difference in penalty is attributable to driver identity or championship context — both of which are illegitimate considerations under FIA ISC. Without a mathematically defensible consistency framework, the FIA faces an ICA ruling that undermines steward credibility for the rest of the season.' },
        { agentId: 'steward-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Steward Consistency Protocol: (1) The telemetry-based incident assessment produces a numerical "incident profile" — braking delta, speed delta, steering delta, position at turn-in — that is compared mathematically to all 2,487 precedent incidents. (2) The 5 most comparable incidents are surfaced with their penalties. (3) A RECOMMENDED PENALTY RANGE is generated: for this incident, the telemetry comparison yields "10-second time penalty" with 87% confidence (strongly matching Silverstone 2021). (4) If stewards deviate from the recommended range, they must provide a documented rationale explaining why this incident is materially different from the precedents. (5) Cognitive bias scores are logged — the stewards see the bias alerts and must acknowledge them before deciding. The final decision remains human — but it is now accountable.' },
        { agentId: 'legal-steward', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Steward Consistency Protocol makes ICA challenges nearly impossible to win. If the stewards follow the AI-recommended range (10-second penalty), the decision is mathematically consistent with 2,487 precedents. If they deviate, the documented rationale for deviation is sealed — the ICA can evaluate whether the rationale is legitimate without relitigating the entire incident. This is not "AI replacing stewards" — it is "AI ensuring human stewards have access to consistent precedent analysis." The protocol would have prevented the Silverstone controversy entirely. Fan trust in steward decisions is rebuilt through provable consistency, not through better PR.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:f30123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'f40123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (Telemetry profile + 2,487 precedents + Bias detection + Steward rationale)',
        complianceLabel: 'Penalty Consistency',
        complianceValue: '87% MATCH',
        complianceThreshold: 'Silverstone 2021 precedent',
        agents: ['Steward Analysis Agent', 'Precedent Agent', 'Legal Agent', 'Cognitive Bias Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Steward Consistency — Telemetry-Based Precedent Matching',
        guaranteeBody: 'This cryptographic bundle seals the complete steward decision: telemetry-based incident profile (braking, speed, steering, position), 5 most comparable precedents from 2,487 cases, 3 cognitive bias alerts (championship, reputation, outcome), AI-recommended penalty range (10s, 87% confidence), and steward final decision with documented rationale. ICA appeal probability: 3.2%. Provable consistency across all race incidents.',
        evidenceChain: 'F1 telemetry extraction → Incident profile generation → CendiaPrecedent search (2,487 cases) → Top 5 comparables → Cognitive bias detection (3 alerts) → Recommended penalty range → Steward acknowledgment → Final decision → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will analyse a controversial racing incident — using telemetry and 2,487 precedents to deliver a provably consistent steward penalty.',
      phaseLabels: ['Telemetry Incident Reconstruction', 'Precedent & Bias Analysis', 'Consistent Penalty Protocol'],
    },

    // =========================================================================
    // SCENARIO 3 — DRIVER SAFETY: HALO VINDICATION & CIRCUIT AI
    // =========================================================================
    {
      id: 'driver-safety',
      title: 'Driver Safety — Halo Vindication & Circuit AI',
      subtitle: 'Grosjean Bahrain 2020 · AI crash simulation · Circuit design governance · Life-or-death evidence',
      banner: 'Simulating an FIA Safety Commission review where AI-driven crash simulation and circuit design must prove that safety improvements are evidence-based, not reactive. The halo device that saved Grosjean\'s life was initially opposed — the evidence must prove every safety decision.',
      risk: 'Critical',
      scenarioNum: 'Safety',
      icon: 'shield-check',
      color: 'text-emerald-400',
      agents: [
        { id: 'safety-f1', name: 'Safety Commission Agent', role: 'FIA Crash Simulation & Barrier Design', icon: '🛡️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'circuit', name: 'Circuit Design Agent', role: 'Track Layout AI & Run-Off Optimisation', icon: '🏎️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal-safety', name: 'Legal Agent', role: 'Circuit Liability & National Regulatory Compliance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'medical-f1', name: 'Medical Delegate Agent', role: 'F1 Medical Car Deployment & Extraction', icon: '🏥', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'FIA Crash Simulation', status: 'connected', type: 'AI-Driven Impact Modelling', icon: 'cpu', detail: '47,000 crash scenarios simulated for 2026 circuits' },
        { name: 'Circuit Homologation', status: 'connected', type: 'FIA Grade 1 Standards', icon: 'shield', detail: '24 circuits under review for 2026 calendar' },
        { name: 'Grosjean Incident Database', status: 'connected', type: 'Historical Safety Case Study', icon: 'database', detail: 'Bahrain 2020: 67G impact, 27-second extraction, fire' },
        { name: 'Medical Response System', status: 'syncing', type: 'Deployment Protocol', icon: 'heart', detail: 'Target: <15 second medical car arrival' },
      ],
      script: [
        { agentId: 'safety-f1', phase: 'phase1', type: 'analysis', delay: 800, content: 'FIA Safety Commission 2026 circuit review initiated. AI crash simulation has modelled 47,000 impact scenarios across all 24 calendar circuits using 2026-specification cars (new aerodynamic regulations increase cornering speeds by 8-12%). Critical findings: (1) 3 circuits have barrier configurations that fail under 2026 car speeds — Jeddah T13-T14 complex, Monaco harbour chicane, Baku castle section. At these locations, AI simulation predicts impact forces exceeding the current barrier rating in 23% of crash scenarios. (2) The halo device — initially opposed by 7 of 10 teams in 2016 — is now proven to have saved lives in 7 documented incidents (Grosjean Bahrain 2020, Zhou Silverstone 2022, Hamilton/Verstappen Monza 2021). AI simulation confirms the halo would mitigate head injury in 94% of the 47,000 modelled scenarios. (3) Medical car deployment time at 6 circuits exceeds the 15-second target due to track layout constraints.' },
        { agentId: 'circuit', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. The Jeddah T13-T14 complex is the highest-risk finding. AI simulation: at 2026 car speeds, a loss of control at T13 results in barrier impact at 51G average force (current barrier rating: 45G). The concrete wall section at T14 has no TecPro barrier — a direct impact at race speed produces unsurvivable forces in 12% of simulation scenarios. Recommended modification: (1) Extend TecPro barrier coverage by 80m through T13-T14, (2) Increase run-off distance by 3m at T14 exit, (3) Regrade the barrier angle from 15° to 8° to deflect impacts. Estimated cost: $2.8M. The Saudi Arabian Grand Prix generates $65M in hosting fee revenue — the safety modification is 4.3% of one year\'s revenue. But the circuit promoter has historically resisted FIA safety modifications citing "disruption to the spectator experience."' },
        { agentId: 'legal-safety', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. If FIA approves the Jeddah circuit for 2026 WITHOUT the AI-recommended barrier modifications, and a driver is killed or seriously injured at T13-T14, the liability chain is: (1) FIA — approved a circuit that its own AI simulation flagged as unsafe, (2) Circuit promoter — failed to implement recommended modifications, (3) National regulator — Saudi Arabian motorsport authority approved the event. The key legal question: does AI crash simulation create a duty to act? Pre-AI, the FIA relied on historical incident data — you couldn\'t be blamed for not predicting a crash at an untested location. Post-AI, the FIA has 47,000 simulated crashes proving the risk. Ignorance is no longer a defence. The AI simulation evidence makes inaction legally indefensible.' },
        { agentId: 'medical-f1', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. Medical response modelling for the 6 circuits exceeding the 15-second deployment target: (1) Monaco — 22 seconds (narrow streets, limited access), (2) Jeddah T13-T14 — 19 seconds (barrier access point 200m from impact zone), (3) Singapore Turn 7 — 18 seconds (street circuit barriers block direct access), (4) Baku Turn 8 — 17 seconds, (5) Las Vegas Turn 14 — 16 seconds, (6) Melbourne Turn 11 — 16 seconds. In the Grosjean incident, the medical car arrived in 11 seconds — and Grosjean was in the fire for 27 seconds. Every second of delay increases fatality risk exponentially. For Jeddah T13-T14 specifically, the combination of high-impact forces AND slow medical response creates a compound risk that exceeds acceptable safety thresholds.' },
        { agentId: 'safety-f1', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Circuit Safety Evidence Protocol: (1) All 47,000 crash simulations are sealed with the AI model parameters, input data (car specifications, circuit geometry, weather conditions), and output predictions — any circuit promoter can independently verify the results. (2) For each of the 3 flagged circuits, the specific barrier modification recommendations are documented with cost estimates, engineering specifications, and the risk reduction they achieve. (3) Medical response times are modelled for each modification scenario — Jeddah barrier extension reduces medical access time from 19 to 12 seconds. (4) The complete evidence bundle for each circuit is formatted as an FIA Safety Commission directive — if a promoter refuses modifications, the refusal and FIA\'s response are documented. (5) Every safety decision from simulation to implementation is sealed — creating a continuous evidence chain that proves the FIA acted on its own AI recommendations.' },
        { agentId: 'legal-safety', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The sealed simulation evidence transforms the FIA\'s legal position. If modifications are implemented — the evidence proves proactive safety governance driven by AI prediction, not reactive changes after incidents. If a promoter refuses and an incident occurs — the evidence proves FIA identified the risk, recommended modifications, and was overruled by the promoter. The liability shifts conclusively to the promoter. This is the halo vindication model applied to circuit design: just as the halo was opposed in 2016 but proven lifesaving by 2020, circuit AI modifications opposed today will be vindicated by future incident data. The difference is that Datacendia captures the opposition and the evidence simultaneously — creating accountability that saves lives.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:f50123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'f60123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (47,000 crash simulations + Barrier specs + Medical response + Promoter directives)',
        complianceLabel: 'Safety Assessment',
        complianceValue: '3 CIRCUITS FLAGGED',
        complianceThreshold: '2026 car speeds exceed barrier ratings',
        agents: ['Safety Commission Agent', 'Circuit Design Agent', 'Legal Agent', 'Medical Delegate Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'FIA Circuit Safety — AI Simulation Evidence Sealed',
        guaranteeBody: 'This cryptographic bundle seals the complete FIA circuit safety assessment: 47,000 crash simulations across 24 circuits, 3 circuits flagged for barrier modifications (Jeddah, Monaco, Baku), medical response time modelling, and modification directives with cost estimates. Every simulation parameter is independently verifiable. If modifications are implemented: proactive governance proven. If refused: liability shifts to promoter with sealed evidence.',
        evidenceChain: '2026 car specifications → 24 circuit geometries → 47,000 crash simulations → 3 circuits flagged → Barrier modification specs → Medical response modelling → Promoter directives → Cost estimates → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will assess Formula 1 circuit safety using 47,000 crash simulations — proving that every barrier modification and medical response protocol is evidence-based, not reactive.',
      phaseLabels: ['AI Crash Simulation Analysis', 'Liability & Medical Response', 'Safety Directive Protocol'],
    },

    // =========================================================================
    // SCENARIO 4 — LIBERTY MEDIA NYSE: AI GOVERNANCE FOR SEC
    // =========================================================================
    {
      id: 'liberty-nyse',
      title: 'Liberty Media NYSE — AI Governance for SEC Compliance',
      subtitle: 'NYSE:FWONA · $3B+ revenue · Race calendar AI · Commercial decision evidence',
      banner: 'Simulating Liberty Media\'s SEC quarterly reporting where AI-assisted commercial decisions for Formula 1 — race calendar optimisation, broadcast deal valuation, and sponsorship pricing — must be documented to SOX standards for the 10-K filing.',
      risk: 'High',
      scenarioNum: 'NYSE',
      icon: 'trending-up',
      color: 'text-sky-400',
      agents: [
        { id: 'sox-f1', name: 'SOX Compliance Agent', role: 'Liberty Media Section 302/404 & AI Disclosure', icon: '📋', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'commercial-f1', name: 'Commercial Agent', role: 'Race Calendar Optimisation & Revenue Modelling', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'legal-nyse', name: 'Legal Agent', role: 'SEC Material Decision Disclosure', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'broadcast-f1', name: 'Broadcast Agent', role: 'Media Rights Valuation & Territory Analysis', icon: '📡', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
      ],
      connectors: [
        { name: 'Liberty Media Financial', status: 'connected', type: 'SEC Filing Data', icon: 'dollar-sign', detail: 'F1 segment: $3.2B revenue, $780M EBITDA (2025)' },
        { name: 'Race Calendar Engine', status: 'connected', type: 'AI Optimisation Model', icon: 'globe', detail: '24-race calendar with $1.4B in hosting fees' },
        { name: 'Broadcast Valuation AI', status: 'connected', type: 'Media Rights Analysis', icon: 'eye', detail: '3-year renewal cycle: ESPN, Sky, DAZN negotiations' },
        { name: 'SEC EDGAR Portal', status: 'syncing', type: 'Filing Submission', icon: 'file-text', detail: '10-K deadline: February 28, 2026' },
      ],
      script: [
        { agentId: 'sox-f1', phase: 'phase1', type: 'analysis', delay: 800, content: 'SOX Section 404 AI governance assessment for Liberty Media Formula 1 segment, fiscal year 2025. F1 operates AI-assisted decisions across 3 material categories: (1) Race calendar optimisation — AI model determines the 24-race schedule maximising hosting fees ($1.4B), broadcast windows (global timezone optimisation), and logistics (minimising freight costs across 24 countries). Each calendar slot is worth $50-85M in hosting fees. (2) Broadcast rights valuation — AI models project territory-by-territory media rights value for the upcoming 3-year renewal cycle. Total media rights: $1.1B/year across 200+ territories. (3) Sponsorship pricing — Aramco ($75M/year), AWS, Rolex, Heineken, and 40+ partner valuations use AI-driven audience metrics and brand exposure modelling. Total material AI-influenced revenue: $3.2B requiring SOX-compliant governance.' },
        { agentId: 'commercial-f1', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. The 2027 race calendar AI optimisation has generated a controversial recommendation: dropping the Monaco Grand Prix (iconic but lowest hosting fee at $15M) and replacing it with a second Middle Eastern race (projected $80M hosting fee). The AI model correctly identifies $65M in incremental hosting revenue — but the model does not capture: (1) Monaco\'s unquantifiable brand value (F1\'s signature event since 1929), (2) Sponsor activation that relies on Monaco\'s prestige (Rolex, TAG Heuer hospitality), (3) Regulatory risk — dropping Monaco could trigger antitrust scrutiny under TFEU Article 102 (abuse of dominant position). The AI recommendation is financially optimal but commercially myopic. This is exactly the scenario where human override of AI is correct — but the override must be documented for SEC compliance.' },
        { agentId: 'legal-nyse', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The Monaco calendar decision illustrates a critical SEC disclosure issue. Under emerging AI governance disclosure requirements, Liberty Media must disclose in the 10-K: (1) How AI models influence material business decisions, (2) The governance framework for human override of AI recommendations, (3) The risks associated with AI-driven decision-making. If Liberty Media follows the AI recommendation to drop Monaco and revenue INCREASES — no SEC issue. If it follows the AI and revenue DECREASES (sponsor backlash, brand damage) — the AI governance disclosure becomes evidence in a shareholder lawsuit. If it OVERRIDES the AI to keep Monaco — the override rationale must be documented to prove management exercised sound judgment, not just sentiment. The SEC requires evidence either way.' },
        { agentId: 'broadcast-f1', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. The broadcast rights renewal cycle (2027-2029) has compound AI governance exposure. Territories under negotiation: (1) ESPN (US) — current deal $75M/year, AI projects renewal at $120-145M based on US viewership growth (+34% since Netflix "Drive to Survive"), (2) Sky Sports (UK) — $180M/year, AI projects flat renewal (UK market saturated), (3) DAZN (multiple territories) — aggressive bidder, AI projects $200M package across 15 territories. Total AI-projected renewal value: $1.1B → $1.4B/year. If AI projections are disclosed in the 10-K as material assumptions and the actual renewals underperform, shareholders will argue management relied on flawed AI models for $4.2B in forward-looking revenue statements. The AI projections must have documented confidence intervals and scenario analysis.' },
        { agentId: 'sox-f1', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia F1 SEC Compliance Protocol: (1) Race calendar AI optimisation sealed with ALL inputs, including the Monaco recommendation and the documented human override rationale (brand value, sponsor impact, antitrust risk). The override is framed as "management exercising holistic commercial judgment beyond AI model scope" — exactly what the SEC wants to see. (2) Broadcast rights projections sealed with 3 scenarios: bull ($1.5B/year), base ($1.35B/year), bear ($1.15B/year) — the 10-K discloses the base case with confidence intervals. (3) All 40+ sponsorship AI valuations produce Regulator\'s Receipts with methodology and comparable analysis. (4) The complete AI governance framework is documented as a 10-K exhibit — demonstrating Liberty Media has institutional AI governance that competitors lack.' },
        { agentId: 'legal-nyse', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The sealed AI governance framework with documented human overrides is exactly what SEC compliance requires. The Monaco decision becomes a showcase: "Management evaluated AI recommendations, identified model limitations (brand value, antitrust risk), and exercised commercial judgment with documented rationale." This is the template for every AI-influenced material decision at Liberty Media. The 10-K AI governance exhibit positions Liberty Media as a leader in SEC AI compliance — ahead of other media companies and certainly ahead of rival sports properties. The Regulator\'s Receipt makes every AI decision audit-ready before the auditor asks.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:f70123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'f80123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (Calendar AI + Broadcast projections + Sponsorship valuations + Monaco override)',
        complianceLabel: 'SOX Compliance',
        complianceValue: '$3.2B AI-GOVERNED',
        complianceThreshold: 'Section 302/404 attestation ready',
        agents: ['SOX Compliance Agent', 'Commercial Agent', 'Legal Agent', 'Broadcast Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Liberty Media NYSE:FWONA — AI Governance for $3.2B Revenue',
        guaranteeBody: 'This cryptographic bundle seals Liberty Media\'s complete F1 AI governance: race calendar optimisation (24 races, $1.4B hosting fees, Monaco override documented), broadcast rights projections (3 scenarios, $1.15-1.5B/year), and sponsorship AI valuations (40+ partners). Every AI recommendation and human override is documented with rationale. SOX Section 302/404 attestation ready. 10-K AI governance exhibit positions Liberty Media as SEC AI compliance leader.',
        evidenceChain: 'Race calendar AI (24 races) → Monaco override rationale → Broadcast projections (ESPN/Sky/DAZN) → 3-scenario analysis → Sponsorship valuations (40+) → SOX assessment → 10-K exhibit → SEC filing → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will prepare Liberty Media\'s SEC filing — governing $3.2B in AI-influenced F1 revenue decisions with documented overrides and CAS-ready evidence.',
      phaseLabels: ['AI Revenue Assessment', 'SEC Disclosure Challenges', 'SOX Compliance Sealing'],
    },

    // =========================================================================
    // SCENARIO 5 — 2026 REGULATION REVOLUTION: GOVERNANCE FOR CHANGE
    // =========================================================================
    {
      id: 'reg-revolution',
      title: '2026 Regulation Revolution — Governing the Biggest Rule Change in F1 History',
      subtitle: 'New power units · New aero · $140M cap impact · 10 teams, 1 truth',
      banner: 'Simulating the FIA\'s governance challenge for the 2026 regulation revolution — the most significant rule change in F1 history. New power units, new aerodynamics, and active aero create a governance earthquake where every technical decision must be provably consistent across all 10 teams.',
      risk: 'High',
      scenarioNum: '2026 Rules',
      icon: 'zap',
      color: 'text-violet-400',
      agents: [
        { id: 'tech-reg', name: 'Technical Regulation Agent', role: '2026 PU & Aero Rule Interpretation', icon: '🔧', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'consistency', name: 'Consistency Agent', role: 'Equal Treatment Across 10 Constructors', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'legal-reg', name: 'Legal Agent', role: 'FIA International Court of Appeal Defence', icon: '🏛️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'pu', name: 'Power Unit Agent', role: 'New PU Regulations & Supplier Compliance', icon: '⚡', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
      ],
      connectors: [
        { name: 'FIA Technical Regulations 2026', status: 'connected', type: 'Rule Interpretation Engine', icon: 'book-open', detail: '847 regulation articles, 2,340 technical directives' },
        { name: 'Team Technical Queries', status: 'connected', type: 'Interpretation Request Portal', icon: 'database', detail: '127 active queries from 10 teams' },
        { name: 'FIA Wind Tunnel Database', status: 'connected', type: 'Aerodynamic Compliance', icon: 'activity', detail: 'Active aero parameters: 342 compliance checkpoints' },
        { name: 'PU Homologation System', status: 'syncing', type: 'Power Unit Certification', icon: 'zap', detail: '4 PU manufacturers: Ferrari, Mercedes, Honda, Audi' },
      ],
      script: [
        { agentId: 'tech-reg', phase: 'phase1', type: 'analysis', delay: 800, content: '2026 regulation governance assessment. The rule change scope is unprecedented: (1) New power unit regulations — 50/50 electric/ICE split (up from 20/80), Audi enters as new manufacturer, simplified MGU architecture, standardised battery cells. 4 manufacturers must homologate by September 2025. (2) Active aerodynamics — for the first time in F1 history, cars will have DRS-style movable aero surfaces controlled by software. The active aero software is classified as a "safety-critical AI system" because malfunction at 300 km/h could cause driver injury. (3) Ground effect downforce capped with new floor regulations — but interpretation of "floor surface" is already disputed by 3 teams. Total regulation articles: 847. Technical directives to date: 2,340. Active interpretation queries from 10 teams: 127. Every response to every query must be consistent — a favourable interpretation for one team that contradicts guidance given to another creates an ICA challenge.' },
        { agentId: 'consistency', phase: 'phase1', type: 'warning', delay: 2500, content: 'CONSISTENCY ALERT. Of the 127 active team queries, I have identified 14 pairs where different teams are asking essentially the same technical question in different words. Example: (1) Team A asks "Is a carbon fibre insert in the floor edge classified as \'floor surface\' under Article 3.5.2?" and Team B asks "Does a structural reinforcement element attached to the floor boundary constitute a \'floor component\' under Article 3.5.2?" — same question, different wording. If the FIA gives different answers (which has happened 6 times in 2024-2025 Technical Directives), the disadvantaged team files an ICA protest. With 2026 regulations being entirely new, there is no historical precedent to guide interpretation — every response is a first impression. Inconsistency risk is at its highest point in modern F1.' },
        { agentId: 'legal-reg', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The active aero software classification as "safety-critical AI" triggers obligations beyond FIA Technical Regulations. Under the EU AI Act (effective August 2025): (1) Active aero software on cars racing in EU countries (Spain, Monaco, Belgium, Netherlands, Italy, Austria, Hungary) is a high-risk AI system affecting "safety of natural persons," (2) Each of the 10 teams must provide technical documentation for their active aero AI, (3) The FIA, as the system deployer, must ensure compliance across all 10 implementations. This is unprecedented — the FIA has never regulated team SOFTWARE as a safety system, only hardware. If one team\'s active aero malfunctions and causes an accident, both the FIA and the team face EU AI Act liability. The governance framework must cover both FIA regulation AND EU AI Act compliance.' },
        { agentId: 'pu', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. Power unit homologation deadline is September 2025 — 6 months away. Status: (1) Ferrari — submitted for homologation review, 3 open queries on battery cell standardisation interpretation, (2) Mercedes — submitted, 2 open queries on MGU architecture boundaries, (3) Honda — submitted, 1 open query on fuel specification, (4) Audi — NOT YET SUBMITTED. Audi is F1\'s first new manufacturer in 10 years and has flagged that the regulation language assumes familiarity with existing F1 technical conventions that Audi (coming from Le Mans/WEC) does not share. Their 14 interpretation queries suggest fundamental misalignment between regulation intent and Audi\'s engineering approach. If Audi fails homologation, the Sauber team has no power unit for 2026 — an existential crisis for the team and a governance failure for the FIA.' },
        { agentId: 'tech-reg', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Regulation Governance Protocol: (1) All 127 team queries are processed through CendiaPrecedent — semantically matching questions to ensure consistent answers. The 14 duplicate-question pairs receive identical responses, cryptographically sealed to prove consistency. (2) Every Technical Directive response is stored in a searchable, sealed database. Teams can search before submitting queries — reducing duplicate questions and ensuring they see existing guidance. (3) Active aero software governance: each team\'s AI documentation is reviewed against a standard checklist derived from both FIA Technical Regulations AND EU AI Act requirements — a unified compliance framework. (4) Audi\'s 14 queries are prioritised with cross-references to existing guidance — bridging the WEC/F1 convention gap. (5) PU homologation evidence for all 4 manufacturers is sealed with identical assessment methodology — proving equal treatment.' },
        { agentId: 'legal-reg', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Regulation Governance Protocol addresses both FIA consistency and EU AI Act compliance simultaneously. The sealed query database eliminates the "different answers to the same question" problem that has plagued FIA Technical Directives for decades. The active aero unified compliance framework means the FIA can demonstrate to EU regulators that every team\'s safety-critical AI is governed to the same standard. And for Audi — the cross-referenced guidance accelerates their homologation without giving them preferential treatment. The evidence bundle for the 2026 regulations becomes the FIA\'s governance legacy — proving that the biggest rule change in F1 history was managed with provable consistency, equal treatment, and safety-first AI governance. The ICA will have nothing to overturn.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'fa0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (127 queries + 2,340 directives + 4 PU homologations + Active aero AI docs)',
        complianceLabel: 'Regulation Consistency',
        complianceValue: '127/127 CONSISTENT',
        complianceThreshold: '14 duplicate pairs harmonised',
        agents: ['Technical Regulation Agent', 'Consistency Agent', 'Legal Agent', 'Power Unit Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: '2026 Regulation Revolution — Provably Consistent Governance',
        guaranteeBody: 'This cryptographic bundle seals the FIA\'s complete 2026 regulation governance: 847 regulation articles, 2,340 technical directives, 127 team queries with consistent responses (14 duplicate pairs harmonised), 4 PU manufacturer homologations, and active aero AI compliance documentation. EU AI Act high-risk classification addressed. Every interpretation is sealed — ICA challenge probability: 2.1%. The biggest rule change in F1 history, governed with provable consistency.',
        evidenceChain: '847 regulation articles → 2,340 technical directives → 127 team queries → Semantic duplicate detection (14 pairs) → Consistent response generation → Active aero AI documentation → PU homologation (4 manufacturers) → EU AI Act compliance → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will govern the 2026 Formula 1 regulation revolution — ensuring provable consistency across 10 teams, 4 power unit manufacturers, and the first-ever active aero AI systems.',
      phaseLabels: ['Regulation Scope Assessment', 'Consistency & AI Act Challenges', 'Governance Protocol Activation'],
    },
  ],
};

export default config;
