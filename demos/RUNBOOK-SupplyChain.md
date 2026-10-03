# Demo runbook — "Breaking the chain" (npm + GitHub Actions supply chain)

**Goal:** make two attack techniques concrete and then show the defense.
- **Demo 1 (primary):** npm 11 runs a malicious `postinstall`; npm 12 blocks it by default.
- **Demo 2 (fast):** a malicious **issue title** executes code in a workflow; then the fix.

**Time:** Demo 1 ~3 min, Demo 2 ~2–3 min, inside a 10–15 minute talk.

---

## Demo 1 — install scripts (local, offline-safe)

Setup (already done): `demos/supply-chain/npm-install-scripts/`
- `evil-pkg/` — a **simulated** malicious package. Its `postinstall` only *prints* what it
  would steal; it makes **no** network calls and reads no files. Safe to run.
- `victim-app/` — depends on the local tarball.
- `run-demo.ps1` — runs both acts.

> **Prereq:** npm 12 requires **Node ≥ 24.15.0**. Check with `node -v`.
> If you're on an older 24.x, `nvm install 24` (or newer) before the talk, or the
> npm-12 act prints an engine warning. The blocking behavior still works.

```powershell
cd demos\supply-chain\npm-install-scripts
# optional, pre-cache npm versions so the live run is offline + fast:
.\run-demo.ps1 -Prep
# the demo:
.\run-demo.ps1
```

**Act 1 (npm 11):** `npm install` runs `color-utilz`'s `postinstall`. It prints the
"harvested" fake `NPM_TOKEN` and what it *would* exfiltrate and re-publish. This is the
real-world credential-theft vector (Shai-Hulud-style worms).

**Act 2 (npm 12):** identical `npm install`. The script is **blocked by default**
(`allowScripts` off). You review with `npm install-scripts ls` and approve only what you
trust. The attack never runs.

**Key line:** "The single highest-impact default change — the easy door is now closed."

## Demo 2 — workflow injection on the live repo (needs network)

Repo: `github.com/rod-trent/octo-notes-demo` (the `Issue triage` workflow is intentionally
vulnerable; it's gated to only run on the **repo owner's** issues, and uses a **fake**
secret `DEMO_DEPLOY_TOKEN`).

1. Open a new issue with this title (the payload):
   ```
   Login crash"; echo "PWNED as $(whoami) on $(hostname)"; echo "Stolen secret: $(echo $DEPLOY_TOKEN | base64 -w0)"; #
   ```
   or from the CLI:
   ```bash
   gh issue create -R rod-trent/octo-notes-demo \
     --title 'Login crash"; echo "PWNED as $(whoami)"; echo $DEPLOY_TOKEN | base64; #' \
     --body "demo"
   ```
2. Actions → **Issue triage** → open the run → expand *Greet the issue author*.
   The log literally prints `PWNED as runner …` and the base64 secret — proof of arbitrary
   execution from untrusted input.
3. Show the fix (branch `fix/issue-triage-injection`, already pushed): pass the title through
   an **environment variable** so the shell treats it as data, drop the secret, and minimize
   token permissions. Diff:
   ```bash
   gh pr view -R rod-trent/octo-notes-demo fix/issue-triage-injection   # if you open a PR
   # or
   git -C demos/octo-notes-demo diff main fix/issue-triage-injection -- .github/workflows/issue-triage.yml
   ```
4. CodeQL already flags this as `actions/code-injection/critical` in the Security tab —
   the detection half of the story (ties to the CodeQL talk).

> Close the demo issue afterwards: `gh issue close <n> -R rod-trent/octo-notes-demo`.

## Talking points (map each to the kill chain)
- **Compromise:** safer `actions/checkout` defaults (refuses untrusted fork code unless you
  add the deliberately-loud `allow-unsafe-pr-checkout`), workflow trigger policies, read-only cache.
- **Steal credentials:** npm 12 install scripts off; **trusted publishing (OIDC)** removes the
  long-lived `NPM_TOKEN` entirely; Actions network firewall (preview).
- **Propagate:** **staged publishing** + 2FA gate; **Dependabot cooldown** (delay non-security
  updates a few days — security updates are *never* delayed); instant credential revocation.
- **Meta:** no silver bullet — layered, secure-by-default changes that help people who do nothing.

## Backup plan
- Demo 1: pre-recorded output is deterministic; if npm download fails, run with `-Prep` first
  on wifi, or screenshot ahead of time.
- Demo 2: `demos/backup/actions-injection-run-log.txt` has a captured run log (shows the
  `PWNED` line + exfiltrated fake secret + run URL). Walk that if GitHub Actions is slow.

## Reference workflows
`demos/supply-chain/hardened-workflows/` — the "do this instead" versions
(`issue-triage.yml`, `pr-preview.yml`, `npm-publish.yml` with OIDC + staged publish).
These scan clean with CodeQL (0 findings).
