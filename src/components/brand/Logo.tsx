// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA BRAND LOGO
 * Stylized DATACEND!A with gold accent on exclamation mark
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  dark?: boolean;
}

const sizes = {
  sm: { height: 24, fontSize: 14 },
  md: { height: 32, fontSize: 18 },
  lg: { height: 40, fontSize: 22 },
  xl: { height: 56, fontSize: 28 },
};

const ACCENT_COLOR = '#c9a84c';

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '', dark = true }) => {
  const { height, fontSize } = sizes[size];
  const baseColor = dark ? '#e8e4e0' : '#1a1a1a';

  return (
    <span
      className={className}
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: `${fontSize}px`,
        fontWeight: 400,
        letterSpacing: '0.3em',
        color: baseColor,
        display: 'inline-block',
        lineHeight: `${height}px`,
      }}
    >
      DATACEND<span style={{ color: ACCENT_COLOR }}>!</span>A
    </span>
  );
};

export const LogoSimple: React.FC<{ size?: number; className?: string; dark?: boolean }> = ({
  size = 40,
  className = '',
  dark = true,
}) => {
  const fontSize = Math.round(size * 0.55);
  const baseColor = dark ? '#e8e4e0' : '#1a1a1a';

  return (
    <span
      className={className}
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: `${fontSize}px`,
        fontWeight: 400,
        letterSpacing: '0.3em',
        color: baseColor,
        display: 'inline-block',
        lineHeight: `${size}px`,
      }}
    >
      DATACEND<span style={{ color: ACCENT_COLOR }}>!</span>A
    </span>
  );
};

export default Logo;
