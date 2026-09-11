# Build it. Light it. Show it. — Build Spec
### AIM Facilitator CoP Interactive Workbook — engineering plan

**Version:** 1.0 · 11 September 2026
**Companions:** `AIM-Facilitator-CoP-PLAN.md` (session design) · `AIM-Facilitator-CoP-Midjourney-Prompts.md` (image set)
**Destination:** `AIM Interactive Workbooks/courses/community-of-practice/`
**Assets in place:** 38 renamed images in `pics/` — all 22 slots filled

---

## 1 · The architectural decision

The repo holds two engine generations and a third pattern:

| | Gen 1 — RAIL | Gen 2 — Agentic AI for Leaders | Extras pages |
|---|---|---|---|
| Namespace | `window.RAL` | `window.AAL` | none |
| Field attribute | `data-capture` | `data-key` | none |
| Files | `site.css` + `site.js` + pages | + `evidence.js`, 17 extras | **one self-contained file each** |
| Weight | multi-page course | multi-page course | ~24KB standalone |

**This build follows the extras-page pattern, not the course pattern: one self-contained `index.html`.**

The reasoning is proportionality. The Gen-2 engine exists to solve problems a 45-minute single page doesn't have — cross-page resume (`aal.last`), eight-module progress denominators (`TOTALS`), a capstone artefact registry (`evidence.js`, 13KB), a prev/next pager, a glossary drawer keyed to a Foundations page. Importing 40KB of engine to use a tenth of it means inheriting the whole maintenance surface, including the three known warts: the hand-written gate-depth string, the multi-tab `CAP` clobber, and the three competing `:root` declarations.

Against that, self-contained gives: no path-depth bugs, no script load-order dependency, works from `file://`, and copies anywhere as one file — which matters when the same page is opened cold in two venues and an online room.

**What we keep from Gen 2:** the design tokens verbatim, the `data-key` capture contract, the `data-requires`/`data-reveal` gate idea, the `#savebar` pattern, the `printDoc` approach, the `selfOnly`/`presentOnly` mode classes, and the `?facilitator=1` layer. We port a ~180-line `COP` engine inline rather than the 19KB `AAL`.

**Trade-off accepted:** if the CoP grows into a multi-session series, this page gets promoted to the course pattern. Cheap at that point; expensive now.

---

## 2 · File structure

```
courses/community-of-practice/
├── index.html          ← everything: chrome, engine, all seven interactives, content
├── pics/               ← 38 images, already named (22 primaries + 16 alternates)
└── docs/
    ├── AIM-Facilitator-CoP-PLAN.md
    ├── AIM-Facilitator-CoP-Midjourney-Prompts.md
    └── AIM-Facilitator-CoP-BUILD-SPEC.md   ← this file
```

Add `assets/img/aim-logo-white.png` + `aim-logo-blue.png` (copy from `agentic-ai-for-leaders/assets/img/`) — needed for the header and the print header.

**Target weight:** HTML ≤ 110KB. Images 4.2MB total across 22 primaries, which is fine *only* with the loading strategy in §9.

---

## 3 · The engine — `window.COP`

Inline in a single `<script>` before `</body>`. Roughly 180 lines.

### 3.1 Storage

```js
var NS = 'cop.capture';   // flat JSON object of all answers
var MODE = 'cop.mode';    // 'self' | 'present'
```

Two keys. No `cop.last` (single page), no artefact registry, no `x.` score namespace (no games).

**Fix the multi-tab clobber that Gen 2 has:** re-read before every write rather than holding `CAP` from load.

```js
function set(key, value, opts){
  var cap = readAll();                       // re-read, don't trust a stale module var
  if (value === '' || value == null) delete cap[key]; else cap[key] = String(value);
  writeAll(cap);
  if (!opts || !opts.silent) savedFlash();
  document.dispatchEvent(new CustomEvent('cop:change', {detail:{key:key, value:value}}));
}
```

