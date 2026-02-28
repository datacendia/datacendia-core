// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA TRANSPORTATION / LOGISTICS VERTICAL
// Fleet optimization, route intelligence, and supply chain decisions
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';

const agents = [
  {
    code: 'fleet',
    name: 'Fleet Director',
    purpose: 'Vehicle optimization, maintenance scheduling, asset utilization',
    model: 'qwq:32b',
  },
  {
    code: 'routing',
    name: 'Routing Manager',
    purpose: 'Route optimization, delivery scheduling, capacity planning',
    model: 'llama3.3:70b',
  },
  {
    code: 'logistics',
    name: 'Logistics Analyst',
    purpose: 'Warehouse operations, inventory positioning, 3PL management',
    model: 'qwq:32b',
  },
  {
    code: 'compliance-trans',
    name: 'Compliance Officer',
    purpose: 'DOT regulations, driver hours, safety compliance',
    model: 'llama3.3:70b',
  },
];

const compliance = [
  'DOT/FMCSA',
  'Hours of Service',
  'HAZMAT',
  'Customs/CBP',
  'EPA Emissions',
  'OSHA',
  'TSA Security',
];

const pricing = [
  {
    package: 'Transport Starter',
    price: '$70,000',
    includes: '8 Pillars + 4 Transport Agents',
    roi: '6 months',
  },
  {
    package: 'Transport Professional',
    price: '$500,000',
    includes: '+ Predict, Mesh, Panopticon',
    roi: '4 months',
  },
  {
    package: 'Transport Enterprise',
    price: '$2,500,000',
    includes: '+ Full Guardian Suite',
    roi: '3 months',
  },
  {
    package: 'Transport Sovereign',
    price: '$6,000,000+',
    includes: '+ Multi-modal, custom',
    roi: '2 months',
  },
];

