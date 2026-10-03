# Behavioral drafts — Themes 1, 4, 8 (from public background)

**How to use this:** these are first-draft scripts built from your *public* record (Microsoft
Cloud Security Advocate; Must Learn KQL & Must Learn AI Security; myITforum; Windows IT Pro;
SANS MS; 30+ yrs speaking/writing). Everything tagged **`[VERIFY]`** is my inference — correct
or cut it. Each runs ~2 minutes. Say "I," land the outcome, end on the Reflection. Swap in real
numbers wherever you see `[VERIFY: metric?]` — a concrete figure makes these much stronger.

Sources for the public facts: your Microsoft advocate page, rodtrent.substack.com, the Must Learn
KQL GitHub course, and the Definitive Guide to KQL.

---

## Theme 1 — Why security, why GitHub, why the Security Lab

> Structure: a career *thread*, not a résumé. The thread is: **I've spent my career making hard
> security topics approachable and teaching them at scale.** That IS developer advocacy.

**Draft (spoken):**

"My whole career has been one thread, even when the technology changed under it: taking something
complex and making it approachable for a huge audience. I started by building and running IT
communities — myITforum — and editorial teams `[VERIFY: editor-in-chief, Windows IT Pro]`, where
the job was translating hard systems problems for practitioners. Then I went deep on security at
Microsoft — Sentinel and KQL — and I noticed people were drowning in the *data* side of defense.
So I wrote **Must Learn KQL**, an open, free, serialized course on GitHub, and it became one of
the default on-ramps for learning KQL `[VERIFY: scale — downloads/translations/book sales?]`.
When generative AI arrived, I did it again with **Must Learn AI Security** — 400-plus pages on
securing AI `[VERIFY: exact length/outcome]`.

So why security? Because defenders are permanently outnumbered, and the only thing that scales is
*teaching* — turning one expert's knowledge into something thousands of people can use. Why
open source specifically? Everything I'm proudest of, I gave away on GitHub, because reach and
community contribution beat a paywall every time.

And that's exactly why the **Security Lab**, not just GitHub. The Lab's entire premise is that you
can't out-hire this problem — you scale expertise through the community: CodeQL queries anyone can
write, the query bug-bounty that turns one researcher's insight into protection for everyone, MRVA,
the Advisory Database. That's the thing I've been doing for 30 years, pointed at open-source
security. A **Developer Advocate** role there isn't a pivot for me — it's the same job I've always
loved, with a bigger lever."

**Reflection line:** "The lesson I keep relearning: the highest-impact security work isn't the
bug I personally find — it's the explanation that lets a thousand other people find it."

---

## Theme 4 — A hard technical decision
### Problem → Options → Trade-offs → Decision → Outcome → Learning

> Grounded in the **Must Learn KQL** build. If you have a meatier *security-architecture* decision
> from a large Sentinel engagement, swap it in — but this one is clean, documented, and shows
> product/technical judgment, which fits a DevRel role well.

**Draft (spoken):**

"**Problem:** KQL was becoming essential for defenders on Sentinel, but the learning curve was a
wall. Microsoft had reference docs, but no approachable on-ramp, and people were bouncing off it.
I decided to fix that — and the real decision was *how* to build and deliver it so it would
actually scale and last.

**Options I weighed:** one, write a traditional book or a paid course — polished, but slow,
closed, and stale the day it ships. Two, a stream of blog posts — fast and free, but unstructured
and un-versioned. Three `[VERIFY: framing]`, treat the curriculum like an open-source *project*:
host it on GitHub, serialize it in small, teachable parts, version it, and let the community file
issues and PRs — even translations `[VERIFY: were there community translations?]`.

**Trade-offs:** option three meant no revenue and an ongoing maintenance burden I'd carry
personally, and publishing in the open where mistakes are visible. But it maximized reach,
let the material stay current, and — the part I cared about — let the community *improve* it.

**Decision:** I went with the open, versioned, serialized approach, and later added an
**assessment** `[VERIFY: Must Learn KQL Assessment, ~2022]` so people could prove they'd learned it.

**Outcome:** it became one of the go-to ways people learn KQL `[VERIFY: metric — stars, downloads,
book, adoption?]`, and later a published book `[VERIFY]`.

**Learning:** treating *education* like open-source software — versioned, in the open,
community-editable — compounds in a way a static artifact never does. I reused that exact playbook
for Must Learn AI Security."

**Reflection line:** "I now default to building teaching artifacts *as* open-source projects, not
products — the community turns them into something better than I could alone."

---

## Theme 8 — Ownership in ambiguity

> Their desired arc: **recognized the gap → created clarity → took ownership → brought others
> along → improved it → applied the learning.** Built from **Must Learn AI Security** (emerging,
> genuinely ambiguous space). Alternative: **myITforum** is an even purer "I owned a whole
> community for ~20 years" story — use that if they want longer-horizon ownership.

**Draft (spoken):**

"**The gap:** when generative AI took off, security teams were being asked to secure something
nobody had a playbook for. The space was pure ambiguity — prompt injection, model risks, data
leakage — and there was no clear owner of 'how does a normal defender actually get started here.'
`[VERIFY: your framing of the moment, ~2023]`

**Creating clarity:** rather than wait for someone to define it, I started writing **Must Learn
AI Security** in the open — breaking a chaotic topic into small, concrete, teachable pieces, one
at a time, published where anyone could read and respond. `[VERIFY: cadence]`

**Taking ownership / bringing others along:** I committed to it publicly and kept shipping, which
pulled in feedback, corrections, and real-world questions from practitioners `[VERIFY: community
response specifics]`. The series grew past **400 pages** and became a formal, organized resource
`[VERIFY: book/compendium]` — and it fed directly into my work explaining tools like Microsoft
Security Copilot `[VERIFY]`.

**Improvement + what I carried forward:** I turned an ambiguous, intimidating space into an
on-ramp a lot of defenders actually used `[VERIFY: metric?]`. What I carried forward: in a space
this ambiguous, *publishing early and iterating in the open* creates clarity faster than trying to
design the perfect taxonomy first. Shipping the v1 is what recruits the collaborators."

**Reflection line:** "Ambiguity doesn't get resolved by waiting for ownership to be assigned —
you create clarity by putting a rough, honest v1 in the open and letting people build on it."

---

## Notes on using these
- **Fill the `[VERIFY]` and `[VERIFY: metric?]` tags** — a real number (downloads, pages, adoption,
  engagement) turns a good answer into a memorable one.
- **Don't memorize word-for-word.** Learn the beats; speak it fresh so it sounds like you.
- **Tie back to the Lab** in Theme 1 and (lightly) Theme 4 — the "scale expertise through
  community / open source" thread is your single strongest fit, and it mirrors both your talks.
- Want me to also draft **Theme 2 (OSS/curiosity)** and **Theme 9 (definition of excellent work)**?
  Those are easy wins from the same material.
