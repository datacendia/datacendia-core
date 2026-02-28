// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * VERTICAL LAYOUT MAPS CONFIGURATION
 * Specialized visual maps for each industry vertical (3+ layouts per vertical)
 * Each layout represents a different operational context within the vertical
 */

export interface LayoutMapZone {
  id: string;
  name: string;
  x: number; // percentage position
  y: number;
  width: number;
  height: number;
  color: string;
  icon: string;
  status?: 'active' | 'warning' | 'critical' | 'idle';
  metrics?: { label: string; value: string }[];
}

export interface LayoutMap {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundGradient: string;
  zones: LayoutMapZone[];
  quickActions: { id: string; label: string; icon: string; zoneId?: string }[];
}

export interface VerticalLayoutConfig {
  verticalId: string;
  verticalName: string;
  layouts: LayoutMap[];
}

// =============================================================================
// LEGAL VERTICAL LAYOUTS
// =============================================================================
export const legalLayouts: VerticalLayoutConfig = {
  verticalId: 'legal',
  verticalName: 'Legal / Law Firms',
  layouts: [
    {
      id: 'courtroom',
      name: 'Courtroom',
      description: 'Litigation command center with case positioning',
      icon: '⚖️',
      backgroundGradient: 'from-amber-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'judge-bench', name: 'Judge\'s Bench', x: 35, y: 5, width: 30, height: 15, color: 'amber', icon: '👨‍⚖️', status: 'active', metrics: [{ label: 'Pending Rulings', value: '3' }] },
        { id: 'plaintiff', name: 'Plaintiff Counsel', x: 5, y: 30, width: 25, height: 20, color: 'blue', icon: '📋', status: 'active', metrics: [{ label: 'Active Cases', value: '12' }] },
        { id: 'defendant', name: 'Defense Counsel', x: 70, y: 30, width: 25, height: 20, color: 'red', icon: '🛡️', status: 'active', metrics: [{ label: 'Active Cases', value: '8' }] },
        { id: 'jury-box', name: 'Jury Box', x: 5, y: 55, width: 40, height: 15, color: 'purple', icon: '👥', status: 'idle', metrics: [{ label: 'Trials Pending', value: '2' }] },
        { id: 'witness-stand', name: 'Witness Stand', x: 55, y: 55, width: 20, height: 15, color: 'cyan', icon: '🎤', status: 'active' },
        { id: 'gallery', name: 'Gallery / Observers', x: 10, y: 75, width: 80, height: 20, color: 'slate', icon: '👁️', status: 'idle' },
      ],
      quickActions: [
        { id: 'file-motion', label: 'File Motion', icon: '📄', zoneId: 'judge-bench' },
        { id: 'prep-witness', label: 'Prep Witness', icon: '🎤', zoneId: 'witness-stand' },
        { id: 'jury-analysis', label: 'Jury Analysis', icon: '🔍', zoneId: 'jury-box' },
      ],
    },
    {
      id: 'war-room',
      name: 'Case War Room',
      description: 'Strategic planning and document review center',
      icon: '🎯',
      backgroundGradient: 'from-blue-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'strategy-board', name: 'Strategy Board', x: 5, y: 5, width: 60, height: 30, color: 'blue', icon: '📊', status: 'active', metrics: [{ label: 'Open Strategies', value: '5' }] },
        { id: 'timeline', name: 'Case Timeline', x: 5, y: 40, width: 90, height: 15, color: 'cyan', icon: '📅', status: 'active', metrics: [{ label: 'Key Dates', value: '24' }] },
        { id: 'doc-review', name: 'Document Review', x: 70, y: 5, width: 25, height: 30, color: 'amber', icon: '📁', status: 'warning', metrics: [{ label: 'Pending Review', value: '847' }] },
        { id: 'evidence-vault', name: 'Evidence Vault', x: 5, y: 60, width: 30, height: 35, color: 'emerald', icon: '🔒', status: 'active', metrics: [{ label: 'Exhibits', value: '156' }] },
        { id: 'deposition-prep', name: 'Deposition Prep', x: 40, y: 60, width: 25, height: 35, color: 'purple', icon: '🎙️', status: 'idle', metrics: [{ label: 'Scheduled', value: '3' }] },
        { id: 'research-hub', name: 'Research Hub', x: 70, y: 60, width: 25, height: 35, color: 'rose', icon: '📚', status: 'active', metrics: [{ label: 'Precedents', value: '42' }] },
      ],
      quickActions: [
        { id: 'add-strategy', label: 'New Strategy', icon: '➕', zoneId: 'strategy-board' },
        { id: 'upload-doc', label: 'Upload Document', icon: '📤', zoneId: 'doc-review' },
        { id: 'search-precedent', label: 'Search Precedent', icon: '🔍', zoneId: 'research-hub' },
      ],
    },
    {
      id: 'partner-meeting',
      name: 'Partner Meeting Room',
      description: 'Firm leadership and client strategy sessions',
      icon: '🤝',
      backgroundGradient: 'from-violet-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'conference-table', name: 'Conference Table', x: 20, y: 25, width: 60, height: 40, color: 'violet', icon: '🪑', status: 'active', metrics: [{ label: 'Attendees', value: '8' }] },
        { id: 'presentation', name: 'Presentation Screen', x: 30, y: 5, width: 40, height: 15, color: 'cyan', icon: '📺', status: 'active' },
        { id: 'client-area', name: 'Client Seating', x: 5, y: 30, width: 12, height: 30, color: 'amber', icon: '👔', status: 'active', metrics: [{ label: 'VIP Clients', value: '2' }] },
        { id: 'partner-seats', name: 'Partner Seats', x: 83, y: 30, width: 12, height: 30, color: 'emerald', icon: '⚖️', status: 'active', metrics: [{ label: 'Partners', value: '6' }] },
        { id: 'refreshments', name: 'Refreshments', x: 5, y: 70, width: 20, height: 25, color: 'slate', icon: '☕', status: 'idle' },
        { id: 'documents', name: 'Document Station', x: 75, y: 70, width: 20, height: 25, color: 'blue', icon: '📋', status: 'active', metrics: [{ label: 'Handouts', value: '12' }] },
      ],
      quickActions: [
        { id: 'start-meeting', label: 'Start Meeting', icon: '▶️', zoneId: 'conference-table' },
        { id: 'share-screen', label: 'Share Screen', icon: '📺', zoneId: 'presentation' },
        { id: 'record-notes', label: 'Record Notes', icon: '📝', zoneId: 'documents' },
      ],
    },
  ],
};

