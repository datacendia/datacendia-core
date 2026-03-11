// Community stub — enterprise implementation in datacendia-components
import React from 'react';
export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className} style={{ fontWeight: 700, fontSize: '1.25rem' }}>Datacendia</span>
);
export const LogoSimple: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className} style={{ fontWeight: 700 }}>DC</span>
);
