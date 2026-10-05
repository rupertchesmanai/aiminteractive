# Prompt it. Build it.
### AIM Facilitator Community of Practice v2 — rewrite plan

**Version:** 2.0 · 5 October 2026 (for delivery 6 October)
**Supersedes:** `AIM-Facilitator-CoP-PLAN.md` (v1, "Build it. Light it. Show it.")
**Delivery mode change:** v1 was hands-on with laptops open. **v2 is shown on screen only** — Rupert drives, the room watches. The page is a presentation surface first and a take-home reference second.
**Page:** `courses/community-of-practice/index.html` — stays a single file. v1 is kept beside it as `index.html.pre-v2.bak`.

---

## 1 · The spine

Two sections risk landing as a theory half and a show-and-tell half. One sentence holds them together, said at the top and paid off at the end:

> **Section 2 is Section 1 at scale.** A 400-line build plan is just an Act–Explain–Please brief that respects the context window and doesn't trust the model to know what it can't.

| Section | What they see | What changes for them |
|---|---|---|
| **1 · AI Basics** | Three ideas, each with one live demo on screen | *I understand why it behaves the way it does* |
| **2 · How the Workbook Got Built** | The actual pipeline behind the workbook they're looking at | *I can see the method — and it's the same three ideas* |

**Working title:** *Prompt it. Build it.* ✦ · Alternates: *Three Ideas and a Workbook* · *From Brief to Build*

---

## 2 · On-screen design rules

Because this is projected and zoomed, not clicked by participants:

1. **Every heading is a zoom target.** Numbered, uppercase chapter marker above it (`SECTION 1 · 02`), heading set in Plex Sans Condensed at ≥56px in Present mode, always starting at the top of a full-height band. Zooming into any heading gives a clean "slide".
2. **Present mode is the default** for this page (v1 defaulted to Self-paced). Body prose collapses to one lede line per band; full prose returns in Self-paced for anyone reading at home.
3. **One idea per band, one demo per band.** No band scrolls more than one screen at 1280×720.
4. **A sticky chapter rail** down the left (desktop) listing the eight bands, so the room always knows where we are. Replaces v1's three-station header nav.
5. **All captures become facilitator-driven.** Fields stay (so the page still works as a take-home), but nothing in the run sheet depends on the room typing.
6. **Keep-this footer** carries everything they'll want afterwards: the AEP card, the cutoff table, the pipeline diagram, the prompt library link.

---

## 3 · Page structure (the eight bands)

```
00  Cold open         — hero + the spine sentence + what the next 45 minutes are
─── SECTION 1 · AI BASICS ────────────────────────────────────────────
01  Act · Explain · Please   — the AEP Brief Builder, driven live
02  Context Windows          — NEW: the Context Meter
03  Cutoff Dates & Training  — the Model Cutoff Clock (ported from AI Essentials M1)
─── SECTION 2 · HOW THE WORKBOOK GOT BUILT ────────────────────────────
04  Source → Plan            — the PDFs in, the PLAN.md out
05  Plan → Pages             — build phases, one phase one commit, tests
06  Prompt → Picture         — Midjourney prompt library; prompt/image reveal pairs
07  What it made             — gallery of the finished workbooks (v1 gallery, re-pointed)
─── CLOSE ────────────────────────────────────────────────────────────
08  Close                    — spine paid off · one commitment · next CoP question
```

### 00 · Cold open
Hero: reuse `cop-hero-two-halves.jpg`. New headline *Prompt it. Build it.*, the spine sentence as the lede, and a two-line "where we're going" (Section 1 / Section 2). No agenda list — the chapter rail is the agenda.

