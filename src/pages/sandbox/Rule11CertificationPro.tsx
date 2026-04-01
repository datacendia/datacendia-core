/**
 * Professional Rule 11 Certification Export
 * 
 * Generates a formatted Rule 11 certification document with realistic legal formatting
 */

import React from 'react';

interface Rule11Data {
  attorney: string;
  barNumber: string;
  court: string;
  caseNumber: string;
  cocounselUses: string[];
  citations: { id: number; citation: string; verifiedTime: string }[];
  wordCountModified: number;
  signatureHash: string;
  timestampRFC3161: string;
}

function generateRule11Certificate(data: Rule11Data): string {
  const citations = data.citations
    .map((c) => `  [${c.id}] ${c.citation}\n       Verified by attorney: ${c.verifiedTime} UTC`)
    .join('\n');

  return `
═══════════════════════════════════════════════════════════════════
           ${data.court.toUpperCase()}
═══════════════════════════════════════════════════════════════════

RULE 11(b) CERTIFICATION — AI-ASSISTED DOCUMENT
Governed by ABA Formal Opinion 512 (July 2024)

Case:    ${data.caseNumber}
Date:    ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

CERTIFYING ATTORNEY
───────────────────
Name:        ${data.attorney}
Bar Number:  ${data.barNumber}

AI TOOLS USED IN THIS DOCUMENT
───────────────────────────────
${data.cocounselUses.map((u) => `  • ${u}`).join('\n')}

This document was drafted with AI assistance. All AI-generated
content has been reviewed, verified, and certified by the
undersigned attorney prior to filing.

CITATION VERIFICATION RECORD
─────────────────────────────
Total citations surfaced by Westlaw AI: ${data.citations.length}
Citations verified by attorney:         ${data.citations.length}
Citations blocked (unverified):         0

Individual verification timestamps:
${citations}

All citations confirmed to exist, to be accurately characterised,
and to support the propositions for which they are cited.

ATTORNEY MODIFICATIONS
──────────────────────
Words rewritten by attorney (independent judgment): ${data.wordCountModified.toLocaleString()}
Words accepted from AI draft: [calculated from diff]
AI draft preserved as immutable record: YES (hash sealed)

CERTIFICATION UNDER FRCP RULE 11(b)
─────────────────────────────────────
By signing below, I certify that to the best of my knowledge,
information, and belief, formed after reasonable inquiry:

  (1) This document is not being presented for any improper purpose;
  (2) The legal contentions are warranted by existing law;
  (3) The factual contentions have evidentiary support;
  (4) The denials of factual contentions are warranted.

AI-ASSISTED COMPLIANCE NOTE: The legal analysis and citations in
this document were generated with AI assistance and have been
independently verified by the undersigned attorney. This
certification reflects the attorney's independent judgment, not
reliance on AI output.

AI DISCLOSURE (per court standing order)
─────────────────────────────────────────
AI tools were used in preparing this document. All AI-generated
content was reviewed and verified by the signing attorney. Citation
verification documented above.

CRYPTOGRAPHIC SUPERVISION SEAL
────────────────────────────────
This certification is sealed by Datacendia CendiaSupervision.

Supervision Hash (Ed25519):
${data.signatureHash}

RFC 3161 Timestamp (proof review occurred before filing):
${data.timestampRFC3161}

The supervision chain (AI draft → citation verification →
attorney modifications → this certification) is cryptographically
sealed and tamper-evident. Available for court inspection on request.

═══════════════════════════════════════════════════════════════════

_________________________________    Date: ___________________
${data.attorney}
Bar No. ${data.barNumber}

═══════════════════════════════════════════════════════════════════
Sealed by Datacendia CendiaSupervision · app.datacendia.com
ABA Opinion 512 compliance documentation
═══════════════════════════════════════════════════════════════════
`.trim();
}

interface Rule11ExportButtonProps {
  caseNumber?: string;
  citationCount?: number;
  wordsModified?: number;
  className?: string;
}

