const { chromium } = require('playwright');

const ROOT = 'http://127.0.0.1:8899';
const PAGE = ROOT + '/courses/community-of-practice/index.html';

let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? (pass++, console.log('  ✓ ' + n)) : (fail++, console.log('  ✗ ' + n + (x ? '  → ' + x : ''))); };

async function granted(browser, q = '', vp = { width: 1280, height: 900 }) {
  const ctx = await browser.newContext({ viewport: vp, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  await p.goto(ROOT + '/index.html');
  await p.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
  await p.goto(PAGE + q);
  await p.waitForTimeout(250);
  return { ctx, p };
}

(async () => {
  const browser = await chromium.launch();

  console.log('\n── 1. Station 1 renders ──');
  {
    const { ctx, p } = await granted(browser);
    const errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.waitForTimeout(300);
    ok('no JS errors', errs.length === 0, errs.join(' | '));
    ok('COP_S3 exposed', await p.evaluate(() => typeof COP_S3 === 'object'));
    ok('three AEP fields', await p.locator('#builder textarea[data-key]').count() === 3);
    ok('six seed chips', await p.locator('.seedchip').count() === 6);
    ok('prompt pane is a live region', await p.getAttribute('#promptOut', 'aria-live') === 'polite');
    ok('AEP teaching card has all three words', await p.evaluate(() => [...document.querySelectorAll('.aeplist .w')].map(e => e.textContent).join(',')) === 'Act,Explain,Please');
    await ctx.close();
  }

  console.log('\n── 2. Prompt assembly ──');
  {
    const { ctx, p } = await granted(browser);
    ok('empty state shows a placeholder', (await p.textContent('#promptOut')).includes('appears here'));

    await p.fill('#s1act', 'a front-end developer');
    await p.waitForTimeout(600);
    let out = await p.textContent('#promptOut');
    ok('Act becomes "You are …"', out.startsWith('You are a front-end developer.'), out.slice(0, 60));
    ok('tail line always present', out.includes('single self-contained web page'));

    await p.fill('#s1explain', 'I run workshops for twenty people.');
    await p.fill('#s1please', 'Build me a timer.');
    await p.waitForTimeout(600);
    out = await p.textContent('#promptOut');
    ok('all three parts in order', out.indexOf('You are') < out.indexOf('I run workshops') && out.indexOf('I run workshops') < out.indexOf('Build me a timer'));
    ok('parts separated by blank lines', out.split('\n\n').length === 4, String(out.split('\n\n').length));

    // trailing full stop shouldn't double up
    await p.fill('#s1act', 'a developer.');
    await p.waitForTimeout(600);
    ok('no doubled full stop after Act', !(await p.textContent('#promptOut')).includes('developer..'));

    await p.reload(); await p.waitForTimeout(500);
    ok('prompt rebuilds after reload', (await p.textContent('#promptOut')).includes('Build me a timer'));
    await ctx.close();
  }

  console.log('\n── 3. Genericness meter ──');
  {
    const { ctx, p } = await granted(browser);
    ok('starts at 0 / 4', (await p.textContent('#gmScore')).trim() === '0 / 4');

    await p.fill('#s1act', 'a front-end developer who writes plain code');
    await p.waitForTimeout(600);
    ok('role check lights', await p.evaluate(() => document.querySelector('li[data-check="role"]').classList.contains('met')));
    ok('score is 1 / 4', (await p.textContent('#gmScore')).trim() === '1 / 4');

    await p.fill('#s1explain', 'I facilitate a one-day workshop for about twenty people and I need to split them into new groups several times across the day without the same people ending up together twice.');
    await p.waitForTimeout(600);
    ok('who check lights', await p.evaluate(() => document.querySelector('li[data-check="who"]').classList.contains('met')));

    await p.fill('#s1please', 'Build me a group allocator. I paste in names, choose a group size, and it deals them into groups on screen in big readable type.');
    await p.waitForTimeout(600);
    ok('format check lights', await p.evaluate(() => document.querySelector('li[data-check="format"]').classList.contains('met')));
    ok('length check lights', await p.evaluate(() => document.querySelector('li[data-check="length"]').classList.contains('met')));
    ok('score reaches 4 / 4', (await p.textContent('#gmScore')).trim() === '4 / 4');
    ok('all four dots lit', await p.evaluate(() => document.querySelectorAll('.gm-dot.on').length) === 4);
    ok('dots go teal at full marks', await p.evaluate(() => document.querySelector('.gm-dot').classList.contains('full')));

    // a wishy-washy brief should NOT score
    const weak = await p.evaluate(() => {
      COP.set('s1.act', 'AI'); COP.set('s1.explain', 'help me'); COP.set('s1.please', 'do a thing');
      return COP_S3.checks();
    });
    ok('a vague brief scores zero', !weak.role && !weak.who && !weak.format && !weak.length, JSON.stringify(weak));
    await ctx.close();
  }

  console.log('\n── 4. Seeds ──');
  {
    const { ctx, p } = await granted(browser);
    await p.click('.seedchip >> nth=0');
    await p.waitForTimeout(400);
    ok('seed fills Explain', (await p.inputValue('#s1explain')).length > 80);
    ok('seed fills Please', (await p.inputValue('#s1please')).length > 80);
    ok('seed supplies an Act when empty', (await p.inputValue('#s1act')).length > 20);
    ok('seeded brief scores 4 / 4', (await p.textContent('#gmScore')).trim() === '4 / 4');
    ok('prompt pane updated', (await p.textContent('#promptOut')).includes('group allocator'));

    // must not silently clobber the user's own words
    p.once('dialog', d => d.dismiss());
    const before = await p.inputValue('#s1explain');
    await p.click('.seedchip >> nth=2');
    await p.waitForTimeout(400);
    ok('declining the confirm keeps your words', await p.inputValue('#s1explain') === before);

    p.once('dialog', d => d.accept());
    await p.click('.seedchip >> nth=2');
    await p.waitForTimeout(400);
    ok('accepting replaces them', (await p.inputValue('#s1explain')) !== before);
    ok('all six seeds are distinct', await p.evaluate(() => new Set(COP_S3.SEEDS.map(s => s.please)).size) === 6);
    await ctx.close();
  }

  console.log('\n── 5. Copy buttons ──');
  {
    const { ctx, p } = await granted(browser);
    await p.click('#copyPrompt');
    await p.waitForTimeout(150);
    ok('empty copy says so rather than copying nothing', (await p.textContent('#copyPrompt')).includes('Nothing to copy'));
    await p.waitForTimeout(1700);

    await p.fill('#s1act', 'a developer');
    await p.fill('#s1please', 'Build me a timer.');
    await p.waitForTimeout(600);
    await p.click('#copyPrompt');
    await p.waitForTimeout(250);
    ok('copy confirms', (await p.textContent('#copyPrompt')).includes('Copied'));
    const clip = await p.evaluate(() => navigator.clipboard.readText());
    ok('clipboard holds the assembled prompt', clip.includes('You are a developer.') && clip.includes('self-contained web page'), clip.slice(0, 50));

    await p.click('#copyFallback');
    await p.waitForTimeout(250);
    const clip2 = await p.evaluate(() => navigator.clipboard.readText());
    ok('fallback copies a complete known-good prompt', clip2.includes('group allocator') && clip2.split('\n\n').length === 4);
    ok('AI Studio link opens in a new tab safely', await p.evaluate(() => {
      const a = document.querySelector('.bfoot a');
      return a.target === '_blank' && a.rel.includes('noopener') && a.href.includes('aistudio.google.com');
    }));
    await ctx.close();
  }

  console.log('\n── 6. Gallery ──');
  {
    const { ctx, p } = await granted(browser);
    ok('six cards', await p.locator('.gcard').count() === 6);
    ok('2 games + 4 tools, as specced', await p.evaluate(() => {
      const g = document.querySelectorAll('.gcard.game').length;
      return g === 2 && document.querySelectorAll('.gcard').length - g === 4;
    }));
    ok('every card states what it took', await p.evaluate(() => [...document.querySelectorAll('.gcard .took')].every(e => e.textContent.trim().length > 3)));
    ok('a card with a URL gets an Open link', await p.locator('.gcard a:has-text("Open")').count() >= 1);
    ok('a card without one degrades to text, not a broken link', await p.locator('.gcard .pending').count() >= 1);
    ok('no empty hrefs anywhere in the grid', await p.evaluate(() => [...document.querySelectorAll('.gcard a')].every(a => a.getAttribute('href') && a.getAttribute('href') !== '#')));
    ok('slot 4 flagged as being built', await p.evaluate(() => {
      const c = [...document.querySelectorAll('.gcard')][3];
      return c.classList.contains('soon') && c.textContent.includes('Being built');
    }));
    ok('QR generator points at the real URL', await p.evaluate(() => !!document.querySelector('.gcard a[href="https://rupertchesman.com/qr/"]')));
    await ctx.close();
  }

  console.log('\n── 7. Remix / iterate + the wall ──');
  {
    const { ctx, p } = await granted(browser);
    ok('two doors offered', await p.locator('input[data-key="s3.path"]').count() === 2);
    // the radio is visually hidden behind its card, so click the card — as a user would
    ok('option cards actually render as cards', await p.evaluate(() => {
      const oc = document.querySelector('.optcard .oc');
      const inp = document.querySelector('.optcard input');
      if (!oc || !inp) return false;
      const s = getComputedStyle(oc);
      return s.display === 'block' && parseFloat(s.borderTopWidth) > 0 && getComputedStyle(inp).opacity === '0';
    }));
    ok('  card titles are block-level, not run-on text', await p.evaluate(() =>
      getComputedStyle(document.querySelector('.optcard .oc b')).display === 'block' &&
      getComputedStyle(document.querySelector('.optcard .oc span')).display === 'block'));
    await p.click('.optcard:has(input[value="Remix one from the gallery"]) .oc');
    await p.waitForTimeout(250);
    ok('  clicking the card selects the radio', await p.isChecked('input[data-key="s3.path"][value="Remix one from the gallery"]'));
    ok('  and the checked card is visually distinct', await p.evaluate(() => {
      const [a, b] = [...document.querySelectorAll('.optcard .oc')];
      return getComputedStyle(a).backgroundColor !== getComputedStyle(b).backgroundColor;
    }));
    ok('choice saved verbatim', await p.evaluate(() => COP.get('s3.path')) === 'Remix one from the gallery');

    await p.fill('#s3link', 'https://aistudio.google.com/apps/abc123');
    await p.waitForTimeout(600);
    ok('link saved', await p.evaluate(() => COP.get('s3.link')).then(v => v.includes('abc123')));
    await p.reload(); await p.waitForTimeout(400);
    ok('both survive reload', await p.isChecked('input[data-key="s3.path"][value="Remix one from the gallery"]') && (await p.inputValue('#s3link')).includes('abc123'));
    ok('wall says local-only, chat is what the room sees', (await p.textContent('.wall')).includes('chat is what the room sees'));
    await ctx.close();
  }

  console.log('\n── 8. Close ──');
  {
    const { ctx, p } = await granted(browser);
    ok('commitment field present', await p.locator('input[data-key="me.commit"]').count() === 1);
    ok('next-CoP field present', await p.locator('input[data-key="me.next"]').count() === 1);
    ok('optional name field present', await p.locator('input[data-key="me.name"]').count() === 1);
    ok('hidden labels are real labels, not missing ones', await p.evaluate(() =>
      [...document.querySelectorAll('.closecard input[data-key]')].every(i => !!document.querySelector(`label[for="${i.id}"]`))));
    await p.fill('input[data-key="me.commit"]', 'build the allocator on Thursday');
    await p.waitForTimeout(600);
    ok('commitment saved', await p.evaluate(() => COP.get('me.commit')) === 'build the allocator on Thursday');
    await ctx.close();
  }

  console.log('\n── 9. Progress bar now reaches 12 / 12 ──');
  {
    const { ctx, p } = await granted(browser);
    await p.evaluate(() => {
      COP.PROGRESS_KEYS.forEach(k => COP.set(k, 'x'));
    });
    await p.waitForTimeout(300);
    ok('all twelve keys countable', (await p.textContent('#progLabel')).trim() === '12 / 12', await p.textContent('#progLabel'));
    ok('bar full', await p.evaluate(() => document.getElementById('progFill').style.width) === '100%');
    // and every one of them has a real field on the page
    const missing = await p.evaluate(() => COP.PROGRESS_KEYS.filter(k => !document.querySelector(`[data-key="${k}"]`)));
    ok('every progress key has a field on the page', missing.length === 0, JSON.stringify(missing));
    await ctx.close();
  }

  console.log('\n── 10. Print output (B3 exit criterion) ──');
  {
    const { ctx, p } = await granted(browser);
    await p.evaluate(() => {
      COP.set('pf.studio', '1'); COP.set('pf.kit', '1');
      COP.set('me.name', 'Sam Okafor');
      COP.set('s1.act', 'a front-end developer');
      COP.set('s1.explain', 'I run workshops for twenty people');
      COP.set('s1.please', 'Build me a group allocator');
      COP.set('s1.built', 'a working allocator, first try');
      COP.set('s2.audit.1', '1'); COP.set('s2.audit.2', '1'); COP.set('s2.audit.4', '1');
      COP.set('s2.fix', 'turn the desk to face the window');
      COP.set('s3.link', 'https://aistudio.google.com/apps/abc');
      COP.set('me.commit', 'use it on Thursday');
      COP.set('me.next', 'audio');
      window.print = () => {};
    });
    await p.click('[data-action="print-notes"]');
    await p.waitForTimeout(300);
    const html = await p.innerHTML('#printdoc');
    for (const [label, needle] of [
      ['name in the header', 'Sam Okafor'],
      ['Act', 'a front-end developer'],
      ['Explain', 'I run workshops'],
      ['Please', 'Build me a group allocator'],
      ['what they built', 'a working allocator'],
      ['audit score', '3 of 6'],
      ['the fix', 'turn the desk'],
      ['their link', 'aistudio.google.com/apps/abc'],
      ['commitment', 'use it on Thursday'],
      ['next CoP', 'audio'],
    ]) ok('print sheet carries ' + label, html.includes(needle), needle);
    ok('pre-flight count rendered', html.includes('2 of 3'), 'expected "2 of 3"');
    ok('branded header', html.includes('Community of Practice'));
    ok('two print buttons wired (close + footer)', await p.locator('[data-action="print-notes"]').count() === 2);

    // empty fields get the friendly placeholder, not a blank row
    await p.evaluate(() => { COP.resetAll = () => {}; localStorage.removeItem('cop.capture'); });
    await p.reload(); await p.waitForTimeout(400);
    await p.evaluate(() => { window.print = () => {}; });
    await p.click('[data-action="print-notes"]');
    await p.waitForTimeout(250);
    const empty = await p.innerHTML('#printdoc');
    ok('empty sheet uses the kind placeholder', (empty.match(/yours to finish/g) || []).length >= 8, String((empty.match(/yours to finish/g) || []).length));
    await ctx.close();
  }

  console.log('\n── 11. Whole-page integrity ──');
  {
    const { ctx, p } = await granted(browser);
    ok('no mount placeholders left', await p.locator('.mount').count() === 0);
    ok('all images have alt text', await p.evaluate(() => [...document.querySelectorAll('img')].every(i => i.hasAttribute('alt'))));
    ok('all images have explicit dimensions', await p.evaluate(() => [...document.querySelectorAll('img')].every(i => i.hasAttribute('width') && i.hasAttribute('height'))));
    ok('everything below the hero lazy-loads', await p.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')];
      const eager = imgs.filter(i => i.loading !== 'lazy');
      return eager.length <= 3;   // hero, logo, pre-flight
    }));
    ok('no duplicate element ids', await p.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
      return ids.length === new Set(ids).size;
    }));
    ok('every data-key is unique or a deliberate radio group', await p.evaluate(() => {
      const m = {};
      document.querySelectorAll('[data-key]').forEach(e => { const k = e.getAttribute('data-key'); (m[k] = m[k] || []).push(e.type); });
      return Object.keys(m).every(k => m[k].length === 1 || m[k].every(t => t === 'radio' || t === 'checkbox'));
    }));
    await ctx.close();
  }

  console.log('\n── 12. Layout across viewports ──');
  for (const [w, h, label] of [[390, 844, 'phone'], [620, 900, 'small tablet'], [900, 1000, 'tablet'], [1280, 720, 'projector'], [1680, 1050, 'desktop']]) {
    const { ctx, p } = await granted(browser, '', { width: w, height: h });
    await p.waitForTimeout(200);
    ok('no horizontal scroll — ' + label, !(await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
    ok('  gallery cards fit — ' + label, await p.evaluate(() => [...document.querySelectorAll('.gcard')].every(c => c.getBoundingClientRect().width > 100)));
    await ctx.close();
  }

  console.log('\n── 13. Facilitator layer, whole page ──');
  {
    const { ctx, p } = await granted(browser, '?facilitator=1');
    const n = await p.locator('.runstrip').count();
    ok('run strips present (' + n + ')', n >= 12, String(n));
    for (const sel of ['#preflight', '#spine', '#s1', '#s2', '#s3', '#close'])
      ok('  ' + sel + ' has a run strip', await p.locator(sel + ' .runstrip').count() >= 1);
    await ctx.close();
  }

  await browser.close();
  console.log('\n════════════════════════════════');
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log('════════════════════════════════\n');
  process.exit(fail ? 1 : 0);
})();
