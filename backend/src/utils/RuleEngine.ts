// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - RULE ENGINE
// JSON-based rule evaluation engine for compliance, guardrails, and policies
// =============================================================================

import { logger } from './logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type RuleOperator =
  | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'notIn' | 'contains' | 'notContains'
  | 'startsWith' | 'endsWith' | 'matches'
  | 'between' | 'exists' | 'notExists'
  | 'and' | 'or' | 'not';

export interface RuleCondition {
  field?: string;
  operator: RuleOperator;
  value?: unknown;
  conditions?: RuleCondition[]; // For and/or/not
}

export interface Rule {
  id: string;
  name: string;
  description?: string;
  priority: number; // Lower = higher priority
  condition: RuleCondition;
  action: RuleAction;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export interface RuleAction {
  type: 'allow' | 'deny' | 'warn' | 'escalate' | 'log' | 'transform' | 'custom';
  message?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  data?: Record<string, unknown>;
}

export interface RuleResult {
  ruleId: string;
  ruleName: string;
  triggered: boolean;
  action: RuleAction | null;
  matchedConditions: string[];
  evaluationTimeMs: number;
}

export interface RuleSetResult {
  results: RuleResult[];
  triggered: RuleResult[];
  denied: RuleResult[];
  warnings: RuleResult[];
  allPassed: boolean;
  evaluationTimeMs: number;
}

// =============================================================================
// RULE ENGINE
// =============================================================================

export class RuleEngine {
  private rules: Map<string, Rule> = new Map();

  constructor(rules?: Rule[]) {
    if (rules) {
      for (const rule of rules) {
        this.addRule(rule);
      }
    }
  }

  addRule(rule: Rule): void {
    this.rules.set(rule.id, rule);
  }

  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  getRule(ruleId: string): Rule | undefined {
    return this.rules.get(ruleId);
  }

  listRules(): Rule[] {
    return Array.from(this.rules.values()).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Evaluate all rules against a context
   */
  evaluate(context: Record<string, unknown>): RuleSetResult {
    const start = performance.now();
    const results: RuleResult[] = [];

    const sortedRules = this.listRules().filter(r => r.enabled);

    for (const rule of sortedRules) {
      const ruleStart = performance.now();
      const matchedConditions: string[] = [];
      const triggered = this.evaluateCondition(rule.condition, context, matchedConditions);

      results.push({
        ruleId: rule.id,
        ruleName: rule.name,
        triggered,
        action: triggered ? rule.action : null,
        matchedConditions,
        evaluationTimeMs: performance.now() - ruleStart,
      });
    }

    const triggered = results.filter(r => r.triggered);
    const denied = triggered.filter(r => r.action?.type === 'deny');
    const warnings = triggered.filter(r => r.action?.type === 'warn');

    return {
      results,
      triggered,
      denied,
      warnings,
      allPassed: denied.length === 0,
      evaluationTimeMs: performance.now() - start,
    };
  }

  /**
   * Evaluate a single rule against a context
   */
  evaluateRule(ruleId: string, context: Record<string, unknown>): RuleResult | null {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) return null;

    const start = performance.now();
    const matchedConditions: string[] = [];
    const triggered = this.evaluateCondition(rule.condition, context, matchedConditions);

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      triggered,
      action: triggered ? rule.action : null,
      matchedConditions,
      evaluationTimeMs: performance.now() - start,
    };
  }

  // ---------------------------------------------------------------------------
  // CONDITION EVALUATION
  // ---------------------------------------------------------------------------

  private evaluateCondition(
    condition: RuleCondition,
    context: Record<string, unknown>,
    matched: string[]
  ): boolean {
    try {
      switch (condition.operator) {
        case 'and':
          return this.evaluateLogical(condition, context, matched, 'and');
        case 'or':
          return this.evaluateLogical(condition, context, matched, 'or');
        case 'not':
          return !this.evaluateLogical(condition, context, matched, 'and');
        default:
          return this.evaluateComparison(condition, context, matched);
      }
    } catch (error) {
      logger.warn(`Rule condition evaluation error: ${error}`);
      return false;
    }
  }

