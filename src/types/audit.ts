export type AIToolName = 
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf';

export type CursorPlan = 'hobby' | 'pro' | 'business' | 'enterprise';
export type GitHubCopilotPlan = 'individual' | 'business' | 'enterprise';
export type ClaudePlan = 'free' | 'pro' | 'max' | 'team' | 'enterprise' | 'api';
export type ChatGPTPlan = 'plus' | 'team' | 'enterprise' | 'api';
export type GeminiPlan = 'pro' | 'ultra' | 'api';
export type WindsurfPlan = 'hobby' | 'pro' | 'enterprise';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolSpend {
  tool: AIToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolSpend[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export interface ToolPricing {
  monthlyPerSeat: number;
  annualPerSeat?: number;
  description: string;
}

export interface AuditRecommendation {
  tool: AIToolName;
  currentSpend: number;
  recommendedAction: string;
  estimatedSavings: number;
  reason: string;
  alternativeTools?: {
    tool: AIToolName;
    savingsPerMonth: number;
  }[];
}

export interface AuditResult {
  id: string;
  input: AuditInput;
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  personalizedSummary: string;
  createdAt: Date;
}

export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}

export interface PricingDataPoint {
  tool: AIToolName;
  plan: string;
  price: number;
  currency: 'USD';
  billingPeriod: 'monthly' | 'annual';
  perUnit: 'seat' | 'usage' | 'flat';
  sourceUrl: string;
  verifiedDate: string;
  notes?: string;
}
