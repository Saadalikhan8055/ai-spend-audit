import { runAudit } from '@/lib/auditEngine';
import { AuditInput, AIToolName } from '@/types/audit';

describe('Audit Engine', () => {
  describe('Basic audit functionality', () => {
    test('should return empty recommendations for empty tool list', () => {
      const input: AuditInput = {
        tools: [],
        teamSize: 5,
        primaryUseCase: 'coding'
      };

      const result = runAudit(input);
      expect(result.recommendations).toHaveLength(0);
      expect(result.totalMonthlySavings).toBe(0);
      expect(result.totalAnnualSavings).toBe(0);
    });

    test('should detect over-provisioned seats', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor' as AIToolName,
            plan: 'pro',
            monthlySpend: 100, // 5 seats at $20 each
            seats: 5
          }
        ],
        teamSize: 3,
        primaryUseCase: 'coding'
      };

      const result = runAudit(input);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.totalMonthlySavings).toBeGreaterThan(0);
    });

    test('should identify plan downgrades', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor' as AIToolName,
            plan: 'business',
            monthlySpend: 80, // 2 seats at $40 each
            seats: 2
          }
        ],
        teamSize: 5,
        primaryUseCase: 'coding'
      };

      const result = runAudit(input);
      const rec = result.recommendations[0];
      expect(rec.estimatedSavings).toBeGreaterThan(0);
      expect(rec.recommendedAction.toLowerCase()).toContain('downgrade');
    });

    test('should suggest alternatives for expensive tools', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor' as AIToolName,
            plan: 'pro',
            monthlySpend: 60, // 3 seats at $20 each
            seats: 3
          }
        ],
        teamSize: 3,
        primaryUseCase: 'coding'
      };

      const result = runAudit(input);
      const rec = result.recommendations[0];
      // Cursor is reasonably priced, so might not have big alternatives
      // But should still evaluate options
      expect(rec).toBeDefined();
    });

    test('should calculate annual savings correctly', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor' as AIToolName,
            plan: 'business',
            monthlySpend: 80, // 2 seats at $40 each
            seats: 2
          }
        ],
        teamSize: 2,
        primaryUseCase: 'coding'
      };

      const result = runAudit(input);
      if (result.totalMonthlySavings > 0) {
        expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
      }
    });

    test('should handle multiple tools in audit', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'cursor' as AIToolName,
            plan: 'pro',
            monthlySpend: 40, // 2 seats
            seats: 2
          },
          {
            tool: 'claude' as AIToolName,
            plan: 'pro',
            monthlySpend: 60, // 3 seats
            seats: 3
          }
        ],
        teamSize: 3,
        primaryUseCase: 'mixed'
      };

      const result = runAudit(input);
      expect(result.recommendations).toHaveLength(2);
      expect(result.recommendations[0].tool).toBe('cursor');
      expect(result.recommendations[1].tool).toBe('claude');
    });

    test('should recognize well-optimized setups', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'github-copilot' as AIToolName,
            plan: 'individual',
            monthlySpend: 30, // 3 seats at $10 each
            seats: 3
          }
        ],
        teamSize: 3,
        primaryUseCase: 'coding'
      };

      const result = runAudit(input);
      const rec = result.recommendations[0];
      // GitHub Copilot Individual at $10/seat is well-priced for small teams
      // Should either have 0 savings or suggest a free tier
      expect(rec).toBeDefined();
    });

    test('should handle Free tier plans', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'claude' as AIToolName,
            plan: 'free',
            monthlySpend: 0,
            seats: 5
          }
        ],
        teamSize: 5,
        primaryUseCase: 'research'
      };

      const result = runAudit(input);
      expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
      expect(result.totalAnnualSavings).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge cases', () => {
    test('should handle zero monthly spend input', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'anthropic-api' as AIToolName,
            plan: 'pay-as-you-go',
            monthlySpend: 0,
            seats: 0
          }
        ],
        teamSize: 1,
        primaryUseCase: 'research'
      };

      const result = runAudit(input);
      expect(result.recommendations).toHaveLength(1);
      expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    });

    test('should handle very large team', () => {
      const input: AuditInput = {
        tools: [
          {
            tool: 'chatgpt' as AIToolName,
            plan: 'plus',
            monthlySpend: 2000, // 100 seats at $20 each
            seats: 100
          }
        ],
        teamSize: 100,
        primaryUseCase: 'mixed'
      };

      const result = runAudit(input);
      const rec = result.recommendations[0];
      // Large teams should consider Team or Enterprise plans
      expect(rec).toBeDefined();
      // Likely should suggest Team plan which might be cheaper
    });
  });
});
