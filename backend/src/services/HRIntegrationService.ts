// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';
import { BoundedMap } from '../utils/BoundedMap.js';

export type HRProvider = 'workday' | 'bamboohr' | 'adp' | 'gusto' | 'manual';

export interface HRCredentials {
  provider: HRProvider;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  subdomain?: string;
  refreshToken?: string;
}

interface Employee { id: string; name: string; email: string; department: string; title: string; provider: HRProvider; startDate: string }
interface ConnectionStatus { provider: HRProvider; connected: boolean; lastSync?: string; employeeCount: number; error?: string }

const SEED_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Alice Chen', email: 'alice@example.com', department: 'Engineering', title: 'Staff Engineer', provider: 'manual', startDate: '2022-03-15' },
  { id: 'emp-2', name: 'Bob Martinez', email: 'bob@example.com', department: 'Product', title: 'Product Manager', provider: 'manual', startDate: '2021-07-01' },
  { id: 'emp-3', name: 'Carol Williams', email: 'carol@example.com', department: 'Engineering', title: 'Engineering Manager', provider: 'manual', startDate: '2020-11-20' },
  { id: 'emp-4', name: 'David Kim', email: 'david@example.com', department: 'Sales', title: 'Account Executive', provider: 'manual', startDate: '2023-01-10' },
];

class HRIntegrationServiceImpl {
  private connections = new BoundedMap<HRProvider, ConnectionStatus>({ maxSize: 10 });
  private employees = new BoundedMap<string, Employee>({ maxSize: 50000 });

  constructor() {
    for (const emp of SEED_EMPLOYEES) {
      this.employees.set(emp.id, emp);
    }
  }

  getAllConnectionStatuses(): ConnectionStatus[] {
    const providers: HRProvider[] = ['workday', 'bamboohr', 'adp', 'gusto', 'manual'];
    return providers.map(p => this.connections.get(p) || { provider: p, connected: p === 'manual', employeeCount: p === 'manual' ? SEED_EMPLOYEES.length : 0 });
  }

  getConnectionStatus(provider: HRProvider): ConnectionStatus {
    return this.connections.get(provider) || { provider, connected: provider === 'manual', employeeCount: provider === 'manual' ? SEED_EMPLOYEES.length : 0 };
  }

  async connect(credentials: HRCredentials): Promise<ConnectionStatus> {
    const status: ConnectionStatus = { provider: credentials.provider, connected: true, lastSync: new Date().toISOString(), employeeCount: 0 };
    this.connections.set(credentials.provider, status);
    return status;
  }

  async disconnect(provider: HRProvider) { this.connections.delete(provider); }

  async syncEmployees(provider: HRProvider) {
    return { provider, employeesProcessed: this.getAllEmployees(provider).length, newEmployees: 0, updatedEmployees: 0, syncedAt: new Date().toISOString() };
  }

  async syncAll() {
    const connected = [...this.connections.entries()].filter(([, s]) => s.connected).map(([p]) => p);
    return Promise.all(connected.map(p => this.syncEmployees(p)));
  }

  getAllEmployees(provider?: HRProvider): Employee[] {
    const all = [...this.employees.values()];
    return provider ? all.filter(e => e.provider === provider) : all;
  }

  getEmployee(id: string): Employee | undefined { return this.employees.get(id); }

  getEmployeesByDepartment(department: string): Employee[] {
    return [...this.employees.values()].filter(e => e.department.toLowerCase() === department.toLowerCase());
  }

  async getEmployeeTimeOff(employeeId: string, _start: Date, _end: Date) {
    return [{ id: crypto.randomUUID(), employeeId, type: 'vacation', startDate: '2025-06-01', endDate: '2025-06-05', status: 'approved', days: 5 }];
  }

  async getEmployeePTOBalance(employeeId: string) {
    return { employeeId, totalDays: 20, usedDays: 7, remainingDays: 13, pendingDays: 2 };
  }

  getWorkforceMetrics() {
    const all = [...this.employees.values()];
    const depts = [...new Set(all.map(e => e.department))];
    return { totalEmployees: all.length, departments: depts.length, departmentBreakdown: depts.map(d => ({ department: d, count: all.filter(e => e.department === d).length })), avgTenureMonths: 24 };
  }
}

export const hRIntegrationService = new HRIntegrationServiceImpl();

export default hRIntegrationService;
