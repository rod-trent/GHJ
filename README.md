# Open Source CodeQL & Supply Chain Security Sessions

Two focused technical sessions with live demos that anyone can use to understand CodeQL, semantic code analysis, and practical supply-chain defenses.

Both sessions share one story: **CodeQL *detects* vulnerabilities in the code you write; the supply-chain defenses *prevent* attacks on the code and pipelines you don't.**

| # | Session | Deck | Demo | Runbook |
|---|---|---|---|---|
| 1 | **CodeQL — Find the bug class, not just the bug** | [`presentation/CodeQL-Find-the-Bug-Class.pptx`](presentation/CodeQL-Find-the-Bug-Class.pptx) | `demos/codeql/run-codeql-demo.ps1` | [RUNBOOK-CodeQL.md](demos/RUNBOOK-CodeQL.md) |
| 2 | **Breaking the chain — disrupting supply chain attacks on npm & GitHub Actions** | [`presentation/Supply-Chain-Breaking-the-Chain.pptx`](presentation/Supply-Chain-Breaking-the-Chain.pptx) | `demos/supply-chain/npm-install-scripts/run-demo.ps1` + Actions examples | [RUNBOOK-SupplyChain.md](demos/RUNBOOK-SupplyChain.md) |

These materials are designed so you can:
- Learn the concepts yourself
- Run the demos locally (most work offline)
- Deliver the sessions at your own user group, meetup, internal training, or conference
- Extend, improve, or translate them

## Demo Launchpad

**<https://rt-demo-launchpad.vercel.app>** (source in `site/`). One tab per session with copy-ready launch commands, the code on screen, terminal replays of real runs, and presenter vs audience views (press **A** or use `?view=audience`).

## The shared demo app

[`github.com/rod-trent/octo-notes-demo`](https://github.com/rod-trent/octo-notes-demo) (public, **intentionally vulnerable**) — a small Express + `node:sqlite` notes API with SQL injection, path traversal, XSS, and vulnerable Actions workflows. A copy also lives under `demos/octo-notes-demo/`.

Code scanning is enabled on the live repo so you can see the alerts.

## Repository layout

```
presentation/
  CodeQL-Find-the-Bug-Class.pptx          # Session 1 (full speaker notes in the deck)
  Supply-Chain-Breaking-the-Chain.pptx    # Session 2 (full speaker notes in the deck)
  One-Pager-Leave-Behind.pptx / .pdf      # 2-page handout
  build/                                   # generator scripts (pptxgenjs)
demos/
  octo-notes-demo/        # the vulnerable app + models + workflows
  codeql/                 # run-codeql-demo.ps1 + custom QL queries
  supply-chain/
    npm-install-scripts/  # npm 11 vs 12 install-script demo (safe simulated payload)
    hardened-workflows/   # "do this instead" reference workflows
  backup/                 # pre-captured results if you prefer not to run live
  RUNBOOK-CodeQL.md
  RUNBOOK-SupplyChain.md
SPEAKER-CHEATSHEET.md     # structure, timings, key facts, Q&A
DRY-RUN-CHECKLIST.md      # pre-flight and delivery checklist
```

Every slide carries a full speaker script in its notes (Presenter View).

## Contribute & reuse

This is open source. Fork it, improve the demos, add more languages or attack classes, translate the decks, or package it for your community. Pull requests and issues are welcome.

If you deliver these sessions somewhere, a star or a mention is appreciated — and feel free to open a discussion or issue to share how it went.

## Rebuilding the decks

```bash
cd presentation/build
npm install --ignore-scripts        # pptxgenjs, react-icons, sharp
NODE_PATH="$PWD/node_modules" node deck1-codeql.js
NODE_PATH="$PWD/node_modules" node deck2-supplychain.js
NODE_PATH="$PWD/node_modules" node onepager.js
```

## Safety note

Everything under `demos/` is deliberately insecure or simulates an attack **for teaching only**. The npm "malicious" package just prints; it exfiltrates nothing. The vulnerable workflows use a fake secret and are gated/disabled. Do not deploy any of it.
