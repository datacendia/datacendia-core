# Datacendia Pricing & Tier Guide

> Last Updated: March 22, 2026

---

## Open-Core Model

Datacendia uses an **open-core** business model:

- **`datacendia-core`** — Community Edition. Apache 2.0. Free forever. Public GitHub repo.
- **`datacendia-components`** — Enterprise Edition. Commercial license. Private repo. All paid tiers.

Community is the developer acquisition channel: a developer discovers Datacendia on GitHub, deploys it, shows it to their CISO, and the CISO says "we need the real thing." The paid tiers are what every regulated enterprise buys.

---

## Tier Summary

| Tier | Price | Repository | License | Target Buyer |
|------|-------|-----------|---------|-------------|
| **Community** | Free | datacendia-core | Apache 2.0 | Developers, technical evaluators, open-source contributors |
| **Pilot** | $50K/yr | datacendia-components | Commercial | Innovation teams proving the platform to procurement |
| **Foundation** | $150K–$500K/yr | datacendia-components | Commercial | Compliance teams at regulated enterprises |
| **Enterprise** | $500K–$1.5M/yr | datacendia-components | Commercial | CISOs and risk officers at banks, insurers, government |
| **Strategic** | $1.5M+/yr | datacendia-components | Commercial | Nation-scale, defense, air-gapped, multi-org federations |

---

## What Each Tier Actually Sells

### Community (Free)

**A working AI governance platform you can try.** Self-hosted. No SLA. No support. Regex PII. Basic Council. Enough to demo to your CISO.

**Included:**
- CendiaGateway — reverse proxy for cloud AI APIs (OpenAI, Anthropic, Gemini, etc.)
- Browser extensions (Chrome, Firefox, Safari) for AI usage governance
- The Council — multi-agent deliberation with 50+ configurable agents
- PII detection (regex-based, 10 types: SSN, credit card, medical record, etc.)
- Immutable audit ledger with Merkle tree integrity
- Evidence vault — store, export, and verify decision evidence
- Regulator's Receipt — cryptographically signed decision documentation
- CendiaReplay — decision playback theater
- DCII services — Truth, Notary, Witness, Timestamp, Similarity, Memory
- 18+ industry verticals (basic templates, not full compliance engines)
- Service Orchestration Workflow Builder (17 Foundation services)
- DECIDE tools — Chronos, PreMortem, Ghost Board, Decision Debt
- Bridge — workflows, approvals, integrations
- Pulse — real-time metrics and alerts

**Not included:**
- No managed deployment (you host it yourself)
- No SLA, no guaranteed uptime
- No priority support (community GitHub issues only)
- No ML-based PII (regex only)
- No SSO/MFA
- No compliance engines (Basel III, cross-jurisdiction, etc.)
- No COLLAPSE stress testing
- No sovereign/air-gapped features

**Conversion trigger:** The platform works — but their compliance team rejects it for production because there's no SLA, no SSO, no managed updates, and regex-only PII detection.

---

### Pilot ($50K/yr)

**We run it for you.** The first paid tier. Proves the platform works in a real environment before the enterprise commits to a full deployment.

**Everything in Community, plus:**
- Datacendia deploys and manages the platform (customer's IT doesn't touch infrastructure)
- 99.5% SLA — procurement can check the box
- Priority support — 4-hour response time
- Full deliberation engine (not the stub)
- Dedicated onboarding engineer
- 90-day money-back guarantee — no value, no payment

**Who buys this:** An innovation team at a Caja Municipal that got approval for a $50K pilot. They want to show the board it works before committing $150K+.

**Upsell trigger:** Pilot proves the platform works. Foundation adds the compliance depth they actually need for production.

---

### Foundation ($150K–$500K/yr)

**Production compliance.** The tier where regulated enterprises go live. Full compliance engines, ML-based PII, and the evidence depth that auditors require.

**Everything in Pilot, plus:**
- Full compliance engines — Basel III, EU AI Act, cross-jurisdiction, continuous monitoring
- ML-based PII detection (Microsoft Presidio) — 40+ entity types, configurable
- Echo — automated outcome collection and audit replay
- Gnosis — predictive decision analytics
- OmniTranslate — 26 languages for multi-jurisdiction compliance
- Expanded industry verticals — full decision schemas, 12+ agents per vertical
- Advanced evidence — forensic-grade evidence packets with chain-of-custody
- Gap Scanner — compliance gap analysis across 8+ regulatory frameworks
- Regulatory Sandbox — test compliance posture before deployment

**Who buys this:** A compliance officer at a bank that passed the Pilot and now needs Basel III mapping, ML PII detection, and Echo audit replay for the regulator.

**Upsell trigger:** They need stress testing, sovereign deployment, or advanced security (SSO, SIEM, ZK proofs).

