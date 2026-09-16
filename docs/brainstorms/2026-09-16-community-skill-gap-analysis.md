---
date: 2026-09-16
topic: community-skill-gap-analysis
---

# Community Skill Gap Analysis: What to Port Into ideation-copilot

## Scope and method

This document compares the seven skills, three evaluation agents, and two reference files in `plugins/ideation-copilot/` against eleven community skills from the skills.sh ecosystem. Every candidate repo was cloned at depth 1 into a temp directory and read in full (SKILL.md plus any `references/`, `examples/`, and sibling command files). Paths cited below are relative to each cloned repo root. Quoted passages are verbatim except that em dashes in the sources have been normalized to colons or commas.

Two candidates did not exist under the requested name and were mapped to the closest real skill in the same repo. `refoundai/lenny-skills@competitive-analysis` does not exist; the repo ships `competitive-strategy`, which covers the same ground. `refoundai/lenny-skills@startup-ideation` is not on the default branch; it exists only in the `v1.0.0` tag and was retired in the v2.0.0 rewrite. The tagged version was read (it is a 58-line prompt skill with two sourced insights and no template), and `idea-validation` from the current branch is treated as its replacement because it absorbed the same ground with far more content (the requested `evaluating-startup-ideas` sibling was also read and is treated separately). Everything else resolved exactly.

A note on licenses before anything gets copied: ten of the eleven sources are MIT. The one exception is `deanpeters/product-manager-skills`, which is CC BY-NC-SA 4.0. That license restricts commercial use and requires ShareAlike on derivatives, so the techniques from that skill should be re-expressed in our own words rather than pasted, and the attribution question should be settled before a release that touches it.

The short version of what we found: our plugin's structural discipline (a fixed per-dimension output block, named reasoning tools, machine-readable YAML frontmatter, score trajectories across sessions) is stronger than any single community skill. None of them have anything like `references/evaluation-framework.md`. What they have that we lack is domain content: worked formulas, question banks, numeric guardrails, named frameworks with precedent examples, and output artifacts for stages we do not cover (pricing, GTM, pitch review, interview prep, competitive deep-dives). The improvements below are almost all "add content into an existing slot," not "restructure."

---

## A. One paragraph per candidate

### 1. wshobson/agents@market-sizing-analysis (MIT)

Path: `plugins/startup-business-analyst/skills/market-sizing-analysis/`. A three-tier TAM/SAM/SOM skill with three named methodologies (top-down, bottom-up, value theory), a six-step calculation process, industry-specific formula variants (SaaS, marketplace, consumer, B2B services), a priced directory of about thirty real data sources, and one fully worked example (`examples/saas-market-sizing.md`) that computes the same market both ways, triangulates, and validates against public comps (Klaviyo, Mailchimp). Frontmatter is minimal (`name`, `description`, `version`). The SKILL.md is deliberately short and defers to `references/details.md` "when the navigation tier above is insufficient," a lazy-loading pattern worth copying for our own bulky reference files. Output is a narrative walkthrough rather than a fixed template. What it does notably better than our `market-analyst.md`: it actually has formulas, a numeric tolerance for triangulation (top-down and bottom-up "should be within 30%"), and a "Common Mistakes" list with numeric guardrails ("New entrants rarely capture > 5% in 5 years"). What it lacks: any scoring, any reasoning tools, any adversarial pass.

### 2. claude-office-skills/skills@competitive-analysis (MIT)

Path: `competitive-analysis/SKILL.md` (single file, no references). A general-purpose competitive-intelligence skill that produces one long markdown report: executive summary, market overview, per-competitor profiles, feature comparison matrix with a symbol legend, pricing comparison, ASCII 2x2 positioning map, SWOT, bidirectional advantage lists ("Your Advantages Over Competitors" and "Areas Where Competitors Excel"), strategic recommendations, and per-competitor sales battle cards with objection-handling pairs. Frontmatter is the richest of the set (`version`, `author`, `license`, `category`, `tags`, `department`, `models`, `mcp`, `capabilities`, `related_skills`), though the `mcp` wiring to office-mcp is not portable. It states its limits explicitly up front ("What I cannot do: Access competitor internal data..."). Notably better than our VC and market-analyst competition dimensions: it names Porter's Four Corners as a response-prediction model and ships a battlecard format. Weaker: every table is an empty skeleton with no worked example, no scoring, no reasoning tools.

### 3. refoundai/lenny-skills@competitive-strategy (MIT, substituted for competitive-analysis)

Path: `skills/competitive-strategy/`. A principles-and-frameworks skill distilled from 24 Lenny's Podcast guests. Frontmatter is just `name` and `description`. SKILL.md has a fixed section pattern shared across the whole repo: How to Help (4 steps), Core Principles (each a guest quote plus a one-paragraph interpretation), Templates & Frameworks (index), Questions to Help Users, Common Mistakes to Flag, Deep Dive pointer, Related Skills. `references/artifacts.md` carries 40 named frameworks, checklists, and case studies. There is no output template; it is a coaching skill. What it does notably better than us: it has a real moat taxonomy (Helmer's 7 Powers, Rumelt's 10 sources of asymmetry, a 7-item defensibility checklist), a "True Switching Cost" model with a buyer/user vulnerability matrix, and the "Can't vs Won't" replication test. Our `vc.md` Competition/Moat cell asks "what's the real competitive advantage" without giving the evaluator a vocabulary to answer with.

### 4. refoundai/lenny-skills@idea-validation (MIT, substituted for startup-ideation)

The retired `startup-ideation` (tag `v1.0.0`, `skills/startup-ideation/SKILL.md`) contributes only three prompts worth keeping: a standing "Why Now" gate ("Help them identify what has changed that makes this idea newly possible"), an information-diet check ("If everyone reads the same articles and follows the same people, everyone will have the same ideas"), and the question "What do you know or have access to that most people don't?" Its tarpit warning is a one-liner that `evaluating-startup-ideas` expands into a four-criteria checklist. The rest of this paragraph covers its replacement.

Path: `skills/idea-validation/`. Same structure as the above. Focused on de-risking before building: four B2B validation paths (Do-It-Manually, Listening, Prototype, Just Launch) with founder examples and design-partner counts, a synthesized 30-interview validation process, the "Four Signs Your B2B Idea Has Real Pull" checklist, the Founding Hypothesis Scorecard (7 checkbox questions), the Pre-Product Invoice Test, and Itamar Gilad's Confidence Meter (a 0-10 evidence-quality scale). What it does notably better than our `05-experiments.md` template and `03-assumptions.md`: it gives an evidence-quality ladder and concrete pull signals to test against, whereas ours asks for "Evidence For / Evidence Against" with no grading of the evidence itself.

### 5. refoundai/lenny-skills@evaluating-startup-ideas (MIT)

Path: `skills/evaluating-startup-ideas/`. Same structure. The densest of the Lenny skills: 107 artifacts in `references/artifacts.md`. It has Delta-4 (rate the incumbent 1-10, rate yours, need a gap of 4+), Hunter Walk's LUV test, Lenny's priority-ordered seven angel criteria, the venture-scale checklist ($5B+ TAM, path to $100M/yr), the Five Sources of "Why Now" taxonomy, a time-horizon strength model for timing, Dalton Caldwell's tarpit-idea criteria, the 60% gross margin stress test, the Earned Secret team test, and the love-it/hate-it bifurcation signal. It also has paired case lists: companies that succeeded without a why-now, companies that failed despite one, companies whose why-now emerged later. What it does notably better than our YC agent and VC agent: nearly every one of our dimension prompts has a sharper, quantified test here that could replace the prose.

