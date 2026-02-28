// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * FLEET TRACKING MAP - Logistics Vertical
 * Interactive Leaflet map showing live fleet positions, routes, and warehouses
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../../../lib/utils';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const createIcon = (emoji: string, color: string) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const truckIcon = createIcon('🚚', '#3b82f6');
const warehouseIcon = createIcon('🏭', '#8b5cf6');
const delayIcon = createIcon('⚠️', '#ef4444');
const deliveryIcon = createIcon('📦', '#10b981');

// Types
interface Vehicle {
  id: string;
  name: string;
  position: [number, number];
  status: 'moving' | 'idle' | 'delayed' | 'delivering';
  speed: number;
  destination: string;
  eta: string;
  cargo: string;
}

interface Warehouse {
  id: string;
  name: string;
  position: [number, number];
  capacity: number;
  utilization: number;
}

interface Route {
  id: string;
  vehicleId: string;
  points: [number, number][];
  status: 'active' | 'completed' | 'delayed';
}

// Sample data - US logistics network
const SAMPLE_VEHICLES: Vehicle[] = [
  { id: 'v1', name: 'Truck #1247', position: [40.7128, -74.0060], status: 'moving', speed: 65, destination: 'Boston Hub', eta: '2h 15m', cargo: 'Electronics' },
  { id: 'v2', name: 'Truck #0892', position: [34.0522, -118.2437], status: 'delivering', speed: 0, destination: 'LA Distribution', eta: 'Arrived', cargo: 'Retail Goods' },
  { id: 'v3', name: 'Truck #2041', position: [41.8781, -87.6298], status: 'delayed', speed: 0, destination: 'Detroit Hub', eta: 'Delayed +45m', cargo: 'Auto Parts' },
  { id: 'v4', name: 'Truck #1558', position: [29.7604, -95.3698], status: 'moving', speed: 72, destination: 'Dallas Center', eta: '3h 40m', cargo: 'Food & Beverage' },
  { id: 'v5', name: 'Truck #3312', position: [47.6062, -122.3321], status: 'moving', speed: 58, destination: 'Portland Hub', eta: '2h 50m', cargo: 'Tech Equipment' },
  { id: 'v6', name: 'Truck #0445', position: [33.4484, -112.0740], status: 'idle', speed: 0, destination: 'Phoenix Center', eta: 'Scheduled 6PM', cargo: 'Construction Materials' },
  { id: 'v7', name: 'Truck #1879', position: [39.7392, -104.9903], status: 'moving', speed: 70, destination: 'Kansas City', eta: '5h 20m', cargo: 'Medical Supplies' },
  { id: 'v8', name: 'Truck #2256', position: [25.7617, -80.1918], status: 'moving', speed: 62, destination: 'Orlando Hub', eta: '3h 10m', cargo: 'Consumer Goods' },
];

const SAMPLE_WAREHOUSES: Warehouse[] = [
  { id: 'w1', name: 'NYC Distribution Center', position: [40.7128, -74.0060], capacity: 50000, utilization: 78 },
  { id: 'w2', name: 'LA Mega Hub', position: [34.0522, -118.2437], capacity: 75000, utilization: 92 },
  { id: 'w3', name: 'Chicago Central', position: [41.8781, -87.6298], capacity: 60000, utilization: 65 },
  { id: 'w4', name: 'Houston Logistics', position: [29.7604, -95.3698], capacity: 45000, utilization: 81 },
  { id: 'w5', name: 'Seattle Pacific Hub', position: [47.6062, -122.3321], capacity: 35000, utilization: 54 },
  { id: 'w6', name: 'Miami Port Center', position: [25.7617, -80.1918], capacity: 40000, utilization: 88 },
];

const SAMPLE_ROUTES: Route[] = [
  { id: 'r1', vehicleId: 'v1', points: [[40.7128, -74.0060], [41.2033, -73.2017], [42.3601, -71.0589]], status: 'active' },
  { id: 'r4', vehicleId: 'v4', points: [[29.7604, -95.3698], [31.9686, -99.9018], [32.7767, -96.7970]], status: 'active' },
  { id: 'r7', vehicleId: 'v7', points: [[39.7392, -104.9903], [38.6270, -101.3551], [39.0997, -94.5786]], status: 'active' },
];

// Map bounds fitter component
const FitBounds: React.FC<{ vehicles: Vehicle[]; warehouses: Warehouse[] }> = ({ vehicles, warehouses }) => {
  const map = useMap();
  
  useEffect(() => {
    const allPoints = [
      ...vehicles.map(v => v.position),
      ...warehouses.map(w => w.position),
    ];
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, vehicles, warehouses]);
  
  return null;
};

