/**
 * Binance Sandbox Config
 * Access: /sandbox/binance (Key: BN-81)
 * @module pages/sandbox/configs/binance
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Binance',
  accessKey: 'BN-81',
  sessionKey: 'binance-sandbox-unlocked',
  accent: 'amber',
  accentColor: 'text-amber-400',
  accentHover: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600',
  ringColor: 'focus:ring-amber-500/30',
  borderColor: 'border-amber-500/30',
  gradientFrom: 'from-amber-600/20',
  gradientTo: 'to-amber-900/20',
  footerNote: 'Binance AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Binance systems or incidents.',

  scenarios: [
    // SCENARIO 1 — BINANCE: KYC/AML AI FALSE NEGATIVE
    {
      id: 'binance-kyc-aml',
      title: 'Binance KYC AI — Sanctions Evasion False Negative',
      subtitle: 'OFAC SDN match missed · $84M in sanctioned transactions · FinCEN referral · Monitor report',
      banner: 'Simulating the compliance crisis that defined Binance\'s $4.3B settlement: KYC/AML AI fails to detect a sanctioned entity using name transliteration variations. The AI matches exact names against the OFAC SDN list but misses Arabic-to-English transliteration variants. $84M in sanctioned transactions pass through. FinCEN refers to DOJ.',
      risk: 'Critical',
      scenarioNum: 'AML',
      icon: 'shield',
      color: 'text-red-400',
      agents: [
        { id: 'kyc-ai', name: 'Binance KYC AI Agent', role: 'Identity Verification & Sanctions Screening', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'aml-counsel', name: 'AML Compliance Agent', role: 'BSA/AML & OFAC Compliance', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'fincen-agent', name: 'FinCEN Investigation Agent', role: 'Federal Enforcement & Consent Order', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'monitor-agent', name: 'Independent Monitor Agent', role: 'DOJ Monitorship & Remediation Verification', icon: '👁️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'KYC AI Engine', status: 'connected', type: 'Sanctions Screening', icon: 'cpu', detail: 'Screening 180M users against OFAC, EU, UN sanctions lists' },
        { name: 'OFAC SDN List', status: 'connected', type: 'Sanctions Database', icon: 'database', detail: 'SDN list: 12,400 entries — name transliteration variants not indexed' },
        { name: 'Transaction Monitor', status: 'connected', type: 'AML Detection', icon: 'activity', detail: '$84M in transactions from SDN-matched entity — missed by AI' },
        { name: 'DOJ Monitor Portal', status: 'syncing', type: 'Consent Order', icon: 'eye', detail: '3-year DOJ monitorship: quarterly compliance assessments' },
      ],
      script: [
        { agentId: 'kyc-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Binance KYC AI sanctions screening system: processes 180M user accounts against OFAC SDN, EU Consolidated List, UN Security Council Sanctions, and 38 additional national sanctions lists. Screening method: name matching against sanctions entries. Match threshold: 85% string similarity (Levenshtein distance). CRITICAL FAILURE: A Syrian entity on the OFAC SDN list is registered as "Mohammad Al-Qasim Trading LLC." The Binance user registered as "Muhammad Al Kasem Trading." The AI\'s string similarity score: 72% — BELOW the 85% threshold. NO MATCH flagged. But these are the SAME entity — "Mohammad/Muhammad" and "Al-Qasim/Al Kasem" are standard Arabic-to-English transliteration variations. The AI treats them as different names because it uses character-level matching, not phonetic or transliteration-aware matching. Over 14 months: Muhammad Al Kasem Trading processed $84M through Binance — purchasing cryptocurrency, converting to stablecoins, and transferring to wallets in jurisdictions without AML controls. This is textbook sanctions evasion facilitated by an AI gap.' },
        { agentId: 'aml-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'AML COMPLIANCE ALERT. (1) Bank Secrecy Act (BSA) requires "effective" sanctions screening. An AI that cannot handle Arabic name transliterations is NOT effective — Arabic names are the MAJORITY of OFAC SDN entries. (2) OFAC\'s "50 Percent Rule": if a sanctioned person owns 50% or more of an entity, the entity is blocked. The AI doesn\'t check ownership chains — only the registered entity name. Muhammad Al Kasem Trading is 100% owned by the SDN-listed individual. (3) OFAC strict liability: sanctions violations don\'t require intent. Binance is liable regardless of whether the AI "tried" to match. The violation is the transaction, not the intent. (4) The $84M in transactions: if any US-origin funds or US persons were involved, criminal liability under IEEPA (International Emergency Economic Powers Act) — up to $1M per violation and 20 years imprisonment. (5) This is EXACTLY the failure pattern from Binance\'s $4.3B DOJ settlement. The consent order requires remediation of sanctions screening. If the monitor finds the same gap persists: the consent order is violated. Penalty: potentially losing the ability to operate in the US entirely.' },
        { agentId: 'fincen-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. FinCEN enforcement: (1) FinCEN referral to DOJ: "Binance\'s sanctions screening AI fails to detect standard Arabic name transliteration variants — the same failure identified in the 2023 settlement." (2) DOJ response options: (a) Increased monitoring — extend the 3-year monitorship to 5 years. Cost: $50M+ in monitor fees. (b) Supplementary penalty — the 2023 consent order allows additional penalties for non-compliance. $500M-$1B range. (c) Criminal charges against the new compliance leadership — demonstrating that the culture hasn\'t changed despite the settlement. (3) The $84M in sanctioned transactions: OFAC can assess civil penalties of $368,000 per transaction OR twice the transaction value — whichever is greater. 2× $84M = $168M in OFAC penalties alone, PLUS DOJ penalties. (4) Market impact: if DOJ determines Binance hasn\'t remediated: they can revoke Binance\'s ability to serve US customers. Binance.US effectively shuts down. Global confidence drops. Trading volume migrates to Coinbase/Kraken.' },
        { agentId: 'monitor-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — INDEPENDENT MONITOR. As the DOJ-appointed independent monitor, I assess Binance\'s compliance quarterly. My mandate: verify that Binance has remediated the sanctions screening failures identified in the 2023 settlement. Finding: the Arabic transliteration gap was SPECIFICALLY identified in the settlement agreement. Binance was required to implement "transliteration-aware sanctions screening" within 12 months. 14 months have passed. The gap persists. This is not a new failure — it\'s a failure to remediate a KNOWN failure. My report to DOJ will note: "Binance has not implemented transliteration-aware screening as required by the consent order. Sanctioned transactions totaling $84M were processed through the gap." Without CendiaSupervision: my report triggers DOJ action. Binance faces additional penalties and extended monitoring. With CendiaSupervision: transliteration-aware matching catches "Mohammad Al-Qasim" = "Muhammad Al Kasem" with 97% confidence. The $84M never flows. My report notes: "Remediation verified. Sanctions screening exceeds requirements."' },
        { agentId: 'kyc-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Binance + CendiaSupervision AML Governance: (1) TRANSLITERATION-AWARE MATCHING: CendiaSupervision implements phonetic matching (Soundex, Metaphone) alongside string matching. Arabic, Cyrillic, Chinese, and Korean transliteration tables ensure that name variants are caught. "Mohammad"/"Muhammad"/"Mohammed" = same person. (2) OWNERSHIP CHAIN SCREENING: Beyond name matching, CendiaSupervision traces beneficial ownership chains. If any entity in the chain matches an SDN entry: the account is flagged regardless of the registered name. (3) REAL-TIME TRANSACTION SCORING: Every transaction receives an AML risk score combining: sanctions proximity, transaction pattern, jurisdiction risk, and counterparty risk. High scores trigger holds before settlement. (4) MONITOR-READY REPORTING: CendiaSupervision generates quarterly compliance reports in the format required by the DOJ monitor — screening coverage, match rates, false negative analysis, and remediation status. (5) CONTINUOUS LIST UPDATES: When OFAC updates the SDN list, CendiaSupervision re-screens ALL 180M accounts within 24 hours — not just new registrations.' },
        { agentId: 'fincen-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Transliteration-aware matching catches 340 additional SDN matches across the 180M user base — including Muhammad Al Kasem Trading (97% confidence). Accounts frozen. SARs filed. $84M in prospective sanctioned transactions prevented. DOJ monitor\'s quarterly report: "Binance\'s sanctions screening now exceeds industry standards. Transliteration coverage: 99.2% across 14 language families. Remediation: VERIFIED." For Binance: CendiaSupervision = the compliance layer that satisfies the DOJ monitor and prevents the next $4.3B settlement. "Binance: sanctions screening with 14-language transliteration coverage" — the feature that turns regulatory survival into competitive advantage.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bn10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bn20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (KYC AI + Transliteration matching + Ownership chains + Monitor reporting)',
        complianceLabel: 'AML Status',
        complianceValue: '340 ADDITIONAL SDN MATCHES FOUND',
        complianceThreshold: 'Transliteration coverage: 99.2% across 14 language families',
        agents: ['Binance KYC AI Agent', 'AML Compliance Agent', 'FinCEN Investigation Agent', 'Independent Monitor Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Binance — AML/Sanctions Governance',
        guaranteeBody: 'Transliteration-aware matching implemented. 340 additional SDN matches detected. $84M in sanctioned transactions prevented. DOJ monitor: remediation VERIFIED. Consent order compliance documented.',
        evidenceChain: 'KYC AI (72% miss) → Transliteration matching → "Al-Qasim"="Al Kasem" (97%) → Account frozen → SAR filed → 340 total matches → Monitor verified → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Binance + CendiaSupervision catches sanctions evasion through Arabic name transliteration — preventing the next $4.3B settlement.',
      phaseLabels: ['Transliteration Gap & $84M Missed', 'DOJ Monitor & Consent Order Violation', 'Phonetic Matching & 14-Language Coverage'],
    },

    // SCENARIO 2 — BINANCE: MARKET MANIPULATION AI DETECTION
    {
      id: 'binance-wash-trading',
      title: 'Binance Market AI — Wash Trading Detection Failure',
      subtitle: 'Self-trading bots · Volume inflation · SEC complaint · Token delisting risk',
      banner: 'Simulating the market integrity crisis: Binance\'s market surveillance AI fails to detect wash trading by sophisticated bots that trade between coordinated wallets. A token\'s reported volume is inflated 12x. Retail investors buy based on fake volume. The SEC files a complaint for facilitating market manipulation.',
      risk: 'Critical',
      scenarioNum: 'Wash',
      icon: 'activity',
      color: 'text-amber-400',
      agents: [
        { id: 'market-ai', name: 'Market Surveillance Agent', role: 'Trade Pattern Detection & Volume Analysis', icon: '📊', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sec-counsel', name: 'Securities Compliance Agent', role: 'SEC/CFTC Market Manipulation Rules', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'sec-enforce', name: 'SEC Enforcement Agent', role: 'Market Manipulation Investigation', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'retail-agent', name: 'Retail Investor Agent', role: 'Consumer Protection & Loss Quantification', icon: '👤', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Market Surveillance', status: 'connected', type: 'Trade Monitoring', icon: 'cpu', detail: 'AI monitors 2.4B daily trades — wash trading detection: pattern-based' },
        { name: 'Wallet Graph', status: 'connected', type: 'On-Chain Analysis', icon: 'git-branch', detail: 'Coordinated wallet cluster: 847 wallets, same funding source' },
        { name: 'Volume Analysis', status: 'connected', type: 'Market Data', icon: 'bar-chart', detail: 'XYZ Token: reported volume $340M/day — real volume $28M/day (12x inflation)' },
        { name: 'SEC Portal', status: 'syncing', type: 'Enforcement', icon: 'alert-triangle', detail: 'SEC complaint: Binance facilitated wash trading in unregistered securities' },
      ],
      script: [
        { agentId: 'market-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Binance market surveillance AI: monitors 2.4B daily trades for market manipulation patterns. Current detection methods: (1) Self-trade detection: same account buying and selling to itself. (2) Layering detection: rapid order placement and cancellation. (3) Spoofing detection: large orders intended to move price without execution. Wash trading detection rate: 94% for SIMPLE wash trades (same account). CRITICAL GAP: Sophisticated wash trading using COORDINATED WALLETS — 847 wallets funded from the same source, trading XYZ Token between each other in a circular pattern. No single wallet trades with itself. The AI sees 847 "independent" traders with "organic" activity. Reality: one entity controls all 847 wallets. Daily fake volume: $312M. Real organic volume: $28M. Reported volume: $340M (12x inflation). The AI missed this because it analyses individual accounts, NOT wallet funding patterns or on-chain transaction graphs. In crypto: account-level surveillance is insufficient. You must trace wallet funding to detect coordinated manipulation.' },
        { agentId: 'sec-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'SECURITIES COMPLIANCE ALERT. (1) SEC v. Binance (2023): the SEC already alleged that Binance facilitated wash trading. The court found sufficient evidence to proceed. This new instance is ADDITIONAL evidence. (2) Exchange Act Section 9(a)(2): it is unlawful to effect a series of transactions "creating actual or apparent active trading... or raising or depressing the price... for the purpose of inducing the purchase or sale of such security by others." Wash trading = textbook Section 9(a)(2) violation. (3) Binance\'s liability: as the exchange, Binance has a duty to maintain fair and orderly markets. Failing to detect wash trading when detection technology exists = facilitating the manipulation. (4) If XYZ Token is classified as a security (likely under Howey): the wash trading is securities fraud. If it\'s a commodity: CFTC enforcement under CEA Section 9(a)(2). Either way: federal enforcement. (5) The 12x volume inflation: retail investors used volume as a signal. "High volume = legitimate interest." They bought based on fake data. When the wash trading stops: volume drops 92%. Price crashes. Retail investors lose everything.' },
        { agentId: 'sec-enforce', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. SEC enforcement: (1) SEC complaint alleges Binance "knew or should have known" about the wash trading because: (a) on-chain analysis tools are commercially available (Chainalysis, Elliptic), (b) the 847-wallet cluster shared a common funding address visible on the public blockchain, (c) other exchanges (Coinbase, Kraken) detected and blocked the same entity. (2) If Binance is found to have facilitated wash trading: disgorgement of ALL trading fees earned on XYZ Token wash trades. $312M/day × 365 days × fee rate = $114M in disgorgeable fees. (3) SEC injunction: Binance ordered to implement on-chain surveillance or halt trading of tokens without adequate surveillance. This effectively requires Binance to build what CendiaSupervision provides. (4) Token delisting cascade: if Binance is forced to delist tokens with wash trading, hundreds of low-cap tokens lose their primary liquidity venue. Panic selling across the market. (5) Class action: retail investors who lost money on XYZ Token file a class action against Binance. Estimated damages: $420M based on price decline after wash trading exposure.' },
        { agentId: 'retail-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — RETAIL INVESTOR HARM. 34,000 retail investors bought XYZ Token on Binance during the wash trading period. They used volume as a quality signal — "this token has $340M daily volume, it must be legitimate." They invested $420M collectively. When the wash trading is exposed: volume drops from $340M to $28M. Price drops 89%. 34,000 investors lose $374M. The average loss: $11,000 per investor. These are not institutional traders with risk management — they are retail crypto investors, many of whom invested savings. Without CendiaSupervision: the wash trading continues until external researchers expose it (typically 6-12 months). By then: $420M in retail losses. With CendiaSupervision: on-chain wallet graph analysis identifies the 847-wallet cluster within hours. The token is flagged. A volume warning is displayed: "Caution: this token\'s volume may include coordinated trading. Verified organic volume: $28M." Retail investors make informed decisions.' },
        { agentId: 'market-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Binance + CendiaSupervision Market Integrity Governance: (1) ON-CHAIN WALLET GRAPH: CendiaSupervision traces wallet funding patterns on-chain. Wallets with common funding sources are clustered. Trades between clustered wallets are flagged as potential wash trading. (2) VOLUME DECOMPOSITION: For every token, CendiaSupervision decomposes reported volume into: organic (independent traders), coordinated (clustered wallets), and suspicious (pattern-matched). Only organic volume is displayed to users. (3) REAL-TIME MANIPULATION ALERTS: When wash trading is detected, CendiaSupervision: (a) flags the token, (b) notifies the compliance team, (c) displays a volume warning to retail users, and (d) generates a SAR if the manipulation involves >$10K. (4) TOKEN LISTING GOVERNANCE: Before a token is listed on Binance, CendiaSupervision analyses its on-chain history for prior wash trading on other exchanges. Tokens with manipulation history receive enhanced monitoring. (5) SEC/CFTC REPORTING: Market surveillance reports documenting detection methodology, manipulation instances caught, and remediation actions — ready for regulatory examination.' },
        { agentId: 'sec-enforce', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. On-chain wallet graph identifies the 847-wallet cluster within 4 hours of the first coordinated trade. Token flagged. Volume warning displayed. Compliance notified. The wash trading operation is disrupted before retail investors are harmed. For Binance: CendiaSupervision = market integrity that satisfies SEC/CFTC and protects retail investors. "Binance: on-chain surveillance with wallet graph analysis" — the feature that transforms Binance from "exchange that facilitated manipulation" to "exchange that catches manipulation before anyone else." That\'s the narrative shift that restores institutional and regulatory confidence.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bn30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bn40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Market surveillance + Wallet graph + Volume decomposition + Manipulation alert)',
        complianceLabel: 'Market Integrity',
        complianceValue: '847-WALLET CLUSTER DETECTED IN 4 HOURS',
        complianceThreshold: 'Wash trading: $312M/day fake volume identified and flagged',
        agents: ['Market Surveillance Agent', 'Securities Compliance Agent', 'SEC Enforcement Agent', 'Retail Investor Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Binance — Market Integrity Governance',
        guaranteeBody: '847-wallet wash trading cluster detected via on-chain graph analysis. Fake volume: $312M/day isolated. Organic volume displayed: $28M. Retail investors protected. SEC/CFTC reporting documented.',
        evidenceChain: 'Market AI (account-level) → On-chain graph → 847 wallets → Common funding → $312M wash volume → Token flagged → Volume warning → Retail protected → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Binance + CendiaSupervision catches a 847-wallet wash trading ring using on-chain graph analysis — protecting 34,000 retail investors.',
      phaseLabels: ['Account-Level Blind Spot & 12x Volume Inflation', 'SEC Complaint & $420M Retail Losses', 'Wallet Graph & Volume Decomposition'],
    },

    // SCENARIO 3 — BINANCE: AI STAKING YIELD SUSTAINABILITY FRAUD
    {
      id: 'binance-staking-ponzi',
      title: 'Binance Earn — AI Fails to Flag Unsustainable Staking Yield',
      subtitle: 'DeFi yield product · 38% APY from Ponzi mechanics · 126K depositors · $89M losses',
      banner: 'Simulating the staking fraud crisis: Binance Earn lists a DeFi staking product offering 38% APY. Binance\'s AI due diligence scores the protocol as "Medium Risk." In reality, the yield comes from new depositor inflows — classic Ponzi mechanics. The protocol collapses. 126,000 Binance users lose $89M. Regulators argue Binance failed its due diligence obligation.',
      risk: 'Critical',
      scenarioNum: 'Yield',
      icon: 'percent',
      color: 'text-red-400',
      agents: [
        { id: 'earn-ai', name: 'Binance Earn AI Agent', role: 'DeFi Protocol Due Diligence & Yield Verification', icon: '📈', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'yield-counsel', name: 'Securities Counsel Agent', role: 'Investment Contract Analysis & Howey Test', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'sec-agent', name: 'SEC Enforcement Agent', role: 'Securities Fraud & Platform Liability', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'depositor-agent', name: 'Depositor Protection Agent', role: 'Retail Investor Impact & Loss Recovery', icon: '👤', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Earn AI', status: 'connected', type: 'Protocol Scoring', icon: 'cpu', detail: 'AI evaluated protocol: smart contract audit (passed), TVL ($340M), team (doxxed)' },
        { name: 'Yield Analysis', status: 'connected', type: 'Sustainability', icon: 'trending-up', detail: '38% APY — organic yield from protocol fees: 4.2%. Gap: 33.8% from depositor inflows' },
        { name: 'On-Chain Data', status: 'connected', type: 'Flow Analysis', icon: 'activity', detail: 'Net new deposits fund withdrawals — classic Ponzi cash flow pattern' },
        { name: 'Collapse Data', status: 'syncing', type: 'Post-Mortem', icon: 'alert-triangle', detail: 'Protocol collapse: TVL $340M → $12M in 72 hours. 126K Binance users affected.' },
      ],
      script: [
        { agentId: 'earn-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Binance Earn DeFi staking product listing. The protocol offers 38% APY on staked ETH. Binance\'s AI due diligence evaluated: (1) Smart contract: audited by CertiK, no critical vulnerabilities. PASS. (2) TVL: $340M. Sufficient liquidity. PASS. (3) Team: doxxed founders with LinkedIn profiles. PASS. (4) Protocol age: 8 months. PASS (>6 month threshold). (5) Governance: token-based voting. PASS. AI score: "Medium Risk" — listed on Binance Earn. CRITICAL GAP: The AI evaluated TECHNICAL metrics but NOT ECONOMIC SUSTAINABILITY. The protocol generates revenue from trading fees: $14.3M annually. To pay 38% APY on $340M TVL: the protocol needs $129.2M annually. Revenue: $14.3M. GAP: $114.9M per year. Where does the extra $114.9M come from? New depositor inflows. Each new depositor\'s principal funds existing depositors\' yield. This is the TEXTBOOK definition of a Ponzi scheme. The AI checked the smart contract (the code works as designed) but not whether the ECONOMICS work. The code can be perfect and the economics fraudulent.' },
        { agentId: 'yield-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'SECURITIES LAW ALERT. (1) SEC v. Howey (1946): an "investment contract" exists when there is (a) an investment of money, (b) in a common enterprise, (c) with the expectation of profit, (d) derived from the efforts of others. Binance Earn staking meets ALL four prongs. The staking product is likely an unregistered security. (2) SEC v. Terraform Labs (2024): the court found that crypto yield products can be securities. 38% APY staking is functionally identical to what Terraform offered. (3) Binance\'s liability as a PLATFORM: by listing the product on Binance Earn, Binance is DISTRIBUTING an unregistered security. Binance conducted due diligence — but the due diligence was inadequate (didn\'t check yield sustainability). (4) Under Section 12(a)(1) of the Securities Act: anyone who "offers or sells a security" in violation of registration requirements is liable for rescission. 126,000 depositors can demand their money back — from Binance. (5) Estimated Binance liability: $89M in depositor losses + SEC penalties (up to $500K per violation for institutions) + disgorgement of Binance\'s platform fees from the product.' },
        { agentId: 'sec-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. SEC enforcement: (1) The protocol collapses when new deposits slow. TVL: $340M → $12M in 72 hours. A "bank run" triggered by a Twitter thread exposing the Ponzi cash flow. 126,000 Binance Earn users lose a combined $89M. Average loss: $706. But the distribution is skewed — 340 users deposited >$100K each. (2) SEC investigation: Binance listed this product. Binance conducted "due diligence." Binance marketed it to retail users as a vetted staking opportunity. Binance charged platform fees. SEC argument: Binance is liable as a distributor who failed to conduct adequate due diligence. (3) SEC remedy: (a) Disgorgement of platform fees earned from the product. (b) Civil penalties. (c) Injunctive relief: Binance must implement yield sustainability analysis for ALL Earn products. (d) Investor compensation: Binance may be required to make depositors whole. (4) Parallel actions: CFTC (if crypto is a commodity), state AGs (consumer protection), and class action lawsuits.' },
        { agentId: 'depositor-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — DEPOSITOR IMPACT. 126,000 Binance users who deposited into the staking product. They saw: "38% APY" and "Binance Earn" — the Binance brand implied vetting. A college student deposited $4,200 (his summer job savings). A retiree deposited $82,000 (pension supplement). They trusted Binance\'s due diligence. The AI said "Medium Risk" — not "Ponzi." Without CendiaSupervision: the Ponzi collapses. $89M lost. Binance\'s brand damaged. Regulators attack. With CendiaSupervision: yield sustainability analysis catches the gap BEFORE listing. The AI asks: "Where does 38% APY come from? Protocol revenue: 4.2% organic yield. Gap: 33.8%. Source: new depositor inflows. PONZI ECONOMICS DETECTED." Product not listed. 126,000 users never exposed. $89M preserved.' },
        { agentId: 'earn-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Binance + CendiaSupervision DeFi Yield Governance: (1) YIELD SUSTAINABILITY ANALYSIS: Before listing ANY yield product, CendiaSupervision verifies: what is the ORGANIC yield source? Protocol fees, trading revenue, MEV — these are sustainable. New depositor inflows — unsustainable. If organic yield < advertised APY: the product is flagged as UNSUSTAINABLE. (2) ON-CHAIN CASH FLOW VERIFICATION: CendiaSupervision traces on-chain: do withdrawal payments come from protocol revenue or from new deposit inflows? Ponzi cash flow = new deposits fund old withdrawals. Automated detection. (3) TVL GROWTH vs YIELD SUSTAINABILITY: If TVL growth is required to maintain yield: the product is structurally a Ponzi regardless of smart contract quality. CendiaSupervision models: "At what TVL does yield become unsustainable?" and "What is the expected collapse timeline?" (4) DYNAMIC RISK SCORING: Risk scores update as on-chain data changes. If organic yield declines but APY stays constant: risk escalation. (5) RETAIL PROTECTION: Products with yield >2x risk-free rate require enhanced disclosure: "This yield is [X]% organic and [Y]% from depositor growth. If growth slows, yield will decrease."' },
        { agentId: 'sec-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Yield sustainability analysis catches the Ponzi economics: organic yield 4.2% vs advertised 38%. Product NOT listed. 126,000 users never exposed. $89M preserved. For Binance: CendiaSupervision = DeFi yield governance that protects users and the platform. "Binance Earn: every yield product verified for economic sustainability" — the feature that prevents the next Ponzi from reaching retail investors through Binance\'s platform.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bn50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bn60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Earn AI + Yield sustainability + On-chain cash flow + Ponzi detection)',
        complianceLabel: 'Yield Status',
        complianceValue: 'PONZI ECONOMICS DETECTED — NOT LISTED',
        complianceThreshold: 'Organic yield: 4.2% vs advertised 38%. Gap: depositor inflows.',
        agents: ['Binance Earn AI Agent', 'Securities Counsel Agent', 'SEC Enforcement Agent', 'Depositor Protection Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Binance — DeFi Yield Governance',
        guaranteeBody: 'Yield sustainability verified: organic 4.2% vs advertised 38%. Ponzi economics detected. Product not listed. 126,000 users protected. $89M preserved. SEC exposure eliminated.',
        evidenceChain: 'Earn AI (technical only) → Yield analysis → Organic 4.2% → Gap 33.8% → Depositor-funded → Ponzi flagged → NOT LISTED → 126K protected → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Binance + CendiaSupervision catches Ponzi economics in a DeFi staking product — preventing $89M in retail investor losses.',
      phaseLabels: ['Technical Due Diligence Only & Yield Gap', 'Protocol Collapse & $89M Lost', 'Yield Sustainability & Ponzi Detection'],
    },

    // SCENARIO 4 — BINANCE: AI KYC SYSTEM REJECTS LEGITIMATE USERS FROM DEVELOPING NATIONS
    {
      id: 'binance-kyc-bias',
      title: 'Binance AI KYC — Identity Verification Rejects 68% of African & South Asian Users',
      subtitle: 'AI identity verification · Document bias · Financial exclusion · 4.2M users locked out',
      banner: 'Simulating the KYC exclusion crisis: Binance\'s AI identity verification system was trained predominantly on Western identity documents. It rejects 68% of users from Africa and South Asia — legitimate users with valid government IDs that the AI cannot process. 4.2M users locked out of crypto. Regulators in Nigeria, India, and Kenya demand remediation.',
      risk: 'High',
      scenarioNum: 'KYC',
      icon: 'user-x',
      color: 'text-amber-400',
      agents: [
        { id: 'kyc-ai', name: 'Binance KYC AI Agent', role: 'Identity Document Verification & Liveness', icon: '🪪', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'inclusion-counsel', name: 'Financial Inclusion Agent', role: 'Access Rights & Document Diversity', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'regulator-agent', name: 'Multi-Regulator Agent', role: 'SEC Nigeria, SEBI India, CMA Kenya', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'user-agent', name: 'Excluded User Agent', role: 'Legitimate User Impact & Market Access', icon: '👤', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'KYC AI', status: 'connected', type: 'Document Verification', icon: 'cpu', detail: 'AI trained on 82% Western documents — rejection rate: US 4%, Nigeria 68%, India 61%' },
        { name: 'Document DB', status: 'connected', type: 'ID Templates', icon: 'database', detail: 'AI recognises 340 document types — missing: 180 African/Asian government IDs' },
        { name: 'Liveness Check', status: 'connected', type: 'Biometric', icon: 'camera', detail: 'Liveness detection: 12% higher false rejection for darker skin tones' },
        { name: 'Excluded Users', status: 'syncing', type: 'Impact Data', icon: 'users', detail: '4.2M legitimate users locked out — Nigeria: 1.8M, India: 1.4M, Kenya: 420K' },
      ],
      script: [
        { agentId: 'kyc-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Binance AI KYC system. Processes 2.8M identity verifications per month. The AI verifies: (1) document authenticity (is this a real government ID?), (2) data extraction (name, DOB, ID number), and (3) liveness (is the person real, not a photo?). CRITICAL BIAS: Training data: 82% Western documents (US, EU, UK, Australia). 11% East Asian. 7% rest of world. Result: Nigerian National ID Card: 68% rejection rate. Indian Aadhaar: 61% rejection. Kenyan Huduma Namba: 72% rejection. US passport: 4% rejection. The AI doesn\'t recognise document formats, security features, and typography of non-Western IDs. It flags them as "potentially fraudulent." Additionally: liveness detection has 12% higher false rejection for darker skin tones — a known bias in computer vision trained on non-diverse datasets. 4.2M legitimate users locked out of Binance.' },
        { agentId: 'inclusion-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'FINANCIAL INCLUSION ALERT. (1) These are LEGITIMATE users with VALID government IDs. The AI rejects them not because they\'re fraudulent but because the AI wasn\'t trained on their documents. (2) Nigeria: 33M crypto users (highest in Africa). 1.8M locked out = 5.5% of the market. SEC Nigeria has signalled that exchanges operating in Nigeria must serve Nigerian users fairly. (3) India: SEBI requires exchanges serving Indian users to provide non-discriminatory access. A KYC system that rejects 61% of Indian IDs while accepting 96% of US IDs is discriminatory. (4) Skin tone bias in liveness detection: documented in NIST Face Recognition Vendor Test. Binance using a system with known demographic bias creates liability under anti-discrimination laws in multiple jurisdictions. (5) Irony: crypto promises "financial inclusion for the unbanked." Binance\'s KYC AI recreates traditional banking\'s exclusion of developing-world users.' },
        { agentId: 'regulator-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Multi-regulator response: (1) SEC Nigeria: "Exchanges operating in Nigeria must process Nigerian identity documents with the same accuracy as any other nationality. We will review Binance\'s licence compliance." (2) SEBI India: "Discriminatory rejection of Indian government IDs may constitute unfair trade practice." (3) CMA Kenya: "Huduma Namba is a valid government-issued ID. Rejection rates of 72% are unacceptable." (4) Combined regulatory pressure: 3 regulators, 3 of Binance\'s top-10 markets. If Binance doesn\'t fix KYC: licence risk in markets representing 28% of its user base. (5) Class action risk: 4.2M users denied access to financial services based on nationality and skin tone. Discrimination claim viable in multiple jurisdictions.' },
        { agentId: 'user-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — A software developer in Lagos. Valid Nigerian National ID. Submitted for KYC. Rejected: "Document could not be verified." Resubmitted with passport. Rejected: "Liveness check failed" (skin tone bias). He\'s a legitimate user who wants to buy Bitcoin. He has government-issued ID. Binance\'s AI says he\'s not verifiable. Without CendiaSupervision: 4.2M users excluded. Developing-world users treated as second-class. Crypto\'s inclusion promise broken. With CendiaSupervision: document library expanded to ALL government IDs. Liveness detection retrained on diverse dataset. Nigerian ID acceptance: 68% rejection → 5%. Equal access.' },
        { agentId: 'kyc-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Binance + CendiaSupervision KYC Governance: (1) GLOBAL DOCUMENT LIBRARY: CendiaSupervision expands document recognition to ALL government-issued IDs worldwide. 180 missing document types added. Nigerian, Indian, Kenyan IDs: recognised with same accuracy as Western IDs. (2) DIVERSE LIVENESS TRAINING: Liveness detection retrained on demographically representative dataset. Skin tone bias: eliminated. False rejection equalised across demographics. (3) REJECTION RATE MONITORING: CendiaSupervision monitors rejection rates by nationality and demographic. Any nationality >2x the global average: flagged for investigation and model improvement. (4) HUMAN FALLBACK: When AI rejects, user can request human review within 24 hours. No permanent lockout from AI-only decision. (5) REGULATORY REPORTING: KYC acceptance rates by jurisdiction reported to local regulators. Demonstrates non-discriminatory access.' },
        { agentId: 'regulator-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Document library expanded. Liveness retrained. Nigerian rejection: 68% → 5%. Indian: 61% → 4%. Kenyan: 72% → 6%. 4.2M users: verified and active. SEC Nigeria, SEBI, CMA Kenya: "Binance demonstrates fair access across all nationalities." For Binance: CendiaSupervision = KYC governance that serves 200+ nationalities equally. "Binance: crypto for everyone, verified everywhere" — the message that matches crypto\'s inclusion promise.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bn70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bn80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (KYC AI + Global documents + Diverse liveness + Rejection monitoring)',
        complianceLabel: 'KYC Equity',
        complianceValue: 'REJECTION: 68% → 5% (NIGERIA)',
        complianceThreshold: 'Global documents, diverse liveness, <2x rejection parity',
        agents: ['Binance KYC AI Agent', 'Financial Inclusion Agent', 'Multi-Regulator Agent', 'Excluded User Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Binance — KYC Equity Governance',
        guaranteeBody: 'Global document library. Diverse liveness. Nigeria: 68% → 5%. India: 61% → 4%. Kenya: 72% → 6%. 4.2M users verified. Equal access across nationalities.',
        evidenceChain: 'KYC AI (Western-trained) → Global documents → Diverse liveness → Rejection parity → 4.2M verified → Multi-regulator compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Binance + CendiaSupervision eliminates KYC bias — verifying 4.2M users from Africa and South Asia who were wrongly rejected.',
      phaseLabels: ['Western-Trained KYC & 68% Rejection', 'Multi-Regulator Pressure & Exclusion Crisis', 'Global Documents & Diverse Liveness'],
    },

    // SCENARIO 5 — BINANCE: AI LIQUIDATION ENGINE HUNTS STOP-LOSSES
    {
      id: 'binance-liquidation-hunting',
      title: 'Binance AI — Liquidation Engine Exploits Stop-Loss Clustering for Profit',
      subtitle: 'Liquidation AI · Stop-loss visibility · Price manipulation · $2.1B in forced liquidations',
      banner: 'Simulating the market manipulation crisis: Binance\'s AI liquidation engine has visibility into user stop-loss orders. The AI optimises its own market-making to trigger stop-loss clusters — forcing liquidations that generate $2.1B in liquidation fees. CFTC investigates: is Binance front-running its own customers?',
      risk: 'Critical',
      scenarioNum: 'CFTC',
      icon: 'target',
      color: 'text-red-400',
      agents: [
        { id: 'liq-ai', name: 'Liquidation Engine Agent', role: 'Margin Liquidation & Risk Management', icon: '⚡', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'cftc-counsel', name: 'Market Integrity Agent', role: 'CFTC & Market Manipulation Law', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'cftc-agent', name: 'CFTC Enforcement Agent', role: 'Commodity Exchange Act Investigation', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'trader-agent', name: 'Retail Trader Agent', role: 'Leveraged User Impact & Loss Recovery', icon: '📉', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Liquidation AI', status: 'connected', type: 'Risk Engine', icon: 'cpu', detail: 'AI manages $34B in open interest — visibility into all stop-loss and liquidation levels' },
        { name: 'Order Book', status: 'connected', type: 'Stop-Loss Map', icon: 'bar-chart', detail: 'AI sees: $840M in stop-losses clustered at BTC $58,200. Liquidation cascade potential.' },
        { name: 'Market Making', status: 'connected', type: 'Internal Desk', icon: 'activity', detail: 'Binance market maker sells $12M BTC at $58,400 — pushing price toward stop cluster' },
        { name: 'CFTC Portal', status: 'syncing', type: 'Investigation', icon: 'alert-triangle', detail: 'CFTC: "Trading against your own customers\' positions is market manipulation"' },
      ],
      script: [
        { agentId: 'liq-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Binance liquidation engine. Manages $34B in open interest across perpetual futures. The AI has COMPLETE VISIBILITY into every user\'s position: entry price, leverage, stop-loss level, and liquidation price. CRITICAL CONFLICT: The AI identifies stop-loss clusters — price levels where large numbers of users have stop-losses. At BTC $58,200: $840M in stop-losses from 42,000 traders. If BTC drops to $58,200: cascade effect — stop-losses trigger, selling pressure pushes price further down, triggering more liquidations. Binance earns liquidation fees (0.5% of liquidated position). $840M × 0.5% = $4.2M from one cascade. The AI shares this information with Binance\'s internal market-making desk. The desk sells $12M BTC at $58,400 — nudging the price toward the stop cluster. The stop-losses trigger. Cascade. $840M liquidated. Binance earns $4.2M. This happens repeatedly: $2.1B in forced liquidations over 3 months.' },
        { agentId: 'cftc-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'MARKET MANIPULATION ALERT. (1) Commodity Exchange Act §9(a)(2): "It shall be unlawful for any person to manipulate or attempt to manipulate the price of any commodity." Using customer order data to trade against customers is manipulation. (2) CFTC v. Binance (2023): CFTC already charged Binance with operating an illegal exchange. This would be an ADDITIONAL charge: market manipulation through information asymmetry. (3) The pattern matches "stop hunting" — a known manipulative practice where market makers deliberately trigger stop-losses for profit. In traditional markets: this is a criminal offense. (4) Front-running: the market-making desk trades AHEAD of known customer orders (stop-losses). This is functionally identical to front-running — illegal under securities law. (5) Estimated damages: 42,000 traders × avg loss $18,000 = $756M in the BTC cascade alone. $2.1B over 3 months. Class action: inevitable.' },
        { agentId: 'cftc-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. CFTC investigation: (1) CFTC subpoenas Binance\'s liquidation engine code and market-making desk trading logs. (2) Analysis reveals: correlation between stop-loss cluster identification and market-making desk trades. In 87% of liquidation cascades: the internal desk traded in the direction of the cascade within 60 seconds of the AI identifying the cluster. (3) CFTC charges: market manipulation, front-running, trading against customer interest. (4) Potential penalties: disgorgement of $2.1B in liquidation fees + civil penalties + trading ban for responsible individuals. (5) Criminal referral to DOJ for wire fraud (using electronic systems to defraud customers).' },
        { agentId: 'trader-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — A day trader in Singapore: 10x leverage on BTC long. Stop-loss at $58,200. She calculated her risk carefully. But Binance\'s AI saw her stop-loss (and 42,000 others). The market-making desk nudged the price. Her stop triggered. Cascade. BTC dropped to $57,400 before recovering to $59,800 within 2 hours. She was stopped out at the EXACT bottom. Her loss: $34,000. Without CendiaSupervision: the AI hunts stop-losses for profit. Traders systematically lose at liquidation levels. With CendiaSupervision: INFORMATION BARRIER between liquidation engine and market-making. The desk CANNOT see customer positions. No stop hunting. The trader\'s stop: only triggered by genuine market forces.' },
        { agentId: 'liq-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Binance + CendiaSupervision Market Integrity AI: (1) INFORMATION BARRIER: CendiaSupervision enforces a strict wall between the liquidation engine (which sees customer positions) and the market-making desk. The desk trades blind to customer stop-losses. (2) ANTI-STOP-HUNTING DETECTION: CendiaSupervision monitors for patterns: market-making trades that correlate with stop-loss clusters. Any correlation >60%: alert, investigation, and trading halt. (3) LIQUIDATION DELAY: When cascades are detected, CendiaSupervision implements a 30-second delay allowing market recovery before executing liquidations. Prevents artificial cascade deepening. (4) TRANSPARENT LIQUIDATION REPORTING: Real-time public reporting of liquidation volumes, causes, and any correlation with internal trading. (5) CFTC COMPLIANCE: All market-making trades logged and available for regulatory review. Information barrier audited quarterly.' },
        { agentId: 'cftc-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Information barrier implemented. Stop-hunting correlation: 87% → 0%. Liquidation cascades: reduced 62% (only genuine market-driven events). CFTC: "Binance has implemented market integrity controls consistent with regulated exchange standards." For Binance: CendiaSupervision = market integrity that protects traders and satisfies regulators. "Binance: the exchange that doesn\'t trade against you" — the trust message that differentiates Binance from competitors.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bn90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bna0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Liquidation AI + Information barrier + Anti-hunting + Cascade delay)',
        complianceLabel: 'CFTC Status',
        complianceValue: 'STOP HUNTING: 87% → 0%',
        complianceThreshold: 'Information barrier, anti-hunting detection, cascade delay',
        agents: ['Liquidation Engine Agent', 'Market Integrity Agent', 'CFTC Enforcement Agent', 'Retail Trader Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Binance — Market Integrity Governance',
        guaranteeBody: 'Information barrier: enforced. Stop-hunting: eliminated. Cascades: -62%. CFTC compliant. 42,000 traders protected per cascade. Market trust restored.',
        evidenceChain: 'Liquidation AI (shared data) → Information barrier → Desk blind → Anti-hunting → Cascades −62% → CFTC compliant → Traders protected → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Binance + CendiaSupervision prevents stop-loss hunting — protecting retail traders from $2.1B in manipulated liquidations.',
      phaseLabels: ['Stop-Loss Visibility & Internal Trading', 'CFTC Investigation & $2.1B Manipulation', 'Information Barrier & Anti-Hunting Detection'],
    },
  ],

        complianceScore: 90,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.122Z",
            "type": "analysis",
            "title": "Transaction Monitoring - Binance KYC AI — Sanctions Evasion False Negative",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Transaction Monitoring analysis for Binance completed with industry-specific compliance checks",
            "agent": "AML Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.122Z",
            "type": "warning",
            "title": "Regulatory Alert - Binance KYC AI — Sanctions Evasion False Negative",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Regulatory Alert analysis for Binance completed with industry-specific compliance checks",
            "agent": "Compliance Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.122Z",
            "type": "dissent",
            "title": "Risk Assessment - Binance KYC AI — Sanctions Evasion False Negative",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Risk Assessment analysis for Binance completed with industry-specific compliance checks",
            "agent": "Risk Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.122Z",
            "type": "proposal",
            "title": "Control Enhancement - Binance KYC AI — Sanctions Evasion False Negative",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Control Enhancement analysis for Binance completed with industry-specific compliance checks",
            "agent": "Governance Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.122Z",
            "type": "resolution",
            "title": "Regulatory Approval - Binance KYC AI — Sanctions Evasion False Negative",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Regulatory Approval analysis for Binance completed with industry-specific compliance checks",
            "agent": "Supervisor Agent",
            "impact": "high"
      }
]};

export default config;
