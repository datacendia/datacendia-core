// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA GNOSIS™ - Sovereign Education Engine
// "The Council decides tomorrow's strategy tonight. Gnosis teaches every human
//  how to execute it by morning."
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  BookOpen,
  Target,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  BarChart3,
  AlertCircle,
  Star,
  BookMarked,
  Layers,
  RefreshCw,
  Upload,
  FileText,
} from 'lucide-react';
import { gnosisApi } from '../../../lib/api';
import { sovereignApi, enterpriseApi } from '../../../lib/sovereignApi';

interface DashboardData {
  userProfile: {
    strengths: string[];
    gaps: string[];
    learningStyle: string;
    skillCount: number;
  };
  organizationMetrics: {
    totalLearners: number;
    activeLearners: number;
    avgCompletionRate: number;
    decisionReadiness: number;
  };
  recommendedPaths: string[];
  topPerformers: Array<{ userId: string; name: string; score: number }>;
  atRiskLearners: Array<{ userId: string; name: string; reason: string }>;
}

interface SkillProfile {
  userId: string;
  skills: Record<
    string,
    {
      name: string;
      level: number;
      trend: string;
      certifications: string[];
    }
  >;
  strengths: string[];
  gaps: string[];
  learningStyle: string;
  preferredPace: string;
}

interface DecisionReadiness {
  readinessScore: number;
  totalLearners: number;
  activeLearners: number;
  completedPaths: number;
  status: string;
  message: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: Array<{
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    type: 'video' | 'quiz' | 'reading' | 'exercise';
  }>;
}

// Module content for readings, quizzes, and exercises
const MODULE_CONTENT: Record<
  string,
  {
    type: 'reading' | 'quiz' | 'exercise';
    title: string;
    content?: string;
    sections?: Array<{ heading: string; text: string }>;
    questions?: Array<{ id: string; question: string; options: string[]; correct: number }>;
    steps?: Array<{ step: number; instruction: string; hint?: string }>;
  }