// Stats panel
const StatsPanel: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  const moving = vehicles.filter(v => v.status === 'moving').length;
  const delayed = vehicles.filter(v => v.status === 'delayed').length;
  const delivering = vehicles.filter(v => v.status === 'delivering').length;
  const idle = vehicles.filter(v => v.status === 'idle').length;

  return (
    <div className="absolute top-3 left-3 z-[1000] bg-sovereign-elevated/95 backdrop-blur-sm rounded-lg border border-sovereign-border p-3 space-y-2">
      <h4 className="text-xs font-semibold text-white mb-2">Fleet Status</h4>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
          <span className="text-gray-300">{moving} Moving</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-gray-300">{delivering} Delivering</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-gray-300">{delayed} Delayed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-500"></span>
          <span className="text-gray-300">{idle} Idle</span>
        </div>
      </div>
    </div>
  );
};

// Legend
const Legend: React.FC = () => (
  <div className="absolute bottom-3 left-3 z-[1000] bg-sovereign-elevated/95 backdrop-blur-sm rounded-lg border border-sovereign-border p-3">
    <h4 className="text-xs font-semibold text-white mb-2">Legend</h4>
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center gap-2">
        <span>🚚</span>
        <span className="text-gray-300">Vehicle</span>
      </div>
      <div className="flex items-center gap-2">
        <span>🏭</span>
        <span className="text-gray-300">Warehouse</span>
      </div>
      <div className="flex items-center gap-2">
        <span>⚠️</span>
        <span className="text-gray-300">Delay</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-cyan-500"></div>
        <span className="text-gray-300">Active Route</span>
      </div>
    </div>
  </div>
);

// Main component
export const FleetTrackingMap: React.FC<{ className?: string }> = ({ className }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(SAMPLE_VEHICLES);

  // Simulate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'moving') {
          return {
            ...v,
            position: [
              v.position[0] + (deterministicFloat('fleettrackingmap-1') - 0.5) * 0.02,
              v.position[1] + (deterministicFloat('fleettrackingmap-2') - 0.5) * 0.02,
            ] as [number, number],
          };
        }
        return v;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getVehicleIcon = (status: Vehicle['status']) => {
    switch (status) {
      case 'delayed': return delayIcon;
      case 'delivering': return deliveryIcon;
      default: return truckIcon;
    }
  };

  const getRouteColor = (status: Route['status']) => {
    switch (status) {
      case 'active': return '#06b6d4';
      case 'delayed': return '#ef4444';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden', className)}>
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        className="w-full h-full"
        style={{ background: '#0f172a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <FitBounds vehicles={vehicles} warehouses={SAMPLE_WAREHOUSES} />

        {/* Routes */}
        {SAMPLE_ROUTES.map(route => (
          <Polyline
            key={route.id}
            positions={route.points}
            color={getRouteColor(route.status)}
            weight={3}
            opacity={0.7}
            dashArray={route.status === 'active' ? '10, 5' : undefined}
          />
        ))}

        {/* Warehouse coverage circles */}
        {SAMPLE_WAREHOUSES.map(warehouse => (
          <Circle
            key={`coverage-${warehouse.id}`}
            center={warehouse.position}
            radius={150000}
            pathOptions={{
              color: '#8b5cf6',
              fillColor: '#8b5cf6',
              fillOpacity: 0.1,
              weight: 1,
            }}
          />
        ))}

        {/* Warehouses */}
        {SAMPLE_WAREHOUSES.map(warehouse => (
          <Marker
            key={warehouse.id}
            position={warehouse.position}
            icon={warehouseIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">{warehouse.name}</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capacity:</span>
                    <span>{warehouse.capacity.toLocaleString()} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Utilization:</span>
                    <span className={warehouse.utilization > 85 ? 'text-amber-600' : 'text-emerald-600'}>
                      {warehouse.utilization}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full',
                        warehouse.utilization > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                      )}
                      style={{ width: `${warehouse.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vehicles */}
        {vehicles.map(vehicle => (
          <Marker
            key={vehicle.id}
            position={vehicle.position}
            icon={getVehicleIcon(vehicle.status)}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[220px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{vehicle.name}</h3>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-medium uppercase',
                    vehicle.status === 'moving' && 'bg-cyan-100 text-cyan-700',
                    vehicle.status === 'delayed' && 'bg-red-100 text-red-700',
                    vehicle.status === 'delivering' && 'bg-emerald-100 text-emerald-700',
                    vehicle.status === 'idle' && 'bg-gray-100 text-gray-700',
                  )}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cargo:</span>
                    <span>{vehicle.cargo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destination:</span>
                    <span>{vehicle.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ETA:</span>
                    <span className={vehicle.status === 'delayed' ? 'text-red-600' : ''}>
                      {vehicle.eta}
                    </span>
                  </div>
                  {vehicle.speed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Speed:</span>
                      <span>{vehicle.speed} mph</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <StatsPanel vehicles={vehicles} />
      <Legend />

      {/* Live indicator */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live</span>
      </div>
    </div>
  );
};

export default FleetTrackingMap;
