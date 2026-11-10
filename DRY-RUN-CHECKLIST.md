# Dry-run & day-of checklist

Two sessions; the demos are presented from captured runs on the launchpad. Work top to bottom. Boxes you can tick: `[ ]`.

---

## T-minus 1 day — environment (do this on wifi, not at the venue)

- [ ] *Optional (only for the npm sanity check):* **Node version supports npm 12** — needs **≥ 24.15.0**:
  ```bash
  node -v
  ```
  If lower, upgrade (e.g. `nvm install 24` / install latest 24.x) and re-check. npm 12 still
  *blocks* on older Node but prints an engine warning on screen.
- [ ] *Optional (only for the CodeQL sanity check):* **CodeQL CLI present** at `C:\Code\tools\codeql\codeql.exe`:
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
- [ ] *Optional (only for the npm sanity check):* **Pre-cache npm 11 & 12** so the real run is offline and fast:
  ```bash
  cd demos/supply-chain/npm-install-scripts && pwsh -File run-demo.ps1 -Prep
  ```
- [ ] **Open the decks once** in PowerPoint; confirm Presenter View shows the speaker notes.
- [ ] **Full rehearsal** of both sessions end to end, timed (target 12–13 min each + Q&A).

---

## T-minus 1 hour — pre-flight at the venue

- [ ] Laptop charged + charger plugged in; screen-sleep / screensaver **off**.
- [ ] **Screen share setup (Teams, Zoom, or local projectors), two monitors if available:**
  - **Monitor A (shared):** the PowerPoint slideshow and the launchpad browser window, both maximized here.
  - **Monitor B (yours):** Presenter View with the notes, plus the meeting app itself.
  - PowerPoint → Slide Show → set **Monitor** to A and tick **Use Presenter View**.
  - In your meeting app, Share → **Screen** → pick monitor A. Don't share only the PowerPoint window (the audience won't see the browser when you switch).
  - Switching: **Alt+Tab** to the launchpad; to come back, **click the slideshow** on monitor A so the arrow keys drive the slides again. Your notes on monitor B stay visible the whole time.
  - Launchpad in **audience view**, one tab per session: `/?view=audience#codeql` and `/?view=audience#supply`.
  - Browser zoom ~**125%** so the terminal text survives compression, then re-check that the replay lines aren't cut off on the right.
  - Notifications off (Do not disturb + Focus assist).
  - Do a short test share and confirm the audience sees both the slides and the browser.
- [ ] Browser logged in to GitHub; close noisy tabs, notifications, Slack/email.
- [ ] These tabs pre-opened:
  - [ ] **Demo Launchpad**: <https://rt-demo-launchpad.vercel.app> (launch steps + the captured runs you present)
  - [ ] If you'll screen-share it: open <https://rt-demo-launchpad.vercel.app/?view=audience> (or press **A**). The amber "Presenter view · A" badge in the header means coaching is showing; it disappears in audience view. Panic card (not linked anywhere): `/#panic`. Jump straight to a session with `/#codeql` or `/#supply`.
  - [ ] **Replay check, at the size you'll share:** step through every replay once in audience view, then hit **Reset** on each so they start at ▶ Build DB / ▶ Act 1 · npm 11 / ▶ Run log. Make sure long lines aren't cut off on the right; if they are, widen the window.
  - [ ] `github.com/rod-trent/octo-notes-demo` → **Security → Code scanning** (shows open alerts)
  - [ ] The merged **PR #2** (the fix): `gh pr view 2 -R rod-trent/octo-notes-demo --web`
  - [ ] The repo's **Actions** tab
- [ ] Decks open in **Presenter View**; one-pager PDF handy if anyone wants it.
- [ ] Verify network — or decide to run **fully offline** (both local demos work offline).

---

## Session 1 — CodeQL (demo pre-flight)

- [ ] **Present the captured run** (launchpad, Session 1 → card 4), not a live CLI run. Click ▶ through every act once so you know the rhythm. Fallback if the site won't load: `demos/backup/codeql-1..4-*.csv`.
- [ ] *Optional sanity check* (only if you want to confirm the real tool still matches the captured output, or expect a "can you run it?" follow-up):
  ```bash
  cd demos/codeql && pwsh -File run-codeql-demo.ps1
  ```
  You should see the same story as the replay: Act 1 misses the SQLi → Act 2 finds lines 11 and 20, line 29 stays silent → Act 3's query finds 11 and 20. Takes a few minutes. **Don't Ctrl+C a full run:** it wipes the database first. If that happens, run it again (or with `-SkipBuild`, which rebuilds it in ~1 min).
- [ ] Decide whether you'll also show the live alerts in the Security tab (needs network).

