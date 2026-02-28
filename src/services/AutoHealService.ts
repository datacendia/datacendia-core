// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUTO-HEAL SERVICE
// Automatic error detection, analysis, and resolution using AI Tech Team
// =============================================================================

import {
  ErrorAnalysis,
  FixSuggestion,
  TechTeamConfig,
  DEFAULT_TECH_TEAM_CONFIG,
  getTechAgent,
  assignAgentForError,
  generateFixPrompt,
} from '../lib/agents/techTeam';

// =============================================================================
// AUTO-HEAL SERVICE CLASS
// =============================================================================

class AutoHealServiceClass {
  private config: TechTeamConfig = DEFAULT_TECH_TEAM_CONFIG;
  private errorQueue: ErrorAnalysis[] = [];
  private fixHistory: FixSuggestion[] = [];
  private fixesAppliedThisHour: number = 0;
  private lastHourReset: Date = new Date();
  private listeners: Set<(error: ErrorAnalysis) => void> = new Set();
  private isProcessing: boolean = false;

  constructor() {
    this.setupErrorInterception();
    this.loadConfig();
    console.log('[AutoHeal] Service initialized');
  }

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  private loadConfig(): void {
    try {
      const saved = localStorage.getItem('autoheal_config');
      if (saved) {
        this.config = { ...DEFAULT_TECH_TEAM_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('[AutoHeal] Failed to load config:', e);
    }
  }

  public updateConfig(updates: Partial<TechTeamConfig>): void {
    this.config = { ...this.config, ...updates };
    localStorage.setItem('autoheal_config', JSON.stringify(this.config));
    console.log('[AutoHeal] Config updated:', this.config);
  }

  public getConfig(): TechTeamConfig {
    return { ...this.config };
  }

  // ===========================================================================
  // ERROR INTERCEPTION
  // ===========================================================================

  private setupErrorInterception(): void {
    // Intercept window errors
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError({
        type: 'runtime',
        message: String(message),
        source: source || 'unknown',
        line: lineno || 0,
        column: colno || 0,
        stack: error?.stack || '',
      });
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    // Intercept unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        source: 'unhandled-promise',
        line: 0,
        column: 0,
        stack: event.reason?.stack || '',
      });
    });

    // Intercept console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if it's a real error (not just a React warning)
      const message = args.map((a) => String(a)).join(' ');
      const lower = message.toLowerCase();
      const isReactWarning = lower.startsWith('warning:');

      if (
        !isReactWarning &&
        (lower.includes('error:') ||
          lower.includes('typeerror') ||
          lower.includes('uncaught') ||
          lower.includes('cannot read'))
      ) {
        this.captureError({
          type: 'console',
          message: message.substring(0, 500),
          source: 'console.error',
          line: 0,
          column: 0,
          stack: new Error().stack || '',
        });
      }

      originalConsoleError.apply(console, args);
    };

    console.log('[AutoHeal] Error interception active');
  }

  private captureError(errorInfo: {
    type: string;
    message: string;
    source: string;
    line: number;
    column: number;
    stack: string;
  }): void {
    // Parse stack trace to get file info
    const { file, line, column } = this.parseStackTrace(
      errorInfo.stack,
      errorInfo.source,
      errorInfo.line,
      errorInfo.column
    );

    // Determine severity
    const severity = this.determineSeverity(errorInfo.message, errorInfo.type);

    // Create error analysis
    const error: ErrorAnalysis = {
      id: `err_${Date.now()}_${crypto.randomUUID().slice(0, 9)}`,
      timestamp: new Date(),
      errorType: errorInfo.type,
      message: errorInfo.message,
      stackTrace: errorInfo.stack,
      file,
      line,
      column,
      severity,
      assignedAgent: assignAgentForError({
        id: '',
        timestamp: new Date(),
        errorType: errorInfo.type,
        message: errorInfo.message,
        stackTrace: errorInfo.stack,
        file,
        line,
        column,
        severity,
        assignedAgent: '',
        suggestedFix: null,
        fixApplied: false,
        fixVerified: false,
      }),
      suggestedFix: null,
      fixApplied: false,
      fixVerified: false,
    };

    // Add to queue
    this.errorQueue.push(error);

    // Notify listeners asynchronously to avoid React setState warnings during render
    setTimeout(() => {
      this.listeners.forEach((listener) => listener(error));
    }, 0);

    // Process if auto-heal is enabled
    if (this.config.autoHealEnabled) {
      this.processErrorQueue();
    }

    console.log(`[AutoHeal] Captured ${severity} error:`, errorInfo.message.substring(0, 100));
  }

  private parseStackTrace(
    stack: string,
    defaultSource: string,
    defaultLine: number,
    defaultColumn: number
  ): {
    file: string;
    line: number;
    column: number;
  } {
    if (!stack) {
      return { file: defaultSource, line: defaultLine, column: defaultColumn };
    }

    // Parse stack trace to find first app file (not node_modules)
    const lines = stack.split('\n');
    for (const line of lines) {
      // Match patterns like "at Component (file.tsx:123:45)" or "file.tsx:123:45"
      const match = line.match(/(?:at\s+)?(?:\w+\s+)?\(?([^:]+):(\d+):(\d+)\)?/);
      if (match) {
        const [, file, lineNum, colNum] = match;
        if (!file.includes('node_modules') && !file.includes('chunk-')) {
          return {
            file: file.replace(/^.*\/src\//, 'src/'),
            line: parseInt(lineNum, 10),
            column: parseInt(colNum, 10),
          };
        }
      }
    }

    return { file: defaultSource, line: defaultLine, column: defaultColumn };
  }

  private determineSeverity(message: string, type: string): 'critical' | 'high' | 'medium' | 'low' {
    const lowerMessage = message.toLowerCase();

    // Critical: App crashes, data loss, security
    if (
      lowerMessage.includes('crash') ||
      lowerMessage.includes('fatal') ||
      lowerMessage.includes('security') ||
      lowerMessage.includes('data loss')
    ) {
      return 'critical';
    }

    // High: Render failures, API failures
    if (
      type === 'runtime' ||
      lowerMessage.includes('cannot read') ||
      lowerMessage.includes('undefined') ||
      lowerMessage.includes('failed to fetch') ||
      lowerMessage.includes('network error')
    ) {
      return 'high';
    }

    // Medium: Warnings, deprecations
    if (lowerMessage.includes('warning') || lowerMessage.includes('deprecated')) {
      return 'medium';
    }

    return 'low';
  }

  // ===========================================================================
  // ERROR PROCESSING
  // ===========================================================================

  private async processErrorQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    // Reset hourly counter if needed
    const now = new Date();
    if (now.getTime() - this.lastHourReset.getTime() > 3600000) {
      this.fixesAppliedThisHour = 0;
      this.lastHourReset = now;
    }

    // Check rate limit
    if (this.fixesAppliedThisHour >= this.config.maxAutoFixesPerHour) {
      console.log('[AutoHeal] Rate limit reached, waiting...');
      return;
    }

    this.isProcessing = true;

    try {
      // Get next error that matches severity threshold
      const error = this.getNextEligibleError();
      if (!error) {
        this.isProcessing = false;
        return;
      }

      console.log(`[AutoHeal] Processing error: ${error.id}`);

      // Get assigned agent
      const agent = getTechAgent(error.assignedAgent);
      if (!agent) {
        console.warn(`[AutoHeal] No agent found for: ${error.assignedAgent}`);
        this.isProcessing = false;
        return;
      }

      console.log(`[AutoHeal] Assigned to: ${agent.name}`);

      // Generate fix using AI
      const fix = await this.generateFix(error, agent);

      if (fix) {
        error.suggestedFix = fix.description;
        this.fixHistory.push(fix);

        console.log(`[AutoHeal] Fix suggested by ${agent.name}:`, fix.description);

        // Auto-apply if configured and safe
        if (!this.config.requireApproval && fix.riskLevel === 'safe') {
          await this.applyFix(fix);
          error.fixApplied = true;
          this.fixesAppliedThisHour++;
        }
      }

      // Remove from queue
      this.errorQueue = this.errorQueue.filter((e) => e.id !== error.id);
    } catch (e) {
      console.error('[AutoHeal] Processing error:', e);
    } finally {
      this.isProcessing = false;

      // Process next if queue not empty
      if (this.errorQueue.length > 0) {
        setTimeout(() => this.processErrorQueue(), 1000);
      }
    }
  }

  private getNextEligibleError(): ErrorAnalysis | null {
    const severityOrder = ['critical', 'high', 'medium', 'low'];
    const thresholdIndex = severityOrder.indexOf(this.config.autoFixSeverity);

    for (const error of this.errorQueue) {
      const errorIndex = severityOrder.indexOf(error.severity);
      if (errorIndex <= thresholdIndex) {
        return error;
      }
    }

    return null;
  }

  /** Last error message from fix generation — exposed for UI */
  public lastGenerateError: string | null = null;

  private async generateFix(error: ErrorAnalysis, agent: any): Promise<FixSuggestion | null> {
    try {
      // Generate prompt
      const prompt = generateFixPrompt(error, agent);

      // Route through the backend API to avoid browser CORS issues with Ollama
      const response = await fetch('/api/v1/auto-heal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: agent.model,
          prompt,
          systemPrompt: agent.systemPrompt,
          options: {
            temperature: 0.3,
            num_predict: 2000,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errMsg = data.error?.message || `Backend returned ${response.status}`;
        this.lastGenerateError = errMsg;
        console.warn('[AutoHeal] Fix generation failed:', errMsg);
        return null;
      }

      this.lastGenerateError = null;
      const responseText = data.data.response;

      // Parse the JSON response
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);

        return {
          id: `fix_${Date.now()}`,
          errorId: error.id,
          agentCode: agent.code,
          description: parsed.rootCause,
          codeChange: parsed.fix,
          confidence: parsed.confidence || 0.8,
          riskLevel: parsed.riskLevel || 'moderate',
          requiresReview: parsed.riskLevel !== 'safe',
        };
      }

      // Try to extract fix from plain text
      return {
        id: `fix_${Date.now()}`,
        errorId: error.id,
        agentCode: agent.code,
        description: responseText.substring(0, 500),
        codeChange: {
          file: error.file,
          oldCode: '',
          newCode: '',
          explanation: responseText,
        },
        confidence: 0.5,
        riskLevel: 'moderate',
        requiresReview: true,
      };
    } catch (e: any) {
      this.lastGenerateError = e?.message || 'Network error reaching backend';
      console.warn('[AutoHeal] Fix generation error:', this.lastGenerateError);
      return null;
    }
  }

  private async applyFix(fix: FixSuggestion): Promise<boolean> {
    // In a real implementation, this would apply the code change
    // For now, we log the suggested fix
    console.log('[AutoHeal] Would apply fix:', fix);

    if (this.config.notifyOnFix) {
      this.notifyFixApplied(fix);
    }

    return true;
  }

  private notifyFixApplied(fix: FixSuggestion): void {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(
      new CustomEvent('autoheal:fix-applied', {
        detail: fix,
      })
    );
  }

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  /**
   * Subscribe to error events
   */
  public onError(callback: (error: ErrorAnalysis) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Get current error queue
   */
  public getErrorQueue(): ErrorAnalysis[] {
    return [...this.errorQueue];
  }

  /**
   * Get fix history
   */
  public getFixHistory(): FixSuggestion[] {
    return [...this.fixHistory];
  }

  /**
   * Manually trigger fix for an error
   */
  public async requestFix(errorId: string): Promise<FixSuggestion | null> {
    const error = this.errorQueue.find((e) => e.id === errorId);
    if (!error) {
      console.warn('[AutoHeal] requestFix: Error not found in queue:', errorId);
      return null;
    }

    const agent = getTechAgent(error.assignedAgent);
    if (!agent) {
      console.warn('[AutoHeal] requestFix: No agent found for:', error.assignedAgent);
      return null;
    }

    console.log(`[AutoHeal] Generating fix for ${errorId} using ${agent.name}...`);

    try {
      const fix = await this.generateFix(error, agent);

      if (fix) {
        // Store the fix in history
        this.fixHistory.push(fix);

        // Update the error with the suggested fix
        error.suggestedFix = fix.description;

        // Notify listeners of the update
        this.notifyFixGenerated(fix);

        console.log(`[AutoHeal] Fix generated successfully:`, fix.description.substring(0, 100));
      } else {
        console.warn('[AutoHeal] No fix generated');
      }

      return fix;
    } catch (e) {
      console.error('[AutoHeal] requestFix failed:', e);
      return null;
    }
  }

  private notifyFixGenerated(fix: FixSuggestion): void {
    window.dispatchEvent(
      new CustomEvent('autoheal:fix-generated', {
        detail: fix,
      })
    );
  }

  /**
   * Approve and apply a fix
   */
  public async approveFix(fixId: string): Promise<boolean> {
    const fix = this.fixHistory.find((f) => f.id === fixId);
    if (!fix) {
      return false;
    }

    return this.applyFix(fix);
  }

  /**
   * Clear error queue
   */
  public clearQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Get stats
   */
  public getStats(): {
    errorsInQueue: number;
    fixesApplied: number;
    fixesThisHour: number;
    isProcessing: boolean;
  } {
    return {
      errorsInQueue: this.errorQueue.length,
      fixesApplied: this.fixHistory.filter((f) => f.requiresReview === false).length,
      fixesThisHour: this.fixesAppliedThisHour,
      isProcessing: this.isProcessing,
    };
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const AutoHealService = new AutoHealServiceClass();
export default AutoHealService;
