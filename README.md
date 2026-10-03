# GitHub Security Lab interview — technical case studies

Two ~10–15 minute technical presentations, each with a live, offline-capable demo.
Both talks share one story: **CodeQL *detects* vulnerabilities in the code you write;
the supply-chain defenses *prevent* attacks on the code and pipelines you don't.**

| # | Talk | Deck | Demo | Runbook |
|---|---|---|---|---|
| 1 | **CodeQL — Find the bug class, not just the bug** | [`presentation/CodeQL-Find-the-Bug-Class.pptx`](presentation/CodeQL-Find-the-Bug-Class.pptx) | `demos/codeql/run-codeql-demo.ps1` | [RUNBOOK-CodeQL.md](demos/RUNBOOK-CodeQL.md) |
| 2 | **Breaking the chain — disrupting supply chain attacks on npm & GitHub Actions** | [`presentation/Supply-Chain-Breaking-the-Chain.pptx`](presentation/Supply-Chain-Breaking-the-Chain.pptx) | `demos/supply-chain/npm-install-scripts/run-demo.ps1` + live Actions injection | [RUNBOOK-SupplyChain.md](demos/RUNBOOK-SupplyChain.md) |

**Why these two** (of the five options): they're the most technically demonstrable with
real tooling, they reinforce each other (detect ↔ prevent), and both demos run locally so a
flaky conference network can't sink them. CodeQL even scans Actions workflows, so the same
engine appears in both talks.

## The shared demo app

[`github.com/rod-trent/octo-notes-demo`](https://github.com/rod-trent/octo-notes-demo)
(public, **intentionally vulnerable**) — a ~60-line Express + `node:sqlite` notes API with
SQL injection, path traversal, XSS, and two vulnerable Actions workflows. Code scanning is
enabled; it currently reports **8 alerts (5 code + 3 workflow)**. A copy also lives here
under `demos/octo-notes-demo/`.

## Repository layout

```
presentation/
  CodeQL-Find-the-Bug-Class.pptx          # Deck 1 (12 slides, FULL talk script in notes)
  Supply-Chain-Breaking-the-Chain.pptx    # Deck 2 (13 slides, FULL talk script in notes)
  One-Pager-Leave-Behind.pptx / .pdf      # 2-page handout (one page per talk)
  build/                                   # generator scripts (pptxgenjs) + QA renders
demos/
  octo-notes-demo/        # the vulnerable app, model pack, custom queries, workflows
  codeql/                 # run-codeql-demo.ps1 + custom QL queries
  supply-chain/
    npm-install-scripts/  # npm 11 vs 12 install-script demo (simulated, safe payload)
    hardened-workflows/   # "do this instead" reference workflows (scan clean)
  backup/                 # pre-captured results for every demo, in case live fails
  RUNBOOK-CodeQL.md
  RUNBOOK-SupplyChain.md
SPEAKER-CHEATSHEET.md     # one page: structure, timings, likely Q&A
DRY-RUN-CHECKLIST.md      # day-of: pre-flight, per-demo rehearsal, teardown, panic card
prep/                     # FINAL-LOOP prep beyond the slides:
  01-Security-Lab-Research-Brief.md   # mission, programs, stats — "why the Lab"
  02-Candidate-Questions.md           # questions to ask them
  03-Technical-QA-Bank.md             # hardened follow-ups + interrupt handling
  04-Behavioral-Workbook.md           # STAR+Reflection fill-in for all 10 themes
```

> **Scope note:** the technical case study is one half of the final loop; the **culture &
> behavioral interview is the other half**. See `prep/` — especially the behavioral workbook,
> which needs your real stories.

Every slide carries a **full, word-for-word speaker script** in its notes (open the
Notes pane or use Presenter View), including demo cues, backup-plan pointers, and slide
transitions.

## Rebuilding the decks

```bash
cd presentation/build
npm install --ignore-scripts        # pptxgenjs, react-icons, sharp
NODE_PATH="$PWD/node_modules" node deck1-codeql.js
NODE_PATH="$PWD/node_modules" node deck2-supplychain.js
NODE_PATH="$PWD/node_modules" node onepager.js
```

## Safety note

Everything under `demos/` is deliberately insecure or simulates an attack **for teaching
only**. The npm "malicious" package just prints; it exfiltrates nothing. The vulnerable
workflows use a fake secret and are gated/disabled. Do not deploy any of it.
