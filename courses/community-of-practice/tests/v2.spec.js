/* v2 · "Prompt it. Build it." — single suite.
   Run against a local server in the AIM Interactive Workbooks folder:
     python3 -m http.server 8899   (from the folder that holds courses/)
     node tests/v2.spec.js
   The v1 suites (b1–b4) test the retired page and live in tests/v1-archive/. */
const { chromium } = require('playwright');

const ROOT = 'http://127.0.0.1:8899';
const PAGE = ROOT + '/courses/community-of-practice/index.html';

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? '  → ' + extra : '')); }
}
async function granted(browser, query = '', viewport = { width: 1280, height: 720 }) {
  const ctx = await browser.newContext({ viewport });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto(ROOT + '/index.html');
  await p.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
  await p.goto(PAGE + query);
  await p.waitForTimeout(400);
  return { ctx, p, errors };
}

const CONTRAST_FN = `
function _lum(c){ const s=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}); return 0.2126*s[0]+0.7152*s[1]+0.0722*s[2]; }
function _rgb(str){ const m=String(str).match(/rgba?\\(([^)]+)\\)/); if(!m) return null; const p=m[1].split(',').map(s=>parseFloat(s)); return {c:[p[0],p[1],p[2]],a:p.length>3?p[3]:1}; }
function _bgOf(el){ let n=el; while(n&&n!==document.documentElement){ const b=_rgb(getComputedStyle(n).backgroundColor); if(b&&b.a>0.85) return b.c; n=n.parentElement; } return [255,255,255]; }
function ratio(el){ const fg=_rgb(getComputedStyle(el).color); if(!fg) return null; const bg=_bgOf(el); const f=fg.a>=1?fg.c:fg.c.map((v,i)=>v*fg.a+bg[i]*(1-fg.a)); const L1=_lum(f),L2=_lum(bg); return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); }
`;

