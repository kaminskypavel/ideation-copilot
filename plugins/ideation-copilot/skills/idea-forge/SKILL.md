---
name: idea:forge
description: Synthesize all accumulated knowledge about an idea into a consolidated summary — score trajectory, key findings, validated vs assumed, and pitch-ready overview. Use when the idea has been through multiple rounds and needs a clear picture of where it stands.
argument-hint: [idea-folder-name]
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
<3-5 bullet points a founder could use to pitch this idea right now, grounded in validated evidence>

## Verdict
**Idea strength:** [Strong / Promising / Needs work / Reconsider]
**Confidence level:** [High / Medium / Low] — based on ratio of validated vs assumed claims
**Biggest remaining risk:** <one sentence>
**Recommended next action:** <one specific thing to do>
```

### Step 5: Present and Suggest Next Steps

Output the forge summary, then:

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