// =============================================================================
// HEALTHCARE VERTICAL LAYOUTS
// =============================================================================
export const healthcareLayouts: VerticalLayoutConfig = {
  verticalId: 'healthcare',
  verticalName: 'Healthcare / Health Systems',
  layouts: [
    {
      id: 'hospital-floor',
      name: 'Hospital Floor',
      description: 'Patient care unit with bed management',
      icon: '🏥',
      backgroundGradient: 'from-blue-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'nurses-station', name: 'Nurses Station', x: 35, y: 5, width: 30, height: 15, color: 'cyan', icon: '👩‍⚕️', status: 'active', metrics: [{ label: 'Staff On Duty', value: '12' }] },
        { id: 'icu', name: 'ICU', x: 5, y: 25, width: 25, height: 30, color: 'red', icon: '❤️', status: 'critical', metrics: [{ label: 'Beds', value: '8/10' }] },
        { id: 'med-surg', name: 'Med-Surg', x: 35, y: 25, width: 30, height: 30, color: 'blue', icon: '🛏️', status: 'active', metrics: [{ label: 'Beds', value: '24/30' }] },
        { id: 'or-suite', name: 'OR Suite', x: 70, y: 25, width: 25, height: 30, color: 'emerald', icon: '🔪', status: 'active', metrics: [{ label: 'Surgeries Today', value: '6' }] },
        { id: 'pharmacy', name: 'Pharmacy', x: 5, y: 60, width: 20, height: 20, color: 'purple', icon: '💊', status: 'active', metrics: [{ label: 'Orders Pending', value: '23' }] },
        { id: 'lab', name: 'Laboratory', x: 30, y: 60, width: 20, height: 20, color: 'amber', icon: '🔬', status: 'warning', metrics: [{ label: 'Results Pending', value: '47' }] },
        { id: 'imaging', name: 'Imaging', x: 55, y: 60, width: 20, height: 20, color: 'violet', icon: '📷', status: 'active', metrics: [{ label: 'Scans Today', value: '18' }] },
        { id: 'er', name: 'Emergency Room', x: 80, y: 60, width: 15, height: 35, color: 'rose', icon: '🚑', status: 'critical', metrics: [{ label: 'Wait Time', value: '42min' }] },
      ],
      quickActions: [
        { id: 'admit-patient', label: 'Admit Patient', icon: '➕', zoneId: 'nurses-station' },
        { id: 'order-labs', label: 'Order Labs', icon: '🔬', zoneId: 'lab' },
        { id: 'schedule-or', label: 'Schedule OR', icon: '📅', zoneId: 'or-suite' },
      ],
    },
    {
      id: 'clinic',
      name: 'Outpatient Clinic',
      description: 'Primary care and specialty clinic operations',
      icon: '🩺',
      backgroundGradient: 'from-emerald-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'reception', name: 'Reception', x: 30, y: 5, width: 40, height: 15, color: 'cyan', icon: '🪪', status: 'active', metrics: [{ label: 'Check-ins', value: '34' }] },
        { id: 'waiting-room', name: 'Waiting Room', x: 5, y: 25, width: 25, height: 25, color: 'slate', icon: '🪑', status: 'active', metrics: [{ label: 'Waiting', value: '8' }] },
        { id: 'exam-rooms', name: 'Exam Rooms', x: 35, y: 25, width: 30, height: 35, color: 'blue', icon: '🩺', status: 'active', metrics: [{ label: 'In Use', value: '6/8' }] },
        { id: 'provider-offices', name: 'Provider Offices', x: 70, y: 25, width: 25, height: 25, color: 'violet', icon: '👨‍⚕️', status: 'active', metrics: [{ label: 'Providers', value: '4' }] },
        { id: 'vitals-station', name: 'Vitals Station', x: 5, y: 55, width: 25, height: 20, color: 'emerald', icon: '💓', status: 'active' },
        { id: 'lab-draw', name: 'Lab Draw', x: 70, y: 55, width: 25, height: 20, color: 'amber', icon: '💉', status: 'idle', metrics: [{ label: 'Queue', value: '3' }] },
        { id: 'checkout', name: 'Checkout', x: 30, y: 80, width: 40, height: 15, color: 'purple', icon: '💳', status: 'active', metrics: [{ label: 'Pending', value: '5' }] },
      ],
      quickActions: [
        { id: 'check-in', label: 'Check In Patient', icon: '✅', zoneId: 'reception' },
        { id: 'room-patient', label: 'Room Patient', icon: '🚪', zoneId: 'exam-rooms' },
        { id: 'schedule-followup', label: 'Schedule Follow-up', icon: '📅', zoneId: 'checkout' },
      ],
    },
    {
      id: 'boardroom',
      name: 'Executive Boardroom',
      description: 'Hospital leadership and strategic planning',
      icon: '📊',
      backgroundGradient: 'from-violet-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'board-table', name: 'Board Table', x: 15, y: 20, width: 70, height: 45, color: 'violet', icon: '🪑', status: 'active', metrics: [{ label: 'Attendees', value: '12' }] },
        { id: 'ceo-seat', name: 'CEO', x: 40, y: 5, width: 20, height: 12, color: 'amber', icon: '👔', status: 'active' },
        { id: 'cfo-seat', name: 'CFO', x: 5, y: 35, width: 8, height: 15, color: 'emerald', icon: '💰', status: 'active' },
        { id: 'cmo-seat', name: 'CMO', x: 87, y: 35, width: 8, height: 15, color: 'blue', icon: '🩺', status: 'active' },
        { id: 'presentation-screen', name: 'Presentation', x: 25, y: 70, width: 50, height: 12, color: 'cyan', icon: '📺', status: 'active', metrics: [{ label: 'Slides', value: '24' }] },
        { id: 'quality-dashboard', name: 'Quality Dashboard', x: 5, y: 70, width: 15, height: 25, color: 'rose', icon: '📈', status: 'warning', metrics: [{ label: 'Alerts', value: '3' }] },
        { id: 'financial-dashboard', name: 'Financial Dashboard', x: 80, y: 70, width: 15, height: 25, color: 'emerald', icon: '💵', status: 'active', metrics: [{ label: 'Margin', value: '8.2%' }] },
      ],
      quickActions: [
        { id: 'present', label: 'Present', icon: '📺', zoneId: 'presentation-screen' },
        { id: 'review-quality', label: 'Review Quality', icon: '📊', zoneId: 'quality-dashboard' },
        { id: 'financial-review', label: 'Financial Review', icon: '💰', zoneId: 'financial-dashboard' },
      ],
    },
  ],
};

