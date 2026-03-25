---
date: 2026-03-25
topic: exa-integration
---

# Exa Search Integration for Ideation Copilot

## Problem Frame

The ideation-copilot evaluation agents and pushback skill rely on `WebSearch` for market research, competitor analysis, and claim verification. WebSearch returns generic web results that agents must manually interpret. Exa's API provides category-specific search (`company`, `news`, `financial report`, `research paper`, `linkedin profile`, `tweet`), domain filtering, date-range filtering, and highlights extraction — capabilities that directly map to what the agents already need. Users who configure Exa should get meaningfully richer research; users who don't should experience zero degradation.

## Requirements

- R1. **New reference doc (`references/exa-research.md`)** — Contains all Exa-specific guidance: tool names, category mappings, query patterns, filter restrictions, and the fallback chain. Agents and skills include this alongside the existing evaluation framework. Single place to maintain Exa knowledge.

- R2. **Category-specific Exa usage per agent** — When `web_search_advanced_exa` is available, agents use it for queries that match an Exa category. When a query doesn't fit a category, agents use `WebSearch` as before. Both tools are active simultaneously, selected per-query.
  - **VC agent**: `company` (competitor/funding research), `financial report` (SEC filings, earnings data)
  - **Market analyst**: `company` (competitor discovery), `news` (trends, recent developments), `research paper` (industry reports, TAM studies)
  - **YC founder-fit**: `company` (idea space fertility), `linkedin profile` (founder/team research)
  - **Pushback skill**: all categories as appropriate per claim, plus `crawling_exa` for live URL verification

- R3. **Graceful fallback chain** — `web_search_advanced_exa` > `WebSearch` > doc-only analysis. Each level notes what it couldn't verify. The reference doc includes a detection heuristic: if an Exa tool call fails or isn't available, switch to `WebSearch` for the remainder of the session and note "Exa unavailable — falling back to WebSearch."

- R4. **New `/idea:setup` skill** — A general integrations hub that checks optional tool availability and guides configuration.
  - Shows a status dashboard: Exa (configured/not), Tavily (configured/not), future integrations
  - For each unconfigured integration, provides setup instructions (MCP server URL, API key placement)
  - Exa setup: `claude mcp add --transport http exa "https://mcp.exa.ai/mcp?exaApiKey=YOUR_KEY&tools=web_search_advanced_exa,crawling_exa"`
  - Non-blocking — all integrations are optional enhancements

- R5. **Allowed-tools updates** — Add `web_search_advanced_exa` and `crawling_exa` to the allowed-tools list for `idea:evaluate` and `idea:pushback` skill frontmatter. These are additive — existing `WebSearch`/`WebFetch` stay.

- R6. **First-run nudge in evaluate/pushback** — When an agent detects that Exa tools are not available during research, append a single note at the end of the evaluation output: "Tip: Run `/idea:setup` to configure Exa search for richer market and competitor data." One-time per evaluation, not per query.

## Success Criteria

- An agent with Exa configured uses `category: "company"` for competitor queries and `category: "news"` for trend queries, producing more targeted research than generic WebSearch
- An agent without Exa configured produces identical quality to today's output, plus a single setup hint
- `/idea:setup` correctly detects whether Exa MCP is configured and provides actionable setup steps when it isn't
- No regressions: all existing evaluate/pushback flows work unchanged when Exa is absent

## Scope Boundaries

- No structured summary schemas (JSON extraction) — agents interpret results as text, same as WebSearch today. Can add schemas later.
- No `findSimilar` endpoint integration in this pass — valuable for competitive landscape but adds API surface. Defer.
- No Exa SDK or direct API calls — MCP server only
- `/idea:setup` does not auto-configure anything — it shows status and provides copy-paste instructions
- `get_code_context_exa` and `web_search_exa` are excluded — not relevant for business research

## Key Decisions

- **Exa guidance in a new reference doc** (`references/exa-research.md`), not inlined in each agent: single source of truth, agents already load reference docs
- **Category-specific usage, not Exa-first**: agents pick the right tool per query rather than defaulting to Exa for everything. WebSearch remains valuable for general queries without a clear Exa category.
- **MCP server approach, not direct API**: Exa's official Claude integration, no curl/Bash needed, auth handled via URL parameter
- **`/idea:setup` as general integrations hub**: future-proofs for Tavily and other optional tools, gives the plugin a proper onboarding surface
- **No structured schemas for now**: keeps the change minimal and avoids maintaining extraction schemas across agents

## Dependencies / Assumptions

- Exa MCP server at `https://mcp.exa.ai/mcp` remains available and stable
- `web_search_advanced_exa` supports the documented categories: `company`, `news`, `financial report`, `research paper`, `linkedin profile`, `tweet`
- Claude Code's allowed-tools mechanism correctly gates MCP tool access per skill
- Filter restrictions documented by Exa (e.g., `excludeText` not supported with `financial report` category, domain filters cause 400 with `company` category) are still current

## Outstanding Questions

### Deferred to Planning
- [Affects R1][Needs research] What's the exact detection mechanism for "Exa is available"? Is it a try-catch on the first call, checking MCP server list, or something else?
- [Affects R2][Technical] Should agents use `additionalQueries` for query variation (Exa feature for parallel query variants), or keep single queries for simplicity?
- [Affects R4][Technical] How does `/idea:setup` detect configured MCP servers? Is there a Claude Code API for this or does it need to check settings files directly?
- [Affects R2][Needs research] Exa docs warn that `includeDomains`/date filters cause 400 errors with `category: "company"`. Need to document all category-filter incompatibilities in the reference doc.

## Next Steps

-> `/ce:plan` for structured implementation planning
