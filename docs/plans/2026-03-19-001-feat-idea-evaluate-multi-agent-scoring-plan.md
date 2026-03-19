---
title: "feat: Add /idea:evaluate with parallel VC and Market agents"
type: feat
status: active
date: 2026-03-19
origin: docs/brainstorms/2026-03-19-idea-evaluate-requirements.md
---

# feat: Add /idea:evaluate with parallel VC and Market agents

## Overview

Add `/idea:evaluate` as a standalone scoring skill that dispatches VC and Market Analyst agents in parallel, producing a machine-readable scored report. Shares an evaluation framework with pushback but runs autonomously (no human interaction required). (see origin: docs/brainstorms/2026-03-19-idea-evaluate-requirements.md)

## Product Loop

```
/idea:new → /idea:pushback (optional) → /idea:evaluate → /idea:improve → /idea:evaluate → ... → /idea:forge
              (human dialogue)           (auto scoring)    (auto fix)      (re-score)            (finalize)
```

## Proposed Solution

### Architecture

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

Mirrored in `.claude/` for local dev.

### Flow

```
/idea:evaluate my-startup
        │
        ├─ Read idea docs + evaluation-framework.md
        │
        ├─── Agent: VC ──────────────┐
        │    (8 dims, web research)          │
        │                                     ├─ Synthesize combined report
        ├─── Agent: Market Analyst ──┘        │
        │    (5 dims, web research)           │
        │                                     ▼
        ├─ Write evaluation-YYYYMMDD.md (YAML frontmatter + prose)
        │
        └─ Optional: "Challenge any score?"
```

## Files to Create

### File 1: `references/evaluation-framework.md`

Shared analytical engine used by both evaluate agents and pushback. Contains:

**Reasoning Tools:**
- Base rate analysis — what's the actual base rate?
- Inversion — what would guarantee this fails?
- Pre-mortem — it's a year from now and this failed. What went wrong?
- Survivorship bias — looking at winners and ignoring the graveyard?
- Second-order effects — solves the immediate problem, but what does it cause?
- Historical analogy — what resembles this? How did it play out?
- Incentive analysis — who benefits, who loses?
- Competitive simulation — what does an incumbent do when they notice this?

**Business Lenses:**
1. Problem Validity — real problem or solution looking for a problem?
2. Customer Clarity — specific enough to find and sell to?
3. Market & Timing — why now? Realistic market size?
4. Competitive Reality — actual moat?
5. Business Model — unit economics work?
6. Execution Risk — hardest unsolved part?
7. Hidden Assumptions — what's assumed but untested?

**Scoring Principles:**
- Score based on what's in the docs — missing info scored low, not assumed
- Be specific: cite numbers, name competitors, reference market data
- Distinguish "not documented" from "documented but weak"
- Every score comes with evidence and a key risk
- Use web research to validate all empirical claims

**Per-Dimension Output Format:**
```markdown
### [Dimension] — [Score]/5 (Weight: [x])

**Assessment:** [2-3 sentence evaluation]
**Evidence:** [What from the idea docs supports this]
**Research:** [Web research findings]
**Key risk:** [Single biggest concern]
**Investor question:** [What an evaluator would ask]
```

### File 2: `agents/evaluate/vc.md`

```yaml
name: vc
description: "Evaluates idea investability from a general VC perspective. Scores 8 dimensions with weighted overall score."
```

**Dimensions (1-5 scale):**

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Team | 2.0x | Domain expertise, founder-market fit, complementary skills, track record |
| Timing | 1.5x | Why now, enabling trends, market readiness, window of opportunity |
| TAM | 1.0x | Market size (bottom-up), growth rate, serviceable market |
| Technology/Product | 1.0x | Technical feasibility, defensible IP, 10x improvement |
| Competition/Moat | 1.0x | Competitive landscape, sustainable advantages, barriers |
| Business Model | 1.0x | Unit economics, revenue model, path to profitability |
| GTM | 1.0x | Customer acquisition, sales motion, channel viability |
| Traction/Validation | 1.0x | Evidence of demand, LOIs, revenue, usage data |

