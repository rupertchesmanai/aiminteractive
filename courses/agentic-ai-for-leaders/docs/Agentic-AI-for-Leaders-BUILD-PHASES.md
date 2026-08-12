# Agentic AI for Leaders — Interactive Workbook Build Phases

**Version:** 1.0 · 11 August 2026
**Spec:** `Agentic-AI-for-Leaders-Interactive-Workbook-PLAN.md` (the PLAN) — §7 page specs are canon; the FG/Activity WB/Concepts WB PDFs are the content source of truth.
**Assets:** all 59 images/video already in `assets/pics/` with final HTML-safe names (every §A–K prompt covered; `-2` suffix = alternate take; `hub-loop-ops-heartbeat.mp4` already animated).
**Total estimate:** ~12–14 working sessions across 12 phases. Each phase ends with a device commit and a working site — never a broken in-between state.

---

## Working rules (every phase)

1. **Fidelity first.** Module names, activity numbers/names, case facts (87 / 82 / 9%), frameworks and artefact names verbatim per PLAN §7. When writing section prose, paraphrase the Concepts WB faithfully — never invent course content.
2. **One phase = one commit set.** Before overwriting any previously shipped file, keep `<file>.pre-p<N>.bak` beside it (house convention). Prune baks only when Rupert signs off.
3. **Single sources of truth.** All capture keys live in one `SCHEMA`/`TOTALS` block in `site.js`; the artefact→keys mapping lives only in `evidence.js` (`ARTEFACTS` array). Any phase that adds keys updates both in the same phase.
4. **Decide-before-reveal everywhere.** No reveal button enabled until its required captures are non-empty; state survives refresh.
5. **Test before commit.** Headless pass per phase: pre-seed `sessionStorage['aim_access_agentic-ai-for-leaders']='granted'` (or the gate redirect-loops); linkedom quirks — drive `<select>` via the `selected` attribute, guard `input.select()`.
6. **Page weight.** Pages stay small (RAIL-style ~40–60KB HTML); images referenced, not embedded. Target ≤400KB per JPG (compress the few over — `m3-eight-cards` 375KB ok, `hub-loop-warehouse-ballet` 430KB needs a squeeze).

**Definition of Done — every module page:** hero + transition breadcrumb + guiding question · all §7 sections present in course order · all activities numbered/named exactly, interactive, captured · artefact card assembles live + Download PDF works · key takeaways + closing question + next-module transition · cheat-sheet slot present (empty) · self-paced/present modes both render · keyboard + reduced-motion pass · progress dots update on hub · workflow chip shows `me.workflow`.

---

## Phase 0 — Scaffold & gate *(½ session)*

Create the tree (`index.html`, `assets/css|js`, `pages/*` stubs with correct titles, transitions and gate scripts; copy AIM logo PNGs). Add the sixth card to the **top-level hub** `AIM Interactive Workbooks/index.html` (back it up first as `index.html.pre-aal.bak`): slug `agentic-ai-for-leaders`, tag *Leadership · Advanced · 8 Modules*, accent `#B53D2C`, code `leaders2026` → `bGVhZGVyczIwMjY=`.

**Exit:** wrong code shakes, right code grants and opens; every stub reachable and gated; bounce-back auto-opens the modal with `?course=agentic-ai-for-leaders`.
**Rupert gate:** approve the access code before it's shared anywhere.

## Phase 1 — Design system & capture engine *(1 session)*

`site.css`: tokens (ink-and-coral-led variant of the RAIL palette), chrome, hero, cards, activity blocks, artefact panel, savebar, chips, print skeleton, focus/reduced-motion/skip-link rules. `site.js`: `aal.capture` autosave (debounced, savebar indicator), restore-on-load, `aal.last` resume, `TOTALS` + progress helpers, mode toggle, day filter, `me.workflow` header chip, glossary drawer shell, JSON download/load, reset-with-confirm.

**Exit:** a test page round-trips: type → refresh → restored; export → reset → import → restored; progress helper returns correct fractions from a seeded fixture.

## Phase 2 — The hub *(1 session)*

Full `index.html` per PLAN §5: hero (still `hub-hero-decision-room.jpg` for now, veil + phrases + meta + resume), **Leadership Arc strip** (8 tiles, hover = module question, click = deep link), **Evidence Pack band** (8 artefact slots lit from capture), quote band (`hub-arc-corridor.jpg` backdrop), course map (Day 1/Day 2 bands, full card data from PLAN §7, hover-reveal sections/activities, progress dots, M4 "flexible" chip), minor cards, **Day 1 Close band** with download button, hidden `.extras` band, footer.

**Exit:** with a seeded fixture, cards show In progress/Done correctly; day filter and resume work; empty state looks intentional.
**Rupert gate:** look-and-feel review — this phase sets the visual language.

## Phase 3 — Support pages *(1 session)*

