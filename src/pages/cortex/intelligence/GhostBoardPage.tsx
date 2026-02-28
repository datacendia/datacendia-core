// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - GHOST BOARD PAGE
// Rehearse board meetings with AI directors
// =============================================================================

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import {
  decisionIntelligenceService,
  GhostBoardResult,
  BoardQuestion,
} from '../../../services/DecisionIntelligenceService';
import { ollamaService } from '../../../lib/ollama';

// Types imported from service

const BOARD_TYPES = [
  {
    id: 'standard',
    name: 'Standard Board',
    description: 'Mixed independent and investor directors',
    tooltip: 'Balanced perspective with governance focus and strategic oversight.',
  },
  {
    id: 'vc_backed',
    name: 'VC-Backed',
    description: 'Aggressive growth-focused investors',
    tooltip: 'Fast growth, burn vs runway, market size, competitive edge.',
  },
  {
    id: 'public_company',
    name: 'Public Company',
    description: 'Governance and compliance focused',
    tooltip: 'Compliance, predictability, risk and downside protection.',
  },
  {
    id: 'private_equity',
    name: 'Private Equity',
    description: 'Operations and returns focused',
    tooltip: 'Cash flow, leverage, covenant risk, exit timing.',
  },
];

const DIFFICULTY_LEVELS = [
  {
    id: 'easy',
    name: 'Warm-Up',
    description: 'Friendly questions',
    tooltip: 'Supportive, coaching tone.',
  },
  {
    id: 'medium',
    name: 'Standard',
    description: 'Typical board scrutiny',
    tooltip: 'Realistic but fair.',
  },
  {
    id: 'hard',
    name: 'Challenging',
    description: 'Tough questions',
    tooltip: 'Skeptical, detail-oriented.',
  },
  {
    id: 'brutal',
    name: 'Brutal',
    description: 'Worst case scenario',
    tooltip: 'Hostile activist / down-round scenario.',
  },
];

const PROPOSAL_PLACEHOLDER = `We're proposing a $5M increase in annual AI infra spend to move Datacendia from hybrid to fully sovereign over the next 18 months...

Current State: Currently running 60% on cloud providers with 40% on-prem.

Ask: $5M capital expenditure + $1.2M annual OpEx increase.

Timeline: 18-month implementation with Q2 2026 full sovereignty.`;

