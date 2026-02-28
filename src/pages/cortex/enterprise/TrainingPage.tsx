// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA TRAINING™ - LEARNING MANAGEMENT SYSTEM
// Onboarding verification, role-based training, and certification tracking
// "From Day 1 to Mastery • Complete Learning Journey"
// =============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type CourseStatus = 'not-started' | 'in-progress' | 'completed' | 'expired';
type CourseCategory =
  | 'onboarding'
  | 'security'
  | 'compliance'
  | 'product'
  | 'role-specific'
  | 'leadership';
type CertificationStatus = 'valid' | 'expiring-soon' | 'expired' | 'not-certified';

interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  duration: string;
  modules: number;
  completedModules: number;
  status: CourseStatus;
  required: boolean;
  dueDate?: Date;
  completedDate?: Date;
  score?: number;
  passingScore: number;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  earnedDate?: Date;
  expiryDate?: Date;
  status: CertificationStatus;
  courses: string[];
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  role: string;
  courses: string[];
  progress: number;
  totalHours: number;
  completedHours: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  completedCourses: number;
  totalRequired: number;
  overdueCourses: number;
  lastActivity: Date;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const mockCourses: Course[] = [
  // Onboarding
  {
    id: 'C001',
    title: 'Datacendia Platform Fundamentals',
    description: 'Core platform concepts and navigation',
    category: 'onboarding',
    duration: '45 min',
    modules: 5,
    completedModules: 5,
    status: 'completed',
    required: true,
    completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    score: 92,
    passingScore: 80,
  },
  {
    id: 'C002',
    title: 'Council of Agents Overview',
    description: 'How AI deliberation works',
    category: 'onboarding',
    duration: '30 min',
    modules: 4,
    completedModules: 4,
    status: 'completed',
    required: true,
    completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    score: 88,
    passingScore: 80,
  },
  {
    id: 'C003',
    title: 'Data Integration Basics',
    description: 'Connecting data sources',
    category: 'onboarding',
    duration: '60 min',
    modules: 6,
    completedModules: 3,
    status: 'in-progress',
    required: true,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    passingScore: 80,
  },

  // Security
  {
    id: 'C004',
    title: 'Security Awareness Training',
    description: 'Annual security best practices',
    category: 'security',
    duration: '45 min',
    modules: 5,
    completedModules: 5,
    status: 'completed',
    required: true,
    completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    score: 95,
    passingScore: 85,
  },
  {
    id: 'C005',
    title: 'Phishing Prevention',
    description: 'Identify and report phishing attempts',
    category: 'security',
    duration: '20 min',
    modules: 3,
    completedModules: 0,
    status: 'not-started',
    required: true,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    passingScore: 90,
  },

  // Compliance
  {
    id: 'C006',
    title: 'GDPR Fundamentals',
    description: 'Data privacy requirements',
    category: 'compliance',
    duration: '60 min',
    modules: 8,
    completedModules: 8,
    status: 'completed',
    required: true,
    completedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    score: 90,
    passingScore: 85,
  },
  {
    id: 'C007',
    title: 'SOC 2 Controls Overview',
    description: 'Understanding TSC requirements',
    category: 'compliance',
    duration: '90 min',
    modules: 10,
    completedModules: 0,
    status: 'not-started',
    required: false,
    passingScore: 80,
  },

  // Product
  {
    id: 'C008',
    title: 'Advanced Deliberation Techniques',
    description: 'Power user features',
    category: 'product',
    duration: '45 min',
    modules: 5,
    completedModules: 2,
    status: 'in-progress',
    required: false,
    passingScore: 75,
  },
  {
    id: 'C009',
    title: 'Chronos Time Machine Deep Dive',
    description: 'Historical analysis and simulation',
    category: 'product',
    duration: '60 min',
    modules: 6,
    completedModules: 0,
    status: 'not-started',
    required: false,
    passingScore: 75,
  },

  // Role-specific
  {
    id: 'C010',
    title: 'Analyst Certification Program',
    description: 'Advanced analytics and reporting',
    category: 'role-specific',
    duration: '3 hr',
    modules: 12,
    completedModules: 0,
    status: 'not-started',
    required: false,
    passingScore: 85,
  },
  {
    id: 'C011',
    title: 'Admin Console Mastery',
    description: 'Platform administration',
    category: 'role-specific',
    duration: '2 hr',
    modules: 8,
    completedModules: 4,
    status: 'in-progress',
    required: true,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    passingScore: 85,
  },
];

