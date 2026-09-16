---
name: idea-report
description: Render a single-file HTML status report for an idea, with inline SVG score trajectory, dimension bars, and an assumption confidence heatmap. Use when the user wants a shareable snapshot of where an idea stands, to view in a browser or hand to someone else.
argument-hint: "[idea-folder-name]"
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Bash(open *)
---

# Report Idea

Render everything accumulated about an idea into one self-contained HTML file: a
status report readable in a browser or printed, with inline SVG charts and no
external dependencies. This is a render, not a record; it never edits idea docs
and never gets its own changelog entry.

## Protocol

### Phase 1: Load

1. Parse `<argument>` for the idea folder name.
2. Search for the idea folder:

```
ideas/*{idea-folder-name}*/
```

3. Read `00-overview.md` through `05-experiments.md`.
4. Read every `evaluation-*.md`, sorted by date; parse the YAML frontmatter of
   each for the score trajectory, and take the newest for current scores,
   stage, deal-breakers, and weakest dimension.
5. Read `03-assumptions.md` for the assumption table(s), risk levels, and
   confidence scores where present (older files may only have Evidence
   For/Against; treat missing confidence as `null`, never invent a number).
6. Read the newest `pushback-session-*.md` (claims, statuses) and the newest
   `forge-*.md` (investor objections, validated/assumed synthesis) if they
   exist. Prefer forge's synthesis when both exist and forge is newer.
7. Read the newest `pricing-*.md` and `interview-synthesis-*.md` if they exist,
   for context only; they don't get dedicated cards unless the folder has no
   forge output to draw validated/assumed from.

### Phase 2: Compute loop position and next step

Read `references/workflow.md`. Determine the idea folder's current state
against its Idea Folder State table, then apply the Next Step table to get
the primary recommendation and its evidence. This is both the "Current step"
shown in the Loop position card and the `next_step` field in the data block.

### Phase 3: Fill the template

Read `references/report-template.html` and `references/report-style.md`.
Fill every `{{placeholder}}`, following report-style.md's SVG rules exactly
(bar length formula, trajectory viewBox and axis mapping, heatmap color ramp).
For each `<!-- REPEAT:name --> ... <!-- END REPEAT:name -->` block, duplicate
it once per real item (one row per dimension, one row per assumption, one
node per loop step, and so on); delete the example and render the section's
empty-state sentence when that source doc doesn't exist for this idea.

Fill the `<script type="application/json" id="idea-data">` block with the
same values as the visible HTML, not a re-derivation of them; both come from
one pass over the same source data so they cannot drift.

Never invent a score, date, quote, or confidence number. A value the docs
don't support is "not recorded" in the visible text and `null` in the data
block.

### Phase 4: Write the file

Write to the idea folder as `report-YYYYMMDD.html` (today's date), overwriting
a same-day report if one exists. Do not touch any `00`-`05` doc, any
`evaluation-*.md`, or any other generated file; this command only writes the
report.

### Phase 5: Present

```
Report written to ideas/{idea-name}/report-YYYYMMDD.html
```

Then offer to open it: run `open ideas/{idea-name}/report-YYYYMMDD.html` on
macOS (`Bash(open *)` is the only shell command this skill is allowed to run);
on any other platform, just print the path and let the user open it.

## Graceful Degradation

- **No `evaluation-*.md` yet:** render the header with an empty score
  (`--`) and skip the trajectory and dimension-bar cards' example rows in
  favor of their empty-state sentences; still render Loop position, since
  workflow.md's Next Step table handles a folder with no evaluation.
- **No `03-assumptions.md`:** empty-state the heatmap card.
- **No forge and no pushback session:** empty-state Validated vs. assumed and
  Investor objections, and say which command produces each.
- **Only one evaluation:** the trajectory chart uses its documented single-point
  empty state, not a fabricated second point.

## What's next?

Before printing, read `references/workflow.md`, determine the idea folder
state, and apply the Next Step table. Print the top 2-3 matching steps with
the evidence behind each. The list below is the default if folder state
cannot be read.

```
What's next?

-> /idea:update {idea-name}     : if the report shows docs older than the newest evaluation
-> /idea:pushback {idea-name}   : if the report shows a deal-breaker with no pushback since
-> /idea:forge {idea-name}      : if the report has no forge output yet to draw objections from
```
