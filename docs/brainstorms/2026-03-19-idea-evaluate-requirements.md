---
date: 2026-03-19
topic: idea-evaluate
---

# /idea:evaluate — Standalone Scoring Skill with Parallel Agents

## Problem Frame

Founders using the ideation-copilot can scaffold ideas (`/idea:new`) and stress-test them (`/idea:pushback`), but have no way to get a structured, scored evaluation of investment readiness or market viability. They need a tool that tells them "here's your score, here's what's weak, here's what to fix" — not just "here are holes in your logic."

This also lays the groundwork for a future `/idea:improve` autoresearch-style loop that autonomously improves ideas by targeting the weakest evaluation areas.

## Product Loop

```
/idea:new → /idea:pushback (optional, human) → /idea:evaluate → /idea:improve → /idea:evaluate → ... → /idea:forge
```

- **new** — entry point, scaffolds idea docs
- **pushback** — interactive stress-test with dialogue (human-in-the-loop, optional)
- **evaluate** — standalone quantitative scoring, runs autonomously (no human interaction required)
- **improve** — (future) reads evaluation scores, researches fixes for weakest dimension, updates idea docs
- **forge** — finalizes when scores meet threshold

Pushback and evaluate share the same analytical engine (evaluation-framework.md) but differ in interaction model: pushback wraps it in dialogue, evaluate runs it straight through. Evaluate must be autonomous so the improve loop can call it without human intervention.

## Architecture

```
plugins/ideation-copilot/
├── skills/
│   ├── idea-pushback/SKILL.md        # Interactive: shared framework + dialogue
│   └── idea-evaluate/SKILL.md        # Orchestrator: dispatches agents in parallel
├── agents/
│   └── evaluate/
│       ├── vc.md                      # VC-specific dimensions + scoring
│       └── market-analyst.md          # Market-specific dimensions + scoring
└── references/
    └── evaluation-framework.md        # Shared: lenses, reasoning tools, principles
```

The evaluate skill reads the shared framework + idea docs, then dispatches VC and Market Analyst agents **in parallel**. Each agent receives the framework as context, applies its own dimensions, and returns scored output. The skill synthesizes the combined report.

## Requirements

- R1. `/idea:evaluate` is a standalone skill that reads an idea folder and runs evaluation agents in parallel
- R2. Accepts an optional argument to run a single agent: `/idea:evaluate my-idea vc`, `/idea:evaluate my-idea market`. Default runs all.
- R3. **VC Agent** — evaluates investability using a general VC framework:
  - Scores across 8 dimensions: Team, Timing, TAM, Technology/Product, Competition/Moat, Business Model/Unit Economics, GTM, Traction/Validation
  - Each dimension scored 1-5 (1=missing/weak, 3=adequate, 5=exceptional)
  - Overall investability score (0-100) with weighted formula (Team 2x, Timing 1.5x, others 1x)
  - Identifies deal-breakers (critical dimensions scoring 1/5)
  - Produces targeted investor questions for each weak dimension
  - Uses web research to validate empirical claims
  - General VC perspective, not tied to any specific fund
- R4. **Market Analyst Agent** — evaluates market opportunity:
  - Scores 5 dimensions: market size & growth, competitive landscape, timing & tailwinds, customer accessibility, regulatory/macro risk
  - Each dimension scored 1-5
  - Uses web research for competitor data, market reports, trend validation
  - Identifies strongest market narrative and where it breaks down
- R5. **Report-first, then optional dialogue**: agents produce scores upfront, then founder can challenge specific scores
- R6. Output must be **machine-readable** — YAML frontmatter with scores, overall score, deal-breakers, and `weakest_dimension` field for future `/idea:improve`
- R7. Evaluation saved as `evaluation-YYYYMMDD-HHmmss.md` in the idea folder
- R8. Cross-reference against `03-assumptions.md` if it exists
- R9. **Shared evaluation framework** (`references/evaluation-framework.md`) contains reasoning tools, business lenses, and principles used by both evaluate agents and pushback skill

## Success Criteria

- Evaluate runs autonomously (no human interaction required) — critical for future improve loop
- VC and Market agents run in parallel for speed
- Each agent's scores are independently useful
- A future `/idea:improve` can parse the evaluation file and target the weakest dimension
- Founders can optionally challenge scores in dialogue after the report

## Scope Boundaries

- **Not building** `/idea:improve` now — only ensuring output supports it
- **Not building** additional agents beyond VC and Market Analyst
- **Not tied** to any specific VC fund's thesis
- **Not modifying** pushback in this iteration — pushback will be updated separately to use the shared framework

## Key Decisions

- **Standalone skill, not embedded in pushback**: Evaluate must run without human interaction for the improve loop. Pushback is interactive. They share the framework but are separate skills.
- **Parallel agent dispatch**: VC and Market Analyst are independent analyses, run concurrently via Agent tool.
- **Shared evaluation-framework.md**: Single source of truth for reasoning tools, lenses, principles. Both evaluate agents and pushback reference it. Updating the framework improves both.
- **Weighted scoring**: Team 2x, Timing 1.5x, others 1x. Transparent in output.
- **Machine-readable YAML with weakest_dimension**: Enables autoresearch loop.

## Dependencies / Assumptions

- Idea folders follow existing structure (00-overview through 05-experiments)
- WebSearch and WebFetch available for empirical validation
- Agent tool can dispatch parallel agents from a skill

## Outstanding Questions

### Resolve Before Planning

(none — all resolved)

### Deferred to Planning

- [Affects R9][Technical] How pushback will reference the shared framework (future PR)

## Next Steps

→ Implement: evaluation-framework.md, vc.md agent, market-analyst.md agent, idea-evaluate SKILL.md
