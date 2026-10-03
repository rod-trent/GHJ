# GitHub Security Lab — research brief

Grounding for "why the Security Lab," your behavioral answers, and your questions.
**Re-verify the live numbers on [securitylab.github.com](https://securitylab.github.com/)
the morning of** — stats move. Dates below are as of this prep.

> Reminder: the role is **Developer Advocate** on the Security Lab. The whole loop is
> effectively a DevRel audition — they're watching *how you teach and tell the story* as
> much as what you know. Frame your motivation around **enabling the community**, not just
> doing research yourself.

## Mission (say it in your words, don't quote the website)
GitHub Security Lab exists to **secure the world's open-source code by mobilizing the global
security community** — not by trying to review everything themselves. The founding framing
(2019) named three structural problems, and they're still the best way to explain *why* the
Lab exists:
- **Scale** — the JavaScript ecosystem alone has 1M+ packages; nobody can hand-audit that.
- **Expertise shortage** — developers outnumber security pros by roughly 500:1.
- **Coordination** — the world's security experts are scattered across thousands of orgs.

The Lab's answer: **encode security expertise so it scales** (CodeQL queries, models,
advisories) and **build a community** that contributes it. That's the thread connecting
every program below — and it's exactly the thread in both your talks.

## What they actually do (programs to name)
- **CodeQL** — the "code as data" engine. The Lab writes and curates queries, and —
  key for a DevRel role — helps *the community* write them. (Your Talk 1.)
- **Bug bounty for queries, not just bugs** — a distinctive idea worth calling out: they
  pay researchers for **CodeQL queries that find a whole *class* of vulnerability**, so one
  submission protects everyone via code scanning. "Eradicate at scale," not one-off bugs.
- **GitHub Advisory Database / GHSA** — tens of thousands of curated advisories; the backbone
  of Dependabot alerts. (One of your two original topic options.)
- **Multi-Repository Variant Analysis (MRVA)** — run a CodeQL query across *thousands* of
  repos at once to find every instance of a pattern ecosystem-wide. The literal embodiment
  of "find the bug class, not just the bug."
- **CodeQL community packs** & the **CodeQL "Wall of Fame"** — community-contributed queries
  and recognition for researchers who find CVEs with variant analysis.
- **Security Lab Taskflow Agent** — newer, AI-assisted vulnerability triage (LLM taskflows
  over CodeQL alerts). Shows where they're heading: AI + static analysis. (A topic option.)
- **The Secure Code Game** — an in-repo, gamified secure-coding learning experience. Pure
  DevRel/education. (A topic option.)
- **Education & community** — AppSec training, office hours for maintainers, and research
  published on the blog + Bluesky/Mastodon/LinkedIn.
- **Supply-chain hardening** — the npm + Actions work in your Talk 2 is the Lab/GitHub
  security org's current frontier.

## Headline stats (verify live; use ranges, don't overclaim)
- ~**1,200+ vulnerabilities** found by the Lab, with ~**900+ CVEs** credited to their work.
- **35,500+** curated security advisories in the GitHub Advisory Database.
- Bug-bounty rewards historically up to the **~$5–6K** range for high-value query work.
- Began at **GitHub Universe 2019**; launched with partners incl. Microsoft, Google, Mozilla,
  Oracle, Uber, VMware, Trail of Bits, NCC Group, F5, J.P. Morgan.
(Sources: securitylab.github.com; github.blog; the 2019 launch post.)

## Proof points you can drop into an answer
- CodeQL variant analysis found **RCE in high-profile Java apps (2020)**, which chained into
  fixing a critical vuln in **Germany's COVID-19 response infrastructure** — a clean "one
  query → broad real-world impact" story.
- Variant analysis has been pointed at the **Linux kernel and Chromium**.
- The **2026 supply-chain changes** (npm 12 install scripts off, OIDC trusted publishing,
  safer checkout defaults, Dependabot cooldown) — your Talk 2 — are current and topical.

## How "research turns into impact" (their favorite phrase — be ready to riff)
Lab's flywheel: **research a bug → generalize it into a CodeQL query/model → ship it into
code scanning + MRVA → the whole ecosystem is now protected → credit/teach the community so
they do it too.** Both your talks are instances of this flywheel — say that explicitly.

## Why this matters for YOUR two talks (consistency hook they grade)
- Talk 1 (CodeQL) = **detection**, and the "models as data" lever = *encode expertise so it
  scales* = the Lab's mission in one line.
- Talk 2 (supply chain) = **prevention**, secure-by-default = *protect people who do nothing*.
- Together: **detect + prevent**, and **CodeQL scans both your code and your CI** — one engine,
  two surfaces. That's your through-line; name it in both talks' openings or closings.
