'use client';

import { useState, useEffect } from 'react';
import { ToolSpend, AIToolName, UseCase } from '@/types/audit';
import { getMonthlySpend } from '@/lib/pricing';

interface SpendFormProps {
  onSubmit: (data: { tools: ToolSpend[]; teamSize: number; primaryUseCase: UseCase }) => void;
  isLoading?: boolean;
}

const TOOLS: { name: AIToolName; label: string; plans: string[] }[] = [
  { name: 'cursor', label: 'Cursor', plans: ['hobby', 'pro', 'business', 'enterprise'] },
  { name: 'github-copilot', label: 'GitHub Copilot', plans: ['individual', 'business', 'enterprise'] },
  { name: 'claude', label: 'Claude', plans: ['free', 'pro', 'max', 'team', 'enterprise', 'api'] },
  { name: 'chatgpt', label: 'ChatGPT', plans: ['plus', 'team', 'enterprise', 'api'] },
  { name: 'anthropic-api', label: 'Anthropic API', plans: ['pay-as-you-go'] },
  { name: 'openai-api', label: 'OpenAI API', plans: ['pay-as-you-go'] },
  { name: 'gemini', label: 'Gemini', plans: ['pro', 'ultra', 'api'] },
  { name: 'windsurf', label: 'Windsurf', plans: ['hobby', 'pro', 'enterprise'] },
];

const USE_CASES: UseCase[] = ['coding', 'writing', 'data', 'research', 'mixed'];

export function SpendForm({ onSubmit, isLoading }: SpendFormProps) {
  const [teamSize, setTeamSize] = useState(5);
  const [primaryUseCase, setPrimaryUseCase] = useState<UseCase>('coding');
  const [tools, setTools] = useState<Map<AIToolName, ToolSpend>>(new Map());

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('auditFormData');
    if (saved) {
      try {
        const { teamSize: savedTeamSize, primaryUseCase: savedUseCase, tools: savedTools } = JSON.parse(saved);
        setTeamSize(savedTeamSize);
        setPrimaryUseCase(savedUseCase);
        const toolsMap = new Map();
        savedTools.forEach((tool: ToolSpend) => {
          toolsMap.set(tool.tool, tool);
        });
        setTools(toolsMap);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save to localStorage whenever form changes
  useEffect(() => {
    const formData = {
      teamSize,
      primaryUseCase,
      tools: Array.from(tools.values()),
    };
    localStorage.setItem('auditFormData', JSON.stringify(formData));
  }, [teamSize, primaryUseCase, tools]);

  const handleAddTool = (toolName: AIToolName, defaultPlan: string) => {
    if (!tools.has(toolName)) {
      const monthlySpend = getMonthlySpend(toolName, defaultPlan, 1) || 0;
      setTools(
        new Map(tools).set(toolName, {
          tool: toolName,
          plan: defaultPlan,
          monthlySpend: monthlySpend * teamSize,
          seats: teamSize,
        })
      );
    }
  };

  const handleRemoveTool = (toolName: AIToolName) => {
    const newTools = new Map(tools);
    newTools.delete(toolName);
    setTools(newTools);
  };

  const handleToolChange = (toolName: AIToolName, field: string, value: any) => {
    const tool = tools.get(toolName);
    if (!tool) return;

    let updated = { ...tool, [field]: value };

    // Auto-calculate monthly spend if seats or plan changes
    if (field === 'seats' || field === 'plan') {
      const price = getMonthlySpend(toolName, updated.plan, updated.seats);
      updated.monthlySpend = price || 0;
    }

    setTools(new Map(tools).set(toolName, updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tools.size === 0) {
      alert('Please select at least one AI tool');
      return;
    }

    onSubmit({
      tools: Array.from(tools.values()),
      teamSize,
      primaryUseCase,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Team Info Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Team Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Team Size</label>
          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Use Case</label>
          <select
            value={primaryUseCase}
            onChange={(e) => setPrimaryUseCase(e.target.value as UseCase)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          >
            {USE_CASES.map((useCase) => (
              <option key={useCase} value={useCase}>
                {useCase.charAt(0).toUpperCase() + useCase.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tool Selection Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">AI Tools & Spending</h2>

        {/* Added Tools */}
        <div className="space-y-4">
          {Array.from(tools.entries()).map(([toolName, toolData]) => {
            const toolConfig = TOOLS.find((t) => t.name === toolName);
            return (
              <div key={toolName} className="space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{toolConfig?.label}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(toolName)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                    <select
                      value={toolData.plan}
                      onChange={(e) => handleToolChange(toolName, 'plan', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      {toolConfig?.plans.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan.charAt(0).toUpperCase() + plan.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
                    <input
                      type="number"
                      min="1"
                      value={toolData.seats}
                      onChange={(e) => handleToolChange(toolName, 'seats', Math.max(1, parseInt(e.target.value) || 1))}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Spend ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={toolData.monthlySpend}
                    onChange={(e) => handleToolChange(toolName, 'monthlySpend', parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Available Tools to Add */}
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700">Add another tool:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {TOOLS.map((tool) =>
              tools.has(tool.name) ? null : (
                <button
                  key={tool.name}
                  type="button"
                  onClick={() => handleAddTool(tool.name, tool.plans[0])}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  + {tool.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={tools.size === 0 || isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Running Audit...' : 'Run Audit'}
      </button>
    </form>
  );
}
