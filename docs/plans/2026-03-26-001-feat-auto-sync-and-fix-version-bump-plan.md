---
title: "feat: Auto-sync .claude/ and fix pre-push version bump"
type: feat
status: completed
date: 2026-03-26
---

# feat: Auto-sync .claude/ and fix pre-push version bump

## Overview

Two developer-experience fixes: (1) automatically sync first-party files from `plugins/ideation-copilot/` to `.claude/` on every commit, eliminating manual copies; (2) fix the pre-push version bump hook so the bump commit is included in the same push, not trailing by one.

## Problem Frame

The plugin has files in two locations: `plugins/ideation-copilot/` (canonical source) and `.claude/` (runtime copy Claude Code reads from). These must stay byte-identical for first-party content. Currently synced by manual `cp` commands — fragile and easy to forget.

The pre-push hook creates a version bump commit during `git push`, but git calculates which refs to send *before* the hook runs. So the bump commit stays local and only gets pushed on the next `git push`. This causes trailing bump commits in the history.

## Requirements Trace

- R1. Every commit that changes files under `plugins/ideation-copilot/` automatically includes the corresponding `.claude/` copies
- R2. `git push` sends the version bump commit in the same push, not the next one

## Scope Boundaries

- No package.json changes — keep version source of truth in marketplace.json + plugin.json
- No commitlint or commit message enforcement tooling
- No changes to the conventional commit parsing logic — it works correctly
- Sync is one-directional: `plugins/ideation-copilot/` → `.claude/`. Changes to `.claude/` directly are not synced back.

## Key Technical Decisions

- **Pre-commit hook for sync**: Runs before every commit. Detects staged files under `plugins/ideation-copilot/`, copies each to the corresponding `.claude/` path, and stages the copies. This means `.claude/` changes are part of the same commit, not a separate one.
- **Fix pre-push by re-invoking push**: After creating the bump commit, the hook re-invokes `git push` with the same remote and branch. The existing guard clause (skip if HEAD is a bump commit) prevents infinite recursion. The inner push succeeds with the bump included, the outer push becomes a no-op.

## Open Questions

### Deferred to Implementation

- **Stdin handling in recursive push**: The pre-push hook receives ref info on stdin. The re-invoked `git push` may also trigger pre-push which reads stdin. Verify the guard clause exits before stdin is read on the second invocation.
- **New directory creation in sync**: If a new skill directory is created under `plugins/ideation-copilot/skills/`, the sync needs to `mkdir -p` the corresponding `.claude/skills/` directory. Test with a new skill.

## Implementation Units

- [ ] **Unit 1: Create pre-commit hook for .claude/ sync**

  **Goal:** Automatically copy staged first-party plugin files to `.claude/` on every commit.

  **Requirements:** R1

  **Dependencies:** None

  **Files:**
  - Create: `.githooks/pre-commit`

  **Approach:**
  - Use `git diff --cached --name-only --diff-filter=ACM` to find staged files under `plugins/ideation-copilot/`
  - For each file, compute the `.claude/` destination by replacing `plugins/ideation-copilot/` prefix with `.claude/`
  - Skip files under `plugins/ideation-copilot/.claude-plugin/` — these are plugin metadata, not runtime files
  - `mkdir -p` the destination directory, `cp` the file, `git add` the copy
  - Also handle deleted files (`--diff-filter=D`): if a file is deleted from `plugins/ideation-copilot/`, delete the corresponding `.claude/` file and stage the deletion
  - Keep the script minimal — no dependencies beyond git and standard Unix tools

  **Patterns to follow:**
  - `.githooks/pre-push` — same directory, same shebang/style, same `set -euo pipefail` pattern

  **Test scenarios:**
  - Modify a skill SKILL.md → commit → `.claude/` copy is updated in the same commit
  - Create a new skill directory → commit → `.claude/` directory and files are created
  - Delete a skill → commit → `.claude/` copy is removed
  - Commit that doesn't touch `plugins/ideation-copilot/` → hook is a no-op
  - Files under `plugins/ideation-copilot/.claude-plugin/` are NOT synced

  **Verification:**
  - `git diff --name-only HEAD` after a commit shows both `plugins/` and `.claude/` paths
  - `diff -rq plugins/ideation-copilot/skills/ .claude/skills/` shows no differences after any commit

- [ ] **Unit 2: Fix pre-push hook to include bump in same push**

  **Goal:** The version bump commit is included in the current push, not the next one.

  **Requirements:** R2

  **Dependencies:** None (independent of Unit 1)

  **Files:**
  - Modify: `.githooks/pre-push`

  **Approach:**
  - After creating the bump commit (line 80), capture the remote name and branch from the hook's arguments
  - Re-invoke `git push <remote> <branch>` to push everything including the new bump commit
  - Then `exit 0` to let the original push complete (it will be a no-op since everything is already pushed)
  - The existing guard clause at line 41 (`skip if HEAD is a bump commit`) prevents infinite recursion: the re-invoked push triggers pre-push → sees HEAD is a bump → exits 0 → push proceeds
  - Preserve stdin reading for the original invocation but ensure the recursive call doesn't need it

  **Patterns to follow:**
  - Existing `.githooks/pre-push` — extend, don't rewrite

  **Test scenarios:**
  - `git push` with pending feat commit → bump commit created AND pushed in one operation
  - `git push` with only a bump commit at HEAD → no double-bump, push proceeds normally
  - `git push` with no new commits → no bump, push proceeds normally
  - Verify no infinite recursion: push completes in bounded time

  **Verification:**
  - After `git push`, `git log origin/main..HEAD` shows nothing (no trailing bump)
  - `git log --oneline -3` shows the bump commit immediately after the feature commit, both on remote

## Risks & Dependencies

- **Recursive push in hook**: If the guard clause fails or doesn't match, infinite recursion could occur. Mitigated by the existing skip-if-bump check and the `set -euo pipefail` which would abort on errors.
- **Merge conflicts in .claude/**: If someone edits `.claude/` directly, the pre-commit sync could cause conflicts. Mitigated by scope boundary: sync is one-directional, editing `.claude/` directly is not supported.

## Sources & References

- Existing hook: `.githooks/pre-push`
- Git hook docs: core.hooksPath configuration in `.git/config`
