---
title: "feat: Integrate Exa search for richer market and competitor research"
type: feat
status: completed
date: 2026-03-25
origin: docs/brainstorms/2026-03-25-exa-integration-requirements.md
---

# feat: Integrate Exa search for richer market and competitor research

## Overview

Add optional Exa search as an enhanced research layer for evaluation agents and the pushback skill. When configured, agents use Exa's category-specific search (`company`, `news`, `financial report`, `research paper`, `linkedin profile`) for targeted queries. When not configured, everything falls back to WebSearch with zero degradation. A new `/idea:setup` skill provides an integrations dashboard for onboarding.

## Problem Frame

Evaluation agents and pushback currently rely on generic `WebSearch` for all market research. Exa provides category-specific search that returns more structured, relevant results for the exact queries agents already make — competitor discovery, funding data, market trends, SEC filings, founder profiles. Users who configure Exa should get meaningfully richer research without any changes to the core evaluation logic. (see origin: docs/brainstorms/2026-03-25-exa-integration-requirements.md)

## Requirements Trace

- R1. New reference doc `references/exa-research.md` — single source of Exa guidance
- R2. Category-specific Exa usage per agent (VC: company+financial report, Market: company+news+research paper, YC: company+linkedin profile, Pushback: all categories)
- R3. Graceful fallback chain: Exa > WebSearch > doc-only, with transparent annotations
- R4. New `/idea:setup` skill — integrations status dashboard
- R5. Add Exa MCP tools to allowed-tools for evaluate and pushback skills
- R6. First-run nudge when Exa is unavailable

## Scope Boundaries

- No structured summary schemas (JSON extraction) — agents interpret Exa results as text
- No `findSimilar` endpoint — defer to future pass
- No `additionalQueries` — keep single queries for simplicity
- No Exa SDK or direct API — MCP server only
- `/idea:setup` shows status and copy-paste instructions, does not auto-configure
- `get_code_context_exa` and `web_search_exa` excluded

## Context & Research

### Relevant Code and Patterns

- **Reference doc pattern**: `references/evaluation-framework.md` is read by the orchestrating skill (evaluate or pushback) and passed to agents as inline context. Agents do not read files themselves. New `exa-research.md` follows this same pattern.
- **"If available" pattern**: `idea:new` SKILL.md (lines 41-45) uses "use the installed X skill's methodology if available" for optional capabilities. Same instructional approach for Exa — agents try the tool, adapt if unavailable. No programmatic detection needed.
- **Graceful degradation**: `idea:evaluate` already has a dedicated section (lines 180-184): "No WebSearch available: Fall back to doc-only analysis." Extend this with a three-tier chain.
- **Dual-location sync**: All files under `plugins/ideation-copilot/` must be mirrored to `.claude/` for runtime loading.
- **Allowed-tools syntax**: Comma-separated in YAML frontmatter. MCP tools use full prefixed names (`mcp__exa__web_search_advanced_exa`). The `Bash(mkdir *)` pattern shows parameterized access.
- **Agent web research sections**: Each agent has a `## Web Research` section listing specific search tasks per dimension. These sections get updated to include Exa category recommendations.

### Institutional Learnings

- **Annotate research provenance**: The `product-management` skill pattern — "state clearly what you verified vs assumed" — applies here. Each researched data point should indicate whether it came from Exa (category search), WebSearch (generic), or doc-only analysis.
- **Never fail silently**: The original evaluate plan explicitly designed for graceful degradation with transparent notes. Exa follows the same philosophy.

## Key Technical Decisions

- **Exa guidance in a separate reference doc** (not inlined in agents): Single source of truth, consistent with how `evaluation-framework.md` works. Agents and skills include it alongside the existing framework. (see origin)
- **Category-specific usage, not Exa-first**: Agents pick the right tool per query — Exa when a category matches, WebSearch for general queries. Both tools active simultaneously. (see origin)
- **Instructional detection over programmatic detection**: Agents are told "use `web_search_advanced_exa` if available." If the tool isn't configured, the agent naturally falls back. This mirrors the `idea:new` "if available" pattern already in the codebase.
- **MCP server approach**: Auth via URL parameter (`exaApiKey=YOUR_KEY`). Standard server name `exa` for consistent tool naming.
- **`/idea:setup` as general integrations hub**: Checks Exa and Tavily status, extensible for future tools. (see origin)

## Open Questions

### Resolved During Planning

- **Exa detection mechanism** (was deferred to planning): Use the "if available" instructional pattern from `idea:new`. Agents try the tool; if unavailable, they use WebSearch. No try-catch or settings inspection needed for agents.
- **`additionalQueries` usage** (was deferred): Skip for now — single queries keep behavior simple and predictable. Can revisit if research quality gaps emerge.
- **MCP tool naming in allowed-tools**: MCP tools in Claude Code use the format `mcp__<server_name>__<tool_name>`. With the server named `exa`, the tools are `mcp__exa__web_search_advanced_exa` and `mcp__exa__crawling_exa`. However, allowed-tools may also accept short names since the skill is instructional. Verify during implementation.

