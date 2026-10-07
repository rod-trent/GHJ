// Deck 2: Disrupting supply chain attacks on npm and GitHub Actions
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./skills-apply-theme");
const { THEME, HEX, icon, W, H, M } = require("./lib");
const FA = require("react-icons/fa6");

(async () => {
  const pres = new pptxgen();
  pres.defineLayout({ name: "W", width: W, height: H });
  pres.layout = "W";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.author = "Rod Trent";
  pres.company = "GitHub Security Lab interview";

  pres.defineSlideMaster({ title: "DARK", background: { color: HEX.canvas }, slideNumber: { x: W - 0.6, y: H - 0.42, color: HEX.muted, fontSize: 9 } });
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: HEX.canvas },
    objects: [{ text: { text: "Rod Trent · Supply chain security", options: { x: M, y: H - 0.42, w: 6, h: 0.3, fontFace: "Calibri", fontSize: 9, color: HEX.muted, align: "left" } } }],
    slideNumber: { x: W - 0.6, y: H - 0.42, color: HEX.muted, fontSize: 9 },
  });

  const title = (slide, t, opts = {}) => slide.addText(t, { x: M, y: 0.42, w: W - 2 * M, h: 0.9, fontFace: "Century Schoolbook", fontSize: 30, bold: true, color: HEX.ink, align: "left", isTextBox: true, ...opts });
  const kicker = (slide, t, color = HEX.redLt) => slide.addText(t.toUpperCase(), { x: M, y: 0.18, w: W - 2 * M, h: 0.3, fontFace: "Calibri", fontSize: 12, bold: true, color, charSpacing: 2, align: "left", isTextBox: true });
  const card = (slide, x, y, w, h, fill = HEX.panel) => slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: HEX.line, width: 1 } });
  async function iconChip(slide, IconCmp, x, y, d, circleHex, iconHex = "FFFFFF") {
    slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: circleHex }, line: { type: "none" } });
    const img = await icon(IconCmp, iconHex, 220);
    slide.addImage({ data: img, x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
  }
  const mono = (s, extra = {}) => ({ text: s, options: { fontFace: "Consolas", ...extra } });

  // ================= SLIDE 1 — Title =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    // broken-chain motif, top right
    for (let i = 0; i < 6; i++)
      s.addShape(pres.ShapeType.roundRect, { x: 9.5 + i * 0.6, y: 0.7, w: 0.5, h: 0.25, rectRadius: 0.12, fill: { type: "none" }, line: { color: i === 3 ? HEX.red : HEX.line, width: 2 } });
    s.addText("✕", { x: 11.25, y: 0.45, w: 0.5, h: 0.4, fontSize: 18, color: HEX.redLt, align: "center", isTextBox: true });
    await iconChip(s, FA.FaLinkSlash, M, 2.1, 1.0, HEX.red);
    s.addText("Breaking the chain", { x: M, y: 3.2, w: 11.5, h: 1.0, fontFace: "Century Schoolbook", fontSize: 46, bold: true, color: HEX.ink, isTextBox: true });
    s.addText("Disrupting supply chain attacks on npm and GitHub Actions", { x: M, y: 4.35, w: 11.5, h: 0.6, fontFace: "Calibri", fontSize: 22, color: HEX.amber, italic: true, isTextBox: true });
    s.addText([{ text: "Technical case study", options: { color: HEX.sub } }, { text: "   ·   ", options: { color: HEX.muted } }, { text: "Rod Trent", options: { color: HEX.sub } }, { text: "   ·   ", options: { color: HEX.muted } }, { text: "GitHub Security Lab", options: { color: HEX.sub } }],
      { x: M, y: 5.5, w: 11, h: 0.4, fontFace: "Calibri", fontSize: 14, isTextBox: true });
    s.addNotes(
`[TITLE — ~25 sec]

"Thanks for having me. One maintainer gets phished on a Tuesday. By Wednesday, malware is riding inside hundreds of packages. We saw that pattern again and again with Shai-Hulud and the tj-actions compromise, because these attacks spread on the ecosystem's own trust.

There's no silver bullet. The defense is to cut every link in the chain. I'll show npm blocking a malicious install, then walk through a CI pipeline hijacked by nothing more than an issue title."

[Advance to slide 2.]`);
  }

  // ================= SLIDE 2 — The problem / anatomy =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The problem", HEX.redLt);
    title(s, "One compromise becomes a thousand");
    s.addText("Modern supply chain attacks are self-replicating. Compromise one maintainer, and the malware rides the ecosystem's own trust to everyone downstream.", { x: M, y: 1.35, w: W - 2 * M, h: 0.7, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true });
    const stages = [
      [FA.FaUserSecret, "1. Compromise", "Phish a maintainer, or abuse a CI misconfig. Now the attacker can publish as someone you trust."],
      [FA.FaKey, "2. Steal credentials", "A postinstall script or a hijacked workflow harvests npm tokens, cloud keys, and GITHUB_TOKEN."],
      [FA.FaVirusCovid, "3. Propagate", "Use the stolen tokens to inject the same payload into every other package they can publish. Repeat."],
    ];
    const cw = 3.75, gap = 0.55, y = 2.4, bh = 3.2;
    let x = M;
    for (let i = 0; i < stages.length; i++) {
      const [ic, h, b] = stages[i];
      card(s, x, y, cw, bh, "1A1012");
      await iconChip(s, ic, x + cw / 2 - 0.45, y + 0.35, 0.9, HEX.red);
      s.addText(h, { x: x + 0.25, y: y + 1.45, w: cw - 0.5, h: 0.4, fontFace: "Calibri", fontSize: 17, bold: true, color: HEX.ink, align: "center", isTextBox: true });
      s.addText(b, { x: x + 0.25, y: y + 1.9, w: cw - 0.5, h: 1.2, fontFace: "Calibri", fontSize: 12.5, color: HEX.sub, align: "center", isTextBox: true });
      if (i < stages.length - 1) s.addText("➜", { x: x + cw + 0.02, y: y + bh / 2 - 0.3, w: gap - 0.04, h: 0.6, fontSize: 22, color: HEX.red, align: "center", isTextBox: true });
      x += cw + gap;
    }
    s.addText([{ text: "The loop is the danger: ", options: { bold: true, color: HEX.redLt } }, { text: "stage 3 feeds stage 1 again. That's how a worm like 2025's Shai-Hulud hit hundreds of packages.", options: { color: HEX.sub } }],
      { x: M, y: 5.8, w: W - 2 * M, h: 0.5, fontFace: "Calibri", fontSize: 14, align: "center", isTextBox: true });
    s.addNotes(
`[THE PROBLEM — ~55 sec]

"Three stages, and it's a loop. Compromise: phish a maintainer or abuse a CI misconfiguration, and now the attacker publishes as someone you trust. Steal credentials: a postinstall script or a hijacked workflow harvests npm tokens, cloud keys, and the GitHub token in CI. Propagate: use those tokens to push the same payload into every package that maintainer can publish.

Follow the arrow back. Stage three feeds stage one on a fresh set of victims. That's a worm, and it's why cleaning up one package isn't enough. Break any link and the chain reaction stops. The rest of this talk is a defense for each link."

[Advance to slide 3.]`);
  }

  // ================= SLIDE 3 — Why it matters =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "Why it matters", HEX.amber);
    title(s, "You run far more code than you read");
    const stats = [["1000s", "of transitive dependencies in a typical app", HEX.amber], ["Hours", "from first compromise to ecosystem-wide spread", HEX.red], ["0", "lines of it most teams actually review", HEX.blue]];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    stats.forEach(([big, small, col], i) => {
      const x = M + i * (cw + 0.4);
      card(s, x, 1.7, cw, 1.9);
      s.addText(big, { x: x + 0.2, y: 1.9, w: cw - 0.4, h: 0.9, fontFace: "Century Schoolbook", fontSize: 44, bold: true, color: col, isTextBox: true });
      s.addText(small, { x: x + 0.2, y: 2.85, w: cw - 0.4, h: 0.7, fontFace: "Calibri", fontSize: 13, color: HEX.sub, isTextBox: true });
    });
    card(s, M, 3.95, W - 2 * M, 2.65, HEX.panel);
    s.addText("The trust you extend without noticing", { x: M + 0.3, y: 4.12, w: 10, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, isTextBox: true });
    const who = [
      [FA.FaDownload, "Every install", "npm install runs third-party code on your machine — with your permissions, your secrets."],
      [FA.FaGears, "Every CI run", "Your pipeline holds the keys: publish tokens, cloud creds, a writable GITHUB_TOKEN."],
      [FA.FaArrowUpRightDots, "Every release", "A compromised publish flows straight to every downstream user, automatically."],
      [FA.FaEarthAmericas, "Everyone downstream", "Your users inherit the risk of every dependency you ever added."],
    ];
    const ww = (W - 2 * M - 0.6 - 3 * 0.3) / 4; let wx = M + 0.3;
    for (const [ic, h, b] of who) {
      await iconChip(s, ic, wx, 4.6, 0.55, HEX.amber);
      s.addText(h, { x: wx, y: 5.2, w: ww, h: 0.3, fontFace: "Calibri", fontSize: 13, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: wx, y: 5.5, w: ww, h: 1.0, fontFace: "Calibri", fontSize: 10.5, color: HEX.sub, isTextBox: true });
      wx += ww + 0.3;
    }
    s.addNotes(
`[WHY IT MATTERS — ~30 sec]

"You run far more code than you read: thousands of transitive dependencies, spread measured in hours, and close to zero lines actually reviewed. Every install runs a stranger's code with your permissions. Every CI run holds the real keys. Every release flows downstream automatically. Each of those moments is now a place to put a defense."

[Advance to slide 4.]`);
  }

  // ================= SLIDE 4 — The strategy =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The solution", HEX.green);
    title(s, "Break every link, not just one");
    s.addText("There's no single fix. GitHub and npm shipped layered defenses in 2026 — each one cuts a specific link in the kill chain.", { x: M, y: 1.35, w: W - 2 * M, h: 0.7, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true });
    const rows = [
      [FA.FaUserSecret, "Compromise", "npm 72-hr read-only on account takeover · safer checkout defaults · workflow trigger policies", HEX.red],
      [FA.FaKey, "Steal credentials", "Install scripts off by default (npm 12) · trusted publishing (OIDC) removes the token · network firewall", HEX.amber],
      [FA.FaVirusCovid, "Propagate", "Staged publishing + 2FA · Dependabot cooldown · instant credential revocation", HEX.green],
    ];
    let y = 2.35;
    for (const [ic, stage, def, col] of rows) {
      card(s, M, y, W - 2 * M, 1.25, HEX.panel);
      await iconChip(s, ic, M + 0.3, y + 0.3, 0.65, col);
      s.addText(stage, { x: M + 1.2, y: y + 0.18, w: 3.0, h: 0.9, fontFace: "Calibri", fontSize: 17, bold: true, color: col, valign: "middle", isTextBox: true });
      s.addShape(pres.ShapeType.line, { x: M + 4.2, y: y + 0.2, w: 0, h: 0.85, line: { color: HEX.line, width: 1 } });
      s.addText(def, { x: M + 4.5, y: y + 0.18, w: W - 2 * M - 4.8, h: 0.9, fontFace: "Calibri", fontSize: 13, color: HEX.sub, valign: "middle", isTextBox: true });
      y += 1.4;
    }
    s.addNotes(
`[THE STRATEGY — ~45 sec]

"Here's the map: the same kill chain, with the 2026 defenses on each link.

Compromise: npm's 72-hour read-only mode after an email change or 2FA recovery, safer checkout defaults, and workflow trigger policies.
Steal credentials: install scripts off by default in npm 12, trusted publishing with OIDC so there's no long-lived token, and an Actions network firewall.
Propagate: staged publishing behind 2FA, Dependabot cooldown, and instant credential revocation.

None of these stops everything alone. Together they make the attack expensive at every step. Let's see the biggest one."

[CLOCK CHECK: you should be under 3:00 here. Slide 5 is a quick setup. The npm 11 vs npm 12 contrast on slide 6 is the moment to protect.]
[Advance to slide 5.]`);
  }

  // ================= SLIDE 5 — DEMO 1 setup =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "Demo · the biggest single change", HEX.green);
    title(s, "Install scripts: the attacker's favorite door");
    s.addText("A package's postinstall script runs automatically on npm install — with your shell, your environment, your tokens. It's the classic credential-theft vector.", { x: M, y: 1.35, w: W - 2 * M, h: 0.7, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true });
    card(s, M, 2.3, W - 2 * M, 2.0, "1A1012");
    s.addText("color-utilz/package.json  (the malicious dependency)", { x: M + 0.25, y: 2.4, w: 9, h: 0.3, fontFace: "Calibri", fontSize: 11, color: HEX.muted, isTextBox: true });
    s.addText([mono('"scripts": {\n', { color: HEX.sub }), mono('  "postinstall": "node steal.js"', { color: HEX.redLt }), mono("\n}\n", { color: HEX.sub }), mono("// steal.js: harvest env tokens -> POST to attacker.example", { color: HEX.muted })],
      { x: M + 0.25, y: 2.7, w: W - 2 * M - 0.5, h: 1.5, fontSize: 14, isTextBox: true, valign: "top" });
    const chips = [[FA.FaGhost, "Runs silently", "No prompt, no review — just npm install."], [FA.FaKey, "Full access", "Your env vars, SSH keys, cloud creds."], [FA.FaBolt, "Instant spread", "The payload re-publishes itself."]];
    const cw = (W - 2 * M - 2 * 0.3) / 3; let x = M;
    for (const [ic, h, b] of chips) {
      card(s, x, 4.5, cw, 1.9, HEX.panel);
      await iconChip(s, ic, x + 0.25, 4.7, 0.6, HEX.red);
      s.addText(h, { x: x + 1.0, y: 4.72, w: cw - 1.2, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: x + 1.0, y: 5.07, w: cw - 1.2, h: 0.9, fontFace: "Calibri", fontSize: 11.5, color: HEX.sub, isTextBox: true });
      s.addText([mono("", {})], { x, y: 6.0, w: 0.1, h: 0.1, isTextBox: true });
      x += cw + 0.3;
    }
    s.addNotes(
`[DEMO SETUP — ~60 sec]

"Let's talk about the attacker's single favorite door: install scripts.

When you run npm install, packages are allowed to run 'lifecycle scripts' — and the one that matters here is postinstall. It's arbitrary code that executes automatically, as soon as the package lands, with your shell, your environment, your tokens. No prompt. No review. You typed 'npm install' and something ran.

Look at the package.json on the slide — this is my stand-in malicious dependency, color-utilz. All it takes is that one 'postinstall' line pointing at a script, and now that script runs on every machine and every CI job that installs it. In a real attack, steal.js harvests your environment, POSTs your tokens to the attacker, and then re-publishes itself into your packages — that's stages two and three of the loop, happening silently during a routine install.

The three properties on the bottom are why attackers love it: it runs silently, it has full access to your environment, and it spreads instantly. For years, this was on by default. Watch what npm 12 does about it."

[Advance to slide 6, then Alt+Tab to the launchpad: audience view, Talk 2, scrolled to card 4.]`);
  }

  // ================= SLIDE 6 — DEMO 1 results =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    kicker(s, "Demo · the fix", HEX.green);
    title(s, "Same install. npm 12 shuts the door.");
    // Act 1
    card(s, M, 1.6, 5.95, 4.8, "1A1012");
    s.addText("npm 11 — install scripts ON by default", { x: M + 0.25, y: 1.75, w: 5.5, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.redLt, isTextBox: true });
    s.addText([mono("$ npm install\n\n", { color: HEX.sub }), mono("> color-utilz postinstall\n", { color: HEX.muted }), mono("[!] harvested NPM_TOKEN=npm_FAKE…\n", { color: HEX.redLt }), mono("[!] would POST to attacker.example\n", { color: HEX.redLt }), mono("[!] would re-publish to your packages\n\n", { color: HEX.redLt }), mono("added 1 package", { color: HEX.sub })],
      { x: M + 0.25, y: 2.2, w: 5.5, h: 3.9, fontSize: 12.5, isTextBox: true, valign: "top" });
    await iconChip(s, FA.FaCircleXmark, M + 0.25, 5.75, 0.5, HEX.red);
    s.addText("Credentials gone before you blink", { x: M + 0.9, y: 5.78, w: 5, h: 0.45, fontFace: "Calibri", fontSize: 12.5, color: HEX.redLt, bold: true, valign: "middle", isTextBox: true });
    // Act 2
    const rx = 7.1;
    card(s, rx, 1.6, W - rx - M, 4.8, "0E1A12");
    s.addText("npm 12 — blocked by default", { x: rx + 0.25, y: 1.75, w: 5.5, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.greenLt, isTextBox: true });
    s.addText([mono("$ npm install\n\n", { color: HEX.sub }), mono("npm warn install-scripts\n", { color: HEX.amber }), mono("1 package had install scripts\n", { color: HEX.amber }), mono("blocked: color-utilz (postinstall)\n\n", { color: HEX.amber }), mono("Run `npm install-scripts ls`\n", { color: HEX.sub }), mono("to review, approve, or deny.\n\n", { color: HEX.sub }), mono("added 1 package", { color: HEX.sub })],
      { x: rx + 0.25, y: 2.2, w: W - rx - M - 0.5, h: 3.9, fontSize: 12.5, isTextBox: true, valign: "top" });
    await iconChip(s, FA.FaCircleCheck, rx + 0.25, 5.75, 0.5, HEX.green);
    s.addText("Script never ran. You decide, explicitly.", { x: rx + 0.9, y: 5.78, w: 5, h: 0.45, fontFace: "Calibri", fontSize: 12.5, color: HEX.greenLt, bold: true, valign: "middle", isTextBox: true });
    s.addNotes(
`[DEMO — ~3 min]  >>> SWITCH TO LAUNCHPAD (Alt+Tab): Talk 2, card 4 "Run output", npm 11 vs 12 tab <<<
(Captured run, not live. Click ▶ once per act; don't use "Show all".)

"Same project, same dependency, two different versions of npm. The installs take a while, so I captured this run ahead of time. It's the real output.

[Click ▶ Act 1 · npm 11.] Here's today's default for most people: npm install...

...and there it goes. The postinstall fired. It found my NPM_TOKEN — that's a fake one for the demo — and it's telling us exactly what it would do: POST those credentials to an attacker server, and re-publish itself into my packages. Game over, and all I did was install a dependency. Your credentials are gone before you even read the output.

[Click ▶ Act 2 · npm 12.] Now the identical command, on npm 12.

Look at that. 'One package had install scripts blocked.' The script did not run. npm 12 flips the default — install scripts are OFF unless you explicitly allow them. You stay in control:

[Click ▶ Review.] you run 'npm install-scripts ls' to see what wanted to run, and you approve only the packages you actually trust, which gets recorded in your package.json.

This is the single highest-impact change in the whole talk, because it closes the easiest, most-used door by DEFAULT — it protects people who do nothing. The attacker's favorite vector just stopped working for free."

[If the launchpad won't load: demos/backup has the captured output.]
>>> BACK TO POWERPOINT (click the slideshow) <<<  Advance to slide 7.`);
  }

  // ================= SLIDE 7 — credential theft in CI (bridge to CodeQL) =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The other door: your pipeline", HEX.amber);
    title(s, "Attackers don't need your laptop — CI has the keys");
    s.addText("Your workflows hold publish tokens and a writable GITHUB_TOKEN. Two classic ways in — and CodeQL (my other talk) flags both.", { x: M, y: 1.35, w: W - 2 * M, h: 0.7, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true });
    const left = [[FA.FaTerminal, "Script injection", "An attacker-controlled issue title or PR branch name is pasted into a run: block and executes as shell."]];
    const right = [[FA.FaCodePullRequest, "“Pwn request”", "pull_request_target runs fork code with the base repo's secrets and a write token in scope."]];
    const colW = (W - 2 * M - 0.5) / 2;
    const render = async (arr, x0, col) => {
      card(s, x0, 2.3, colW, 2.4, "1A1012");
      const [ic, h, b] = arr[0];
      await iconChip(s, ic, x0 + 0.3, 2.55, 0.8, col);
      s.addText(h, { x: x0 + 1.3, y: 2.6, w: colW - 1.6, h: 0.5, fontFace: "Calibri", fontSize: 18, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: x0 + 0.3, y: 3.5, w: colW - 0.6, h: 1.1, fontFace: "Calibri", fontSize: 13, color: HEX.sub, isTextBox: true });
    };
    await render(left, M, HEX.red);
    await render(right, M + colW + 0.5, HEX.amber);
    card(s, M, 4.95, W - 2 * M, 1.5, HEX.panel);
    await iconChip(s, FA.FaMagnifyingGlassChart, M + 0.3, 5.25, 0.9, HEX.green);
    s.addText([{ text: "Detect before you ship.  ", options: { bold: true, color: HEX.greenLt } }, { text: "CodeQL's ", options: { color: HEX.sub } }, mono("actions/code-injection", { color: HEX.ink }), { text: " and ", options: { color: HEX.sub } }, mono("actions/untrusted-checkout", { color: HEX.ink }), { text: " queries catch both patterns in the PR. One toolchain, code and CI.", options: { color: HEX.sub } }],
      { x: M + 1.5, y: 5.15, w: W - 2 * M - 1.8, h: 1.1, fontFace: "Calibri", fontSize: 14, valign: "middle", isTextBox: true });
    s.addNotes(
`[CI IS THE OTHER DOOR — ~60 sec]

"Now, install scripts are about your laptop and your build. But attackers often don't even need that — because your CI pipeline already holds the keys. Your workflows have publish tokens and a writable GitHub token sitting right there.

There are two classic ways in. On the left, script injection: an attacker-controlled value — like an issue title or a pull-request branch name — gets pasted into a shell command in a workflow and executes. On the right, the 'pwn request': a workflow triggered by pull_request_target runs code from a FORK, but with the base repository's secrets and a write token in scope. So untrusted code runs in a trusted context.

Here's the nice connection — and it ties directly to my CodeQL talk. We can DETECT both of these before they ship. CodeQL's 'code-injection' and 'untrusted-checkout' queries flag exactly these patterns, right in the pull request. So it's one toolchain across both surfaces: your application code and your CI.

Let me walk you through the script-injection one — because it's genuinely a little shocking how easy it is."

[Advance to slide 8, then Alt+Tab to the launchpad: Talk 2, scroll UP to card 3 (vulnerable vs hardened).]`);
  }

  // ================= SLIDE 8 — DEMO 2 =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    kicker(s, "Anatomy · a workflow hijack", HEX.redLt);
    title(s, "An issue title that runs code");
    card(s, M, 1.55, W - 2 * M, 1.5, "1A1012");
    s.addText("Attacker opens an issue titled:", { x: M + 0.25, y: 1.65, w: 10, h: 0.3, fontFace: "Calibri", fontSize: 11, color: HEX.muted, isTextBox: true });
    s.addText([mono('Login crash"; echo "PWNED as $(whoami)"; echo $DEPLOY_TOKEN | base64; #', { color: HEX.redLt })], { x: M + 0.25, y: 1.95, w: W - 2 * M - 0.5, h: 1.0, fontSize: 13, isTextBox: true, valign: "top" });
    // before
    card(s, M, 3.25, 5.95, 3.1, "1A1012");
    s.addText("Vulnerable workflow", { x: M + 0.25, y: 3.35, w: 5.5, h: 0.3, fontFace: "Calibri", fontSize: 13, bold: true, color: HEX.redLt, isTextBox: true });
    s.addText([mono('run: |\n  echo "Thanks: ', { color: HEX.sub }), mono("${{ github.event.issue.title }}", { color: HEX.redLt }), mono('"', { color: HEX.sub })], { x: M + 0.25, y: 3.7, w: 5.5, h: 0.9, fontSize: 12, isTextBox: true, valign: "top" });
    await iconChip(s, FA.FaSkullCrossbones, M + 0.25, 4.7, 0.5, HEX.red);
    s.addText("Actions log prints: PWNED as runner + the secret", { x: M + 0.9, y: 4.68, w: 5, h: 0.6, fontFace: "Calibri", fontSize: 11.5, color: HEX.redLt, bold: true, valign: "middle", isTextBox: true });
    // after
    const rx = 7.1;
    card(s, rx, 3.25, W - rx - M, 3.1, "0E1A12");
    s.addText("Hardened workflow", { x: rx + 0.25, y: 3.35, w: 5.5, h: 0.3, fontFace: "Calibri", fontSize: 13, bold: true, color: HEX.greenLt, isTextBox: true });
    s.addText([mono("env:\n  TITLE: ", { color: HEX.sub }), mono("${{ github.event.issue.title }}", { color: HEX.greenLt }), mono('\nrun: |\n  echo "Thanks: $TITLE"', { color: HEX.sub })], { x: rx + 0.25, y: 3.7, w: W - rx - M - 0.5, h: 1.2, fontSize: 12, isTextBox: true, valign: "top" });
    await iconChip(s, FA.FaShieldHalved, rx + 0.25, 4.9, 0.5, HEX.green);
    s.addText("Shell treats $TITLE as data, never code", { x: rx + 0.9, y: 4.88, w: 5, h: 0.6, fontFace: "Calibri", fontSize: 11.5, color: HEX.greenLt, bold: true, valign: "middle", isTextBox: true });
    s.addNotes(
`[ANATOMY WALK-THROUGH — ~90 sec]  NARRATE FROM THE LAUNCHPAD, not the slide
Launchpad: Talk 2 tab -> card 3, "Slide 8 walk-through": vulnerable vs hardened, side by side, with the risky lines highlighted.

"Install scripts are the laptop door. This is the pipeline door, and it's shockingly simple. Picture a workflow that just greets people who open an issue. The attack is the issue title itself.

The payload isn't really a title. It's shell: it closes the echo string, then runs its own commands to print who it's running as and dump a secret.

On the left, the vulnerable workflow. The issue-title expression is substituted into the script before bash ever runs, so whatever the attacker types becomes code. [Point at the red line.] And look at what's in scope: a secret and a write token.

On the right, the fix, and it's beautifully boring. Pass the title in as an environment variable and reference it as a shell variable, dollar-TITLE. Now the shell treats it as data, never code. Plus a deny-all default token, and no secrets in that job.

I shipped this fix as a merged pull request on the demo repo, and CodeQL's code-injection alert closed automatically when it merged. Detection and prevention in one loop."

[IF ASKED TO SEE IT FIRE: still on the launchpad, scroll to card 4, "Actions injection log" tab, ▶ Run log then ▶ Decode (captured run; say so). The real run is on GitHub: Actions run 37133006732. Not firing it live in the interview.]
>>> BACK TO POWERPOINT (click the slideshow) <<<  Advance to slide 9.`);
  }

  // ================= SLIDE 9 — harden the pipeline =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "Prevention · defaults that changed", HEX.blue);
    title(s, "Safe-by-default CI (June–July 2026)");
    const items = [
      [FA.FaCircleCheck, "Safer checkout", "actions/checkout now refuses untrusted fork code on pull_request_target unless you add the loud allow-unsafe-pr-checkout flag."],
      [FA.FaSliders, "Trigger policies", "Enterprise/org/repo rules for who and what can trigger workflows."],
      [FA.FaBoxArchive, "Read-only cache", "Untrusted triggers can no longer poison the Actions cache."],
      [FA.FaThumbtack, "Pin to SHA", "Pin third-party actions to a full commit SHA, not a mutable tag."],
    ];
    const cw = (W - 2 * M - 0.4) / 2, ch = 2.0; let i = 0;
    for (const [ic, h, b] of items) {
      const x = M + (i % 2) * (cw + 0.4);
      const y = 1.75 + Math.floor(i / 2) * (ch + 0.35);
      card(s, x, y, cw, ch, HEX.panel);
      await iconChip(s, ic, x + 0.3, y + 0.35, 0.7, HEX.blue);
      s.addText(h, { x: x + 1.2, y: y + 0.32, w: cw - 1.5, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: x + 1.2, y: y + 0.75, w: cw - 1.5, h: 1.1, fontFace: "Calibri", fontSize: 12.5, color: HEX.sub, isTextBox: true });
      i++;
    }
    s.addNotes(
`[PREVENTION: SAFE DEFAULTS — ~60 sec]

"That demo was detection and a manual fix. But the bigger wins are the DEFAULTS that changed in 2026 — because they protect everyone, even people who never touch their config.

Safer checkout — this is the big one. actions/checkout now REFUSES to check out untrusted fork code on the dangerous triggers, unless you add a flag literally called 'allow-unsafe-pr-checkout'. And that ugly name is intentional — it's designed to scream in code review and to static analysis, so nobody adds it by accident.

Trigger policies — enterprises and orgs can now centrally control who and what is allowed to trigger workflows.

Read-only cache — untrusted triggers can no longer poison the Actions cache to smuggle code into a privileged job.

And pin to SHA — this is a best practice you should adopt today: pin third-party actions to a full commit SHA, not a mutable tag like v4, so a compromised tag can't silently change what runs. All my hardened reference workflows in the repo do this.

Those shut doors. But the strongest move is to make sure there's nothing worth stealing in the first place."

[Advance to slide 10.]`);
  }

  // ================= SLIDE 10 — kill the credential =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "Prevention · remove the secret", HEX.green);
    title(s, "The best token is no token");
    s.addText("If there's no long-lived credential to steal, the whole kill chain loses its fuel.", { x: M, y: 1.35, w: W - 2 * M, h: 0.5, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true });
    const items = [
      [FA.FaFingerprint, "Trusted publishing (OIDC)", "npm exchanges a short-lived GitHub identity token at publish time. No NPM_TOKEN in the repo to leak — and provenance is signed automatically."],
      [FA.FaStairs, "Staged publishing + 2FA", "npm stage publish holds the release in a queue until a human approves it with a 2FA challenge. Compromised CI can't publish on its own."],
      [FA.FaBan, "Instant revocation", "Self-service tools revoke every credential across an enterprise at once — PATs, OAuth, and App tokens — to shut an incident down fast."],
    ];
    let y = 1.95;
    for (const [ic, h, b] of items) {
      card(s, M, y, W - 2 * M, 1.4, HEX.panel);
      await iconChip(s, ic, M + 0.3, y + 0.35, 0.7, HEX.green);
      s.addText(h, { x: M + 1.3, y: y + 0.22, w: W - 2 * M - 1.6, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: M + 1.3, y: y + 0.62, w: W - 2 * M - 1.6, h: 0.7, fontFace: "Calibri", fontSize: 12.5, color: HEX.sub, isTextBox: true });
      y += 1.55;
    }
    s.addNotes(
`[PREVENTION: KILL THE TOKEN — ~60 sec]

"The whole attack runs on stolen credentials. So the strongest defense is simple: if there's no long-lived credential to steal, the kill chain loses its fuel.

Trusted publishing with OIDC — this is the big one for maintainers. Instead of storing a long-lived NPM_TOKEN in your repo, npm exchanges a short-lived identity token from GitHub at the moment of publish. There is no secret sitting in CI to leak — and as a bonus, you get signed provenance automatically, so consumers can verify where the package was built.

Staged publishing with 2FA — you run 'npm stage publish', and the release sits in a queue until a human approves it with a 2FA challenge. So even if your CI is fully compromised, it can't push a release on its own. You can even make a publisher 'stage-only' so direct publishes are rejected outright.

And instant revocation — when something does go wrong, self-service tools let you revoke every credential across an enterprise at once: personal access tokens, OAuth, and app tokens. That turns a multi-day incident into a fast one.

Even with all that, a bad version can still slip out somewhere. So the last layer is about not catching it yourself."

[Advance to slide 11.]`);
  }

  // ================= SLIDE 11 — slow the blast radius =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "Containment · buy time", HEX.purple);
    title(s, "Don't adopt malware on day zero");
    s.addText("Most malicious releases are caught and pulled within hours to days. A short wait lets the ecosystem's detection win the race.", { x: M, y: 1.35, w: W - 2 * M, h: 0.7, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true });
    card(s, M, 2.3, 6.6, 2.6, HEX.panel);
    s.addText("dependabot.yml", { x: M + 0.25, y: 2.4, w: 5, h: 0.3, fontFace: "Calibri", fontSize: 11, color: HEX.muted, isTextBox: true });
    s.addText([mono("updates:\n  - package-ecosystem: npm\n    ", { color: HEX.sub }), mono("cooldown:\n      default-days: 3\n      semver-major-days: 14", { color: HEX.purple })], { x: M + 0.25, y: 2.7, w: 6.1, h: 2.0, fontSize: 13.5, isTextBox: true, valign: "top" });
    const rx = 7.1;
    const pts = [[FA.FaHourglassHalf, "Version updates wait", "A new release sits for the cooldown window before Dependabot opens a PR."], [FA.FaShieldHeart, "Security fixes don't", "Security updates are never delayed — critical patches still land immediately."], [FA.FaUsersViewfinder, "Detection wins", "Gives scanners and the community time to flag a bad release first."]];
    let yy = 2.3;
    for (const [ic, h, b] of pts) {
      await iconChip(s, ic, rx + 0.1, yy, 0.6, HEX.purple);
      s.addText(h, { x: rx + 0.85, y: yy - 0.02, w: W - rx - M - 0.9, h: 0.35, fontFace: "Calibri", fontSize: 14.5, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: rx + 0.85, y: yy + 0.33, w: W - rx - M - 0.9, h: 0.75, fontFace: "Calibri", fontSize: 12, color: HEX.sub, isTextBox: true });
      yy += 1.35;
    }
    s.addText([{ text: "Defense in depth: ", options: { bold: true, color: HEX.purple } }, { text: "even if a bad version ships, you don't install it on day one.", options: { color: HEX.sub } }],
      { x: M, y: 6.0, w: W - 2 * M, h: 0.4, fontFace: "Calibri", fontSize: 14, align: "center", isTextBox: true });
    s.addNotes(
`[CONTAINMENT: COOLDOWN — ~45 sec]

"Last link in the chain — the consumer. Here's a simple but powerful idea: don't adopt a brand-new release on day zero.

Most malicious releases get caught and pulled within hours to a few days. So if you just wait a little, you let the whole ecosystem's detection win the race for you.

That's Dependabot cooldown. In your dependabot.yml, you set a cooldown — here, three days for normal updates, fourteen for major versions. A new release has to age past that window before Dependabot even opens the PR.

The critical caveat — and please hear this one — SECURITY updates are never delayed. Cooldown only applies to routine version bumps. Real security fixes still land immediately, so you're not trading safety for safety.

It's pure defense in depth: even if a malicious version ships, you're simply not installing it on the day it's most dangerous. Let me pull it all together."

[Advance to slide 12.]`);
  }

  // ================= SLIDE 12 — impact =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The impact", HEX.green);
    title(s, "What gets better");
    const left = [[FA.FaDoorClosed, "The easy doors close", "Install scripts off, fork checkout refused, cache read-only — by default, for everyone."], [FA.FaKey, "Fewer secrets to steal", "OIDC and staged publishing remove the long-lived tokens attacks depend on."], [FA.FaGaugeHigh, "Smaller blast radius", "Cooldown and instant revocation slow and contain a compromise."]];
    const right = [[FA.FaUserShield, "Maintainers", "Account-takeover protection and a 2FA publish gate, out of the box."], [FA.FaBuildingShield, "Organizations", "Trigger policies and enterprise-wide revocation for real incident response."], [FA.FaHandshakeAngle, "The ecosystem", "Every closed door upstream protects everyone downstream."]];
    const colW = (W - 2 * M - 0.5) / 2;
    const render = async (arr, x0) => {
      card(s, x0, 1.7, colW, 4.7, HEX.panel);
      let yy = 1.95;
      for (const [ic, h, b] of arr) {
        await iconChip(s, ic, x0 + 0.3, yy, 0.65, HEX.green);
        s.addText(h, { x: x0 + 1.1, y: yy, w: colW - 1.4, h: 0.35, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, isTextBox: true });
        s.addText(b, { x: x0 + 1.1, y: yy + 0.35, w: colW - 1.4, h: 0.8, fontFace: "Calibri", fontSize: 12, color: HEX.sub, isTextBox: true });
        yy += 1.45;
      }
    };
    await render(left, M);
    await render(right, M + colW + 0.5);
    s.addNotes(
`[IMPACT — ~45 sec]

"So what actually gets better? On the left, each link in the kill chain is now weaker. The easy doors close — install scripts off, fork checkout refused, cache read-only, all by default. There are fewer secrets to steal — OIDC and staged publishing remove the long-lived tokens attacks depend on. And the blast radius is smaller — cooldown and instant revocation slow and contain anything that does get through.

On the right, concrete wins per audience. Maintainers get account-takeover protection and a 2FA publish gate out of the box. Organizations get trigger policies and enterprise-wide revocation for real incident response. And the whole ecosystem benefits, because every door that closes upstream protects everyone downstream.

The meta-point: there's no silver bullet here. It's layered, secure-by-default change that makes the entire ecosystem safer — without requiring every developer to become a security expert. Here's what to remember."

[Advance to slide 13.]`);
  }

  // ================= SLIDE 13 — takeaways =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    for (let i = 0; i < 6; i++) s.addShape(pres.ShapeType.roundRect, { x: 9.5 + i * 0.6, y: 0.5, w: 0.5, h: 0.22, rectRadius: 0.11, fill: { type: "none" }, line: { color: HEX.green, width: 2 } });
    kicker(s, "The takeaway", HEX.green);
    title(s, "Make the attack expensive at every step");
    const takeaways = [[FA.FaLinkSlash, "No single fix — layers", "Each default cuts one link: compromise, credential theft, or propagation."], [FA.FaToggleOn, "Secure by default wins", "The biggest gains protect people who change nothing: scripts off, checkout safe."], [FA.FaKey, "Kill the long-lived token", "OIDC trusted publishing + staged publishing remove the thing attacks steal."]];
    let y = 1.9;
    for (const [ic, h, b] of takeaways) {
      await iconChip(s, ic, M, y, 0.8, HEX.green);
      s.addText(h, { x: M + 1.1, y: y + 0.02, w: 10.8, h: 0.4, fontFace: "Calibri", fontSize: 19, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: M + 1.1, y: y + 0.45, w: 10.8, h: 0.5, fontFace: "Calibri", fontSize: 14, color: HEX.sub, isTextBox: true });
      y += 1.25;
    }
    card(s, M, 5.75, W - 2 * M, 1.0, HEX.panel);
    s.addText([{ text: "Do next:  ", options: { bold: true, color: HEX.greenLt } }, { text: "upgrade to npm 12 · adopt OIDC trusted publishing · pin actions to SHA · turn on CodeQL for your workflows.", options: { color: HEX.sub } }],
      { x: M + 0.3, y: 5.9, w: W - 2 * M - 0.6, h: 0.7, fontFace: "Calibri", fontSize: 14, valign: "middle", isTextBox: true });
    s.addNotes(
`[TAKEAWAY — ~45 sec]

"Three things to walk out with. The theme is: make the attack expensive at every step.

One: there's no single fix — it's layers. Each default change cuts one link: compromise, credential theft, or propagation. Break enough links and the self-replicating loop can't sustain itself.

Two: secure-by-default wins. The biggest gains protect the people who change nothing — install scripts off, checkout safe. That's how you move an entire ecosystem, not just the security-conscious few.

Three: kill the long-lived token. If you do one thing after this talk, adopt OIDC trusted publishing. The thing attackers steal simply stops existing. And a security advisory can't stop a malicious publish that spreads within the same hour, which is why these controls are defaults, cooldown, and revocation rather than a CVE range.

Concretely, on the bottom: upgrade to npm 12, adopt trusted publishing, pin your actions to a SHA, and turn on CodeQL for your workflows. That last one is the bridge to my other talk — prevention, which is everything we just covered, PLUS detection with CodeQL, is the complete story.

Thank you — I'm happy to take questions."

[END. Invite Q&A — see SPEAKER-CHEATSHEET.md.]`);
  }

  const out = "C:/Code/GHJ/presentation/Supply-Chain-Breaking-the-Chain.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", out);
})();
