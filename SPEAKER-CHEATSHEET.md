# Speaker cheat sheet

Two talks. Problem first, then tech, then demo, then takeaway. Each slide has full
speaker notes in the .pptx — this is the one-page version for the day.

---

## Talk 1 — CodeQL (12 slides, ~11 min scripted + interruptions)

| Beat | Slides | ~min |
|---|---|---|
| Title + problem: grep can't follow data flow; one bug class, many faces | 1–2 | 1.5 |
| Why it matters: one query protects everyone | 3 | 0.5 |
| Solution: code as data → QL query → results | 4 | 0.75 |
| Demo app "Octo Notes" + its deliberate blind spot | 5 | 0.5 |
| **⏱ Checkpoint: start slide 6 by ~4:00.** Past ~4:30 → you'll skip slide 10 | | |
| **DEMO Act 1:** default suite misses the SQLi | 6 | 1.5 |
| Models-as-data: one sink-model row | 7 | 1.5 |
| **DEMO Acts 2–3:** SQLi found + the QL query | 8 | 1.5 |
| Bridge: CodeQL also scans Actions (→ talk 2) | 9 | 1.5 |
| *Optional:* in the PR (skip if behind; don't sell Autofix) | 10 | 0.75 |
| Impact + takeaways | 11–12 | 2 |

**One-liner:** *"Describe the bug once, catch it everywhere."*

**Demo command (DB pre-built):** `cd demos\codeql; .\run-codeql-demo.ps1 -SkipBuild`

---

## Talk 2 — Supply chain (13 slides, ~13 min scripted + interruptions)

| Beat | Slides | ~min |
|---|---|---|
| Title + problem: self-replicating attacks — compromise → steal → propagate | 1–2 | 1.25 |
| Why it matters: you run far more code than you read | 3 | 0.5 |
| Strategy: break every link (the map) | 4 | 0.75 |
| **⏱ Checkpoint: slides 1–4 done by ~3:00** | | |
| **DEMO:** install scripts — npm 11 runs it, npm 12 blocks it (protect this) | 5–6 | 3 |
| CI is the other door (script injection, pwn request) → CodeQL | 7 | 1 |
| **Walk-through from the launchpad diff** (Talk 2 → card 3); live run only if armed + teardown rehearsed | 8 | 1.5 |
| Prevention: safe-by-default CI | 9 | 1 |
| Prevention: kill the token (OIDC, staged publish, revoke) | 10 | 1 |
| Containment: Dependabot cooldown | 11 | 0.5 |
| Impact + takeaways | 12–13 | 1.5 |

**One-liner:** *"Make the attack expensive at every step."*

**One live demo** (slides 5–6): `cd demos\supply-chain\npm-install-scripts; .\run-demo.ps1`
(run `-Prep` once on wifi first). Slide 8 is a **visual walk-through**, not performed.
*Optional* live Actions injection is available if they ask — see runbook (enable the demo
workflow first).

---

## Key facts to have right (dates are 2026)

- **npm 12** (~July 2026): install scripts **off by default** (`allowScripts`); `--allow-git`,
  `--allow-remote`, etc. default to restricted. Needs **Node ≥ 24.15**.
- **actions/checkout** (enforced July 20, 2026): refuses untrusted fork checkout on
  `pull_request_target` / `workflow_run` unless you add **`allow-unsafe-pr-checkout`**.
- **Trusted publishing (OIDC)**: no long-lived `NPM_TOKEN`; provenance auto-signed. CircleCI
  added April 2026.
- **Staged publishing** (`npm stage publish`, npm ≥ 11.15): human + 2FA approval before a
  package is installable; can be set "stage-only".
- **Dependabot cooldown** (July 2026): `cooldown:` in `dependabot.yml`, default delay for
  **version** updates; **security updates are never delayed**.
- **npm account protection** (June 2026): 72-hour read-only on email change / 2FA recovery.
- CodeQL workflow queries: `actions/code-injection`, `actions/untrusted-checkout`.

## Likely Q&A
- *"Does modeling cause false positives?"* — Precision is tuned per sink kind; the demo shows
  the safe parameterized endpoint stays silent. You can also scope models and add `test`/sanitizer
  models.
- *"Does CodeQL need to build the code?"* — JS/TS and Actions use `build-mode: none`; compiled
  languages need a build or autobuild.
- *"Is GitHub Advanced Security required?"* — Code scanning is free on public repos; GHAS for
  private. That's why the demo repo is public.
- *"Won't blocking install scripts break my build?"* — You approve the ones you need once
  (`npm install-scripts approve`), recorded in `package.json`. Most packages don't need them.
- *"Can't an attacker just name the flag / use a different sink?"* — The checkout flag is
  deliberately loud for review/CodeQL; new sinks are handled by adding a model (the talk's point).
- *"OIDC — what if I publish from somewhere other than GitHub/CircleCI?"* — Trusted publishing is
  per-provider; otherwise scope a short-lived token + staged publishing.
