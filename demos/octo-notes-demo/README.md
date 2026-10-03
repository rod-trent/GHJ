# Octo Notes - intentionally vulnerable demo

> **Warning**
> This repository is **deliberately insecure**. It exists to demonstrate
> CodeQL and GitHub Actions / npm supply chain security in a technical talk.
> Do not deploy it, and do not copy its patterns.

## What's inside

| Path | Bug class | Found by |
|---|---|---|
| `src/routes/notes.js` | SQL injection (x2) via `node:sqlite` | CodeQL **+ our model pack** |
| `src/routes/attachments.js` | Path traversal | CodeQL default queries |
| `src/routes/preview.js` | Reflected XSS | CodeQL default queries |
| `.github/workflows/issue-triage.yml` | Actions script injection | CodeQL `actions` analysis |
| `.github/workflows/pr-preview.yml` | "Pwn request" (`pull_request_target` + untrusted checkout) | CodeQL `actions` analysis |

`.github/codeql/extensions/node-sqlite-models` is a CodeQL **model pack**: one
line of YAML that teaches CodeQL that `node:sqlite`'s `DatabaseSync#prepare`
and `#exec` are SQL-injection sinks.

## Run it locally

```bash
npm install
npm start     # http://127.0.0.1:3000  (requires Node >= 24.15)
```

Demo safety: the vulnerable workflows only use a fake secret, the
`issue-triage` job only runs for the repo owner's issues, and `pr-preview`
is disabled.
