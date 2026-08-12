# AI for Teamwork — Phased Build Plan (with final image set)

**Course folder:** `AIM Interactive Workbooks/courses/ai-for-teamwork/`
**Companion docs (in `docs/` inside this folder):** `AI-for-Teamwork-Interactive-Workbook-PLAN.md` (full module-by-module detail) · `AI-for-Teamwork-Midjourney-Prompts.md` (art direction / re-roll prompts)
**Image library:** 99 renamed photos already in place at `assets/media/pics/` — all filenames below are real files, verified against content.

Target folder structure at completion:

```
courses/ai-for-teamwork/
├── index.html
├── docs/                       (these three planning .md files)
├── pages/
│   ├── welcome.html  how-to-use.html
│   ├── module-1.html … module-8.html
│   ├── my-plan.html  references.html
└── assets/
    ├── css/site.css
    ├── js/site.js
    ├── img/aim-logo-white.png  aim-logo-blue.png   (copy from ../../Assets)
    └── media/
        ├── pics/               (99 images — DONE ✔)
        ├── transcript.txt  retro-notes.txt  strategy-doc.txt  dataset.csv
        └── cheatsheets/        (later pass, optional)
```

Image paths from pages: `../assets/media/pics/<name>.jpg` (from index.html: `assets/media/pics/<name>.jpg`).

---

## Phase 0 — Housekeeping & asset lock-off  *(~1 hour)*

1. Create `pages/`, `assets/css/`, `assets/js/`, `assets/img/`, `docs/`; copy the AIM logo PNGs into `assets/img/`.
2. **Pick hero variants.** 27 images have `-2`/`-3` alternates. Decide the "live" variant per slot (the unsuffixed file is the default; to swap, just rename your favourite to the base name). Slots with 3 candidates: `wel-hero-arrivals`, `wel-agents-note-closed-door`, `m3-wellbeing-handwritten-note`, `m5-sixhats-felt-hats`, `m6-hero-hospital-corridor`, `m6-capstone-five-teams`, `m6-frameworks-stepped-cards`, `m7-retro-sticky-clusters`.
3. **Fill the one gap:** `m1-coupled` (tightly coupled team type) has no image. Re-run the prompt from the Midjourney doc (§3, "m1-coupled") and save as `m1-coupled-huddle.jpg`. Until then Module 1 uses a two-image row instead of three.
4. Extract the four activity source texts from WB v3 appendix (pp. 75+) into `assets/media/` (transcript, retro notes, strategy doc, dataset+template). If the originals exist elsewhere, drop them in instead.
5. **Web-weight check:** all images are already 120–390KB — fine as-is; no recompression pass needed.

**Done when:** folder tree exists, logos copied, source texts in `assets/media/`, variant picks made (or consciously deferred).

---

## Phase 1 — Foundation: styles, behaviour, gates, hub  *(~half day)*

1. Fork `responsible-ai-leadership/assets/css/site.css` → re-token: course accent `--accent: #2D7DD2`, keep AIM teal/cream/coral family and IBM Plex stack.
2. Fork `site.js` → rename namespace `RAL` → `AFT`, storage keys `ral.*` → `aft.*`. Keep: mode toggle, capture autosave, scroll-spy, lightbox, resume-last, reduced-motion, skip-link.
3. **Main hub card** in `AIM Interactive Workbooks/index.html`: fifth card, tag `Teamwork · 8 Modules`, accent `#2D7DD2`, `data-course="ai-for-teamwork"`, code `team2026` (`dGVhbTIwMjY=`), URL `courses/ai-for-teamwork/index.html`.
4. Access-guard snippet on every course page (bounce to `../../index.html?course=ai-for-teamwork`).
5. **Course hub `index.html`** — build with:
   - Masthead: `hub-hero-team-discussion.jpg` (alt: `-2`), dark gradient overlay.
   - Human-centred loop band: `hub-loop-motif-handoff.jpg` as the band background (heavy overlay).
   - Course map: 8 module cards + 4 utility cards. Card art: `card-welcome-facilitator.jpg`, `card-myplan-flatlay.jpg`, `card-references-book-stack.jpg`; module cards can reuse their module heroes cropped 4:3 via CSS `object-fit`.
   - Resume band: `hub-resume-desk-coffee.jpg`.

