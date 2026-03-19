---
title: "Shared evaluation framework with parallel agent dispatch"
category: architecture
date: 2026-03-19
tags: [skill-design, agents, evaluation, shared-framework, parallel-dispatch, autoresearch]
components: [idea:evaluate, idea:pushback, evaluation-framework, vc-agent, market-analyst-agent]
---

## Problem

We needed to add quantified scoring (VC investability, market opportunity) to the ideation-copilot plugin. The scoring had to work both interactively (human challenges scores in dialogue) and autonomously (future autoresearch loop calls scoring without human interaction).

Initial design embedded evaluation directly into the pushback skill. This created a coupling problem: pushback requires human-in-the-loop dialogue (per-claim sparring), but autonomous scoring can't block on human input.

## Root Cause

Interactive skills (dialogue-based) and autonomous skills (loop-friendly) have fundamentally different interaction models. Embedding autonomous functionality inside an interactive skill blocks automation.

## Solution

### 1. Separate evaluate from pushback

Pushback stays interactive (human dialogue). Evaluate is standalone and autonomous (no human interaction required). Both share the same analytical engine.

### 2. Shared evaluation-framework.md

Instead of duplicating reasoning tools, business lenses, and scoring principles across skills, extract them into a single reference file:

```
references/evaluation-framework.md
```

Both pushback and evaluate agents read this file. Updating the framework improves both skills.

**Key contents:**
- 8 named reasoning tools (base rate analysis, inversion, pre-mortem, etc.)
- 7 business lenses (problem validity, customer clarity, market & timing, etc.)
- Scoring principles and 1-5 scale criteria
- Per-dimension output format template

### 3. Parallel agent dispatch

The evaluate skill dispatches VC and Market Analyst agents in parallel via the Agent tool:

```
/idea:evaluate my-startup
    ├─ Read idea docs + framework
    ├─── Agent: VC (8 dims) ───────┐
    │                                ├─ Synthesize
    ├─── Agent: Market Analyst (5) ─┘
    └─ Write evaluation YAML + prose
```

Each agent receives the framework + idea docs as context, runs independently with its own web research, and returns scored output. The skill synthesizes the combined report.

### 4. Machine-readable YAML output

Evaluation files use YAML frontmatter with structured scores and a `weakest_dimension` field:

```yaml
weakest_dimension: { agent: "vc", dimension: "traction", score: 1 }
```

This enables a future `/idea:improve` autoresearch loop to parse one field and know exactly what to target.

## Prevention / Best Practices

- **Separate interactive from autonomous skills.** If a skill needs both human dialogue and programmatic invocation, split it. Share the engine via a reference file, not by embedding one inside the other.
- **Use reference files for shared logic.** When multiple skills or agents need the same analytical framework, extract it to `references/`. Single source of truth.
- **Design for the loop early.** Even if the autoresearch loop isn't built yet, structuring output as machine-readable YAML means the loop integration is trivial later.
- **Parallel agents for independent analyses.** If two evaluations don't depend on each other's output, dispatch them in parallel. Adding a new evaluation lens is just adding another agent file.

## Related

- `docs/brainstorms/2026-03-19-idea-evaluate-requirements.md` — requirements evolution
- `docs/plans/2026-03-19-001-feat-idea-evaluate-multi-agent-scoring-plan.md` — implementation plan
- Inspiration: [eranshir/challenger](https://github.com/eranshir/challenger) (conversational sparring), [karpathy/autoresearch](https://github.com/karpathy/autoresearch) (autonomous improvement loop), [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) (skill/agent architecture)
