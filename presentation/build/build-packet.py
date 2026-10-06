#!/usr/bin/env python
"""Assemble the print-and-go prep packet: combine selected markdown into one styled HTML."""
import markdown, pathlib, datetime, html

ROOT = pathlib.Path(r"C:\Code\GHJ")
OUT_HTML = ROOT / "presentation" / "_packet.html"

# (file, section title, part label)  -- order = reading order for the day
SECTIONS = [
    ("SPEAKER-CHEATSHEET.md",                 "Speaker cheat sheet",            "Part A — Presentations"),
    ("DRY-RUN-CHECKLIST.md",                  "Dry-run & day-of checklist",     None),
    ("prep/03-Technical-QA-Bank.md",          "Technical follow-up bank",       None),
    ("prep/09-Kevin-Backhouse-Interview.md",  "Friday 11:00 — Kevin Backhouse", "Part B — Behavioral"),
    ("prep/05-Behavioral-Drafts-T1-T4-T8.md", "Behavioral drafts — Themes 1, 4, 8", None),
    ("prep/06-Behavioral-Drafts-T2-T9.md",    "Behavioral drafts — Themes 2, 9", None),
    ("prep/07-Behavioral-Draft-T6.md",        "Behavioral draft — Theme 6",     None),
    ("prep/08-Behavioral-Drafts-T3-T5-T7-T10.md", "Behavioral drafts — Themes 3, 5, 7, 10", None),
    ("prep/04-Behavioral-Workbook.md",        "Behavioral workbook (all themes reference)", None),
    ("prep/01-Security-Lab-Research-Brief.md","GitHub Security Lab — research brief", "Part C — Research & questions"),
    ("prep/02-Candidate-Questions.md",        "Questions to ask them",          None),
]

md = markdown.Markdown(extensions=["extra", "sane_lists", "toc"])

today = datetime.date.today().strftime("%B %d, %Y")

CSS = """
@page { size: Letter; margin: 0.7in 0.7in 0.8in 0.7in; }
* { box-sizing: border-box; }
body { font-family: Georgia, 'Times New Roman', serif; color: #14181f; line-height: 1.45;
       font-size: 10.6pt; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1, h2, h3, h4 { font-family: 'Segoe UI', Arial, sans-serif; color: #0b1b33; line-height: 1.2; }
h1 { font-size: 20pt; border-bottom: 2px solid #2DA44E; padding-bottom: 4px; margin: 0 0 10px; }
h2 { font-size: 14.5pt; margin: 16px 0 6px; color: #11331f; }
h3 { font-size: 12pt; margin: 12px 0 4px; color: #1f2a44; }
h4 { font-size: 10.6pt; margin: 10px 0 3px; color: #30363d; }
p, li { margin: 4px 0; }
ul, ol { margin: 4px 0 8px; padding-left: 20px; }
code { font-family: Consolas, 'Courier New', monospace; font-size: 9.2pt;
       background: #f1f3f6; padding: 1px 4px; border-radius: 3px; color: #8250df; }
pre { background: #0d1117; color: #e6edf3; padding: 10px 12px; border-radius: 6px;
      font-family: Consolas, monospace; font-size: 8.8pt; line-height: 1.35; overflow-wrap: anywhere;
      white-space: pre-wrap; }
pre code { background: none; color: inherit; padding: 0; }
table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9.4pt; }
th, td { border: 1px solid #c9d1d9; padding: 4px 7px; text-align: left; vertical-align: top; }
th { background: #eef6f0; font-family: 'Segoe UI', Arial, sans-serif; }
blockquote { border-left: 3px solid #2DA44E; margin: 8px 0; padding: 2px 12px; color: #39414d;
             background: #f6faf7; }
hr { border: none; border-top: 1px solid #d6dbe1; margin: 12px 0; }
a { color: #1f6feb; text-decoration: none; }
strong { color: #0b1b33; }
.section { page-break-before: always; }
.partlabel { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9pt; letter-spacing: 2px;
             text-transform: uppercase; color: #2DA44E; font-weight: 700; margin-bottom: 2px; }
/* cover */
.cover { page-break-after: always; display: flex; flex-direction: column; justify-content: center;
         height: 9.0in; }
.cover h1 { font-size: 30pt; border: none; color: #0b1b33; margin-bottom: 2px; }
.cover .sub { font-family: 'Segoe UI', Arial, sans-serif; font-size: 14pt; color: #2DA44E;
              font-style: italic; margin-bottom: 20px; }
.cover .meta { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #30363d; }
.cover ol { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1f2a44; margin-top: 18px; }
.toc-note { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9.5pt; color: #57606a; }
"""

parts = []
# cover + contents
toc_items = "".join(
    f"<li><strong>{html.escape(t)}</strong>{(' — ' + html.escape(p)) if p else ''}</li>"
    for (_f, t, p) in SECTIONS
)
parts.append(f"""
<div class="cover">
  <div class="partlabel">GitHub Security Lab · Final interview</div>
  <h1>Prep Packet</h1>
  <div class="sub">Two talks · behavioral · research · questions</div>
  <div class="meta">Rod Trent &nbsp;·&nbsp; print-and-go &nbsp;·&nbsp; generated {today}</div>
  <ol>{toc_items}</ol>
  <p class="toc-note">Talks: &ldquo;CodeQL — Find the bug class, not just the bug&rdquo; and
  &ldquo;Breaking the chain — disrupting supply chain attacks on npm &amp; GitHub Actions.&rdquo;
  Full decks (with speaker scripts in the notes), demos, and runbooks live in the repo:
  github.com/rod-trent/GHJ</p>
</div>
""")

for fname, title, part in SECTIONS:
    md.reset()
    raw = (ROOT / fname).read_text(encoding="utf-8")
    body = md.convert(raw)
    label = f'<div class="partlabel">{html.escape(part)}</div>' if part else ""
    parts.append(f'<div class="section">{label}{body}</div>')

doc = f"""<!doctype html><html><head><meta charset="utf-8">
<title>Interview Prep Packet</title><style>{CSS}</style></head>
<body>{''.join(parts)}</body></html>"""

OUT_HTML.write_text(doc, encoding="utf-8")
print("wrote", OUT_HTML)
