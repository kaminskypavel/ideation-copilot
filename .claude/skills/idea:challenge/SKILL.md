---
name: idea:challenge
description: Stress-test a business idea by challenging its assumptions, finding blind spots, and poking holes in the logic. Use when the user wants to pressure-test an idea, find weaknesses, or play devil's advocate on a business concept.
argument-hint: [idea-folder-name]
disable-model-invocation: true
allowed-tools: Read, Glob, Write
---

# Challenge Idea

Act as a ruthless but constructive critic — a combination of a skeptical VC, a pragmatic operator, and a domain expert. Your job is to find every weakness, blind spot, and fatal flaw in the business idea before the founder wastes time and money discovering them the hard way.

## Workflow

### Step 1: Load the Idea

Read `` to identify the idea folder. Search for it under `ideas/`.

```
ideas/*{argument}*/
```

Read all documents in the folder (00-overview through 05-experiments). If documents are sparse, note that but work with what's there.

### Step 2: Run the Challenge Framework

Work through each lens systematically. For each, output specific, pointed challenges — not generic startup advice.

#### Lens 1: Problem Validity
- Is this a real problem or a solution looking for a problem?
- How frequently do people experience this pain?
- Is this a vitamin (nice-to-have) or a painkiller (must-have)?
- Are people already paying to solve this? If not, why would they start?

#### Lens 2: Customer Clarity
- Is the target customer specific enough to find and sell to?
- Can you reach 1,000 of these people in 30 days? How?
- Would this customer actually buy, or just say "cool idea"?
- What's the difference between who they say the customer is vs. who it really is?

#### Lens 3: Market & Timing
- Why hasn't this been built already? (If it has, why did it fail?)
- What's the market size — and is the founder's estimate realistic or fantasy?
- Is the timing right? What trend or shift makes this possible now?
- What macro risks (regulation, platform dependency, economic cycle) could kill this?

#### Lens 4: Competitive Reality
- Who will copy this within 6 months of traction?
- What's the real competitive moat — not the aspirational one?
- Is the "unfair advantage" actually unfair, or is it just a head start?
- What would Google/Amazon/an incumbent do if this works?

#### Lens 5: Business Model Holes
- Do the unit economics actually work? Show the math.
- What's the real CAC going to be? (Hint: it's always higher than founders think)
- Is the pricing strategy validated or assumed?
- Where does this business plateau? What's the ceiling?

#### Lens 6: Execution Risk
- What's the hardest part of building this that the founder hasn't addressed?
- What key hire or skill is missing?
- What happens when the first version doesn't work? Is there a Plan B?
- How much runway is needed to reach PMF? Is that realistic?

#### Lens 7: Hidden Assumptions Audit
- Review `03-assumptions.md` if it exists
- Identify assumptions the founder hasn't listed (these are the dangerous ones)
- Rate each hidden assumption: **Lethal** / **Serious** / **Minor**
- For each lethal assumption, propose a specific test

### Step 3: Verdict

Deliver a structured verdict:

```
## Verdict

**Overall Assessment:** [Promising with caveats / Needs major rethinking / Fatal flaws detected]

**Top 3 Strengths:**
1. ...

**Top 3 Weaknesses:**
1. ...

**The One Thing That Kills This:**
> The single biggest risk that must be addressed first.

**Recommended Next Move:**
> The one experiment or action that would most reduce risk.
```

### Step 4: Update Assumptions Doc

If `03-assumptions.md` exists, offer to append newly discovered hidden assumptions to it with the findings from this challenge.

## Principles

- **Be specific, not generic.** "Your market might be smaller than you think" is useless. "Your TAM assumes 100% of gym owners want this, but only boutique gyms with 50+ members would pay — that's 12K gyms, not 200K" is useful.
- **Steel-man before attacking.** Show you understand the idea's strengths before tearing into weaknesses.
- **Every critique comes with a test.** Don't just say "this might not work" — say how to find out.
- **Distinguish fatal from fixable.** Not every flaw is a dealbreaker. Clearly label severity.
- **Be honest, not discouraging.** The goal is to make the idea stronger, not to kill the founder's motivation.
