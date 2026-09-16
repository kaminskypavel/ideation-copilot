# Report Style

Design tokens and rendering rules for every HTML surface the copilot generates: the full
status report (`idea:report`) today, and the evaluation, pushback, forge, pricing,
interview, and postmortem outputs in a later pass. One shell, one card grammar, one data
convention, so any harness (Claude, Codex, Pi) that fills these templates produces the
same look without re-deriving it.

Style world: a field instrument, not a slide deck. Warm off-white paper, charcoal ink,
four semantic accents that mean the same thing on every surface. No gradients, no
shadows-as-decoration, no logos, no marketing copy. The report states what the docs say,
it never sells.

## Color tokens

```css
--bg:          #faf7f1;  /* page background, warm off-white */
--surface:     #ffffff;  /* card background */
--surface-sunk:#f3efe6;  /* nested/quiet block (empty states, code) */
--ink:         #2a2723;  /* body text, warm charcoal */
--ink-muted:   #5c574d;  /* secondary text, captions */
--ink-faint:   #8b8477;  /* metadata, axis labels, timestamps */
--rule:        #e6dfd1;  /* hairline borders, gridlines */
--rule-strong: #cfc6b3;  /* borders that must read as an edge */

--teal:        #0d7d76;  /* GOOD: validated, strong evidence, positive movement */
--teal-wash:   #e2f1ef;
--rust:        #c2410c;  /* RISK: assumed, caution, moderate concern */
--rust-wash:   #fdf0e5;
--blue:        #2563a8;  /* NEUTRAL/INFO: structure, loop position, phase chips */
--blue-wash:   #e8f0f8;
--coral:       #d6553a;  /* CRITICAL: deal-breakers, unresolved objections, kill signal */
--coral-wash:  #fbe9e3;
```

## Dark theme

Light is the default; dark is a selected alternative, not an automatic desaturation.
Every report ships both token sets and a small toggle (below), so a viewer who prefers
dark gets it without asking, and can override either way.

```css
/* [data-theme="dark"], and @media (prefers-color-scheme: dark) when no
   data-theme attribute is set (an explicit light stamp always wins). */
--bg:          #211f1b;  /* warm charcoal, not neutral black */
--surface:     #2a2723;
--surface-sunk:#38332c;
--ink:         #f2ede4;  /* warm off-white, not pure white */
--ink-muted:   #c9c2b3;
--ink-faint:   #948c7b;
--rule:        #3d3830;
--rule-strong: #524c40;

--teal:        #4fc0b8;  /* lightened for 3:1+ contrast on the dark surface */
--teal-wash:   #163330;  /* a deep tint, not the light wash darkened */
--rust:        #e8823f;
--rust-wash:   #3a2415;
--blue:        #6badea;
--blue-wash:   #17293c;
--coral:       #ea7e63;
--coral-wash:  #3a2018;
```

Semantic meaning is identical in both themes, only the hex values change. Both sets are
written directly into the template's `<style>` block as fixed values, never computed at
fill time, so every report ships the same two themes without the filling skill inventing
colors.

**The toggle.** A small pill button in the header (`#theme-toggle`) plus one inline
`<script>` (about a dozen lines, the only script in the file): it reads
`localStorage.idea-report-theme` and applies it as `data-theme` on `<html>` if set, and
on click flips `data-theme` between `light` and `dark`, persists the choice, and relabels
the button. No framework, no build step. SVG charts use `fill="var(--x)"` and
`stroke="var(--x)"` throughout, never a literal hex inside a chart, so they retheme for
free when the variables change; a chart that hardcodes a hex is a bug.

Print ignores the theme and always renders light (`@media print { body { background:#fff } }`),
since dark ink on a dark page wastes toner and reads worse on paper.

Semantic meaning is fixed across every surface this plugin renders:

| Accent | Means | Used for |
|---|---|---|
| Teal | Good, validated | Passing scores, "Validated" rows, upward trend segments, Good-or-better grade label |
| Rust | Risk, assumed | Open assumptions, caution notes, Fair grade label, unresolved (not yet critical) claims |
| Blue | Neutral, informational | Loop-position marker, phase chips, section chrome, headers that carry no judgment |
| Coral | Critical, deal-breaker | Deal-breakers, refuted claims, Needs Work/Not Ready grade label, kill criteria hit |

