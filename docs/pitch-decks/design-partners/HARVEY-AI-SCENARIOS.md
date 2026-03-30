# Harvey AI × Datacendia: AI Governance Scenarios

## Company Profile
- **Company:** Harvey AI (backed by Sequoia Capital, OpenAI Startup Fund)
- **Products:** Harvey (generative legal AI platform)
- **Market:** Pure-play legal AI startup — no research database, purely generative
- **AI Products:** Harvey Assistant (legal research, drafting, analysis), Harvey for Litigation, Harvey for Transactions
- **Customers:** Elite law firms (Allen & Overy/A&O Shearman, Ashurst, Macfarlanes, PwC Legal)
- **Funding:** $200M+ raised, $1.5B+ valuation
- **Datacendia Relevance:** Even MORE in need of supervision evidence — no Westlaw/Shepard's verification backbone. Harvey has no proprietary legal database to cross-check against.

## Dream Team Thesis
Harvey is the most vulnerable legal AI to the ABA 512 supervision gap. Unlike Thomson Reuters (Westlaw) and LexisNexis (Shepard's), Harvey has NO proprietary legal database for verification. It relies entirely on LLM output. Every Harvey output is an unchecked AI generation. Datacendia is Harvey's verification layer.

---

## SECTION A: Elite Law Firm Practice (Scenarios 1–30)

### Scenario 1: Harvey Research — No Verification Backbone
**Decision Type:** Litigation
**Harvey's Problem:** A Magic Circle associate uses Harvey to research English contract law for an international arbitration. Harvey generates a persuasive analysis citing 5 English cases. Unlike CoCounsel (backed by Westlaw) or Lexis+ AI (backed by Shepard's), Harvey has NO proprietary case database to verify against. Two citations are AI hallucinations — cases that don't exist. The associate, trusting Harvey's confident output, includes them in the arbitral submission.
**Datacendia's Solution:** Research supervision: every Harvey citation verified against external legal databases, existence confirmed, holding validated, supervising solicitor sign-off. Evidence for tribunal and SRA.
**Applicable Regulations:** ABA Opinion 512, SRA Code of Conduct, ICC Rules, Model Rules 1.1, 3.3

### Scenario 2: Harvey Drafting — Contract Clause Hallucination
**Decision Type:** Transactional
**Harvey's Problem:** Harvey generates a force majeure clause for a $500M LNG supply agreement. The clause includes language that Harvey "learned" from training data but that doesn't reflect the parties' commercial intent or the governing law (English law). The clause references "frustration of purpose" — a US doctrine that doesn't exist in English law in the same form. The clause is unenforceable.
**Datacendia's Solution:** Drafting supervision: every Harvey-generated clause verified for governing law compatibility, legal doctrine confirmed per jurisdiction, transactional counsel sign-off. Evidence for malpractice defence.
**Applicable Regulations:** SRA Code, ABA Opinion 512, governing law principles

### Scenario 3: Harvey Analysis — Regulatory Advice Without Database
**Decision Type:** Regulatory
**Harvey's Problem:** Harvey analyses EU merger control filing requirements. Without a regulatory database, Harvey generates filing thresholds from training data that are 18 months out of date — the EU changed the turnover thresholds. The client proceeds without filing. The Commission investigates for gun-jumping.
**Datacendia's Solution:** Regulatory supervision: Harvey output verified against current regulatory databases, filing thresholds confirmed, regulatory counsel sign-off with timestamp. Evidence for Commission response.
**Applicable Regulations:** EU Merger Regulation, ABA Opinion 512, SRA Code

### Scenario 4: Harvey for Litigation — Case Theory Generation
**Decision Type:** Litigation
**Harvey's Problem:** Harvey generates 3 potential case theories for a securities class action. Theory 2 is creative but legally unfounded — it relies on a circuit split that was resolved 4 years ago by the Supreme Court. Harvey's training data predates the resolution. The litigation team spends 200 hours developing the theory before discovering it's foreclosed.
**Datacendia's Solution:** Case theory supervision: Harvey theories verified against current appellate landscape, circuit split status confirmed, Supreme Court developments checked, litigation counsel sign-off. Evidence for case management.
**Applicable Regulations:** ABA Opinion 512, FRCP, PSLRA

### Scenario 5: Harvey Due Diligence — No Contract Database
**Decision Type:** Transactional
**Harvey's Problem:** Harvey reviews 1,800 contracts in an M&A data room. Unlike CoCounsel (which has Westlaw's contract database for comparison), Harvey analyses contracts purely through LLM comprehension. Harvey misses a complex earn-out provision because the language doesn't match patterns in its training data. Post-closing, the earn-out triggers $23M in unexpected payments.
**Datacendia's Solution:** Due diligence supervision: Harvey contract review with statistical QC sampling, pattern detection verified, material provisions flagged, deal counsel sign-off per category. Evidence for earn-out dispute.
**Applicable Regulations:** ABA Opinion 512, corporate governance, R&W insurance standards

