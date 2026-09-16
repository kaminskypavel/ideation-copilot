---
name: idea-evaluate
description: Score a business idea across VC investability, market opportunity, and founder-idea fit using parallel evaluation agents. Produces a machine-readable report with scores, deal-breakers, and the weakest dimension. Use when the user wants a quantified assessment of their idea.
argument-hint: "[idea-folder-name] [vc|market|yc]"
disable-model-invocation: true
allowed-tools: Read, Glob, Write, WebSearch, WebFetch, Agent, web_search_advanced_exa, crawling_exa, Bash(open *)
---

# Evaluate Idea

Score a business idea by dispatching evaluation agents that research and rate the idea across investment and market dimensions. Produces a structured, machine-readable report.

## Protocol

Follow these phases in order.

### Phase 1: Load

1. Parse `<argument>` for the idea folder name and an optional agent filter (`vc`, `market`, or `yc`)
2. Search for the idea folder:

```
ideas/*{idea-folder-name}*/
```

3. Read all documents in the folder (00-overview through 05-experiments). Note which docs exist and which are missing.
4. Determine the idea's stage from `04-pmf-strategy.md`'s milestones and PMF ladder checkboxes: `pre-product` (no MVP built), `prototype` (MVP exists, pre-revenue traction only), or `early-revenue` (paying customers or revenue). If `04-pmf-strategy.md` is missing or inconclusive, ask the user or default to `pre-product`.
5. Read the shared evaluation framework:

```
references/evaluation-framework.md
```

6. Read the Exa research guide (if it exists):

```
references/exa-research.md
```

7. If `03-assumptions.md` exists, flag it for cross-referencing.
8. Read every prior `evaluation-*.html`, sorted by date, and parse each one's
   `<script type="application/json" id="idea-data">` block for its `combined_score` and
   per-agent scores; this is the trajectory this evaluation appends to and the baseline
   for the delta callout in the summary. Legacy compatibility: if the folder has older
   `evaluation-*.md` files with YAML frontmatter instead, read those too as older data
   points in the same trajectory.

### Phase 2: Dispatch Agents

Prepare the context block for agents — combine:
- The full evaluation framework
- The Exa research guide (if loaded)
- All idea documents content
- The assumptions document (if it exists)
- The detected stage, plus one line telling agents to apply the framework's Stage Calibration section: relax Traction and Business Model expectations for `pre-product`, expect early usage signals for `prototype`, and apply the full rubric for `early-revenue`.

**If an agent filter was specified** (`vc`, `market`, or `yc`), run only that agent.

**Otherwise, dispatch all three.** Parallel if this harness has an Agent/subagent tool; else sequential in this session. Same prompts, same output format. Load each persona from `agents/evaluate/` (`vc.md`, `market-analyst.md`, `yc-founder-fit.md`).

In Claude Code the personas are registered subagents; dispatch with `subagent_type: "ideation-copilot:vc"`, `"ideation-copilot:market-analyst"`, `"ideation-copilot:yc-founder-fit"` and pass only the context block as the prompt. In other harnesses read the persona file and prepend it to the prompt.

Each selected agent gets the full context block:

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

**Stage:** [pre-product / prototype / early-revenue]: [one line stating which dimensions were relaxed, if any]

| Agent | Score | Deal-breakers |
|-------|-------|---------------|
| VC Investability | [score]/100 | [list or None] |
| Market Opportunity | [score]/100 | — |
| YC Founder-Fit | [score]/100 | — |
| **Combined** | **[score]/100 ([grade label from evaluation-framework.md])** | **[count] deal-breaker(s)** |

**Weakest dimension:** [agent] → [dimension] ([score]/5) — address this first.
```

Then present the full per-dimension analysis from each agent.

### Phase 4: Render the Evaluation

Render one self-contained HTML file, built from `references/report-shell.html`'s
skeleton and tokens, using the Evaluation section spec and data-block fields documented
in `references/report-style.md` ("Section specs by output type" and "Per-type data block
fields"): Header (stage plus grade badge), Summary table (per agent score plus
deal-breakers), Dimension bars (per agent, with the evidence-quality tick), Weakest
dimension callout, Assumptions cross-reference gaps.

Data block: `idea`, `output_type: "evaluation"`, `stage`, `combined_score`, `label`
(from the evaluation framework's Grade Labels), `agents` (every dimension's score,
weight, evidence_quality), `deal_breakers`, `weakest_dimension`, `assumption_gaps`.
Fill the visible cards and the data block from one pass over the same computed values so
they cannot drift. Never invent a score; a dimension no agent scored is `null` and
renders in its empty state.

**Filename:** `evaluation-YYYYMMDD-HHmmss.html`, inside the idea folder. Print the path,
then offer to open it (`open ideas/{idea-name}/evaluation-YYYYMMDD-HHmmss.html` on
macOS).

### Phase 5: Optional Dialogue

After presenting the report:

> "These are the assessments based on your idea docs and market research. Challenge any score you disagree with, or say 'done' to finish."

If the founder challenges a score:
- Defend the assessment with evidence from the docs and web research
- If the founder provides new information that changes the analysis, revise the score
- Recalculate the overall and combined scores, then re-render the same
  `evaluation-YYYYMMDD-HHmmss.html` file (same filename as Phase 4, full rewrite) with
  the revised numbers in both the visible cards and the data block

**Session commands:**
- **"details [dimension]"** — expand the full reasoning for a specific score
- **"done"** — end the evaluation session

## Next Steps

After presenting the evaluation, suggest next steps based on the scores:

Before printing, read `references/workflow.md`, determine the idea folder state, and apply the Next Step table. Print the top 2-3 matching steps with the evidence behind each. The list below is the default if folder state cannot be read.

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
- **Exa unavailable:** Fall back to WebSearch for all research. Note once: "Exa search unavailable — using standard web search for research."
- **No WebSearch available:** Fall back to doc-only analysis. Note which scores lack empirical validation.
- **Single agent filter:** `/idea:evaluate my-idea vc` or `market` or `yc` produces only that agent's scores. The combined score equals the single agent's score.

If Exa tools were not available during this evaluation, append a single note at the end of the report:

> **Tip:** Run `/idea:setup` to configure Exa search for richer market and competitor data.
