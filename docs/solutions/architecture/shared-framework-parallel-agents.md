---
title: "Ideation copilot plugin architecture — shared framework, parallel agents, command flow"
category: architecture
date: 2026-03-19
tags: [skill-design, agents, evaluation, shared-framework, parallel-dispatch, autoresearch, command-flow, changelog]
components: [idea:new, idea:pushback, idea:evaluate, idea:update, idea:forge, evaluation-framework, vc-agent, market-analyst-agent]
---

## Problem

We needed to evolve the ideation-copilot plugin from 3 loosely connected commands (`new`, `challenge`, `forge`) into a coherent product loop with quantified scoring, shared analytical tools, and clear command flow. Several design tensions emerged:

1. **Interactive vs autonomous:** Pushback requires human dialogue, but a future autoresearch loop needs to call scoring without human input.
2. **Duplicated logic:** Multiple skills needed the same reasoning tools, business lenses, and scoring principles.
3. **Unclear command boundaries:** Forge was doing double duty (update docs AND synthesize results). Users didn't know when to use which command.
4. **No history tracking:** Docs got overwritten without tracking what changed, and we couldn't assume git was available.
5. **Dead-end commands:** After running a command, users had no guidance on what to do next.

## Root Cause

The plugin was designed skill-by-skill without a unifying architecture. Each skill duplicated shared logic, had its own interaction model, and didn't connect to the others.

## Solution

### 1. Separate interactive from autonomous

Pushback stays interactive (human dialogue). Evaluate is standalone and autonomous (no human interaction required). Both share the same analytical engine via `references/evaluation-framework.md`.

**Key insight:** If a skill needs both human dialogue and programmatic invocation, split it. Share the engine via a reference file, not by embedding one inside the other.

### 2. Shared evaluation-framework.md

Single source of truth for:
- 8 named reasoning tools (base rate analysis, inversion, pre-mortem, survivorship bias, second-order effects, historical analogy, incentive analysis, competitive simulation)
- 7 business lenses (problem validity, customer clarity, market & timing, competitive reality, business model, execution risk, hidden assumptions)
- Scoring principles and 1-5 scale criteria
- Per-dimension output format template
- Standardized changelog format for all doc modifications

Both pushback and evaluate agents read this file. Updating the framework improves both.

### 3. Parallel agent dispatch

The evaluate skill dispatches VC and Market Analyst agents in parallel:

```
/idea:evaluate my-startup
    ├─ Read idea docs + framework
    ├─── Agent: VC (8 dims, weighted) ─┐
    │                                    ├─ Synthesize combined report
    ├─── Agent: Market Analyst (5 dims) ┘
    └─ Write evaluation YAML + prose
```

Adding a new evaluation lens = adding another agent file. No skill changes needed.

### 4. Machine-readable YAML with weakest_dimension

Evaluation files use YAML frontmatter enabling a future autoresearch loop:

```yaml
weakest_dimension: { agent: "vc", dimension: "traction", score: 1 }
```

### 5. Clear command boundaries

Renamed and split commands so each does one thing:

| Command | Role | Input | Output |
|---------|------|-------|--------|
| `idea:new` | Create | Idea name + description | 6 scaffolded docs |
| `idea:pushback` | Stress-test | Idea docs | Scorecard + predictions |
| `idea:evaluate` | Score | Idea docs | YAML evaluation file |
| `idea:update` | Add info | User's new data | Updated idea docs |
| `idea:forge` | Synthesize | All accumulated artifacts | Consolidated summary with score trajectory |

**Key rename:** Old `forge` (which updated docs) became `update`. New `forge` is a synthesis/compounding step that reads everything and produces a consolidated view.

### 6. Changelog format (no git dependency)

All skills that modify docs append standardized changelog entries:

```markdown
### [Action]: [YYYY-MM-DD] [mode]
**Trigger:** [what caused this update]
**Changes:** [specific changes]
**Source:** [where the evidence came from]
**Confidence delta:** [stronger / weaker / pivoted]
```

Evaluation files create a natural score timeline via timestamps. No git required.

### 7. Next-step hints

Every command ends with context-aware suggestions for what to do next:

- `new` → suggests `pushback`
- `pushback` → suggests `update`, `evaluate`, or `forge` based on session
- `evaluate` → suggests `update`, `pushback`, or `forge` based on scores
- `update` → suggests `evaluate`, `pushback`, or `forge`
- `forge` → suggests `pushback`, `evaluate`, or `new` (if pivoting)

## Final Architecture

```
plugins/ideation-copilot/
├── skills/
│   ├── idea-new/SKILL.md           # Scaffold
│   ├── idea-pushback/SKILL.md      # Interactive stress-test
│   ├── idea-evaluate/SKILL.md      # Orchestrator: parallel agent dispatch
│   ├── idea-update/SKILL.md        # Quick data entry
│   └── idea-forge/SKILL.md         # Synthesis + score trajectory
├── agents/
│   └── evaluate/
│       ├── vc.md                    # 8 weighted dims, deal-breaker rules
│       └── market-analyst.md        # 5 dims, heavy web research
└── references/
    └── evaluation-framework.md      # Shared reasoning tools + principles + changelog format
```

## Prevention / Best Practices

- **Separate interactive from autonomous skills.** If a skill needs both human dialogue and programmatic invocation, split it.
- **Use reference files for shared logic.** Multiple skills/agents needing the same framework → extract to `references/`.
- **Design for the loop early.** Machine-readable YAML output makes future automation trivial.
- **Parallel agents for independent analyses.** Don't serialize what can run concurrently.
- **Every command should hint at the next.** Users shouldn't have to memorize a workflow diagram.
- **Don't assume git.** If your users aren't developers, build history tracking into the docs themselves.
- **Name commands for what users think, not what the system does.** "Update" beats "forge" for adding data. "Forge" works for synthesis because it implies transforming raw materials into something finished.

## Related

- `docs/brainstorms/2026-03-19-idea-evaluate-requirements.md` — requirements evolution (went through 3 architectural revisions)
- `docs/plans/2026-03-19-001-feat-idea-evaluate-multi-agent-scoring-plan.md` — implementation plan
- Inspiration: [eranshir/challenger](https://github.com/eranshir/challenger) (conversational sparring), [karpathy/autoresearch](https://github.com/karpathy/autoresearch) (autonomous improvement loop), [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) (skill/agent architecture)
