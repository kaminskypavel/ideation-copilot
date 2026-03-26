---
title: "Auto-sync plugin files and fix pre-push version bump timing"
problem_type: workflow_issue
component: development_workflow
root_cause:
  - missing_workflow_step
  - logic_error
resolution_type: tooling_addition
severity: medium
date: 2026-03-26
tags:
  - git-hooks
  - pre-commit
  - pre-push
  - plugin-sync
  - version-bump
  - conventional-commits
module: githooks
category: workflow-issues
---

# Auto-sync plugin files and fix pre-push version bump timing

## Problem

Two operational pain points: (1) plugin source files in `plugins/ideation-copilot/` must be mirrored to `.claude/` for runtime, but this was a manual copy step that caused drift, and (2) the pre-push version bump hook creates a commit after git has already determined which refs to push, so the bump commit always trails by one push.

## Symptoms

- `.claude/` files silently diverge from canonical `plugins/ideation-copilot/` sources after edits
- "Unit 6: Sync .claude/ directory" appears as a manual chore in every implementation plan
- `chore: bump version` commits appear in local history but are not included in the push that triggered them — they arrive on the *next* `git push`
- Remote repository is always one bump commit behind local

## What Didn't Work

- **Manual sync**: Copy-pasting from `plugins/ideation-copilot/` to `.claude/` was error-prone and routinely forgotten. Implementation plans had to include a dedicated sync unit every time.
- **Original pre-push hook**: Git determines the refs to push *before* invoking the pre-push hook. Any commit created inside the hook is excluded from the current push. The bump commit sits locally and only gets pushed on the subsequent `git push`.

## Solution

### Pre-commit sync hook (`.githooks/pre-commit`)

Automatically mirrors staged first-party plugin files to `.claude/` on every commit:

- Finds staged files under `plugins/ideation-copilot/` using `git diff --cached --name-only --diff-filter=ACM`
- Computes `.claude/` destination by replacing the `plugins/ideation-copilot/` prefix
- Skips `plugins/ideation-copilot/.claude-plugin/` (metadata, not runtime files)
- Creates directories, copies files, and stages the copies — all part of the same commit
- Handles deletions (`--diff-filter=D`) by removing the corresponding `.claude/` file

### Fixed pre-push hook (`.githooks/pre-push`)

After creating the bump commit:

- Captures the remote name from hook arguments (`$1`) and current branch
- Re-invokes `git push "$REMOTE" "$BRANCH"` to push everything including the new bump commit
- `exit 1` to abort the original (now-redundant) push
- The existing guard clause — "skip if HEAD is already a bump commit" — prevents infinite recursion: the re-invoked push triggers pre-push again, sees HEAD is a bump, exits 0, push proceeds

## Why This Works

The pre-commit hook operates at exactly the right lifecycle point: staged changes are known but the commit hasn't been created yet. Adding more files to the index makes them part of the same commit. There is no window for drift.

The pre-push fix *replaces* the original push with a new one that includes the bump commit in its ref calculation. The original push is aborted via `exit 1` (safe, since the replacement already succeeded). The recursion guard is the key invariant: a bump commit at HEAD means "nothing to do," breaking the cycle after exactly one re-invocation.

## Prevention

- **Sync is structural, not procedural**: The pre-commit hook makes it impossible to commit a plugin change without the `.claude/` mirror updating. No documentation step to remember.
- **Push includes all local commits**: The re-push pattern ensures the remote never lags behind local.
- **Recursion bounded by convention**: The bump commit message format (`chore: bump version`) serves as both a conventional-commits tag and a recursion sentinel.
- **Hooks are in-repo**: `.githooks/` is tracked in git with `core.hooksPath=.githooks` in `.git/config`. Any contributor gets the hooks automatically.

## Key Files

- `.githooks/pre-commit` — sync hook
- `.githooks/pre-push` — version bump hook
- `.claude-plugin/marketplace.json` — version field (2 locations: `metadata.version` and `plugins[0].version`)
- `plugins/ideation-copilot/.claude-plugin/plugin.json` — version field

## Related

- Implementation plan: `docs/plans/2026-03-26-001-feat-auto-sync-and-fix-version-bump-plan.md`
- Architecture doc: `docs/solutions/architecture/shared-framework-parallel-agents.md` (describes the dual-directory layout this hook automates)
