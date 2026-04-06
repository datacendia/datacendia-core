/**
 * Sony Peru — Target Company Sandbox Config
 * Access: /sandbox/sony-peru (Key: SONY-PE-26)
 * @module pages/sandbox/configs/sony-peru
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const ag = (id: string, n: string, r: string, i: string, c: string, bc: string) => ({ id, name: n, role: r, icon: i, color: c, borderColor: `border-${bc}/40`, bgColor: `bg-${bc}/10` });
const cn = (n: string, s: 'connected' | 'syncing' | 'ready', t: string, i: string, d: string) => ({ name: n, status: s, type: t, icon: i, detail: d });
const ln = (a: string, p: 'phase1' | 'phase2' | 'phase3', t: 'analysis' | 'warning' | 'dissent' | 'flag' | 'proposal' | 'resolution' | 'withdrawal', dl: number, c: string) => ({ agentId: a, phase: p, type: t, delay: dl, content: c });

const config: OrgSandboxConfig = {
  orgLabel: 'Sony Peru',
  accessKey: 'SONY-PE-26',
  sessionKey: 'sony-peru-sandbox-unlocked',
  accent: 'blue',
  accentColor: 'text-blue-400',
  accentHover: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
  ringColor: 'focus:ring-blue-500/30',
  borderColor: 'border-blue-500/30',
  gradientFrom: 'from-blue-600/20',
  gradientTo: 'to-blue-900/20',
  footerNote: 'Sony Peru — Edificio Targa, Amador Merino Reyna 285, San Isidro. AI governance for content, consumer protection & supply chain. Datacendia · 5 scenarios',

  scenarios: [
    // 1 — CONTENT MODERATION AI
    { id: 'sony-content-mod', title: 'Sony — AI Content Moderation & Copyright', subtitle: 'PlayStation · Content ID · DMCA · Peru Ley de Derecho de Autor', banner: 'Sony AI flags user-generated content as infringing. Creator\'s original work removed. Appeal denied by AI. No human review evidence.', risk: 'High', scenarioNum: '1', icon: 'shield', color: 'text-blue-400',
      agents: [ag('s1','Content Agent','Moderation AI','🎮','text-blue-400','blue-500'), ag('s2','Rights Agent','Copyright','©️','text-red-400','red-500'), ag('s3','Creator Agent','User Rights','👤','text-emerald-400','emerald-500'), ag('s4','Legal Agent','Peru IP Law','⚖️','text-amber-400','amber-500')],
      connectors: [cn('Content ID','connected','Detection','shield','AI fingerprinting'), cn('PlayStation','connected','Platform','gamepad-2','UGC pipeline'), cn('Peru IP','connected','Regulation','file-text','Decreto Legislativo 822'), cn('Appeals','syncing','Review','users','Creator disputes')],
      script: [
        ln('s1','phase1','analysis',800,'Sony Content ID AI scans PlayStation user-generated content. Peruvian indie game developer uploads original soundtrack. AI detects 4-second melodic similarity to Sony Music catalogue track. Auto-takedown. Creator appeals — AI re-analyses, confirms match. Account suspended. Creator proves composition predates Sony track by 2 years. FALSE POSITIVE. No per-decision reasoning, no similarity score, no human review trail.'),
        ln('s2','phase1','warning',2500,'PERU COPYRIGHT: Decreto Legislativo 822 Art. 37 — original works protected from creation. INDECOPI (Peru IP authority) requires evidence of infringement. AI similarity score is NOT legal evidence. Auto-takedown without human review violates creator\'s moral rights under Peru law.'),
        ln('s3','phase2','dissent',2000,'DISSENT — 2.3M UGC uploads/month on PlayStation Peru. Manual review impossible. But false positive rate of 0.3% = 6,900 wrongful takedowns/month. Each is a creator harmed. Governance must be automated BUT auditable.'),
        ln('s4','phase2','flag',2500,'FLAG — INDECOPI complaint filed. Creator demands: similarity score, comparison methodology, human review record. Sony Peru has: "AI flagged." Not: why, how confident, what alternatives considered, who reviewed.'),
        ln('s1','phase3','proposal',2000,'PROPOSED: Per-detection governance. Similarity score sealed. Comparison methodology documented. Confidence threshold enforced. Above 95%: auto-action with evidence. Below 95%: human review required. All decisions sealed with cryptographic receipt.'),
        ln('s3','phase3','resolution',2500,'DISSENT WITHDRAWN. Governance adds <12ms per scan. Creator appeals get sealed evidence packet. INDECOPI compliance achieved. Receipt: {hash: "sha256:sony_content_f8a2…", merkle: "root:9c3d…", sig: "ed25519:sony_pe_gov…"}')
      ],
      receiptTemplate: {
        hash: 'SHA-256:sony0content0f8a2e3b1c4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
        merkleRoot: 'sony1content19c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
        merkleLabel: 'Merkle Tree Root (Content ID scans + Similarity scores + Human review evidence + Creator appeals)',
        complianceLabel: 'Peru IP Compliance',
        complianceValue: 'INDECOPI GOVERNED',
        complianceThreshold: 'Decreto Legislativo 822 — per-detection evidence with similarity scoring',
        agents: ['Content Agent', 'Rights Agent', 'Creator Agent', 'Legal Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sony Content ID — Peru IP Compliant, Cryptographically Governed',
        guaranteeBody: 'Per-detection governance for 2.3M monthly UGC scans. Similarity score sealed, comparison methodology documented, confidence threshold enforced. False positive rate reduced from 0.3% to 0.04%. INDECOPI evidence chain complete.',
        evidenceChain: 'UGC Upload → Content ID Scan → Similarity Score → Confidence Check → Threshold Gate → Human Review (if <95%) → Decision Sealed → Ed25519 + RFC 3161'
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 agents demonstrate why Sony Peru needs AI governance for content moderation — a Peruvian creator\'s original work wrongfully removed by AI with no evidence trail.',
      phaseLabels: ['Content Detection & Copyright Analysis', 'Creator Rights & INDECOPI Exposure', 'Per-Detection Governance Integration']
    },

    // 2 — AI CUSTOMER SERVICE CHATBOT
    { id: 'sony-chatbot', title: 'Sony Peru — AI Chatbot Consumer Protection', subtitle: 'Customer service · Hallucination · INDECOPI · Warranty', banner: 'Sony AI chatbot tells customer their TV has 5-year warranty. Actual warranty: 1 year. Customer demands compliance. No conversation governance.', risk: 'Critical', scenarioNum: '2', icon: 'message-circle', color: 'text-red-400',
      agents: [ag('c1','Chatbot Agent','Customer AI','💬','text-red-400','red-500'), ag('c2','Consumer Agent','INDECOPI','🛡️','text-amber-400','amber-500'), ag('c3','Legal Agent','Warranty','📋','text-blue-400','blue-500'), ag('c4','Quality Agent','Accuracy','✅','text-emerald-400','emerald-500')],
      connectors: [cn('AI Chatbot','connected','Customer Service','message-circle','GPT-powered'), cn('INDECOPI','connected','Consumer Protection','shield','Peru consumer law'), cn('Warranty DB','connected','Products','database','Product terms'), cn('Escalation','syncing','Human Agent','users','Dispute resolution')],
      script: [
        ln('c1','phase1','analysis',800,'Sony Peru AI chatbot handles 8,400 queries/day. Customer asks about Bravia TV warranty in Lima. Chatbot: "Your Sony Bravia has a 5-year comprehensive warranty covering all defects." WRONG — actual warranty is 1 year manufacturer, 6 months parts. Customer relies on AI statement, declines extended warranty. TV fails at 18 months. Customer: "Your AI promised 5 years."'),
        ln('c2','phase1','warning',2500,'INDECOPI Código de Protección al Consumidor Art. 18: information provided to consumers must be truthful. AI chatbot = Sony\'s agent. Hallucinated warranty = binding representation under Peru law. INDECOPI fine: up to 450 UIT (S/. 2.3M). Class action if systematic.'),
        ln('c3','phase2','dissent',2000,'DISSENT — Chatbot handles 8,400/day. Human agents handle 1,200. Without AI: 3-hour wait times. Governance must preserve speed. But EVERY hallucinated warranty creates legal liability.'),
        ln('c4','phase2','flag',2500,'FLAG — Audit reveals 847 conversations in past 90 days where chatbot provided incorrect warranty info. 23 INDECOPI complaints already filed. No conversation-level governance — impossible to identify all affected customers.'),
        ln('c1','phase3','proposal',2000,'PROPOSED: Per-conversation governance. Warranty claims cross-referenced with product DB in real-time. Confidence scoring. Hallucination detection. Every conversation sealed with evidence of what was said, what was verified, what the source was.'),
        ln('c4','phase3','resolution',2500,'DISSENT WITHDRAWN. Real-time verification adds 200ms latency — invisible to customer. 847 affected customers identified and remediated. Receipt: {hash: "sha256:sony_chat_b7c1…", merkle: "root:4d5e…", sig: "ed25519:sony_pe_cs…"}')
      ],
      receiptTemplate: {
        hash: 'SHA-256:sony0chat0b7c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
        merkleRoot: 'sony1chat14d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
        merkleLabel: 'Merkle Tree Root (8,400 daily conversations + Warranty verification + Hallucination detection)',
        complianceLabel: 'INDECOPI Consumer Protection',
        complianceValue: 'CONSUMER GOVERNED',
        complianceThreshold: 'Art. 18 Código de Protección — truthful AI representations verified',
        agents: ['Chatbot Agent', 'Consumer Agent', 'Legal Agent', 'Quality Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sony Peru Chatbot — Consumer-Compliant, Hallucination-Governed',
        guaranteeBody: 'Per-conversation governance for 8,400 daily queries. Warranty claims cross-referenced with product DB. 847 prior incorrect responses identified and remediated. INDECOPI evidence chain sealed.',
        evidenceChain: 'Customer Query → AI Response → Product DB Verification → Confidence Score → Hallucination Check → Response Sealed → Ed25519 + RFC 3161'
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 agents demonstrate why Sony Peru\'s AI chatbot needs governance — hallucinated warranty information creates binding legal liability under Peru consumer law.',
      phaseLabels: ['Chatbot Hallucination & Consumer Risk', 'INDECOPI Exposure & Scale Challenge', 'Per-Conversation Governance Solution']
    },

    // 3 — AI RECOMMENDATION ENGINE
    { id: 'sony-reco', title: 'Sony — AI Recommendation & Profiling', subtitle: 'PlayStation Store · User profiling · GDPR-equivalent · Children', banner: 'PlayStation AI recommends mature content to 13-year-old. Parental controls bypassed by recommendation algorithm. No age-gate governance.', risk: 'Critical', scenarioNum: '3', icon: 'star', color: 'text-purple-400',
      agents: [ag('r1','Recommendation Agent','Content AI','⭐','text-purple-400','purple-500'), ag('r2','Child Safety Agent','COPPA/Peru','🧒','text-red-400','red-500'), ag('r3','Privacy Agent','Profiling','🔒','text-blue-400','blue-500'), ag('r4','Platform Agent','Trust & Safety','🛡️','text-emerald-400','emerald-500')],
      connectors: [cn('PS Store','connected','Recommendations','star','ML-driven'), cn('Age System','connected','Parental Controls','users','Account age data'), cn('Peru DPA','connected','Privacy','shield','Ley 29733'), cn('Content','syncing','Rating','file-text','ESRB/PEGI ratings')],
      script: [
        ln('r1','phase1','analysis',800,'PlayStation Store recommendation AI in Peru. 13-year-old account. AI analyses play patterns: action games, long sessions. Recommends GTA VI (rated M/18+). Child\'s account has age set correctly but recommendation engine ignores content ratings — optimises for engagement. Parent discovers child playing M-rated content purchased via AI recommendation.'),
        ln('r2','phase1','warning',2500,'CHILD SAFETY: Peru Ley 30466 — best interest of the child. Ley 29733 (Data Protection) — minors\' data requires enhanced protection. AI profiling children to maximise engagement = profiling minors for commercial purposes. APDP (Peru DPA) enforcement action risk.'),
        ln('r3','phase2','dissent',2000,'DISSENT — Recommendation drives 34% of PlayStation Store revenue in Peru. Age-gating recommendations reduces engagement. But: one child safety incident = regulatory crisis + brand damage worth 100x revenue.'),
        ln('r4','phase2','flag',2500,'FLAG — Parent files complaint with APDP. "Sony profiled my child to sell violent games." Demands: profiling data, recommendation logic, age verification evidence. Sony has: purchase history. NOT: why AI recommended, what profile was built, how age was (not) considered.'),
        ln('r1','phase3','proposal',2000,'PROPOSED: Age-aware recommendation governance. Every recommendation for minor accounts sealed with: age check, content rating check, parental consent status. Recommendations that cross age-rating boundary: blocked + logged.'),
        ln('r3','phase3','resolution',2500,'DISSENT WITHDRAWN. Age-gate adds 5ms per recommendation. Revenue impact: -2.1% on minor accounts. Safety + compliance value: incalculable. Receipt: {hash: "sha256:sony_reco_a1b2…", merkle: "root:c3d4…", sig: "ed25519:sony_pe_rec…"}')
      ],
      receiptTemplate: {
        hash: 'SHA-256:sony0reco0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
        merkleRoot: 'sony1reco1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
        merkleLabel: 'Merkle Tree Root (Recommendations + Age verification + Content rating checks + Parental consent)',
        complianceLabel: 'Child Safety Compliance',
        complianceValue: 'MINOR-PROTECTED',
        complianceThreshold: 'Ley 30466 + Ley 29733 — age-aware recommendations with parental consent',
        agents: ['Recommendation Agent', 'Child Safety Agent', 'Privacy Agent', 'Platform Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'PlayStation Store — Age-Gated, Privacy-Governed Recommendations',
        guaranteeBody: 'Age-aware recommendation governance. Every recommendation for minor accounts sealed with age check, content rating verification, parental consent status. M-rated content blocked for minors. Revenue impact: -2.1% on minor accounts.',
        evidenceChain: 'User Profile → Age Check → Recommendation Engine → Content Rating Gate → Parental Consent Verify → Recommendation Sealed → Ed25519 + RFC 3161'
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 agents demonstrate why PlayStation Store recommendations need governance — AI recommends mature content to a 13-year-old, bypassing parental controls.',
      phaseLabels: ['Recommendation & Child Safety Gap', 'Privacy Profiling & Regulatory Risk', 'Age-Aware Governance Integration']
    },

    // 4 — SUPPLY CHAIN AI
    { id: 'sony-supply', title: 'Sony Peru — AI Supply Chain & Customs', subtitle: 'Import classification · SUNAT · Tariff AI · Customs fraud risk', banner: 'Sony AI misclassifies electronics shipment. SUNAT detects tariff discrepancy. $1.2M penalty. No classification evidence.', risk: 'High', scenarioNum: '4', icon: 'truck', color: 'text-amber-400',
      agents: [ag('t1','Supply Agent','Classification AI','📦','text-amber-400','amber-500'), ag('t2','Customs Agent','SUNAT','🏛️','text-red-400','red-500'), ag('t3','Finance Agent','Tariff Impact','💰','text-blue-400','blue-500'), ag('t4','Compliance Agent','Trade Law','📋','text-emerald-400','emerald-500')],
      connectors: [cn('Classification AI','connected','HS Codes','truck','Auto-classification'), cn('SUNAT','connected','Customs','shield','Peru tax authority'), cn('Inventory','connected','Products','database','14K SKUs'), cn('Tariff','syncing','Rates','calculator','Duty calculation')],
      script: [
        ln('t1','phase1','analysis',800,'Sony Peru imports 14K SKUs annually. AI auto-classifies products into HS tariff codes for SUNAT customs declarations. AI classifies new PS5 Pro bundle as "video game console" (HS 9504.50 — 0% tariff). SUNAT inspection: bundle includes camera accessory — correct classification is "composite good" (HS 8525.80 — 6% tariff). 340 shipments misclassified over 8 months. SUNAT penalty: S/. 4.2M (~$1.2M).'),
        ln('t2','phase1','warning',2500,'SUNAT: AI misclassification = negligent declaration under Peru customs law (Ley General de Aduanas D.L. 1053). Repeated misclassification: presumption of intent. SUNAT can impose penalties of 100-200% of unpaid duties. Plus: import license review for Sony Peru.'),
        ln('t3','phase2','dissent',2000,'DISSENT — Manual HS classification for 14K SKUs = 6 FTEs full-time. AI reduces to 0.5 FTE review. But each misclassification costs $3,500 average in penalties. Break-even: governance must catch errors without eliminating AI efficiency.'),
        ln('t4','phase2','flag',2500,'FLAG — SUNAT audit: "Provide classification methodology for all 340 shipments." Sony Peru has: AI output. NOT: why this HS code, what alternatives considered, confidence level, component analysis.'),
        ln('t1','phase3','proposal',2000,'PROPOSED: Per-classification governance. HS code confidence score. Component analysis sealed. Multi-code candidates documented. Below 90% confidence: human review flagged. All classifications sealed for SUNAT audit trail.'),
        ln('t3','phase3','resolution',2500,'DISSENT WITHDRAWN. Classification governance catches 94% of errors pre-submission. SUNAT penalty exposure reduced by $3.8M/year. Receipt: {hash: "sha256:sony_supply_d4e5…", merkle: "root:f6a7…", sig: "ed25519:sony_pe_sc…"}')
      ],
      receiptTemplate: {
        hash: 'SHA-256:sony0supply0d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
        merkleRoot: 'sony1supply1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        merkleLabel: 'Merkle Tree Root (14K SKU classifications + HS code confidence + Component analysis + SUNAT audit)',
        complianceLabel: 'SUNAT Customs Compliance',
        complianceValue: 'CUSTOMS GOVERNED',
        complianceThreshold: 'D.L. 1053 Ley General de Aduanas — per-classification evidence sealed',
        agents: ['Supply Agent', 'Customs Agent', 'Finance Agent', 'Compliance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sony Peru Supply Chain — SUNAT-Compliant, AI Classification Governed',
        guaranteeBody: 'Per-classification governance for 14K annual SKUs. HS code confidence scoring, component analysis sealed, multi-code candidates documented. Catches 94% of errors pre-submission. SUNAT penalty exposure reduced by $3.8M/year.',
        evidenceChain: 'Product Import → AI HS Classification → Confidence Score → Component Analysis → Multi-Code Candidates → Human Review Gate → Classification Sealed → Ed25519 + RFC 3161'
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 agents demonstrate why Sony Peru\'s AI supply chain classification needs governance — 340 misclassified shipments trigger $1.2M SUNAT penalty.',
      phaseLabels: ['AI Misclassification & SUNAT Exposure', 'Penalty Quantification & Efficiency Trade-off', 'Per-Classification Governance Solution']
    },

    // 5 — DEEPFAKE DETECTION FOR PLAYSTATION
    { id: 'sony-deepfake', title: 'Sony — AI Deepfake Detection Governance', subtitle: 'PlayStation · Synthetic media · Creator identity · Peru Ley 30096', banner: 'Sony deepfake detection flags legitimate Peruvian streamer as synthetic. Channel banned. Streamer loses income. No detection evidence.', risk: 'High', scenarioNum: '5', icon: 'scan-face', color: 'text-emerald-400',
      agents: [ag('d1','Detection Agent','Deepfake AI','🔍','text-emerald-400','emerald-500'), ag('d2','Identity Agent','Creator Verification','👤','text-red-400','red-500'), ag('d3','Fairness Agent','Bias','⚖️','text-amber-400','amber-500'), ag('d4','Legal Agent','Peru Cyber Law','📋','text-blue-400','blue-500')],
      connectors: [cn('Deepfake AI','connected','Detection','scan-face','Synthetic media'), cn('Creators','connected','Identity','users','Streamer accounts'), cn('Bias Data','connected','Fairness','bar-chart','Detection by demographics'), cn('Peru Law','syncing','Regulation','shield','Ley 30096 cybercrime')],
      script: [
        ln('d1','phase1','analysis',800,'Sony deepfake detection for PlayStation streaming. Peruvian streamer with 280K followers flagged as "synthetic persona." Channel banned. Investigation: streamer uses ring light + beauty filter — AI misinterprets as deepfake indicators. Streamer is real person. Lost 3 weeks of income (~S/. 12,000). No detection confidence score shared. No appeal evidence provided.'),
        ln('d2','phase1','warning',2500,'FALSE POSITIVE BIAS: detection accuracy varies by skin tone and lighting. Peruvian streamers using common ring light setups flagged at 3.2x rate of US/EU streamers. Bias in training data: primarily trained on Western faces + professional lighting. Peru demographic gap.'),
        ln('d3','phase2','dissent',2000,'DISSENT — Deepfakes are real threat: 47 synthetic scam accounts detected last quarter in Peru. Detection must be aggressive. But demographic bias means Peruvian creators disproportionately harmed. Governance must balance security vs. fairness.'),
        ln('d4','phase2','flag',2500,'FLAG — Streamer files complaint under Peru Ley 30096 (cybercrime) and consumer protection. "Sony AI discriminated against me based on appearance." Demands: detection methodology, confidence score, demographic accuracy data. Sony has: "AI flagged." Not: why, at what confidence, with what demographic accuracy.'),
        ln('d1','phase3','proposal',2000,'PROPOSED: Per-detection governance. Confidence score mandatory. Demographic fairness monitoring. Detections below 97% confidence: human review before action. Regional accuracy audits. All detection decisions sealed with evidence chain.'),
        ln('d3','phase3','resolution',2500,'DISSENT WITHDRAWN. Demographic-aware thresholds reduce LatAm false positives by 78%. Detection speed maintained. Receipt: {hash: "sha256:sony_deep_e6f7…", merkle: "root:a8b9…", sig: "ed25519:sony_pe_df…"}')
      ],
      receiptTemplate: {
        hash: 'SHA-256:sony0deep0e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9',
        merkleRoot: 'sony1deep1a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
        merkleLabel: 'Merkle Tree Root (Deepfake detections + Confidence scores + Demographic fairness + Creator appeals)',
        complianceLabel: 'Creator Fairness Compliance',
        complianceValue: 'BIAS-MONITORED',
        complianceThreshold: 'Ley 30096 + Consumer Protection — demographic-aware detection thresholds',
        agents: ['Detection Agent', 'Identity Agent', 'Fairness Agent', 'Legal Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sony Deepfake Detection — Demographically Fair, Cryptographically Governed',
        guaranteeBody: 'Per-detection governance with mandatory confidence scores. Demographic fairness monitoring reduces LatAm false positives by 78%. Detections below 97% confidence require human review. Regional accuracy audits sealed.',
        evidenceChain: 'Stream Analysis → Deepfake Detection → Confidence Score → Demographic Fairness Check → Threshold Gate → Human Review (if <97%) → Decision Sealed → Ed25519 + RFC 3161'
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 agents demonstrate why Sony\'s deepfake detection needs governance — a legitimate Peruvian streamer banned due to demographic bias in AI detection.',
      phaseLabels: ['False Positive & Demographic Bias', 'Security vs. Fairness Trade-off', 'Demographic-Aware Governance Solution']
    }
  ]
};

export default config;
