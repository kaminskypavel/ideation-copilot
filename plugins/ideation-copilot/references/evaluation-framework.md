# Evaluation Framework

Shared analytical engine for evaluating business ideas. Used by evaluation agents and the pushback skill.

## Reasoning Tools

When evaluating any dimension, apply these reasoning tools where relevant. **Name the tool you're using** so the analysis is auditable.

- **Base rate analysis** — What's the actual base rate for success in this category? Is the founder anchoring on outliers?
- **Inversion** — What would guarantee this fails? Work backwards from failure.
- **Pre-mortem** — It's a year from now and this failed. What went wrong?
- **Survivorship bias** — Are we looking at winners and ignoring the graveyard of similar attempts?
- **Second-order effects** — This solves the immediate problem, but what does it cause?
- **Historical analogy** — What situation resembles this? How did it play out? Where does the analogy hold and break?
- **Incentive analysis** — Who benefits, who loses, and how does that shape behavior?
- **Competitive simulation** — What does an incumbent do when they notice this working?
- **Here Be Dragons**: someone probably tried this before and failed. What's different this time? Treat "why now" as a survivorship-bias check, and search for prior attempts before accepting that the timing is new.
- **Can't vs Won't**: is there a structural reason competitors cannot copy this (CAN'T), or would copying require them to damage their own business (WON'T)? A moat that's neither isn't a moat, it's a head start.

## Business Lenses

Use these lenses to structure the evaluation. Each lens surfaces a different class of risk.

1. **Problem Validity** — Is this a real problem or a solution looking for a problem? Vitamin or painkiller? How frequently is the pain experienced?
2. **Customer Clarity** — Is the target customer specific enough to find and sell to? Can you reach 1,000 in 30 days?
3. **Market & Timing** — Why hasn't this been built already? Why now? What trend or shift makes this possible today?
4. **Competitive Reality** — Who will copy this within 6 months? What's the real moat, not the aspirational one?
5. **Business Model** — Do the unit economics actually work? What's the real CAC? Where does this plateau?
6. **Execution Risk** — What's the hardest unsolved part? What key hire or skill is missing?
7. **Hidden Assumptions** — What's assumed but untested? These are the dangerous ones.

## Scoring Principles

- **Score based on what's in the docs** — missing information is scored low, not assumed to be fine
- **Distinguish "not documented" from "documented but weak"** — note which scores reflect gaps in documentation vs genuine weaknesses
- **Be specific** — cite numbers, name competitors, reference market data. "Your market might be smaller" is useless. "Your TAM assumes 100% of gym owners want this, but only boutique gyms with 50+ members would pay — that's 12K gyms, not 200K" is useful.
- **Every score comes with evidence and a key risk** — no unsupported ratings
- **Use web research to validate empirical claims** — market sizes, competitor data, adoption rates, pricing benchmarks
- **Show your work** — state what you searched for, cite what you found, explain how it affects the score
- **Steel-man before scoring low** — demonstrate understanding of the idea's strengths before identifying weaknesses
- **Startup evaluation priority order**: when two dimensions tie for "weakest," break the tie in this order: Pain, then Big and growing market, then Evidence of PMF, then A+ founders, then Unfair advantage, then Business model, then Rocket-ship-ness. Call the higher-priority one weakest.
- **Strategy coherence check**: a per-dimension score is not enough on its own. If the channel contradicts the customer, or the price contradicts the value metric, flag the contradiction even if each dimension scored fine in isolation.

## Common Mistakes

Numeric guardrails an agent should apply automatically, regardless of what the docs claim:

- **The 1%-of-the-market fallacy**: "if we just get 1% of the market" is not a plan. Cap this reasoning's dimension at 2 unless backed by a bottom-up estimate.
- **Overly aggressive SOM**: new entrants rarely capture more than 5% of a market within 5 years. A claimed capture rate above that needs a specific reason.
- **Top-down TAM with no bottom-up check**: a single top-down number with no bottom-up cross-check caps Market Size at 3.
- **LTV:CAC below 3:1 presented as fine**: unit economics under 3:1 is a red flag, not a rounding error, unless the doc explains the path to improving it.
- **"Friends said they'd use it" counted as traction**: personal-network enthusiasm is not validated demand. Score Traction on the four pull signals (see `05-experiments.md`), not on interview count.
- **No competitors read as no competition**: an idea with zero named competitors after research is more often unexplored than uncontested. Treat it as a research gap, not a moat.

