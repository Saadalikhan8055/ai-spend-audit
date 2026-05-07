import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface LeadCaptureRequest {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  savings: number;
}

// Rate limiting: simple in-memory store (would use Redis in production)
const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  const recentRequests = timestamps.filter((t) => now - t < windowMs);

  if (recentRequests.length >= limit) {
    return false;
  }

  rateLimitStore.set(ip, [...recentRequests, now]);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body: LeadCaptureRequest = await request.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Save to Supabase
    try {
      const supabase = getSupabase();
      const { data, error: dbError } = await supabase.from('leads').insert([
        {
          email: body.email,
          company_name: body.companyName || null,
          role: body.role || null,
          team_size: body.teamSize || null,
          audit_id: body.auditId,
          savings: body.savings,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue anyway - send email
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // Continue anyway - send email
    }

    // Send transactional email
    const savingsMessage =
      body.savings > 500
        ? `We've identified $${body.savings}/month in potential savings for your team. Our experts at Credex can help you capture even more.`
        : `We've completed your AI spend audit. Based on your current setup, you're already fairly optimized—great job! We'll notify you when new optimization opportunities apply to your stack.`;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: 'audit@credex.rocks',
          to: body.email,
          subject: 'Your AI Spend Audit Results',
          html: `
            <h2>Your AI Spend Audit Complete</h2>
            <p>${savingsMessage}</p>
            <p>
              ${
                body.savings > 500
                  ? '<a href="https://credex.rocks">Schedule a consultation with Credex</a> to discuss credit purchasing options.'
                  : 'Stay tuned for new optimization opportunities.'
              }
            </p>
            <p>Thank you for using the AI Spend Audit tool!</p>
          `,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Continue anyway - lead was saved
      }
    } else {
      console.warn('RESEND_API_KEY not set, skipping email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}
