---
title: "feat: Initialize Bun project with structural tests, husky hooks, and CI"
type: feat
status: completed
date: 2026-03-26
origin: docs/brainstorms/2026-03-26-skill-testing-requirements.md
---

# feat: Initialize Bun project with structural tests, husky hooks, and CI

## Overview

Initialize a proper Bun project for the ideation-copilot plugin. Add structural tests for skill/agent validation, replace the custom `.githooks/` with husky-managed hooks (sync + version bump), and add GitHub Actions CI to run tests on every push/PR.

## Problem Frame

The plugin has no automated quality checks. Broken file references, malformed frontmatter, sync drift, and version mismatches are caught only by manual inspection. The existing `.githooks/` directory works but isn't standard — it requires manual `core.hooksPath` configuration and doesn't auto-install for new contributors. (see origin: docs/brainstorms/2026-03-26-skill-testing-requirements.md)

## Requirements Trace

- R1. Skill frontmatter validation (required fields: name, description, disable-model-invocation, allowed-tools)
- R2. Agent frontmatter validation (required fields: name, description)
- R3. Reference integrity (file paths in skill/agent bodies resolve to real files)
- R4. Dual-directory sync check (.claude/ matches plugins/ideation-copilot/)
- R5. Version consistency (marketplace.json and plugin.json versions match)
- R6. YAML frontmatter parseable without errors
- R7. GitHub Actions CI on push and PR
- R8. Replace .githooks/ with husky-managed hooks (sync + version bump)

## Scope Boundaries

- No behavioral/LLM testing — structural checks only
- No markdown prose linting
- No test coverage metrics
- No commitlint (conventional commit enforcement) — the bump hook already parses prefixes, adding commitlint is low value for one developer
- No lint-staged for now — the pre-commit hook syncs files, not linting

## Context & Research

### Relevant Code and Patterns

- **Existing hooks**: `.githooks/pre-commit` (sync) and `.githooks/pre-push` (version bump) — logic migrates to `.husky/` hooks
- **Plugin structure**: `plugins/ideation-copilot/` has skills/, agents/, references/, .claude-plugin/
- **Version files**: `.claude-plugin/marketplace.json` (2 version fields) and `plugins/ideation-copilot/.claude-plugin/plugin.json`
- **Existing package.json**: Gitignored, stub from skills CLI. Will be replaced with a real one.
- **Ecosystem pattern**: compound-engineering uses `bun test` with `.test.ts` files in a `tests/` directory

### Institutional Learnings

- The `.githooks/` approach requires `core.hooksPath` in git config — not portable. Husky auto-installs via `prepare` script on `bun install`.

## Key Technical Decisions

- **Bun as project runtime**: Already installed, matches ecosystem. `bun test` is the test runner.
- **Husky for hooks**: Standard npm/bun hook management. `prepare` script ensures hooks install on `bun install`.
- **Replace .githooks/ entirely**: Single hook system, not two. Remove `.githooks/` and the `core.hooksPath` config.
- **Tests in `tests/` directory**: Matches compound-engineering and thedotmack patterns. Files named `*.test.ts`.
- **gray-matter for YAML parsing**: Standard npm package for parsing markdown frontmatter. Lightweight, well-maintained.

## Open Questions

### Resolved During Planning