### 01 · Act · Explain · Please
**Keep the v1 AEP Brief Builder** — it already assembles three fields into a copy-ready prompt and is the proven mechanic from AI Essentials. Reframe the three field labels from "a tool for my cohort" back to generic course content: *Act* (who the model is) · *Explain* (situation, audience, constraints) · *Please* (the specific ask and format).
**Demo on screen:** weak prompt first ("write me a case study") shown in a red panel; then Rupert fills the three fields live and the assembled brief appears in the green panel. The **weak-vs-brief side-by-side** gets its own sub-heading so it can be zoomed.
**Seeded example** pre-loaded in facilitator mode so the demo can't stall: *Act: an L&D designer at AIM · Explain: a 20-minute case study for first-time managers on giving feedback, Australian workplace, no jargon · Please: 400 words, one dilemma, three discussion questions, plain text.*
Keep `s1-aep-card.jpg` and `s1-hero-the-brief.jpg`.

### 02 · Context Windows — NEW
**The Context Meter.** A wide horizontal bar representing the model's working memory, filling left to right as blocks are added: *system instructions · your brief · the pasted document · the conversation so far · the answer*. Three preset buttons drive it: **Short chat** (bar mostly empty) · **Pasted a 40-page facilitator guide** (bar nearly full, and the earliest conversation blocks grey out and slide off the left edge — "it has literally forgotten the start") · **Fresh chat, one task** (empty again, with a verdict line).
One-line verdicts per preset. Teaching points surfaced as three large captions: *It's a desk, not a filing cabinet* · *What falls off the left edge is gone* · *New task, new chat.*
**Numbers:** express the bar in pages-of-A4, not tokens, with a small "≈ tokens" note. **Do not hard-code model-specific window sizes** without checking current figures at build time — frame as "roughly a few hundred pages for today's large models" and keep any table in a collapsible that can be updated.
Pure SVG/CSS, projector-safe, same approach as v1's Lighting Rig (which this replaces).

### 03 · Cutoff Dates & Training
**Port the Model Cutoff Clock from `ai-essentials-for-business/pages/module-1.html`** — it already exists and matches the house system. Two sub-bands:
- **How a model learns** — a three-stop timeline: *training data ends (cutoff) → model released → today*. The gap between cutoff and today is highlighted with the caption *"everything in here, it has never seen."*
- **The clock** — the ported model table. **Verify every date before shipping**; the AIE copy is from August and will need a refresh. Add a "last checked" stamp to the panel.
**Demo on screen:** ask a model (live, or a pre-captured screenshot as fallback) about something recent with web search off, then on. The contrast is the lesson. Fallback screenshots go in `pics/` as `s1-cutoff-off.jpg` / `s1-cutoff-on.jpg`.
Close the section with one card: *"These three are the whole reason the next section works."*

### 04 · Source → Plan
First band of Section 2. Running example throughout: **Agentic AI for Leaders** — it has the richest paper trail (PLAN, BUILD-PHASES, EXTRAS-PLAN, Midjourney set, AUDIT, QA-REPORT).
A left-to-right **pipeline rail** appears here and persists (small) in the header for bands 04–07: `Source PDFs → Plan → Build phases → Images → QA → Live`. The current stop lights up.
Content: three source cards (Facilitator Guide 171pp · Activity Workbook 92pp · Concepts Workbook 82pp) → an arrow → one card showing the actual opening of `Agentic-AI-for-Leaders-Interactive-Workbook-PLAN.md` (the spine table with module names / questions / artefacts). Zoomable sub-heading: **"The plan is an AEP brief with 400 lines."** This is the moment the spine lands — point at Act (the role), Explain (the course, fidelity rules, the cases), Please (the file structure and page specs).

### 05 · Plan → Pages
Three large numbered cards from the BUILD-PHASES working rules, in Rupert's words: **Fidelity first** (module names verbatim, never invent course content) · **One phase, one commit** (`.pre-pN.bak` beside every overwritten file — show the folder listing of `agentic-ai/` with its fourteen `.bak` files as proof) · **Test before commit** (the CoP page's own 327 tests across four suites; show the terminal output). Optional fourth: *Decide-before-reveal* as the pedagogy rule that survived from paper to screen.
Below, a **before/after strip**: a page of the fillable PDF beside the same activity on the live workbook (`module-2.html`). One zoomable sub-heading: **"Same activity number, same name, same case — different medium."**

