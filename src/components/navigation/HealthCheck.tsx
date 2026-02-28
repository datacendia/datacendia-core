// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * HealthCheck - Backend API health monitoring
 * Displays connection status and allows quick diagnostics
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Server,
  Database,
  Cpu,
  Wifi,
  WifiOff
} from 'lucide-react';

import { useHealthContext } from '@/contexts/HealthContext';

export const useHealthCheck = useHealthContext;

// Compact status indicator for the header/sidebar
export const HealthIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { health, isChecking, refresh } = useHealthContext();

  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
    unknown: 'bg-slate-500',
  };

  const statusIcons = {
    healthy: <CheckCircle className="w-3 h-3" />,
    degraded: <AlertTriangle className="w-3 h-3" />,
    unhealthy: <XCircle className="w-3 h-3" />,
    unknown: <RefreshCw className="w-3 h-3 animate-spin" />,
  };

  return (
    <button
      onClick={refresh}
      disabled={isChecking}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors hover:bg-slate-700 ${className}`}
      title={`API: ${health.status} (${health.latency}ms)`}
    >
      <span className={`w-2 h-2 rounded-full ${statusColors[health.status]} ${isChecking ? 'animate-pulse' : ''}`} />
      <span className="text-slate-400">
        {health.status === 'healthy' ? `${health.latency}ms` : health.status}
      </span>
    </button>
  );
};

// Full health panel for settings/admin
export const HealthPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { health, isChecking, refresh } = useHealthContext();

  const ServiceRow: React.FC<{ name: string; status: boolean; icon: React.ReactNode }> = ({ 
    name, status, icon 
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {status ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
        <span className={status ? 'text-green-400' : 'text-red-400'}>
          {status ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Server className="w-5 h-5" />
          System Health
        </h3>
        <button
          onClick={refresh}
          disabled={isChecking}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            health.status === 'healthy' ? 'bg-green-500' :
            health.status === 'degraded' ? 'bg-yellow-500' :
            health.status === 'unhealthy' ? 'bg-red-500' : 'bg-slate-500'
          }`} />
          <span className="text-white font-medium capitalize">{health.status}</span>
          <span className="text-slate-400 text-sm">• {health.latency}ms latency</span>
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Last checked: {health.lastCheck.toLocaleTimeString()}
        </p>
      </div>

      <div className="space-y-1">
        <ServiceRow 
          name="Backend API" 
          status={health.services.api} 
          icon={<Wifi className="w-4 h-4" />} 
        />
        <ServiceRow 
          name="Database" 
          status={health.services.database} 
          icon={<Database className="w-4 h-4" />} 
        />
        <ServiceRow 
          name="Ollama LLM" 
          status={health.services.ollama} 
          icon={<Cpu className="w-4 h-4" />} 
        />
      </div>
    </div>
  );
};

// Connection lost banner
export const ConnectionBanner: React.FC = () => {
  const { health } = useHealthContext();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (health.status === 'healthy') {
      setDismissed(false);
    }
  }, [health.status]);

  if (health.status === 'healthy' || health.status === 'unknown' || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[9998] bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-3"
      >
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">
          {health.status === 'unhealthy' 
            ? 'Connection lost. Check if the backend server is running.'
            : 'Connection degraded. Some features may be unavailable.'}
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 text-xs underline hover:no-underline"
        >
          Dismiss
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default HealthPanel;
