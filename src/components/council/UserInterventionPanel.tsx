// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - USER INTERVENTION PANEL
// Allows users to participate in AI Council deliberations
// =============================================================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface UserRole {
  code: string;
  title: string;
  department: string;
  icon: string;
}

export interface UserIntervention {
  id: string;
  userId: string;
  userRole: UserRole;
  content: string;
  type: 'perspective' | 'question' | 'objection' | 'support' | 'data';
  timestamp: Date;
  targetAgentId?: string; // If responding to a specific agent
}

interface UserInterventionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intervention: Omit<UserIntervention, 'id' | 'timestamp'>) => void;
  currentPhase?: string;
  agentMessages?: { agentId: string; agentName: string; content: string }[];
  savedRole?: UserRole | null;
  onRoleSave?: (role: UserRole) => void;
  disabled?: boolean;
}

// =============================================================================
// PREDEFINED ROLES
// =============================================================================

const COMMON_ROLES: UserRole[] = [
  { code: 'ceo', title: 'CEO', department: 'Executive', icon: '👔' },
  { code: 'cfo', title: 'CFO', department: 'Finance', icon: '💰' },
  { code: 'coo', title: 'COO', department: 'Operations', icon: '⚙️' },
  { code: 'cto', title: 'CTO', department: 'Technology', icon: '💻' },
  { code: 'cmo', title: 'CMO', department: 'Marketing', icon: '📢' },
  { code: 'chro', title: 'CHRO', department: 'Human Resources', icon: '👥' },
  { code: 'ciso', title: 'CISO', department: 'Security', icon: '🔒' },
  { code: 'vp_sales', title: 'VP of Sales', department: 'Sales', icon: '📈' },
  { code: 'vp_product', title: 'VP of Product', department: 'Product', icon: '🎯' },
  { code: 'vp_engineering', title: 'VP of Engineering', department: 'Engineering', icon: '🛠️' },
  { code: 'director', title: 'Director', department: 'Management', icon: '📋' },
  { code: 'manager', title: 'Manager', department: 'Management', icon: '👤' },
  { code: 'analyst', title: 'Analyst', department: 'Analytics', icon: '📊' },
  { code: 'consultant', title: 'Consultant', department: 'Advisory', icon: '💡' },
  { code: 'board_member', title: 'Board Member', department: 'Governance', icon: '🏛️' },
  { code: 'investor', title: 'Investor', department: 'Stakeholder', icon: '💎' },
];

