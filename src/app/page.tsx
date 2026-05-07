'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SpendForm } from '@/components/SpendForm';
import { AuditResults } from '@/components/AuditResults';
import { AIToolName, UseCase } from '@/types/audit';

interface AuditData {
  tools: Array<{
    tool: AIToolName;
    plan: string;
    monthlySpend: number;
    seats: number;
  }>;
  teamSize: number;
  primaryUseCase: UseCase;
}

interface AuditResultsData {
  recommendations: any[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  personalizedSummary?: string;
  auditId?: string;
}

export default function Home() {
  const [auditResults, setAuditResults] = useState<AuditResultsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAudit = async (data: AuditData) => {
    setLoading(true);
    setError(null);

    try {
      // Run audit
      const auditResponse = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!auditResponse.ok) {
        throw new Error('Failed to run audit');
      }

      const auditData = await auditResponse.json();
      const auditId = uuidv4();

      // Generate personalized summary
      try {
        const summaryResponse = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(auditData),
        });

        if (summaryResponse.ok) {
          const { summary } = await summaryResponse.json();
          setAuditResults({
            ...auditData,
            personalizedSummary: summary,
            auditId,
          });
        } else {
          setAuditResults({
            ...auditData,
            personalizedSummary: undefined,
            auditId,
          });
        }
      } catch {
        setAuditResults({
          ...auditData,
          personalizedSummary: undefined,
          auditId,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Find Hidden Savings in Your AI Spend
          </h1>
          <p className="text-xl text-gray-600">
            Discover how much you could save with optimized AI tool spending. Free, instant analysis for your team.
          </p>
        </div>

        {/* Main Content */}
        {!auditResults ? (
          <div className="rounded-xl bg-white p-8 shadow-lg">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
            <SpendForm onSubmit={handleRunAudit} isLoading={loading} />
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => {
                setAuditResults(null);
                localStorage.removeItem('auditFormData');
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Run Another Audit
            </button>

            <div className="rounded-xl bg-white p-8 shadow-lg">
              <AuditResults
                totalMonthlySavings={auditResults.totalMonthlySavings}
                totalAnnualSavings={auditResults.totalAnnualSavings}
                recommendations={auditResults.recommendations}
                personalizedSummary={auditResults.personalizedSummary}
                auditId={auditResults.auditId || ''}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
