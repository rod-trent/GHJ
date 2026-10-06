# Dry-run & day-of checklist

Two talks, three live demos. Work top to bottom. Boxes you can tick: `[ ]`.

---

## T-minus 1 day — environment (do this on wifi, not at the venue)

- [ ] **Node version supports npm 12** — needs **≥ 24.15.0**:
  ```bash
  node -v
  ```
  If lower, upgrade (e.g. `nvm install 24` / install latest 24.x) and re-check. npm 12 still
  *blocks* on older Node but prints an engine warning on screen.
- [ ] **CodeQL CLI present** at `C:\Code\tools\codeql\codeql.exe`:
  ```bash
  C:\Code\tools\codeql\codeql.exe version
  ```
  If missing, download `codeql-bundle-win64.tar.*` from
  <https://github.com/github/codeql-action/releases> and extract to `C:\Code\tools\codeql`.
- [ ] **Deck build deps installed** (only if you plan to rebuild):
  ```bash
  cd presentation/build && npm install --ignore-scripts
  ```
- [ ] **gh authenticated** to the right account:
  ```bash
  gh auth status
  ```
- [ ] **Pre-cache npm 11 & 12** so Demo 1 runs offline and fast:
  ```bash
  cd demos/supply-chain/npm-install-scripts && pwsh -File run-demo.ps1 -Prep
  ```
- [ ] **Open the decks once** in PowerPoint; confirm Presenter View shows the speaker notes.
- [ ] **Full rehearsal** of both talks end to end, timed (target 12–13 min each + Q&A).

---

## T-minus 1 hour — pre-flight at the venue

