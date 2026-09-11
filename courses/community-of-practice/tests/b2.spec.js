const { chromium } = require('playwright');

const ROOT = 'http://127.0.0.1:8899';
const PAGE = ROOT + '/courses/community-of-practice/index.html';

let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? (pass++, console.log('  ✓ ' + n)) : (fail++, console.log('  ✗ ' + n + (x ? '  → ' + x : ''))); };

async function granted(browser, q = '', vp = { width: 1280, height: 900 }) {
  const ctx = await browser.newContext({ viewport: vp });
  const p = await ctx.newPage();
  await p.goto(ROOT + '/index.html');
  await p.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
  await p.goto(PAGE + q);
  await p.waitForTimeout(250);
  return { ctx, p };
}
const setState = (p, keys) => p.evaluate(ks => {
  Object.keys(COP_S2.state).forEach(k => COP_S2.state[k] = ks.includes(k));
  COP_S2.render();
}, keys);

(async () => {
  const browser = await chromium.launch();

  console.log('\n── 1. Rig renders ──');
  {
    const { ctx, p } = await granted(browser);
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.waitForTimeout(300);
    ok('no JS errors', errs.length === 0, errs.join(' | '));
    ok('COP_S2 exposed', await p.evaluate(() => typeof COP_S2 === 'object'));
    ok('plan-view SVG present', await p.locator('svg.pv').count() === 1);
    ok('front-view SVG present', await p.locator('svg.fv').count() === 1);
    ok('five light toggles', await p.locator('.lightbtn').count() === 5);
    ok('six presets', await p.locator('.presetbtn').count() === 6);
    ok('three triptych cards', await p.locator('.tcard').count() === 3);
    ok('verdict is a live region', await p.getAttribute('#rigVerdict', 'aria-live') === 'polite');
    await ctx.close();
  }

  console.log('\n── 2. Every one of the 32 combinations gets a real verdict ──');
  {
    const { ctx, p } = await granted(browser);
    const res = await p.evaluate(() => {
      const L = ['key', 'fill', 'back', 'window', 'overhead'];
      const seen = {}, out = [];
      for (let m = 0; m < 32; m++) {
        const s = {};
        L.forEach((k, i) => s[k] = !!(m & (1 << i)));
        const v = COP_S2.verdict(s);
        out.push({ m, on: L.filter(k => s[k]).join('+') || 'none', ok: !!(v && v.text && v.text.length > 40), text: v && v.text });
        seen[v.text] = (seen[v.text] || 0) + 1;
      }
      return { out, distinct: Object.keys(seen).length };
    });
    ok('all 32 combinations resolve to a verdict', res.out.every(r => r.ok), JSON.stringify(res.out.filter(r => !r.ok)));
    ok('verdicts are meaningfully distinct (' + res.distinct + ' texts)', res.distinct >= 13, String(res.distinct));
    // the teaching-critical ones
    const grab = async ks => { await setState(p, ks); return (await p.textContent('#rigText')); };
    ok('overhead+key names the conflict', (await grab(['overhead', 'key'])).includes('fighting your key'));
    ok('overhead alone names the hollow eyes', (await grab(['overhead'])).includes('hollows the eye sockets'));
    ok('full three-point reads as the answer', (await grab(['key', 'fill', 'back'])).includes('Full three-point'));
    ok('back alone gets the silhouette line', (await grab(['back'])).includes('silhouette'));
    ok('nothing on is flagged bad', await p.evaluate(() => { COP_S2.applyPreset('none'); return document.getElementById('rigVerdict').classList.contains('bad'); }));
    ok('full three-point is flagged good', await p.evaluate(() => { COP_S2.applyPreset('full'); return document.getElementById('rigVerdict').classList.contains('good'); }));
    await ctx.close();
  }

  console.log('\n── 3. Presets ──');
  {
    const { ctx, p } = await granted(browser);
    for (const [name, expect] of [['overhead', 'overhead'], ['window', 'window'], ['key', 'key'], ['keyfill', 'key,fill'], ['full', 'key,fill,back'], ['none', '']]) {
      await p.click(`.presetbtn[data-preset="${name}"]`);
      await p.waitForTimeout(80);
      const on = await p.evaluate(() => Object.keys(COP_S2.state).filter(k => COP_S2.state[k]).join(','));
      ok(`preset "${name}" sets ${expect || '(nothing)'}`, on === expect, on);
      const marked = await p.evaluate(n => document.querySelector(`.presetbtn[data-preset="${n}"]`).classList.contains('on'), name);
      ok(`  preset "${name}" marks itself active`, marked);
    }
    await ctx.close();
  }

  console.log('\n── 4. Toggles and aria-pressed ──');
  {
    const { ctx, p } = await granted(browser);
    await p.click('.presetbtn[data-preset="none"]');
    await p.click('.lightbtn[data-light="key"]');
    await p.waitForTimeout(80);
    ok('toggle on sets aria-pressed', await p.getAttribute('.lightbtn[data-light="key"]', 'aria-pressed') === 'true');
    ok('toggling key selects the "key" preset chip', await p.evaluate(() => document.querySelector('.presetbtn[data-preset="key"]').classList.contains('on')));
    await p.click('.lightbtn[data-light="key"]');
    await p.waitForTimeout(80);
    ok('toggle off clears aria-pressed', await p.getAttribute('.lightbtn[data-light="key"]', 'aria-pressed') === 'false');
    ok('every toggle is a real button', await p.evaluate(() => [...document.querySelectorAll('.lightbtn')].every(b => b.tagName === 'BUTTON' && b.type === 'button')));
    await ctx.close();
  }

  console.log('\n── 5. Plan view tracks state ──');
  {
    const { ctx, p } = await granted(browser);
    await setState(p, ['key', 'back']);
    ok('key group lit', await p.evaluate(() => document.querySelector('#pv-key').classList.contains('on')));
    ok('key body lit', await p.evaluate(() => document.querySelector('#pv-key-b').classList.contains('on')));
    ok('fill group dark', await p.evaluate(() => !document.querySelector('#pv-fill').classList.contains('on')));
    ok('back group lit', await p.evaluate(() => document.querySelector('#pv-back').classList.contains('on')));
    ok('key label highlighted', await p.evaluate(() => document.getElementById('lbl-key').classList.contains('on')));
    await setState(p, ['overhead']);
    ok('overhead ring lit', await p.evaluate(() => document.querySelector('#pv-overhead .ring').classList.contains('on')));
    await ctx.close();
  }

  console.log('\n── 6. Front view shading ──');
  {
    const { ctx, p } = await granted(browser);
    const op = id => p.evaluate(i => parseFloat(document.getElementById(i).getAttribute('opacity')), id);

    await setState(p, []);
    ok('nothing on → face goes dark', await op('fv-dark') > 0.8);

    await setState(p, ['key']);
    ok('key on → key layer lit', await op('fv-key') > 0.9);
    ok('key on → dark overlay cleared', await op('fv-dark') === 0);
    const shadeKeyOnly = await op('fv-shade');
    ok('key only → shadow side heavy', shadeKeyOnly > 0.6, String(shadeKeyOnly));

    await setState(p, ['key', 'fill']);
    const shadeFilled = await op('fv-shade');
    ok('fill lifts the shadow (this is the teaching point)', shadeFilled < shadeKeyOnly - 0.3, `${shadeKeyOnly} → ${shadeFilled}`);

    await setState(p, ['key', 'fill', 'back']);
    ok('back on → rim appears', await op('fv-rim') === 0.9, String(await op('fv-rim')));
    ok('back on → background separates', await op('fv-bgglow') === 1);

    await setState(p, ['overhead']);
    ok('overhead → top light on', await op('fv-top') > 0.8);
    ok('overhead alone → eye sockets hollow', await op('fv-sockets') > 0.8);
    await setState(p, ['overhead', 'key']);
    ok('overhead + key → sockets reduced but present', (await op('fv-sockets')) > 0 && (await op('fv-sockets')) < 0.5);

    // the two cues that actually carry direction
    await setState(p, ['key']);
    const noseKey = await op('fv-nose-side');
    ok('key casts a side nose shadow', noseKey > 0.7, String(noseKey));
    ok('  and no downward one', await op('fv-nose-down') === 0);
    await setState(p, ['key', 'fill']);
    ok('fill softens the cast shadow', await op('fv-nose-side') < noseKey - 0.3);
    await setState(p, ['overhead']);
    ok('overhead casts downward, not sideways', (await op('fv-nose-down')) > 0.7 && (await op('fv-nose-side')) === 0);

    const cx = s => p.evaluate(ks => {
      Object.keys(COP_S2.state).forEach(k => COP_S2.state[k] = ks.includes(k));
      COP_S2.render();
      return parseFloat(document.getElementById('gForm').getAttribute('cx'));
    }, s);
    const cxKey = await cx(['key']), cxWin = await cx(['window']), cxOver = await cx(['overhead']);
    ok('form highlight sits on the key side', cxKey < 130, String(cxKey));
    ok('  further left for a window', cxWin < cxKey, `${cxWin} vs ${cxKey}`);
    ok('  centred overhead', cxOver === 160, String(cxOver));
    await ctx.close();
  }

  console.log('\n── 7. Triptych ──');
  {
    const { ctx, p } = await granted(browser);
    const active = () => p.evaluate(() => [...document.querySelectorAll('.tcard.on')].map(c => c.getAttribute('data-tript')).join(','));
    await setState(p, ['key']);        ok('key only highlights card 1', await active() === 'key');
    await setState(p, ['key', 'fill']); ok('key+fill highlights card 2', await active() === 'keyfill');
    await setState(p, ['key', 'fill', 'back']); ok('full highlights card 3', await active() === 'full');
    await setState(p, ['overhead']);   ok('overhead highlights none', await active() === '');
    ok('all three portraits carry alt text', await p.evaluate(() => [...document.querySelectorAll('.tcard img')].every(i => i.alt && i.alt.length > 25)));
    await ctx.close();
  }

  console.log('\n── 8. Rig persists ──');
  {
    const { ctx, p } = await granted(browser);
    await p.click('.presetbtn[data-preset="full"]');
    await p.waitForTimeout(150);
    ok('state written to cop.capture', await p.evaluate(() => JSON.parse(localStorage.getItem('cop.capture'))['s2.rig.state']) === 'key,fill,back');
    await p.reload(); await p.waitForTimeout(400);
    ok('restores after reload', await p.evaluate(() => Object.keys(COP_S2.state).filter(k => COP_S2.state[k]).sort().join(',')) === 'back,fill,key');
    ok('and repaints the face', await p.evaluate(() => parseFloat(document.getElementById('fv-rim').getAttribute('opacity'))) === 0.9);
    await ctx.close();
  }

  console.log('\n── 9. The 60-second audit ──');
  {
    const { ctx, p } = await granted(browser);
    ok('six audit checkboxes', await p.locator('#audit input[type="checkbox"]').count() === 6);
    ok('starts at 0/6', (await p.textContent('#auditScore')).replace(/\s/g, '') === '0/6');
    ok('prompt copy at zero', (await p.textContent('#auditVerdict')).includes('already true'));

    await p.check('input[data-key="s2.audit.1"]');
    await p.check('input[data-key="s2.audit.2"]');
    await p.waitForTimeout(200);
    ok('score reaches 2/6', (await p.textContent('#auditScore')).replace(/\s/g, '') === '2/6');
    ok('low band copy', (await p.textContent('#auditVerdict')).includes('Plenty to gain'));
    ok('fill width tracks', await p.evaluate(() => document.getElementById('auditFill').style.width) === '33%');

    for (const n of [3, 4]) await p.check(`input[data-key="s2.audit.${n}"]`);
    await p.waitForTimeout(200);
    ok('mid band at 4/6', (await p.textContent('#auditVerdict')).includes('Most of the way'));

    for (const n of [5, 6]) await p.check(`input[data-key="s2.audit.${n}"]`);
    await p.waitForTimeout(200);
    ok('score reaches 6/6', (await p.textContent('#auditScore')).replace(/\s/g, '') === '6/6');
    ok('top band copy', (await p.textContent('#auditVerdict')).includes('better lit than almost everyone'));
    ok('fill full', await p.evaluate(() => document.getElementById('auditFill').style.width) === '100%');

    await p.reload(); await p.waitForTimeout(400);
    ok('audit survives reload', (await p.textContent('#auditScore')).replace(/\s/g, '') === '6/6');
    await ctx.close();
  }

  console.log('\n── 10. Before/after reveal gate ──');
  {
    const { ctx, p } = await granted(browser);
    ok('before/after hidden initially', !(await p.locator('#baPair').isVisible()));
    ok('gate button disabled with no fix', await p.isDisabled('[data-reveal="#baPair"]'));
    await p.fill('#s2fix', 'turn the desk to face the window');
    await p.waitForTimeout(600);
    ok('gate enables once the fix is typed', !(await p.isDisabled('[data-reveal="#baPair"]')));
    await p.click('[data-reveal="#baPair"]');
    await p.waitForTimeout(300);
    ok('pair revealed', await p.locator('#baPair').isVisible());
    ok('button locks to "Fixed"', (await p.textContent('[data-reveal="#baPair"]')).includes('Fixed'));
    ok('before frame has no people (by design)', (await p.getAttribute('.ba .before img', 'alt')).includes('empty desk'));
    await p.reload(); await p.waitForTimeout(400);
    ok('stays revealed after reload', await p.locator('#baPair').isVisible());
    await ctx.close();
  }

  console.log('\n── 11. Kit ladder ──');
  {
    const { ctx, p } = await granted(browser);
    ok('four tiers', await p.locator('.ladder details').count() === 4);
    ok('tier 1 open by default', await p.evaluate(() => document.querySelector('.ladder details[data-tier="1"]').open));
    ok('every tier carries a price', await p.evaluate(() => [...document.querySelectorAll('.ladder .price')].every(e => e.textContent.trim().length > 0)));
    ok('tier 1 is free', (await p.textContent('.ladder details[data-tier="1"] .price')).trim() === '$0');
    ok('prices ascend across the tiers', await p.evaluate(() => {
      const num = t => { const m = t.replace(/,/g, '').match(/(\d+)/g); return m ? Math.max(...m.map(Number)) : 0; };
      const v = [...document.querySelectorAll('.ladder .price')].map(e => num(e.textContent));
      return v.every((n, i) => i === 0 || n >= v[i - 1]);
    }));
    ok('each priced tier names the item the figure came from', await p.evaluate(() =>
      [...document.querySelectorAll('.ladder details')].slice(1).every(d => /Benchmark:/.test(d.textContent))));
    await p.click('.ladder details[data-tier="3"] summary');
    await p.waitForTimeout(120);
    ok('tiers open on click', await p.evaluate(() => document.querySelector('.ladder details[data-tier="3"]').open));
    await ctx.close();
  }

  console.log('\n── 12. Encore ──');
  {
    const { ctx, p } = await granted(browser);
    const txt = await p.textContent('.encore');
    ok('names the device once', (txt.match(/RØDECaster Video S/g) || []).length === 1);
    ok('leads with the one-webcam point', txt.includes('one webcam and one microphone'));
    ok('five capability lines', await p.locator('.encore li').count() === 5);
    ok('closes on "show, don\'t teach"', txt.includes('I wanted you to see the ceiling'));
    await ctx.close();
  }

  console.log('\n── 13. Facilitator layer in S2 ──');
  {
    const { ctx, p } = await granted(browser);
    ok('S2 run strips hidden by default', await p.locator('#s2 .runstrip').first().isVisible() === false);
    await ctx.close();
  }
  {
    const { ctx, p } = await granted(browser, '?facilitator=1');
    ok('four S2 run strips visible', await p.locator('#s2 .runstrip:visible').count() === 4, String(await p.locator('#s2 .runstrip').count()));
    ok('pricing provenance surfaced to the facilitator', (await p.textContent('#s2')).includes('checked 11 September 2026'));
    ok('  and framed as ballpark, not a quote', (await p.textContent('#s2')).includes('ballpark, not quotes'));
    await ctx.close();
  }

  console.log('\n── 14. Layout & reduced motion ──');
  for (const [w, h, label] of [[390, 844, 'phone'], [820, 1100, 'tablet'], [1280, 720, 'projector'], [1680, 1050, 'desktop']]) {
    const { ctx, p } = await granted(browser, '', { width: w, height: h });
    const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    ok('no horizontal scroll — ' + label, !over);
    const svgFits = await p.evaluate(() => {
      const s = document.querySelector('svg.pv').getBoundingClientRect();
      return s.width > 120 && s.width <= window.innerWidth;
    });
    ok('  rig SVG fits — ' + label, svgFits);
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(ROOT + '/index.html');
    await p.evaluate(() => sessionStorage.setItem('aim_access_community-of-practice', 'granted'));
    await p.goto(PAGE);
    await p.waitForTimeout(300);
    const t = await p.evaluate(() => getComputedStyle(document.querySelector('#pv-key .cone')).transitionDuration);
    ok('reduced motion kills rig transitions', parseFloat(t) < 0.01, t);
    await setState(p, ['key', 'fill', 'back']);
    ok('  state still changes with motion off', await p.evaluate(() => parseFloat(document.getElementById('fv-rim').getAttribute('opacity'))) === 0.9);
    await ctx.close();
  }

  console.log('\n── 15. B1 regressions ──');
  {
    const { ctx, p } = await granted(browser);
    await p.check('input[data-key="pf.studio"]');
    await p.waitForTimeout(200);
    ok('progress bar still counts', (await p.textContent('#progLabel')).trim() === '1 / 12');
    ok('mode toggle still injected', await p.locator('#cop-mode button').count() === 2);
    ok('savebar still present', await p.locator('#cop-savebar').count() === 1);
    await ctx.close();
  }

  await browser.close();
  console.log('\n════════════════════════════════');
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log('════════════════════════════════\n');
  process.exit(fail ? 1 : 0);
})();