**Formula:**
```
weighted_sum = (Team × 2.0) + (Timing × 1.5) + (others × 1.0 each)
max = 47.5
overall = round((weighted_sum / max) × 100)
```

**Deal-breakers:** Team=1, TAM=1, or any two dimensions=1.

**Instructions:**
- Read the evaluation framework passed as context
- Apply each reasoning tool where relevant
- Use WebSearch to validate TAM, competitors, market trends, pricing
- General VC perspective — not any specific fund's thesis
- For each dimension: use the per-dimension output format from the framework
- Return: dimension scores + overall score + deal-breakers + per-dimension analysis

### File 3: `agents/evaluate/market-analyst.md`

```yaml
name: market-analyst
description: "Evaluates market opportunity and positioning. Scores 5 dimensions using web research."
```

**Dimensions (1-5 scale, all weight 1.0x):**

| Dimension | What it measures |
|-----------|-----------------|
| Market Size & Growth | TAM/SAM/SOM, growth trajectory, maturity stage |
| Competitive Landscape | Competitor strength, concentration, gaps |
| Timing & Tailwinds | Regulatory shifts, tech enablers, cultural trends |
| Customer Accessibility | Reachability, channels, switching willingness |
| Regulatory/Macro Risk | Legal barriers, compliance, platform dependency |

**Formula:** `overall = round((sum of 5 / 25) × 100)`

**Instructions:**
- Read the evaluation framework passed as context
- Heavy use of WebSearch — every dimension needs at least one researched data point
- Identify strongest market narrative the founder could tell
- Identify where that narrative breaks down
- Cross-reference against 03-assumptions.md if provided
- Return: dimension scores + overall score + per-dimension analysis

### File 4: `skills/idea-evaluate/SKILL.md`

```yaml
name: idea:evaluate
description: Score a business idea across VC investability and market opportunity using parallel evaluation agents. Produces a machine-readable report. Use when the user wants a quantified assessment of their idea.
argument-hint: [idea-folder-name] [vc|market]
disable-model-invocation: true
allowed-tools: Read, Glob, Write, WebSearch, WebFetch, Agent
```

**Phase 1: Load**
1. Parse argument for idea folder name and optional agent filter
2. Glob `ideas/*{argument}*/` to find the folder
3. Read all docs (00-overview through 05-experiments)
4. Read `references/evaluation-framework.md`

**Phase 2: Dispatch Agents**
1. If filter specified (`vc` or `market`), dispatch only that agent
2. Otherwise dispatch both in parallel via Agent tool
3. Pass to each agent: idea docs content + evaluation framework + assumptions doc (if exists)

**Phase 3: Synthesize Report**
1. Collect agent outputs
2. Compute combined score: `round((vc_overall + market_overall) / 2)`
3. Identify overall deal-breakers
4. Identify weakest dimension across all agents
5. Write evaluation file with YAML frontmatter + prose

**Phase 4: Optional Dialogue**
1. Present scores: "These are the assessments. Challenge any score, or say 'done'."
2. If challenged: defend with evidence, revise if new info warrants it
3. Update evaluation file with revised scores

**Session commands:**
- "details [dimension]" — expand reasoning
- "done" — end session

**Evaluation output file** (`evaluation-YYYYMMDD-HHmmss.md`):

```yaml
---
type: evaluation
date: YYYY-MM-DD
agents: [vc, market-analyst]
combined_score: 62
deal_breakers: ["Team scored 1/5"]
scores:
  vc:
    overall: 58
    dimensions:
      team: { score: 2, weight: 2.0 }
      timing: { score: 4, weight: 1.5 }
      tam: { score: 3, weight: 1.0 }
      technology: { score: 3, weight: 1.0 }
      competition: { score: 2, weight: 1.0 }
      business_model: { score: 3, weight: 1.0 }
      gtm: { score: 2, weight: 1.0 }
      traction: { score: 1, weight: 1.0 }
  market_analyst:
    overall: 66
    dimensions:
      market_size: { score: 4 }
      competitive_landscape: { score: 3 }
      timing_tailwinds: { score: 4 }
      customer_accessibility: { score: 3 }
      regulatory_risk: { score: 3 }
weakest_dimension: { agent: "vc", dimension: "traction", score: 1 }
---
```

