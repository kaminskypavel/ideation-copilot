---
name: idea-forge
description: Synthesize all accumulated knowledge about an idea into a consolidated summary — score trajectory, key findings, validated vs assumed, and pitch-ready overview. Use when the idea has been through multiple rounds and needs a clear picture of where it stands.
argument-hint: "[idea-folder-name]"
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Bash(open *)
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
- **Evaluation files:** all `evaluation-*.html` files (sorted by date for trajectory),
  reading each one's `<script type="application/json" id="idea-data">` block. Legacy
  compatibility: also read any older `evaluation-*.md` files with YAML frontmatter as
  older data points in the same trajectory.
- **Pushback files:** all `pushback-*.html` files, reading their data blocks for
  `claims` and `predictions`

### Step 2: Build the Score Trajectory

Parse the `idea-data` block from all evaluation files. Build a timeline:

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

### Step 4: Render the Forge Summary

Render one self-contained HTML file, built from `references/report-shell.html`'s
skeleton and tokens, using the Forge section spec and data-block fields documented in
`references/report-style.md`: Header, Idea in one paragraph (synthesized from
00-overview, incorporating all evolution), Score trajectory (chart from Step 2), Key
pivots (timeline list, compiled from changelog entries across all docs), Pitch-ready
summary (12-slide canonical order: Hook, Problem, Solution, Product/Demo,
Traction/Validation, Market Size, Business Model, Competition, Team, Financials, The
Ask, Vision/Close, each grounded in a validated claim, "not yet validated" instead of
invented content), Investor objections (one per Refuted/Unresolved claim and per
deal-breaker, tagged Market/Execution/Technical/Competitive/Business Model/
Timing/Regulatory/Capital Efficiency, with severity and a deck fix), Verdict (strength,
confidence level based on the validated-vs-assumed ratio, biggest remaining risk,
recommended next action).

Data block: `idea`, `output_type: "forge"`, `idea_paragraph`, `score_trajectory`,
`validated`, `assumed`, `key_pivots`, `pitch_summary`, `objections`, `verdict`. Never
invent a score, quote, or slide content the docs don't support.

**Filename:** `forge-YYYYMMDD.html`, inside the idea folder. Print the path, then offer
to open it (`open ideas/{idea-name}/forge-YYYYMMDD.html` on macOS).

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