// =============================================================================
// MANUFACTURING VERTICAL LAYOUTS
// =============================================================================
export const manufacturingLayouts: VerticalLayoutConfig = {
  verticalId: 'manufacturing',
  verticalName: 'Manufacturing',
  layouts: [
    {
      id: 'plant-floor',
      name: 'Plant Floor',
      description: 'Production line monitoring and control',
      icon: '🏭',
      backgroundGradient: 'from-amber-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'line-1', name: 'Production Line 1', x: 5, y: 10, width: 90, height: 15, color: 'emerald', icon: '⚙️', status: 'active', metrics: [{ label: 'OEE', value: '87%' }] },
        { id: 'line-2', name: 'Production Line 2', x: 5, y: 30, width: 90, height: 15, color: 'amber', icon: '⚙️', status: 'warning', metrics: [{ label: 'OEE', value: '72%' }] },
        { id: 'line-3', name: 'Production Line 3', x: 5, y: 50, width: 90, height: 15, color: 'red', icon: '⚙️', status: 'critical', metrics: [{ label: 'OEE', value: '45%' }] },
        { id: 'quality-station', name: 'Quality Control', x: 5, y: 70, width: 25, height: 25, color: 'blue', icon: '🔍', status: 'active', metrics: [{ label: 'Pass Rate', value: '98.2%' }] },
        { id: 'maintenance', name: 'Maintenance Bay', x: 35, y: 70, width: 25, height: 25, color: 'purple', icon: '🔧', status: 'active', metrics: [{ label: 'Work Orders', value: '4' }] },
        { id: 'shipping', name: 'Shipping Dock', x: 65, y: 70, width: 30, height: 25, color: 'cyan', icon: '🚚', status: 'active', metrics: [{ label: 'Orders Ready', value: '12' }] },
      ],
      quickActions: [
        { id: 'start-line', label: 'Start Line', icon: '▶️', zoneId: 'line-1' },
        { id: 'quality-check', label: 'Quality Check', icon: '✅', zoneId: 'quality-station' },
        { id: 'dispatch', label: 'Dispatch Order', icon: '🚚', zoneId: 'shipping' },
      ],
    },
    {
      id: 'warehouse',
      name: 'Warehouse',
      description: 'Inventory management and logistics',
      icon: '📦',
      backgroundGradient: 'from-cyan-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'receiving', name: 'Receiving Dock', x: 5, y: 5, width: 30, height: 20, color: 'blue', icon: '📥', status: 'active', metrics: [{ label: 'Inbound', value: '8' }] },
        { id: 'raw-materials', name: 'Raw Materials', x: 5, y: 30, width: 25, height: 35, color: 'amber', icon: '🪵', status: 'active', metrics: [{ label: 'SKUs', value: '847' }] },
        { id: 'wip', name: 'Work in Progress', x: 35, y: 30, width: 30, height: 35, color: 'purple', icon: '⚙️', status: 'warning', metrics: [{ label: 'Units', value: '1,234' }] },
        { id: 'finished-goods', name: 'Finished Goods', x: 70, y: 30, width: 25, height: 35, color: 'emerald', icon: '✅', status: 'active', metrics: [{ label: 'Units', value: '5,678' }] },
        { id: 'shipping-dock', name: 'Shipping Dock', x: 65, y: 5, width: 30, height: 20, color: 'cyan', icon: '📤', status: 'active', metrics: [{ label: 'Outbound', value: '12' }] },
        { id: 'staging', name: 'Staging Area', x: 35, y: 70, width: 30, height: 25, color: 'slate', icon: '📋', status: 'active', metrics: [{ label: 'Orders', value: '24' }] },
      ],
      quickActions: [
        { id: 'receive', label: 'Receive Shipment', icon: '📥', zoneId: 'receiving' },
        { id: 'pick-order', label: 'Pick Order', icon: '🛒', zoneId: 'finished-goods' },
        { id: 'ship', label: 'Ship Order', icon: '🚚', zoneId: 'shipping-dock' },
      ],
    },
    {
      id: 'control-room',
      name: 'Control Room',
      description: 'Operations command center',
      icon: '🖥️',
      backgroundGradient: 'from-violet-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'main-display', name: 'Main Display Wall', x: 10, y: 5, width: 80, height: 25, color: 'cyan', icon: '📺', status: 'active', metrics: [{ label: 'Screens', value: '12' }] },
        { id: 'ops-desk-1', name: 'Operations Desk 1', x: 5, y: 35, width: 28, height: 25, color: 'blue', icon: '👨‍💻', status: 'active', metrics: [{ label: 'Operator', value: 'Active' }] },
        { id: 'ops-desk-2', name: 'Operations Desk 2', x: 36, y: 35, width: 28, height: 25, color: 'blue', icon: '👨‍💻', status: 'active', metrics: [{ label: 'Operator', value: 'Active' }] },
        { id: 'ops-desk-3', name: 'Operations Desk 3', x: 67, y: 35, width: 28, height: 25, color: 'blue', icon: '👨‍💻', status: 'idle' },
        { id: 'supervisor', name: 'Supervisor Station', x: 35, y: 65, width: 30, height: 20, color: 'amber', icon: '👔', status: 'active' },
        { id: 'alerts-panel', name: 'Alerts Panel', x: 5, y: 65, width: 25, height: 30, color: 'red', icon: '🚨', status: 'warning', metrics: [{ label: 'Active Alerts', value: '3' }] },
        { id: 'kpi-board', name: 'KPI Board', x: 70, y: 65, width: 25, height: 30, color: 'emerald', icon: '📊', status: 'active', metrics: [{ label: 'On Target', value: '94%' }] },
      ],
      quickActions: [
        { id: 'acknowledge', label: 'Acknowledge Alert', icon: '✅', zoneId: 'alerts-panel' },
        { id: 'escalate', label: 'Escalate Issue', icon: '⬆️', zoneId: 'supervisor' },
        { id: 'update-display', label: 'Update Display', icon: '🔄', zoneId: 'main-display' },
      ],
    },
  ],
};