// Generate realistic fleet data programmatically - 1000 vehicles globally
const generateFleetData = () => {
  // Global cities across all continents
  const cities = [
    // North America
    { name: 'Chicago', lat: 41.8781, lng: -87.6298, region: 'NA' },
    { name: 'Denver', lat: 39.7392, lng: -104.9903, region: 'NA' },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, region: 'NA' },
    { name: 'Houston', lat: 29.7604, lng: -95.3698, region: 'NA' },
    { name: 'Seattle', lat: 47.6062, lng: -122.3321, region: 'NA' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, region: 'NA' },
    { name: 'Miami', lat: 25.7617, lng: -80.1918, region: 'NA' },
    { name: 'Toronto', lat: 43.6532, lng: -79.3832, region: 'NA' },
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332, region: 'NA' },
    { name: 'Vancouver', lat: 49.2827, lng: -123.1207, region: 'NA' },
    // Europe
    { name: 'London', lat: 51.5074, lng: -0.1278, region: 'EU' },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, region: 'EU' },
    { name: 'Berlin', lat: 52.5200, lng: 13.4050, region: 'EU' },
    { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, region: 'EU' },
    { name: 'Madrid', lat: 40.4168, lng: -3.7038, region: 'EU' },
    { name: 'Rome', lat: 41.9028, lng: 12.4964, region: 'EU' },
    { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, region: 'EU' },
    { name: 'Warsaw', lat: 52.2297, lng: 21.0122, region: 'EU' },
    { name: 'Stockholm', lat: 59.3293, lng: 18.0686, region: 'EU' },
    { name: 'Dublin', lat: 53.3498, lng: -6.2603, region: 'EU' },
    // Asia Pacific
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, region: 'APAC' },
    { name: 'Shanghai', lat: 31.2304, lng: 121.4737, region: 'APAC' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, region: 'APAC' },
    { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, region: 'APAC' },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, region: 'APAC' },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, region: 'APAC' },
    { name: 'Seoul', lat: 37.5665, lng: 126.9780, region: 'APAC' },
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018, region: 'APAC' },
    { name: 'Jakarta', lat: -6.2088, lng: 106.8456, region: 'APAC' },
    { name: 'Melbourne', lat: -37.8136, lng: 144.9631, region: 'APAC' },
    // Middle East & Africa
    { name: 'Dubai', lat: 25.2048, lng: 55.2708, region: 'MEA' },
    { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, region: 'MEA' },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, region: 'MEA' },
    { name: 'Lagos', lat: 6.5244, lng: 3.3792, region: 'MEA' },
    { name: 'Riyadh', lat: 24.7136, lng: 46.6753, region: 'MEA' },
    // South America
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333, region: 'SA' },
    { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, region: 'SA' },
    { name: 'Santiago', lat: -33.4489, lng: -70.6693, region: 'SA' },
    { name: 'Lima', lat: -12.0464, lng: -77.0428, region: 'SA' },
    { name: 'Bogotá', lat: 4.7110, lng: -74.0721, region: 'SA' },
  ];

  const statuses = ['in-transit', 'in-transit', 'in-transit', 'loading', 'delivered'];
  const loads = ['100%', '95%', '88%', '76%', '67%', '54%', '45%', '32%', '23%', '12%', '0%'];
  
  const fleet: Array<{id: string; lat: number; lng: number; status: string; destination: string; eta: string; load: string; type: string; subtype: string}> = [];

  // 350 Long Haul & Regional Trucks
  for (let i = 1; i <= 350; i++) {
    const city = cities[i % cities.length];
    const destCity = cities[(i + 7) % cities.length];
    fleet.push({
      id: `TRK-${String(i).padStart(4, '0')}`,
      lat: city.lat + (deterministicFloat('transportationlogistics-10') - 0.5) * 3,
      lng: city.lng + (deterministicFloat('transportationlogistics-11') - 0.5) * 3,
      status: statuses[i % statuses.length],
      destination: destCity.name,
      eta: `${deterministicInt(0, 23, 'transportationlogistics-1') + 1}h ${deterministicInt(0, 59, 'transportationlogistics-2')}m`,
      load: loads[i % loads.length],
      type: 'truck',
      subtype: i <= 200 ? 'Long Haul' : 'Regional',
    });
  }

  // 250 Delivery Vans
  for (let i = 1; i <= 250; i++) {
    const city = cities[i % cities.length];
    fleet.push({
      id: `VAN-${String(i).padStart(4, '0')}`,
      lat: city.lat + (deterministicFloat('transportationlogistics-12') - 0.5) * 0.15,
      lng: city.lng + (deterministicFloat('transportationlogistics-13') - 0.5) * 0.15,
      status: statuses[i % statuses.length],
      destination: `${city.name} Zone ${i % 10 + 1}`,
      eta: `0h ${deterministicInt(0, 44, 'transportationlogistics-3') + 5}m`,
      load: loads[i % loads.length],
      type: 'van',
      subtype: 'Last Mile',
    });
  }

  // 120 Cargo Aircraft
  const airports = ['Memphis Hub', 'Louisville', 'Anchorage', 'JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'MIA', 'SEA', 'LHR', 'CDG', 'FRA', 'AMS', 'DXB', 'SIN', 'HKG', 'NRT', 'ICN', 'SYD', 'GRU', 'JNB'];
  const planeTypes = ['767 Freighter', '757 Freighter', '747 Freighter', 'A300 Freighter', 'MD-11F', '777 Freighter', 'A330 Freighter'];
  for (let i = 1; i <= 120; i++) {
    const city = cities[i % cities.length];
    fleet.push({
      id: `AIR-${String(i).padStart(4, '0')}`,
      lat: city.lat + (deterministicFloat('transportationlogistics-14') - 0.5) * 5,
      lng: city.lng + (deterministicFloat('transportationlogistics-15') - 0.5) * 5,
      status: statuses[i % statuses.length],
      destination: airports[i % airports.length],
      eta: `${deterministicInt(0, 13, 'transportationlogistics-4') + 1}h ${deterministicInt(0, 59, 'transportationlogistics-5')}m`,
      load: loads[i % loads.length],
      type: 'plane',
      subtype: planeTypes[i % planeTypes.length],
    });
  }

  // 80 Container Ships & Bulk Carriers
  const ports = ['Shanghai', 'Rotterdam', 'Singapore', 'Busan', 'Hong Kong', 'Los Angeles', 'Hamburg', 'Antwerp', 'Ningbo', 'Dubai', 'Santos', 'Mumbai', 'Felixstowe', 'Yokohama', 'Kaohsiung', 'Tanjung Pelepas'];
  const shipTypes = ['Container', 'Bulk Carrier', 'Tanker', 'RoRo'];
  // Ships in major shipping lanes
  const shippingLanes = [
    { lat: 35, lng: -140 }, // Pacific
    { lat: 25, lng: -60 }, // Atlantic
    { lat: 10, lng: 80 }, // Indian Ocean
    { lat: 5, lng: 105 }, // Malacca Strait
    { lat: 30, lng: 125 }, // East China Sea
    { lat: 50, lng: -5 }, // English Channel
    { lat: -25, lng: -45 }, // South Atlantic
    { lat: 10, lng: 50 }, // Arabian Sea
  ];
  for (let i = 1; i <= 80; i++) {
    const lane = shippingLanes[i % shippingLanes.length];
    fleet.push({
      id: `SHIP-${String(i).padStart(4, '0')}`,
      lat: lane.lat + (deterministicFloat('transportationlogistics-16') - 0.5) * 15,
      lng: lane.lng + (deterministicFloat('transportationlogistics-17') - 0.5) * 30,
      status: statuses[i % statuses.length],
      destination: ports[i % ports.length],
      eta: `${deterministicInt(0, 20, 'transportationlogistics-6') + 3}d ${deterministicInt(0, 23, 'transportationlogistics-7')}h`,
      load: loads[i % loads.length],
      type: 'ship',
      subtype: shipTypes[i % shipTypes.length],
    });
  }

  // 120 E-Cargo Bikes (urban centers)
  for (let i = 1; i <= 120; i++) {
    const city = cities[i % cities.length];
    fleet.push({
      id: `BIKE-${String(i).padStart(4, '0')}`,
      lat: city.lat + (deterministicFloat('transportationlogistics-18') - 0.5) * 0.05,
      lng: city.lng + (deterministicFloat('transportationlogistics-19') - 0.5) * 0.05,
      status: statuses[i % statuses.length],
      destination: `${city.name} Central`,
      eta: `0h ${deterministicInt(0, 19, 'transportationlogistics-8') + 3}m`,
      load: i % 3 === 0 ? '0%' : '100%',
      type: 'bike',
      subtype: 'E-Cargo',
    });
  }

  // 80 Delivery Drones
  for (let i = 1; i <= 80; i++) {
    const city = cities[i % cities.length];
    fleet.push({
      id: `DRONE-${String(i).padStart(4, '0')}`,
      lat: city.lat + (deterministicFloat('transportationlogistics-20') - 0.5) * 0.03,
      lng: city.lng + (deterministicFloat('transportationlogistics-21') - 0.5) * 0.03,
      status: i % 4 === 0 ? 'delivered' : 'in-transit',
      destination: `${city.name} Express`,
      eta: `0h ${deterministicInt(0, 9, 'transportationlogistics-9') + 2}m`,
      load: i % 4 === 0 ? '0%' : '100%',
      type: 'drone',
      subtype: 'Express',
    });
  }

  return fleet;
};