### File 5: Update `README.md`

Update the project README to reflect the new product loop and available commands.

## Technical Considerations

### Agent dispatch

The evaluate skill dispatches agents via Claude Code's Agent tool. Each agent runs independently with its own web research. The skill passes the shared framework + idea docs as context to each agent.

If the plugin system doesn't support agent file discovery, fallback: embed agent prompts inline in the skill and run them sequentially. This is a degraded but functional mode.

### Shared framework as single source of truth

When the framework is updated (new reasoning tool, adjusted principles), both evaluate and pushback benefit. Pushback will be updated in a separate PR to read the framework instead of having its own inline lenses/principles.

### Graceful degradation

- **Sparse idea folders:** Distinguish "not documented" from "documented but weak" in scores
- **No WebSearch:** Degrade to doc-only analysis, note which scores lack empirical validation
- **Single agent filter:** `/idea:evaluate my-idea vc` skips market agent entirely, only produces VC scores

## Acceptance Criteria

- [ ] `/idea:evaluate my-idea` runs both agents in parallel and produces combined report
- [ ] `/idea:evaluate my-idea vc` runs only VC agent
- [ ] `/idea:evaluate my-idea market` runs only Market Analyst agent
- [ ] Evaluation file has YAML frontmatter parseable by future improve loop
- [ ] `weakest_dimension` field identifies what to improve next
- [ ] VC scores 8 dimensions with weighted overall (0-100)
- [ ] Market Analyst scores 5 dimensions with overall (0-100)
- [ ] Both agents use WebSearch for empirical validation
- [ ] Deal-breakers flagged when critical dimensions score 1/5
- [ ] Optional dialogue after report for challenging scores
- [ ] Cross-references 03-assumptions.md if it exists
- [ ] Saved as `evaluation-YYYYMMDD-HHmmss.md` in idea folder
- [ ] `references/evaluation-framework.md` created with shared analytical engine
- [ ] README updated with new product loop and commands

## Implementation Phases

### Phase 1: Shared Framework + VC Agent + Skill

1. Create `references/evaluation-framework.md` (shared analytical engine)
2. Create `agents/evaluate/vc.md` (8 dimensions, weighted scoring)
3. Create `skills/idea-evaluate/SKILL.md` (orchestrator, single-agent mode first)
4. Mirror all files to `.claude/` directory
5. Test with a single agent dispatch

### Phase 2: Market Analyst Agent + Parallel Dispatch

1. Create `agents/evaluate/market-analyst.md` (5 dimensions)
2. Update skill for parallel agent dispatch and combined scoring
3. Add agent filter argument parsing (`vc` / `market`)

### Phase 3: README + Polish

1. Update README with product loop and new commands
2. Update marketplace.json description
3. Version bump

### Phase 4: (Future — Separate PRs)

- Refactor pushback to use shared `evaluation-framework.md` instead of inline lenses
- Build `/idea:improve` autoresearch loop

## Sources & References

- **Origin:** [docs/brainstorms/2026-03-19-idea-evaluate-requirements.md](docs/brainstorms/2026-03-19-idea-evaluate-requirements.md)
- **General VC evaluation patterns:** 4T framework, investment rubrics — inspiration for VC dimensions
- **compound-engineering-plugin:** Skill/agent architecture, parallel agent dispatch
- **Karpathy autoresearch:** Loop model — informed `weakest_dimension` field
- **eranshir/challenger:** Named reasoning tools, scorecard pattern
- Existing: `idea-pushback/SKILL.md`, `idea-new/SKILL.md`