**Done when:** hub gate works end-to-end (code entry → course hub renders with images → refresh keeps session), and a stub page inherits chrome correctly.

---

## Phase 2 — Component library  *(~1 day)*

Build into `site.js`/`site.css`, each demo'd on a hidden `/pages/_kitchen-sink.html`:

| Component | Used by |
|---|---|
| `copy-chip` (copy prompt/source, "Copied ✓") | every activity |
| `ai-gate` (panel locked until named capture has content) | 3.2, 4.3, 7.1 |
| `spectrum` (draggable position + rationale) | 2.1 |
| `tabs` (audience/persona variants) | 3.1, 4.2 |
| `sorter` (click-to-classify columns) | 4.1, 7.1, 2.x ordering |
| `reveal` (staged scenario beats) | offloading + drift stories |
| `timerchip` (Present-mode countdown, FG durations) | all activities |
| `checklist` (persistent tick lists) | 2.3, 4.2, 6.1 |
| print stylesheet (A4, AIM header/footer) | my-plan |

**Done when:** kitchen-sink page exercises every component with capture round-trip verified in localStorage.

---

## Phase 3 — Welcome & How-to-use  *(~half day)*

**welcome.html** (FG §1 · WB pp. 5–12):

| Section | Image |
|---|---|
| Hero | `wel-hero-arrivals.jpg` (alts `-2`, `-3`) |
| Ten things grid band | `wel-ten-things-whiteboard.jpg` (alt `-2`) |
| Activity 1.1 icebreaker | `wel-icebreaker-first-prompt.jpg` (alt `-2`, 4:5 portrait, right-aligned) |
| Activity 1.2 challenge anchor | `wel-challenge-writing.jpg` (alt `-2`) |
| "A note on agents" callout | `wel-agents-note-closed-door.jpg` (alts `-2`, `-3`) |

Captures: `a11_observation`, `a12_challenge` (the pinned all-day key).

**how-to-use.html**: no hero needed (text page) — or reuse `hub-loop-motif-handoff-2.jpg` as a slim banner. Present/Self-paced explainer, autosave caveat, copy-chip demo, privacy note.

**Done when:** `a12_challenge` saves and re-renders read-only on a stub module page.

---

## Phase 4 — Modules 1 & 2 (the conceptual core)  *(~1 day)*

**module-1.html** — Team Types & How AI Can Help:

| Section | Image |
|---|---|
| Hero | `m1-hero-three-team-zones.jpg` (alt `-2`) |
| Independent type | `m1-independent-focus.jpg` (alt `-2`) |
| Complementary type | `m1-complementary-tablet-pass.jpg` (alt `-2`) |
| Tightly coupled type | *gap — `m1-coupled-huddle.jpg` when generated* |
| Activity 2.1 spectrum | `m1-spectrum-glass-wall.jpg` (alt `-2`) |

Interactions: team-type flip-cards, AI-support matrix, `spectrum` slider (`a21_*`).

**module-2.html** — Risks & the Human-Centred AI Workflow:

| Section | Image |
|---|---|
| Hero | `m2-hero-sceptical-review.jpg` (alt `-2`) |
| Cognitive offloading reveal | `m2-offloading-disengaged.jpg` |
| Context drift reveal | `m2-drift-fading-copies.jpg` (alt `-2`) |
| Hallucination spot-check | `m2-hallucination-highlighter.jpg` (alt `-2`) |
| Workflow loop band | `m2-loop-overhead-process.jpg` |
| Activity 2.3 Team A/B | `m2-teamab-compare.jpg` |

