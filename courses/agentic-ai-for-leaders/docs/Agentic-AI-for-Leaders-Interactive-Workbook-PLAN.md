# Agentic AI for Leaders — Interactive Workbook Build Plan

**Version:** 1.0 · 11 August 2026
**Course source:** Facilitator Guide V1 (171pp, 31/07/2026) · Activity Workbook V1 Fillable (92pp) · Concepts Workbook V1 (82pp) · Post-Pilot Facilitator Guidance (pilot 23–24 July 2026)
**Destination:** `AIM Interactive Workbooks/courses/agentic-ai-for-leaders/` (folder already exists, currently empty)
**Pattern:** Multi-page RAIL-style build (per Responsible AI Leadership / AI for Teamwork), with Extras slots reserved for Phase 2.

---

## 1. What this workbook is

A two-day advanced course hub for leaders who already govern AI (Responsible AI Leadership graduates) and now face decisions about **delegating authority to autonomous systems**. The course's defining design feature — and the thing the interactive workbook can do that paper cannot — is the **Capstone Evidence Pack**: every module produces a named artefact, and Module 8 assembles all seven into a single defensible executive decision (Deploy / Scale / Constrain / Withdraw).

The workbook's job:

1. **Match the printed materials exactly** — same module names, same activity numbers and names, same cases, same frameworks, same artefacts — so a student can move between the fillable PDF, the deck and the site without friction.
2. **Make the evidence pack live.** Answers captured in Modules 1–7 automatically surface in Module 8's Reasoning Bridge, next to the question each artefact answers. This is the "wow" moment: the student watches two days of judgement become one decision.
3. **Preserve the experiential arc.** The FG is emphatic: *feel the uncertainty first, decide under pressure, then receive the framework.* Every module page is sequenced decide-first → reveal → concept layer → apply-to-your-own-workflow, with reveals gated behind a committed answer.

### The course spine (must be reproduced verbatim)

| # | Module (exact name) | Question | Leadership move | Artefact |
|---|---|---|---|---|
| 1 | When AI Begins to Act | Is the AI acting? | Recognise | Points of Agency & Accountability Map |
| 2 | Defensible Agentic AI Decisions | Should it be allowed to act? | Judge | Autonomy Decision Snapshot |
| 3 | Delegation and Boundaries | Where does its authority stop? | Design | Boundary Map |
| 4 | Observability | Can we see enough to defend it? | Sustain | Observability Readiness Map |
| 5 | Workflow Readiness | Is the workflow ready? | Require & refuse | Workflow Embedding Map |
| 6 | Intervention Readiness | Can we intervene when it fails? | Intervene & escalate | Escalation Design Map |
| 7 | Governing Autonomy Over Time | Can we govern it over time? | Govern & sustain | Governance Cadence Map |
| 8 | Executive Leadership Stance | What is the executive decision? | Decide & Own | Executive Decision |

### Running cases (thread through the site with a consistent visual identity)

- **Complaint Triage Agent** — M1 (one of Three Agents to Judge) → M2 (autonomy decision; 87% accuracy / 82% policy alignment / 9% escalation / inappropriate payouts) → M3 (the eight decisions inside it) → M4 (the regulator audit, 48 hours) → M7 (twelve months later: drift, de-skilling, scale request) → M8 (worked example: Constrain).
- **Identity Verification / Customer Onboarding workflow** — M5 (the new proposal before the executive committee) → M6 (three months later, the failure simulation).
- **The student's own workflow** — chosen in Activity 1.3 via Path A (live) or Path B (plausible, 12–24 months), carried through every module's transfer activity. The site must keep this workflow's name visible everywhere (persistent chip in the page header: "Your workflow: …").

---

## 2. File structure

```
courses/agentic-ai-for-leaders/
├── index.html                  ← course hub (session-gated)
├── assets/
│   ├── css/site.css
│   ├── js/site.js              ← capture engine, modes, progress, nav
│   ├── js/evidence.js          ← Evidence Pack aggregation + export
│   ├── img/  (aim-logo-white.png, aim-logo-blue.png)
│   ├── pics/                   ← Midjourney stills + loop mp4s (ALL 59 IN PLACE, final names, 2026-08-11)
│   └── cheatsheets/            ← Phase 2
├── pages/
│   ├── welcome.html
│   ├── how-to-use.html
│   ├── foundations.html        ← NEW: the concept gym (post-pilot response, see §9)
│   ├── module-1.html … module-8.html
│   ├── evidence-pack.html      ← the capstone centrepiece (= RAIL's my-plan + airspace combined)
│   └── references.html
└── docs/                       ← this plan + Midjourney prompts
```

### Hub integration (top-level `AIM Interactive Workbooks/index.html`)

Add a sixth course card:

