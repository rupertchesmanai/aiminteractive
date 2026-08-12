# AI for Teamwork — Fun Extras Build Plan

**16 optional in-class games — two per module**, matching the Designing Workflows for Agentic AI pattern: an "Extras · optional" strip at the foot of each module page, each extra carrying a type tag, a punchy title and a **Launch** button that opens the game in a full-screen overlay. Playable together on the projector when there's time; equally playable solo in self-paced mode.

## House rules for every extra

- **5–8 minutes to play, zero setup.** One screen, big type, tap-to-play — designed to be projected. Facilitator reads nothing in advance.
- **Fun first, but every game smuggles in the module's core lesson** — and ends on a one-line "the point" card that hands back to the facilitator.
- **Reuses the component library** (flagset, sorter, reveal, timer, capture) plus a small shared `extras.js` engine: overlay shell, scoreboard, shuffle-order list, vote cards, spinner, branching scenario, bingo grid.
- **Ephemeral by default** — scores don't pollute course captures; a game can be replayed endlessly. (One exception noted in M8.)
- **Room-friendly mechanics:** most games work as "vote from your seats, then reveal" so a whole class plays one screen; every game also has a solo path.
- **Banner art for free:** each game headers with a cropped version of its module's existing live images — no extra image files needed (the unused alternates now live in `to-delete-images/`).

---

## Module 1 — Team Types & How AI Can Help

### 1A · Sorting Game — **"Which Team Is This?"**
Twelve rapid-fire team vignettes ("A pool of compliance analysts who share a Slack channel but deliver separately…", "A game studio strike team shipping a patch by Friday…") appear one at a time on a 20-second timer. The room calls solo / loosely connected / interdependent; a tap locks the answer, instant reveal with the one-line tell ("the tell: nobody's work blocks anyone else's"). Score out of 12 with streak bonuses. **The point:** you can't pick the right AI support until you've named the team type — and most real teams are messier than the label.
*Mechanics: card deck + timerchip + score. Banner: `m1-hero-three-team-zones.jpg (cropped)`.*

### 1B · Prediction Game — **"Friction Forecast"**
A team type + situation appears ("Loosely connected team; three analysts have each summarised the same customer research separately"). Players predict which failure mode hits first from four options (assumption error · duplicated work · lost context · misunderstanding cascade). Reveal shows the most likely culprit and *which AI support pattern from the module heads it off*. Six rounds, difficulty rising — the last two are hybrids sitting between team types.
*Mechanics: vote cards + reveal. Banner: `m1-spectrum-glass-wall.jpg (cropped)`.*

---

## Module 2 — Risks & the Human-Centred AI Workflow

### 2A · Detective — **"Spot the Fake"**
The big-brother of the module's flagset: a polished AI "minutes" document of the Portal Relaunch sync sits beside nothing at all — players must flag its five fabrications *from memory of the transcript they worked with in Activity 4.2's preview*, under a 90-second clock. Round two lets them open the transcript and catch the rest. Score compares "from memory" vs "verified" hit-rates. **The point:** the gap between those two scores *is* cognitive offloading — verification isn't optional because memory feels reliable and isn't.
*Mechanics: flagset (scored, 10 items) + timer + two-round scoreboard. Banner: `m2-hallucination-highlighter.jpg (cropped)`.*

### 2B · Puzzle — **"Loop in Order"**
Round 1: the six workflow steps appear shuffled; drag them into order against a 60-second clock (class version: the room shouts, one person drags). Round 2 is the sting: six real mishaps appear ("the summary invented a due date", "by prompt nine the AI forgot the audience") and each must be matched to the *single step that would have caught it*. **The point:** the loop isn't ceremony — every step exists because a specific failure walks through the gap it guards.
*Mechanics: shuffle-order list + match pairs. Banner: `m2-hero-sceptical-review.jpg (cropped)`.*

---

## Module 3 — Better-Prepared Attendees

### 3A · Guessing Game — **"Who's It For?"**
Five rewrites of the same short message flash up one at a time — each was tailored for Alex, Priya, Marcus, or two mystery personas ("a time-poor executive", "a brand-new starter"). The room votes who each version was written for, then the reveal explains the tells (structure, why-context, warmth, brevity, scaffolding). Perfect score requires noticing that one rewrite subtly *changed the meaning* — and that version scores zero for everyone, whoever they guessed. **The point:** adaptation is legitimate; alteration is not.
*Mechanics: card deck + vote + reveal with trap card. Banner: `m3-hero-four-communicators.jpg (cropped)`.*

### 3B · Roulette — **"Tone Roulette"**
A spinner pairs a random audience with a random constraint — "night-shift team × must land in 40 words", "new graduate × no jargon, keep the deadline firm", "your own manager × warm but not grovelling". Tables get 3 minutes with their LLMs to produce the message (human-verified, naturally), then read them aloud; the room votes a winner per spin. Two or three spins fit in eight minutes. **The point:** with a clear audience and constraint, AI iterates tone fast — and the room instantly hears which versions kept their meaning.
*Mechanics: spinner + timerchip + honour-system voting. Banner: `m3-wellbeing-handwritten-note.jpg (cropped)`.*