### 6. deanpeters/product-manager-skills@discovery-interview-prep (CC BY-NC-SA 4.0)

Path: `skills/discovery-interview-prep/SKILL.md` (plus a hard dependency on `skills/workshop-facilitation/SKILL.md` for interaction mechanics). An interactive skill: up to four adaptive questions (research goal, target segment, constraints, methodology), then a full interview plan. Frontmatter is unusually rich (`intent`, `type: interactive`, `theme`, `best_for`, `scenarios`, `estimated_time`). The output is a markdown "Discovery Interview Plan" with an opening/core/closing script, a biases-to-avoid list with bad-to-good rewrites, a checkmark success-criteria block, and a recruiting math estimate. Every core question is written as a quadruple: Question, Rationale, Follow-up, Avoid. What it does notably better than us: we have no interview skill at all, and our `01-brainstorm.md` table ("Who has this problem?") is the only thing in the plugin that gestures at customer discovery. Its dependency skill also defines a three-mode entry protocol (Guided / Context dump / Best guess with labeled assumptions) that is a better interaction pattern than our "ask the user or infer from context" instruction in `idea-update`.

### 7. refoundai/lenny-skills@pricing-strategy (MIT)

Path: `skills/pricing-strategy/`. Same structure, 112 artifacts. Covers value-metric identification (six steps plus the per-seat litmus test), the four quantitative WTP methods with pros, cons, and when-to-use (Van Westendorp, BDM, Multiple Price List, Discrete Choice), Madhavan Ramanujam's fair/expensive/prohibitive three-question technique, a four-tier monetization prioritization (foundational, core, optimizations, growth accelerators), the trial-vs-freemium decision rules, ten data-backed optimization rules, the seven-question utility-metric selection framework, and the price-doubling strategy with a worked Sprig example ($100 to $12,000/mo). What it does notably better than us: everything. Our `02-lean-canvas.md` has a one-line "Pricing strategy" prompt and blank CAC/LTV fields. This is the largest single content gap in the plugin.

### 8. phuryn/pm-skills@business-model (MIT)

Path: `pm-product-strategy/skills/business-model/SKILL.md` plus the wrapper `pm-product-strategy/commands/business-model.md`. A single-shot Business Model Canvas generator. Thin frontmatter (`name`, `description`, plus a `Triggers` field). It walks the nine BMC blocks with sub-questions, then includes a "Domain Context" section comparing BMC against Lean Canvas and the author's Startup Canvas, and a critique of what BMC misses (no vision, no Can't/Won't test, no trade-offs, no key metrics). Step 9 of its output process is a bare viability gate: "Test economic viability (LTV > 3x CAC)." The command wrapper adds a "Strategy Coherence Check" pass. What it does notably better than our lean canvas template: it names segment archetypes and revenue mechanisms per block and forces a cross-block coherence pass. It does not solve our missing CAC/LTV methodology; it only names the ratio.

### 9. ognjengt/founder-skills@go-to-market-plan (MIT)

Path: `skills/go-to-market-plan/SKILL.md` (single 445-line file). An interactive GTM generator: reads a `FOUNDER_CONTEXT.md` if present, otherwise asks up to ten diagnostic questions, then outputs exactly three ranked strategies, each with Strategy, Exact Playbook, First Action (do in 30-60 minutes), Metrics, and Milestones, followed by an Execution Priority section explaining the sequencing. Frontmatter is `name` and `description` only. It has a channel-by-business-model lookup table, a "bowling pin" segment-sequencing prompt, a BAD/GOOD specificity rubric with worked rewrites, a compounding-order rationale, and a ~25-item self-verification checklist. What it does notably better than our `04-pmf-strategy.md` GTM section: it forces channel choice by model and stage and demands a first action. Weaker: no CAC/payback math, no research step, no reasoning tools.

### 10. onewave-ai/claude-skills@pitch-deck-reviewer (MIT)

Path: `pitch-deck-reviewer/` (repo root, not under `skills/`) with three reference files. A VC-grade deck reviewer: ingests a deck, scores eight weighted dimensions 1-10 (Narrative Flow 15%, Problem/Solution 15%, Market Sizing 12%, Competitive Positioning 10%, Financials 12%, Team 12%, Ask 12%, Traction 12%), writes slide-by-slide feedback, predicts at least five investor objections mapped to eight risk categories, benchmarks against ten named canonical decks, ranks the top five improvements, and writes `pitch-review.md`. Frontmatter declares `tools` (including WebSearch and WebFetch) and `model: inherit`. It has explicit stage calibration ("weight pre-product decks toward problem/solution clarity, team, and market") and a fact-check mandate ("Verify any market-size, revenue, or growth claim with WebSearch before accepting it"). What it does notably better than our `idea-forge` Pitch-Ready Summary: it has a canonical 12-slide order, a unit-economics checklist with thresholds (LTV:CAC above 3:1, payback months), an objection template with a "Deck Fix" field, and named precedent decks. Its per-dimension rubric is thinner than ours.

### 11. refoundai/lenny-skills@customer-interviews (MIT)

Path: `skills/customer-interviews/`. Same structure, 32 artifacts. The Story-Based Interview Technique (Teresa Torres), the Nielsen number (7-14 interviews), the Gusto emotional-reaction test (cursing unprompted means yes; "yeah that's cool, I may buy it" means no), Bob Moesta's Layers of Language (pablum, fantasy/nightmare, truth), Todd Jackson's Dollar-Driven Discovery in three phases, the Four Signals of Pain and Pull, Jen Abel's problem-priority sequence ("Are you measuring or managing this problem today?"), Uri Levine's funnel-of-failed-users technique, and Rick Song's friend-zone questions ("If we went away, how painful would that be?"). What it does notably better than us: it gives a signal-detection vocabulary for interpreting interview output, which matters for `idea-update` (which currently says "12/15 interviewees said they'd pay $30/mo is evidence" without helping the user judge whether that was polite validation).

---

## B. Ranked improvements per file

Effort key: S = under an hour, mostly pasting a table or list into an existing section. M = a few hours, requires adapting content to our format and testing. L = a day or more, new file or new agent.

### skills/idea-new/SKILL.md and templates.md

1. **Add a Founding Hypothesis line to `00-overview.md`.** Source: lenny-skills@idea-validation. Technique: the Foundation Sprint's one-sentence hypothesis form, illustrated in `skills/evaluating-startup-ideas/references/artifacts.md`: "If we help people with overflowing inboxes solve their email management problems with a web-based email client, they will choose it over Outlook, Hotmail, and Yahoo because our solution offers more storage and great search." Where: new section between "The Insight" and "The Solution" in the `00-overview.md` template, with the fill-in form "If we help [customer] solve [problem] with [approach], they will choose it over [competitors] because [differentiator]." Effort: S.