### Scenario 6: Harvey — Attorney Ethics Across Jurisdictions
**Decision Type:** Ethics
**Harvey's Problem:** Harvey is deployed to attorneys in the US (ABA), UK (SRA), and Australia (Legal Services Board) simultaneously. Each jurisdiction has different AI supervision requirements. Harvey's platform provides no jurisdiction-specific governance — it treats all attorneys identically.
**Datacendia's Solution:** Multi-jurisdiction supervision: CendiaSupervision maps each attorney's jurisdiction, applies the correct supervision standard (ABA 512, SRA Code, Australian Solicitors' Conduct Rules), and generates jurisdiction-specific evidence bundles from one Harvey session.
**Applicable Regulations:** ABA Opinion 512, SRA Code, Australian Solicitors' Conduct Rules

### Scenario 7: Harvey — Confidentiality & Data Leakage
**Decision Type:** Ethics
**Harvey's Problem:** Harvey processes client-confidential information through its AI model. A partner asks Harvey to analyse a merger agreement for Client A. Harvey's response includes language patterns that reflect a similar agreement Harvey processed for Client B (a competitor). The information barrier has been breached by the AI's training on client data.
**Datacendia's Solution:** Confidentiality supervision: Harvey sessions isolated, data provenance documented, ethical wall compliance confirmed, client matter separation verified. Evidence for bar complaint defence.
**Applicable Regulations:** Model Rules 1.6, 1.9, ABA Opinion 512, SRA Principle 6

### Scenario 8: Harvey — Billing for AI-Assisted Work
**Decision Type:** Ethics
**Harvey's Problem:** An associate uses Harvey for 2 hours to produce work that would have taken 8 hours manually. The partner bills 8 hours. The client's legal spend AI (CounselLink) flags the discrepancy. The firm faces a fee dispute and bar complaint for excessive billing.
**Datacendia's Solution:** Billing supervision: Harvey usage time documented, AI assistance scope recorded, billing adjustment methodology documented, billing partner sign-off. Evidence for fee dispute and bar inquiry.
**Applicable Regulations:** Model Rule 1.5, ABA Opinion 512, client billing guidelines

### Scenario 9: Harvey — Junior Associate Development
**Decision Type:** Firm Management
**Harvey's Problem:** Junior associates use Harvey for research and drafting, skipping the learning process. After 2 years, they cannot perform legal research without AI assistance. The firm discovers the competence gap when Harvey goes offline for maintenance and the associates cannot produce work independently.
**Datacendia's Solution:** Development supervision: Harvey usage tracked per attorney, competence metrics documented, training milestones verified, supervising partner sign-off on development plan. Evidence for competence assessment.
**Applicable Regulations:** Model Rule 1.1, ABA Opinion 512, firm competence standards

### Scenario 10: Harvey — Cross-Border Privilege
**Decision Type:** International
**Harvey's Problem:** Harvey processes privileged communications in a cross-border investigation. The privilege rules differ: US attorney-client privilege, UK legal professional privilege, and EU legal privilege (in-house counsel not always privileged). Harvey's output mixes privileged and non-privileged analysis without jurisdiction-specific privilege marking. Production to a regulator inadvertently includes privileged material.
**Datacendia's Solution:** Privilege supervision: Harvey output reviewed for privilege per jurisdiction, privilege markers applied per applicable law, production set certified by counsel per jurisdiction. Evidence for privilege waiver defence.
**Applicable Regulations:** FRE 502, UK legal privilege, EU privilege rules, ABA Opinion 512

### Scenario 11: Harvey — Regulatory Filing Accuracy
**Decision Type:** Regulatory
**Harvey's Problem:** Harvey assists in drafting an SEC Form S-1 registration statement. The AI generates risk factors that are materially incomplete — missing a key cybersecurity risk that the SEC specifically requires post-2023 rule. The S-1 is filed. SEC issues a comment letter. IPO timeline delayed 6 weeks.
**Datacendia's Solution:** Filing supervision: Harvey draft reviewed against current SEC requirements, risk factor completeness verified, securities counsel sign-off. Evidence for SEC comment response.
**Applicable Regulations:** Securities Act, SEC Regulation S-K, cybersecurity disclosure rules, ABA Opinion 512

### Scenario 12: Harvey — Employment Advice Jurisdiction Error
**Decision Type:** Employment
**Harvey's Problem:** Harvey advises a multinational client on employee termination procedures. The AI applies US at-will employment principles to a UK employee, where unfair dismissal protections apply after 2 years of service. The employee is terminated without process. Employment tribunal claim follows.
**Datacendia's Solution:** Employment supervision: Harvey jurisdiction identification verified, applicable employment law confirmed per jurisdiction, local counsel review documented. Evidence for tribunal defence.
**Applicable Regulations:** UK Employment Rights Act, ABA Opinion 512, SRA Code

### Scenario 13: Harvey — Tax Structure Analysis
**Decision Type:** Tax
**Harvey's Problem:** Harvey analyses a cross-border tax structure. Without a tax database (like Checkpoint or CCH), Harvey generates transfer pricing analysis from training data that doesn't reflect the current OECD Pillar Two rules. The structure creates $18M in unintended top-up tax liability.
**Datacendia's Solution:** Tax supervision: Harvey analysis verified against current OECD/tax authority guidance, transfer pricing methodology confirmed, tax counsel sign-off. Evidence for tax authority examination.
**Applicable Regulations:** OECD Pillar Two, IRC §482, Circular 230

### Scenario 14: Harvey — Sanctions Screening Without Database
**Decision Type:** Compliance
**Harvey's Problem:** Harvey is asked to screen a transaction counterparty for sanctions risk. Unlike World-Check (Thomson Reuters), Harvey has no sanctions database. Harvey generates a response based on training data that doesn't include sanctions designations made in the last 12 months. The counterparty was designated 6 months ago. OFAC strict liability applies.
**Datacendia's Solution:** Sanctions supervision: Harvey screening supplemented with current OFAC/EU sanctions databases, designation status confirmed, compliance officer sign-off. Evidence for OFAC defence.
**Applicable Regulations:** IEEPA, OFAC regulations, EU sanctions, ABA Opinion 512

### Scenario 15: Harvey — Intellectual Property Freedom-to-Operate
**Decision Type:** IP
**Harvey's Problem:** Harvey conducts a freedom-to-operate analysis for a biotech product. Without a patent database, Harvey's analysis misses 3 continuation patents in a family tree that narrow the FTO. The client launches the product. Patent holder sues. Preliminary injunction granted. Revenue loss: $40M.
**Datacendia's Solution:** IP supervision: Harvey FTO supplemented with patent database search, claim chart verified, family tree completeness confirmed, patent counsel sign-off. Evidence for infringement defence.
**Applicable Regulations:** Patent Act, 35 USC §271, ABA Opinion 512

### Scenario 16: Harvey — Arbitration Brief Drafting
**Decision Type:** International
**Harvey's Problem:** Harvey drafts a memorial for an LCIA arbitration. The AI applies ICC procedural rules instead of LCIA rules — confusing the two institutions. The procedural section of the memorial is incorrect. The tribunal raises the error. Counsel's credibility is damaged.
**Datacendia's Solution:** Arbitration supervision: Harvey procedural analysis verified per institution, applicable rules confirmed, arbitration counsel sign-off. Evidence for tribunal.
**Applicable Regulations:** LCIA Rules, ICC Rules, ABA Opinion 512, SRA Code

### Scenario 17: Harvey — Data Protection Impact Assessment
**Decision Type:** Privacy
**Harvey's Problem:** Harvey assists in preparing a DPIA under GDPR Article 35. The AI misidentifies the processing as "low risk" when it involves large-scale processing of special category data (health data). The DPIA is inadequate. The DPA investigates and finds the controller failed to conduct a proper DPIA. Fine: €2.8M.
**Datacendia's Solution:** Privacy supervision: Harvey DPIA reviewed, processing risk classification confirmed, special category data identified, DPO sign-off. Evidence for DPA investigation.
**Applicable Regulations:** GDPR Articles 35-36, EDPB guidelines, ABA Opinion 512

### Scenario 18: Harvey — Competition Law Advice
**Decision Type:** Antitrust
**Harvey's Problem:** Harvey advises on information exchange between competitors in a trade association. The AI incorrectly classifies the exchange as permissible "benchmarking" when the information is sufficiently granular and current to facilitate coordination. The CMA investigates. The advice is the only documentation of the legal analysis.
**Datacendia's Solution:** Competition supervision: Harvey advice reviewed, information exchange classification confirmed, safe harbour applicability verified, antitrust counsel sign-off. Evidence for CMA investigation.
**Applicable Regulations:** Competition Act 1998, EU TFEU Article 101, ABA Opinion 512

### Scenario 19: Harvey — Real Estate Transaction
**Decision Type:** Real Estate
**Harvey's Problem:** Harvey reviews a commercial lease and misses a break clause conditional on 6 months' prior written notice. The tenant (Harvey's client) attempts to break the lease with 3 months' notice. The landlord refuses. The tenant is locked into 5 more years. Liability: £4.2M.
**Datacendia's Solution:** Real estate supervision: Harvey lease review confirmed, break clause conditions identified, notice requirements flagged, property counsel sign-off. Evidence for lease dispute.
**Applicable Regulations:** UK Landlord and Tenant Act, ABA Opinion 512

### Scenario 20: Harvey — Insolvency Advice
**Decision Type:** Insolvency
**Harvey's Problem:** Harvey advises directors on their duties when the company approaches insolvency. The AI applies UK wrongful trading standards (Companies Act 2006 s214) but misidentifies the point at which the duty shifts from shareholders to creditors. The directors continue trading too long. Personal liability follows.
**Datacendia's Solution:** Insolvency supervision: Harvey director duty analysis reviewed, insolvency trigger point confirmed, creditor duty analysis verified, insolvency counsel sign-off. Evidence for wrongful trading defence.
**Applicable Regulations:** Companies Act 2006, Insolvency Act 1986, ABA Opinion 512

### Scenarios 21–30: [Extended Elite Practice Scenarios]

*(Covering: Banking & finance documentation; Structured finance; Project finance; Capital markets — IPO; Derivatives — ISDA; Fund formation; Private equity; Venture capital; Restructuring; Energy & natural resources)*

---

## SECTION B: Compliance & Risk (Scenarios 31–50)

### Scenario 31: Harvey — AML/KYC Compliance
**Decision Type:** Compliance
**Harvey's Problem:** Harvey assists in AML risk assessment without access to PEP databases or sanctions lists. The assessment is based entirely on publicly available information in Harvey's training data. A PEP connection is missed. SAR not filed. FinCEN/FCA investigates.
**Datacendia's Solution:** AML supervision: Harvey assessment supplemented with current PEP/sanctions databases, risk rating confirmed, MLRO sign-off. Evidence for regulatory investigation.
**Applicable Regulations:** BSA/AML, UK POCA, EU AMLD, ABA Opinion 512

### Scenario 32: Harvey — ESG Reporting
**Decision Type:** Corporate
**Harvey's Problem:** Harvey generates ESG disclosures using TCFD framework instead of the newer ISSB/IFRS S2 standard. European institutional investors flag non-compliance. The company's ESG rating is downgraded. Cost of capital increases.
**Datacendia's Solution:** ESG supervision: Harvey disclosure framework confirmed, ISSB requirements verified, sustainability counsel sign-off. Evidence for investor relations.
**Applicable Regulations:** ISSB/IFRS S2, EU CSRD, SEC climate rules

### Scenario 33: Harvey — FCPA Risk Assessment
**Decision Type:** Compliance
**Harvey's Problem:** Harvey assesses FCPA risk for a joint venture in Brazil. Without access to enforcement databases or compliance databases, Harvey underestimates the risk. The JV partner has a prior FCPA resolution that Harvey's training data doesn't include. DOJ/SEC investigates.
**Datacendia's Solution:** FCPA supervision: Harvey assessment supplemented with enforcement database search, prior resolutions identified, compliance officer sign-off. Evidence for DOJ cooperation.
**Applicable Regulations:** FCPA, DOJ FCPA Corporate Enforcement Policy, ABA Opinion 512

### Scenario 34: Harvey — Cyber Incident Response
**Decision Type:** Privacy
**Harvey's Problem:** Harvey assists incident response counsel in determining notification obligations after a data breach. The AI misidentifies notification deadlines across 5 states, using outdated timelines. Three states changed their notification windows in 2025. Notifications are late. AG enforcement actions follow.
**Datacendia's Solution:** Cyber supervision: Harvey notification analysis verified per state, current deadlines confirmed, IR counsel sign-off with timeline documentation. Evidence for AG defence.
**Applicable Regulations:** State breach notification laws, SEC cyber disclosure rules, ABA Opinion 512

### Scenario 35: Harvey — Export Controls
**Decision Type:** Compliance
**Harvey's Problem:** Harvey analyses export control classification for dual-use technology. Without access to the Commerce Control List database, Harvey misclassifies the product as EAR99 when it's actually ECCN 3E001. Unlicensed exports proceed. BIS investigates.
**Datacendia's Solution:** Export supervision: Harvey classification supplemented with current CCL database, ECCN confirmed, export control counsel sign-off. Evidence for BIS defence.
**Applicable Regulations:** EAR, ITAR, BIS enforcement, ABA Opinion 512

### Scenarios 36–50: [Extended Compliance Scenarios]

*(Covering: Healthcare compliance; Environmental regulatory; Consumer protection; Financial services regulation; Insurance regulatory; Telecommunications regulation; Government contracts compliance; Trade compliance; Tax compliance; Product safety; Workplace safety; Equal employment; Accessibility compliance; Advertising compliance; Food & drug regulatory)*

---

*200 scenarios available on request. Full architecture document covers Harvey's unique vulnerability: no proprietary legal database means every Harvey output is an unchecked AI generation requiring external verification.*
