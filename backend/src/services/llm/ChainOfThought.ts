// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Chain-of-Thought (CoT) Service
 * Makes agents "show their work" step-by-step
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CoTStep {
  stepNumber: number;
  thought: string;
  action?: string;
  observation?: string;
  confidence?: number;
}

export interface CoTResult {
  query: string;
  steps: CoTStep[];
  finalAnswer: string;
  totalSteps: number;
  confidence: number;
  reasoning: string;
}

export type CoTTemplate = 'standard' | 'math' | 'analysis' | 'decision' | 'compliance' | 'code';

// ============================================================================
// COT TEMPLATES
// ============================================================================

const COT_TEMPLATES: Record<CoTTemplate, string> = {
  standard: `You are a careful reasoning assistant. Think through this step-by-step.

Question: {query}

Let's approach this systematically:

Step 1: Understand the question
- What is being asked?
- What are the key components?

Step 2: Identify relevant information
- What facts do I know?
- What assumptions am I making?

Step 3: Reason through the problem
- What are the logical connections?
- What conclusions can I draw?

Step 4: Formulate the answer
- Based on my reasoning, what is the answer?

Now, let me work through this:`,

  math: `You are a mathematical reasoning specialist. Solve this problem step-by-step, showing all work.

Problem: {query}

SOLUTION:

Step 1: Identify what we're solving for
[State the unknown and given information]

Step 2: Choose the approach
[State the formula or method to use]

Step 3: Set up the solution
[Write out the equations]

Step 4: Execute calculations
[Show each calculation step]

Step 5: Verify the answer
[Check if the answer makes sense]

FINAL ANSWER:`,

  analysis: `You are an analytical reasoning expert. Analyze this thoroughly.

Question: {query}

ANALYSIS:

1. CONTEXT UNDERSTANDING
   - What is the scope of this question?
   - What domain knowledge is relevant?

2. KEY FACTORS
   - What are the main variables at play?
   - What relationships exist between them?

3. EVIDENCE & DATA
   - What information supports each perspective?
   - What are the limitations of available data?

4. IMPLICATIONS
   - What are the primary consequences?
   - What are the secondary effects?

5. SYNTHESIS
   - How do these factors combine?
   - What is the overall conclusion?

Let me analyze:`,

  decision: `You are a decision-making advisor. Help evaluate this decision systematically.

Decision Question: {query}

DECISION ANALYSIS:

1. FRAME THE DECISION
   - What exactly needs to be decided?
   - What are the constraints?
   - What is the timeline?

2. IDENTIFY OPTIONS
   - What are all possible choices?
   - Are there creative alternatives?

3. EVALUATE EACH OPTION
   For each option, consider:
   - Pros (benefits, opportunities)
   - Cons (risks, costs)
   - Probability of success
   - Reversibility

4. STAKEHOLDER IMPACT
   - Who is affected?
   - How are they affected?

5. RECOMMENDATION
   - Which option is best and why?
   - What conditions would change this?

Analysis:`,

  compliance: `You are a compliance and regulatory expert. Evaluate this for compliance implications.

Query: {query}

COMPLIANCE ANALYSIS:

1. IDENTIFY APPLICABLE REGULATIONS
   - Which frameworks apply? (GDPR, HIPAA, SOX, etc.)
   - Which specific controls are relevant?

2. ASSESS CURRENT STATE
   - What is the current practice?
   - How does it compare to requirements?

3. IDENTIFY GAPS
   - Where are the compliance gaps?
   - What is the severity of each gap?

4. RISK ASSESSMENT
   - What are the regulatory risks?
   - What are the potential penalties?

5. RECOMMENDATIONS
   - What actions are needed?
   - What is the priority order?

Evaluation:`,

  code: `You are an expert programmer. Solve this coding problem step-by-step.

Problem: {query}

SOLUTION APPROACH:

1. UNDERSTAND REQUIREMENTS
   - What is the input?
   - What is the expected output?
   - What are the constraints?

2. DESIGN APPROACH
   - What algorithm or pattern fits?
   - What data structures are needed?
   - What is the time/space complexity?

3. IMPLEMENTATION PLAN
   - What are the main functions?
   - What are the edge cases?

4. CODE
   [Write clean, documented code]

5. TEST CASES
   - Test normal cases
   - Test edge cases
   - Verify output

Solution:`,
};

// ============================================================================
// CHAIN OF THOUGHT SERVICE
// ============================================================================

export class ChainOfThoughtService {
  
  /**
   * Generate a CoT prompt for a given query
   */
  generatePrompt(query: string, template: CoTTemplate = 'standard'): string {
    const templateStr = COT_TEMPLATES[template] || COT_TEMPLATES.standard;
    return templateStr.replace('{query}', query);
  }