Also add the listener Gen 2 lacks, so a second tab stays honest:

```js
window.addEventListener('storage', function(e){
  if (e.key === NS) { wireFields(); document.dispatchEvent(new CustomEvent('cop:change',{detail:{}})); }
});
```

### 3.2 Public API

```js
COP.get(key, fallback)     COP.set(key, value, opts)     COP.has(key)     COP.del(key)
COP.countWith(prefix)      COP.progress(prefix, total)
COP.wireFields(root)       COP.refreshGates()
COP.setMode(mode)          COP.printDoc(title, bodyHtml)   COP.rows(pairs)
COP.resetAll()
```

`COP.rows(pairs)` replaces Gen 2's duplicated screen-renderer/print-renderer pair. **One function drives both** — the `AAL.artefactRows()` that existed but went unused. Signature `[[label, key], …] → HTML`, with the "gap is a finding" placeholder replaced by CoP-appropriate copy: *"Not filled in — that's fine, it's yours to finish."*

### 3.3 Capture contract

Identical to Gen 2 so anyone who has worked on those files recognises it:

- `data-key="s1.act"` on any `INPUT` / `TEXTAREA` / `SELECT`
- radio groups share a `data-key` plus a `name`
- checkbox groups share a `data-key` plus `data-multi`, joined `"; "`
- debounce 400ms for text, 0ms for change-events

### 3.4 Key namespace

Single page, so no module prefixes. Four groups:

| Prefix | Holds |
|---|---|
| `s1.` | `s1.act` · `s1.explain` · `s1.please` · `s1.built` (what they made) |
| `s2.` | `s2.audit.1`–`s2.audit.6` · `s2.fix` · `s2.rig.state` (last rig preset viewed) |
| `s3.` | `s3.link` · `s3.path` (remix \| iterate) |
| `me.` | `me.commit` · `me.next` · `me.name` (optional, for the printout header) |

Progress denominator: `TOTAL = 12` (the fields that matter), used by a single thin progress bar in the header.

---

## 4 · Design tokens

Copy the Gen-2 `:root` verbatim, then override the lead accent. Per the session plan, this leads **AIM blue + amber on cream** so it reads as a meet-up handout rather than a module.

```css
:root{
  /* inherited, unchanged — keeps the family resemblance */
  --cream:#F1EEDE; --cream-alt:#F7EBDB;
  --ink:#423A3A; --black:#141414; --grey:#595959; --muted:#A7A7A7;
  --teal:#00C0AF; --teal-light:#53DFCB; --teal-dark:#008D80;
  --coral:#DC5A46; --coral-dark:#B53D2C;
  --line:rgba(0,0,0,.10);
  --head:'IBM Plex Sans Condensed',sans-serif;
  --body:'IBM Plex Sans',sans-serif;
  --mono:'IBM Plex Mono',monospace;
  --maxw:1180px;

  /* CoP identity */
  --blue:#2D7DD2;            /* matches the AI for Teamwork hub accent — deliberate sibling */
  --blue-dark:#1B5FA8;
  --amber:#E8A33D;
  --accent:var(--blue);
}
```

**Semantic assignment:** blue = station headers and chrome · amber = hands-on blocks and timers ("you are working now") · ink = the print layer and the Rodecaster band · coral reserved for warnings only.

Station colour-coding, used on eyebrows and left rules: **S1 blue · S2 amber · S3 teal-dark.**

Reuse without modification: `.wrap` `.eyebrow` `.band` `.card` `.field` `.fieldrow` `.optcards`/`.optcard` `.checks` `.btn` (+`.primary`/`.ghost`/`.done`) `.reveal-box` `.key-message` `.quoteband` `.takeaways` `.meter` `.skip-link` `#savebar`, the print block, the reduced-motion block, and the `.selfOnly`/`.presentOnly` rules.

**Fix while porting:** add `html{scroll-padding-top:72px}` — Gen 2 omits it, so every anchor lands under the 60px sticky header.