2. **Replace the Evidence For / Evidence Against columns in `03-assumptions.md` with an evidence-quality score.** Source: lenny-skills@idea-validation. Technique: Itamar Gilad's Confidence Meter, `skills/idea-validation/references/artifacts.md`: "0-1 (Blue): Opinions, pitch decks, themes. 1-3: Colleague reviews, estimates. 3-5: Anecdotal data, surveys. 5-10 (Red): Fake door tests, alphas, betas, AB experiments." Where: add a "Confidence (0-10)" column to each assumptions table and put the scale in a short legend above the tables. This also gives `idea-update` a concrete rule for when to "upgrade confidence." Effort: S.

3. **Add Delta-4 to `01-brainstorm.md` under "Why do current solutions fail?"** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "Your solution needs to be +4 better (delta of at least 4) for anyone to care about your product. If the existing solution gets a 6 or higher, it will be very hard to replace (e.g., Excel)." Where: two fields after the "How are they solving it today?" table: "Rate the incumbent 1-10: __. Rate yours 1-10: __. Delta: __ (need 4+)." Effort: S.

4. **Add a "Why Now" taxonomy to `01-brainstorm.md` Market Signals.** Source: lenny-skills@evaluating-startup-ideas. Technique: the six-item checklist in `skills/evaluating-startup-ideas/references/artifacts.md`: "Has there been an inflection in technology / an inflection in adoption of a technology / a change in regulation / a change in a long-held belief / A new distribution channel has opened up / Costs have fallen or price points risen dramatically." Where: replace the single "Relevant trends supporting this idea" bullet with this checklist. Effort: S.

5. **Add the Four Pull Signals to `05-experiments.md` as the default success-criteria vocabulary.** Source: lenny-skills@idea-validation. Technique: `skills/idea-validation/references/artifacts.md`: "1. People pay you money... ideally people you don't have a direct connection to. 2. Continued usage... even when it's hacky and bad. 3. Strong emotion... hatred for the incumbents (pain) or a deep, strong emotional reaction to your idea (pull). 4. Cold inbound interest." Where: a short block above the Experiment Backlog titled "What counts as a pass," so every experiment's "Success criteria" field can reference one of the four. Effort: S.

6. **Expand the Revenue Model section of `02-lean-canvas.md` with a value-metric prompt and a WTP question.** Source: lenny-skills@pricing-strategy. Technique: the per-seat litmus test from `skills/pricing-strategy/references/artifacts.md`: "If a user logs into a colleague's account, can they do all their work? If YES... Seats is NOT the right value metric." And the three-question WTP probe: "What is a fair price you would pay for this? What would be an expensive price? What would be a prohibitively expensive price? The 'expensive' price is your target price point." Where: under "Pricing strategy," add "Value metric (what you charge for): __" with the litmus test as a comment, and "Order of magnitude ($10 / $100 / $1K / $10K product): __" per the "Magnitude Over Precision" principle in `skills/pricing-strategy/SKILL.md`. Effort: S. (The full pricing skill is a separate item in Section D.)

7. **Add revenue-model and segment-type taxonomies to the Lean Canvas cells.** Source: phuryn/pm-skills@business-model. Technique: `pm-product-strategy/skills/business-model/SKILL.md`, Revenue Streams block: revenue types "Per customer, per transaction, subscription, licensing, rents" and "Pricing mechanisms (fixed, dynamic, value-based)"; Customer Segments block: "Mass market, niche market, segmented, multi-sided platform." Where: as HTML comments inside the Revenue Streams and Customer Segments cells of the canvas table. Effort: S.

8. **Add a channel-by-business-model lookup to `04-pmf-strategy.md` Go-to-Market.** Source: ognjengt/founder-skills@go-to-market-plan. Technique: `skills/go-to-market-plan/SKILL.md` lines ~154-157: "B2B SaaS: Prioritize outbound, content, product-led growth, partnerships, vertical events. B2C apps: Prioritize app store optimization, influencer marketing, viral loops, paid social. Marketplace: Prioritize supply-side first (harder to acquire), demand follows. Developer tools: Prioritize open source, technical content, developer communities, product-led growth." Where: as a comment above the Channel hypotheses table, plus a "Bowling pin: which segment unlocks adjacent segments?" line under Launch strategy. Effort: S.

9. **Add a BAD/GOOD specificity example to the Launch strategy prompt.** Source: ognjengt/founder-skills@go-to-market-plan. Technique: `skills/go-to-market-plan/SKILL.md` lines ~140-141: "BAD: 'Use content marketing'. GOOD: 'Write 1 deep-dive case study per week showing how [Product] helped [Specific ICP] solve [Specific Problem]. Post on LinkedIn targeting [Job Titles]... Goal: 500 views/post, 20 inbound leads/month.'" Where: replace the "Not a marketing plan, a hustle plan" comment. Effort: S.

10. **Add the unfair-access and information-diet prompts.** Source: lenny-skills@startup-ideation (v1.0.0 tag). Technique: `skills/startup-ideation/SKILL.md`: "What do you know or have access to that most people don't?" and "If everyone reads the same articles and follows the same people, everyone will have the same ideas." Where: the first as the opening question of "Problem Space Exploration" in `01-brainstorm.md` and as a comment in the "Unfair Advantage" cell of `02-lean-canvas.md`; the second as a line under "Open Questions." Effort: S.

11. **Add the three-mode entry protocol to Step 1.** Source: deanpeters/product-manager-skills (dependency file). Technique: `skills/workshop-facilitation/SKILL.md`: "Ask the user to choose an entry mode: 1 Guided mode (one question at a time), 2 Context dump (paste known context; skip redundancies), 3 Best guess mode (infer missing details and label assumptions)" and "End with... (if best guess mode was used) an Assumptions to Validate list." Where: when no description argument is supplied, offer the three modes instead of just asking for a one-liner. Re-express in our own words given the CC BY-NC-SA license. Effort: M.

### skills/idea-evaluate/SKILL.md

1. **Add stage calibration to Phase 2 and the frontmatter of the evaluation file.** Source: onewave-ai/claude-skills@pitch-deck-reviewer. Technique: `pitch-deck-reviewer/SKILL.md` Calibration: "Adjust for stage: weight pre-product decks toward problem/solution clarity, team, and market; relax traction and financials expectations and note the calibration." Where: a `stage:` field (pre-product / prototype / early-revenue) in the YAML frontmatter, detected from `04-pmf-strategy.md` milestones, and one sentence in the agent context block telling agents which dimensions to relax. This directly addresses our own "Graceful Degradation" note that sparse docs score low; a pre-product idea scoring 1/5 on Traction is not a finding. Effort: M.

2. **Add a grade label table to the summary.** Source: onewave-ai/claude-skills@pitch-deck-reviewer. Technique: `pitch-deck-reviewer/references/evaluation-framework.md` Overall Score Calculation, six thresholds (Exceptional / Strong / Good / Fair / Needs Work / Not Ready). Where: in the Evaluation Summary table, add a label column next to the combined score, and define the thresholds in `references/evaluation-framework.md` so pushback and forge use the same words. Effort: S.

