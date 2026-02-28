// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ASK COUNCIL BUTTON - Trigger Council deliberation from any page
// =============================================================================

import { useEffect, useState } from 'react';
import { MessageSquare, Sparkles, X, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface AskCouncilButtonProps {
  // Pre-filled question (optional)
  defaultQuestion?: string;
  // Context summary to include
  contextSummary?: string;
  // Source page name
  sourcePage: string;
  // Data to include in context
  contextData?: Record<string, any>;
  // Suggested council mode
  suggestedMode?: string;
  // Button variant
  variant?: 'default' | 'compact' | 'floating' | 'inline';
  // Custom class
  className?: string;
  // Priority
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export function AskCouncilButton({
  defaultQuestion = '',
  contextSummary = '',
  sourcePage,
  contextData,
  suggestedMode,
  variant = 'default',
  className,
  priority = 'medium',
}: AskCouncilButtonProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState(defaultQuestion);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setQuestion(defaultQuestion);
  }, [defaultQuestion]);

  const handleAskCouncil = async () => {
    if (!question.trim()) {return;}
    if (isSubmitting) {return;}
    
    setIsSubmitting(true);
    
    // Store context in sessionStorage for the Council page to pick up
    const queryContext = {
      question: question.trim(),
      sourcePage,
      contextSummary,
      contextData,
      suggestedMode,
      priority,
      timestamp: new Date().toISOString(),
    };
    
    sessionStorage.setItem('councilQueryContext', JSON.stringify(queryContext));
    
    // Navigate to Council page
    setIsOpen(false);
    setIsSubmitting(false);
    navigate('/cortex/council?fromContext=true');
  };

  const modal = isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Ask the Council</h3>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsSubmitting(false);
            }}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Context indicator */}
          {contextSummary && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="text-xs text-blue-400 mb-1">Context from {sourcePage}</div>
              <div className="text-sm text-gray-300">{contextSummary}</div>
            </div>
          )}

          {/* Question input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like the Council to deliberate on?"
              className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              autoFocus
            />
          </div>

          {/* Suggested mode */}
          {suggestedMode && (
            <div className="text-xs text-gray-500">
              Suggested mode: <span className="text-purple-400">{suggestedMode}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={() => {
              setIsOpen(false);
              setIsSubmitting(false);
            }}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAskCouncil}
            disabled={!question.trim() || isSubmitting}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
              question.trim() && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Ask Council
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === 'floating') {
    return (
      <>
        {/* Floating button */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3',
            'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500',
            'text-white font-medium rounded-full shadow-lg shadow-blue-500/25',
            'transition-all hover:scale-105',
            className
          )}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Ask Council</span>
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </button>

        {modal}
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 text-xs',
            'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400',
            'rounded-lg transition-colors',
            className
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Ask Council
        </button>
        {modal}
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => {
            if (question.trim()) {
              void handleAskCouncil();
            } else {
              setIsOpen(true);
            }
          }}
          className={cn(
            'inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm',
            'transition-colors underline-offset-2 hover:underline',
            className
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Ask Council about this
        </button>
        {modal}
      </>
    );
  }

  // Default variant
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2',
          'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500',
          'text-white font-medium rounded-lg transition-all',
          className
        )}
      >
        <MessageSquare className="w-4 h-4" />
        Ask Council
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
      </button>
      {modal}
    </>
  );
}

export default AskCouncilButton;
