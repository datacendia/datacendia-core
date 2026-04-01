/**
 * Kavout Sandbox Config — Full Template
 *
 * 5 fully scripted multi-agent deliberation scenarios for quantitative AI governance.
 * Access: /sandbox/kavout (Key: KAV-26)
 */

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Kavout',
  accessKey: 'KAV-26',
  sessionKey: 'kavout-sandbox-unlocked',

  accent: 'orange',
  accentColor: 'text-orange-400',
  accentHover: 'from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600',
  ringColor: 'focus:ring-orange-500/30',
  borderColor: 'border-orange-500/30',
  gradientFrom: 'from-orange-600/20',
  gradientTo: 'to-orange-900/20',

  footerNote: '205,000+ governance scenarios mapped · Institutional-grade AI governance from hedge fund to retail · app.datacendia.com',

  scenarios: [
    // ─── SCENARIO 1: HEDGE FUND AUDIT TRAIL ────────────────────────────
    {
      id: 'kavout-hedge-fund-audit',
      title: 'K Score in Hedge Fund Trade — SEC Audit Trail',
      subtitle: 'SEC 2026 AI exam · $143.7M trade · Portfolio manager oversight · Fiduciary evidence',
      banner: 'A hedge fund uses Kavout\'s K Score to trigger a $143.7M buy on MSTR. The stock drops 40% after an earnings miss. The SEC examines the fund\'s trading decisions under 2026 AI priorities. Can the fund prove human portfolio managers reviewed the signal — or did they just execute algorithmic output?',
      risk: 'Critical',
      scenarioNum: 'HF-01',
      icon: 'trending-up',
      color: 'text-orange-400',
      agents: [
        { id: 'pm', name: 'Portfolio Manager Agent', role: 'Trade Decision & Independent Judgment', icon: '📊', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'kavout-ai', name: 'Kavout K Score Agent', role: 'Quantitative Signal Generation & Analysis', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'sec-exam', name: 'SEC Examiner Agent', role: 'Regulatory Examination Simulation', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'risk', name: 'Risk & Compliance Agent', role: 'Trade Supervision & Exposure Analysis', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Kavout K Score Engine', status: 'connected', type: 'Quantitative AI Signal', icon: 'cpu', detail: 'MSTR: K Score 9/10 — Buy signal · Neural network analysis of billions of data points' },
        { name: 'Order Management System', status: 'connected', type: 'Trade Execution', icon: 'activity', detail: '500,000 shares × $287.40 = $143.7M position · Executed T+0' },
        { name: 'SEC Examination Portal', status: 'connected', type: 'Regulatory Compliance', icon: 'shield', detail: '2026 AI Exam Priorities: algorithmic trading oversight flagged' },
        { name: 'Investment Committee Records', status: 'syncing', type: 'Governance Documentation', icon: 'users', detail: 'Committee sign-off: MISSING for positions > $50M' },
      ],
      script: [
        { agentId: 'kavout-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Kavout K Score generated for MSTR: 9 out of 10 — Strong Buy signal. The K Score processed billions of data points through proprietary neural networks: (1) Fundamental signals: Bitcoin treasury strategy, revenue growth from software business, institutional accumulation patterns. (2) Technical signals: Breakout above 200-day moving average, volume surge, options flow bullish. (3) Alternative data: Institutional 13F filings showing hedge fund accumulation, insider buying pattern detected. (4) Sentiment: Analyst upgrades, positive earnings revision trend, social media momentum. The K Score is an institutional-grade signal used by hedge funds managing billions. It identifies statistical patterns that predict outperformance. However: the K Score is a SIGNAL, not a TRADE DECISION. A $143.7M position based solely on a quantitative score without documented portfolio manager review represents algorithmic delegation of fiduciary duty.' },
        { agentId: 'sec-exam', phase: 'phase1', type: 'warning', delay: 2500, content: 'SEC 2026 EXAMINATION — CRITICAL FINDINGS. Under the 2026 AI examination priorities, I am asking this hedge fund three questions: (1) "When the K Score triggered a Buy on MSTR, did a human portfolio manager review the signal before execution?" — The OMS shows the trade was executed within 4 minutes of the K Score signal. No PM review is documented in that timeframe. (2) "For a $143.7M position, what was the investment committee process?" — Fund policies require IC sign-off for positions exceeding $50M. No IC minutes exist for this trade. (3) "After the stock declined 40%, what was the fund\'s review process?" — No post-trade review documented. No stop-loss analysis. No client communication about the loss. Finding: This fund appears to have executed a $143.7M trade based entirely on an AI signal without documented human oversight. This is precisely the pattern the SEC is targeting in 2026.' },
        { agentId: 'risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — CATASTROPHIC EXPOSURE. (1) TRADE LOSS: $143.7M position × 40% decline = $57.5M unrealised loss. This is the largest single-position loss in the fund\'s history. (2) SEC ENFORCEMENT: Operating an AI-driven trading strategy without documented human oversight violates the fund\'s own compliance manual and the Advisers Act. Estimated penalty: $5M-$15M. (3) INVESTOR CLAIMS: Fund LPs invested in a "quantitative discretionary" strategy — meaning human judgment guides AI signals. If the PM did not actually exercise discretion, investors have a misrepresentation claim. LP redemption risk: 40% of AUM ($2.1B × 40% = $840M in redemptions). (4) INSURANCE: The fund\'s E&O insurance requires documented trade supervision. A $57.5M loss from an undocumented AI-driven trade may not be covered. (5) FUND SURVIVAL: Combined exposure from loss + penalties + redemptions + insurance gap could force fund closure.' },
        { agentId: 'pm', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — TRADE SUPERVISION PROCESS FAILURE. I am the portfolio manager. Here is what SHOULD have happened: (1) K Score alert received — I review the signal, check the methodology, assess whether the neural network is picking up a genuine pattern or noise. Time: 30 minutes. (2) Position sizing — $143.7M is 6.8% of AUM. Our risk limits say max 5% per position. I should have reduced to $105M. Time: 15 minutes. (3) Investment committee — Positions over $50M require IC approval. I should have presented the K Score thesis, the risk factors, and the position size to the committee. Time: 2 hours (including prep). (4) Execution documentation — The trade rationale, PM review, IC approval, and risk limits should all be sealed before the order hits the market. What ACTUALLY happened: K Score said Buy, trade executed in 4 minutes, no documentation. With Datacendia: every step of my review process would be timestamped and sealed. The IC approval would be cryptographically proven. My 2.5 hours of work becomes audit evidence.' },
        { agentId: 'kavout-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Kavout K Score + CendiaSupervision Institutional Protocol: (1) SIGNAL CAPTURE: Every K Score signal is hashed at generation — the AI output is immutable evidence, separate from the PM\'s decision. (2) PM REVIEW HARD-STOP: For positions exceeding $10M, the K Score signal triggers a mandatory review workflow. The PM must document: signal reviewed, methodology understood, independent judgment applied. Trade cannot execute without PM seal. (3) POSITION SIZING ENFORCEMENT: Risk limits enforced architecturally — if the PM requests a position exceeding 5% of AUM, the system requires additional IC approval before execution. (4) IC DOCUMENTATION: Investment committee decisions are cryptographically sealed with attendee list, vote record, and dissent documentation. (5) POST-TRADE MONITORING: Automated P&L monitoring with mandatory review triggers at -10%, -20%, -30% drawdown levels.' },
        { agentId: 'risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The K Score + CendiaSupervision protocol prevents every failure mode: (1) No more 4-minute execution — PM review is mandatory and timestamped. (2) Position sizing enforced by architecture — $143.7M would have been flagged and reduced. (3) IC sign-off sealed before execution — no retroactive documentation. (4) Post-trade monitoring would have triggered mandatory review at -10% ($14.4M loss), not -40% ($57.5M). (5) SEC examination package generated automatically — showing PM review, IC approval, risk limits, and monitoring at every stage. The Kavout × Datacendia institutional proposition: Kavout\'s K Score identifies the opportunity. Datacendia proves the institution governed the decision. The AI found the trade — the humans proved they supervised it.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:kav1a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7',
        merkleRoot: 'kav1f7e6d5c4b3a2f7e6d5c4b3a2f7e6d5c4b3a2f7e6d5c4b3a2f7e6d5c4b3a2',
        merkleLabel: 'Merkle Tree Root (K Score 9/10 signal + PM review + IC approval + Position sizing + Post-trade monitoring)',
        complianceLabel: 'SEC Exam Status',
        complianceValue: 'AUDIT READY',
        complianceThreshold: 'PM review documented, IC sign-off sealed, risk limits enforced',
        agents: ['Portfolio Manager Agent', 'Kavout K Score Agent', 'SEC Examiner Agent', 'Risk & Compliance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'K Score Trade — PM-Reviewed, IC-Approved, Cryptographically Governed',
        guaranteeBody: 'This cryptographic bundle seals the complete institutional trade governance chain: K Score signal (hashed at generation), portfolio manager review and methodology assessment, investment committee approval with vote record, position sizing within risk limits, and post-trade monitoring triggers. SEC 2026 AI examination evidence complete.',
        evidenceChain: 'K Score 9/10 generated → Signal hashed → PM review documented → Position sized to risk limits → IC approval sealed → Trade executed → Post-trade monitoring active → Ed25519 + RFC 3161 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will simulate an SEC examination of a hedge fund\'s K Score-driven trade — demonstrating why institutional AI governance requires cryptographic evidence of human oversight.',
      phaseLabels: ['K Score Signal & Regulatory Gap', 'Trade Supervision Failure Analysis', 'Institutional Governance Protocol'],
    },

    // ─── SCENARIO 2: SATELLITE DATA MNPI ───────────────────────────────
    {
      id: 'kavout-satellite-mnpi',
      title: 'Satellite Imagery — Material Non-Public Information Risk',
      subtitle: 'MNPI risk · Alternative data · SEC Rule 10b-5 · Legal counsel review · Pre-earnings signal',
      banner: 'Kavout\'s K Score uses satellite imagery tracking retail foot traffic. Three weeks before Target\'s earnings, satellite data shows a 35% drop in parking lot activity. The K Score drops to 2/10. Is this alternative data — or material non-public information? The answer determines whether your trade is legal.',
      risk: 'Critical',
      scenarioNum: 'MNPI-02',
      icon: 'eye',
      color: 'text-red-400',
      agents: [
        { id: 'legal', name: 'Legal Counsel Agent', role: 'MNPI Assessment & Trading Restriction', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'kavout-ai', name: 'Kavout K Score Agent', role: 'Alternative Data Signal Analysis', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'compliance', name: 'Compliance Officer Agent', role: 'Trading Restriction & Surveillance', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'risk', name: 'Risk Assessment Agent', role: 'Enforcement Exposure & Legal Risk', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Kavout Alternative Data Feed', status: 'connected', type: 'Satellite Imagery', icon: 'cpu', detail: 'TGT: Parking lot activity -35% vs prior year · 3 weeks before earnings' },
        { name: 'SEC Enforcement Database', status: 'connected', type: 'Precedent Research', icon: 'shield', detail: 'Alternative data MNPI investigations: 12 active cases in 2025-2026' },
        { name: 'Trading Restriction System', status: 'connected', type: 'Compliance Controls', icon: 'lock', detail: 'TGT: Pre-earnings restricted list — PENDING legal review' },
        { name: 'Legal Review Queue', status: 'syncing', type: 'Counsel Sign-off', icon: 'file-text', detail: 'MNPI assessment required before any TGT trading permitted' },
      ],
      script: [
        { agentId: 'kavout-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Kavout K Score for TGT has dropped to 2/10 — Strong Sell signal. The primary driver of this score change is our satellite imagery alternative data feed. Analysis: (1) Satellite imagery of 847 Target store parking lots shows foot traffic declined 35% year-over-year for the past 3 weeks. (2) This is consistent with a significant revenue miss in the upcoming earnings report. (3) The satellite data is collected by a third-party provider (RS Metrics) from publicly available satellite imagery — it is NOT sourced from Target directly. (4) However: this data, when aggregated across 847 locations, may constitute a "mosaic" that reveals material information about Target\'s quarterly revenue before the company reports it. (5) Historical accuracy: In the past 8 quarters, K Score satellite signals for major retailers predicted the direction of earnings surprises 7 out of 8 times. The question is not whether the data is useful — it is whether trading on it is legal.' },
        { agentId: 'legal', phase: 'phase1', type: 'warning', delay: 2500, content: 'LEGAL ALERT — MNPI RISK ASSESSMENT REQUIRED. Under SEC Rule 10b-5 and the misappropriation theory of insider trading: (1) SATELLITE DATA AS MNPI: The SEC has not definitively ruled that aggregated satellite imagery constitutes MNPI. However, in 2022 the SEC subpoenaed several hedge funds about their use of alternative data providers. The legal landscape is evolving. (2) MOSAIC THEORY RISK: Individually, satellite images of parking lots are public. Aggregated across 847 locations with proprietary analysis, they may constitute information that a "reasonable investor" would consider important — the definition of "material." (3) TIMING: This signal is 3 weeks before earnings. The closer to earnings, the more likely the data reflects actual quarterly results, and the higher the MNPI risk. (4) PRECEDENT: No fund has been successfully prosecuted for satellite data trading. But several have been investigated, and the SEC has signalled this is a priority area. My recommendation: PAUSE all TGT trading until formal MNPI assessment is complete.' },
        { agentId: 'risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — TRADING MUST BE PAUSED. Even if satellite data is ultimately legal, the risk of trading on it without documented legal review is unacceptable: (1) SEC INVESTIGATION: If TGT misses earnings and our fund is short, the SEC will examine every trade. Without a documented legal opinion that satellite data is not MNPI, the fund cannot defend the trade. Investigation cost alone: $2M-$5M in legal fees. (2) INSIDER TRADING CHARGES: If the SEC concludes satellite data IS MNPI in this context, criminal charges are possible under Rule 10b-5. Individual liability for the PM. (3) FUND REPUTATION: Being investigated for insider trading — even if ultimately cleared — causes LP redemptions. Estimated AUM impact: 20-30% reduction. (4) DATA PROVIDER RISK: If the satellite data provider is found to be facilitating MNPI-based trading, Kavout\'s data feed may be suspended, affecting all K Score signals. Every minute we trade TGT without legal sign-off increases our exposure.' },
        { agentId: 'compliance', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — TRADING RESTRICTION ACTIVATED. As compliance officer, I am implementing immediate controls: (1) TGT added to the restricted list — no new positions, no changes to existing positions until legal review complete. (2) All K Score signals for stocks within 30 days of earnings that are primarily driven by satellite/alternative data are now flagged for legal review before trading. (3) Existing TGT positions: FROZEN. If we need to reduce for risk management, legal must approve first. (4) Documentation requirement: The legal counsel must provide a written opinion on whether the satellite data constitutes MNPI in this specific context (TGT, 3 weeks before earnings, 35% foot traffic decline). Without Datacendia: the trading restriction is an email. It can be overridden, forgotten, or disputed. With Datacendia: the restriction is cryptographically sealed with a timestamp. The legal review requirement is architecturally enforced. No trade can execute until counsel signs off.' },
        { agentId: 'kavout-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Kavout Alternative Data + CendiaSupervision MNPI Protocol: (1) ALTERNATIVE DATA FLAGGING: Every K Score signal identifies which data sources drove the score. When satellite imagery, geolocation, or other alternative data is the primary driver AND the stock is within 30 days of earnings, the signal is automatically flagged for legal review. (2) TRADING PAUSE ENFORCEMENT: Flagged signals trigger an architectural trading pause — not a policy memo. The OMS will not accept orders for flagged securities until legal counsel provides a signed MNPI assessment. (3) LEGAL OPINION SEAL: The legal counsel\'s MNPI assessment is cryptographically sealed — documenting the analysis, the conclusion, and the conditions under which trading is permitted. (4) AUDIT TRAIL: If the SEC investigates, the fund produces: alternative data source identified, legal review triggered, trading paused, MNPI assessment completed, trades executed only after counsel approval.' },
        { agentId: 'risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The alternative data MNPI protocol resolves all risks: (1) Legal review is mandatory and architecturally enforced — no PM can override the trading pause. (2) MNPI assessment is documented and sealed — the fund has a legal opinion BEFORE trading, not a retrospective justification. (3) SEC investigation defence is pre-built — every alternative data-driven trade has a complete audit trail from signal to legal review to execution. (4) Data source transparency — the fund can show exactly which alternative data influenced each trade decision. The Kavout × Datacendia alternative data proposition: Kavout uses cutting-edge data (satellite, geolocation, institutional flow) to generate alpha. Datacendia proves the fund governed the legal risk before trading on it. Alternative data is powerful — but only if you can prove you used it legally.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:kav2b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8',
        merkleRoot: 'kav2a8f7e6d5c4b3a8f7e6d5c4b3a8f7e6d5c4b3a8f7e6d5c4b3a8f7e6d5c4b3',
        merkleLabel: 'Merkle Tree Root (Satellite signal flagged + Trading paused + Legal MNPI assessment + Counsel sign-off + Execution approval)',
        complianceLabel: 'MNPI Review Status',
        complianceValue: 'LEGALLY CLEARED',
        complianceThreshold: 'Legal counsel MNPI assessment complete, trading restriction documented',
        agents: ['Legal Counsel Agent', 'Kavout K Score Agent', 'Compliance Officer Agent', 'Risk Assessment Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Alternative Data Trade — Legally Reviewed, Compliance-Cleared, Audit-Ready',
        guaranteeBody: 'This cryptographic bundle seals the complete alternative data governance chain: satellite imagery signal identified as primary K Score driver, trading automatically paused, MNPI legal assessment completed by counsel, trading restriction documented, and execution approved only after legal clearance. SEC Rule 10b-5 compliance evidenced.',
        evidenceChain: 'K Score 2/10 generated (satellite driver) → Alternative data flagged → TGT trading paused → Legal counsel notified → MNPI assessment completed → Trading restriction lifted → Execution permitted → Ed25519 + RFC 3161 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will simulate an MNPI risk assessment for satellite imagery-driven trading signals — demonstrating why alternative data governance requires legal review before execution.',
      phaseLabels: ['Alternative Data Signal & MNPI Risk', 'Trading Restriction & Legal Review', 'MNPI Governance Protocol'],
    },

    // ─── SCENARIO 3: KAI SCORE RETAIL REG BI ───────────────────────────
    {
      id: 'kavout-kai-retail-regbi',
      title: 'Kai Score Retail Launch — FINRA Reg BI Suitability',
      subtitle: 'FINRA Regulation Best Interest · Retail AI signals · Customer suitability · IRA protection',
      banner: 'Kavout\'s Kai Score gives SMCI a 9/10 for a 67-year-old conservative IRA customer. The institutional K Score works for hedge funds with risk budgets. Retail investors need protection. FINRA Reg BI says "best interest" — not just "suitable." Is a volatile small-cap AI Buy signal in the best interest of a retiree?',
      risk: 'High',
      scenarioNum: 'REG-03',
      icon: 'users',
      color: 'text-amber-400',
      agents: [
        { id: 'reg-bi', name: 'Reg BI Compliance Agent', role: 'Best Interest Standard & Customer Protection', icon: '⚖️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'kavout-ai', name: 'Kavout Kai Score Agent', role: 'Retail AI Signal & Customer Filtering', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'customer-care', name: 'Customer Care Agent', role: 'Client Profile Assessment & Suitability', icon: '👤', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'risk', name: 'Risk Assessment Agent', role: 'Volatility Mismatch & Portfolio Impact', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Kavout Kai Score API', status: 'connected', type: 'Retail AI Signal', icon: 'cpu', detail: 'SMCI: Kai Score 9/10 — Strong Buy signal for retail platform' },
        { name: 'Customer Profile System', status: 'connected', type: 'Account Records', icon: 'database', detail: 'Customer: Age 67, conservative, IRA account, $890K retirement savings' },
        { name: 'FINRA Reg BI Engine', status: 'connected', type: 'Best Interest Analysis', icon: 'shield', detail: 'Regulation Best Interest: enhanced suitability + best interest obligation' },
        { name: 'Volatility Analytics', status: 'syncing', type: 'Risk Metrics', icon: 'activity', detail: 'SMCI: 85% annualised volatility · Max drawdown -70% (2024)' },
      ],
      script: [
        { agentId: 'kavout-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Kavout Kai Score generated for SMCI: 9 out of 10 — Strong Buy signal. The Kai Score is our retail-tailored version of the institutional K Score. For SMCI: (1) Strong momentum signals — stock has tripled in 12 months on AI server demand. (2) Fundamental strength — revenue growth exceeding 100% YoY. (3) Institutional accumulation — hedge funds increasing positions. (4) Sentiment — extremely positive analyst consensus. The Kai Score is technically correct — SMCI has high probability of near-term outperformance. However: the Kai Score does not know this signal is being shown to a 67-year-old conservative IRA customer. SMCI has 85% annualised volatility and experienced a -70% drawdown in 2024. The institutional K Score users — hedge funds — can absorb this volatility. A retiree with $890K in an IRA cannot. The AI signal is right for the market. The question is whether it is right for THIS customer.' },
        { agentId: 'reg-bi', phase: 'phase1', type: 'warning', delay: 2500, content: 'FINRA REGULATION BEST INTEREST — VIOLATION DETECTED. Reg BI requires a BEST INTEREST standard, not just suitability. Analysis: (1) CARE OBLIGATION: The broker must have a reasonable basis to believe the recommendation is in the customer\'s BEST interest. A Kai Score 9/10 for SMCI does not satisfy this — it is a market signal, not a customer-specific assessment. (2) CUSTOMER PROFILE MISMATCH: Customer is 67, conservative risk tolerance, IRA account with $890K. SMCI has 85% volatility. A -30% decline (well within normal range) would reduce $890K by $267K — devastating for a retiree. (3) CONFLICT OF INTEREST: If the brokerage receives payment for order flow on SMCI trades, recommending a volatile stock to a conservative customer creates a conflict that Reg BI requires disclosure and mitigation. (4) DOCUMENTATION: Reg BI requires written documentation of the basis for the recommendation. "The AI Score was 9" is not sufficient documentation of best interest.' },
        { agentId: 'risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — CUSTOMER HARM IMMINENT. If SMCI is presented to this customer without Reg BI filtering: (1) VOLATILITY MISMATCH: Customer\'s risk tolerance is "conservative" (standard deviation tolerance: ~8%). SMCI\'s volatility is 85%. This is a 10x mismatch. (2) DRAWDOWN RISK: SMCI\'s max drawdown was -70% in 2024. Applied to $890K: potential loss of $623K. The customer would be left with $267K for retirement — a catastrophic outcome. (3) FINRA ARBITRATION: If the customer suffers losses and files a FINRA arbitration claim, the brokerage has no documentation that this recommendation was in the customer\'s best interest. Average FINRA arbitration award for unsuitable recommendations: $175K-$400K. (4) SYSTEMIC RISK: If the Kai Score is showing SMCI 9/10 to ALL customers regardless of profile, the brokerage may have thousands of conservative customers receiving inappropriate AI signals. Class action exposure: $50M+.' },
        { agentId: 'customer-care', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CUSTOMER PROFILE FILTER REQUIRED. Before any Kai Score signal reaches a customer\'s screen, it must pass through a suitability filter: (1) VOLATILITY CHECK: Customer risk tolerance "conservative" = max acceptable stock volatility of 25%. SMCI at 85% — BLOCKED. (2) CONCENTRATION CHECK: Even for an aggressive customer, SMCI should not exceed 5% of an IRA. For conservative: max 0% (blocked entirely) or 1% at most. (3) ACCOUNT TYPE CHECK: IRA accounts have special protection requirements. Speculative small-cap stocks in retirement accounts require enhanced suitability justification. (4) AGE-BASED CHECK: Customer is 67 — within 3 years of typical retirement. Portfolio should be shifting toward capital preservation, not adding 85%-volatility positions. Without Datacendia: the Kai Score shows SMCI 9/10 to everyone. The customer buys. With Datacendia: the signal is filtered BEFORE the customer sees it. Conservative customers see different signals than aggressive ones. And the filtering is documented.' },
        { agentId: 'kavout-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Kavout Kai Score + CendiaSupervision Retail Protocol: (1) CUSTOMER PROFILE INTEGRATION: Kai Score signals are filtered through customer profile before display. Conservative customers see only signals for stocks within their volatility tolerance. The AI signal still exists — it just does not reach inappropriate customers. (2) BEST INTEREST DOCUMENTATION: When a Kai Score signal IS shown to a customer and they act on it, the system automatically generates best interest documentation: why this stock fits this customer\'s profile, risk tolerance assessment, and concentration analysis. (3) SUITABILITY HARD-STOP: For IRA accounts with conservative profiles, stocks exceeding 40% volatility cannot appear as "Buy" signals regardless of Kai Score. (4) REG BI EVIDENCE PACKAGE: Per-customer documentation showing which AI signals were filtered, which were shown, and which were acted upon — complete Reg BI compliance evidence.' },
        { agentId: 'risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Kai Score Retail Protocol resolves all customer protection risks: (1) SMCI blocked for conservative IRA customer — 85% volatility never reaches the customer\'s screen. (2) Kai Score signals filtered by customer profile — same AI, different presentation based on suitability. (3) Best interest documentation generated automatically for every recommendation. (4) FINRA Reg BI compliance package ready per customer. The Kavout × Datacendia retail proposition: Kavout built the Kai Score to bring institutional-grade AI to retail investors. Datacendia ensures the AI respects that retail investors need different protections than hedge funds. Same AI brain — different governance for different customers.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:kav3c4d5e6f7a8b9c4d5e6f7a8b9c4d5e6f7a8b9c4d5e6f7a8b9c4d5e6f7a8b9',
        merkleRoot: 'kav3b9a8f7e6d5c4b9a8f7e6d5c4b9a8f7e6d5c4b9a8f7e6d5c4b9a8f7e6d5c4',
        merkleLabel: 'Merkle Tree Root (Kai Score 9/10 + Customer profile filter + Volatility block + Best interest documentation)',
        complianceLabel: 'Reg BI Status',
        complianceValue: 'CUSTOMER PROTECTED',
        complianceThreshold: 'Volatility mismatch blocked, best interest documented, customer profile filter active',
        agents: ['Reg BI Compliance Agent', 'Kavout Kai Score Agent', 'Customer Care Agent', 'Risk Assessment Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Kai Score — Customer-Filtered, Best-Interest-Documented, Reg BI Compliant',
        guaranteeBody: 'This cryptographic bundle seals the complete retail protection chain: Kai Score signal generated, customer profile filter applied, volatility mismatch detected and blocked, best interest analysis documented, and FINRA Reg BI compliance evidence generated per customer.',
        evidenceChain: 'Kai Score 9/10 generated (SMCI) → Customer profile loaded (age 67, conservative, IRA) → Volatility filter applied (85% > 25% threshold) → Signal BLOCKED → Alternative signals presented → Best interest documented → Ed25519 + RFC 3161 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will simulate a FINRA Reg BI suitability assessment — demonstrating why retail AI signals require customer-specific filtering and best interest documentation.',
      phaseLabels: ['Kai Score Signal & Customer Mismatch', 'Reg BI Violation & Customer Risk', 'Retail Protection Protocol'],
    },
  ],
};

export default config;
