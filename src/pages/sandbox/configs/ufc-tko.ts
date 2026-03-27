/**
 * UFC / TKO Group Holdings Sandbox Config
 *
 * 5 fully scripted multi-agent deliberation scenarios for combat sports governance.
 * Access: /sandbox/ufc (Key: UFC-TKO-26)
 *
 * @module pages/sandbox/configs/ufc-tko
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'UFC / TKO',
  accessKey: 'UFC-TKO-26',
  sessionKey: 'ufc-sandbox-unlocked',

  accent: 'red',
  accentColor: 'text-red-400',
  accentHover: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
  ringColor: 'focus:ring-red-500/30',
  borderColor: 'border-red-500/30',
  gradientFrom: 'from-red-600/20',
  gradientTo: 'to-red-900/20',

  footerNote: '200 regulatory scenarios mapped for UFC / TKO Group Holdings · Full architecture document available on request',

  scenarios: [
    // =========================================================================
    // SCENARIO 1 — WEIGHT-CUT MONITORING: FIGHTER SAFETY AI
    // =========================================================================
    {
      id: 'weight-cut',
      title: 'Weight-Cut Monitoring — Fighter Safety AI',
      subtitle: 'Fight week · Extreme dehydration risk · Real-time biometrics · 50-state commission compliance',
      banner: 'Simulating a fight-week weight-cut monitoring scenario where AI detects a fighter in medical danger from extreme dehydration. The platform must produce evidence that the AI flagged the risk, the intervention was recommended, and the State Athletic Commission was notified — or defend why the fight was allowed to proceed.',
      risk: 'Critical',
      scenarioNum: 'Weight-Cut',
      icon: 'heart',
      color: 'text-red-400',
      agents: [
        { id: 'safety', name: 'Fighter Safety Agent', role: 'Weight-Cut Monitoring & Biometric Analysis', icon: '🫀', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'medical', name: 'Ringside Medical Agent', role: 'Fight-Week Medical Clearance & Hydration Testing', icon: '🏥', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'legal', name: 'Legal Agent', role: 'State Commission Compliance & Liability Defence', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'commercial', name: 'Commercial Agent', role: 'PPV Card Impact & Revenue Analysis', icon: '📊', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'UFC Performance Institute', status: 'connected', type: 'Fighter Biometric Tracking', icon: 'heart', detail: 'Fighter X: 8.2% body weight cut in 72hrs — RED ZONE' },
        { name: 'Nevada Athletic Commission', status: 'connected', type: 'State Commission Portal', icon: 'shield', detail: 'NAC 467 medical clearance required by 4PM Friday' },
        { name: 'USADA Biological Passport', status: 'connected', type: 'Anti-Doping Compliance', icon: 'flask-conical', detail: 'Fighter X: USADA clearance current, no flags' },
        { name: 'ESPN+ PPV Dashboard', status: 'syncing', type: 'Commercial Impact Model', icon: 'trending-up', detail: 'Fighter X headline bout — $8.2M projected gate' },
      ],
      script: [
        { agentId: 'safety', phase: 'phase1', type: 'warning', delay: 800, content: 'CRITICAL FLAG. Fighter X is attempting an 8.2% body weight cut in 72 hours for the welterweight limit (170 lbs). UFC Performance Institute biometrics show: (1) Specific gravity 1.032 — severely dehydrated (normal: 1.005-1.015), (2) Resting heart rate 112 BPM — 67% above baseline, (3) Cognitive response time degraded 340ms from baseline — indicating neurological impact. This weight cut profile is consistent with the pattern that preceded Yang Jian Bing\'s death (2015) and other combat sports fatalities. AI risk score: 94.7/100. I am recommending immediate medical intervention and a hard-stop on fight clearance until hydration levels normalize.' },
        { agentId: 'commercial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Commercial impact assessment: Fighter X is the co-main event on UFC 312, a PPV card with $8.2M projected gate and 650K estimated PPV buys. Pulling Fighter X removes 22% of the card\'s commercial value. Replacement options at 48 hours are limited — only 3 ranked welterweights are available and medically cleared. If we pull Fighter X and reschedule, ESPN+ contractual obligations require a comparable replacement or UFC absorbs the revenue shortfall. Estimated financial impact of cancellation: $4.1M in lost gate + $12M in PPV downsell. However — if Fighter X collapses at weigh-in or suffers injury during the fight due to compromised condition, the financial and reputational damage is catastrophic.' },
        { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The Nevada Athletic Commission requires medical clearance by 4PM Friday — that\'s 18 hours away. Under NAC 467.112, the commission physician has independent authority to deny clearance regardless of UFC\'s position. However, I must flag a critical legal risk: if we ALLOW this fight and Fighter X is seriously harmed, the AI safety system\'s 94.7/100 risk score becomes Exhibit A in the negligence lawsuit. The plaintiff\'s attorney will argue: "UFC\'s own AI said this was dangerous, and they proceeded anyway because of PPV revenue." This is textbook cognitive bias — commercial pressure overriding safety AI. We need a documented, defensible decision either way.' },
        { agentId: 'medical', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. Ringside physician consultation confirms the biometric assessment. Fighter X\'s kidney function markers (BUN 42 mg/dL, creatinine 2.1 mg/dL) indicate acute kidney stress consistent with severe dehydration. This is the same biomarker pattern UFC\'s medical team documented in the 2019 internal study of 200 fighters — fighters with these markers were 7.3x more likely to suffer a TKO/KO loss. I am recommending: (1) Immediate IV rehydration under medical supervision, (2) 24-hour observation before any clearance decision, (3) If Fighter X cannot make weight safely, move to catchweight or pull from card. The fighter\'s health must come first.' },
        { agentId: 'safety', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Fighter Safety Protocol: (1) HARD-STOP activated — Fighter X cannot receive fight clearance until specific gravity drops below 1.020 AND cognitive response time returns to within 15% of baseline. (2) The complete biometric timeline (72-hour weight cut, hydration markers, cognitive tests, kidney function) is sealed with ML-DSA-65 post-quantum signatures. (3) Medical intervention documented with timestamps. (4) If Fighter X recovers and is cleared, the clearance decision includes the full safety evidence chain. If Fighter X is pulled, the card adjustment and fighter compensation are documented. Either way, the evidence proves UFC prioritized safety over revenue.' },
        { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The hard-stop protocol transforms this from a liability risk into a safety demonstration. If Fighter X recovers and fights, we have evidence that the AI flagged the risk, medical intervention was taken, and clearance was only granted after objective criteria were met. If Fighter X is pulled, we have evidence that UFC sacrificed $4.1M+ in revenue to protect fighter safety — exactly the narrative we need for the antitrust defence and future CTE litigation. The Regulator\'s Receipt for Nevada NAC will include the complete safety timeline. This is the evidence that separates UFC from every other MMA promotion.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        merkleRoot: 'b2c3d4e5f67890a1234567890123456789abcdef01234567890abcdef0123456',
        merkleLabel: 'Merkle Tree Root (Biometric timeline + Medical intervention + Commission clearance + Commercial impact)',
        complianceLabel: 'Fighter Safety Status',
        complianceValue: 'HARD-STOP ACTIVE',
        complianceThreshold: 'AI Risk Score: 94.7/100',
        agents: ['Fighter Safety Agent', 'Ringside Medical Agent', 'Legal Agent', 'Commercial Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Nevada NAC 467 — Fighter Safety Evidence Sealed',
        guaranteeBody: 'This cryptographic bundle seals the complete fight-week weight-cut monitoring timeline: 72-hour biometric data (specific gravity, heart rate, cognitive response, kidney function), AI risk assessment (94.7/100), medical intervention records, and clearance/denial decision with documented rationale. Evidence proves UFC prioritized fighter safety over $4.1M+ in commercial revenue. Court-admissible for state athletic commissions, CTE litigation defence, and antitrust proceedings.',
        evidenceChain: 'UFC Performance Institute biometrics → AI risk score (94.7/100) → Medical consultation → Hard-stop activation → IV rehydration protocol → 24-hour observation → Clearance criteria check → NAC 467 submission → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will investigate a dangerous fight-week weight cut — balancing fighter safety against PPV revenue while building evidence for the Nevada Athletic Commission.',
      phaseLabels: ['Biometric Red Flag Detection', 'Legal & Commercial Tension', 'Safety Protocol Activation'],
    },

    // =========================================================================
    // SCENARIO 2 — FIGHT-STOPPAGE AI: REFEREE OVERRIDE
    // =========================================================================
    {
      id: 'fight-stoppage',
      title: 'Fight-Stoppage AI — When the Referee Ignores the Machine',
      subtitle: 'Live bout · AI recommends stoppage · Referee overrides · Liability evidence chain',
      banner: 'Simulating a live fight where AI-driven fight-stoppage analysis recommends stopping the bout, but the referee allows it to continue. The platform captures the override and builds a liability defence — or prosecution — depending on the outcome.',
      risk: 'Critical',
      scenarioNum: 'Fight-Stoppage',
      icon: 'alert-triangle',
      color: 'text-orange-400',
      agents: [
        { id: 'stoppage-ai', name: 'Fight-Stoppage AI Agent', role: 'Real-Time Strike Absorption & Consciousness Analysis', icon: '🧠', color: 'text-rose-400', borderColor: 'border-rose-500/40', bgColor: 'bg-rose-500/10' },
        { id: 'referee', name: 'Referee Oversight Agent', role: 'Official Decision Tracking & Override Accountability', icon: '🥊', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'legal-stop', name: 'Legal Agent', role: 'Duty of Care & Negligence Liability Analysis', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'medical-stop', name: 'Ringside Medical Agent', role: 'Post-Fight Medical Assessment & Suspension', icon: '🏥', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Fight Analytics Engine', status: 'connected', type: 'Real-Time Strike & Movement Data', icon: 'activity', detail: 'Round 3: 47 significant strikes absorbed, defensive movement -62%' },
        { name: 'Consciousness Detection', status: 'connected', type: 'Fighter Awareness Metrics', icon: 'cpu', detail: 'Fighter Y awareness score: 31/100 — DANGER ZONE' },
        { name: 'Commission Referee Feed', status: 'connected', type: 'Official Decision Channel', icon: 'radio', detail: 'Referee Herb Dean — active, no stoppage signal' },
        { name: 'Post-Fight Medical', status: 'syncing', type: 'Medical Assessment Queue', icon: 'heart', detail: 'Standby for immediate post-fight evaluation' },
      ],
      script: [
        { agentId: 'stoppage-ai', phase: 'phase1', type: 'warning', delay: 800, content: 'STOPPAGE RECOMMENDATION — CONFIDENCE 91.3%. Fighter Y has absorbed 47 significant strikes in Round 3 with defensive movement declining 62% from Round 1 baseline. Consciousness detection metrics: (1) Head movement reaction time: 890ms (baseline: 220ms) — 4x degradation, (2) Guard positioning: hands dropped below chin for 34 of last 40 seconds, (3) Forward pressure ceased — fighter backing straight to fence without lateral movement, (4) Strike absorption rate: 8.2 strikes/minute with 0 meaningful counter-strikes in final 90 seconds. This pattern matches 94% of fights that ended in post-stoppage medical emergency. AI RECOMMENDS IMMEDIATE STOPPAGE.' },
        { agentId: 'referee', phase: 'phase1', type: 'analysis', delay: 2500, content: 'OVERRIDE DETECTED. Referee Herb Dean has assessed Fighter Y and allowed the fight to continue. Dean\'s in-cage evaluation: Fighter Y responded to verbal commands ("Show me something"), attempted a takedown at 3:42 of Round 3, and was still moving forward (albeit slowly). Dean\'s professional judgment: fighter is "still in the fight." This is a legitimate referee judgment call — Dean has officiated 600+ UFC bouts and is considered the gold standard. However, the AI\'s 91.3% stoppage confidence creates a documented override that requires accountability tracking.' },
        { agentId: 'legal-stop', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. This override creates a critical liability fork: (1) IF Fighter Y recovers and wins/survives — Dean\'s judgment is vindicated, and the AI override is documented as "professional expertise exceeding algorithmic assessment." (2) IF Fighter Y is seriously injured — the 91.3% AI stoppage recommendation becomes the plaintiff\'s strongest exhibit. The attorney will argue: "The machine knew. The referee ignored it. UFC had the technology to prevent this and chose not to enforce it." The duty of care question is: does UFC have an obligation to enforce AI recommendations over human referee judgment? No court has ruled on this yet — but the first case WILL set precedent for all combat sports.' },
        { agentId: 'medical-stop', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. Post-round medical check between Rounds 3-4: Fighter Y\'s pupil response is sluggish (left eye delayed 0.8s), verbal response is coherent but slow, and balance test shows 2.1° lateral sway (normal: <0.5°). These are borderline concussion indicators. Ringside physician has the independent authority to stop the fight under NAC 467 — but fighter is verbal and responsive. I am recommending the physician stop this fight on medical grounds, regardless of referee judgment. The biometric data combined with the AI stoppage recommendation creates overwhelming evidence of risk.' },
        { agentId: 'stoppage-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Override Accountability Protocol: (1) The AI stoppage recommendation (91.3% confidence) is sealed with timestamp at the exact moment it was generated — 3:18 of Round 3. (2) Referee Dean\'s override is documented with his stated rationale. (3) The ringside physician\'s medical assessment is sealed. (4) The OUTCOME of the override (fighter recovered / fighter injured) is linked to the original recommendation. This creates a complete chain: AI said stop → referee said continue → medical said borderline → outcome. Whether the outcome is good or bad, the evidence chain is identical — proving UFC had a system, documented every decision, and maintained accountability.' },
        { agentId: 'legal-stop', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Override Accountability Protocol is exactly what we need regardless of outcome. It proves: (1) UFC invested in AI safety technology — not negligent, (2) The AI recommendation was documented in real-time — not reconstructed after an incident, (3) The referee\'s human judgment was respected but accountable — not rubber-stamped, (4) The medical team had independent authority — structural safety redundancy. This is the evidence that transforms "UFC ignored the machine" into "UFC built a multi-layered safety system with human judgment at its centre." The Regulator\'s Receipt makes this court-admissible.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abc12',
        merkleRoot: 'd5e6f7890abcdef12345678901234567890abcdef1234567890abcdef01234567',
        merkleLabel: 'Merkle Tree Root (Strike data + AI recommendation + Referee override + Medical assessment)',
        complianceLabel: 'AI Stoppage Confidence',
        complianceValue: '91.3% — OVERRIDDEN',
        complianceThreshold: 'Referee: Herb Dean (override documented)',
        agents: ['Fight-Stoppage AI Agent', 'Referee Oversight Agent', 'Legal Agent', 'Ringside Medical Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Override Accountability — AI vs Human Judgment Documented',
        guaranteeBody: 'This cryptographic bundle seals the complete fight-stoppage sequence: AI recommendation (91.3% confidence at R3 3:18), referee override with stated rationale, ringside physician assessment, and fight outcome. Every layer of the safety system is documented — proving UFC operates a multi-layered safety architecture with human judgment accountability. Court-admissible for duty of care, negligence defence, and CTE litigation.',
        evidenceChain: 'Strike analytics (47 sig. strikes R3) → Consciousness detection (31/100) → AI stoppage recommendation (91.3%) → Referee override (Dean) → Medical assessment (borderline concussion) → Outcome documentation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will simulate a live fight where AI recommends stopping the bout but the referee overrides — building the liability evidence chain in real-time.',
      phaseLabels: ['Real-Time Danger Detection', 'Override & Liability Analysis', 'Accountability Protocol'],
    },

    // =========================================================================
    // SCENARIO 3 — USADA ANTI-DOPING: THE TJ DILLASHAW PROBLEM
    // =========================================================================
    {
      id: 'usada-doping',
      title: 'USADA Anti-Doping — The TJ Dillashaw Problem',
      subtitle: 'EPO positive · Former champion · $30M PPV card impact · 50-state suspension chaos',
      banner: 'Simulating the governance crisis when a UFC champion tests positive for EPO — triggering USADA proceedings, 50-state commission suspension reciprocity, PPV card reconstruction, and antitrust litigation evidence preservation.',
      risk: 'Critical',
      scenarioNum: 'Anti-Doping',
      icon: 'flask-conical',
      color: 'text-purple-400',
      agents: [
        { id: 'usada', name: 'USADA Compliance Agent', role: 'Anti-Doping Programme & Biological Passport', icon: '🧪', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'commission', name: 'Commission Agent', role: '50-State Athletic Commission Coordination', icon: '🏛️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal-doping', name: 'Legal Agent', role: 'CAS Appeals & Suspension Enforcement', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'commercial-doping', name: 'Commercial Agent', role: 'PPV Card Impact & Fighter Replacement', icon: '📊', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'USADA Testing Portal', status: 'connected', type: 'Anti-Doping Results Management', icon: 'flask-conical', detail: 'Fighter Z: A-sample POSITIVE for rEPO (recombinant erythropoietin)' },
        { name: 'WADA ADAMS System', status: 'connected', type: 'Anti-Doping Administration', icon: 'database', detail: 'Whereabouts compliance: 94% (2 filing failures in 12 months)' },
        { name: '50-State Commission Hub', status: 'connected', type: 'Cross-Jurisdiction Suspensions', icon: 'globe', detail: 'Active licenses: NV, CA, NY, TX, FL — all require notification' },
        { name: 'CAS Precedent Engine', status: 'syncing', type: 'Anti-Doping Arbitration', icon: 'scale', detail: '847 doping arbitration cases indexed' },
      ],
      script: [
        { agentId: 'usada', phase: 'phase1', type: 'warning', delay: 800, content: 'PRIORITY ALERT. Fighter Z — current UFC Bantamweight Champion — has tested positive for recombinant EPO (rEPO) in an out-of-competition test collected on February 14th. This mirrors the TJ Dillashaw case (2019): Dillashaw tested positive for rEPO before his flyweight title shot, received a 2-year suspension, and the positive test was only disclosed AFTER the fight had already occurred. Key facts: (1) A-sample confirmed positive at WADA-accredited UCLA laboratory, (2) Fighter Z has been notified and has 10 days to request B-sample analysis, (3) Mandatory provisional suspension is effective IMMEDIATELY under UFC Anti-Doping Policy Article 7.9, (4) Fighter Z is scheduled to headline UFC 315 in 3 weeks — a PPV card with $28M in projected revenue.' },
        { agentId: 'commercial-doping', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Commercial impact assessment: UFC 315 has Fighter Z defending the bantamweight title as the main event. Projected metrics: $28M total revenue ($9.4M gate + $18.6M PPV), 720K PPV buys, ESPN+ contractual main event requirement. Pulling Fighter Z: (1) No ranked bantamweight replacement available in 3 weeks, (2) Must elevate co-main to main event — estimated 35% PPV downsell, (3) ESPN+ contract requires "championship-calibre" main event or UFC absorbs revenue guarantee, (4) Estimated financial impact: $9.8M in lost revenue. The Dillashaw precedent shows that USADA violations of champions cause maximum commercial disruption.' },
        { agentId: 'commission', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Fighter Z holds active licenses in 5 states: Nevada, California, New York, Texas, Florida. Under ABC (Association of Boxing Commissions) reciprocity guidelines, a USADA suspension should be honored by all state commissions — but USADA is a private contractor, not a government body. Specific problem: (1) Nevada NAC will honor USADA suspension — they co-regulate, (2) California CSAC requires their own notification and independent review, (3) New York NYSAC has historically been slow to process USADA reciprocity, (4) Texas TDLR may not recognize USADA at all — they have their own testing programme. Without Datacendia\'s unified suspension tracking, Fighter Z could theoretically obtain a license in Texas during a USADA suspension. This is the cross-jurisdiction chaos that makes combat sports regulation uniquely complex.' },
        { agentId: 'legal-doping', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISSENT LOGGED. Before we proceed with the provisional suspension, Fighter Z\'s legal team will raise: (1) Chain-of-custody challenge — was the sample properly transported from collection site to UCLA lab? Any gap in the sealed chain invalidates the result. (2) B-sample right — Fighter Z has the right to request B-sample analysis at a different WADA lab. (3) Therapeutic Use Exemption (TUE) — does Fighter Z have a medical condition that would justify EPO use? Unlikely for rEPO, but must be documented. (4) CAS appeal probability — in 847 EPO doping cases, athletes who challenged chain-of-custody won 8.3% of the time. If the chain-of-custody documentation has ANY gap, this prosecution fails. The evidence chain must be cryptographically sealed from collection to result.' },
        { agentId: 'usada', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Anti-Doping Evidence Protocol: (1) Complete chain-of-custody sealed — from USADA Doping Control Officer collection (February 14, 8:47 AM PST) through transport, lab receipt, analysis, and result notification — every handoff timestamped with CendiaChronos and ML-DSA-65 signed. (2) Cross-jurisdiction suspension notification sent simultaneously to all 5 state commissions with sealed evidence — no delay, no gaps. (3) B-sample rights documentation sealed — Fighter Z\'s notification, response deadline, and any request tracked. (4) UFC 315 card reconstruction documented with commercial impact analysis — proving UFC absorbed $9.8M in losses rather than compromising anti-doping integrity.' },
        { agentId: 'legal-doping', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The sealed chain-of-custody eliminates the defence\'s strongest argument. In the Dillashaw case, the chain-of-custody was documented on paper forms — Datacendia makes it cryptographically unimpeachable. CAS appeal probability with sealed evidence drops from 8.3% to under 1%. The simultaneous 50-state notification closes the jurisdiction-shopping loophole. And the documented $9.8M revenue loss proves UFC prioritizes anti-doping over commercial interests — critical for the Le v. Zuffa antitrust defence. This is the gold standard for combat sports anti-doping governance.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:e6f7890abcdef123456789012345678901234567890abcdef1234567890abcde',
        merkleRoot: 'f7890abcdef12345678901234567890123456789abcdef01234567890abcdef012',
        merkleLabel: 'Merkle Tree Root (Sample collection + Lab analysis + Chain-of-custody + 50-state notification)',
        complianceLabel: 'Anti-Doping Status',
        complianceValue: 'PROVISIONAL SUSPENSION',
        complianceThreshold: 'rEPO positive — A-sample confirmed',
        agents: ['USADA Compliance Agent', 'Commission Agent', 'Legal Agent', 'Commercial Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'USADA Anti-Doping — Chain-of-Custody Cryptographically Sealed',
        guaranteeBody: 'This cryptographic bundle seals the complete anti-doping proceeding: sample collection (Feb 14, 8:47 AM), transport chain, UCLA lab analysis, A-sample positive result (rEPO), provisional suspension notification, 50-state commission coordination, B-sample rights documentation, and UFC 315 card reconstruction ($9.8M revenue loss absorbed). CAS appeal probability: <1%. Evidence proves UFC\'s anti-doping programme is the gold standard in combat sports.',
        evidenceChain: 'USADA collection (Feb 14) → Sealed transport → UCLA lab analysis → rEPO positive → Provisional suspension → 50-state notification → B-sample rights → UFC 315 reconstruction → $9.8M loss documentation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate a champion\'s EPO positive — coordinating USADA proceedings, 50-state suspension reciprocity, and PPV card reconstruction while preserving CAS-ready evidence.',
      phaseLabels: ['Positive Test Triage', 'Jurisdiction & Legal Defence', 'Evidence Sealing & Card Reconstruction'],
    },

    // =========================================================================
    // SCENARIO 4 — MATCHMAKING BIAS: COMMERCIAL VS SAFETY
    // =========================================================================
    {
      id: 'matchmaking-bias',
      title: 'Matchmaking Bias — When PPV Revenue Overrides Safety',
      subtitle: 'Champion returning from KO loss · $25M PPV pressure · AI safety flag · Cognitive bias detection',
      banner: 'Simulating the hardest governance question in combat sports: a champion with massive PPV draw is returning from a brutal KO loss. Commercial pressure says book the fight immediately. AI safety says wait. Who wins?',
      risk: 'High',
      scenarioNum: 'Bias Detection',
      icon: 'eye',
      color: 'text-yellow-400',
      agents: [
        { id: 'matchmaker', name: 'Matchmaking Agent', role: 'Fighter Ranking & Style Analysis', icon: '🎯', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
        { id: 'bias', name: 'Cognitive Bias Agent', role: 'Commercial-Safety Conflict Detection', icon: '🧠', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'safety-match', name: 'Fighter Safety Agent', role: 'Medical History & Return-to-Competition', icon: '🫀', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'legal-match', name: 'Legal Agent', role: 'Duty of Care & Antitrust Defence', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Fighter Rankings Database', status: 'connected', type: 'Skill Rating & Matchup Analysis', icon: 'activity', detail: 'Fighter A: P4P #3, returning from R2 KO loss (Oct 2025)' },
        { name: 'Medical History Portal', status: 'connected', type: 'Fighter Medical Records', icon: 'heart', detail: 'Fighter A: 90-day medical suspension expires Jan 15, 2026' },
        { name: 'PPV Projection Engine', status: 'connected', type: 'Commercial Value Modelling', icon: 'trending-up', detail: 'Fighter A headline bout: 1.2M PPV buys projected' },
        { name: 'CendiaPrecedent', status: 'connected', type: 'Historical Matchmaking Decisions', icon: 'database', detail: '47 comparable return-from-KO matchmaking decisions indexed' },
      ],
      script: [
        { agentId: 'matchmaker', phase: 'phase1', type: 'analysis', delay: 800, content: 'Matchmaking assessment for Fighter A — pound-for-pound #3, former champion, returning from a Round 2 KO loss in October 2025. 90-day medical suspension expires January 15, 2026. Dana White has publicly stated: "Fighter A wants the rematch, and the fans want it. We\'re targeting UFC 318 in March." UFC 318 is a tentpole PPV card with projected 1.2M buys ($95M+ revenue). The proposed opponent is the fighter who KO\'d Fighter A — a rematch with built-in narrative. Matchmaking analysis: Fighter A\'s skillset is elite, the opponent is a legitimate top-5 contender, and the matchup is commercially compelling. However — Fighter A was KO\'d in Round 2 by a head kick. The return timeline is 5 months from a significant KO.' },
        { agentId: 'bias', phase: 'phase1', type: 'warning', delay: 2500, content: 'COGNITIVE BIAS ALERT — PATTERN DETECTED. This matchmaking proposal exhibits 3 classic commercial-safety bias indicators: (1) Anchoring bias — Dana White\'s public commitment creates anchoring pressure to proceed (the CEO said it, so matchmakers work backward from the conclusion), (2) Optimism bias — "Fighter A is elite, they\'ll be fine" overweights fighter reputation and underweights the specific KO mechanism (head kick KO = higher concussion risk than body shot TKO), (3) Revenue framing — the $95M revenue figure is certain and immediate; the injury risk is uncertain and probabilistic. CendiaPrecedent analysis: of 47 comparable return-from-KO decisions, fighters who returned within 6 months of a head-kick KO had a 34% TKO/KO loss rate in their next fight — vs 12% for fighters who waited 9+ months.' },
        { agentId: 'safety-match', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Fighter A\'s medical profile raises specific concerns: (1) Head-kick KO mechanism — the most dangerous stoppage type for subsequent brain trauma. Fighter A lost consciousness for 4.2 seconds. (2) Career KO history — this is Fighter A\'s 3rd KO loss in their career. Cumulative head trauma risk increases non-linearly with each KO. (3) 5-month return — while the 90-day medical suspension will have expired, NFL concussion protocols recommend 6-9 months after loss of consciousness. MMA has no equivalent protocol. (4) Rematch opponent — Fighter A is being matched against the SAME fighter who KO\'d them. Psychological factors (flinching, gun-shyness) are documented in combat sports after KO losses. I am recommending a 9-month minimum return timeline AND a different opponent for the first fight back.' },
        { agentId: 'legal-match', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The Le v. Zuffa antitrust case specifically alleges that UFC prioritizes profit over fighter safety. If we book Fighter A for a 5-month return against the same opponent, and Fighter A suffers another KO, the plaintiff\'s attorneys will use this as evidence of exactly that allegation. Conversely — if we demonstrate that UFC\'s AI flagged the bias, recommended a longer timeline, and UFC followed the recommendation even at the cost of $95M in PPV revenue — that becomes our strongest antitrust defence exhibit. The matchmaking decision here is simultaneously a safety decision and a $1.6B antitrust litigation decision.' },
        { agentId: 'matchmaker', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Bias-Adjusted Matchmaking Protocol: (1) Fighter A return timeline extended to 9 months (June 2026, UFC 322) — AI safety recommendation documented and followed. (2) First fight back: different opponent (ranked #7-10 range) to reduce psychological rematch pressure. (3) The commercially compelling rematch is preserved for UFC 325 (September 2026) — actually INCREASING total revenue by creating a 2-fight narrative arc. (4) Counter-suggestion: the March 2026 UFC 318 slot is filled with an alternative main event generating projected 800K PPV buys. Total revenue across both cards: $140M vs $95M for the single rushed return. Safety AND commercial interests are aligned when bias is removed.' },
        { agentId: 'bias', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Bias detection RESOLVED. The counter-suggestion demonstrates that commercial-safety conflicts are often false dichotomies created by cognitive bias. The rushed return ($95M single card) is actually LESS profitable than the bias-adjusted 2-card arc ($140M total). Every bias indicator is documented: (1) Dana White anchoring — acknowledged and overridden with data, (2) Optimism bias — replaced with CendiaPrecedent statistical analysis, (3) Revenue framing — expanded from single-card to multi-card analysis. The Regulator\'s Receipt proves UFC used AI to detect and correct commercial-safety bias — transforming a liability into a governance showcase.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:89abcdef0123456789012345678901234567890abcdef1234567890abcdef012',
        merkleRoot: '9abcdef01234567890123456789012345678901234567890abcdef1234567890ab',
        merkleLabel: 'Merkle Tree Root (Bias detection + CendiaPrecedent analysis + Medical profile + Revenue modelling)',
        complianceLabel: 'Bias Detection',
        complianceValue: '3/3 BIASES CORRECTED',
        complianceThreshold: 'anchoring, optimism, revenue framing',
        agents: ['Matchmaking Agent', 'Cognitive Bias Agent', 'Fighter Safety Agent', 'Legal Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Cognitive Bias Correction — Safety & Revenue Aligned',
        guaranteeBody: 'This cryptographic bundle seals the complete matchmaking bias analysis: 3 cognitive biases detected and corrected (anchoring, optimism, revenue framing), CendiaPrecedent statistical analysis (47 comparable decisions), medical profile review, and bias-adjusted counter-suggestion generating $140M across 2 cards vs $95M for rushed single return. Evidence proves UFC uses AI to systematically detect and correct commercial-safety bias in matchmaking.',
        evidenceChain: 'Fighter A profile → KO history analysis → Bias detection (3 indicators) → CendiaPrecedent (47 comparables) → Medical assessment → Counter-suggestion generation → Revenue modelling ($140M vs $95M) → Dana White notification → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will detect cognitive bias in a high-stakes matchmaking decision — proving that safety and commercial interests align when bias is removed.',
      phaseLabels: ['Matchmaking & Bias Detection', 'Safety & Legal Escalation', 'Bias-Corrected Counter-Proposal'],
    },

    // =========================================================================
    // SCENARIO 5 — NYSE:TKO GOVERNANCE: SOX-COMPLIANT AI REPORTING
    // =========================================================================
    {
      id: 'nyse-tko',
      title: 'NYSE:TKO Governance — SOX-Compliant AI Reporting',
      subtitle: '$21B enterprise · SEC 10-K filing · AI decision audit · Endeavor portfolio cascade',
      banner: 'Simulating a quarterly SEC reporting cycle for TKO Group Holdings (NYSE:TKO, $21B EV), where AI-assisted business decisions across UFC and WWE must be documented to SOX standards for the 10-K/10-Q filing.',
      risk: 'High',
      scenarioNum: 'NYSE:TKO',
      icon: 'trending-up',
      color: 'text-emerald-400',
      agents: [
        { id: 'sox', name: 'SOX Compliance Agent', role: 'Section 302/404 Internal Controls & AI Governance', icon: '📋', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'sec', name: 'SEC Reporting Agent', role: '10-K/10-Q Material Decision Disclosure', icon: '🏛️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal-sox', name: 'Legal Agent', role: 'Material Decision Classification & Risk Factors', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'audit', name: 'External Audit Agent', role: 'Ernst & Young AI Governance Attestation', icon: '🔍', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'TKO Financial System', status: 'connected', type: 'Quarterly Financial Data', icon: 'dollar-sign', detail: 'Q4 2025: $1.8B revenue, $340M EBITDA' },
        { name: 'AI Decision Registry', status: 'connected', type: 'Material AI Decisions', icon: 'database', detail: '2,847 AI-assisted decisions logged in Q4 2025' },
        { name: 'SEC EDGAR Portal', status: 'connected', type: 'Filing Submission', icon: 'file-text', detail: '10-K deadline: February 28, 2026' },
        { name: 'Ernst & Young Audit', status: 'syncing', type: 'External Attestation', icon: 'search', detail: 'AI governance audit — fieldwork in progress' },
      ],
      script: [
        { agentId: 'sox', phase: 'phase1', type: 'analysis', delay: 800, content: 'SOX Section 404 AI governance assessment for Q4 2025. TKO Group Holdings operates AI-assisted decisions across 4 material categories: (1) Fighter safety AI — 847 weight-cut monitoring, fight-stoppage, and medical clearance decisions with $120M+ in aggregate liability exposure, (2) Matchmaking algorithms — 312 fight bookings with combined PPV/gate revenue of $890M, (3) Broadcast production AI — automated camera and replay systems across 42 events generating $460M in broadcast revenue, (4) Commercial AI — contract valuation, sponsorship pricing, and PPV projection models affecting $1.8B in quarterly revenue. Total: 2,847 AI-assisted decisions requiring SOX-compliant governance documentation. Under SEC emerging AI disclosure requirements, each material AI system must demonstrate: model governance, human oversight, and override accountability.' },
        { agentId: 'audit', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. Ernst & Young preliminary findings identify 3 control gaps: (1) Fight-stoppage AI — 23 instances where the AI recommendation was overridden by referees, but only 14 have documented rationale for the override. 9 overrides lack accountability documentation — a SOX material weakness. (2) Matchmaking algorithm — 4 fight bookings where the commercial projection was documented but the safety assessment was not independently verified. (3) PPV projection model — the model was updated mid-quarter without change management documentation. These gaps would require management attestation under Section 302 that internal controls are effective — currently, they are not.' },
        { agentId: 'legal-sox', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The 9 undocumented referee overrides are the most critical finding. Under SEC materiality guidance, a fight-stoppage AI override that leads to fighter injury could result in litigation exceeding $50M per incident — material to TKO\'s financial statements. If we attest to effective AI governance controls without resolving these gaps, and a subsequent incident reveals the gap, we face: (1) SEC enforcement action for material misstatement, (2) Shareholder derivative lawsuit alleging management knew about control failures, (3) D&O insurance coverage dispute. I am recommending that TKO disclose the AI governance gaps as a "material weakness" in the 10-K, with a remediation plan referencing Datacendia implementation.' },
        { agentId: 'sec', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. Disclosing a material weakness in AI governance in the 10-K will: (1) Trigger analyst downgrades — AI governance is a key TKO differentiator vs traditional sports, (2) Invite plaintiff attorney scrutiny — every future fighter injury claim will reference the disclosed weakness, (3) Create a competitive advantage concern — rival promotions (PFL, Bellator) will use the disclosure in their marketing. However, NOT disclosing when management is aware creates far greater risk. The SEC has brought 14 enforcement actions in 2024-2025 for AI governance misstatements. We must disclose — but we can frame it proactively.' },
        { agentId: 'sox', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia SOX Remediation Protocol: (1) The 9 undocumented referee overrides are retroactively captured using post-fight video analysis and referee interviews — sealed with CendiaChronos timestamps noting the retroactive capture. (2) Going forward, ALL fight-stoppage AI overrides receive mandatory real-time documentation through the Override Accountability Protocol. (3) Matchmaking safety assessments receive independent verification checkpoints. (4) AI model change management is integrated into Datacendia\'s model governance framework. (5) The 10-K discloses the gap AND the Datacendia remediation — framing TKO as the first public company to implement post-quantum cryptographic AI governance. The weakness becomes a strength narrative.' },
        { agentId: 'legal-sox', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The remediation protocol transforms the disclosure from a weakness into a first-mover advantage. The 10-K language: "During Q4 2025, management identified gaps in AI governance documentation for fight-safety systems. TKO has implemented Datacendia\'s cryptographic AI governance platform — becoming the first NYSE-listed company to deploy post-quantum sealed AI decision evidence for SEC compliance. All material AI systems now produce Regulator\'s Receipts meeting SOX Section 404 attestation standards." Ernst & Young can attest to the remediation in their audit opinion. The Regulator\'s Receipt makes every AI decision SEC-audit-ready.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleRoot: '123456789abcdef00123456789abcdef0123456789abcdef0123456789abcdef01',
        merkleLabel: 'Merkle Tree Root (2,847 AI decisions + EY audit findings + Remediation plan + 10-K disclosure)',
        complianceLabel: 'SOX Compliance',
        complianceValue: 'REMEDIATED',
        complianceThreshold: 'Section 302/404 attestation ready',
        agents: ['SOX Compliance Agent', 'SEC Reporting Agent', 'Legal Agent', 'External Audit Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'NYSE:TKO — First Public Company with Post-Quantum AI Governance',
        guaranteeBody: 'This cryptographic bundle seals TKO Group Holdings\' complete Q4 2025 AI governance audit: 2,847 AI-assisted decisions across fighter safety, matchmaking, broadcast, and commercial systems. Ernst & Young control gap findings, remediation actions, and 10-K disclosure language are sealed. Every material AI decision now produces a Regulator\'s Receipt meeting SOX Section 404 attestation standards. TKO is the first NYSE-listed company to deploy post-quantum cryptographic AI governance for SEC compliance.',
        evidenceChain: 'Q4 2025 AI decisions (2,847) → SOX Section 404 assessment → EY control gaps (3 findings) → Remediation protocol → Override accountability (9 retroactive) → Model change management → 10-K disclosure draft → SEC filing preparation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate TKO\'s SEC reporting cycle — identifying AI governance gaps, building a remediation plan, and transforming a material weakness into a first-mover advantage.',
      phaseLabels: ['SOX AI Governance Assessment', 'Control Gap Discovery', 'Remediation & Disclosure Strategy'],
    },
  ],
};

export default config;