- **allowed-tools validation**: Just check for non-empty. A known list is fragile — MCP tool names vary per user's configuration.
- **File path extraction from markdown**: Use a simple regex for paths in code blocks (`` ` `` delimited) that look like relative file paths. Don't over-engineer — cover the patterns actually used in the skills.

### Deferred to Implementation

- **Bun compatibility with husky**: Bun runs `prepare` scripts on `bun install`. Verify `husky` init works correctly with Bun.
- **CI runner**: Use `ubuntu-latest` with Bun via `oven-sh/setup-bun` action. Verify action version.

## Implementation Units

- [ ] **Unit 1: Initialize Bun project and husky**

  **Goal:** Set up package.json, install husky, configure prepare script.

  **Requirements:** R8

  **Dependencies:** None

  **Files:**
  - Create: `package.json` (unignore from .gitignore)
  - Create: `.husky/pre-commit`
  - Create: `.husky/pre-push`
  - Delete: `.githooks/pre-commit`
  - Delete: `.githooks/pre-push`
  - Modify: `.gitignore` (remove package.json ignore)

  **Approach:**
  - `bun init` or create package.json manually with name, version (matching current plugin version), private: true
  - `bun add -d husky gray-matter`
  - Add `"prepare": "husky"` to scripts
  - Migrate pre-commit sync logic from `.githooks/pre-commit` to `.husky/pre-commit`
  - Migrate pre-push version bump logic from `.githooks/pre-push` to `.husky/pre-push`
  - Remove `.githooks/` directory
  - Remove `core.hooksPath` from `.git/config` (husky manages its own hooks)
  - Run `bun install` to verify husky installs correctly

  **Patterns to follow:**
  - Standard husky v9+ setup: `.husky/` directory with hook files, `prepare` script in package.json

  **Test scenarios:**
  - `bun install` on fresh clone installs husky hooks
  - Pre-commit sync works via husky (same behavior as .githooks version)
  - Pre-push version bump works via husky (same behavior as .githooks version)

  **Verification:**
  - `.husky/pre-commit` and `.husky/pre-push` exist and are executable
  - `.githooks/` directory is removed
  - `bun install` completes without errors

- [ ] **Unit 2: Create structural test suite**

  **Goal:** Implement all structural validation tests.

  **Requirements:** R1, R2, R3, R4, R5, R6

  **Dependencies:** Unit 1 (gray-matter is installed)

  **Files:**
  - Create: `tests/skill-frontmatter.test.ts`
  - Create: `tests/agent-frontmatter.test.ts`
  - Create: `tests/reference-integrity.test.ts`
  - Create: `tests/sync-check.test.ts`
  - Create: `tests/version-consistency.test.ts`

  **Approach:**
  - **skill-frontmatter.test.ts** (R1, R6): Glob all `plugins/ideation-copilot/skills/*/SKILL.md`, parse frontmatter with gray-matter, assert required fields exist and are non-empty
  - **agent-frontmatter.test.ts** (R2, R6): Glob all `plugins/ideation-copilot/agents/**/*.md`, parse frontmatter, assert `name` and `description` present
  - **reference-integrity.test.ts** (R3): Read each skill and agent file, extract paths from markdown code blocks (regex for lines that look like `references/*.md` or relative paths), verify each resolves to a real file relative to `plugins/ideation-copilot/`
  - **sync-check.test.ts** (R4): For every first-party file under `plugins/ideation-copilot/` (excluding `.claude-plugin/`), verify a byte-identical file exists under `.claude/`
  - **version-consistency.test.ts** (R5): Read marketplace.json and plugin.json, assert all version fields match

  **Patterns to follow:**
  - Bun test API: `describe`, `test`, `expect` (built-in, no imports needed)
  - compound-engineering test style: descriptive test names, one assertion per concept

  **Test scenarios:**
  - All tests pass on current codebase (baseline green)
  - Remove a required frontmatter field → skill-frontmatter test fails
  - Add a broken reference path → reference-integrity test fails
  - Desync a `.claude/` file → sync-check test fails
  - Change version in one file but not the other → version-consistency test fails

  **Verification:**
  - `bun test` passes with all tests green
  - Each test file covers its requirement

- [ ] **Unit 3: Add GitHub Actions CI**

  **Goal:** Run tests automatically on every push and PR.

  **Requirements:** R7

  **Dependencies:** Unit 2 (tests exist to run)

  **Files:**
  - Create: `.github/workflows/ci.yml`

  **Approach:**
  - Trigger on push to main and pull_request to main
  - Use `oven-sh/setup-bun` action for Bun installation
  - Steps: checkout → setup bun → bun install → bun test
  - Single job, simple pipeline — no matrix, no caching needed (tests are fast)

  **Patterns to follow:**
  - compound-engineering CI: `.github/workflows/ci.yml` with Bun setup
  - adversarial-spec CI: simple lint + test pipeline

  **Test scenarios:**
  - Push to main triggers CI and passes
  - PR with a broken frontmatter field triggers CI and fails

  **Verification:**
  - `.github/workflows/ci.yml` exists with correct triggers
  - CI runs successfully on push

## System-Wide Impact

- **Hook migration**: Replacing `.githooks/` with `.husky/` changes the hook installation mechanism. Contributors must run `bun install` instead of relying on `core.hooksPath`. This is more standard but requires Bun to be installed.
- **package.json tracked**: Previously gitignored. Now tracked as the project manifest. Version in package.json should match plugin version.

## Risks & Dependencies

- **Bun + husky compatibility**: Husky v9 works with Bun's `prepare` script. If it doesn't, fallback to `bun run husky` in prepare.
- **gray-matter dependency**: Adds a runtime dev dependency. It's well-maintained and small. Alternative: parse YAML frontmatter manually, but gray-matter is more robust.
- **Contributors need Bun**: The project now requires Bun for development. This is a reasonable requirement given the ecosystem.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-03-26-skill-testing-requirements.md](docs/brainstorms/2026-03-26-skill-testing-requirements.md)
- Ecosystem patterns: compound-engineering tests (`tests/*.test.ts`), adversarial-spec CI (`.github/workflows/ci.yml`)
- Husky docs: https://typicode.github.io/husky/
