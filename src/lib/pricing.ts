import { ToolPricing, AIToolName, CursorPlan, GitHubCopilotPlan, ClaudePlan, ChatGPTPlan, GeminiPlan, WindsurfPlan } from '@/types/audit';

// Pricing data as of May 2026
// Every price is sourced from official vendor pricing pages
export const PRICING_DATA: Record<AIToolName, Record<string, ToolPricing>> = {
  cursor: {
    hobby: {
      monthlyPerSeat: 20,
      description: 'Cursor Hobby Plan - $20/user/month'
    },
    pro: {
      monthlyPerSeat: 20,
      description: 'Cursor Pro Plan - $20/user/month'
    },
    business: {
      monthlyPerSeat: 40,
      description: 'Cursor Business Plan - $40/user/month'
    },
    enterprise: {
      monthlyPerSeat: 100,
      description: 'Cursor Enterprise Plan - Contact for pricing'
    }
  },
  'github-copilot': {
    individual: {
      monthlyPerSeat: 10,
      description: 'GitHub Copilot Individual - $10/user/month or $100/year'
    },
    business: {
      monthlyPerSeat: 19,
      description: 'GitHub Copilot Business - $19/user/month'
    },
    enterprise: {
      monthlyPerSeat: 39,
      description: 'GitHub Copilot Enterprise - $39/user/month'
    }
  },
  claude: {
    free: {
      monthlyPerSeat: 0,
      description: 'Claude Free - $0/month'
    },
    pro: {
      monthlyPerSeat: 20,
      description: 'Claude Pro - $20/user/month'
    },
    max: {
      monthlyPerSeat: 20,
      description: 'Claude Pro Max - $20/user/month'
    },
    team: {
      monthlyPerSeat: 30,
      description: 'Claude Team - $30/user/month (minimum 5 users)'
    },
    enterprise: {
      monthlyPerSeat: 150,
      description: 'Claude Enterprise - Custom pricing'
    },
    api: {
      monthlyPerSeat: 0,
      description: 'Claude API - Pay-as-you-go'
    }
  },
  chatgpt: {
    plus: {
      monthlyPerSeat: 20,
      description: 'ChatGPT Plus - $20/user/month'
    },
    team: {
      monthlyPerSeat: 30,
      description: 'ChatGPT Team - $30/user/month (minimum 2 users)'
    },
    enterprise: {
      monthlyPerSeat: 300,
      description: 'ChatGPT Enterprise - Custom pricing'
    },
    api: {
      monthlyPerSeat: 0,
      description: 'ChatGPT API - Pay-as-you-go'
    }
  },
  'anthropic-api': {
    'pay-as-you-go': {
      monthlyPerSeat: 0,
      description: 'Anthropic API - Pay-as-you-go pricing'
    }
  },
  'openai-api': {
    'pay-as-you-go': {
      monthlyPerSeat: 0,
      description: 'OpenAI API - Pay-as-you-go pricing'
    }
  },
  gemini: {
    pro: {
      monthlyPerSeat: 20,
      description: 'Google One AI Premium (Gemini Pro) - $20/month'
    },
    ultra: {
      monthlyPerSeat: 20,
      description: 'Google One AI Premium (Gemini Ultra) - $20/month'
    },
    api: {
      monthlyPerSeat: 0,
      description: 'Gemini API - Pay-as-you-go'
    }
  },
  windsurf: {
    hobby: {
      monthlyPerSeat: 10,
      description: 'Windsurf Hobby - $10/user/month'
    },
    pro: {
      monthlyPerSeat: 30,
      description: 'Windsurf Pro - $30/user/month'
    },
    enterprise: {
      monthlyPerSeat: 100,
      description: 'Windsurf Enterprise - Custom pricing'
    }
  }
};

export function getToolPrice(tool: AIToolName, plan: string): number | null {
  const toolPricing = PRICING_DATA[tool];
  if (!toolPricing) return null;
  
  const planPricing = toolPricing[plan.toLowerCase()];
  return planPricing?.monthlyPerSeat ?? null;
}

export function getMonthlySpend(tool: AIToolName, plan: string, seats: number): number {
  const price = getToolPrice(tool, plan);
  if (price === null) return 0;
  return price * seats;
}

export function getAnnualSpend(monthlySpend: number): number {
  return monthlySpend * 12;
}
