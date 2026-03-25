# Exa Research Guide

Optional enhanced research layer for business idea evaluation. When the Exa MCP server is configured, use its category-specific search for targeted queries. When unavailable, fall back to WebSearch. This guide is used alongside the evaluation framework.

## Available Tools

Two Exa tools are relevant for business research:

- **`web_search_advanced_exa`** — Category-specific web search with filtering. Use this for all structured research queries.
- **`crawling_exa`** — Live-crawl a specific URL for fresh content. Use this when verifying a claim from a URL the user provides.

Do **not** use `web_search_exa` or `get_code_context_exa` — they are not relevant for business research.

## Categories

Each category focuses results on a specific content type. Use the category that matches your research need.

| Category | What it finds | When to use |
|----------|--------------|-------------|
| `company` | Company websites, about pages, product pages | Competitor discovery, company lists, funding research |
| `financial report` | SEC filings, earnings reports, annual reports | Revenue data, financial performance, investor presentations |
| `news` | News articles, press coverage, announcements | Market trends, recent developments, regulatory changes |
| `research paper` | Academic papers, industry reports, analyses | TAM studies, market analyses, technology adoption data |
| `linkedin profile` | Professional profiles, career histories | Founder backgrounds, team assessment, domain expertise |
| `tweet` | Social media posts, public discussions | Market sentiment, customer complaints, founder visibility |

When no category fits the query, omit the category parameter and use `type: "auto"` for general web results — or fall back to WebSearch.

## Query Patterns

### Company and Competitor Research
```
web_search_advanced_exa: query="[competitor name] funding rounds valuation", category="company", numResults=10
web_search_advanced_exa: query="[industry] startups [region]", category="company", numResults=20
```

### Financial Data
```
web_search_advanced_exa: query="[company] 10-K annual report", category="financial report", numResults=10, includeDomains=["sec.gov"]
web_search_advanced_exa: query="Q4 2025 earnings [industry]", category="financial report", startPublishedDate="2025-10-01", numResults=15
```

### Market Trends and News
```
web_search_advanced_exa: query="[industry] market trends 2026", category="news", startPublishedDate="2026-01-01", numResults=15
web_search_advanced_exa: query="[regulatory topic] new regulation", category="news", numResults=10
```

### Industry Research
```
web_search_advanced_exa: query="[industry] market size TAM analysis", category="research paper", numResults=10
web_search_advanced_exa: query="[technology] adoption curve enterprise", category="research paper", numResults=10
```

### Founder and Team Research
```
web_search_advanced_exa: query="[founder name] [company] background", category="linkedin profile", numResults=10
```

## Agent Category Map

Each evaluation agent should prefer specific categories for their dimensions:

### VC Agent
| Dimension | Exa category | Fallback |
|-----------|-------------|----------|
| TAM | `research paper` | WebSearch for market reports |
| Competition/Moat | `company` | WebSearch for competitor landscape |
| Traction/Validation | `company`, `news` | WebSearch for traction signals |
| Business Model | `financial report` | WebSearch for pricing benchmarks |
| Timing | `news` | WebSearch for trend data |
| Team, Technology, GTM | — | WebSearch (no specific Exa category advantage) |

### Market Analyst Agent
| Dimension | Exa category | Fallback |
|-----------|-------------|----------|
| Market Size & Growth | `research paper` | WebSearch for industry analyses |
| Competitive Landscape | `company` | WebSearch for competitor lists |
| Timing & Tailwinds | `news` | WebSearch for trend data |
| Customer Accessibility | — | WebSearch for forums, review sites, complaint patterns |
| Regulatory/Macro Risk | `news` | WebSearch for regulations, compliance requirements |

### YC Founder-Fit Agent
| Dimension | Exa category | Fallback |
|-----------|-------------|----------|
| Idea Space Fertility | `company` | WebSearch for funded startups in category |
| Founder-Market Fit | `linkedin profile` | WebSearch for founder backgrounds |
| Competition Presence | `company` | WebSearch for competitor landscape |
| Recent Possibility/Necessity | `news` | WebSearch for enabling changes |
| Successful Proxies | `company` | WebSearch for similar companies in other regions |
| Other dimensions | — | WebSearch |

### Pushback Skill
Use any category that fits the claim being researched. Additionally, use `crawling_exa` to live-crawl specific URLs when verifying a claim from a link the user provides.

## Filter Restrictions

These combinations cause 400 errors. Avoid them.

| Category | Restricted filters |
|----------|-------------------|
| `company` | `includeDomains`, `excludeDomains`, `startPublishedDate`, `endPublishedDate`, `startCrawlDate`, `endCrawlDate` |
| `linkedin profile` | `startPublishedDate`, `endPublishedDate`, `startCrawlDate`, `endCrawlDate`, `includeText`, `excludeText`, `excludeDomains`. Only `includeDomains` with LinkedIn domains (e.g., "linkedin.com") is allowed. |
| `financial report` | `excludeText` is not supported (causes 400). `includeText` works but only single-item arrays. |

**General restriction:** `includeText` and `excludeText` only accept **single-item arrays** across all categories. Multi-item arrays cause 400 errors.

When a filter is needed but restricted for the chosen category, either drop the filter or switch to WebSearch for that specific query.

## Fallback Chain

Use this three-tier degradation strategy:

1. **Exa available** → Use `web_search_advanced_exa` with the appropriate category for structured queries. Annotate findings: *"Validated via Exa [category] search"*
2. **Exa unavailable, WebSearch available** → Use WebSearch for all research. Annotate: *"Validated via WebSearch"*
3. **No web search available** → Fall back to doc-only analysis. Annotate: *"Not empirically validated — based on idea docs only"*

### Detection

Do not check configuration files or settings. Simply use the "if available" approach:
- Try `web_search_advanced_exa` for your first research query
- If the tool is not available or the call fails, switch to WebSearch for the remainder of the session
- Note the fallback once: "Exa search unavailable — using WebSearch for research."

### Annotation Convention

Every researched data point in the evaluation output should indicate its source:

- **Exa result**: "Searched via Exa [category]: [what you searched for]. Found: [result with citation]."
- **WebSearch result**: "Searched via WebSearch: [what you searched for]. Found: [result with citation]."
- **No result**: "Searched for [X] but couldn't find reliable sources. Marking as an evidentiary gap."
- **Doc-only**: "Based on idea docs — not empirically validated."

This makes the research audit trail transparent and helps the user understand the quality of each data point.
