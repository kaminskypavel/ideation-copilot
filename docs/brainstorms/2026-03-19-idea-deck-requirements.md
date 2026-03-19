---
date: 2026-03-19
topic: idea-deck
---

# Pitch Deck Generation in /idea:forge

## Problem Frame

The ideation-copilot produces rich, structured idea documentation (overview, lean canvas, assumptions, PMF strategy, experiments) but has no way to turn a validated idea into a presentable pitch deck. Users must manually extract and reformat content for investors or stakeholders. Existing pitch deck skills in the ecosystem start from scratch — they don't leverage the work already done in the idea workflow.

## Requirements

- R1. `/idea:forge` gains a pitch deck generation step — after integrating evidence into idea documents, forge automatically generates/regenerates the pitch deck in both formats
- R2. Dual output on every forge cycle:
  - `06-pitch-deck.md` — markdown deck added to the idea folder, following the same versioned-document convention
  - `pitch-deck.pptx` — PowerPoint file saved alongside in the idea folder, ready to present
- R3. Deck structure adapts to available content — early-stage ideas produce fewer slides, mature ideas with traction/financials produce a fuller deck
- R4. Sections with no substantive content in the idea folder are skipped entirely (no placeholders, no filler)
- R5. Content mapping from idea documents to deck slides:
  - `00-overview.md` → Title, Problem, Solution slides
  - `02-lean-canvas.md` → Business Model, Market, Channels, UVP slides
  - `03-assumptions.md` → Risk/validation narrative (woven into relevant slides)
  - `04-pmf-strategy.md` → Traction, GTM, Milestones slides
  - `05-experiments.md` → Evidence/validation slides (if experiments have results)
- R6. The markdown deck uses a slide-per-section format with clear `## Slide: [Title]` headers, making it readable as a document and parseable for .pptx generation

## Success Criteria

- After any `/idea:forge` cycle, the pitch deck is automatically up-to-date in both markdown and .pptx
- The deck content is substantive and sourced from validated idea documents, not generic boilerplate
- Zero extra commands needed — the deck is always fresh

## Scope Boundaries

- **Not** a standalone skill — pitch deck generation is a step within `/idea:forge`, not a separate `/idea:deck` command
- **Not** a design tool — the .pptx uses a clean, professional template but doesn't aim for custom visual polish
- **No** conversational info gathering — forge reads what exists, it doesn't interview the user
- **No** team/financials/ask slides unless those sections are added to the idea folder format in the future

## Key Decisions

- **Integrated in forge, not standalone**: The pitch deck is a living artifact that stays current with the idea's evolution. Every forge cycle updates it automatically in both formats.
- **Dual format always**: Both markdown and .pptx are generated every time. No flags or separate export step.
- **Adaptive structure**: No fixed slide count. The deck reflects the idea's actual maturity level.
- **Skip over fill**: Missing content is omitted, not filled with placeholders. A 5-slide deck with real content beats a 10-slide deck with filler.
- **Markdown is source of truth**: Forge generates the markdown deck first, then the .pptx is derived from it.

## Dependencies / Assumptions

- Assumes the standard idea folder structure produced by `/idea:new` (files 00-05)
- .pptx generation requires a bundled dependency (`python-pptx` or `pptxgenjs`) — library choice deferred to planning
- Requires modifying the existing `/idea:forge` skill to add the deck generation step

## Outstanding Questions

### Deferred to Planning

- [Affects R5][Needs research] Exact content extraction logic — how to parse and distill each idea document into concise slide bullets
- [Affects R2][Technical] Which .pptx library to use and how to bundle it (python-pptx vs pptxgenjs vs other)
- [Affects R6][Technical] Exact markdown slide format — whether to use `---` separators, H2 headers, or frontmatter-per-slide
- [Affects R5][Technical] Whether `01-brainstorm.md` content should feed into any slides (it's exploratory/messy)

## Next Steps

→ `/ce:plan` for structured implementation planning