const fleetData = generateFleetData();

const routeLines = [
  { from: [41.8781, -87.6298], to: [42.3314, -83.0458], color: '#22c55e' }, // Chicago to Detroit
  { from: [39.7392, -104.9903], to: [33.4484, -112.0740], color: '#22c55e' }, // Denver to Phoenix
  { from: [34.0522, -118.2437], to: [47.6062, -122.3321], color: '#eab308' }, // LA to Seattle
  { from: [29.7604, -95.3698], to: [32.7767, -96.7970], color: '#22c55e' }, // Houston to Dallas
  { from: [33.4484, -112.0740], to: [34.0522, -118.2437], color: '#22c55e' }, // Phoenix to LA
  { from: [42.3601, -71.0589], to: [40.7128, -74.0060], color: '#22c55e' }, // Boston to NYC
  { from: [25.7617, -80.1918], to: [33.7490, -84.3880], color: '#eab308' }, // Miami to Atlanta
];

// Interactive Fleet Map Component
const FleetMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {return;}

    // Initialize map centered on world view
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add route lines
    routeLines.forEach((route) => {
      L.polyline([route.from as [number, number], route.to as [number, number]], {
        color: route.color,
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
      }).addTo(map);
    });

    // Vehicle type icons and colors
    const vehicleIcons: Record<string, string> = {
      truck: '🚛',
      van: '🚐',
      plane: '✈️',
      ship: '🚢',
      bike: '🚲',
      drone: '🛸',
    };

    const vehicleColors: Record<string, string> = {
      truck: '#f59e0b',
      van: '#8b5cf6',
      plane: '#3b82f6',
      ship: '#06b6d4',
      bike: '#10b981',
      drone: '#ec4899',
    };

    // Add fleet markers
    fleetData.forEach((vehicle) => {
      const statusColor = vehicle.status === 'in-transit' ? '#22c55e' : vehicle.status === 'loading' ? '#eab308' : '#3b82f6';
      const vehicleColor = vehicleColors[vehicle.type] || '#6b7280';
      const vehicleIcon = vehicleIcons[vehicle.type] || '📦';
      
      const icon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: ${vehicleColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid ${statusColor};
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            font-size: 12px;
          ">${vehicleIcon}</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([vehicle.lat, vehicle.lng], { icon }).addTo(map);
      
      marker.bindPopup(`
        <div style="background: #1f2937; color: white; padding: 12px; border-radius: 8px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 20px;">${vehicleIcon}</span>
            <div>
              <div style="font-weight: bold; font-size: 14px;">${vehicle.id}</div>
              <div style="font-size: 11px; color: #9ca3af;">${vehicle.subtype}</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #9ca3af;">Status:</span>
            <span style="color: ${statusColor}; text-transform: capitalize;">${vehicle.status}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #9ca3af;">Destination:</span>
            <span>${vehicle.destination}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #9ca3af;">ETA:</span>
            <span style="color: #22c55e;">${vehicle.eta}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #9ca3af;">Load:</span>
            <span>${vehicle.load}</span>
          </div>
        </div>
      `, {
        className: 'dark-popup',
      });
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[500px] rounded-xl overflow-hidden border border-neutral-700" />
      
      {/* Legend - Vehicle Types */}
      <div className="absolute bottom-4 left-4 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-4 border border-neutral-700">
        <div className="text-sm font-semibold mb-2">Fleet by Type</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span>🚛</span>
            <span>Trucks ({fleetData.filter(v => v.type === 'truck').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚐</span>
            <span>Vans ({fleetData.filter(v => v.type === 'van').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✈️</span>
            <span>Aircraft ({fleetData.filter(v => v.type === 'plane').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚢</span>
            <span>Ships ({fleetData.filter(v => v.type === 'ship').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚲</span>
            <span>E-Bikes ({fleetData.filter(v => v.type === 'bike').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛸</span>
            <span>Drones ({fleetData.filter(v => v.type === 'drone').length})</span>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-3 pt-3">
          <div className="text-sm font-semibold mb-2">Status</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>In Transit ({fleetData.filter(v => v.status === 'in-transit').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Loading ({fleetData.filter(v => v.status === 'loading').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Delivered ({fleetData.filter(v => v.status === 'delivered').length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-4 border border-neutral-700">
        <div className="text-sm font-semibold mb-2">Live Fleet Stats</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-2xl font-bold text-green-400">{fleetData.length}</div>
            <div className="text-neutral-400">Active Vehicles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">94%</div>
            <div className="text-neutral-400">On-Time Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TransportationLogisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'fleet-map' | 'pricing'>('overview');

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/verticals')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
          >
            ← Back to Verticals
          </button>

          <div className="flex items-start gap-6">
            <span className="text-6xl">🚚</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  📈 Growth Vertical
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 88% Sovereignty
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Transportation / Logistics</h1>
              <p className="text-xl text-neutral-300 max-w-3xl mb-6">
                Fleet optimization, route intelligence, and supply chain decision support. From
                last-mile delivery to cross-border freight to warehouse operations.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cortex/council?vertical=transportation')}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span> Launch Logistics Council
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">18%</p>
              <p className="text-neutral-300">fuel cost reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {[
              { label: '18-Month ROI', value: '26%', subtext: 'cost reduction' },
              { label: 'Route Efficiency', value: '18%', subtext: 'improvement' },
              { label: 'On-Time Delivery', value: '94%', subtext: 'vs 82% baseline' },
              { label: 'Fleet Utilization', value: '+22%', subtext: 'improvement' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
              >
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
                <p className="font-medium">{stat.label}</p>
                <p className="text-sm text-neutral-500">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {['overview', 'agents', 'fleet-map', 'pricing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
              >
                {tab === 'agents' ? 'Agents & Analytics' : tab === 'fleet-map' ? '🗺️ Live Fleet Map' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Transportation</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    title: 'Route Optimization',
                    desc: 'AI-powered routing that considers traffic, weather, driver hours, and delivery windows in real-time',
                    icon: '🗺️',
                  },
                  {
                    title: 'Fleet Intelligence',
                    desc: 'Predictive maintenance, asset utilization optimization, and replacement timing recommendations',
                    icon: '🚛',
                  },
                  {
                    title: 'Compliance Automation',
                    desc: 'DOT hours tracking, safety compliance, and regulatory reporting with full audit trail',
                    icon: '📋',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {[
                  {
                    org: 'Regional Trucking Company',
                    quote:
                      "Fuel costs reduced 18% through AI-optimized routing. The Council factors in 23 variables our dispatchers couldn't process manually.",
                    metric: '18% fuel savings',
                  },
                  {
                    org: 'E-Commerce Fulfillment',
                    quote:
                      'On-time delivery improved from 82% to 94%. Customer complaints dropped 60% in first quarter.',
                    metric: '94% on-time',
                  },
                  {
                    org: '3PL Provider',
                    quote:
                      'Warehouse labor optimization freed 22% capacity without adding headcount. We took on 3 new clients.',
                    metric: '22% more capacity',
                  },
                ].map((cs, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org}</p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/30 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'fleet-map' && (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Live Fleet Tracking</h2>
                  <p className="text-neutral-400 mt-1">Real-time visibility across your entire fleet with AI-optimized routing</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-400">Live Data</span>
                </div>
              </div>
              <FleetMap />
            </section>

            <section className="grid grid-cols-4 gap-4">
              {[
                { label: 'Active Routes', value: '7', icon: '🛣️', color: 'text-sky-400' },
                { label: 'Avg Speed', value: '58 mph', icon: '⚡', color: 'text-green-400' },
                { label: 'Fuel Efficiency', value: '+18%', icon: '⛽', color: 'text-yellow-400' },
                { label: 'ETA Accuracy', value: '96%', icon: '🎯', color: 'text-purple-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{stat.icon}</span>
                    <span className="text-neutral-400 text-sm">{stat.label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </section>

            <section className="bg-gradient-to-r from-sky-900/20 to-blue-900/20 rounded-xl p-6 border border-sky-500/30">
              <h3 className="font-semibold mb-3">🤖 AI Route Optimization Active</h3>
              <p className="text-neutral-300 text-sm">
                CendiaPredict™ is continuously analyzing traffic patterns, weather conditions, and delivery windows 
                to optimize routes in real-time. Current optimization has saved <span className="text-green-400 font-semibold">$12,400</span> in 
                fuel costs this week.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation & Logistics Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <div
                    key={agent.code}
                    className="bg-neutral-800 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <code className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">
                          {agent.code}
                        </code>
                      </div>
                    </div>
                    <p className="text-neutral-300 mb-3">{agent.purpose}</p>
                    <p className="text-sm text-neutral-500">
                      Model: <code className="text-primary-400">{agent.model}</code>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((pkg, idx) => (
                  <div
                    key={pkg.package}
                    className={`rounded-xl p-6 border ${idx === 1 ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}
                  >
                    {idx === 1 && (
                      <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/demo')}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                >
                  Request Transport Demo
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800"
                >
                  Talk to Sales
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportationLogisticsPage;
