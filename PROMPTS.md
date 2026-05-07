# LLM Prompts Used in AI Spend Audit Tool

## Personalized Summary Generation Prompt

### Primary Prompt (Used in `/api/summary`)

```
Based on this AI tool audit, write a personalized ~100-word summary for a startup founder/engineering manager:

Team Size: {teamSize}
Primary Use Case: {primaryUseCase}
Total Monthly Savings Opportunity: ${totalMonthlySavings}
Total Annual Savings Opportunity: ${totalAnnualSavings}

Audit Results:
{recommendationsText}

Write a concise, actionable summary that:
1. Acknowledges their current spending
2. Highlights the biggest opportunity
3. Provides one specific next step

Be encouraging but honest. Avoid generic flattery.
```

### Prompt Engineering Decisions

**Why Claude 3.5 Sonnet?**
- Better reasoning for financial analysis
- Lower latency than larger models
- Sufficient capability for 100-word summaries
- Cost-effective for high-volume audits

**Why ~100 words specifically?**
- Short enough to read quickly (30 seconds max)
- Long enough to be actionable
- Fits well in email previews
- Matches typical Product Hunt screenshot expectations

**Why this structure?**
1. **Context setup**: Grounding the model in their specific situation
2. **Success criteria**: Three specific requirements prevent generic output
3. **Tone guidance**: "Encouraging but honest" prevents sales-speak

### What Was Tried But Didn't Work

1. **Shorter prompts (50 words)**: Too terse, lacked actionability
2. **Longer prompts (300 words)**: Too verbose for the use case, looked like a blog post
3. **Including company names in prompt**: Models sometimes hallucinated specific recommendations
4. **No tone guidance**: Outputs were either too salesy or too dry
5. **Temperature = 0.7**: Too much variance. Using 0 (deterministic) would be better for consistency, but would require higher creativity for good summaries. Using 1.0 leads to nonsensical outputs.

### Fallback Handling

If the Anthropic API fails (rate limit, timeout, auth error), we fall back to a templated summary:

```
Your team is spending $[monthlySavings]/month more than necessary on AI tools. The biggest opportunity is optimizing your [top_recommendation_tool] setup. Consider reviewing your plan and team seat allocation.
```

This template:
- Maintains the core message
- Includes real data (savings amount, top tool)
- Is generic enough to never be wrong
- Signals to the user that this is not the AI-generated version

### Model Selection Rationale

**Considered but rejected:**
- GPT-4: Overkill for this task; slower and more expensive
- GPT-3.5: Less reliable reasoning for financial analysis
- Local models (Llama): Would require custom hosting; adds complexity
- Claude 3 Opus: More expensive than necessary; Sonnet is sufficient

---

## Example Outputs

### High Savings Case ($2,400/month opportunity)

> "Your team is spending heavily on overlapping AI tools—particularly with 5 seats on both Cursor Pro and ChatGPT Plus at $2,400/month total. You could consolidate to Claude Pro ($100/month for team) and save $2,300/month or more. Scheduled a free audit consult with Credex to discuss credit purchasing options that could reduce costs further."

### Well-Optimized Case ($50/month opportunity)

> "Your spending looks well-balanced for a coding team of 4. You're already on GitHub Copilot Individual ($40/month total) and spending minimally. Consider Claude Pro ($20/month) to add reasoning capability for your data analysis work without major cost increase."

### Mixed Use Case ($300/month opportunity)

> "You're paying for three tools but mostly using Claude and ChatGPT. Consolidating to Claude Team ($150/month for your 5-person team) and dropping Cursor would save ~$300/month while providing better team collaboration features."

---

## Instrumentation & Monitoring

Currently, we log:
1. Whether the API call succeeded
2. Whether we fell back to the template
3. Response time
4. Token usage (if available)

Future improvements:
- A/B test different prompt variations to see which drives higher lead conversion
- Track which recommendations users actually implement
- Measure sentiment of AI-generated summaries vs. templates
