// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * STUDENT SUCCESS DASHBOARD - Education Vertical
 * Student retention, performance tracking, and intervention management with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { GraduationCap, Users, TrendingUp, AlertTriangle, BookOpen, Bot, Target, Award } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface Student {
  id: string;
  name: string;
  program: string;
  gpa: number;
  credits: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  engagementScore: number;
  interventions: number;
}

interface Cohort {
  id: string;
  name: string;
  enrolled: number;
  retained: number;
  avgGpa: number;
  graduationRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'analyzing' | 'intervening';
  studentsMonitored: number;
  recentAction: string;
}

interface Intervention {
  id: string;
  type: 'academic' | 'financial' | 'wellness' | 'career';
  studentCount: number;
  successRate: number;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const AT_RISK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alex Chen', program: 'Computer Science', gpa: 2.1, credits: 45, riskLevel: 'critical', engagementScore: 32, interventions: 2 },
  { id: 's2', name: 'Maria Garcia', program: 'Business Admin', gpa: 2.4, credits: 62, riskLevel: 'high', engagementScore: 48, interventions: 1 },
  { id: 's3', name: 'James Wilson', program: 'Engineering', gpa: 2.6, credits: 38, riskLevel: 'high', engagementScore: 55, interventions: 0 },
  { id: 's4', name: 'Sarah Johnson', program: 'Nursing', gpa: 2.8, credits: 71, riskLevel: 'moderate', engagementScore: 62, interventions: 1 },
  { id: 's5', name: 'Michael Brown', program: 'Psychology', gpa: 2.5, credits: 52, riskLevel: 'high', engagementScore: 41, interventions: 0 },
];

const COHORTS: Cohort[] = [
  { id: 'c2024', name: 'Class of 2024', enrolled: 2847, retained: 2534, avgGpa: 3.12, graduationRate: 89, trend: 'up' },
  { id: 'c2025', name: 'Class of 2025', enrolled: 3124, retained: 2890, avgGpa: 3.08, graduationRate: 0, trend: 'stable' },
  { id: 'c2026', name: 'Class of 2026', enrolled: 2956, retained: 2801, avgGpa: 3.05, graduationRate: 0, trend: 'up' },
  { id: 'c2027', name: 'Class of 2027', enrolled: 3201, retained: 3102, avgGpa: 2.98, graduationRate: 0, trend: 'stable' },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'success', name: 'StudentSuccess', role: 'Retention AI', status: 'active', studentsMonitored: 847, recentAction: 'Identified 23 students showing early warning signs' },
  { id: 'learning', name: 'LearningAdvisor', role: 'Adaptive Learning', status: 'analyzing', studentsMonitored: 1234, recentAction: 'Personalizing study paths for 156 students' },
  { id: 'enroll', name: 'EnrollmentOptimizer', role: 'Enrollment AI', status: 'active', studentsMonitored: 0, recentAction: 'Predicting 94% yield for admitted students' },
  { id: 'career', name: 'WorkforceConnector', role: 'Career Services', status: 'active', studentsMonitored: 2100, recentAction: 'Matched 45 students with internship opportunities' },
];

