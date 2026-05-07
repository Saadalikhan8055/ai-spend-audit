# Key Metrics & Instrumentation

## North Star Metric

**Email captures for audits showing >$500/month savings opportunity**

Why: This is the leading indicator of a successful lead-gen tool. High-savings cases are:
- More likely to need Credex credits
- Less price-sensitive 
- Easier for Credex sales to convert
- Worth 4x more LTV than low-savings leads

Target: 20-30% of high-savings audits capture email (industry standard for B2B tools: 15-25%)

---

## Input Metrics (Drive the North Star)

### 1. **Audit Completion Rate**
- Definition: Users who complete the audit form and receive results / Users who land on homepage
- Target: >5% (typical SaaS tool)
- How it drives North Star: More audits = more high-savings cases = more email captures

### 2. **High-Savings Audit Rate**  
- Definition: Audits showing >$500/month savings / Total audits
- Target: 30-40% (implies realistic tool usage data)
- How it drives North Star: If too high (>60%), tool is manufacturing fake savings; if too low (<20%), not resonating with high-spend teams

### 3. **Lead Capture Rate (High-Savings Only)**
- Definition: High-savings audits with email captured / Total high-savings audits
- Target: 20-30%
- How it drives North Star: This IS the North Star metric itself

---

## Supporting Metrics

### User Engagement
- **Time spent on page**: >2 min (completing audit, reading results)
- **Mobile vs desktop split**: >40% mobile (team members auditing on phone)
- **Return rate**: <1% expected (one-time use, unless bug fixes + sharing)
- **Shareable URL clicks**: Track for future

### Form Input Patterns
- **Average tools per audit**: 2-3 (validates multi-tool spending reality)
- **Most common tool combinations**: Cursor + ChatGPT + Claude (validates GTM targeting)
- **Team sizes**: Distribution 1-500; median 10-20 (early product-market fit indicator)
- **Use case distribution**: 50% coding, 30% mixed, 15% research, 5% writing (validates segmentation)

### Recommendation Acceptance
- **Most recommended actions taken**: Track via follow-up survey (email, shared URL analytics)
- **Cost of capturing acceptance data**: Low (1-question survey in email)
- **Would save month/month data for Week 2+**

---

## What I'd Instrument First

**Priority 1 (Launch Day):**
1. Audit completion rate (Google Analytics, Vercel Analytics)
2. High-savings audit % (custom event)
3. Email capture rate (custom event)
4. Error tracking (Sentry, LogRocket)

**Priority 2 (Week 2):**
1. Form input patterns (which tools, team sizes, use cases)
2. Recommendation breakdown (which recommendations are suggested most)
3. Performance metrics (page load, Lighthouse scores)
4. Referrer tracking (where traffic comes from)

**Priority 3 (Month 1+):**
1. Shared URL clicks (track if results are actually shared)
2. Email open rates, click-through rates (Resend analytics)
3. Consultation booking rate (Credex CRM integration)
4. Customer feedback (post-audit survey)

---

## Pivot Triggers

| Metric | Green Flag ✅ | Red Flag 🚩 | Action |
|--------|---------|---------|--------|
| Completion rate | >5% | <2% | Simplify form, add guide |
| High-savings rate | 25-40% | >60% or <15% | Audit logic is broken; revisit |
| Email capture (high-savings) | >20% | <10% | CTA not compelling; try new copy |
| Avg spend/audit | >$100 | <$50 | Wrong audience; check GTM |
| Mobile completion | >40% | <20% | UI/UX broken on mobile |
| Recommendation clarity | 80%+ say "clear" | <50% say "clear" | Explanations are confusing |

---

## Analytics Implementation

### Google Analytics 4 Events

```
event: audit_started
event: audit_completed
  params: {
    tools_count,
    team_size,
    use_case,
    total_savings
  }
event: email_capture_shown
event: email_capture_submitted
  params: {
    savings_level (low/high),
    company_size
  }
event: summary_generated
  params: {
    from_fallback (true/false)
  }
```

### Custom Logging

```typescript
// In API routes and components
console.log({
  event: 'audit_calculated',
  savings: result.totalMonthlySavings,
  toolCount: input.tools.length,
  timestamp: new Date().toISOString()
});
```

### Supabase Events Table

```sql
-- For deep analysis of all audits (not just email captures)
CREATE TABLE audit_events (
  id uuid primary key,
  event_type TEXT,
  audit_id uuid,
  data JSONB,
  created_at timestamp default now()
);
```

---

## Reporting Cadence

- **Daily**: Check funnel completion, errors, uptime
- **Weekly**: Review cohorts (by GTM channel, date, tool mix)
- **Monthly**: Presentation to Credex team with decision triggers

---

## Success Definition: The First Win

"First high-savings audit lead books a Credex consultation" = Product works end-to-end

Expected: Days 2-3 of launch (organic reach to 1+ high-spend founder)
