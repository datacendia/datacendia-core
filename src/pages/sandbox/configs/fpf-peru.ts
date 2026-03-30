/**
 * FPF Peru Sandbox Config
 *
 * 5 fully scripted multi-agent deliberation scenarios for Peruvian football governance.
 * Access: /sandbox/fpf-peru (Key: FPF-PERU-26)
 *
 * @module pages/sandbox/configs/fpf-peru
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'FPF Perú',
  accessKey: 'FPF-PERU-26',
  sessionKey: 'fpf-peru-sandbox-unlocked',

  accent: 'red',
  accentColor: 'text-red-400',
  accentHover: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
  ringColor: 'focus:ring-red-500/30',
  borderColor: 'border-red-500/30',
  gradientFrom: 'from-red-600/20',
  gradientTo: 'to-red-900/20',

  footerNote: '100 regulatory scenarios mapped for FPF Perú · Full architecture document available on request',

  scenarios: [
    // SCENARIO 1 — POST-CORRUPTION INSTITUTIONAL REBUILD
    {
      id: 'corruption-rebuild',
      title: 'Post-Lozano — Institutional Rebuild Under FIFA Scrutiny',
      subtitle: 'Criminal organisation charges · FIFA normalisation risk · Fiscalía cooperation · Governance reform',
      banner: 'Simulating the institutional governance crisis following the arrest of FPF President Agustín Lozano on charges of criminal organisation, money laundering, and bribery. FIFA\'s Normalisation Committee threat requires demonstrable, evidence-based reform — or Peru loses self-governance of its football.',
      risk: 'Critical',
      scenarioNum: 'Reform',
      icon: 'shield-check',
      color: 'text-red-400',
      agents: [
        { id: 'governance', name: 'Governance Agent', role: 'Institutional Reform & FIFA Compliance', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'legal-fpf', name: 'Legal Agent', role: 'Fiscalía Cooperation & Criminal Defence', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'fifa-rel', name: 'FIFA Relations Agent', role: 'Normalisation Committee Prevention', icon: '🌐', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'finance-fpf', name: 'Financial Agent', role: 'Anti-Money Laundering & Fund Tracing', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Fiscalía Portal', status: 'connected', type: 'Criminal Investigation', icon: 'shield', detail: 'Lozano + 6 officials: criminal organisation, money laundering, bribery' },
        { name: 'FIFA Governance Dashboard', status: 'connected', type: 'Normalisation Risk', icon: 'globe', detail: 'FIFA Article 8 assessment: "serious concern" — 90-day review window' },
        { name: 'FPF Financial Audit', status: 'connected', type: 'Forensic Accounting', icon: 'database', detail: '2019-2024 financial records under forensic review — $12M unaccounted' },
        { name: 'CONMEBOL Compliance', status: 'syncing', type: 'Confederation Standards', icon: 'check-circle', detail: 'CONMEBOL governance assessment: reform milestones required by Q2' },
      ],
      script: [
        { agentId: 'governance', phase: 'phase1', type: 'warning', delay: 800, content: 'INSTITUTIONAL CRISIS — FIFA NORMALISATION RISK. Following President Lozano\'s arrest in November 2024, FPF faces the most serious governance crisis in its 102-year history. The charges: (1) Criminal organisation (Código Penal Art. 317) — Lozano allegedly ran FPF as a personal enterprise, (2) Money laundering (Ley 27765) — broadcasting rights payments allegedly diverted through shell companies, (3) Bribery (Código Penal Art. 393) — commercial contracts allegedly awarded in exchange for personal payments. FIFA has placed FPF on a 90-day governance review under Article 8 of the FIFA Statutes. If FIFA determines that FPF cannot self-govern, a Normalisation Committee will be appointed — stripping Peruvian football of all autonomous decision-making. This has happened to CONCACAF (2015), AIFF India (2022), and AFF Afghanistan (2023). Peru must demonstrate reform within 90 days or lose control.' },
        { agentId: 'finance-fpf', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Forensic financial analysis of FPF accounts 2019-2024: (1) $12M in unaccounted expenditure identified across 47 transactions — primarily in broadcasting rights intermediary payments and "consultancy fees" to entities with no verifiable business operations, (2) FIFA Forward Programme funds ($6M/year): 3 development projects claimed as completed but physical inspection shows 2 were never built. Total misallocated Forward funds: estimated $4.2M, (3) Broadcasting rights: Liga 1 deal valued at $28M/year was tendered to a single bidder — Lozano\'s former business associate. Market analysis suggests fair value was $35-40M/year, meaning FPF (and therefore Peruvian clubs) lost $7-12M/year in revenue, (4) Agent commissions on national team commercial deals: 8 contracts show agent fees of 18-25% — well above the 5-10% market standard. The total financial damage to Peruvian football: estimated $40-60M over 5 years. Every dollar must be traced and documented for the Fiscalía and FIFA.' },
        { agentId: 'fifa-rel', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. FIFA\'s 90-day review creates a paradox: (1) FIFA requires EVIDENCE of institutional reform — not promises, not plans, but implemented changes with documentary proof. (2) But the Fiscalía investigation requires FPF to preserve evidence and NOT make changes that could be construed as evidence destruction. (3) If FPF reforms too aggressively (replacing all Lozano-era staff, restructuring financial systems), the Fiscalía may argue that evidence was destroyed in the reform process. (4) If FPF reforms too slowly (maintaining Lozano-era structures "for evidence preservation"), FIFA will conclude that reform is not genuine and appoint a Normalisation Committee. The governance challenge: reform VISIBLY enough to satisfy FIFA while preserving evidence COMPLETELY enough to satisfy the Fiscalía. These objectives appear contradictory — but Datacendia\'s sealed evidence approach resolves the paradox.' },
        { agentId: 'legal-fpf', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. The legal framework is uniquely complex: (1) Peruvian criminal law (Fiscalía jurisdiction): FPF must cooperate with the investigation, provide documents, and not obstruct. Failure to cooperate is itself a criminal offence. (2) FIFA Statutes (Article 8): FPF must demonstrate governance reform or face normalisation. FIFA\'s assessment is administrative, not judicial — different evidentiary standard. (3) CONMEBOL governance standards: FPF must meet confederation milestones to maintain eligibility for continental competitions. If normalised, Peruvian clubs could be excluded from Copa Libertadores/Sudamericana. (4) Peruvian association law: FPF\'s internal elections and governance must comply with national association regulations. The intersection of criminal law, FIFA governance, CONMEBOL compliance, and national association law creates a four-dimensional governance challenge that no Peruvian institution has ever faced.' },
        { agentId: 'governance', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Post-Corruption Governance Protocol: (1) EVIDENCE PRESERVATION + REFORM SIMULTANEOUSLY: Every Lozano-era document, transaction, and decision is sealed with ML-DSA-65 BEFORE any reform action. The sealed evidence cannot be altered — satisfying the Fiscalía\'s preservation requirement. Then reform proceeds with complete documentation — satisfying FIFA\'s reform requirement. The paradox is resolved: everything is preserved AND reformed. (2) FIFA REFORM DASHBOARD: Real-time evidence of reform milestones — new financial controls, transparent procurement, conflict-of-interest screening, electoral reform. FIFA can verify reform progress without relying on FPF\'s self-reporting. (3) FISCALÍA COOPERATION BUNDLE: All requested documents provided in sealed, timestamped format. FPF\'s cooperation is documented and provable. (4) CONMEBOL COMPLIANCE: Club licensing, competition integrity, and financial monitoring evidence produced automatically. (5) FORWARD FUND RECOVERY: The $4.2M in misallocated FIFA Forward funds is documented with evidence for FIFA\'s recovery process.' },
        { agentId: 'fifa-rel', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The "preserve then reform" approach resolves the FIFA/Fiscalía paradox. The sealed evidence gives FIFA confidence that reform is genuine (not cosmetic), while giving the Fiscalía confidence that nothing has been destroyed. For the 90-day FIFA review: the Reform Dashboard provides real-time evidence of 12 governance milestones — each sealed with timestamp and supporting documentation. FIFA has never seen this level of transparency from a federation under review. The precedent: if FPF demonstrates that Datacendia\'s governance platform can rebuild an institution after corruption, FIFA may recommend the platform to other federations facing similar crises. Peru\'s darkest governance moment becomes its innovation showcase — proving that transparent, evidence-based governance can rebuild trust faster than any normalisation committee.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:fp10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'fp20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Forensic audit + Fiscalía cooperation + FIFA reform milestones + CONMEBOL compliance)',
        complianceLabel: 'Governance Status',
        complianceValue: 'REFORM IN PROGRESS',
        complianceThreshold: 'FIFA Article 8 — 90-day review',
        agents: ['Governance Agent', 'Legal Agent', 'FIFA Relations Agent', 'Financial Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'FPF Perú — Post-Corruption Institutional Rebuild',
        guaranteeBody: 'This cryptographic bundle seals the complete institutional reform: forensic financial audit ($12M unaccounted, $4.2M Forward funds), Fiscalía cooperation documentation, FIFA reform milestone evidence (12 milestones tracked), CONMEBOL compliance, and the "preserve then reform" protocol that resolves the evidence preservation vs institutional reform paradox. Peru\'s governance crisis becomes its governance innovation.',
        evidenceChain: 'Lozano arrest → Forensic audit → Evidence preservation (ML-DSA-65) → Reform milestone 1-12 → FIFA Dashboard → Fiscalía cooperation → CONMEBOL compliance → Forward fund recovery → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate FPF Peru\'s post-corruption governance crisis — demonstrating to FIFA, the Fiscalía, and CONMEBOL that institutional reform and evidence preservation can happen simultaneously.',
      phaseLabels: ['Crisis Assessment & Forensic Audit', 'FIFA/Fiscalía Paradox', 'Preserve-Then-Reform Protocol'],
    },

    // SCENARIO 2 — LIGA 1 MATCH-FIXING: BETTING INTEGRITY
    {
      id: 'match-fixing',
      title: 'Liga 1 Match-Fixing — The Championship of Corruption Risk',
      subtitle: 'Low salaries · High betting volume · Alianza/Sport Boys precedent · Sportradar alert',
      banner: 'Simulating a match-fixing investigation in Liga 1 — where low player salaries, growing gambling markets, and weak enforcement create one of the highest manipulation risk profiles in world football. AI detects a suspicious result pattern across 3 consecutive matches involving a provincial club.',
      risk: 'Critical',
      scenarioNum: 'Integrity',
      icon: 'alert-triangle',
      color: 'text-amber-400',
      agents: [
        { id: 'integrity-fpf', name: 'Integrity Agent', role: 'Match Pattern Analysis & Betting Intelligence', icon: '🛡️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'legal-fix', name: 'Legal Agent', role: 'Peruvian Criminal Law & FIFA Disciplinary', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'betting', name: 'Betting Market Agent', role: 'Gambling Commission & Operator Intelligence', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'player-welfare', name: 'Player Welfare Agent', role: 'Salary Conditions & Vulnerability Assessment', icon: '💚', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'Sportradar Integrity', status: 'connected', type: 'Betting Intelligence', icon: 'activity', detail: 'Pattern alert: 3 consecutive suspicious results — provincial Club X' },
        { name: 'Asian Betting Markets', status: 'connected', type: 'Offshore Monitoring', icon: 'globe', detail: 'Unusual volume: $340K on exact scorelines across 3 matches' },
        { name: 'FPF Disciplinary System', status: 'connected', type: 'Federation Enforcement', icon: 'shield', detail: '2019 precedent: Alianza Lima match-fixing investigation indexed' },
        { name: 'Fiscalía Sports Crime', status: 'syncing', type: 'Criminal Investigation', icon: 'database', detail: 'Peruvian sports fraud jurisdiction — Gambling Act coordination' },
      ],
      script: [
        { agentId: 'integrity-fpf', phase: 'phase1', type: 'warning', delay: 800, content: 'PATTERN ALERT — 3 CONSECUTIVE SUSPICIOUS MATCHES. Sportradar AI has flagged Club X (provincial Liga 1 team) across 3 consecutive away matches: (1) Match 1: Club X lost 0-3, having led 0-0 at half-time. 3 goals in 12 minutes (55\', 62\', 67\'). Asian markets showed $95K on "over 2.5 goals second half" at 4.1 odds — placed 2 hours before kickoff. (2) Match 2: Club X lost 1-4. Leading 1-0 at 38\', then conceded 4 goals. $120K on exact score 1-4 at 28:1 — placed from a single account in Manila. (3) Match 3: Club X drew 2-2 after leading 2-0 at 70\'. Two identical defensive errors in 75\' and 82\'. $125K on "draw" after Club X went 2-0 up — odds shifted from 15:1 to 4:1 within 10 minutes. Pattern confidence: 94.7%. The same 3 Club X defenders were involved in critical errors across all 3 matches. Combined betting profit across the 3 matches: estimated $1.2M.' },
        { agentId: 'player-welfare', phase: 'phase1', type: 'analysis', delay: 2500, content: 'VULNERABILITY ASSESSMENT — WHY LIGA 1 IS HIGH-RISK. Club X player salary analysis: (1) Average monthly salary: $1,800 — below Peru\'s middle-class income threshold. (2) The 3 flagged defenders earn $1,200-$2,000/month. (3) Club X has 4 months of salary arrears — players have not been paid since November. (4) FPF\'s salary verification shows Club X self-certified "payments current" — but bank records (now subpoenaed) show no payments. When players earn $1,200/month and haven\'t been paid for 4 months, the financial incentive to accept match-fixing payments is enormous. A single fixed match payment of $5,000-$10,000 represents 3-8 months of salary. This is not sophisticated international crime — it\'s exploitation of vulnerable workers. The enforcement response must address both the crime AND the conditions that enabled it.' },
        { agentId: 'legal-fix', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Enforcement creates a jurisdiction conflict: (1) FPF Disciplinary: FPF can sanction players (bans), club (points deduction, relegation), and officials under its own regulations. Standard: balance of probabilities. (2) Peruvian Criminal Law: match-fixing may constitute fraud (Código Penal Art. 196) or organised crime (Art. 317) if a network is involved. Standard: beyond reasonable doubt. (3) MINCETUR (Gambling Regulator): Peru\'s gambling law is underdeveloped — online betting from offshore operators (Manila, Curaçao) falls outside Peruvian jurisdiction. The $340K in bets was placed on unregulated platforms. (4) FIFA Disciplinary Code: FIFA can impose global bans if the manipulation involves international betting networks. My dissent: FPF should NOT pursue criminal prosecution of the players without first addressing the salary arrears that created the vulnerability. Prosecuting exploited workers while ignoring the club\'s labour violations is unjust and will fail in court.' },
        { agentId: 'betting', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — OFFSHORE NETWORK IDENTIFIED. The betting pattern analysis reveals a structured operation: (1) Bets placed through 12 accounts across 4 offshore platforms (Manila, Curaçao, Malta, Isle of Man), (2) Account creation dates: all 12 accounts created within a 3-week window — suggesting coordinated setup, (3) Deposit sources: cryptocurrency (Bitcoin, USDT) — making traditional AML tracing difficult, (4) Withdrawal patterns: winnings converted to cash through peer-to-peer exchanges in Peru, Colombia, and Ecuador. This is NOT a local operation. The 3 Club X defenders are likely the lowest level of a regional match-fixing network that targets South American leagues with weak enforcement. Sportradar\'s global database shows similar patterns in Liga 2 Peru, Ecuadorian Serie B, and Bolivian División Profesional. The sealed evidence must be formatted for both national prosecution AND Interpol coordination.' },
        { agentId: 'integrity-fpf', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Liga 1 Integrity Protocol: (1) DUAL-TRACK RESPONSE: (a) ENFORCEMENT: Betting data, match video, and defensive error analysis sealed for FPF disciplinary AND Fiscalía criminal referral. The 3 matches are documented as a pattern, not individual incidents. (b) PREVENTION: Club X\'s salary arrears are documented as a systemic vulnerability. FPF mandates salary verification (bank records, not self-certification) as a licensing condition. (2) PLAYER PROTECTION: The 3 defenders are treated as both suspects AND victims. Their salary arrears, financial vulnerability, and potential coercion are documented. If they cooperate with the investigation, reduced sanctions are available — targeting the network, not just the players. (3) OFFSHORE COORDINATION: Evidence formatted for Interpol, CONMEBOL (regional pattern), and FIFA (global network). The sealed evidence has chain-of-custody integrity for international cooperation. (4) SYSTEMIC REFORM: Every Liga 1 club must provide monthly bank-verified salary evidence. Clubs with arrears are automatically flagged for enhanced integrity monitoring.' },
        { agentId: 'legal-fix', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The dual-track approach (enforcement + prevention) addresses the justice concern. Prosecuting vulnerable workers while ignoring the conditions that created their vulnerability would undermine FPF\'s integrity credibility — and fail in court. By documenting both the match-fixing AND the salary arrears, FPF demonstrates: (1) The crime is punished — players who fixed matches face sanctions, (2) The cause is addressed — clubs that don\'t pay salaries face licensing consequences, (3) The network is targeted — Interpol coordination goes after the offshore operators, not just the on-pitch actors. The Regulator\'s Receipt transforms a corruption scandal into a governance reform catalyst. Post-Lozano FPF proves it can investigate match-fixing while simultaneously reforming the conditions that enable it. This is exactly the evidence FIFA needs to see within the 90-day review.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:fp30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'fp40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (3-match pattern + Betting data + Salary arrears + Offshore network + Interpol referral)',
        complianceLabel: 'Integrity Status',
        complianceValue: 'NETWORK IDENTIFIED',
        complianceThreshold: '94.7% pattern confidence — 3 matches',
        agents: ['Integrity Agent', 'Legal Agent', 'Betting Market Agent', 'Player Welfare Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Liga 1 Match-Fixing — Enforcement + Prevention',
        guaranteeBody: 'This cryptographic bundle seals the complete integrity investigation: 3-match suspicious pattern (94.7% confidence), $340K offshore betting network (12 accounts, 4 platforms), Club X salary arrears documentation (4 months unpaid), player vulnerability assessment, and dual-track response (enforcement + systemic reform). Evidence formatted for FPF disciplinary, Fiscalía prosecution, and Interpol coordination.',
        evidenceChain: 'Sportradar 3-match alert → Betting pattern analysis → Offshore network mapping → Player salary verification → Vulnerability assessment → FPF disciplinary → Fiscalía referral → Interpol coordination → Salary reform mandate → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will investigate a Liga 1 match-fixing pattern — balancing enforcement against vulnerable players with systemic reform of the salary conditions that enable corruption.',
      phaseLabels: ['Pattern Detection & Vulnerability', 'Jurisdiction & Justice', 'Dual-Track Enforcement + Prevention'],
    },

    // SCENARIO 3 — ALTITUDE GOVERNANCE: PLAYING AT 3,400M+
    {
      id: 'altitude-safety',
      title: 'Altitude Governance — Player Safety at 3,400m+',
      subtitle: 'Cusco/Juliaca venues · FIFA altitude ban history · Cardiac risk · Acclimatisation protocols',
      banner: 'Simulating the player safety governance challenge unique to Peruvian football: Liga 1 matches played at extreme altitude (Cusco 3,400m, Juliaca 3,827m). AI must govern acclimatisation protocols, medical emergency response, and the evidence needed to defend altitude matches if FIFA revisits the ban.',
      risk: 'High',
      scenarioNum: 'Altitude',
      icon: 'mountain',
      color: 'text-cyan-400',
      agents: [
        { id: 'medical-alt', name: 'Medical Agent', role: 'Altitude Physiology & Cardiac Risk Assessment', icon: '🏥', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'legal-alt', name: 'Legal Agent', role: 'FIFA Altitude Regulations & Liability', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sporting-alt', name: 'Sporting Agent', role: 'Competitive Fairness & Acclimatisation', icon: '⚽', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'emergency', name: 'Emergency Response Agent', role: 'Medical Evacuation & Hospital Access', icon: '🚑', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Altitude Health Monitor', status: 'connected', type: 'Player Physiology', icon: 'heart', detail: 'SpO2 monitoring: visiting team average 89% at 3,400m (normal sea level: 96-99%)' },
        { name: 'FIFA Medical Database', status: 'connected', type: 'Altitude Research', icon: 'database', detail: '2007 altitude ban precedent indexed — Bolivia/Peru/Ecuador coalition' },
        { name: 'Hospital Access Map', status: 'connected', type: 'Emergency Infrastructure', icon: 'map-pin', detail: 'Cusco: 2 hospitals with cardiac capability within 15 min of stadium' },
        { name: 'Acclimatisation Protocol', status: 'syncing', type: 'Player Welfare', icon: 'clock', detail: 'Visiting team arrived 4 hours before match — minimum protocol: 24 hours' },
      ],
      script: [
        { agentId: 'medical-alt', phase: 'phase1', type: 'warning', delay: 800, content: 'ALTITUDE MEDICAL ALERT. Upcoming Liga 1 match at Estadio Garcilaso, Cusco (3,400m above sea level). Visiting team medical assessment: (1) SpO2 levels: team average 89% — reduced from sea-level normal of 96-99%. Three players below 87% (symptomatic range), (2) Heart rate: resting average elevated by 18% compared to sea-level baseline, (3) Two players reporting headache and nausea — classic acute mountain sickness (AMS) symptoms, (4) The team arrived 4 hours before match — FPF minimum protocol recommends 24 hours for altitude acclimatisation above 2,500m. The 4-hour arrival is commercially driven (fewer hotel nights) but medically inadequate. At 3,400m, atmospheric pressure is approximately 66% of sea level — players are performing at reduced oxygen capacity. This creates: (a) Increased cardiac workload, (b) Reduced aerobic capacity (15-25% decrease in VO2max), (c) Risk of altitude-related cardiac events, particularly in players with undiagnosed cardiac conditions.' },
        { agentId: 'sporting-alt', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Competitive fairness analysis: (1) Home team (Cusco FC) players are acclimatised — born and training at altitude. Their VO2max is adapted. (2) Visiting team (Lima-based): the 15-25% VO2max reduction creates a measurable competitive disadvantage. Historical data: visiting sea-level teams at Cusco win 18% of matches vs 38% league average. (3) FIFA banned international matches above 2,500m in 2007 citing safety and fairness — Bolivia, Peru, and Ecuador lobbied successfully for reversal in 2008, arguing altitude is a natural geographical feature. (4) If a visiting player suffers a serious cardiac event at altitude, the debate reopens immediately. The 2007 ban exempted "existing stadia" but new altitude venues would face renewed challenge. FPF\'s position: altitude matches are culturally and geographically integral to Peruvian football — but ONLY if player safety protocols are robust and documented.' },
        { agentId: 'emergency', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Emergency response assessment for Cusco venue: (1) Hospital access: 2 hospitals with cardiac capability within 15 minutes of Estadio Garcilaso — ADEQUATE. (2) Ambulance provision: 1 ambulance at stadium, 1 on standby at nearest hospital — meets FIFA minimum. (3) However: if a cardiac event occurs at altitude, evacuation to sea-level facility may be required. Cusco airport: 20 minutes from stadium, but air evacuation at night is limited (no instrument landing). Lima hospital transfer: 1 hour by air, 18+ hours by road. (4) The 3 players with SpO2 below 87% are in the symptomatic range. If ANY player shows deteriorating SpO2 during the match, they must be withdrawn — but current Liga 1 protocols do not include continuous SpO2 monitoring during play. My dissent: 2 of the 3 symptomatic players should be EXCLUDED from the match roster as a precautionary measure. Playing at 87% SpO2 with headache and nausea is medically risky.' },
        { agentId: 'legal-alt', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — LIABILITY FRAMEWORK. If a visiting player suffers a cardiac event at altitude: (1) FPF liability: Did FPF enforce adequate acclimatisation protocols? The 4-hour arrival vs 24-hour recommendation creates a documented failure. (2) Visiting club liability: Did the club follow FPF\'s acclimatisation guidance? If FPF recommended 24 hours and the club arrived in 4 hours (to save hotel costs), the club bears primary responsibility. (3) FPF systemic liability: Does FPF\'s acclimatisation recommendation have enforcement teeth? If it\'s a "recommendation" rather than a "requirement," FPF cannot absolve itself of responsibility. (4) FIFA precedent: if a cardiac event occurs, FIFA will examine whether FPF\'s altitude governance was adequate. The 2007 ban debate reopens with Peru as the negative example. The evidence must show that FPF\'s protocols are medically robust, enforced, and documented — not just recommended and ignored.' },
        { agentId: 'medical-alt', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Altitude Safety Protocol: (1) MANDATORY (not recommended) 24-hour acclimatisation for all matches above 2,500m. Clubs that arrive late forfeit the match 3-0 — the financial incentive (saving hotel costs) is eliminated by the sporting penalty. (2) PRE-MATCH MEDICAL SCREENING: SpO2 and cardiac assessment for ALL visiting players. Players below 90% SpO2 are excluded from the match roster — hard-stop guardrail, no override. (3) IN-MATCH MONITORING: Wearable SpO2 monitors for all players. Real-time data fed to medical staff. Any player dropping below 85% SpO2 during play triggers mandatory substitution. (4) EMERGENCY PROTOCOL: Cardiac emergency plan per altitude venue — hospital mapping, evacuation routes, air ambulance availability — sealed and updated before every match. (5) FIFA DEFENCE EVIDENCE: Every altitude match produces a safety bundle: acclimatisation compliance, medical screening, in-match monitoring, and emergency readiness. If FIFA revisits the altitude ban, FPF has 200+ sealed safety bundles proving the protocols work.' },
        { agentId: 'emergency', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The mandatory acclimatisation + hard-stop SpO2 guardrails address every safety concern: (1) The 3 symptomatic players (SpO2 below 90%) are EXCLUDED from the match roster — protecting them from the altitude risk their own bodies are signalling. (2) The 4-hour arrival problem is eliminated — 24-hour acclimatisation is MANDATORY with forfeit penalty. (3) In-match SpO2 monitoring creates a real-time safety net during play. (4) The emergency protocol per venue ensures cardiac event response is planned, not improvised. For FIFA: this altitude safety governance is MORE rigorous than any football protocol worldwide. It transforms Peru\'s altitude "problem" into Peru\'s altitude "showcase" — proving that matches at 3,400m can be safe with proper governance. The sealed evidence bundles are Peru\'s strongest defence against any future altitude ban discussion.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:fp50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'fp60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (SpO2 screening + Acclimatisation compliance + In-match monitoring + Emergency protocol)',
        complianceLabel: 'Altitude Safety',
        complianceValue: '3 PLAYERS EXCLUDED',
        complianceThreshold: 'SpO2 < 90% hard-stop guardrail',
        agents: ['Medical Agent', 'Legal Agent', 'Sporting Agent', 'Emergency Response Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'FPF Altitude Governance — Safety at 3,400m',
        guaranteeBody: 'This cryptographic bundle seals the complete altitude safety protocol: pre-match SpO2 screening (3 players excluded below 90%), 24-hour mandatory acclimatisation enforcement, in-match wearable monitoring plan, cardiac emergency protocol per venue, and hospital access mapping. FIFA altitude ban defence evidence — proving Peruvian football governs altitude safety more rigorously than any other federation.',
        evidenceChain: 'Fixture scheduled (3,400m) → Acclimatisation mandate (24h) → Pre-match SpO2 screening → 3 players excluded (< 90%) → In-match monitoring active → Emergency protocol confirmed → Post-match medical review → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will govern player safety at 3,400m altitude — enforcing mandatory acclimatisation, excluding symptomatic players, and building the evidence that defends Peru\'s right to play at altitude.',
      phaseLabels: ['Altitude Medical Assessment', 'Liability & Emergency Response', 'Mandatory Safety Protocol'],
    },
  ],
};

export default config;
