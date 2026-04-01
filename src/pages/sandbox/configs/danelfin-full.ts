/**
 * Danelfin Sandbox Config — Full Template
 *
 * 5 fully scripted multi-agent deliberation scenarios for financial AI governance.
 * Access: /sandbox/danelfin (Key: DAN-26)
 */

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Danelfin',
  accessKey: 'DAN-26',
  sessionKey: 'danelfin-sandbox-unlocked',

  accent: 'emerald',
  accentColor: 'text-emerald-400',
  accentHover: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600',
  ringColor: 'focus:ring-emerald-500/30',
  borderColor: 'border-emerald-500/30',
  gradientFrom: 'from-emerald-600/20',
  gradientTo: 'to-emerald-900/20',

  footerNote: '205,000+ governance scenarios mapped · AI Score governance at the point of client advice · app.datacendia.com',

  scenarios: [
    // ─── SCENARIO 1: RIA FIDUCIARY GAP ─────────────────────────────────
    {
      id: 'danelfin-ria-fiduciary',
      title: 'AI Score in Client Recommendation — RIA Fiduciary Gap',
      subtitle: 'SEC 2026 Exam Priorities · Rule 206(4)-7 · Suitability documentation · Fiduciary duty',
      banner: 'A registered investment adviser uses Danelfin\'s AI Score (9/10 for NVDA) to recommend a stock for a 58-year-old client\'s retirement savings. The AI Score is a genuine strong signal — but the SEC\'s 2026 Exam Priorities specifically ask: "Show me your compliance policy for this AI tool and how this recommendation was suitable for THIS client." Danelfin cannot answer that. Datacendia can.',
      risk: 'Critical',
      scenarioNum: 'SEC-01',
      icon: 'shield',
      color: 'text-emerald-400',
      agents: [
        { id: 'advisor', name: 'RIA Compliance Agent', role: 'Fiduciary Duty & Suitability Analysis', icon: '⚖️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'danelfin-ai', name: 'Danelfin AI Agent', role: 'AI Score Generation & Signal Explanation', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'sec-examiner', name: 'SEC Examiner Agent', role: 'Regulatory Examination Simulation', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'risk', name: 'Risk Assessment Agent', role: 'Client Suitability & Exposure Analysis', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Danelfin AI Score API', status: 'connected', type: 'AI Stock Scoring', icon: 'cpu', detail: 'NVDA: AI Score 9/10 — 87% confidence · 10,000+ features analysed' },
        { name: 'Client Portfolio System', status: 'connected', type: 'Account Management', icon: 'database', detail: 'Client: Age 58, moderate risk, $2.1M retirement, 7-year horizon' },
        { name: 'SEC Exam Database', status: 'connected', type: 'Regulatory Intelligence', icon: 'shield', detail: '2026 Exam Priorities: AI tools in portfolio management flagged' },
        { name: 'Compliance Policy Engine', status: 'syncing', type: 'Written Procedures', icon: 'file-text', detail: 'Rule 206(4)-7 compliance policy for AI tool usage — MISSING' },
      ],
      script: [
        { agentId: 'danelfin-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Danelfin AI Score generated for NVDA: 9 out of 10. This score is based on analysis of 10,000+ features per stock per day across three dimensions: (1) Technical subscore: 8/10 — 600+ indicators show strong momentum, RSI, MACD convergence, and volume confirmation. (2) Fundamental subscore: 9/10 — 150 fundamental indicators confirm revenue growth, margin expansion, and earnings beat probability. (3) Sentiment subscore: 7/10 — 150 sentiment indicators show positive analyst consensus and social media momentum. The AI Score predicts an 87% probability of outperforming the market over the next 3 months. Our Explainable AI shows exactly which signals drove this score — no black boxes. However: the AI Score does NOT assess whether this stock is suitable for any specific client. The score is a market signal, not a fiduciary recommendation.' },
        { agentId: 'sec-examiner', phase: 'phase1', type: 'warning', delay: 2500, content: 'SEC 2026 EXAMINATION SIMULATION — FAIL. Under SEC 2026 Exam Priorities, examiners will specifically ask RIAs: (1) "What AI tools do you use in your investment process?" — Answer: Danelfin AI Score. (2) "Do you have a written compliance policy governing your use of this AI tool?" — Answer: NO POLICY EXISTS. This violates Rule 206(4)-7. (3) "How do you determine that an AI-generated signal is suitable for a specific client?" — Answer: NO DOCUMENTED SUITABILITY OVERLAY. The advisor checked the AI Score, saw 9/10, and recommended NVDA. There is no documented analysis of why a high-growth tech stock is appropriate for a 58-year-old moderate-risk client 7 years from retirement. (4) "Show me one example where you overrode the AI recommendation based on client-specific factors." — Answer: NO OVERRIDE HISTORY. The SEC cannot distinguish between the advisor exercising judgment and the advisor blindly following AI output.' },
        { agentId: 'risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — FIDUCIARY RISK QUANTIFIED. This recommendation has three compounding exposures: (1) SUITABILITY GAP: Client is 58, moderate risk tolerance, 7-year retirement horizon. NVDA has 45% annualised volatility. A 40% drawdown (which occurred in 2022) would reduce $2.1M to $1.26M — potentially unrecoverable before retirement. The AI Score does not factor client-specific risk. (2) CONCENTRATION RISK: If the advisor recommends NVDA based on the AI Score, and 30+ other clients get the same recommendation from the same signal, the firm has a concentration risk that the AI tool created but no human evaluated. (3) REGULATORY EXPOSURE: SEC enforcement actions for AI tool misuse in 2025 resulted in $2M-$8M penalties. Without documented suitability analysis, this firm is exposed to both SEC enforcement and client arbitration. Estimated exposure: $4.2M in regulatory risk + $12M in client claims.' },
        { agentId: 'advisor', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SUITABILITY OVERLAY REQUIRED. As the RIA, I need to document my independent judgment BEFORE this recommendation reaches the client. My actual process: (1) Review Danelfin AI Score: 9/10 for NVDA — 5 minutes. (2) Assess client suitability: Age 58, moderate risk, retirement in 7 years — does a volatile tech stock fit? I need to document WHY or WHY NOT — 20 minutes. (3) Position sizing: Even if suitable, what allocation? The AI Score says nothing about position size. I decide 3% of portfolio based on volatility — 10 minutes. (4) Override documentation: I actually DOWNGRADE the AI signal from "Strong Buy" to "Small Position" due to client age and risk profile — 5 minutes. Total: 40 minutes of documented advisor judgment. Without Datacendia, none of this is recorded. The SEC sees: AI said buy, advisor bought. With Datacendia: AI said 9/10, advisor assessed suitability, reduced position, documented rationale. My 40 minutes becomes fiduciary EVIDENCE.' },
        { agentId: 'danelfin-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Danelfin + CendiaSupervision Integration: (1) AI SCORE CAPTURE: Every Danelfin score is hashed at generation — the raw AI signal is immutable evidence, separate from the advisor\'s decision. (2) SUITABILITY HARD-STOP: Before any AI Score-influenced recommendation is documented, the advisor must complete a client-specific suitability assessment. The system will not let the recommendation proceed without it. (3) ADVISOR JUDGMENT OVERLAY: Every modification the advisor makes — position sizing, risk adjustment, signal override — is captured as a diff between what the AI recommended and what the advisor actually did. (4) SEC EXAM PACKAGE: One-click generation of examination evidence: AI tool compliance policy, per-client suitability documentation, advisor override history, and concentration risk analysis across all clients who received AI-influenced recommendations.' },
        { agentId: 'risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Danelfin + CendiaSupervision protocol resolves all quantified risks: (1) Suitability: Every AI Score-influenced recommendation now documents client-specific analysis — the 58-year-old gets a different treatment than a 30-year-old aggressive investor, even when the AI Score is the same. (2) Concentration: Firm-wide view of all clients receiving AI-influenced recommendations — concentration risk visible before it becomes a compliance event. (3) Regulatory: SEC exam package generated automatically — Rule 206(4)-7 compliance policy, per-client suitability, advisor override history. The examiner gets a complete answer. This is the Danelfin × Datacendia value proposition: Danelfin\'s AI Score identifies the opportunity. Datacendia proves the advisor exercised independent fiduciary judgment before acting on it. The AI picked the stock — the human proved they were in the loop.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:dan10a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
        merkleRoot: 'dan20f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1',
        merkleLabel: 'Merkle Tree Root (AI Score 9/10 + Client suitability assessment + Advisor override to 3% position + SEC exam package)',
        complianceLabel: 'SEC 2026 Exam Status',
        complianceValue: 'EXAM READY',
        complianceThreshold: 'Suitability documented, advisor override recorded, Rule 206(4)-7 policy adopted',
        agents: ['RIA Compliance Agent', 'Danelfin AI Agent', 'SEC Examiner Agent', 'Risk Assessment Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Danelfin AI Score — Advisor-Verified, Client-Suitable, SEC Exam Ready',
        guaranteeBody: 'This cryptographic bundle seals the complete fiduciary supervision chain: Danelfin AI Score (hashed at generation), client-specific suitability assessment, advisor judgment overlay (position sized from "Strong Buy" to 3% allocation), concentration risk analysis, and SEC 2026 examination evidence package. Rule 206(4)-7 compliance documented by architecture.',
        evidenceChain: 'Danelfin AI Score generated (9/10 NVDA) → Score hashed → Client profile assessed (age 58, moderate risk) → Suitability analysis documented → Advisor overrides position size → Concentration risk checked → SEC exam package generated → Ed25519 + RFC 3161 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate why Danelfin\'s AI Score needs fiduciary governance — proving that SEC 2026 exam readiness is architectural, not aspirational, when AI influences client investment recommendations.',
      phaseLabels: ['AI Score Generation & Regulatory Gap', 'Fiduciary Risk & Suitability Analysis', 'CendiaSupervision Integration'],
    },

    // ─── SCENARIO 2: MODEL DRIFT ───────────────────────────────────────
    {
      id: 'danelfin-model-drift',
      title: 'AI Score Drift — Model Retraining Impact on Client Positions',
      subtitle: 'FINRA Rule 4512 · Duty of care · Model monitoring · 47 client positions affected',
      banner: 'Danelfin retrains its AI model from v2.3.1 to v2.4.0. TSLA drops from AI Score 9 to AI Score 3 overnight. 47 clients hold positions based on the old score. The Advisers Act duty of care requires ongoing monitoring — but nobody flagged this.',
      risk: 'High',
      scenarioNum: 'MOD-02',
      icon: 'trending-up',
      color: 'text-amber-400',
      agents: [
        { id: 'model-gov', name: 'Model Governance Agent', role: 'AI Model Version Tracking & Change Detection', icon: '🔬', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'danelfin-ai', name: 'Danelfin AI Agent', role: 'Score Recalculation & Signal Update', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'advisor-duty', name: 'Duty of Care Agent', role: 'Client Position Review & Notification', icon: '⚖️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'risk', name: 'Risk Assessment Agent', role: 'Portfolio Impact & Compliance Exposure', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Danelfin Model Registry', status: 'connected', type: 'AI Model Versioning', icon: 'cpu', detail: 'Model v2.3.1 → v2.4.0 · Retraining completed · Score changes detected' },
        { name: 'Client Position System', status: 'connected', type: 'Portfolio Management', icon: 'database', detail: '47 client positions with Danelfin-influenced TSLA recommendations' },
        { name: 'FINRA Rule Engine', status: 'connected', type: 'Regulatory Compliance', icon: 'shield', detail: 'Rule 4512 suitability · Ongoing duty of care monitoring active' },
        { name: 'Advisor Alert System', status: 'syncing', type: 'Notification Service', icon: 'activity', detail: 'Pending: 47 advisor notifications for position review' },
      ],
      script: [
        { agentId: 'danelfin-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Danelfin model retrained from v2.3.1 to v2.4.0. The new model incorporates updated training data through Q1 2026. Significant score changes detected across 312 stocks. Most impactful change: TSLA AI Score dropped from 9/10 to 3/10. The score change is driven by: (1) Technical subscore dropped from 8 to 2 — momentum reversal after earnings miss, RSI oversold but declining, MACD bearish crossover. (2) Fundamental subscore dropped from 9 to 4 — margin compression, delivery miss, competitive pressure from Chinese EV manufacturers. (3) Sentiment subscore dropped from 8 to 3 — negative analyst revisions, social media sentiment shift. This is not a model error — it is a legitimate reassessment. But 47 clients hold TSLA positions that were recommended when the AI Score was 9/10.' },
        { agentId: 'model-gov', phase: 'phase1', type: 'warning', delay: 2500, content: 'MODEL CHANGE ALERT — GOVERNANCE GAP DETECTED. The model version change from v2.3.1 to v2.4.0 constitutes a material change in the AI tool that financial advisors rely on. Under model risk management principles (analogous to SR 11-7): (1) NO CHANGE LOG: The retraining did not produce a documented change log accessible to advisors using the scores. Advisors see the new score but do not know WHY it changed. (2) NO IMPACT ASSESSMENT: 47 client positions were influenced by the old model. No automated system flagged these positions for review when the model changed. (3) NO ADVISOR NOTIFICATION: The advisors who recommended TSLA based on AI Score 9 have not been notified that the score is now 3. They may still believe their recommendation is supported by the AI signal.' },
        { agentId: 'risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — DUTY OF CARE VIOLATION IN PROGRESS. Quantified exposure: (1) 47 clients hold TSLA positions recommended when AI Score was 9/10. Average position: $85,000. Total AUM at risk: $4M. (2) TSLA has declined 22% since the model change. Unrealised losses across 47 clients: approximately $880,000. (3) If advisors do not review these positions within a reasonable timeframe (24-48 hours), the firm faces a duty of care violation under the Advisers Act. The ongoing monitoring obligation means the advisor must respond to material changes in the basis for a recommendation. (4) FINRA Rule 4512 requires that customer account records reflect current suitability information. A recommendation based on AI Score 9 is no longer supported when the score is 3. The basis has changed — the documentation must change.' },
        { agentId: 'advisor-duty', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — MANDATORY POSITION REVIEW. As the duty of care agent, I am triggering a mandatory review for all 47 affected client positions. Each advisor must: (1) Acknowledge the AI Score change for TSLA (from 9 to 3) — timestamped acknowledgement required. (2) Review each affected client\'s position in light of the new score — is TSLA still suitable for this client? (3) Document their decision: HOLD (with rationale), REDUCE (with new target), or EXIT (with timeline). (4) Communicate with client if the recommendation has materially changed. Without Datacendia, this review is ad hoc — some advisors check, some don\'t, nothing is documented. With Datacendia: every advisor acknowledgement is sealed, every position review is timestamped, every client communication is recorded. The firm can prove it responded to the model change within hours, not weeks.' },
        { agentId: 'danelfin-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Danelfin Model Change + CendiaSupervision Protocol: (1) MODEL CHANGE DETECTION: Every Danelfin model version change is captured and hashed. The change log documents what changed, which scores shifted by more than 3 points, and which client positions are affected. (2) AUTOMATIC POSITION FLAGGING: When a model change causes a score to shift by 3+ points for any stock held in client portfolios, affected positions are automatically flagged for advisor review. (3) ADVISOR ACKNOWLEDGEMENT SEAL: Each advisor must acknowledge the score change and document their position review within 24 hours. The acknowledgement is cryptographically sealed with timestamp. (4) DUTY OF CARE EVIDENCE: The firm generates a complete audit trail showing: model changed at [time], advisors notified at [time], position reviews completed at [time], client communications sent at [time].' },
        { agentId: 'risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The model change governance protocol resolves all identified risks: (1) All 47 affected positions flagged within 1 hour of model change. (2) Advisors notified with specific score change data — not a generic alert. (3) Position review documentation generated per client — duty of care evidenced. (4) Firm-wide model change response time: documented at 4 hours average, well within the 24-hour window. The Danelfin × Datacendia model governance proposition: Danelfin retrains its models to stay accurate. Datacendia proves the advisors responded to the changes. Model drift is inevitable — fiduciary drift is now preventable.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:dan2b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8',
        merkleRoot: 'dan2f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6f7a8b3c4d5e6',
        merkleLabel: 'Merkle Tree Root (Model v2.3.1→v2.4.0 change + 47 position flags + Advisor acknowledgements + Client reviews)',
        complianceLabel: 'Model Governance Status',
        complianceValue: 'CHANGE MANAGED',
        complianceThreshold: '47/47 positions reviewed, all advisors acknowledged within 24h',
        agents: ['Model Governance Agent', 'Danelfin AI Agent', 'Duty of Care Agent', 'Risk Assessment Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Model Change — Detected, Flagged, Reviewed, Sealed',
        guaranteeBody: 'This cryptographic bundle seals the model change governance chain: model version change detected (v2.3.1→v2.4.0), 47 affected positions identified, advisor notifications sent, position reviews documented per client, and duty of care evidence generated. FINRA Rule 4512 ongoing monitoring obligation satisfied.',
        evidenceChain: 'Model v2.4.0 deployed → Score changes detected → 47 positions flagged → Advisors notified → Position reviews completed → Client decisions documented → Duty of care sealed → Ed25519 + RFC 3161',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will simulate a Danelfin model retraining event — demonstrating how 47 client positions are flagged, reviewed, and documented when the AI Score changes overnight.',
      phaseLabels: ['Model Change Detection', 'Duty of Care & Position Review', 'Governance Protocol Integration'],
    },

    // ─── SCENARIO 3: AI WASHING ────────────────────────────────────────
    {
      id: 'danelfin-ai-washing',
      title: '"AI Washing" Prevention — Marketing Claims vs Actual AI Usage',
      subtitle: 'SEC enforcement · Marketing Rule compliance · AI disclosure accuracy · Fiduciary documentation',
      banner: 'An RIA claims "AI-driven portfolio management" in marketing materials while using Danelfin. The SEC has already charged firms for AI washing. Is the claim accurate — or is the advisor blindly following AI output? Datacendia documents the actual role AI plays in each decision.',
      risk: 'Critical',
      scenarioNum: 'AIW-03',
      icon: 'eye',
      color: 'text-red-400',
      agents: [
        { id: 'marketing', name: 'Marketing Compliance Agent', role: 'AI Claims Verification & Disclosure Review', icon: '📢', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'danelfin-ai', name: 'Danelfin AI Agent', role: 'AI Score Usage Analytics & Pattern Detection', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'sec-enforce', name: 'SEC Enforcement Agent', role: 'AI Washing Detection & Enforcement Precedent', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'risk', name: 'Risk Assessment Agent', role: 'Enforcement Exposure & Remediation', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Marketing Materials Database', status: 'connected', type: 'Client-Facing Content', icon: 'file-text', detail: 'Claim: "AI-driven portfolio management using advanced machine learning"' },
        { name: 'Danelfin Usage Analytics', status: 'connected', type: 'AI Tool Audit', icon: 'cpu', detail: 'AI followed: 34 decisions · AI overridden: 12 decisions · AI not used: 8 decisions' },
        { name: 'SEC Enforcement Database', status: 'connected', type: 'Enforcement Precedent', icon: 'shield', detail: 'March 2024: SEC charged Delphia + Global Predictions for AI washing' },
        { name: 'Client Disclosure System', status: 'syncing', type: 'ADV Part 2A', icon: 'check-circle', detail: 'Form ADV AI disclosure: OUTDATED — does not reflect actual usage' },
      ],
      script: [
        { agentId: 'danelfin-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Danelfin usage analytics for this RIA over the past 12 months: (1) Total investment decisions: 54. (2) Decisions where Danelfin AI Score was the PRIMARY factor: 34 (63%). (3) Decisions where advisor OVERRODE the AI Score: 12 (22%). (4) Decisions where AI Score was NOT consulted: 8 (15%). Override analysis: When AI Score was 8+ but advisor sold — 5 instances (advisor cited client-specific factors). When AI Score was 3 or below but advisor held — 7 instances (advisor cited long-term thesis). This data tells us the AI is influential but not determinative. The advisor exercises independent judgment approximately 37% of the time. The marketing claim "AI-driven portfolio management" implies AI is the primary decision-maker — which is partially true (63%) but misleading about the advisor\'s role.' },
        { agentId: 'sec-enforce', phase: 'phase1', type: 'warning', delay: 2500, content: 'SEC AI WASHING ENFORCEMENT ALERT. In March 2024, the SEC charged Delphia Inc. and Global Predictions Inc. for making false statements about their use of AI. Key precedents: (1) Delphia claimed to use AI to "predict which companies and trends are about to make it big" — they did not actually have a functioning AI making those predictions. Penalty: $225,000. (2) Global Predictions claimed AI-driven forecasting — overstated the role of AI in actual portfolio construction. Penalty: $175,000. This RIA\'s situation: The marketing claim is "AI-driven portfolio management." The actual data shows AI is one input among several, used 63% of the time, overridden 22%. "AI-assisted" would be accurate. "AI-driven" implies algorithmic control that does not exist. This is the same pattern the SEC prosecuted in 2024. The discrepancy between claim and reality = AI washing risk.' },
        { agentId: 'risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — ENFORCEMENT EXPOSURE QUANTIFIED. (1) MARKETING RULE VIOLATION: The SEC Marketing Rule (Rule 206(4)-1) prohibits misleading statements about investment advisory services. "AI-driven" when the reality is "AI-assisted" is a misleading statement. Estimated penalty: $200K-$500K based on 2024 precedents. (2) FORM ADV MISREPRESENTATION: The firm\'s ADV Part 2A does not accurately describe how AI tools are used. This is a separate violation with additional penalties. (3) CLIENT TRUST: If clients chose this firm BECAUSE of its "AI-driven" claim, and they learn the AI was overridden 22% of the time (and not consulted 15%), client arbitration claims for misrepresentation could reach $2M. (4) REPUTATIONAL: SEC enforcement actions for AI washing generate significant media coverage. The firm\'s AUM could decline 15-25% after public disclosure.' },
        { agentId: 'marketing', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — IMMEDIATE MARKETING REMEDIATION REQUIRED. The fix is straightforward but must be documented: (1) CHANGE MARKETING LANGUAGE: "AI-driven" → "AI-assisted" or "AI-enhanced." The claim must match the documented reality. (2) UPDATE FORM ADV: Part 2A must describe Danelfin AI Score as "one input among several in the advisor\'s investment process." (3) GENERATE AI ROLE REPORT: For every recommendation over the past 12 months, document the actual role AI played: primary factor, contributing factor, overridden, or not used. (4) PROSPECTIVE DOCUMENTATION: Going forward, every recommendation documents the AI\'s role at the point of decision — not retroactively. Without Datacendia: the firm changes its marketing language but has no evidence of what actually happened. With Datacendia: every past decision is documented with the actual AI role, and every future decision captures it automatically.' },
        { agentId: 'danelfin-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Danelfin + CendiaSupervision AI Washing Prevention Protocol: (1) REAL-TIME AI ROLE CAPTURE: At the moment of every investment decision, the system captures: AI Score consulted (yes/no), AI Score influence level (primary/contributing/overridden/not used), and advisor\'s stated rationale. (2) MARKETING CLAIM VERIFICATION: Quarterly automated comparison of marketing claims against documented AI usage. If the claim says "AI-driven" but data shows <70% primary AI influence, the system flags the discrepancy. (3) FORM ADV AUTOMATION: AI usage statistics automatically populate Form ADV disclosures with accurate, current data. (4) SEC EXAM EVIDENCE: One-click report showing marketing claims alongside documented AI usage — proving the firm\'s claims match reality.' },
        { agentId: 'risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The AI washing prevention protocol eliminates all enforcement exposure: (1) Marketing claims verified against documented usage — discrepancy flagged before client materials are distributed. (2) Every investment decision documents AI role in real-time — no retroactive reconstruction needed. (3) Form ADV updated quarterly with accurate AI usage data. (4) SEC exam package shows perfect alignment between what the firm claims and what actually happens. The Danelfin × Datacendia anti-AI-washing value: Danelfin is a genuinely useful AI tool. The worst outcome is a firm getting penalised for OVERSTATING how much they use it. Datacendia ensures the marketing matches the reality — protecting both the firm and Danelfin\'s reputation.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:dan3c4d5e6f7a8b9c4d5e6f7a8b9c4d5e6f7a8b9c4d5e6f7a8b9c4d5e6f7a8b9',
        merkleRoot: 'dan3b9a8f7e6d5c4b9a8f7e6d5c4b9a8f7e6d5c4b9a8f7e6d5c4b9a8f7e6d5c4',
        merkleLabel: 'Merkle Tree Root (Marketing claim audit + 54 decision AI-role records + Form ADV update + SEC compliance package)',
        complianceLabel: 'AI Washing Status',
        complianceValue: 'CLAIMS VERIFIED',
        complianceThreshold: '54/54 decisions documented, marketing aligned with actual usage',
        agents: ['Marketing Compliance Agent', 'Danelfin AI Agent', 'SEC Enforcement Agent', 'Risk Assessment Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'AI Claims — Verified, Documented, Enforcement-Proof',
        guaranteeBody: 'This bundle seals the complete AI washing prevention chain: marketing claim captured, actual AI usage documented across 54 decisions, discrepancy identified and remediated, Form ADV updated, and SEC exam evidence generated.',
        evidenceChain: 'Marketing claim captured → 54 decisions audited for AI role → Discrepancy detected → Marketing updated → Form ADV corrected → SEC package generated → Ed25519 + RFC 3161 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will simulate an SEC AI washing investigation — demonstrating how marketing claims are verified against documented AI usage to prevent enforcement action.',
      phaseLabels: ['AI Usage Audit & Claim Analysis', 'Enforcement Risk & Remediation', 'Anti-AI-Washing Protocol'],
    },
  ],
};

export default config;
