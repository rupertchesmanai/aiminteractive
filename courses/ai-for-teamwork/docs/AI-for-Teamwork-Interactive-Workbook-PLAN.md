# AI for Teamwork — Interactive Workbook Build Plan

**Course:** AI for Teamwork v3.0 (AIM, Feb 2026 materials)
**Target:** New multi-page interactive workbook inside `AIM Interactive Workbooks/courses/ai-for-teamwork/`
**Modelled on:** Responsible AI Leadership (multi-page architecture, shared css/js, capture system) with lessons from AI Essentials for Business
**Sources:** `FG_ AI for Teamwork_v3.pdf` (28pp facilitator guide), `WB_AI+for+Teamwork_v3+Filable.pdf` (77pp participant workbook, Activities 1.1–9.1), `PPT_ AI for Teamwork.pdf` (55 slides)

---

## 1. Goals & principles

1. **Replace the fillable PDF** with a browser-based workbook participants use live on the day and revisit afterwards — every activity captured, autosaved, and pulled together into a printable Action Plan.
2. **Serve both delivery modes.** A Present / Self-paced toggle (as in Responsible AI Leadership): Present mode hides long prose and shows activity essentials; Self-paced shows full teaching content for post-course revisiting.
3. **The human-centred AI workflow is the spine.** The Verify → Rewrite → Check loop appears as a persistent visual motif in every module, exactly as it threads through the FG.
4. **Copy-paste-first design.** Participants work in their own LLM alongside the workbook, so every prompt in the course gets a one-click "Copy prompt" chip, and every scenario/dataset gets a "Copy source text" button — no retyping, no shared-drive hunting.
5. **Guard against cognitive offloading by design.** Where the FG says "handwrite first" or "own conclusions before AI," the page enforces it: the AI-step panel stays visually locked until the human-first field has content.

---

## 2. Site architecture

```
courses/ai-for-teamwork/
├── index.html                 Course hub (dashboard) — access-gated from main hub
├── pages/
│   ├── welcome.html           Orientation + Section 1 (icebreaker, challenge anchor)
│   ├── how-to-use.html        Site guide, LLM setup, assumed knowledge, note on agents
│   ├── module-1.html          Team Types & How AI Can Help
│   ├── module-2.html          Risks & the Human-Centred AI Workflow
│   ├── module-3.html          Better-Prepared Attendees (communication)
│   ├── module-4.html          Optimise Time Together (meetings)
│   ├── module-5.html          Deeper Analysis & Thought Partners
│   ├── module-6.html          Change Management of AI Adoption (capstone)
│   ├── module-7.html          Other Use Cases for AI
│   ├── module-8.html          Next Week Action Plan
│   ├── my-plan.html           My Teamwork Plan — aggregates all captures + Close & Reflect
│   └── references.html        References & resource bank (WB pp. 71–74) + downloads
└── assets/
    ├── css/site.css           Fork of RAL site.css, re-accented
    ├── js/site.js             Fork of RAL site.js (namespace AFT.*, store keys aft.*)
    ├── img/                   Midjourney heroes & concept images (see companion .md)
    └── media/
        ├── transcript.txt     Activity 4.2 meeting transcript (downloadable + copyable)
        ├── retro-notes.txt    Activity 7.1 retrospective notes
        ├── strategy-doc.txt   Activity 7.2 long strategy document
        ├── dataset.csv        Activity 7.4 pro-forma dataset + template
        └── cheatsheets/       Optional: exported one-page JPG cheat sheets per module
```

**Main hub integration** (`AIM Interactive Workbooks/index.html`): add a fifth card —

- `data-course="ai-for-teamwork"`, title **AI for Teamwork**, tag `Teamwork · 8 Modules`
- Blurb: "Use AI as a practical teammate — clearer communication, better meetings, deeper analysis and safe, transparent adoption."
- Access code `team2026` → base64 `dGVhbTIwMjY=` (same client-side gate pattern)
- Card accent: **collaboration blue `#2D7DD2`** (coral, teal-dark, black and violet are taken by the other four courses). Confirm or swap — everything below references `--accent`.