Interactions: two `reveal` stories, tap-to-flag hallucination exercise, interactive loop diagram (also exported as the mini-motif partial reused on every later page), Activity 2.2 break-the-loop marker (`a22_*`), Activity 2.3 split panel + compare capture (`a23_diverge`).

**Done when:** the loop motif partial renders on both pages from one shared snippet, and all M1–M2 captures appear in localStorage.

---

## Phase 5 — Modules 3 & 4  *(~1 day)*

**module-3.html** — Better-Prepared Attendees:

| Section | Image |
|---|---|
| Hero | `m3-hero-four-communicators.jpg` (alt `-2`) |
| Why needs differ | `m3-styles-two-phones.jpg` |
| Persona tabs (4:5 portraits) | `m3-persona-detail-focused.jpg` · `m3-persona-big-picture.jpg` (alt `-2`) · `m3-persona-reflective.jpg` (alt `-2`) · `m3-persona-multilingual.jpg` |
| Wellbeing band + Activity 3.2 | `m3-wellbeing-handwritten-note.jpg` (alts `-2`, `-3`) |

Interactions: persona `tabs` with per-persona captures (`a31_*`), guardrail callouts, **`ai-gate`** on 3.2 (`a32_handwritten` → unlock AI panel → `a32_final`). Persona portraits pair with the WB's persona text (lift from WB pp. 28–32 during build).

**module-4.html** — Optimise Time Together:

| Section | Image |
|---|---|
| Hero | `m4-hero-golden-hour-meeting.jpg` |
| Why meetings miss | `m4-badmeeting-drifting.jpg` (alt `-2`) |
| Activity 4.1 knowledge file | `m4-knowledgefile-sorting-cards.jpg` |
| Activity 4.2 transcript | `m4-transcript-annotation.jpg` |
| Activity 4.3 assumptions | `m4-assumptions-disagreement.jpg` (alt `-2`) |

Interactions: Known/Inferred/Missing `sorter`, knowledge-file captures (`a41_*`), transcript audience `tabs` + validation `checklist` (`a42_*`), `ai-gate` on 4.3 + assumption log (`a43_*`). Transcript file wired to copy-chip + download.

**Done when:** both gates enforce human-first input and 4.2's three tabs each hold independent saved text.

---

## Phase 6 — Modules 5 & 6  *(~1 day)*

**module-5.html** — Deeper Analysis & Thought Partners:

| Section | Image |
|---|---|
| Hero | `m5-hero-strategist-glass-wall.jpg` (alt `-2`) |
| Six Thinking Hats band | `m5-sixhats-felt-hats.jpg` (alts `-2`, `-3`) |
| DISC band | `m5-disc-four-quadrant.jpg` (alt `-2`) |
| Activity 5.1 | `m5-balanced-weighing-inputs.jpg` (alt `-2`) |
| Transparency band | `m5-transparency-open-laptop.jpg` (alt `-2`) |

Interactions: hat selector with per-hat prompt chips, DISC hover quadrant, `a51_gaps`, `a52_norm` (feeds Action Plan).

**module-6.html** — Change Management capstone:

| Section | Image |
|---|---|
| Hero | `m6-hero-hospital-corridor.jpg` (alts `-2`, `-3`) |
| Change personas band | `m6-personas-four-reactions.jpg` (alt `-2`) |
| ADKAR/Kotter frameworks | `m6-frameworks-stepped-cards.jpg` (alts `-2`, `-3`) |
| Activity 6.1 team workspace | `m6-capstone-five-teams.jpg` (alts `-2`, `-3`) |
| Combine & synthesis step | `m6-combine-assembling-pages.jpg` |

Interactions: framework explainer cards, hospital case with copy-chip, team/framework picker + timeboxed captures (`a61_*`), FTF/online combine instructions, synthesis `checklist`, Present-mode facilitator coaching strip (FG appendix).

**Done when:** capstone workspace persists team + framework choice and the synthesis checklist survives reload.

---