// =============================================================================
// FINANCIAL SERVICES VERTICAL LAYOUTS
// =============================================================================
export const financialLayouts: VerticalLayoutConfig = {
  verticalId: 'financial',
  verticalName: 'Financial Services',
  layouts: [
    {
      id: 'trading-floor',
      name: 'Trading Floor',
      description: 'Real-time market operations center',
      icon: '📈',
      backgroundGradient: 'from-emerald-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'market-display', name: 'Market Display', x: 10, y: 5, width: 80, height: 20, color: 'cyan', icon: '📊', status: 'active', metrics: [{ label: 'Indices', value: '↑ 1.2%' }] },
        { id: 'equities-desk', name: 'Equities Desk', x: 5, y: 30, width: 28, height: 30, color: 'emerald', icon: '📈', status: 'active', metrics: [{ label: 'Volume', value: '$42M' }] },
        { id: 'fixed-income', name: 'Fixed Income', x: 36, y: 30, width: 28, height: 30, color: 'blue', icon: '📉', status: 'active', metrics: [{ label: 'Yield', value: '4.2%' }] },
        { id: 'derivatives', name: 'Derivatives', x: 67, y: 30, width: 28, height: 30, color: 'purple', icon: '🔄', status: 'warning', metrics: [{ label: 'Greeks', value: 'Δ 0.42' }] },
        { id: 'risk-desk', name: 'Risk Management', x: 5, y: 65, width: 30, height: 30, color: 'amber', icon: '⚠️', status: 'active', metrics: [{ label: 'VaR', value: '$12M' }] },
        { id: 'compliance', name: 'Compliance', x: 40, y: 65, width: 25, height: 30, color: 'rose', icon: '🛡️', status: 'active', metrics: [{ label: 'Alerts', value: '2' }] },
        { id: 'execution', name: 'Execution', x: 70, y: 65, width: 25, height: 30, color: 'cyan', icon: '⚡', status: 'active', metrics: [{ label: 'Latency', value: '0.3ms' }] },
      ],
      quickActions: [
        { id: 'execute-trade', label: 'Execute Trade', icon: '⚡', zoneId: 'execution' },
        { id: 'risk-check', label: 'Risk Check', icon: '🔍', zoneId: 'risk-desk' },
        { id: 'compliance-review', label: 'Compliance Review', icon: '✅', zoneId: 'compliance' },
      ],
    },
    {
      id: 'wealth-office',
      name: 'Wealth Management Office',
      description: 'Client advisory and portfolio management',
      icon: '💼',
      backgroundGradient: 'from-amber-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'client-meeting', name: 'Client Meeting Room', x: 5, y: 10, width: 40, height: 40, color: 'amber', icon: '🤝', status: 'active', metrics: [{ label: 'Meetings Today', value: '4' }] },
        { id: 'portfolio-review', name: 'Portfolio Review', x: 50, y: 10, width: 45, height: 25, color: 'emerald', icon: '📊', status: 'active', metrics: [{ label: 'AUM', value: '$847M' }] },
        { id: 'research', name: 'Research Center', x: 50, y: 40, width: 45, height: 25, color: 'blue', icon: '📚', status: 'active', metrics: [{ label: 'Reports', value: '12' }] },
        { id: 'advisor-desks', name: 'Advisor Desks', x: 5, y: 55, width: 40, height: 40, color: 'violet', icon: '👔', status: 'active', metrics: [{ label: 'Advisors', value: '8' }] },
        { id: 'compliance-corner', name: 'Compliance', x: 50, y: 70, width: 20, height: 25, color: 'rose', icon: '🛡️', status: 'active' },
        { id: 'ops-support', name: 'Operations', x: 75, y: 70, width: 20, height: 25, color: 'cyan', icon: '⚙️', status: 'active', metrics: [{ label: 'Tickets', value: '5' }] },
      ],
      quickActions: [
        { id: 'schedule-meeting', label: 'Schedule Meeting', icon: '📅', zoneId: 'client-meeting' },
        { id: 'review-portfolio', label: 'Review Portfolio', icon: '📊', zoneId: 'portfolio-review' },
        { id: 'generate-report', label: 'Generate Report', icon: '📄', zoneId: 'research' },
      ],
    },
    {
      id: 'operations-center',
      name: 'Operations Center',
      description: 'Back-office processing and settlement',
      icon: '🏦',
      backgroundGradient: 'from-blue-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'settlement', name: 'Settlement', x: 5, y: 10, width: 30, height: 35, color: 'blue', icon: '✅', status: 'active', metrics: [{ label: 'Pending', value: '234' }] },
        { id: 'reconciliation', name: 'Reconciliation', x: 40, y: 10, width: 25, height: 35, color: 'amber', icon: '🔄', status: 'warning', metrics: [{ label: 'Breaks', value: '12' }] },
        { id: 'corporate-actions', name: 'Corporate Actions', x: 70, y: 10, width: 25, height: 35, color: 'purple', icon: '📋', status: 'active', metrics: [{ label: 'Events', value: '8' }] },
        { id: 'reporting', name: 'Regulatory Reporting', x: 5, y: 50, width: 30, height: 45, color: 'rose', icon: '📊', status: 'active', metrics: [{ label: 'Due Today', value: '3' }] },
        { id: 'client-services', name: 'Client Services', x: 40, y: 50, width: 25, height: 45, color: 'cyan', icon: '🎧', status: 'active', metrics: [{ label: 'Queue', value: '7' }] },
        { id: 'data-management', name: 'Data Management', x: 70, y: 50, width: 25, height: 45, color: 'emerald', icon: '💾', status: 'active', metrics: [{ label: 'Quality', value: '99.2%' }] },
      ],
      quickActions: [
        { id: 'process-settlement', label: 'Process Settlement', icon: '✅', zoneId: 'settlement' },
        { id: 'resolve-break', label: 'Resolve Break', icon: '🔧', zoneId: 'reconciliation' },
        { id: 'submit-report', label: 'Submit Report', icon: '📤', zoneId: 'reporting' },
      ],
    },
  ],
};