3. **Add a "Top 5 Improvements" block to Phase 3.** Source: onewave-ai/claude-skills@pitch-deck-reviewer. Technique: `pitch-deck-reviewer/references/output-template.md` Top 5 Improvements, each with "Current State / Recommended Change / Expected Impact / Implementation Difficulty / Priority." Where: after "Weakest dimension," replace the single-line recommendation with this five-row table. It makes the handoff to `idea-update` concrete. Effort: S.

4. **Move the empirical-claim verification mandate up into the skill body.** Source: onewave-ai/claude-skills@pitch-deck-reviewer. Technique: `pitch-deck-reviewer/SKILL.md` line 31: "Verify any market-size, revenue, or growth claim with WebSearch before accepting it. Never fabricate metrics, comparisons, or statistics." Where: Phase 2, as a hard rule in the context block. Our agents say "use web research to validate empirical claims" but nothing forbids accepting a founder's TAM number as-is. Effort: S.

5. **Add a self-verification checklist before Phase 4 writes the file.** Source: ognjengt/founder-skills@go-to-market-plan. Technique: the Quality Checklist pattern in `skills/go-to-market-plan/SKILL.md` ("If ANY check fails, revise before presenting"), with items such as "Metrics are specific and measurable" and "Zero generic advice." Where: end of Phase 3, five checks: every dimension's Evidence field quotes the docs; every Research field names the tool and query; no 4 or 5 lacks a cited source; the weakest dimension has a concrete next step; the stage assumption is stated at the top. Effort: S.

6. **Fix the stale filter description in Phase 1.** Not a community import. Phase 1 step 1 still reads "an optional agent filter (`vc` or `market`)" while Phase 2 and the README accept `yc`. Effort: S.

7. **Write an evaluation memo, not just a score.** Source: lenny-skills@evaluating-startup-ideas. Technique: Austin Rief's investment memo in `skills/evaluating-startup-ideas/references/artifacts.md`: "For each investment, write a detailed memo covering: Why you invested, What you loved about the team, Your confidence level, Key risks and concerns." Where: a short "Memo" section in the evaluation file after the summary table, four fields. It gives `idea-forge` and `idea-postmortem` a narrative to compare across time, not just numbers. Effort: S.

### skills/idea-pushback/SKILL.md

1. **Add a claim-type taxonomy so the sparring partner picks the right tool.** Source: lenny-skills@evaluating-startup-ideas. Technique: the tarpit test, `skills/evaluating-startup-ideas/references/artifacts.md`: "Criteria of a tarpit idea: 1) A lot of people independently come up with it. 2) It seems like an unsolved problem. 3) You get lots of positive feedback from friends/users initially. 4) People have been trying and failing to build it since the 90s." Where: Phase 1, as a pre-check before decomposition. If three of four fire, the first claim to spar is "this is not a tarpit." Effort: S.

2. **Add "Here Be Dragons" as a named reasoning tool for Market & Timing claims.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "if you're working on an idea, someone probably tried it before and failed, so what's different now? The 'why now' question is an attempt to figure out why this time the ship won't sink." Where: Phase 3a, listed with the other eight tools; the research step (3b) then searches for prior attempts by name. This is survivorship bias with a concrete research action attached. Effort: S.

3. **Add the 60% gross margin stress test to Business Model claims.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "ask: 'Why can't we start at a 60% gross margin?' The answer usually reveals the true competitive alternative (e.g., an offshore company doing it for a 20% margin)." Where: Phase 3a, as the default opening challenge for any Business Model lens claim. Effort: S.

4. **Add the Can't vs Won't test to Competitive Reality claims.** Source: lenny-skills@competitive-strategy. Technique: `skills/competitive-strategy/references/artifacts.md`: "1) CAN'T: Is there a structural reason competitors cannot replicate? 2) WON'T: Would replication require competitors to destroy their existing business?" Where: Phase 3a, as the second step after "competitive simulation." Effort: S.

5. **Add the True Switching Cost list and vulnerability matrix.** Source: lenny-skills@competitive-strategy. Technique: `skills/competitive-strategy/references/artifacts.md`: "Only USER is frustrated: Hard to win. Only BUYER is frustrated: Path to victory IF you can overcome switching costs. Both frustrated: Best opportunity. Neither frustrated: Don't bother." Plus the eight true switching costs (installation, politics, emotions, career ambitions, esoteric processes, competing priorities, laziness, community). Where: Phase 3a, for Customer Clarity claims that assert "customers will switch." Effort: S.

6. **Make prediction verification concrete with the Pre-Product Invoice Test.** Source: lenny-skills@idea-validation. Technique: `skills/idea-validation/references/artifacts.md`: "Literally send them an invoice for early access to the product. Do this even if it's a consumer app you won't charge for." Where: Phase 4, under "Recommended Next Move," as the default suggestion when the refuted or unresolved claim is about willingness to pay. Effort: S.

7. **Add the Layers of Language filter to the Dialogue step.** Source: lenny-skills@customer-interviews. Technique: `skills/customer-interviews/references/artifacts.md`: "1. Pablum layer (surface level, e.g., 'it was good'), 2. Fantasy/Nightmare layer (exaggerations of how good or bad it was), 3. Truth layer (the actual causal events and context)." Where: Phase 3c, as guidance for when the founder's defense is a generalization ("customers love it"): push to the truth layer by asking for a specific dated instance. Effort: S.

### skills/idea-update/SKILL.md

1. **Add an interview-signal filter to Step 2.** Source: lenny-skills@customer-interviews. Technique: Todd Jackson's signal detection, `skills/customer-interviews/references/artifacts.md`: "Positive signals (wow statements): 'Does that really work?' 'I'd sign up for the wait list today.' Positive signals (demonstrated behavior): 'Can we meet again next week?' 'Can you send me the deck?' Negative signals: 'That sounds kind of interesting' (interesting = polite no). 'We don't have the budget' = no. 'Not the right time, let's talk next year' = no." Where: under "New data?", when the user reports interview results, classify each quoted response before it moves an assumption to Validated. Effort: S.

2. **Add the Gusto emotional-reaction test as the bar for "Validated" on desirability assumptions.** Source: lenny-skills@customer-interviews. Technique: `skills/customer-interviews/references/artifacts.md`: "Weak signal (means NO): 'Oh yeah, that's cool... Yeah, yeah, I may buy it.' Strong signal (means YES): They start cursing. They get really upset unprompted." Where: the `03-assumptions.md` update rules; a D-row cannot flip to Validated on polite interest alone. Effort: S.

3. **Add the Nielsen number as a sample-size sanity check.** Source: lenny-skills@customer-interviews. Technique: `skills/customer-interviews/references/artifacts.md`: "7-14 user interviews is the sweet spot: fewer than 7 means not enough data, more than 14 means diminishing returns." Plus the stopping rule from Todd Jackson: "when you can predict 70-80% of what the next person will say." Where: Principles, under "Evidence over opinion." Effort: S.

4. **Adopt the three-mode entry protocol.** Source: deanpeters/product-manager-skills (dependency file, see idea-new item 10). Where: Step 2 "Identify What Changed" currently says "Ask the user or infer from context"; replace with an explicit mode choice. Effort: M.

### skills/idea-forge/SKILL.md

