# Product Maturity Taxonomy

**Owner:** Engineering  
**Last Updated:** March 2026  
**Applies to:** All Datacendia repos (core, components, marketing, DGI)

## Purpose

Every feature, service, module, and public claim must carry a maturity label from this taxonomy. This prevents ambiguity about what is production-ready vs. conceptual, and ensures marketing, docs, and code use consistent language.

## Maturity Levels

| Level | Label | Meaning | Can be marketed? |
|-------|-------|---------|------------------|
| **1** | `conceptual` | Described in docs/specs only. No implementation exists. | No — must say "planned" or "roadmap" |
| **2** | `demo` | Interactive demo or prototype exists. Not connected to real backend services. | Only as "interactive demo" |
| **3** | `preview` | Implementation exists but is incomplete, untested, or behind a feature flag. | Only with "preview" or "early access" qualifier |
| **4** | `beta` | Feature is functional and tested but not yet hardened for production. May have known limitations. | With "beta" qualifier |
| **5** | `GA` | Generally Available. Production-tested, documented, supported. | Yes — no qualifier needed |

## How to Apply

### In Code

Add a `@maturity` JSDoc tag or a `MATURITY` constant:

```typescript
/**
 * CendiaCrucible — Adversarial stress testing
 * @maturity beta
 */
```

Or in a service file:

```typescript
export const SERVICE_MATURITY = 'beta' as const;
```

### In Documentation

Add maturity to any feature table or service description:

```markdown
| Feature | Maturity | Notes |
|---------|----------|-------|
| Council deliberation | GA | Core engine, fully tested |
| Ghost Board | beta | Functional, limited vertical coverage |
| Quantum KMS | preview | Dilithium signing implemented, SPHINCS+ planned |
```

### In Marketing / Trust Center

| Maturity | Acceptable marketing language |
|----------|-------------------------------|
| `conceptual` | "Planned" / "Roadmap" / "Coming soon (target date)" |
| `demo` | "See it in action" / "Interactive demo" |
| `preview` | "Early access" / "Preview available" |
| `beta` | "Available in beta" / "Beta — feedback welcome" |
| `GA` | Full claims permitted |

**Never** use unqualified present-tense capability language ("does X", "provides Y") for features below GA unless the maturity is disclosed.

### In Framework / Standards Docs (DGI)

| Document type | Status label |
|---------------|-------------|
| Normative specification | `candidate` / `normative` |
| Reference implementation | `informative` / `reference` |
| Gap analysis | `informative` |
| Example / tutorial | `informative` |

## Cross-Repo Application

| Repo | Primary maturity scope |
|------|----------------------|
| `datacendia-core` | Community features: label each service/page/route |
| `datacendia-components` | Enterprise features: label each enterprise service |
| `datacendia-marketing` | Marketing claims: must reflect maturity of underlying feature |
| `decision-governance-infrastructure` | Framework docs: use document status labels |

## Review Process

1. **New features**: Must declare maturity level at PR time
2. **Promotions**: Moving from preview → beta → GA requires test evidence
3. **Marketing sync**: Before publishing claims about a feature, verify its current maturity level
4. **Quarterly audit**: Review all features at GA and confirm they still meet the bar
