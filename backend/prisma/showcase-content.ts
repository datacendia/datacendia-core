// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SHOWCASE DELIBERATION CONTENT — 5 Verticals
// Imported by seed-council-showcase.ts
// =============================================================================

type AK = 'strategist' | 'analyst' | 'risk' | 'operator' | 'advocate' | 'ethics';

interface AgentAnalysis { agent: AK; content: string; confidence: number; }
interface CrossExam { challenger: AK; target: AK; challenge: string; rebuttal: string; }

export interface DelibDef {
  key: string;
  question: string;
  vertical: string;
  verticalLabel: string;
  userId: string;
  userName: string;
  confidence: number;
  createdDaysAgo: number;
  completedDaysAgo: number;
  agents: AK[];
  analyses: AgentAnalysis[];
  crossExams: CrossExam[];
  synthesis: string;
  ethicsNote: string;
  recommendation: string;
  status: string;
  keyInsight: string;
  dissent?: { agent: AK; position: string };
  humanReview?: { reviewer: string; note: string; daysAgo: number };
  summaryTitle: string;
  keyPoints: string[];
  risks: string[];
  nextSteps: string[];
}

// =============================================================================
// 1. FINANCIAL SERVICES — Meridian National Bank CRE Acquisition
// =============================================================================

const FINANCIAL: DelibDef = {
  key: 'financial-cre',
  question: 'Should Meridian National Bank proceed with the $1.7B acquisition of the Apex Tower commercial real estate portfolio?',
  vertical: 'financial-services',
  verticalLabel: 'Financial Services',
  userId: 'user-ceo-sarah',
  userName: 'Sarah Chen',
  confidence: 0.58,
  createdDaysAgo: 5,
  completedDaysAgo: 5,
  agents: ['strategist', 'analyst', 'risk', 'advocate', 'ethics'],
  analyses: [
    {
      agent: 'strategist',
      confidence: 0.45,
      content: `The CRE market is experiencing a structural repricing driven by remote work permanence, rising interest rates, and tightening credit conditions. Apex Tower's 22% discount to 2019 appraised value initially appears attractive, but this must be contextualized against the 31% average decline in comparable Class A office portfolios since 2022. The strategic timing is poor — we are acquiring into a falling market with no clear catalyst for recovery. Meridian's existing CRE concentration at 34% of total assets already exceeds the 30% threshold that triggered enhanced OCC scrutiny for comparable institutions last year. This acquisition would push concentration to approximately 41%, placing Meridian in the highest regulatory risk tier for CRE lending.`,
    },
    {
      agent: 'analyst',
      confidence: 0.35,
      content: `The headline "22% discount" is misleading. When we adjust for the 2019 appraisal methodology that used a 5.2% cap rate versus today's market-clearing rate of 7.8%, the actual discount to current fair value is approximately 2.2% — barely above transaction costs. The seller's broker is anchoring on a pre-pandemic valuation that no longer reflects market reality. More critically, Meridian's internal risk models have not been validated against post-2022 CRE market data. Under SR 11-7 (Guidance on Model Risk Management), the bank is required to validate models before using them for material acquisition decisions. The current models were last validated in Q3 2021 and assume a cap rate environment of 4.5%-5.5%. Using these models to underwrite a $1.7B acquisition at 7.8% cap rates constitutes a model risk management failure that examiners would flag.`,
    },
    {
      agent: 'risk',
      confidence: 0.30,
      content: `This acquisition presents three compounding risk factors. First, concentration risk: 41% CRE exposure would trigger automatic enhanced examination under the 2006 Interagency CRE Guidance, which has been actively enforced since the 2023 regional banking stress. Second, interest rate risk: Meridian's ALM position shows a -$47M EVE sensitivity to a +100bp rate shock. Adding $1.7B in long-duration CRE assets with an average lease maturity of 6.2 years extends duration further into an inverted yield curve. Third, the SR 11-7 validation gap identified by the Financial Analyst is not merely a compliance issue — it represents a fundamental uncertainty about whether the acquisition is priced correctly. We cannot recommend proceeding when the models underwriting the decision have not been validated for current market conditions.`,
    },
    {
      agent: 'advocate',
      confidence: 0.62,
      content: `The Council is exhibiting classic loss aversion by focusing on downside risks while ignoring the asymmetric upside. CRE markets are cyclical, and Meridian has the balance sheet strength to acquire counter-cyclically. The key question isn't whether the market is declining — it's whether $1.7B is a good price for these specific assets with these specific tenants. Apex Tower has a weighted average lease term of 8.3 years with 72% investment-grade tenants. If we could negotiate the price down to $1.55B or below, the risk-adjusted return exceeds Meridian's hurdle rate even under stressed scenarios. I recommend conditional approval: proceed at ≤$1.55B with a 90-day SR 11-7 model revalidation window and a board-approved concentration risk exception.`,
    },
    {
      agent: 'ethics',
      confidence: 0.40,
      content: `The fiduciary dimension is decisive. Meridian holds $23.4B in deposits, of which $8.7B are uninsured. The acquisition would deploy 7.3% of total assets into a single asset class that has experienced the largest valuation correction since 2008. Bank executives have a fiduciary duty to depositors that supersedes the strategic desire to acquire counter-cyclically. The SR 11-7 gap is not merely a technical compliance issue — it means the board cannot certify to regulators that it understands the risk it is assuming on behalf of depositors. Proceeding without model revalidation would expose the board to personal liability under the Federal Deposit Insurance Act's negligence standard. The ethical path is clear: complete the model revalidation before making any acquisition decision.`,
    },
  ],
  crossExams: [
    {
      challenger: 'risk',
      target: 'advocate',
      challenge: `Your conditional approval at $1.55B still places concentration at ~40%. Can you name a single bank that received a favorable examination outcome with 40%+ CRE concentration in the past 18 months? The 2006 Guidance thresholds haven't been relaxed — they've been enforced more strictly since Silicon Valley Bank.`,
      rebuttal: `Fair point on the examination outcomes. However, Signature Bank and NYCB had fundamentally different risk profiles — rent-stabilized multifamily with compressed margins, not Class A office with investment-grade tenants. Three banks in the Southeast received satisfactory ratings at 38-42% CRE concentration in 2024 by demonstrating robust risk management frameworks. Meridian could do the same — but I concede that completing the SR 11-7 revalidation first is a prerequisite, not an option.`,
    },
    {
      challenger: 'analyst',
      target: 'advocate',
      challenge: `Your $1.55B price target assumes the 2019 appraisal methodology is directionally correct and just needs adjustment. But the 2019 appraisal used a DCF model with a 2.5% terminal growth rate for office rents. Post-pandemic office rent growth in comparable markets has been -1.2% annually. The entire valuation framework needs to be rebuilt. Are you comfortable recommending even a conditional acquisition when the fundamental valuation model is structurally broken?`,
      rebuttal: `You're right that the DCF terminal growth assumption is stale. But my $1.55B target wasn't derived from the 2019 model — it's based on a direct capitalization approach using Apex Tower's actual in-place NOI of $112M and a 7.2% cap rate, reflecting a 60bp premium to market for tenant quality. The real question is whether $1.55B / $112M NOI = 7.2% cap rate adequately compensates for concentration and interest rate risks. I believe it does, but only after model revalidation confirms it.`,
    },
    {
      challenger: 'ethics',
      target: 'strategist',
      challenge: `You mentioned the OCC scrutiny threshold. Let me sharpen this: if Meridian proceeds and the CRE portfolio subsequently loses 15% of value, uninsured depositors face potential losses in a resolution scenario. Is the board prepared to explain to those depositors why it increased CRE concentration to 41% despite knowing the models hadn't been validated?`,
      rebuttal: `No responsible board could answer that question affirmatively. The 15% loss scenario would erode $255M in capital against Meridian's CET1 buffer of $1.8B — survivable, but it would push the bank below the well-capitalized threshold and trigger Prompt Corrective Action. The board's duty to depositors must take priority. I maintain my recommendation: do not proceed.`,
    },
  ],
  synthesis: `**RECOMMENDATION: DO NOT PROCEED**\n\nThe Council reaches a 4-1 consensus against the Apex Tower acquisition at $1.7B. The central finding is that the marketed "22% discount" is a mirage — when adjusted for current cap rates and market conditions, the actual discount to fair value is approximately 2.2%, barely covering transaction costs.\n\nThe SR 11-7 model validation gap is a blocking issue. Meridian's internal risk models were last validated against pre-2022 market data and cannot reliably underwrite a $1.7B acquisition in current conditions. Proceeding without revalidation would constitute a supervisory deficiency.\n\nThe CRE concentration would reach 41% of total assets, exceeding the 30% threshold for enhanced regulatory scrutiny. Combined with the $8.7B in uninsured deposits, this creates fiduciary risk the board cannot responsibly assume.\n\n**Dissenting view preserved:** The Devil's Advocate recommends conditional approval at ≤$1.55B with mandatory SR 11-7 revalidation and board-approved concentration exception. The Council acknowledges this path could be revisited after model revalidation is complete — but the acquisition at $1.7B is not supportable under any scenario.`,
  ethicsNote: 'Ethics gate PASSED. Fiduciary duty to depositors preserved by DO NOT PROCEED recommendation. Dissenting view documented per Override Accountability (P3).',
  recommendation: 'DO NOT PROCEED',
  status: 'BLOCKED',
  keyInsight: '22% discount is actually 2.2% to fair value — SR 11-7 model validation gap is a blocking issue',
  dissent: { agent: 'advocate', position: 'Conditional approval at ≤$1.55B with mandatory SR 11-7 revalidation. Counter-cyclical opportunity has merit at the right price.' },
  humanReview: {
    reviewer: 'Sarah Chen, CRO',
    note: 'Concur with Council recommendation. The SR 11-7 gap is dispositive — we cannot defend this to examiners. Escalating to CEO with conditional path: revisit after Q2 model revalidation if pricing holds below $1.55B. — S. Chen',
    daysAgo: 5,
  },
  summaryTitle: 'Meridian National Bank — Apex Tower CRE Portfolio Acquisition Analysis',
  keyPoints: [
    'The "22% discount" to 2019 appraised value represents only 2.2% discount to current fair value after cap rate adjustment',
    'SR 11-7 model validation not performed against post-2022 CRE data — blocking regulatory issue',
    'CRE concentration would reach 41% of total assets, exceeding 30% enhanced scrutiny threshold',
    'Investment-grade tenant base (72%) provides downside protection but does not offset concentration and model risks',
  ],
  risks: [
    'Regulatory enforcement action for proceeding with unvalidated models (SR 11-7)',
    'CRE concentration triggers automatic enhanced OCC examination',
    '$8.7B in uninsured deposits creates fiduciary exposure in a loss scenario',
    'Interest rate sensitivity: -$47M EVE impact per +100bp rate shock',
  ],
  nextSteps: [
    'Complete SR 11-7 model revalidation for CRE portfolio (estimated 90 days)',
    'Reassess Apex Tower at market-clearing cap rates upon revalidation completion',
    'Engage OCC relationship manager to discuss concentration exception framework',
    'If revalidated models support acquisition at ≤$1.55B, reconvene Council',
  ],
};