## Per-Dimension Output Format

For each dimension being scored, use this format:

```markdown
### [Dimension Name] — [Score]/5 (Weight: [weight]x)

**Assessment:** [2-3 sentence evaluation grounded in the idea docs]

**Evidence:** [Specific content from the idea docs that supports this score]

**Evidence quality (0-10):** [Where the evidence sits on the confidence scale: 0-1 opinions/pitch decks, 1-3 colleague reviews/estimates, 3-5 anecdotal data/surveys, 5-10 fake door tests/alphas/betas/A-B experiments. A 4/5 score backed by revenue reads differently than a 4/5 backed by a hunch.]

**Research:** [Web research findings — what you searched for, what you found, how it affects the score. If no research was needed, state why.]

**Key risk:** [The single biggest concern for this dimension]

**Investor question:** [The pointed question an evaluator would ask about this]
```

## Score Scale

| Score | Level | Criteria |
|-------|-------|----------|
| 1 | Missing/Weak | Not addressed, or addressed with vague hand-waving. No evidence. |
| 2 | Below Average | Partially addressed but significant gaps. Claims without validation. |
| 3 | Adequate | Reasonable content with some supporting evidence. Standard approach. |
| 4 | Strong | Clear, specific, well-supported. Shows depth of understanding. |
| 5 | Exceptional | Comprehensive, evidence-backed, demonstrates unique insight or unfair advantage. |

Reserve a 5 for evidence-backed unique insight. A well-documented but standard approach is a 4, not a 5.

## Grade Labels

Attach a label to the combined 0-100 score so pushback and forge use the same words:

| Combined score | Label |
|---|---|
| 90-100 | Exceptional |
| 75-89 | Strong |
| 60-74 | Good |
| 45-59 | Fair |
| 30-44 | Needs Work |
| 0-29 | Not Ready |

## Stage Calibration

Every evaluation states a stage (`pre-product`, `prototype`, or `early-revenue`) before scoring. Relax expectations accordingly instead of penalizing an idea for not yet having what its stage doesn't require:

- **Pre-product:** weight Problem Validity, Customer Clarity, and Team most heavily. Relax Traction and Business Model, and note the relaxation rather than scoring them as if revenue should already exist.
- **Prototype:** expect early usage signals (pilot users, waitlists, prototype feedback) for Traction. Business Model can still be a hypothesis, but it must be a specific one.
- **Early-revenue:** apply the full rubric, including unit economics and growth-rate scrutiny.

A pre-product idea scoring 1/5 on Traction because there is no revenue yet is not a finding. A pre-product idea with zero customer conversations and zero prototype feedback is.

## Changelog Format

All skills that modify idea documents (update, pushback, pricing, interview) must append a changelog entry to each document they update. This is the idea's history: there is no git dependency.

### Standard Changelog Entry

Append to the bottom of each modified document under a `## Changelog` section (create the section if it doesn't exist):

```markdown
### [Action]: [YYYY-MM-DD] [mode]
**Trigger:** [what caused this update]
**Changes:**
- [specific change 1]
- [specific change 2]
**Source:** [where the evidence came from — interview, experiment, web research, evaluation score]
**Confidence delta:** [stronger / weaker / pivoted — one sentence why]
```

### Action Types

| Action | Mode | Trigger |
|--------|------|---------|
| Forge | (manual) | Human brings new data, experiment results, or challenge feedback (written by `idea:update`) |
| Pushback | (session) | Claim sparring revealed new assumptions or invalidated existing ones |
| Pricing | (manual) | Pricing session run via `idea:pricing` |
| Interview | (manual) | Interview guide generated or interview results synthesized via `idea:interview` |

### Examples

```markdown
### Forge: 2026-03-19 (manual)
**Trigger:** 12 customer interviews completed
**Changes:**
- Updated target customer from "all gym owners" to "boutique gym owners with 50+ members"
- Revised TAM from 200K to 12K gyms
- Added 3 new validated assumptions
**Source:** Customer interview transcripts #1-12
**Confidence delta:** Stronger — target customer is now specific and validated
```

### Evaluation Timeline

Evaluation files (`evaluation-YYYYMMDD-HHmmss.md`) naturally create a score timeline across iterations. Compare YAML frontmatter across files to see which dimensions improved, which regressed, and what the overall trajectory looks like.
