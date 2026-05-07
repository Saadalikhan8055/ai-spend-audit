import { AuditInput, AuditRecommendation, AIToolName, UseCase } from '@/types/audit';
import { getMonthlySpend, getAnnualSpend, getToolPrice } from './pricing';

/**
 * Core audit engine logic
 * 
 * For each tool, evaluates:
 * 1. Is the user on the right plan for their usage?
 * 2. Is there a cheaper plan from the same vendor that fits?
 * 3. Is there a substantially cheaper alternative tool?
 * 4. Are they paying retail when they could get credits?
 */

interface UsageOptimization {
  tool: AIToolName;
  currentSpend: number;
  recommendedAction: string;
  estimatedSavings: number;
  reason: string;
  alternatives?: {
    tool: AIToolName;
    savingsPerMonth: number;
    rationale: string;
  }[];
}

/**
 * Evaluate if a team is properly sized for their plan
 */
function evaluatePlanFit(
  tool: AIToolName,
  plan: string,
  seats: number,
  teamSize: number,
  useCase: UseCase
): { isOptimal: boolean; recommendation?: string; potentialSavings?: number } {
  // Rule 1: Basic seat efficiency
  // If seats > teamSize * 1.5, they're over-provisioned
  if (seats > teamSize * 1.5) {
    return {
      isOptimal: false,
      recommendation: `Reduce seats from ${seats} to ${Math.ceil(teamSize)}. You have ${seats - teamSize} unused seats.`,
      potentialSavings: getMonthlySpend(tool, plan, seats - teamSize)
    };
  }

  // Rule 2: Tool-specific plan optimization
  switch (tool) {
    case 'cursor':
      // Hobby and Pro are the same price, so anyone on Hobby should consider Pro
      if (plan.toLowerCase() === 'hobby' && seats > 1) {
        return {
          isOptimal: false,
          recommendation: 'Consider Cursor Pro - same $20/month but with better team support',
          potentialSavings: 0 // Same price
        };
      }
      // Business plan ($40) vs Pro ($20) - only make sense at scale (10+ seats)
      if (plan.toLowerCase() === 'business' && seats < 10) {
        const savings = getMonthlySpend('cursor', 'business', seats) - getMonthlySpend('cursor', 'pro', seats);
        return {
          isOptimal: false,
          recommendation: `Downgrade to Cursor Pro - saves $${savings}/month for your team size`,
          potentialSavings: savings
        };
      }
      break;

    case 'claude':
      // Free plan users with 3+ seats should consider Pro or Team
      if (plan.toLowerCase() === 'free' && seats >= 3) {
        const teamCost = getMonthlySpend('claude', 'team', seats);
        return {
          isOptimal: false,
          recommendation: `Upgrade to Claude Team ($${teamCost}/month) for team collaboration features`,
          potentialSavings: -teamCost // Cost increase but added value
        };
      }
      // Pro plan with 5+ seats should consider Team ($30/seat vs $20 for Pro = $10 more per seat)
      if (plan.toLowerCase() === 'pro' && seats >= 5) {
        const proCost = getMonthlySpend('claude', 'pro', seats);
        const teamCost = getMonthlySpend('claude', 'team', seats);
        if (teamCost < proCost) {
          return {
            isOptimal: false,
            recommendation: `Upgrade to Claude Team for shared project features. Cost: $${teamCost}/month`,
            potentialSavings: -(teamCost - proCost)
          };
        }
      }
      break;

    case 'chatgpt':
      // Plus with 2+ seats should consider Team ($30/seat vs $20/seat = potential $10/seat savings if consolidated)
      if (plan.toLowerCase() === 'plus' && seats >= 2) {
        const teamCost = getMonthlySpend('chatgpt', 'team', seats);
        const plusCost = getMonthlySpend('chatgpt', 'plus', seats);
        if (teamCost < plusCost) {
          return {
            isOptimal: false,
            recommendation: `Switch to ChatGPT Team for shared workspace - saves $${plusCost - teamCost}/month`,
            potentialSavings: plusCost - teamCost
          };
        }
      }
      break;

    case 'github-copilot':
      // Individual with 3+ seats should upgrade to Business ($19 vs $10, but better team management)
      if (plan.toLowerCase() === 'individual' && seats >= 3) {
        return {
          isOptimal: false,
          recommendation: 'Upgrade to GitHub Copilot Business for enterprise controls and better team management',
          potentialSavings: -getMonthlySpend('github-copilot', 'business', seats) + getMonthlySpend('github-copilot', 'individual', seats)
        };
      }
      break;
  }

  return { isOptimal: true };
}

/**
 * Check if cheaper alternatives exist
 */
