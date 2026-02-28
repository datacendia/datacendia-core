// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type HealthStatusState = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export interface HealthStatus {
  status: HealthStatusState;
  latency: number;
  services: {
    api: boolean;
    database: boolean;
    ollama: boolean;
  };
  lastCheck: Date;
}

interface HealthContextValue {
  health: HealthStatus;
  isChecking: boolean;
  refresh: () => Promise<void>;
}

const defaultStatus: HealthStatus = {
  status: 'unknown',
  latency: 0,
  services: {
    api: false,
    database: false,
    ollama: false,
  },
  lastCheck: new Date(),
};

const HealthContext = createContext<HealthContextValue>({
  health: defaultStatus,
  isChecking: false,
  refresh: async () => undefined,
});

const API_BASE = '/api/v1';
const DEFAULT_INTERVAL = 60000;

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [health, setHealth] = useState<HealthStatus>(defaultStatus);
  const [isChecking, setIsChecking] = useState(false);

  const fetchHealth = useCallback(async () => {
    setIsChecking(true);
    const startTime = Date.now();

    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        setHealth({
          status: (data.status as HealthStatusState) || 'healthy',
          latency,
          services: {
            api: true,
            database: data.database ?? true,
            ollama: data.ollama ?? false,
          },
          lastCheck: new Date(),
        });
      } else {
        setHealth((prev) => ({
          ...prev,
          status: 'degraded',
          latency,
          services: { ...prev.services, api: true },
          lastCheck: new Date(),
        }));
      }
    } catch (error) {
      setHealth({
        status: 'unhealthy',
        latency: Date.now() - startTime,
        services: { api: false, database: false, ollama: false },
        lastCheck: new Date(),
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const timer = setInterval(fetchHealth, DEFAULT_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchHealth]);

  const value = useMemo(
    () => ({
      health,
      isChecking,
      refresh: fetchHealth,
    }),
    [health, isChecking, fetchHealth]
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};

export const useHealthContext = () => useContext(HealthContext);
