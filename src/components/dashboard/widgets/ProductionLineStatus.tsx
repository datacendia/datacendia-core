// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * PRODUCTION LINE STATUS - Manufacturing Vertical
 * Real-time factory floor visualization with OEE metrics
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

interface Machine {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'maintenance' | 'error' | 'changeover';
  oee: number;
  output: number;
  target: number;
  cycleTime: number;
}

interface ProductionLine {
  id: string;
  name: string;
  machines: Machine[];
  product: string;
  shift: string;
}

const generateMachines = (lineId: string, count: number): Machine[] => {
  const statuses: Machine['status'][] = ['running', 'running', 'running', 'idle', 'maintenance', 'error', 'changeover'];
  
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(deterministicFloat('productionlinestatus-10') * statuses.length)] as Machine['status'];
    const oee = status === 'running' ? 75 + deterministicFloat('productionlinestatus-6') * 20 : status === 'idle' ? 0 : deterministicFloat('productionlinestatus-9') * 30;
    return {
      id: `${lineId}-M${i + 1}`,
      name: `Machine ${i + 1}`,
      status,
      oee,
      output: status === 'running' ? deterministicInt(0, 499, 'productionlinestatus-1') + 200 : 0,
      target: 450,
      cycleTime: 12 + deterministicFloat('productionlinestatus-7') * 5,
    };
  });
};

const SAMPLE_LINES: ProductionLine[] = [
  { id: 'line-a', name: 'Assembly Line A', machines: generateMachines('A', 8), product: 'Widget Pro X1', shift: 'Day Shift' },
  { id: 'line-b', name: 'Assembly Line B', machines: generateMachines('B', 6), product: 'Component Z42', shift: 'Day Shift' },
  { id: 'line-c', name: 'Packaging Line', machines: generateMachines('C', 5), product: 'Final Assembly', shift: 'Day Shift' },
];

const MachineBlock: React.FC<{ machine: Machine; onClick: () => void }> = ({ machine, onClick }) => {
  const statusColors = {
    running: 'bg-emerald-500',
    idle: 'bg-gray-500',
    maintenance: 'bg-amber-500',
    error: 'bg-red-500 animate-pulse',
    changeover: 'bg-violet-500',
  };

  const statusIcons = {
    running: '⚙️',
    idle: '⏸️',
    maintenance: '🔧',
    error: '⚠️',
    changeover: '🔄',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all hover:scale-105',
        machine.status === 'running' ? 'border-emerald-500/50 bg-emerald-900/20' :
        machine.status === 'error' ? 'border-red-500/50 bg-red-900/20' :
        machine.status === 'maintenance' ? 'border-amber-500/50 bg-amber-900/20' :
        'border-sovereign-border bg-sovereign-elevated/50'
      )}
    >
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-lg mb-1', statusColors[machine.status])}>
        {statusIcons[machine.status]}
      </div>
      <p className="text-[10px] text-gray-400 truncate w-full text-center">{machine.name}</p>
      {machine.status === 'running' && (
        <p className="text-xs font-bold text-emerald-400">{machine.oee.toFixed(0)}%</p>
      )}
    </button>
  );
};

