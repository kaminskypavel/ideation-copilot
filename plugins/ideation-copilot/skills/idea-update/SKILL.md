---
name: idea:update
description: Add new information to idea documents — customer interviews, experiment results, team changes, or any real-world data. Use when the user has new data to incorporate into their idea docs without a full pushback session.
argument-hint: [idea-folder-name]
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit
---

# Update Idea

Add new information to your idea documents — customer interviews, experiment results, team details, market research, or any real-world data. This is the quick data-entry path when you don't need a full pushback session.

## Workflow

### Step 1: Load the Idea

Read `` to identify the idea folder. Search for it under `ideas/`.

```
ideas/*{argument}*/
```

Read all documents in the folder (00-overview through 05-experiments).

### Step 2: Identify What Changed

Ask the user or infer from context:

- **Post-challenge?** Look for challenge output in the conversation history. Extract weaknesses found, hidden assumptions discovered, and recommended next moves.
- **New data?** Ask the user what new information they have (customer interviews, market data, competitor analysis, experiment results).
- **Pivot?** Has the core thesis changed? If so, flag which documents need major rewrites vs. minor updates.

### Step 3: Update Each Document

Work through documents in order, making targeted updates:

#### 00-overview.md
- Sharpen the problem statement based on new evidence
- Update the insight if the thesis has evolved
- Refine target customer if interviews revealed a different buyer
- Add or update a `## Changelog` section at the bottom tracking what changed and why

#### 01-brainstorm.md
- Move validated ideas from "possible approaches" to confirmed
- Remove approaches that were invalidated
- Add new approaches surfaced by challenges or research
- Update "Open Questions" — close answered ones, add new ones

#### 02-lean-canvas.md
- Update any cell that has new evidence
- Bold cells that are now validated vs. still assumed
- Recalculate unit economics if pricing or CAC data changed

#### 03-assumptions.md
- Mark tested assumptions with result: **Validated** / **Invalidated** / **Partially validated**
- Add newly discovered assumptions from challenges
- Re-rank the assumption stack based on current knowledge
- Update "The Riskiest Assumption" if it shifted

#### 04-pmf-strategy.md
- Check off completed milestones on the PMF ladder
- Update go-to-market based on what channels actually worked
- Refine kill criteria based on learnings
- Update competitive moat assessment

#### 05-experiments.md
- Fill in results and learnings for completed experiments
- Add new experiments based on challenge findings or new assumptions
- Update the Decision Log with pivot/persevere decisions
- Re-prioritize the experiment backlog

### Step 4: Add Changelog Entries

Read the changelog format from `references/evaluation-framework.md`.

For **every document you modified**, append a changelog entry at the bottom using the standard format:

```markdown
### Forge: {YYYY-MM-DD} (manual)
**Trigger:** {post-challenge / new-data / pivot / iteration}
**Changes:**
- {specific change 1}
- {specific change 2}
**Source:** {where the evidence came from — interview, experiment, market report, challenge session}
**Confidence delta:** {stronger / weaker / pivoted — one sentence why}
```

Create the `## Changelog` section at the bottom of each doc if it doesn't exist yet.

### Step 5: Summary

Output a concise diff summary:

```
## Update Summary

**Documents updated:** X/6
**Assumptions resolved:** X validated, Y invalidated, Z new
**Confidence:** [Higher / Lower / Pivoted] — {one sentence why}

What's next?

→ /idea:evaluate {idea-name}   — re-score to see if the updates improved your numbers
→ /idea:pushback {idea-name}   — stress-test the new claims you just added
→ /idea:forge {idea-name}      — synthesize everything if you've done multiple rounds
```

## Principles

- **Evidence over opinion.** Only upgrade confidence when there's real data backing it. "I think customers want this" stays as an assumption. "12/15 interviewees said they'd pay $30/mo" is evidence.
- **Track provenance.** When updating a claim, note where the evidence came from (interview #, experiment result, market report).
- **Don't delete history.** Use strikethrough for invalidated assumptions rather than removing them — the graveyard of bad assumptions is valuable learning.
- **Compound knowledge.** Each forge pass should make the documents more precise, not just longer. Remove fluff, tighten language, increase specificity.
- **Flag regression.** If new data makes the idea weaker, say so clearly. Don't sugarcoat — that defeats the purpose.
