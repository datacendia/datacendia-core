# Show HN Post — Hacker News

**Title:**
Show HN: Datacendia – offline-verifiable AI decision audit trails for EU AI Act compliance

**Body:**
I've been building AI governance infrastructure for 18 months, solo. The core problem: enterprises deploying consequential AI (loan approvals, hiring, medical triage) have no way to produce evidence of the decision process that a regulator can independently verify.

Dashboards don't work for this. A regulator doesn't log into your system — they need a file they can open on an air-gapped machine with no trust in you.

So I built: for every AI decision, Datacendia produces a self-contained HTML file containing:
- Full reasoning chain with agent deliberation steps
- Dissenting opinions (any agent can flag concerns anonymously)
- Dual cryptographic signatures (Ed25519 + ML-DSA-65 post-quantum)
- Merkle proof linking to an immutable audit log
- A standalone JavaScript verifier — no dependencies, no internet, no account required

You can verify any receipt by opening a single HTML file. No Datacendia account. No server call.

The EU AI Act enforcement date for High-Risk AI is August 2, 2026. Article 14 requires human oversight audit trails. Article 12 requires operation logging. Most of the enterprises I've talked to are either unaware or using spreadsheets.

Tech stack: TypeScript, PostgreSQL, Redis. Runs self-hosted. Air-gapped deployment supported. Open-source core on GitHub.

GitHub: [link]
Demo receipt: [link]
Docs: [link]

I'm the sole engineer. Distribution is the hard part. Happy to answer technical questions about the cryptographic architecture, the deliberation engine, or anything else.

---

**Posting notes:**
- Post Tuesday or Wednesday morning, 9am EST
- Best performance: Tuesday-Thursday
- Reply to every comment, especially skeptical ones
- Technical questions are good — engage fully
- Don't delete or edit after posting
- The offline verifier is the hook — lead with that in comments
