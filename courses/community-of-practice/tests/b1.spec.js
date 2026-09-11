const { chromium } = require('playwright');
const path = require('path');

const ROOT = 'http://127.0.0.1:8899';
const PAGE = ROOT + '/courses/community-of-practice/index.html';
const GRANT = { name: 'granted' };

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? '  → ' + extra : '')); }
}

async function grantedPage(browser, query = '') {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  // seed sessionStorage on the right origin before the gate runs
  await p.goto(ROOT + '/index.html');
  await p.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
  await p.goto(PAGE + query);
  return { ctx, p };
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  console.log('\n── 1. Gate ──');
  {
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await p.goto(PAGE);
    await p.waitForLoadState('domcontentloaded');
    ok('un-granted load bounces to hub with ?course=', p.url().includes('index.html?course=community-of-practice'), p.url());
    await ctx.close();
  }
  {
    const { ctx, p } = await grantedPage(browser);
    ok('granted load renders the page', p.url().endsWith('/courses/community-of-practice/index.html'), p.url());
    ok('title present', (await p.title()).includes('Build it. Light it. Show it.'));
    await ctx.close();
  }

  console.log('\n── 2. No console errors ──');
  {
    const { ctx, p } = await grantedPage(browser);
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|404/.test(m.text())) errors.push(m.text()); });
    await p.waitForTimeout(600);
    ok('no JS errors on boot', errors.length === 0, errors.join(' | '));
    ok('window.COP exposed', await p.evaluate(() => typeof window.COP === 'object'));
    await ctx.close();
  }

  console.log('\n── 3. Capture round-trip (B1 exit criterion) ──');
  {
    const { ctx, p } = await grantedPage(browser);
    await p.check('input[data-key="pf.studio"]');
    await p.check('input[data-key="pf.idea"]');
    await p.waitForTimeout(250);
    const stored = await p.evaluate(() => JSON.parse(localStorage.getItem('cop.capture') || '{}'));
    ok('checkbox writes to cop.capture', stored['pf.studio'] === '1' && stored['pf.idea'] === '1', JSON.stringify(stored));
    ok('unchecked key absent', stored['pf.kit'] === undefined);

    await p.reload();
    await p.waitForTimeout(300);
    ok('restores after reload', await p.isChecked('input[data-key="pf.studio"]'));
    ok('unchecked stays unchecked', !(await p.isChecked('input[data-key="pf.kit"]')));

    // uncheck deletes rather than storing empty
    await p.uncheck('input[data-key="pf.studio"]');
    await p.waitForTimeout(200);
    const after = await p.evaluate(() => JSON.parse(localStorage.getItem('cop.capture') || '{}'));
    ok('unchecking deletes the key', after['pf.studio'] === undefined, JSON.stringify(after));
    await ctx.close();
  }

  console.log('\n── 4. Progress bar ──');
  {
    const { ctx, p } = await grantedPage(browser);
    ok('starts at 0 / 12', (await p.textContent('#progLabel')).trim() === '0 / 12');
    await p.check('input[data-key="pf.studio"]');
    await p.waitForTimeout(250);
    ok('advances to 1 / 12', (await p.textContent('#progLabel')).trim() === '1 / 12', await p.textContent('#progLabel'));
    const w = await p.evaluate(() => document.getElementById('progFill').style.width);
    ok('fill width tracks', w === '8%', w);
    // engine-level progress()
    const pr = await p.evaluate(() => COP.progress());
    ok('COP.progress() correct', pr.have === 1 && pr.total === 12, JSON.stringify(pr));
    await ctx.close();
  }

  console.log('\n── 5. Savebar ──');
  {
    const { ctx, p } = await grantedPage(browser);
    ok('savebar injected', await p.locator('#cop-savebar').count() === 1);
    ok('savebar hidden initially', !(await p.evaluate(() => document.getElementById('cop-savebar').classList.contains('on'))));
    await p.check('input[data-key="pf.kit"]');
    await p.waitForTimeout(120);
    ok('savebar flashes on write', await p.evaluate(() => document.getElementById('cop-savebar').classList.contains('on')));
    await p.waitForTimeout(1800);
    ok('savebar clears after 1600ms', !(await p.evaluate(() => document.getElementById('cop-savebar').classList.contains('on'))));
    await ctx.close();
  }

  console.log('\n── 6. Modes ──');
  {
    const { ctx, p } = await grantedPage(browser);
    ok('mode toggle injected into nav', await p.locator('header.chrome nav #cop-mode button').count() === 2);
    ok('defaults to self', await p.evaluate(() => document.body.classList.contains('self')));
    await p.click('#cop-mode button[data-mode="present"]');
    await p.waitForTimeout(100);
    ok('present class applied', await p.evaluate(() => document.body.classList.contains('present')));
    ok('aria-pressed tracks', await p.getAttribute('#cop-mode button[data-mode="present"]', 'aria-pressed') === 'true');
    await p.reload(); await p.waitForTimeout(250);
    ok('mode persists across reload', await p.evaluate(() => document.body.classList.contains('present')));
    await ctx.close();
  }

  console.log('\n── 7. Facilitator layer ──');
  {
    const { ctx, p } = await grantedPage(browser);
    ok('run strips hidden by default', await p.locator('.runstrip').first().isVisible() === false);
    await ctx.close();
  }
  {
    const { ctx, p } = await grantedPage(browser, '?facilitator=1');
    ok('facilitator class applied', await p.evaluate(() => document.body.classList.contains('facilitator')));
    ok('run strips visible', await p.locator('.runstrip').first().isVisible());
    // structural, not a magic count — every section must carry facilitator guidance
    const sections = ['#preflight', '#spine', '#s1', '#s2', '#s3', '#close'];
    const covered = [];
    for (const sel of sections) if (await p.locator(sel + ' .runstrip').count() >= 1) covered.push(sel);
    ok('every section carries a run strip', covered.length === sections.length, 'missing: ' + sections.filter(x => !covered.includes(x)).join(', '));
    ok('and all of them are visible in facilitator mode', await p.evaluate(() => [...document.querySelectorAll('.runstrip')].every(e => e.offsetParent !== null)));
    await ctx.close();
  }

  console.log('\n── 8. Multi-tab (the AAL regression) ──');
  {
    const ctx = await browser.newContext();
    const a = await ctx.newPage();
    await a.goto(ROOT + '/index.html');
    await a.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
    await a.goto(PAGE);
    const b = await ctx.newPage();
    // sessionStorage is per-tab, so tab B needs its own grant (same as a real second tab)
    await b.goto(ROOT + '/index.html');
    await b.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
    await b.goto(PAGE);
    await a.waitForTimeout(200);
    await a.evaluate(() => COP.set('s1.act', 'written in tab A'));
    await b.waitForTimeout(200);
    await b.evaluate(() => COP.set('s2.fix', 'written in tab B'));
    await a.waitForTimeout(300);
    const merged = await a.evaluate(() => COP.getAll());
    ok('tab B did not clobber tab A', merged['s1.act'] === 'written in tab A' && merged['s2.fix'] === 'written in tab B', JSON.stringify(merged));
    await ctx.close();
  }

  console.log('\n── 9. Print ──');
  {
    const { ctx, p } = await grantedPage(browser);
    await p.evaluate(() => { COP.set('s1.act', 'a facilitator tool builder'); COP.set('me.commit', 'raise my laptop'); });
    await p.evaluate(() => { window.print = () => {}; });   // stub so the dialog never opens
    await p.click('[data-action="print-notes"]');
    await p.waitForTimeout(200);
    const html = await p.innerHTML('#printdoc');
    ok('printdoc populated', html.length > 200);
    ok('filled value rendered', html.includes('a facilitator tool builder'));
    ok('empty value gets the placeholder', html.includes('yours to finish'));
    ok('print header branded', html.includes('Community of Practice'));
    await ctx.close();
  }

  console.log('\n── 10. Layout ──');
  for (const [w, h, label] of [[1280, 720, 'projector 1280×720'], [390, 844, 'phone 390px'], [1680, 1050, 'desktop']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(ROOT + '/index.html');
    await p.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
    await p.goto(PAGE);
    await p.waitForTimeout(300);
    const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    ok('no horizontal scroll — ' + label, !over);
    await ctx.close();
  }

  console.log('\n── 11. Anchors clear the sticky header ──');
  {
    const { ctx, p } = await grantedPage(browser);
    const pad = await p.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop);
    ok('scroll-padding-top set (AAL wart fixed)', pad === '76px', pad);
    for (const id of ['s1', 's2', 's3', 'close']) {
      ok('anchor #' + id + ' exists', await p.locator('#' + id).count() === 1);
    }
    await ctx.close();
  }

  console.log('\n── 12. Reset ──');
  {
    const { ctx, p } = await grantedPage(browser);
    await p.evaluate(() => COP.set('s1.act', 'x'));
    p.on('dialog', d => d.accept());
    await p.click('[data-action="reset-state"]');
    await p.waitForTimeout(500);
    const left = await p.evaluate(() => localStorage.getItem('cop.capture'));
    ok('reset clears capture', left === null || left === '{}', String(left));
    await ctx.close();
  }

  await browser.close();
  console.log('\n════════════════════════════════');
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log('════════════════════════════════\n');
  process.exit(fail ? 1 : 0);
})();
