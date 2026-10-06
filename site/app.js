// Demo Launchpad: tabs, copy buttons, code views, live workflow status, terminal replays.
(() => {
  const REPO = 'rod-trent/octo-notes-demo';
  const DEMO_WF = 'issue-triage-demo.yml';
  const PAYLOAD = 'Login crash"; echo "PWNED as $(whoami) on $(hostname)"; echo "Stolen secret: $(echo $DEPLOY_TOKEN | base64 -w0)"; #';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // ---------- theme ----------
  const savedTheme = store.get('theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  $('#themeToggle').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme
      || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    store.set('theme', next);
  });

  // ---------- presenter / audience view ----------
  // Audience view hides coaching (timings, run order, talking points, teardown). Toggle with "A",
  // or force it with ?view=audience / ?view=presenter (remembered per browser).
  function setView(v) {
    document.body.classList.toggle('audience', v === 'audience');
    store.set('view', v);
  }
  const viewParam = new URLSearchParams(location.search).get('view');
  setView(viewParam === 'audience' || viewParam === 'presenter' ? viewParam : (store.get('view') || 'presenter'));
  $('#viewToggle').addEventListener('click', () => setView('audience'));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'a' && e.key !== 'A') return;
    if (e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    setView(document.body.classList.contains('audience') ? 'presenter' : 'audience');
  });

  // ---------- tabs ----------
  function showTab(name) {
    $$('.tabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    $$('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== name; });
    if (name !== 'panic') store.set('tab', name);   // panic is hidden: only reachable via #panic
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    window.scrollTo({ top: 0 });
  }
  $$('.tabs [data-tab]').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
  $$('[data-goto]').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.goto)));
  const initial = location.hash.slice(1) || store.get('tab') || 'codeql';
  showTab($(`[data-panel="${initial}"]`) ? initial : 'codeql');

  // ---------- copy buttons ----------
  $('#payloadText').textContent = PAYLOAD;
  $('#payloadLink').href = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(PAYLOAD)}&body=${encodeURIComponent('demo')}`;
  $$('[data-copy]').forEach((box) => {
    const btn = document.createElement('button');
    btn.className = 'copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      const text = $('code', box).textContent;
      try { await navigator.clipboard.writeText(text); }
      catch {
        const r = document.createRange(); r.selectNodeContents($('code', box));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); document.execCommand('copy');
      }
      btn.textContent = 'Copied'; btn.classList.add('ok');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 1400);
    });
    box.appendChild(btn);
  });

  // ---------- code views ----------
  const CODE = {
    notes: {
      bad: [10, 11, 20, 21], good: [29],
      notes: { 11: 'CodeQL Act 2 → js/sql-injection (line 11)', 21: 'CodeQL Act 2 → js/sql-injection (line 20)', 29: 'parameterized: stays silent, no false positive' },
      src: `const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/notes/search?q=grocery
