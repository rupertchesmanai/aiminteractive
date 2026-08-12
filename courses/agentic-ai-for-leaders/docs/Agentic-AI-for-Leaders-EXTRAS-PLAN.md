# Agentic AI for Leaders — Extras Plan (Phase 12)

**Two optional games per module — an entertaining end to every module, in the style of the Designing Workflows for Agentic AI extras.** Sixteen games total. Drafted 11 August 2026; sibling-course lessons (16 shipped games) folded in.

---

## 1. Principles

- **Entertainment first, curriculum underneath.** Every game is fun on its own terms — streaks, timers, bets, detective work — but every right answer is anchored in the module's verbatim canon (the FG/Activity WB lines already extracted for the module builds). A student who just played should be *sharper* in the debrief, not just amused.
- **The wind-down slot.** Games sit at the *end* of each module page, after the artefact panel and takeaways — the reward after the work. 3–6 minutes each; instant restart; no wrong way to play.
- **Solo-first with a facilitator layer** (proven pattern): games work self-paced; `?facilitator=1` reveals a short `fac-note` (when to run it in the room, what argument to let happen).
- **Never pollute progress.** All game state lives under `x.` keys (`x.m1.verbhunt.best`) — outside every module prefix, exactly like `_clock.m4`, so TOTALS, evidence signals and the Evidence Pack are untouched.
- **Lightweight and self-contained.** Each game is its own page in `pages/extras/`, gate-guarded like every other page, using the site's design tokens but with no dependency on module pages. Target 25–45KB, no photos — type, colour and motion do the work (sibling course proved this reads as premium, not cheap).
- **Randomise everything randomisable.** Sibling-course lesson (Headline Hunter): fixed option orders get memorised — shuffle option arrays every run, keep indices consistent post-shuffle.
- **Designed answers get proven, not assumed.** Any game with an optimal strategy (allocators, sims, mazes) gets its decision space brute-forced in the test harness so the intended optimum is *provably* unique before it ships.

## 2. Architecture

- **`pages/extras/x-m<N>-<slug>.html`** — sixteen standalone pages.
- **Extras strip component** — a shared block appended to each module page after the takeaways/quoteband: dotted divider, `EXTRAS · OPTIONAL — SELF-PACED` eyebrow, two black tiles (teal `EXTRA · <FORMAT>` tag, title, one-line hook, `Launch →`) matching the sibling course's strip anatomy exactly. Best-score chip appears on a tile once `x.mN.*.best` exists.
- **Hub Extras band** — the reserved placeholder band on the course hub un-hides: one row linking to a small `pages/extras/index.html` arcade menu (all 16 tiles + scores). Cheap to build once the strips exist.
- **Engine reuse** — games load `site.js` for the gate/glossary/mode chrome but manage their own state; scores via `AAL.set('x.…')`.

## 3. The sixteen games

### Module 1 · When AI Begins to Act — *Recognise*
| | |
|---|---|
| **The Verb Hunt** · `EXTRA · REACTION GAME` | Sentences about workplace systems scroll past, one at a time, speeding up. Slap the button the instant the verb crosses from *assisting* (drafts, suggests, summarises) to *acting* (routes, closes, approves, escalates). Streak scoring, three lives, "the verb is the tell" takeaway. Canon: M1's acting/influencing/deciding split. |
| **Where Did the Human Go?** · `EXTRA · SPOT THE DIFFERENCE` | Two versions of the same workflow diagram, six rounds. Each round, one human checkpoint has quietly vanished — find it before the timer dies. Final round: nothing was removed (the trap — false alarms cost). Canon: "decisions move further from human control while accountability stays exactly where it was." |

### Module 2 · Defensible Agentic AI Decisions — *Judge*
| | |
|---|---|
| **The Confidence Con** *(new cases, familiar villain)* · `EXTRA · BLUFF GAME` | Eight agent claims, each dressed in a confident number ("94% accurate", "87% confident"). Bet chips on *defensible* or *restates itself*. House edge: the numbers that sound like evidence but only describe the system's certainty about its own output. Canon: the Content WB's "87 per cent confident simply restates…" line. |
| **Four Lenses Snap** · `EXTRA · SORTING SPRINT` | Rapid-fire statements snap to Trust & Stability / Failure Consequence / Control & Recoverability / Trade-off Reality. 45 seconds, combo multiplier, sudden-death final five. Canon: the Four Autonomy Decision Lenses verbatim. |

### Module 3 · Delegation and Boundaries — *Design*
| | |
|---|---|
| **Hold the Line, Under Pressure** · `EXTRA · PRESSURE GAME` | Twelve delegation calls (fresh decisions, not the A3.1 eight) at ten seconds each — but between rounds, pressure events land: *"Efficiency is up 30%, loosen the boundary?"* Accepting pressure buys points now, costs defensibility at the audit reveal. Canon: A3.3's three stress-test pressures. |
| **Boundary Creep** · `EXTRA · VIGILANCE GAME` | Ten weeks tick past on an ops dashboard. The agent's scope grows in tiny, plausible increments — catch each creep the week it happens; miss three and the boundary you drew no longer exists. End card shows your drawn boundary vs what's actually running. Canon: "Nobody approved a few more low-severity classifications. Yet they happened." |