### Deferred to Implementation

- **Exact MCP tool name format in allowed-tools**: Test whether `allowed-tools` requires `mcp__exa__web_search_advanced_exa` (full prefix) or accepts `web_search_advanced_exa` (short name). Try the full prefix first.
- **Category-filter incompatibilities**: Exa docs warn that `includeDomains`/date filters cause 400 errors with `category: "company"`. Document all known incompatibilities in the reference doc as they're discovered during testing.
- **`/idea:setup` detection method**: Try a lightweight `web_search_advanced_exa` call to verify connectivity, or check for MCP server availability. Simplest working approach wins.

## Implementation Units

- [ ] **Unit 1: Create `references/exa-research.md`**

  **Goal:** Establish the single source of Exa-specific guidance that all agents and skills reference.

  **Requirements:** R1, R3

  **Dependencies:** None

  **Files:**
  - Create: `plugins/ideation-copilot/references/exa-research.md`

  **Approach:**
  - Structure the doc in three sections: **Tool Reference** (available tools, categories, parameters, filter restrictions), **Agent Category Map** (which categories each agent should use), **Fallback Chain** (three-tier degradation with annotation guidance)
  - Document all known category-filter incompatibilities (company category rejects domain/date filters, `excludeText` not supported with financial report, `includeText`/`excludeText` only accept single-item arrays)
  - Include query pattern examples for each category relevant to business research
  - Include the annotation convention: "Validated via Exa [category]" / "Validated via WebSearch" / "Not empirically validated — based on idea docs only"
  - Keep the doc focused on what agents need to know — not Exa API reference, but practical guidance for business idea research

  **Patterns to follow:**
  - `references/evaluation-framework.md` — same structure level, same audience (agents receiving inline context)

  **Test scenarios:**
  - Doc is self-contained: an agent receiving only this doc and the evaluation framework has enough context to use Exa correctly
  - Category map clearly covers all three agents plus pushback
  - Filter restrictions are explicit enough to prevent 400 errors

  **Verification:**
  - The document covers all categories from R2 (company, financial report, news, research paper, linkedin profile)
  - Fallback chain is clearly defined with annotation format

- [ ] **Unit 2: Update evaluation agent web research sections**

  **Goal:** Each agent's "Web Research" section recommends Exa categories for its specific dimensions while preserving WebSearch as the baseline.

  **Requirements:** R2

  **Dependencies:** Unit 1 (reference doc defines the categories)

  **Files:**
  - Modify: `plugins/ideation-copilot/agents/evaluate/vc.md`
  - Modify: `plugins/ideation-copilot/agents/evaluate/market-analyst.md`
  - Modify: `plugins/ideation-copilot/agents/evaluate/yc-founder-fit.md`

  **Approach:**
  - Each agent already has a `## Web Research` section listing dimension-specific searches. Extend each section with Exa category recommendations using the "if available" pattern
  - **VC agent**: Add `category: "company"` for competitor/funding queries, `category: "financial report"` for SEC filings/earnings. Keep WebSearch for general TAM/pricing queries
  - **Market analyst**: Add `category: "company"` for competitor discovery, `category: "news"` with date filters for trend data, `category: "research paper"` for industry reports. Keep WebSearch for customer forums/review sites
  - **YC founder-fit**: Add `category: "company"` for idea space fertility checks, `category: "linkedin profile"` for founder research. Keep WebSearch for general proxy searches
  - Use phrasing like: "If `web_search_advanced_exa` is available, use `category: \"company\"` for competitor and funding queries. Otherwise use WebSearch."
  - Keep changes minimal — add Exa guidance alongside existing WebSearch bullets, don't restructure the section

  **Patterns to follow:**
  - `idea:new` SKILL.md lines 41-45 — "use X if available" phrasing
  - Existing `## Web Research` section format in each agent

  **Test scenarios:**
  - Agent with Exa available knows which category to use for each dimension
  - Agent without Exa produces the exact same output as today (no regressions)
  - No dimension is left without a research path (every bullet has either Exa category or WebSearch)

  **Verification:**
  - Each agent's Web Research section mentions specific Exa categories per dimension
  - WebSearch remains as explicit fallback for every research task
  - No existing guidance is removed

