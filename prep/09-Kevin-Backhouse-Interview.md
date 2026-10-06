# Friday 11:00 — Culture & Behavioral with Kevin Backhouse

Read this the night before and again at 10:30. It **adapts the existing behavioral drafts**
(05–08) to the person across the table. Stories don't change; the *framing and the hooks* do.

> **Who he is, in one breath:** a career vulnerability researcher, ex-Semmle (he wrote CodeQL's
> C/C++ range-analysis and value-numbering libraries), at GitHub Security Lab since it launched
> in 2019. Based in the UK, Oxford-educated. He is likely the **manager of the Lab's security
> research sub-team** (TheOrg lists him that way, and in mid-2026 he posted "I'm hiring two Staff
> Security Researchers for *my team*"). He's also the **security contact for Exiv2**, so he sees
> disclosure from the *maintainer's* side too.
>
> **What that means for you:** he's probably not assessing whether you can out-research him.
> He's assessing **whether you'd be a great partner to his researchers**: someone who can turn
> their findings into community impact, who respects the craft, and whom he'd enjoy working with
> asynchronously across an ocean. *Assumption:* the guide says this slot is Culture & Behavioral.
> Expect him to probe technical claims anyway, because he's a researcher.

---

## 1. His work: know these cold (one line each)

| When | What | Why it's memorable |
|---|---|---|
| 2018 (Semmle) | **CVE-2018-4407**, XNU ICMP heap overflow | One packet on the LAN could crash any Mac/iPhone. Found with QL. |
| 2018 | Apple **packet-mangler RCE**, **NFS diskless-boot** overflows, **librelp** (rsyslog) stack overflow | His LinkedIn articles. librelp was a *collaboration* write-up with the maintainer. |
| 2018 | "Using QL to find kernel stack buffer overflows in **Qualcomm MSM**" | Variant analysis before MRVA existed. |
| Nov 2020 | **"How to get root on Ubuntu 20.04 by pretending nobody's /home"** | accountsservice DoS → gdm3 runs initial setup → new admin. **No memory corruption.** Famous. |
| Jun 2021 | **polkit CVE-2021-3560** | A 7-year-old auth bypass: kill `dbus-send` at the right moment → root on most distros. |
| Dec 2021 | "Getting root on Ubuntu through wishful thinking" | Another accountsservice LPE. |
| Nov 2021 | **Exiv2 "blue-teaming" series** | Advisory process, **three rules of bug fixing**, custom CodeQL in code scanning, OSS-Fuzz. |
| Oct 2023 | **CVE-2023-43641**, 1-click RCE on GNOME (libcue) | Just *downloading* a `.cue` file was enough, because tracker-miners auto-indexes ~/Downloads. |
| Dec 2023 | "Cueing up a calculator" | A *teaching* post on Linux exploit development using that bug. |
| Feb 2024 | Repo-jacking explained | Supply-chain risk from renamed/deleted accounts. Ties to **your Talk 2**. |
| Jan 2026 | **"Community-powered security with AI"**: launch of the **Taskflow Agent** | Open-source YAML "taskflows" + MCP toolboxes (incl. CodeQL). He called it "a tool we want to use ourselves." |
| Apr 2026 | **"Finding a 16-year-old bug isn't as surprising as you think it is"** (LinkedIn) | See §2. **Read it before Friday.** |

His **three rules of bug fixing** (Exiv2 series): add a regression test, fix the bug, and **find and
fix the variants**. "If you find one bug, there are almost always others nearby." This is
**literally your Talk 1** (the second SQLi on `/by-owner` is the variant). Use that line.

**Don't confuse:** the 2023 Exim CVEs were ZDI's, not his. Don't credit him with them.

---

## 2. His April 2026 article: have a real opinion

**His argument, in brief:** People are fixating on the *age* of bugs AI finds (e.g. the 16-year-old
FFmpeg H.264 bug from Anthropic's Project Glasswing). That's expected:
- Security research has always meant **looking at code nobody else looked at**: error paths and
  corner cases, off the "happy path."
- FFmpeg is about 2M lines and already heavily fuzzed. Fuzzing misses bugs when hitting the path by
  chance is improbable (a frame with *exactly* 65,536 slices). **AI automates careful reading** and
  finds what slipped through.
- The DEF CON pattern: the hard part of most talks is *reverse engineering to reach the code*; the
  bugs themselves are often trivial.
- Maintainers are getting **a flood of AI-generated reports**: "beneficial in the longer term, but
  it's absolutely not fun in the short term." So the Lab **open-sources its AI tooling** so
  maintainers can find problems themselves, on their own schedule.
- He ends by praising **FFmpeg's maintainers**. His respect for maintainers runs through all his work.

**Your take (say it in your words):**
> "What struck me was the maintainer point at the end. The tooling is getting good fast, but the
> bottleneck has moved from *finding* bugs to *people absorbing them*. That's an education and
> advocacy problem as much as a research one: teaching maintainers to run these tools *before*
> someone else does, and teaching AI-assisted reporters what a report worth a maintainer's time
> looks like. Verified, reproducible, ideally with a patch. That's work I'd love to own."

That connects his concern directly to the DevRel role. **Context to know:** GitHub restructured its
own bug bounty in July 2026 (an invite-only VIP tier, and new researchers capped at four
submissions) partly because of AI-report volume.

---

## 3. What he's been amplifying (his LinkedIn, last ~6 months)

- **AI-powered fuzzing with the Taskflow Agent** (Antonio Morales, `seclab-taskflows-fuzzing`).
  The agent picks targets, writes harnesses, runs AFL with doubling time budgets, and triages crashes.
- **"How to scan for vulnerabilities with GHSL's open-source AI framework"** (Man Yue Mo & Peter
  Stöckli, Mar 2026). It runs threat modeling, then issue suggestion, then a fresh-context audit
  with strict evidence rules. Across 40+ repos: **1,003 suggested → 139 flagged → 19 reportable
  after manual review.** That funnel is a great talking point on *human verification*.
- **GitHub Secure Open Source Fund**: Session 5 is open ($10k + 3-week training + Lab office
  hours). Session 4 had 50 projects and 71 maintainers, and 92% finished with secret scanning, code
  scanning, private vulnerability reporting (PVR) and Dependabot on.
- **"Repository Under Attack" red-team workshop** for Fund maintainers: a simulated supply-chain
  incident (malicious package, exposed Actions secrets). **That's your Talk 2, as a workshop.**
- **actions/checkout v7** refusing pwn-request checkouts (`allow-unsafe-pr-checkout` escape
  hatch). Already in your Talk 2. "Secure by default doesn't always mean removing a behavior."
- **7-Zip GHSL-2026-140 / CVE-2026-48095** PoC, and Jaroslav Lobačevski's talk "LLM-assisted
  vulnerability hunting: hype vs. reality."
- **His hiring posts**: two Staff Security Researchers, remote (USA + Germany). His team is
  **fully remote and multi-timezone**, so Theme 7 (async) matters to him personally.

**The pattern:** AI-assisted research tooling, open-sourced for maintainers, plus supply-chain
hardening and maintainer education. Your two talks sit squarely in this.

---

## 4. Re-aim your stories for Kevin

| Theme | Draft | Re-aim it like this |
|---|---|---|
| **1 · Why the Lab** | 05 | Add: *"Your team's research is the raw material. My job would be to make sure it reaches the 500:1 developers who'll never read an advisory."* Name **one** specific Lab artifact you'd advocate (Taskflow Agent or the Fund). |
| **2 · Curiosity / OSS** | 06 | Lead with **what you built for this loop**: a vulnerable app, a model pack, a custom taint query, a live Actions injection. Mention you **read the Taskflow audit post** and what struck you (the 1,003 → 19 funnel). Be honest that you're a *translator*, not an exploit developer. |
| **4 · Technical decision** | 05 | Fine as-is. If he probes, have one technical detail from building the demos ready (§5). |
| **5 · Helping others** | 08 | Researchers often hate writing for broad audiences. Frame it as *"helping an expert get their work understood,"* which is exactly what his team needs from DevRel. |
| **6 · Learning** | 07 | **Strongest fit.** Learn it → build it → teach it is Kevin's own pattern ("Cueing up a calculator" teaches exploit dev using his own bug). |
| **7 · Remote/async** | 08 | He manages a UK/US/Germany team. Stress written artifacts, issue/PR culture, and **knowing when sync is worth it**. |
| **8 · Ownership** | 05 | Fine. |
| **9 · Excellent work** | 06 | Tie to his **three rules**: excellent = fix the class, not the instance, plus a regression test so it stays fixed. Your Talk 1 thesis. |
| **10 · Failure** | 08 | Needs a real one. He'll value an honest **technical** miss over a polished story. |

---

## 5. Technical probes he might throw (have a crisp answer)

- *"How did you get CodeQL to find the node:sqlite injection?"* → It wasn't modeled. I added a
  `sinkModel` extension: `node:sqlite` → `DatabaseSync` instance → `prepare/exec` arg 0 as
  `sql-injection`. Then the stock `js/sql-injection` query lit up both variants and stayed silent on
  the parameterized one.
- *"Why is the Actions injection exploitable?"* → `${{ }}` is template-expanded **before** the
  shell runs, so the title becomes script text. The fix is an env var (`$TITLE` is data), no secrets
  in that job, and a minimal token.
- *"Where does CodeQL fall short?"* → Unmodeled libraries (your own demo shows it), dynamic
  dispatch, and logic bugs with no clear source-to-sink shape. **His polkit and gdm3 bugs are
  exactly that kind.** Saying so shows you know where the craft lives.
- *"Fuzzing vs. static analysis vs. AI?"* → They're complementary. Fuzzing needs a probable path,
  static analysis needs a model of the bug class, and AI reads code like a patient human but needs
  **verification** (the 1,003 → 19 funnel).
- **If you don't know: say so, then reason out loud.** A researcher respects "I haven't done
  exploit dev at that level; here's how I'd approach finding out" far more than a bluff.

---

## 6. Questions for Kevin (pick 3; they're built to start a conversation)

1. "In your Glasswing piece you said the AI report flood is *'absolutely not fun in the short
   term'* for maintainers. From the Exiv2 side, **what does a report worth your time look like**,
   and what would you want every AI-assisted reporter to learn first?"
2. "The audit-taskflow post went 1,003 suggestions → 19 reportable. **Where does a human
   researcher add the most value in that funnel today**, and do you expect that to move?"
3. "You've written some of the Lab's best *teaching* posts, like 'Cueing up a calculator.' **How
   do you decide when a finding deserves a tutorial and not just an advisory?** And how could a
   Developer Advocate make that cheaper for your researchers?"
4. "Your three rules of bug fixing end with 'find the variants.' **How often do maintainers
   actually do that third step**, and what gets in the way?"
5. "Your team is spread across the UK, US, and Germany. **What does a great working relationship
   between your researchers and a Developer Advocate look like day to day?**"
6. "What's a piece of the Lab's research you think **deserved far more attention than it got**?"

**Rapport openers if there's a natural moment** (don't force it): his team-page bio ("catching up
on all the hacking I should have done in the 1990s"), or the kids' spelling-practice Python
project on his GitHub. Both are about *teaching people to code*, which is your whole career.

---

## 7. Avoid

- Overclaiming research depth. He'll know. Your edge is **translation at scale**, so own it.
- Treating AI as magic **or** as hype. His position is nuanced: a real revolution that needs
  verification and maintainer empathy.
- "GitHub is a great company." Name the Lab's **mechanism**: encode expertise (queries, taskflows),
  open-source it, and mobilize the community.
- Attributing the Exim CVEs or anything you can't source to him.

*Sources: Kevin's LinkedIn profile & activity (viewed Oct 6, 2026), his LinkedIn article (Apr 10,
2026), github.blog/author/kevinbackhouse, securitylab.github.com/team, the Taskflow Agent and
audit-framework posts on github.blog. The "manager of the research sub-team" title comes from
TheOrg plus his hiring post. It's an inference, so don't state it as fact to him.*
