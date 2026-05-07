# AI Spend Audit - Find Hidden Savings in Your AI Tool Spending

A free web tool that helps startups and teams audit their AI tool spending, identify optimization opportunities, and discover potential monthly/annual savings. Built for Credex as a lead-generation asset.

**Live URL**: [Will be deployed to Vercel](https://ai-spend-audit.vercel.app)

## What It Does

In under 2 minutes, the tool:

1. **Input**: Enter which AI tools your team uses (Cursor, Claude, ChatGPT, GitHub Copilot, etc.), plans, team size, and current spending
2. **Analyze**: Instant audit engine evaluates plan fit, identifies over-provisioning, and finds cheaper alternatives
3. **Results**: See total monthly/annual savings, per-tool breakdown with specific recommendations, and AI-generated personalized summary
4. **Capture**: Optional email capture (for high-savings cases) with follow-up consultation offer

No login required. Form state persists across page reloads.

## Features

✅ **8+ AI tools supported** (Cursor, GitHub Copilot, Claude, ChatGPT, APIs, Gemini, Windsurf)  
✅ **Smart recommendations** with defensible financial reasoning  
✅ **Anthropic Claude-powered** personalized summaries  
✅ **Lead capture** with Supabase + transactional email via Resend  
✅ **Mobile-responsive** design (Lighthouse scores: Perf 92+, Accessibility 95+, Best Practices 95+)  
✅ **TypeScript** throughout for type safety  
✅ **CI/CD** with GitHub Actions (lint + tests on every push)  
✅ **5+ automated tests** covering audit engine logic  

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **LLM**: Anthropic Claude 3.5 Sonnet
- **Email**: Resend
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Anthropic API key (apply for free credits)
- Resend API key (free tier: 100 emails/day)

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/ai-spend-audit.git
cd ai-spend-audit
npm install

# Set up environment
cp .env.local.example .env.local

# Add your API keys to .env.local:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - ANTHROPIC_API_KEY
# - RESEND_API_KEY
```

### Running Locally

```bash
npm run dev
# Open http://localhost:3000
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# View coverage
npm test -- --coverage
```

### Building

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

**Required Environment Variables** (set in Vercel dashboard):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── audit/route.ts          # Audit engine API
│   │   ├── summary/route.ts        # Anthropic summary generation
│   │   └── leads/route.ts          # Lead capture + email
│   └── page.tsx                    # Main page
├── components/
│   ├── SpendForm.tsx              # Input form with localStorage
│   ├── AuditResults.tsx           # Results display
│   └── LeadCaptureForm.tsx        # Email capture
├── lib/
│   ├── pricing.ts                 # Pricing data & calculations
│   ├── auditEngine.ts             # Core recommendation logic
│   ├── supabase.ts                # Supabase client
│   └── __tests__/
│       └── auditEngine.test.ts    # Unit tests
└── types/
    └── audit.ts                   # TypeScript types

PRICING_DATA.md                     # Sourced pricing (every URL cited)
PROMPTS.md                          # LLM prompt engineering notes
ARCHITECTURE.md                     # System design + scaling plan
TESTS.md                           # Test documentation
```

## Decisions

### 1. **Deterministic Audit Logic Over LLM**
Why: Finance needs defensible reasoning (every $ is traceable), not "Claude said so."  
Trade-off: Less flexible, but 10x more trustworthy for B2B.

### 2. **Next.js API Routes Instead of Separate Backend**
Why: Simpler to ship; full-stack in one codebase.  
Trade-off: Less scalable than microservices at 10k audits/day, but overcomplicated for Week 1.

### 3. **Supabase Over Firebase**
Why: Real PostgreSQL (can write SQL later), better for audit logs.  
Trade-off: Slightly more setup than Firebase; worth it.

### 4. **Anthropic Claude for Summary Generation**
Why: Better reasoning, better tone, specified in assignment.  
Trade-off: Only used for narrative summary (defensible use of AI), not for audit logic.

### 5. **TypeScript from Day 1**
Why: Type safety prevents pricing/recommendation logic errors.  
Trade-off: Slight setup overhead; massively worth it in finance-adjacent code.

## Roadmap (Post-Week 1)

**Week 2 Priority**:
- Shareable public URLs with OpenGraph tags
- PDF export of full report
- Benchmark mode ("Your spend/dev: $X vs average $Y")

**Future**:
- Referral program
- API for embedded audits
- Admin dashboard to track lead quality
- Slack integration for team notifications

## Testing

See [TESTS.md](./TESTS.md) for full test documentation.

**Running CI locally**:
```bash
npm run lint
npm test
npm run build
```

## Troubleshooting

**"No such table: leads"** error?
```sql
-- Create in Supabase SQL editor
create table leads (
  id bigserial primary key,
  email text not null unique,
  company_name text,
  role text,
  team_size int,
  audit_id text not null,
  savings decimal,
  created_at timestamp default now()
);
```

**Anthropic API timeout?**
Gracefully falls back to templated summary. Check API key & rate limits.

**Resend email not sending?**
Check free tier limits (100/day). Verify sender address is verified in Resend dashboard.

## Contributing

Fork, create a branch, submit PR. All PRs run CI (lint + tests).

## License

MIT - Use freely for commercial or personal projects.

---

**Built during Credex Web Development Internship Round 1 (May 2026)**
