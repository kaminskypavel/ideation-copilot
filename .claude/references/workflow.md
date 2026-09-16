# Workflow

The recommended loop for one idea, and the rule every skill uses to pick the next step. Skills read this file before printing "What's next?" so the copilot always points at the step the idea folder actually needs, not a fixed menu.

## The Loop

```
idea:new
   |
   v
idea:evaluate  (baseline score, expect Fair or below)
   |
   v
idea:interview  -->  talk to 7-14 people  -->  idea:update
   |                                               |
   v                                               v
idea:pushback  (challenge the weakest dimension)  idea:evaluate  (re-score)
   |
   +---> repeat interview / update / pushback / evaluate until Good or better
   |
   v
idea:pricing  (once demand signal is real)
   |
   v
idea:forge  (pitch-ready synthesis)        idea:postmortem  (if the evidence says stop)
```

## Best-Practice Rules

1. **Baseline first, then evidence.** Score once on day one. A low first score is not a verdict; it tells you which dimension to test first.
2. **Interview before you argue.** Run `idea:interview` before the first `idea:pushback`. Pushback without customer quotes is opinion against opinion.
3. **Update the same day.** Every real-world input (interview, experiment, pricing test, team change) goes through `idea:update` before anything else runs. Stale docs produce stale scores.
4. **Re-score only after the docs changed.** Running `idea:evaluate` twice on the same docs measures noise.
5. **One assumption per cycle.** Each interview guide and each experiment targets one row of `03-assumptions.md`. Confidence (0-10) on that row is the progress bar.
6. **Price before you forge.** The Business Model dimension cannot score above 3 without a value metric and a willingness-to-pay signal.
7. **Write kill criteria before you need them.** `05-experiments.md` carries the pass and kill thresholds. When a kill threshold is hit, run `idea:postmortem`, not another round of updates.
8. **Forge before you show anyone, then report.** Advisors and investors get the `idea:report` HTML render, built from `idea:forge`'s synthesis, never the raw folder.

## Idea Folder State

Determine state from the idea folder before choosing a next step:

| Signal | Where to look |
|---|---|
| Latest score, grade label, weakest dimension, stage, deal-breakers | newest `evaluation-*.md` frontmatter |
| Riskiest assumption and its Confidence (0-10) | `03-assumptions.md`, "The Riskiest Assumption" section |
| Interviews done | `interview-synthesis-*.md` files (count) |
| Unresolved or refuted claims | newest `pushback-session-*.md` scorecard |
| Docs changed since last score | changelog dates in `00`-`05` docs vs newest `evaluation-*.md` date |
| Pricing hypothesis exists | `pricing-*.md` |
| Kill criteria hit | `05-experiments.md` results vs kill thresholds |
| Forge exists | `forge-*.md` |
| Report exists and is current | `report-*.html`, compare its date to the newest `forge-*.md` |

## Next Step Table

First matching row is the primary recommendation. Print it plus the next one or two matches, in the standard "What's next?" format. If the folder state cannot be read, fall back to the skill's default list.

| # | Condition | Recommend |
|---|---|---|
| 1 | No `03-assumptions.md` | `idea:new` |
| 2 | No `evaluation-*.md` yet | `idea:evaluate` (baseline) |
| 3 | Kill criteria in `05-experiments.md` hit, or two consecutive scores dropped with no new evidence | `idea:postmortem` (decide kill or pivot) |
| 4 | Riskiest assumption Confidence <= 3 and no `interview-synthesis-*.md` covering it | `idea:interview` |
| 5 | New evidence (interview synthesis, experiment result, pricing test) dated after the newest changelog entry in the docs | `idea:update` |
| 6 | Newest evaluation has a deal-breaker, or label is Needs Work or Not Ready, and no pushback since that evaluation | `idea:pushback` on the weakest dimension |
| 7 | Docs changed since the newest evaluation | `idea:evaluate` (re-score) |
| 8 | Label Good or better, riskiest assumption Confidence >= 6, no `pricing-*.md` | `idea:pricing` |
| 9 | Two or more evaluations, label Good or better, no `forge-*.md` newer than the latest evaluation | `idea:forge` |
| 10 | `forge-*.md` exists and no `report-*.html` newer than it | `idea:report` |
| 11 | Everything above satisfied | `idea:forge` to refresh, then `idea:report` to re-render it, then share it |

## Output Format

```
What's next?

→ /idea:<skill> {idea-name}   : <one line: why this, grounded in the folder state>
→ /idea:<skill> {idea-name}   : <...>
```

Name the evidence behind the recommendation, for example "Confidence on D2 is 2/10 and no interviews yet" rather than "consider interviewing customers".