**Guard snippet** on every course page (as RAL does): if `sessionStorage['aim_access_ai-for-teamwork'] !== 'granted'`, bounce to `../../index.html?course=ai-for-teamwork`.

---

## 3. Design system

Inherit the AIM tokens verbatim: teal `#00C0AF`, teal-light `#53DFCB`, teal-dark `#008D80`, cream `#F1EEDE`, coral `#DC5A46`, black/white, IBM Plex Sans + IBM Plex Sans Condensed. Course accent `#2D7DD2` for module chrome, tags and progress. Keep the RAL band system (`band white / tint / cream`), kicker/tag/section-lead typography, and the cream card-on-teal dashboard look so the five courses read as one family.

**Imagery:** photorealistic Hasselblad editorial photography (companion file `AI-for-Teamwork-Midjourney-Prompts.md`), consistent with the Additional Images set already used across the hub. Heroes 21:9 or 16:9 full-bleed with dark gradient overlay for title legibility; concept images 3:2 or 4:3 in two-col layouts; portrait anchors 4:5.

---

## 4. Shared component library (site.js)

Carried over from RAL:

- **Mode toggle** (Present / Self-paced), persisted (`aft.mode`)
- **Capture system** — every `[data-capture]` textarea/input autosaves to `localStorage['aft.capture']` with the "Saved ✓" micro-confirmation; all keys surface on `my-plan.html`
- **Subnav scroll-spy**, skip-link, reduced-motion handling, resume-last-module
- **Lightbox** for cheat sheets / large images

New for this course:

- **`copy-chip`** — copy-to-clipboard button on every prompt block and source text (with "Copied ✓" state). The single most-used component on the day.
- **`ai-gate`** — a panel with `data-gate="captureKey"` that renders dimmed/locked until the named human-first capture field is non-empty. Used in Activities 3.2, 4.3, 7.1.
- **`spectrum`** — draggable slider component (used for the team-collaboration spectrum, Activity 2.1) storing position + rationale.
- **`tabs`** — audience/variant tabs (Activity 4.2's three summaries; Activity 3.1's personas).
- **`sorter`** — click-to-classify or drag-to-column exercise (Known / Inferred / Missing in 4.1; sticky-note clustering in 7.1; workflow-step ordering in 2.x).
- **`reveal`** — staged scenario reveal (click-through beats for the cognitive-offloading and context-drift stories).
- **`timerchip`** — optional facilitator countdown chip on each activity header (visible in Present mode), preset from FG durations.
- **`checklist`** — persistent tick-lists (verification checklists, capstone combine checklist).
- **Print stylesheet** for `my-plan.html` → clean A4 "My Teamwork Plan" handout.

---

## 5. Course hub — `index.html`

Hero: 21:9 Hasselblad team image, title "AI for Teamwork", lead line from the course overview ("Use AI as a practical partner in communication, collaboration and day-to-day teamwork — while keeping meaning, tone and judgement human").

Sections:

1. **The human-centred loop** — a horizontal 5-step motif strip (Frame → Draft with AI → Verify → Rewrite → Check impact) that recurs in every module; clicking a step shows a one-line definition. This is the course's equivalent of RAL's "AIRSPACE operating model" band.
2. **Course map** — 8 module cards (number, title, one-liner, est. time, progress dot fed from capture keys) + utility cards for Welcome, How to use, My Teamwork Plan, References.
3. **Resume band** — "Pick up where you left off" using `aft.last`.

---

## 6. Module-by-module plan

Every module page follows the RAL skeleton: full-bleed hero (Hasselblad image, module number kicker, title, duration chip) → subnav → teaching bands → activity blocks (tag `ACTIVITY`, aim, steps, capture fields, copy-chips, discussion questions in Present mode) → **Key takeaways** band (from FG debriefs) → prev/next footer nav.

---

### Welcome — `welcome.html`  *(FG Section 1 · WB pp. 5–12 · Slides 1–9 · ~40 min)*

**Purpose:** orient, get everyone's LLM working, anchor the day on a real challenge.