### 06 · Prompt → Picture
The visual half of the method. Three **prompt/image reveal pairs**: the Midjourney prompt text on the left (monospace card), the resulting image hidden under a "Reveal" on the right. Use pairs that exist: `m1-hero-first-light.jpg`, `m7-hero-lighthouse-keeper.jpg`, `m8-four-doors.jpg` from the Agentic AI prompt set.
Then the **house-style card**: *photorealistic · Hasselblad · warm cinematic light · inclusive casting · aspect ratios by use*. And the **casting note** as its own zoomable heading — the plan's rule that authority is distributed across the set, nobody is only ever the junior. That rule is the thing other facilitators most need to hear.
Close with the **re-roll story** already in HANDOVER.md: `s3-the-wall-old1.jpg` → `s3-the-wall.jpg`, captioned *"The first cast was wrong. Re-rolled, re-designed the band around it."* Honest, specific, memorable.

### 07 · What it made
**Reuse the v1 gallery component** (`GALLERY` array + `drawGallery`), re-pointed from tools/games to workbooks: Responsible AI Leadership · Agentic AI for Leaders · AI for Teamwork · AI Essentials for Business · Agentic AI Extras · this page. Each card: a hero still, module count, "built from" (the source docs), and a link. Since this is shown from Rupert's machine, **local links work on the day**; hosted URLs stay the post-session fix noted in HANDOVER §2. Drop the Remix button.

### 08 · Close
Pay off the spine: *Section 2 was Section 1 at scale.* Then the two v1 captures, kept verbatim: **"Before my next session I will ___"** (Rupert reads two or three from the room, types them in) and **"What should the next CoP be?"**. Keep `cop-commitment.jpg` and `cop-next-question.jpg`.

---

## 4 · Run sheet (45:00 — confirm the slot is unchanged)

| Time | Band | Beat |
|---|---|---|
| 0:00–2:00 | 00 | Hook: open on the finished Agentic AI workbook, scroll one module in silence, then: *"Everything you just saw was made with three ideas. Here they are."* Spine sentence. |
| 2:00–8:00 | 01 | AEP. Weak prompt → three fields live → assembled brief. Ninety seconds on why most prompts are a wish, not a brief. |
| 8:00–14:00 | 02 | Context Meter. Three presets. The forgetting moment is the one to hold. |
| 14:00–20:00 | 03 | Timeline, then the clock, then the with/without-search demo. |
| 20:00–21:00 | — | Pivot card: *"These three are the whole reason the next section works."* |
| 21:00–26:00 | 04 | Sources in, plan out. Zoom on the spine table. *"The plan is an AEP brief with 400 lines."* |
| 26:00–31:00 | 05 | Three working rules; the `.bak` folder; the test output; the PDF-vs-page strip. |
| 31:00–38:00 | 06 | Three prompt/image reveals; house style; the casting rule; the re-roll story. |
| 38:00–41:00 | 07 | Gallery tour — thirty seconds per workbook, cumulative not individual. |
| 41:00–45:00 | 08 | Spine paid off · commitments · next CoP. |

**Cut list, decided now:** 1. Third prompt/image pair (saves 2:00) · 2. PDF-vs-page strip (2:00) · 3. With/without-search live demo → use the screenshots (1:30). **Never cut:** the forgetting moment in 02, *"the plan is an AEP brief"* in 04, the casting rule in 06.

---

## 5 · What happens to v1

