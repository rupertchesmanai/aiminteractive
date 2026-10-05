# Prompt it. Build it. — Handover (v2)
### What changed on 5 October 2026, and what to do before tomorrow

**Workbook:** `courses/community-of-practice/index.html` (v1 kept beside it as `index.html.pre-v2.bak`)
**Plan:** `docs/AIM-Facilitator-CoP-v2-PLAN.md`
**Access code:** unchanged, `cop2026` · **Facilitator view:** `?facilitator=1`
**Tests:** `node tests/v2.spec.js` against a local server in the AIM Interactive Workbooks folder — 95 checks, all passing. The v1 suites are in `tests/v1-archive/` and test the `.pre-v2.bak` page, not this one.

## What it is now

Two sections, ten numbered bands, every heading a zoom target. Section 2 is the six-step live build of **AI for Productivity** — each band is one thing to say (with a Copy button), three "what you'll see" cards, and a tie back to Section 1. **Present mode is the default.**

| Band | | Demo on screen |
|---|---|---|
| 00 | Open — "Section 2 is Section 1 at scale" | — |
| 01 | Act · Explain · Please | wish-vs-brief side by side; the AEP Brief Builder with six course-content seeds |
| 02 | Context Windows | **the Context Meter** — four presets; the third slides the early conversation (and the original brief) off the edge |
| 03 | Cutoff Dates & Training | the Model Cutoff Clock with a trained → released → today timeline; search-off / search-on card |
| 04 | Step 1 · Give it the folder | "Please understand the contents of the folder." |
| 05 | Step 2 · Phased plan | ask for the plan; zoom the spine table |
| 06 | Step 3 · Midjourney prompts | the library, one prompt → picture reveal, the casting rule |
| 07 | Step 4 · Rename the images | the old → new table |
| 08 | Step 5 · Module 1, with images | the live build; dry-run tab as fallback |
| 09 | Step 6 · "Continue with all phases." | four words, then the close |
| 10 | Close | commitment · next CoP · keep-this links |

Run sheet, cut list and a "before you start" list are in the facilitator briefing band (`?facilitator=1`). Timer presets are now 2m / 5m / 6m / 7m.

## Before tomorrow — five minutes

- [ ] **Open it once in Safari or Chrome from the hub** and click through the rail. Browser zoom 125% on a 1280×720 projector reads from the back.
- [ ] **Dry-run the six steps on AI for Productivity today** and keep that session (and its finished Module 1) open as the fallback tab. A live Module 1 build can outrun the six minutes it has.
- [ ] **A fresh session with the AI for Productivity folder already added**, so step 1 is one line on the day.
- [ ] **A chat window with web search visibly off**, for band 03.
- [ ] **Cutoff dates** were checked 5 October 2026 against vendor docs and the public trackers (GPT-5.6 Feb 2026 · GPT-6 Astra Apr 2026 · Claude Fable 5.1 and Opus 5.5 Jun 2026 · Gemini 3.8 Flash Mar 2026 · Grok 4.7 May 2026). If one looks wrong to you, the table is the `MODELS` array in the Cutoff Clock script — months only.
- [ ] **Hub card** on `AIM Interactive Workbooks/index.html` still says *Build it. Light it. Show it.* — that file is outside the folder this session could reach. Retitle the card *Prompt it. Build it.* when you have a minute; the code and slug are unchanged so nothing breaks meanwhile.

## What was removed, and where it went

Pre-flight strip, the Lighting Rig, the 60-second audit, the Kit Ladder, the Rodecaster panel, the Wall and the v2.0 gallery are all gone from the page. Everything the page no longer uses — `index.html.pre-v2.bak` (the full v1), the v1 tests, the v1 plan and build spec, and 44 unused images — is in `_to_delete/`. Delete that folder when you're happy with v2; the v1 page can be restored from it until then.

## New files

- `pics/s5-module-2-live.jpg` — screenshot of the live Module 2 page for the before/after strip
- `pics/s6-*.jpg` — three Agentic AI images for the prompt → picture reveals (copies, originals untouched)
- `pics/s7-*.jpg` — gallery stills, one per workbook (copies)
- `tests/v2.spec.js`

## Notes for whoever touches this next

- The engine (`window.COP`) is the v1 engine unchanged in contract. Mode now persists under `cop.mode.v2` so a v1 "self-paced" preference doesn't override the Present default.
- The three deviating palette tokens (`--muted`, `--teal-dark`, `--blue`) are still deliberate, for AA contrast. `tests/v2.spec.js` §8 computes real ratios and fails if they're "corrected" back.
- Nothing on this page talks to a server. Everything a participant types stays in their own browser.

---
---

# v1 handover (11 September 2026) — kept for the record

# Build it. Light it. Show it. — Handover
### What's done, what's yours, what to do before Brisbane

**Updated:** 11 September 2026
**Workbook:** `AIM Interactive Workbooks/courses/community-of-practice/index.html`
**Access code:** `cop2026` (card is live on the Interactive Workbooks hub)
**Facilitator view:** add `?facilitator=1` to the URL

---

## 1 · Status

All four build phases are complete. 327 tests across four suites, all passing.

| | |
|---|---|
| **Page** | 136KB, 34KB gzipped. One self-contained file. |
| **Tests** | `tests/b1.spec.js` (42) · `b2` (109) · `b3` (94) · `b4` (73) |
| **Images** | 23 in place, all final |
| **Blocked on you** | 2 items — both content, neither of them code |

Run the tests any time with `node tests/b1.spec.js` (and b2, b3, b4) against a local server in the course folder.

---

## 2 · Your list

### ✅ ~~Re-roll the wall image~~ — done 11 September