`welcome.html` (hero `welcome-threshold.jpg`; RAIL-foundations strip with links; is/is-not panel; two-workbooks explainer; pulse sliders → `wel.pulse.*`). `how-to-use.html` (modes, autosave, cross-device JSON, PDF mapping, privacy, print). `foundations.html` (hero `foundations-gym.jpg`; five concept cards with the FG's canonical anchors; replayable Spot-the-Difference drill — 4 workbook scenarios + ~8 new in identical style, score + streak; agents-vs-agentic and capability-vs-authority flip cards; `found.*` keys). `references.html` (hero `references-library.jpg`; pull real URLs from the Concepts WB).

**Exit:** drill replayable with shuffle; glossary drawer reachable from every page; pulse values later readable by M8.

## Phase 4 — Module template + Module 1 *(1–1.5 sessions)*

Build the module-page skeleton once, properly (hero block, section pattern, activity block, artefact panel, print doc) — then Module 1 complete per PLAN §7: three-agent judgement cards with locked reveal, three-lane participation explorer (with `m1-train-vs-chef.jpg`), Plan/Act/Adapt triptych, Activity 1.2 classifier, **Agency Discovery Canvas** (writes `me.workflow`, `me.workflowPath`, `me.workflowLive`), accountability panel, artefact + PDF. Images: `m1-hero-first-light`, `m1-three-agents`, `m1-canvas-mapping`.

**Exit:** full DoD; the workflow name entered here appears in the chip on the hub and stub pages; artefact PDF prints clean.
**Rupert gate:** module-pattern review — every later module reuses this skeleton.

## Phase 5 — Modules 2 & 3 *(1.5–2 sessions)*

**M2:** value-question pre-flight, case dossier (Mono briefing style), Activity 2.1 four-step commit-then-poll flow, Four Lenses cards (`m2-four-lenses.jpg`), 2.2 re-decision with delta tracking, 2.3 own-workflow, defensibility meter on the Snapshot artefact. Images: `m2-hero-the-call`, `m2-split-room`, `m2-tradeoff-scales`.
**M3:** authority spectrum slider, **eight-decision sort board** (drag + tap-to-cycle + full keyboard), worked-example study panel, boundary spec builder, three timed pressure cards with post-commit sample answers, Activity 3.4 sentence-builder. Images: `m3-hero-the-line`, `m3-eight-cards`, `m3-pressure-doors`, `m3-smallest-task`.

**Exit:** DoD both; sort board keyboard-only pass; M2 delta ("you moved from Full to Partial") fires correctly.

## Phase 6 — Module 4 + Day 1 integration *(1 session)*

**M4:** regulator scenario with persistent 48:00 countdown motif, **decision log document** (extract the real log rows from the Activity WB pp.38–41 area during this phase), two-pass tag/flag review, gated reveal, three explanation-pitfall cards (`m4-mirror-answer.jpg`), four-panel visibility explorer, agent-type comparator (`m4-control-room-glass.jpg`), Activity 4.2 prioritised picker (max-3 must-haves) + 30-day commitment, Day 1 Summary band. Images: `m4-hero-audit-room`, `m4-log-magnified`. Day-filter-flexible flag per PLAN.
**Then the Day 1 integration pass:** play M1→M4 end-to-end as a student; check progress, resume, chip, download-state at the Day 1 Close band; fix friction found.

**Exit:** DoD; a complete Day-1 run produces four populated artefacts and a valid state file.

## Phase 7 — Modules 5 & 6 *(2 sessions)*

**M5:** Day-2 reframe with Day-1 evidence chips, radar-appearance strip, vendor proposal dossier (capture first-instinct before the automation-tension reveal), **seven-zone Embedding Lab** (`m5-seven-zones.jpg`), require/refuse builder (refusal line required), Four Criteria + weighting comparator + failure patterns, own-context transfer with verdict. Images: `m5-hero-committee`, `m5-bridge-inspection`, `m5-vote-no`.
**M6:** the **Failure Scenario Simulation** — role select, brief, 5-decision First Response with lock, Update One/Two injected on timers (extract the exact update texts from the locked deck/Activity WB this phase), final sixty-minutes-and-authority commitment, reveal, debrief prompts. Timers = pressure theatre with a no-timer accessibility toggle; sim state machine survives refresh mid-run. Four Elements cards, window comparator (`m6-window-clocks.jpg`), Activity 6.2 Escalation Design Map. Images: `m6-hero-first-hour`, `m6-stop-button`, `m6-authority-baton`.

**Exit:** DoD both; refresh mid-simulation resumes at the same step with commitments intact.

## Phase 8 — Modules 7 & 8 *(2 sessions)*

**M7:** slow-reveal twelve-months scenario, **cadence builder** (signal × interval × owner × trigger × action, "would this ever change a decision?" strike-through mechanic, required human-reliance fifth row), Four Signals + hidden-risk panel (`m7-empty-chair.jpg`), trigger ladder, Activity 7.2 + AI Thought Partner copy-buttons. Images: `m7-hero-lighthouse-keeper`, `m7-river-drift`, `m7-cadence-ritual`.
**M8:** animated worked-example table (`m8-evidence-chain.jpg`), **Reasoning Bridge** pulling the student's live capture beside each of the eight questions (gap chips for unanswered sources), **forced single decision** (`m8-four-doors.jpg`) + evidence chips + trigger, reveal, challenge cards (`m8-challenge-panel.jpg`), six-lens dial with the no-formula line, Organisational Shift, pulse-check replay, course close. Images: `m8-hero-the-stance`, `poster-course-a2` (spare).

**Exit:** DoD both; with a full Day-1+2 fixture the bridge shows real answers under every question; with a partial fixture, gaps render as findings, never as blanks.

## Phase 9 — The Evidence Pack *(1 session)*

`evidence.js` (`ARTEFACTS` array = the single artefact→keys mapping; hub band, chip and M8 bridge all consume it). `evidence-pack.html`: decision-chain visual (8 stations, completion states, inline artefact preview), full-pack typeset document view, **full-pack PDF export** (AIM-branded cover with workflow name + date), JSON export/import, reset. Hero: `evidence-pack-desk.jpg`.

**Exit:** full-fixture export = 8 complete artefacts in one clean PDF; partial-fixture export renders gaps as findings; import of an exported file reproduces the exact pack.

## Phase 10 — Hero loops & polish *(½–1 session)*

Animate the chosen hub loop (recommend **L3 warehouse-ballet** or **L1 autonomous-port**; `hub-loop-ops-heartbeat.mp4` already exists and can serve M4/M7 or the Evidence Pack band). Wire `<video autoplay muted loop playsinline>` with poster + reduced-motion play-on-demand button (RAIL pattern). Compress any JPG >400KB. Add favicon, `<meta>` description and OG tags (`og-share.jpg`). Optional: quiet loop behind the quote band.

**Exit:** hero video ≤6MB, poster-first paint, reduced-motion honoured.

## Phase 11 — QA & launch *(1 session)*

Run the full PLAN §11 checklist plus: fidelity spot-check of every module against the FG/Activity WB (names, numbers, case facts) · complete two-day play-through on desktop + iPad-width + phone-width · cross-browser (Safari/Chrome/Firefox) · keyboard-only run of sort board, simulation and decision cards · print pass on all nine PDFs · headless suite green · file:// limitation documented in how-to-use. Then launch: confirm hosting location, un-hide the hub card, hand the `leaders2026` code to AIM.

**Rupert gate:** pre-launch sign-off + where this will be hosted (relative links assume the whole `AIM Interactive Workbooks` folder ships together).

## Phase 12 — Extras *(separate effort, post-launch)*

Per PLAN §10: cheat-sheet posters (reuse the 31-poster pipeline; candidate list in PLAN) + gallery card + zip · per-module games (2/module, 16 total, candidates listed) + Capstone Gauntlet finale · blank artefact templates + AI Thought Partner prompt pack downloads. Populate the reserved `.extras` band.

---

## Session map

| Session | Phases | Ships |
|---|---|---|
| 1 | 0 + start 1 | Gated skeleton, hub card, tokens |
| 2 | 1 + start 2 | Capture engine proven |
| 3 | 2 | Hub complete → **look & feel review** |
| 4 | 3 | Welcome, how-to-use, Foundations Gym, references |
| 5 | 4 | Module template + M1 → **pattern review** |
| 6–7 | 5 | M2, M3 |
| 8 | 6 | M4 + Day 1 plays end-to-end |
| 9–10 | 7 | M5, M6 simulation |
| 11–12 | 8 | M7, M8 decision room |
| 13 | 9 | Evidence Pack + exports |
| 14 | 10 + 11 | Loops, polish, QA → **launch sign-off** |

## What I need from Rupert along the way

Access-code approval (Phase 0) · look-and-feel sign-off (Phase 2) · module-pattern sign-off (Phase 4) · a look at the M6 simulation and M8 decision room when they land (Phases 7–8, the two showpieces) · hosting confirmation + launch sign-off (Phase 11) · loop-animation renders if you'd rather generate the hero video in Midjourney yourself (Phase 10 — otherwise I'll brief the clips and you run them).

## Risks & mitigations

- **Content drift from the printed materials** → §7 of the PLAN was built from the PDFs; Phase 11 re-verifies every page against them; the three text extractions (decision log, M6 updates, M5 sample answers) happen from source in-phase, never from memory.
- **Two-day/two-device state loss** → JSON export pushed hard at Day 1 Close; tested every integration pass.
- **Big interactives ballooning pages** → M6 sim and M8 bridge budgeted their own sessions; state machines kept in page-local script, shared engine stays lean.
- **file:// hosting quirks** (localStorage, video) → documented; recommend hosted delivery as with RAIL.
- **Midjourney text artefacts in images** → already-generated set checked at wiring time; any visible garbled text gets cropped, blurred or re-rolled per prompt-doc guidance.
