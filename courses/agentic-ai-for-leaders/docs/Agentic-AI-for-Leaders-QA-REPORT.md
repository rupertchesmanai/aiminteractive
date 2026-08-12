# Agentic AI for Leaders — Phase 11 QA Report

**Date:** 11 August 2026 · **Build:** Phases 0–10 complete · **Verdict: PASS — signed off by Rupert 11 Aug 2026. LAUNCH-READY.**

## Automated test battery — all green

13 suites, ~350 checks, run headless (Chromium) against a local HTTP server:

| Suite | Covers | Result |
|---|---|---|
| test-gate | Access gate, wrong/right code, session grant, deep-link bounce | ALL PASS |
| test-phase1 | Capture engine: autosave, progress, reveals, export/import, glossary, printDoc | ALL PASS |
| test-phase2 | Course hub: arc, evidence band, course map, day filter, resume | ALL PASS |
| test-phase3 | Welcome / how-to-use / foundations / references | ALL PASS |
| test-phase4 | Module 1 | ALL PASS |
| test-phase5 | Modules 2–3 | ALL PASS |
| test-phase6 | Module 4 + Day-1 integration (fresh student M1→M4, JSON round-trip) | ALL PASS |
| test-phase7 | Modules 5–6 (incl. staged simulation) | ALL PASS |
| test-phase8 | Modules 7–8 (incl. Reasoning Bridge live evidence) | 52/52 |
| test-phase9 | Evidence Pack + evidence.js registry + hub migration | 38/38 |
| test-phase10 | Hero loop, reduced-motion, favicon/meta/OG, asset budgets | 16/16 |
| qa-fidelity | Source fidelity (see below) | 15/15 |
| qa-playthrough | Phase-11 checklist sweep (see below) | 25/25 |

## PLAN §11 checklist results

- **Fidelity vs FG / Activity Workbook** — every module name (H1 + hub card) matches the FG verbatim; every activity number/name present (1.1–8.2); case facts verified verbatim: Complaint Triage pilot numbers **87 / 82 / 9%**, M4 decision log (CT-2025-118342, confidence 0.87, BILL-07, Reopened 14 Oct 2025, CLOSED AUTO), M5 proposal (~800 applications/week, 94%, 3d→4h, "AI-powered onboarding automation platform", "legally required to refuse"), M6 incident timeline (2:47 PM, 71%→84%, 9,600 cases, 48h, updates at 3:17 and 3:42), M7 twelve-months signals, M8 four decisions with verbatim hint lines; all framework elements (Four Lenses, Four Criteria, Four Elements, Four Signals + trigger ladder, Six Readiness Lenses); all eight artefact names.
- **Capture / Evidence Pack** — full fill → 8/8 artefacts done, 99/99 evidence rows → full-pack PDF renders all eight artefacts → JSON export/import round-trips exactly on a fresh browser → reset clears `aal.capture` + `aal.last` (confirm-guarded; current page re-records as resume point by design).
- **Reveal gating** — fresh state: every gated reveal locked; disabled commits cannot force a reveal; revealed state survives refresh.
- **Modes & filters** — self-paced/present toggle verified (selfOnly/presentOnly); hub day filter; M4 "Flexible" chip present.
- **Keyboard-only** — M3 sort board fully operable by arrow keys; M6 role cards by Space and commits by Enter; M8 decision cards by arrow keys; `:focus-visible` styles present on all custom controls.
- **Reduced motion** — hero loop strips autoplay, pauses, offers a "Play video" button; M6 timers auto-disable (phase 7 suite).
- **Responsive** — all 14 pages checked at 1440 / 820 / 390 px: zero horizontal overflow, zero JS errors.
- **Print pass** — all nine PDFs verified: eight artefact documents (titles + row counts 10/10/16/9/13/12/12/17 + AIM branding) plus the full Evidence Pack (8 sections, 100 rows incl. cover status line).
- **The gate, end-to-end** — locked deep link bounces to the top hub, modal auto-opens, wrong code rejected, `leaders2026` enters.
- **file:// limitation** — documented in How to use this site (hosted address recommended). ✓ already in place.
- **Hub card** — already visible on the top-level AIM Interactive Workbooks page with the `leaders2026` code wired. ✓ nothing to un-hide.

## Remaining manual items (cannot be automated in this environment)

1. **Cross-browser spot-check** — the automated battery runs on Chromium only. Recommend a 10-minute human pass in Safari and Firefox: hub hero video plays, one module's reveals, one PDF print dialog. (The patterns are identical to RAIL, which is proven in both.)
2. **Real print dialogs** — automated checks verify the print document structure; a human print-to-PDF from Safari/Chrome on one artefact confirms pagination looks right on paper sizes.
3. **iPad hardware** — width-820 emulation is green; a quick scroll-through on a physical iPad is good hygiene before a cohort.

## Launch checklist

- [x] **Hosting confirmed** — same host as the existing courses; the whole `AIM Interactive Workbooks` folder ships together (11 Aug 2026).
- [ ] `og:image` made absolute — deferred until a public base URL exists (currently relative: `assets/pics/og-share.jpg`; harmless meanwhile — link previews simply omit the image).
- [x] **Pre-launch sign-off** — given by Rupert, 11 Aug 2026, pending his own Safari/Firefox and print spot-checks per the manual-items list above.
- [ ] Hand the `leaders2026` code to AIM (Rupert, when ready).
- [ ] Optional post-launch: prune `.pre-p*.bak` backup files once approved.
