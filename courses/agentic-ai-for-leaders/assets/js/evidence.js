/* ============================================================
   Agentic AI for Leaders — evidence.js
   Single source of truth for the eight capstone artefacts:
   which capture keys make each artefact, how composite rows
   are assembled, and which signal keys mark an artefact done.
   Consumed by: index.html (Evidence Pack band + course map),
   pages/evidence-pack.html (the capstone centrepiece).
   Requires assets/js/site.js (window.AAL) loaded first.
   ============================================================ */
window.AALEV = (function () {
  'use strict';

  function g(k) { return window.AAL ? AAL.get(k) : ''; }
  function h(k) { return window.AAL ? AAL.has(k) : false; }

  /* ---------- composite row helpers (mirror the module pages) ---------- */

  /* M3 — the eight-decision sort board → "1:D · 2:C · …" */
  function m3board() {
    var parts = [];
    for (var i = 1; i <= 8; i++) {
      var v = g('m3.a31.d' + i);
      var l = v === 'Delegate' ? 'D' : v === 'Delegate with Constraint' ? 'C' : v === 'Non-delegable' ? 'N' : '';
      if (l) parts.push(i + ':' + l);
    }
    return parts.length ? parts.join('  ·  ') : '';
  }

  /* M5 — R/P/N judgement merged with its note */
  function m5crit(n) {
    var v = g('m5.own.c' + n);
    if (!String(v).trim()) return '';
    var note = g('m5.own.n' + n);
    return note ? v + ' — ' + note : v;
  }

  /* M6 — stop/continue + authority; element + note; workflow fallback */
  function m6stopauth() {
    var a = g('m6.sim.stop'), b = g('m6.sim.authority1');
    return a ? a + (b ? ' — authority: ' + b : '') : '';
  }
  function m6el(n) {
    var v = g('m6.map.e' + n);
    if (!String(v).trim()) return '';
    var note = g('m6.map.e' + n + 'n');
    return note ? v + ' — ' + note : v;
  }
  function m6workflow() { return h('m6.map.workflow') ? g('m6.map.workflow') : g('me.workflow'); }

  /* M7 — cadence signal row: signal — interval, owner / Trigger: … → action */
  function m7sig(n) {
    var s = g('m7.map.s' + n);
    if (!String(s).trim()) return '';
    var bits = [];
    if (h('m7.map.i' + n)) bits.push(g('m7.map.i' + n));
    if (h('m7.map.o' + n)) bits.push('owner: ' + g('m7.map.o' + n));
    var v = s + (bits.length ? ' — ' + bits.join(', ') : '');
    if (h('m7.map.t' + n)) v += '\nTrigger: ' + g('m7.map.t' + n) + (h('m7.map.a' + n) ? ' → ' + g('m7.map.a' + n) : '');
    return v;
  }
  function m7signal() { return g('m7.signal.ai') || g('m7.signal.name'); }

  /* ---------- the registry ---------- */
  /* rows: [label, key-string | resolver-function] */
  var ARTEFACTS = [
    { n: 1, short: 'Agency & Accountability Map', title: 'Points of Agency & Accountability Map',
      module: 'Module 1', move: 'Recognise', page: 'module-1.html', prefix: 'm1.', signals: ['me.workflow'],
      note: 'Where AI is already acting, influencing and deciding in your workflow — and what you do not yet know.',
      rows: [
        ['Workflow', 'me.workflow'],
        ['Status', 'me.workflowLive'],
        ['Starting point', 'm1.canvas.path'],
        ['Agentic behaviours present', 'm1.canvas.behaviours'],
        ['Where AI influences what happens next', 'm1.canvas.influence'],
        ['Decisions a person previously made', 'm1.canvas.accountability'],
        ['Unknown 1 — before I approve knowingly', 'm1.canvas.unknown1'],
        ['Unknown 2', 'm1.canvas.unknown2'],
        ['Unknown 3', 'm1.canvas.unknown3'],
        ['Where AI may already be acting for me', 'm1.a11.reflect']
      ] },
    { n: 2, short: 'Autonomy Snapshot', title: 'Autonomy Decision Snapshot',
      module: 'Module 2', move: 'Judge', page: 'module-2.html', prefix: 'm2.', signals: ['m2.snap.level'],
      note: 'The autonomy level you would allow, the condition it rests on, the trigger to revisit, and the defence.',
      rows: [
        ['The agent (shared case)', function () { return (window.AAL && AAL.countWith('m2.') > 0) ? 'Complaint Triage Agent' : ''; }],
        ['Case autonomy level', 'm2.snap.level'],
        ['The condition', 'm2.snap.condition'],
        ['The trigger', 'm2.snap.trigger'],
        ['The defence', 'm2.snap.defence'],
        ['My workflow — autonomy level', 'm2.a23.level'],
        ['My workflow — main value', 'm2.a23.value'],
        ['My workflow — lens that matters most', 'm2.a23.lens'],
        ['My workflow — why that lens', 'm2.a23.lenswhy'],
        ['My workflow — pause/withdraw trigger', 'm2.a23.trigger']
      ] },
    { n: 3, short: 'Boundary Map', title: 'Boundary Map',
      module: 'Module 3', move: 'Design', page: 'module-3.html', prefix: 'm3.', signals: ['m3.a31.d1'],
      note: 'What is delegated, what is constrained, what stays human — and the smallest task you would delegate first.',
      rows: [
        ['The eight decisions (D/C/N)', m3board],
        ['Must remain human — and why', 'm3.a31.mustremain'],
        ['The signal my boundary sends', 'm3.a31.signal'],
        ['Boundary design — decision', 'm3.a32.decision'],
        ['Authority', 'm3.a32.authority'],
        ['Threshold', 'm3.a32.threshold'],
        ['Escalation', 'm3.a32.escalation'],
        ['Ownership', 'm3.a32.ownership'],
        ['Stress test — efficiency', 'm3.a33.p1'],
        ['Stress test — drift', 'm3.a33.p2'],
        ['Stress test — accountability', 'm3.a33.p3'],
        ['Smallest delegable task', 'm3.a34.task'],
        ['Why this task', 'm3.a34.rationale'],
        ['What must remain human', 'm3.a34.human'],
        ['Escalation trigger', 'm3.a34.escalation'],
        ['My leadership position', 'm3.a34.statement']
      ] },
    { n: 4, short: 'Observability Map', title: 'Observability Readiness Map',
      module: 'Module 4', move: 'Sustain', page: 'module-4.html', prefix: 'm4.', signals: ['m4.a42.commit'],
      note: 'What you must be able to see to remain accountable — and the 30-day commitment that makes it real.',
      rows: [
        ['Workflow', 'me.workflow'],
        ['What the log gave me', 'm4.a41.present'],
        ['What was missing', 'm4.a41.missing'],
        ['Least defensible explanation', 'm4.a41.leastdef'],
        ['Observable information I require', 'm4.a42.info'],
        ['My top 2–3 must-haves', 'm4.a42.musthave'],
        ['My 30-day commitment', 'm4.a42.commit'],
        ['Partners for the conversation', 'm4.a42.partners'],
        ['My visibility requirement (share)', 'm4.a42.share']
      ] },
    { n: 5, short: 'Workflow Embedding Map', title: 'Workflow Embedding Map',
      module: 'Module 5', move: 'Require & refuse', page: 'module-5.html', prefix: 'm5.', signals: ['m5.own.verdict'],
      note: 'The readiness assessment — proposal and own context — and the honest call on whether the workflow deserves the agent.',
      rows: [
        ['Hardest Day-1 decision to sustain', 'm5.reflect'],
        ['First instinct on the proposal', 'm5.instinct'],
        ['Proposal — where ready', 'm5.lab.ready'],
        ['Proposal — where not ready (and who must fix it)', 'm5.lab.notready'],
        ['Proposal — value real vs assumed', 'm5.lab.value'],
        ['I would require before approval', 'm5.lab.require'],
        ['I would refuse', 'm5.lab.refuse'],
        ['My workflow — explicit actions & decisions', function () { return m5crit(1); }],
        ['My workflow — handovers & escalation', function () { return m5crit(2); }],
        ['My workflow — observability', function () { return m5crit(3); }],
        ['My workflow — value & reversibility', function () { return m5crit(4); }],
        ['My workflow — value real or assumed', 'm5.own.value'],
        ['The honest readiness call', 'm5.own.verdict']
      ] },
    { n: 6, short: 'Escalation Design Map', title: 'Escalation Design Map',
      module: 'Module 6', move: 'Intervene & escalate', page: 'module-6.html', prefix: 'm6.', signals: ['m6.map.call'],
      note: 'Who can stop or constrain the workflow, under what conditions, on whose authority — and the honest readiness call.',
      rows: [
        ['The workflow', m6workflow],
        ['Simulation — my role', 'm6.sim.role'],
        ['Simulation — stop or continue, and authority', m6stopauth],
        ['Simulation — first 60 minutes', 'm6.sim.sixty'],
        ['Simulation — who authorised each action', 'm6.sim.authfinal'],
        ['Escalation triggers', function () { return m6el(1); }],
        ['Stop conditions', function () { return m6el(2); }],
        ['Intervention paths', function () { return m6el(3); }],
        ['Accountability ownership', function () { return m6el(4); }],
        ['Intervention window', 'm6.map.window'],
        ['Honest readiness call', 'm6.map.call'],
        ['What would change it', 'm6.map.change']
      ] },
    { n: 7, short: 'Governance Cadence Map', title: 'Governance Cadence Map',
      module: 'Module 7', move: 'Govern & sustain', page: 'module-7.html', prefix: 'm7.', signals: ['m7.signal.name'],
      note: 'The leadership rhythm that keeps an agent governed over time — minimum, not maximum.',
      rows: [
        ['The agent', 'm7.map.agent'],
        ['Signal 1', function () { return m7sig(1); }],
        ['Signal 2', function () { return m7sig(2); }],
        ['Signal 3', function () { return m7sig(3); }],
        ['Signal 4', function () { return m7sig(4); }],
        ['Signal 5 — the people signal', function () { return m7sig(5); }],
        ['The one signal I am not watching', m7signal],
        ['Who owns watching it', 'm7.signal.owner'],
        ['Trigger', 'm7.signal.trigger'],
        ['Action', 'm7.signal.action'],
        ['Who should be involved', 'm7.signal.who'],
        ['Why this response is proportionate', 'm7.signal.why']
      ] },
    { n: 8, short: 'Executive Decision', title: 'The Executive Decision',
      module: 'Module 8', move: 'Decide & Own', page: 'module-8.html', prefix: 'm8.', signals: ['m8.decision.choice'],
      note: 'The whole course in one call: eight reasoning questions, one decision, the evidence, the trigger, the defence.',
      rows: [
        ['The workflow', 'm8.dec.workflow'],
        ['1 · Trusted to do', 'm8.br.q1'],
        ['2 · Decision rights transferred', 'm8.br.q2'],
        ['3 · Evidence of reliability', 'm8.br.q3'],
        ['4 · Constrain or revoke when', 'm8.br.q4'],
        ['5 · Leaders must be able to see', 'm8.br.q5'],
        ['6 · Hard-to-reverse harms', 'm8.br.q6'],
        ['7 · Governance before scaling', 'm8.br.q7'],
        ['8 · The defence under challenge', 'm8.br.q8'],
        ['THE DECISION', 'm8.decision.choice'],
        ['The evidence', 'm8.decision.evidence'],
        ['The trigger', 'm8.decision.trigger'],
        ['The defence', 'm8.decision.defence'],
        ['Strongest part of my defence', 'm8.close.strong'],
        ['Weakest / least-evidenced part', 'm8.close.weak'],
        ['Challenge that sharpened my thinking', 'm8.close.challenge'],
        ['To strengthen before defending it at work', 'm8.close.strengthen']
      ] }
  ];

  /* ---------- shared queries ---------- */

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function rowVal(row) { return typeof row[1] === 'function' ? row[1]() : g(row[1]); }

  /* filled / total / gaps for one artefact */
  function stat(a) {
    var filled = 0;
    a.rows.forEach(function (r) { if (String(rowVal(r)).trim()) filled++; });
    return { filled: filled, total: a.rows.length, gaps: a.rows.length - filled };
  }
  /* done = every signal key present; started = any capture under the prefix */
  function state(a) {
    var done = a.signals.every(h);
    var started = done || (window.AAL && AAL.countWith(a.prefix) > 0);
    return done ? 'done' : started ? 'started' : 'ghost';
  }
  /* pack-wide totals */
  function packStat() {
    var filled = 0, total = 0, doneCount = 0;
    ARTEFACTS.forEach(function (a) {
      var s = stat(a); filled += s.filled; total += s.total;
      if (state(a) === 'done') doneCount++;
    });
    return { filled: filled, total: total, gaps: total - filled, done: doneCount };
  }

  /* rows → HTML (screen '.ap-row' or print '.pd-row') */
  function rowsHtml(a, cls) {
    return a.rows.map(function (r) {
      var v = rowVal(r);
      var has = String(v).trim() !== '';
      var val = has ? esc(v) : '<em>Not yet answered — this gap is a finding.</em>';
      if (cls === 'pd') return '<div class="pd-row"><div class="pd-label">' + r[0] + '</div><div class="pd-value">' + (has ? esc(v).replace(/\n/g, '<br>') : '<em>Not yet answered — this gap is a finding.</em>') + '</div></div>';
      return '<div class="ap-row"><div class="k">' + r[0] + '</div><div class="v">' + val + '</div></div>';
    }).join('');
  }

  /* the full pack as one print document */
  function packHtml() {
    return ARTEFACTS.map(function (a) {
      var s = stat(a);
      return '<h2>' + a.n + ' · ' + a.title + ' <span style="font-weight:400;font-size:11px;color:#666">(' + a.module + ' · ' + a.move + (s.gaps ? ' · ' + s.gaps + ' gap' + (s.gaps > 1 ? 's' : '') + ' = findings' : ' · complete') + ')</span></h2>' + rowsHtml(a, 'pd');
    }).join('');
  }

  return { ARTEFACTS: ARTEFACTS, stat: stat, state: state, packStat: packStat, rowsHtml: rowsHtml, packHtml: packHtml, rowVal: rowVal };
})();
