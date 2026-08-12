# AI for Teamwork — Missing Image + Wow-Factor Prompts

Two parts: **the one missing asset** (the Template Sprint banner), and **a wow-factor set** — each mapped to a real slot in the workbook, so nothing here is art for art's sake. House style throughout: photorealistic Hasselblad, warm natural light, AIM teal `#00C0AF` / cream `#F1EEDE` / coral `#DC5A46` as environmental accents, `--style raw --v 7`.

**Ethnicity criteria:** every prompt below is people-free or hands-only, and every hand specifies diverse skin tone explicitly. Re-roll anything where Midjourney adds uninvited background figures, or add `--no people`.

---

## Part 1 — The missing banner

### `x7a-template-sprint.jpg` — Race · "Template Sprint"

The game is live and currently borrowing `m7-template-forms-check.jpg`. Save either option below over the filename `x7a-template-sprint.jpg` into `assets/media/pics/` and tell me — it's a one-line swap in module-7.

**Option A — Stopwatch on the forms** *(the original — speed vs accuracy)*
```
Photorealistic Hasselblad photograph of a classic analogue stopwatch lying on a stack of identical crisp printed forms, beside a coral-red correction pen that has circled one small error, dramatic raking light across the paper texture, speed-versus-accuracy tension, macro editorial still life, shot on Hasselblad X2D 100C with XCD 120mm f/3.5 macro lens, f/4, no readable text --ar 16:9 --style raw --v 7
```

**Option B — The relay baton** *(new take — the race is a handover)*
```
Photorealistic Hasselblad photograph of a polished teal relay baton lying diagonally across a stack of crisp identical printed forms on a dark desk, a coral stopwatch beside it frozen at speed, one sheet slightly askew revealing a single circled error beneath, dramatic low raking light, sprint-versus-checking tension, conceptual editorial still life, no readable text --ar 16:9 --style raw --v 7
```

---

## Part 2 — Wow factor

### W1 · Module-hero cinemagraphs — the single biggest upgrade

The hub already has its living video masthead; the module pages still open on stills. Animating even **three marquee heroes** into 10–15 second loops makes the whole workbook feel alive as you move through the day. No new stills needed — feed each existing hero into Midjourney video / Runway / Kling with its motion prompt, export a loop, and I'll wire them into the existing `.hero-media` slots exactly like the hub (WebM+MP4, reduced-motion safe, poster fallback).

**Module 1 — `m1-hero-three-team-zones.jpg`**
```
Motion: the three team zones stay anchored while life moves differently in each — papers shift gently in one, a chair swivels slightly in another, light through the windows slowly warms; slow 2% push-in, nothing leaves frame, seamless loop
```

**Module 4 — `m4-hero-golden-hour-meeting.jpg`**
```
Motion: golden-hour light slowly crawls across the table, dust motes drift in the sunbeam, a page corner lifts once in a faint breeze, steam rises from a coffee cup; locked-off camera, seamless loop
```

**Module 6 — `m6-hero-hospital-corridor.jpg`**
```
Motion: fluorescent light flickers once far down the corridor, a door swings gently at the distant end, dawn light through side windows brightens almost imperceptibly; very slow dolly forward, seamless loop
```

*(Any other module hero can take the same treatment — the recipe is: one small physical motion + one light change + locked or barely-moving camera.)*

### W2 · Social share image — `og-share.jpg` *(a real gap: the site has no og:image)*

When anyone shares the workbook link in Slack, Teams or LinkedIn, it currently unfurls with no image. One asset fixes every share. Composed with dead space on the left for the title overlay I'll add, then wired into every page's `<head>` as `og:image` / `twitter:card`.
```
Epic cinematic photograph of hundreds of glowing threads of teal, blue and warm coral light weaving into one luminous braided current flowing left to right across a deep charcoal background, the braid concentrated in the right two-thirds of frame leaving calm dark negative space on the left, volumetric glow, drifting light particles, monumental and abstract, extreme detail --ar 16:9 --style raw --v 7
```
*(Deliberately matches your chosen Weave hero, so the share card and the site masthead read as one brand.)*

### W3 · Print cover for "My Teamwork Plan" — `myplan-print-cover.jpg`

My Plan is the page people print and take back to work. A full-bleed A4 cover page turns that printout into a document that feels worth keeping — and I can add it to the print stylesheet so it only appears on paper.
```
Photorealistic Hasselblad overhead photograph of a single cream A4 notebook closed on a beautiful dark walnut desk, a teal ribbon bookmark emerging from its pages, one fountain pen aligned beside it and a small coral sticky tab on the cover edge, generous empty desk space in the upper third for a printed title, soft directional morning window light, calm premium stationery flat-lay, shot on Hasselblad X2D 100C with XCD 55mm f/2.5 lens, f/8, no readable text --ar 3:4 --style raw --v 7
```

### W4 · Classroom poster — `poster-teamwork-a2.jpg`

Wow in the room, not just on screen: an A2 wall poster for the training space — the Weave motif with clear space for the course title and the day's loop (Frame → Draft → Verify → Rewrite). Print it once, use it every cohort.
```
Epic cinematic vertical photograph of luminous teal, blue and coral threads of light rising from the bottom of frame and weaving into a single bright braided column, deep charcoal background, the braid occupying the lower two-thirds with calm dark negative space across the top third for poster typography, volumetric glow, drifting particles, monumental abstract elegance, extreme detail --ar 2:3 --style raw --v 7
```

### W5 · "Monday, 7:04am" closing band — `m8-monday-dawn.jpg`

Module 8 ends with the plan and the calendar invite; this adds an emotional full-width band right before the pager — the morning the experiment begins. One wide image, five minutes to wire in.
```
Epic cinematic photograph of a city skyline at first light on a Monday morning seen across calm water, office towers with a scattering of early-lit windows, the sky graduating from deep teal night into warm coral-gold dawn, mist on the water, one ferry crossing leaving a silver wake, hopeful beginning-of-the-week atmosphere, shot on Hasselblad H6D-100c with HC 50mm f/3.5 lens, long depth --ar 21:9 --style raw --v 7
```

### W6 · Access-gate welcome moment — `gate-door-handle.jpg` *(optional, small but charming)*

The first thing participants ever see is the access-code screen. A single warm image beside the code field turns a security step into an invitation — the door to the workshop, about to open.
```
Photorealistic Hasselblad macro photograph of a warm brass door handle on a heavy timber conference-room door, the door open just a few centimetres releasing a blade of warm teal-tinted light from the room beyond, soft focus hallway in the foreground, anticipation and welcome, shallow depth of field, shot on Hasselblad X2D 100C with XCD 90mm f/2.5 lens, f/2.8 --ar 3:2 --style raw --v 7
```

---

## Suggested order of attack

| Priority | Asset | Why first |
|---|---|---|
| 1 | `x7a-template-sprint.jpg` | The only true gap — completes the 16-game set |
| 2 | `og-share.jpg` | Every shared link looks broken-ish without it; one image fixes all pages |
| 3 | W1 cinemagraphs (M1, M4, M6) | Biggest felt upgrade per minute of effort |
| 4 | `myplan-print-cover.jpg` | Elevates the one artefact participants keep |
| 5 | W4 poster / W5 dawn band / W6 gate | Delightful, zero-risk extras |

Drop any of these into `assets/media/pics/` (videos into `assets/media/mp4/`) with the filenames above and tell me which ones you've generated — wiring each into its slot is a small, tested change, same deploy pipeline as always.
