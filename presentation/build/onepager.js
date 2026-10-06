// One-page leave-behind (2 portrait pages: CodeQL + Supply chain)
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./skills-apply-theme");
const { THEME, HEX, icon } = require("./lib");
const FA = require("react-icons/fa6");

const PW = 8.5, PH = 11, M = 0.55;

(async () => {
  const pres = new pptxgen();
  pres.defineLayout({ name: "P", width: PW, height: PH });
  pres.layout = "P";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const card = (s, x, y, w, h, fill = HEX.panel) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.07, fill: { color: fill }, line: { color: HEX.line, width: 1 } });
  async function chip(s, I, x, y, d, c, ic = "FFFFFF") {
    s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: c }, line: { type: "none" } });
    s.addImage({ data: await icon(I, ic, 200), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
  }
  const mono = (t, e = {}) => ({ text: t, options: { fontFace: "Consolas", ...e } });

  async function page(cfg) {
    const s = pres.addSlide({ masterName: "BASE" });
    // header
    await chip(s, cfg.icon, M, 0.55, 0.85, cfg.accent);
    s.addText(cfg.kicker.toUpperCase(), { x: M + 1.05, y: 0.55, w: PW - 2 * M - 1.05, h: 0.3, fontFace: "Calibri", fontSize: 11, bold: true, color: cfg.accent, charSpacing: 2, isTextBox: true });
    s.addText(cfg.title, { x: M + 1.05, y: 0.82, w: PW - 2 * M - 1.05, h: 0.6, fontFace: "Century Schoolbook", fontSize: 23, bold: true, color: HEX.ink, isTextBox: true });
    s.addText(cfg.tagline, { x: M, y: 1.65, w: PW - 2 * M, h: 0.35, fontFace: "Calibri", fontSize: 13, italic: true, color: cfg.accentLt, isTextBox: true });

    let y = 2.2;
    // The problem
    s.addText("THE PROBLEM", { x: M, y, w: PW - 2 * M, h: 0.25, fontFace: "Calibri", fontSize: 11, bold: true, color: HEX.redLt, charSpacing: 1.5, isTextBox: true });
    s.addText(cfg.problem, { x: M, y: y + 0.27, w: PW - 2 * M, h: 0.6, fontFace: "Calibri", fontSize: 12, color: HEX.sub, isTextBox: true });
    y += 1.05;

    // Key moves (the meat)
    s.addText(cfg.movesLabel, { x: M, y, w: PW - 2 * M, h: 0.25, fontFace: "Calibri", fontSize: 11, bold: true, color: cfg.accentLt, charSpacing: 1.5, isTextBox: true });
    y += 0.32;
    for (const [ic, h, b] of cfg.moves) {
      card(s, M, y, PW - 2 * M, 0.92);
      await chip(s, ic, M + 0.18, y + 0.19, 0.54, cfg.accent);
      s.addText(h, { x: M + 0.95, y: y + 0.13, w: PW - 2 * M - 1.15, h: 0.3, fontFace: "Calibri", fontSize: 13, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: M + 0.95, y: y + 0.42, w: PW - 2 * M - 1.15, h: 0.45, fontFace: "Calibri", fontSize: 10.5, color: HEX.sub, isTextBox: true });
      y += 1.04;
    }

    // Demo box
    y += 0.05;
    card(s, M, y, PW - 2 * M, cfg.demoH, "11201A");
    s.addText([{ text: "LIVE DEMO   ", options: { bold: true, color: HEX.greenLt, fontFace: "Calibri" } }, ...cfg.demo], { x: M + 0.25, y: y + 0.13, w: PW - 2 * M - 0.5, h: cfg.demoH - 0.26, fontFace: "Calibri", fontSize: 10.5, color: HEX.sub, isTextBox: true, valign: "top" });
    y += cfg.demoH + 0.15;

    // Takeaways
    s.addText("TAKEAWAYS", { x: M, y, w: PW - 2 * M, h: 0.25, fontFace: "Calibri", fontSize: 11, bold: true, color: cfg.accentLt, charSpacing: 1.5, isTextBox: true });
    y += 0.3;
    const tk = cfg.takeaways.map((t, i) => ({ text: (i ? "\n" : "") + "• " + t, options: { color: HEX.sub, breakLine: true } }));
    s.addText(tk, { x: M, y, w: PW - 2 * M, h: 1.0, fontFace: "Calibri", fontSize: 11.5, paraSpaceAfter: 4, isTextBox: true, valign: "top" });

    // footer
    s.addText([mono(cfg.repo, { color: HEX.ink }), { text: "   ·   Rod Trent · GitHub Security Lab", options: { color: HEX.muted, fontFace: "Calibri" } }], { x: M, y: PH - 0.55, w: PW - 2 * M, h: 0.3, fontSize: 9.5, isTextBox: true });
  }

  pres.defineSlideMaster({ title: "BASE", background: { color: HEX.canvas } });

  await page({
    icon: FA.FaMagnifyingGlassChart, accent: HEX.green, accentLt: HEX.greenLt,
    kicker: "Case study 1", title: "CodeQL", tagline: "Find the bug class, not just the bug",
    problem: "The same vulnerability wears many disguises. Grep finds the string you thought of; attackers use the one you didn't. Real vulnerabilities are a data-flow problem — untrusted input reaching a dangerous sink — which pattern-matching can't follow across a program.",
    movesLabel: "HOW CODEQL SOLVES IT",
    moves: [
      [FA.FaDatabase, "Code as data", "Compiles source into a queryable database of structure + data flow; QL describes the shape of a bug and finds every instance."],
      [FA.FaFeatherPointed, "Models as data (MaD)", "One sink-model row teaches the whole query suite a new library's sinks — no new query, picked up by code scanning automatically."],
      [FA.FaCubesStacked, "One engine, two surfaces", "Scans application code AND GitHub Actions workflows (code-injection, untrusted-checkout), with fixes in the PR via Copilot Autofix."],
    ],
    demo: [{ text: "On a 60-line app, the default suite finds XSS + path traversal but ", options: {} }, { text: "misses the node:sqlite SQL injection", options: { bold: true, color: HEX.redLt } }, { text: ". One sink-model row makes it find both variants — and stay silent on the safe parameterized query. A 25-line QL query shows the source→sink taint path.", options: {} }],
    demoH: 1.15,
    takeaways: [
      "Code is data — turns \u201cis this safe?\u201d into a precise, repeatable query.",
      "Bug class > bug — catch every instance, not the one you grepped for.",
      "Modeling is the lever — extend the engine's model, rarely write a new query.",
    ],
    repo: "github.com/rod-trent/octo-notes-demo",
  });

  await page({
    icon: FA.FaLinkSlash, accent: HEX.green, accentLt: HEX.greenLt,
    kicker: "Case study 2", title: "Breaking the chain", tagline: "Disrupting supply chain attacks on npm & GitHub Actions",
    problem: "Modern supply-chain attacks self-replicate: compromise a maintainer → steal credentials (install scripts, hijacked CI) → propagate into every package those tokens can publish → repeat. One phished maintainer becomes malware in hundreds of packages within hours.",
    movesLabel: "BREAK EVERY LINK (2026 DEFENSES)",
    moves: [
      [FA.FaUserSecret, "Compromise", "npm 72-hr read-only on account takeover · actions/checkout refuses untrusted fork code (loud allow-unsafe-pr-checkout flag) · workflow trigger policies · read-only cache."],
      [FA.FaKey, "Steal credentials", "npm 12: install scripts OFF by default · trusted publishing (OIDC) removes the long-lived NPM_TOKEN entirely · Actions network firewall."],
      [FA.FaVirusCovid, "Propagate", "Staged publishing + 2FA gate (npm stage publish) · Dependabot cooldown (security updates never delayed) · instant credential revocation."],
    ],
    demo: [{ text: "Demo 1: the same ", options: {} }, mono("npm install", { color: HEX.ink }), { text: " runs a malicious postinstall on npm 11; ", options: {} }, { text: "npm 12 blocks it by default", options: { bold: true, color: HEX.greenLt } }, { text: ".  Demo 2: an issue title (", options: {} }, mono('...; echo PWNED; #', { color: HEX.redLt }), { text: ") executes code in a workflow and leaks a secret — then an env-var fix neutralizes it (CodeQL flags it critical).", options: {} }],
    demoH: 1.35,
    takeaways: [
      "No single fix — layers; break any link and the self-replicating loop stalls.",
      "Secure-by-default wins — biggest gains protect people who change nothing.",
      "Kill the long-lived token — OIDC + staged publishing remove what attacks steal.",
    ],
    repo: "github.com/rod-trent/GHJ",
  });

  const out = "C:/Code/GHJ/presentation/One-Pager-Leave-Behind.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", out);
})();