(async () => {
  const browser = await chromium.launch();

  console.log('\n── 1. Gate, boot, chrome ──');
  {
    const ctx = await browser.newContext(); const p = await ctx.newPage();
    await p.goto(PAGE);
    ok('un-granted load bounces to hub with ?course=', p.url().includes('index.html?course=community-of-practice'), p.url());
    await ctx.close();
  }
  {
    const { ctx, p, errors } = await granted(browser);
    ok('granted load renders the page', p.url().endsWith('/courses/community-of-practice/index.html'));
    ok('title is v2', (await p.title()).includes('Prompt it. Build it.'));
    ok('no JS errors on boot', errors.length === 0, errors.join(' | '));
    ok('window.COP exposed', await p.evaluate(() => typeof window.COP === 'object' && COP.V === 2));
    ok('Present is the default mode', await p.evaluate(() => document.body.classList.contains('present')));
    ok('mode toggle injected, Present first', await p.evaluate(() => document.querySelector('#cop-mode button').getAttribute('data-mode')) === 'present');
    ok('chapter rail lists eleven chapters', await p.locator('.rail a[data-ch]').count() === 11);
    ok('eleven chaptered sections on the page', await p.locator('section[data-ch]').count() === 11);
    ok('every chapter has an h2 or h1 zoom title', await p.evaluate(() => [...document.querySelectorAll('section[data-ch]')].every(s => s.querySelector('h1, h2.ch-title'))));
    ok('each chapter title ≥ 44px in Present mode', await p.evaluate(() => [...document.querySelectorAll('h2.ch-title')].every(h => parseFloat(getComputedStyle(h).fontSize) >= 44)));
    ok('two section dividers', await p.locator('.section-divider').count() === 2);
    ok('progress starts 0 / 5', (await p.textContent('#progLabel')).trim() === '0 / 5');
    // scroll-spy
    await p.evaluate(() => document.getElementById('folder').scrollIntoView());
    await p.waitForTimeout(1500);
    ok('scroll-spy lights the current chapter', await p.evaluate(() => document.querySelector('.rail a.on').getAttribute('data-ch')) === 'folder');
    ok('header chip names it', (await p.textContent('#hereChip')).includes('04'));
    // mode switch
    await p.click('#cop-mode button[data-mode="self"]');
    ok('Self-paced applies', await p.evaluate(() => document.body.classList.contains('self') && !document.body.classList.contains('present')));
    await p.reload(); await p.waitForTimeout(300);
    ok('mode persists under its own v2 key', await p.evaluate(() => localStorage.getItem('cop.mode.v2') === 'self' && document.body.classList.contains('self')));
    await ctx.close();
  }

  console.log('\n── 2. AEP builder ──');
  {
    const { ctx, p } = await granted(browser);
    ok('six seeds', await p.locator('#seedRow .seedchip').count() === 6);
    ok('placeholder shown before input', (await p.textContent('#promptOut')).includes('Fill in a box'));
    await p.click('#seedRow .seedchip >> nth=0'); await p.waitForTimeout(500);
    const out = await p.textContent('#promptOut');
    ok('seed fills all three boxes', await p.evaluate(() => ['s1act','s1explain','s1please'].every(id => document.getElementById(id).value.length > 20)));
    ok('brief assembles with "You are …"', out.startsWith('You are a learning designer'));
    ok('meter reads 4 / 4 on a seeded brief', (await p.textContent('#gmScore')).trim() === '4 / 4');
    ok('progress advances to 3 / 5', (await p.textContent('#progLabel')).trim() === '3 / 5');
    await p.fill('#s1please', 'help'); await p.waitForTimeout(600);
    ok('meter drops when Please becomes a wish', (await p.textContent('#gmScore')).trim() !== '4 / 4');
    await p.reload(); await p.waitForTimeout(400);
    ok('brief survives reload', (await p.inputValue('#s1act')).length > 20);
    await p.click('#clearBrief'); await p.waitForTimeout(300);
    ok('Clear empties the three boxes', await p.evaluate(() => ['s1act','s1explain','s1please'].every(id => document.getElementById(id).value === '')));
    ok('and the progress bar', (await p.textContent('#progLabel')).trim() === '0 / 5');
    await ctx.close();
  }

  console.log('\n── 3. Context Meter ──');
  {
    const { ctx, p } = await granted(browser);
    ok('four presets', await p.locator('#meterPresets .presetbtn').count() === 4);
    ok('starts on "A short chat"', await p.evaluate(() => COP_METER.current()) === 'short');
    ok('short chat leaves the desk mostly clear', await p.evaluate(() => parseInt(document.getElementById('fillPct').textContent) < 50));
    ok('nothing off the edge', await p.evaluate(() => !document.getElementById('desk').classList.contains('over')));
    await p.click('#meterPresets .presetbtn >> nth=1'); await p.waitForTimeout(1100);
    ok('facilitator guide nearly fills it', await p.evaluate(() => parseInt(document.getElementById('fillPct').textContent) >= 90));
    ok('document block present', await p.locator('#deskStrip .blk.doc').count() === 1);
    await p.click('#meterPresets .presetbtn >> nth=2'); await p.waitForTimeout(1100);
    ok('hour-long chat overflows', await p.evaluate(() => document.getElementById('desk').classList.contains('over')));
    ok('early blocks greyed as gone', await p.locator('#deskStrip .blk.gone').count() >= 3);
    ok('the original brief is among the lost', await p.evaluate(() => document.querySelector('#deskStrip .blk.brief').classList.contains('gone')));
    ok('edge label appears', (await p.textContent('#edgeLabel')).includes('Off the edge'));
    ok('verdict is the bad one', await p.evaluate(() => document.getElementById('meterVerdict').classList.contains('bad')));
    await p.click('#meterPresets .presetbtn >> nth=3'); await p.waitForTimeout(1100);
    ok('new chat clears the edge', await p.evaluate(() => !document.getElementById('desk').classList.contains('over')));
    ok('verdict is good again', await p.evaluate(() => document.getElementById('meterVerdict').classList.contains('good')));
    ok('presets expose aria-pressed', await p.evaluate(() => document.querySelectorAll('#meterPresets .presetbtn[aria-pressed="true"]').length === 1));
    await ctx.close();
  }

  console.log('\n── 4. Cutoff Clock ──');
  {
    const { ctx, p } = await granted(browser);
    ok('six models', await p.locator('#modelDial .modelbtn').count() === 6);
    ok('every model carries a month-year cutoff', await p.evaluate(() => [...document.querySelectorAll('#modelDial .dt')].every(e => /^[A-Z][a-z]{2} 20\d\d$/.test(e.textContent.trim()))));
    ok('timeline SVG rendered', await p.locator('#timeline svg').count() === 1);
    ok('three stops drawn', await p.locator('#timeline svg circle').count() === 3);
    ok('gap sentence present', (await p.textContent('#timeline .gap')).includes('has never seen'));
    const first = await p.textContent('#timeline .big');
    await p.click('#modelDial .modelbtn >> nth=2'); await p.waitForTimeout(200);
    ok('switching model redraws', (await p.textContent('#timeline .big')) !== first);
    ok('Claude Fable 5.1 shows Jun 2026', (await p.textContent('#timeline .big')).trim() === 'Jun 2026');
    ok('gap months computed', /\d+ months/.test(await p.textContent('#timeline .gap')));
    ok('checked-date stamp present', (await p.textContent('#checkedStamp')).includes('2026'));
    ok('live-list link present', await p.locator('.clock .csub a[href*="knowledge-cutoff"]').count() === 1);
    await ctx.close();
  }

  console.log('\n── 5. Section 2 — the six steps ──');
  {
    const { ctx, p } = await granted(browser);
    const STEPS = ['folder','plan','prompts','rename','module1','continue'];
    ok('six step bands in order', await p.evaluate(() => [...document.querySelectorAll('section.chapter.s2')].map(s => s.id).join(',')) === STEPS.join(','));
    ok('six pipeline rails, one per step', await p.locator('.pipe[data-stop]').count() === 6);
    ok('each rail lights its own step', await p.evaluate(() => [...document.querySelectorAll('.pipe[data-stop]')].every((r, i) => r.querySelectorAll('.stop.on').length === 1 && r.querySelector('.stop.on').textContent.trim().startsWith(String(i + 1)))));
    ok('every step has a "Say this" card with a Copy button', await p.evaluate(() => [...document.querySelectorAll('section.chapter.s2')].every(s => s.querySelector('.say [data-say]') && s.querySelector('.say .copy-say'))));
    const says = await p.evaluate(() => [...document.querySelectorAll('.say [data-say]')].map(e => e.textContent.trim()));
    ok('step 1 is the folder line', says[0] === 'Please understand the contents of the folder.');
    ok('step 2 asks for a phased plan for AI for Productivity', /phased plan/.test(says[1]) && /AI for Productivity/.test(says[1]));
    ok('step 3 asks for Midjourney prompts with filenames', /Midjourney prompts/.test(says[2]) && /filename/.test(says[2]));
    ok('step 4 renames the images', /Rename all the Midjourney images/.test(says[3]));
    ok('step 5 does the first module with images', /first module/.test(says[4]) && /images/.test(says[4]));
    ok('step 6 is the four words', says[5] === 'Continue with all phases.');
    ok('every step ties back to Section 1', await p.locator('section.chapter.s2 .tie').count() === 6);
    ok('every step has three what-you-see cards', await p.evaluate(() => [...document.querySelectorAll('section.chapter.s2')].every(s => s.querySelectorAll('.bigcards .bigcard').length === 3)));
    ok('one prompt → picture reveal, in step 3', await p.locator('#prompts .pair').count() === 1 && await p.locator('.pair').count() === 1);
    ok('picture hidden until revealed', await p.evaluate(() => !document.querySelector('.pair .pimg').classList.contains('shown')));
    await p.click('.pair .cover button'); await p.waitForTimeout(200);
    ok('reveal shows it', await p.evaluate(() => document.querySelector('.pair .pimg').classList.contains('shown')));
    ok('no gallery any more', await p.locator('#gallery').count() === 0);
    await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
    await p.waitForTimeout(800);
    const broken = await p.evaluate(async () => {
      const imgs = [...document.images].filter(i => i.loading !== 'lazy' || i.complete);
      await Promise.all(imgs.map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
      return imgs.filter(i => i.naturalWidth === 0).map(i => i.getAttribute('src'));
    });
    ok('no broken images', broken.length === 0, broken.join(', '));
    await ctx.close();
  }

  console.log('\n── 6. Close, capture, print ──');
  {
    const { ctx, p } = await granted(browser);
    await p.fill('#mecommit', 'turn my debrief prompts into briefs'); await p.waitForTimeout(600);
    ok('commitment written to cop.capture', await p.evaluate(() => JSON.parse(localStorage.getItem('cop.capture'))['me.commit']) === 'turn my debrief prompts into briefs');
    ok('progress 1 / 5', (await p.textContent('#progLabel')).trim() === '1 / 5');
    ok('savebar flashed', await p.evaluate(() => document.getElementById('cop-savebar').classList.contains('on')));
    ok('four keep-this links', await p.locator('.keepthis a').count() === 4);
    ok('print rows cover brief + commitments', await p.evaluate(() => COP.rows([['a','s1.act'],['b','me.commit']]).includes('turn my debrief')));
    ok('nothing talks to a server', await p.evaluate(() => performance.getEntriesByType('resource').every(r => /127\.0\.0\.1|fonts\.g/.test(r.name))));
    await ctx.close();
  }

  console.log('\n── 7. Facilitator layer ──');
  {
    const { ctx, p } = await granted(browser);
    ok('run strips hidden from participants', await p.locator('.runstrip').first().isVisible() === false);
    ok('briefing hidden', !(await p.locator('#facbrief').isVisible()));
    ok('timer absent', await p.locator('#copTimer').count() === 0);
    await ctx.close();
  }
  {
    const { ctx, p } = await granted(browser, '?facilitator=1');
    ok('facilitator class applied', await p.evaluate(() => document.body.classList.contains('facilitator')));
    ok('every chapter carries a run strip', await p.evaluate(() => [...document.querySelectorAll('section.chapter[data-ch], section#spine')].every(s => s.querySelector('.runstrip'))));
    ok('all run strips visible', await p.evaluate(() => [...document.querySelectorAll('.runstrip')].every(e => e.offsetParent !== null)));
    ok('run sheet has twelve rows', await p.locator('.runsheet tbody tr').count() === 12);
    ok('three cuts, each with a saving', await p.evaluate(() => { const c = document.querySelectorAll('#facbrief .cuts')[0].querySelectorAll('li'); return c.length === 3 && [...c].every(li => /−\d/.test(li.textContent)); }));
    ok('never-cut names the forgetting moment and step 1', (await p.textContent('.nevercut')).includes('forgetting') && (await p.textContent('.nevercut')).includes('contents of the folder'));
    ok('timer present', await p.locator('#copTimer').isVisible());
    ok('timer presets match the run sheet', await p.evaluate(() => [...document.querySelectorAll('#tmPresets button')].map(b => b.textContent).join(',')) === '2m,5m,6m,7m');
    await p.click('#tmPresets button >> nth=0');
    ok('preset arms the clock', (await p.textContent('#tmDigits')).trim() === '2:00');
    await p.click('#tmGo'); await p.waitForTimeout(1300);
    ok('counts down', (await p.textContent('#tmDigits')).trim() !== '2:00');
    await p.click('#tmGo');
    ok('pauses', !(await p.evaluate(() => COP_TIMER.state().running)));
    await ctx.close();
  }

  console.log('\n── 8. Contrast (WCAG AA) and keyboard ──');
  {
    const { ctx, p } = await granted(browser, '?facilitator=1');
    await p.click('#cop-mode button[data-mode="self"]');
    await p.evaluate(() => { document.querySelectorAll('[data-reveal-img]').forEach(b => b.classList.add('shown')); });
    await p.addScriptTag({ content: CONTRAST_FN });
    const bad = await p.evaluate(() => {
      const out = [];
      const els = document.querySelectorAll('p, h1, h2, h3, h4, li, label, td, th, span, a, button, figcaption, q, .hint, .sub, .small');
      els.forEach(el => {
        if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
        const txt = (el.textContent || '').trim();
        if (!txt || el.children.length > 0 && !([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))) return;
        const cs = getComputedStyle(el);
        const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const need = large ? 3.0 : 4.5;
        const r = ratio(el);
        if (r !== null && r < need) out.push({ sel: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0], size, r: Math.round(r * 100) / 100, need, txt: txt.slice(0, 40) });
      });
      const seen = new Set();
      return out.filter(o => { const k = o.sel + o.r; if (seen.has(k)) return false; seen.add(k); return true; });
    });
    ok('no AA contrast failures in body text', bad.length === 0, bad.length ? JSON.stringify(bad.slice(0, 8)) : '');
    ok('skip link is first in tab order', await p.evaluate(() => document.querySelector('a,button,input,textarea,select').classList.contains('skip-link')));
    ok('no positive tabindex anywhere', await p.evaluate(() => ![...document.querySelectorAll('[tabindex]')].some(e => +e.getAttribute('tabindex') > 0)));
    ok('every custom control is a real button', await p.evaluate(() => [...document.querySelectorAll('.presetbtn,.modelbtn,.seedchip,.cover button,#tmGo')].every(b => b.tagName === 'BUTTON')));
    ok('no click-only divs', await p.evaluate(() => ![...document.querySelectorAll('div[onclick],span[onclick]')].length));
    await ctx.close();
  }

  console.log('\n── 9. Narrow viewport ──');
  {
    const { ctx, p } = await granted(browser, '', { width: 390, height: 844 });
    ok('no horizontal overflow at 390px', await p.evaluate(() => document.documentElement.scrollWidth <= 392), await p.evaluate(() => document.documentElement.scrollWidth));
    ok('rail hidden on phones', !(await p.locator('#rail').isVisible()));
    await ctx.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})();