A color with no legend meaning on a given page must not appear; if a chart needs a fifth
category, fold it into "Other" or split into small multiples rather than inventing a
fifth accent (see `references/report-shell.html` for the legend pattern).

## Type scale

System stack only, no webfont: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`.
Numerals that must align (score tables, dates) get `font-variant-numeric: tabular-nums`,
a large standalone number (the combined score) stays proportional.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display (idea name, combined score) | 28px | 700 | 1.15 | -0.01em |
| Headline (section title) | 19px | 700 | 1.25 | -0.005em |
| Title (card heading, table header) | 15px | 650 | 1.3 | normal |
| Body | 15px | 400 | 1.55 | normal |
| Small, caption | 13px | 500 | 1.4 | normal |
| Micro (metadata, axis ticks, legend) | 11.5px | 600 | 1.3 | 0.02em |

No uppercase-tracked eyebrow above headings, a section headline carries its own weight.

## Spacing scale

`4 / 8 / 12 / 20 / 32 / 48` px. Tight inside a group (4-8px between a label and its
value), generous between groups (32-48px between sections). More space above a heading
than below it.

## Shape

- Card radius: **14px**. One radius for every content container (cards, table wrappers,
  chart panels).
- Chip or pill radius: **999px**, reserved for status labels and grade badges, never for
  a content container.
- Border: 1px `--rule` by default, 2px in the semantic color when a card is flagged
  (a deal-breaker card, a critical objection).
- No shadows. Depth comes from the hairline border and the `--surface` / `--surface-sunk`
  tonal step, matching the paper-instrument world: if it would be impossible to print,
  it does not belong here.

## Card grammar

Every section is a card: `--surface` background, 14px radius, 1px `--rule` border,
20px padding, a Title-weight heading, then content. A flagged card (deal-breaker,
critical objection) takes a 2px border in `--coral` and a `--coral-wash` background tint,
the heading takes the accent color, body copy stays `--ink-muted` so it keeps contrast.
Cards stack in a single column inside an 880px-max centered shell, never nest a card
inside a card.

## Shared shell (every surface)

1. `<!doctype html>`, `<html lang="en">`, `<meta charset>` plus `<meta viewport>`,
   `<title>` naming the idea and the output type ("Libby, Status Report, 2026-08-18").
2. One inline `<style>` block declaring the tokens above as CSS custom properties on
   `:root`, the dark-theme token overrides (see "Dark theme" above), then the shell and
   card rules. Keep it tight: only rules the markup below actually uses (roughly 5KB is
   the right order of magnitude). No external stylesheet, no CDN (Tailwind included), no
   webfont `@import` or `@font-face` pointing at a network URL.
3. A machine-readable data block immediately after `<body>` opens, before any visible
   markup: `<script type="application/json" id="idea-data">{ ... }</script>`. This is
   the single source a later skill or tool parses, the visible HTML below it is a
   rendering of the same values, filled from the same placeholders, so the two can never
   drift as long as both are filled from one pass. See "The data block" below for the
   schema.
4. A header: idea name (Display), output type plus date (Small, `--ink-faint`), a grade
   badge for scored surfaces (pill, semantic color by grade band, see Dimension bars
   below) plus the combined score (Display, tabular-nums), and the theme toggle button.
5. Body: one card per section, in the order the owning skill's spec below lists.
6. Footer: generation timestamp, the source folder path, and one line stating this file
   is a render, not the record, the idea folder's markdown (or, post-conversion, the
   most recent HTML of each type) stays the source of truth.
7. One script, the theme toggle (see "Dark theme" above), nothing else. Otherwise zero
   JavaScript. A static file that opens from the filesystem with nothing on the network,
   prints cleanly, and is fully readable at 375px and 1280px widths, in both themes.

`references/report-shell.html` is this skeleton filled with one example card and a
minimal data block, start a new output type's template from it rather than from a blank
file.

## The data block

Same fields the current evaluation frontmatter holds, plus evidence quality and the
loop and next-step fields, so a later tool never re-parses markdown or prose:

```json
{
  "idea": { "name": "", "folder": "", "generated": "YYYY-MM-DD" },
  "stage": "pre-product",
  "combined_score": 0,
  "label": "",
  "loop_position": { "step": "", "evidence": "" },
  "next_step": { "recommend": "", "reason": "" },
  "weakest_dimension": { "agent": "", "dimension": "", "score": 0 },
  "deal_breakers": [],
  "agents": {
    "vc": { "overall": 0, "dimensions": { "team": { "score": 0, "weight": 0, "evidence_quality": 0 } } },
    "market_analyst": { "overall": 0, "dimensions": {} },
    "yc_founder_fit": { "overall": 0, "dimensions": {} }
  },
  "score_trajectory": [ { "date": "YYYY-MM-DD", "combined": 0, "vc": 0, "market_analyst": 0, "yc_founder_fit": 0 } ],
  "assumptions": [ { "id": "", "category": "", "assumption": "", "risk": "", "confidence": null } ],
  "validated": [ { "claim": "", "source": "" } ],
  "assumed": [ { "claim": "", "test": "" } ],
  "objections": [ { "objection": "", "risk_category": "", "severity": "", "deck_fix": "" } ],
  "changelog_tail": [ { "date": "", "doc": "", "change": "" } ]
}
```

`confidence: null` and `evidence_quality: null` are valid and render as the empty-state
mark (below), never as `0`, zero is a real score, null means "not measured." An output
type that doesn't produce a field (pricing has no `agents` block) omits the key entirely
rather than shipping it empty, a consumer checks for presence.

## SVG rules

All charts are static inline `<svg>`, no library, no canvas. Stroke widths and viewBox
are fixed so every chart in every report reads as one system.

### Score trajectory (line chart)

- `viewBox="0 0 640 220"`, one `<g>` per series.
- X axis: one tick per evaluation date, label in Micro type, `--ink-faint`, rotated 0deg
  (short date form, `MMM D`).
- Y axis: 0-100, gridlines at 0/25/50/75/100, hairline `--rule`, solid, never dashed.
- Line: 2px stroke, round join and cap, one color per agent (`--blue` = VC, `--teal` =
  Market, `--rust` = YC Founder-Fit) and a heavier 3px `--ink` line for Combined so it
  reads as the headline series.
- End markers: 8px filled circle, 2px `--bg`-colored ring, at the last point of each
  series only, not every point.
- End-of-line direct label: the series name plus last score, in Small type, the series
  color for the swatch only, `--ink` for the text (text never wears the data color).
- Legend: one row above the chart, swatch plus label per series, always present (two or
  more series). Never a number on every point.
- Empty state (fewer than two evaluations): render the axes and gridlines only, a single
  dot for the one score that exists, and centered Small-type text in `--ink-faint`:
  "Trajectory needs a second evaluation to plot."

### Dimension bars (per agent)

- One `<svg>` row per dimension, `viewBox="0 0 400 28"`.
- Bar: horizontal, max length 260px mapped from score 1-5 (`length = score / 5 * 260`),
  16px thick, 4px rounded end cap, square at the baseline, grows from x=120 (leaving room
  for the dimension label at the left in Title type).
- Bar color: `--teal` for score 4-5, `--rust` for score 2-3, `--coral` for score 1.
  Unfilled track: `--surface-sunk`.
- Evidence quality (0-10) secondary mark: a 3px-tall tick mark drawn on top of the bar at
  `x = 120 + (evidence_quality / 10 * 260)`, colored `--ink` at 60% opacity, a position
  marker, not a second bar, so it never competes with the score's length encoding.
- Value label: score value (for example "4/5") in Small type, `--ink`, right of the bar
  end.
- Legend once per agent block (not per bar): swatch meanings (teal/rust/coral) plus one
  line explaining the tick: "tick marks evidence quality, 0-10."
- Empty state (dimension not scored by this agent): render the label and an outlined
  (dashed 1px `--rule-strong`) empty track, no fill, value cell reads "not scored" in
  `--ink-faint`.

### Assumption confidence heatmap

- One `<table>`-like grid, an actual HTML `<table>` is fine and preferred for
  Operate-grade scanability and copy-paste, the "SVG rule" here governs only the
  confidence cell's fill. Every table (this one and the changelog tail) has a
  `min-width` past what a 375px viewport gives it, so wrap it in
  `<div class="table-wrap">` (`overflow-x:auto`) rather than letting a narrow
  screen clip the last column: a table that scrolls sideways is legible, a
  table that's cut off silently drops data.
- Confidence cell: 0-10 mapped onto a diverging ramp anchored on the report's own
  accents, neutral at the midpoint, matching the dataviz skill's diverging-pair rule
  (two hues plus gray, never a rainbow):
  - 0-2: `--coral` (critical gap, unvalidated)
  - 3-4: `#e8927d` (coral tint)
  - 5-6: `--surface-sunk` fill, `--ink-muted` text (genuinely neutral, no evidence either way)
  - 7-8: `#7fbdb6` (teal tint)
  - 9-10: `--teal` (validated)
