# Technical follow-up bank

Interviewers **will interrupt** and probe. The goal isn't to know everything — it's to reason
well out loud and say "I don't know, here's how I'd find out" when you don't. Answers below are
crisp talking points, not scripts.

## Handling mid-demo interruptions (practice this)
- **Acknowledge, park, or answer briefly.** "Great question — short answer X; let me finish
  this step and I'll go deeper." Then actually circle back.
- **Never debug silently on stage.** If a command hangs >10–15s, narrate, switch to the backup
  file, keep the story moving. Your value is the reasoning, not the terminal.
- **If they challenge a claim**, welcome it: "Let's test that" beats defending. You can even run
  an ad-hoc variation if you know the repo cold.
- Keep a finger on the timer; a good interruption can eat 3 minutes.

---

## Talk 1 — CodeQL

**Q: What's actually in the CodeQL "database"? Is it just an AST?**
More than an AST. Extraction captures the AST plus a relational representation of the program:
control-flow graph, the call graph, type information, and the scaffolding for data-flow/taint
analysis. QL queries run against that relational model. That's why you can ask "does data flow
from here to there," which pure syntax (AST/grep) can't answer.

**Q: Difference between data flow and taint tracking?**
Data flow tracks values through assignments, calls, returns. **Taint tracking** is data flow
plus "taint steps" — transformations that preserve attacker control even though the value
changes (e.g., string concatenation, `JSON.parse`, templating). SQL injection needs taint
tracking because the input gets reshaped on the way to the sink.

**Q: Sources, sinks, sanitizers — and how do you cut false positives?**
Source = attacker-controlled input (`RemoteFlowSource`). Sink = dangerous operation (the SQL
call). **Sanitizer/barrier** = a node that makes data safe (e.g., parameterization, an escaping
function); you add barriers to the config so paths through them aren't reported. That, plus
precise sink modeling, is how you tune precision. In the demo, the parameterized endpoint is
clean precisely because a prepared statement isn't a string-concatenation sink.

**Q: How is "models as data" different from writing a query? Why is it safer?**
A query is logic; a model is *data* describing a library's sources/sinks/summaries in YAML.
Adding a model teaches **every existing query** about a new library without touching query logic
— lower blast radius, easy to review in a PR, versioned, and shippable via
`.github/codeql/extensions` where code scanning auto-loads it. Writing a new query is for a new
*kind* of bug; modeling is for new *libraries/APIs* exhibiting a known kind.

**Q: Could an attacker evade your model by using a different method/alias?**
Yes — models are as complete as you make them. That's the honest limitation and the reason the
bounty/community model exists: you broaden coverage by modeling more entry points, and MRVA
helps you discover where real code uses them. It's an arms race you win with breadth + community.

**Q: Does CodeQL need to build the code?**
JS/TS, Python, Ruby, and Actions use `build-mode: none` (no build). Compiled languages
(Java/Kotlin, C/C++, C#, Go, Swift) need the build observed — autobuild or a manual build —
because extraction hooks the compiler.

**Q: False negatives — what does CodeQL miss?**
Unmodeled libraries/sinks (the whole point of the demo), dynamic reflection/`eval`, flows
through serialization it can't follow, and anything outside the analyzed languages. It's a
strong net, not a proof of absence.

**Q: Precision vs. recall — how do suites decide what's on by default?**
`default` < `security-extended` < `security-and-quality`. Higher coverage trades in more noise.
Queries carry `@precision` and `@problem.severity`; the default suite favors high-precision,
high-severity so developers trust the signal. You enable broader suites where a team can absorb
the noise.

**Q: How does Copilot Autofix relate to CodeQL?**
CodeQL localizes the vuln and provides the data-flow context; Autofix uses that context to
propose a concrete code change with an explanation. CodeQL is the ground truth; the LLM writes
the patch suggestion. Human still reviews/merges.

**Q: How does CodeQL analyze Actions YAML?**
There's an `actions` extractor and dedicated query packs (`actions/code-injection`,
`actions/untrusted-checkout`, etc.). Same engine, workflows as the "program," expression
contexts like `${{ github.event.* }}` as sources and `run:` as the injection sink.

