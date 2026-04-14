# Actually Vulnerable: A Founder's Post-Mortem on 18 Months of Solo Building

I built AI governance infrastructure for 18 months. Solo. No funding. No co-founder.

The product works. The engineering is solid. The distribution is broken.

I'm sharing this because I think the honest version of building in public is more useful than the highlight reel. Every founder I respect has had this conversation with themselves.

## The Gap

I kept watching enterprises deploy consequential AI — loan approvals, medical triage, hiring — with no ability to explain the decision afterward.

The EU AI Act enforcement date is August 2, 2026. Article 14 requires human oversight audit trails. Article 12 requires logging of AI operations.

I've spoken to CTOs at financial services firms who are using Excel to track this.

Not because they're lazy. Because nothing they've evaluated actually produces proof. Just dashboards.

The difference matters when a regulator asks to see the reasoning chain, not the output summary.

So I built it. Every AI decision produces a self-contained HTML file: reasoning chain, dissenting opinions, dual cryptographic signatures, a Merkle proof, and a standalone JavaScript verifier. No Datacendia account required to verify it. No server call. No trust in us.

## What I Got Wrong

**Being right ≠ being found**

I assumed that if I built the right thing for the right problem, people would find it. They didn't. I spent 18 months in the code and zero days on distribution. The gap between "technically correct" and "actually discovered" is vast.

**Open source stars ≠ pipeline**

I got stars on GitHub. That felt good. It didn't translate to conversations with CTOs or CLOs. Stars are vanity metrics in regtech. The people who buy compliance tools don't browse GitHub repos for fun.

**SOC 2 was a blocker**

I talked to enterprises who said "we love this, but we need SOC 2." I don't have SOC 2. I'm one person. I can't get SOC 2. I built an offline license system for air-gapped deployments, but I can't check the SOC 2 box. That's a real blocker I didn't anticipate.

**Too many features**

I built 14 agents, 5 frameworks, 4 deployment modes. A CTO looks at that and sees complexity, not capability. I should have shipped one thing that solved one problem for one person, then iterated.

## What I'd Do Differently

Start with distribution. Ship the README before the code. Talk to 50 CTOs before writing the first line of infrastructure. Build in public from day one, not after 18 months of silence.

The engineering is the easy part. The hard part is getting found by the people who actually have the problem.

## Why I'm Posting This

If you're deploying AI in regulated decisions and staring down EU AI Act, Basel III, or HIPAA — I want to talk. Not to sell. To find out if what I built solves the problem you actually have.

If you're a founder building in the dark, wondering if anyone will ever care — you're not alone. The honest conversations are the ones that actually help.

---

**Posting Notes:**

- Subreddit: r/SaaS + r/entrepreneur (cross-post shorter version to r/entrepreneur, cut to 300 words)
- Timing: 9-11am EST weekday
- Add GitHub link as first comment, not in body
- Reply to every comment same day
- Don't edit after posting