const LineCard: React.FC<{ line: ProductionLine; onMachineClick: (m: Machine) => void }> = ({ line, onMachineClick }) => {
  const running = line.machines.filter(m => m.status === 'running').length;
  const errors = line.machines.filter(m => m.status === 'error').length;
  const avgOee = line.machines.filter(m => m.status === 'running').reduce((sum, m) => sum + m.oee, 0) / (running || 1);
  const totalOutput = line.machines.reduce((sum, m) => sum + m.output, 0);
  const totalTarget = line.machines.reduce((sum, m) => sum + m.target, 0);

  return (
    <div className="bg-sovereign-elevated/30 rounded-xl p-4 border border-sovereign-border-subtle">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">{line.name}</h4>
          <p className="text-xs text-gray-500">{line.product} • {line.shift}</p>
        </div>
        <div className="flex items-center gap-2">
          {errors > 0 && (
            <span className="px-2 py-0.5 bg-red-900/50 border border-red-500/50 rounded text-xs text-red-400 animate-pulse">
              {errors} Error{errors > 1 ? 's' : ''}
            </span>
          )}
          <span className={cn(
            'px-2 py-0.5 rounded text-xs font-medium',
            avgOee >= 85 ? 'bg-emerald-900/50 text-emerald-400' :
            avgOee >= 70 ? 'bg-amber-900/50 text-amber-400' :
            'bg-red-900/50 text-red-400'
          )}>
            OEE: {avgOee.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Machine Flow */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
        <div className="flex-shrink-0 w-8 h-8 rounded bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-sm">
          📥
        </div>
        {line.machines.map((machine) => (
          <React.Fragment key={machine.id}>
            <div className="w-4 h-0.5 bg-sovereign-border flex-shrink-0" />
            <MachineBlock machine={machine} onClick={() => onMachineClick(machine)} />
          </React.Fragment>
        ))}
        <div className="w-4 h-0.5 bg-sovereign-border flex-shrink-0" />
        <div className="flex-shrink-0 w-8 h-8 rounded bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-sm">
          📦
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-sovereign-base rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all',
              (totalOutput / totalTarget) >= 0.9 ? 'bg-emerald-500' :
              (totalOutput / totalTarget) >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
            )}
            style={{ width: `${Math.min(100, (totalOutput / totalTarget) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{totalOutput}/{totalTarget} units</span>
      </div>
    </div>
  );
};

export const ProductionLineStatus: React.FC<{ className?: string }> = ({ className }) => {
  const [lines, setLines] = useState<ProductionLine[]>(SAMPLE_LINES);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  // Simulate production changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLines(prev => prev.map(line => ({
        ...line,
        machines: line.machines.map((machine): Machine => {
          const shouldChange = deterministicFloat('productionlinestatus-5') > 0.9;
          if (shouldChange) {
            const statuses: Machine['status'][] = ['running', 'running', 'running', 'idle', 'maintenance'];
            const newStatus = statuses[Math.floor(deterministicFloat('productionlinestatus-11') * statuses.length)] as Machine['status'];
            return {
              ...machine,
              status: newStatus,
              oee: newStatus === 'running' ? 75 + deterministicFloat('productionlinestatus-8') * 20 : 0,
              output: newStatus === 'running' ? machine.output + deterministicInt(0, 9, 'productionlinestatus-2') : machine.output,
            };
          }
          if (machine.status === 'running') {
            return {
              ...machine,
              output: Math.min(machine.target, machine.output + deterministicInt(0, 4, 'productionlinestatus-3')),
              oee: Math.min(100, machine.oee + (deterministicFloat('productionlinestatus-4') - 0.5) * 2),
            };
          }
          return machine;
        }),
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalMachines = lines.reduce((sum, l) => sum + l.machines.length, 0);
  const runningMachines = lines.reduce((sum, l) => sum + l.machines.filter(m => m.status === 'running').length, 0);
  const errorMachines = lines.reduce((sum, l) => sum + l.machines.filter(m => m.status === 'error').length, 0);
  const avgOee = lines.reduce((sum, l) => {
    const running = l.machines.filter(m => m.status === 'running');
    return sum + running.reduce((s, m) => s + m.oee, 0);
  }, 0) / runningMachines || 0;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-4', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-sovereign-elevated/50 rounded-lg p-2 text-center border border-sovereign-border-subtle">
          <p className="text-xl font-bold text-white">{totalMachines}</p>
          <p className="text-[10px] text-gray-400">Total Machines</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <p className="text-xl font-bold text-emerald-400">{runningMachines}</p>
          <p className="text-[10px] text-gray-400">Running</p>
        </div>
        <div className={cn(
          'rounded-lg p-2 text-center border',
          errorMachines > 0 ? 'bg-red-900/20 border-red-500/30' : 'bg-sovereign-elevated/50 border-sovereign-border-subtle'
        )}>
          <p className={cn('text-xl font-bold', errorMachines > 0 ? 'text-red-400' : 'text-gray-400')}>{errorMachines}</p>
          <p className="text-[10px] text-gray-400">Errors</p>
        </div>
        <div className={cn(
          'rounded-lg p-2 text-center border',
          avgOee >= 85 ? 'bg-emerald-900/20 border-emerald-500/30' :
          avgOee >= 70 ? 'bg-amber-900/20 border-amber-500/30' :
          'bg-red-900/20 border-red-500/30'
        )}>
          <p className={cn(
            'text-xl font-bold',
            avgOee >= 85 ? 'text-emerald-400' : avgOee >= 70 ? 'text-amber-400' : 'text-red-400'
          )}>{avgOee.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-400">Avg OEE</p>
        </div>
      </div>

      {/* Production Lines */}
      <div className="space-y-3">
        {lines.map(line => (
          <LineCard key={line.id} line={line} onMachineClick={setSelectedMachine} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-gray-400">Running</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-500" /><span className="text-gray-400">Idle</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-gray-400">Maintenance</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-gray-400">Error</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-violet-500" /><span className="text-gray-400">Changeover</span></div>
      </div>

      {/* Selected Machine Modal */}
      {selectedMachine && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10" onClick={() => setSelectedMachine(null)}>
          <div className="bg-sovereign-elevated rounded-xl p-4 border border-sovereign-border max-w-xs" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{selectedMachine.name}</h3>
              <span className={cn(
                'px-2 py-0.5 rounded text-xs font-medium uppercase',
                selectedMachine.status === 'running' && 'bg-emerald-900/50 text-emerald-400',
                selectedMachine.status === 'error' && 'bg-red-900/50 text-red-400',
                selectedMachine.status === 'maintenance' && 'bg-amber-900/50 text-amber-400',
                selectedMachine.status === 'idle' && 'bg-gray-900/50 text-gray-400',
              )}>
                {selectedMachine.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">OEE:</span>
                <span className="text-white font-medium">{selectedMachine.oee.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Output:</span>
                <span className="text-white">{selectedMachine.output}/{selectedMachine.target} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cycle Time:</span>
                <span className="text-white">{selectedMachine.cycleTime.toFixed(1)}s</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedMachine(null)}
              className="mt-4 w-full py-2 bg-sovereign-base hover:bg-sovereign-hover rounded-lg text-sm text-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live</span>
      </div>
    </div>
  );
};

export default ProductionLineStatus;
