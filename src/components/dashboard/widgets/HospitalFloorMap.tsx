// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * HOSPITAL FLOOR MAP - Healthcare Vertical
 * Visual bed occupancy and patient flow visualization
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

interface Bed {
  id: string;
  unit: string;
  status: 'occupied' | 'available' | 'cleaning' | 'reserved' | 'maintenance';
  patient?: string | undefined;
  admitTime?: string | undefined;
  acuity?: 'critical' | 'serious' | 'stable' | undefined;
}

interface Unit {
  id: string;
  name: string;
  beds: Bed[];
  capacity: number;
}

const generateBeds = (unit: string, count: number): Bed[] => {
  const statuses: Bed['status'][] = ['occupied', 'available', 'cleaning', 'reserved', 'maintenance'];
  const acuities: ('critical' | 'serious' | 'stable')[] = ['critical', 'serious', 'stable'];
  
  return Array.from({ length: count }, (_, i) => {
    const isOccupied = deterministicFloat('hospitalfloormap-4') > 0.25;
    const status: Bed['status'] = isOccupied ? 'occupied' : statuses[Math.floor(deterministicFloat('hospitalfloormap-6') * statuses.length)] as Bed['status'];
    const bed: Bed = {
      id: `${unit}-${i + 1}`,
      unit,
      status,
    };
    if (status === 'occupied') {
      bed.patient = `Patient ${deterministicInt(0, 999, 'hospitalfloormap-1')}`;
      bed.admitTime = `${deterministicInt(0, 71, 'hospitalfloormap-2')}h ago`;
      bed.acuity = acuities[Math.floor(deterministicFloat('hospitalfloormap-7') * acuities.length)];
    }
    return bed;
  });
};

const SAMPLE_UNITS: Unit[] = [
  { id: 'icu', name: 'ICU', beds: generateBeds('icu', 12), capacity: 12 },
  { id: 'er', name: 'Emergency', beds: generateBeds('er', 20), capacity: 20 },
  { id: 'med-surg', name: 'Med/Surg', beds: generateBeds('med-surg', 30), capacity: 30 },
  { id: 'cardiac', name: 'Cardiac', beds: generateBeds('cardiac', 16), capacity: 16 },
  { id: 'peds', name: 'Pediatrics', beds: generateBeds('peds', 14), capacity: 14 },
  { id: 'maternity', name: 'Maternity', beds: generateBeds('maternity', 18), capacity: 18 },
];

const BedIcon: React.FC<{ bed: Bed; onClick: () => void }> = ({ bed, onClick }) => {
  const statusColors = {
    occupied: bed.acuity === 'critical' ? 'bg-red-500' : bed.acuity === 'serious' ? 'bg-amber-500' : 'bg-emerald-500',
    available: 'bg-cyan-500',
    cleaning: 'bg-violet-500',
    reserved: 'bg-blue-500',
    maintenance: 'bg-gray-600',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-6 h-4 rounded-sm transition-all hover:scale-110 hover:ring-2 hover:ring-white/50',
        statusColors[bed.status]
      )}
      title={`${bed.id}: ${bed.status}${bed.patient ? ` - ${bed.patient}` : ''}`}
    />
  );
};

