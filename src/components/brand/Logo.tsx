/**
 * Component — Logo
 *
 * Reusable React UI component.
 *
 * @exports Logo, LogoSimple
 * @module components/brand/Logo
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
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
  sm: { height: 24 },
  md: { height: 32 },
  lg: { height: 40 },
  xl: { height: 56 },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const { height } = sizes[size];

  return (
    <img
      src="/logo.png"
      alt="Datacendia"
      className={className}
      style={{ height: `${height}px`, width: 'auto', display: 'inline-block' }}
    />
  );
};

export const LogoSimple: React.FC<{ size?: number; className?: string; dark?: boolean }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <img
      src="/logo.png"
      alt="Datacendia"
      className={className}
      style={{ height: `${size}px`, width: 'auto', display: 'inline-block' }}
    />
  );
};

export default Logo;