- [ ] Laptop charged + charger plugged in; screen-sleep / screensaver **off**.
- [ ] Display mirroring tested on the projector; font sizes legible from the back.
- [ ] **Terminal font bumped up** (≥ 18pt) for the demo terminals.
- [ ] Browser logged in to GitHub; close noisy tabs, notifications, Slack/email.
- [ ] These tabs pre-opened:
  - [ ] **Demo Launchpad**: <https://rt-demo-launchpad.vercel.app> (launch steps + backup replays)
  - [ ] If you'll screen-share it: open <https://rt-demo-launchpad.vercel.app/?view=audience> (or press **A**). The amber
    "Presenter view · A" badge in the header means coaching is showing; it disappears in audience view.
    Panic card (not linked anywhere): `/#panic`
  - [ ] `github.com/rod-trent/octo-notes-demo` → **Security → Code scanning** (shows **7** open alerts: 5 code + 2 workflow; a 3rd was auto-closed by PR #2)
  - [ ] The merged **PR #2** (the fix): `gh pr view 2 -R rod-trent/octo-notes-demo --web`
  - [ ] The repo's **Actions** tab
- [ ] Decks open in **Presenter View**; one-pager PDF handy if anyone wants it.
- [ ] Verify network — or decide to run **fully offline** (both local demos work offline).

---

## Talk 1 — CodeQL (demo pre-flight)

- [ ] Terminal open at repo root; CodeQL CLI on PATH or use full path.
- [ ] Dry-run the 3-act script once so the DB is pre-built (keeps the live run snappy):
  ```bash
  cd demos/codeql && pwsh -File run-codeql-demo.ps1
  ```
- [ ] Confirm you saw: Act 1 misses SQLi → Act 2 finds both + safe one silent → Act 3 query.
- [ ] **Don't Ctrl+C a full (non-`-SkipBuild`) run.** It wipes the pre-built database first. If the database
  is missing, `-SkipBuild` now rebuilds it automatically (~1 min), so run it once more after any interruption.
- [ ] **Backup ready:** `demos/backup/codeql-1..4-*.csv` open in an editor, in case the CLI stalls.
- [ ] Decide whether you'll also show the live alerts in the Security tab (needs network).

**Run order on stage:** slides 1–5 → **demo Act 1** (slide 6) → slide 7 → **demo Acts 2–3**
(slide 8) → slides 9–12 → Q&A.

---

## Talk 2 — Supply chain (demo pre-flight)

**Demo 1 — npm install scripts (local, offline-safe)**
- [ ] `node -v` ≥ 24.15 (re-confirm on the venue machine).
- [ ] Dry-run once:
  ```bash
  cd demos/supply-chain/npm-install-scripts && pwsh -File run-demo.ps1
  ```
- [ ] Confirm: npm 11 runs the postinstall ("harvested … / would POST / would re-publish");
  npm 12 **blocks** it.

**Slide 8 is a walk-through, not a live demo** — you just talk over the vulnerable-vs-hardened
slide. The live attack below is now **OPTIONAL** (only if they ask to see it fire).

**Optional live Actions injection (needs network)**
- [ ] **Enable the demo workflow** (it's disabled by default):
  ```bash
  gh workflow enable "Issue triage (DEMO - vulnerable)" -R rod-trent/octo-notes-demo
  ```
- [ ] Have the payload issue title on the clipboard:
  ```
  Login crash"; echo "PWNED as $(whoami)"; echo "Secret: $(echo $DEPLOY_TOKEN | base64)"; #
  ```
- [ ] Know where to click: Actions → **Issue triage (DEMO - vulnerable)** → latest run →
  *Greet the issue author* step → point at `PWNED as runner` + the base64 secret.
- [ ] Fix comparison ready: `issue-triage-demo.yml` (vulnerable) vs hardened `issue-triage.yml`
  on `main`, plus the merged PR #2.
- [ ] **Backup ready:** `demos/backup/actions-injection-run-log.txt` (a captured PWNED run).

**Run order on stage:** slides 1–4 → **live demo** (slides 5–6) → slide 7 → **walk-through**
(slide 8, not performed) → slides 9–13 → Q&A. (Offer the live injection only if asked.)

---

## During each talk — reminders
- [ ] Problem first — don't jump to features.
- [ ] Narrate every demo step: what you're doing, why, what to watch for.
- [ ] If a live demo misbehaves: **switch to the backup file, keep talking, move on** — don't debug on stage.
- [ ] Watch the clock in Presenter View. **Checkpoints:** CodeQL, start slide 6 by ~4:00 (past ~4:30 → skip
  slide 10). Supply chain, done with slides 1–4 by ~3:00.
- [ ] Supply chain slide 8: narrate from the **launchpad diff** (Talk 2 → card 3). Fire the live issue **only** if
  the launchpad (or `gh workflow list`) shows the demo workflow enabled **and** you've rehearsed teardown that day.
- [ ] Mention the cross-link once per talk (CodeQL ↔ supply chain = detection + prevention).

---

## Teardown (right after Talk 2)

- [ ] **Disable the demo workflow** so it can't fire later:
  ```bash
  gh workflow disable "Issue triage (DEMO - vulnerable)" -R rod-trent/octo-notes-demo
  ```
- [ ] Close any demo issues you opened (closes every open issue whose title contains `PWNED`; PowerShell):
  ```powershell
  gh issue list -R rod-trent/octo-notes-demo --state open --search "PWNED in:title" --json number --jq ".[].number" | ForEach-Object { gh issue close $_ -R rod-trent/octo-notes-demo -c "demo cleanup" }
  ```
  Then confirm nothing is left: `gh issue list -R rod-trent/octo-notes-demo`
- [ ] Offer the one-pager (`presentation/One-Pager-Leave-Behind.pdf`) and repo link to the panel.

---

## Panic card (if everything breaks)
- No network → both **local** demos (CodeQL CLI, npm) still work; skip the GitHub-UI beats.
- CodeQL CLI fails → walk `demos/backup/codeql-*.csv`.
- Actions slow/failing → walk `demos/backup/actions-injection-run-log.txt`.
- Laptop dies → the decks carry the full script in the notes; the one-pager PDF summarizes both talks.
- Repo: `github.com/rod-trent/GHJ` · Demo app: `github.com/rod-trent/octo-notes-demo`