// =============================================================================
// 2. HEALTHCARE — SepsisSense SaMD Classification
// =============================================================================

const HEALTHCARE: DelibDef = {
  key: 'healthcare-sepsisense',
  question: 'Should we deploy the SepsisSense AI diagnostic tool as a Class II Software as Medical Device (SaMD) for ICU sepsis screening?',
  vertical: 'healthcare',
  verticalLabel: 'Healthcare',
  userId: 'user-coo-emily',
  userName: 'Emily Watson',
  confidence: 0.54,
  createdDaysAgo: 14,
  completedDaysAgo: 14,
  agents: ['strategist', 'analyst', 'risk', 'operator', 'ethics'],
  analyses: [
    {
      agent: 'strategist',
      confidence: 0.50,
      content: `SepsisSense addresses a genuine clinical need — sepsis kills 350,000 Americans annually and early detection reduces mortality by 20-30%. The AI diagnostic market for critical care is projected at $4.2B by 2028. However, three FDA-cleared sepsis screening tools already exist, with Epic's integrated module capturing 60% of market share through EHR bundling. Our differentiation must be clinical performance, not algorithmic novelty. The question isn't whether to enter this market — it's whether our current validation data supports a Class II submission that can withstand FDA scrutiny and post-market surveillance requirements.`,
    },
    {
      agent: 'analyst',
      confidence: 0.35,
      content: `The headline sensitivity of 87% requires critical adjustment. SepsisSense was validated on a dataset with 18% sepsis prevalence — typical of ICU retrospective studies. In real-world ICU screening, prevalence is approximately 6-8%. Applying Bayes' theorem with 87% sensitivity and 91% specificity at 7% prevalence yields a positive predictive value of 42.3%. This means 57.7% of alerts would be false positives. More critically, the effective sensitivity — the probability a true sepsis case is both detected AND acted upon before the clinical window closes — drops to approximately 54.8% when accounting for alert fatigue from the false positive rate.`,
    },
    {
      agent: 'risk',
      confidence: 0.30,
      content: `The clinical validation gap is a patient safety issue. Three specific risks: First, the training dataset underrepresents patients over 75 and immunocompromised populations — exactly the demographics most vulnerable to sepsis. Performance degrades to 71% sensitivity in the >75 cohort. Second, the 510(k) predicate comparison is weak — the predicate uses traditional SIRS criteria, not ML-based scoring, which the FDA has signaled requires additional validation under the SaMD framework. Third, post-market liability: if SepsisSense misses a sepsis case resulting in patient death, our clinical evidence cannot defend against strict liability claims.`,
    },
    {
      agent: 'operator',
      confidence: 0.45,
      content: `ICU deployment introduces operational complexity beyond the algorithm. Integration requires real-time HL7 FHIR feeds from bedside monitors, lab systems, and the EHR — a minimum 6-month integration timeline per hospital. Nursing workflow studies show alert systems with PPV below 50% are routinely silenced within 90 days ("alert fatigue decay"). At our projected 42% PPV, SepsisSense faces the same fate unless we implement tiered alerting with nursing informatics input, adding 3-4 months to implementation.`,
    },
    {
      agent: 'ethics',
      confidence: 0.25,
      content: `Patient safety is paramount. Deploying a tool with 54.8% effective sensitivity means nearly half of sepsis cases won't be caught. Clinicians and patients will have a false sense of security from the "AI monitoring" designation. Informed consent implications are significant — patients cannot meaningfully consent to AI-assisted care if real-world performance diverges substantially from marketed performance. The alert fatigue burden on nursing staff may actively degrade care quality for non-sepsis patients. This is not ready for deployment.`,
    },
  ],
  crossExams: [
    {
      challenger: 'advocate',
      target: 'analyst',
      challenge: `Your Bayesian adjustment assumes uniform prevalence across all ICU patients. SepsisSense is designed for targeted screening of high-risk admissions where prevalence is 15-20%. Doesn't the PPV improve substantially in that subpopulation?`,
      rebuttal: `PPV improves to ~68% at 18% prevalence — but this requires a pre-screening step to identify the high-risk cohort, introducing its own sensitivity losses. The 510(k) submission claims general ICU screening, not targeted subpopulation use. Narrowing the indication for use requires a new clinical study. You can't submit for general screening and deploy for targeted use — FDA considers that an off-label promotion risk.`,
    },
    {
      challenger: 'ethics',
      target: 'strategist',
      challenge: `You framed this as a market opportunity question. We're discussing a tool for critically ill patients in life-threatening situations. Shouldn't clinical readiness be the threshold, not market timing?`,
      rebuttal: `Absolutely. I should have led with clinical readiness rather than market positioning. Even from a pure market perspective, launching with inadequate validation creates more brand damage than any first-mover advantage. A failed deployment or adverse event would set the entire AI diagnostics program back years. I revise my position: clinical validation must be the gate, and we haven't cleared it.`,
    },
  ],
  synthesis: `**RECOMMENDATION: DO NOT DEPLOY**\n\nThe Council reaches unanimous consensus against deploying SepsisSense as a Class II SaMD in its current state. The central finding is that the reported 87% sensitivity drops to approximately 54.8% effective sensitivity when accounting for real-world ICU prevalence rates and alert fatigue effects.\n\nThree blocking issues: (1) Clinical validation data does not adequately represent the target patient population, particularly elderly and immunocompromised patients. (2) The positive predictive value of 42.3% at real-world prevalence generates unacceptable false positive rates. (3) The 510(k) predicate comparison is methodologically weak for an ML-based SaMD.\n\nThe Council recommends a 12-month remediation plan: conduct a prospective validation study at 3+ hospital sites with representative demographics, implement tiered alerting with nursing informatics input, and resubmit via the De Novo pathway rather than 510(k).`,
  ethicsNote: 'Ethics gate PASSED. Patient safety preserved by DO NOT DEPLOY recommendation. Prospective validation study will include diverse demographics and IRB oversight.',
  recommendation: 'DO NOT DEPLOY',
  status: 'BLOCKED',
  keyInsight: '87% sensitivity drops to 54.8% effective sensitivity at real-world ICU prevalence — clinical validation insufficient',
  summaryTitle: 'SepsisSense SaMD — Clinical Deployment Readiness Assessment',
  keyPoints: [
    'Effective sensitivity of 54.8% at real-world prevalence insufficient for safety-critical sepsis screening',
    'Positive predictive value of 42.3% will trigger alert fatigue within 90 days of deployment',
    'Training data underrepresents >75 age cohort — sensitivity degrades to 71%',
    '510(k) predicate comparison weak; De Novo pathway recommended',
  ],
  risks: [
    'Patient harm from missed sepsis cases due to false sense of AI monitoring security',
    'Alert fatigue degrading nursing workflow for all ICU patients',
    'FDA enforcement for off-label deployment if indication narrowed post-clearance',
    'Strict liability exposure if adverse event occurs with current evidence gaps',
  ],
  nextSteps: [
    'Design prospective multi-site validation study with IRB approval (3+ hospitals)',
    'Engage nursing informatics team for tiered alerting protocol with PPV >65% threshold',
    'Revalidate model on age-stratified cohorts emphasizing >75 and immunocompromised',
    'Prepare De Novo classification request with FDA Pre-Submission meeting',
  ],
};

