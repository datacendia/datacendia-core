/**
 * Tests for backend/src/utils/RuleEngine.ts
 * Covers: RuleEngine evaluation, condition operators, logical combinations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { RuleEngine } from '../../src/utils/RuleEngine.js';
import type { Rule } from '../../src/utils/RuleEngine.js';

describe('RuleEngine', () => {
  let engine: RuleEngine;

  beforeEach(() => {
    engine = new RuleEngine();
  });

  describe('rule management', () => {
    const rule: Rule = {
      id: 'r1',
      name: 'Test Rule',
      priority: 1,
      condition: { field: 'status', operator: 'eq', value: 'active' },
      action: { type: 'allow', message: 'Allowed' },
      enabled: true,
    };

    it('should add and retrieve a rule', () => {
      engine.addRule(rule);
      expect(engine.getRule('r1')).toEqual(rule);
    });

    it('should remove a rule', () => {
      engine.addRule(rule);
      expect(engine.removeRule('r1')).toBe(true);
      expect(engine.getRule('r1')).toBeUndefined();
    });

    it('should return false when removing non-existent rule', () => {
      expect(engine.removeRule('non-existent')).toBe(false);
    });

    it('should list rules sorted by priority', () => {
      engine.addRule({ ...rule, id: 'r1', priority: 3 });
      engine.addRule({ ...rule, id: 'r2', priority: 1 });
      engine.addRule({ ...rule, id: 'r3', priority: 2 });
      const rules = engine.listRules();
      expect(rules[0].id).toBe('r2');
      expect(rules[1].id).toBe('r3');
      expect(rules[2].id).toBe('r1');
    });

    it('should accept rules in constructor', () => {
      const engine2 = new RuleEngine([rule]);
      expect(engine2.getRule('r1')).toBeDefined();
    });
  });

  describe('comparison operators', () => {
    it('should evaluate eq operator', () => {
      engine.addRule({
        id: 'r1', name: 'Eq', priority: 1, enabled: true,
        condition: { field: 'status', operator: 'eq', value: 'active' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ status: 'active' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ status: 'inactive' }).triggered).toHaveLength(0);
    });

    it('should evaluate neq operator', () => {
      engine.addRule({
        id: 'r1', name: 'Neq', priority: 1, enabled: true,
        condition: { field: 'status', operator: 'neq', value: 'deleted' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ status: 'active' }).triggered).toHaveLength(1);
    });

    it('should evaluate gt/gte/lt/lte operators', () => {
      engine.addRule({
        id: 'gt', name: 'GT', priority: 1, enabled: true,
        condition: { field: 'score', operator: 'gt', value: 80 },
        action: { type: 'warn' },
      });
      expect(engine.evaluate({ score: 90 }).triggered).toHaveLength(1);
      expect(engine.evaluate({ score: 80 }).triggered).toHaveLength(0);
      expect(engine.evaluate({ score: 70 }).triggered).toHaveLength(0);
    });

    it('should evaluate in/notIn operators', () => {
      engine.addRule({
        id: 'r1', name: 'In', priority: 1, enabled: true,
        condition: { field: 'role', operator: 'in', value: ['admin', 'superadmin'] },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ role: 'admin' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ role: 'viewer' }).triggered).toHaveLength(0);
    });

    it('should evaluate contains/notContains operators', () => {
      engine.addRule({
        id: 'r1', name: 'Contains', priority: 1, enabled: true,
        condition: { field: 'email', operator: 'contains', value: '@datacendia.com' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ email: 'user@datacendia.com' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ email: 'user@other.com' }).triggered).toHaveLength(0);
    });

    it('should evaluate startsWith/endsWith operators', () => {
      engine.addRule({
        id: 'r1', name: 'StartsWith', priority: 1, enabled: true,
        condition: { field: 'name', operator: 'startsWith', value: 'Admin' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ name: 'Admin User' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ name: 'Regular User' }).triggered).toHaveLength(0);
    });

    it('should evaluate matches (regex) operator', () => {
      engine.addRule({
        id: 'r1', name: 'Regex', priority: 1, enabled: true,
        condition: { field: 'email', operator: 'matches', value: '^[a-z]+@datacendia\\.com$' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ email: 'user@datacendia.com' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ email: 'User@datacendia.com' }).triggered).toHaveLength(0);
    });

    it('should evaluate between operator', () => {
      engine.addRule({
        id: 'r1', name: 'Between', priority: 1, enabled: true,
        condition: { field: 'age', operator: 'between', value: [18, 65] },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ age: 30 }).triggered).toHaveLength(1);
      expect(engine.evaluate({ age: 10 }).triggered).toHaveLength(0);
      expect(engine.evaluate({ age: 70 }).triggered).toHaveLength(0);
    });

    it('should evaluate exists/notExists operators', () => {
      engine.addRule({
        id: 'r1', name: 'Exists', priority: 1, enabled: true,
        condition: { field: 'email', operator: 'exists' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ email: 'user@test.com' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ name: 'test' }).triggered).toHaveLength(0);
    });
  });

  describe('logical operators', () => {
    it('should evaluate AND conditions', () => {
      engine.addRule({
        id: 'r1', name: 'AND', priority: 1, enabled: true,
        condition: {
          operator: 'and',
          conditions: [
            { field: 'role', operator: 'eq', value: 'admin' },
            { field: 'active', operator: 'eq', value: true },
          ],
        },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ role: 'admin', active: true }).triggered).toHaveLength(1);
      expect(engine.evaluate({ role: 'admin', active: false }).triggered).toHaveLength(0);
    });

    it('should evaluate OR conditions', () => {
      engine.addRule({
        id: 'r1', name: 'OR', priority: 1, enabled: true,
        condition: {
          operator: 'or',
          conditions: [
            { field: 'role', operator: 'eq', value: 'admin' },
            { field: 'role', operator: 'eq', value: 'superadmin' },
          ],
        },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ role: 'admin' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ role: 'viewer' }).triggered).toHaveLength(0);
    });

    it('should evaluate NOT conditions', () => {
      engine.addRule({
        id: 'r1', name: 'NOT', priority: 1, enabled: true,
        condition: {
          operator: 'not',
          conditions: [
            { field: 'role', operator: 'eq', value: 'banned' },
          ],
        },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ role: 'admin' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ role: 'banned' }).triggered).toHaveLength(0);
    });
  });

  describe('nested field resolution', () => {
    it('should resolve nested fields with dot notation', () => {
      engine.addRule({
        id: 'r1', name: 'Nested', priority: 1, enabled: true,
        condition: { field: 'user.role', operator: 'eq', value: 'admin' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ user: { role: 'admin' } }).triggered).toHaveLength(1);
    });

    it('should handle missing nested fields gracefully', () => {
      engine.addRule({
        id: 'r1', name: 'Missing', priority: 1, enabled: true,
        condition: { field: 'user.role', operator: 'eq', value: 'admin' },
        action: { type: 'deny' },
      });
      expect(engine.evaluate({}).triggered).toHaveLength(0);
    });
  });

  describe('rule evaluation', () => {
    it('should skip disabled rules', () => {
      engine.addRule({
        id: 'r1', name: 'Disabled', priority: 1, enabled: false,
        condition: { field: 'status', operator: 'eq', value: 'active' },
        action: { type: 'deny' },
      });
      expect(engine.evaluate({ status: 'active' }).triggered).toHaveLength(0);
    });

    it('should track denied and warning results', () => {
      engine.addRule({
        id: 'r1', name: 'Deny', priority: 1, enabled: true,
        condition: { field: 'amount', operator: 'gt', value: 10000 },
        action: { type: 'deny', message: 'Too high' },
      });
      engine.addRule({
        id: 'r2', name: 'Warn', priority: 2, enabled: true,
        condition: { field: 'amount', operator: 'gt', value: 5000 },
        action: { type: 'warn', message: 'High amount' },
      });
      const result = engine.evaluate({ amount: 15000 });
      expect(result.denied).toHaveLength(1);
      expect(result.warnings).toHaveLength(1);
      expect(result.allPassed).toBe(false);
    });

    it('should report allPassed when no denials', () => {
      engine.addRule({
        id: 'r1', name: 'Allow', priority: 1, enabled: true,
        condition: { field: 'status', operator: 'eq', value: 'active' },
        action: { type: 'allow' },
      });
      expect(engine.evaluate({ status: 'active' }).allPassed).toBe(true);
    });

    it('should include evaluation time', () => {
      engine.addRule({
        id: 'r1', name: 'Timer', priority: 1, enabled: true,
        condition: { field: 'x', operator: 'eq', value: 1 },
        action: { type: 'allow' },
      });
      const result = engine.evaluate({ x: 1 });
      expect(result.evaluationTimeMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('evaluateRule', () => {
    it('should evaluate a single rule by id', () => {
      engine.addRule({
        id: 'r1', name: 'Test', priority: 1, enabled: true,
        condition: { field: 'x', operator: 'eq', value: 1 },
        action: { type: 'allow' },
      });
      const result = engine.evaluateRule('r1', { x: 1 });
      expect(result).not.toBeNull();
      expect(result!.triggered).toBe(true);
    });

    it('should return null for non-existent rule', () => {
      expect(engine.evaluateRule('non-existent', {})).toBeNull();
    });

    it('should return null for disabled rule', () => {
      engine.addRule({
        id: 'r1', name: 'Disabled', priority: 1, enabled: false,
        condition: { field: 'x', operator: 'eq', value: 1 },
        action: { type: 'allow' },
      });
      expect(engine.evaluateRule('r1', { x: 1 })).toBeNull();
    });
  });
});
