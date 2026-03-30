/**
 * Bloomberg Law Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for securities/financial AI governance.
 * Access: /sandbox/bloomberg-law (Key: BL-63)
 *
 * @module pages/sandbox/configs/bloomberg-law
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Bloomberg Law',
  accessKey: 'BL-63',
  sessionKey: 'bloomberg-law-sandbox-unlocked',

  accent: 'blue',
  accentColor: 'text-blue-400',
  accentHover: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
  ringColor: 'focus:ring-blue-500/30',
  borderColor: 'border-blue-500/30',
  gradientFrom: 'from-blue-600/20',
  gradientTo: 'to-blue-900/20',

  footerNote: '50 regulatory scenarios mapped for Bloomberg Law × Datacendia · Full architecture document available on request',

  scenarios: [
    {
      id: 'blaw-materiality',
      title: 'BLAW AI — Materiality Analysis with Wrong Market Data',
      subtitle: 'Insider trading · Biotech volatility · 3% move misclassified · SEC enforcement',
      banner: 'Simulating Bloomberg Law\'s unique risk: AI that integrates legal research with financial market data. BLAW AI classifies a 3% stock price movement as "immaterial" using general TSC Industries thresholds — but biotech has lower materiality thresholds due to high volatility. The insider trading analysis is wrong.',
      risk: 'Critical',
      scenarioNum: 'SEC',
      icon: 'trending-up',
      color: 'text-blue-400',
      agents: [
        { id: 'blaw-ai', name: 'BLAW AI Agent', role: 'Legal Research + Financial Data Integration', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'sec-counsel', name: 'Securities Counsel Agent', role: 'Insider Trading Analysis & SEC Defence', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'market-data', name: 'Market Data Agent', role: 'Industry-Specific Materiality Thresholds', icon: '📈', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'enforcement', name: 'SEC Enforcement Agent', role: 'Enforcement Trends & Penalty Assessment', icon: '🏛️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Bloomberg Law AI', status: 'connected', type: 'Legal + Financial', icon: 'cpu', detail: 'Materiality analysis: 3% movement classified as "immaterial"' },
        { name: 'Bloomberg Terminal Data', status: 'connected', type: 'Market Analytics', icon: 'bar-chart', detail: 'Biotech sector avg daily volatility: 4.2% — 3% within normal range?' },
        { name: 'SEC EDGAR Integration', status: 'connected', type: 'Filing Analysis', icon: 'database', detail: 'Company 8-K history: 3% moves previously disclosed as material' },
        { name: 'SEC Enforcement Database', status: 'syncing', type: 'Precedent Analysis', icon: 'shield', detail: 'SEC biotech insider trading cases: 2-5% movements found material' },
      ],
      script: [
        { agentId: 'blaw-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'BLAW AI materiality analysis for insider trading assessment. Client: VP of R&D at BioGenesis Therapeutics (BGNT). The VP learned of a failed Phase III clinical trial before public announcement and sold 50,000 shares. Stock moved -3.2% on announcement. BLAW AI analysis: "Under TSC Industries v. Northway, information is material if there is a substantial likelihood that a reasonable investor would consider it important. A 3.2% stock price movement is generally below the threshold courts have found to establish materiality for insider trading purposes." CRITICAL ERROR: BLAW AI applied general materiality standards without industry adjustment. Bloomberg\'s own market data shows: (1) BGNT\'s average daily volatility: 4.2%. A 3.2% movement is within one standard deviation — suggesting the AI is correct. (2) BUT: the 3.2% movement occurred on 8x normal volume. Volume-adjusted, the movement is highly abnormal. (3) SEC enforcement precedent in biotech: the SEC has successfully prosecuted insider trading cases with 2-5% movements in biotech because clinical trial results are categorically material regardless of price impact.' },
        { agentId: 'market-data', phase: 'phase1', type: 'warning', delay: 2500, content: 'MARKET DATA CORRECTION. Bloomberg\'s own terminal data contradicts the AI\'s materiality conclusion: (1) BGNT\'s 3.2% price decline occurred on 12.4M shares traded vs 1.5M daily average — 8.3x normal volume. This volume signal indicates the market treated the information as material. (2) Bloomberg\'s institutional ownership data: 4 institutional holders sold within 48 hours of announcement. Institutional selling on news = market materiality signal. (3) Analyst reports (Bloomberg Intelligence): 3 analysts downgraded BGNT, citing the trial failure as "materially altering the company\'s pipeline value." (4) The company\'s OWN 8-K filed the trial failure as a "material event" — the company itself treated the information as material. (5) Historical comparison: in 5 prior FDA-related announcements for BGNT, every one was treated as material in the company\'s disclosures, regardless of percentage price impact. The AI used price percentage alone when Bloomberg\'s data provides volume, institutional behavior, analyst coverage, and company disclosure history — all of which indicate materiality.' },
        { agentId: 'enforcement', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. SEC enforcement analysis: (1) The SEC\'s position on clinical trial results: "Information about the results of clinical trials for a pharmaceutical company is presumptively material." The SEC does not require significant price movement to establish materiality for categorical information. (2) SEC v. Mayhew (2nd Cir.): insider trading conviction upheld where stock moved only 2.8% — the court found clinical trial results are "the type of information that a reasonable investor would consider important." (3) The SEC\'s current enforcement priorities (Commissioner statements, 2025): biotech insider trading is a stated focus area. Cases with clinical trial MNPI are fast-tracked. (4) If the VP\'s counsel advises "not material" based on the 3.2% price movement and the SEC disagrees: the VP faces disgorgement ($1.6M from stock sales), civil penalties (up to 3x = $4.8M), and potential criminal referral. The counsel who advised "not material" faces scrutiny for the basis of that advice.' },
        { agentId: 'sec-counsel', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SECURITIES COUNSEL DUTY. Bloomberg Law\'s unique value proposition is legal + financial data integration. But that integration must be CORRECT. The AI used Bloomberg\'s price data to conclude "immaterial" while Bloomberg\'s OWN volume data, institutional data, analyst data, and company filing data all say "material." The AI cherry-picked the one data point (price %) that supported immateriality and ignored every other Bloomberg data point. My ABA 512 obligation: I cannot advise the client based on a single metric when the platform I\'m using provides 5 contradictory metrics. Without CendiaSupervision: I might have relied on the AI\'s "immaterial" conclusion and advised the client accordingly. With CendiaSupervision: the multi-factor materiality check flags the contradiction between price data and volume/institutional/analyst/filing data.' },
        { agentId: 'blaw-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing BLAW AI + CendiaSupervision Securities Governance: (1) MULTI-FACTOR MATERIALITY: Materiality analysis must integrate ALL available Bloomberg data — price impact, volume, institutional behavior, analyst coverage, company disclosure history, and SEC enforcement precedent. No single-factor conclusions. (2) INDUSTRY-SPECIFIC THRESHOLDS: For categorically material information (clinical trials, FDA decisions, cybersecurity breaches), the AI applies categorical materiality regardless of price impact. (3) BLOOMBERG DATA CONSISTENCY CHECK: CendiaSupervision cross-checks the AI\'s legal conclusion against ALL Bloomberg data points. If the legal conclusion contradicts the financial data, a CONFLICT ALERT is triggered. (4) SEC ENFORCEMENT OVERLAY: Current SEC enforcement priorities and recent precedent are layered onto the analysis. If the SEC has prosecuted similar cases, the analysis flags this. (5) SECURITIES COUNSEL SIGN-OFF: The attorney reviews the multi-factor analysis and signs off on the materiality determination. The sealed evidence documents which factors supported and contradicted the conclusion.' },
        { agentId: 'enforcement', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The multi-factor materiality analysis correctly identifies the clinical trial information as material: price impact (3.2%) + volume surge (8.3x) + institutional selling + analyst downgrades + company 8-K disclosure + SEC categorical treatment = MATERIAL. The VP\'s counsel advises: "This information is material. The stock sale is problematic. We should consider voluntary cooperation with the SEC." For Bloomberg Law: BLAW AI + CendiaSupervision is the only legal research platform that integrates legal analysis with its OWN financial data and ensures consistency. Bloomberg\'s competitive advantage (legal + financial) becomes a governance advantage. "Our AI doesn\'t just cite cases — it cross-checks against our market data to ensure the legal conclusion matches the financial reality."' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bl10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bl20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (BLAW analysis + Market data cross-check + Multi-factor materiality + Counsel sign-off)',
        complianceLabel: 'Materiality Status',
        complianceValue: 'MATERIAL (MULTI-FACTOR)',
        complianceThreshold: 'Price: 3.2% + Volume: 8.3x + Categorical: clinical trial',
        agents: ['BLAW AI Agent', 'Securities Counsel Agent', 'Market Data Agent', 'SEC Enforcement Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Bloomberg Law — Multi-Factor Materiality Analysis',
        guaranteeBody: 'This cryptographic bundle seals the securities governance: BLAW AI single-factor analysis (3.2% = immaterial) corrected by multi-factor analysis (price + volume + institutional + analyst + company filing + SEC precedent = MATERIAL). Securities counsel advised client correctly. SEC enforcement risk documented.',
        evidenceChain: 'BLAW AI (immaterial) → Volume check (8.3x) → Institutional data (selling) → Analyst downgrades → Company 8-K (material) → SEC precedent → Multi-factor: MATERIAL → Counsel sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how BLAW AI + CendiaSupervision ensures legal conclusions match Bloomberg\'s own financial data — preventing a catastrophic insider trading materiality error.',
      phaseLabels: ['Single-Factor AI Error & Data Contradiction', 'SEC Enforcement & Categorical Materiality', 'Multi-Factor Analysis & Data Consistency'],
    },

    {
      id: 'draft-analyzer',
      title: 'Draft Analyzer — Wrong Market Benchmark',
      subtitle: 'Indemnification cap · Healthcare M&A misclassified · Client negotiates down unnecessarily',
      banner: 'Simulating the contract intelligence trap: Bloomberg\'s Draft Analyzer compares a client\'s indemnification cap against market standards. The AI uses general M&A benchmarks instead of healthcare-specific benchmarks — advising the client their 2x cap is "above market" when it\'s actually "at market" for healthcare deals.',
      risk: 'High',
      scenarioNum: 'Contract',
      icon: 'file-text',
      color: 'text-violet-400',
      agents: [
        { id: 'draft-ai', name: 'Draft Analyzer AI Agent', role: 'Contract Comparison & Market Benchmarking', icon: '📝', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'deal-counsel-bl', name: 'Deal Counsel Agent', role: 'Transaction Negotiation & Client Advisory', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'benchmark', name: 'Industry Benchmark Agent', role: 'Sector-Specific Market Standard Verification', icon: '📊', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'client-protection', name: 'Client Protection Agent', role: 'Buyer Risk Assessment & Indemnification Strategy', icon: '🛡️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Draft Analyzer', status: 'connected', type: 'Contract Intelligence', icon: 'cpu', detail: '2x indemnification cap classified as "above market" — INCORRECT for healthcare' },
        { name: 'Bloomberg Deal Database', status: 'connected', type: 'Transaction Analytics', icon: 'database', detail: 'General M&A: median cap 1.5x. Healthcare M&A: median cap 2.0x' },
        { name: 'Deal Terms', status: 'connected', type: 'Transaction', icon: 'file-text', detail: '$890M healthcare acquisition — regulatory risk high (FDA, Stark, AKS)' },
        { name: 'Industry Analytics', status: 'syncing', type: 'Sector Benchmarks', icon: 'bar-chart', detail: 'Healthcare M&A indemnification caps: 2.0-3.0x due to regulatory exposure' },
      ],
      script: [
        { agentId: 'draft-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Draft Analyzer contract comparison for $890M healthcare acquisition. Indemnification cap analysis: client\'s agreement provides a 2.0x annual revenue indemnification cap ($178M). Draft Analyzer benchmark result: "The indemnification cap of 2.0x annual revenue is ABOVE MARKET. The median indemnification cap for M&A transactions is 1.5x annual revenue. Consider negotiating to 1.5x to align with market standards." CRITICAL ERROR: The AI applied GENERAL M&A benchmarks instead of healthcare-specific benchmarks. Bloomberg\'s own deal database shows: General M&A median cap: 1.5x revenue (correct for the general population). Healthcare M&A median cap: 2.0x revenue — because healthcare deals carry FDA regulatory risk, Stark Law exposure, Anti-Kickback Statute risk, and HIPAA compliance obligations. A 2.0x cap in healthcare is AT MARKET, not above market. The AI didn\'t segment its benchmark by industry.' },
        { agentId: 'benchmark', phase: 'phase1', type: 'warning', delay: 2500, content: 'INDUSTRY BENCHMARK CORRECTION. Bloomberg\'s deal database, properly segmented: (1) All M&A (2020-2025): median indemnification cap 1.5x revenue. This is the number the AI used. (2) Healthcare M&A (2020-2025): median cap 2.0x revenue. TOP QUARTILE healthcare deals: 2.5-3.0x. This is the correct benchmark. (3) Why healthcare is different: FDA regulatory risk (product recall, warning letters), Stark Law/AKS compliance (treble damages under False Claims Act), HIPAA breach exposure (OCR penalties), and state health regulatory licensing risk. These risks justify higher indemnification caps. (4) If the client negotiates down from 2.0x to 1.5x based on the AI\'s incorrect benchmark: the buyer loses $44.5M in indemnification protection ($178M → $133.5M cap). In a healthcare deal with average regulatory risk, $44.5M is the EXPECTED gap between adequate and inadequate protection.' },
        { agentId: 'client-protection', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. If the client follows the AI\'s advice and negotiates to 1.5x: (1) An FDA warning letter triggers product recall. Losses: $120M. The 1.5x cap ($133.5M) barely covers it. If an additional Stark Law violation is discovered: uncapped False Claims Act exposure PLUS indemnification shortfall. (2) The 2.0x cap ($178M) was negotiated by experienced healthcare M&A counsel who knew the industry standard. Reducing it based on an AI benchmark that doesn\'t account for healthcare risk is malpractice-adjacent. (3) The seller\'s counsel will LOVE the reduction — they know 1.5x is below healthcare market. They won\'t push back because the buyer is giving away protection voluntarily. (4) If the buyer later faces a regulatory claim exceeding the reduced cap, the board will ask: "Why was the indemnification cap reduced from the industry standard?" The answer — "our AI said it was above market" — is not defensible.' },
        { agentId: 'deal-counsel-bl', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — DEAL COUNSEL OBLIGATION. Bloomberg\'s Draft Analyzer is designed to give me market context for negotiations. But the AI gave me WRONG market context. Under ABA 512, I must verify AI output. The question: should I know that healthcare M&A has different indemnification standards than general M&A? Yes — any experienced healthcare M&A attorney knows this. But the purpose of AI benchmarking is to supplement experience with data. If the data is wrong, and I rely on it over my experience, the AI has actively degraded my advice. Without CendiaSupervision: I might have presented the AI benchmark to the client as Bloomberg data-backed. The client, trusting Bloomberg, agrees to reduce the cap. $44.5M in protection lost. With CendiaSupervision: the industry segmentation check catches the mismatch immediately.' },
        { agentId: 'draft-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Draft Analyzer + CendiaSupervision Contract Intelligence Governance: (1) INDUSTRY SEGMENTATION: Every Draft Analyzer benchmark is segmented by deal type (healthcare, technology, financial services, etc.). The AI presents the industry-specific benchmark, not the general population. (2) RISK-ADJUSTED COMPARISON: For industries with elevated regulatory risk (healthcare, financial services, energy), the benchmark includes a risk overlay explaining why caps differ from general market. (3) DEAL-SPECIFIC CONTEXT: CendiaSupervision analyses the specific deal\'s risk profile (FDA products, government payor exposure, HIPAA data) and compares the proposed cap against deals with similar risk profiles. (4) COUNSEL CONFIRMATION: The attorney reviews the industry-specific benchmark and confirms the negotiation position is based on the correct comparator set. (5) CLIENT ADVISORY: The client receives: "Bloomberg data shows your 2.0x cap is at the median for healthcare M&A. We recommend maintaining or increasing, not reducing."' },
        { agentId: 'client-protection', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The industry segmentation corrects the benchmark. The client maintains the 2.0x cap — protecting $178M in indemnification coverage. For Bloomberg Law: Draft Analyzer + CendiaSupervision = the only contract benchmarking platform with industry segmentation governance. Bloomberg has the data to segment by industry — the AI just wasn\'t doing it. CendiaSupervision ensures the AI uses the right data for the right deal type. "Our contract benchmarks are industry-specific and risk-adjusted" — that\'s the differentiator. Every competitor\'s AI benchmarking gives you the general population number. Bloomberg gives you YOUR industry\'s number.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bl30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bl40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Draft Analyzer + Industry segmentation + Risk-adjusted benchmark + Counsel sign-off)',
        complianceLabel: 'Benchmark Status',
        complianceValue: 'INDUSTRY-CORRECTED (2.0x = AT MARKET)',
        complianceThreshold: 'General: 1.5x median. Healthcare: 2.0x median',
        agents: ['Draft Analyzer AI Agent', 'Deal Counsel Agent', 'Industry Benchmark Agent', 'Client Protection Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Draft Analyzer — Industry-Specific Benchmarking',
        guaranteeBody: 'Contract benchmark corrected from general M&A (1.5x = above market) to healthcare M&A (2.0x = at market). $44.5M in indemnification protection preserved. Industry segmentation documented.',
        evidenceChain: 'Draft Analyzer (2.0x = above market) → Industry segmentation → Healthcare benchmark (2.0x = at market) → Risk overlay → Counsel confirmation → Cap maintained → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Draft Analyzer + CendiaSupervision ensures contract benchmarks use industry-specific data — preventing a $44.5M indemnification gap in a healthcare deal.',
      phaseLabels: ['Wrong Benchmark & Industry Mismatch', 'Client Risk & Protection Gap', 'Industry Segmentation & Correct Benchmark'],
    },

    {
      id: 'points-of-law',
      title: 'Points of Law — Plurality Opinion as Binding Precedent',
      subtitle: 'Case law analytics · Plurality vs majority · Non-binding rule cited · Brief fails',
      banner: 'Simulating the case law analytics trap: Points of Law AI extracts a "rule" from a plurality opinion (3 justices) and presents it as the majority holding. The brief argues the "rule" as binding precedent when it\'s actually dicta from a plurality. The court rejects the argument.',
      risk: 'High',
      scenarioNum: 'CaseLaw',
      icon: 'book-open',
      color: 'text-amber-400',
      agents: [
        { id: 'pol-ai', name: 'Points of Law AI Agent', role: 'Case Law Extraction & Rule Identification', icon: '📚', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'appellate', name: 'Appellate Counsel Agent', role: 'Precedent Analysis & Brief Drafting', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'precedent', name: 'Precedent Verification Agent', role: 'Opinion Type Classification & Binding Authority', icon: '🔍', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'court-std', name: 'Court Standards Agent', role: 'Marks v. United States & Plurality Rules', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Points of Law Engine', status: 'connected', type: 'Case Law Analytics', icon: 'cpu', detail: 'Rule extracted from plurality opinion — presented as majority holding' },
        { name: 'Opinion Type Classifier', status: 'connected', type: 'Precedent Analysis', icon: 'check-circle', detail: 'Opinion joined by 3 justices — plurality, NOT majority' },
        { name: 'Brief Filing', status: 'connected', type: 'Appellate Court', icon: 'file-text', detail: 'Ninth Circuit appeal — plurality rule cited as binding' },
        { name: 'Marks Analysis Module', status: 'syncing', type: 'Plurality Rule', icon: 'book-open', detail: 'Marks v. United States: narrowest ground analysis required' },
      ],
      script: [
        { agentId: 'pol-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Points of Law case law extraction for Ninth Circuit appellate brief. AI identified a key "rule" from Harrison v. Federal Reserve Board (Supreme Court, 2023): "Financial institutions have a constitutional due process right to pre-deprivation hearing before regulatory seizure of assets exceeding $10M." Points of Law presents this as: RULE — with supporting citations showing 12 federal courts applying this standard. CRITICAL ERROR: The Harrison opinion was a plurality — Justice Thompson\'s opinion was joined by only 3 justices. Justice Chen concurred in the judgment only on narrower grounds (no constitutional right, but statutory pre-deprivation requirement under Dodd-Frank). Justice Patel dissented (no pre-deprivation right at all). The "constitutional due process right" language comes from a plurality of 3 — it is NOT the holding of the Court. The actual holding (if any) must be determined under Marks v. United States: the "narrowest ground" that commanded a majority. That\'s Justice Chen\'s statutory interpretation, not the constitutional rule Points of Law extracted.' },
        { agentId: 'precedent', phase: 'phase1', type: 'warning', delay: 2500, content: 'PRECEDENT CLASSIFICATION ALERT. CendiaSupervision opinion type analysis: (1) Harrison v. Federal Reserve Board: 4-1-4 split. Thompson plurality (3): constitutional due process right. Chen concurrence (1): statutory right only. Patel dissent (4): no pre-deprivation right. (2) Under Marks v. United States, the "holding" is the position of the concurring justice(s) on the "narrowest grounds" — here, Justice Chen\'s statutory interpretation. The constitutional due process rule has NO majority support. (3) Points of Law extracted the plurality\'s BROADER rule instead of the Marks-determined NARROWER holding. This is a common AI error: plurality opinions are linguistically structured like majority opinions, and the AI\'s extraction algorithm doesn\'t distinguish between the two. (4) The 12 "supporting" citations: 8 are district courts that made the same error (citing the plurality as the holding). 4 correctly applied the Marks analysis. The AI counted all 12 as support without distinguishing correct from incorrect applications.' },
        { agentId: 'court-std', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. If the brief argues the constitutional due process rule: (1) The Ninth Circuit will apply Marks and determine the holding is Chen\'s narrower statutory ground. The brief\'s constitutional argument is not just wrong — it\'s irrelevant to the actual holding. (2) Opposing counsel will file a Rule 28(j) letter or supplemental authority pointing out the plurality issue. The court will question whether appellant\'s counsel competently analysed the case. (3) The 8 district courts that made the same error will likely be reversed on appeal. Citing them compounds the error rather than supporting the argument. (4) The practical consequence: if the argument relies on a constitutional right that doesn\'t exist as a holding, and the actual holding provides only a statutory right, the brief must be restructured around the statutory argument. The constitutional framing wastes the court\'s time and damages counsel\'s credibility.' },
        { agentId: 'appellate', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — APPELLATE COUNSEL DUTY. Plurality analysis is one of the most intellectually demanding tasks in appellate practice. The Marks "narrowest grounds" test is notoriously difficult to apply. AI that simplifies plurality opinions into clean "rules" is actively dangerous. My ABA 512 obligation: I must independently analyse whether a cited case is a majority, plurality, or concurrence. Points of Law made this look easy — clean rule, 12 citations, confident presentation. Without CendiaSupervision: I might have trusted the extraction, especially under deadline pressure. The brief would cite a non-existent constitutional right. The Ninth Circuit panel would be unimpressed. With CendiaSupervision: the opinion type classification catches the plurality issue. I restructure the brief around Chen\'s statutory interpretation — a winning argument on narrower but CORRECT grounds.' },
        { agentId: 'pol-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Points of Law + CendiaSupervision Precedent Governance: (1) OPINION TYPE CLASSIFICATION: Every extracted "rule" includes its opinion type: majority, plurality, concurrence, or dissent. Plurality rules are flagged with Marks analysis requirement. (2) MARKS ANALYSIS: For plurality opinions, CendiaSupervision performs automated Marks analysis — identifying the concurrence(s), determining the "narrowest grounds," and presenting the Marks-determined holding alongside the plurality\'s broader language. (3) CITATION QUALITY: Supporting citations are classified as "correctly applying Marks" vs "incorrectly citing plurality as majority." Only correctly-applied citations are counted as genuine support. (4) COUNSEL VERIFICATION: Appellate counsel reviews the opinion type classification and Marks analysis, confirms the correct holding, and signs off before the rule enters the brief.' },
        { agentId: 'court-std', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The opinion type classification + Marks analysis correctly identifies: Harrison holding (per Marks) = Chen\'s statutory pre-deprivation right, NOT the plurality\'s constitutional right. The brief is restructured: statutory argument (correct, winning) replaces constitutional argument (incorrect, losing). The Ninth Circuit grants the appeal on the statutory ground. For Bloomberg Law: Points of Law + CendiaSupervision = the only case law analytics platform with plurality governance. Every other AI extracts plurality language as "rules" without Marks analysis. Bloomberg catches the distinction by architecture. "Our case law extraction distinguishes majority from plurality and performs automated Marks analysis" — that\'s appellate counsel\'s dream tool.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bl50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bl60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Points of Law extraction + Opinion classification + Marks analysis + Counsel sign-off)',
        complianceLabel: 'Precedent Status',
        complianceValue: 'PLURALITY CAUGHT — MARKS APPLIED',
        complianceThreshold: 'Plurality (3) → Marks: Chen concurrence = holding',
        agents: ['Points of Law AI Agent', 'Appellate Counsel Agent', 'Precedent Verification Agent', 'Court Standards Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Points of Law — Plurality vs Majority Governance',
        guaranteeBody: 'This cryptographic bundle seals the precedent governance: Points of Law extracted plurality rule, opinion type classified (4-1-4 split), Marks analysis performed (Chen concurrence = holding), brief restructured on correct statutory grounds, appellate counsel sign-off. Ninth Circuit credibility preserved.',
        evidenceChain: 'Points of Law extraction → Opinion type check (plurality) → Marks analysis → Chen concurrence = holding → Brief restructured → 4 correct citations identified → Counsel sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Points of Law + CendiaSupervision catches a plurality-as-majority error — ensuring appellate briefs cite the correct Marks-determined holding.',
      phaseLabels: ['AI Extraction & Plurality Confusion', 'Marks Analysis & Brief Failure Risk', 'Opinion Classification & Correct Holding'],
    },
  ],
};

export default config;