// =============================================================================
// 3. ENERGY — Heartland Power Grid Emergency
// =============================================================================

const ENERGY: DelibDef = {
  key: 'energy-grid-emergency',
  question: 'Emergency: Heartland Power Grid facing cascading failure. 47,000 customers at risk. Solar dropping to zero in 8 minutes. HVAC demand spiking. What is the optimal response sequence?',
  vertical: 'energy',
  verticalLabel: 'Energy',
  userId: 'user-cto-david',
  userName: 'David Park',
  confidence: 0.82,
  createdDaysAgo: 1,
  completedDaysAgo: 1,
  agents: ['strategist', 'analyst', 'risk', 'operator', 'ethics'],
  analyses: [
    {
      agent: 'strategist',
      confidence: 0.78,
      content: `This is a time-critical scenario where the decision window is minutes, not days. The "sunset catastrophe" — solar generation (340MW) drops to zero in 8 minutes while residential demand increases ~180MW as HVAC engages for evening cooling. Net swing: -520MW in under 10 minutes. Reserve margin is 280MW from gas peakers, leaving a 240MW shortfall. Strategic priority: prevent cascading failure that could black out 47,000 customers and damage grid infrastructure requiring days to restore. Controlled load shedding is preferable to uncontrolled cascade.`,
    },
    {
      agent: 'analyst',
      confidence: 0.80,
      content: `Quantifying the gap: Current load 2,847MW. In 8 minutes: solar drops 340MW, demand increases 180MW, battery storage delivers 120MW for 45 minutes. Net shortfall: 340 + 180 - 120 - 280 (peakers) = 120MW deficit. The 120MW gap can be closed through demand response — 156MW contracted, but activation takes 4-6 minutes with 15-minute ramp-down. If activated NOW, the gap closes by minute 23 with a 12-minute vulnerability window requiring rotating load shedding. Cost of 12-minute controlled shedding affecting ~8,000 customers: ~$2.4M. Cost of uncontrolled cascade (47,000 customers, 4-8 hours): ~$47M plus infrastructure repair.`,
    },
    {
      agent: 'risk',
      confidence: 0.75,
      content: `The 12-minute vulnerability window is the critical risk. Best case: demand response activates in 4 minutes, shedding affects 5,000 for 8 minutes. Expected case: 6-minute activation, 8,000 customers for 12 minutes. Worst case: generator trip during rapid dispatch (3% probability), expanding gap to 240MW, requiring 25,000+ customer shedding. The worst case is survivable but severe. The cascading failure scenario — doing nothing — has 67% probability of uncontrolled blackout based on historical analogs. Accept controlled pain to prevent uncontrolled catastrophe.`,
    },
    {
      agent: 'operator',
      confidence: 0.85,
      content: `Recommend 4-step sequence, initiated simultaneously:\n\n**Step 1 (T+0):** Activate all 156MW contracted industrial demand response via SCADA.\n**Step 2 (T+0):** Dispatch all 280MW gas peaker capacity from warm standby (3-4 min).\n**Step 3 (T+2):** Deploy battery storage at max discharge (120MW/45min) to bridge peaker ramp.\n**Step 4 (T+4, CONDITIONAL):** If DR confirmation <80% by T+4, initiate rotating shedding in Zone 7 (~8,000 customers, 15 min max).\n\nStep 4 requires human dispatcher authorization. Steps 1-3 are automated. If DR exceeds 130MW by T+6, Step 4 can be aborted.`,
    },
    {
      agent: 'ethics',
      confidence: 0.82,
      content: `Two ethical imperatives. First, 47,000 customers include ~2,100 medically vulnerable households (home oxygen, dialysis, electric-dependent equipment) in our critical customer registry. Any shedding plan must exclude these addresses — Zone 7 rotation excludes all registered medical-priority customers. Second, the decision to shed load affecting 8,000 to protect 47,000 requires human authorization. This is not a decision an AI system should make autonomously. The Council can recommend; the human operator must decide.`,
    },
  ],
  crossExams: [
    {
      challenger: 'analyst',
      target: 'operator',
      challenge: `Your sequence assumes all peakers reach full output in 3-4 minutes. Unit 7 at Riverside has been showing 6-minute starts recently. If it lags, the vulnerability window extends. Have you factored degraded peaker performance?`,
      rebuttal: `Good catch. Unit 7's degraded start is noted. Battery storage in Step 3 specifically bridges the peaker ramp gap — 120MW during that window. If Unit 7 fails entirely, we lose 45MW of 280MW capacity, making Step 4 mandatory rather than conditional. The sequence is robust to single-unit failure.`,
    },
    {
      challenger: 'ethics',
      target: 'risk',
      challenge: `You described worst case as "politically damaging." There are 2,100 medically vulnerable households at stake. A 25,000-customer shedding that includes unexcluded medical-priority addresses isn't political — it's potential loss of life. Can you confirm Zone 7 excludes medical-priority customers even in the expanded worst case?`,
      rebuttal: `You're right to sharpen this — I should not have minimized it. In worst case, shedding expands into Zones 5 and 6. Zone 5 has 340 medical-priority addresses. The ADMS can route around these in real-time. The dispatcher must be briefed on medical-priority exclusion before authorizing any shedding. This is a patient safety issue, not a political one.`,
    },
  ],
  synthesis: `**RECOMMENDATION: EXECUTE 4-STEP SEQUENCE — HUMAN AUTHORIZATION REQUIRED**\n\nThe Council reaches strong consensus (0.82) on a 4-step emergency response to prevent cascading grid failure.\n\n**Step 1 (Immediate):** Activate 156MW industrial demand response.\n**Step 2 (Immediate):** Dispatch all 280MW gas peaker capacity.\n**Step 3 (T+2 min):** Deploy 120MW battery storage at max discharge.\n**Step 4 (T+4 min, CONDITIONAL):** Rotating shedding in Zone 7 if DR <130MW. Requires human dispatcher authorization.\n\nThe "sunset catastrophe" creates a 120MW deficit exceeding automatic reserves. The 4-step sequence closes the gap within 12 minutes. All 2,100 medical-priority households excluded from shedding zones. Expected: 8,000 customers affected 12 minutes vs. 47,000 blacked out 4-8 hours.`,
  ethicsNote: 'Ethics gate PASSED with condition: Step 4 requires human dispatcher authorization. Medical-priority exclusion must be verified before shedding.',
  recommendation: 'EXECUTE 4-STEP SEQUENCE',
  status: 'APPROVED',
  keyInsight: 'Sunset catastrophe: 520MW swing in 8 minutes — controlled 12-min shedding prevents 4-8 hour cascade',
  summaryTitle: 'Heartland Power Grid — Emergency Cascading Failure Prevention',
  keyPoints: [
    '520MW swing in 8 minutes (solar loss + HVAC spike) exceeds reserves by 120MW',
    '4-step sequence closes gap within 12 minutes with controlled shedding',
    'Battery storage bridges critical 3-6 minute peaker ramp-up window',
    '2,100 medical-priority households excluded from all shedding zones',
  ],
  risks: [
    '3% probability of generator trip during rapid dispatch extending vulnerability',
    'Demand response activation may lag, requiring bridge shedding',
    'Expanded shedding beyond Zone 7 requires ADMS medical-priority routing',
    'Battery limited to 45 minutes — peakers must be online before depletion',
  ],
  nextSteps: [
    'Dispatcher to authorize Step 4 if DR confirmation <130MW at T+4',
    'Post-event review of demand response activation times',
    'Accelerate battery expansion Phase 2 (+80MW) to eliminate shedding dependency',
    'Update grid stability simulator with actual event data',
  ],
};