**Q: MRVA?**
Multi-Repository Variant Analysis — run one query across thousands of repos from VS Code to find
every instance of a pattern ecosystem-wide. It's "bug class, not bug" at ecosystem scale, and
a core Security-Lab workflow.

---

## Talk 2 — Supply chain

**Q: How exactly does OIDC trusted publishing remove the token?**
Instead of a long-lived `NPM_TOKEN` stored in CI, the CI job requests a short-lived **OIDC ID
token** from GitHub (`id-token: write`). npm verifies that token against a **trusted publisher**
config you set on the package (this repo, this workflow). No secret at rest = nothing to
exfiltrate, and the token is minted per-run and expires. Bonus: it enables **signed provenance**
automatically.

**Q: What's provenance / how does it relate to Sigstore and SLSA?**
Provenance is a signed attestation of *where and how* a package was built (repo, commit,
workflow). npm's provenance uses **Sigstore** for signing/transparency. It moves you up the
**SLSA** build-integrity levels. It doesn't stop a malicious maintainer, but it makes
tampering and "typosquat built from nowhere" detectable.

**Q: If install scripts are off by default, won't builds break?**
Some packages legitimately need them (native modules via `node-gyp`). You review the blocked
list once (`npm install-scripts ls`), approve the few you trust (`approve`), and that decision
is recorded in `package.json`. Most packages don't need scripts, so the default is safe and the
exceptions are explicit and auditable.

**Q: Cooldown vs. pinning vs. lockfiles — why cooldown?**
They're layers. **Lockfiles** pin exact versions you've already chosen. **Pinning actions to a
SHA** stops a mutable tag being swapped. **Cooldown** addresses a different gap: the *moment you
adopt a brand-new release*. Most malicious versions are caught within hours–days, so waiting
lets ecosystem detection win the race — and **security updates are exempt**, so you don't delay
real fixes.

**Q: Why is `pull_request_target` dangerous when `pull_request` isn't?**
`pull_request` runs with a **read-only** token and no secrets for fork PRs. `pull_request_target`
runs in the **base** repo's context — secrets + write token — but at the fork's behest. If you
then check out and execute fork code, untrusted code runs privileged. The 2026 checkout change
refuses that by default unless you add the deliberately-loud `allow-unsafe-pr-checkout`.

**Q: What was Shai-Hulud / tj-actions — be accurate.**
Reference the *pattern*, not invented numbers. **tj-actions** (2025): a popular Action was
compromised and modified to dump CI secrets into logs across many repos. **Shai-Hulud**: a
self-replicating **npm worm** that used stolen publish tokens to inject itself into more
packages — the canonical "compromise → steal → propagate" loop. If you're unsure of a figure,
say "on the order of" or defer.

**Q: Does OIDC work outside GitHub/CircleCI?**
Trusted publishing is per-provider (GitHub Actions, CircleCI, …). Elsewhere you fall back to a
short-lived, tightly-scoped token plus **staged publishing** (human + 2FA gate) so compromised
CI still can't release unilaterally.

**Q: Account-protection detail?**
High-impact npm accounts enter a **72-hour read-only mode** after an email change or 2FA
recovery — blunting phishing-based takeover before the attacker can publish.

**Q: How does this connect to CodeQL (consistency)?**
Prevention (these defaults) + detection (CodeQL's `code-injection` / `untrusted-checkout`).
Same philosophy as Talk 1: encode the defense once so everyone benefits.

---

## If you get a question you can't answer
Say so, then show reasoning: *"I don't know off-hand. My mental model says X, so I'd expect Y —
I'd verify by [reading the extractor docs / testing it in the demo repo]."* That's a **better**
signal than bluffing, especially for a research team.