1. **Structure the Pitch-Ready Summary as the canonical deck order.** Source: onewave-ai/claude-skills@pitch-deck-reviewer. Technique: `pitch-deck-reviewer/references/evaluation-framework.md` lines 16-28: "1. Hook / Opening, 2. Problem, 3. Solution, 4. Product / Demo, 5. Traction / Validation, 6. Market Size, 7. Business Model, 8. Competition, 9. Team, 10. Financials, 11. The Ask, 12. Vision / Close." Where: replace the "3-5 bullet points" instruction with one line per slide, each grounded in a validated claim or marked "(not yet validated)." Effort: S.

2. **Add an Investor Objections section using the objection template.** Source: onewave-ai/claude-skills@pitch-deck-reviewer. Technique: `pitch-deck-reviewer/references/objections-and-benchmarks.md` lines 5-21: "1. The Objection: State it exactly as an investor would phrase it in a partner meeting. 2. Why They Will Raise It. 3. Severity: High / Medium / Low. 4. Suggested Response. 5. Deck Fix." mapped to eight risk categories (Market, Execution, Technical, Competitive, Business Model, Timing, Regulatory, Capital Efficiency). Where: new section after "What's Still Risky," populated from the Refuted and Unresolved claims across all pushback sessions. Effort: M.

3. **Add a "Missing Slides" line.** Source: onewave-ai/claude-skills@pitch-deck-reviewer, `references/output-template.md`. Where: at the end of the Pitch-Ready Summary, list which of the twelve canonical items the idea docs cannot yet support. Effort: S.

4. **Add a "Why Now strength" line to the verdict.** Source: lenny-skills@evaluating-startup-ideas. Technique: the time-horizon model in `skills/evaluating-startup-ideas/references/artifacts.md`: "Strongest: Very recent shifts. Medium: Ongoing multi-year trends. Weakest: Long-standing macro trends." Where: Verdict block, one line. Effort: S.

### skills/idea-postmortem/SKILL.md

1. **Add a "Was this a tarpit?" check to Phase 3.** Source: lenny-skills@evaluating-startup-ideas. Technique: the four tarpit criteria (see pushback item 1). Where: a fifth pattern in "Patterns to watch for," since "lots of positive early feedback then nothing" is the tarpit signature and founders rarely name it. Effort: S.