---

## 5 · Page anatomy

One scrolling page. Twelve bands, in order:

| # | Band | Contains |
|---|---|---|
| 1 | Sticky header | AIM logo · "Community of Practice" · progress bar · Self-paced/Present toggle · Print |
| 2 | Hero | `cop-hero-two-halves.jpg` (21:9) · title · the one-sentence promise · session date/venue chip |
| 3 | **Pre-flight** | `cop-preflight-bench.jpg` band background · 3 checkboxes · the AI Studio warning |
| 4 | The spine | The "specialist gap has closed" argument · 3-up station map, anchored links |
| 5 | **Station 1 — Build it** | `s1-hero-the-brief.jpg` · AEP teaching card · **AEP Brief Builder** · seeds · fallbacks · `s1-it-worked.jpg` payoff |
| 6 | **Station 2 — Light it** | `s2-hero-three-lights.jpg` · **The Lighting Rig** · portrait triptych · **60-Second Audit** · before/after pair · **Kit Ladder** · Rodecaster encore |
| 7 | **Station 3 — Show it** | `s3-hero-the-gallery.jpg` · **The Gallery** (6 cards) · remix-or-iterate choice · link field |
| 8 | The wall | `s3-the-wall.jpg` · paste-your-link · v1 = chat fallback (§11) |
| 9 | Close | `cop-commitment.jpg` · commitment field · `cop-next-question.jpg` · next-CoP field |
| 10 | Keep this | Collapsed reference: lighting recap, kit ladder summary, the AEP card as a teaching aid |
| 11 | Footer | AIM mark · "Nothing here leaves your browser" · reset |
| 12 | Facilitator layer | Injected run-sheet strips + timer, `?facilitator=1` only |

---

## 6 · The seven interactives

### 6.1 AEP Brief Builder — Station 1

Three `<textarea data-key>` fields (`s1.act` / `s1.explain` / `s1.please`), a live-assembled output, and a Copy button.

```
Assembly template:
  "You are {act}.
   {explain}
   {please}
   Build this as a single self-contained web page."
```

The trailing line is deliberate — it's what makes Google AI Studio return something runnable rather than a plan.

- **Seed chips** — six clickable chips (group allocator, debrief wheel, branded timer, scenario generator, branching dilemma, self-summarising feedback form). Clicking one populates `s1.explain` and `s1.please` with a starter a facilitator then edits. Never overwrites a non-empty field without confirming.
- **Copy button** — `navigator.clipboard.writeText()` with a `document.execCommand('copy')` fallback for `file://`. Label flips to "Copied ✓" for 1600ms.
- **Genericness meter** — ported from AI Essentials Module 1. Scores presence of a role, an audience, a format constraint, and length > 40 words. Four dots, amber→blue. Not a grade; a nudge.
- **Fallback row** — "Copy this instead" (a known-good full prompt) and "See a finished one" (live link), both visible from the start, no shame attached.

### 6.2 The Lighting Rig — Station 2 ★

The centrepiece and the single largest build item. Roughly 40% of total effort.

**What it is:** an inline SVG plan view of a subject, a camera, and three lights, with toggles and presets, plus a verdict line — sitting above a triptych of the three real portraits.

**SVG plan view** (viewBox `0 0 600 420`, `preserveAspectRatio="xMidYMid meet"`):
- Subject: head circle at centre with a nose wedge indicating facing, toward camera
- Camera at bottom centre
- Key at 45° camera-left, 30° above eyeline (elevation shown as a small badge, not perspective)
- Fill at 45° camera-right, marked as weaker
- Back/rim behind and above at ~135°
- Overhead: a ceiling glyph directly above the head
- Window: an optional source at 90° camera-left

Each active light draws a translucent cone toward the subject, and a **shadow arc** renders on the head opposite the dominant source. The arc is the teaching element — it's what visibly softens when fill comes on.

**State:** `{key, fill, back, overhead, window}` booleans. Individual toggles plus five presets:

| Preset | State | Verdict copy |
|---|---|---|
| Overhead only | overhead | *"The default. Light from directly above hollows the eyes and flattens everything. This is what most calls look like."* |
| Window key | window | *"Free, and most of the way there. Face the window — never sit with it behind you."* |
| Key only | key | *"One good soft source at 45°. Dramatic, shadowed, and already better than most of what you see on Teams."* |
| Key + fill | key, fill | *"The shadow opens up. A white wall or a sheet of foamcore does this for nothing."* |
| Full three-point | key, fill, back | *"The rim lifts you off the background. This is the setup, and it costs less than you think."* |

Free-toggle combinations outside the five get a generated verdict from a small rules table (e.g. overhead + key → *"The overhead is fighting your key. Turn it off."*). Eight combinations; write all eight rather than a fallback string.

**The triptych** below: `s2-portrait-key.jpg`, `s2-portrait-key-fill.jpg`, `s2-portrait-full.jpg`, each captioned. These are three different people, so they do **not** cross-fade — they sit side by side, and the active one brightens as the rig state matches. That's the better design anyway: it shows the technique holding across three different skin tones, which is the point being made.

- Buttons are real `<button aria-pressed>`, tap-to-toggle, keyboard-reachable. No drag.
- `prefers-reduced-motion`: cone and arc transitions drop to instant; state still changes.
- Persists `s2.rig.state` so a returning facilitator lands where they left.

**Upgrade path to flag now:** if Rupert shoots a real four-state progression of a single subject on his own kit, the triptych becomes a true cross-fade inside the rig and this goes from good to excellent. That's a half-day of his time and the best possible use of it.

### 6.3 60-Second Self-Audit — Station 2

Six `data-key` checkboxes (`s2.audit.1`–`6`), the questions verbatim from the session plan §Part 2. Live score `n/6` with three verdict bands (0–2 / 3–4 / 5–6). Then one required field: `s2.fix` — *"The one thing I'm fixing right now."*

A `data-requires="s2.fix"` gate reveals the before/after pair (`s2-the-room-is-the-problem.jpg` → `s2-the-fix.jpg`) — commit first, then see. Same pedagogy as the course builds.

### 6.4 Kit Ladder — Station 2

Four tiers as native `<details>` elements (accessible for free, printable, no JS). Each: name, indicative AUD range, what it buys, what it doesn't. Illustrated once by `s2-kit-ladder.jpg`.

**Blocked:** AUD pricing is not confirmed. Build with `data-price` placeholders and a visible `TODO` in facilitator mode until Rupert supplies figures. Do not ship invented numbers.

### 6.5 The Gallery — Station 3

Driven by one declarative array, following the hub's `MODULES` pattern:

```js
var GALLERY = [
  {slot:1, kind:'game', title:'…', img:'pics/s3-gallery-tile.jpg', what:'…', took:'…', url:'…', remix:'…'},
  …
];
```

Six cards: image, kind chip (game/tool), title, what it's for, build time, **Open** and **Remix this**. Renders to `#galleryGrid` on load.

**Blocked:** slot 4 (a facilitator-specific tool — group allocator or debrief wheel) does not exist yet. Ship with the card present and marked "coming soon" (`.soon`, `opacity:.55`) exactly as the extras strip does, so the layout is final before the asset lands.

### 6.6 Session Timer — facilitator layer

Not in the original plan; adding it because the run sheet has four timed blocks and a facilitator running this in three venues shouldn't be watching a phone.

Fixed bottom-left panel, facilitator mode only. Presets 60s / 3m / 5m / 6m matching the run sheet. Huge mono digits legible from the back of a room, amber at 30s, a single soft chime at zero (with a mute toggle — it will annoy someone in the online run). Space bar starts/pauses. Does not persist; a timer surviving a reload is a bug, not a feature.

### 6.7 Close & print — Station 4

