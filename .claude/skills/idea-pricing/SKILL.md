---
name: idea-pricing
description: Work through pricing strategy for a business idea, value metric, willingness-to-pay signal, and packaging tiers, and write a pricing recommendation. Use when the user wants to figure out what to charge, size a subscription, or plan a pricing test.
argument-hint: "[idea-folder-name]"
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit, Bash(open *)
---

# Price Idea

Pricing is an iteration activity, not a scaffolding one: it needs a lean canvas and at least a rough sense of the customer to be worth doing. This skill walks a founder through value metric, willingness to pay, and packaging, then writes a dated pricing file into the idea folder.

## Protocol

Follow these phases in order.

### Phase 1: Load

Read `<argument>` to identify the idea folder. Search for it under `ideas/`.

```
ideas/*{argument}*/
```

Read `02-lean-canvas.md` (the Revenue Streams cell and Revenue Model section), `00-overview.md` (target customer), and `03-assumptions.md` if it exists (Viability assumptions). If `02-lean-canvas.md` doesn't exist, tell the user to run `/idea:new` first.

### Phase 2: Identify the Value Metric

The value metric is the unit you charge for, not a feature list. Work through this with the user:

1. Name what the customer actually gets value from, the outcome, not a feature.
2. Identify the unit that scales with that value as the customer gets more of it.
3. Run the per-seat litmus test: if a user logs into a colleague's account, can they still get all their work done? If yes, seats is not the right value metric, look for the unit that actually tracks usage or outcome instead.
4. Check the incentive alignment: does the metric grow as the customer gets more value, or does it punish adoption (e.g., charging per teammate discourages inviting teammates)?
5. Check simplicity: can a customer estimate their own bill before they buy, in one sentence?
6. Pick a primary value metric, and a secondary guardrail metric if usage needs a cap (e.g., a included-usage tier plus overage).

If the user hasn't decided, propose one based on the lean canvas and flag it as a hypothesis to test, not a final answer.

### Phase 3: Probe Willingness to Pay

Ask the founder, or have them ask a handful of target customers, three questions:

- What's a fair price you'd pay for this?
- What price would feel expensive, but you'd still consider it?
- What price would be prohibitively expensive?

The "expensive" answer, not the "fair" one, is usually the right target price: it's the number customers will grumble about but still pay.

**Magnitude over precision:** at this stage the goal is to find which order of magnitude the price lives in, not the exact number. Ask which bracket fits: $10/mo, $100/mo, $1K/mo, or $10K/mo product. Getting the bracket right matters more than getting the second digit right.

**Choosing a follow-up study**, if the founder wants to go deeper than the three-question probe:

| Situation | Method | Why |
|---|---|---|
| Frequently bought, familiar product category | Open-ended pricing questions (e.g., Van Westendorp) | Customers already have a price anchor to react to |
| Unusual or high-ticket item | Choice-based methods (e.g., discrete choice, tradeoff sets) | Direct price questions produce unreliable answers when there's no anchor |
| New-to-the-world product | Avoid direct pricing questions entirely | Customers can't price something they've never seen; anchor on value instead, using the fair/expensive/prohibitive probe and comparable-value framing |

### Phase 4: Packaging

Sort the idea's features (from `02-lean-canvas.md`'s Solution cell) into four tiers, and decide which ones justify a paid plan versus staying free:

- **Foundational:** the minimum needed for the product to work at all. Usually free or included at every paid tier.
- **Core:** the value the customer is actually paying for. This is what the primary value metric should track.
- **Optimizations:** makes the core value faster, easier, or more reliable. Good candidates for a mid-tier plan.
- **Growth accelerators:** features that make the product more valuable as the customer's usage grows (e.g., higher limits, team seats, integrations). Good candidates for a top-tier plan or usage-based add-on.

**Trial vs. freemium:** default to a time-boxed trial when the product needs the customer to experience a specific "aha" moment quickly. Default to freemium when the product has strong network or habit effects that make a large free user base valuable on its own (referrals, content, data). Don't run both by default, pick the one that matches which effect the idea actually has.

### Phase 5: B2B Pricing Rules

If this is a B2B idea, apply these four rules as a sanity check on whatever price came out of Phase 3:

1. Charge sooner than you think. A wait to charge until the product is "ready" produces a false read on demand.
2. Charge more than you think. Founders systematically underprice B2B software relative to the value delivered.
3. Keep it simple to start. One or two tiers with a clear value metric beats a complex pricing page at this stage.
4. Revisit pricing about once a year. A price set today is a hypothesis, not a permanent commitment.

### Phase 6: Render the Pricing File

Render one self-contained HTML file, built from `references/report-shell.html`'s
skeleton and tokens, using the Pricing section spec and data-block fields documented in
`references/report-style.md`: Header, Value metric, Willingness-to-pay (fair/expensive/
prohibitive as a 3-point scale bar), Packaging tiers (table), B2B check, Recommendation.

Data block: `idea`, `output_type: "pricing"`, `value_metric`, `willingness_to_pay`,
`packaging`, `trial_or_freemium`, `b2b_check`, `recommendation`. No `agents` block; omit
the key entirely rather than shipping it empty. Don't invent a number the founder
hasn't actually given; a not-yet-tested field is `null` and its card explains what's
missing.

**Filename:** `pricing-YYYYMMDD.html`, inside the idea folder. Print the path, then
offer to open it (`open ideas/{idea-name}/pricing-YYYYMMDD.html` on macOS).

### Phase 7: Changelog and Summary

Append a changelog entry to `02-lean-canvas.md` under `## Changelog`, using the format from `references/evaluation-framework.md`:

```markdown
### Pricing: {YYYY-MM-DD} (manual)
**Trigger:** Pricing session run via idea:pricing
**Changes:**
- Set value metric to {metric}
- Set target price to {price}, based on {method}
**Source:** pricing-YYYYMMDD.html
**Confidence delta:** {stronger / weaker / unchanged}, one sentence why
```

Then output:

Before printing, read `references/workflow.md`, determine the idea folder state, and apply the Next Step table. Print the top 2-3 matching steps with the evidence behind each. The list below is the default if folder state cannot be read.

```
Pricing written to ideas/{idea-name}/pricing-YYYYMMDD.html

What's next?

→ /idea:evaluate {idea-name}   : score the Business Model dimension now that pricing has a hypothesis
→ /idea:update {idea-name}     : record results once you've tested the price with real customers
→ /idea:pushback {idea-name}   : stress-test whether the target price actually clears the unit-economics bar
```

## Principles

- **A price is a hypothesis, not a spec.** Every number in the pricing file should have a way to be proven wrong.
- **Value metric before number.** Getting the unit right matters more than getting the digit right; a good metric on the wrong number self-corrects, a bad metric doesn't.
- **Don't invent numbers.** If the founder hasn't talked to customers about price yet, say so plainly and recommend the fair/expensive/prohibitive probe as the next step, rather than fabricating a target.