- **Hero:** warm arrival-at-work team image. Learning outcomes as six tap-to-expand cards (LO1–LO6 from FG p.5).
- **"Ten things you can do with AI to improve your teamwork"** (WB p.6) as a 10-tile grid — each tile links to the module where it's taught. Doubles as a visual course map.
- **Choosing your LLM / assumed knowledge** (WB p.8): compact tool table (Claude / ChatGPT / Copilot / Gemini), note that any current LLM works.
- **"A note on agents"** callout (WB p.8): styled aside — *this course is generative-AI-focused; agentic AI is post-course reading* — with a soft cross-link to the Designing Workflows for Agentic AI course card. Directly answers the FG's flagged "why aren't we using agents?" question.
- **Activity 1.1 — Icebreaker** (8 min): first-prompt exercise with copy-chip; capture: `a11_observation` ("What surprised you? What would you verify?"). Discussion questions behind a Present-mode disclosure.
- **Activity 1.2 — Your teamwork challenge** (8 min): single prominent capture `a12_challenge` — "One specific teamwork challenge you want AI to improve." Marked with a pin icon and the note *"This follows you through the whole day — it returns in Module 8."* This key is re-displayed read-only at the top of Modules 3–8 and seeds the Action Plan.

### How to use — `how-to-use.html`

Mirror of RAL's how-to-use: Present vs Self-paced explanation, autosave/localStorage caveat ("your notes live in this browser on this device"), copy-chip demo, privacy note (don't paste real names/confidential data into public LLMs — echoes FG safeguards), facilitator contact line.

---

### Module 1 — Team Types & How AI Can Help  *(FG Section 2 first half · WB pp. 13–20 · Slides 8–10 + 11 · ~35 min)*

**Purpose:** identify your team's collaboration context and where AI genuinely helps it.

- **Teaching band: Team types.** Interactive spectrum graphic — *independent → complementary → tightly coupled* — with hover/tap cards describing each context, its communication needs, and its characteristic failure modes (WB pp. 13–15).
- **Teaching band: Where AI supports each context** (WB pp. 15–20): three-column matrix (team type × AI support patterns: clarity, coordination, load-reduction, inclusion), built as flip-cards so it stays scannable in Present mode.
- **Activity 2.1 — Where do my team(s) sit?** (8 min): the `spectrum` slider — drag your team onto the spectrum, capture `a21_position` + `a21_rationale` ("why this position is the best fit"). Debrief points (context shapes needs; outputs still need review) as takeaway chips.
- **Key takeaways** band.
- **Media:** hero (three team types triptych feel) + one concept image per team type.

### Module 2 — Risks & the Human-Centred AI Workflow  *(FG Section 2 second half · WB pp. 21–24 · Slides 11–20 · ~55 min)*

**Purpose:** the risk literacy + the workflow that the whole day depends on.

- **Teaching band: Benefits and risks.** Two `reveal` scenario walk-throughs, straight from the slides:
  - **Cognitive offloading** ("Your brain… writing their own content afterward" beat) — staged reveal of a team member who stops thinking; ends on the slide line *"AI can support teamwork, but teams must stay cognitively engaged."*
  - **Context drift** — a message passes through three AI rewrites; each reveal shows what was subtly changed or omitted; participants click the drifted phrases (spot-the-drift interaction).
- **Hallucination band:** short interactive — a plausible AI summary with three invented details; participants tap what they'd verify before trusting it. Instant feedback per tap.
- **Teaching band: The Ethical, Human-Centric AI Workflow** (WB pp. 21–24). The centrepiece: an interactive loop diagram (Frame → Draft with AI → **Verify** → **Rewrite in your own words** → **Check impact/hand-off**) with click-through step cards. Also rendered as the persistent mini-motif used across all later modules.
- **Activity 2.2 — Discuss the Ethical AI-human loop** (10 min): scenario card + "where does the loop break?" — participants mark the broken step on the loop diagram; capture `a22_break` + `a22_note`. FG facilitation cue (keep on human checks, not scenario details) shown in Present mode only.
- **Activity 2.3 — Practice the loop: synthesise our work** (25 min): Team A / Team B split panel. Team A panel: the "dump and summarise" prompt with copy-chip. Team B panel: the human-centric workflow steps as a `checklist`. Compare band with capture `a23_diverge` ("where did outputs diverge?"). FTF/online run notes (breakout rooms, screen-share caveat from FG) in Present mode.
- **Key takeaways:** *process drives quality; review even when output looks complete; rewriting builds retention.*