---

## Module 4 — Optimise Time Together

### 4A · Simulation — **"The 4:52 Message"**
A branching choose-your-path sequel to Activity 4.1. Rachel's vague Teams message lands; at each beat you choose from three replies (book the meeting now and look decisive / fire back six clarifying questions / send a knowledge-file summary and one confirmation ask). Choices branch across four beats to five different Monday-morning outcomes, from "triage meeting with the wrong ten people" to "fifteen-minute alignment that cancels itself". Class mode: majority vote picks each branch. **The point:** clarity-seeking *feels* slower and is faster — the best path is the one that invites Rachel to confirm, not approve.
*Mechanics: branching scenario engine (reveal + choice cards), outcome cards. Banner: `m4-badmeeting-drifting.jpg (cropped)`.*

### 4B · Card Game — **"Agenda or Anarchy"**
Build next week's 60-minute alignment meeting from a hand of 14 cards — attendees (each with a minutes "cost"), agenda items, pre-reads, and tempting extras ("status roundtable, 25 min", "AI-generated 40-slide context deck"). Budget: 60 minutes; the game totals your spend live. Lock your build and the consequence reveal scores it: what the meeting achieved, who was furious to be excluded, what the roundtable displaced. Several builds "win" — but every build with the status roundtable loses time for decisions. **The point:** meetings are a budget; every item and attendee has a cost someone else pays.
*Mechanics: budget-constrained card picker + consequence reveal. Banner: `m4-assumptions-disagreement.jpg (cropped)`.*

---

## Module 5 — Deeper Analysis & Thought Partners

### 5A · Speed Round — **"Hat Swap"**
A workplace statement appears ("We should pause Project Northstar"), the hat wheel lands on a colour, and the room has 30 seconds to respond *only in that hat's mode* — facts if white, risks if black, upside if yellow. Then the wheel swaps hats on the *same statement*. Six statements, hats forced against instinct (the optimist gets black, the sceptic gets yellow). Facilitator taps "good hat / wrong hat" for a room score. **The point:** the hats are a discipline, not a personality — anyone can think in any mode when the structure demands it.
*Mechanics: spinner + timerchip + tally. Banner: `m5-sixhats-felt-hats.jpg (cropped)`.*

### 5B · Dilemma Cards — **"Disclosure Dilemmas"**
Eight escalating scenario cards: "Your report was 80% AI-drafted. Your manager just praised your writing. Say something?" · "A teammate's analysis is clearly AI-generated and subtly wrong in a meeting. Now, or after?" The room votes disclose / stay quiet / it depends and the split shows as a live bar before discussion. No right answers scored — the game tracks how the room's votes shift across the cards, and shows the drift at the end. **The point:** almost every "stay quiet" gets less comfortable as stakes rise — transparency norms exist so individuals never face these cards alone.
*Mechanics: vote cards + live split bars + drift summary. Banner: `m5-transparency-open-laptop.jpg (cropped)`.*

---

## Module 6 — Change Management of AI Adoption

### 6A · Role-Play — **"The Town Hall"**
The Chronos town hall is open. The game throws objections in the authentic voice of each change persona — a Sceptic ("Show me the error rate of the system you're replacing ours with"), a Traditionalist ("The paper timesheets have worked for eleven years"), a Pragmatist, a Pioneer who's *too* keen. Teams take turns answering aloud in under 45 seconds; the room votes "landed / didn't land" and the reveal shows what that persona actually needed to hear (evidence · reassurance · pathway · guardrails). Eight objections, shuffled each play. **The point:** the same answer cannot land for all four personas — and hearing that live beats any slide.
*Mechanics: card deck + timer + vote + persona-need reveal. Banner: `m6-personas-four-reactions.jpg (cropped)`.*

### 6B · Sequencing — **"Kotter Scramble"**
Eight events from the hospital reform ("CFO shares the payroll error dashboard with all staff", "Ward 3 pilots mobile entry and error rate halves") arrive shuffled; place each on its Kotter step. Then the curveball round: the game removes one step from your sequence ("no short-term wins by week six") and asks the room to predict what breaks first — with the reveal tracing the failure cascade through the personas. **The point:** Kotter isn't a checklist, it's a load-bearing sequence; pull one step and the collapse is predictable.
*Mechanics: sorter (8 items × 8 steps) + failure-cascade reveal. Banner: `m6-frameworks-stepped-cards.jpg (cropped)`.*

---

## Module 7 — Other Use Cases for AI

