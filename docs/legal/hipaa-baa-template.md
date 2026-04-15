# HIPAA Business Associate Agreement (BAA)
**Template — Fill in bracketed fields before execution**
**Legal Review Required Before Use**

---

## BUSINESS ASSOCIATE AGREEMENT

This Business Associate Agreement ("Agreement") is entered into as of **[DATE]** ("Effective Date") between:

**Covered Entity:** [CUSTOMER LEGAL NAME], a [STATE/COUNTRY] [entity type] ("Covered Entity")

**Business Associate:** Datacendia, LLC, a Delaware limited liability company ("Business Associate" or "Datacendia")

This Agreement is incorporated into and made part of the Master Services Agreement or Terms of Service between the parties dated **[MSA DATE]** ("Underlying Agreement").

---

## RECITALS

WHEREAS, Business Associate provides AI governance, decision intelligence, and compliance platform services to Covered Entity ("Services");

WHEREAS, in connection with such Services, Business Associate may receive, create, maintain, transmit, or otherwise process Protected Health Information ("PHI") on behalf of Covered Entity;

WHEREAS, the parties desire to comply with the Health Insurance Portability and Accountability Act of 1996 ("HIPAA"), the Health Information Technology for Economic and Clinical Health Act ("HITECH"), and implementing regulations at 45 C.F.R. Parts 160 and 164 (collectively, "HIPAA Rules");

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein, the parties agree as follows:

---

## ARTICLE 1 — DEFINITIONS

Terms used but not otherwise defined in this Agreement shall have the meanings given in the HIPAA Rules.

1.1 **"Breach"** has the meaning given in 45 C.F.R. §164.402.

1.2 **"Business Associate"** has the meaning given in 45 C.F.R. §160.103.

1.3 **"Covered Entity"** has the meaning given in 45 C.F.R. §160.103.

1.4 **"De-Identified Information"** means health information that meets the standard and implementation specifications for de-identification set forth at 45 C.F.R. §164.514(a)-(c).

1.5 **"Electronic Protected Health Information" or "ePHI"** has the meaning given in 45 C.F.R. §160.103.

1.6 **"Protected Health Information" or "PHI"** has the meaning given in 45 C.F.R. §160.103, limited to information that Business Associate creates, receives, maintains, or transmits on behalf of Covered Entity.

1.7 **"Required By Law"** has the meaning given in 45 C.F.R. §164.103.

1.8 **"Security Incident"** has the meaning given in 45 C.F.R. §164.304.

1.9 **"Subcontractor"** has the meaning given in 45 C.F.R. §160.103.

---

## ARTICLE 2 — OBLIGATIONS OF BUSINESS ASSOCIATE

2.1 **Permitted Uses and Disclosures.** Business Associate may use or disclose PHI only:
   (a) As necessary to perform the Services described in the Underlying Agreement;
   (b) As Required By Law;
   (c) For the proper management and administration of Business Associate; or
   (d) As otherwise permitted or required by this Agreement.

2.2 **Prohibited Uses and Disclosures.** Business Associate shall not:
   (a) Use or disclose PHI in a manner that would violate the HIPAA Rules if done by Covered Entity;
   (b) Sell PHI;
   (c) Use PHI for marketing purposes without authorisation;
   (d) Use PHI for any purpose other than the Services.

2.3 **Minimum Necessary.** Business Associate shall make reasonable efforts to use, disclose, or request only the minimum amount of PHI necessary to accomplish the intended purpose, in accordance with 45 C.F.R. §164.514(d).

2.4 **Safeguards.** Business Associate shall implement and maintain appropriate administrative, physical, and technical safeguards to protect PHI, including:
   (a) AES-256-GCM encryption for PHI at rest;
   (b) TLS 1.2+ for PHI in transit;
   (c) Role-based access controls limiting PHI access to authorised personnel;
   (d) Audit logging of all PHI access;
   (e) HIPAA §164.514(b) Safe Harbor de-identification before PHI is processed by AI components.

2.5 **Subcontractors.** Business Associate shall ensure that any Subcontractor that creates, receives, maintains, or transmits PHI on behalf of Business Associate agrees to the same restrictions and conditions as those that apply to Business Associate under this Agreement.

   Current Subcontractors that may process PHI:
   - **Neon** (database hosting) — DPA in place
   - **Railway** (application hosting) — DPA in place
   - **OpenAI** (AI inference, if enabled) — DPA in place; PHI is de-identified before transmission

