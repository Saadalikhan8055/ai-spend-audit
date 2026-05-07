import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/auditEngine';
import { AuditInput } from '@/types/audit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: AuditInput = body;

    // Validate input
    if (!input.tools || !Array.isArray(input.tools)) {
      return NextResponse.json(
        { error: 'Invalid input: tools must be an array' },
        { status: 400 }
      );
    }

    if (!input.teamSize || input.teamSize < 1) {
      return NextResponse.json(
        { error: 'Invalid input: teamSize must be at least 1' },
        { status: 400 }
      );
    }

    if (!input.primaryUseCase) {
      return NextResponse.json(
        { error: 'Invalid input: primaryUseCase is required' },
        { status: 400 }
      );
    }

    // Run the audit
    const result = runAudit(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Failed to run audit' },
      { status: 500 }
    );
  }
}