- [ ] **Unit 3: Update `idea:evaluate` skill**

  **Goal:** The evaluate skill loads the Exa reference doc, passes it to agents, allows Exa MCP tools, and includes a first-run nudge.

  **Requirements:** R5, R6

  **Dependencies:** Unit 1 (reference doc to load)

  **Files:**
  - Modify: `plugins/ideation-copilot/skills/idea-evaluate/SKILL.md`

  **Approach:**
  - **Frontmatter**: Add `web_search_advanced_exa` and `crawling_exa` to `allowed-tools` (additive, existing tools stay)
  - **Phase 1 (Load)**: Add step to read `references/exa-research.md` alongside `references/evaluation-framework.md`
  - **Phase 2 (Dispatch Agents)**: Update context block preparation to include the Exa reference doc content alongside the evaluation framework
  - **Graceful Degradation section**: Extend existing two-tier fallback to three-tier: "**Exa unavailable:** Fall back to WebSearch for all research. Note: 'Enhanced search unavailable — using standard web search.' **No WebSearch available:** Fall back to doc-only analysis."
  - **First-run nudge**: After the Graceful Degradation section, add: "If Exa tools were not available during this evaluation, append to the report: 'Tip: Run `/idea:setup` to configure Exa search for richer market and competitor data.'"
  - Keep the nudge to one occurrence per evaluation run, not per agent

  **Patterns to follow:**
  - Existing Phase 1 file loading pattern (lines 27-33)
  - Existing Graceful Degradation section (lines 180-184)

  **Test scenarios:**
  - With Exa configured: agents receive Exa reference doc in their context block and use category-specific search
  - Without Exa configured: evaluation output is identical to today's plus a single setup hint at the end
  - Allowed-tools correctly lists both new MCP tools and all existing tools

  **Verification:**
  - `allowed-tools` includes `web_search_advanced_exa, crawling_exa` alongside existing tools
  - Phase 1 explicitly reads `references/exa-research.md`
  - Phase 2 context block includes Exa reference doc
  - Graceful Degradation has three tiers
  - First-run nudge appears exactly once per evaluation

- [ ] **Unit 4: Update `idea:pushback` skill**

  **Goal:** The pushback skill loads the Exa reference doc, allows Exa MCP tools, and includes a first-run nudge.

  **Requirements:** R2, R5, R6

  **Dependencies:** Unit 1 (reference doc to load)

  **Files:**
  - Modify: `plugins/ideation-copilot/skills/idea-pushback/SKILL.md`

  **Approach:**
  - **Frontmatter**: Add `web_search_advanced_exa` and `crawling_exa` to `allowed-tools`
  - **Phase 1 (Load & Decompose)**: Add step to read `references/exa-research.md` alongside `references/evaluation-framework.md`
  - **Phase 3b (Research)**: Update the research guidance to mention Exa categories: "For empirical claims, use `web_search_advanced_exa` with the appropriate category if available (see Exa research guide). For general claims, use WebSearch. Use `crawling_exa` to live-crawl specific URLs when verifying a claim from a provided link."
  - **Add a note at the end of the skill** (after Phase 4 or in Principles section): "If Exa tools were not available during this session, include in the final output: 'Tip: Run `/idea:setup` to configure Exa search for richer market and competitor data.'"

  **Patterns to follow:**
  - Existing Phase 1 file loading (lines 29-31)
  - Existing Phase 3b research guidance (lines 113-122)

  **Test scenarios:**
  - Pushback with Exa uses category-specific search for market size/competitor claims
  - Pushback without Exa works identically to today
  - `crawling_exa` is used when verifying a specific URL the user provides

  **Verification:**
  - `allowed-tools` includes both new MCP tools
  - Phase 1 reads `exa-research.md`
  - Phase 3b mentions Exa categories with fallback to WebSearch
  - First-run nudge is present

- [ ] **Unit 5: Create `/idea:setup` skill**

  **Goal:** Provide an integrations dashboard that checks optional tool availability and guides configuration.

  **Requirements:** R4

  **Dependencies:** None (can be built in parallel with Units 2-4)

  **Files:**
  - Create: `plugins/ideation-copilot/skills/idea-setup/SKILL.md`

  **Approach:**
  - Follow the established skill frontmatter pattern: `name: idea:setup`, `disable-model-invocation: true`, `allowed-tools: Read, Glob, Bash(claude *), WebSearch, web_search_advanced_exa`
  - The skill checks each integration by attempting a lightweight operation:
    - **Exa**: Try `web_search_advanced_exa` with a trivial query. If it succeeds, mark as configured. If it fails or isn't available, mark as not configured.
    - **Tavily**: Check if `WebSearch` returns results (it's built-in, so this mainly confirms it's working)
    - **Future integrations**: Extensible list format
  - Display a status dashboard:
    ```
    ## Integrations Status
    | Integration | Status | Impact |
    |-------------|--------|--------|
    | Exa Search  | [configured/not configured] | Enhanced competitor, market, and financial research |
    | WebSearch   | [configured/not configured] | Basic web research (built-in) |
    ```
  - For each unconfigured integration, show setup instructions:
    - Exa: `claude mcp add --transport http exa "https://mcp.exa.ai/mcp?exaApiKey=YOUR_KEY&tools=web_search_advanced_exa,crawling_exa"`
    - Note: User needs an API key from exa.ai
  - End with: "All integrations are optional. The ideation copilot works with WebSearch alone — enhanced integrations provide richer research."

  **Patterns to follow:**
  - All other `idea:*` skill frontmatter (same fields, same style)
  - `idea:new` "if available" pattern for optional capability checking

  **Test scenarios:**
  - User with Exa configured sees green status for Exa
  - User without Exa sees not-configured status with copy-paste setup command
  - Setup instructions include the exact MCP add command with placeholder for API key
  - Dashboard is clear about what each integration provides

  **Verification:**
  - Skill follows the established frontmatter pattern
  - Dashboard covers Exa and Tavily/WebSearch
  - Setup instructions are copy-pasteable
  - Tone is informative, not pushy