> = {
  // AI Decision Making - Reading
  m2: {
    type: 'reading',
    title: 'Understanding Agent Recommendations',
    sections: [
      {
        heading: 'What Are AI Agents?',
        text: 'AI agents in CendiaCortex are specialized decision-support systems that analyze data, identify patterns, and provide recommendations. Each agent has a specific domain expertise—from financial analysis to risk assessment to market trends. Unlike simple algorithms, these agents learn from organizational context and adapt their recommendations based on outcomes.',
      },
      {
        heading: 'How Recommendations Are Generated',
        text: 'When you submit a decision query to the Council, multiple agents analyze the question from their unique perspectives. Each agent considers: historical data patterns, current market conditions, organizational constraints, and potential risks. The agents then vote on recommendations, with their votes weighted by their historical accuracy in similar decisions.',
      },
      {
        heading: 'Interpreting Agent Confidence',
        text: 'Every recommendation comes with a confidence score (0-100%). High confidence (>80%) indicates strong data support and agent consensus. Medium confidence (50-80%) suggests the decision has nuances requiring human judgment. Low confidence (<50%) means significant uncertainty—proceed with caution and gather more data.',
      },
      {
        heading: 'When to Override Agent Recommendations',
        text: 'AI agents excel at data-driven analysis but may miss: recent market shifts not yet in data, internal organizational dynamics, stakeholder politics, and ethical considerations. Always apply human judgment, especially for decisions with significant irreversible consequences.',
      },
    ],
  },
  // AI Decision Making - Quiz (Knowledge Check)
  m4: {
    type: 'quiz',
    title: 'Knowledge Check',
    questions: [
      {
        id: 'q1',
        question: 'What does an agent confidence score of 85% indicate?',
        options: [
          'The agent is 85% certain the data is accurate',
          'Strong data support and high agent consensus',
          'The decision will succeed 85% of the time',
          'Only 85% of agents participated in the vote',
        ],
        correct: 1,
      },
      {
        id: 'q2',
        question: 'When should you consider overriding an AI agent recommendation?',
        options: [
          'Never - AI agents are always correct',
          'When the confidence score is below 50%',
          'When there are ethical considerations or recent market shifts not in the data',
          'Only when multiple agents disagree',
        ],
        correct: 2,
      },
      {
        id: 'q3',
        question: 'How do agents weight their votes in the Council?',
        options: [
          'All agents have equal voting weight',
          'Based on their historical accuracy in similar decisions',
          'Senior agents always have higher weight',
          'Randomly assigned for each decision',
        ],
        correct: 1,
      },
    ],
  },
  // AI Decision Making - Exercise
  m5: {
    type: 'exercise',
    title: 'Building Your First Council Query',
    steps: [
      {
        step: 1,
        instruction: 'Navigate to the Council page from the main navigation.',
        hint: 'Look for the "Council" option in the left sidebar under Cortex.',
      },
      {
        step: 2,
        instruction: 'Click "New Deliberation" to start a new decision query.',
        hint: 'The button is in the top-right corner of the Council page.',
      },
      {
        step: 3,
        instruction:
          'Frame your decision as a clear question. For example: "Should we expand into the European market in Q2?"',
        hint: 'Good queries are specific, time-bound, and actionable.',
      },
      {
        step: 4,
        instruction:
          'Select the relevant agents for your decision (e.g., Market Analyst, Risk Assessor, Financial Advisor).',
        hint: 'Start with 3-5 agents most relevant to your decision domain.',
      },
      {
        step: 5,
        instruction: 'Set your decision timeline and urgency level.',
        hint: 'Urgent decisions get faster responses but may have lower confidence.',
      },
      {
        step: 6,
        instruction: 'Submit your query and observe the deliberation process.',
        hint: 'Watch the agents discuss and vote in real-time.',
      },
      {
        step: 7,
        instruction: 'Review the final recommendation and confidence score.',
        hint: 'Check which agents agreed/disagreed and why.',
      },
    ],
  },
  // AI Decision Making - Final Assessment
  m7: {
    type: 'quiz',
    title: 'Final Assessment',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary benefit of multi-agent decision support?',
        options: [
          'Faster decisions with less data',
          'Multiple perspectives reduce blind spots and bias',
          'Eliminates the need for human oversight',
          'Guarantees correct decisions',
        ],
        correct: 1,
      },
      {
        id: 'q2',
        question:
          'A decision has 45% confidence with significant agent disagreement. What should you do?',
        options: [
          'Proceed with the majority recommendation',
          'Reject the recommendation entirely',
          'Gather more data and re-query, or apply strong human judgment',
          'Wait for confidence to increase automatically',
        ],
        correct: 2,
      },
      {
        id: 'q3',
        question: 'Which factor do AI agents NOT typically consider well?',
        options: [
          'Historical data patterns',
          'Current market conditions',
          'Internal organizational politics',
          'Quantitative risk metrics',
        ],
        correct: 2,
      },
      {
        id: 'q4',
        question: 'How can you improve agent recommendation quality over time?',
        options: [
          'Always accept recommendations without question',
          'Provide outcome feedback after decisions are implemented',
          'Use more agents for every decision',
          'Ignore low-confidence recommendations',
        ],
        correct: 1,
      },
      {
        id: 'q5',
        question: 'What defines a well-framed Council query?',
        options: [
          'As vague as possible to get broad recommendations',
          'Specific, time-bound, and actionable',
          'Only yes/no questions',
          'Questions that have obvious answers',
        ],
        correct: 1,
      },
    ],
  },
  // Change Management - Reading (Stakeholder Analysis)
  'cm-m2': {
    type: 'reading',
    title: 'Stakeholder Analysis',
    sections: [
      {
        heading: 'Identifying Key Stakeholders',
        text: 'Stakeholders are individuals or groups who can affect or be affected by organizational decisions. In AI-driven decision making, key stakeholders typically include: executive sponsors, department heads affected by decisions, IT/data teams, end-users of AI recommendations, and external partners or customers impacted by outcomes.',
      },
      {
        heading: 'Mapping Influence and Interest',
        text: 'Create a 2x2 matrix: High Influence/High Interest stakeholders need close management. High Influence/Low Interest stakeholders should be kept satisfied. Low Influence/High Interest stakeholders should be kept informed. Low Influence/Low Interest stakeholders need minimal monitoring.',
      },
      {
        heading: 'Addressing Stakeholder Concerns',
        text: 'Common concerns about AI decision support include: job displacement fears, trust in algorithmic recommendations, data privacy, and accountability for AI-influenced decisions. Address these proactively with clear communication, training, and governance frameworks.',
      },
    ],
  },
  // Change Management - Resistance Management Reading
  'cm-m5': {
    type: 'reading',
    title: 'Resistance Management',
    sections: [
      {
        heading: 'Understanding Resistance',
        text: 'Resistance to AI-driven decision making is natural and often rational. People may resist due to: fear of the unknown, loss of autonomy, past negative experiences with technology, or genuine concerns about AI limitations. Acknowledge these concerns as valid rather than dismissing them.',
      },
      {
        heading: 'Strategies for Overcoming Resistance',
        text: 'Key strategies include: involving resistors in the implementation process, providing hands-on training and quick wins, creating feedback channels for concerns, celebrating early successes publicly, and ensuring leadership visibly uses and trusts the AI tools.',
      },
      {
        heading: 'Converting Skeptics to Champions',
        text: 'Focus on pragmatic skeptics who have valid concerns but are open to evidence. Give them pilot projects where AI support adds clear value. When they experience success, they become the most credible advocates for broader adoption.',
      },
    ],
  },
  // Change Management - Practical Exercise
  'cm-m6': {
    type: 'exercise',
    title: 'Practical Exercise: Change Impact Assessment',
    steps: [
      {
        step: 1,
        instruction: 'Identify a recent or upcoming decision that could benefit from AI support.',
        hint: 'Choose something concrete like a hiring decision, budget allocation, or product feature prioritization.',
      },
      {
        step: 2,
        instruction:
          'List all stakeholders who would be affected if AI recommendations were used for this decision.',
        hint: 'Include decision-makers, those who implement, and those affected by outcomes.',
      },
      {
        step: 3,
        instruction:
          'For each stakeholder, rate their likely resistance (1-5) and their influence (1-5).',
        hint: 'High resistance + high influence = priority concern.',
      },
      {
        step: 4,
        instruction:
          'Draft a one-paragraph message explaining the benefits of AI decision support for this specific use case.',
        hint: 'Focus on how it helps them, not just organizational benefits.',
      },
      {
        step: 5,
        instruction: 'Identify one quick win that could demonstrate value within 2 weeks.',
        hint: 'Quick wins should be visible, low-risk, and clearly attributable to AI support.',
      },
    ],
  },
};