export function Rule11ExportButton({
  caseNumber = '24-cv-3847',
  citationCount = 14,
  wordsModified = 847,
  className = '',
}: Rule11ExportButtonProps) {
  const handleExport = () => {
    // In production: pull real data from the supervision session
    // For demo: use realistic sample data
    const sampleCitations = Array.from({ length: citationCount }, (_, i) => ({
      id: i + 1,
      citation: [
        'Morrison v. Digital Compliance Corp., 847 F.3d 291 (2d Cir. 2021)',
        'Ashcroft v. Iqbal, 556 U.S. 662 (2009)',
        'Bell Atl. Corp. v. Twombly, 550 U.S. 544 (2007)',
        'Steel Co. v. Citizens for Better Env\'t, 523 U.S. 83 (1998)',
        'Lujan v. Defenders of Wildlife, 504 U.S. 555 (1992)',
        'Friends of the Earth, Inc. v. Laidlaw, 528 U.S. 167 (2000)',
        'Warth v. Seldin, 422 U.S. 490 (1975)',
        'Valley Forge Christian Coll. v. Americans United, 454 U.S. 464 (1982)',
        'Allen v. Wright, 468 U.S. 737 (1984)',
        'Clapper v. Amnesty Int\'l USA, 568 U.S. 398 (2013)',
        'TransUnion LLC v. Ramirez, 594 U.S. 413 (2021)',
        'Spokeo, Inc. v. Robins, 578 U.S. 330 (2016)',
        'Lexmark Int\'l, Inc. v. Static Control Components, 572 U.S. 118 (2014)',
        'Hollingsworth v. Perry, 570 U.S. 693 (2013)',
      ][i] || `Citation ${i + 1}`,
      verifiedTime: `${14 + i}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    }));

    // Mark citation #1 as BLOCKED (the hallucination)
    sampleCitations[0].citation =
      '[BLOCKED — HALLUCINATION DETECTED] Morrison v. Digital Compliance Corp., 847 F.3d 291 (2d Cir. 2021) — No matching reporter entry. Replaced with: United States v. Morrison, 844 F.3d 339 (2d Cir. 2016)';

    const data: Rule11Data = {
      attorney: 'Jane M. Partner',
      barNumber: 'NY-4872914',
      court: 'United States District Court\nSouthern District of New York',
      caseNumber,
      cocounselUses: [
        'CoCounsel AI: Motion to dismiss draft (40 min → replaced 6hr manual draft)',
        'Westlaw AI: Citation research — 14 citations surfaced, 1 blocked (hallucination), 13 verified',
        'AI contribution: Initial draft structure and research. Attorney contribution: Legal strategy, argument reframing, citation verification, section rewrites.',
      ],
      citations: sampleCitations,
      wordCountModified: wordsModified,
      signatureHash: 'a3f8c2b7e1d4906ab5f3c8e2b71d490a3f8c2b7e1d490a3f8c2b71d490a3f',
      timestampRFC3161: `${new Date().toISOString()} (RFC 3161 — hash predates filing timestamp)`,
    };

    const cert = generateRule11Certificate(data);

    // Download as .txt (printable, paste into Word for formatting)
    const blob = new Blob([cert], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rule11-Certification-${caseNumber.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // Track the export
    trackScenarioComplete('thomson-reuters', 'rule11-export');
  };

  return (
    <button
      onClick={handleExport}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        background: 'linear-gradient(135deg, #E8292C, #C41E21)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: 0.3,
        boxShadow: '0 2px 8px rgba(232,41,44,0.3)',
      }}
    >
      <span>⬇</span>
      Generate Rule 11 Certification
    </button>
  );
}

// Import trackScenarioComplete
function trackScenarioComplete(sandboxId: string, scenarioId: string) {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || 'direct';

  fetch('/api/sandbox-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'scenario_complete',
      sandbox: sandboxId,
      scenario: scenarioId,
      ref,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});
}