| v1 piece | v2 fate |
|---|---|
| Gate, tokens, capture engine (`cop.capture`, multi-tab-safe), facilitator layer, session timer | **Keep as is** |
| Pre-flight strip | **Remove** — nobody needs AI Studio access any more |
| AEP Brief Builder | **Keep**, relabel fields, add seeded example |
| Lighting Rig, 60-second audit, Kit Ladder, Rodecaster panel | **Remove from the page.** v1 stays intact in `index.html.pre-v2.bak`; the Rig can be promoted to `pages/lighting.html` later if wanted |
| Gallery + `drawGallery` | **Keep**, re-pointed to workbooks, Remix button dropped |
| The Wall | **Remove** — no participant links to collect |
| Commitment + next-CoP cards | **Keep verbatim** |
| `s2-*` lighting stills (14 files) | Leave in `pics/` for now; prune with v1 sign-off |
| Tests `b1–b4` | b1 (shell/gate) and b4 (contrast) should still pass; b2 (Rig/audit/ladder) and b3 (wall/remix) need retiring or rewriting — do not ship with failing suites |

---

## 6 · New assets needed

- **Context Meter** — SVG/CSS, no imagery. ≈1.5 hours including presets and verdict copy.
- **Model Cutoff Clock port** — lift markup + data from AIE module 1; **refresh every model/date**; ≈45 minutes.
- **Cutoff fallback screenshots** — two captures, with/without web search, on a recent-news question. 10 minutes.
- **PDF-vs-page strip** — one screenshot of a fillable-PDF activity page beside its live counterpart. 15 minutes.
- **Terminal screenshot** of the four test suites passing. 5 minutes.
- **Gallery hero stills** — already exist in each course's `assets/pics`/`media`; copy six into `pics/` as `s7-*.jpg`.
- **Prompt/image pairs** — copy three Agentic AI images into `pics/` as `s6-*.jpg`; prompt text from the Midjourney doc.

No new Midjourney generation required for tomorrow.

---

## 7 · Build order (tonight)

| Phase | Scope | Exit |
|---|---|---|
| **V1** | `cp index.html index.html.pre-v2.bak`. Strip pre-flight, Stations 2 & 3 content, the Wall. Rewrite `<title>`, meta, hero copy. | Page loads, gated, two empty section frames. |
| **V2** | Chrome: chapter rail, numbered zoom headings, Present-mode-default, 56px heading scale, full-height bands. | Every heading is a clean zoom at 1280×720. |
| **V3** | Section 1: AEP relabel + seed · Context Meter · Cutoff Clock port + date refresh + timeline. | Bands 01–03 demo-ready. |
| **V4** | Section 2: pipeline rail · source/plan cards · working-rules cards · prompt/image reveals · casting card · re-roll pair · gallery re-point. | Bands 04–07 complete. |
| **V5** | Close band · facilitator notes + new run sheet in the facband · retire/rewrite b2/b3 tests · projector pass at 1280×720 · one timed dry run in facilitator mode. | Ready for the room. |

V1–V2 ≈ 1 hour. V3 ≈ 2.5 hours (the Meter is the only genuinely new piece). V4 ≈ 1.5 hours (mostly assembling what exists). V5 ≈ 1 hour.

---

## 8 · Open choices (defaults marked ✦)

- **Title** — *Prompt it. Build it.* ✦ / *Three Ideas and a Workbook* / *From Brief to Build*
- **Running example for Section 2** — Agentic AI for Leaders ✦ (richest docs) / Responsible AI Leadership (the original) / AI for Teamwork
- **Lighting content** — removed, v1 kept as .bak ✦ / collapsed "Appendix" band at the foot / separate `pages/lighting.html`
- **Cutoff demo** — live with fallback screenshots ✦ / screenshots only
- **Session length** — 45 minutes ✦ / other
- **Hub card** — update tag to *Community of Practice · Prompt it. Build it.* ✦ / leave

---

## 9 · The honest note

The only piece that doesn't exist yet is the Context Meter, and it's the one that will be remembered — the moment the first blocks grey out and slide off the edge is this session's "three lights going on one at a time." Everything else is already in the folder: the AEP builder, the cutoff clock, the plan docs, the prompt library, the images, the gallery. The job tonight is curation and framing, not invention — which is, conveniently, the point of Section 2.
