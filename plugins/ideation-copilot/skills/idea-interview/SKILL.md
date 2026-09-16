---
name: idea-interview
description: Generate a targeted customer interview guide for an idea's riskiest assumption, and capture what came back afterward. Use when the user wants to prepare for customer interviews, design interview questions, or write up what they heard from customers.
argument-hint: "[idea-folder-name]"
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit
---

# Interview Guide

Founders are told to "talk to customers" without help designing the conversation or reading the results. This skill picks the riskiest untested assumption, builds a short interview guide aimed at it, and (after the interviews happen) writes up what was actually said so `idea:update` can act on it.

## Protocol

Follow these phases in order.

### Phase 1: Load and Pick the Target Assumption

Read `<argument>` to identify the idea folder. Search for it under `ideas/`.

```
ideas/*{argument}*/
```

Read `03-assumptions.md` and `00-overview.md`. If `03-assumptions.md` doesn't exist, tell the user to run `/idea:new` first.

Pick the interview target:
- Prefer a Desirability assumption (will people want this?) with a low Confidence (0-10) score and a high Risk Level, since interviews are best at testing desirability, not feasibility.
- If several are tied, use "The Riskiest Assumption" section as the tiebreaker.
- Confirm the pick with the user before writing the guide: "I'd target [assumption] since it's untested and would sink the idea if wrong. Sound right, or is there a different one to focus on?"

### Phase 2: Design the Interview

Write 5-7 core questions, each as a four-part unit:

- **Question:** what you actually ask.
- **Rationale:** what this question is trying to learn, tied back to the target assumption.
- **Follow-up:** the natural next question if the answer is vague.
- **Avoid:** the leading or biased version of this question, so it's clear what not to ask.

Cover three stretches of the conversation:
- **Opening:** build rapport, confirm you're talking to the right person, get them talking about their current process before you mention your idea at all.
- **Core:** the 5-7 question units above, aimed at the target assumption.
- **Closing:** a wrap-up question and a specific ask (a follow-up call, a fake-door link, an invoice, whatever the next experiment in `05-experiments.md` calls for).

**Bias check.** Before finalizing, scan every question for these common failure modes and rewrite any that fire:

| Bad (leading) | Good (neutral) |
|---|---|
| "Would you like a tool that does X?" | "Walk me through the last time you had to deal with X." |
| "Don't you think Y is a problem?" | "What's frustrating about how you currently handle Y?" |
| "How much would you pay for Z?" (asked cold) | "What are you using today, and what does that cost you, in money or time?" |

### Phase 3: Recruiting Plan

- **Sample size:** aim for 7-14 interviews (the Nielsen number). Fewer than 7 is too little to see a pattern; more than 14 usually just repeats what you already know.
- **Stopping rule:** stop once you can predict 70-80% of what the next person will say.
- **Outreach math:** cold interview requests convert at a low rate. Plan to contact roughly 3x the number of interviews you actually need, and adjust the multiplier up if this founder's early outreach converts worse than that.
- **Recruiting source:** pull from the target customer description in `00-overview.md`. Note where these people actually are (a specific forum, a specific job title on LinkedIn, an existing waitlist) rather than "anyone who might be interested."

### Phase 4: Write the Guide

Write `interview-guide-YYYYMMDD.md` to the idea folder:

```markdown
# Interview Guide: <idea name>
Date: <date>
Assumption under test: <assumption from 03-assumptions.md, with its ID>

## Target Segment
<who to recruit, and where to find them>

## Opening Script
<rapport-building, confirm fit, get them describing their current process>

## Core Questions
### Q1: <question>
- Rationale:
- Follow-up:
- Avoid:

### Q2: <question>
...

## Closing Script
<wrap-up plus a specific ask: follow-up call, fake-door link, invoice, etc.>

## Success Criteria
- [ ] Recruited 7-14 people matching the target segment
- [ ] Asked every core question without leading
- [ ] Got at least one concrete, dated example per interview, not just opinions
- [ ] Closed with a specific ask, not just "thanks for your time"

## Recruiting Plan
**Target interviews:** 7-14
**Outreach target:** <3x the target interview count>
**Source:** <where these people are>
```

### Phase 5: Synthesize Results

When the user comes back with interview notes or transcripts, help them turn raw quotes into signal instead of vibes:

- **Pull the actual quotes**, not paraphrases. A paraphrase erases the signal.
- **Classify each quote:**
  - *Strong pull* (treat as a real yes): they describe the problem back to you in their own words, unprompted, or they show a visible emotional reaction (frustration with the current way, excitement about the idea).
  - *Weak or polite* (treat as a no): "that sounds interesting," "I know someone who has this problem," vague enthusiasm with no specifics.
  - *Demonstrated behavior* (the strongest signal): they ask to meet again, ask for the deck, or ask when they can start using it.
- **Push past the surface layer.** If an answer is a generality like "it was good" or "customers love it," ask for one specific, dated instance before accepting it as evidence.

Write `interview-synthesis-YYYYMMDD.md` to the idea folder:

```markdown
# Interview Synthesis: <idea name>
Date: <date>
Guide used: interview-guide-YYYYMMDD.md
Interviews completed: <count>

## Per-Interview Signal
| # | Key quote | Signal | Notes |
|---|-----------|--------|-------|
| 1 | | Strong pull / Weak-polite / Demonstrated behavior | |

## Pattern Across Interviews
<what showed up more than once>

## Assumption Verdict
**Assumption:** <the one from Phase 1>
**Verdict:** Validated / Invalidated / Partially validated / Still unresolved
**New Confidence (0-10):** <score, using the scale from 03-assumptions.md>
**Why:** <grounded in the signal classification above, not interview count alone>
```

### Phase 6: Changelog and Handoff

Append a changelog entry to `03-assumptions.md` under `## Changelog`, using the format from `references/evaluation-framework.md`:

```markdown
### Interview: {YYYY-MM-DD} (manual)
**Trigger:** {Interview guide generated / Interview results synthesized} via idea:interview
**Changes:**
- {e.g., generated guide targeting assumption D2}
- {e.g., updated D2 confidence from 2 to 6 based on 9 interviews}
**Source:** interview-guide-YYYYMMDD.md or interview-synthesis-YYYYMMDD.md
**Confidence delta:** {stronger / weaker / unchanged}, one sentence why
```

Then output:

Before printing, read `references/workflow.md`, determine the idea folder state, and apply the Next Step table. Print the top 2-3 matching steps with the evidence behind each. The list below is the default if folder state cannot be read.

```
Interview guide written to ideas/{idea-name}/interview-guide-YYYYMMDD.md

What's next?

→ /idea:update {idea-name}     : bring the synthesized results into your idea docs once interviews are done
→ /idea:pushback {idea-name}   : stress-test whether the signal you found actually clears the bar
→ /idea:evaluate {idea-name}   : re-score now that the assumption has real evidence behind it
```

## Principles

- **One assumption at a time.** A guide that tries to test everything tests nothing well.
- **Specificity beats scale.** Nine sharp interviews that surface a consistent pattern beat thirty generic ones.
- **Demonstrated behavior beats stated opinion.** What someone asks for next is worth more than what they say they'd do.
- **Don't let the founder grade their own homework.** If the synthesis reads like a win but the signal table is full of weak-polite responses, say so plainly.