  /**
   * Parse a CoT response into structured steps
   */
  parseResponse(response: string): CoTStep[] {
    const steps: CoTStep[] = [];
    
    // Pattern 1: "Step N:" format
    const stepPattern = /Step\s*(\d+)[:\.]?\s*([\s\S]*?)(?=Step\s*\d+|FINAL|$)/gi;
    let match;
    
    while ((match = stepPattern.exec(response)) !== null) {
      const stepNum = parseInt(match[1]);
      const content = match[2].trim();
      
      if (content) {
        steps.push({
          stepNumber: stepNum,
          thought: content,
        });
      }
    }

    // Pattern 2: Numbered list "1." format
    if (steps.length === 0) {
      const numberedPattern = /(\d+)\.\s*([\s\S]*?)(?=\d+\.|$)/g;
      while ((match = numberedPattern.exec(response)) !== null) {
        const stepNum = parseInt(match[1]);
        const content = match[2].trim();
        
        if (content && content.length > 10) {
          steps.push({
            stepNumber: stepNum,
            thought: content,
          });
        }
      }
    }

    // Pattern 3: Bullet points
    if (steps.length === 0) {
      const bulletPattern = /[-•]\s*([\s\S]*?)(?=[-•]|$)/g;
      let stepNum = 1;
      while ((match = bulletPattern.exec(response)) !== null) {
        const content = match[1].trim();
        if (content && content.length > 10) {
          steps.push({
            stepNumber: stepNum++,
            thought: content,
          });
        }
      }
    }

    // Fallback: split by paragraphs
    if (steps.length === 0) {
      const paragraphs = response.split(/\n\n+/).filter(p => p.trim().length > 20);
      paragraphs.forEach((p, i) => {
        steps.push({
          stepNumber: i + 1,
          thought: p.trim(),
        });
      });
    }

    return steps;
  }

  /**
   * Extract the final answer from a CoT response
   */
  extractFinalAnswer(response: string): string {
    // Look for explicit final answer markers
    const markers = [
      /FINAL ANSWER[:\s]*([\s\S]*?)(?=\n\n|$)/i,
      /Therefore[,:\s]*([\s\S]*?)(?=\n\n|$)/i,
      /In conclusion[,:\s]*([\s\S]*?)(?=\n\n|$)/i,
      /The answer is[:\s]*([\s\S]*?)(?=\n\n|$)/i,
      /Solution[:\s]*([\s\S]*?)(?=\n\n|$)/i,
    ];

    for (const pattern of markers) {
      const match = response.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback: return last paragraph
    const paragraphs = response.split(/\n\n+/).filter(p => p.trim());
    return paragraphs[paragraphs.length - 1]?.trim() || response.trim();
  }

  /**
   * Estimate confidence based on response characteristics
   */
  estimateConfidence(steps: CoTStep[], response: string): number {
    let confidence = 0.5; // Base confidence

    // More steps generally means more thorough reasoning
    if (steps.length >= 3) confidence += 0.1;
    if (steps.length >= 5) confidence += 0.1;

    // Presence of verification/checking
    if (/verify|check|confirm|test/i.test(response)) confidence += 0.1;

    // Explicit uncertainty markers reduce confidence
    if (/uncertain|unsure|might|possibly|perhaps/i.test(response)) confidence -= 0.15;
    if (/I don't know|cannot determine/i.test(response)) confidence -= 0.25;

    // Evidence of calculation/analysis
    if (/therefore|thus|hence|consequently/i.test(response)) confidence += 0.05;
    if (/because|since|given that/i.test(response)) confidence += 0.05;

    return Math.max(0.1, Math.min(0.99, confidence));
  }

  /**
   * Process a complete CoT interaction
   */
  processCoTResponse(query: string, response: string): CoTResult {
    const steps = this.parseResponse(response);
    const finalAnswer = this.extractFinalAnswer(response);
    const confidence = this.estimateConfidence(steps, response);

    return {
      query,
      steps,
      finalAnswer,
      totalSteps: steps.length,
      confidence,
      reasoning: steps.map(s => s.thought).join(' → '),
    };
  }

  /**
   * Select appropriate template based on query classification
   */
  selectTemplate(category: string): CoTTemplate {
    const mapping: Record<string, CoTTemplate> = {
      math: 'math',
      strategy: 'decision',
      code: 'code',
      analysis: 'analysis',
      compliance: 'compliance',
      financial: 'analysis',
      creative: 'standard',
      factual: 'standard',
      conversation: 'standard',
    };

    return mapping[category] || 'standard';
  }

  /**
   * Get all available templates
   */
  getTemplates(): CoTTemplate[] {
    return Object.keys(COT_TEMPLATES) as CoTTemplate[];
  }

  /**
   * Get a specific template
   */
  getTemplate(name: CoTTemplate): string {
    return COT_TEMPLATES[name] || COT_TEMPLATES.standard;
  }
}

export const chainOfThought = new ChainOfThoughtService();
