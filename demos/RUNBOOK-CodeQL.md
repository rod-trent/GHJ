# Demo runbook — CodeQL: "Find the bug class, not just the bug"

**Goal:** show CodeQL (1) miss a SQL-injection bug the default suite doesn't model,
(2) find it after one sink-model row, (3) show the underlying QL query — and that it
also scans GitHub Actions workflows.

**Time:** ~5–6 minutes of demo inside a 10–15 minute talk.

---

## One-time setup (already done on this machine)

| Thing | Where |
|---|---|
| CodeQL CLI 2.27.1 | `C:\Code\tools\codeql\codeql.exe` |
| Vulnerable app | `demos/octo-notes-demo/` (also public at `github.com/rod-trent/octo-notes-demo`) |
| Model pack | `demos/octo-notes-demo/.github/codeql/extensions/node-sqlite-models/` |
| Custom queries | `demos/codeql/queries/` |
| Driver script | `demos/codeql/run-codeql-demo.ps1` |
| Backup results | `demos/backup/codeql-*.csv` |

If you move to a fresh machine:
```bash
# download the CLI bundle for your OS from:
# https://github.com/github/codeql-action/releases  (asset: codeql-bundle-<os>.tar.*)
```

## The live demo (local, works offline)

```powershell
cd demos\codeql
.\run-codeql-demo.ps1
```

**Act 1 — out of the box.** The `security-extended` suite finds the reflected XSS
(`preview.js`) and the path traversal (`attachments.js`) but **misses the SQL
injection**. Ask the room *why* — because CodeQL doesn't yet know `node:sqlite`'s
`.prepare()/.exec()` are SQL sinks. It's an unmodeled library, not a tool failure.

**Act 2 — one sink-model row.** Show `node-sqlite.model.yml`. Rerun the *same* suite
with the model pack. Both SQLi variants (`notes.js:11`, `notes.js:20`) now light up —
and the **safe parameterized** endpoint (`notes.js:29`) stays silent. No false positive.

**Act 3 — what's under the hood.** Show `2-SqliteInjection.ql`: a source
(`RemoteFlowSource`), a sink (the modeled call), and `TaintTracking` connecting them.
~25 readable lines describe the whole bug class.

## The GitHub UI beat (optional, needs network)

The public repo has **7 open code-scanning alerts** (5 code + 2 workflow). A third workflow alert, on the real `issue-triage.yml`, was **auto-closed** when PR #2 merged, which is worth saying out loud:
- Security tab: <https://github.com/rod-trent/octo-notes-demo/security/code-scanning>
- Point out `actions/code-injection` and `actions/untrusted-checkout` — the bridge to
  the supply-chain talk: the same engine scans your workflows.

## Talking points
- **Code as data.** Extraction compiles source into a queryable database of structure + data flow.
- **Bug class > bug.** You describe a *shape*, the engine finds every instance.
- **Modeling is the lever.** You rarely write a new query; you extend the model of the world — reviewed and versioned like code.
- Model packs dropped in `.github/codeql/extensions/` are picked up by code scanning automatically.

## Backup plan (if the CLI misbehaves live)
Open the pre-captured results and walk them instead:
- `demos/backup/codeql-1-default-suite.csv` — Act 1 (no SQLi)
- `demos/backup/codeql-2-with-node-sqlite-model.csv` — Act 2 (SQLi found, safe one silent)
- `demos/backup/codeql-3-custom-queries.csv` — Act 3 (custom query hits)
- `demos/backup/codeql-4-actions-workflows.csv` — workflow findings
Or just show the live alerts in the repo's Security tab.

## Reset
```powershell
Remove-Item $env:TEMP\octo-notes-codeql-db -Recurse -Force -ErrorAction SilentlyContinue
```