function findCheaperAlternatives(
  currentTool: AIToolName,
  currentSpend: number,
  useCase: UseCase,
  seats: number
): Array<{ tool: AIToolName; savingsPerMonth: number; rationale: string }> {
  const alternatives: Array<{ tool: AIToolName; savingsPerMonth: number; rationale: string }> = [];

  // Cursor users (coding) - consider Claude or ChatGPT
  if (currentTool === 'cursor') {
    const claudeProCost = getMonthlySpend('claude', 'pro', seats);
    if (claudeProCost < currentSpend && (useCase === 'coding' || useCase === 'mixed')) {
      alternatives.push({
        tool: 'claude',
        savingsPerMonth: currentSpend - claudeProCost,
        rationale: 'Claude Pro is comparable for coding tasks at lower cost'
      });
    }

    const chatgptPlusCost = getMonthlySpend('chatgpt', 'plus', seats);
    if (chatgptPlusCost < currentSpend && (useCase === 'coding' || useCase === 'mixed')) {
      alternatives.push({
        tool: 'chatgpt',
        savingsPerMonth: currentSpend - chatgptPlusCost,
        rationale: 'ChatGPT Plus offers similar coding assistance'
      });
    }
  }

  // Claude users (all use cases) - consider ChatGPT
  if (currentTool === 'claude' && useCase !== 'writing') {
    const chatgptCost = getMonthlySpend('chatgpt', 'plus', seats);
    if (chatgptCost < currentSpend) {
      alternatives.push({
        tool: 'chatgpt',
        savingsPerMonth: currentSpend - chatgptCost,
        rationale: 'ChatGPT Plus is comparable and may be cheaper'
      });
    }
  }

  // ChatGPT users - consider Claude
  if (currentTool === 'chatgpt' && useCase !== 'writing') {
    const claudeCost = getMonthlySpend('claude', 'pro', seats);
    if (claudeCost < currentSpend) {
      alternatives.push({
        tool: 'claude',
        savingsPerMonth: currentSpend - claudeCost,
        rationale: 'Claude offers superior reasoning at competitive pricing'
      });
    }
  }

  // GitHub Copilot users - consider Cursor
  if (currentTool === 'github-copilot' && useCase === 'coding') {
    const cursorCost = getMonthlySpend('cursor', 'pro', seats);
    if (cursorCost < currentSpend * 1.2) {
      // Cursor is within 20% price
      alternatives.push({
        tool: 'cursor',
        savingsPerMonth: Math.max(0, currentSpend - cursorCost),
        rationale: 'Cursor offers superior IDE integration for coding at similar or better price'
      });
    }
  }

  // API users - likely most cost-effective already, but mention this
  if (currentTool === 'anthropic-api' || currentTool === 'openai-api') {
    // Already on best pricing model
  }

  return alternatives.sort((a, b) => b.savingsPerMonth - a.savingsPerMonth);
}

/**
 * Main audit engine
 */
export function runAudit(input: AuditInput): {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
} {
  const recommendations: AuditRecommendation[] = [];
  let totalMonthlySavings = 0;

  for (const toolSpend of input.tools) {
    const currentMonthlySpend = toolSpend.monthlySpend || getMonthlySpend(
      toolSpend.tool,
      toolSpend.plan,
      toolSpend.seats
    );

    let estimatedSavings = 0;
    let recommendedAction = 'Continue with current plan - well optimized';
    let reason = 'Your current setup matches your team size and use case.';
    const alternatives = [];

    // Check plan fit
    const planFit = evaluatePlanFit(
      toolSpend.tool,
      toolSpend.plan,
      toolSpend.seats,
      input.teamSize,
      input.primaryUseCase
    );

    if (!planFit.isOptimal) {
      estimatedSavings = planFit.potentialSavings || 0;
      recommendedAction = planFit.recommendation || recommendedAction;
      reason = `Plan optimization for your team size (${input.teamSize} people, using for ${input.primaryUseCase})`;
    } else {
      // Check for alternatives
      const cheaperAlternatives = findCheaperAlternatives(
        toolSpend.tool,
        currentMonthlySpend,
        input.primaryUseCase,
        toolSpend.seats
      );

      if (cheaperAlternatives.length > 0) {
        const bestAlternative = cheaperAlternatives[0];
        estimatedSavings = bestAlternative.savingsPerMonth;
        recommendedAction = `Consider switching to ${bestAlternative.tool} - ${bestAlternative.rationale}`;
        reason = bestAlternative.rationale;
        alternatives.push(bestAlternative);
      } else {
        estimatedSavings = 0;
        reason = 'You are on a well-optimized plan for your needs';
      }
    }

    recommendations.push({
      tool: toolSpend.tool,
      currentSpend: currentMonthlySpend,
      recommendedAction,
      estimatedSavings: Math.max(0, estimatedSavings),
      reason,
      alternativeTools: alternatives.length > 0 ? alternatives : undefined
    });

    totalMonthlySavings += Math.max(0, estimatedSavings);
  }

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: getAnnualSpend(totalMonthlySavings)
  };
}
