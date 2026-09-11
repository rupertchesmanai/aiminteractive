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