// =============================================================================
// 4. GOVERNMENT — Federal Veterans Services IT Modernization
// =============================================================================

const GOVERNMENT: DelibDef = {
  key: 'govt-veterans-it',
  question: 'Should the Federal Veterans Services Agency award the $340M IT modernization contract to incumbent MegaCorp Systems (12-year relationship) or challenger VetTech Solutions (veteran-founded, modern architecture)?',
  vertical: 'government',
  verticalLabel: 'Government',
  userId: 'user-cfo-michael',
  userName: 'Michael Torres',
  confidence: 0.71,
  createdDaysAgo: 10,
  completedDaysAgo: 10,
  agents: ['strategist', 'analyst', 'risk', 'advocate', 'ethics'],
  analyses: [
    {
      agent: 'strategist',
      confidence: 0.70,
      content: `This is a vendor lock-in analysis disguised as a modernization decision. MegaCorp has systematically made the architecture dependent on proprietary interfaces only their engineers can maintain. The "switching cost" was engineered, not natural. VetTech uses open standards (FHIR for health data, OpenAPI for services, PostgreSQL) eliminating proprietary lock-in. The 5-year TCO must account for compounding proprietary dependency: MegaCorp's annual maintenance increases average 8.2% per year, well above the 3% industry standard, because the Agency has no competitive alternative.`,
    },
    {
      agent: 'analyst',
      confidence: 0.68,
      content: `The headline contract values are misleading. MegaCorp's $340M bid appears $28M lower than VetTech's $368M. But the 10-year TCO tells a different story. MegaCorp excludes: (1) $14.2M/yr in "extended support" for legacy modules, (2) $3.8M/yr in proprietary licensing escalating 8%/yr, (3) ~$47M eventual migration costs. MegaCorp 10-year TCO: ~$561M. VetTech 10-year TCO including transition costs and market-rate maintenance: ~$539M. The "cheaper" bid is $22.1M more expensive over the lifecycle.`,
    },
    {
      agent: 'risk',
      confidence: 0.60,
      content: `Transition risk is real. MegaCorp processes 2.3M veteran benefit claims annually. A botched migration could delay benefits for hundreds of thousands. VetTech's largest deployment serves 180,000 users vs the Agency's 8.4M beneficiaries — a 47x scale gap. However, the risk of NOT transitioning is equally severe. MegaCorp had 14 major outages last year, including a 72-hour outage in March delaying 340,000 disability claims. We're choosing between transition risk (bounded, with mitigation) and degradation risk (compounding, with no mitigation path).`,
    },
    {
      agent: 'advocate',
      confidence: 0.55,
      content: `VetTech is technically elegant but operationally unproven at scale. The 47x gap isn't trivial — it's the difference between startup and federal critical infrastructure. MegaCorp, for all its flaws, has kept the system running for 12 years. 99.4% uptime for a 12-year federal system, while below modern standards, is functional. The question is whether the Agency can afford transition risk during a period when veteran mental health services demand is at an all-time high.`,
    },
    {
      agent: 'ethics',
      confidence: 0.75,
      content: `I need to introduce a fact that reframes this deliberation. During the March 72-hour outage, a veteran in Phoenix attempting to access the crisis support line through the Agency's portal was unable to connect. That veteran died by suicide the following day. The family filed a wrongful death claim citing the system outage. This is not hypothetical risk — it has materialized. The ethical question is no longer "can we afford transition risk?" It is "can we afford to continue operating a system that has contributed to a veteran's death?" The duty of care to 8.4 million veterans demands action, even if that action carries risk.`,
    },
  ],
  crossExams: [
    {
      challenger: 'advocate',
      target: 'analyst',
      challenge: `Your $22.1M TCO difference assumes VetTech delivers on time and budget. Federal IT projects exceed budget by 45% on average (GAO, 2023). If VetTech overruns by 20%, the TCO advantage disappears. Have you stress-tested against realistic federal overrun rates?`,
      rebuttal: `At 20% overrun, VetTech 10-year TCO rises to $587M vs MegaCorp $561M — a $26M disadvantage. But this assumes MegaCorp costs stay static, contradicting their 8.2% annual escalation. If that continues, MegaCorp reaches $612M. The breakeven overrun for VetTech is ~32% — above the GAO median of 25% for modern architecture/agile projects. The TCO case is robust under stress testing, though not bulletproof.`,
    },
    {
      challenger: 'ethics',
      target: 'advocate',
      challenge: `You cited 99.4% uptime as "functional." During that 0.6% downtime, a veteran died. At what uptime percentage does system failure become ethically unacceptable when users are vulnerable populations depending on the system for crisis services?`,
      rebuttal: `That's devastating and I cannot argue against it. Any system serving crisis-vulnerable populations must be held to a higher standard than commercial uptime metrics. I withdraw my characterization of 99.4% as acceptable. However, the transition must maintain MegaCorp's crisis systems in parallel until VetTech's replacement is validated. Zero-downtime migration for crisis services is non-negotiable regardless of vendor choice.`,
    },
  ],
  synthesis: `**RECOMMENDATION: AWARD TO CHALLENGER (VetTech Solutions)**\n\nThe Council reaches 4-1 consensus to award to VetTech Solutions with mandatory transition safeguards. Deciding factors: $22.1M hidden cost differential, compounding degradation risk, and ethical imperative following the March outage that contributed to a veteran's death.\n\nThree non-negotiable safeguards: (1) Parallel operation of MegaCorp crisis services until VetTech replacement is validated — zero-downtime for crisis-facing systems. (2) Phased 18-month migration with go/no-go gates at 90-day intervals. (3) Performance bonds with financial penalties for availability failures during transition.\n\nThe Devil's Advocate raised valid concerns about the 47x scale gap. The Council acknowledges this risk but notes that continued degradation under MegaCorp — which has already resulted in a veteran fatality — is the greater harm.`,
  ethicsNote: 'Ethics gate PASSED. Decision prioritizes duty of care to veteran beneficiaries. Parallel crisis system operation ensures no service gap during transition.',
  recommendation: 'AWARD TO CHALLENGER',
  status: 'APPROVED',
  keyInsight: '$22.1M hidden cost over 10 years; veteran fatality during March outage makes continued degradation ethically untenable',
  dissent: { agent: 'advocate', position: 'Transition risk at 47x scale gap is significant. If VetTech awarded, parallel crisis operation is non-negotiable.' },
  summaryTitle: 'Federal Veterans Services — $340M IT Modernization Contract Award',
  keyPoints: [
    '10-year TCO: MegaCorp $561M vs VetTech $539M — "cheaper" bid is $22.1M more expensive',
    'MegaCorp 8.2% annual maintenance escalation is 2.7x industry standard (proprietary lock-in)',
    'March 72-hour outage contributed to veteran fatality — degradation risk is not hypothetical',
    'VetTech open-standards architecture eliminates proprietary lock-in for future procurement',
  ],
  risks: [
    'VetTech never operated at Agency scale (180K vs 8.4M users — 47x gap)',
    'Federal IT projects exceed budget by average 45% (GAO) — breakeven at 32% overrun',
    'Migration disruption could delay 2.3M annual benefit claims',
    'Parallel system operation adds ~$18M to transition costs',
  ],
  nextSteps: [
    'Negotiate zero-downtime migration clause for all crisis-facing services',
    'Establish 90-day go/no-go gates with independent technical review',
    'Require VetTech to onboard 3+ engineers with federal-scale experience within 60 days',
    'Retain MegaCorp on 18-month transition support for parallel crisis operation',
  ],
};

