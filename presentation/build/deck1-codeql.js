// Deck 1: CodeQL — "Find the bug class, not just the bug"
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
  const C = pres.SchemeColor;

  // ---------------- Layouts ----------------
  pres.defineSlideMaster({
    title: "DARK",
    background: { color: HEX.canvas },
    objects: [
      { text: { text: "", options: { x: 0, y: H - 0.5, w: W, h: 0.5 } } },
    ],
    slideNumber: { x: W - 0.6, y: H - 0.42, color: HEX.muted, fontSize: 9 },
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: HEX.canvas },
    objects: [
      { text: { text: "Rod Trent · CodeQL", options: { x: M, y: H - 0.42, w: 6, h: 0.3, fontFace: "Calibri", fontSize: 9, color: HEX.muted, align: "left" } } },
    ],
    slideNumber: { x: W - 0.6, y: H - 0.42, color: HEX.muted, fontSize: 9 },
  });

  // ---------------- Helpers ----------------
  const title = (slide, t, opts = {}) =>
    slide.addText(t, {
      x: M, y: 0.42, w: W - 2 * M, h: 0.9, fontFace: "Century Schoolbook",
      fontSize: 30, bold: true, color: HEX.ink, align: "left", isTextBox: true, ...opts,
    });

  const kicker = (slide, t, color = HEX.green) =>
    slide.addText(t.toUpperCase(), {
      x: M, y: 0.18, w: W - 2 * M, h: 0.3, fontFace: "Calibri", fontSize: 12,
      bold: true, color, charSpacing: 2, align: "left", isTextBox: true,
    });

  const card = (slide, x, y, w, h, fill = HEX.panel) =>
    slide.addShape(pres.ShapeType.roundRect, {
      x, y, w, h, rectRadius: 0.08, fill: { color: fill },
      line: { color: HEX.line, width: 1 },
    });

  async function iconChip(slide, IconCmp, x, y, d, circleHex, iconHex = "FFFFFF") {
    slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: circleHex }, line: { type: "none" } });
    const img = await icon(IconCmp, iconHex, 220);
    slide.addImage({ data: img, x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52 });
  }

  const mono = (s, extra = {}) => ({ text: s, options: { fontFace: "Consolas", ...extra } });

  // ================= SLIDE 1 — Title =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    // subtle dotted "scan grid" motif, top-right
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 10; c++)
        s.addShape(pres.ShapeType.ellipse, {
          x: 9.6 + c * 0.34, y: 0.5 + r * 0.34, w: 0.08, h: 0.08,
          fill: { color: r + c < 6 ? HEX.green : HEX.line }, line: { type: "none" },
        });
    await iconChip(s, FA.FaMagnifyingGlassChart, M, 2.2, 1.0, HEX.green);
    s.addText("CodeQL", {
      x: M, y: 3.3, w: 10, h: 1.0, fontFace: "Century Schoolbook", fontSize: 54,
      bold: true, color: HEX.ink, isTextBox: true,
    });
    s.addText("Find the bug class, not just the bug", {
      x: M, y: 4.35, w: 11, h: 0.6, fontFace: "Calibri", fontSize: 24, color: HEX.greenLt, italic: true, isTextBox: true,
    });
    s.addText(
      [
        { text: "Technical case study", options: { color: HEX.sub } },
        { text: "   ·   ", options: { color: HEX.muted } },
        { text: "Rod Trent", options: { color: HEX.sub } },
        { text: "   ·   ", options: { color: HEX.muted } },
        { text: "GitHub Security Lab", options: { color: HEX.sub } },
      ],
      { x: M, y: 5.5, w: 11, h: 0.4, fontFace: "Calibri", fontSize: 14, isTextBox: true }
    );
    s.addNotes(
`[TITLE — ~30 sec]

"Thanks for having me. Rather than tour CodeQL's features, I want to show you one shift: turning 'is my code vulnerable?' from a judgment call into a question a computer answers precisely, across millions of lines.

The plan: one small app, scanned three times. The first scan finds some bugs and quietly misses one. One sink-model row in a YAML file makes it find the whole class it missed. Then I'll show you the query doing the work. Find the bug class, not just the bug."

[Advance to slide 2.]`
    );
  }

  // ================= SLIDE 2 — The problem =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The problem", HEX.redLt);
    title(s, "You can't grep your way to security");
    s.addText(
      "The same vulnerability wears a hundred different disguises. Grep finds the string you thought of — attackers use the one you didn't.",
      { x: M, y: 1.35, w: W - 2 * M, h: 0.7, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true }
    );

    // Left: four disguises of one SQLi bug
    card(s, M, 2.3, 6.1, 4.3);
    s.addText("One bug class. Four faces.", { x: M + 0.3, y: 2.5, w: 5.5, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, isTextBox: true });
    const lines = [
      '`"... WHERE t LIKE \'%" + q + "%\'"`',
      "`` `...WHERE name = \"${owner}\"` ``",
      "`db.exec(buildQuery(req.body))`",
      "`query(req.query.q)   // via 3 helpers`",
    ];
    lines.forEach((t, i) => {
      s.addText([mono(t.replace(/`/g, ""), { color: HEX.redLt })], {
        x: M + 0.3, y: 3.0 + i * 0.75, w: 5.5, h: 0.6, fontSize: 12.5, align: "left", isTextBox: true, valign: "middle",
        fill: { color: HEX.panel2 },
      });
    });

    // Right: why it's hard
    const rx = 7.1;
    card(s, rx, 2.3, W - rx - M, 4.3, HEX.canvas);
    const pts = [
      [FA.FaCodeBranch, "It's a data-flow problem", "Untrusted input travels through functions, files, and variables before it ever reaches the database."],
      [FA.FaLayerGroup, "Grep sees strings, not flow", "Pattern matching can't follow a value across the program. It misses the indirect cases — the ones that ship."],
      [FA.FaClock, "Found late = expensive", "A bug caught in review costs minutes. The same bug in production costs an incident."],
    ];
    let yy = 2.55;
    for (const [ic, h, b] of pts) {
      await iconChip(s, ic, rx + 0.25, yy, 0.6, HEX.red);
      s.addText(h, { x: rx + 1.0, y: yy - 0.02, w: W - rx - M - 1.2, h: 0.35, fontFace: "Calibri", fontSize: 14.5, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: rx + 1.0, y: yy + 0.33, w: W - rx - M - 1.2, h: 0.75, fontFace: "Calibri", fontSize: 12, color: HEX.sub, isTextBox: true });
      yy += 1.35;
    }
    s.addNotes(
`[THE PROBLEM — ~60 sec]

"The same vulnerability wears a hundred disguises. Every snippet on the left is SQL injection: string concatenation, a template literal, a helper function, input laundered through three calls. A reviewer or a grep rule catches one or two of them. The indirect ones are the ones that ship.

That's the point on the right. This isn't a text problem, it's a data-flow problem: untrusted input travels through the program and reaches a dangerous operation, a sink. Grep sees one line at a time. It can't follow a value across functions and files.

Hold that model, untrusted input reaching a sink. In a few minutes you'll watch CodeQL find exactly that, including a variant the default scanner misses."

[Advance to slide 3.]`);
  }

  // ================= SLIDE 3 — Why it matters =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "Why it matters", HEX.amber);
    title(s, "The ecosystem runs on code nobody re-reads");
    const stats = [
      ["100M+", "developers on GitHub, shipping every day", HEX.green],
      ["Minutes", "to review a fix — an incident to clean one up", HEX.amber],
      ["1 query", "can protect every repo that uses a library", HEX.blue],
    ];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    stats.forEach(([big, small, col], i) => {
      const x = M + i * (cw + 0.4);
      card(s, x, 1.7, cw, 1.9);
      s.addText(big, { x: x + 0.2, y: 1.9, w: cw - 0.4, h: 0.9, fontFace: "Century Schoolbook", fontSize: 44, bold: true, color: col, align: "left", isTextBox: true });
      s.addText(small, { x: x + 0.2, y: 2.85, w: cw - 0.4, h: 0.65, fontFace: "Calibri", fontSize: 13, color: HEX.sub, align: "left", isTextBox: true });
    });

    card(s, M, 3.95, W - 2 * M, 2.65, HEX.panel);
    s.addText("Who feels this", { x: M + 0.3, y: 4.12, w: 8, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, isTextBox: true });
    const who = [
      [FA.FaLaptopCode, "Developers", "Catch bugs in the PR, with the fix shown inline — not a backlog ticket months later."],
      [FA.FaShieldHalved, "Security teams", "Scale expertise: encode one researcher's insight into a query that runs everywhere."],
      [FA.FaUsersGear, "Organizations", "Measurable, auditable coverage across thousands of repositories."],
      [FA.FaGlobe, "Open source", "The whole supply chain gets safer when upstream libraries are modeled once."],
    ];
    const ww = (W - 2 * M - 0.6 - 3 * 0.3) / 4;
    let wx = M + 0.3;
    for (const [ic, h, b] of who) {
      await iconChip(s, ic, wx, 4.6, 0.55, HEX.blue);
      s.addText(h, { x: wx, y: 5.2, w: ww, h: 0.3, fontFace: "Calibri", fontSize: 13, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: wx, y: 5.5, w: ww, h: 1.0, fontFace: "Calibri", fontSize: 10.5, color: HEX.sub, isTextBox: true });
      wx += ww + 0.3;
    }
    s.addNotes(
`[WHY IT MATTERS — ~35 sec]

"Why it matters: scale and leverage. Over a hundred million developers ship code that almost nobody re-reads, and a bug costs minutes in review but an incident in production.

The hopeful number is the third one. One good query protects every repo that uses that pattern. That's the Security Lab's model in a sentence: encode an expert's insight once, and it runs everywhere."

[If they're nodding, skip the audience row entirely. Advance to slide 4.]`);
  }

  // ================= SLIDE 4 — The idea: code as data =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The solution", HEX.purple);
    title(s, "The idea: treat code as data you can query");
    s.addText(
      "CodeQL compiles your source into a relational database of everything in it — every call, variable, and the way data flows between them. Then you ask questions in QL, a query language built for exactly that.",
      { x: M, y: 1.35, w: W - 2 * M, h: 0.9, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true }
    );

    const steps = [
      [FA.FaFileCode, "Source code", "Your repo, any supported language", HEX.muted],
      [FA.FaDatabase, "CodeQL database", "A queryable model: AST, call graph, data flow", HEX.purple],
      [FA.FaMagnifyingGlass, "QL query", "“Does untrusted input reach a SQL sink?”", HEX.blue],
      [FA.FaTriangleExclamation, "Results", "Precise findings with the full data-flow path", HEX.green],
    ];
    const bw = 2.7, gap = 0.45, y = 2.65, bh = 2.3;
    let x = M;
    for (let i = 0; i < steps.length; i++) {
      const [ic, h, b, col] = steps[i];
      card(s, x, y, bw, bh);
      await iconChip(s, ic, x + bw / 2 - 0.4, y + 0.3, 0.8, col);
      s.addText(h, { x: x + 0.15, y: y + 1.2, w: bw - 0.3, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, align: "center", isTextBox: true });
      s.addText(b, { x: x + 0.15, y: y + 1.6, w: bw - 0.3, h: 0.65, fontFace: "Calibri", fontSize: 11, color: HEX.sub, align: "center", isTextBox: true });
      if (i < steps.length - 1)
        s.addText("▶", { x: x + bw + 0.02, y: y + bh / 2 - 0.25, w: gap - 0.04, h: 0.5, fontSize: 18, color: HEX.green, align: "center", isTextBox: true });
      x += bw + gap;
    }
    s.addText(
      [{ text: "Key shift:  ", options: { bold: true, color: HEX.greenLt } }, { text: "you stop searching for strings and start querying behavior.", options: { color: HEX.sub } }],
      { x: M, y: 5.25, w: W - 2 * M, h: 0.5, fontFace: "Calibri", fontSize: 15, align: "center", isTextBox: true }
    );
    s.addNotes(
`[THE SOLUTION — ~50 sec]

"The one idea to take away: CodeQL treats your code as data you can query.

Left to right. An extractor turns your source into a relational database. Not the text, the structure: every call, every variable, the call graph, and how data flows between them. Then you ask a question in QL. Here: 'does untrusted input reach a SQL sink?' You describe the shape of the bug, and the engine finds every place that shape occurs.

The result isn't just a line number. It's the full path: where the tainted data entered, every hop, and the dangerous call it reached. That's why it catches a class, not a string. Let me show you."

[Advance to slide 5.]`);
  }

  // ================= SLIDE 5 — Meet the demo app =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The demo", HEX.green);
    title(s, "Meet “Octo Notes” — small app, real bugs");
    card(s, M, 1.5, 5.9, 5.0, HEX.panel);
    s.addText("A tiny Express + node:sqlite notes API", { x: M + 0.3, y: 1.7, w: 5.3, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, isTextBox: true });
    const eps = [
      ["/api/notes/search?q=", "builds SQL by string concatenation", HEX.redLt],
      ["/api/notes/by-owner?owner=", "same bug, different shape", HEX.redLt],
      ["/api/notes/:id", "parameterized — the safe pattern", HEX.greenLt],
      ["/api/attachments?file=", "reads from disk by name", HEX.amber],
      ["/preview?title=", "echoes input into HTML", HEX.amber],
    ];
    let y = 2.25;
    for (const [e, d, col] of eps) {
      s.addText([mono(e, { color: col, bold: true })], { x: M + 0.3, y, w: 5.3, h: 0.32, fontSize: 12.5, isTextBox: true });
      s.addText(d, { x: M + 0.3, y: y + 0.3, w: 5.3, h: 0.3, fontFace: "Calibri", fontSize: 11.5, color: HEX.muted, isTextBox: true });
      y += 0.82;
    }

    const rx = 6.9;
    card(s, rx, 1.5, W - rx - M, 5.0, HEX.canvas);
    s.addText("Why this app", { x: rx + 0.3, y: 1.7, w: 5, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, isTextBox: true });
    const why = [
      [FA.FaBug, "Four bug classes", "SQL injection, path traversal, XSS, plus Actions injection — one scan, several wins."],
      [FA.FaFeather, "Zero native deps", "node:sqlite is built in. Nothing to compile, nothing to install — the demo always runs."],
      [FA.FaEyeSlash, "A deliberate blind spot", "The default scanner misses the SQLi — because it doesn't know node:sqlite yet. That's the story."],
    ];
    let yy = 2.3;
    for (const [ic, h, b] of why) {
      await iconChip(s, ic, rx + 0.25, yy, 0.6, HEX.green);
      s.addText(h, { x: rx + 1.0, y: yy - 0.02, w: W - rx - M - 1.2, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: rx + 1.0, y: yy + 0.33, w: W - rx - M - 1.2, h: 0.85, fontFace: "Calibri", fontSize: 11.5, color: HEX.sub, isTextBox: true });
      yy += 1.4;
    }
    s.addNotes(
`[THE DEMO APP — ~40 sec]

"Octo Notes: a sixty-line notes API on Express and Node's built-in SQLite. Search and by-owner both build SQL by gluing strings together: the same bug in two shapes. Get-by-id is parameterized, the safe pattern. Watch CodeQL stay silent on that one. No false positive.

It also has a deliberate blind spot. The default scanner is going to miss the SQL injection, and that miss is the whole story."

[CLOCK CHECK: you should be under 4:00 here. If you start slide 6 past ~4:30, you're behind: plan to SKIP slide 10.]
[Advance to slide 6, then switch to the launchpad.]`);
  }

  // ================= SLIDE 6 — DEMO Act 1 =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    kicker(s, "Demo · Act 1", HEX.green);
    title(s, "Run the default suite — and watch it miss one");
    card(s, M, 1.55, W - 2 * M, 1.7, HEX.panel);
    s.addText("Terminal", { x: M + 0.25, y: 1.65, w: 3, h: 0.3, fontFace: "Calibri", fontSize: 11, color: HEX.muted, isTextBox: true });
    s.addText([
      mono("$ codeql database create octo-db --language=javascript\n", { color: HEX.greenLt }),
      mono("$ codeql database analyze octo-db \\\n    javascript-security-extended.qls", { color: HEX.sub }),
    ], { x: M + 0.25, y: 1.95, w: W - 2 * M - 0.5, h: 1.2, fontSize: 13, isTextBox: true, valign: "top" });

    s.addText("Results", { x: M, y: 3.5, w: 6, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.ink, isTextBox: true });
    const rows = [
      ["Reflected XSS", "preview.js:9", true],
      ["Uncontrolled path (traversal)", "attachments.js:12", true],
      ["SQL injection", "notes.js — search + by-owner", false],
    ];
    let y = 3.95;
    for (const [name, loc, found] of rows) {
      card(s, M, y, W - 2 * M, 0.72, found ? HEX.panel : "2A1215");
      const ic = found ? FA.FaCircleCheck : FA.FaCircleXmark;
      await iconChip(s, ic, M + 0.2, y + 0.11, 0.5, found ? HEX.green : HEX.red);
      s.addText(name, { x: M + 0.9, y: y + 0.08, w: 6, h: 0.56, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, valign: "middle", isTextBox: true });
      s.addText([mono(loc, { color: HEX.muted })], { x: 7, y: y + 0.08, w: 4.3, h: 0.56, fontSize: 12, valign: "middle", isTextBox: true });
      s.addText(found ? "FOUND" : "MISSED", { x: W - M - 1.5, y: y + 0.08, w: 1.3, h: 0.56, fontFace: "Calibri", fontSize: 13, bold: true, color: found ? HEX.greenLt : HEX.redLt, align: "right", valign: "middle", isTextBox: true });
      y += 0.82;
    }
    s.addNotes(
`[DEMO — ACT 1 — ~90 sec]  >>> SWITCH TO LAUNCHPAD: Talk 1, card 4 "Run output" <<<
[CLOCK: past ~4:30 at this point? Then skip slide 10 later (go 9 -> 11).]
(Captured run, not live. Click ▶ once per act; don't use "Show all".)

"These runs take a few minutes, so I captured them ahead of time. This is the real output.

[Click ▶ Build DB.] First, build the database: the extraction step we just talked about. Then 'database analyze' with GitHub's security-extended suite, the same queries code scanning runs by default.

[Click ▶ Act 1.] Remember the endpoints: two injectable, one safe, plus a file read and an HTML echo.

[Results.] It found the reflected XSS in preview.js and the path traversal in attachments.js. Two real bugs, out of the box.

But the SQL injection? Missed. Both variants. So, a question for you: why would a tool built to find SQL injection, running its SQL-injection query, come up empty here?

[Pause. Let them answer.]

It's not a CodeQL bug. CodeQL doesn't yet know this library. node:sqlite is new, and the engine doesn't know that .prepare() and .exec() are where SQL executes, the 'sink.' It sees the user input. It just can't see the finish line. That's not a dead end; it's the most interesting moment in the talk."

[If the launchpad won't load: demos/backup/codeql-1-default-suite.csv. Advance to slide 7.]`);
  }

  // ================= SLIDE 7 — models as data =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The fix behind the demo", HEX.purple);
    title(s, "Teach the engine one row: models as data");
    s.addText(
      "CodeQL already knows the SQL-injection query. It just didn't know this library's functions were sinks. We tell it — in YAML, no query change.",
      { x: M, y: 1.35, w: W - 2 * M, h: 0.7, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true }
    );
    card(s, M, 2.25, W - 2 * M, 1.75, HEX.panel);
    s.addText("node-sqlite.model.yml", { x: M + 0.25, y: 2.35, w: 6, h: 0.3, fontFace: "Calibri", fontSize: 11, color: HEX.muted, isTextBox: true });
    s.addText([
      mono("- addsTo:\n    pack: codeql/javascript-all\n    extensible: sinkModel\n  data:\n", { color: HEX.sub }),
      mono('    - ["node:sqlite", "Member[DatabaseSync].Instance\n', { color: HEX.purple }),
      mono('       .Member[prepare,exec].Argument[0]", "sql-injection"]', { color: HEX.purple }),
    ], { x: M + 0.25, y: 2.6, w: W - 2 * M - 0.5, h: 1.3, fontSize: 12.5, isTextBox: true, valign: "top" });

    const chips = [
      [FA.FaBullseye, "What it says", "“The first arg to DatabaseSync.prepare / .exec is a SQL-injection sink.”"],
      [FA.FaArrowsSpin, "Why it's powerful", "Every query that uses the sql-injection sink now understands this library — for free."],
      [FA.FaCloudArrowUp, "How it ships", "Drop it in .github/codeql/extensions — code scanning picks it up automatically."],
    ];
    const cw = (W - 2 * M - 2 * 0.3) / 3;
    let x = M;
    for (const [ic, h, b] of chips) {
      card(s, x, 4.3, cw, 2.2, HEX.canvas);
      await iconChip(s, ic, x + 0.25, 4.5, 0.6, HEX.purple);
      s.addText(h, { x: x + 0.25, y: 5.15, w: cw - 0.5, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: x + 0.25, y: 5.5, w: cw - 0.5, h: 0.9, fontFace: "Calibri", fontSize: 11.5, color: HEX.sub, isTextBox: true });
      x += cw + 0.3;
    }
    s.addNotes(
`[MODELS AS DATA — ~75 sec]

"So how do we fix the blind spot? Here's the thing — we do NOT need to write a new query. The SQL-injection query is already excellent. It just didn't know the finish line for this library.

So we tell it. This is a feature called 'models as data', or MaD. Look at the YAML. We're adding one entry to the model: the first argument of DatabaseSync's prepare and exec methods is a SQL-injection sink. That's it. That's the whole fix. One line of actual data.

And here's why that's powerful — three things on the bottom. First, what it says: in plain English, 'treat the SQL string going into these calls as dangerous.' Second, why it's powerful: EVERY query that uses the sql-injection sink kind now understands this library — for free. Not just my demo query; the whole suite got smarter. Third, how it ships: you drop this file in a folder in your repo, dot-github-slash-codeql-slash-extensions, and code scanning picks it up automatically. No pipeline changes.

This is the part I find genuinely elegant, and it's the heart of how the Security Lab works at scale: most of the time you're not writing new detection logic, you're extending the engine's MODEL of the world. And because it's just YAML, it gets reviewed like code and versioned like code. One model row, reviewed in a PR, and thousands of repos get better.

Let's prove it — same scan, with the model this time."

[Advance to slide 8 — continue the demo.]`);
  }

  // ================= SLIDE 8 — DEMO Act 2 + 3 =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    kicker(s, "Demo · Acts 2 & 3", HEX.green);
    title(s, "Same scan, now it sees the whole class");
    // Act 2 results
    card(s, M, 1.55, 6.0, 4.9, HEX.panel);
    s.addText("Act 2 — rerun with the model", { x: M + 0.25, y: 1.7, w: 5.5, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.greenLt, isTextBox: true });
    const r2 = [
      ["SQL injection", "notes.js:11 (search)", true],
      ["SQL injection", "notes.js:20 (by-owner)", true],
      ["Safe parameterized query", "notes.js:29 — no alert", true],
    ];
    let y = 2.2;
    for (const [n, loc, ok] of r2) {
      await iconChip(s, ok ? FA.FaCircleCheck : FA.FaCircleXmark, M + 0.25, y, 0.45, HEX.green);
      s.addText(n, { x: M + 0.85, y: y - 0.03, w: 5, h: 0.32, fontFace: "Calibri", fontSize: 13.5, bold: true, color: HEX.ink, isTextBox: true });
      s.addText([mono(loc, { color: HEX.muted })], { x: M + 0.85, y: y + 0.29, w: 5, h: 0.3, fontSize: 11, isTextBox: true });
      y += 0.82;
    }
    s.addText(
      [{ text: "No false positive ", options: { bold: true, color: HEX.greenLt } }, { text: "on the parameterized endpoint — precision matters.", options: { color: HEX.sub } }],
      { x: M + 0.25, y: 4.75, w: 5.5, h: 1.5, fontFace: "Calibri", fontSize: 12.5, isTextBox: true, valign: "top" }
    );

    // Act 3 query
    const rx = 7.1;
    card(s, rx, 1.55, W - rx - M, 4.9, HEX.panel);
    s.addText("Act 3 — what a QL query looks like", { x: rx + 0.25, y: 1.7, w: 5.5, h: 0.35, fontFace: "Calibri", fontSize: 14, bold: true, color: HEX.blue, isTextBox: true });
    s.addText([
      mono("isSource(n) {\n  n instanceof RemoteFlowSource\n}\n\n", { color: HEX.greenLt }),
      mono("isSink(n) {\n  n = DatabaseSync\n      .prepare/.exec\n      .Argument[0]\n}\n\n", { color: HEX.redLt }),
      mono("TaintTracking::flowPath(src, sink)", { color: HEX.sub }),
    ], { x: rx + 0.25, y: 2.15, w: W - rx - M - 0.5, h: 4.1, fontSize: 12.5, isTextBox: true, valign: "top" });
    s.addNotes(
`[DEMO — ACTS 2 & 3 — ~2 min]  >>> BACK TO LAUNCHPAD: Talk 1, card 4 <<<
(Same captured run; it's waiting on ▶ Act 2.)

"Act two. Exact same security suite, exact same database — the only thing I've added is that one sink-model row.

[Click ▶ Act 2.]

There it is. Both SQL-injection variants now light up — notes.js line 11, the search endpoint, and line 20, the by-owner endpoint. The engine followed the user input all the way to the modeled sink.

And here's the part I promised you — look: the parameterized endpoint on line 29 is NOT flagged. No false positive. CodeQL understands that a parameterized query is safe, so it stays quiet. That precision is everything — a scanner that cries wolf gets turned off.

[Click ▶ Act 3.]

Last act — let me pull back the curtain and show you the actual query, so this isn't magic. It's three ideas. A SOURCE: 'RemoteFlowSource' — that's anything an attacker controls, any request parameter, header, body. A SINK: our node:sqlite call, the one we just modeled. And then 'TaintTracking dot flowPath' — that's the engine connecting the two, following the data through every hop in between.

That's it. Roughly twenty-five lines of readable logic, and it describes the ENTIRE class of SQL-injection bug — not the one I grepped for, all of them."

[If the launchpad won't load: demos/backup/codeql-2 and codeql-3 CSVs. Advance to slide 9.]`);
  }

  // ================= SLIDE 9 — beyond your code (bridge) =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "It's not just your app code", HEX.amber);
    title(s, "CodeQL also scans your CI/CD");
    s.addText(
      "The same engine analyzes GitHub Actions workflows — where a malicious issue title or pull request can hijack your pipeline. (That's the whole second talk.)",
      { x: M, y: 1.35, w: W - 2 * M, h: 0.8, fontFace: "Calibri", fontSize: 16, color: HEX.sub, isTextBox: true }
    );
    const items = [
      [FA.FaTerminal, "Script injection", "actions/code-injection flags ${{ github.event.issue.title }} pasted into a run: block."],
      [FA.FaCodePullRequest, "“Pwn requests”", "actions/untrusted-checkout flags pull_request_target that checks out fork code with secrets in scope."],
      [FA.FaLink, "One toolchain", "App code and workflows, same alerts, same PR experience — defense in depth from one scan."],
    ];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    let x = M;
    for (const [ic, h, b] of items) {
      card(s, x, 2.4, cw, 3.1, HEX.panel);
      await iconChip(s, ic, x + 0.3, 2.65, 0.75, HEX.amber);
      s.addText(h, { x: x + 0.3, y: 3.55, w: cw - 0.6, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: x + 0.3, y: 3.95, w: cw - 0.6, h: 1.4, fontFace: "Calibri", fontSize: 12.5, color: HEX.sub, isTextBox: true });
      x += cw + 0.4;
    }
    s.addText(
      [{ text: "Proven live in the demo repo: ", options: { color: HEX.muted } }, { text: "7 open alerts — 5 in code, 2 in workflows", options: { bold: true, color: HEX.greenLt } }, { text: " (a 3rd auto-closed by the fix).", options: { color: HEX.muted } }],
      { x: M, y: 5.8, w: W - 2 * M, h: 0.4, fontFace: "Calibri", fontSize: 14, align: "center", isTextBox: true }
    );
    s.addNotes(
`[BEYOND YOUR CODE — ~60 sec]

"One more thing, and it's a big one. Everything I just showed you was application code. But the same engine also analyzes your CI/CD — your GitHub Actions workflows.

That matters because your pipeline is a juicy target. A malicious issue title or a pull request from a fork can hijack a workflow that's holding your secrets. CodeQL has query families for exactly this: 'code-injection' catches an attacker-controlled issue title getting pasted into a shell command, and 'untrusted-checkout' catches the 'pwn request' pattern — a workflow that runs untrusted fork code while your secrets are in scope.

And this is real, not theoretical — the demo repo you can go look at right now has seven open code-scanning alerts: five in the application code and two in the workflows, from this same engine. There was a third workflow alert. When I merged the fix for the issue-triage workflow, code scanning re-ran on the pull request and closed that alert automatically. That's detection and remediation in one loop, and I'll come back to it in the next talk.

I'm flagging this deliberately, because it's the bridge to my other talk on supply-chain attacks. Same toolchain, two surfaces — your code and your pipelines — one PR experience. That's defense in depth from a single scan."

[Advance to slide 10, or if you were behind at slide 6, skip straight to slide 11.]`);
  }

  // ================= SLIDE 10 — in the workflow =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "Where it lives", HEX.blue);
    title(s, "In the pull request, not a PDF nobody reads");
    const flow = [
      [FA.FaCodePullRequest, "Open a PR", "CodeQL runs as a check on the diff."],
      [FA.FaCommentDots, "Inline alert", "The finding shows the full data-flow path, right on the line."],
      [FA.FaWandMagicSparkles, "Copilot Autofix", "A suggested, explained fix, reviewed like any other change."],
      [FA.FaCircleCheck, "Merge clean", "The bug class never enters main."],
    ];
    const bw = 2.7, gap = 0.45, y = 2.0, bh = 2.7;
    let x = M;
    for (let i = 0; i < flow.length; i++) {
      const [ic, h, b] = flow[i];
      card(s, x, y, bw, bh, HEX.panel);
      await iconChip(s, ic, x + bw / 2 - 0.45, y + 0.35, 0.9, i === 2 ? HEX.purple : HEX.blue);
      s.addText(h, { x: x + 0.15, y: y + 1.45, w: bw - 0.3, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, align: "center", isTextBox: true });
      s.addText(b, { x: x + 0.15, y: y + 1.85, w: bw - 0.3, h: 0.75, fontFace: "Calibri", fontSize: 11.5, color: HEX.sub, align: "center", isTextBox: true });
      if (i < flow.length - 1)
        s.addText("▶", { x: x + bw + 0.02, y: y + bh / 2 - 0.25, w: gap - 0.04, h: 0.5, fontSize: 18, color: HEX.blue, align: "center", isTextBox: true });
      x += bw + gap;
    }
    s.addText(
      [{ text: "Shift left that actually sticks: ", options: { bold: true, color: HEX.blue } }, { text: "the fix meets the developer where they already work.", options: { color: HEX.sub } }],
      { x: M, y: 5.1, w: W - 2 * M, h: 0.5, fontFace: "Calibri", fontSize: 15, align: "center", isTextBox: true }
    );
    s.addNotes(
`[WHERE IT LIVES — ~45 sec]  OPTIONAL: SKIP THIS SLIDE if you were behind at slide 6 (go 9 -> 11).

"A finding only helps if it reaches the developer at the right moment, so this all shows up in the pull request. CodeQL runs as a check on the diff, the alert appears inline on the line with the full data-flow path, and Copilot Autofix suggests a fix with an explanation. That suggestion goes through the same review as any other change. Then you merge clean, and the bug class never enters main.

Results that land where developers already work get fixed. Results in a report get ignored."

[OPTIONAL LIVE BEAT, only if asked: PR #2 on the demo repo shows the real before/after and the alert closing. Don't demo Autofix itself. Advance to slide 11.]`);
  }

  // ================= SLIDE 11 — impact =================
  {
    const s = pres.addSlide({ masterName: "CONTENT" });
    kicker(s, "The impact", HEX.green);
    title(s, "What gets better");
    const left = [
      [FA.FaChartLine, "Coverage that compounds", "Model a library once; every repo and every future query benefits."],
      [FA.FaBullseye, "Signal over noise", "Data-flow precision means real paths — the safe code stayed silent."],
      [FA.FaBoltLightning, "Fixed early and cheaply", "Caught in the PR, with the full path and a suggested fix."],
    ];
    const right = [
      [FA.FaUsers, "Expertise that scales", "One researcher's insight becomes everyone's default protection."],
      [FA.FaCubesStacked, "One engine, many surfaces", "App code and CI/CD workflows, same alerts and workflow."],
      [FA.FaLockOpen, "Open and inspectable", "The queries are open source — audit them, extend them, trust them."],
    ];
    const colW = (W - 2 * M - 0.5) / 2;
    const render = async (arr, x0) => {
      card(s, x0, 1.7, colW, 4.7, HEX.panel);
      let yy = 1.95;
      for (const [ic, h, b] of arr) {
        await iconChip(s, ic, x0 + 0.3, yy, 0.65, HEX.green);
        s.addText(h, { x: x0 + 1.1, y: yy, w: colW - 1.4, h: 0.35, fontFace: "Calibri", fontSize: 15, bold: true, color: HEX.ink, isTextBox: true });
        s.addText(b, { x: x0 + 1.1, y: yy + 0.35, w: colW - 1.4, h: 0.75, fontFace: "Calibri", fontSize: 12, color: HEX.sub, isTextBox: true });
        yy += 1.45;
      }
    };
    await render(left, M);
    await render(right, M + colW + 0.5);
    s.addNotes(
`[IMPACT — ~45 sec]

"So what actually gets better? Six things, and they all come back to one word: leverage.

Coverage that compounds — model a library once, and every repo and every future query benefits. Signal over noise — data-flow precision means you get real paths, and remember, the safe code stayed silent. Fixed early and cheaply — in the PR, before it ever merges.

On the right: expertise that scales — one researcher's insight becomes everyone's default protection. One engine across many surfaces — app code and CI/CD, same workflow. And it's open and inspectable — the queries are open source, so you can audit them, extend them, and trust them.

The through-line: precision keeps developers trusting it, openness keeps security teams able to extend it, and one engine across surfaces gives you defense in depth. Let me land the plane."

[Advance to slide 12.]`);
  }

  // ================= SLIDE 12 — takeaways =================
  {
    const s = pres.addSlide({ masterName: "DARK" });
    for (let c = 0; c < 10; c++)
      s.addShape(pres.ShapeType.ellipse, { x: 9.6 + c * 0.34, y: 0.5, w: 0.08, h: 0.08, fill: { color: c < 4 ? HEX.green : HEX.line }, line: { type: "none" } });
    kicker(s, "The takeaway", HEX.green);
    title(s, "Describe the bug once. Catch it everywhere.");
    const takeaways = [
      [FA.FaBrain, "Code is data", "CodeQL turns “is this safe?” into a precise, repeatable query."],
      [FA.FaLayerGroup, "Bug class > bug", "You find every instance of a pattern, not the one you grepped for."],
      [FA.FaFeatherPointed, "Modeling is the lever", "One sink-model row taught the whole suite a new library."],
    ];
    let y = 1.9;
    for (const [ic, h, b] of takeaways) {
      await iconChip(s, ic, M, y, 0.8, HEX.green);
      s.addText(h, { x: M + 1.1, y: y + 0.02, w: 10.5, h: 0.4, fontFace: "Calibri", fontSize: 19, bold: true, color: HEX.ink, isTextBox: true });
      s.addText(b, { x: M + 1.1, y: y + 0.45, w: 10.5, h: 0.5, fontFace: "Calibri", fontSize: 14, color: HEX.sub, isTextBox: true });
      y += 1.25;
    }
    card(s, M, 5.75, W - 2 * M, 1.0, HEX.panel);
    s.addText(
      [
        { text: "Try it:  ", options: { bold: true, color: HEX.greenLt } },
        { text: "github.com/rod-trent/octo-notes-demo", options: { fontFace: "Consolas", color: HEX.ink } },
        { text: "   —   turn on code scanning, open a PR, watch the alert fire.", options: { color: HEX.sub } },
      ],
      { x: M + 0.3, y: 5.95, w: W - 2 * M - 0.6, h: 0.6, fontFace: "Calibri", fontSize: 14.5, valign: "middle", isTextBox: true }
    );
    s.addNotes(
`[TAKEAWAY — ~45 sec]

"Three things to walk out with.

One: code is data. CodeQL turns 'is this safe?' from a judgment call into a precise, repeatable query.

Two — and this is the title of the talk — you find the bug CLASS, not just the bug. You describe a pattern once and catch every instance, including the ones you'd never have grepped for.

Three: modeling is the lever. You saw it — one sink-model row taught the entire query suite about a new library, and a bug the default scanner missed became a finding.

If you want to feel it yourself, the demo repo is right there — fork it, turn on code scanning, open a PR, and watch the alert fire on the PR. It takes about five minutes.

That's 'describe the bug once, catch it everywhere.' Thank you — I'd love to take questions."

[Don't offer Autofix. Only discuss it if they ask.]

[END. Invite Q&A — see SPEAKER-CHEATSHEET.md for likely questions.]`);
  }

  const out = "C:/Code/GHJ/presentation/CodeQL-Find-the-Bug-Class.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", out);
})();
