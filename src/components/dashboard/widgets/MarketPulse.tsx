// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * MARKET PULSE - Financial Services Vertical
 * Live ticker tape + portfolio visualization
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface PortfolioAllocation {
  sector: string;
  value: number;
  color: string;
  holdings: number;
}

const SAMPLE_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.43, change: 2.34, changePercent: 1.25 },
  { symbol: 'MSFT', name: 'Microsoft', price: 374.58, change: -1.23, changePercent: -0.33 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 141.80, change: 3.45, changePercent: 2.49 },
  { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 1.87, changePercent: 1.06 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 495.22, change: 12.45, changePercent: 2.58 },
  { symbol: 'META', name: 'Meta', price: 353.96, change: -2.14, changePercent: -0.60 },
  { symbol: 'TSLA', name: 'Tesla', price: 248.48, change: 5.67, changePercent: 2.33 },
  { symbol: 'JPM', name: 'JPMorgan', price: 170.32, change: 0.89, changePercent: 0.52 },
  { symbol: 'V', name: 'Visa', price: 260.15, change: -0.45, changePercent: -0.17 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.78, change: 0.12, changePercent: 0.08 },
];

const PORTFOLIO_ALLOCATION: PortfolioAllocation[] = [
  { sector: 'Technology', value: 35, color: '#06b6d4', holdings: 12 },
  { sector: 'Healthcare', value: 20, color: '#10b981', holdings: 8 },
  { sector: 'Financials', value: 18, color: '#8b5cf6', holdings: 6 },
  { sector: 'Consumer', value: 12, color: '#f59e0b', holdings: 5 },
  { sector: 'Energy', value: 8, color: '#ef4444', holdings: 4 },
  { sector: 'Other', value: 7, color: '#6b7280', holdings: 3 },
];

const TickerItem: React.FC<{ stock: Stock }> = ({ stock }) => (
  <div className="flex items-center gap-3 px-4 py-2 border-r border-sovereign-border-subtle whitespace-nowrap">
    <span className="font-bold text-white">{stock.symbol}</span>
    <span className="text-gray-400">${stock.price.toFixed(2)}</span>
    <span className={cn(
      'flex items-center gap-1 text-sm font-medium',
      stock.change > 0 ? 'text-emerald-400' : stock.change < 0 ? 'text-red-400' : 'text-gray-400'
    )}>
      {stock.change > 0 ? <TrendingUp className="w-3 h-3" /> : 
       stock.change < 0 ? <TrendingDown className="w-3 h-3" /> : 
       <Minus className="w-3 h-3" />}
      {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
    </span>
  </div>
);

const DonutChart: React.FC<{ data: PortfolioAllocation[] }> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const segments = data.map(d => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...d, startAngle, angle };
  });

  const createArc = (startAngle: number, angle: number, radius: number) => {
    const start = (startAngle - 90) * Math.PI / 180;
    const end = (startAngle + angle - 90) * Math.PI / 180;
    const largeArc = angle > 180 ? 1 : 0;
    
    const x1 = 50 + radius * Math.cos(start);
    const y1 = 50 + radius * Math.sin(start);
    const x2 = 50 + radius * Math.cos(end);
    const y2 = 50 + radius * Math.sin(end);

    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {segments.map((seg, i) => (
          <path
            key={i}
            d={createArc(seg.startAngle, seg.angle, 45)}
            fill={seg.color}
            className="transition-all hover:opacity-80"
          />
        ))}
        <circle cx="50" cy="50" r="25" fill="#0f172a" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">$847M</p>
          <p className="text-xs text-gray-400">Total Value</p>
        </div>
      </div>
    </div>
  );
};

export const MarketPulse: React.FC<{ className?: string }> = ({ className }) => {
  const [stocks, setStocks] = useState<Stock[]>(SAMPLE_STOCKS);
  const [tickerOffset, setTickerOffset] = useState(0);

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const change = (deterministicFloat('marketpulse-1') - 0.5) * 2;
        const newPrice = stock.price + change;
        return {
          ...stock,
          price: Math.max(1, newPrice),
          change: change,
          changePercent: (change / stock.price) * 100,
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const marketUp = stocks.filter(s => s.change > 0).length;
  const marketDown = stocks.filter(s => s.change < 0).length;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base', className)}>
      {/* Ticker Tape */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-sovereign-elevated border-b border-sovereign-border overflow-hidden">
        <div 
          className="flex h-full items-center"
          style={{ transform: `translateX(-${tickerOffset}%)` }}
        >
          {[...stocks, ...stocks, ...stocks].map((stock, i) => (
            <TickerItem key={`${stock.symbol}-${i}`} stock={stock} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 p-4 h-full">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Portfolio Donut */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-2">Portfolio Allocation</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-40 h-40">
                <DonutChart data={PORTFOLIO_ALLOCATION} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {PORTFOLIO_ALLOCATION.slice(0, 4).map(alloc => (
                <div key={alloc.sector} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: alloc.color }} />
                  <span className="text-gray-400 truncate">{alloc.sector}</span>
                  <span className="text-white font-medium">{alloc.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Summary */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-2">Market Summary</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-2 text-center">
                <p className="text-2xl font-bold text-emerald-400">{marketUp}</p>
                <p className="text-xs text-gray-400">Gainers</p>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-2 text-center">
                <p className="text-2xl font-bold text-red-400">{marketDown}</p>
                <p className="text-xs text-gray-400">Losers</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {stocks.slice(0, 5).map(stock => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 rounded bg-sovereign-elevated/50">
                  <div>
                    <p className="text-sm font-medium text-white">{stock.symbol}</p>
                    <p className="text-xs text-gray-500">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">${stock.price.toFixed(2)}</p>
                    <p className={cn(
                      'text-xs font-medium',
                      stock.change > 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-14 right-3 flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live</span>
      </div>
    </div>
  );
};

export default MarketPulse;
