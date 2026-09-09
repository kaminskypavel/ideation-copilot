# ideation-copilot

Skills for turning a raw idea into a validated, investor-ready concept. Full rules live in [`plugins/ideation-copilot/skills/`](plugins/ideation-copilot/skills/).

| Skill | Does |
|---|---|
| `idea:new` | Scaffold 6 docs under `ideas/YYYY-MM-DD-name/` |
| `idea:evaluate` | Score via VC / market / YC agents |
| `idea:pushback` | Adversarial stress-test |
| `idea:update` | Fold new evidence into the docs |
| `idea:forge` | Synthesize a pitch-ready summary |
| `idea:postmortem` | Structured debrief when you kill it |
| `idea:setup` | Optional Exa (and friends) |

Claude: `/idea:new`. Codex: `@idea:new`. Pi: `/skill:idea-new` or just ask.

Evaluate: parallel agents if the harness has an Agent/subagent tool; else sequential in-session, same prompts, same files under `agents/evaluate/`.

References: `plugins/ideation-copilot/references/` (or `references/` from the plugin root).