`me.commit` and `me.next` fields, then **"Take my notes with me"** → `COP.printDoc()` producing a one-page sheet: their AEP brief, what they built, their audit score and fix, their link, their commitment. Print header reuses the Gen-2 `.pd-*` classes and the AIM blue logo, with hard-coded colour literals in the print block (Gen 2 does this deliberately — print UAs are unreliable with custom properties; keep it).

---

## 7 · Image manifest

22 primaries, all present. Alt text is part of the build, not an afterthought — write it as specified.

| Slot | File | Ratio | Loading | Alt text |
|---|---|---|---|---|
| Hero | `cop-hero-two-halves.jpg` | 21:9 | eager | A facilitator standing at a workshop bench between an open laptop and a lit softbox |
| Hub card | `cop-hub-card.jpg` | 3:2 | n/a (hub) | A laptop, a small LED panel and a printed link card arranged on cream linen |
| Share | `cop-og-share.jpg` | 16:9 | meta only | A bare studio wall lit by a single soft source, laptop on a stool |
| Pre-flight | `cop-preflight-bench.jpg` | 21:9 | eager | An organised desk before a session: laptop, headphones, battery pack, notebook |
| S1 hero | `s1-hero-the-brief.jpg` | 16:9 | lazy | A facilitator writing a short brief by hand on an index card |
| S1 card | `s1-aep-card.jpg` | 3:2 | lazy | Three index cards reading Act, Explain and Please in fountain pen |
| S1 payoff | `s1-it-worked.jpg` | 3:2 | lazy | A facilitator reacting with delight as something works on his screen |
| S2 hero | `s2-hero-three-lights.jpg` | 16:9 | lazy | A three-point lighting setup with all three units visible around the subject |
| Triptych 1 | `s2-portrait-key.jpg` | 4:5 | lazy | A portrait lit by a single key light at 45 degrees, shadow side unfilled |
| Triptych 2 | `s2-portrait-key-fill.jpg` | 4:5 | lazy | The same setup with fill added, opening the shadow side |
| Triptych 3 | `s2-portrait-full.jpg` | 4:5 | lazy | A full three-point portrait, rim light separating hair from the background |
| Before | `s2-the-room-is-the-problem.jpg` | 3:2 | lazy | An empty desk with a window behind the chair and a hard overhead light |
| After | `s2-the-fix.jpg` | 3:2 | lazy | The same desk turned to the window, laptop raised, overhead off |
| Kit | `s2-kit-ladder.jpg` | 16:9 | lazy | Four lighting options in ascending order on a bench |
| Encore | `s2-console-hands.jpg` | 3:2 | lazy | Hands on a video production console, scene buttons lit |
| Audit | `s2-gallery-view.jpg` | 16:9 | lazy | Nine people on a video call, each well lit for their own skin tone |
| S3 hero | `s3-hero-the-gallery.jpg` | 16:9 | lazy | Two people viewing six lit screens on a dark gallery wall |
| Tile | `s3-gallery-tile.jpg` | 1:1 | lazy | A small screen showing a simple bright interface |
| Remix | `s3-remix.jpg` | 3:2 | lazy | Two facilitators working together on one laptop |
| Wall | `s3-the-wall.jpg` | 21:9 | lazy | A group looking up at a projected list of the links they built |
| Commit | `cop-commitment.jpg` | 3:2 | lazy | A hand lifting a pen from a card bearing one handwritten line |
| Next | `cop-next-question.jpg` | 16:9 | lazy | A workshop room at the end of a session, chairs turned toward each other |

Every `<img>` carries explicit `width`/`height` so nothing reflows. Everything below the hero is `loading="lazy" decoding="async"`.

**Outstanding:** `s3-the-wall.jpg` did not cast as briefed — the room reads as almost entirely white. It's the emotional peak. Re-roll before build phase B4, or swap in `s3-the-wall-alt1.jpg` if that one casts better.

---

## 8 · Hub integration & gate

