/**
 * Burnley FC Sandbox Config
 *
 * 5 fully scripted multi-agent deliberation scenarios for Championship football governance.
 * Access: /sandbox/burnley (Key: BURNLEY-26)
 *
 * @module pages/sandbox/configs/burnley-fc
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Burnley FC',
  accessKey: 'BURNLEY-26',
  sessionKey: 'burnley-sandbox-unlocked',

  accent: 'purple',
  accentColor: 'text-purple-400',
  accentHover: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600',
  ringColor: 'focus:ring-purple-500/30',
  borderColor: 'border-purple-500/30',
  gradientFrom: 'from-purple-600/20',
  gradientTo: 'to-purple-900/20',

  footerNote: '100 regulatory scenarios mapped for Burnley FC · Full architecture document available on request',

  scenarios: [
    // SCENARIO 1 — POST-RELEGATION P&S COMPLIANCE
    {
      id: 'ps-compliance',
      title: 'Post-Relegation P&S — £39M Loss Threshold',
      subtitle: 'Parachute payments · £85M wage bill vs £50M revenue · Derby County precedent · 21-point deduction risk',
      banner: 'Simulating the critical financial governance challenge facing Burnley FC after relegation from the Premier League. AI financial modelling must track the club\'s position against the EFL Championship Profitability & Sustainability £39M loss threshold — while managing a Premier League-level wage bill on Championship revenue.',
      risk: 'Critical',
      scenarioNum: 'P&S',
      icon: 'trending-down',
      color: 'text-purple-400',
      agents: [
        { id: 'finance', name: 'Financial Agent', role: 'P&S Threshold Monitoring & Revenue Forecasting', icon: '📊', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'legal-ps', name: 'Legal Agent', role: 'EFL Compliance & Companies Act Governance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sporting', name: 'Sporting Agent', role: 'Squad Value & Promotion Probability Analysis', icon: '⚽', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'investor', name: 'ALK Capital Agent', role: 'LP Governance & Investment Return Analysis', icon: '🏦', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'EFL P&S Engine', status: 'connected', type: 'Financial Fair Play', icon: 'calculator', detail: 'Rolling 3-year loss: £31.2M of £39M threshold — 80% consumed' },
        { name: 'Parachute Tracker', status: 'connected', type: 'Revenue Forecasting', icon: 'trending-down', detail: 'Y1: £44.7M, Y2: £35.3M, Y3: £11.8M — cliff edge approaching' },
        { name: 'Wage Bill Monitor', status: 'connected', type: 'Squad Cost Analysis', icon: 'users', detail: '£85M PL wages vs £45M Championship sustainable level' },
        { name: 'ALK Capital Portal', status: 'syncing', type: 'LP Reporting', icon: 'briefcase', detail: 'Fund investors require quarterly governance reports' },
      ],
      script: [
        { agentId: 'finance', phase: 'phase1', type: 'warning', delay: 800, content: 'P&S THRESHOLD WARNING. Burnley FC\'s financial position post-relegation: (1) Revenue drop: ~£170M (final PL season) to projected £52M (Championship Y1 with parachute), (2) Current wage bill: £85M — 163% of projected revenue, (3) Rolling 3-year P&S calculation: £31.2M losses consumed of the £39M threshold, leaving only £7.8M headroom, (4) Parachute payment schedule: Y1 £44.7M, Y2 £35.3M, Y3 £11.8M — the cliff from Y2 to Y3 is the danger point. Without immediate wage bill restructuring, Burnley will breach the £39M threshold by Month 14 of Championship football. Derby County received a 21-point deduction for P&S breach in 2021/22 — that penalty would make promotion mathematically impossible. The wage bill must be reduced from £85M to approximately £45M within two transfer windows.' },
        { agentId: 'sporting', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Squad analysis identifies three tiers: (1) KEEP — 8 players who are both Championship-competitive AND have Premier League resale value: combined wages £22M, combined market value £48M. These are the promotion core. (2) LOAN OUT — 7 players on PL wages too high for Championship but retaining asset value: combined wages £28M, loan wage contributions projected at £16M (net saving £12M). (3) SELL — 6 players whose contracts exceed their value and who don\'t fit Championship requirements: combined wages £18M, projected sale income £14M. If we execute all three tiers: wage bill drops to £47M (close to sustainable), transfer income £14M improves P&S position, and loan contributions save £12M. But timing is critical — every month of delay at PL wages costs £3.5M against the P&S threshold.' },
        { agentId: 'investor', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. ALK Capital LP governance requires me to flag the investment risk. ALK acquired Burnley for approximately £170M in 2020. Post-relegation, the club\'s enterprise value has declined to approximately £80-100M — a 40-50% loss. LP investors are asking: (1) What is the minimum additional investment required to maintain Championship operations? Answer: £15-25M over 2 years, (2) What is the probability of promotion within the parachute payment window? AI model: 34% Year 1, 28% Year 2, 18% Year 3 — cumulative 62% within 3 years, (3) What is the going concern risk if promotion is not achieved by Year 3? When the parachute drops to £11.8M, revenue falls to approximately £35M — below the minimum viable operation cost of £40M. ALK Capital must decide NOW whether to commit additional investment or seek a sale. Delay destroys value in both directions.' },
        { agentId: 'legal-ps', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. Legal analysis of P&S risk: (1) The EFL P&S calculation allows "adjusted" losses for parachute payment clubs — but the adjustment is complex. Parachute payments are included in revenue but infrastructure investment can be excluded. Every excluded item must be documented with evidence. (2) Derby County precedent (2021): Derby argued their P&S breach was technical, not substantive. The EFL disciplinary panel rejected this — ANY breach triggers sanctions. The 21-point deduction was partially reduced to 12 on appeal, but only because Derby entered administration (which triggered a separate 12-point deduction). Burnley cannot rely on leniency. (3) Companies Act 2006: If the financial trajectory shows foreseeable insolvency without additional investment, directors have a legal duty to act. ALK Capital\'s investment decision is not just commercial — it\'s a legal obligation.' },
        { agentId: 'finance', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Championship Financial Governance Protocol: (1) REAL-TIME P&S DASHBOARD: Every financial decision (wage change, transfer, commercial deal) instantly recalculates the rolling 3-year P&S position. The dashboard shows headroom remaining and months until breach under current trajectory. (2) DUAL-SCENARIO MODELLING: Every material decision is modelled under both promotion and non-promotion scenarios. The club never makes a decision that is only viable if promotion is achieved. (3) PARACHUTE CLIFF PLANNING: The Y2→Y3 parachute drop (£35.3M → £11.8M) is modelled 18 months in advance. Every contract signed includes Championship sustainability clauses. (4) The complete financial governance chain — from P&S calculation to board decision to EFL submission — is sealed with ML-DSA-65 cryptographic evidence. If the EFL challenges any figure, the evidence is immutable.' },
        { agentId: 'legal-ps', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT framework RESOLVED. The dual-scenario approach addresses ALK Capital\'s investment concern: every decision document shows the outcome under promotion AND non-promotion, allowing LP investors to assess risk transparently. The sealed P&S evidence transforms EFL compliance from an annual audit into a continuous governance process. For Companies Act compliance: the real-time dashboard provides directors with contemporaneous evidence that they were monitoring financial health and acting on deterioration — the exact evidence needed for a directors\' duties defence. Burnley FC becomes the model for how a relegated club manages the financial cliff — not through panic, but through evidence-based governance that satisfies the EFL, the investors, and the law simultaneously.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bf10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bf20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (P&S calculation + Wage bill + Parachute schedule + Squad tiers + ALK Capital reporting)',
        complianceLabel: 'P&S Status',
        complianceValue: '£7.8M HEADROOM',
        complianceThreshold: '£39M rolling 3-year threshold',
        agents: ['Financial Agent', 'Legal Agent', 'Sporting Agent', 'ALK Capital Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Burnley FC P&S Governance — Relegation Financial Management',
        guaranteeBody: 'This cryptographic bundle seals the complete P&S compliance chain: rolling 3-year loss calculation (£31.2M of £39M consumed), wage bill restructuring plan (£85M → £45M), squad tier analysis (keep/loan/sell), parachute payment cliff modelling, and ALK Capital LP investment decision evidence. Dual-scenario (promotion/non-promotion) modelling ensures no decision is only viable under promotion. Derby County precedent acknowledged and mitigated.',
        evidenceChain: 'Revenue forecast → P&S threshold calculation → Squad tier analysis → Wage restructuring plan → Parachute cliff model → ALK Capital investment decision → EFL submission → Companies Act compliance → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate Burnley FC\'s post-relegation financial crisis — balancing the £39M P&S threshold, an £85M wage bill, and ALK Capital\'s investment decision against the Derby County 21-point deduction precedent.',
      phaseLabels: ['Financial Position Assessment', 'Investment Decision & Legal Risk', 'Governance Protocol & Evidence Sealing'],
    },

    // SCENARIO 2 — SCOUTING AI: CHAMPIONSHIP MARKET EFFICIENCY
    {
      id: 'scouting-ai',
      title: 'Scouting AI — Finding PL Quality at Championship Prices',
      subtitle: 'Brentford model · 40-league analysis · GBE points compliance · Data-driven recruitment',
      banner: 'Simulating the data-driven recruitment challenge: AI scouting identifies a target from the Danish Superliga who projects as a Championship top performer with Premier League upside. The deal must satisfy sporting analysis, P&S impact, GBE visa requirements, and ALK Capital board governance.',
      risk: 'High',
      scenarioNum: 'Scouting',
      icon: 'search',
      color: 'text-emerald-400',
      agents: [
        { id: 'scout-ai', name: 'Scouting AI Agent', role: 'Multi-League Performance Analysis & Valuation', icon: '🔍', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'finance-scout', name: 'Financial Agent', role: 'Transfer Cost & P&S Impact Modelling', icon: '📊', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'gbe', name: 'GBE Compliance Agent', role: 'Governing Body Endorsement Points Calculation', icon: '🛂', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'board', name: 'Board Governance Agent', role: 'ALK Capital Investment Committee Approval', icon: '🏛️', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'StatsBomb / Wyscout', status: 'connected', type: 'Performance Analytics', icon: 'activity', detail: 'Target: 24yo CM, Danish Superliga — 89th percentile progressive passing' },
        { name: 'TransferMarkt Valuation', status: 'connected', type: 'Market Intelligence', icon: 'database', detail: 'Market value: €3.5M — Burnley model projects €8-12M PL resale' },
        { name: 'FA GBE Calculator', status: 'connected', type: 'Visa Compliance', icon: 'shield', detail: 'GBE points: 12 of 15 required — exceptions panel may be needed' },
        { name: 'EFL P&S Engine', status: 'syncing', type: 'Financial Impact', icon: 'calculator', detail: 'Total deal cost (fee + wages + agent): £4.2M Y1 P&S impact' },
      ],
      script: [
        { agentId: 'scout-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'TARGET IDENTIFIED. AI scouting model analysed 14,200 central midfielders across 42 leagues and identified Target X: 24-year-old central midfielder from FC Midtjylland (Danish Superliga). Key metrics vs Championship average: (1) Progressive passing: 89th percentile — 8.2 progressive passes per 90 vs Championship median 5.1, (2) Defensive duels won: 74th percentile — adapts to defensive responsibility, (3) xG chain involvement: 82nd percentile — contributes to goals without being a finisher, (4) Sprint distance per 90: 91st percentile — can handle Championship physicality. The model projects Target X as a Championship top-20 performer at the position with 78% confidence. Premier League projection: top-40 performer with 62% confidence — meaning resale value of €8-12M within 2-3 years. Comparable: Brentford\'s Christian Nørgaard (signed from Fiorentina for €3M, now valued at €15M).' },
        { agentId: 'gbe', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG — GBE POINTS SHORTFALL. Post-Brexit, signing Target X requires FA Governing Body Endorsement. Points calculation: (1) Senior international caps (Denmark U-21, no senior caps): 0 points, (2) Club league quality (Danish Superliga, UEFA coefficient rank 12): 4 points, (3) Club continental competition (Europa Conference League group stage): 3 points, (4) Domestic league appearances (28/34 games started): 3 points, (5) Club league position (Midtjylland finished 2nd): 2 points. TOTAL: 12 points — the automatic threshold is 15 points. Options: (a) Wait for senior Danish call-up (unlikely before window closes), (b) Apply to the GBE Exceptions Panel with documented sporting justification, (c) Structure deal with a loan to a GBE-qualifying league first. Recommendation: Exceptions Panel application with AI performance evidence as sporting justification.' },
        { agentId: 'finance-scout', phase: 'phase2', type: 'analysis', delay: 2000, content: 'Total deal cost and P&S impact: (1) Transfer fee: £2.8M (Midtjylland asking £3.5M — agent indicates £2.8M acceptable), (2) Agent fee: £420K (FIFA regulations cap at 6% for buying club), (3) Wages: £18K/week (£936K/year) — 4-year contract total £3.74M, (4) Signing bonus: £150K (amortised over contract), (5) Promotion bonus: £500K (triggered only on promotion — probability-weighted at 34%: £170K P&S impact). Year 1 P&S impact: transfer amortisation (£700K) + wages (£936K) + agent (£420K) = £2.056M. Over the 4-year contract: total P&S cost £6.8M. Projected resale value: £8-12M — net P&S POSITIVE over the contract lifecycle. This is the Brentford model: buy at £2.8M, develop, sell at £10M = £7.2M P&S profit.' },
        { agentId: 'board', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISSENT LOGGED. ALK Capital investment committee requires: (1) Risk assessment: what if the scouting model is wrong? Danish Superliga → Championship adaptation failure rate is 31% based on historical data. If Target X fails, the £2.8M fee is a sunk cost and the £936K/year wages must be absorbed or settled. Worst case P&S impact: -£4.2M with no resale value. (2) Opportunity cost: £2.8M could alternatively fund 2 League One/League Two signings with proven English football experience and zero GBE risk. (3) Model validation: the scouting AI\'s prediction track record shows 72% accuracy on "Championship top-20" projections over the past 3 years — good but not certain. I require the AI model\'s confidence interval documentation and comparable transfer outcomes before approving.' },
        { agentId: 'scout-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Scouting Governance Protocol: (1) MODEL DOCUMENTATION: The AI scouting model\'s methodology is sealed — 42 leagues, 14,200 players, 47 performance metrics, regression model with 72% historical accuracy on Championship projections. The confidence interval for Target X is documented: 78% probability of top-20 Championship performance, 62% for PL top-40. (2) COMPARABLE EVIDENCE: 8 comparable Danish Superliga → Championship transfers sealed with outcomes. 5 of 8 succeeded (62.5%). Target X\'s metrics exceed all 5 successful comparables. (3) GBE EXCEPTIONS PANEL: Application sealed with AI performance evidence, comparable analysis, and sporting justification. The panel sees data-driven evidence, not subjective opinion. (4) CONTINGENCY PLAN: If Target X underperforms by Month 6 (below 40th percentile on key metrics), a pre-agreed loan exit clause activates — limiting downside to £1.4M.' },
        { agentId: 'board', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The sealed model documentation with historical accuracy rates, comparable outcomes, and contingency planning addresses ALK Capital\'s risk concerns. The 72% model accuracy + 62.5% comparable success rate + contingency clause creates acceptable risk-reward. Investment committee approval granted with conditions: (1) Performance review at Month 6 with documented criteria, (2) Loan exit clause must be in the contract, (3) Quarterly model accuracy reporting to ALK Capital board. The Regulator\'s Receipt seals the entire decision chain — from AI scouting model to board approval — creating evidence that this was a data-driven, governed decision. If it succeeds: proof the model works. If it fails: proof the methodology was sound and the risk was managed.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bf30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bf40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Scouting model + Performance data + GBE calculation + P&S impact + Board approval)',
        complianceLabel: 'Transfer Status',
        complianceValue: 'BOARD APPROVED',
        complianceThreshold: 'GBE exceptions panel required (12/15 pts)',
        agents: ['Scouting AI Agent', 'Financial Agent', 'GBE Compliance Agent', 'Board Governance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Burnley FC Scouting Governance — Data-Driven Recruitment',
        guaranteeBody: 'This cryptographic bundle seals the complete transfer decision: AI scouting model methodology (42 leagues, 14,200 players), Target X performance analysis (89th percentile progressive passing), GBE points calculation (12/15 — exceptions panel), P&S impact modelling (£2.056M Y1), ALK Capital board approval with conditions, and contingency planning. Evidence of the Brentford model in action — buy at £2.8M with documented £8-12M resale projection.',
        evidenceChain: 'AI model scan (42 leagues) → Target identification → Performance analysis → GBE calculation → P&S modelling → Agent fee compliance → Board presentation → ALK Capital approval → Contract structuring → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will evaluate a data-driven transfer target — balancing scouting AI projections, GBE visa compliance, P&S financial impact, and ALK Capital board governance.',
      phaseLabels: ['Target Analysis & GBE Assessment', 'Financial Modelling & Board Challenge', 'Governance Protocol & Approval'],
    },

    // SCENARIO 3 — MATCH INTEGRITY: CHAMPIONSHIP BETTING ANOMALY
    {
      id: 'betting-anomaly',
      title: 'Championship Betting Anomaly — No VAR, High Stakes',
      subtitle: 'Most bet-on league · No VAR safety net · Sportradar alert · FA/Gambling Commission',
      banner: 'Simulating a betting integrity investigation in the Championship — the most heavily bet-on league in world football. An anomaly is detected in a Burnley match involving unusual late-game betting patterns. Without VAR, the on-pitch evidence is limited to human observation.',
      risk: 'High',
      scenarioNum: 'Integrity',
      icon: 'alert-triangle',
      color: 'text-amber-400',
      agents: [
        { id: 'integrity', name: 'Integrity Agent', role: 'Betting Pattern Analysis & Match Intelligence', icon: '🛡️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'legal-int', name: 'Legal Agent', role: 'FA Regulations & Gambling Commission Liaison', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'ref-review', name: 'Match Review Agent', role: 'Video Analysis & Referee Report Correlation', icon: '📹', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'club-rep', name: 'Club Governance Agent', role: 'Player Conduct & Internal Investigation', icon: '🏟️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
      ],
      connectors: [
        { name: 'Sportradar Alert', status: 'connected', type: 'Betting Intelligence', icon: 'activity', detail: '280% anomaly in "next goal" market — 82nd minute, Burnley trailing 1-0' },
        { name: 'Licensed Bookmakers', status: 'connected', type: 'Market Data', icon: 'database', detail: '4 accounts, same device fingerprint, backing opposition 2nd goal' },
        { name: 'Match Video Archive', status: 'connected', type: 'Video Analysis', icon: 'eye', detail: 'No VAR — broadcast footage + tactical camera only' },
        { name: 'FA Integrity Unit', status: 'syncing', type: 'Regulatory Body', icon: 'shield', detail: 'FA/Gambling Commission coordination protocol' },
      ],
      script: [
        { agentId: 'integrity', phase: 'phase1', type: 'warning', delay: 800, content: 'INTEGRITY ALERT. Sportradar AI detected a 280% betting anomaly in the "next goal" market during the 82nd minute of Burnley vs Opposition, with Burnley trailing 1-0. The anomaly: 4 accounts with the same device fingerprint placed bets totalling £8,200 on "Opposition next goal" at odds of 2.4 within a 90-second window. The 2nd goal was scored in the 85th minute — a defensive error by Burnley\'s centre-back who misjudged a routine clearance. Payout: £19,680. The Championship is the most heavily bet-on league in world football — more matches (552 per season), less scrutiny (no VAR), and lower player salaries create a higher manipulation risk profile than the Premier League.' },
        { agentId: 'ref-review', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Video analysis of the 85th-minute goal: (1) Burnley centre-back had 2.3 seconds to clear the ball — well within normal reaction time, (2) The clearance went directly to the opposition striker — the angle was unusual, almost deliberate, (3) Centre-back\'s body position was open when it should have been closed for a standard clearance, (4) Post-goal reaction: centre-back showed minimal frustration compared to teammates. However: without VAR, this is subjective analysis. Championship errors happen regularly — fatigue in the 85th minute, concentration lapses after trailing for 60 minutes. The video evidence alone is INCONCLUSIVE. We cannot distinguish match manipulation from a tired mistake based on footage alone. The betting pattern is the stronger evidence.' },
        { agentId: 'legal-int', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Jurisdiction and process: (1) FA Rule E5 — player participation in betting or match manipulation carries a minimum 6-month suspension up to a lifetime ban, (2) Gambling Commission — the 4 accounts with shared device fingerprint may indicate organised manipulation, which is a criminal offence under the Gambling Act 2005 (Section 42 — cheating), (3) The centre-back\'s betting account records must be checked — FA regulations prohibit ANY betting on football by registered participants, (4) Chain of association: we need to determine if any connection exists between the centre-back and the 4 account holders. Critical: the FA investigation and Gambling Commission criminal investigation must be coordinated but kept separate. Evidence gathered for FA disciplinary must also be admissible in criminal proceedings — different evidentiary standards apply.' },
        { agentId: 'club-rep', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISSENT LOGGED. As Club Governance Agent, I must protect the club\'s interests alongside the investigation: (1) The centre-back is a £4.5M asset with 2 years remaining on contract. Premature public accusation destroys his market value and the club\'s P&S position. (2) If the investigation is leaked before conclusion, Burnley faces reputational damage that affects sponsorship (3 deals worth £2.1M are in negotiation). (3) The player is entitled to due process — innocent until proven guilty. (4) However: if the club is found to have failed to report or cooperate, the FA can sanction the club directly. Burnley must cooperate fully while protecting confidentiality. The sealed evidence approach allows full cooperation without premature disclosure.' },
        { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Match Integrity Protocol: (1) BETTING DATA: Sportradar anomaly, 4-account cluster, device fingerprint, and timing data sealed at moment of detection. (2) VIDEO EVIDENCE: Multi-angle analysis of the defensive error with biomechanical comparison to the centre-back\'s previous 47 clearances this season — any deviation from normal movement pattern is documented. (3) PLAYER RECORDS: Centre-back\'s FA betting account declaration (or absence thereof) is cross-referenced. Social media and communication metadata (publicly available) checked for connections to account holders. (4) DUAL-TRACK EVIDENCE: One sealed bundle for FA disciplinary (balance of probability standard) and one for Gambling Commission/police (beyond reasonable doubt standard). The club\'s cooperation is documented and timestamped. (5) CONFIDENTIALITY: All evidence is sealed — no premature disclosure. The investigation proceeds without market or reputational damage until conclusion.' },
        { agentId: 'club-rep', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The sealed, confidential investigation protocol addresses the club\'s concerns: (1) Full cooperation is documented — protecting against FA sanctions for non-cooperation, (2) Confidentiality is maintained — protecting player value and sponsor negotiations, (3) Due process is preserved — the player is not prejudged. If the investigation clears the centre-back: the sealed evidence becomes a defence asset — proving Burnley took the alert seriously and cooperated fully. If manipulation is confirmed: the sealed pre-investigation evidence proves the club acted immediately and in good faith. The Championship\'s integrity problem — most bet-on, no VAR, lower salaries — makes this governance framework essential for every match, not just flagged incidents.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bf50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bf60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Sportradar anomaly + Video analysis + Betting accounts + FA/Gambling Commission)',
        complianceLabel: 'Integrity Status',
        complianceValue: 'INVESTIGATION ACTIVE',
        complianceThreshold: '280% betting anomaly — 4 linked accounts',
        agents: ['Integrity Agent', 'Legal Agent', 'Match Review Agent', 'Club Governance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Championship Betting Integrity — Confidential Investigation Protocol',
        guaranteeBody: 'This cryptographic bundle seals the complete integrity investigation: Sportradar 280% anomaly (4 accounts, same device fingerprint), video analysis of defensive error (inconclusive alone), dual-track evidence preparation (FA disciplinary + Gambling Commission criminal), and club cooperation documentation. Confidentiality maintained throughout — no premature disclosure.',
        evidenceChain: 'Sportradar 280% anomaly → 4-account cluster → Device fingerprint → Video analysis → Biomechanical comparison → Player records check → FA notification → Gambling Commission coordination → Club cooperation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will investigate a Championship betting anomaly — navigating the tension between match integrity, player rights, club commercial interests, and the reality that the Championship has no VAR safety net.',
      phaseLabels: ['Anomaly Detection & Video Review', 'Legal Framework & Club Interests', 'Dual-Track Investigation Protocol'],
    },

    // SCENARIO 4 — COGNITIVE BIAS: PROMOTION DESPERATION
    {
      id: 'promotion-bias',
      title: 'Cognitive Bias — "One More Signing" Promotion Trap',
      subtitle: 'Bolton/Derby/Sunderland precedent · Sunk cost fallacy · January window · P&S breach risk',
      banner: 'Simulating the most dangerous moment in Championship football: January of a promotion-chasing season. Burnley are 4th, 3 points off automatic promotion. The manager demands a £4M striker signing. AI detects that the decision is driven by cognitive bias — sunk cost fallacy and optimism bias — rather than rational analysis.',
      risk: 'High',
      scenarioNum: 'Bias',
      icon: 'brain',
      color: 'text-violet-400',
      agents: [
        { id: 'bias-det', name: 'Cognitive Bias Agent', role: 'Decision Quality Analysis & Bias Detection', icon: '🧠', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'finance-bias', name: 'Financial Agent', role: 'P&S Impact & January Window Analysis', icon: '📊', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sporting-bias', name: 'Sporting Agent', role: 'Promotion Probability Modelling', icon: '⚽', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'precedent', name: 'Precedent Agent', role: 'Historical Analysis — Failed Promotion Spending', icon: '📚', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Bias Detection Engine', status: 'connected', type: 'Decision Quality AI', icon: 'brain', detail: 'ALERT: 3 of 4 cognitive bias indicators triggered' },
        { name: 'EFL P&S Engine', status: 'connected', type: 'Financial Threshold', icon: 'calculator', detail: 'Proposed signing pushes P&S to £37.4M of £39M — 96% consumed' },
        { name: 'Promotion Probability Model', status: 'connected', type: 'xPoints Analysis', icon: 'trending-up', detail: 'Current: 34% auto promotion. With signing: 38%. Delta: +4%' },
        { name: 'Championship Precedent DB', status: 'syncing', type: 'Historical Analysis', icon: 'database', detail: 'Bolton (2012), Derby (2021), Sunderland (2017): overspend → collapse' },
      ],
      script: [
        { agentId: 'bias-det', phase: 'phase1', type: 'warning', delay: 800, content: 'COGNITIVE BIAS ALERT — 3 of 4 indicators triggered. The January transfer request (£4M striker, £35K/week wages) shows: (1) SUNK COST FALLACY: "We\'ve already spent £12M this season, we can\'t waste that investment by not getting over the line." The previous £12M spend is irrelevant to whether this signing improves outcomes — it\'s a sunk cost. (2) OPTIMISM BIAS: "This is the one signing that guarantees promotion." The promotion probability model shows the signing increases auto-promotion probability from 34% to 38% — a 4 percentage point improvement, NOT a guarantee. (3) ANCHORING: The manager is anchored to the league table position (4th, 3 points off 2nd) rather than the underlying performance data (xPoints suggests Burnley are over-performing by 4.2 points — regression is likely). (4) SOCIAL PROOF: "Every club in the top 6 is strengthening in January." This is herd behaviour, not evidence-based decision-making.' },
        { agentId: 'precedent', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Historical precedent analysis — Championship clubs that overspent chasing promotion: (1) BOLTON WANDERERS (2012): Spent £8M+ in January chasing promotion, failed to go up, entered administration in 2019 with £172M debt. (2) DERBY COUNTY (2018-2021): Spent £80M+ across 3 seasons chasing promotion, failed each time, received 21-point deduction for P&S breach, entered administration 2021. (3) SUNDERLAND (2017-2019): Three consecutive relegation-chasing overspends, dropped from Premier League to League One. (4) BLACKBURN ROVERS (2017): January spending pushed P&S to the limit, missed playoffs, faced years of financial recovery. Pattern: the "one more signing" mentality has a 73% failure rate in Championship January windows. Clubs that overspend in January and FAIL to achieve promotion face compounding financial damage.' },
        { agentId: 'finance-bias', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. P&S arithmetic: (1) Current rolling 3-year losses: £33.4M of £39M threshold (86% consumed). (2) Proposed signing Y1 impact: transfer amortisation £1M + wages £1.82M + agent £240K = £3.06M additional. (3) New P&S position: £36.46M — leaving only £2.54M headroom for the remaining 5 months of the season. (4) If Burnley are NOT promoted (66% probability based on the model), Year 2 Championship revenue drops further as parachute payments decrease. The P&S breach becomes almost certain in Year 2. (5) If we sign this striker AND miss promotion: the combined effect of the signing cost plus non-promotion revenue loss means P&S breach by Month 8 of next season — triggering potential points deduction in a SECOND consecutive Championship season. This is exactly the Derby County path.' },
        { agentId: 'sporting-bias', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — ALTERNATIVE ANALYSIS. The manager wants a £4M striker because Burnley have scored 2 goals fewer than the top 2. But: (1) xG analysis shows Burnley are creating 1.82 xG per game — the 2nd-best in the league. The finishing underperformance (1.54 actual goals vs 1.82 xG) is statistically likely to regress to the mean WITHOUT any signing. (2) The proposed striker\'s Championship xG contribution projects at +0.18 xG per game — meaningful but not transformative. (3) Alternative: promoting the academy striker (19, top scorer in PL2) costs £0 in transfer fees and £2K/week in wages. His U-21 xG per 90 projects favourably for Championship impact. (4) Second alternative: a free agent striker with Championship experience — £0 fee, £12K/week wages. Both alternatives achieve 70-80% of the proposed signing\'s impact at 5-15% of the P&S cost.' },
        { agentId: 'bias-det', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Cognitive Bias Governance Protocol: (1) BIAS DOCUMENTATION: The 3 triggered bias indicators are sealed with evidence. The board receives a "Decision Quality Report" alongside the sporting recommendation — they see both the manager\'s request AND the bias analysis. (2) ALTERNATIVE COMPARISON: The £4M signing, academy promotion, and free agent options are presented side-by-side with: promotion probability impact, P&S impact, and downside risk under non-promotion. (3) MANDATORY COOLING PERIOD: For any January signing that pushes P&S above 90% threshold, a 48-hour cooling period is enforced. The board must confirm the decision after reviewing all three options. (4) OVERRIDE ACCOUNTABILITY: If the board approves the £4M signing despite the bias alert, the override is sealed — documenting that the decision was made with full awareness of the cognitive bias risk and the Derby County precedent.' },
        { agentId: 'finance-bias', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT framework RESOLVED. The bias governance protocol doesn\'t prevent the signing — it ensures the decision is INFORMED rather than emotional. If the board reviews the Decision Quality Report, sees the 73% historical failure rate, considers the alternatives, and STILL approves the £4M signing — that\'s a governed decision with documented rationale. But if the board chooses the academy promotion or free agent alternative — achieving 70-80% of the impact at 5-15% of the P&S cost — that\'s the financial discipline that separates clubs that achieve sustainable promotion from clubs that follow Bolton, Derby, and Sunderland into crisis. The Regulator\'s Receipt seals whichever decision is made — protecting the board if it works AND if it doesn\'t.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bf70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bf80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Bias detection + Promotion probability + P&S impact + Precedent analysis + Board decision)',
        complianceLabel: 'Decision Quality',
        complianceValue: '3/4 BIAS INDICATORS',
        complianceThreshold: 'P&S at 96% if signing approved',
        agents: ['Cognitive Bias Agent', 'Financial Agent', 'Sporting Agent', 'Precedent Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Championship Transfer Governance — Bias Detection & Informed Decision',
        guaranteeBody: 'This cryptographic bundle seals the complete transfer decision quality analysis: 3 cognitive bias indicators (sunk cost, optimism, anchoring), promotion probability modelling (+4% with signing), P&S impact (£36.46M of £39M), Bolton/Derby/Sunderland precedent analysis (73% failure rate), and alternative options (academy, free agent). Board decision documented with full awareness of bias risk.',
        evidenceChain: 'Manager request → Bias detection (3/4 triggers) → Promotion probability model → P&S threshold analysis → Historical precedent (73% failure) → Alternative options → Board Decision Quality Report → 48-hour cooling period → Final decision → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will challenge a January transfer request — detecting cognitive bias, modelling promotion probability, and presenting the Derby County precedent to ensure Burnley\'s board makes an informed decision rather than an emotional one.',
      phaseLabels: ['Bias Detection & Precedent Analysis', 'P&S Impact & Alternatives', 'Decision Quality Protocol'],
    },

    // SCENARIO 5 — CONCUSSION PROTOCOL: PLAYER SAFETY
    {
      id: 'concussion-safety',
      title: 'Concussion Protocol — Duty of Care vs Promotion Stakes',
      subtitle: 'Jeff Astle Foundation · CTE class action · No permanent concussion sub in Championship · PFA welfare',
      banner: 'Simulating a concussion assessment during a crucial promotion run-in match. The captain suffers a head collision in the 70th minute with the score level. AI concussion detection flags the incident — but the manager wants to keep the captain on the pitch for the final 20 minutes of a must-win game.',
      risk: 'Critical',
      scenarioNum: 'Safety',
      icon: 'heart-pulse',
      color: 'text-red-400',
      agents: [
        { id: 'medical', name: 'Medical Agent', role: 'AI Concussion Detection & Assessment', icon: '🏥', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'legal-conc', name: 'Legal Agent', role: 'Duty of Care & CTE Litigation Defence', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'manager', name: 'Sporting Agent', role: 'Match Context & Tactical Impact', icon: '⚽', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'welfare', name: 'Player Welfare Agent', role: 'PFA Standards & Long-Term Health', icon: '💚', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'AI Concussion Detection', status: 'connected', type: 'Video + Sensor Analysis', icon: 'cpu', detail: 'Head collision: biomechanical analysis shows 72G impact — borderline' },
        { name: 'FA Concussion Protocol', status: 'connected', type: 'Medical Standards', icon: 'shield', detail: 'Mandatory 3-minute assessment triggered — clock stopped' },
        { name: 'Match Context', status: 'connected', type: 'Competition Analysis', icon: 'trophy', detail: 'Must-win: 1 point from playoffs, captain is defensive organiser' },
        { name: 'PFA Welfare Database', status: 'syncing', type: 'Player History', icon: 'heart', detail: 'Captain: 1 previous concussion (14 months ago) — return protocol documented' },
      ],
      script: [
        { agentId: 'medical', phase: 'phase1', type: 'warning', delay: 800, content: 'CONCUSSION ASSESSMENT TRIGGERED. AI biomechanical analysis of the 70th-minute head collision: (1) Impact force: estimated 72G — below the 95G threshold for automatic removal but within the "assessment required" range (60-95G), (2) Post-impact: captain was down for 8 seconds, appeared disoriented for approximately 3 seconds after standing, then seemed to recover, (3) Previous history: 1 documented concussion 14 months ago with full return-to-play protocol completed. FA concussion protocol: a 3-minute off-pitch assessment is MANDATORY for any suspected head injury. The captain must leave the pitch for assessment — this is non-negotiable regardless of match context. The manager is requesting the captain be assessed quickly and returned. Medical ethics require the assessment to be thorough, not fast.' },
        { agentId: 'manager', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Match context: Burnley are drawing 0-0 in a must-win game. If Burnley fail to win, they drop out of the playoff positions with 3 games remaining. The captain is the defensive organiser — without him, the defensive structure has conceded an average of 1.4 goals per game this season vs 0.6 with him. If the captain is removed: (1) Burnley\'s probability of conceding in the remaining 20 minutes increases from 28% to 51%, (2) The replacement centre-back has made 3 Championship appearances this season, (3) The tactical impact extends beyond the individual — the entire defensive line loses its communication anchor. I understand the protocol must be followed. But I need this assessment to be ACCURATE, not precautionary. If the captain passes the assessment, he must be allowed to return.' },
        { agentId: 'legal-conc', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The legal landscape for concussion in English football: (1) The Jeff Astle Foundation has documented CTE in former professional footballers. Astle died of CTE at 59 — his family\'s campaign changed the conversation. (2) A class action by former professional footballers against the FA, Premier League, and EFL is ACTIVE — alleging failure to protect players from repeated head trauma. (3) If the captain is returned to play after a borderline assessment and suffers a second impact: (a) Burnley FC faces individual negligence claim, (b) The club becomes a named defendant in the class action, (c) The medical staff face personal liability and GMC investigation. (4) The captain\'s previous concussion 14 months ago is an AGGRAVATING factor — repeated concussion increases CTE risk exponentially. The 72G impact is borderline, but the previous history makes this a CLEAR CASE for removal. Protocol says: "when in doubt, sit them out."' },
        { agentId: 'welfare', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PLAYER WELFARE OVERRIDE. PFA welfare standards require me to advocate exclusively for the player\'s long-term health: (1) The captain is 29 years old with potentially 6-8 years of professional football remaining + 40+ years of post-career life. A career is 15 years; life is 80. (2) The PFA\'s research partnership with the University of Glasgow shows that professional footballers are 3.5x more likely to develop neurodegenerative disease than the general population. (3) The "borderline" classification is precisely the danger zone — medical staff feel pressure to return the player because the evidence isn\'t definitive. But "borderline" means RISK EXISTS. (4) The captain himself will likely want to play. Players consistently underreport symptoms to stay on the pitch. His self-assessment is unreliable in this context. The duty of care belongs to the club, not the player.' },
        { agentId: 'medical', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Concussion Governance Protocol: (1) HARD-STOP GUARDRAIL: For any player with a previous concussion history, a "borderline" assessment result (60-95G impact + ANY transient disorientation) triggers AUTOMATIC REMOVAL. This is not a medical judgment call — it\'s a protocol-based bright-line rule that removes the pressure from medical staff. (2) ASSESSMENT EVIDENCE: The complete 3-minute assessment is documented in real-time: cognitive testing, balance assessment, symptom checklist, and pupil response. Sealed with timestamp and medical staff identification. (3) PREVIOUS HISTORY INTEGRATION: The captain\'s previous concussion (14 months ago) is automatically cross-referenced, elevating the risk classification. (4) MANAGER NOTIFICATION: The manager receives a sealed notification that the decision is protocol-based, not precautionary — removing the basis for challenge. (5) POST-MATCH FOLLOW-UP: 24-hour and 48-hour reassessments are mandated and documented.' },
        { agentId: 'legal-conc', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT framework RESOLVED. The hard-stop guardrail for players with concussion history is the decisive governance innovation. It transforms a subjective medical judgment (under enormous match pressure) into an objective protocol decision. For the CTE class action: this specific incident becomes a DEFENCE exhibit — evidence that Burnley FC\'s concussion protocol prioritised long-term player welfare over a must-win playoff match. The sealed evidence chain (AI detection → assessment → protocol decision → manager notification → post-match follow-up) is exactly what the courts will require. The captain misses 20 minutes of one game. He doesn\'t miss 40 years of healthy life. That\'s the trade-off, and the Regulator\'s Receipt proves Burnley FC made the right choice.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bf90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bfa0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (AI impact analysis + 3-min assessment + Previous history + Protocol decision + Follow-up)',
        complianceLabel: 'Concussion Protocol',
        complianceValue: 'REMOVED — PROTOCOL',
        complianceThreshold: 'Borderline (72G) + previous history',
        agents: ['Medical Agent', 'Legal Agent', 'Sporting Agent', 'Player Welfare Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Burnley FC Concussion Governance — 20 Minutes vs 40 Years',
        guaranteeBody: 'This cryptographic bundle seals the complete concussion protocol: AI biomechanical analysis (72G impact), 3-minute off-pitch assessment, previous concussion history cross-reference (14 months ago), protocol-based automatic removal decision, manager notification, and mandated post-match follow-up. CTE class action defence exhibit — proving the club chose player welfare over a must-win playoff match.',
        evidenceChain: 'Head collision → AI biomechanical analysis (72G) → Mandatory 3-minute assessment → Previous history check → Hard-stop guardrail triggered → Captain removed → Manager notified → 24h follow-up → 48h follow-up → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate a concussion protocol decision during a must-win playoff match — proving that Burnley FC\'s duty of care overrides 20 minutes of football when a player\'s long-term health is at stake.',
      phaseLabels: ['Impact Detection & Match Context', 'Legal Risk & Player Welfare', 'Hard-Stop Protocol & Evidence Sealing'],
    },
  ],

        complianceScore: 92,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.129Z",
            "type": "analysis",
            "title": "System Assessment - Post-Relegation P&S — £39M Loss Threshold",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Burnley Fc completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.129Z",
            "type": "warning",
            "title": "Privacy Compliance - Post-Relegation P&S — £39M Loss Threshold",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Burnley Fc completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.129Z",
            "type": "dissent",
            "title": "Security Risk - Post-Relegation P&S — £39M Loss Threshold",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Burnley Fc completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.129Z",
            "type": "proposal",
            "title": "Governance Framework - Post-Relegation P&S — £39M Loss Threshold",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Burnley Fc completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.129Z",
            "type": "resolution",
            "title": "Compliance Certified - Post-Relegation P&S — £39M Loss Threshold",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Burnley Fc completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]};

export default config;
