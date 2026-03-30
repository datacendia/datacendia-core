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
  ],
};

export default config;