- [ ] **Unit 6: Sync `.claude/` directory**

  **Goal:** Mirror all changes from `plugins/ideation-copilot/` to the `.claude/` runtime directory.

  **Requirements:** All (R1-R6)

  **Dependencies:** Units 1-5 (all changes complete)

  **Files:**
  - Copy: `plugins/ideation-copilot/references/exa-research.md` → `.claude/references/exa-research.md`
  - Copy: `plugins/ideation-copilot/agents/evaluate/vc.md` → `.claude/agents/evaluate/vc.md`
  - Copy: `plugins/ideation-copilot/agents/evaluate/market-analyst.md` → `.claude/agents/evaluate/market-analyst.md`
  - Copy: `plugins/ideation-copilot/agents/evaluate/yc-founder-fit.md` → `.claude/agents/evaluate/yc-founder-fit.md`
  - Copy: `plugins/ideation-copilot/skills/idea-evaluate/SKILL.md` → `.claude/skills/idea-evaluate/SKILL.md`
  - Copy: `plugins/ideation-copilot/skills/idea-pushback/SKILL.md` → `.claude/skills/idea-pushback/SKILL.md`
  - Copy: `plugins/ideation-copilot/skills/idea-setup/SKILL.md` → `.claude/skills/idea-setup/SKILL.md`

  **Approach:**
  - Copy each modified/created file from `plugins/ideation-copilot/` to the corresponding `.claude/` path
  - Verify byte-identity between source and runtime copies
  - Create `.claude/skills/idea-setup/` directory for the new skill

  **Verification:**
  - All files under `.claude/` match their `plugins/ideation-copilot/` counterparts
  - `.claude/skills/idea-setup/SKILL.md` exists
  - `.claude/references/exa-research.md` exists

## System-Wide Impact

- **Interaction graph:** Evaluate skill reads new reference doc → passes to agents as context → agents use Exa or WebSearch → results flow back to evaluation report. Pushback reads same reference doc directly.
- **Error propagation:** Exa MCP failure should not propagate — agents catch the unavailability at the instructional level and switch to WebSearch. No error bubbles to the user beyond the annotation.
- **State lifecycle risks:** None — all changes are to prompt/reference files. No persistent state introduced.
- **API surface parity:** The new `/idea:setup` skill expands the plugin's command surface. All existing commands continue to work unchanged.
- **Integration coverage:** The main cross-layer scenario is: Exa configured → evaluate dispatches agents with Exa reference → agents use category-specific search → results appear in evaluation report with provenance annotations. This cannot be unit-tested — it requires a manual end-to-end run with Exa configured.

## Risks & Dependencies

- **MCP tool naming in allowed-tools**: If the `allowed-tools` field doesn't recognize MCP tool names, the tools won't be accessible to skills. Mitigation: test early in Unit 3, adjust syntax if needed.
- **Exa MCP server availability**: If the server URL changes or goes down, Exa features stop working. Mitigation: the fallback chain ensures zero degradation — WebSearch takes over.
- **Filter restriction changes**: Exa's category-filter incompatibilities may change without notice. Mitigation: the reference doc documents known restrictions; update as new ones are discovered.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-03-25-exa-integration-requirements.md](docs/brainstorms/2026-03-25-exa-integration-requirements.md)
- Related code: `plugins/ideation-copilot/references/evaluation-framework.md`, `plugins/ideation-copilot/agents/evaluate/*.md`, `plugins/ideation-copilot/skills/idea-evaluate/SKILL.md`, `plugins/ideation-copilot/skills/idea-pushback/SKILL.md`
- External docs: Exa MCP reference (context7: /websites/exa_ai), Exa API docs (context7: /llmstxt/exa_ai_llms_txt)