// =============================================================================
// GOVERNMENT VERTICAL LAYOUTS
// =============================================================================
export const governmentLayouts: VerticalLayoutConfig = {
  verticalId: 'government',
  verticalName: 'Government',
  layouts: [
    {
      id: 'command-center',
      name: 'Command Center',
      description: 'Emergency operations and coordination',
      icon: '🏛️',
      backgroundGradient: 'from-blue-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'situation-display', name: 'Situation Display', x: 10, y: 5, width: 80, height: 25, color: 'cyan', icon: '🗺️', status: 'active', metrics: [{ label: 'Active Incidents', value: '3' }] },
        { id: 'incident-command', name: 'Incident Command', x: 35, y: 35, width: 30, height: 25, color: 'amber', icon: '👔', status: 'active' },
        { id: 'fire-ems', name: 'Fire/EMS', x: 5, y: 35, width: 25, height: 25, color: 'red', icon: '🚒', status: 'active', metrics: [{ label: 'Units', value: '24' }] },
        { id: 'law-enforcement', name: 'Law Enforcement', x: 70, y: 35, width: 25, height: 25, color: 'blue', icon: '👮', status: 'active', metrics: [{ label: 'Units', value: '42' }] },
        { id: 'public-works', name: 'Public Works', x: 5, y: 65, width: 25, height: 30, color: 'amber', icon: '🚧', status: 'idle', metrics: [{ label: 'Crews', value: '8' }] },
        { id: 'communications', name: 'Communications', x: 35, y: 65, width: 30, height: 30, color: 'purple', icon: '📡', status: 'active', metrics: [{ label: 'Channels', value: '12' }] },
        { id: 'logistics', name: 'Logistics', x: 70, y: 65, width: 25, height: 30, color: 'emerald', icon: '📦', status: 'active', metrics: [{ label: 'Resources', value: '156' }] },
      ],
      quickActions: [
        { id: 'dispatch', label: 'Dispatch Units', icon: '🚨', zoneId: 'incident-command' },
        { id: 'broadcast', label: 'Public Broadcast', icon: '📢', zoneId: 'communications' },
        { id: 'request-resources', label: 'Request Resources', icon: '📋', zoneId: 'logistics' },
      ],
    },
    {
      id: 'council-chamber',
      name: 'Council Chamber',
      description: 'Legislative proceedings and public meetings',
      icon: '🏛️',
      backgroundGradient: 'from-violet-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'dais', name: 'Council Dais', x: 20, y: 5, width: 60, height: 20, color: 'violet', icon: '⚖️', status: 'active', metrics: [{ label: 'Members Present', value: '7/9' }] },
        { id: 'mayor', name: 'Mayor/Chair', x: 40, y: 5, width: 20, height: 10, color: 'amber', icon: '👔', status: 'active' },
        { id: 'clerk', name: 'City Clerk', x: 5, y: 30, width: 15, height: 20, color: 'blue', icon: '📋', status: 'active' },
        { id: 'attorney', name: 'City Attorney', x: 80, y: 30, width: 15, height: 20, color: 'rose', icon: '⚖️', status: 'active' },
        { id: 'podium', name: 'Public Podium', x: 40, y: 35, width: 20, height: 15, color: 'cyan', icon: '🎤', status: 'active', metrics: [{ label: 'Speakers', value: '12' }] },
        { id: 'gallery', name: 'Public Gallery', x: 15, y: 55, width: 70, height: 25, color: 'slate', icon: '👥', status: 'active', metrics: [{ label: 'Attendees', value: '45' }] },
        { id: 'press', name: 'Press Area', x: 5, y: 55, width: 8, height: 25, color: 'purple', icon: '📹', status: 'active' },
        { id: 'av-control', name: 'A/V Control', x: 87, y: 55, width: 8, height: 25, color: 'emerald', icon: '🎬', status: 'active' },
      ],
      quickActions: [
        { id: 'call-vote', label: 'Call Vote', icon: '🗳️', zoneId: 'dais' },
        { id: 'next-speaker', label: 'Next Speaker', icon: '➡️', zoneId: 'podium' },
        { id: 'record-motion', label: 'Record Motion', icon: '📝', zoneId: 'clerk' },
      ],
    },
    {
      id: 'permit-office',
      name: 'Permit & Services Office',
      description: 'Citizen services and permit processing',
      icon: '📋',
      backgroundGradient: 'from-emerald-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'reception', name: 'Reception', x: 30, y: 5, width: 40, height: 15, color: 'cyan', icon: '🪪', status: 'active', metrics: [{ label: 'Queue', value: '8' }] },
        { id: 'building-permits', name: 'Building Permits', x: 5, y: 25, width: 28, height: 30, color: 'amber', icon: '🏗️', status: 'active', metrics: [{ label: 'Pending', value: '34' }] },
        { id: 'business-licenses', name: 'Business Licenses', x: 36, y: 25, width: 28, height: 30, color: 'emerald', icon: '📜', status: 'active', metrics: [{ label: 'Pending', value: '12' }] },
        { id: 'zoning', name: 'Zoning & Planning', x: 67, y: 25, width: 28, height: 30, color: 'blue', icon: '🗺️', status: 'warning', metrics: [{ label: 'Reviews', value: '8' }] },
        { id: 'inspections', name: 'Inspections', x: 5, y: 60, width: 30, height: 35, color: 'purple', icon: '🔍', status: 'active', metrics: [{ label: 'Scheduled', value: '24' }] },
        { id: 'records', name: 'Records', x: 40, y: 60, width: 25, height: 35, color: 'slate', icon: '📁', status: 'active', metrics: [{ label: 'Requests', value: '15' }] },
        { id: 'payments', name: 'Payments', x: 70, y: 60, width: 25, height: 35, color: 'rose', icon: '💳', status: 'active', metrics: [{ label: 'Today', value: '$12,450' }] },
      ],
      quickActions: [
        { id: 'new-permit', label: 'New Permit', icon: '➕', zoneId: 'building-permits' },
        { id: 'schedule-inspection', label: 'Schedule Inspection', icon: '📅', zoneId: 'inspections' },
        { id: 'process-payment', label: 'Process Payment', icon: '💳', zoneId: 'payments' },
      ],
    },
  ],
};

