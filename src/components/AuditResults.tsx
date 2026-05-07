'use client';

import { AuditRecommendation } from '@/types/audit';
import { Zap, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { LeadCaptureForm } from './LeadCaptureForm';

interface AuditResultsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: AuditRecommendation[];
  personalizedSummary?: string;
  auditId: string;
}

export function AuditResults({
  totalMonthlySavings,
  totalAnnualSavings,
  recommendations,
  personalizedSummary,
  auditId,
}: AuditResultsProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const isHighSavings = totalMonthlySavings > 500;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-lg bg-gradient-to-br from-green-50 to-blue-50 p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-100 p-3">
            <TrendingDown className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Savings Opportunity</p>
            <p className="text-4xl font-bold text-green-600">${totalMonthlySavings.toLocaleString()}</p>
            <p className="text-lg text-gray-600">${totalAnnualSavings.toLocaleString()} per year</p>
          </div>
        </div>
      </div>

      {/* Personalized Summary */}
      {personalizedSummary && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">Your AI Spend Assessment</h3>
          <p className="text-gray-700">{personalizedSummary}</p>
        </div>
      )}

      {/* Per-Tool Breakdown */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Recommendations by Tool</h2>

        {recommendations.map((rec, idx) => (
          <div key={idx} className="rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold capitalize text-gray-900">
                  {rec.tool.replace('-', ' ')}
                </h3>
                <p className="mt-1 text-sm text-gray-600">Current spend: ${rec.currentSpend.toLocaleString()}/mo</p>
              </div>
              {rec.estimatedSavings > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${rec.estimatedSavings.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">monthly savings</p>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <p className="font-medium text-gray-900">{rec.recommendedAction}</p>
              <p className="text-sm text-gray-700">{rec.reason}</p>
            </div>

            {rec.alternativeTools && rec.alternativeTools.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700">Alternative options:</p>
                <ul className="mt-2 space-y-1">
                  {rec.alternativeTools.map((alt, altIdx) => (
                    <li key={altIdx} className="text-sm text-gray-600">
                      • {alt.tool.replace('-', ' ')}: Save ${alt.savingsPerMonth.toLocaleString()}/mo
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* High Savings CTA */}
      {isHighSavings && (
        <div className="rounded-lg bg-amber-50 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-amber-900">
            You're leaving significant money on the table
          </h3>
          <p className="mb-4 text-gray-700">
            Credex can help you capture these savings through our credit purchasing program.
          </p>
          <button
            onClick={() => setShowLeadForm(true)}
            className="rounded-lg bg-amber-600 px-6 py-2 font-medium text-white hover:bg-amber-700"
          >
            Schedule Free Consultation
          </button>
        </div>
      )}

      {/* Low Savings or Already Optimized */}
      {totalMonthlySavings <= 500 && (
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-green-900">You're spending well</h3>
          <p className="mb-4 text-gray-700">
            Your AI tool allocation appears well-optimized for your team. Stay tuned for new optimization opportunities.
          </p>
          <button
            onClick={() => setShowLeadForm(true)}
            className="rounded-lg border border-green-600 px-6 py-2 font-medium text-green-600 hover:bg-green-50"
          >
            Get Notified of New Optimizations
          </button>
        </div>
      )}

      {/* Lead Capture Form */}
      {showLeadForm && (
        <LeadCaptureForm
          auditId={auditId}
          savings={totalMonthlySavings}
          onClose={() => setShowLeadForm(false)}
        />
      )}
    </div>
  );
}