export const GhostBoardPage: React.FC = () => {
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  const [boardType, setBoardType] = useState('standard');
  const [difficulty, setDifficulty] = useState('hard');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<GhostBoardResult | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState({ available: false });

  // Check Ollama status on mount
  React.useEffect(() => {
    setOllamaStatus(ollamaService.getStatus());
  }, []);
  const [selectedQuestion, setSelectedQuestion] = useState<BoardQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

  const runSession = async () => {
    if (!proposalTitle.trim() || !proposalContent.trim()) {
      return;
    }

    setIsRunning(true);
    try {
      // Use real Decision Intelligence Service with Ollama
      const sessionResult = await decisionIntelligenceService.runGhostBoard(
        proposalTitle,
        proposalContent,
        boardType,
        difficulty
      );
      setResult(sessionResult);
    } catch (err) {
      console.error('Session failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-orange-100 text-orange-700';
      case 'brutal':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👻</span>
          <h1 className="text-3xl font-bold text-neutral-900">Ghost Board</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Rehearse your board meeting with AI directors before the real one.
        </p>
        <p className="text-sm text-neutral-500 mt-2 flex items-center gap-2">
          <span className="text-purple-500">📋</span>
          Ghost Board sessions are automatically logged to Decision DNA and Chronos.
          <span className="text-xs text-neutral-400">(marked as rehearsal)</span>
        </p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Proposal</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    placeholder="e.g., AI Infrastructure Investment Proposal"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Proposal Content *
                  </label>
                  <p className="text-xs text-neutral-500 mb-2">
                    Include: current state, what you're asking for (e.g., $ amount, headcount,
                    strategy change), and the time horizon.
                  </p>
                  <textarea
                    value={proposalContent}
                    onChange={(e) => setProposalContent(e.target.value)}
                    placeholder={PROPOSAL_PLACEHOLDER}
                    className="w-full h-48 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-500 placeholder:text-neutral-400 placeholder:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Board Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Board Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BOARD_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setBoardType(type.id)}
                        title={type.tooltip}
                        className={cn(
                          'p-3 rounded-lg border text-left transition-all group relative',
                          boardType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        )}
                      >
                        <div className="font-medium text-sm">{type.name}</div>
                        <div className="text-xs text-neutral-500">{type.description}</div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {type.tooltip}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setDifficulty(level.id)}
                        title={level.tooltip}
                        className={cn(
                          'p-2 rounded-lg border text-center transition-all group relative',
                          difficulty === level.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        )}
                      >
                        <div className="font-medium text-sm">{level.name}</div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {level.tooltip}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={runSession}
                  disabled={isRunning || !proposalTitle || !proposalContent}
                  className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium text-white',
                    'bg-gradient-to-r from-purple-500 to-indigo-500',
                    'hover:from-purple-600 hover:to-indigo-600',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all shadow-sm hover:shadow-md'
                  )}
                >
                  {isRunning ? 'Summoning Ghost Board...' : '👻 Face the Ghost Board'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8">
            <div className="text-center">
              <div className="text-8xl mb-6 opacity-50">👻</div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                Prepare to Face the Board
              </h3>
              <p className="text-neutral-500 mb-6">
                Your AI board members are waiting. They will challenge every assumption, question
                every number, and probe for weaknesses.
              </p>
              <div className="bg-white rounded-lg p-4 text-left">
                <h4 className="font-medium text-neutral-900 mb-2">What to Expect:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• 12+ challenging questions from diverse perspectives</li>
                  <li>• Suggested answers for each question</li>
                  <li>• Preparedness score and gap analysis</li>
                  <li>• Specific areas needing more preparation</li>
                  <li>
                    • Question style and aggressiveness match your selected board type and
                    difficulty
                  </li>
                  <li>
                    • A downloadable <strong>Board Prep Brief</strong> you can share with your team
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{result.proposalTitle}</h2>
                <p className="text-neutral-500">
                  {result.duration} minute session • {result.difficulty} difficulty
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {result.preparednessScore}/100
                </div>
                <div className="text-sm text-neutral-500">Preparedness</div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-neutral-700">{result.overallAssessment}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Start New Session
              </button>
              <button
                onClick={() => {
                  // Generate Board Prep Brief
                  const brief = `# Board Prep Brief: ${result.proposalTitle}
                  
## Session Summary
- **Date**: ${new Date().toLocaleDateString()}
- **Board Type**: ${boardType.replace('_', ' ').toUpperCase()}
- **Difficulty**: ${difficulty.toUpperCase()}
- **Preparedness Score**: ${result.preparednessScore}/100
- **Session Type**: REHEARSAL (Ghost Board)

## Overall Assessment
${result.overallAssessment}

## Top Questions You May Struggle With
${result.questions
  .filter((q) => q.difficulty === 'hard' || q.difficulty === 'brutal')
  .slice(0, 10)
  .map((q, i) => `${i + 1}. "${q.question}" - Asked by ${q.askedBy.name}`)
  .join('\n')}

## Suggested Answer Improvements
${result.questions
  .slice(0, 5)
  .map((q, i) => `${i + 1}. **${q.askedBy.name}**: "${q.question}"\n   → ${q.suggestedAnswer}`)
  .join('\n\n')}

## Key Gaps (Red Flags)
${result.keyGaps.map((g) => `⚠️ ${g}`).join('\n')}

## Strength Areas
${result.strengthAreas.map((s) => `✓ ${s}`).join('\n')}

---
*Generated by Datacendia Ghost Board™ | Logged to Decision DNA & Chronos*
*This is a REHEARSAL session - not an actual board deliberation*`;

                  const blob = new Blob([brief], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `board-prep-brief-${result.proposalTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-medium flex items-center gap-2"
              >
                📄 Download Board Prep Brief
              </button>
            </div>

            {/* Integration Notice */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-700 flex items-center gap-2">
                <span>📋</span>
                <span>
                  This session has been logged to <strong>Decision DNA</strong> and{' '}
                  <strong>Chronos</strong> as a rehearsal artifact.
                </span>
              </p>
            </div>
          </div>

          {/* Board Members */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Board</h3>
            <div className="flex flex-wrap gap-3">
              {result.boardMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg"
                >
                  <span className="text-xl">{member.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-neutral-500">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Questions Your Board Will Ask ({result.questions.length})
            </h3>
            <div className="space-y-3">
              {result.questions.map((question, idx) => (
                <div
                  key={question.id}
                  className={cn(
                    'p-4 rounded-lg border cursor-pointer transition-all',
                    selectedQuestion?.id === question.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                  onClick={() => setSelectedQuestion(question)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{question.askedBy.icon}</span>
                        <span className="font-medium text-neutral-900">
                          {question.askedBy.name}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            getDifficultyColor(question.difficulty)
                          )}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-neutral-700">"{question.question}"</p>
                    </div>
                    <span className="text-neutral-400">#{idx + 1}</span>
                  </div>

                  {selectedQuestion?.id === question.id && (
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="text-sm font-medium text-purple-700 mb-2">
                        Suggested Answer:
                      </div>
                      <p className="text-sm text-neutral-600 bg-white p-3 rounded-lg">
                        {question.suggestedAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gaps and Strengths */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">⚠️ Key Gaps</h3>
              <ul className="space-y-2">
                {result.keyGaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-red-700">
                    <span>•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">✓ Strengths</h3>
              <ul className="space-y-2">
                {result.strengthAreas.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-green-700">
                    <span>•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GhostBoardPage;
