/**
 * Professional Compliance Score Component
 * 
 * Animated compliance score that climbs as supervision evidence is added
 */

import React from 'react';

interface ComplianceScoreProps {
  phase: 'idle' | 'phase1' | 'phase2' | 'phase3' | 'complete';
  citationsVerified?: number;
  totalCitations?: number;
}

export function ComplianceScore({
  phase,
  citationsVerified = 0,
  totalCitations = 14,
}: ComplianceScoreProps) {
  const scoreMap = {
    idle: 0,
    phase1: 20,  // Hard-stop fired, hallucination blocked
    phase2: 55,  // Citations being verified
    phase3: 85,  // Verification complete, awaiting seal
    complete: 100,
  };

  const labelMap = {
    idle: 'Zero attorney review documented',
    phase1: 'Hallucination blocked',
    phase2: `${citationsVerified}/${totalCitations} citations verified`,
    phase3: 'Supervision complete — sealing',
    complete: 'ABA 512 satisfied',
  };

  const colorMap = {
    idle: '#DC2626',
    phase1: '#D97706',
    phase2: '#2563EB',
    phase3: '#059669',
    complete: '#059669',
  };

  const score = scoreMap[phase];
  const label = labelMap[phase];
  const color = colorMap[phase];

  return (
    <div style={{ textAlign: 'center', padding: '16px 20px' }}>
      <div style={{
        fontSize: 11, color: '#64748B', letterSpacing: 2,
        textTransform: 'uppercase', marginBottom: 8, fontWeight: 600,
      }}>
        ABA 512 Compliance Score
      </div>
      <div style={{
        fontSize: 42, fontWeight: 800, color,
        transition: 'all 0.6s ease',
        fontFamily: '"IBM Plex Mono", monospace',
      }}>
        {score}%
      </div>
      <div style={{
        fontSize: 11, color, marginTop: 4, fontWeight: 600,
        transition: 'all 0.3s',
      }}>
        {label}
      </div>
      {/* Progress bar */}
      <div style={{
        height: 4, background: '#E2E8F0', borderRadius: 2,
        overflow: 'hidden', marginTop: 12,
      }}>
        <div style={{
          height: '100%', width: `${score}%`,
          background: color, borderRadius: 2,
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
}
