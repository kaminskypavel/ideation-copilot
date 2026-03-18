---
name: idea:new
description: Scaffold a new disruptive business idea folder with structured templates for brainstorming, lean canvas, hidden assumptions, PMF strategy, and testing plan. Use when the user wants to start working on a new business idea.
argument-hint: [idea-name "short description"]
disable-model-invocation: true
allowed-tools: Bash(mkdir *), Write, Read, Glob
---

# New Idea

Scaffold a new business idea folder with structured documents to guide ideation through validation.

## Workflow

### Step 1: Parse Arguments

Extract the idea name and optional description from ``.

- If no arguments, ask the user for an idea name and one-line description
- Sanitize the idea name to lowercase-kebab-case for the folder name
- Use today's date as prefix: `YYYY-MM-DD-idea-name`

### Step 2: Create Folder Structure

Create the following under `ideas/`:

```
ideas/YYYY-MM-DD-idea-name/
├── 00-overview.md
├── 01-brainstorm.md
├── 02-lean-canvas.md
├── 03-assumptions.md
├── 04-pmf-strategy.md
└── 05-experiments.md
```

### Step 3: Generate Each Document

Use the templates in [templates.md](templates.md) to generate each file. Fill in as much as possible from the idea description. Leave sections the user needs to think about with `<!-- TODO: ... -->` markers.

For the brainstorm document, use the installed `brainstorm-ideas-new` skill's methodology if available.

For the lean canvas, use the installed `lean-canvas` skill's framework if available.

For PMF strategy, use the installed `pmf-strategy` skill's framework if available.

### Step 4: Summary

After creation, output:
1. The folder path
2. A brief table of all created documents with their purpose
3. Show the idea workflow loop:
   - `/idea:challenge idea-name` — stress-test the idea
   - `/idea:forge idea-name` — integrate findings and harden the docs
   - Repeat until confident or killed

## Success Criteria
- [ ] All 6 files created with meaningful starter content
- [ ] Folder name follows `YYYY-MM-DD-idea-name` convention
- [ ] Each document is actionable, not just empty headers