## Phase 7 — Modules 7 & 8  *(~half day)*

**module-7.html** — Other Use Cases (four compact blocks):

| Block | Image |
|---|---|
| Hero | `m7-hero-days-artefacts.jpg` (alt `-2`) |
| 7.1 Retrospectives | `m7-retro-sticky-clusters.jpg` (alts `-2`, `-3`) |
| 7.2 Summarise | `m7-summarise-thick-vs-page.jpg` (alt `-2`) |
| 7.3 Tone | `m7-tone-two-letters.jpg` |
| 7.4 Template | `m7-template-forms-check.jpg` |

Interactions: sticky-note `sorter` + validation gate (`a71_insight`), structure-first capture (`a72_structure`), before/after panel (`a73_output`), verification capture (`a74_check`). Wire retro-notes/strategy-doc/dataset downloads.

**module-8.html** — Next Week Action Plan:

| Section | Image |
|---|---|
| Hero | `m8-hero-evening-plan.jpg` (alt `-2`) |
| Activity 8.1 | `m8-experiment-pinboard.jpg` (alt `-2`) |

Interactions: read-only replay of `a12_challenge`, five-field builder (`a81_*`) with vague-success-criteria nudge, optional .ics generator.

**Done when:** Module 8 renders the morning's challenge and all `a81_*` fields persist.

---

## Phase 8 — My Plan, References, media polish  *(~half day)*

**my-plan.html**:

| Section | Image |
|---|---|
| Hero | `myplan-hero-overhead-desk.jpg` |
| Close & Reflect band | `close-reflect-leaving.jpg` (alt `-2`) |

Aggregates every capture key in course order (registry in the module-detail plan §7), Close & Reflect captures (`a91_*`), Print/Save-as-PDF via the print stylesheet, Copy-all-as-text chip, empty-state links back to modules.

**references.html**: hero `ref-hero-reading-corner.jpg` (alt `-2`); port WB references (pp. 71–74) grouped and linked; downloads block for the four source files; placeholder cheat-sheet gallery (lightbox-ready) for a later pass.

**Done when:** a full dry-run through all activities produces a complete, printable A4 plan with no missing sections.

---

## Phase 9 — QA & launch  *(~half day)*

1. **Capture audit:** every key in the registry round-trips to my-plan; gates unlock correctly; mode toggle hides prose in Present and shows facilitator cues/timers.
2. **Image audit:** every `<img>` resolves (no 404s), alt text on all, hero overlays keep titles legible, portraits not distorted by `object-fit`.
3. **Cross-context:** works from `file://` and localhost; Safari + Chrome; 390px mobile; print output clean; reduced-motion respected.
4. **Access:** hub gate bounce, `team2026` code, sessionStorage grant, deep-link guard on all 12 pages.
5. **Content:** matches FG v3 timings and cues; no real individuals named; optional tags on 3.2/7.2; Zoom screen-share caveat present in 2.3.
6. Ship: zip a dated backup of the whole `ai-for-teamwork/` folder (matching your `.bak` convention on other courses).

---

## Effort summary

| Phase | Scope | Est. |
|---|---|---|
| 0 | Housekeeping, variant picks, source texts | 1 h |
| 1 | CSS/JS fork, hub card, gate, course hub | 0.5 d |
| 2 | Component library + kitchen sink | 1 d |
| 3 | Welcome + How-to-use | 0.5 d |
| 4 | Modules 1–2 | 1 d |
| 5 | Modules 3–4 | 1 d |
| 6 | Modules 5–6 | 1 d |
| 7 | Modules 7–8 | 0.5 d |
| 8 | My Plan + References | 0.5 d |
| 9 | QA + launch | 0.5 d |
| | **Total** | **≈ 6.5 days** (compressible — phases 4–7 parallelise well) |

Every image slot in phases 1–8 references a file that exists today in `assets/media/pics/`; the single outstanding asset is `m1-coupled-huddle.jpg` (Phase 0, step 3).