- Cell text: the number itself, `--ink` on the 5-6 band, white on 0-4 and 7-10 (pick by
  the fill's luminance so it always clears contrast, never gray-on-tint).
- Risk column uses text plus a small colored dot (Critical/High = `--coral`, Medium =
  `--rust`, Low = `--blue`), never color alone, the word is always present next to the
  dot.
- Empty state (confidence not recorded for a row, common pre-conversion since older
  `03-assumptions.md` files used Evidence For/Against instead of a Confidence column):
  render the cell as a dash "-" on `--surface-sunk`, never a guessed number. A footer
  note states how many rows lack a recorded confidence.

### Legend rule (applies to every chart)

Every accent used on a chart appears in that chart's legend with its meaning in words,
not just a swatch. A color with no legend entry is decoration and must be removed.

## Empty states, general

Any section with no source data (no `pricing-*.md`, no `forge-*.md`, zero pushback
sessions) still renders its card: heading present, body reads one sentence in
`--ink-faint` naming what's missing and which command produces it ("No pricing session
yet. Run `idea:pricing` once a demand signal exists."), never a blank card and never
invented content.

## Print

`@page { margin: 16mm }`. No fixed-height containers that clip content on paper, cards
flow and may break across pages. Verify no card's border or background is cut mid-page
by testing print preview before calling a template done.

## Section specs by output type

Every type shares the shell (tokens, header, footer, data-block-first, card grammar)
above. This section is the only per-type variation: which cards, in which order, filled
from which source doc. `idea:report` (full status report) is built now, the rest convert
in a follow-up pass and should read their card list from here rather than re-deriving one.

| Output type | Source docs | Cards, in order |
|---|---|---|
| Status report (`idea:report`) | 00-05, all `evaluation-*.md`, `03-assumptions.md`, `pushback-session-*.md`, `forge-*.md`, `pricing-*.md` | Header, Loop position, Score trajectory, Dimension bars (per agent), Assumption heatmap, Validated vs Assumed, Investor objections, Deal-breakers, Changelog tail |
| Evaluation (`idea:evaluate`) | this evaluation's scoring pass | Header (stage plus grade badge), Summary table (per agent score plus deal-breakers), Dimension bars (per agent), Weakest dimension callout, Assumptions cross-reference gaps |
| Pushback scorecard (`idea:pushback`) | claims worked in this session | Header, Idea summary, Claims table (lens / claim / status / confidence, status as a colored chip: Verified is teal, Unresolved is rust, Refuted is coral), Evolution log, Assumption chains (one flagged card per chain that changed a confidence score) |
| Forge (`idea:forge`) | all evaluations, pushback sessions, predictions | Header, Idea in one paragraph, Score trajectory, Validated vs Still Risky, Key pivots (timeline list), Pitch-ready summary (12-slide order, missing slides flagged), Investor objections, Verdict |
| Pricing (`idea:pricing`) | this pricing session | Header, Value metric, Willingness-to-pay (fair/expensive/prohibitive as a 3-point scale bar), Packaging tiers (table), B2B check, Recommendation |
| Interview guide (`idea:interview`, guide phase) | target assumption, `03-assumptions.md` | Header, Target segment, Opening and closing script, Core questions (numbered cards), Success criteria, Recruiting plan |
| Interview synthesis (`idea:interview`, synthesis phase) | interview notes | Header, Per-interview signal (table), Pattern across interviews, Assumption verdict (before and after confidence, heatmap cell each) |
| Postmortem (`idea:postmortem`) | full history | Header (flagged coral, this is a kill record), What we believed vs What was true (two-column), Why it died, Assumption autopsy (Wrong, Right-but-insufficient, Never-tested, each a card), Score trajectory, Top 3 lessons, Next time |

No em dashes anywhere in a filled template or in this file. Use a comma, a colon,
parentheses, or two sentences instead.