**Run order:** slides 1–5 → **demo Act 1** (slide 6, captured run) → slide 7 → **demo Acts 2–3** (slide 8) → slides 9–12 → Q&A.

---

## Session 2 — Supply chain (demo pre-flight)

**Demo 1 — npm install scripts (local, offline-safe)**
- [ ] **Present the captured run** (launchpad, Session 2 → card 4 → npm 11 vs 12). Click ▶ through Act 1, Act 2, Review once.
- [ ] *Optional sanity check* (only if you want to confirm the real npm behavior still matches the captured output). Needs `node -v` ≥ 24.15:
  ```bash
  cd demos/supply-chain/npm-install-scripts && pwsh -File run-demo.ps1
  ```
  You should see the same story as the replay: npm 11 runs the postinstall ("harvested … / would POST / would re-publish"); npm 12 **blocks** it.

**Slide 8 is a walk-through, not a live demo** — you just talk over the vulnerable-vs-hardened slide. **Not firing the attack live**; if asked, show the captured Actions log (Session 2 → card 4). The steps below are kept for reference only.

**Live Actions injection (reference only, needs network)**
- [ ] **Enable the demo workflow** (it's disabled by default):
  ```bash
  gh workflow enable "Issue triage (DEMO - vulnerable)" -R rod-trent/octo-notes-demo
  ```
- [ ] Have the payload issue title on the clipboard:
  ```
  Login crash"; echo "PWNED as $(whoami)"; echo "Secret: $(echo $DEPLOY_TOKEN | base64)"; #
  ```
- [ ] Know where to click: Actions → **Issue triage (DEMO - vulnerable)** → latest run → *Greet the issue author* step → point at `PWNED as runner` + the base64 secret.
- [ ] Fix comparison ready: `issue-triage-demo.yml` (vulnerable) vs hardened `issue-triage.yml` on `main`, plus the merged PR #2.
- [ ] **Backup ready:** `demos/backup/actions-injection-run-log.txt` (a captured PWNED run).

**Run order:** slides 1–4 → **demo** (slides 5–6, captured run) → slide 7 → **walk-through** (slide 8, not performed) → slides 9–13 → Q&A.

---

## During each session — reminders
- [ ] Problem first — don't jump to features.
- [ ] Narrate every demo step: what you're doing, why, what to watch for.
- [ ] Demos are **captured runs**: say once per session that you ran them ahead of time. If the launchpad won't load, open `demos/backup/`, keep talking, move on. Don't debug live.
- [ ] **Driving the replays:**
  - Click ▶ **once**, then wait until the output stops and the button shows the next step. A click while it's still printing does nothing.
  - The ▶ button can **jump** (left to right) when its label gets longer. Look before each click.
  - **Don't reload between CodeQL slide 6 and slide 8.** The replay is on the same card and picks up at ▶ Act 2; a reload starts it over at Build DB. (If it happens: Show all, then talk over Acts 2–3.)
  - Keep the launchpad window **in front** while it plays. Browsers slow down timers in background windows, and the output crawls.
- [ ] Watch the clock in Presenter View. **Checkpoints:** CodeQL, start slide 6 by ~4:00 (past ~4:30 → skip slide 10). Supply chain, done with slides 1–4 by ~3:00.
- [ ] Supply chain slide 8: narrate from the **launchpad diff** (Session 2 → card 3). If asked to see it fire, show the **Actions injection log** tab (Session 2 → card 4); don't fire it live.
- [ ] Mention the cross-link once per session (CodeQL ↔ supply chain = detection + prevention).

---

## Teardown (right after Session 2)

- [ ] **Disable the demo workflow** so it can't fire later:
  ```bash
  gh workflow disable "Issue triage (DEMO - vulnerable)" -R rod-trent/octo-notes-demo
  ```
- [ ] Close any demo issues you opened (closes every open issue whose title contains `PWNED`; PowerShell):
  ```powershell
  gh issue list -R rod-trent/octo-notes-demo --state open --search "PWNED in:title" --json number --jq ".[].number" | ForEach-Object { gh issue close $_ -R rod-trent/octo-notes-demo -c "demo cleanup" }
  ```
  Then confirm nothing is left: `gh issue list -R rod-trent/octo-notes-demo`
- [ ] Offer the one-pager (`presentation/One-Pager-Leave-Behind.pdf`) and the repo link.

---

## Panic card (if everything breaks)
- No network / launchpad won't load → walk the captured output in `demos/backup/` (`codeql-*.csv`, `actions-injection-run-log.txt`); skip the GitHub-UI beats.
- Laptop dies → the decks carry the full script in the notes; the one-pager PDF summarizes both sessions.
- Repo: `github.com/rod-trent/GHJ` · Demo app: `github.com/rod-trent/octo-notes-demo`