// =============================================================================
// TECHNOLOGY VERTICAL LAYOUTS
// =============================================================================
export const technologyLayouts: VerticalLayoutConfig = {
  verticalId: 'technology',
  verticalName: 'Technology / SaaS',
  layouts: [
    {
      id: 'dev-ops-center',
      name: 'DevOps Command Center',
      description: 'CI/CD pipeline and infrastructure monitoring',
      icon: '🚀',
      backgroundGradient: 'from-violet-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'pipeline', name: 'CI/CD Pipeline', x: 5, y: 5, width: 60, height: 25, color: 'violet', icon: '🔄', status: 'active', metrics: [{ label: 'Deploys Today', value: '47' }] },
        { id: 'monitoring', name: 'System Monitoring', x: 70, y: 5, width: 25, height: 25, color: 'cyan', icon: '📊', status: 'active', metrics: [{ label: 'Uptime', value: '99.97%' }] },
        { id: 'kubernetes', name: 'Kubernetes Cluster', x: 5, y: 35, width: 30, height: 30, color: 'blue', icon: '☸️', status: 'active', metrics: [{ label: 'Pods', value: '234' }] },
        { id: 'databases', name: 'Databases', x: 40, y: 35, width: 25, height: 30, color: 'emerald', icon: '🗄️', status: 'active', metrics: [{ label: 'Connections', value: '1.2K' }] },
        { id: 'cdn', name: 'CDN / Edge', x: 70, y: 35, width: 25, height: 30, color: 'amber', icon: '🌐', status: 'active', metrics: [{ label: 'Cache Hit', value: '94%' }] },
        { id: 'incidents', name: 'Incident Response', x: 5, y: 70, width: 30, height: 25, color: 'red', icon: '🚨', status: 'idle', metrics: [{ label: 'Open', value: '0' }] },
        { id: 'security', name: 'Security Center', x: 40, y: 70, width: 25, height: 25, color: 'rose', icon: '🔒', status: 'active', metrics: [{ label: 'Threats', value: '0' }] },
        { id: 'logs', name: 'Log Analytics', x: 70, y: 70, width: 25, height: 25, color: 'slate', icon: '📝', status: 'active', metrics: [{ label: 'Events/s', value: '12K' }] },
      ],
      quickActions: [
        { id: 'deploy', label: 'Deploy', icon: '🚀', zoneId: 'pipeline' },
        { id: 'rollback', label: 'Rollback', icon: '⏪', zoneId: 'pipeline' },
        { id: 'scale', label: 'Scale Cluster', icon: '📈', zoneId: 'kubernetes' },
      ],
    },
    {
      id: 'product-war-room',
      name: 'Product War Room',
      description: 'Sprint planning and feature development',
      icon: '🎯',
      backgroundGradient: 'from-blue-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'roadmap', name: 'Product Roadmap', x: 5, y: 5, width: 60, height: 30, color: 'blue', icon: '🗺️', status: 'active', metrics: [{ label: 'Features', value: '24' }] },
        { id: 'sprint', name: 'Current Sprint', x: 70, y: 5, width: 25, height: 30, color: 'emerald', icon: '🏃', status: 'active', metrics: [{ label: 'Velocity', value: '94pts' }] },
        { id: 'backlog', name: 'Backlog', x: 5, y: 40, width: 30, height: 30, color: 'amber', icon: '📋', status: 'warning', metrics: [{ label: 'Items', value: '156' }] },
        { id: 'design', name: 'Design System', x: 40, y: 40, width: 25, height: 30, color: 'purple', icon: '🎨', status: 'active', metrics: [{ label: 'Components', value: '87' }] },
        { id: 'analytics', name: 'Product Analytics', x: 70, y: 40, width: 25, height: 30, color: 'cyan', icon: '📊', status: 'active', metrics: [{ label: 'DAU', value: '42K' }] },
        { id: 'feedback', name: 'User Feedback', x: 5, y: 75, width: 45, height: 20, color: 'rose', icon: '💬', status: 'active', metrics: [{ label: 'NPS', value: '+72' }] },
        { id: 'experiments', name: 'A/B Tests', x: 55, y: 75, width: 40, height: 20, color: 'violet', icon: '🧪', status: 'active', metrics: [{ label: 'Running', value: '8' }] },
      ],
      quickActions: [
        { id: 'create-story', label: 'Create Story', icon: '➕', zoneId: 'backlog' },
        { id: 'start-sprint', label: 'Start Sprint', icon: '▶️', zoneId: 'sprint' },
        { id: 'launch-experiment', label: 'Launch Test', icon: '🧪', zoneId: 'experiments' },
      ],
    },
    {
      id: 'exec-boardroom',
      name: 'Executive Boardroom',
      description: 'Strategic planning and investor relations',
      icon: '👔',
      backgroundGradient: 'from-amber-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'board-table', name: 'Board Table', x: 15, y: 20, width: 70, height: 45, color: 'amber', icon: '🪑', status: 'active', metrics: [{ label: 'Attendees', value: '8' }] },
        { id: 'metrics-display', name: 'Key Metrics', x: 25, y: 5, width: 50, height: 12, color: 'cyan', icon: '📊', status: 'active', metrics: [{ label: 'ARR', value: '$24M' }] },
        { id: 'ceo', name: 'CEO', x: 40, y: 20, width: 20, height: 10, color: 'violet', icon: '👔', status: 'active' },
        { id: 'investors', name: 'Investor Seats', x: 5, y: 35, width: 8, height: 20, color: 'emerald', icon: '💰', status: 'active' },
        { id: 'growth-chart', name: 'Growth Metrics', x: 5, y: 70, width: 30, height: 25, color: 'emerald', icon: '📈', status: 'active', metrics: [{ label: 'MoM', value: '+12%' }] },
        { id: 'runway', name: 'Runway', x: 40, y: 70, width: 25, height: 25, color: 'blue', icon: '✈️', status: 'active', metrics: [{ label: 'Months', value: '18' }] },
        { id: 'hiring', name: 'Hiring Plan', x: 70, y: 70, width: 25, height: 25, color: 'purple', icon: '👥', status: 'warning', metrics: [{ label: 'Open Roles', value: '12' }] },
      ],
      quickActions: [
        { id: 'present', label: 'Present Deck', icon: '📺', zoneId: 'metrics-display' },
        { id: 'forecast', label: 'Update Forecast', icon: '📊', zoneId: 'growth-chart' },
        { id: 'approve-hire', label: 'Approve Hire', icon: '✅', zoneId: 'hiring' },
      ],
    },
  ],
};

