---
name: idea:setup
description: Check and configure optional integrations for the ideation copilot. Detects API keys in settings and auto-configures MCP servers when possible.
disable-model-invocation: true
allowed-tools: Read, Glob, Bash(echo *), Bash(claude *), WebSearch, web_search_advanced_exa
---

# Setup & Integrations

Check which optional integrations are configured and auto-install what's possible.

## Protocol

### Step 1: Check Integrations

**Exa Search — check two things:**

1. **MCP server configured?** Try calling `web_search_advanced_exa` with a simple query (e.g., `query: "test", category: "company", numResults: 1`).
2. **API key available?** Check if `EXA_API_KEY` is set in the environment: `echo $EXA_API_KEY`

| MCP works? | API key exists? | Action |
|------------|----------------|--------|
| Yes | — | Status: **Configured** |
| No | Yes | **Auto-install**: run `claude mcp add --transport http exa "https://mcp.exa.ai/mcp?exaApiKey=${EXA_API_KEY}&tools=web_search_advanced_exa,crawling_exa"` then tell user to restart session |
| No | No | Status: **Not configured** — show manual setup instructions |

**WebSearch (built-in):**
Try calling `WebSearch` with a simple query.
- If it succeeds → Status: **Available**
- If it fails → Status: **Unavailable**

### Step 2: Display Status Dashboard

Present the results:

```markdown
## Ideation Copilot — Integrations

| Integration | Status | What it provides |
|-------------|--------|-----------------|
| Exa Search | [status] | Category-specific search: company, news, financial report, research paper, linkedin profile. Richer competitor and market research. |
| WebSearch | [status] | General web search for research and validation (built-in). |

**Overall:** [summary]
```

### Step 3: Auto-Install or Show Setup Instructions

**If Exa MCP was auto-installed (API key found, MCP added):**

```markdown
## Exa Search — Auto-configured!

Found `EXA_API_KEY` in your environment and registered the Exa MCP server.

**Restart your Claude Code session** for the MCP server to be picked up, then run `/idea:setup` again to verify.
```

**If Exa is not configured and no API key exists:**

```markdown
## Setting up Exa Search

Exa provides AI-optimized search with category-specific results — company databases, financial reports, news, research papers, and LinkedIn profiles. It significantly improves the quality of market and competitor research in evaluations and pushback sessions.

### 1. Get an API key

Sign up at [exa.ai](https://exa.ai) and get your API key.

### 2. Set the API key

Add `EXA_API_KEY` to your Claude Code settings:

\```bash
# In ~/.claude/settings.json, add to the "env" section:
"EXA_API_KEY": "your-key-here"
\```

### 3. Run setup again

\```
/idea:setup
\```

The setup skill will detect your API key and auto-configure the Exa MCP server.
```

### Step 4: Closing Note

```
All integrations are optional. The ideation copilot works with WebSearch alone —
enhanced integrations provide richer, more targeted research for evaluations and pushback.
```

Suggest next steps:

```
What's next?

-> /idea:new [name "description"]     — start a new idea
-> /idea:evaluate [idea-name]         — score an existing idea
-> /idea:pushback [idea-name]         — stress-test an idea
```