### 7A · Race — **"Template Sprint"**
Teams race to produce three client onboarding summaries from the dataset using their LLMs. First team to submit stops the clock — but the winner is decided by the *verification round*: the game shows each submission against the raw data and the room hunts errors; every error adds a 60-second penalty to that team's time. Built-in trap: the dataset rows chosen contain the ambiguities (Lantern's un-done kickoff, Redgum's red health), so the fastest paste-and-pray usually loses to the team that checked. **The point:** in pro-forma work, verification *is* the speed — errors at scale cost more than checking ever does.
*Mechanics: timer + submission fields + error-hunt flagset + penalty scoreboard. Banner: `m7-template-forms-check.jpg`.*

### 7B · Judgement — **"What Got Lost?"**
Before/after pairs from tone transformations flash up: a formal policy line and its friendly rewrite. Buzz in (tap) on the pairs where the rewrite quietly weakened something — an obligation become a suggestion, a deadline gone soft, a "must" now a "should". Four of seven pairs have real losses; the others are clean. Instant reveal per pair with the lost phrase highlighted. **The point:** tone transformation is safe only when someone reads for obligations — warmth and precision are different axes.
*Mechanics: paired flagset with highlight reveal. Banner: `m7-tone-two-letters.jpg` (reuse).*

---

## Module 8 — Next Week Action Plan

### 8A · Pitch Game — **"The 60-Second Pitch"**
A big on-screen timer and three judge sliders. Each participant pitches their next-week experiment to their table in 60 seconds; peers score on three dials — *Small enough?* · *Yours to run?* · *Measurable?* — and the game averages the table's dials into a pitch score. Highest table score pitches to the whole room. The one game that touches course data: with one tap the pitcher can flash their `a81` plan on screen as pitch notes. **The point:** if you can't pitch it in a minute, it isn't small enough yet — and peer dials find vagueness faster than any facilitator.
*Mechanics: timerchip + three-slider judging + reads `a81_*` (read-only). Banner: `m8-experiment-pinboard.jpg (cropped)`.*

### 8B · Bingo — **"Pre-Mortem Bingo"**
A 4×4 bingo card of the ways next-week experiments actually die: "no protected time" · "success criteria says 'better'" · "AI step never verified" · "manager never briefed" · "scope grew by Wednesday" · "waited for the perfect moment". Everyone marks the squares *their* plan is genuinely vulnerable to — most honest card "wins" (fewest unmarked squares nobody believes). Each marked square flips to show its one-line countermeasure, straight from the day's modules. **The point:** it's a disguised pre-mortem — plans that name their failure modes on Friday survive the following week.
*Mechanics: bingo grid with flip-reveals; optional capture of top vulnerability into `a81_success` hint. Banner: `m8-hero-evening-plan.jpg (cropped)`.*

---

## Implementation

**Placement.** Each module page gains an `extras-strip` band after Key Takeaways, styled to match the agentic-ai convention: eyebrow "Extras", label "optional — if we have time", two cards each showing `Extra · <Type>` + title + **Launch**. Games open in a full-screen overlay (same pattern as the lightbox: `Esc` closes, focus-trapped, `body` scroll locked) so no navigation is lost mid-class.

**Shared engine (`assets/js/extras.js`, ~one new file).** Overlay shell + game registry, then small mechanics reused across games: timed card deck, vote-and-reveal, shuffle-order list, match-pairs, spinner, budget picker, branching scenario, live split bars, bingo grid, penalty scoreboard. Game content lives as plain JS data blocks inside each module page, so editing a question never touches the engine.

**Modes.** In Present mode, games show facilitator affordances (advance/reveal controls, room-vote framing). In Self-paced they play solo with taps instead of votes. Scores are ephemeral — nothing writes to `aft.capture` except 8A's read-only display of the plan and 8B's optional hint.

**Build order & effort.**

| Step | Scope | Est. |
|---|---|---|
| E1 | Extras strip styling + overlay shell + engine primitives (deck, vote, order, spinner, scoreboard) | 1 day |
| E2 | Modules 1–2 games (1A, 1B, 2A, 2B) — exercises deck/flagset/order mechanics | 0.5 day |
| E3 | Modules 3–4 games (3A, 3B, 4A, 4B) — spinner + branching + budget picker | 1 day |
| E4 | Modules 5–6 games (5A, 5B, 6A, 6B) — split bars + persona reveals + cascade | 0.5 day |
| E5 | Modules 7–8 games (7A, 7B, 8A, 8B) — penalty scoreboard + sliders + bingo | 0.5 day |
| E6 | QA: projector pass at 1280×720, mobile, keyboard/Esc, replay-ability, content accuracy vs modules | 0.5 day |
| | **Total** | **≈ 4 days** |

**Content guardrails.** All names fictional (reusing course cast — Rachel, the Chronos personas, the Portal Relaunch team keeps continuity and avoids new invention); game facts must trace to module content so extras never contradict the workbook; every game's closing card states the lesson in one line so facilitators can land it and move on.