- `data-course="agentic-ai-for-leaders"`, title **Agentic AI for Leaders**, tag `Leadership · Advanced · 8 Modules`, accent suggestion `#B53D2C` (deep coral — signals "advanced sibling" of RAIL's teal).
- Copy: *"The advanced sequel to Responsible AI Leadership — decide when AI may act on your behalf, draw the boundaries, and defend the decision."*
- Access code **`leaders2026`** → base64 `bGVhZGVyczIwMjY=` (follows lead2026/agent2026/team2026 pattern).
- Course pages guard on `sessionStorage['aim_access_agentic-ai-for-leaders']==='granted'` and bounce to `../../index.html?course=agentic-ai-for-leaders` (RAIL pattern; headless testing must pre-seed this key — see §11).

---

## 3. Design system

Inherit the RAIL system wholesale (students may use both sites in the same year — they should feel like siblings, not clones):

- **Palette:** teal `#00C0AF` / teal-light `#53DFCB` / teal-dark `#008D80` / cream `#F1EEDE` / cream-alt `#F7EBDB` / coral `#DC5A46` / coral-dark `#B53D2C` / ink `#423A3A`. **Differentiator:** where RAIL leads teal, this course leads **ink + coral** with teal as the accent — darker, more "executive." Day 1 bands tagged coral, Day 2 bands tagged teal-dark (mirrors RAIL).
- **Type:** IBM Plex Sans (body), IBM Plex Sans Condensed (headings), IBM Plex Mono (decision logs, evidence, code-like artefacts — the Mono voice is new and belongs to "evidence" throughout this course).
- **Chrome:** sticky teal header with AIM monogram SVG + course name; nav = Course Map / The Evidence Pack / Day 1 / Day 2; Self-paced ↔ Present mode toggle.
- **Imagery:** photorealistic Hasselblad Midjourney stills per the companion prompt doc; cinematic dark heroes with gradient veils; every module hero echoes its leadership move.
- **Accessibility:** skip links, `:focus-visible` outlines, `prefers-reduced-motion` handling with play-on-demand for hero video, semantic headings, all interactives keyboard-operable, WCAG AA contrast on cream.

---

## 4. The capture engine (`site.js`)

Same architecture as RAIL, new namespace:

- `localStorage['aal.capture']` — flat key/value store of every answer. Autosave on input/change (debounced 400ms), "Saved automatically" indicator in a slim savebar.
- `localStorage['aal.last']` — last page visited → "Continue where you left off" resume button on the hub.
- **Key schema:** `m<N>.<activity>.<field>`, e.g. `m1.canvas.workflow`, `m2.snapshot.level`, `m6.map.window`. Global keys: `me.workflow` (the carried workflow name — written by Activity 1.3, read by every later page for the header chip and pre-fill), `me.workflowPath` (A/B), `me.workflowLive` (live/proposed).
- **Progress:** per-module capture-key totals (declare a `TOTALS` map exactly as RAIL does) → hub cards show progress dots, "In progress" / "✓ Done" chips.
- **Cross-device portability (two-day course = the M5 lesson from the agentic-ai hub):** "Download my answers" / "Load answers" buttons on the hub and Evidence Pack — exports `aal-evidence-<workflow-slug>.json {v, capture, savedAt}`. Encourage download at Day 1 close (the Day 1 Close band on the hub says so explicitly).
- **Print-to-PDF:** every artefact card and the full Evidence Pack render a clean, light-theme, AIM-branded print document (`#printdoc` + `body.printing` + `window.print()` pattern proven in the agentic-ai hub M5). Students leave with real documents, not screenshots.
- **Reset:** "Start over" with a `confirm()` naming what will be erased (all three keys).

---

## 5. The hub (`index.html`)

Structure mirrors RAIL's hub with course-specific content:

1. **Hero** — dark, full-bleed image or loop (executive at a boardroom window at dawn, autonomous activity glowing in the systems behind them). Eyebrow: *Two-day advanced leadership intensive*. H1: **Agentic AI for Leaders**. Sub: *"A judgement course for leaders whose AI no longer waits to be asked. Decide when it may act, where it must stop, what you must see, and what you'll stand behind."* Signature phrases (RAIL's phrase-bar treatment):
   - *"Capability is not permission."* (coral bar)
   - *"Why did you allow this agent to act, what limits did you place on it, and how did you know it was still operating safely?"* (teal bar — the course's framing question, verbatim from the workbook)
   - Meta row: **2** days · **8** modules · **8** artefacts · **1** executive decision.
   - Resume button.
2. **The Leadership Arc strip** (this course's AIRSPACE-strip equivalent) — eight tiles, one per module, showing the leadership move: Recognise → Judge → Design → Sustain → Require & refuse → Intervene & escalate → Govern & sustain → Decide & Own. Hover reveals the module question; click deep-links to the module. This is the spine graphic of the whole course.
3. **The Evidence Pack band** — a horizontal "decision chain" showing the eight artefact slots filling up as the student works (reads `aal.capture`; empty slots ghosted, complete slots lit with a ✓). Links to `evidence-pack.html`. Sub-line: *"Every module leaves you with evidence. Module 8 turns the evidence into a decision."*
4. **Quote band** — full-bleed image + the course's centre of gravity: *"Leaders do not own the technology. Leaders own the consequences of the technology."*
5. **Course map** — Day 1 / Day 2 bands, 2-up card grid, RAIL card anatomy (accent bar, module chip, ≈90 min chip, dashboard name, desc, hover-reveal Sections + Activities lists, progress dots, Open dashboard →). Card data in §7. Minor cards: Welcome & Orientation, How to use this site, Foundations Gym, References, The Evidence Pack.
6. **Day 1 Close band** (between the day bands): *"Finishing Day 1? Download your answers so tomorrow starts where today ended."* + Download button. (Post-pilot: also note "Your facilitator may run Module 4 tomorrow morning — it's ready either way.")
7. **Extras band** — Phase 2 placeholder (see §10), hidden until populated.
8. **Footer** — *"Capability is not permission. Leaders decide."*

---

## 6. Shared module-page anatomy

Every module page uses the same skeleton (RAIL pattern):

- **Hero** — module number, exact module name, the module question ("From … → To …" transition rendered as a two-step breadcrumb, e.g. M3: *From "Should it act?" → To "What exactly can it do?"*), guiding question pull-quote, hero image.
- **Sections** — `h2.section` headings that match FG/Concepts-workbook headings by name, in course order. Self-paced mode shows full explanatory prose (sourced from the Concepts Workbook); Present mode collapses to the essentials.
- **Activities** — numbered and named exactly as the Activity Workbook (Activity 1.1, 1.2, 1.3 …). Each activity is a bordered interactive block with a coral "Activity" chip, timing chip, and capture fields. Decide-before-reveal blocks lock their reveal button until required fields are non-empty.
- **Artefact card** — a distinct cream panel at the end: the module's named artefact assembled live from this page's capture, with "Download PDF" and "This joins your Evidence Pack →".
- **Key takeaways** — verbatim from the FG's Facilitator Summary.
- **Closing question** — the FG's closing question as a full-width quote band.
- **Next-module transition** — the FG's scripted transition line + link.
- **Cheat sheets slot** — empty `section.cheats` reserved (Phase 2).

---

## 7. Page-by-page specification

### Welcome & Orientation (`welcome.html`)

- H1: *"You already govern AI. Now it wants authority."* Framing: builds on the five Responsible AI Leadership foundations (stance · problem-first · recognising influence · evaluating outputs · human accountability) — render as a five-tile "what you're carrying in" strip, each tile linking to the matching RAIL module for revision.
- **Audience + expectation setting** (post-pilot §5 verbatim in spirit): *This is a leadership course. The focus is leadership judgement and governance, not tool use or agent-building.* Present as a "What this course is / is not" two-column panel.
- **The two workbooks** explained (Activity Workbook = where you decide; Concepts Workbook = where the thinking lives; this site = both, live).
- **Starting pulse-check** (capture: `wel.pulse.*`): three sliders — "How much agentic AI is live in your organisation today?", "How confident are you defending an autonomy decision?", "How clear is intervention ownership if an agent fails?" Results replayed in Module 8's close ("compare with where you started").
- Optional pre-course references (webinar + blog links from the Concepts WB).

### How to use this site (`how-to-use.html`)

Present vs self-paced modes; how capture/autosave works; download/load answers across devices; how the site maps to the fillable PDF (activity numbers identical); privacy note (*answers live in this browser only — nothing is sent anywhere*); print/export instructions.

### Foundations Gym (`foundations.html`) — post-pilot response

A short, always-available drill page for the five foundational concepts the pilot said must land: **Automation · Generative AI · AI Agents · Agentic AI · Autonomy in AI systems.**

- **Concept cards** with the FG's canonical anchors: direct debit / ChatGPT email / triage agent; the train-on-tracks vs chef metaphor; recipe vs "make me a cake"; the simple test (*Automation asks "what happens when X occurs?" — Agentic AI asks "how do I achieve Y?"*).
- **Spot-the-Difference drill** — an extended, replayable version of Activity 1.2: shuffled scenario cards (seed with the four workbook scenarios + the onboarding worked-example rows; write ~8 more in the same style), student classifies Automation / Generative AI / Agentic AI, instant feedback with the "why" from the workbook. Score chip; streak; "explain it to a 7-year-old" bonus prompt (free-text capture, `found.eli7`).
- **Agents vs Agentic** and **Agentic behaviour ≠ Autonomy** flip-cards (capability vs delegated authority).
- Linked from the hub, from M1, and from a persistent "Foundations" glossary drawer available on every page (small book icon in the chrome; post-pilot: "revisit the distinctions throughout the course").

### Module 1 — When AI Begins to Act (`module-1.html`)

**Dashboard name:** *The Actor Detector.* **Transition:** none (course opener). **Guiding question:** *What changes when AI is no longer just a tool people use, but a system that can participate in decisions and actions within a workflow?*

Sections (matching FG/Concepts WB): Opening Context → Case Study: Three Agents to Judge → *(Activity 1.1)* → Bridge into the Concept Layer → Clarifying AI Terminology → How AI Participates in Work → Recognising Agentic Behaviour (Planning · Acting · Adapting) → Agentic Behaviour and Autonomy Are Not the Same Thing → Agents vs Agentic → *(Activity 1.2)* → What Leaders Need to Notice → *(Activity 1.3)* → Why Autonomy Shifts Accountability → Output Artefact → Key Takeaways.

Interactives:

- **Activity 1.1 — Following the Rules, or Making the Decisions?** Three agent dossier cards (Complaint Triage / Expense Approvals / Inbound Sales Leads), each showing exactly the workbook's three lines (what it does / what it decides / what it acts on). Under each, a two-position commitment: **"Doing what it was told"** ↔ **"Making decisions of its own"** + a one-line "what tipped you" capture (`m1.a11.agent<1-3>`, `m1.a11.why<1-3>`). Reveal (locked until all three committed): each card annotates its decision verbs — *classifies, decides, escalates, scores, assigns* — glowing coral, with the debrief insight: all three are exercising judgement; the description just made it easy to miss. Reflection capture: *Where might AI already be acting like this in your organisation without you consciously deciding to let it?* (`m1.a11.reflect`).
- **Concept explorer — How AI Participates in Work.** Three-lane interactive (Automation / Generative AI / Agentic AI): pick a lane, see the definition, the leadership question (*Are the rules appropriate? · Can we trust the output? · What authority should this system exercise?*), and the worked onboarding example animating through that lane (checklist ticking vs draft-review-send vs goal-seeking coordinator that hits a blocker and re-plans). Include the train/chef toggle illustration.
- **Recognising Agentic Behaviour** — Plan / Act / Adapt triptych; each panel asks the FG's anchor question back at the three agents (mini inline quiz: "Which of the three agents was planning? What were the signs?").
- **Activity 1.2 — Spot the Difference (5 min).** The four workbook scenarios as a quick classifier with instant feedback and the workbook's "why" column as the explanation. "Want more reps?" → Foundations Gym.
- **Activity 1.3 — Agency Discovery Canvas (20 min).** The first-artefact builder. Step flow: (1) Choose your pathway — Path A (live workflow/pilot/proposal) or Path B (plausible within 12–24 months, with the supplied prompt); name the workflow — *this becomes the workflow you carry through the whole course* (writes `me.workflow`). Nudge toward specific-and-bounded (trigger → sequence → outcome), with the FG's circulating questions as inline hints. (2) Canvas fields: where AI plans / acts / adapts (three toggles + evidence lines); where AI influences what happens next; what judgement previously belonged to a person; what the system can do without a new human instruction; your **three biggest unknowns**. (3) One-minute explain-it check (pair-check rendered as a self-test: "Could a colleague locate the point of agency from your description?"). Captures under `m1.canvas.*`.
- **Why Autonomy Shifts Accountability** — the thermostat vs six-weeks-later-agent contrast as a two-panel graphic; key line set large: *"If you approved the agent, you own what it does, even when you cannot see every move it makes."*

**Artefact: Points of Agency & Accountability Map** — assembles workflow + plan/act/adapt + points of agency + unclear-accountability points + the three questions *"you would want answered before you would say: yes, I approved this knowingly."* PDF export.

### Module 2 — Defensible Agentic AI Decisions (`module-2.html`)

**Dashboard name:** *The Autonomy Decision Desk.* **Transition:** *From "What is acting?" → To "Should it be allowed to act?"*

Sections: Transition → Module Intent → Opening Context → The Value Question: Before We Look at the System → Case Study: Complaint Triage Agent (How Agentic AI Arrives · The Case in Detail) → *(Activity 2.1)* → The Four Autonomy Decision Lenses → *(Activity 2.2)* → *(Activity 2.3)* → Readiness Bridge → Output Artefact → Key Takeaways.

Interactives:

- **The Value Question** — five leadership questions as a pre-flight checklist the student must acknowledge before opening the case file (What problem is this solving? Where is value created? What value does autonomy unlock? Does the value actually require autonomy? What are we accepting in exchange?). Key message banner: *"If what we accept in exchange becomes larger than the value we unlock, the value-risk posture has flipped."*
- **Case dossier — Complaint Triage Agent.** Styled as a briefing pack (Mono type): what it does (reads → classifies → routes → triggers compensation → escalates) · pilot data (87% classification accuracy · 82% policy alignment · 9% escalation rate · misclassification has caused inappropriate payouts) · context (high volume · response-time pressure · customer trust · regulatory exposure). "How agentic AI arrives" four-route strip (procurement upgrade / vendor proposal / team experiment / deliberate adoption).
- **Activity 2.1 — Should This Agent Act Alone? (25 min).** Decide-before-framework, four steps mirroring the workbook: (1) Individual decision — Full / Partial / No autonomy yet + value + reasoning + one concern (`m2.a21.*`), commit button locks it. (2) **The Room** — after commitment, show a poll-style distribution. In Present mode this can display the class's spread if the facilitator polls by hand; in self-paced mode show the honest line: *"Cohorts consistently split three ways on identical information. That disagreement is what leadership under uncertainty looks like."* (3) Decision drivers grid — Value / Risk / Uncertainty / Evidence capture. (4) Immediate reflection — the FG's three questions incl. *"If you had ten agents like this, would your decision stay the same?"* Push-question chips from the debrief guide surface as flip-hints (incl. **"Was 87% good enough?" → "It depends on the 13%."**).
- **The Four Autonomy Decision Lenses** — the module's framework centrepiece: four lens cards, each with core question + anchor: **1 Trust & Stability** (*Is the 87% stable? If it drops, who notices first?*) · **2 Failure Consequence** (*Can the harm be reversed?*) · **3 Control & Recoverability** (*If misclassification starts tomorrow, how long before someone notices?*) · **4 Trade-off Reality** (*What are we gaining and what are we giving up?*). Key message: *"Autonomy is a trade. Speed and scale are bought with visibility and control."*
- **Activity 2.2 — Refine Your Decision Using the Lenses (20 min).** The student's locked 2.1 decision is shown beside the lenses; they re-decide with **autonomy level + one condition + one trigger** (`m2.a22.*`). If the position changed, the UI marks the delta (*"You moved from Full to Partial — what moved you?"* capture).
- **Activity 2.3 — Apply a readiness check and the lenses to your own example (15 min).** Pre-filled with `me.workflow`. Capture: autonomy level for *your* workflow, the main value, **the lens that matters most and why**, one pause/withdraw trigger. Guard-rails from the FG: partial-autonomy answers prompt *"What exactly could it do independently, and where does the human remain?"*; missing evidence prompts the provisional-position nudge.
- **Readiness Bridge** — brief banner previewing the six readiness elements (paid off in M8): *"Should this agent act?" is also "Can we support that autonomy over time?"*

**Artefact: Autonomy Decision Snapshot** — autonomy level · one condition · one trigger · **one-sentence defence** (a defensibility meter fills as the four parts are named — the RAIL M2 mechanic, reborn). Joins the Evidence Pack beside M1's map.

### Module 3 — Delegation and Boundaries (`module-3.html`)

**Dashboard name:** *The Boundary Drawing Board.* **Transition:** *From "Should it act?" → To "What exactly can it do?"*

Sections: Transition → Module Intent → Opening Context (*"Partial autonomy is where most risk lives"*) → Authority Is Not Binary → Three Types of Decisions → Case Study: The Complaint Triage Workflow Revisited → *(Activity 3.1)* → Boundary Design (The Four Parts of a Defensible Boundary) → Protecting Human Judgement → The Value Consideration → *(Activities 3.2 + 3.3)* → *(Activity 3.4)* → Work Transformation Question → Output Artefact → Key Takeaways.

Interactives:

- **Authority spectrum** — slider across execute → recommend → decide within limits → excluded, each stop stating its accountability load.
- **Activity 3.1 — Where Is Your Line? (25 min).** The signature interaction: the workbook's **eight decisions inside the Complaint Triage workflow** (severity? · which team? · pattern match? · apology/refund/compensation? · how much compensation? · escalate? · regulatory matter? · does history change the response?) rendered as cards the student sorts into three columns: **Delegate / Delegate with Constraint / Do not delegate** (drag on desktop, tap-to-cycle on touch; fully keyboard-operable). The worked example (the acknowledgement task under all three options) is a study-first panel above the board. Per-card prompt on hover: *"If this went wrong, would I defend allowing the agent to make this decision?"* Reveal after all eight placed: the three-category insight (*Delegate. Constrain. Protect.*) + reflection captures (hardest to place / should never have been treated as routine / hardest to defend). `m3.a31.d1..d8`, `m3.a31.reflect*`.
- **The Four Parts of a Defensible Boundary** — Authority / Thresholds / Escalations & Constraints / Ownership, with ownership expanded to its levels (decision · operational · technical · risk/control · case; accountability stays with the business owner — from the worked example).
- **Activity 3.2 — Defensible Boundary Design (15 min shared with 3.3).** Pick one of your constrained decisions from 3.1 → complete a full boundary spec (authority, threshold, escalation conditions, ownership rows). The workbook's acknowledgement-task exemplar is available as a side-by-side reference. `m3.a32.*`.
- **Activity 3.3 — Stress-Test the Boundary.** Three pressure cards delivered one at a time with a 4-minute timer feel: **Efficiency** (volumes spike, CEO wants speed — what prevents the boundary moving?) · **Drift** (nobody changed the boundary, practice drifted — how would you know?) · **Accountability** (the boundary held, harm still occurred — can you still defend it?). Free-text per pressure (`m3.a33.p1..p3`); reveal shows the sample answers (Activity WB p.36) after commitment.
- **Protecting Human Judgement** — the "boundaries fail through dozens of small nudges" passage as an animated pressure graphic.
- **Activity 3.4 — My Delegation Decision (15 min).** Own-workflow transfer, five steps: smallest delegable task (narrowing nudges against "manage onboarding"-style answers) → rationale checkboxes (low risk / reversible / well understood / high volume / clear rules / other) → the human boundary → one observable escalation condition → the closing leadership statement (sentence-builder: *"I would allow an agent to ___ , provided ___ remains human, and it escalates the moment ___."*). `m3.a34.*`.

**Artefact: Boundary Map** — delegated / constrained / non-delegable columns + the detailed boundary spec + stress-test responses + delegation statement.

### Module 4 — Observability (`module-4.html`)

**Dashboard name:** *The Audit Room.* **Transition:** *From "What can it do?" → To "How would I know?"*

Sections: Transition → Module Intent → Opening Context → Scenario: The Complaint Triage Audit → *(Activity 4.1)* → Explanation Is Not the Same as Evidence → What Leaders Need Visibility Of (Decisions · Reasoning · Escalations · Patterns) → Cross-Functional Visibility → Observability Looks Different for Different Agents → *(Activity 4.2)* → Output Artefact → Key Takeaways → Day 1 Summary.

Interactives:

- **The regulator scenario** — cinematic setup: four months live under partial autonomy; the misclassified complaint; the regulator's exact ask (*"Walk us through how this specific decision was made"*) and a **48:00:00 countdown** motif that persists in the page corner for the rest of the module.
- **Activity 4.1 — Decision Log Review (30 min).** The centrepiece: the sample decision log rendered as a realistic system record (Mono, timestamped rows: intake, classification LOW_SEVERITY, confidence 0.87, template response sent, case closed…). Two-pass interaction: (1) Individual review — tag rows as **"helps me explain"** vs flag gaps as **"missing — I'd need this"** with a free-text gap list. (2) The four group-discussion questions as capture (what it tells us / what it doesn't / who needs this to do their role / what could we say — and not say — about "why low severity?"). (3) **The Reveal** (locked until both passes committed): the log dims everything that is only *activity evidence*; the whole "why" column is empty — *"The log tells you what the agent did. It does not tell you why. A complete record of what happened is not a defensible explanation of why it happened."* (4) Step 4 — the **Leadership Observability Guide** (three pitfalls: a confidence score is not a reason · an attention map is not a justification · an AI-generated summary is not independent evidence — *"like letting someone mark their own work"*) as three examine-and-dismiss cards; capture *which apparent explanation would be least defensible* (`m4.a41.*`).
- **What Leaders Need Visibility Of** — four-panel explorer (Decisions / Reasoning / Escalations / Patterns), each with its FG anchor (*"An agent that never escalates is either perfect or invisible — leaders need to know which."*).
- **Observability by agent type** — three-way comparator (Complaint Triage: cases + patterns · Scheduling: cumulative fairness · Financial Triage: full per-case reconstructability), each with its leadership question.
- **Activity 4.2 — My Selected Workflow Visibility Requirement (25 min).** For `me.workflow`: a prioritised picker across the seven observable-information rows (decisions made · information relied on · confidence + thresholds · escalation triggers · human review points · patterns · boundary-compliance evidence) — the exemplar "potential leader responses" table available as reference; students must prioritise, not select all (cap highlight at 3 "must-haves"). **Step 2 — My Next Commitment:** one 30-day action + who they need (partner roles multi-select: vendor / IT / data / risk / compliance / ops / audit) + "how I'll know I started." `m4.a42.*`.
- **Day 1 Summary band** — the four Day-1 artefacts shown filled from capture; download-your-answers prompt; the end-of-day line: *"Observability is the leadership capability that makes every other decision in this course defensible."*

**Artefact: Observability Readiness Map** — prioritised visibility requirements + 30-day commitment + partners.

**Post-pilot flexibility:** M4's hub card carries a small "Flexible — may run Day 1 PM or Day 2 AM" chip; the page renders correctly in either day filter (`data-day="1"` default, a body class the facilitator can flip in Present mode moves it — cosmetic only).

### Module 5 — Workflow Readiness (`module-5.html`)

**Dashboard name:** *The Approval Committee.* **Transitions:** Day 1 Close → Day 2 Open (*from "The Agent" to "The Workflow"*) and *From "What must I see?" → To "Is the workflow ready?"*

Sections: Day 2 Reframe → Module Intent → Where Agentic AI Sits in the Workflow → What Might This Look Like Before Anyone Calls It Agentic AI? → Initial Reflection → Scenario: The New Workflow Proposal → *(Activity 5.1)* → The Four Workflow Readiness Criteria → Workflow Readiness Is Contextual → Common Workflow Failure Patterns → Reversibility and Containment → *(Activity 5.2)* → Output Artefact → Key Takeaways.

Interactives:

- **Day 2 Reframe** — the four Day-1 artefacts rendered as evidence chips (*"Your Day 1 outputs are now evidence for Day 2 decisions"*), plus the radar-appearance strip (how agentic AI shows up: smarter automation · a business case · unexpected autonomy · an incident · fragments across teams · shifting trust · an undeferrable decision).
- **Initial Reflection (3 min)** — pick one Day-1 judgement: *what would need to be true in the workflow for it to hold?* (`m5.reflect`).
- **Scenario: The New Workflow Proposal** — vendor-pitch dossier for the customer onboarding + identity verification platform: business case, pilot results, the vendor's label ("AI-powered onboarding automation platform") deliberately at odds with the described behaviour (determines what information to request · decides evidence sufficiency · routes · **approves low-risk customers with no human review** · escalates uncertainty). A "Is this just automation?" prompt captures the student's first instinct *before* the tension is named (`m5.instinct`), then the FG's key question: *which of those activities are following instructions, and which are making decisions?*
- **Activity 5.1 — The Workflow Embedding Lab (25 min).** Approval, not design: (1) **Seven-zone workflow mapper** — Entry / Decisions / Human checkpoints / Handovers & escalation paths / Exits / Reversibility / Observability as an interactive strip over the proposal's flow; per zone the student marks *deliberate & visible* vs *missing/unclear* + a note. (2) **Readiness judgement** — four fields: where ready / where not (and who must fix it) / where value is real / where value is assumed. (3) Reveal: sample answers; the key insight highlighted — *the most important gaps are governance gaps: visibility, escalation, accountability, ownership. They are approval conditions.* (4) **Require / Refuse builder** — "What I would require before signing off" (list) and "What would make me vote no regardless of the business case" (the refusal line — required field; the FG treats naming a refusal condition as the module's crux). `m5.lab.*`.
- **The Four Workflow Readiness Criteria** — 1 Explicit Actions & Decisions (*Is responsibility explicit?*) · 2 Designed Handovers & Escalation Paths (*Do deliberate paths exist when something goes wrong?*) · 3 Observability Built In (*Can the workflow be explained later?*) · 4 Tested Value & Mapped Reversibility (*If the agent gets this wrong, what happens next?*). Plus the contextual-weighting comparator (triage → handovers/escalation · scheduling → patterns/fairness · financial → reversibility/defensibility) and the three failure patterns (agent-acts-human-rubber-stamps · human-decides-agent-execution-changes-impact · shared-responsibility-unclear-ownership).
- **Activity 5.2 — Apply the Lens to Your Own Context (15–20 min).** For `me.workflow`: rate each criterion Ready / Partial / Not Ready with evidence lines; who else needs visibility; value real vs assumed; **final readiness verdict**. `m5.own.*`.

**Artefact: Workflow Embedding Map.** End-of-module position rendered as the five-line "I can now say…" stack.

### Module 6 — Intervention Readiness (`module-6.html`)

**Dashboard name:** *The Incident Simulation.* **Transition:** *From "Is the workflow ready?" → To "What happens when it fails?"*

Sections: Transition → Module Intent → Opening Context → Scenario: Identity Verification Workflow — Three Months Later → *(Activity 6.1)* → The Four Elements of Intervention Design → Intervention Readiness Looks Different Across Workflows → *(Activity 6.2)* → Output Artefact → Key Takeaways.

Interactives:

- **Activity 6.1 — Failure Scenario Simulation (20 min).** The workbook's pressure simulation as a staged, timed experience — the module's theatre piece: (0) **Role select** — executive sponsor (default) / risk / compliance / operations / legal; the page addresses the student in-role. (1) **The brief:** three months live, risk anomaly, compliance concerned, operations wants direction, *vendor needs 48 hours*, executive team must act. (2) **First Response (5:00 timer):** commit five decisions — stop or continue? · who is involved immediately? · guidance to operations? · regulator notification begun? · internal comms? (`m6.sim.r1.*`) — commitment locks. (3) **Update One** injected (3:00) → reconsider, record changes. (4) **Update Two** (3:00) → reconsider again. (5) **Final commitment:** *what happened in the first sixty minutes, and who authorised each action?* (6) **The Reveal:** *"Intervention readiness is not about decision quality. It is about decision authority. The organisations that intervene quickly decided in advance who can act."* Debrief prompts follow (first decision you struggled with · what you failed to do · who owned intervention · what "work with the vendor" should have said instead). Timers are pressure-theatre: visible, but expiry nudges rather than blocks (accessibility; reduced-motion/no-timer toggle honoured). Update texts sourced from the locked deck/Activity WB during build.
- **The Four Elements of Intervention Design** — 1 Escalation Triggers (*How do we know something is wrong?*) · 2 Stop Conditions (*What automatically becomes unacceptable?* — anchored: *"The room spent minutes debating whether to stop. That decision should already have existed."*) · 3 Intervention Paths (trigger · authority · time window · coordination — *Who can act, how quickly, without asking permission?*) · 4 Cross-Functional Accountability Ownership (*Who owns what when reality becomes messy?*).
- **Intervention window comparator** — Complaint triage: hours→days · Scheduling: weeks→months · Financial decisioning: minutes→hours · Identity verification: minutes→hours. *"The four elements remain consistent. The clock changes."*
- **Activity 6.2 — Design Intervention for Your Own Workflow (20 min).** For `me.workflow` (explicitly "the workflow you named in Module 5"): specify all four elements (what exists today / what's missing / cross-functional owner, each rated Ready / Partial / Not Ready) + **intervention window** (minutes/hours/days/weeks) + the **honest readiness call** (*Is this workflow intervention-ready? What would have to change?*). `m6.map.*`.

**Artefact: Escalation Design Map.** Key message: *"When leaders approve deployment they are not approving success. They are approving how failure will be handled."*

### Module 7 — Governing Autonomy Over Time (`module-7.html`)

**Dashboard name:** *The Governance Cadence Studio.* **Transition:** *From "Can we stop it?" → To "Can we govern it over time?"*

Sections: Transition → Module Intent → Opening Context (*"Governance is not the approval. Governance is what happens after the approval."*) → Scenario: Complaint Triage Agent — Twelve Months Later → *(Activity 7.1)* → Governance Is a Cadence, Not a Document → The Four Signals Leaders Should Watch → From Signal to Trigger → Hidden Governance Risk → *(Activity 7.2 + AI Thought Partner)* → Ending Concepts → Output Artefact → Key Takeaways.

Interactives:

- **Twelve Months Later** — the three quiet signals staged as a slow-reveal (more low-severity classifications · new staff losing confidence with complex complaints · the exec committee wants to scale to two acquired subsidiaries): *"None of these is a crisis. Together they are exactly what governance exists to detect."*
- **Activity 7.1 — The Guardrail Design Sprint (15 min).** A cadence-builder table, not a dashboard-builder: rows = signals (seeded suggestions: exceptions · drift · reliability changes · escalation patterns; free-add); columns = **review interval · cross-functional owner · trigger point · required action** (action picker escalates: Closer Review → Constraint → Pause → Redesign). Minimum-viable-governance mechanic: every signal row shows *"Would this ever change a decision?"* — answering "no" strikes the row (*"If you would never act on it, why are you monitoring it?"*). Reveal: *"The signal most groups miss is the effect on people."* → prompts the **human-reliance signal add-on** (changes in how people rely on, challenge, override or learn from the agent) as a required fifth row. Scale gate: *"Is it safe to scale? Governance is the scaling test."* `m7.sprint.*`.
- **The Four Signals** — Exceptions / Drift / Reliability Changes / Escalation Patterns cards with their key questions (*"…too confident or too cautious?"*), plus the **Hidden Governance Risk** panel (reduced employee capability · reduced challenge behaviour · dependency formation · loss of critical expertise).
- **From Signal to Trigger** — an interactive severity ladder (Closer Review → Constraint → Pause → Redesign): drag a scenario chip up the ladder to feel proportionality.
- **Activity 7.2 — The One Signal You Are Not Watching (20 min).** For one agent/workflow/automated system in the student's organisation: the single most-likely early-warning signal · owner · trigger · action · **why the response is proportionate**. **AI Thought Partner:** the workbook's prompts rendered as copy-buttons (pressure-test signals · identify triggers · proportionate actions · ownership) — students paste into their own AI tool; a note ties this to responsible use (*you validate; the AI drafts*). `m7.signal.*`.

**Artefact: Governance Cadence Map** — signals (incl. human-reliance) × interval × owner × trigger × action + the transfer reflection. Closing: *"Leaders stay in the loop directionally, even when they are out of the loop operationally."*

### Module 8 — Executive Leadership Stance (`module-8.html`)

**Dashboard name:** *The Executive Decision Room.* **Transition:** *From "Can we govern it?" → To "What's my decision?"*

Sections: Transition → Module Intent → Opening Context → Worked Example: Complaint Triage — One Final Time → *(Activity 8.1)* → Six Readiness Lenses → The Organisational Shift → *(Activity 8.2)* → Course Close → Output Artefact.

Interactives:

- **Worked example — evidence to decision.** The workbook's executive-question ↔ artefact table animated: each Complaint Triage question lights the artefact that answers it (Agency Discovery Canvas · Boundary Map · Autonomy Snapshot + Observability + Cadence · Escalation Design Map · Governance Cadence Map), then the evidence rolls up to the reasoned outcome: **Constrain** — *"not because the technology failed; because the evidence says scaling cannot yet be defended. The important point is not that constrain is the only correct answer — it is that the decision can be traced back to evidence."*
- **Activity 8.1 — Executive Decision Lab (30 min).** The site's payoff:
  - **Step 1 — The Reasoning Bridge (18 min).** The workbook's eight questions, each rendered with (a) the named source artefact(s) — *1 what is it trusted to do → Agency Discovery Canvas (M1) + Workflow Embedding (M5); 2 what decision rights, are they delegable → Boundary Map (M3); 3 what evidence of reliability → Autonomy Snapshot (M2) + Observability (M4) + Cadence (M7); 4 conditions to constrain/revoke → M2 + Escalation (M6) + Cadence (M7); 5 what must leaders see → Observability (M4); 6 hard-to-reverse harms → M2 + M5 + M6; 7 governance capacity before scaling → M6 + M7; 8 how is this defended → M8* — and (b) **the student's actual captured answers from those modules displayed inline** beside each question. Unanswered sources render as a coral "gap" chip with the FG line: *"If you cannot answer, that is not a failure. The gap is evidence. Treat it as a finding."* Free-text answer per question (`m8.bridge.q1..q8`).
  - **Step 2 — Force the Decision (6 min).** Four large option cards — **Deploy / Scale / Constrain / Withdraw** — single choice, no multi-select, and the commit copy is the FG's: *"No 'it depends.' No 'yes, but.' No conditions that will magically appear later. Choose."* Then: key evidence (which artefacts support it — multi-select chips) + the trigger that would change the decision. (`m8.decision.*`).
  - **Step 3 — The Reveal.** *"Most leaders discover the decisive factor was not the technology… Constrain is not a weaker decision. Withdraw is not a failure. Sometimes those are the strongest decisions in the room."*
- **Activity 8.2 — The Leadership Stance Close (20 min).** Four challenge cards, drawn one at a time: **Board** (*Can you justify this risk?*) · **Regulator** (*Can you demonstrate why this is defensible?*) · **Workforce** (*What happens to people?*) · **Customer** (*If the agent gets this wrong, who remains accountable?*). The student writes their defence per challenger (`m8.stance.c1..c4`); a "weakest answer" self-flag feeds the final reflection (*the moment you cannot answer a challenge is the most valuable learning moment in the course*).
- **Six Readiness Lenses** — 1 Value Case (*Is the value real?*) · 2 Workflow Fit (*Is the workflow agent-ready?*) · 3 Boundary Design (*What authority can be delegated?*) · 4 Observability Readiness (*Can leaders remain accountable?*) · 5 Escalation Readiness (*Can we intervene?*) · 6 Governance Readiness (*Can we sustain this safely over time?*) — rendered as a six-segment dial that lights per lens as the student self-rates; explicitly **not** a scoring formula (FG: *"If there was a formula, leaders would not be needed. The lenses inform judgement."* — show this line when someone rates all six).
- **The Organisational Shift** — three closing questions (ongoing agent ownership · capability shift · accountability shift) + course close script. **Pulse-check replay:** the welcome sliders shown then vs now.

**Artefact: Executive Decision** — workflow · eight bridge answers · the decision · supporting artefacts · trigger · defence. Completes the Evidence Pack.

### The Evidence Pack (`evidence-pack.html`)

The course centrepiece page (RAIL's my-plan + airspace fused):

- **The decision chain visual** — eight artefact stations along a path from *Recognise* to *Decide & Own*; each station shows completion state and a preview of the student's artefact; clicking opens the full artefact inline.
- **Everything, assembled** — the full pack as one continuous, beautifully-typeset document view: all eight artefacts populated from `aal.capture`, gaps rendered honestly as findings.
- **Export** — Download PDF (full pack, print-doc pattern, AIM-branded, with the workflow name and date on the cover) · Download answers (JSON) · Load answers · Reset (confirm).
- Empty state (before M1): explains what will grow here — *"By Thursday afternoon this page is your defence."*

### References (`references.html`)

Optional pre-course refreshers from the Concepts WB (RAIL webinar + blog), links back to the Responsible AI Leadership workbook (the five foundations), Australian benchmarks block mirroring RAIL's references page, glossary link to Foundations Gym. Keep light; verify link URLs from the Concepts WB during build.

---

## 8. Data flow summary (what feeds Module 8)

| Bridge Q | Reads capture keys |
|---|---|
| Q1 trusted to do | `m1.canvas.*`, `m5.lab.*`/`m5.own.*` |
| Q2 decision rights | `m3.a31.*`, `m3.a32.*` |
| Q3 reliability evidence | `m2.a22/a23.*`, `m4.a42.*`, `m7.sprint.*` |
| Q4 constrain/revoke conditions | `m2.a23.trigger`, `m6.map.*`, `m7.sprint.*` |
| Q5 leader visibility | `m4.a42.*` |
| Q6 irreversible harms | `m2.a21.concern`, `m5.own.*`, `m6.map.window` |
| Q7 governance before scale | `m6.map.*`, `m7.sprint.*` |
| Q8 defence | `m8.stance.*` |

`evidence.js` owns this mapping (single source of truth), the hub band, the header workflow chip, and pack export. Keep it data-driven (one `ARTEFACTS` array) so field changes touch one file.

---

## 9. Post-pilot guidance → design responses

| Pilot finding | Workbook response |
|---|---|
| Don't rush Modules 1–3; understanding over coverage | Self-paced mode carries full Concepts-WB prose; Foundations Gym for revision; no timers on Day 1 activities |
| Foundational concepts must land (automation / gen AI / agents / agentic / autonomy) | Dedicated Foundations Gym page + persistent glossary drawer + extended Spot-the-Difference drill |
| M4 may move to Day 2 morning | M4 card flagged "flexible"; day filter tolerant; no hard Day-1-only logic anywhere |
| Active learning over explanation | Every concept has a decide-first interaction; "explain it to a 7-year-old" capture; classify-and-critique drills |
| Participants should design their own agentic examples | Activity 1.3 pathways + the carried workflow pattern; every module ends in own-context transfer |
| Varied readiness; some expect a beginner/tools course | Welcome page "is / is not" panel + RAIL-foundations strip with revision links |
| Day 1 heavy, Day 2 light | Day 1 pages lead with experience, defer prose to self-paced; Day 1 Close band prompts consolidation + answer download |

---

## 10. Extras — Phase 2 slots (structure now, content later)

Reserve on the hub an `.extras` band (hidden until populated), per the agentic-ai hub pattern:

- **Cheat Sheets gallery + zip** — candidate poster list (align with existing 31-poster style): The Automation–Generative–Agentic Test · Plan, Act, Adapt · Agentic ≠ Autonomous · The Four Autonomy Decision Lenses · Delegate / Constrain / Protect · The Four Parts of a Defensible Boundary · The Three Boundary Pressures · Record ≠ Reason (the three explanation pitfalls) · What Leaders Need Visibility Of · The Four Workflow Readiness Criteria · The Three Workflow Failure Patterns · The Four Elements of Intervention Design · Intervention Windows · The Four Signals (+ the Fifth: People) · Signal → Trigger Ladder · The Six Readiness Lenses · Deploy, Scale, Constrain, Withdraw · The Reasoning Bridge.
- **Per-module games** (16-game pattern, 2/module) — candidates: M1 "Actor or Tool?" speed round · M2 "Flip Point" (what evidence flips the decision) · M3 "Hold the Line" (boundary vs pressure nudges) · M4 "The Missing Row" (spot what the log can't tell you) · M5 "Approve or Refuse" committee rapid-fire · M6 "Sixty Minutes" (authority scramble) · M7 "Drift Detector" · M8 "Defend It" (challenge roulette). Course finale: "The Capstone Gauntlet."
- **Downloads** — blank artefact templates as fillable PDFs, and (if desired) the AI Thought Partner prompt pack as a `.txt`.

---

## 11. Build phases, QA and testing

**Phase 0 — Scaffold (½ day):** folder tree, gate scripts, hub card + code in top-level index, site.css/site.js skeletons ported from RAIL, page stubs with correct names/transitions.
**Phase 1 — Hub + shell (1 day):** hub complete (arc strip, evidence band, course map, day filter, resume), welcome / how-to-use / references, capture engine + progress + save/load/export plumbing.
**Phase 2 — Day 1 modules (2–3 days):** M1–M4 content + interactives. Gate reveals behind commitment everywhere.
**Phase 3 — Day 2 modules (2–3 days):** M5–M8. The M6 simulation and M8 decision room are the two largest single builds — budget accordingly.
**Phase 4 — Evidence Pack (1 day):** evidence.js, chain visual, full-pack print doc, JSON round-trip.
**Phase 5 — Imagery (DONE 2026-08-11):** all 42 prompts + 8 loop plates generated and renamed to final names in `assets/pics/` (incl. `hub-loop-ops-heartbeat.mp4`); wire during page builds; compress the few JPGs >400KB.
**Phase 6 — QA (1 day):** checklist below.
**Phase 7 — Extras (later):** cheat sheets, games, template downloads.

> **Execution roadmap:** see `Agentic-AI-for-Leaders-BUILD-PHASES.md` for the full 12-phase, session-by-session build sequence with exit criteria and review gates — it supersedes the outline above.

**QA checklist**

- [ ] Every module name, activity number/name, case fact, framework element and artefact name matches the FG/Activity WB verbatim (spot-check against this plan's §7 which was built from the source PDFs).
- [ ] Complaint Triage numbers consistent everywhere (87 / 82 / 9%).
- [ ] Capture: fill every field on every page → Evidence Pack complete → PDF export renders all eight artefacts → JSON export/import round-trips → reset clears `aal.capture`, `aal.last`.
- [ ] Reveal-gating: no reveal reachable without commitment; back/refresh preserves locked state.
- [ ] Both modes (self-paced/present), both day filters, M4-flexible rendering.
- [ ] Keyboard-only pass of the M3 sort board, M6 simulation and M8 decision cards; reduced-motion pass (timers become steps); screen-reader labels on all custom controls.
- [ ] Mobile (mapper and sort board degrade to tap-to-cycle), print CSS on all artefacts.
- [ ] Headless testing gotcha (from project memory): pre-seed `sessionStorage['aim_access_agentic-ai-for-leaders']='granted'` via addInitScript or the gate redirect-loops; drive `<select>`s by swapping `selected` attributes under linkedom; guard `input.select()` calls.
- [ ] localStorage persistence assumes hosted/http origin; document the file:// limitation in how-to-use.

**Backups discipline:** before each phase lands on device, keep `index.html.pre-<phase>.bak` copies as per house convention; prune when approved.

---

## 12. Content sources to pull during build (not blockers now)

- Exact decision-log rows for Activity 4.1, the M6 Update One / Update Two texts, and the M5 sample answers — extract from the Activity Workbook pages / locked deck when building those pages.
- The Concepts Workbook prose per section for self-paced mode (paraphrase-faithful, not photocopied).
- Optional pre-course webinar/blog URLs from the Concepts WB for references.html.
- Hero video loops (Phase 1.5, optional): reuse RAIL's cinematic-loop approach with new footage or stills-only launch.