const INTERVENTION_TYPES = [
  {
    code: 'perspective',
    label: 'Share Perspective',
    icon: '💭',
    description: 'Add your viewpoint to the discussion',
  },
  {
    code: 'question',
    label: 'Ask Question',
    icon: '❓',
    description: 'Request clarification or more detail',
  },
  {
    code: 'objection',
    label: 'Raise Objection',
    icon: '⚠️',
    description: 'Challenge a point or assumption',
  },
  {
    code: 'support',
    label: 'Show Support',
    icon: '👍',
    description: "Endorse an agent's position",
  },
  {
    code: 'data',
    label: 'Provide Data',
    icon: '📊',
    description: 'Share relevant facts or figures',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const UserInterventionPanel: React.FC<UserInterventionPanelProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentPhase,
  agentMessages = [],
  savedRole,
  onRoleSave,
  disabled = false,
}) => {
  const [step, setStep] = useState<'role' | 'intervention'>(savedRole ? 'intervention' : 'role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(savedRole || null);
  const [customRole, setCustomRole] = useState({ title: '', department: '' });
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [interventionType, setInterventionType] = useState<string>('perspective');
  const [content, setContent] = useState('');
  const [targetAgent, setTargetAgent] = useState<string | undefined>(undefined);
  const [rememberRole, setRememberRole] = useState(true);

  // Reset when panel opens
  useEffect(() => {
    if (isOpen) {
      setStep(savedRole ? 'intervention' : 'role');
      setSelectedRole(savedRole || null);
      setContent('');
      setTargetAgent(undefined);
    }
  }, [isOpen, savedRole]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowCustomRole(false);
  };

  const handleCustomRoleSubmit = () => {
    if (customRole.title && customRole.department) {
      const role: UserRole = {
        code: `custom_${Date.now()}`,
        title: customRole.title,
        department: customRole.department,
        icon: '👤',
      };
      setSelectedRole(role);
      setShowCustomRole(false);
    }
  };

  const handleContinueToIntervention = () => {
    if (selectedRole) {
      if (rememberRole && onRoleSave) {
        onRoleSave(selectedRole);
      }
      setStep('intervention');
    }
  };

  const handleSubmit = () => {
    if (!selectedRole || !content.trim()) {
      return;
    }

    onSubmit({
      userId: 'current-user', // Would come from auth context
      userRole: selectedRole,
      content: content.trim(),
      type: interventionType as UserIntervention['type'],
      targetAgentId: targetAgent,
    });

    setContent('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎤</span>
              <div>
                <h2 className="text-xl font-bold">Your Voice in the Council</h2>
                <p className="text-primary-100 text-sm">
                  {step === 'role' ? 'First, tell us your role' : 'Share your perspective'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                step === 'role' ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'
              )}
            >
              {step === 'role' ? '1' : '✓'}
            </div>
            <div
              className={cn(
                'flex-1 h-1 rounded',
                step === 'intervention' ? 'bg-white' : 'bg-primary-500'
              )}
            />
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                step === 'intervention' ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'
              )}
            >
              2
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 'role' ? (
            <>
              {/* Role Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  What is your role? <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-neutral-500 mb-4">
                  This helps the AI Council understand your perspective and expertise.
                </p>

                {/* Common roles grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {COMMON_ROLES.map((role) => (
                    <button
                      key={role.code}
                      onClick={() => handleRoleSelect(role)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border text-left transition-all',
                        selectedRole?.code === role.code
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                          : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                      )}
                    >
                      <span className="text-xl">{role.icon}</span>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{role.title}</div>
                        <div className="text-xs text-neutral-500 truncate">{role.department}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom role */}
                <button
                  onClick={() => setShowCustomRole(!showCustomRole)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showCustomRole ? '− Hide custom role' : '+ Add custom role'}
                </button>

                {showCustomRole && (
                  <div className="mt-3 p-4 bg-neutral-50 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={customRole.title}
                          onChange={(e) =>
                            setCustomRole((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="e.g., Senior Architect"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Department *
                        </label>
                        <input
                          type="text"
                          value={customRole.department}
                          onChange={(e) =>
                            setCustomRole((prev) => ({ ...prev, department: e.target.value }))
                          }
                          placeholder="e.g., Architecture"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCustomRoleSubmit}
                      disabled={!customRole.title || !customRole.department}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Use This Role
                    </button>
                  </div>
                )}
              </div>

              {/* Remember role checkbox */}
              <label className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
                <input
                  type="checkbox"
                  checked={rememberRole}
                  onChange={(e) => setRememberRole(e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                Remember my role for future interventions
              </label>
            </>
          ) : (
            <>
              {/* Intervention Form */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4 p-3 bg-primary-50 rounded-lg">
                  <span className="text-xl">{selectedRole?.icon}</span>
                  <div>
                    <span className="font-medium text-primary-900">{selectedRole?.title}</span>
                    <span className="text-primary-600 text-sm ml-2">
                      ({selectedRole?.department})
                    </span>
                  </div>
                  <button
                    onClick={() => setStep('role')}
                    className="ml-auto text-sm text-primary-600 hover:text-primary-700"
                  >
                    Change
                  </button>
                </div>

                {/* Current phase indicator */}
                {currentPhase && (
                  <div className="mb-4 text-sm text-neutral-500">
                    Current deliberation phase:{' '}
                    <span className="font-medium text-neutral-700">{currentPhase}</span>
                  </div>
                )}

                {/* Intervention type selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Type of Intervention
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INTERVENTION_TYPES.map((type) => (
                      <button
                        key={type.code}
                        onClick={() => setInterventionType(type.code)}
                        className={cn(
                          'flex flex-col items-center p-3 rounded-lg border text-center transition-all',
                          interventionType === type.code
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-300'
                        )}
                      >
                        <span className="text-2xl mb-1">{type.icon}</span>
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target agent (optional) */}
                {agentMessages.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Responding to (optional)
                    </label>
                    <select
                      value={targetAgent || ''}
                      onChange={(e) => setTargetAgent(e.target.value || undefined)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">General comment (not directed at specific agent)</option>
                      {agentMessages.map((msg) => (
                        <option key={msg.agentId} value={msg.agentId}>
                          {msg.agentName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Content input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Input <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      interventionType === 'question'
                        ? 'What would you like to ask the Council?'
                        : interventionType === 'objection'
                          ? 'What concern would you like to raise?'
                          : interventionType === 'data'
                            ? 'What data or facts would you like to share?'
                            : 'Share your perspective with the Council...'
                    }
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                  <div className="flex justify-between mt-1 text-xs text-neutral-500">
                    <span>Be specific and provide context</span>
                    <span>{content.length} characters</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex justify-between">
          {step === 'role' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleContinueToIntervention}
                disabled={!selectedRole}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium text-white transition-all',
                  selectedRole
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-neutral-300 cursor-not-allowed'
                )}
              >
                Continue →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('role')}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={disabled || !content.trim()}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium text-white transition-all',
                  !disabled && content.trim()
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
                    : 'bg-neutral-300 cursor-not-allowed'
                )}
              >
                🎤 Submit Intervention
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInterventionPanel;
