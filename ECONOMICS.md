# Unit Economics - AI Spend Audit Tool

## Lead Value to Credex

**Average deal size:** $500-5,000 in annual Credex credits per customer
**Conversion (audit → consultation booked):** 15-25% for high-savings cases (>$500/month)
**Conversion (consultation → credit purchase):** 60-80%
**Average customer lifetime:** 18-24 months

**Therefore:**
- Typical lead value = $500 * 0.20 * 0.70 = **$70 per audit** (conservative)
- High-value lead = $2,000 * 0.20 * 0.70 = **$280 per audit** (>$500/mo savings)

**Implied LTV:** $70-280 per lead depending on savings amount

## Channel CAC (Customer Acquisition Cost)

### Organic Channels (Week 1)

| Channel | Effort | Expected CPL | Expected CVR |
|---------|--------|-------------|-------|
| Reddit posts | 2 hrs | $0 | 3-5% |
| Slack communities | 3 hrs | $0 | 2-4% |
| Twitter DM blitz | 4 hrs | $0 | 0.5-2% |
| Email to existing Credex customers | 1 hr | $0 | 15-25% |

**Blended organic CAC:** ~$0 (all organic, volunteer time assumed)

### Paid Channels (Future, Month 2+)

| Channel | CPC | Expected CTR | Expected CVR |
|---------|-----|-------------|-------|
| Google Search Ads | $1-3 | 2-5% | 10-20% |
| Reddit Ads (r/startups) | $0.50-1 | 4-8% | 8-15% |
| Twitter Ads | $0.30-0.80 | 3-8% | 5-12% |
| Indie Hacker featured | $0 | 1-3% | 15-25% |

**Estimated paid CAC:** $2-8 per audit, $15-40 per lead conversion

## Profitability Analysis

### Scenario A: Breakeven at Week 4
- Week 1 audits: 100
- High-savings conversions: 10 (10%)
- Consultation bookings: 3 (30% of those)
- Credex credits purchased: 2 ($1,500 value)
- **Revenue:** $105 (2 customers × $70 LTV + organic value)
- **Cost:** $0 (all organic)
- **Margin:** 100% ✅

### Scenario B: Scale to Paid (Month 2+)
- Monthly audits: 300
- High-savings rate: 30%
- Consultation bookings: 27
- Conversions to purchase: 18
- **Revenue:** $1,260 (18 × $70 LTV)
- **Paid ad spend:** $300/month (50 leads × $6 CAC)
- **Cost (Credex resources):** $200/month (engineering support, email)
- **Gross margin:** ($1,260 - $300 - $200) / $1,260 = **76%** ✅

### Scenario C: $1M ARR Target (18 months)

**What needs to be true:**
- Tool drives 10,000 completed audits/month
- 30% show >$500/month savings
- 20% of those book Credex consultation
- 60% of consultations convert to purchase

**Math:**
- 10,000 audits/month × 0.30 × 0.20 × 0.60 = 360 new customers/month
- 360 × $280 (avg LTV for qualifying leads) = **$100,800/month = $1.2M ARR** ✅

**What that requires:**
- 10,000 audits/month = 330/day
  - Current: 25-30/day organic (Week 1 projection)
  - Gap: 300/day = need paid channels or partnerships
  - At $6 CAC, that's $1,800/day ad spend = $54k/month

**Profitability at this scale:**
- Revenue: $100,800
- Ad spend: $54,000
- Credex resources: $8,000 (infrastructure, support)
- Operations: $5,000
- **Net profit:** $33,800/month = **67% margin** ✅

---

## Sensitivity Analysis

| Metric | Conservative | Base | Optimistic |
|--------|--|---|--|
| Conversion (audit → consultation) | 10% | 20% | 40% |
| Consultation → Purchase | 40% | 60% | 80% |
| Average LTV | $50 | $150 | $400 |
| CAC (organic) | $0 | $0 | $0 |
| CAC (paid) | $10 | $6 | $3 |

**Downside:** $35/month ARR per 10k audits (breakeven)  
**Upside:** $350/month ARR per 10k audits  
**Base case:** $120/month ARR per 10k audits

---

## When To Pivot

**Kill this if:**
- After Month 2: <5% of audits capture email (trust issue, not product)
- After Month 3: <2% of consultations convert to credit purchase (offer not compelling)
- After Month 2: CAC > LTV in any channel (unit economics broken)

**Double down if:**
- >30% of high-savings users book consultation (high-intent leads)
- >1% of organic traffic completes audit (viral/organic strength)
- Repeat customers (founder networks sharing audits)

---

## Key Assumptions & Risks

**Assumptions:**
1. LTV of $70-280 is accurate (based on historical Credex upsell rates; unknown for new audience)
2. High-savings audit completion rate is 20-25% (typical SaaS lead capture)
3. Credex credits are the right product to upsell after audit (not investment capital, services, etc.)
4. No paid channel will be <$6 CAC at scale (assumption based on competitive AI/SaaS space)

**Risks:**
1. **Trust**: Tool must deliver real value or word-of-mouth dies fast
2. **Accuracy**: Bad recommendations destroy credibility (mitigated by hardcoded, defensible logic)
3. **Credex brand**: If tool drives low-quality leads, Credex sales won't close them
4. **Competitive**: Pricing comparison tools might exist or emerge (differentiate on personalization + action)

---

## Success Metrics (By Month)

| Metric | Week 1 | Month 1 | Month 3 | Month 6 |
|--------|--------|---------|---------|---------|
| Monthly Audits | 100 | 500 | 2,000 | 5,000 |
| Email Captures | 8 | 50 | 200 | 500 |
| Consultations Booked | 2 | 10 | 40 | 100 |
| Credex Conversions | 1 | 6 | 24 | 60 |
| MRR | $70 | $450 | $1,800 | $4,500 |

**18-month ARR target:** $1M (requires consistent growth + paid channel success)