---

### Enterprise ($500K–$1.5M/yr)

**Advanced risk.** COLLAPSE stress testing, adversarial red team, sovereign LLM providers, and enterprise security infrastructure.

**Everything in Foundation, plus:**
- COLLAPSE — stress testing with 12 adversarial agents, Monte Carlo simulations
- Shadow Council — secondary adversarial council that challenges the primary
- CendiaRedTeam — 6-vector adversarial analysis
- Sovereign LLM providers — Ollama, NIM, Triton (no cloud dependency)
- Sovereign online toggle — `DATACENDIA_ONLINE_MODE=false` disables all cloud services
- SSO/MFA (Keycloak integration)
- SIEM integration (Splunk, Microsoft Sentinel, IBM QRadar, Elastic)
- Zero-Knowledge Proofs — prove compliance without revealing data
- Multi-tenant deployment — isolated organizations on shared infrastructure
- Constitutional Court — governance oversight engine
- Decision DNA — decision pattern analysis
- Advanced licensing and escrow (Shamir secret sharing)

**Who buys this:** A CISO at an insurer who needs COLLAPSE to stress-test decisions before they go live, plus SSO for 500 users and SIEM integration for their SOC.

**Upsell trigger:** They need air-gapped deployment, data diode, federated mesh, or defense-grade security.

---

### Strategic ($1.5M+/yr)

**Nation-scale.** Air-gapped, defense-grade, federated mesh deployments for government, military, and critical infrastructure.

**Everything in Enterprise, plus:**
- Air-gapped deployment — fully offline, no internet dependency
- Data diode — hardware-enforced one-way data flow
- TPM attestation — hardware-rooted trust verification
- Federated mesh — multi-organization governance with shared policies
- Post-quantum cryptography — Dilithium, SPHINCS+ support
- Portable instances — deploy to disconnected environments (ships, bases, remote sites)
- CendiaBlackBox — tamper-proof evidence storage with hardware attestation
- CendiaMirage — deception-based threat detection
- Nation-scale deployment support — custom SLA, dedicated team
- Startup validation gate — system refuses to start in offline mode unless all local providers are configured and reachable (audit artifact)

**Who buys this:** A defense ministry that needs air-gapped deployment in a SCIF with data diode, TPM attestation, and post-quantum crypto. Or a central bank regulator deploying across 12 member institutions via federated mesh.

---

## Sovereign Online Toggle

Enterprise and Strategic tiers support the **sovereign online toggle** — a master environment variable that disables all cloud AI and external services:

```
DATACENDIA_ONLINE_MODE=true|false        # Master toggle
DATACENDIA_CLOUD_AI=true|false           # Cloud AI providers specifically
DATACENDIA_CLOUD_AI_FALLBACK=error|local # Fallback when cloud AI is invoked while disabled
DATACENDIA_EXTERNAL_DATA=true|false      # External data feeds (FRED, etc.)
DATACENDIA_EXTERNAL_NOTIFY=true|false    # External notifications (email, webhook, SIEM)
```

When `DATACENDIA_ONLINE_MODE=false`:
- Cloud AI providers → hard error (default) or silent local fallback (configurable)
- External data feeds → uses cached/local datasets
- External notifications → internal event bus only
- System validates at startup that local LLM providers are configured

The passing startup validation is itself an **audit artifact** — the deployment manifest proves exactly which models are in use.

See [TIER-MAPPING.md](../TIER-MAPPING.md) for the complete sovereign toggle specification.

---

## Service Counts by Tier

| Tier | Unique Services | What They Are |
|------|----------------|--------------|
| **Community** | ~180 | Broad base: gateway, proxy, Council, PII, evidence, 18 verticals, infrastructure |
| **Pilot** | +15 | Managed platform services, full deliberation, support tooling |
| **Foundation** | +40 | Compliance engines, ML PII, Echo/Gnosis, expanded verticals, OmniTranslate |
| **Enterprise** | +70 | COLLAPSE, Shadow Council, SSO, SIEM, ZK proofs, sovereign providers, multi-tenant |
| **Strategic** | +66 | Air-gapped, data diode, TPM, federated mesh, post-quantum, portable instances |

> **Note:** Community has ~180 services because it's breadth without depth. The paid tiers add the production-readiness, compliance depth, and guarantees that regulated enterprises need. No regulated enterprise ships Community to production. See [TIER-MAPPING.md](../TIER-MAPPING.md) § "What Each Tier Actually Sells" for the full explanation.

---

## Contact

- **Enterprise sales:** [enterprise@datacendia.com](mailto:enterprise@datacendia.com)
- **Website:** [datacendia.com](https://datacendia.com)
- **Community:** [GitHub Issues](https://github.com/datacendia/datacendia-core/issues)