### Module 3 — Better-Prepared Attendees  *(FG Section 3 · WB pp. 25–36 · Slides 21–27 · ~70 min)*

**Purpose:** adapt communication for real, diverse humans without losing meaning.

- **Teaching bands:** high-performing teams are high-performance communicators; why communication needs differ (styles, processing, neurodiversity, language, workload); using AI to adapt style; **safeguards** (WB p.27) as a highlighted checklist card — meaning stays human-owned.
- **Activity 3.1 — Adapting messages for different communication styles** (25 min): persona `tabs` — the provided fictional personas (WB pp. 28–32), each with a card (context, preferences, what lands badly). Workflow: pick persona → copy base message chip → adapt via LLM → paste adapted versions into per-persona captures `a31_<persona>`. Guardrails surfaced as inline warnings, from the FG: *personas must not be real individuals; change structure/tone, not substance.* Compare view shows saved versions side-by-side.
- **Wellbeing checks teaching band** (WB p.33, slide 26) — signalling care, not solving problems.
- **Activity 3.2 — Inclusive team wellbeing check-in** (20 min, *optional — assess for time*, flagged with an "Optional" tag as the FG instructs): **`ai-gate` in action** — Step 1 capture `a32_handwritten` ("Handwrite your check-in first — something you would genuinely send") must have content before Step 2 (AI refinement panel with prompt chip) unlocks. Final capture `a32_final` + a "still sounds like me?" self-check toggle. Redirect cue (not performance management / HR policy) in Present mode.
- **Key takeaways:** clarity is situational; AI accelerates comparison; authorship stays human.

### Module 4 — Optimise Time Together  *(FG Section 4 · WB pp. 37–47 · Slides 28–34 · ~50 min)*

**Purpose:** better meetings before, during and after — and AI as thought partner.