// =============================================================================
// ENERGY & UTILITIES VERTICAL LAYOUTS
// =============================================================================
export const energyLayouts: VerticalLayoutConfig = {
  verticalId: 'energy',
  verticalName: 'Energy & Utilities',
  layouts: [
    {
      id: 'grid-control',
      name: 'Grid Control Center',
      description: 'Power grid monitoring and dispatch',
      icon: '⚡',
      backgroundGradient: 'from-yellow-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'grid-map', name: 'Grid Overview', x: 5, y: 5, width: 60, height: 40, color: 'amber', icon: '🗺️', status: 'active', metrics: [{ label: 'Load', value: '2.4GW' }] },
        { id: 'generation', name: 'Generation Mix', x: 70, y: 5, width: 25, height: 20, color: 'emerald', icon: '⚡', status: 'active', metrics: [{ label: 'Renewable', value: '42%' }] },
        { id: 'demand', name: 'Demand Forecast', x: 70, y: 30, width: 25, height: 20, color: 'cyan', icon: '📈', status: 'active', metrics: [{ label: 'Peak', value: '6PM' }] },
        { id: 'solar', name: 'Solar Farms', x: 5, y: 50, width: 20, height: 25, color: 'amber', icon: '☀️', status: 'active', metrics: [{ label: 'Output', value: '420MW' }] },
        { id: 'wind', name: 'Wind Farms', x: 30, y: 50, width: 20, height: 25, color: 'cyan', icon: '💨', status: 'active', metrics: [{ label: 'Output', value: '380MW' }] },
        { id: 'thermal', name: 'Thermal Plants', x: 55, y: 50, width: 20, height: 25, color: 'red', icon: '🔥', status: 'warning', metrics: [{ label: 'Output', value: '1.2GW' }] },
        { id: 'storage', name: 'Battery Storage', x: 80, y: 50, width: 15, height: 25, color: 'purple', icon: '🔋', status: 'active', metrics: [{ label: 'Charge', value: '78%' }] },
        { id: 'outages', name: 'Outage Management', x: 5, y: 80, width: 45, height: 15, color: 'rose', icon: '🚨', status: 'idle', metrics: [{ label: 'Active', value: '0' }] },
        { id: 'dispatch', name: 'Dispatch Center', x: 55, y: 80, width: 40, height: 15, color: 'blue', icon: '📞', status: 'active', metrics: [{ label: 'Crews', value: '24' }] },
      ],
      quickActions: [
        { id: 'dispatch-crew', label: 'Dispatch Crew', icon: '🚚', zoneId: 'dispatch' },
        { id: 'adjust-generation', label: 'Adjust Generation', icon: '⚡', zoneId: 'generation' },
        { id: 'activate-storage', label: 'Activate Storage', icon: '🔋', zoneId: 'storage' },
      ],
    },
    {
      id: 'substation',
      name: 'Substation View',
      description: 'Individual substation monitoring',
      icon: '🔌',
      backgroundGradient: 'from-blue-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'transformer-1', name: 'Transformer 1', x: 5, y: 10, width: 28, height: 35, color: 'blue', icon: '🔌', status: 'active', metrics: [{ label: 'Load', value: '87%' }] },
        { id: 'transformer-2', name: 'Transformer 2', x: 36, y: 10, width: 28, height: 35, color: 'blue', icon: '🔌', status: 'active', metrics: [{ label: 'Load', value: '72%' }] },
        { id: 'transformer-3', name: 'Transformer 3', x: 67, y: 10, width: 28, height: 35, color: 'amber', icon: '🔌', status: 'warning', metrics: [{ label: 'Load', value: '94%' }] },
        { id: 'switchgear', name: 'Switchgear', x: 5, y: 50, width: 45, height: 20, color: 'emerald', icon: '🔀', status: 'active', metrics: [{ label: 'Breakers', value: '12/12' }] },
        { id: 'protection', name: 'Protection Relays', x: 55, y: 50, width: 40, height: 20, color: 'purple', icon: '🛡️', status: 'active', metrics: [{ label: 'Status', value: 'Armed' }] },
        { id: 'scada', name: 'SCADA Terminal', x: 5, y: 75, width: 30, height: 20, color: 'cyan', icon: '🖥️', status: 'active' },
        { id: 'alarms', name: 'Alarm Panel', x: 40, y: 75, width: 25, height: 20, color: 'red', icon: '🚨', status: 'idle', metrics: [{ label: 'Active', value: '0' }] },
        { id: 'logs', name: 'Event Logs', x: 70, y: 75, width: 25, height: 20, color: 'slate', icon: '📝', status: 'active' },
      ],
      quickActions: [
        { id: 'trip-breaker', label: 'Trip Breaker', icon: '⚡', zoneId: 'switchgear' },
        { id: 'acknowledge', label: 'Acknowledge Alarm', icon: '✅', zoneId: 'alarms' },
        { id: 'load-transfer', label: 'Load Transfer', icon: '🔄', zoneId: 'transformer-1' },
      ],
    },
    {
      id: 'renewable-ops',
      name: 'Renewable Operations',
      description: 'Solar and wind farm management',
      icon: '🌱',
      backgroundGradient: 'from-emerald-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'weather', name: 'Weather Forecast', x: 5, y: 5, width: 40, height: 25, color: 'cyan', icon: '🌤️', status: 'active', metrics: [{ label: 'Irradiance', value: '850W/m²' }] },
        { id: 'production', name: 'Production Forecast', x: 50, y: 5, width: 45, height: 25, color: 'emerald', icon: '📈', status: 'active', metrics: [{ label: 'Today', value: '12.4GWh' }] },
        { id: 'solar-array', name: 'Solar Arrays', x: 5, y: 35, width: 45, height: 30, color: 'amber', icon: '☀️', status: 'active', metrics: [{ label: 'Panels', value: '24,000' }] },
        { id: 'wind-turbines', name: 'Wind Turbines', x: 55, y: 35, width: 40, height: 30, color: 'blue', icon: '💨', status: 'active', metrics: [{ label: 'Turbines', value: '48' }] },
        { id: 'inverters', name: 'Inverters', x: 5, y: 70, width: 30, height: 25, color: 'purple', icon: '🔄', status: 'active', metrics: [{ label: 'Efficiency', value: '98.2%' }] },
        { id: 'grid-tie', name: 'Grid Connection', x: 40, y: 70, width: 25, height: 25, color: 'emerald', icon: '🔌', status: 'active', metrics: [{ label: 'Export', value: '420MW' }] },
        { id: 'maintenance', name: 'Maintenance', x: 70, y: 70, width: 25, height: 25, color: 'rose', icon: '🔧', status: 'warning', metrics: [{ label: 'Scheduled', value: '3' }] },
      ],
      quickActions: [
        { id: 'curtail', label: 'Curtail Output', icon: '📉', zoneId: 'production' },
        { id: 'schedule-maint', label: 'Schedule Maintenance', icon: '📅', zoneId: 'maintenance' },
        { id: 'optimize', label: 'Optimize Tracking', icon: '🎯', zoneId: 'solar-array' },
      ],
    },
  ],
};

