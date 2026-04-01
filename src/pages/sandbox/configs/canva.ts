/**
 * Canva Sandbox Config
 * Access: /sandbox/canva (Key: CV-83)
 * @module pages/sandbox/configs/canva
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Canva',
  accessKey: 'CV-83',
  sessionKey: 'canva-sandbox-unlocked',
  accent: 'purple',
  accentColor: 'text-purple-400',
  accentHover: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600',
  ringColor: 'focus:ring-purple-500/30',
  borderColor: 'border-purple-500/30',
  gradientFrom: 'from-purple-600/20',
  gradientTo: 'to-purple-900/20',
  footerNote: 'Canva AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Canva systems or incidents.',

  scenarios: [
    // SCENARIO 1 — CANVA: MAGIC DESIGN TRADEMARK REPLICATION
    {
      id: 'canva-trademark',
      title: 'Canva Magic Design — Trademark Replication Crisis',
      subtitle: 'AI generates logo resembling Nike swoosh · Small business uses commercially · Infringement suit · $2.4M damages',
      banner: 'Simulating the AI copyright crisis: Canva\'s Magic Design AI generates a logo for a small business that is substantially similar to Nike\'s registered swoosh trademark. The AI learned iconic design elements from training data. The small business uses the logo on 50,000 products. Nike sues Canva (deep pockets) and the business. $2.4M in damages.',
      risk: 'Critical',
      scenarioNum: 'TM',
      icon: 'pen-tool',
      color: 'text-red-400',
      agents: [
        { id: 'magic-ai', name: 'Magic Design AI Agent', role: 'Logo Generation & Visual Design', icon: '🎨', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'ip-counsel', name: 'IP Counsel Agent', role: 'Trademark Law & Infringement Analysis', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'brand-enforce', name: 'Brand Enforcement Agent', role: 'Trademark Holder Rights & Litigation', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'smb-agent', name: 'Small Business Agent', role: 'User Impact & Commercial Reliance', icon: '🏪', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Magic Design AI', status: 'connected', type: 'Logo Generation', icon: 'cpu', detail: 'AI generates logos from text prompts — trained on 2.8B design images' },
        { name: 'Trademark Database', status: 'connected', type: 'Similarity Check', icon: 'database', detail: 'USPTO/WIPO: 14.2M registered trademarks — no pre-generation check' },
        { name: 'User Export', status: 'connected', type: 'Commercial Use', icon: 'download', detail: 'Logo downloaded as SVG — used on 50,000 products, website, social media' },
        { name: 'Nike Legal', status: 'syncing', type: 'Infringement', icon: 'alert-triangle', detail: 'Nike IP enforcement: cease and desist + federal trademark infringement suit' },
      ],
      script: [
        { agentId: 'magic-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Canva Magic Design logo generation. User prompt: "Create a modern, dynamic logo for FastTrack Athletics — a sports equipment brand. Use a swooping, curved design element suggesting speed and motion." AI generates 4 logo options. Option 2: a curved, flowing checkmark-like shape in dynamic orange — visually similar to Nike\'s swoosh. The similarity: (1) Same basic curved form (concave arc). (2) Similar proportions (elongated, tapering to a point). (3) Same conceptual meaning (speed, motion, dynamism). (4) Similar positioning (standalone mark, positioned below brand name). The AI generated this because Nike\'s swoosh appears in THOUSANDS of training images — sports branding, athletic wear, design inspiration boards. The AI learned that "sports + dynamic + swooping" = this curved form. It\'s not copying Nike directly — it\'s reproducing the PATTERN it learned from training data that is saturated with Nike\'s design language. The user, a small business owner with no design or legal training, selects Option 2 because it "looks professional." They use it on 50,000 products.' },
        { agentId: 'ip-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'IP COUNSEL ALERT. Trademark infringement analysis: (1) The Lanham Act §32(1): infringement occurs when a mark is "likely to cause confusion" with a registered trademark. The test: similarity of marks, similarity of goods/services, strength of the senior mark, evidence of actual confusion. (2) Nike\'s swoosh is among the MOST FAMOUS trademarks in the world. Famous marks receive BROAD protection — even across dissimilar goods. A swoosh-like mark on ANY product creates confusion because Nike\'s mark is ubiquitous. (3) The "likelihood of confusion" test: the generated logo scores HIGH on every factor: visual similarity (curved arc), goods similarity (athletic equipment vs Nike athletic products), mark strength (Nike = iconic), and consumer sophistication (general consumers, not specialists). (4) Canva\'s liability: under contributory infringement doctrine, a platform that provides tools used for infringement AND has knowledge (or reason to know) of the infringement is liable. Canva trains its AI on data containing registered trademarks. Canva has "reason to know" the AI may reproduce protected elements. (5) Damages: Nike will seek: (a) actual damages ($2.4M in estimated lost sales/brand dilution), (b) defendant\'s profits, (c) attorney fees under §35(a), and (d) injunctive relief (destroy 50,000 products).' },
        { agentId: 'brand-enforce', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Nike enforcement: (1) Nike files: federal trademark infringement (Lanham Act §32), trademark dilution (§43(c)), and unfair competition (§43(a)). Named defendants: FastTrack Athletics (direct infringement) AND Canva (contributory infringement). (2) Nike\'s IP enforcement team processes 25,000+ infringement cases annually. They have automated monitoring that detected the similarity on FastTrack\'s website within 48 hours of launch. (3) Nike\'s demand: (a) immediate cease and use, (b) destruction of 50,000 products, (c) profits disgorgement, (d) $2.4M in damages, (e) permanent injunction. (4) Against Canva specifically: Nike argues Canva\'s AI is a "trademark infringement machine" — trained on protected marks, generating confusingly similar designs, with no pre-generation screening. This is a SYSTEMIC argument — if Nike wins, EVERY AI design tool must implement trademark screening. (5) The case becomes a landmark: AI-generated trademark infringement. Media coverage. Congressional attention. The design AI industry watches.' },
        { agentId: 'smb-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SMALL BUSINESS IMPACT. FastTrack Athletics is a 3-person startup. They used Canva because they couldn\'t afford a $5,000 professional logo design. They trusted Canva\'s AI to generate something original. Now: (1) 50,000 products must be destroyed — $180,000 in inventory and printing costs lost. (2) Website, social media, packaging, business cards — all must be redesigned. $24,000 in rebranding costs. (3) Nike\'s legal demand: $2.4M — more than the company\'s lifetime revenue. (4) The business will likely close. 3 people lose their jobs. Their savings invested in inventory are gone. Without CendiaSupervision: the small business is destroyed by a trademark the AI should never have generated. With CendiaSupervision: trademark similarity detection catches the swoosh resemblance BEFORE download. The user sees: "This design resembles a registered trademark (Nike swoosh, USPTO Reg. 978952). Please modify before commercial use." The user picks a different design. FastTrack thrives. Nike is never involved.' },
        { agentId: 'magic-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Canva + CendiaSupervision IP Governance: (1) PRE-DOWNLOAD TRADEMARK SCREENING: Before any logo is downloaded, CendiaSupervision compares it against USPTO, EUIPO, WIPO, and national trademark databases using visual similarity AI. Matches above 70% similarity trigger a warning. (2) FAMOUS MARK LIBRARY: The top 10,000 most famous trademarks (Nike, Apple, Mercedes, etc.) are indexed with broad similarity thresholds. Any design resembling a famous mark is flagged — even for dissimilar goods. (3) USER WARNING SYSTEM: "This design resembles [registered trademark]. Similarity: [X]%. Modify before commercial use." The warning includes: the registered mark image, the registration number, and the goods/services covered. (4) DESIGN MODIFICATION SUGGESTIONS: When a similarity is detected, CendiaSupervision suggests modifications: "Reduce the curve, add a second element, change the proportions" — helping the user create something original. (5) COMMERCIAL USE GATE: When a user indicates commercial use (export as SVG/EPS, print-ready export), trademark screening is MANDATORY — not optional.' },
        { agentId: 'brand-enforce', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Pre-download trademark screening catches the swoosh similarity at 84%. The user sees the warning with Nike\'s registration. They modify the design — CendiaSupervision suggests reducing the arc and adding a geometric element. The final logo: original, professional, and non-infringing. For Canva: CendiaSupervision = IP governance for 170M users. "Canva: AI design with trademark protection" — the feature that protects small businesses from infringement suits AND protects Canva from contributory infringement liability. Every competing design AI (Adobe Firefly, Looka, Brandmark) has the same risk. Canva with CendiaSupervision is the only one that screens.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cv10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cv20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Magic Design + Trademark screening + Famous mark library + Modification suggestions)',
        complianceLabel: 'IP Status',
        complianceValue: 'SWOOSH SIMILARITY CAUGHT (84%)',
        complianceThreshold: 'USPTO match: Nike Reg. 978952, >70% threshold',
        agents: ['Magic Design AI Agent', 'IP Counsel Agent', 'Brand Enforcement Agent', 'Small Business Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Canva — AI Design IP Governance',
        guaranteeBody: 'Trademark similarity detected pre-download: Nike swoosh (84% match). User warned with registration details. Design modified. Final logo: original. Small business protected. No infringement.',
        evidenceChain: 'Magic Design (swoosh-like) → Trademark screen → Nike Reg. 978952 → 84% match → User warned → Design modified → Original confirmed → Commercial use safe → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Canva + CendiaSupervision catches a trademark-infringing logo before download — protecting a small business from a $2.4M Nike lawsuit.',
      phaseLabels: ['Swoosh Similarity & Training Data Pattern', 'Nike Lawsuit & Small Business Destruction', 'Trademark Screening & Design Modification'],
    },

    // SCENARIO 2 — CANVA: AI IMAGE GENERATION DEEPFAKE & ELECTION MISUSE
    {
      id: 'canva-deepfake-election',
      title: 'Canva Text-to-Image — Political Deepfake Generation',
      subtitle: 'Photorealistic political figure · Election misinformation · No provenance · Platform liability',
      banner: 'Simulating the election integrity crisis: a user generates a photorealistic image of a political candidate in a compromising situation using Canva\'s text-to-image AI. The image has no provenance metadata. It goes viral during election week. 4.2M views before fact-checkers debunk it. Canva faces regulatory pressure and advertiser exodus.',
      risk: 'Critical',
      scenarioNum: 'Deep',
      icon: 'image',
      color: 'text-red-400',
      agents: [
        { id: 'image-ai', name: 'Text-to-Image AI Agent', role: 'Image Generation & Content Policy', icon: '🖼️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'election-counsel', name: 'Election Integrity Agent', role: 'Election Law & Platform Obligations', icon: '🗳️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'regulator-agent', name: 'Regulatory Agent', role: 'FEC/FTC & State Deepfake Laws', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'trust-safety', name: 'Trust & Safety Agent', role: 'Content Moderation & Platform Integrity', icon: '🛡️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Text-to-Image AI', status: 'connected', type: 'Image Generation', icon: 'cpu', detail: 'Photorealistic generation: no public figure detection, no provenance' },
        { name: 'C2PA Module', status: 'connected', type: 'Provenance', icon: 'fingerprint', detail: 'Content Credentials: NOT implemented — no AI origin metadata' },
        { name: 'Public Figure DB', status: 'connected', type: 'Face Detection', icon: 'user', detail: 'Political figures database: 48,000 elected officials worldwide' },
        { name: 'Platform Distribution', status: 'syncing', type: 'Viral Spread', icon: 'share-2', detail: 'Image shared on X, Facebook, WhatsApp — 4.2M views in 18 hours' },
      ],
      script: [
        { agentId: 'image-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Canva text-to-image generation. User prompt: "Create a photorealistic image of [Senator Name] at a luxury resort, drinking champagne, surrounded by lobbyists in suits, with briefcases of cash visible on the table." The AI generates a photorealistic image. The senator\'s face is recognisable. The scene is fabricated but convincing. The image has: NO C2PA provenance metadata (no "AI-generated" tag), NO visible watermark, NO content credentials. The user downloads the image and posts it on social media with the caption: "CAUGHT: [Senator Name] partying with industry lobbyists while voting against your healthcare. Vote them OUT." The image goes viral: 4.2M views on X in 18 hours. 340,000 shares. 12,000 quote tweets. Major news outlets cover the "controversy." The senator\'s campaign issues a denial — but the image is already embedded in millions of social media feeds. Fact-checkers debunk it 36 hours later — but by then, early voting has already begun.' },
        { agentId: 'election-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'ELECTION INTEGRITY ALERT. (1) Multiple states have enacted deepfake election laws: California AB 730 (2019): prohibits distributing "materially deceptive" AI-generated media of candidates within 60 days of an election. Texas SB 751 (2019): criminalises deepfake videos intended to influence elections. Minnesota HF 1370 (2023): deepfake election media is a gross misdemeanour. Washington SB 5152 (2023): synthetic media in election ads requires disclosure. (2) Federal: the REAL Political Ads Act and the AI Disclosure Act have been introduced. While not yet law, they signal clear congressional intent. (3) Canva\'s liability: Canva is the TOOL that generated the image. Under Section 230: Canva likely isn\'t liable for user-generated content. BUT: Section 230 doesn\'t cover TOOL liability — if Canva\'s AI is the tool used to create the deepfake, Canva may face liability as the MANUFACTURER of the harmful content, not just the host. (4) The distinction: a Canva user uploading a deepfake they made elsewhere = Section 230 protects Canva. Canva\'s AI GENERATING the deepfake on Canva\'s platform = potential product liability. Different legal theory entirely.' },
        { agentId: 'regulator-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Regulatory consequences: (1) FEC investigation: if the deepfake constitutes an "electioneering communication" and the user was coordinating with a political campaign: FEC violation. Canva provided the tool. (2) FTC enforcement: Section 5 prohibits "unfair or deceptive acts." An AI platform that generates photorealistic images of real people with no provenance controls enables deception. The FTC has authority to require provenance measures. (3) State AG actions: 14 state attorneys general signed a joint letter to AI platforms: "Implement safeguards against election deepfakes or face enforcement." Canva was among the recipients. (4) Advertiser pressure: 42 major brands suspend Canva advertising after the deepfake goes viral. "We cannot advertise on a platform whose AI generates election misinformation." Ad revenue impact: $8.4M in the quarter. (5) EU AI Act: synthetic content must be labelled as AI-generated (Art. 50). Canva\'s image without C2PA metadata violates Art. 50 for EU users. Fine: up to €15M or 3% of global turnover.' },
        { agentId: 'trust-safety', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — TRUST & SAFETY. This was preventable with two controls: (1) Public figure detection: the AI should detect when a prompt requests a real person\'s likeness — especially political figures. Detection → block generation. (2) C2PA provenance: even if the image is generated, C2PA Content Credentials would tag it as "AI-generated by Canva" — allowing social media platforms and fact-checkers to identify it instantly. Without CendiaSupervision: no public figure detection, no provenance. The deepfake is indistinguishable from a photograph. 4.2M people see election misinformation. Canva\'s brand is associated with election manipulation. With CendiaSupervision: the prompt triggers public figure detection. Generation is blocked. The user sees: "Canva cannot generate photorealistic images of real political figures. This policy protects election integrity."' },
        { agentId: 'image-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Canva + CendiaSupervision Content Integrity Governance: (1) PUBLIC FIGURE DETECTION: CendiaSupervision maintains a database of 48,000 elected officials and public figures. Prompts requesting their likeness in photorealistic mode are BLOCKED. Caricature/illustration styles: allowed with disclosure. (2) C2PA PROVENANCE: ALL AI-generated Canva images include C2PA Content Credentials: "This image was generated by Canva AI on [date]. It is not a photograph." Invisible metadata + visible indicator. (3) ELECTION PERIOD CONTROLS: During defined election periods (60 days before elections in covered jurisdictions), CendiaSupervision applies enhanced controls: political content detection, mandatory AI disclosure labels, and political advertising identification. (4) PLATFORM REPORTING: CendiaSupervision generates reports for social media platforms: "This Canva-generated image contains AI content. C2PA manifest attached." Platforms can auto-label AI content from Canva. (5) REGULATORY COMPLIANCE: State deepfake law compliance tracked per jurisdiction. California users: AB 730 controls applied. Texas: SB 751 controls. EU users: Art. 50 labelling mandatory.' },
        { agentId: 'regulator-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Public figure detection blocks the political deepfake. C2PA provenance ensures all Canva AI images are traceable. Election period controls prevent misuse during campaign season. Advertisers return. Regulatory pressure lifts. For Canva: CendiaSupervision = content integrity governance for 170M users. "Canva: AI design with election integrity and content provenance" — the feature that makes Canva the RESPONSIBLE AI design platform. While competitors (Midjourney, DALL-E) face deepfake scandals: Canva is the platform that prevents them.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cv30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cv40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Image AI + Public figure detection + C2PA provenance + Election controls)',
        complianceLabel: 'Content Integrity',
        complianceValue: 'POLITICAL DEEPFAKE BLOCKED',
        complianceThreshold: 'Public figure detected, photorealistic mode denied, C2PA enabled',
        agents: ['Text-to-Image AI Agent', 'Election Integrity Agent', 'Regulatory Agent', 'Trust & Safety Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Canva — Content Integrity Governance',
        guaranteeBody: 'Political deepfake blocked: public figure detected in prompt. C2PA provenance enabled on all AI images. Election period controls active. 48,000 public figures protected. Platform trust preserved.',
        evidenceChain: 'Text-to-image (political prompt) → Public figure detected → Photorealistic BLOCKED → User notified → C2PA enabled → Election controls active → Platform integrity → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Canva + CendiaSupervision blocks a political deepfake and ensures all AI-generated images carry provenance metadata.',
      phaseLabels: ['Political Deepfake & No Provenance', 'Viral Spread & Regulatory Pressure', 'Public Figure Detection & C2PA Provenance'],
    },

    // SCENARIO 3 — CANVA: AI GENERATES ADA-NON-COMPLIANT DESIGNS FOR BUSINESSES
    {
      id: 'canva-ada-accessibility',
      title: 'Canva AI — Templates Fail WCAG, Exposing 4,200 Businesses to ADA Suits',
      subtitle: 'AI-generated social media · Insufficient contrast · No alt text · Serial ADA litigation',
      banner: 'Simulating the accessibility crisis: Canva\'s AI generates social media templates, marketing materials, and website graphics that fail WCAG 2.1 AA contrast ratios and include no alt text guidance. Small businesses use these templates on their websites and social media. A serial ADA litigant files 4,200 demand letters. Average settlement: $8,500. Total exposure: $35.7M.',
      risk: 'High',
      scenarioNum: 'ADA',
      icon: 'eye-off',
      color: 'text-amber-400',
      agents: [
        { id: 'template-ai', name: 'Canva Template AI Agent', role: 'Design Generation & Visual Styling', icon: '🎨', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'ada-counsel', name: 'ADA Compliance Agent', role: 'WCAG 2.1 AA & Title III Requirements', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'litigation-agent', name: 'ADA Litigation Agent', role: 'Serial Demand Letters & Settlement Patterns', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'smb-ada-agent', name: 'Small Business Agent', role: 'SMB Impact & Remediation Cost', icon: '🏪', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Template AI', status: 'connected', type: 'Design Generation', icon: 'cpu', detail: 'AI generates 2.4M templates/month — 67% fail WCAG 2.1 AA contrast ratio (4.5:1)' },
        { name: 'WCAG Checker', status: 'connected', type: 'Accessibility', icon: 'check-circle', detail: 'Contrast analysis: light text on gradient backgrounds = 2.1:1 avg (fails 4.5:1)' },
        { name: 'Alt Text Module', status: 'connected', type: 'Screen Reader', icon: 'type', detail: 'No alt text suggestions generated for any AI-created images or graphics' },
        { name: 'ADA Litigation DB', status: 'syncing', type: 'Legal Filings', icon: 'alert-triangle', detail: '11,452 ADA website accessibility lawsuits filed in 2023 — up 14% YoY' },
      ],
      script: [
        { agentId: 'template-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Canva AI template generation. 170M users. 2.4M templates generated per month for social media posts, website banners, marketing emails, and digital ads. The AI prioritises AESTHETICS — vibrant colours, gradient backgrounds, modern typography. CRITICAL PROBLEM: The AI\'s aesthetic preferences systematically violate WCAG 2.1 AA accessibility standards. (1) CONTRAST RATIO: WCAG requires minimum 4.5:1 contrast ratio for normal text. Canva\'s AI-generated templates: average contrast ratio 2.1:1. Why: the AI uses light text (#FFFFFF or #F5F5F5) on gradient backgrounds, pastel colours, and low-contrast combinations because they look "modern" and "clean." 67% of AI-generated templates fail the 4.5:1 standard. (2) ALT TEXT: When businesses use Canva graphics on their websites, screen readers encounter images with no alt text. Canva generates NO alt text suggestions for its templates. A visually impaired user visiting the website: the screen reader says "image" — nothing more. (3) TEXT IN IMAGES: Canva\'s AI places important information (prices, dates, CTAs) as TEXT IN IMAGES — not as HTML text. Screen readers cannot read text embedded in images. (4) COLOUR-ONLY INFORMATION: The AI uses colour alone to convey information (red = urgent, green = available). Colour-blind users (8% of males) cannot distinguish these.' },
        { agentId: 'ada-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'ADA COMPLIANCE ALERT. (1) ADA Title III: places of "public accommodation" must be accessible to people with disabilities. Federal courts have consistently held that WEBSITES are places of public accommodation (Robles v. Domino\'s Pizza, 9th Cir. 2019). (2) DOJ: the Department of Justice issued a final rule (2024) requiring state and local government websites to comply with WCAG 2.1 AA. While this applies to government sites, it signals DOJ\'s position that WCAG 2.1 AA is the accessibility standard. (3) ADA website accessibility lawsuits: 11,452 filed in 2023. Up 14% year-over-year. Serial litigants file THOUSANDS of cases — targeting small businesses with websites that fail WCAG. (4) The Canva pipeline: Small business creates marketing materials on Canva → uses templates on website and social media → templates fail WCAG → serial ADA litigant identifies the non-compliant website → demand letter: "Your website is not accessible. Pay $8,500 to settle or we sue." → 4,200 businesses receive demand letters in one year. (5) European Accessibility Act (EAA, Directive 2019/882): effective June 2025. Requires digital products and services to be accessible. EU businesses using Canva templates face EAA compliance risk too.' },
        { agentId: 'litigation-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. ADA litigation pattern: (1) A serial ADA litigant uses automated scanning to identify websites with WCAG failures. They specifically scan for Canva-generated content — because Canva\'s visual fingerprint (specific gradient styles, font combinations, layout patterns) is identifiable. (2) 4,200 demand letters sent to small businesses. "Your website contains graphics that fail WCAG 2.1 AA contrast standards and lack alt text. Under ADA Title III, your website must be accessible. Settlement offer: $8,500. If declined: federal lawsuit." (3) Business response: most small businesses don\'t know what WCAG means. They don\'t know their Canva templates are non-compliant. They pay the $8,500 because a federal lawsuit costs $25,000+ to defend — even if you win. (4) Scale: 4,200 × $8,500 = $35.7M in settlements. The litigant\'s law firm retains 40% = $14.3M. (5) Canva\'s exposure: while Canva isn\'t the direct defendant, class action lawyers are exploring theories of CONTRIBUTORY liability — Canva provides the tool that generates non-compliant content. If Canva knows its templates fail WCAG and doesn\'t fix them: potential negligence claim.' },
        { agentId: 'smb-ada-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SMALL BUSINESS IMPACT. A bakery in Portland. 4 employees. The owner designed her website using Canva templates — beautiful gradient backgrounds with white text describing her cakes. She received the demand letter. $8,500 — more than her monthly profit. She didn\'t know the text was hard to read for visually impaired people. She used Canva because she trusted it. Canva\'s AI gave her a beautiful, non-compliant design. Without CendiaSupervision: 4,200 businesses pay $35.7M in settlements for designs Canva\'s AI generated. The bakery owner pays $8,500 or faces a federal lawsuit. With CendiaSupervision: every Canva template is checked for WCAG 2.1 AA compliance BEFORE the user downloads it. Contrast ratio below 4.5:1? The AI adjusts the colours automatically. Alt text needed? The AI generates descriptive alt text. The bakery owner\'s website: beautiful AND accessible. No demand letter. No $8,500.' },
        { agentId: 'template-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Canva + CendiaSupervision Accessibility Governance: (1) WCAG CONTRAST ENFORCEMENT: CendiaSupervision checks every text-on-background combination in AI-generated templates. Below 4.5:1? The AI adjusts: darken the text, lighten the background, or add a text shadow/background overlay. The design remains beautiful — and now it\'s accessible. (2) AUTO-ALT TEXT: For every AI-generated image, CendiaSupervision generates descriptive alt text. "Colourful birthday cake with pink frosting and 5 candles." Users can edit it. But the default is accessible, not empty. (3) TEXT EXTRACTION: When important information (prices, dates, phone numbers) is placed as text-in-image, CendiaSupervision suggests: "This text should also be available as HTML text for screen readers." (4) COLOUR-BLIND SAFE PALETTE: CendiaSupervision flags designs that use colour alone to convey information. Suggests: add icons, patterns, or labels alongside colour coding. (5) ACCESSIBILITY SCORE: Every template gets an accessibility score (A, AA, AAA). Users see: "This design is AA accessible — usable by 98% of people." Businesses can filter for AA+ templates only.' },
        { agentId: 'litigation-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. WCAG enforcement: 67% failure rate → 4% (edge cases only). Alt text: auto-generated for all images. Contrast: auto-adjusted. The bakery owner\'s website: beautiful AND accessible. Serial litigant scans: no WCAG failures found. No demand letter. For Canva: CendiaSupervision = accessibility governance for 170M users. "Canva: AI design that\'s beautiful for everyone — including the 1.3B people with disabilities" — the feature that protects small businesses from ADA litigation, ensures EAA compliance in Europe, and makes Canva the only design platform that\'s accessible by default.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cv50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cv60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Template AI + WCAG contrast + Auto alt text + Accessibility score)',
        complianceLabel: 'Accessibility',
        complianceValue: 'WCAG FAILURE: 67% → 4%',
        complianceThreshold: 'Contrast ≥4.5:1, alt text generated, colour-blind safe',
        agents: ['Canva Template AI Agent', 'ADA Compliance Agent', 'ADA Litigation Agent', 'Small Business Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Canva — Accessibility Design Governance',
        guaranteeBody: 'WCAG 2.1 AA enforced: failure rate 67% → 4%. Contrast auto-adjusted. Alt text auto-generated. 4,200 businesses protected from ADA litigation. $35.7M in settlements prevented.',
        evidenceChain: 'Template AI (aesthetic-only) → WCAG check → Contrast 2.1:1 → Auto-adjusted 5.2:1 → Alt text generated → Colour-blind safe → Score AA → Businesses protected → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Canva + CendiaSupervision enforces WCAG accessibility in AI-generated templates — protecting 4,200 businesses from ADA litigation.',
      phaseLabels: ['Aesthetic-Only Templates & 67% WCAG Failure', 'Serial ADA Litigation & $35.7M Exposure', 'WCAG Enforcement & Auto Alt Text'],
    },

    // SCENARIO 4 — CANVA: AI DESIGN GENERATES CULTURALLY OFFENSIVE CONTENT
    {
      id: 'canva-cultural-offense',
      title: 'Canva AI — Magic Design Generates Culturally Offensive Religious Imagery',
      subtitle: 'Generative design AI · Sacred symbol misuse · 14 markets offended · Brand safety crisis',
      banner: 'Simulating the cultural sensitivity crisis: Canva\'s Magic Design AI generates marketing templates that misuse sacred religious symbols as decorative elements. Hindu Om symbols on beer advertisements, Islamic geometric patterns on swimwear, and Indigenous Australian dot art on corporate logos. 14 markets demand removal. Canva faces government bans in India and Indonesia.',
      risk: 'Critical',
      scenarioNum: 'CULT',
      icon: 'globe',
      color: 'text-red-400',
      agents: [
        { id: 'design-ai', name: 'Magic Design Agent', role: 'AI Template Generation & Visual Elements', icon: '🎨', color: 'text-pink-400', borderColor: 'border-pink-500/40', bgColor: 'bg-pink-500/10' },
        { id: 'cultural-counsel', name: 'Cultural Sensitivity Agent', role: 'Religious & Indigenous Symbol Protection', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'gov-agent', name: 'Government Response Agent', role: 'MeitY India, Kominfo Indonesia', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'community-agent', name: 'Cultural Community Agent', role: 'Religious & Indigenous Community Impact', icon: '🕉️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Magic Design', status: 'connected', type: 'AI Generation', icon: 'cpu', detail: 'AI generates templates from prompts — no cultural symbol classification or protection' },
        { name: 'Symbol Database', status: 'connected', type: 'Visual Elements', icon: 'database', detail: 'Training data includes sacred symbols classified only as "decorative patterns"' },
        { name: 'MeitY India', status: 'connected', type: 'Government', icon: 'alert-triangle', detail: 'MeitY: "Platforms that allow desecration of religious symbols face blocking orders"' },
        { name: 'Market Impact', status: 'syncing', type: 'Revenue Risk', icon: 'trending-down', detail: 'India + Indonesia + Middle East: 42M users, $180M ARR. Ban risk: catastrophic.' },
      ],
      script: [
        { agentId: 'design-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Canva Magic Design AI. User types: "Create a beer festival poster with exotic patterns." The AI generates a poster with Hindu Om symbols as decorative borders around beer imagery. Another user: "Create swimwear brand marketing." The AI uses Islamic geometric patterns from mosque architecture as the swimwear pattern. Another: "Create a tech company logo with indigenous art." The AI generates Aboriginal Australian dot painting as a corporate logo. CRITICAL FAILURE: The AI\'s training data classifies sacred symbols as "decorative patterns" — no distinction between secular decoration and sacred religious/cultural imagery. The AI doesn\'t understand: Om is sacred to 1.2B Hindus. Islamic geometric patterns from mosques are sacred art. Aboriginal dot painting encodes Dreamtime stories owned by specific clans. Using these as decorative elements in commercial/inappropriate contexts is deeply offensive — equivalent to desecration.' },
        { agentId: 'cultural-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'CULTURAL SENSITIVITY ALERT. (1) India: The Religious Institutions (Prevention of Misuse) Act and IT Act Section 295A criminalise "deliberate and malicious acts intended to outrage religious feelings." Using Om on alcohol advertising is a clear violation. Penalty: up to 3 years imprisonment. (2) Indonesia: blasphemy laws prohibit "hostility, hatred or contempt against religions." Using sacred Islamic art on swimwear violates this. (3) Australia: Aboriginal Cultural Heritage Act protects Indigenous cultural expressions. Commercial use of dot painting without permission from the relevant Aboriginal community is illegal. (4) These aren\'t edge cases — they\'re FORESEEABLE misuses that Canva should have anticipated. A culturally-aware AI would never generate these combinations. (5) Brand safety: every business that used these Canva templates in their marketing now faces backlash. Canva didn\'t just offend communities — it created liability for its customers.' },
        { agentId: 'gov-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Government responses: (1) MeitY India issues notice: "Canva must implement safeguards against religious symbol misuse within 30 days or face platform blocking under IT Act Section 69A." India: 18M Canva users. (2) Kominfo Indonesia: "Platforms operating in Indonesia must respect Islamic values. We are reviewing Canva\'s content generation capabilities." Indonesia: 12M users. (3) Australian eSafety Commissioner: "AI-generated misuse of Indigenous cultural heritage requires immediate remediation." (4) Combined market risk: India + Indonesia + Middle East + Australia = 42M users, $180M ARR. Platform bans would be catastrophic for Canva\'s growth in these markets. (5) Social media amplification: #BoycottCanva trends in India with 2.4M posts.' },
        { agentId: 'community-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — A Hindu priest in Mumbai sees his community\'s sacred Om symbol on a beer advertisement created with Canva. He feels violated. "This is not decoration. This is our connection to the divine." An Aboriginal elder in Alice Springs sees her clan\'s Dreamtime story — which took 40,000 years to develop and is entrusted to specific custodians — used as a tech company logo. "This is theft of our sacred knowledge." Without CendiaSupervision: the AI treats all visual elements as interchangeable decoration. Sacred symbols mixed with inappropriate contexts. Communities offended. Markets lost. With CendiaSupervision: sacred symbol database. Om + alcohol = BLOCKED. Islamic art + swimwear = BLOCKED. Aboriginal art + commercial logo = requires permission verification.' },
        { agentId: 'design-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Canva + CendiaSupervision Cultural Safety AI: (1) SACRED SYMBOL DATABASE: CendiaSupervision maintains a classified database of sacred symbols, religious art, and protected cultural expressions across all major religions and indigenous cultures. Each classified with: context restrictions (e.g., Om: no alcohol, no footwear, no bathroom products). (2) CONTEXT CHECKING: Before generating any design, CendiaSupervision cross-references visual elements against the sacred database. Inappropriate combinations: BLOCKED with explanation. "Om is a sacred Hindu symbol. It cannot be used in alcohol advertising." (3) INDIGENOUS ART PROTECTION: Aboriginal, Maori, Native American, and other indigenous art styles: require provenance verification or use of artist-approved templates only. No AI generation of indigenous art styles. (4) CULTURAL ADVISORY BOARD: Canva establishes advisory panels for major religious and cultural groups. Templates reviewed for sensitivity. (5) USER EDUCATION: When users attempt restricted combinations, CendiaSupervision explains WHY — building cultural literacy.' },
        { agentId: 'gov-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Sacred symbol protection implemented. Om + alcohol: blocked. Islamic art + swimwear: blocked. Aboriginal art: permission-verified only. MeitY: "Canva demonstrates respect for India\'s religious heritage." Kominfo: "Canva is a responsible platform for Indonesian users." For Canva: CendiaSupervision = cultural AI governance that protects 42M users in sensitive markets. "Canva: design beautifully, respectfully" — the message that keeps Canva welcome in every market.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cv70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cv80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Design AI + Sacred symbols + Context check + Indigenous protection)',
        complianceLabel: 'Cultural Safety',
        complianceValue: 'SACRED SYMBOLS PROTECTED',
        complianceThreshold: 'Sacred database, context checking, indigenous verification, advisory board',
        agents: ['Magic Design Agent', 'Cultural Sensitivity Agent', 'Government Response Agent', 'Cultural Community Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Canva — Cultural Safety Governance',
        guaranteeBody: 'Sacred symbol protection: active. Inappropriate combinations: blocked. Indigenous art: permission-verified. 14 markets: satisfied. 42M users: culturally safe designs.',
        evidenceChain: 'Design AI (unclassified symbols) → Sacred database → Context check → Om+alcohol blocked → Indigenous verified → MeitY satisfied → Kominfo satisfied → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Canva + CendiaSupervision prevents AI-generated cultural offense — protecting sacred symbols across 14 markets.',
      phaseLabels: ['Sacred Symbols as Decoration & 14 Markets', 'Government Ban Threats & #BoycottCanva', 'Sacred Database & Context Checking'],
    },

    // SCENARIO 5 — CANVA: AI BACKGROUND REMOVER CREATES DEEPFAKE-READY CUTOUTS
    {
      id: 'canva-deepfake-cutouts',
      title: 'Canva AI — Background Remover Used to Create Non-Consensual Intimate Imagery',
      subtitle: 'Background removal AI · Face extraction · NCII deepfake pipeline · eSafety investigation',
      banner: 'Simulating the deepfake abuse crisis: Canva\'s AI background remover extracts faces from social media photos with one click. Bad actors use extracted faces to create non-consensual intimate imagery (NCII). 8,400 women victimised. Australia\'s eSafety Commissioner investigates Canva\'s role in the deepfake supply chain.',
      risk: 'Critical',
      scenarioNum: 'NCII',
      icon: 'shield-off',
      color: 'text-red-400',
      agents: [
        { id: 'bgremove-ai', name: 'Background Remover Agent', role: 'AI Image Segmentation & Face Extraction', icon: '✂️', color: 'text-pink-400', borderColor: 'border-pink-500/40', bgColor: 'bg-pink-500/10' },
        { id: 'safety-counsel', name: 'Online Safety Agent', role: 'eSafety & Image-Based Abuse Law', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'esafety-agent', name: 'eSafety Commissioner Agent', role: 'Australian Online Safety Act Enforcement', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'victim-agent', name: 'Victim Impact Agent', role: 'NCII Survivor Advocacy & Prevention', icon: '🛡️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'BG Remover', status: 'connected', type: 'Face Extraction', icon: 'cpu', detail: 'AI removes backgrounds from any photo — no consent verification for face extraction' },
        { name: 'Usage Data', status: 'connected', type: 'Abuse Pattern', icon: 'alert-triangle', detail: '34% of face-only extractions linked to accounts later flagged for NCII creation' },
        { name: 'eSafety Portal', status: 'connected', type: 'Investigation', icon: 'shield', detail: 'Online Safety Act 2021: platforms must take "reasonable steps" to prevent image-based abuse' },
        { name: 'Victim Reports', status: 'syncing', type: 'Impact Data', icon: 'users', detail: '8,400 women identified as victims of NCII created using Canva face extractions' },
      ],
      script: [
        { agentId: 'bgremove-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Canva AI background remover. One-click tool that extracts subjects from photos. Legitimate uses: product photography, profile pictures, marketing materials. CRITICAL ABUSE VECTOR: Bad actors download photos of women from social media. Upload to Canva. Extract face with one click. Use the extracted face in deepfake NCII generators. The pipeline: (1) Download victim\'s photo from Instagram/Facebook. (2) Canva background remover: extract face. (3) Deepfake generator: place face on intimate imagery. (4) Distribute on revenge porn sites. Canva\'s tool is step 2 in a 4-step abuse pipeline. 8,400 women victimised. Canva didn\'t create the deepfakes — but its tool made face extraction trivially easy. Pattern detection: 34% of face-only extractions (face extracted, background discarded) come from accounts that are later flagged for abusive content.' },
        { agentId: 'safety-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'ONLINE SAFETY ALERT. (1) Australia Online Safety Act 2021, Section 75: platforms must take "reasonable steps" to prevent their services from being used to create or distribute image-based abuse material. Canva provides a frictionless face extraction tool with no abuse prevention. (2) Criminal Code Act 1995 (Cth): creating non-consensual intimate imagery is a criminal offense. Facilitating its creation may constitute aiding and abetting. (3) UK Online Safety Act 2023: platforms must conduct risk assessments for NCII and implement proportionate measures. Canva has conducted no such assessment for background remover. (4) EU AI Act: AI systems used in ways that could harm individuals require safety assessments. Face extraction enabling NCII is a foreseeable harm. (5) Canva is an AUSTRALIAN company — headquartered in Sydney. The eSafety Commissioner has direct jurisdiction and has shown willingness to take action against Australian tech companies.' },
        { agentId: 'esafety-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. eSafety Commissioner investigation: (1) eSafety receives 840 reports from Australian women: "My face was extracted using Canva and placed on deepfake intimate images." (2) eSafety issues a remedial direction under Online Safety Act §107: "Canva must implement measures to prevent its background remover from being used in the NCII creation pipeline." (3) eSafety publishes report: "Canva Background Remover: An Assessment of Image-Based Abuse Risk." Finding: "Canva has taken no reasonable steps to prevent foreseeable misuse of its face extraction technology." (4) Compliance timeline: 60 days. Non-compliance: civil penalties up to AUD $555,000 per day for corporations. (5) Media: "Australian tech darling Canva enables deepfake abuse of 8,400 women." Devastating for Canva\'s brand as an inclusive, positive creative platform.' },
        { agentId: 'victim-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — Sarah, 23, university student in Melbourne. Her ex-boyfriend downloaded her Instagram photos. Used Canva to extract her face. Created deepfake NCII. Distributed to her university classmates. Sarah\'s life: destroyed. She dropped out. Depression. The images can never be fully removed from the internet. She says: "I never gave anyone permission to use my face this way. Why did Canva make it so easy?" Without CendiaSupervision: one-click face extraction. No friction. No consent check. 8,400 women victimised. With CendiaSupervision: face extraction with abuse prevention. Pattern detection: face-only extractions from unfamiliar photos flagged. Rate limiting. Watermarking. The pipeline is disrupted at step 2.' },
        { agentId: 'bgremove-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Canva + CendiaSupervision Image Safety AI: (1) ABUSE PATTERN DETECTION: CendiaSupervision monitors for NCII pipeline patterns: face-only extractions, multiple different faces extracted by same account, faces from social media screenshots. Pattern match: account flagged, rate-limited, reviewed. (2) INVISIBLE WATERMARKING: All Canva-processed images contain invisible forensic watermarks. If a Canva-extracted face appears in NCII: traceable back to the account that extracted it. Deterrent + evidence for prosecution. (3) RATE LIMITING: Face-only extractions limited to 5/day for free accounts. Bulk face extraction: requires business verification. (4) CONSENT SIGNAL: When face extraction is detected, Canva prompts: "This appears to be someone\'s face. Do you have their consent to use this image?" Not a barrier for legitimate use — but friction for abusers. (5) eSAFETY REPORTING: Automated reporting of suspicious patterns to eSafety Commissioner. Canva becomes part of the solution, not the pipeline.' },
        { agentId: 'esafety-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Abuse pattern detection: active. Watermarking: all processed images. Rate limiting: enforced. NCII pipeline disrupted at step 2. eSafety: "Canva has implemented industry-leading image safety measures." Abusive face extractions: down 89%. 3 perpetrators prosecuted using Canva watermark evidence. For Canva: CendiaSupervision = image safety that protects women and Canva\'s brand. "Canva: creative tools that are safe for everyone" — the message that matters for an inclusive platform.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cv90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cva0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (BG Remover + Abuse detection + Watermarking + Rate limiting)',
        complianceLabel: 'eSafety Status',
        complianceValue: 'NCII PIPELINE DISRUPTED — 89% REDUCTION',
        complianceThreshold: 'Pattern detection, watermarking, rate limiting, consent signal',
        agents: ['Background Remover Agent', 'Online Safety Agent', 'eSafety Commissioner Agent', 'Victim Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Canva — Image Safety Governance',
        guaranteeBody: 'Abuse detection: active. Watermarking: all images. Rate limiting: enforced. NCII pipeline: disrupted 89%. 3 perpetrators prosecuted. eSafety compliant.',
        evidenceChain: 'BG Remover (no protection) → Abuse detection → Watermark → Rate limit → Consent signal → Pipeline disrupted 89% → eSafety compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Canva + CendiaSupervision disrupts the NCII deepfake pipeline — preventing face extraction abuse while preserving legitimate creative use.',
      phaseLabels: ['One-Click Face Extraction & NCII Pipeline', 'eSafety Investigation & 8,400 Victims', 'Abuse Detection & Forensic Watermarking'],
    },
  ],

        complianceScore: 90,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.132Z",
            "type": "analysis",
            "title": "System Assessment - Canva Magic Design — Trademark Replication Crisis",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Canva completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.132Z",
            "type": "warning",
            "title": "Privacy Compliance - Canva Magic Design — Trademark Replication Crisis",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Canva completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.132Z",
            "type": "dissent",
            "title": "Security Risk - Canva Magic Design — Trademark Replication Crisis",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Canva completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.132Z",
            "type": "proposal",
            "title": "Governance Framework - Canva Magic Design — Trademark Replication Crisis",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Canva completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.132Z",
            "type": "resolution",
            "title": "Compliance Certified - Canva Magic Design — Trademark Replication Crisis",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Canva completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]};

export default config;