const mockCertifications: Certification[] = [
  {
    id: 'CERT001',
    name: 'Datacendia Certified User',
    issuer: 'Datacendia',
    earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 358 * 24 * 60 * 60 * 1000),
    status: 'valid',
    courses: ['C001', 'C002'],
  },
  {
    id: 'CERT002',
    name: 'Security Awareness Certified',
    issuer: 'Datacendia',
    earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    status: 'valid',
    courses: ['C004'],
  },
  {
    id: 'CERT003',
    name: 'GDPR Compliance Certified',
    issuer: 'Datacendia',
    earnedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'expiring-soon',
    courses: ['C006'],
  },
  {
    id: 'CERT004',
    name: 'Datacendia Admin Certified',
    issuer: 'Datacendia',
    status: 'not-certified',
    courses: ['C011'],
  },
];

const mockLearningPaths: LearningPath[] = [
  {
    id: 'LP001',
    name: 'New Employee Onboarding',
    description: 'Essential training for all new hires',
    role: 'All',
    courses: ['C001', 'C002', 'C003', 'C004'],
    progress: 75,
    totalHours: 3,
    completedHours: 2.25,
  },
  {
    id: 'LP002',
    name: 'Security & Compliance Track',
    description: 'Required security and compliance training',
    role: 'All',
    courses: ['C004', 'C005', 'C006'],
    progress: 66,
    totalHours: 2,
    completedHours: 1.75,
  },
  {
    id: 'LP003',
    name: 'Platform Admin Path',
    description: 'For administrators and power users',
    role: 'Admin',
    courses: ['C001', 'C002', 'C008', 'C011'],
    progress: 50,
    totalHours: 4,
    completedHours: 2,
  },
  {
    id: 'LP004',
    name: 'Analyst Certification Path',
    description: 'Advanced analytics training',
    role: 'Analyst',
    courses: ['C001', 'C002', 'C008', 'C009', 'C010'],
    progress: 25,
    totalHours: 6,
    completedHours: 1.5,
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: 'U001',
    name: 'Alex Johnson',
    role: 'Analyst',
    department: 'Finance',
    completedCourses: 8,
    totalRequired: 10,
    overdueCourses: 0,
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'U002',
    name: 'Sarah Williams',
    role: 'Manager',
    department: 'Operations',
    completedCourses: 12,
    totalRequired: 12,
    overdueCourses: 0,
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'U003',
    name: 'Mike Chen',
    role: 'Analyst',
    department: 'Finance',
    completedCourses: 5,
    totalRequired: 10,
    overdueCourses: 2,
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'U004',
    name: 'Emily Davis',
    role: 'Admin',
    department: 'IT',
    completedCourses: 15,
    totalRequired: 15,
    overdueCourses: 0,
    lastActivity: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'U005',
    name: 'James Wilson',
    role: 'Analyst',
    department: 'Security',
    completedCourses: 9,
    totalRequired: 12,
    overdueCourses: 1,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getCategoryColor = (category: CourseCategory) => {
  switch (category) {
    case 'onboarding':
      return 'bg-blue-500/20 text-blue-400';
    case 'security':
      return 'bg-red-500/20 text-red-400';
    case 'compliance':
      return 'bg-purple-500/20 text-purple-400';
    case 'product':
      return 'bg-green-500/20 text-green-400';
    case 'role-specific':
      return 'bg-orange-500/20 text-orange-400';
    case 'leadership':
      return 'bg-cyan-500/20 text-cyan-400';
  }
};

const getStatusColor = (status: CourseStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'not-started':
      return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    case 'expired':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

const getCertStatusColor = (status: CertificationStatus) => {
  switch (status) {
    case 'valid':
      return 'bg-green-500/20 text-green-400 border-green-500';
    case 'expiring-soon':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    case 'expired':
      return 'bg-red-500/20 text-red-400 border-red-500';
    case 'not-certified':
      return 'bg-neutral-500/20 text-neutral-400 border-neutral-600';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getDaysUntil = (date: Date) => {
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) {return `${Math.abs(days)}d overdue`;}
  if (days === 0) {return 'Today';}
  if (days === 1) {return 'Tomorrow';}
  return `${days} days`;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'my-learning' | 'courses' | 'certifications' | 'team' | 'reports'
  >('my-learning');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterCategory, setFilterCategory] = useState<CourseCategory | 'all'>('all');

  const requiredCourses = mockCourses.filter((c) => c.required);
  const completedRequired = requiredCourses.filter((c) => c.status === 'completed').length;
  const overdueCourses = mockCourses.filter(
    (c) => c.required && c.dueDate && c.dueDate < new Date() && c.status !== 'completed'
  );

  const filteredCourses =
    filterCategory === 'all'
      ? mockCourses
      : mockCourses.filter((c) => c.category === filterCategory);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎓</span>
          <h1 className="text-3xl font-bold">Training & Certification</h1>
        </div>
        <p className="text-neutral-400">
          Learning management • Onboarding verification • Certification tracking
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700 pb-2">
        {[
          { id: 'my-learning', label: 'My Learning', icon: '📚' },
          { id: 'courses', label: 'All Courses', icon: '📖' },
          { id: 'certifications', label: 'Certifications', icon: '🏆' },
          { id: 'team', label: 'Team Progress', icon: '👥' },
          { id: 'reports', label: 'Reports', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* My Learning Tab */}
      {activeTab === 'my-learning' && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: 'Completed Courses',
                value: mockCourses.filter((c) => c.status === 'completed').length,
                total: mockCourses.length,
                color: 'text-green-400',
                icon: '✅',
              },
              {
                label: 'Required Complete',
                value: completedRequired,
                total: requiredCourses.length,
                color: 'text-blue-400',
                icon: '📋',
              },
              {
                label: 'In Progress',
                value: mockCourses.filter((c) => c.status === 'in-progress').length,
                color: 'text-yellow-400',
                icon: '📖',
              },
              {
                label: 'Overdue',
                value: overdueCourses.length,
                color: overdueCourses.length > 0 ? 'text-red-400' : 'text-green-400',
                icon: '⚠️',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800 rounded-xl border border-neutral-700 p-6"
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                  {stat.value}
                  {stat.total ? `/${stat.total}` : ''}
                </p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Learning Paths */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Learning Paths</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockLearningPaths.map((path) => (
                <div
                  key={path.id}
                  className="p-4 bg-neutral-900 rounded-lg border border-neutral-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{path.name}</h3>
                      <p className="text-sm text-neutral-400">{path.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs">
                      {path.role}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-400">
                        {path.completedHours}h / {path.totalHours}h
                      </span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Courses */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Continue Where You Left Off</h2>
            <div className="space-y-3">
              {mockCourses
                .filter((c) => c.status === 'in-progress')
                .map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}
                          >
                            {course.category}
                          </span>
                          {course.required && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                              Required
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-neutral-400 mt-1">{course.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                          <span>⏱ {course.duration}</span>
                          <span>
                            📖 {course.completedModules}/{course.modules} modules
                          </span>
                          {course.dueDate && (
                            <span className={course.dueDate < new Date() ? 'text-red-400' : ''}>
                              📅 Due: {getDaysUntil(course.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="w-16 h-16 rounded-full border-4 border-primary-500 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {Math.round((course.completedModules / course.modules) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Upcoming Due */}
          {mockCourses.filter((c) => c.dueDate && c.status !== 'completed').length > 0 && (
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
              <div className="space-y-2">
                {mockCourses
                  .filter((c) => c.dueDate && c.status !== 'completed')
                  .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
                  .map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            course.dueDate && course.dueDate < new Date()
                              ? 'bg-red-500'
                              : course.dueDate &&
                                  course.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                        ></span>
                        <span>{course.title}</span>
                      </div>
                      <span
                        className={`text-sm ${
                          course.dueDate && course.dueDate < new Date()
                            ? 'text-red-400 font-medium'
                            : 'text-neutral-400'
                        }`}
                      >
                        {course.dueDate && getDaysUntil(course.dueDate)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as CourseCategory | 'all')}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="onboarding">Onboarding</option>
              <option value="security">Security</option>
              <option value="compliance">Compliance</option>
              <option value="product">Product</option>
              <option value="role-specific">Role-Specific</option>
            </select>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                Required Only
              </button>
              <button className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                Not Started
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-primary-500 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}
                  >
                    {course.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(course.status)}`}
                  >
                    {course.status.replace('-', ' ')}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-neutral-400 mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>⏱ {course.duration}</span>
                  <span>📖 {course.modules} modules</span>
                </div>
                {course.required && (
                  <div className="mt-3 pt-3 border-t border-neutral-700">
                    <span className="text-xs text-red-400">⚠️ Required Training</span>
                  </div>
                )}
                {course.status === 'completed' && course.score && (
                  <div className="mt-3 pt-3 border-t border-neutral-700 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Score</span>
                    <span
                      className={`font-medium ${course.score >= course.passingScore ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {course.score}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {mockCertifications.map((cert) => (
              <div
                key={cert.id}
                className={`rounded-xl border-2 p-6 ${getCertStatusColor(cert.status)}`}
              >
                <div className="text-center mb-4">
                  <span className="text-4xl">
                    {cert.status === 'valid'
                      ? '🏆'
                      : cert.status === 'expiring-soon'
                        ? '⚠️'
                        : cert.status === 'expired'
                          ? '❌'
                          : '🔒'}
                  </span>
                </div>
                <h3 className="font-semibold text-center mb-2">{cert.name}</h3>
                <p className="text-sm text-neutral-400 text-center mb-4">{cert.issuer}</p>
                {cert.status === 'valid' && cert.expiryDate && (
                  <p className="text-xs text-center text-neutral-500">
                    Expires: {formatDate(cert.expiryDate)}
                  </p>
                )}
                {cert.status === 'expiring-soon' && cert.expiryDate && (
                  <p className="text-xs text-center text-yellow-400 font-medium">
                    Expires in {getDaysUntil(cert.expiryDate)}
                  </p>
                )}
                {cert.status === 'not-certified' && (
                  <button className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Start Certification
                  </button>
                )}
                {cert.status === 'expiring-soon' && (
                  <button className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                    Renew Now
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Certification Requirements</h2>
            <div className="space-y-4">
              {mockCertifications.map((cert) => (
                <div key={cert.id} className="p-4 bg-neutral-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getCertStatusColor(cert.status)}`}
                    >
                      {cert.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {cert.courses.map((courseId) => {
                      const course = mockCourses.find((c) => c.id === courseId);
                      if (!course) {return null;}
                      return (
                        <div
                          key={courseId}
                          className="flex items-center justify-between p-2 bg-neutral-800 rounded"
                        >
                          <div className="flex items-center gap-2">
                            {course.status === 'completed' ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-neutral-500">○</span>
                            )}
                            <span
                              className={course.status === 'completed' ? 'text-neutral-400' : ''}
                            >
                              {course.title}
                            </span>
                          </div>
                          {course.score && (
                            <span className="text-sm text-green-400">{course.score}%</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Team Members', value: mockTeamMembers.length, icon: '👥' },
              {
                label: 'Fully Compliant',
                value: mockTeamMembers.filter((m) => m.completedCourses >= m.totalRequired).length,
                icon: '✅',
              },
              {
                label: 'With Overdue',
                value: mockTeamMembers.filter((m) => m.overdueCourses > 0).length,
                color: 'text-red-400',
                icon: '⚠️',
              },
              {
                label: 'Avg Completion',
                value: `${Math.round((mockTeamMembers.reduce((acc, m) => acc + m.completedCourses / m.totalRequired, 0) / mockTeamMembers.length) * 100)}%`,
                icon: '📊',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800 rounded-xl border border-neutral-700 p-6"
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className={`text-3xl font-bold ${stat.color || 'text-white'} mt-2`}>
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Department</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Progress</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Overdue</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockTeamMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4 text-neutral-400">{member.role}</td>
                    <td className="p-4 text-neutral-400">{member.department}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              member.completedCourses >= member.totalRequired
                                ? 'bg-green-500'
                                : 'bg-primary-500'
                            }`}
                            style={{
                              width: `${(member.completedCourses / member.totalRequired) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-neutral-400">
                          {member.completedCourses}/{member.totalRequired}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {member.overdueCourses > 0 ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                          {member.overdueCourses} overdue
                        </span>
                      ) : (
                        <span className="text-green-400">✓</span>
                      )}
                    </td>
                    <td className="p-4 text-neutral-400 text-sm">
                      {formatDate(member.lastActivity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Compliance Summary</h3>
              <div className="space-y-4">
                {['onboarding', 'security', 'compliance'].map((category) => {
                  const courses = mockCourses.filter((c) => c.category === category && c.required);
                  const completed = courses.filter((c) => c.status === 'completed').length;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="capitalize">{category}</span>
                        <span className="text-sm">
                          {completed}/{courses.length}
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            completed === courses.length ? 'bg-green-500' : 'bg-primary-500'
                          }`}
                          style={{
                            width:
                              courses.length > 0 ? `${(completed / courses.length) * 100}%` : '0%',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Export Compliance Report',
                    icon: '📄',
                    action: 'PDF report of all training status',
                  },
                  {
                    label: 'Send Reminders',
                    icon: '📧',
                    action: 'Notify users with overdue training',
                  },
                  { label: 'Schedule Training', icon: '📅', action: 'Bulk assign courses to team' },
                  {
                    label: 'Audit Trail Export',
                    icon: '📋',
                    action: 'Download completion certificates',
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full p-3 bg-neutral-900 rounded-lg border border-neutral-700 text-left hover:border-primary-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{action.icon}</span>
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-sm text-neutral-400">{action.action}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Training Metrics</h3>
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Total Training Hours', value: '156h', subtext: 'This quarter' },
                { label: 'Average Score', value: '89%', subtext: 'Across all courses' },
                { label: 'Completion Rate', value: '94%', subtext: 'Required training' },
                { label: 'Certifications Earned', value: '23', subtext: 'This year' },
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <p className="text-3xl font-bold text-primary-400">{metric.value}</p>
                  <p className="font-medium mt-1">{metric.label}</p>
                  <p className="text-sm text-neutral-500">{metric.subtext}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(selectedCourse.category)}`}
                    >
                      {selectedCourse.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(selectedCourse.status)}`}
                    >
                      {selectedCourse.status.replace('-', ' ')}
                    </span>
                    {selectedCourse.required && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                        Required
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-neutral-300">{selectedCourse.description}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Duration</p>
                  <p className="font-semibold">{selectedCourse.duration}</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Modules</p>
                  <p className="font-semibold">{selectedCourse.modules}</p>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400">Passing Score</p>
                  <p className="font-semibold">{selectedCourse.passingScore}%</p>
                </div>
              </div>

              {selectedCourse.status === 'in-progress' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-400">Progress</span>
                    <span>
                      {selectedCourse.completedModules}/{selectedCourse.modules} modules
                    </span>
                  </div>
                  <div className="h-3 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{
                        width: `${(selectedCourse.completedModules / selectedCourse.modules) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {selectedCourse.status === 'completed' && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-medium">✓ Completed</p>
                      <p className="text-sm text-neutral-400">
                        {selectedCourse.completedDate && formatDate(selectedCourse.completedDate)}
                      </p>
                    </div>
                    {selectedCourse.score && (
                      <div className="text-right">
                        <p className="text-sm text-neutral-400">Final Score</p>
                        <p className="text-2xl font-bold text-green-400">{selectedCourse.score}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedCourse.dueDate && selectedCourse.status !== 'completed' && (
                <div
                  className={`p-4 rounded-lg border ${
                    selectedCourse.dueDate < new Date()
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <p
                    className={
                      selectedCourse.dueDate < new Date() ? 'text-red-400' : 'text-yellow-400'
                    }
                  >
                    ⚠️ Due: {formatDate(selectedCourse.dueDate)} (
                    {getDaysUntil(selectedCourse.dueDate)})
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              {selectedCourse.status === 'completed' && (
                <button className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                  Download Certificate
                </button>
              )}
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                {selectedCourse.status === 'not-started'
                  ? 'Start Course'
                  : selectedCourse.status === 'in-progress'
                    ? 'Continue Learning'
                    : 'Retake Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;