// =============================================================================
// RETAIL VERTICAL LAYOUTS
// =============================================================================
export const retailLayouts: VerticalLayoutConfig = {
  verticalId: 'retail',
  verticalName: 'Retail & E-commerce',
  layouts: [
    {
      id: 'store-floor',
      name: 'Store Floor',
      description: 'Retail store operations and customer flow',
      icon: '🏪',
      backgroundGradient: 'from-rose-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'entrance', name: 'Entrance', x: 40, y: 5, width: 20, height: 10, color: 'cyan', icon: '🚪', status: 'active', metrics: [{ label: 'Traffic', value: '142/hr' }] },
        { id: 'checkout', name: 'Checkout', x: 5, y: 5, width: 30, height: 20, color: 'emerald', icon: '💳', status: 'active', metrics: [{ label: 'Open Lanes', value: '4/6' }] },
        { id: 'apparel', name: 'Apparel', x: 5, y: 30, width: 25, height: 35, color: 'purple', icon: '👕', status: 'active', metrics: [{ label: 'Sales', value: '$2.4K' }] },
        { id: 'electronics', name: 'Electronics', x: 35, y: 30, width: 30, height: 35, color: 'blue', icon: '📱', status: 'active', metrics: [{ label: 'Sales', value: '$4.8K' }] },
        { id: 'home', name: 'Home & Garden', x: 70, y: 30, width: 25, height: 35, color: 'amber', icon: '🏠', status: 'warning', metrics: [{ label: 'Sales', value: '$1.2K' }] },
        { id: 'customer-service', name: 'Customer Service', x: 70, y: 5, width: 25, height: 20, color: 'rose', icon: '🎧', status: 'active', metrics: [{ label: 'Queue', value: '3' }] },
        { id: 'stockroom', name: 'Stockroom', x: 5, y: 70, width: 30, height: 25, color: 'slate', icon: '📦', status: 'active', metrics: [{ label: 'Picks', value: '24' }] },
        { id: 'receiving', name: 'Receiving', x: 40, y: 70, width: 25, height: 25, color: 'cyan', icon: '🚚', status: 'active', metrics: [{ label: 'Inbound', value: '2' }] },
        { id: 'office', name: 'Manager Office', x: 70, y: 70, width: 25, height: 25, color: 'violet', icon: '👔', status: 'active' },
      ],
      quickActions: [
        { id: 'open-lane', label: 'Open Lane', icon: '➕', zoneId: 'checkout' },
        { id: 'page-associate', label: 'Page Associate', icon: '📢', zoneId: 'apparel' },
        { id: 'check-inventory', label: 'Check Inventory', icon: '📦', zoneId: 'stockroom' },
      ],
    },
    {
      id: 'ecommerce-ops',
      name: 'E-commerce Operations',
      description: 'Online store and fulfillment center',
      icon: '🛒',
      backgroundGradient: 'from-cyan-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'website', name: 'Website Dashboard', x: 5, y: 5, width: 45, height: 30, color: 'cyan', icon: '🌐', status: 'active', metrics: [{ label: 'Visitors', value: '4.2K' }] },
        { id: 'orders', name: 'Order Management', x: 55, y: 5, width: 40, height: 30, color: 'emerald', icon: '📋', status: 'active', metrics: [{ label: 'Pending', value: '156' }] },
        { id: 'cart', name: 'Cart Analytics', x: 5, y: 40, width: 25, height: 25, color: 'amber', icon: '🛒', status: 'warning', metrics: [{ label: 'Abandon', value: '24%' }] },
        { id: 'inventory', name: 'Inventory', x: 35, y: 40, width: 30, height: 25, color: 'blue', icon: '📦', status: 'active', metrics: [{ label: 'SKUs', value: '12.4K' }] },
        { id: 'shipping', name: 'Shipping', x: 70, y: 40, width: 25, height: 25, color: 'purple', icon: '🚚', status: 'active', metrics: [{ label: 'Today', value: '234' }] },
        { id: 'returns', name: 'Returns', x: 5, y: 70, width: 30, height: 25, color: 'rose', icon: '↩️', status: 'active', metrics: [{ label: 'Pending', value: '12' }] },
        { id: 'reviews', name: 'Reviews', x: 40, y: 70, width: 25, height: 25, color: 'violet', icon: '⭐', status: 'active', metrics: [{ label: 'Avg', value: '4.6' }] },
        { id: 'support', name: 'Customer Support', x: 70, y: 70, width: 25, height: 25, color: 'cyan', icon: '💬', status: 'active', metrics: [{ label: 'Tickets', value: '8' }] },
      ],
      quickActions: [
        { id: 'process-order', label: 'Process Order', icon: '✅', zoneId: 'orders' },
        { id: 'update-inventory', label: 'Update Inventory', icon: '📦', zoneId: 'inventory' },
        { id: 'respond-review', label: 'Respond to Review', icon: '💬', zoneId: 'reviews' },
      ],
    },
    {
      id: 'merchandising',
      name: 'Merchandising HQ',
      description: 'Category management and pricing',
      icon: '🏷️',
      backgroundGradient: 'from-purple-900/20 via-neutral-900 to-neutral-900',
      zones: [
        { id: 'category-perf', name: 'Category Performance', x: 5, y: 5, width: 60, height: 30, color: 'purple', icon: '📊', status: 'active', metrics: [{ label: 'Categories', value: '24' }] },
        { id: 'pricing', name: 'Pricing Engine', x: 70, y: 5, width: 25, height: 30, color: 'emerald', icon: '💵', status: 'active', metrics: [{ label: 'Changes', value: '156' }] },
        { id: 'promotions', name: 'Promotions', x: 5, y: 40, width: 30, height: 30, color: 'rose', icon: '🎉', status: 'active', metrics: [{ label: 'Active', value: '12' }] },
        { id: 'assortment', name: 'Assortment Planning', x: 40, y: 40, width: 30, height: 30, color: 'blue', icon: '📋', status: 'warning', metrics: [{ label: 'Reviews', value: '8' }] },
        { id: 'vendor', name: 'Vendor Portal', x: 75, y: 40, width: 20, height: 30, color: 'amber', icon: '🤝', status: 'active', metrics: [{ label: 'Vendors', value: '42' }] },
        { id: 'analytics', name: 'Sales Analytics', x: 5, y: 75, width: 45, height: 20, color: 'cyan', icon: '📈', status: 'active', metrics: [{ label: 'Revenue', value: '$1.2M' }] },
        { id: 'forecasting', name: 'Demand Forecast', x: 55, y: 75, width: 40, height: 20, color: 'violet', icon: '🔮', status: 'active', metrics: [{ label: 'Accuracy', value: '94%' }] },
      ],
      quickActions: [
        { id: 'update-price', label: 'Update Price', icon: '💵', zoneId: 'pricing' },
        { id: 'create-promo', label: 'Create Promotion', icon: '🎉', zoneId: 'promotions' },
        { id: 'review-assortment', label: 'Review Assortment', icon: '📋', zoneId: 'assortment' },
      ],
    },
  ],
};

// =============================================================================
// EXPORT ALL VERTICAL LAYOUTS
// =============================================================================
export const VERTICAL_LAYOUT_MAPS: Record<string, VerticalLayoutConfig> = {
  legal: legalLayouts,
  healthcare: healthcareLayouts,
  manufacturing: manufacturingLayouts,
  financial: financialLayouts,
  government: governmentLayouts,
  technology: technologyLayouts,
  energy: energyLayouts,
  retail: retailLayouts,
};

// Default layout for verticals without custom layouts
export const defaultLayout: LayoutMap = {
  id: 'default',
  name: 'Command Center',
  description: 'General operations dashboard',
  icon: '🎯',
  backgroundGradient: 'from-slate-900/20 via-neutral-900 to-neutral-900',
  zones: [
    { id: 'main-display', name: 'Main Display', x: 10, y: 5, width: 80, height: 30, color: 'cyan', icon: '📊', status: 'active' },
    { id: 'operations', name: 'Operations', x: 5, y: 40, width: 30, height: 30, color: 'blue', icon: '⚙️', status: 'active' },
    { id: 'analytics', name: 'Analytics', x: 40, y: 40, width: 25, height: 30, color: 'purple', icon: '📈', status: 'active' },
    { id: 'alerts', name: 'Alerts', x: 70, y: 40, width: 25, height: 30, color: 'amber', icon: '🔔', status: 'warning' },
    { id: 'team', name: 'Team', x: 5, y: 75, width: 45, height: 20, color: 'emerald', icon: '👥', status: 'active' },
    { id: 'actions', name: 'Quick Actions', x: 55, y: 75, width: 40, height: 20, color: 'violet', icon: '⚡', status: 'active' },
  ],
  quickActions: [
    { id: 'launch-council', label: 'Launch Council', icon: '🏛️' },
    { id: 'view-analytics', label: 'View Analytics', icon: '📊' },
    { id: 'manage-alerts', label: 'Manage Alerts', icon: '🔔' },
  ],
};

export function getVerticalLayouts(verticalId: string): LayoutMap[] {
  const config = VERTICAL_LAYOUT_MAPS[verticalId];
  if (config) {
    return config.layouts;
  }
  // Return default layout for verticals without custom layouts
  return [defaultLayout];
}

export function getLayoutById(verticalId: string, layoutId: string): LayoutMap | undefined {
  const layouts = getVerticalLayouts(verticalId);
  return layouts.find(l => l.id === layoutId) || layouts[0];
}