const INTERVENTIONS: Intervention[] = [
  { id: 'tutor', type: 'academic', studentCount: 234, successRate: 78 },
  { id: 'aid', type: 'financial', studentCount: 156, successRate: 85 },
  { id: 'counsel', type: 'wellness', studentCount: 89, successRate: 72 },
  { id: 'intern', type: 'career', studentCount: 312, successRate: 91 },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const RiskBadge: React.FC<{ level: Student['riskLevel'] }> = ({ level }) => {
  const colors = {
    low: 'bg-emerald-900/50 text-emerald-400 border-emerald-500/30',
    moderate: 'bg-amber-900/50 text-amber-400 border-amber-500/30',
    high: 'bg-orange-900/50 text-orange-400 border-orange-500/30',
    critical: 'bg-red-900/50 text-red-400 border-red-500/30',
  };
  return (
    <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', colors[level])}>
      {level}
    </span>
  );
};

const StudentCard: React.FC<{ student: Student }> = ({ student }) => (
  <div className={cn(
    'p-2 rounded-lg border',
    student.riskLevel === 'critical' ? 'bg-red-900/10 border-red-500/30' :
    student.riskLevel === 'high' ? 'bg-orange-900/10 border-orange-500/30' :
    student.riskLevel === 'moderate' ? 'bg-amber-900/10 border-amber-500/30' :
    'bg-emerald-900/10 border-emerald-500/30'
  )}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium text-white">{student.name}</span>
      <RiskBadge level={student.riskLevel} />
    </div>
    <p className="text-[10px] text-gray-400 mb-1">{student.program}</p>
    <div className="grid grid-cols-3 gap-1 text-[10px]">
      <div>
        <p className="text-gray-500">GPA</p>
        <p className={cn('font-medium', student.gpa < 2.5 ? 'text-red-400' : 'text-white')}>{student.gpa.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-gray-500">Engagement</p>
        <p className={cn('font-medium', student.engagementScore < 50 ? 'text-amber-400' : 'text-white')}>{student.engagementScore}%</p>
      </div>
      <div>
        <p className="text-gray-500">Interventions</p>
        <p className="text-white font-medium">{student.interventions}</p>
      </div>
    </div>
  </div>
);

const CohortCard: React.FC<{ cohort: Cohort }> = ({ cohort }) => {
  const retentionRate = (cohort.retained / cohort.enrolled) * 100;
  
  return (
    <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-white">{cohort.name}</span>
        <span className={cn(
          'text-[10px]',
          cohort.trend === 'up' ? 'text-emerald-400' :
          cohort.trend === 'down' ? 'text-red-400' : 'text-gray-400'
        )}>
          {cohort.trend === 'up' ? '↑' : cohort.trend === 'down' ? '↓' : '→'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        <div>
          <p className="text-gray-500">Enrolled</p>
          <p className="text-white font-medium">{cohort.enrolled.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Retention</p>
          <p className="text-emerald-400 font-medium">{retentionRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-gray-500">Avg GPA</p>
          <p className="text-white font-medium">{cohort.avgGpa.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
        agent.status === 'analyzing' ? 'bg-cyan-900/50 text-cyan-400' :
        'bg-violet-900/50 text-violet-400'
      )}>
        <Bot className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white">{agent.name}</p>
        <p className="text-[10px] text-gray-500">{agent.role}</p>
      </div>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full animate-pulse',
        agent.status === 'active' ? 'bg-emerald-500' :
        agent.status === 'analyzing' ? 'bg-cyan-500' : 'bg-violet-500'
      )} />
    </div>
    {agent.studentsMonitored > 0 && (
      <p className="text-[10px] text-gray-400 mb-1">Monitoring {agent.studentsMonitored.toLocaleString()} students</p>
    )}
    <p className="text-[10px] text-cyan-400">🎯 {agent.recentAction}</p>
  </div>
);

const InterventionBar: React.FC<{ intervention: Intervention }> = ({ intervention }) => {
  const icons = {
    academic: <BookOpen className="w-3 h-3" />,
    financial: <Target className="w-3 h-3" />,
    wellness: <Users className="w-3 h-3" />,
    career: <Award className="w-3 h-3" />,
  };
  
  return (
    <div className="flex items-center gap-2 p-1.5 bg-sovereign-base rounded">
      <span className="text-gray-400">{icons[intervention.type]}</span>
      <span className="text-[10px] text-gray-300 capitalize w-14">{intervention.type}</span>
      <div className="flex-1 h-2 bg-sovereign-elevated rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
          style={{ width: `${intervention.successRate}%` }}
        />
      </div>
      <span className="text-[10px] text-emerald-400 w-8 text-right">{intervention.successRate}%</span>
      <span className="text-[10px] text-gray-500 w-12 text-right">{intervention.studentCount}</span>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const StudentSuccessDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [students, setStudents] = useState<Student[]>(AT_RISK_STUDENTS);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate engagement score changes
      setStudents(prev => prev.map((s): Student => ({
        ...s,
        engagementScore: Math.max(10, Math.min(100, s.engagementScore + Math.floor((deterministicFloat('studentsuccess-1') - 0.5) * 5))),
      })));

      // Simulate agent status changes
      setAgents(prev => prev.map((a): AIAgent => ({
        ...a,
        status: deterministicFloat('studentsuccess-2') > 0.7 ? 'analyzing' : 'active',
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const totalEnrolled = COHORTS.reduce((sum, c) => sum + c.enrolled, 0);
  const totalRetained = COHORTS.reduce((sum, c) => sum + c.retained, 0);
  const overallRetention = (totalRetained / totalEnrolled) * 100;
  const atRiskCount = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <GraduationCap className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{totalEnrolled.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Total Enrolled</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <TrendingUp className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{overallRetention.toFixed(1)}%</p>
          <p className="text-[10px] text-gray-400">Retention Rate</p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <AlertTriangle className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold text-white">{atRiskCount}</p>
          <p className="text-[10px] text-gray-400">At-Risk Students</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <Bot className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
          <p className="text-lg font-bold text-white">{agents.filter(a => a.status === 'active').length}</p>
          <p className="text-[10px] text-gray-400">Active Agents</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 h-[calc(100%-80px)]">
        {/* Left - At-Risk Students */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> At-Risk Students
          </h3>
          <div className="space-y-2">
            {students.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>

        {/* Middle - Cohorts & Interventions */}
        <div className="overflow-y-auto space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <Users className="w-3 h-3" /> Cohort Performance
            </h3>
            <div className="space-y-2">
              {COHORTS.map(cohort => (
                <CohortCard key={cohort.id} cohort={cohort} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <Target className="w-3 h-3" /> Intervention Success Rates
            </h3>
            <div className="space-y-1">
              {INTERVENTIONS.map(i => (
                <InterventionBar key={i.id} intervention={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Education Agents
          </h3>
          <div className="space-y-2">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live Monitoring</span>
      </div>
    </div>
  );
};

export default StudentSuccessDashboard;