**Access code:** `cop2026` → base64 **`Y29wMjAyNg==`**

Three edits to `AIM Interactive Workbooks/index.html`:

1. A seventh card, after `agentic-ai-for-leaders` (line 159), tagged so it doesn't read as a course:

```html
<button class="card" style="--accent: #2D7DD2;" data-course="community-of-practice" data-title="Build it. Light it. Show it.">
  <span class="tag">Community of Practice · 45 minutes</span>
  <h2>Build it. Light it. Show it.</h2>
  <p>A facilitator CoP — build a working tool from a plain-English brief, fix how you look on camera, and leave with a link you can use with your next cohort.</p>
  <span class="enter"><span class="lock">🔒</span> Enter workbook <span class="arrow">→</span></span>
</button>
```

2. A `COURSES` entry (line 187):

```js
'community-of-practice': { title: 'Build it. Light it. Show it.', url: 'courses/community-of-practice/index.html', code: 'Y29wMjAyNg==' }
```

3. Nothing else — the modal, the bounce-back handshake and the `sessionStorage` short-circuit are generic.

**Gate script**, literal first thing in `<head>` before `<meta charset>`, two-level depth:

```html
<script>(function(){var k="aim_access_community-of-practice";try{if(sessionStorage.getItem(k)==="granted")return;}catch(e){}location.replace("../../index.html?course=community-of-practice");})();</script>
```

---

## 9 · Performance & accessibility budget

Venue wifi carrying twenty laptops is a stated risk in the session plan, and this page is the first thing all twenty load simultaneously.

| Budget | Target |
|---|---|
| HTML (inline CSS + JS) | ≤ 110KB |
| Above-the-fold images | ≤ 900KB (hero + pre-flight only) |
| Total page weight | ≤ 4.6MB, lazily |
| First render, cold, on venue wifi | < 2s |
| External dependencies | Google Fonts only — same as every other workbook |

Accessibility, carried over from the Gen-2 block plus two additions:

- `:focus-visible` outlines, `.skip-link`, `prefers-reduced-motion` honoured in **JS as well as CSS** (the rig skips transitions; the timer drops its pulse)
- Rig and audit controls are real buttons and inputs with `aria-pressed` / `aria-live`
- The rig's verdict line is `role="status" aria-live="polite"` so it's announced on change
- Colour never carries meaning alone — the rig's active lights get a label and a state dot, not just a glow
- Contrast checked at AA against both cream and ink grounds

---

## 10 · Testing

Playwright, matching the convention set by the Agent Jigsaw build.

| Test | Asserts |
|---|---|
| Gate | Un-granted load bounces to hub with `?course=community-of-practice`; granted load renders |
| Capture round-trip | Fill all 12 keys → reload → all restored; radio and checkbox groups included |
| Multi-tab | Two contexts writing different keys → neither clobbers the other (the Gen-2 regression) |
| Reveal gate | Before/after pair hidden until `s2.fix` non-empty; stays revealed after reload |
| Lighting Rig | All eight state combinations produce the right verdict string; presets set the right state; `aria-pressed` tracks |
| Audit | Score maths correct at 0, 3 and 6; correct verdict band each time |
| Brief Builder | Assembly template correct; Copy writes to clipboard; seed chip doesn't silently overwrite |
| Gallery | Six cards render from the array; slot 4 shows as "coming soon" |
| Print | `printDoc` emits all six sections; empty fields show the placeholder, not blank |
| Modes | `present` hides `.selfOnly`; `?facilitator=1` reveals run-sheet strips and the timer |
| Reduced motion | With the flag set, no animation runs and state still changes |
| Projector | Renders correctly at **1280×720**, no horizontal scroll, body text legible at the back of a room |
| Mobile | 390px wide, no horizontal scroll, rig usable by touch |

---

## 11 · The Wall — decide before B3

The only piece needing state the page can't hold. Three options:

| Option | Cost | Gets you |
|---|---|---|
| **Chat fallback ✦** | zero | Links go in the meeting chat; the workbook holds only `s3.link` locally. Works in all three venues today. |
| Artifact with a shared database | ~half a day | A real persistent wall across all three runs; Brisbane sees what Sydney made. Lives outside this file. |
| Google Sheet + form | ~1 hour | Persistent, ugly, and adds a sign-in step at the worst possible moment |

**Recommendation: ship the chat fallback for the first run, then decide.** If the wall is what people talk about afterwards, build the shared version for run two — the design doesn't change, only the plumbing.

---

## 12 · Build phases

| Phase | Scope | Exit criteria |
|---|---|---|
| **B1 — Shell** | File scaffold, gate script, tokens, inline `COP` engine (with the multi-tab fix), sticky header, progress bar, mode toggle, savebar, hero, pre-flight band, the spine, footer, print block. Hub card + `COURSES` entry. | Page loads behind the gate; a `data-key` field round-trips through reload; hub card enters it |
| **B2 — Station 2 first** | The Lighting Rig (SVG, eight states, presets, verdicts), triptych, 60-second audit with its reveal gate, before/after pair, kit ladder with placeholder pricing, Rodecaster encore band | Part 2 fully playable end to end. **The hardest thing, built first** — if the rig isn't good the whole page isn't |
| **B3 — Stations 1 & 3** | AEP Brief Builder + genericness meter + seeds + fallbacks, gallery array and grid, remix/iterate choice, wall band (chat fallback), commitment and next-CoP fields, print sheet | Page complete end to end; print output correct |
| **B4 — Facilitator layer & hardening** | Run-sheet strips, cut list, per-venue notes, session timer. Then: Playwright suite, projector pass at 1280×720, mobile pass, reduced-motion pass, image loading strategy, alt text audit, AA contrast check | All tests green; runs clean on a projector |
| **B5 — Content unblocks** | Slot 4 gallery tool built · AUD pricing confirmed · `s3-the-wall.jpg` re-rolled · gallery links collected · a full dry run against the clock | Ready for Brisbane |

**B1–B3 is one working session. B4 is half a session. B5 is Rupert's, not the build's** — and it's the phase that decides whether the session lands.

---

## 13 · Decisions needed before B1

| # | Decision | Default if you don't say |
|---|---|---|
| 1 | Self-contained single file, or import the Gen-2 engine? | ✦ Self-contained (§1) |
| 2 | Access code `cop2026`? | ✦ Yes — `Y29wMjAyNg==` |
| 3 | Accent — AIM blue `#2D7DD2`, or something the CoP owns outright? | ✦ Blue + amber |
| 4 | The Wall — chat fallback for run one? | ✦ Yes, revisit after Brisbane |
| 5 | Session timer in the facilitator layer? | ✦ Build it |
| 6 | Will you shoot a real four-state lighting progression on your own kit? | ✦ Assume no; build the triptych, leave the upgrade path open |
| 7 | Six gallery slots — which live links? Slot 4 still needs building. | ✦ Ship slot 4 as "coming soon" |
| 8 | AUD pricing for the four kit tiers | ✦ Blocked — placeholders until you supply |

---

## 14 · Risks in the build

| Risk | Mitigation |
|---|---|
| **The rig is the whole page and it's the hardest part.** An unconvincing plan-view diagram undermines a workbook about lighting. | Built first, in B2, with the real portraits carrying the "what it looks like" job so the SVG only has to carry the "where the lights go" job |
| Inlining everything makes one large file that's awkward to diff | Strict section order with `/* ═══ SECTION ═══ */` banners, matching the extras-page convention |
| Three venues, one file, no network state | Everything is local-first by design; nothing in the session depends on the page reaching a server |
| Gallery links rot between now and the third run | Build the array so a dead link degrades to the card without the Open button, rather than a broken page |
| `file://` clipboard restrictions in a venue where someone opens the file directly | `execCommand` fallback, plus the copy field is selectable so manual copy always works |