  private evaluateLogical(
    condition: RuleCondition,
    context: Record<string, unknown>,
    matched: string[],
    type: 'and' | 'or'
  ): boolean {
    if (!condition.conditions || condition.conditions.length === 0) return false;

    if (type === 'and') {
      return condition.conditions.every(c => this.evaluateCondition(c, context, matched));
    }
    return condition.conditions.some(c => this.evaluateCondition(c, context, matched));
  }

  private evaluateComparison(
    condition: RuleCondition,
    context: Record<string, unknown>,
    matched: string[]
  ): boolean {
    if (!condition.field) return false;

    const fieldValue = this.resolveField(condition.field, context);
    const result = this.compare(condition.operator, fieldValue, condition.value);

    if (result) {
      matched.push(`${condition.field} ${condition.operator} ${JSON.stringify(condition.value)}`);
    }

    return result;
  }

  private resolveField(fieldPath: string, context: Record<string, unknown>): unknown {
    const parts = fieldPath.split('.');
    let current: unknown = context;

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (typeof current === 'object') {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  private compare(operator: RuleOperator, fieldValue: unknown, ruleValue: unknown): boolean {
    switch (operator) {
      case 'eq':
        return fieldValue === ruleValue;
      case 'neq':
        return fieldValue !== ruleValue;
      case 'gt':
        return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue > ruleValue;
      case 'gte':
        return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue >= ruleValue;
      case 'lt':
        return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue < ruleValue;
      case 'lte':
        return typeof fieldValue === 'number' && typeof ruleValue === 'number' && fieldValue <= ruleValue;
      case 'in':
        return Array.isArray(ruleValue) && ruleValue.includes(fieldValue);
      case 'notIn':
        return Array.isArray(ruleValue) && !ruleValue.includes(fieldValue);
      case 'contains':
        return typeof fieldValue === 'string' && typeof ruleValue === 'string' && fieldValue.includes(ruleValue);
      case 'notContains':
        return typeof fieldValue === 'string' && typeof ruleValue === 'string' && !fieldValue.includes(ruleValue);
      case 'startsWith':
        return typeof fieldValue === 'string' && typeof ruleValue === 'string' && fieldValue.startsWith(ruleValue);
      case 'endsWith':
        return typeof fieldValue === 'string' && typeof ruleValue === 'string' && fieldValue.endsWith(ruleValue);
      case 'matches':
        return typeof fieldValue === 'string' && typeof ruleValue === 'string' && new RegExp(ruleValue).test(fieldValue);
      case 'between': {
        if (typeof fieldValue !== 'number' || !Array.isArray(ruleValue) || ruleValue.length !== 2) return false;
        const [min, max] = ruleValue as [number, number];
        return fieldValue >= min && fieldValue <= max;
      }
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'notExists':
        return fieldValue === undefined || fieldValue === null;
      default:
        return false;
    }
  }
}

// =============================================================================
// EXPRESSION PARSER
// Safe expression evaluation for guardrails, thresholds, and conditions
// =============================================================================

export type ExpressionOperator = '==' | '!=' | '>' | '>=' | '<' | '<=' | '&&' | '||' | '!';

export interface ExpressionNode {
  type: 'comparison' | 'logical' | 'literal' | 'field' | 'function';
  operator?: ExpressionOperator | string;
  left?: ExpressionNode;
  right?: ExpressionNode;
  value?: unknown;
  field?: string;
  name?: string;
  args?: ExpressionNode[];
}

/**
 * Safe expression parser and evaluator.
 * Supports field references, comparisons, logical operators, and built-in functions.
 * Does NOT use eval() — all parsing is done via a recursive descent parser.
 */
export class ExpressionParser {
  private readonly builtins = new Map<string, (...args: unknown[]) => unknown>();

  constructor() {
    this.builtins.set('abs', (x: unknown) => Math.abs(Number(x)));
    this.builtins.set('min', (...args: unknown[]) => Math.min(...args.map(Number)));
    this.builtins.set('max', (...args: unknown[]) => Math.max(...args.map(Number)));
    this.builtins.set('floor', (x: unknown) => Math.floor(Number(x)));
    this.builtins.set('ceil', (x: unknown) => Math.ceil(Number(x)));
    this.builtins.set('round', (x: unknown) => Math.round(Number(x)));
    this.builtins.set('len', (x: unknown) => Array.isArray(x) ? x.length : typeof x === 'string' ? x.length : 0);
    this.builtins.set('lower', (x: unknown) => String(x).toLowerCase());
    this.builtins.set('upper', (x: unknown) => String(x).toUpperCase());
    this.builtins.set('now', () => Date.now());
    this.builtins.set('daysSince', (x: unknown) => {
      const date = new Date(String(x));
      return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    });
    this.builtins.set('includes', (arr: unknown, val: unknown) => Array.isArray(arr) && arr.includes(val));
    this.builtins.set('sum', (...args: unknown[]) => args.reduce((a: number, b) => a + Number(b), 0));
    this.builtins.set('avg', (...args: unknown[]) => args.length > 0 ? args.reduce((a: number, b) => a + Number(b), 0) / args.length : 0);
  }

  /**
   * Parse and evaluate an expression string against a context
   * 
   * Supported syntax:
   * - Field references: `field.path`, `nested.deep.value`
   * - Comparisons: `field > 5`, `status == 'active'`, `score >= 80`
   * - Logical: `field > 5 && field < 100`, `a == 1 || b == 2`
   * - Functions: `abs(field)`, `len(items)`, `daysSince(createdAt)`
   * - Literals: numbers, strings (single-quoted), true, false, null
   */
  evaluate(expression: string, context: Record<string, unknown>): unknown {
    const tokens = this.tokenize(expression);
    const ast = this.parseExpression(tokens, 0);
    return this.evaluateNode(ast.node, context);
  }

  /**
   * Evaluate a boolean expression (returns boolean)
   */
  evaluateBoolean(expression: string, context: Record<string, unknown>): boolean {
    const result = this.evaluate(expression, context);
    return Boolean(result);
  }

  /**
   * Evaluate a numeric expression (returns number)
   */
  evaluateNumber(expression: string, context: Record<string, unknown>): number {
    const result = this.evaluate(expression, context);
    return Number(result);
  }

  // ---------------------------------------------------------------------------
  // TOKENIZER
  // ---------------------------------------------------------------------------

  private tokenize(expression: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    const expr = expression.trim();

    while (i < expr.length) {
      // Skip whitespace
      if (/\s/.test(expr[i])) { i++; continue; }

      // Two-character operators
      if (i + 1 < expr.length) {
        const two = expr.substring(i, i + 2);
        if (['==', '!=', '>=', '<=', '&&', '||'].includes(two)) {
          tokens.push(two);
          i += 2;
          continue;
        }
      }

      // Single-character operators and delimiters
      if ('><!=(),.+-*/%'.includes(expr[i])) {
        tokens.push(expr[i]);
        i++;
        continue;
      }

      // String literals (single-quoted)
      if (expr[i] === "'") {
        let str = '';
        i++; // skip opening quote
        while (i < expr.length && expr[i] !== "'") {
          if (expr[i] === '\\' && i + 1 < expr.length) {
            str += expr[i + 1];
            i += 2;
          } else {
            str += expr[i];
            i++;
          }
        }
        i++; // skip closing quote
        tokens.push(`'${str}'`);
        continue;
      }

      // Numbers
      if (/[0-9]/.test(expr[i]) || (expr[i] === '-' && i + 1 < expr.length && /[0-9]/.test(expr[i + 1]))) {
        let num = '';
        if (expr[i] === '-') { num += '-'; i++; }
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          num += expr[i];
          i++;
        }
        tokens.push(num);
        continue;
      }

      // Identifiers (field names, function names, true/false/null)
      if (/[a-zA-Z_$]/.test(expr[i])) {
        let ident = '';
        while (i < expr.length && /[a-zA-Z0-9_.$]/.test(expr[i])) {
          ident += expr[i];
          i++;
        }
        tokens.push(ident);
        continue;
      }

      // Unknown character, skip
      i++;
    }

    return tokens;
  }

  // ---------------------------------------------------------------------------
  // RECURSIVE DESCENT PARSER
  // ---------------------------------------------------------------------------

  private parseExpression(tokens: string[], pos: number): { node: ExpressionNode; pos: number } {
    return this.parseOr(tokens, pos);
  }

  private parseOr(tokens: string[], pos: number): { node: ExpressionNode; pos: number } {
    let result = this.parseAnd(tokens, pos);
    while (result.pos < tokens.length && tokens[result.pos] === '||') {
      result.pos++;
      const right = this.parseAnd(tokens, result.pos);
      result = {
        node: { type: 'logical', operator: '||', left: result.node, right: right.node },
        pos: right.pos,
      };
    }
    return result;
  }

  private parseAnd(tokens: string[], pos: number): { node: ExpressionNode; pos: number } {
    let result = this.parseComparison(tokens, pos);
    while (result.pos < tokens.length && tokens[result.pos] === '&&') {
      result.pos++;
      const right = this.parseComparison(tokens, result.pos);
      result = {
        node: { type: 'logical', operator: '&&', left: result.node, right: right.node },
        pos: right.pos,
      };
    }
    return result;
  }

  private parseComparison(tokens: string[], pos: number): { node: ExpressionNode; pos: number } {
    const left = this.parsePrimary(tokens, pos);
    if (left.pos < tokens.length && ['==', '!=', '>', '>=', '<', '<='].includes(tokens[left.pos])) {
      const op = tokens[left.pos] as ExpressionOperator;
      const right = this.parsePrimary(tokens, left.pos + 1);
      return {
        node: { type: 'comparison', operator: op, left: left.node, right: right.node },
        pos: right.pos,
      };
    }
    return left;
  }

  private parsePrimary(tokens: string[], pos: number): { node: ExpressionNode; pos: number } {
    if (pos >= tokens.length) {
      return { node: { type: 'literal', value: undefined }, pos };
    }

    const token = tokens[pos];

    // Negation
    if (token === '!') {
      const inner = this.parsePrimary(tokens, pos + 1);
      return {
        node: { type: 'logical', operator: '!', left: inner.node },
        pos: inner.pos,
      };
    }

    // Unary minus (negative numbers)
    if (token === '-' && pos + 1 < tokens.length && /^[0-9]/.test(tokens[pos + 1])) {
      const numToken = tokens[pos + 1];
      if (/^[0-9]+(\.[0-9]+)?$/.test(numToken)) {
        return { node: { type: 'literal', value: -parseFloat(numToken) }, pos: pos + 2 };
      }
    }

    // Parenthesized expression
    if (token === '(') {
      const inner = this.parseExpression(tokens, pos + 1);
      if (inner.pos < tokens.length && tokens[inner.pos] === ')') {
        return { node: inner.node, pos: inner.pos + 1 };
      }
      return inner;
    }

    // String literal
    if (token.startsWith("'") && token.endsWith("'")) {
      return { node: { type: 'literal', value: token.slice(1, -1) }, pos: pos + 1 };
    }

    // Number literal
    if (/^-?[0-9]+(\.[0-9]+)?$/.test(token)) {
      return { node: { type: 'literal', value: parseFloat(token) }, pos: pos + 1 };
    }

    // Boolean/null literals
    if (token === 'true') return { node: { type: 'literal', value: true }, pos: pos + 1 };
    if (token === 'false') return { node: { type: 'literal', value: false }, pos: pos + 1 };
    if (token === 'null') return { node: { type: 'literal', value: null }, pos: pos + 1 };

    // Function call or field reference
    if (/^[a-zA-Z_$]/.test(token)) {
      // Check if it's a function call
      if (pos + 1 < tokens.length && tokens[pos + 1] === '(') {
        const args: ExpressionNode[] = [];
        let argPos = pos + 2; // skip name and '('
        while (argPos < tokens.length && tokens[argPos] !== ')') {
          if (tokens[argPos] === ',') { argPos++; continue; }
          const arg = this.parseExpression(tokens, argPos);
          args.push(arg.node);
          argPos = arg.pos;
        }
        if (argPos < tokens.length) argPos++; // skip ')'
        return {
          node: { type: 'function', name: token, args },
          pos: argPos,
        };
      }

      // Field reference
      return { node: { type: 'field', field: token }, pos: pos + 1 };
    }

    return { node: { type: 'literal', value: token }, pos: pos + 1 };
  }

  // ---------------------------------------------------------------------------
  // AST EVALUATOR
  // ---------------------------------------------------------------------------

  private evaluateNode(node: ExpressionNode, context: Record<string, unknown>): unknown {
    switch (node.type) {
      case 'literal':
        return node.value;

      case 'field':
        return this.resolveField(node.field!, context);

      case 'function':
        return this.evaluateFunction(node, context);

      case 'comparison': {
        const left = this.evaluateNode(node.left!, context);
        const right = this.evaluateNode(node.right!, context);
        return this.compareValues(node.operator as ExpressionOperator, left, right);
      }

      case 'logical': {
        if (node.operator === '!') {
          return !this.evaluateNode(node.left!, context);
        }
        const left = Boolean(this.evaluateNode(node.left!, context));
        if (node.operator === '&&') {
          return left && Boolean(this.evaluateNode(node.right!, context));
        }
        if (node.operator === '||') {
          return left || Boolean(this.evaluateNode(node.right!, context));
        }
        return false;
      }

      default:
        return undefined;
    }
  }

  private evaluateFunction(node: ExpressionNode, context: Record<string, unknown>): unknown {
    const fn = this.builtins.get(node.name!);
    if (!fn) {
      logger.warn(`Unknown function: ${node.name}`);
      return undefined;
    }
    const args = (node.args || []).map(arg => this.evaluateNode(arg, context));
    return fn(...args);
  }

  private resolveField(fieldPath: string, context: Record<string, unknown>): unknown {
    const parts = fieldPath.split('.');
    let current: unknown = context;

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (typeof current === 'object') {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  private compareValues(op: ExpressionOperator, left: unknown, right: unknown): boolean {
    switch (op) {
      case '==': return left === right;
      case '!=': return left !== right;
      case '>': return Number(left) > Number(right);
      case '>=': return Number(left) >= Number(right);
      case '<': return Number(left) < Number(right);
      case '<=': return Number(left) <= Number(right);
      default: return false;
    }
  }
}

// =============================================================================
// SINGLETON INSTANCES
// =============================================================================

export const expressionParser = new ExpressionParser();

// =============================================================================
// HELPER: Convert string condition to RuleCondition
// Parses simple expressions like "creditScore < 500" into RuleCondition objects
// =============================================================================

export function parseConditionString(condition: string): RuleCondition {
  // Check for logical operators FIRST (they have lower precedence)
  if (condition.includes(' || ')) {
    const parts = condition.split(' || ');
    return {
      operator: 'or',
      conditions: parts.map(p => parseConditionString(p.trim())),
    };
  }

  if (condition.includes(' && ')) {
    const parts = condition.split(' && ');
    return {
      operator: 'and',
      conditions: parts.map(p => parseConditionString(p.trim())),
    };
  }

  // Try to parse as a comparison: "field operator value"
  const compMatch = condition.match(/^(\S+)\s*(==|!=|>=|<=|>|<|in|contains)\s*(.+)$/);
  if (compMatch) {
    const [, field, op, rawValue] = compMatch;
    let value: unknown = rawValue.trim();
    // Parse value type
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value === 'null') value = null;
    else if (/^-?\d+(\.\d+)?$/.test(value as string)) value = parseFloat(value as string);
    else if ((value as string).startsWith('[')) {
      try { value = JSON.parse(value as string); } catch { /* keep as string */ }
    }
    else if ((value as string).startsWith("'") && (value as string).endsWith("'")) {
      value = (value as string).slice(1, -1);
    }

    const operatorMap: Record<string, RuleOperator> = {
      '==': 'eq', '!=': 'neq', '>': 'gt', '>=': 'gte', '<': 'lt', '<=': 'lte',
      'in': 'in', 'contains': 'contains',
    };

    return {
      field,
      operator: operatorMap[op] || 'eq',
      value,
    };
  }

  // Fallback: check if field exists
  return { field: condition.trim(), operator: 'exists' };
}
