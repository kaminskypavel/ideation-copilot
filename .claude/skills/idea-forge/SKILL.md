---
name: idea:forge
description: Update and strengthen idea documents after a challenge, new research, or validated data. Integrates learnings, resolves open questions, and hardens the idea. Use when the user has new data, completed experiments, received challenge feedback, or wants to refine an existing idea.
argument-hint: [idea-folder-name]
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit
---

# Forge Idea

Refine and harden a business idea by integrating new evidence, challenge results, and validated learnings into the existing documents. This is the iterative improvement loop — the idea gets sharper each time it passes through the forge.

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

### Step 4: Add Forge Entry

Append to `00-overview.md` changelog:

```markdown
### Forge: {YYYY-MM-DD}
**Trigger:** {post-challenge / new-data / pivot / iteration}
**Key changes:**
- {change 1}
- {change 2}
**Confidence delta:** {idea is stronger/weaker/pivoted because...}
```

### Step 5: Summary

Output a concise diff summary:

```
## Forge Summary

**Documents updated:** X/6
**Assumptions resolved:** X validated, Y invalidated, Z new
**Confidence:** [Higher / Lower / Pivoted] — {one sentence why}
**Next action:** {the single most important thing to do next}
```

## Principles

- **Evidence over opinion.** Only upgrade confidence when there's real data backing it. "I think customers want this" stays as an assumption. "12/15 interviewees said they'd pay $30/mo" is evidence.
- **Track provenance.** When updating a claim, note where the evidence came from (interview #, experiment result, market report).
- **Don't delete history.** Use strikethrough for invalidated assumptions rather than removing them — the graveyard of bad assumptions is valuable learning.
- **Compound knowledge.** Each forge pass should make the documents more precise, not just longer. Remove fluff, tighten language, increase specificity.
- **Flag regression.** If new data makes the idea weaker, say so clearly. Don't sugarcoat — that defeats the purpose.