- **Teaching bands:** why optimising meetings empowers teams; why meetings miss; preparing with AI (the **knowledge file** as a living artefact — WB pp. 38–42).
- **Activity 4.1 — Preparing for and optimising a meeting** (25 min): the deliberately ambiguous scenario (copy-chip). Core interaction: the **Known / Inferred / Missing `sorter`** — drag scenario statements into three columns before prompting (enforces the FG's "separate what is known, inferred, missing"). Then knowledge-file builder captures (`a41_purpose`, `a41_outcomes`, `a41_knowledge`) and the manager email draft `a41_email` with the FG tone cue (*invite confirmation, don't seek approval*) as an inline hint.
- **Activity 4.2 — Transcript → useful summaries** (10 min): transcript from `assets/media/transcript.txt` (download + copy-chip). Three audience `tabs` — Exec / Team / Absent colleague — each with capture and a per-tab **validation `checklist`**: invented names? invented decisions? invented due dates? implied intent? (straight from the FG watch-fors).
- **AI as thought partner band** (slide 33).
- **Activity 4.3 — Challenging assumptions** (15 min): `ai-gate` again — capture `a43_conclusion` ("your recommendation, before AI") unlocks the challenge-prompt panel. Then an assumption log: rows of {assumption, AI's challenge, your verdict: accept / reject / needs evidence} stored as `a43_log`. The verdict toggle operationalises the FG cue *"redirect if teams accept AI feedback without disagreement."*
- **Key takeaways.**

### Module 5 — Deeper Analysis & Thought Partners  *(FG Section 5 · WB pp. 48–53 · Slides 35–40 · ~35 min)*

**Purpose:** widen analytical perspective with structured frameworks; use AI transparently.

- **Teaching band: why teams struggle with analysis; structured thinking frameworks** (WB pp. 48–51): interactive **Six Thinking Hats** selector (six tappable hat cards, each with its lens + an AI prompt stem, copy-chip per hat) and a **DISC** quadrant graphic with hover descriptions.
- **Activity 5.1 — AI for balanced thinking** (10 min): scenario + framework picker (choose hat/lens) → prompt chip parameterised by choice → capture `a51_gaps` ("gaps and blind spots surfaced — AI must surface gaps, not resolve them"). Convergence warning styled as a coral callout.
- **Teaching band: AI use and transparency; risks of non-transparent use** (WB pp. 52–53, slides 38–39).
- **Activity 5.2 — AI transparency discussion** (10 min): three discussion prompts as cards; capture `a52_norm` — "One thing that would make AI transparency feel normal and low-risk in my team." (This capture feeds the Action Plan's team-norms line.)
- **Key takeaways.**

### Module 6 — Change Management of AI Adoption — Capstone  *(FG Section 6 + Appendix · WB pp. 54–61 · Slides 41–44 · ~45 min)*

**Purpose:** the capstone — everything so far applied to one complex case, in teams.

- **Teaching band: change management concepts** (WB pp. 54–55): three framework explainers as expandable cards — **Change Personas** (Pioneers / Pragmatists / Sceptics / Traditionalists), **ADKAR** (five-step chevron), **Kotter's 8 Steps** (numbered ring/ladder).
- **Case band:** *Hospital workforce and timekeeping reform* (WB pp. 57–61) — full case text on-page with copy-chip and a "what the case states vs what you propose" reminder strip (the FG's anti-hallucination cue).
- **Activity 6.1 — Capstone** (30 min, `timerchip` prominent): **team workspace** panel — select your team (A–E) and assigned framework; the page then shows: framework recap card, step-by-step working captures (`a61_team`, `a61_framework`, `a61_draft`, `a61_final`), and a timebox bar (draft → tighten → share-back, per FG). **Combine step** panel with delivery-mode instructions (FTF: email-to-facilitator method; Online: paste-labelled-into-chat), and the **whole-group synthesis `checklist`** from the FG appendix: contradictions · tone inconsistencies · missing nuance · hallucinations · misapplied frameworks.
- **Facilitator strip (Present mode only):** the appendix coaching prompts — "What is the AI missing?" / "What needs human judgement here?" / "Does this align with your framework?" — plus the cognitive-offloading watch-cue.
- **Key takeaways:** *parallel frameworks surface blind spots; contradictions are signal; combining flattens nuance unless humans check.*

### Module 7 — Other Use Cases for AI  *(FG Section 7 · WB pp. 62–67 · Slides 45–52 · ~30 min)*

**Purpose:** four fast, immediately-reusable patterns. Built as four compact activity blocks on one page with a sticky in-page subnav.

- **7.1 Retrospectives** (8 min): notes file from `assets/media/retro-notes.txt`; **sticky-note clustering `sorter`** (drag raw notes into theme columns) before the AI clustering prompt; validation gate: "check each insight against the original notes" `checklist`; capture `a71_insight` — one insight *written in your own words* (per FG). Upload-help hint (participants may need help attaching files to their LLM — FG cue).
- **7.2 Summarise & restructure a long strategy document** (5 min, *optional tag*): structure-first pattern — define your headings *before* prompting (capture `a72_structure`), then the summarise chip. Debrief line: *instruction design beats model capability.*
- **7.3 Tone transformation** (8 min): before/after split panel; source text chip; capture `a73_output`; inline warning: *tone changes can weaken precision or obligations — check what softened.*
- **7.4 Populate a template from a dataset** (8 min): `dataset.csv` + template download; capture `a74_check` — "errors found on verification pass"; debrief: tight inputs and boundaries → reliability.
- **Key takeaways** band covering all four patterns.

### Module 8 — Next Week Action Plan  *(FG Section 8 · WB pp. 68–69 · Slide 53 · ~15 min)*

**Purpose:** convert the day into one small, safe, real experiment.

- **Opening band:** re-display `a12_challenge` (read-only, editable via link back) — "This morning you named this challenge. Now design the experiment."
- **Activity 8.1 — Build your next-week action plan:** structured builder with five captures:
  `a81_action` (small enough to trial in one week) · `a81_workflow` (where AI acts vs where human verifies/rewrites — rendered against the loop motif) · `a81_influence` (why this is within your personal influence) · `a81_success` (concrete success criteria — inline nudge rejects "better/clearer"-style vagueness with a gentle hint, per FG) · `a81_brief` (the one-paragraph briefing: *an experiment, not a permanent change*).
- **Commitment strip:** optional date field + "Add to calendar" .ics generator for a self-check-in one week out.
- **Key takeaways:** small experiments de-risk; visible criteria make learning real even if the experiment fails.

### My Teamwork Plan — `my-plan.html`  *(FG Section 9 · WB p. 70)*

The aggregator (RAL my-plan pattern):

- Pulls **every capture key** into a single structured page: challenge (1.2) → team context (2.1) → loop insights (2.2/2.3) → communication drafts (3.1/3.2) → meeting artefacts (4.1–4.3) → analysis gaps (5.1) → transparency norm (5.2) → capstone section (6.1) → use-case outputs (7.1–7.4) → the full action plan (8.1) front and centre.
- **Close & Reflect** block (Activity 9.1): three final captures — *one shift in my approach · the most usable practice next week · one risk I'm now alert to* (`a91_shift`, `a91_practice`, `a91_risk`).
- **Print / Save as PDF** button (print stylesheet → clean A4, AIM-branded header/footer) and **Copy all as text** chip (so participants can archive into their own notes/LLM).
- Empty-state hints ("You haven't completed Activity 4.1 yet — open Module 4") linking back, as RAL does.

### References — `references.html`

Port WB references (pp. 71–74) as a grouped, linked resource bank; add the appendix downloads (transcript, retro notes, strategy doc, dataset/template); optional cheat-sheet gallery with lightbox if/when one-page JPG cheat sheets are produced (candidates: The Human-Centred Loop · Team Types Map · Persona Adaptation Card · Known/Inferred/Missing · Six Hats × AI · Capstone Combine Checklist · The One-Week Experiment Canvas).

---

## 7. Capture key registry

`a11_observation, a12_challenge, a21_position, a21_rationale, a22_break, a22_note, a23_diverge, a31_<persona×4>, a32_handwritten, a32_final, a41_purpose, a41_outcomes, a41_knowledge, a41_email, a42_exec, a42_team, a42_absent, a43_conclusion, a43_log, a51_gaps, a52_norm, a61_team, a61_framework, a61_draft, a61_final, a71_insight, a72_structure, a73_output, a74_check, a81_action, a81_workflow, a81_influence, a81_success, a81_brief, a91_shift, a91_practice, a91_risk` — all namespaced under `localStorage['aft.capture']`.

## 8. Build order

1. **Scaffold** — fork RAL assets (css/js → AFT namespace, accent swap), index + welcome + how-to-use + guard snippet + hub card on main index. *(half day)*
2. **Component library** — copy-chip, ai-gate, spectrum, tabs, sorter, reveal, timerchip, checklist, print stylesheet. *(1 day)*
3. **Modules 1–2** (the conceptual core, most custom interactions). *(1 day)*
4. **Modules 3–5.** *(1 day)*
5. **Modules 6–8 + my-plan + references** + media files extracted from the WB appendix. *(1 day)*
6. **Imagery pass** — generate Midjourney set (companion file), select, compress to web-weight JPG (~200–350KB), drop into `assets/img/`. *(parallel)*
7. **QA:** every capture key round-trips to my-plan; gates unlock correctly; Present mode hides prose and shows facilitator cues; print output clean; mobile at 390px; localhost + file:// both work; access gate bounces correctly; nothing references real individuals; Zoom/FTF instructions match FG.

## 9. Open decisions for Rupert

1. Accent colour — proposed `#2D7DD2`; happy to run alternates.
2. Persona set for Activity 3.1 — lift the WB's provided personas verbatim, or refresh them (needs the exact persona text from WB pp. 28–32 during build).
3. Appendix source texts (transcript, retro notes, strategy doc, dataset) — extract from the WB appendix (pp. 75+) or supply the original files if they live elsewhere.
4. Cheat sheets — build the seven listed above as a follow-up pass (agentic-ai-style), or launch without.
5. Whether Activity 3.2 and 7.2 keep their "Optional" tags visible to participants or only in Present mode.