// =============================================================================
// 5. MANUFACTURING — Brake Caliper Defect
// =============================================================================

const MANUFACTURING: DelibDef = {
  key: 'mfg-brake-caliper',
  question: 'Production alert: Brake caliper lot #BC-2024-0847 showing 340% increase in complaints. 4 field failures, 1 involving loss of braking in a passenger vehicle. Should we halt production?',
  vertical: 'manufacturing',
  verticalLabel: 'Manufacturing',
  userId: 'user-analyst-alex',
  userName: 'Alex Johnson',
  confidence: 0.88,
  createdDaysAgo: 3,
  completedDaysAgo: 3,
  agents: ['strategist', 'analyst', 'risk', 'operator', 'ethics'],
  analyses: [
    {
      agent: 'strategist',
      confidence: 0.85,
      content: `The 340% complaint increase is an unambiguous quality signal. In automotive safety components, this escalation rate has preceded every major recall in our industry database. A voluntary halt now costs ~$2.8M/day in lost output. A NHTSA-initiated recall costs $45-80M in recall expenses, penalties, and brand damage. We supply brake calipers to three Tier 1 OEMs with zero-tolerance quality clauses — a NHTSA investigation would trigger audits that could cost all three contracts, representing $340M in annual revenue.`,
    },
    {
      agent: 'analyst',
      confidence: 0.90,
      content: `The statistical analysis reveals a multi-factor interaction that individual monitoring missed. All three parameters — bore diameter, seal groove depth, piston surface finish — are individually within spec. But the combination of bore at upper tolerance (+0.008mm), groove at lower limit (-0.012mm), and surface finish Ra at upper limit (0.78 vs 0.80μm spec) creates a compound stack-up reducing seal contact pressure by 34%. This is a "watermelon" condition — green on every gauge, red in the system. Cpk dropped from 1.45 to 0.89 over 60 days as all three drifted simultaneously. Root cause: compound tool wear at Stations 12 and 15, each within maintenance intervals but combined effect exceeds design margin.`,
    },
    {
      agent: 'risk',
      confidence: 0.92,
      content: `This is safety-critical. The 34% seal pressure reduction causes brake fluid bypass under high-temp/high-pressure braking — exactly the condition in the field failure involving loss of braking. FMEA severity: 10 (highest). Every unit in the affected tolerance band is a potential failure waiting for the right conditions. Over the 60-day drift window: ~12,400 calipers produced, 8,200 shipped to OEMs, ~4,100 estimated installed in consumer vehicles. NHTSA Part 573 reporting is mandatory — TREAD Act gives 5 business days from defect confirmation.`,
    },
    {
      agent: 'operator',
      confidence: 0.88,
      content: `Root cause confirmed: compound tool wear at Stations 12 and 15. Individual SPC charts showed in-control because each parameter was within spec. Multi-parameter correlation analysis shows defect probability jumps from 0.02% (nominal) to 8.7% (at observed drift positions). Immediate actions: (1) Replace tooling at Stations 12 and 15. (2) Implement multi-parameter correlated SPC. (3) Quarantine 3,200 in-plant units. (4) Issue quality hold to all three OEMs for 8,200 shipped units. Production restart: 48-72 hours after tooling replacement and verification runs.`,
    },
    {
      agent: 'ethics',
      confidence: 0.90,
      content: `One confirmed loss-of-braking incident in a passenger vehicle establishes the threshold. The 4,100 calipers in consumer vehicles represent 4,100 families driving with a component that may fail under emergency braking. Every day of continued production increases that number. The TREAD Act clock starts now. Beyond compliance: when you know a safety-critical component is defective, you stop making it and you tell everyone who has one. Anything less prioritizes production economics over human safety.`,
    },
  ],
  crossExams: [
    {
      challenger: 'advocate',
      target: 'analyst',
      challenge: `4 failures out of 12,400 units is 0.032%. Industry standard for brake calipers is 0.01% — we're 3x above but still at 99.97% success. Are you certain this warrants full halt rather than enhanced inspection?`,
      rebuttal: `The 0.032% rate assumes all 12,400 units have experienced the triggering conditions. The relevant figure is the 8.7% defect probability under compound tolerance — meaning ~1,080 of 12,400 will fail if they ever encounter emergency braking. That's not 0.032% — it's 8.7% of units failing precisely when the driver needs brakes most. Enhanced inspection can't help: the defect is within individual specs. You need multi-parameter correlation measurement, which takes 4 min/unit and can't run at production speed.`,
    },
  ],
  synthesis: `**RECOMMENDATION: HALT PRODUCTION — ROOT CAUSE CONFIRMED**\n\nThe Council reaches strong consensus (0.88) to immediately halt production and initiate NHTSA Part 573 reporting. Root cause: multi-factor tolerance stack-up where bore diameter, seal groove depth, and surface finish all drifted to spec limits due to compound tool wear at Stations 12 and 15. Each parameter appears in-control individually; the combination reduces seal contact pressure by 34%, causing brake fluid bypass under emergency braking.\n\n**Immediate actions:** (1) Halt production. (2) Quarantine 3,200 in-plant units. (3) Quality hold to OEMs for 8,200 shipped units. (4) NHTSA Part 573 within 5 business days. (5) Replace tooling.\n\n**Root cause fix:** Implement multi-parameter correlated SPC monitoring. The "watermelon" condition — all individual parameters within limits, system effect exceeding tolerance — is a systemic monitoring gap. Restart estimated 48-72 hours after tooling replacement and verification.`,
  ethicsNote: 'Ethics gate PASSED. Production halt and NHTSA reporting prioritize consumer safety. TREAD Act timeline will be met.',
  recommendation: 'HALT PRODUCTION',
  status: 'BLOCKED',
  keyInsight: 'Watermelon condition: every parameter within spec individually, combination reduces seal pressure 34% — 8.7% failure rate under emergency braking',
  summaryTitle: 'Brake Caliper Lot #BC-2024-0847 — Safety Defect & Production Halt',
  keyPoints: [
    'Root cause: compound tool wear at Stations 12/15 creating multi-factor tolerance stack-up',
    'Individual SPC showed in-control — defect only visible through multi-parameter correlation',
    '12,400 units affected over 60-day drift; ~4,100 in consumer vehicles',
    '34% seal pressure reduction causes brake fluid bypass under emergency braking',
  ],
  risks: [
    '8.7% defect probability under emergency braking for affected lot',
    'NHTSA investigation and civil penalties if reporting delayed',
    'Loss of Tier 1 OEM contracts ($340M annual) if quality audit fails',
    '4,100 vehicles with potentially defective safety-critical component',
  ],
  nextSteps: [
    'File NHTSA Part 573 safety defect report within 5 business days',
    'Replace tooling at Stations 12/15; run verification lots before restart',
    'Implement multi-parameter correlated SPC across all safety-critical lines',
    'Coordinate with OEMs on field service action for 8,200 shipped units',
  ],
};

// =============================================================================
// EXPORT — ordered by recency for dashboard display
// =============================================================================

export const ALL_DELIBERATIONS: DelibDef[] = [
  ENERGY,         // 1 day ago  — most recent, most urgent
  MANUFACTURING,  // 3 days ago
  FINANCIAL,      // 5 days ago — has human override
  GOVERNMENT,     // 10 days ago
  HEALTHCARE,     // 14 days ago
];