// VULNERABLE: user input is concatenated into the SQL string (SQL injection).
router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const sql = \`SELECT id, title FROM notes WHERE private = 0 AND title LIKE '%\${q}%'\`;
  const rows = db.prepare(sql).all();
  res.json(rows);
});

// GET /api/notes/by-owner?owner=mona
// VULNERABLE: a second, easy-to-miss variant of the same bug class.
router.get('/by-owner', (req, res) => {
  const owner = req.query.owner;
  const rows = db
    .prepare('SELECT n.id, n.title FROM notes n JOIN users u ON u.id = n.owner_id ' +
             "WHERE n.private = 0 AND u.name = '" + owner + "'")
    .all();
  res.json(rows);
});

// GET /api/notes/:id
// SAFE: parameterized query - the pattern we want everywhere.
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT id, title, body FROM notes WHERE id = ? AND private = 0').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});`,
    },
    model: {
      good: [10],
      notes: { 10: 'the sink-model row: node:sqlite prepare/exec arg 0 is a "sql-injection" sink' },
      src: `# Teach CodeQL that SQL strings passed to Node's built-in SQLite driver are
# SQL-injection sinks. With this, the standard js/sql-injection query
# (and every other query that uses the "sql-injection" sink kind) understands
# node:sqlite - no new query required.
extensions:
  - addsTo:
      pack: codeql/javascript-all
      extensible: sinkModel
    data:
      - ["node:sqlite", "Member[DatabaseSync].Instance.Member[prepare,exec].Argument[0]", "sql-injection"]`,
    },
    query: {
      good: [17, 20, 21, 22, 23, 24, 25, 26, 27, 31],
      notes: { 17: 'source: anything an attacker controls', 27: 'sink: the SQL string argument', 31: 'connect them with taint tracking' },
      src: `/**
 * @name Step 2: SQL injection through node:sqlite
 * @description Track untrusted data (sources) through the program to a
 *              node:sqlite query (sinks). Only report real paths.
 * @kind path-problem
 * @problem.severity error
 * @security-severity 8.8
 * @precision high
 * @id octo/demo/node-sqlite-injection
 * @tags security
 *       external/cwe/cwe-089
 */

import javascript

module SqliteInjectionConfig implements DataFlow::ConfigSig {
  predicate isSource(DataFlow::Node source) { source instanceof RemoteFlowSource }

  // Sinks: the SQL string argument of DatabaseSync#prepare / #exec.
  predicate isSink(DataFlow::Node sink) {
    sink =
      API::moduleImport("node:sqlite")
          .getMember("DatabaseSync")
          .getInstance()
          .getMember(["prepare", "exec"])
          .getACall()
          .getArgument(0)
  }
}

module SqliteInjectionFlow = TaintTracking::Global<SqliteInjectionConfig>;

import SqliteInjectionFlow::PathGraph

from SqliteInjectionFlow::PathNode source, SqliteInjectionFlow::PathNode sink
where SqliteInjectionFlow::flowPath(source, sink)
select sink.getNode(), source, sink, "This SQL query depends on a $@.", source.getNode(),
  "user-provided value"`,
    },
    wfBad: {
      bad: [6, 14, 18],
      notes: { 6: 'write token in the same job as untrusted input', 14: 'a secret is in scope', 18: '${{ }} pastes the title INTO the script → code' },
      src: `name: Issue triage (DEMO - vulnerable)
on:
  issues:
    types: [opened]
permissions:
  issues: write
  contents: read
jobs:
  triage:
    # Demo safety guard: only the repo owner's issues trigger this job.
    if: github.event.issue.user.login == github.repository_owner
    runs-on: ubuntu-latest
    env:
      DEPLOY_TOKEN: \${{ secrets.DEMO_DEPLOY_TOKEN }}   # FAKE
    steps:
      - name: Greet the issue author
        run: |
          echo "Thanks for opening: \${{ github.event.issue.title }}"
          echo "A maintainer will take a look soon."`,
    },
    wfGood: {
      good: [5, 10, 15, 17],
      notes: { 5: 'deny-all default token', 15: 'untrusted input → env var', 17: 'shell sees $TITLE as data' },
      src: `name: Issue triage
on:
  issues:
    types: [opened]
permissions: {}
jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      issues: write
    steps:
      - name: Greet the issue author
        # no secrets in a job that touches untrusted input
        env:
          TITLE: \${{ github.event.issue.title }}
        run: |
          echo "Thanks for opening: $TITLE"
          echo "A maintainer will take a look soon."`,
    },
  };

  function tint(line) {
    let h = esc(line);
    if (/^\s*(\/\/|#|\*|\/\*\*)/.test(line)) return `<span class="c-com">${h}</span>`;
    return h.replace(/(&quot;[^&]*?&quot;|'[^']*')/g, '<span class="c-str">$1</span>');
  }
  function renderCode(el, key) {
    const c = CODE[key];
    const bad = new Set(c.bad || []), good = new Set(c.good || []);
    el.innerHTML = c.src.split('\n').map((line, i) => {
      const n = i + 1;
      const cls = bad.has(n) ? ' bad' : good.has(n) ? ' good' : '';
      const note = c.notes && c.notes[n] ? `<span class="note">↳ ${esc(c.notes[n])}</span>` : '';
      return `<div class="ln${cls}"><i>${n}</i><span>${tint(line) || ' '}</span></div>${note}`;
    }).join('');
  }
  const cqView = $('[data-codeview="cq"]');
  renderCode(cqView, 'notes');
  $$('[data-group="cq"] [data-code]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-group="cq"] [data-code]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    renderCode(cqView, b.dataset.code);
  }));
  $$('[data-static]').forEach((el) => renderCode(el, el.dataset.static));

  // ---------- terminal replays ----------
  // Line prefixes: "y|" yellow, "g|" green, "m|" magenta, "r|" red, "d|" dim, "h|" hit, "$|" prompt
  const REPLAYS = {
    codeql: {
      title: 'pwsh · demos\\codeql · run-codeql-demo.ps1',
      acts: [
        { label: 'Build DB', lines: [
          '$|.\\run-codeql-demo.ps1',
          '',
          'c|=== Build the CodeQL database (code -> queryable data) ===',
          'd|Extracting src/server.js, src/db.js, src/routes/*.js, .github/workflows/*.yml ...',
          'd|Successfully created database at %TEMP%\\octo-notes-codeql-db.',
        ] },
        { label: 'Act 1', lines: [
          '',
          'y|=== ACT 1: GitHub\'s security-extended suite, out of the box ===',
          'Finding                                   File                       Line',
          '-------                                   ----                       ----',
          'Uncontrolled data used in path expression /src/routes/attachments.js 12',
          'Reflected cross-site scripting            /src/routes/preview.js     9',
          '',
          'd|# no SQL injection: CodeQL doesn\'t know node:sqlite is a SQL sink (yet)',
        ] },
        { label: 'Act 2', lines: [
          '',
          'g|=== ACT 2: Same queries + one sink-model row for node:sqlite ===',
          '  - addsTo:',
          '      pack: codeql/javascript-all',
          '      extensible: sinkModel',
          '    data:',
          '      - ["node:sqlite", "Member[DatabaseSync].Instance.Member[prepare,exec].Argument[0]", "sql-injection"]',
          'Finding                                           File                       Line',
          '-------                                           ----                       ----',
          'Uncontrolled data used in path expression         /src/routes/attachments.js 12',
          'Reflected cross-site scripting                    /src/routes/preview.js     9',
          'h|Database query built from user-controlled sources /src/routes/notes.js       11',
          'h|Database query built from user-controlled sources /src/routes/notes.js       20',
          '',
          'd|# safe parameterized query on line 29: silent',
        ] },
        { label: 'Act 3', lines: [
          '',
          'm|=== ACT 3: Our own taint-tracking query ===',
          'Finding                                   File                 Line',
          '-------                                   ----                 ----',
          'h|Step 2: SQL injection through node:sqlite /src/routes/notes.js 11',
          'h|Step 2: SQL injection through node:sqlite /src/routes/notes.js 20',
        ] },
      ],
    },
    npm: {
      title: 'pwsh · demos\\supply-chain\\npm-install-scripts · run-demo.ps1',
      acts: [
        { label: 'Act 1 · npm 11', lines: [
          '$|.\\run-demo.ps1',
          '',
          'y|=== ACT 1: npm 11 - npm install ===',
          '',
          '> color-utilz@4.2.1 postinstall',
          '> node setup.js',
          '',
          'r| [color-utilz postinstall] running with YOUR permissions on YOUR machine ',
          'h|  1. Harvest credentials  -> found NPM_TOKEN=npm_FAKE_DEMO_TOKEN_1234567890',
          '                             + 2 other env vars named like secrets (values not shown)',
          'h|  2. Exfiltrate           -> would POST them to https://attacker.example/collect',
          'h|  3. Propagate            -> would inject itself into every package this token can publish',
          '',
          'added 1 package in 12s',
        ] },
        { label: 'Act 2 · npm 12', lines: [
          '',
          'g|=== ACT 2: npm 12 - npm install (same project, same dependency) ===',
          '',
          'added 1 package in 8s',
          'y|npm warn install-scripts 1 package had install scripts blocked because they are not covered by allowScripts:',
          'y|npm warn install-scripts   color-utilz@4.2.1 (postinstall: node setup.js)',
          'y|npm warn install-scripts',
          'y|npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.',
        ] },
        { label: 'Review', lines: [
          '',
          'g|=== Review what was blocked ===',
          '1 package has install scripts blocked because they are not covered by allowScripts:',
          '  color-utilz@4.2.1 (postinstall: node setup.js)',
          '',
          'Run `npm install-scripts approve <pkg>` to allow, or `npm install-scripts deny <pkg>` to deny.',
        ] },
      ],
    },
    actions: {
      title: 'Actions · Issue triage (DEMO - vulnerable) · run 37133006732',
      acts: [
        { label: 'Run log', lines: [
          'd|triage › Greet the issue author',
          'c|##[group]Run echo "Thanks for opening: Login crash"; echo "PWNED as $(whoami) on $(hostname)"; echo "Secret: $(echo $DEPLOY_TOKEN | base64 -w0)"; #"',
          'echo "Thanks for opening: Login crash"; echo "PWNED as $(whoami) on $(hostname)"; echo "Secret: $(echo $DEPLOY_TOKEN | base64 -w0)"; #"',
          'echo "A maintainer will take a look soon."',
          'Thanks for opening: Login crash',
          'h|PWNED as runner on runnervm8df0l',
          'h|Secret: ZmFrZS1kZXBsb3ktdG9rZW4tZm9yLWRlbW8tT05MWS03ZjNhOWMK',
          'A maintainer will take a look soon.',
        ] },
        { label: 'Decode', lines: [
          '',
          '$|echo ZmFrZS1kZXBsb3ktdG9rZW4tZm9yLWRlbW8tT05MWS03ZjNhOWMK | base64 -d',
          'h|fake-deploy-token-for-demo-ONLY-7f3a9c',
          '',
          'd|# the issue title became shell code, with the job\'s secret in scope',
        ] },
      ],
    },
  };

  const CLS = { y: 't-y', g: 't-g', m: 't-m', r: 't-r', d: 't-d', h: 't-hit', c: 't-y' };
  function fmt(line) {
    const m = /^([ygmrdhc$])\|(.*)$/.exec(line);
    if (!m) return esc(line);
    if (m[1] === '$') return `<span class="t-g">PS&gt;</span> ${esc(m[2])}`;
    return `<span class="${CLS[m[1]]}">${esc(m[2])}</span>`;
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mountReplay(el) {
    const data = REPLAYS[el.dataset.replay];
    el.innerHTML = `
      <div class="term-bar">
        <span class="lights"><i></i><i></i><i></i></span>
        <span class="title">${esc(data.title)}</span>
        <button class="go" data-act="next">▶ ${esc(data.acts[0].label)}</button>
        <button data-act="all">Show all</button>
        <button data-act="reset">Reset</button>
      </div>
      <pre class="term-out" tabindex="0"></pre>`;
    const out = $('.term-out', el), next = $('[data-act="next"]', el);
    let act = 0, timer = null;
    const cursor = () => { $('.cursor', out)?.remove(); out.insertAdjacentHTML('beforeend', '<span class="cursor"></span>'); };
    function label() {
      if (act >= data.acts.length) { next.textContent = 'Done'; next.disabled = true; }
      else { next.textContent = `▶ ${data.acts[act].label}`; next.disabled = false; }
    }
    function play() {
      if (timer || act >= data.acts.length) return;
      const lines = data.acts[act++]; let i = 0;
      next.disabled = true;
      const step = () => {
        $('.cursor', out)?.remove();
        out.insertAdjacentHTML('beforeend', fmt(lines.lines[i]) + '\n');
        cursor(); out.scrollTop = out.scrollHeight;
        if (++i < lines.lines.length) timer = setTimeout(step, reduced ? 0 : 140);
        else { timer = null; label(); }
      };
      step();
    }
    function all() {
      clearTimeout(timer); timer = null;
      while (act < data.acts.length) data.acts[act++].lines.forEach((l) => out.insertAdjacentHTML('beforeend', fmt(l) + '\n'));
      cursor(); out.scrollTop = out.scrollHeight; label();
    }
    function reset() { clearTimeout(timer); timer = null; act = 0; out.innerHTML = ''; cursor(); label(); }
    next.addEventListener('click', play);
    $('[data-act="all"]', el).addEventListener('click', () => { $('.cursor', out)?.remove(); all(); });
    $('[data-act="reset"]', el).addEventListener('click', reset);
    out.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
    reset();
  }
  $$('[data-replay]').forEach(mountReplay);

  $$('[data-group="rp"] [data-replaytab]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-group="rp"] [data-replaytab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-panel="supply"] [data-replay]').forEach((t) => { t.hidden = t.dataset.replay !== b.dataset.replaytab; });
  }));

  // ---------- live workflow status (public GitHub API, no auth) ----------
  const statusEl = $('#wfStatus');
  async function refreshStatus() {
    const text = $('.status-text', statusEl);
    statusEl.className = 'status';
    text.textContent = 'Checking demo workflow…';
    try {
      const api = `https://api.github.com/repos/${REPO}/actions/workflows/${DEMO_WF}`;
      const [wf, runs] = await Promise.all([
        fetch(api, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : Promise.reject(r))),
        fetch(`${api}/runs?per_page=1`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : { workflow_runs: [] })),
      ]);
      const on = wf.state === 'active';
      statusEl.classList.add(on ? 'on' : 'off');
      const run = runs.workflow_runs[0];
      let runTxt = '';
      if (run) {
        const when = new Date(run.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        runTxt = ` · last run ${when}: ${run.conclusion || run.status}`;
        $('#latestRun').href = run.html_url;
        $('#latestRun').textContent = 'Latest run ↗';
      }
      text.textContent = (on ? 'Demo workflow ENABLED: armed' : 'Demo workflow disabled (safe)') + runTxt;
    } catch (e) {
      const limited = e instanceof Response && (e.status === 403 || e.status === 429) && e.headers.get('x-ratelimit-remaining') === '0';
      const reset = limited && Number(e.headers.get('x-ratelimit-reset'));
      text.textContent = limited
        ? `Status unavailable: GitHub's anonymous rate limit is used up on this network (resets ${new Date(reset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}). Check with gh below.`
        : 'Status unavailable (offline?). Check with gh below.';
    }
  }
  $('#wfRefresh').addEventListener('click', refreshStatus);
  refreshStatus();
  // Re-check when returning from the terminal (after `gh workflow enable`) or switching to Talk 2.
  // No timer: unauthenticated GitHub API calls are limited to 60/hour.
  let lastCheck = Date.now();
  const recheck = () => {
    if ($('[data-panel="supply"]').hidden || Date.now() - lastCheck < 10000) return;
    lastCheck = Date.now();
    refreshStatus();
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) recheck(); });
  window.addEventListener('focus', recheck);
  $('[data-tab="supply"]').addEventListener('click', recheck);
})();
