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

## Per-Dimension Output Format

For each dimension being scored, use this format:

```markdown
### [Dimension Name] — [Score]/5 (Weight: [weight]x)

**Assessment:** [2-3 sentence evaluation grounded in the idea docs]

**Evidence:** [Specific content from the idea docs that supports this score]

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

## Changelog Format

All skills that modify idea documents (forge, improve, pushback) must append a changelog entry to each document they update. This is the idea's history — there is no git dependency.

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
| Forge | (manual) | Human brings new data, experiment results, or challenge feedback |
| Improve | (auto) | Evaluation scores — targets weakest dimension via research |
| Pushback | (session) | Claim sparring revealed new assumptions or invalidated existing ones |

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

### Improve: 2026-03-19 (auto)
**Trigger:** evaluation score 42/100, weakest: Team (1/5)
**Changes:**
- Added founding team section with domain expertise gaps
- Added advisor recruitment plan targeting fitness-tech operators
**Source:** Web research — similar startups that succeeded had industry-specific advisors
**Confidence delta:** Stronger — team gap is now acknowledged with a concrete plan to address it
**Score delta:** 42 → 58
```

### Evaluation Timeline

Evaluation files (`evaluation-YYYYMMDD-HHmmss.md`) naturally create a score timeline across iterations. Compare YAML frontmatter across files to see which dimensions improved, which regressed, and what the overall trajectory looks like.