2. **Add the pre-PMF middle-ground warning as a diagnostic.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`, Pre-PMF Startup Validation Checklist item 9: "Pre-PMF, you're looking for overwhelming pull from the market OR no sales at all. The in-between is dangerous." Where: Phase 3, as a question when the stated reason is "traction was slow but not zero." Effort: S.

3. **Add "Investor validation substituted for customer validation" to the patterns list.** Source: same checklist, item 8: "Don't let investor validation substitute for customer validation." Where: Phase 3 patterns. Effort: S.

### skills/idea-setup/SKILL.md

1. **Add a curated data-source directory as an optional reference, sans pricing.** Source: wshobson/agents@market-sizing-analysis. Technique: `plugins/startup-business-analyst/skills/market-sizing-analysis/references/data-sources.md`: about thirty sources grouped by category (Gartner, Forrester, Statista, SEC EDGAR, Census, Crunchbase, etc.) with "best for" notes, plus a citation format and a "do market sizing in under 2 hours" emergency guide. Where: a new `references/data-sources.md` linked from setup's status dashboard, with the price figures stripped (the fork flagged them as dated). Effort: M. Lowest priority in this section; setup is not where users spend time.

### agents/evaluate/vc.md

1. **Give the Competition/Moat dimension a taxonomy.** Source: lenny-skills@competitive-strategy. Technique: the seven-item defensibility checklist in `skills/competitive-strategy/references/artifacts.md`: "Are there network effects / economies of scale / high switching costs / potential for a strong brand / exclusive supply / proprietary technology / proprietary access (data, accounts, regulatory protection)." Plus Helmer's Power Progression: "Startups should eliminate Branding, Process, and Resource power from their strategy. They should start with Counter-positioning." Where: the Competition/Moat row of the Dimensions table; score 4-5 only if at least one item is named and is available at the startup's stage. Effort: S.

2. **Replace the TAM prose with the Venture-Scale criteria and the Market Curve.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "TAM generally needs to be $5B+... What would have to be true to reach $100M in revenue in one year? How many people would need to use/pay, and how much revenue per user?" Where: the TAM row; require the agent to state the customers-times-ARPU math explicitly. Effort: S.

3. **Add the Team "Earned Secret" test.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "Evaluate whether the founding team has done something in their past, tried to solve some hard problem, and learned something about the world that not a lot of people know." Where: the Team row, as the question that separates a 3 from a 5. Effort: S.

4. **Add the Five Sources of Why Now to the Timing row.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "Group A, unlocks a 10x better product: 1. Ubiquity of new technology, 2. Newly available data or APIs, 3. Changes in regulation. Group B, creates a growing untapped market need: 4. Change in people's behavior, 5. Change in people's beliefs." Where: the Timing row; the agent names which bucket applies. Effort: S.

5. **Add a unit-economics checklist with thresholds to the Business Model row.** Source: onewave-ai/claude-skills@pitch-deck-reviewer. Technique: `pitch-deck-reviewer/references/evaluation-framework.md` lines 145-158: "LTV:CAC ratio, is it above 3:1? Payback period, how many months to recover CAC? Gross margin, does it improve with scale?" and red flag "CAC that decreases over time without explanation." Plus the 60% gross margin test from lenny-skills. Where: the Business Model row. Effort: S.

6. **Add the Distribution Evaluation Checklist to the GTM row.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "A clear growth strategy / A unique growth strategy / Unique access to the target audience / A new untapped distribution channel / High LTV/CAC ratio." And from founder-skills: "Channel-product fit matters more than product-market fit early on: Great product in wrong channel = no traction" (`skills/go-to-market-plan/SKILL.md` line 87). Where: the GTM row. Effort: S.

7. **Add the Four Pull Signals to the Traction row.** Source: lenny-skills@idea-validation (see idea-new item 5). Where: the Traction/Validation row; score by which of the four signals are present, with "friends said they'd use it" explicitly scoring 1-2. Effort: S.

8. **Add a "would I bet money" filter to the verdict.** Source: ognjengt/founder-skills@go-to-market-plan, `skills/go-to-market-plan/SKILL.md` line 168: "Would I personally bet money that this will produce traction?" Where: the Investment verdict paragraph prompt. Effort: S.

9. **Add per-dimension red-flag lists for Team, Traction, and Competition, with a score cap.** Source: onewave-ai/claude-skills@pitch-deck-reviewer, `pitch-deck-reviewer/references/evaluation-framework.md`. Team (dimension 6): "Solo non-technical founder building a technical product," "Advisory board with no skin in the game," "No evidence the founders have worked together before," "Key missing roles with no hiring plan mentioned." Traction (dimension 8): "Only showing cumulative charts (hides declining growth)," "Impressive percentage growth on a tiny base," "Testimonials without attribution," "Metrics from a period that ended months ago." Competition (dimension 4): "Differentiation based solely on price (unsustainable)," "No mention of what happens when incumbents copy the feature," "Competitors listed are all small startups (ignoring incumbents)." Where: a "## Red Flags" section after the Dimensions table, grouped by dimension, with the rule that any flag present caps that dimension at 2 and must be named in the Key risk line. Item 5 above already covers the Business Model flags; this completes the set. Effort: M.

10. **Add stage-appropriate Traction expectations to the Traction row.** Source: same file, dimension 8: "Pre-seed: Problem validation interviews, LOIs, waitlist signups, prototype feedback. Seed: Beta users, early revenue, pilot customers, engagement metrics. Series A: $1M+ ARR, clear growth rate, unit economics, retention cohorts." Where: the Traction/Validation row, keyed to the `stage:` field proposed for idea-evaluate. A pre-seed idea with twelve interviews and three LOIs is a 3 or 4, not a 1. Effort: S.

### agents/evaluate/market-analyst.md

1. **Add worked TAM/SAM/SOM formulas.** Source: wshobson/agents@market-sizing-analysis. Technique: `plugins/startup-business-analyst/skills/market-sizing-analysis/references/details.md`, top-down: "TAM = Total Market Category Size. SAM = TAM x Geographic % x Segment %. SOM = SAM x Realistic Capture Rate (2-5%)." Bottom-up: "TAM = Sum (Segment Size x Annual Revenue per Customer). SAM = TAM x (Segments You Can Serve / Total Segments). SOM = SAM x Realistic Penetration Rate (Year 3-5)." Where: the Market Size & Growth row, requiring both methods in the Research field. Effort: S.

2. **Add the triangulation tolerance and the SOM guardrail.** Source: same file: "Compare top-down and bottom-up results (should be within 30%)" and red flag "Inconsistency between methodologies (> 50% difference)"; "Mistake 2: Overly Aggressive SOM: New entrants rarely capture > 5% in 5 years." Where: the Market Size row's scoring guidance; a founder TAM with no bottom-up cross-check caps at 3. Effort: S.

3. **Add the Value Theory method for new categories.** Source: same file: "Value per Customer = Problem Cost x % Solved by Solution. Price per Customer = Value x Willingness to Pay % (10-30%). TAM = Total Potential Customers x Price per Customer." Where: the Market Size row, as the method to use when no analyst report exists for the category. Effort: S.

4. **Add public-comp validation.** Source: `plugins/startup-business-analyst/skills/market-sizing-analysis/examples/saas-market-sizing.md`: "Klaviyo (Public, KVYO): 2024 Revenue: ~$700M... Market Share: ~46% of our SAM... Validates large e-commerce email market exists." Where: the Web Research section; pair with the existing Exa `financial report` category, which we already document in `references/exa-research.md` but never tell the agent to use for this purpose. Effort: S.

5. **Add a positioning map and bidirectional advantage list to the Competitive Landscape output.** Source: claude-office-skills/skills@competitive-analysis. Technique: `competitive-analysis/SKILL.md`, the ASCII 2x2 (Price by Innovation), and "### Your Advantages Over Competitors ... ### Areas Where Competitors Excel." Where: the Competitive Landscape row's output; replacing prose with a table of three to five named competitors, each with funding, a one-line positioning, and a "where they beat this idea" cell. Effort: M.

6. **Add the "Why Now" red flag list.** Source: lenny-skills@evaluating-startup-ideas, the paired case lists: "Companies that failed despite a strong 'why now': Quibi, Cherry, Homejoy, drone companies circa 2010" and "Companies that succeeded WITHOUT a strong 'why now': SpaceX, Airbnb, Pinterest, DoorDash." Where: the Timing & Tailwinds row, as a reminder that a tailwind is neither necessary nor sufficient; score the tailwind's strength, not its existence. Effort: S.

7. **Add the Workflow Quadrant for B2B ideas.** Source: lenny-skills@evaluating-startup-ideas, `skills/evaluating-startup-ideas/references/artifacts.md`: "X-axis: Breadth (Niche/Single Department vs. Everyone/All Departments). Y-axis: Frequency (Low/Infrequent vs. High/Daily). The best quadrant for B2B SaaS startups is 'High Frequency Niche'." Where: the Customer Accessibility row. Effort: S.

### agents/evaluate/yc-founder-fit.md

1. **Add the LUV test to Problem Acuteness.** Source: lenny-skills@evaluating-startup-ideas. Technique: `skills/evaluating-startup-ideas/references/artifacts.md`: "L, Large: Is the problem large enough in customers, users, and spend? U, Urgent: Will they change their current way of solving this problem? V, Valuable: Are people willing to spend money to solve this problem?" plus the 1-10 pain scale rule: "If it's a 4-5, it'll be hard to get people to pay or switch. Needs to be a 9-10 for venture-scale potential." Where: the Problem Acuteness row and the Key Scoring Guidance paragraph. Effort: S.

2. **Add Coda's two litmus tests and the Decade test to Long-term Commitment.** Source: same file: "1. Do you have an idea you can't imagine not working on? 2. Do you have a person you can't imagine not working with? You need BOTH." and Ryan Hoover's "Do I see myself working on this for a decade?" Where: the Long-term Commitment row. Effort: S.

3. **Add Uri Levine's validation signal to Personal/Peer Demand.** Source: same file: "Validation signal: they describe the problem back to you in their own words. Non-validation: they say 'I know someone who has this problem.'" Where: the Personal/Peer Demand row and its scoring guidance. Effort: S.

4. **Add the Three Paths to Founder-Market Fit.** Source: same file: "Path 1: Past Pain (~40%)... Path 2: Ponder and Probe (~35%)... Path 3: Present Pull (~25%)... Median of 30 customer conversations before committing." Where: the Founder-Market Fit row; the agent identifies which path the founder is on and applies that path's self-reflection questions. Effort: S.

5. **Add the love-it/hate-it bifurcation and the "toy" signal to Idea Space Fertility or a new note.** Source: same file: "Disruptive product: Strong love + strong hate, little in between. Incremental product: Bell curve of modern indifference." Where: Key Scoring Guidance, as a counterweight to over-penalizing ideas that got mixed early feedback. Effort: S.

6. **Add the venture-scale vs great-business distinction to the verdict.** Source: same file, "Non-Venture-Scale Product Ideas That Are Still Great Businesses" (Product Hunt, Trello, Basecamp, DuckDuckGo). Where: the "should you start this?" verdict; explicitly allow "yes, but not as a venture-backed company." Our combined 0-100 score currently has no way to say that. Effort: S.

### references/evaluation-framework.md

1. **Add a Confidence Meter column to the per-dimension output.** Source: lenny-skills@idea-validation (Itamar Gilad, see idea-new item 2). Where: the Per-Dimension Output Format, a sixth field "Evidence quality (0-10)" so a 4/5 score backed by a survey reads differently from a 4/5 backed by revenue. This also gives `idea-forge` a second trajectory to plot. Effort: S.

2. **Add a grade-label table and a stage-calibration rule.** Source: onewave-ai/claude-skills@pitch-deck-reviewer (see idea-evaluate items 1 and 2). Where: after the Score Scale table. Also port the top-mark discipline from the same skill's Calibration section: "Reserve 9-10 on a dimension for work that sets a new standard," restated for our scale as "reserve 5 for evidence-backed unique insight; a well-documented standard approach is a 4." Effort: S.

2a. **Remove the stale "Improve (auto)" action type.** Not a community import. The Changelog Action Types table and its example still describe an `Improve` skill that no longer exists in the plugin; the only writers today are `idea-update` (which uses the "Forge (manual)" label) and `idea-pushback`. Either delete the row or rename it to match what `idea-update` actually emits. Effort: S.

3. **Add "Here Be Dragons" and "Can't vs Won't" to the Reasoning Tools list.** Sources: lenny-skills@evaluating-startup-ideas and @competitive-strategy (see pushback items 2 and 4). Where: the Reasoning Tools bullets, bringing the list to ten. Effort: S.

4. **Add a "Common Mistakes" anti-pattern list with numeric guardrails.** Source: wshobson/agents@market-sizing-analysis, `references/details.md` format ("Mistake 2: Overly Aggressive SOM: New entrants rarely capture > 5% in 5 years"). Where: a new section after Scoring Principles, seeded with: the 1%-of-the-market fallacy (pitch-deck-reviewer red flag "'If we get just 1% of the market' reasoning"), SOM above 5% in five years, LTV:CAC below 3:1 presented as fine, top-down TAM with no bottom-up check, "friends said they'd use it" counted as traction, no competitors read as no competition. Effort: S.

5. **Add a Startup Evaluation Criteria priority order as a tie-breaker.** Source: lenny-skills@evaluating-startup-ideas, Lenny's seven angel criteria in priority order: "1. Pain, 2. Big and growing market, 3. Evidence of PMF, 4. A+ founders, 5. Unfair advantage, 6. Business model, 7. Rocket-ship-ness." Where: Scoring Principles, as the rule for which dimension to call "weakest" when two tie. Effort: S.

6. **Add the "Strategy Coherence Check" as a scoring principle.** Source: phuryn/pm-skills@business-model, `pm-product-strategy/commands/business-model.md`: "### Strategy Coherence Check [Do all elements reinforce each other?]" Where: Scoring Principles; a per-dimension score is not enough if the channel contradicts the customer or the price contradicts the value metric. Effort: S.

7. **Adopt the tiered lazy-loading pattern.** Source: wshobson/agents@market-sizing-analysis, `SKILL.md`: "Read that file when the navigation tier above is insufficient." Where: if the additions above push this file past about 250 lines, split the Reasoning Tools and Common Mistakes into `references/reasoning-tools.md` and keep the framework file as the navigation tier. Effort: M, only if needed.

### references/exa-research.md

1. **Add a "prior attempts" query pattern.** Source: lenny-skills@evaluating-startup-ideas ("Here Be Dragons"). Where: Query Patterns, under a new "Graveyard Research" heading: `web_search_advanced_exa: query="[category] startup shut down OR failed OR pivoted", category="news"` and `query="[category] startups", category="company"` with a note to look for domains that are dead. This is the research action behind survivorship bias, and we currently have no query pattern for it. Effort: S.

2. **Add a public-comp revenue query pattern.** Source: wshobson/agents@market-sizing-analysis (see market-analyst item 4). Where: Financial Data section: `query="[nearest public company] annual revenue segment breakdown", category="financial report"`, with a comment explaining the sanity-check use. Effort: S.

3. **Add a Wayback Machine crawl pattern for competitor pricing pages.** Source: lenny-skills@competitive-strategy, `references/artifacts.md`: "Used to look at locked-out pages, pricing pages, and homepages from the past year to extrapolate what changes competitors kept, indicating winning elements." Where: a `crawling_exa` example against `web.archive.org/web/2025*/<competitor>/pricing`. Effort: S.

4. **Add a customer-complaint pattern for Problem Acuteness.** Source: lenny-skills@customer-interviews (the "cursing unprompted" signal). Where: Query Patterns, `category="tweet"` with `query="[incumbent] hate OR awful OR switching from"`, feeding the YC agent's Problem Acuteness row. The `tweet` category is listed in our Categories table but has no query pattern. Effort: S.

5. **Add a per-dimension query budget.** Source: wshobson/agents@market-sizing-analysis, `references/data-sources.md`, the "Emergency Research Guide": "Need market size in < 2 hours? 1. Check Statista (15 min)... 5. Calculate bottom-up (30 min) 6. Triangulate (15 min)." Where: a new "Query Budget" section: at most three Exa calls per dimension, stop early when two independent sources agree, and record the count in the annotation. Three agents times eight to ten dimensions can burn a meaningful share of the Exa free tier (1,000 requests per month) in a single evaluation, and nothing in the guide currently bounds it. Effort: S.

6. **Add a source-quality tier and a staleness rule.** Sources: wshobson `references/data-sources.md` ("Data Quality Checklist") and pitch-deck-reviewer red flag "Outdated market data (more than 2 years old)." Where: extend the Annotation Convention with a published-date field and a one-line tier order (SEC filings and primary data, then analyst reports, then press coverage, then blog posts). Any market number older than two years gets flagged in the Research line, and the agent must attempt one fresher query before using it. Effort: S.

---

## C. Top 10 changes ranked by impact over effort

1. **Confidence Meter (0-10 evidence quality) on every dimension score and assumption row.** Sources: idea-validation. One column, three files (`evaluation-framework.md`, `templates.md` for `03-assumptions.md`, `idea-update`). It fixes the plugin's biggest blind spot: a score today does not say what kind of evidence sits under it.

2. **Worked TAM/SAM/SOM formulas with the 30% triangulation tolerance and the 5% SOM guardrail in `market-analyst.md`.** Source: wshobson market-sizing. Pure paste; turns our vaguest dimension into our most auditable one.

3. **Moat taxonomy (7-item checklist plus Power Progression plus Can't/Won't) in `vc.md` and `evaluation-framework.md`.** Source: lenny competitive-strategy. Our two competition dimensions currently ask for a moat without giving the agent a list to check against.

4. **Stage calibration field in the evaluation frontmatter and context block.** Source: pitch-deck-reviewer. Prevents pre-product ideas from being scored as if they were Series A pitches, which is the most common way our combined score is currently misleading.

5. **Four Pull Signals as the Traction rubric and the experiment pass criteria.** Source: idea-validation. Same list lands in `vc.md`, `05-experiments.md`, and `idea-update`; it is the single most reused piece of content across the candidate skills.

6. **Interview-signal filter (Todd Jackson positives and negatives, Gusto emotion test, Nielsen 7-14) in `idea-update`.** Source: lenny customer-interviews. Our update skill currently upgrades assumptions on any interview count; this gives it a quality bar.

7. **Common Mistakes anti-pattern list with numeric guardrails in `evaluation-framework.md`.** Sources: wshobson format, pitch-deck-reviewer red flags, lenny guardrails. Cheap, and every agent reads it.

8. **Canonical 12-item pitch order plus Investor Objections section in `idea-forge`.** Source: pitch-deck-reviewer. Turns the Pitch-Ready Summary from bullets into something a founder can actually walk into a meeting with.

9. **Tarpit check and "Here Be Dragons" graveyard research in `idea-pushback` and `exa-research.md`.** Source: lenny evaluating-startup-ideas. Adds one reasoning tool and one query pattern; gives survivorship bias a concrete research step.

10. **Delta-4, Founding Hypothesis line, and Why-Now checklist in the `idea-new` templates.** Source: lenny evaluating-startup-ideas and idea-validation. Three small template edits that make the docs a founder fills in on day one produce numbers the evaluators can actually score.

---

## D. Gaps with no skill at all

### Pricing strategy: new skill warranted (`idea-pricing`)

This is the largest hole. The plugin has one line for pricing in `02-lean-canvas.md` and nothing anywhere else. `refoundai/lenny-skills@pricing-strategy` has enough structured, MIT-licensed content to build a complete skill: the six-step Value Metric Identification Framework, the per-seat litmus test, the four-tier Monetization Prioritization (foundational, core, optimizations, growth accelerators), the four WTP methods with a selection decision tree ("FREQUENTLY BOUGHT, FAMILIAR PRODUCTS: Use open-ended method. UNUSUAL OR HIGH-TICKET ITEMS: Use choice-based method. NEW-TO-THE-WORLD PRODUCTS: Avoid direct methods"), the fair/expensive/prohibitive three-question probe, the Four Rules of B2B Pricing ("Charge sooner than you think. Charge more than you think. Keep it very simple to start. Revisit pricing every year or so"), the trial-vs-freemium decision rules, and the price-doubling method with the Sprig worked example. A skill of the form `idea-pricing [idea-name]` would read `02-lean-canvas.md`, walk the founder through value metric, order of magnitude, and packaging, and write a `pricing-YYYYMMDD.md` with a recommended WTP study. The VC agent's Business Model dimension would then have something to score. Effort: L. Absorbing this into `idea-new` would be wrong; pricing is an iteration activity, not a scaffolding one.

### Customer interview guide: new skill warranted (`idea-interview`)

The plugin tells founders to talk to customers and to bring results back to `idea-update`, but never helps them design the conversation or interpret it. `deanpeters/product-manager-skills@discovery-interview-prep` has the best structure (four-question setup, Question/Rationale/Follow-up/Avoid quadruples, bias list with rewrites, checkmark success criteria, recruiting math "Reach out to 20-30 people to get 5-10 interviews (33% response rate is typical)"), but its CC BY-NC-SA license means we re-express rather than copy. `refoundai/lenny-skills@customer-interviews` is MIT and has the signal-interpretation half (Story-Based Interview steps, Layers of Language, Dollar-Driven Discovery's three phases, Jen Abel's "Are you measuring or managing this problem today? If no, move on"). A skill `idea-interview [idea-name]` would read `03-assumptions.md`, pick the riskiest desirability assumption, generate a guide targeted at it, and produce an `interview-guide-YYYYMMDD.md` plus a synthesis template that `idea-update` consumes. Effort: L. The signal-interpretation half should also be absorbed into `idea-update` regardless (Section B), since that skill is where interview results already land.

### Go-to-market plan: absorb into `idea-update` plus template, not a new skill yet

`ognjengt/founder-skills@go-to-market-plan` is a good skill but its output (three strategies, each with playbook, first action, metrics, milestones) is what our `04-pmf-strategy.md` should already contain. The right move is to upgrade the template's GTM section with the channel-by-model lookup, the bowling-pin prompt, the BAD/GOOD specificity rule, and a "First action (30-60 min)" field, and to add the Distribution Evaluation Checklist to `vc.md`. If users then ask for a GTM deep-dive, a thin `idea-gtm` skill that expands that section could be added later. Effort: S now, L later if demanded.

### Competitive deep-dive: absorb into the agents now; standalone skill only if the agents' output is not enough

Both competitive candidates are useful but neither justifies a new command on its own. The moat taxonomy, Can't/Won't, True Switching Cost, and Power Progression go into `vc.md` and `evaluation-framework.md` (Section B). The positioning map, competitor table, and bidirectional advantage list go into `market-analyst.md`'s Competitive Landscape output. The battlecard format from `claude-office-skills` is a sales artifact, not an ideation artifact, and should not be adopted. Porter's Four Corners is worth one line in the Competitive Simulation reasoning tool ("What will competitor do? Where is competitor vulnerable? What will provoke the greatest retaliation?"). Effort: S to M in total.

### Pitch review: absorb into `idea-forge`

There is no deck to review at the ideation stage, so `onewave-ai/claude-skills@pitch-deck-reviewer` cannot be adopted as-is. Its canonical slide order, objection template, Missing Slides list, and stage calibration all belong in `idea-forge` (Section B). A separate `idea-deck` skill was already sketched in `docs/brainstorms/2026-03-19-idea-deck-requirements.md`; if that ships, it should take the reviewer's eight-dimension rubric and ten named benchmark decks. Effort: M into forge now.

### Market sizing: absorb into `market-analyst.md` and `exa-research.md`

`wshobson/agents@market-sizing-analysis` is a methodology reference, not a workflow. Everything in it fits inside the Market Size row of the market analyst plus two query patterns. No new skill. Effort: S.

### Business model canvas: no action beyond template edits

`phuryn/pm-skills@business-model` confirms Lean Canvas is the right default for us ("Lean Canvas: Startup-focused, faster... Better for hypothesis testing"). Take the segment and revenue taxonomies and the coherence-check line into the template; skip the rest. Effort: S.

---

## Appendix: source paths and licenses

| Candidate | Path in cloned repo | License |
|---|---|---|
| wshobson/agents@market-sizing-analysis | `plugins/startup-business-analyst/skills/market-sizing-analysis/{SKILL.md, references/details.md, references/data-sources.md, examples/saas-market-sizing.md}` | MIT |
| claude-office-skills/skills@competitive-analysis | `competitive-analysis/SKILL.md` | MIT |
| refoundai/lenny-skills@competitive-strategy (for competitive-analysis) | `skills/competitive-strategy/{SKILL.md, references/artifacts.md, references/guest-insights.md}` | MIT |
| refoundai/lenny-skills@idea-validation (for startup-ideation) | `skills/idea-validation/{SKILL.md, references/artifacts.md, references/guest-insights.md}` | MIT |
| refoundai/lenny-skills@evaluating-startup-ideas | `skills/evaluating-startup-ideas/{SKILL.md, references/artifacts.md, references/guest-insights.md}` | MIT |
| deanpeters/product-manager-skills@discovery-interview-prep | `skills/discovery-interview-prep/SKILL.md`, dependency `skills/workshop-facilitation/SKILL.md` | CC BY-NC-SA 4.0 |
| refoundai/lenny-skills@pricing-strategy | `skills/pricing-strategy/{SKILL.md, references/artifacts.md, references/guest-insights.md}` | MIT |
| phuryn/pm-skills@business-model | `pm-product-strategy/skills/business-model/SKILL.md`, wrapper `pm-product-strategy/commands/business-model.md` | MIT |
| ognjengt/founder-skills@go-to-market-plan | `skills/go-to-market-plan/SKILL.md` | MIT |
| onewave-ai/claude-skills@pitch-deck-reviewer | `pitch-deck-reviewer/{SKILL.md, references/evaluation-framework.md, references/objections-and-benchmarks.md, references/output-template.md}` | MIT |
| refoundai/lenny-skills@customer-interviews | `skills/customer-interviews/{SKILL.md, references/artifacts.md, references/guest-insights.md}` | MIT |
