# PCI DSS v4.0 — Scoping Assessment
**Payment Card Industry Data Security Standard v4.0 (March 2022)**
**Document Owner:** Engineering Lead
**Version:** 1.0 | April 2026

---

## Scoping Question

**Does Datacendia store, process, or transmit cardholder data (CHD) or sensitive authentication data (SAD)?**

### Cardholder Data (CHD) includes:
- Primary Account Number (PAN)
- Cardholder name
- Expiration date
- Service code

### Sensitive Authentication Data (SAD) includes:
- Full magnetic stripe data
- CAV2/CVC2/CVV2/CID
- PINs / PIN blocks

---

## Assessment Result: **OUT OF SCOPE (Current State)**

Datacendia **does not** directly store, process, or transmit payment card data in its platform.

| Question | Answer | Evidence |
|---|---|---|
| Does the platform accept payment card payments? | No — billing handled entirely by third-party | No payment fields in codebase |
| Does the platform store PANs or CHD? | No | No payment-related database tables |
| Does the platform transmit CHD between systems? | No | No payment flows in API routes |
| Do any AI deliberation inputs contain CHD? | Potentially (customer-provided data) | PHI de-identification covers credit card patterns in `PHIDeIdentificationService.ts` |

### Current Billing Arrangement
Datacendia's customer billing (if applicable) is handled entirely by a third-party payment processor (e.g., Stripe). Datacendia never receives or touches raw card numbers.

**Implication:** Datacendia qualifies for **SAQ-A** (Merchants that have fully outsourced all cardholder data functions to third parties) or may be considered **out of scope** entirely if no card-present transactions exist.

---

## SAQ-A Compliance Requirements (if billing exists)

If Datacendia uses Stripe or another PCI-compliant payment processor via hosted payment pages:

| PCI DSS v4.0 Requirement | SAQ-A Applicability | Status |
|---|---|---|
| Req 2: Security configurations | Network/system security — applies to all systems | ✅ Covered by ISO 27001 controls |
| Req 6: Secure systems | Develop and maintain secure systems | ✅ SDLC; input validation; dependency management |
| Req 8: Identify and authenticate | Strong authentication for all access | ✅ MFA; bcrypt; JWT |
| Req 9: Physical security | Physical access controls (outsourced) | ✅ Delegated to Railway/Neon |
| Req 12: Policies | Information security policies | ✅ Policies in `docs/policies/` |
| SAQ-A specific: Confirm payment page is fully hosted by PCI-validated third party | | 📋 Confirm with payment processor |

---

## AI Content Cardholder Data Risk

Even though Datacendia is out of PCI scope for its own billing, **customers may inadvertently include CHD in AI deliberation prompts**. The existing PHI de-identification service already removes credit card patterns:

```ts
// PHIDeIdentificationService.ts already covers:
{ name: 'account', pattern: /\b(Account|Acct)[:\s#.]*\d{6,20}\b/gi, replacement: '[ACCOUNT REMOVED]' }
```

**Recommendation:** Add an explicit credit card PAN pattern to `PHIDeIdentificationService.ts`:

```ts
// PCI DSS — PAN masking (16-digit card numbers)
{ name: 'credit_card_pan', pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replacement: '[CARD REMOVED]' }
```

This is a 1-line addition to `PHIDeIdentificationService.ts`.

---

## Recommendations

1. **Immediate (if billing introduced):** Confirm payment processor is PCI DSS Level 1 certified (Stripe is); obtain their Attestation of Compliance (AoC)
2. **Code (1 line):** Add PAN regex pattern to `PHIDeIdentificationService.ts`
3. **Annual:** Re-assess PCI scope if payment card data flows change
4. **Customer guidance:** Add to ToS that customers must not include CHD in AI prompts; platform makes best-effort de-identification

---

## Scope Re-assessment Triggers

PCI scope must be re-assessed if Datacendia:
- Introduces direct card payment acceptance
- Builds payment-adjacent features (invoicing, billing management)
- Integrates with payment processors via direct API (not hosted pages)
- Customers confirmed to be using the platform for payment card-related AI decisions