Both re-rolls came back good. The eight-person version is now `pics/s3-the-wall.jpg`; the tighter five-person one is `s3-the-wall-alt1.jpg` if you ever want the more dramatic read. The two original casts are kept as `-old1` and `-old2` — delete them whenever you like.

The band was also redesigned around the new picture. The old veil was 42% image under a heavy top-to-bottom wash, which was doing a lot of work to hide a casting problem. It now runs left-to-right at 78% image, so the copy stays legible on the left and the faces are actually visible on the right — which is the entire point of that band. Mobile keeps the original top-to-bottom wash, since there's no room for a side-by-side split.

---

### ① Four gallery links — 15 minutes

Five of six gallery cards currently read **"Link to come"**. They degrade gracefully, so nothing is broken — but the gallery only lands if people can click through.

Edit the `GALLERY` array near the foot of `index.html` and fill in the `url` for:

| Card | Where it probably lives |
|---|---|
| **Two-Player Tetris** | `AIM AI Essentials for Business/Vibe Codes/twoplayertetris.html` |
| **PDF Read-Aloud** | `resource-pdf-reader.html` |
| **Agentic AI Workbook Extras** | `courses/agentic-ai-for-leaders/pages/extras/index.html` |
| **Supersnake** | `AIM AI Essentials for Business/Vibe Codes/supersnake.html` |

They need to be **hosted URLs, not local file paths** — a `file://` link won't open for anyone but you. The QR generator is already wired to `rupertchesman.com/qr/`.

If a link isn't ready, just leave `url: null` and that card keeps its honest "Link to come".

---

### ② Build the Group Allocator — about an hour

This is gallery slot 4, currently marked **"Being built"** and dimmed. It's the one card that makes a facilitator think *I could have that by Friday* — which is the entire argument of Station 3.

The workbook already contains the prompt that builds it. Open the page, click the **Group allocator** seed chip in Station 1, then **Copy the prompt** and paste it into AI Studio. Eat your own cooking — and you'll know from the inside how the exercise feels before you ask twenty people to do it.

Then set `soon: false` and add the `url` and `remix` links on that card.

---

## 3 · One thing I couldn't do

The empty **`courses/facilitator-cop`** folder is still sitting there — I used that name before you created `community-of-practice`, and macOS won't let me delete from this session. Drag it to the bin. Its contents were moved across long ago; it's genuinely empty.

---

## 4 · Kit ladder pricing — done, with a caveat

Checked 11 September 2026 against Australian retailers and now live in the page:

| Tier | | Benchmark |
|---|---|---|
| 1 | **$0** | A window, a stack of books, a sheet of foamcore |
| 2 | **≈ $200** | Godox Litemons LP800Bi 80W bi-colour panel — $199 at digiDirect |
| 3 | **≈ $550–750** | 70cm Godox parabolic softbox $139, plus a second light and two stands |
| 4 | **≈ $930–1,250** | RØDECaster Video S — RRP $1,095 (Camera Warehouse) to $1,250 (Videocraft), selling around $930–990 on sale |

**The caveat:** the Rodecaster swings by a few hundred dollars between retailers and sales, so the page frames all of these as ballpark rather than quotes. If anyone in the room looks likely to buy on the day, re-check before Brisbane. For context, the original RØDECaster Video was $2,030 — the S is less than half that, which is part of why it's worth showing.

---

## 5 · Before the Brisbane run

Five things that have nothing to do with the workbook and everything to do with whether the session lands.

- [ ] **Send the workbook link with the calendar invite, not on the day.** The pre-flight strip is the single highest-value thing on the page — twenty people discovering a Google Workspace restriction simultaneously at minute eight is the one failure that would eat Station 1.
- [ ] **Decide what lighting kit travels to Brisbane.** A reduced two-light demo is fine and probably wiser than freighting the lot. Decide now and rehearse that version, rather than improvising on the day.
- [ ] **Confirm venue wifi carries twenty laptops.** Both rooms.
- [ ] **Record the cold open**, or set up the second camera. Fifteen seconds badly lit, then cut to your proper setup mid-sentence. In-room needs a clip or a second source; online you can switch live.
- [ ] **One dry run against the clock**, in facilitator mode, with the timer running. It will overrun — that's what the cut list is for.

---

## 6 · Two decisions still open

**The Wall.** Currently the chat fallback: links go in the meeting chat, and the workbook keeps a local copy of each person's own link. That works in all three venues today with no infrastructure. The alternative is a shared board that persists across all three runs, so Sydney sees what Brisbane made — about half a day's work, and worth it only if the wall turns out to be what people talk about afterwards. **Ship the fallback for Brisbane, then decide.**

**Deployment.** The page is sitting in your AIM folder. It needs hosting wherever the other workbooks live before facilitators can open it — the gate is client-side only, so anywhere that serves static files is enough.

---

## 7 · Notes for whoever touches this next

- **Three design tokens deliberately deviate from the shared AIM palette**, all for WCAG AA contrast: `--muted` (was `#A7A7A7`, only 2.6:1 as text on white), `--teal-dark` (was `#008D80`, 4.1:1) and the header blue. There's a comment in the file saying so. Don't "correct" them back — `tests/b4.spec.js` computes real contrast ratios and will fail if you do.
- **Those same three failures exist across the other AIM workbooks**, since they inherit the original tokens. Worth a pass at some point.
- **The engine fixes a multi-tab bug** the Agentic AI engine has: it reads the whole capture object once at load, so two tabs overwrite each other. `COP` re-reads before every write. There's a test proving it.
- **Nothing on this page talks to a server.** Everything a participant types stays in their own browser.
