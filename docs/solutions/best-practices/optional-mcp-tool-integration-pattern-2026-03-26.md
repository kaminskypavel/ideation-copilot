---
title: "Optional MCP tool integration pattern for Claude Code skills"
problem_type: best_practice
component: tooling
root_cause: missing_tooling
resolution_type: tooling_addition
severity: medium
date: 2026-03-26
tags:
  - mcp
  - exa-search
  - graceful-fallback
  - plugin-architecture
  - optional-tooling
  - reference-doc-pattern
module: plugin-integration
category: best-practices
---

# Optional MCP tool integration pattern for Claude Code skills

## Problem

A Claude Code plugin needed richer, category-specific web research (companies, financial reports, research papers, LinkedIn profiles) for its evaluation agents, but the enhanced search provider (Exa MCP) is optional — not all users have it configured. The plugin must work identically without it, just with less depth.

## Symptoms

- Evaluation agents returned generic web results lacking depth for specific research dimensions (competitor analysis, TAM sizing, founder backgrounds)
- No structured way to guide agents toward the right search category for a given query
- Exa's category-specific filters have undocumented incompatibilities (certain parameter combinations cause 400 errors), leading to silent failures
- Early attempts put Exa guidance inline in each agent, which drifted out of sync

## What Didn't Work

- **Inline guidance per agent**: Duplicated instructions across three agents. Became a maintenance burden and drifted.
- **Exa-first / default to enhanced tool**: Categories don't cover all query types. General WebSearch is still needed as baseline. Forcing Exa-first caused gaps.
- **Direct API calls via curl**: The MCP server provides a cleaner tool interface that integrates natively with Claude's tool-calling flow. Raw curl calls were fragile and bypassed the tool system.

## Solution

Four components form the reusable pattern:

### 1. Single reference doc as source of truth

Create a dedicated reference file (e.g., `references/exa-research.md`) containing all integration-specific guidance: tool names, category mappings, known filter restrictions, fallback chain, and annotation conventions. Skills load this once at startup and pass it to agents in the context block — same pattern as any shared framework doc.

### 2. "If available" instructional detection

Agents are told to use the enhanced tool "if available." No programmatic detection, no settings file inspection. The agent tries the tool; if it's not configured, it naturally falls back. This mirrors the existing `idea:new` pattern: "use X skill's methodology if available."

### 3. Three-tier graceful fallback with provenance annotation

```
Tier 1: Enhanced tool (Exa with category) → annotate "Validated via Exa [category] search"
Tier 2: Built-in tool (WebSearch)         → annotate "Validated via WebSearch"
Tier 3: No web search available           → annotate "Not empirically validated — based on docs only"
```

Every researched data point in the output carries its source annotation. This makes the research audit trail transparent and helps the user understand data quality.

### 4. Setup skill with auto-detection and auto-configuration

A `/idea:setup` skill that:
- Tests if the MCP tool is available (try a lightweight call)
- Checks if the API key exists in the environment
- If key found but MCP not configured: auto-runs `claude mcp add` with the key
- Shows a status dashboard for all optional integrations
- Provides copy-paste setup instructions for unconfigured integrations

The setup skill is a general integrations hub, not Exa-specific — extensible for future optional tools.

## Why This Works

- **Single source of truth** eliminates duplication drift — update the reference doc once, all agents inherit the change.
- **"If available" pattern** makes the enhancement purely additive. The skill works identically without the tool, just with less depth.
- **Codified filter restrictions** in the reference doc prevent agents from hitting undocumented 400 errors by trial and error.
- **Auto-setup** reduces friction from "read the docs and configure manually" to "we detected your API key and wired it up."
- **First-run nudge** (not a hard error) educates users about the enhancement without blocking their workflow.
- **Provenance annotations** make research quality visible — the user knows which findings are from category-specific search vs. generic web search vs. unvalidated.

## Prevention

When integrating any optional external tool into a Claude Code skill:

1. **Create a single reference doc** with tool semantics, known restrictions, and fallback behavior. Never scatter integration guidance across consumers.
2. **Use "if available" conditional phrasing** in agent/skill instructions so optional dependencies never become hard gates.
3. **Provide a setup/diagnostic skill** that auto-detects and auto-wires integrations rather than relying on manual configuration docs.
4. **Document known API quirks** alongside the integration (not in a separate troubleshooting doc) so they're loaded in the same context window where the tool is used.
5. **Add the MCP tools to `allowed-tools` in skill frontmatter** even though users may not have them. Listing unavailable tools is harmless; failing to list available ones blocks usage.

## Key Files

- `plugins/ideation-copilot/references/exa-research.md` — The reference doc (Exa-specific implementation of this pattern)
- `plugins/ideation-copilot/skills/idea-setup/SKILL.md` — The setup/integrations skill
- `plugins/ideation-copilot/skills/idea-evaluate/SKILL.md` — Example of a skill with enhanced tool in allowed-tools + fallback
- `docs/brainstorms/2026-03-25-exa-integration-requirements.md` — Original requirements
- `docs/plans/2026-03-25-001-feat-exa-search-integration-plan.md` — Implementation plan

## Related

- Architecture doc: `docs/solutions/architecture/shared-framework-parallel-agents.md` (describes the shared reference doc pattern this builds on)
- Workflow doc: `docs/solutions/workflow-issues/plugin-sync-and-prepush-bump-fix-2026-03-26.md` (the sync mechanism that keeps reference docs mirrored to .claude/)
