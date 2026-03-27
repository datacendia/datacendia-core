/**
 * NFL Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for American football governance.
 * Access: /sandbox/nfl (Key: NFL-26)
 *
 * @module pages/sandbox/configs/nfl
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'NFL',
  accessKey: 'NFL-26',
  sessionKey: 'nfl-sandbox-unlocked',

  accent: 'blue',
  accentColor: 'text-blue-400',
  accentHover: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
  ringColor: 'focus:ring-blue-500/30',
  borderColor: 'border-blue-500/30',
  gradientFrom: 'from-blue-600/20',
  gradientTo: 'to-blue-900/20',

  footerNote: '200 regulatory scenarios mapped for the NFL · Full architecture document available on request',

  scenarios: [
    // SCENARIO 1 — CONCUSSION PROTOCOL: CTE CRISIS GOVERNANCE
    {
      id: 'concussion-cte',
      title: 'Concussion Protocol — CTE Crisis Governance',
      subtitle: '$1B settlement · Tua Tagovailoa precedent · Independent neurologist · Class action defence',
      banner: 'Simulating a game-day concussion protocol where AI impact detection flags a franchise quarterback for evaluation during a playoff game. The platform must prove the protocol was followed regardless of game stakes.',
      risk: 'Critical',
      scenarioNum: 'Concussion',
      icon: 'shield-check',
      color: 'text-blue-400',
      agents: [
        { id: 'neuro', name: 'Neurological Agent', role: 'AI Impact Detection & Concussion Assessment', icon: '🧠', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal-nfl', name: 'Legal Agent', role: 'CTE Settlement Compliance & Class Action Defence', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'unc', name: 'UNC Agent', role: 'Unaffiliated Neurotrauma Consultant Independence', icon: '🏥', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'commercial-nfl', name: 'Commercial Agent', role: 'Broadcast & Franchise Revenue Impact', icon: '📊', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'AWS Impact Detection', status: 'connected', type: 'Helmet Sensor AI', icon: 'cpu', detail: 'QB hit: 98G rotational force — flagged for evaluation' },
        { name: 'Concussion Protocol System', status: 'connected', type: 'NFL-NFLPA Protocol', icon: 'shield', detail: 'Mandatory evaluation triggered — UNC notified' },
        { name: 'Broadcast Feed', status: 'connected', type: 'CBS/NBC Game Coverage', icon: 'eye', detail: 'Divisional Playoff — 42M viewers, QB is franchise player' },
        { name: 'CTE Settlement Database', status: 'syncing', type: 'Class Action Compliance', icon: 'database', detail: '$1.07B settlement: 20,000+ claims filed' },
      ],
      script: [
        { agentId: 'neuro', phase: 'phase1', type: 'warning', delay: 800, content: 'CONCUSSION FLAG — MANDATORY EVALUATION. AWS helmet sensor AI detected 98G rotational acceleration on the franchise QB during a blindside sack in Q3. Impact profile: (1) Rotational force: 98G — exceeds the 95G threshold by 3.2%, (2) Post-impact behaviour: QB slow to rise, braced on one knee for 4.2 seconds, (3) Helmet sensor accelerometer: peak linear acceleration 47G with 6,200 rad/s² angular velocity, (4) Historical comparison: this impact profile matches 89% of confirmed concussion events in the NFL\'s 2019-2025 sensor database. Under the 2022 amended concussion protocol (post-Tua Tagovailoa incident), this MANDATORY trigger requires immediate locker room evaluation by the Unaffiliated Neurotrauma Consultant (UNC). The QB cannot return without UNC clearance — no exceptions, regardless of game situation.' },
        { agentId: 'commercial-nfl', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Commercial context: This is a Divisional Playoff game with 42M viewers on CBS. The franchise QB is the league\'s most marketable player — estimated $180M in annual franchise value impact. The team is trailing by 3 points with 18 minutes remaining. If the QB is removed and doesn\'t return: (1) CBS ad revenue impact: $2.4M in reduced overtime probability, (2) Team elimination probability increases from 38% to 67% without the QB, (3) Next-round viewership impact if this team is eliminated: estimated $45M across conference championship. The Tua Tagovailoa precedent (2022): Tua returned from a suspected concussion against the Bills, then suffered a devastating concussion 4 days later against the Bengals. The NFL was excoriated for allowing the return. The amended protocol exists specifically to prevent commercial pressure from overriding safety.' },
        { agentId: 'unc', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. I am the Unaffiliated Neurotrauma Consultant — independent of both teams and the NFL. Locker room evaluation findings: (1) QB is oriented to person, place, time, and situation — PASS, (2) Immediate memory: 5/5 word recall — PASS, (3) Concentration: months in reverse order — PASS, (4) Balance: modified BESS test shows 0.8° additional sway vs baseline — BORDERLINE. (5) However: the QB reported "feeling foggy" for approximately 30 seconds post-impact, which resolved. Under the amended protocol, any "alteration in neurological function" — even transient — triggers the "no-go" criteria. The 30 seconds of fogginess IS an alteration. My clinical judgment says the QB has likely recovered. But the PROTOCOL says any alteration means no return. Protocol vs clinical judgment — this is the exact tension point.' },
        { agentId: 'legal-nfl', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. The $1.07B CTE settlement (2015, amended 2021) requires the NFL to demonstrate ongoing commitment to player safety protocols. Every concussion protocol decision is potential evidence in: (1) Future CTE class action — retired players\' attorneys will review every protocol deviation to establish pattern of negligence, (2) Individual player lawsuits — if this QB develops CTE symptoms, this specific evaluation becomes Exhibit A, (3) NFLPA grievance — the players\' union monitors protocol compliance and files grievances when commercial pressure appears to override safety. The Tua case cost the NFL $350K in fines and terminated 2 medical professionals. A repeat incident — especially in a playoff game with 42M witnesses — would be catastrophic. The protocol must be followed to the letter, and the evidence must be sealed in real-time.' },
        { agentId: 'neuro', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Concussion Protocol Evidence Protocol: (1) AWS impact data (98G, accelerometer readings) sealed at moment of detection — timestamped and immutable. (2) UNC evaluation findings sealed in real-time as each test is administered — not reconstructed after the decision. (3) The "fogginess" self-report is documented with exact timestamp and duration (30 seconds). (4) The UNC\'s protocol-based decision (no return due to "alteration in neurological function") is sealed with the specific protocol clause cited. (5) The QB\'s objection (if any) is documented. (6) The team medical staff\'s concurrence or disagreement is documented. The complete chain — from helmet sensor to no-return decision — is sealed in under 15 minutes. This is the evidence that proves the NFL chose player safety over a $45M+ playoff game.' },
        { agentId: 'legal-nfl', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT framework RESOLVED. The sealed protocol evidence is exactly what the CTE settlement requires. The UNC followed the protocol — clinical judgment said "probably recovered," but the protocol\'s bright-line rule said "no return." By documenting that the protocol overrode clinical judgment in favour of safety, the NFL demonstrates: (1) The amended protocol works as designed — no exceptions for star players or playoff games, (2) The UNC\'s independence is genuine — they made the unpopular call, (3) The evidence is real-time, not reconstructed. For future CTE litigation: this specific incident becomes a DEFENCE exhibit — proof that the NFL\'s concussion protocol prioritises safety over $45M in commercial value. The Regulator\'s Receipt transforms a controversial in-game decision into a governance showcase.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:nf10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'nf20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (AWS impact data + UNC evaluation + Protocol decision + Team response)',
        complianceLabel: 'Concussion Protocol',
        complianceValue: 'NO RETURN — PROTOCOL',
        complianceThreshold: 'Amended protocol: "alteration" = no-go',
        agents: ['Neurological Agent', 'Legal Agent', 'UNC Agent', 'Commercial Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'NFL Concussion Protocol — Safety Over $45M Playoff Revenue',
        guaranteeBody: 'This cryptographic bundle seals the complete concussion protocol: AWS helmet sensor data (98G impact), UNC locker room evaluation (5 tests + self-reported fogginess), protocol-based no-return decision, and commercial impact documentation ($45M+ playoff revenue sacrificed). Evidence proves the amended protocol works as designed — no exceptions for star players or playoff stakes. CTE class action defence exhibit.',
        evidenceChain: 'AWS helmet sensor (98G) → Mandatory evaluation trigger → UNC locker room assessment → "Fogginess" self-report (30s) → Protocol no-go decision → Team notification → QB removed from game → Post-game neurological follow-up → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate a playoff concussion protocol decision — proving the NFL prioritises player safety over $45M in commercial value when the helmet sensors flag danger.',
      phaseLabels: ['Impact Detection & Evaluation', 'Protocol vs Clinical Judgment', 'Evidence Sealing & Defence'],
    },

    // SCENARIO 2 — GAMBLING INTEGRITY: THE $1B BETTING PARTNERSHIP
    {
      id: 'betting-integrity',
      title: 'Gambling Integrity — The $1B Betting Partnership Tension',
      subtitle: 'DraftKings/FanDuel · State gaming commissions · Calvin Ridley precedent · Structural conflict',
      banner: 'Simulating the structural conflict where the NFL promotes $1B+ in gambling partnerships while simultaneously monitoring games for betting manipulation. AI detects a suspicious betting pattern involving an NFL player — triggering the tension between promotion and prosecution.',
      risk: 'Critical',
      scenarioNum: 'Betting',
      icon: 'alert-triangle',
      color: 'text-amber-400',
      agents: [
        { id: 'integrity-nfl', name: 'Integrity Agent', role: 'Betting Pattern Analysis & Anomaly Detection', icon: '🛡️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'legal-bet', name: 'Legal Agent', role: 'State Gaming Commissions & Federal Law', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'sponsor-bet', name: 'Sponsorship Agent', role: 'DraftKings/FanDuel Partnership Compliance', icon: '💰', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'fbi', name: 'Federal Liaison Agent', role: 'FBI Sports Betting Fraud Coordination', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Sportradar NFL Feed', status: 'connected', type: 'Betting Market Monitoring', icon: 'activity', detail: '340% anomaly in "First TD Scorer" prop — Week 14 game' },
        { name: 'DraftKings Compliance', status: 'connected', type: 'Partner Integrity Data', icon: 'database', detail: 'Suspicious account cluster: 7 accounts, same IP range' },
        { name: 'State Gaming Portal', status: 'connected', type: 'Multi-State Commission', icon: 'globe', detail: 'NJ, NV, PA gaming commissions notified' },
        { name: 'FBI IC3 Portal', status: 'syncing', type: 'Federal Investigation', icon: 'shield', detail: 'Wire Act / federal sports betting jurisdiction' },
      ],
      script: [
        { agentId: 'integrity-nfl', phase: 'phase1', type: 'warning', delay: 800, content: 'INTEGRITY ALERT. Sportradar AI monitoring detected a 340% anomaly in the "First Touchdown Scorer" prop bet market for a Week 14 game. The anomaly is concentrated in 7 accounts across 3 licensed sportsbooks (DraftKings NJ, FanDuel PA, BetMGM NV) — all 7 accounts share IP address ranges within a 2-mile radius in South Florida. The heavily-backed player: a wide receiver on Team A who averages 0.3 touchdowns per game but has been backed as first TD scorer at 28:1 odds across all 7 accounts. Total wager: $47K across accounts — payout if successful: $1.3M. Cross-reference: the wide receiver\'s social media shows him at a restaurant 3 days ago with an individual previously flagged in the Calvin Ridley investigation (2022). Pattern confidence: 91.4% correlation with known betting manipulation structures.' },
        { agentId: 'sponsor-bet', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. DraftKings is simultaneously: (1) the NFL\'s official betting partner ($200M/year, exclusive "Official Sportsbook" designation), (2) required by their partnership agreement to share suspicious activity reports with the NFL, (3) commercially incentivized to MAXIMIZE betting volume on NFL games, and (4) subject to NJ Gaming Commission oversight requiring them to report suspicious patterns. The structural conflict: DraftKings profits from the very betting activity they\'re required to report. In this case, DraftKings NJ flagged the 7-account cluster to the NFL within 2 hours — fulfilling their contractual obligation. But the question remains: how many similar patterns go unreported because they generate revenue? The NFL\'s $1B+ gambling partnership creates an inherent tension between promotion and prosecution that must be documented.' },
        { agentId: 'legal-bet', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Jurisdiction is immediately complex: (1) Bets placed in NJ, PA, and NV — 3 different state gaming commissions with independent investigation authority, (2) If the wide receiver communicated with the bettors across state lines, the federal Wire Act (18 U.S.C. § 1084) gives the FBI jurisdiction, (3) The Calvin Ridley precedent (2022): Ridley was suspended for the entire 2022 season for betting $1,500 on NFL games while on the non-football injury list. But Ridley bet on his OWN team to win — the legal question of a player facilitating OTHERS\' bets on specific prop outcomes is untested. (4) The NFL Personal Conduct Policy gives Commissioner Goodell broad disciplinary authority — but the NFLPA will challenge any suspension that exceeds Ridley precedent without proportionality evidence. We need sealed evidence before any enforcement action.' },
        { agentId: 'fbi', phase: 'phase2', type: 'analysis', delay: 2500, content: 'FBI Sports Betting Fraud assessment: The 7-account cluster with interstate coordination (NJ, PA, NV) creates federal jurisdiction under: (1) Wire Act — if bets were coordinated via phone/internet across state lines, (2) Sports Bribery Act (18 U.S.C. § 224) — if the player was bribed to influence game outcome, (3) Money laundering (18 U.S.C. § 1956) — if the $1.3M potential payout was structured to avoid reporting thresholds. However: the FBI will NOT act on betting pattern analysis alone. They require: corroborating evidence of communication between the player and the bettors, evidence of consideration (payment/benefit to the player), and evidence of intent to influence the game outcome. The social media photo is suggestive but not sufficient. The betting data must be preserved with chain-of-custody integrity for potential federal prosecution.' },
        { agentId: 'integrity-nfl', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia NFL Integrity Protocol: (1) Sportradar anomaly data sealed with ML-DSA-65 at moment of detection — the 340% anomaly, 7-account cluster, IP correlation, and social media cross-reference are timestamped and immutable. (2) DraftKings suspicious activity report sealed with their internal detection timestamp — proving they reported within 2 hours. (3) The evidence bundle is formatted simultaneously for: (a) NFL internal investigation (Commissioner authority), (b) NJ/PA/NV gaming commissions (state regulatory), (c) FBI (federal prosecution). (4) The structural conflict documentation — showing that DraftKings both profits from and reports on the activity — is sealed as governance evidence. (5) Game proceeds under enhanced monitoring with real-time betting pattern tracking. If the wide receiver scores the first TD, the sealed pre-game evidence becomes prosecution-ready instantly.' },
        { agentId: 'legal-bet', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The multi-format evidence protocol addresses all jurisdiction requirements simultaneously. The sealed chain-of-custody satisfies: (1) Federal Rules of Evidence for FBI prosecution, (2) NJ/PA/NV gaming commission evidentiary standards, (3) NFL-NFLPA collective bargaining arbitration standards. The structural conflict documentation is critical — it proves the NFL acknowledges the tension between gambling promotion and integrity, and has built a governance system to manage it. Regardless of whether the wide receiver is ultimately found to have participated: the NFL detected the anomaly pre-game, preserved evidence, notified authorities, and maintained game integrity. This is the Calvin Ridley case done right — proactive, not reactive.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:nf30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'nf40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Sportradar anomaly + DraftKings SAR + Social media + FBI referral)',
        complianceLabel: 'Integrity Status',
        complianceValue: 'PRE-GAME DETECTION',
        complianceThreshold: '340% prop bet anomaly — 7 accounts',
        agents: ['Integrity Agent', 'Legal Agent', 'Sponsorship Agent', 'Federal Liaison Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'NFL Gambling Integrity — Promotion vs Prosecution Documented',
        guaranteeBody: 'This cryptographic bundle seals the complete betting integrity investigation: Sportradar 340% anomaly (7 accounts, 3 states), DraftKings suspicious activity report, Calvin Ridley cross-reference, social media intelligence, and multi-jurisdiction evidence formatting (NFL/state/federal). Structural conflict between $1B gambling partnership and integrity monitoring is documented. Pre-game detection proves proactive governance.',
        evidenceChain: 'Sportradar 340% anomaly → 7-account cluster (NJ/PA/NV) → DraftKings SAR → Social media cross-reference → Calvin Ridley precedent → NFL investigation → State gaming notification → FBI referral → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will investigate a suspicious betting pattern — navigating the structural conflict between the NFL\'s $1B gambling partnerships and its obligation to protect game integrity.',
      phaseLabels: ['Anomaly Detection & Context', 'Jurisdiction & Structural Conflict', 'Multi-Format Evidence Sealing'],
    },

    // SCENARIO 3 — ROONEY RULE: DIVERSITY HIRING COMPLIANCE
    {
      id: 'rooney-rule',
      title: 'Rooney Rule — AI-Verified Genuine Consideration',
      subtitle: 'Flores lawsuit legacy · Head coach hiring · Token interview detection · EEOC compliance',
      banner: 'Simulating a head coach hiring cycle where the Rooney Rule requires minority candidate interviews. AI analysis must prove "genuine consideration" versus "token compliance" — the exact issue raised by Brian Flores\' landmark lawsuit against the NFL.',
      risk: 'High',
      scenarioNum: 'Diversity',
      icon: 'users',
      color: 'text-emerald-400',
      agents: [
        { id: 'diversity', name: 'Diversity Compliance Agent', role: 'Rooney Rule Monitoring & Interview Analysis', icon: '📋', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'legal-rooney', name: 'Legal Agent', role: 'Flores Settlement & Title VII Compliance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'bias-nfl', name: 'Cognitive Bias Agent', role: 'Hiring Bias Detection & Pattern Analysis', icon: '🧠', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'hr', name: 'HR Governance Agent', role: 'Interview Process & Candidate Evaluation', icon: '👥', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'NFL Diversity Portal', status: 'connected', type: 'Rooney Rule Compliance', icon: 'users', detail: 'Team X: HC vacancy — 6 candidates, 2 minority (Rooney Rule met)' },
        { name: 'Interview Analytics', status: 'connected', type: 'Candidate Evaluation AI', icon: 'activity', detail: 'Interview duration, question depth, follow-up engagement tracked' },
        { name: 'Flores Settlement Database', status: 'connected', type: 'Precedent & Compliance', icon: 'database', detail: 'Flores v. NFL: amended Rooney Rule requirements indexed' },
        { name: 'EEOC Guidelines', status: 'syncing', type: 'Federal Employment Law', icon: 'scale', detail: 'Title VII disparate treatment standards' },
      ],
      script: [
        { agentId: 'diversity', phase: 'phase1', type: 'analysis', delay: 800, content: 'Rooney Rule compliance assessment for Team X head coach vacancy. 6 candidates interviewed: (1) Candidate A — white, offensive coordinator, 14 years NFL experience, interviewed for 4.5 hours with ownership present, (2) Candidate B — Black, defensive coordinator, 12 years NFL experience, interviewed for 1.5 hours with GM only, (3) Candidate C — white, former HC, 8 years HC experience, interviewed for 5 hours with full ownership group + dinner, (4) Candidate D — Hispanic, offensive coordinator, 10 years NFL experience, interviewed for 2 hours with GM only, (5) Candidate E — white, college HC, 6 years HC experience, interviewed for 3.5 hours with ownership, (6) Candidate F — white, QB coach, 15 years NFL experience, interviewed for 3 hours with ownership. Rooney Rule technically met: 2 minority candidates interviewed. But interview QUALITY analysis raises critical flags.' },
        { agentId: 'bias-nfl', phase: 'phase1', type: 'warning', delay: 2500, content: 'COGNITIVE BIAS ALERT — TOKEN INTERVIEW PATTERN DETECTED. Quantitative analysis of interview quality reveals systematic disparity: (1) Average interview duration — minority candidates: 1.75 hours vs non-minority: 4.0 hours (56% shorter), (2) Ownership presence — minority candidates: 0/2 had ownership in the room vs non-minority: 3/4 had ownership present, (3) Follow-up engagement — minority candidates: 0 follow-up calls vs non-minority: Candidates A and C received same-day follow-up calls, (4) Dinner/social interaction — minority candidates: 0 vs Candidate C: hosted for dinner with ownership group. This pattern matches the Brian Flores allegation exactly: the minority interviews were shorter, less senior participants, no follow-up, and no social engagement. The statistical disparity has a p-value of 0.003 — there is a 99.7% probability this pattern is NOT random.' },
        { agentId: 'legal-rooney', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Under the amended Rooney Rule (post-Flores settlement, 2022): (1) Teams must interview at least 2 minority candidates for HC vacancies (met), (2) At least 1 minority candidate must be interviewed IN PERSON (met — both were in-person), (3) NEW: the NFL has authority to investigate whether interviews represented "genuine consideration." The Flores lawsuit alleged that the New York Giants conducted a "sham interview" with Flores after already deciding to hire Brian Daboll — Bill Belichick accidentally texted Flores congratulating Daboll BEFORE Flores\'s interview. If Team X hires Candidate A or C (the two who received 4.5+ hour interviews with ownership), Candidates B and D can argue their interviews were tokens. The statistical evidence (p=0.003) would support a Title VII disparate treatment claim under EEOC guidelines. We need documentation that EITHER explains the disparity OR corrects it before the hiring decision.' },
        { agentId: 'hr', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. The interview evaluation forms compound the problem. Candidate assessment scoring: (1) Candidate A: 47 data points evaluated across leadership, X\'s and O\'s, culture fit, media handling, and player relationships, (2) Candidate B: 12 data points — only scheme and record evaluated, (3) Candidate C: 52 data points — most comprehensive assessment, (4) Candidate D: 14 data points — scheme and "leadership philosophy" only. The evaluation depth disparity mirrors the interview duration disparity. Team X\'s interview committee appears to have pre-determined their preferred candidates (A and C) and conducted minimal evaluations of minority candidates to technically satisfy the Rooney Rule. The evaluation forms themselves are evidence of disparate treatment — the PROCESS was unequal, not just the outcome.' },
        { agentId: 'diversity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Rooney Rule Governance Protocol: (1) IMMEDIATE CORRECTION: Team X must conduct extended interviews for Candidates B and D with ownership present — matching the depth and duration of non-minority candidates. The remediation is sealed with timestamps proving it occurred before the hiring decision. (2) Going forward: ALL NFL HC/GM interviews are processed through standardised evaluation frameworks — same number of data points, same interview structure, same participant seniority. (3) Interview quality analytics (duration, participants, follow-up, evaluation depth) are automatically compared across candidates and flagged if disparity exceeds statistical thresholds. (4) The complete hiring process — from vacancy to offer — is sealed as a Regulator\'s Receipt. If a Flores-type lawsuit follows, the evidence proves either genuine consideration OR documented remediation.' },
        { agentId: 'legal-rooney', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The remediation-before-decision approach is legally sound. If Team X re-interviews Candidates B and D with proper depth and STILL selects a non-minority candidate, the sealed evidence shows: (1) Disparity was detected by AI, (2) Remediation was mandated and completed, (3) The final decision was made AFTER genuine consideration. This transforms a potential Flores-level lawsuit into a governance success story. The statistical analysis (p=0.003) proving token interview patterns is the most powerful tool the NFL has ever had for Rooney Rule enforcement — it makes "sham compliance" mathematically detectable. Every future HC hiring produces a Regulator\'s Receipt proving genuine consideration. The Flores legacy becomes a governance standard, not just a lawsuit settlement.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:nf50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'nf60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (6 candidate evaluations + Interview analytics + Bias detection + Remediation)',
        complianceLabel: 'Rooney Rule',
        complianceValue: 'REMEDIATION REQUIRED',
        complianceThreshold: 'p=0.003 token interview pattern',
        agents: ['Diversity Compliance Agent', 'Legal Agent', 'Cognitive Bias Agent', 'HR Governance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Rooney Rule — Genuine Consideration, Mathematically Proven',
        guaranteeBody: 'This cryptographic bundle seals the complete HC hiring process: 6 candidate interviews with duration, participant, follow-up, and evaluation depth analytics. Token interview pattern detected (p=0.003). Remediation mandated and documented. Final hiring decision made after genuine consideration of all candidates. Flores-proof governance — every interview is quantified, every disparity flagged, every remediation sealed.',
        evidenceChain: 'Vacancy posted → 6 candidates identified → Interview scheduling → Duration/participant tracking → Evaluation depth analysis → Token pattern detection (p=0.003) → Remediation mandate → Extended interviews → Final decision → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will audit an NFL head coach hiring process — using statistical analysis to detect token Rooney Rule compliance and mandate genuine consideration before the hiring decision.',
      phaseLabels: ['Interview Quality Analysis', 'Bias Detection & Legal Risk', 'Remediation & Evidence Sealing'],
    },
  ],
};

export default config;
