---
name: idea:evaluate
description: Score a business idea across VC investability, market opportunity, and founder-idea fit using parallel evaluation agents. Produces a machine-readable report with scores, deal-breakers, and the weakest dimension. Use when the user wants a quantified assessment of their idea.
argument-hint: [idea-folder-name] [vc|market|yc]
disable-model-invocation: true
allowed-tools: Read, Glob, Write, WebSearch, WebFetch, Agent
---

# Evaluate Idea

Score a business idea by dispatching evaluation agents that research and rate the idea across investment and market dimensions. Produces a structured, machine-readable report.

## Protocol

Follow these phases in order.

### Phase 1: Load

1. Parse `<argument>` for the idea folder name and an optional agent filter (`vc` or `market`)
2. Search for the idea folder:

```
ideas/*{idea-folder-name}*/
```

3. Read all documents in the folder (00-overview through 05-experiments). Note which docs exist and which are missing.
4. Read the shared evaluation framework:

```
references/evaluation-framework.md
```

5. If `03-assumptions.md` exists, flag it for cross-referencing.

### Phase 2: Dispatch Agents

Prepare the context block for agents — combine:
- The full evaluation framework
- All idea documents content
- The assumptions document (if it exists)

**If an agent filter was specified** (`vc` or `market`), run only that agent.

**Otherwise, dispatch both agents in parallel:**

Launch two Agent tasks simultaneously, each receiving the full context block:

1. **VC Agent** — evaluates investability across 8 weighted dimensions (Team, Timing, TAM, Technology/Product, Competition/Moat, Business Model, GTM, Traction/Validation)
2. **Market Analyst Agent** — evaluates market opportunity across 5 dimensions (Market Size & Growth, Competitive Landscape, Timing & Tailwinds, Customer Accessibility, Regulatory/Macro Risk)
3. **YC Founder-Fit Agent** — evaluates founder-idea fit across 10 dimensions from the YC framework (Founder-Market Fit, Market Size, Problem Acuteness, Competition Presence, Personal/Peer Demand, Recent Possibility/Necessity, Successful Proxies, Long-term Commitment, Business Scalability, Idea Space Fertility)

Each agent:
- Applies the reasoning tools from the evaluation framework
- Uses WebSearch to validate empirical claims
- Scores each dimension 1-5 using the framework's scale and output format
- Returns dimension scores, overall score, and summary

### Phase 3: Synthesize Report

Collect outputs from both agents (or one if filtered). Compute:

**If all agents ran:**
```
combined_score = round((vc_overall + market_overall + yc_overall) / 3)
```

**If two agents ran:** average those two scores.
**If single agent:** use that agent's overall score as the combined score.

Identify:
- **Deal-breakers** from the VC agent (Team=1, TAM=1, or any two dimensions=1)
- **Weakest dimension** across all agents — the single lowest-scoring dimension
- **Assumptions gaps** from the Market Analyst's cross-reference against 03-assumptions.md

Present a summary table:

```markdown
## Evaluation Summary

| Agent | Score | Deal-breakers |
|-------|-------|---------------|
| VC Investability | [score]/100 | [list or None] |
| Market Opportunity | [score]/100 | — |
| YC Founder-Fit | [score]/100 | — |
| **Combined** | **[score]/100** | **[count] deal-breaker(s)** |

**Weakest dimension:** [agent] → [dimension] ([score]/5) — address this first.
```

Then present the full per-dimension analysis from each agent.

### Phase 4: Write Evaluation File

Write the evaluation report to the idea folder:

**Filename:** `evaluation-YYYYMMDD-HHmmss.md`
**Location:** Inside the idea folder (`ideas/{idea-name}/`)

The file starts with YAML frontmatter containing all scores in a machine-readable format:

```yaml
---
type: evaluation
date: YYYY-MM-DD
agents: [vc, market-analyst, yc-founder-fit]
combined_score: 59
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
  yc_founder_fit:
    overall: 54
    dimensions:
      founder_market_fit: { score: 4 }
      market_size: { score: 3 }
      problem_acuteness: { score: 2 }
      competition_presence: { score: 3 }
      personal_peer_demand: { score: 2 }
      recent_possibility: { score: 4 }
      successful_proxies: { score: 3 }
      long_term_commitment: { score: 3 }
      business_scalability: { score: 2 }
      idea_space_fertility: { score: 3 }
weakest_dimension: { agent: "vc", dimension: "traction", score: 1 }
---
```

Below the frontmatter: the full evaluation summary table, per-agent analysis, and all per-dimension details.

### Phase 5: Optional Dialogue

After presenting the report:

> "These are the assessments based on your idea docs and market research. Challenge any score you disagree with, or say 'done' to finish."

If the founder challenges a score:
- Defend the assessment with evidence from the docs and web research
- If the founder provides new information that changes the analysis, revise the score
- Update the evaluation file with revised scores
- Recalculate the overall and combined scores

**Session commands:**
- **"details [dimension]"** — expand the full reasoning for a specific score
- **"done"** — end the evaluation session

## Next Steps

After presenting the evaluation, suggest next steps based on the scores:

```
Evaluation complete! What's next?

→ /idea:update {idea-name}     — fix low scores by adding missing info to your docs
→ /idea:pushback {idea-name}   — stress-test the claims behind your weakest dimensions
→ /idea:forge {idea-name}      — synthesize everything if you've done multiple rounds
```

Choose based on the scores:
- If low scores reflect **missing info** (e.g., Team scored low because docs don't mention the founder's background) → suggest **update**
- If low scores reflect **untested claims** (e.g., TAM is assumed, not validated) → suggest **pushback**
- If scores are strong across the board → suggest **forge** to create the consolidated summary

## Graceful Degradation

- **Sparse idea folders:** Distinguish "not documented" from "documented but weak." Note: "Score reflects missing documentation — [dimension] may improve if [specific doc] is fleshed out."
- **No WebSearch available:** Fall back to doc-only analysis. Note which scores lack empirical validation.
- **Single agent filter:** `/idea:evaluate my-idea vc` or `market` or `yc` produces only that agent's scores. The combined score equals the single agent's score.