// Demo learning paths with real content
const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'ai-decision-making',
    title: 'AI-Driven Decision Making',
    description:
      'Learn how to leverage AI agents and data-driven insights to make better strategic decisions.',
    progress: 0,
    duration: '2h 30m',
    difficulty: 'intermediate',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to AI Decision Support',
        duration: '15m',
        completed: false,
        type: 'video',
      },
      {
        id: 'm2',
        title: 'Understanding Agent Recommendations',
        duration: '20m',
        completed: false,
        type: 'reading',
      },
      {
        id: 'm3',
        title: 'Evaluating Confidence Scores',
        duration: '25m',
        completed: false,
        type: 'video',
      },
      { id: 'm4', title: 'Knowledge Check', duration: '10m', completed: false, type: 'quiz' },
      {
        id: 'm5',
        title: 'Building Your First Council Query',
        duration: '30m',
        completed: false,
        type: 'exercise',
      },
      {
        id: 'm6',
        title: 'Interpreting Multi-Agent Consensus',
        duration: '20m',
        completed: false,
        type: 'video',
      },
      { id: 'm7', title: 'Final Assessment', duration: '30m', completed: false, type: 'quiz' },
    ],
  },
  {
    id: 'change-management',
    title: 'Change Management Fundamentals',
    description: 'Master the principles of organizational change and stakeholder alignment.',
    progress: 45,
    duration: '1h 45m',
    difficulty: 'beginner',
    modules: [
      {
        id: 'm1',
        title: 'Why Change Management Matters',
        duration: '10m',
        completed: true,
        type: 'video',
      },
      {
        id: 'm2',
        title: 'Stakeholder Analysis',
        duration: '15m',
        completed: true,
        type: 'reading',
      },
      { id: 'm3', title: 'Progress Check', duration: '5m', completed: true, type: 'quiz' },
      {
        id: 'm4',
        title: 'Communication Strategies',
        duration: '20m',
        completed: false,
        type: 'video',
      },
      {
        id: 'm5',
        title: 'Resistance Management',
        duration: '25m',
        completed: false,
        type: 'reading',
      },
      {
        id: 'm6',
        title: 'Practical Exercise',
        duration: '20m',
        completed: false,
        type: 'exercise',
      },
      { id: 'm7', title: 'Final Assessment', duration: '10m', completed: false, type: 'quiz' },
    ],
  },
  {
    id: 'strategic-communication',
    title: 'Strategic Communication',
    description: 'Advanced techniques for executive-level communication and influence.',
    progress: 78,
    duration: '3h',
    difficulty: 'advanced',
    modules: [
      { id: 'm1', title: 'Executive Presence', duration: '25m', completed: true, type: 'video' },
      {
        id: 'm2',
        title: 'Crafting Board Presentations',
        duration: '30m',
        completed: true,
        type: 'reading',
      },
      { id: 'm3', title: 'Data Storytelling', duration: '35m', completed: true, type: 'video' },
      { id: 'm4', title: 'Mid-Course Assessment', duration: '15m', completed: true, type: 'quiz' },
      { id: 'm5', title: 'Crisis Communication', duration: '25m', completed: true, type: 'video' },
      {
        id: 'm6',
        title: 'Stakeholder Influence',
        duration: '30m',
        completed: false,
        type: 'reading',
      },
      { id: 'm7', title: 'Capstone Project', duration: '40m', completed: false, type: 'exercise' },
    ],
  },
];

const GnosisPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [readiness, setReadiness] = useState<DecisionReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'paths' | 'analytics'>(
    'overview'
  );
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(LEARNING_PATHS);
  const [activeContent, setActiveContent] = useState<{ moduleId: string; pathId: string } | null>(
    null
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [exerciseSteps, setExerciseSteps] = useState<Record<number, boolean>>({});
  const [readingProgress, setReadingProgress] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardRes, profileRes, readinessRes] = await Promise.all([
        gnosisApi.getDashboard(),
        gnosisApi.getProfile(),
        gnosisApi.getDecisionReadiness(),
      ]);

      if (dashboardRes.success) {
        setDashboard(dashboardRes.data as DashboardData);
      }
      if (profileRes.success) {
        setProfile(profileRes.data as SkillProfile);
      }
      if (readinessRes.success) {
        setReadiness(readinessRes.data as DecisionReadiness);
      }
    } catch (error) {
      console.error('Failed to fetch Gnosis data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getReadinessColor = (score: number) => {
    if (score >= 80) {
      return 'text-green-400';
    }
    if (score >= 50) {
      return 'text-amber-400';
    }
    return 'text-red-400';
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 90) {
      return 'Expert';
    }
    if (level >= 70) {
      return 'Advanced';
    }
    if (level >= 50) {
      return 'Intermediate';
    }
    if (level >= 30) {
      return 'Beginner';
    }
    return 'Novice';
  };

  // RAG Document Upload Handler (Sovereign Stack Integration + Tika)
  const handleDocumentUpload = async (file: File) => {
    try {
      const documentId = `doc-${Date.now()}`;

      // Read file as base64 for Tika extraction
      const arrayBuffer = await file.arrayBuffer();
      const base64Content = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Use Apache Tika for intelligent text extraction (PDF, DOCX, PPTX, etc.)
      let extractedText = '';
      let metadata: any = {};

      const tikaResult = await enterpriseApi.extractDocument(
        base64Content,
        file.type,
        file.name,
        false // useOCR - set true for scanned documents
      );

      if (tikaResult) {
        extractedText = tikaResult.text;
        metadata = tikaResult.metadata;
        console.log('[Gnosis] Tika extracted:', tikaResult.wordCount, 'words from', file.name);
      } else {
        // Fallback to raw text for plain text files
        extractedText = await file.text();
        console.log('[Gnosis] Using raw text extraction for:', file.name);
      }

      // Upload original file to MinIO
      await sovereignApi.storage.uploadDocument(file.name, base64Content, file.type, {
        uploadedBy: 'gnosis',
        type: 'learning-material',
        ...metadata,
      });
      console.log('[Gnosis] Document uploaded to MinIO:', file.name);

      // Store extracted text embeddings in pgvector for RAG
      const chunks = await sovereignApi.vector.storeDocument(documentId, extractedText, {
        fileName: file.name,
        type: 'learning-material',
        extractedBy: 'tika',
        wordCount: metadata.wordCount,
        ...metadata,
      });
      console.log('[Gnosis] Document indexed for RAG:', chunks, 'chunks');

      // Queue for additional processing if needed
      await sovereignApi.queue.queueDocumentProcessing({
        documentId,
        fileName: file.name,
        fileType: file.type,
        storageUrl: `minio://cendia-documents/${file.name}`,
        extractText: false, // Already extracted via Tika
        generateEmbeddings: true,
      });

      return { success: true, documentId, chunks, wordCount: metadata.wordCount };
    } catch (error) {
      console.error('[Gnosis] Document upload failed:', error);
      return { success: false, error };
    }
  };

  // RAG Search Handler
  const searchKnowledgeBase = async (query: string) => {
    try {
      const results = await sovereignApi.vector.searchSimilar(query, 5, 0.7);
      console.log('[Gnosis] RAG search results:', results.length);
      return results;
    } catch (error) {
      console.error('[Gnosis] RAG search failed:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-indigo-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Learning Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CendiaGnosis™</h1>
              <p className="text-neutral-400">Sovereign Education Engine</p>
            </div>
          </div>

          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center gap-2 hover:bg-indigo-500/30 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <p className="text-neutral-500 mt-2 max-w-2xl">
          The Council decides tomorrow's strategy tonight. Gnosis teaches every human how to execute
          it by morning.
        </p>

        {/* Sovereign Storage Integration */}
        <div className="mt-4 flex items-center gap-3">
          <a
            href="http://localhost:9001"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <span className="text-blue-400 text-xs font-medium">📦 MinIO Document Storage</span>
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <span className="text-purple-400 text-xs font-medium">🧠 pgvector RAG Search</span>
          </div>
          <a
            href="http://localhost:7700"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors"
          >
            <span className="text-amber-400 text-xs font-medium">🔍 Meilisearch</span>
          </a>
        </div>
      </div>

      {/* Decision Readiness Banner */}
      <div
        className={`mb-8 p-6 rounded-xl border ${
          readiness?.status === 'ready'
            ? 'bg-green-500/10 border-green-500/30'
            : readiness?.status === 'partial'
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-red-500/10 border-red-500/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                readiness?.status === 'ready'
                  ? 'bg-green-500/20'
                  : readiness?.status === 'partial'
                    ? 'bg-amber-500/20'
                    : 'bg-red-500/20'
              }`}
            >
              <span
                className={`text-2xl font-bold ${getReadinessColor(readiness?.readinessScore || 0)}`}
              >
                {readiness?.readinessScore?.toFixed(0) || 0}%
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Decision Readiness</h2>
              <p
                className={`text-sm ${
                  readiness?.status === 'ready'
                    ? 'text-green-400'
                    : readiness?.status === 'partial'
                      ? 'text-amber-400'
                      : 'text-red-400'
                }`}
              >
                {readiness?.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{readiness?.totalLearners || 0}</p>
              <p className="text-neutral-500">Total Learners</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-400">{readiness?.activeLearners || 0}</p>
              <p className="text-neutral-500">Active Now</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{readiness?.completedPaths || 0}</p>
              <p className="text-neutral-500">Paths Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'skills', label: 'My Skills', icon: Brain },
          { id: 'paths', label: 'Learning Paths', icon: BookOpen },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Profile Summary */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Your Profile
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Learning Style</p>
                <p className="text-lg font-medium capitalize">
                  {profile?.learningStyle || 'Visual'}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500 mb-2">Preferred Pace</p>
                <p className="text-lg font-medium capitalize">
                  {profile?.preferredPace?.replace(/_/g, ' ') || 'Self-paced'}
                </p>
              </div>

              <div>
                <p className="text-sm text-neutral-500 mb-2">Skills Tracked</p>
                <p className="text-lg font-medium">
                  {dashboard?.userProfile.skillCount || 0} skills
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {(profile?.strengths || []).slice(0, 5).map((strength, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg"
                    >
                      {strength}
                    </span>
                  ))}
                  {(profile?.strengths || []).length === 0 && (
                    <span className="text-neutral-500 text-sm">
                      Complete assessments to identify strengths
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Skills to Develop</p>
                <div className="flex flex-wrap gap-2">
                  {(profile?.gaps || []).slice(0, 5).map((gap, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg"
                    >
                      {gap}
                    </span>
                  ))}
                  {(profile?.gaps || []).length === 0 && (
                    <span className="text-neutral-500 text-sm">No skill gaps identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Paths */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-indigo-500" />
              Recommended for You
            </h2>

            <div className="space-y-3">
              {learningPaths.map((path) => (
                <div
                  key={path.id}
                  className="p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{path.title}</p>
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${
                        path.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : path.difficulty === 'intermediate'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {path.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.duration}
                    </span>
                    {path.progress > 0 && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {path.progress}% complete
                      </span>
                    )}
                  </div>

                  <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>

                  <button
                    onClick={() => setSelectedPath(path)}
                    className="mt-3 w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition flex items-center justify-center gap-2"
                  >
                    {path.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Path
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Organization Leaderboard */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Performers
            </h2>

            <div className="space-y-3">
              {(dashboard?.topPerformers || []).length > 0
                ? dashboard?.topPerformers.map((performer, idx) => (
                    <div
                      key={performer.userId}
                      className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-400'
                            : idx === 1
                              ? 'bg-neutral-400/20 text-neutral-300'
                              : idx === 2
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{performer.name}</p>
                      </div>
                      <span className="text-indigo-400 font-bold">{performer.score}%</span>
                    </div>
                  ))
                : /* Demo leaderboard */
                  [
                    { name: 'Sarah Chen', score: 98 },
                    { name: 'Marcus Johnson', score: 95 },
                    { name: 'Emily Rodriguez', score: 92 },
                    { name: 'David Kim', score: 89 },
                    { name: 'Lisa Thompson', score: 87 },
                  ].map((performer, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-400'
                            : idx === 1
                              ? 'bg-neutral-400/20 text-neutral-300'
                              : idx === 2
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{performer.name}</p>
                      </div>
                      <span className="text-indigo-400 font-bold">{performer.score}%</span>
                    </div>
                  ))}
            </div>

            {/* At Risk Learners */}
            {(dashboard?.atRiskLearners || []).length > 0 && (
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Needs Attention
                </h3>

                <div className="space-y-2">
                  {dashboard?.atRiskLearners.slice(0, 3).map((learner) => (
                    <div
                      key={learner.userId}
                      className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg"
                    >
                      <span className="text-sm">{learner.name}</span>
                      <span className="text-xs text-amber-400">{learner.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Skill Levels
            </h2>

            <div className="space-y-4">
              {Object.entries(profile?.skills || {}).length > 0
                ? Object.entries(profile?.skills || {}).map(([skillName, skill]) => (
                    <div key={skillName}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{skill.name || skillName}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              skill.level >= 70
                                ? 'bg-green-500/20 text-green-400'
                                : skill.level >= 50
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {getSkillLevelLabel(skill.level)}
                          </span>
                          <span className="text-neutral-400">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            skill.level >= 70
                              ? 'bg-green-500'
                              : skill.level >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))
                : /* Demo skills */
                  [
                    { name: 'Strategic Planning', level: 85 },
                    { name: 'Data Analysis', level: 72 },
                    { name: 'Change Management', level: 65 },
                    { name: 'AI Fundamentals', level: 58 },
                    { name: 'Leadership', level: 78 },
                    { name: 'Communication', level: 90 },
                  ].map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              skill.level >= 70
                                ? 'bg-green-500/20 text-green-400'
                                : skill.level >= 50
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {getSkillLevelLabel(skill.level)}
                          </span>
                          <span className="text-neutral-400">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            skill.level >= 70
                              ? 'bg-green-500'
                              : skill.level >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Take a Skill Assessment
            </h2>

            <p className="text-neutral-400 text-sm mb-4">
              Assess your skills to get personalized learning recommendations and track your growth.
            </p>

            <div className="space-y-3">
              {[
                'Leadership',
                'Data Analysis',
                'AI & Automation',
                'Strategic Thinking',
                'Communication',
              ].map((skill) => (
                <button
                  key={skill}
                  className="w-full flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition"
                >
                  <span className="font-medium">{skill}</span>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="text-sm">Start Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'paths' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Learning Paths</h2>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Generate from Decision
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'AI Council Operations',
                description:
                  'Understand how the AI Council makes decisions and your role in the process',
                modules: 8,
                duration: '4h 30m',
                difficulty: 'intermediate',
                enrolled: 234,
                rating: 4.8,
              },
              {
                title: 'Data-Driven Leadership',
                description: 'Lead with confidence using real-time analytics and AI insights',
                modules: 12,
                duration: '6h',
                difficulty: 'advanced',
                enrolled: 156,
                rating: 4.9,
              },
              {
                title: 'Change Management for AI Era',
                description: 'Navigate organizational transformation in an AI-first world',
                modules: 6,
                duration: '3h',
                difficulty: 'beginner',
                enrolled: 412,
                rating: 4.7,
              },
              {
                title: 'Ethics in Automated Decision Making',
                description: 'Ensure ethical AI practices and governance compliance',
                modules: 10,
                duration: '5h',
                difficulty: 'advanced',
                enrolled: 89,
                rating: 4.6,
              },
              {
                title: 'Strategic Communication',
                description: 'Communicate AI-driven decisions effectively across all levels',
                modules: 5,
                duration: '2h 30m',
                difficulty: 'intermediate',
                enrolled: 298,
                rating: 4.8,
              },
              {
                title: 'Risk Assessment Fundamentals',
                description: 'Identify and mitigate risks in automated processes',
                modules: 7,
                duration: '3h 45m',
                difficulty: 'intermediate',
                enrolled: 187,
                rating: 4.5,
              },
            ].map((path, idx) => (
              <div
                key={idx}
                className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-indigo-500/50 transition"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{path.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${
                        path.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : path.difficulty === 'intermediate'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {path.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-400 mb-4">{path.description}</p>

                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-amber-400">{path.rating}</span>
                    </div>
                    <span className="text-sm text-neutral-500">{path.enrolled} enrolled</span>
                  </div>

                  <button className="w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Organization Learning Metrics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Total Learners</p>
                <p className="text-2xl font-bold mt-1">
                  {dashboard?.organizationMetrics.totalLearners || 0}
                </p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Active Learners</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {dashboard?.organizationMetrics.activeLearners || 0}
                </p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Avg. Completion</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">
                  {(dashboard?.organizationMetrics.avgCompletionRate || 0).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Decision Readiness</p>
                <p
                  className={`text-2xl font-bold mt-1 ${getReadinessColor(dashboard?.organizationMetrics.decisionReadiness || 0)}`}
                >
                  {(dashboard?.organizationMetrics.decisionReadiness || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Learning Trends
            </h2>

            <div className="h-64 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Learning trend chart would be rendered here</p>
                <p className="text-sm">Showing skill growth over time</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Path Modal */}
      {selectedPath && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full capitalize ${
                      selectedPath.difficulty === 'beginner'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedPath.difficulty === 'intermediate'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {selectedPath.difficulty}
                  </span>
                  <span className="text-neutral-500 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedPath.duration}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{selectedPath.title}</h2>
                <p className="text-neutral-400 mt-1">{selectedPath.description}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedPath(null);
                  setCurrentModule(null);
                }}
                className="p-2 hover:bg-neutral-800 rounded-lg transition"
              >
                <ChevronRight className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 border-b border-neutral-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-400">Course Progress</span>
                <span className="text-indigo-400 font-medium">
                  {selectedPath.progress}% Complete
                </span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${selectedPath.progress}%` }}
                />
              </div>
            </div>

            {/* Modules List */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
              <div className="space-y-3">
                {selectedPath.modules.map((module, idx) => (
                  <div
                    key={module.id}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      currentModule === module.id
                        ? 'bg-indigo-500/20 border-indigo-500/50'
                        : module.completed
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
                    }`}
                    onClick={() => setCurrentModule(module.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          module.completed
                            ? 'bg-green-500/20 text-green-400'
                            : currentModule === module.id
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : 'bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        {module.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className={`font-medium ${module.completed ? 'text-green-400' : ''}`}>
                          {module.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.duration}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs capitalize ${
                              module.type === 'video'
                                ? 'bg-blue-500/20 text-blue-400'
                                : module.type === 'quiz'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : module.type === 'reading'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {module.type}
                          </span>
                        </div>
                      </div>

                      {!module.completed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // For videos, just mark complete (user makes video content)
                            if (module.type === 'video') {
                              setLearningPaths((paths) =>
                                paths.map((p) =>
                                  p.id === selectedPath.id
                                    ? {
                                        ...p,
                                        modules: p.modules.map((m) =>
                                          m.id === module.id ? { ...m, completed: true } : m
                                        ),
                                        progress: Math.round(
                                          (p.modules.filter(
                                            (m) => m.completed || m.id === module.id
                                          ).length /
                                            p.modules.length) *
                                            100
                                        ),
                                      }
                                    : p
                                )
                              );
                              setSelectedPath((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      modules: prev.modules.map((m) =>
                                        m.id === module.id ? { ...m, completed: true } : m
                                      ),
                                      progress: Math.round(
                                        (prev.modules.filter(
                                          (m) => m.completed || m.id === module.id
                                        ).length /
                                          prev.modules.length) *
                                          100
                                      ),
                                    }
                                  : null
                              );
                            } else {
                              // Open content viewer for reading, quiz, exercise
                              setActiveContent({ moduleId: module.id, pathId: selectedPath.id });
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                              setExerciseSteps({});
                              setReadingProgress(0);
                            }
                          }}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {module.type === 'video'
                            ? 'Watch'
                            : module.type === 'quiz'
                              ? 'Take Quiz'
                              : module.type === 'reading'
                                ? 'Read'
                                : 'Start'}
                        </button>
                      )}

                      {module.completed && (
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-800 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                {selectedPath.modules.filter((m) => m.completed).length} of{' '}
                {selectedPath.modules.length} modules completed
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedPath(null);
                    setCurrentModule(null);
                  }}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition"
                >
                  Close
                </button>
                {selectedPath.progress < 100 && (
                  <button
                    onClick={() => {
                      const nextModule = selectedPath.modules.find((m) => !m.completed);
                      if (nextModule) {
                        setCurrentModule(nextModule.id);
                      }
                    }}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </button>
                )}
                {selectedPath.progress === 100 && (
                  <button className="px-6 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Get Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Viewer Modal */}
      {activeContent && MODULE_CONTENT[activeContent.moduleId] && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Content Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span
                  className={`px-3 py-1 text-xs rounded-full mb-2 inline-block ${
                    MODULE_CONTENT[activeContent.moduleId].type === 'reading'
                      ? 'bg-amber-500/20 text-amber-400'
                      : MODULE_CONTENT[activeContent.moduleId].type === 'quiz'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {MODULE_CONTENT[activeContent.moduleId].type}
                </span>
                <h2 className="text-xl font-bold">
                  {MODULE_CONTENT[activeContent.moduleId].title}
                </h2>
              </div>
              <button
                onClick={() => setActiveContent(null)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition"
              >
                <ChevronRight className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Reading Content */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'reading' &&
                MODULE_CONTENT[activeContent.moduleId].sections && (
                  <div className="space-y-8">
                    {MODULE_CONTENT[activeContent.moduleId].sections!.map((section, idx) => (
                      <div
                        key={idx}
                        className={`transition-all ${idx <= readingProgress ? 'opacity-100' : 'opacity-50'}`}
                      >
                        <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">
                            {idx + 1}
                          </span>
                          {section.heading}
                        </h3>
                        <p className="text-neutral-300 leading-relaxed">{section.text}</p>
                        {idx === readingProgress &&
                          idx < MODULE_CONTENT[activeContent.moduleId].sections!.length - 1 && (
                            <button
                              onClick={() => setReadingProgress((prev) => prev + 1)}
                              className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition"
                            >
                              Continue Reading →
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                )}

              {/* Quiz Content */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'quiz' &&
                MODULE_CONTENT[activeContent.moduleId].questions && (
                  <div className="space-y-8">
                    {MODULE_CONTENT[activeContent.moduleId].questions!.map((q, idx) => (
                      <div
                        key={q.id}
                        className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700"
                      >
                        <p className="font-medium mb-4 flex items-start gap-3">
                          <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span>{q.question}</span>
                        </p>
                        <div className="space-y-2 ml-11">
                          {q.options.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() =>
                                !quizSubmitted &&
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                              }
                              disabled={quizSubmitted}
                              className={`w-full text-left p-3 rounded-lg border transition ${
                                quizSubmitted && optIdx === q.correct
                                  ? 'bg-green-500/20 border-green-500 text-green-400'
                                  : quizSubmitted &&
                                      quizAnswers[q.id] === optIdx &&
                                      optIdx !== q.correct
                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                    : quizAnswers[q.id] === optIdx
                                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                      : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <span
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                                    quizAnswers[q.id] === optIdx
                                      ? 'border-current bg-current/20'
                                      : 'border-neutral-600'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                {option}
                                {quizSubmitted && optIdx === q.correct && (
                                  <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                                )}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {!quizSubmitted && (
                      <div className="text-center pt-4">
                        <p className="text-neutral-500 text-sm mb-4">
                          {Object.keys(quizAnswers).length} of{' '}
                          {MODULE_CONTENT[activeContent.moduleId].questions!.length} questions
                          answered
                        </p>
                      </div>
                    )}

                    {quizSubmitted && (
                      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 text-center">
                        <Award className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                        <p className="text-xl font-bold mb-2">
                          {
                            MODULE_CONTENT[activeContent.moduleId].questions!.filter(
                              (q) => quizAnswers[q.id] === q.correct
                            ).length
                          }{' '}
                          / {MODULE_CONTENT[activeContent.moduleId].questions!.length} Correct
                        </p>
                        <p className="text-neutral-400">
                          {MODULE_CONTENT[activeContent.moduleId].questions!.filter(
                            (q) => quizAnswers[q.id] === q.correct
                          ).length === MODULE_CONTENT[activeContent.moduleId].questions!.length
                            ? 'Perfect score! Excellent work!'
                            : 'Review the correct answers above.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {/* Exercise Content */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'exercise' &&
                MODULE_CONTENT[activeContent.moduleId].steps && (
                  <div className="space-y-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-6">
                      <p className="text-indigo-400 text-sm">
                        <strong>Instructions:</strong> Complete each step below. Check off each step
                        as you finish to track your progress.
                      </p>
                    </div>

                    {MODULE_CONTENT[activeContent.moduleId].steps!.map((step) => (
                      <div
                        key={step.step}
                        className={`p-4 rounded-xl border transition ${
                          exerciseSteps[step.step]
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-neutral-800/50 border-neutral-700'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() =>
                              setExerciseSteps((prev) => ({
                                ...prev,
                                [step.step]: !prev[step.step],
                              }))
                            }
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                              exerciseSteps[step.step]
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-neutral-600 hover:border-green-500'
                            }`}
                          >
                            {exerciseSteps[step.step] ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              step.step
                            )}
                          </button>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${exerciseSteps[step.step] ? 'text-green-400' : ''}`}
                            >
                              {step.instruction}
                            </p>
                            {step.hint && (
                              <p className="text-sm text-neutral-500 mt-2 flex items-start gap-2">
                                <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>
                                  <strong>Hint:</strong> {step.hint}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl text-center">
                      <p className="text-neutral-400 mb-2">
                        Progress: {Object.values(exerciseSteps).filter(Boolean).length} /{' '}
                        {MODULE_CONTENT[activeContent.moduleId].steps!.length} steps completed
                      </p>
                      <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: `${(Object.values(exerciseSteps).filter(Boolean).length / MODULE_CONTENT[activeContent.moduleId].steps!.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Content Footer */}
            <div className="p-6 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setActiveContent(null)}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition"
              >
                Back to Modules
              </button>

              {/* Complete Button - Reading */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'reading' &&
                readingProgress >=
                  (MODULE_CONTENT[activeContent.moduleId].sections?.length || 1) - 1 && (
                  <button
                    onClick={() => {
                      // Mark module complete
                      setLearningPaths((paths) =>
                        paths.map((p) =>
                          p.id === activeContent.pathId
                            ? {
                                ...p,
                                modules: p.modules.map((m) =>
                                  m.id === activeContent.moduleId ? { ...m, completed: true } : m
                                ),
                                progress: Math.round(
                                  (p.modules.filter(
                                    (m) => m.completed || m.id === activeContent.moduleId
                                  ).length /
                                    p.modules.length) *
                                    100
                                ),
                              }
                            : p
                        )
                      );
                      setSelectedPath((prev) =>
                        prev
                          ? {
                              ...prev,
                              modules: prev.modules.map((m) =>
                                m.id === activeContent.moduleId ? { ...m, completed: true } : m
                              ),
                              progress: Math.round(
                                (prev.modules.filter(
                                  (m) => m.completed || m.id === activeContent.moduleId
                                ).length /
                                  prev.modules.length) *
                                  100
                              ),
                            }
                          : null
                      );
                      setActiveContent(null);
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}

              {/* Submit Button - Quiz */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && !quizSubmitted && (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={
                    Object.keys(quizAnswers).length <
                    (MODULE_CONTENT[activeContent.moduleId].questions?.length || 0)
                  }
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              )}

              {/* Complete Button - Quiz (after submission) */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'quiz' && quizSubmitted && (
                <button
                  onClick={() => {
                    setLearningPaths((paths) =>
                      paths.map((p) =>
                        p.id === activeContent.pathId
                          ? {
                              ...p,
                              modules: p.modules.map((m) =>
                                m.id === activeContent.moduleId ? { ...m, completed: true } : m
                              ),
                              progress: Math.round(
                                (p.modules.filter(
                                  (m) => m.completed || m.id === activeContent.moduleId
                                ).length /
                                  p.modules.length) *
                                  100
                              ),
                            }
                          : p
                      )
                    );
                    setSelectedPath((prev) =>
                      prev
                        ? {
                            ...prev,
                            modules: prev.modules.map((m) =>
                              m.id === activeContent.moduleId ? { ...m, completed: true } : m
                            ),
                            progress: Math.round(
                              (prev.modules.filter(
                                (m) => m.completed || m.id === activeContent.moduleId
                              ).length /
                                prev.modules.length) *
                                100
                            ),
                          }
                        : null
                    );
                    setActiveContent(null);
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Module
                </button>
              )}

              {/* Complete Button - Exercise */}
              {MODULE_CONTENT[activeContent.moduleId].type === 'exercise' &&
                Object.values(exerciseSteps).filter(Boolean).length ===
                  (MODULE_CONTENT[activeContent.moduleId].steps?.length || 0) && (
                  <button
                    onClick={() => {
                      setLearningPaths((paths) =>
                        paths.map((p) =>
                          p.id === activeContent.pathId
                            ? {
                                ...p,
                                modules: p.modules.map((m) =>
                                  m.id === activeContent.moduleId ? { ...m, completed: true } : m
                                ),
                                progress: Math.round(
                                  (p.modules.filter(
                                    (m) => m.completed || m.id === activeContent.moduleId
                                  ).length /
                                    p.modules.length) *
                                    100
                                ),
                              }
                            : p
                        )
                      );
                      setSelectedPath((prev) =>
                        prev
                          ? {
                              ...prev,
                              modules: prev.modules.map((m) =>
                                m.id === activeContent.moduleId ? { ...m, completed: true } : m
                              ),
                              progress: Math.round(
                                (prev.modules.filter(
                                  (m) => m.completed || m.id === activeContent.moduleId
                                ).length /
                                  prev.modules.length) *
                                  100
                              ),
                            }
                          : null
                      );
                      setActiveContent(null);
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Exercise
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GnosisPage;