const UnitCard: React.FC<{ unit: Unit; onBedClick: (bed: Bed) => void }> = ({ unit, onBedClick }) => {
  const occupied = unit.beds.filter(b => b.status === 'occupied').length;
  const occupancy = (occupied / unit.capacity) * 100;
  const critical = unit.beds.filter(b => b.acuity === 'critical').length;

  return (
    <div className="bg-sovereign-elevated/50 rounded-lg p-3 border border-sovereign-border-subtle">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-white">{unit.name}</h4>
        <div className="flex items-center gap-2">
          {critical > 0 && (
            <span className="px-1.5 py-0.5 bg-red-900/50 border border-red-500/50 rounded text-[10px] text-red-400">
              {critical} Critical
            </span>
          )}
          <span className={cn(
            'text-xs font-medium',
            occupancy > 90 ? 'text-red-400' : occupancy > 75 ? 'text-amber-400' : 'text-emerald-400'
          )}>
            {occupancy.toFixed(0)}%
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {unit.beds.map(bed => (
          <BedIcon key={bed.id} bed={bed} onClick={() => onBedClick(bed)} />
        ))}
      </div>
      
      <div className="h-1.5 bg-sovereign-base rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all',
            occupancy > 90 ? 'bg-red-500' : occupancy > 75 ? 'bg-amber-500' : 'bg-emerald-500'
          )}
          style={{ width: `${occupancy}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-500 mt-1">{occupied}/{unit.capacity} beds occupied</p>
    </div>
  );
};

export const HospitalFloorMap: React.FC<{ className?: string }> = ({ className }) => {
  const [units, setUnits] = useState<Unit[]>(SAMPLE_UNITS);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // Simulate bed status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits(prev => prev.map(unit => ({
        ...unit,
        beds: unit.beds.map((bed): Bed => {
          if (deterministicFloat('hospitalfloormap-5') > 0.95) {
            const statuses: Bed['status'][] = ['occupied', 'available', 'cleaning'];
            const newStatus = statuses[Math.floor(deterministicFloat('hospitalfloormap-8') * statuses.length)] as Bed['status'];
            const acuityOptions: ('critical' | 'serious' | 'stable')[] = ['critical', 'serious', 'stable'];
            return {
              ...bed,
              status: newStatus,
              acuity: newStatus === 'occupied' ? acuityOptions[deterministicInt(0, 2, 'hospitalfloormap-3')] : undefined,
            };
          }
          return bed;
        }),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalBeds = units.reduce((sum, u) => sum + u.capacity, 0);
  const occupiedBeds = units.reduce((sum, u) => sum + u.beds.filter(b => b.status === 'occupied').length, 0);
  const criticalPatients = units.reduce((sum, u) => sum + u.beds.filter(b => b.acuity === 'critical').length, 0);
  const availableBeds = units.reduce((sum, u) => sum + u.beds.filter(b => b.status === 'available').length, 0);

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-4', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-sovereign-elevated/50 rounded-lg p-2 text-center border border-sovereign-border-subtle">
          <p className="text-xl font-bold text-white">{totalBeds}</p>
          <p className="text-[10px] text-gray-400">Total Beds</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <p className="text-xl font-bold text-emerald-400">{availableBeds}</p>
          <p className="text-[10px] text-gray-400">Available</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <p className="text-xl font-bold text-cyan-400">{occupiedBeds}</p>
          <p className="text-[10px] text-gray-400">Occupied</p>
        </div>
        <div className="bg-red-900/20 rounded-lg p-2 text-center border border-red-500/30">
          <p className="text-xl font-bold text-red-400">{criticalPatients}</p>
          <p className="text-[10px] text-gray-400">Critical</p>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {units.map(unit => (
          <UnitCard key={unit.id} unit={unit} onBedClick={setSelectedBed} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-emerald-500" />
          <span className="text-gray-400">Stable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-amber-500" />
          <span className="text-gray-400">Serious</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-red-500" />
          <span className="text-gray-400">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-cyan-500" />
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-violet-500" />
          <span className="text-gray-400">Cleaning</span>
        </div>
      </div>

      {/* Selected Bed Modal */}
      {selectedBed && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10" onClick={() => setSelectedBed(null)}>
          <div className="bg-sovereign-elevated rounded-xl p-4 border border-sovereign-border max-w-xs" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Bed {selectedBed.id}</h3>
              <span className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                selectedBed.status === 'occupied' && 'bg-emerald-900/50 text-emerald-400',
                selectedBed.status === 'available' && 'bg-cyan-900/50 text-cyan-400',
                selectedBed.status === 'cleaning' && 'bg-violet-900/50 text-violet-400',
              )}>
                {selectedBed.status}
              </span>
            </div>
            {selectedBed.patient && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Patient:</span>
                  <span className="text-white">{selectedBed.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Admitted:</span>
                  <span className="text-white">{selectedBed.admitTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Acuity:</span>
                  <span className={cn(
                    'font-medium',
                    selectedBed.acuity === 'critical' && 'text-red-400',
                    selectedBed.acuity === 'serious' && 'text-amber-400',
                    selectedBed.acuity === 'stable' && 'text-emerald-400',
                  )}>
                    {selectedBed.acuity}
                  </span>
                </div>
              </div>
            )}
            <button 
              onClick={() => setSelectedBed(null)}
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

export default HospitalFloorMap;
