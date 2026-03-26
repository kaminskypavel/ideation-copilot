---
date: 2026-03-26
topic: skill-testing
---

# Structural Testing for Ideation Copilot Skills

## Problem Frame

The ideation-copilot plugin is pure markdown/JSON — no compiled code. Regressions are structural: broken file references, malformed frontmatter, sync drift between `plugins/ideation-copilot/` and `.claude/`, version mismatches. There's no automated way to catch these before they reach users. The plugin ecosystem (compound-engineering, adversarial-spec, thedotmack) has mature test suites, but they test code. This plugin needs a testing approach adapted for prompt-only content.

## Requirements

- R1. **Skill frontmatter validation** — Every SKILL.md under `plugins/ideation-copilot/skills/` must have valid YAML frontmatter with required fields: `name`, `description`, `disable-model-invocation`, `allowed-tools`. Values must be non-empty strings.

- R2. **Agent frontmatter validation** — Every `.md` file under `plugins/ideation-copilot/agents/` must have valid YAML frontmatter with `name` and `description`.

- R3. **Reference integrity** — Every file path referenced in skill and agent bodies (paths in code blocks like `references/evaluation-framework.md`, `references/exa-research.md`) must resolve to an actual file relative to `plugins/ideation-copilot/`.

- R4. **Dual-directory sync** — Every first-party file under `plugins/ideation-copilot/` (excluding `.claude-plugin/`) must have a byte-identical copy under `.claude/`.

- R5. **Version consistency** — The `version` field in `.claude-plugin/marketplace.json` (both `metadata.version` and `plugins[0].version`) and `plugins/ideation-copilot/.claude-plugin/plugin.json` must all match.

- R6. **YAML frontmatter parseable** — All markdown files with `---` frontmatter must parse without errors.

- R7. **GitHub Actions CI** — Tests run automatically on every push and PR to main.

## Success Criteria

- `bun test` passes on a clean checkout
- A broken file reference, missing frontmatter field, or sync drift causes a test failure
- CI blocks PRs with structural regressions

## Scope Boundaries

- No behavioral/LLM testing — we don't invoke Claude to test skill output
- No markdown lint beyond frontmatter parsing — prose quality is a human concern
- No test coverage metrics — structural tests are binary (pass/fail)
- No snapshot testing of skill output

## Key Decisions

- **Bun test**: Matches compound-engineering and thedotmack patterns. Fast, zero-config, built-in assertions.
- **Structural only**: Test what's deterministic (file existence, schema, sync). Don't test what requires LLM invocation.
- **GitHub Actions CI**: Run on push and PR. Follows adversarial-spec and compound-engineering patterns.

## Outstanding Questions

### Deferred to Planning
- [Affects R1][Technical] Should `allowed-tools` values be validated against a known list, or just checked for non-empty? Known list is more robust but needs maintenance.
- [Affects R3][Needs research] What's the best regex/approach for extracting file paths from markdown code blocks? Need to handle both inline paths and code-fenced paths.
- [Affects R7][Technical] Should CI also validate that the pre-commit sync hook is installed (core.hooksPath is set)?

## Next Steps

-> `/ce:plan` for structured implementation planning