2.6 **Reporting.** Business Associate shall:
   (a) Report to Covered Entity any use or disclosure of PHI not provided for by this Agreement within **five (5) business days** of discovery;
   (b) Report any Breach of Unsecured PHI to Covered Entity without unreasonable delay and no later than **60 calendar days** after discovery, in accordance with 45 C.F.R. §164.410;
   (c) Report any Security Incident of which it becomes aware.

2.7 **Access to PHI.** Within **30 days** of a written request by Covered Entity, Business Associate shall make available PHI in a Designated Record Set to Covered Entity or, as directed, to an Individual, in accordance with 45 C.F.R. §164.524.

2.8 **Amendment.** Business Associate shall make PHI available for amendment and incorporate any amendments to PHI in accordance with 45 C.F.R. §164.526.

2.9 **Accounting of Disclosures.** Business Associate shall document disclosures of PHI and provide an accounting of such disclosures as required by 45 C.F.R. §164.528.

2.10 **Access by HHS.** Business Associate shall make its internal practices, books, and records relating to the use and disclosure of PHI available to the Secretary of HHS for the purpose of determining Covered Entity's compliance with the HIPAA Rules.

---

## ARTICLE 3 — OBLIGATIONS OF COVERED ENTITY

3.1 Covered Entity shall notify Business Associate of any limitations in Covered Entity's Notice of Privacy Practices that may affect Business Associate's use or disclosure of PHI.

3.2 Covered Entity shall notify Business Associate of any changes in, or revocation of, permission by an Individual to use or disclose PHI.

3.3 Covered Entity shall not request Business Associate to use or disclose PHI in any manner that would not be permissible under the HIPAA Rules if done by Covered Entity.

3.4 Covered Entity is responsible for ensuring that its users properly classify data as PHI before inputting it into the Datacendia platform.

---

## ARTICLE 4 — TERM AND TERMINATION

4.1 **Term.** This Agreement shall be effective as of the Effective Date and shall remain in effect until terminated in accordance with this Article or upon termination of the Underlying Agreement.

4.2 **Termination for Cause.** Either party may terminate this Agreement upon 30 days' written notice if the other party has materially breached a provision of this Agreement and failed to cure the breach within the notice period.

4.3 **Effect of Termination.** Upon termination:
   (a) Business Associate shall, at the election of Covered Entity, return or destroy all PHI received from or created on behalf of Covered Entity. If return or destruction is not feasible, Business Associate shall extend the protections of this Agreement to the PHI and limit further uses and disclosures;
   (b) This requirement to return or destroy PHI shall apply to PHI in the possession of Subcontractors.

4.4 **Survival.** The obligations under this Agreement shall survive the termination of the Underlying Agreement with respect to PHI retained by Business Associate.

---

## ARTICLE 5 — GENERAL PROVISIONS

5.1 **Amendment.** This Agreement may not be amended except by a written instrument signed by authorised representatives of both parties.

5.2 **Interpretation.** This Agreement shall be interpreted as broadly as necessary to implement and comply with the HIPAA Rules. Any ambiguity shall be resolved in favour of a meaning that complies with the HIPAA Rules.

5.3 **No Third-Party Beneficiaries.** Nothing in this Agreement shall confer any rights or remedies upon any person or entity other than the parties and their respective successors and permitted assigns.

5.4 **Governing Law.** This Agreement shall be governed by the laws of the State of Delaware, without regard to conflicts of law principles.

5.5 **Entire Agreement.** This Agreement, together with the Underlying Agreement, constitutes the entire agreement between the parties with respect to the subject matter hereof.

---

## SIGNATURES

**COVERED ENTITY**

Signature: ___________________________
Name: ___________________________
Title: ___________________________
Date: ___________________________
Organisation: ___________________________

**BUSINESS ASSOCIATE — Datacendia, LLC**

Signature: ___________________________
Name: ___________________________
Title: ___________________________
Date: ___________________________

---

*This template was prepared for internal use by Datacendia, LLC. It must be reviewed by qualified legal counsel before execution with any customer. Datacendia, LLC makes no representation that this template constitutes legal advice or is suitable for any particular purpose.*

*References: 45 C.F.R. §§ 160.103, 164.103, 164.304, 164.308, 164.312, 164.402, 164.410, 164.504(e), 164.514, 164.524, 164.526, 164.528*