### Module 4 · Observability — *Sustain*
| | |
|---|---|
| **The Missing Log** · `EXTRA · DETECTIVE GAME` | A regulator asks one question. You get a decision log with 14 fields — pick the *three* you'd stake the answer on, then watch the cross-examination play out. Some fields look rich but prove nothing (timestamps, confidence); the defensible picks are the reasoning trail. New case, same DNA as CT-2025-118342. |
| **Vendor Bingo** · `EXTRA · BLUFF GAME` | A vendor demo makes nine observability claims. Mark each *verifiable* or *bingo* (sounds great, shows nothing). Full-house reveal explains what to demand in writing. Canon: A4.2's "record of what the agent decided and when" ≠ reasoning. |

### Module 5 · Workflow Readiness — *Require & refuse*
| | |
|---|---|
| **The Twenty-Second Committee** · `EXTRA · SPEED ROUND` | Eight one-paragraph proposals, twenty seconds each: Approve / Approve with conditions / Refuse. Designed answers scored; the trap proposals hide missing escalation paths behind glossy pilot stats. Canon: the four readiness criteria; "conditions added later never arrive." |
| **The Reversibility Maze** · `EXTRA · PUZZLE` | Route a case through a workflow map from intake to exit. Every path works — but wrong calls lock in at different points. Find the route that keeps the most catch-points alive before the harm is irreversible. Decision space brute-forced; unique optimum. Canon: "reversibility is a workflow property." |

### Module 6 · Intervention Readiness — *Intervene & escalate*
| | |
|---|---|
| **The 3:17 Drill** · `EXTRA · REACTION SIM` | The incident feed replays in compressed time — at each timestamp: act, wait, or escalate. Acting too early burns credibility; too late burns the intervention window. Score = minutes of window preserved. New incident, same clock discipline as A6.1. |
| **Who Can Actually Stop It?** · `EXTRA · GUESSING GAME` | Eight stop-the-agent scenarios; six plausible role cards each. Pick who *really* holds the authority. Traps: the room where everyone assumed someone else, the vendor who owns the only kill switch. Canon: intervention paths + cross-functional ownership. |

### Module 7 · Governing Autonomy Over Time — *Govern & sustain*
| | |
|---|---|
| **Drift Detector** · `EXTRA · SIGNAL GAME` | Monthly metric charts scroll past a watch-floor console. Click when drift is real; hold when it's noise or seasonality. False alarms cost credibility, misses cost the boundary. Threshold logic mirrors the sample map's "3 points off baseline, two consecutive months." |
| **The Cadence Budget** · `EXTRA · ALLOCATOR` | Twelve attention-points to spread across five signals × review intervals, then twelve simulated months. Overwatch one signal and another rots. The people-signal is the designed trap — neglect it and capability decays silently until an incident no one can handle. Allocation space brute-forced; the unique optimum requires funding the signal most players skip. |

### Module 8 · Executive Leadership Stance — *Decide & Own*
| | |
|---|---|
| **The Challenge Gauntlet** · `EXTRA · GAUNTLET` | Board, regulator, workforce and customer fire questions in turn. Three response cards each: one evasive, one over-promising, one defensible. Survive all twelve to face the final question with no cards at all — type one sentence, then see the model answer. Canon: A8.2's challenge roles and question banks. |
| **Four Doors, Six Cases** · `EXTRA · SPEED ROUND` | Six mini-dossiers with planted evidence gaps; forced call each: Deploy / Scale / Constrain / Withdraw. At least one designed Withdraw ("Withdraw is not a failure") and one where the gap *is* the answer. Score vs designed verdicts with near-miss credit; tier names worth replaying for. Canon: the four decisions verbatim + gaps-are-findings. |

## 4. Build phases

| Phase | Scope | Exit |
|---|---|---|
| **E1** | Extras shell: `pages/extras/` scaffold, shared strip component injected into all 8 module pages, tile styling, `x.` score plumbing, facilitator layer + **M1 pair** | Strip live on all pages (M2–M8 tiles marked "coming soon" or hidden); M1 games playable, tested |
| **E2** | **M2 + M3 pairs** (4 games) | Day-1 first half complete |
| **E3** | **M4 + M5 pairs** (4 games) | Day 1 complete + committee/maze optima brute-forced |
| **E4** | **M6 + M7 pairs** (4 games) | Drill timing tuned; Cadence Budget optimum proven unique |
| **E5** | **M8 pair** + hub Extras band + `extras/index.html` arcade menu + full test pass | All 16 live; harness green; screenshots review gate |

Each phase: build → headless harness (canon wording verbatim, designed answers, shuffle checks, brute-force where applicable, score persistence under `x.` only, no TOTALS pollution) → screenshots → device commit with `.pre-e<N>.bak` backups.

## 5. Open questions for Rupert (none blocking E1)

1. Tile placement: after the quoteband (recommended — true "end of module") or between artefact and takeaways?
2. Best-score chips on tiles: show, or keep tiles clean?
3. A seventeenth course-wide finale (Gauntlet-style certificate game like the sibling course's planned pair) — want one here too, or keep it to 16?
