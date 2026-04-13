/**
 * Component — CendiaStamp™ Cryptographic Seal SVG
 *
 * Renders the visual cryptographic seal for a Regulator's Receipt.
 * Fetches the SVG from /api/v1/verify/stamp/:hash or renders a
 * client-side fallback seal with the receipt hash and verification status.
 *
 * @exports CendiaStampSeal
 * @module components/crypto/CendiaStampSeal
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

interface CendiaStampSealProps {
  receiptHash: string;
  receiptId?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CendiaStampSeal: React.FC<CendiaStampSealProps> = ({
  receiptHash,
  receiptId,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const sizeMap = { sm: 80, md: 120, lg: 180 };
  const dimension = sizeMap[size];

  useEffect(() => {
    if (!receiptHash) {
      setUseFallback(true);
      setLoading(false);
      return;
    }

    const fetchStamp = async () => {
      try {
        const res = await fetch(`/api/v1/verify/stamp/${receiptHash}${receiptId ? `?receiptId=${receiptId}` : ''}`, {
          headers: { 'Accept': 'image/svg+xml' },
        });
        if (res.ok) {
          const svg = await res.text();
          if (svg.includes('<svg')) {
            setSvgContent(DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } }));
          } else {
            setUseFallback(true);
          }
        } else {
          setUseFallback(true);
        }
      } catch {
        setUseFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStamp();
  }, [receiptHash, receiptId]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: dimension, height: dimension }}>
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (svgContent && !useFallback) {
    return (
      <div className={`inline-block ${className}`}>
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ width: dimension, height: dimension }}
          className="[&>svg]:w-full [&>svg]:h-full"
        />
        {showLabel && (
          <p className="text-[10px] text-zinc-500 text-center mt-1 font-mono">
            {receiptHash.substring(0, 12)}...
          </p>
        )}
      </div>
    );
  }

  // Fallback: client-side rendered seal
  const shortHash = receiptHash ? receiptHash.substring(0, 8) : '--------';
  const timestamp = new Date().toISOString().split('T')[0];

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Outer ring */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#059669" strokeWidth="3" opacity="0.8" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#059669" strokeWidth="1" opacity="0.4" strokeDasharray="4 4" />

        {/* Inner background */}
        <circle cx="100" cy="100" r="82" fill="#022c22" opacity="0.9" />

        {/* Shield icon */}
        <path d="M100 35 L130 55 L130 90 C130 115 115 135 100 145 C85 135 70 115 70 90 L70 55 Z"
          fill="none" stroke="#34d399" strokeWidth="2" />
        <path d="M90 85 L97 92 L112 77" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Text: DATACENDIA */}
        <text x="100" y="115" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">DATACENDIA</text>

        {/* Text: VERIFIED */}
        <text x="100" y="128" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">VERIFIED</text>

        {/* Hash */}
        <text x="100" y="145" textAnchor="middle" fill="#52525b" fontSize="7" fontFamily="monospace">{shortHash}</text>

        {/* Date */}
        <text x="100" y="158" textAnchor="middle" fill="#3f3f46" fontSize="6" fontFamily="monospace">{timestamp}</text>

        {/* Circular text: CRYPTOGRAPHIC SEAL */}
        <defs>
          <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
        </defs>
        <text fill="#3f3f46" fontSize="8" fontFamily="monospace" letterSpacing="3">
          <textPath xlinkHref="#circlePath" startOffset="15%">
            CRYPTOGRAPHIC SEAL · ED25519 · MERKLE
          </textPath>
        </text>
      </svg>
      {showLabel && (
        <p className="text-[10px] text-zinc-500 text-center mt-1 font-mono">
          CendiaStamp™ · {shortHash}
        </p>
      )}
    </div>
  );
};

export default CendiaStampSeal;
