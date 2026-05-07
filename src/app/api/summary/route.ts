import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { AuditRecommendation } from '@/types/audit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SummaryRequest {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  teamSize: number;
  primaryUseCase: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json();

    if (!body.recommendations || !Array.isArray(body.recommendations)) {
      return NextResponse.json(
        { error: 'Invalid input: recommendations must be provided' },
        { status: 400 }
      );
    }

    // Build prompt for Anthropic
    const recommendationsText = body.recommendations
      .map(
        (rec) =>
          `${rec.tool}: Currently spending $${rec.currentSpend}/month. ${rec.recommendedAction} Potential savings: $${rec.estimatedSavings}/month.`
      )
      .join('\n');

    const prompt = `Based on this AI tool audit, write a personalized ~100-word summary for a startup founder/engineering manager:

Team Size: ${body.teamSize}
Primary Use Case: ${body.primaryUseCase}
Total Monthly Savings Opportunity: $${body.totalMonthlySavings}
Total Annual Savings Opportunity: $${body.totalAnnualSavings}

Audit Results:
${recommendationsText}

Write a concise, actionable summary that:
1. Acknowledges their current spending
2. Highlights the biggest opportunity
3. Provides one specific next step

Be encouraging but honest. Avoid generic flattery.`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const summary =
        message.content[0].type === 'text'
          ? message.content[0].text
          : 'Unable to generate summary';

      return NextResponse.json({ summary });
    } catch (anthropicError) {
      console.error('Anthropic API error:', anthropicError);
      // Graceful fallback to templated summary
      const fallbackSummary = `Your team is spending $${body.totalMonthlySavings}/month more than necessary on AI tools. The biggest opportunity is optimizing your ${body.recommendations[0]?.tool || 'current'} setup. Consider reviewing your plan and team seat allocation.`;
      return NextResponse.json({ summary: fallbackSummary, fromFallback: true });
    }
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
