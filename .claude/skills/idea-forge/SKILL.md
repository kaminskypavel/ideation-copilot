---
name: idea-forge
description: Synthesize all accumulated knowledge about an idea into a consolidated summary — score trajectory, key findings, validated vs assumed, and pitch-ready overview. Use when the idea has been through multiple rounds and needs a clear picture of where it stands.
argument-hint: "[idea-folder-name]"
disable-model-invocation: true
allowed-tools: Read, Glob, Write
---

# Forge Idea

Read everything accumulated about an idea — docs, evaluations, pushback sessions, predictions — and synthesize it into a single consolidated summary. This is the compounding step: it makes all the accumulated knowledge legible.

## Workflow

### Step 1: Load Everything

Read `<argument>` to identify the idea folder. Search for it under `ideas/`.

```
ideas/*{argument}*/
```

Read ALL files in the folder:
- **Idea docs:** 00-overview through 05-experiments (including their changelog entries)
- **Evaluation files:** all `evaluation-*.md` files (sorted by date for trajectory)
- **Pushback sessions:** all `pushback-session-*.md` files
- **Prediction docs:** all `pushback-predictions-*.md` files

### Step 2: Build the Score Trajectory

Parse YAML frontmatter from all evaluation files. Build a timeline:

```markdown
## Score Trajectory

| Date | Combined | VC | Market | Weakest Dimension | Deal-breakers |
|------|----------|-----|--------|-------------------|---------------|
| 2026-03-19 | 42/100 | 34 | 50 | Team (1/5) | Team |
| 2026-03-20 | 58/100 | 52 | 64 | Traction (2/5) | None |
| 2026-03-22 | 74/100 | 70 | 78 | GTM (3/5) | None |

**Trend:** Improving (+32 points across 3 evaluations)
**Biggest improvement:** Team (1→4, after adding CTO background and advisor plan)
**Persistent weakness:** GTM — still no proven cold acquisition channel
```

If only one evaluation exists, show it as the baseline with no trajectory.

### Step 3: Synthesize Findings

Read all pushback sessions and compile:

**What's been validated:**
- Claims that received "Verified" verdicts with High confidence
- Assumptions marked as validated in 03-assumptions.md

**What's been refuted or remains risky:**
- Claims that received "Refuted" or "Unresolved" verdicts
- Assumptions still untested or invalidated
- Deal-breakers from evaluations (even if resolved — note they were once flagged)

**Key pivots and evolution:**
- Compile from changelog entries across all docs
- Track how the thesis evolved from the original pitch

**Investor objections:**
- Turn each Refuted or Unresolved claim, and each deal-breaker, into an objection an investor would actually raise in a partner meeting
- Tag its risk category and severity, and note a deck fix, not just a rebuttal

### Step 4: Write the Forge Summary

Create `forge-YYYYMMDD.md` in the idea folder:

```markdown
# Forge: <idea name>
Date: <date>
Evaluations analyzed: <count>
Pushback sessions analyzed: <count>

## Idea in One Paragraph
<Synthesized from 00-overview, incorporating all evolution>

## Score Trajectory
<table from Step 2>

## What's Validated
- <validated claim/assumption with source>

## What's Still Risky
- <unvalidated claim with what would test it>

## Key Pivots
1. <date>: <what changed and why>

## Open Questions
<Compiled from all sessions and docs>

## Pitch-Ready Summary
<One line per slide, in this canonical order. Ground each line in a validated claim (cite the evaluation, pushback verdict, or experiment result). If the docs can't support a slide yet, write "(not yet validated)" instead of inventing content.>

1. **Hook / Opening:**
2. **Problem:**
3. **Solution:**
4. **Product / Demo:**
5. **Traction / Validation:**
6. **Market Size:**
7. **Business Model:**
8. **Competition:**
9. **Team:**
10. **Financials:**
11. **The Ask:**
12. **Vision / Close:**

**Missing slides:** <which of the twelve above the idea docs cannot yet support, and what's needed to fill them>

## Investor Objections
<Populate from Refuted and Unresolved claims across all pushback sessions, and from any deal-breakers in the evaluations. One entry per objection. Tag each with the risk category it falls under: Market, Execution, Technical, Competitive, Business Model, Timing, Regulatory, or Capital Efficiency.>

### Objection: <state it exactly as an investor would phrase it in a partner meeting>
- **Risk category:** Market / Execution / Technical / Competitive / Business Model / Timing / Regulatory / Capital Efficiency
- **Why they'll raise it:**
- **Severity:** High / Medium / Low
- **Suggested response:**
- **Deck fix:** <what to change in the pitch itself so this objection lands softer>

## Verdict
**Idea strength:** [Strong / Promising / Needs work / Reconsider]
**Confidence level:** [High / Medium / Low] — based on ratio of validated vs assumed claims
**Biggest remaining risk:** <one sentence>
**Recommended next action:** <one specific thing to do>
```

### Step 5: Present and Suggest Next Steps

Output the forge summary, then:

Before printing, read `references/workflow.md`, determine the idea folder state, and apply the Next Step table. Print the top 2-3 matching steps with the evidence behind each. The list below is the default if folder state cannot be read.

```
Forge complete! Here's where this idea stands.

→ /idea:pushback {idea-name}   — if there are still untested claims to challenge
→ /idea:evaluate {idea-name}   — if you've made changes since the last score
→ /idea:new {new-idea-name}    — if the forge reveals a pivot worth exploring as a new idea
```

## Principles

- **Synthesize, don't summarize.** A summary just shortens. A synthesis connects dots across sessions and finds the pattern.
- **Show the trajectory.** The score timeline tells the story of how the idea evolved — it's the most valuable output.
- **Ground in evidence.** Every "validated" claim must cite where it was validated (evaluation score, pushback verdict, experiment result). No unsourced confidence.
- **Be honest about what's still assumed.** The ratio of validated to assumed claims is the real confidence metric.
- **Make it pitch-ready.** The forge output should be something a founder can hand to an advisor or investor as a concise status update.
