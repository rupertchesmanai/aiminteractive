/* ============================================================
   AI for Teamwork — shared site behaviour
   - mode toggle (Present / Self-paced), persisted
   - capture: autosave any [data-capture] field to localStorage,
     surfaced later in My Teamwork Plan
   - subnav scroll-spy
   - reduced-motion aware helpers
   Forked from the Responsible AI Leadership system (RAL → AFT).
   ============================================================ */
(function(){
  const STORE_MODE = 'aft.mode';
  const STORE_CAP  = 'aft.capture';

  /* ---------- mode ---------- */
  function applyMode(m){
    document.body.classList.toggle('present', m === 'present');
    document.querySelectorAll('[data-mode]').forEach(b=>{
      b.classList.toggle('on', b.dataset.mode === m);
    });
  }
  function initMode(){
    let m = 'self';
    try{ m = localStorage.getItem(STORE_MODE) || 'self'; }catch(e){}
    applyMode(m);
    document.querySelectorAll('[data-mode]').forEach(b=>{
      b.addEventListener('click',()=>{
        const mm = b.dataset.mode;
        applyMode(mm);
        try{ localStorage.setItem(STORE_MODE, mm); }catch(e){}
      });
    });
  }

  /* ---------- capture / persistence ---------- */
  function loadCap(){
    try{ return JSON.parse(localStorage.getItem(STORE_CAP) || '{}'); }catch(e){ return {}; }
  }
  function saveCap(obj){
    try{ localStorage.setItem(STORE_CAP, JSON.stringify(obj)); }catch(e){}
  }
  window.AFT = window.AFT || {};
  window.AFT.getCapture = loadCap;
  window.AFT.setCaptureValue = function(key,val){
    const c = loadCap(); c[key]=val; saveCap(c);
  };

  function initCapture(){
    const data = loadCap();
    document.querySelectorAll('[data-capture]').forEach(el=>{
      const key = el.getAttribute('data-capture');
      if(data[key] !== undefined) el.value = data[key];
      let timer=null;
      const savedTag = el.closest('.field') ? el.closest('.field').querySelector('.saved') : null;
      el.addEventListener('input',()=>{
        const c = loadCap(); c[key]=el.value; saveCap(c);
        if(savedTag){ savedTag.classList.add('show'); clearTimeout(timer);
          timer=setTimeout(()=>savedTag.classList.remove('show'),1400); }
        document.dispatchEvent(new CustomEvent('aft:capture',{detail:{key,value:el.value}}));
      });
    });
  }

  /* ---------- subnav scroll-spy ---------- */
  function initSpy(){
    const links = [...document.querySelectorAll('.subnav a[href^="#"]')];
    if(!links.length) return;
    const map = links.map(a=>({a, sec:document.querySelector(a.getAttribute('href'))})).filter(x=>x.sec);
    const obs = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if(e.isIntersecting){
          links.forEach(l=>l.classList.remove('active'));
          const hit = map.find(m=>m.sec===e.target);
          if(hit) hit.a.classList.add('active');
        }
      });
    },{rootMargin:'-45% 0px -50% 0px',threshold:0});
    map.forEach(m=>obs.observe(m.sec));
  }

  /* ---------- reduced motion ---------- */
  window.AFT.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- media: a11y + reduced-motion playback ---------- */
  function initMedia(){
    document.querySelectorAll('.hero-media img,.hero-media video,.qm img,.qm video,.rimg img')
      .forEach(el=>el.setAttribute('aria-hidden','true'));
    if(!window.AFT.reducedMotion) return;
    document.querySelectorAll('video[autoplay]').forEach(v=>{
      v.removeAttribute('autoplay');
      try{ v.pause(); }catch(e){}
      const target = v.closest('.mhero') || v.closest('.quoteband') || v.parentElement;
      if(!target) return;
      if(getComputedStyle(target).position === 'static') target.style.position='relative';
      const btn=document.createElement('button');
      btn.type='button'; btn.className='rm-play';
      btn.setAttribute('aria-label','Play background video');
      btn.innerHTML='&#9654; Play video';
      btn.addEventListener('click',()=>{ const p=v.play(); if(p&&p.catch)p.catch(()=>{}); btn.remove(); });
      target.appendChild(btn);
    });
  }

  /* ---------- skip-to-content link ---------- */
  function initSkip(){
    if(document.querySelector('.skip-link')) return;
    const target=document.querySelector('main')||document.querySelector('section.band')||document.querySelector('.mhero');
    if(!target) return;
    if(!target.id) target.id='main-content';
    const a=document.createElement('a');
    a.className='skip-link'; a.href='#'+target.id; a.textContent='Skip to content';
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ---------- resume: record last module visited ---------- */
  function recordLast(){
    const p = document.body.getAttribute('data-page');
    if(p && /^module-\d+$/.test(p)){
      try{ localStorage.setItem('aft.last', p); }catch(e){}
    }
  }

  /* ---------- lightbox (cheat sheets / large images) ---------- */
  function initLightbox(){
    const sheets=document.querySelectorAll('[data-sheet]');
    if(!sheets.length) return;
    let lastFocus=null;
    let lb=document.getElementById('aft-lightbox');
    if(!lb){
      lb=document.createElement('div'); lb.id='aft-lightbox'; lb.className='lightbox';
      lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
      lb.setAttribute('aria-label','Image viewer');
      lb.innerHTML='<div class="lbinner"><button class="lbclose" aria-label="Close viewer">&times;</button>'
        +'<img alt=""><div class="lbbar"><span class="lbtitle"></span>'
        +'<a class="lbdl" target="_blank" rel="noopener">Open / download &#8599;</a></div></div>';
      document.body.appendChild(lb);
      const closeFn=()=>{lb.classList.remove('open');document.body.classList.remove('lb-open');
        if(lastFocus&&lastFocus.focus){try{lastFocus.focus();}catch(e){}}};
      lb.addEventListener('click',e=>{ if(e.target===lb) closeFn(); });
      lb.querySelector('.lbclose').addEventListener('click',closeFn);
      document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&lb.classList.contains('open')) closeFn(); });
    }
    const img=lb.querySelector('img'), title=lb.querySelector('.lbtitle'), dl=lb.querySelector('.lbdl'),
          closeBtn=lb.querySelector('.lbclose');
    sheets.forEach(el=>{
      el.addEventListener('click',()=>{
        const full=el.getAttribute('data-full'), t=el.getAttribute('data-title')||'';
        img.src=full; img.alt=t; title.textContent=t; dl.href=full;
        lb.classList.add('open'); document.body.classList.add('lb-open');
        lastFocus=el; if(closeBtn&&closeBtn.focus){try{closeBtn.focus();}catch(e){}}
      });
    });
  }

  /* ============================================================
     Phase 2 — interactive component library
     All components are markup-driven: add the class + data
     attributes and they self-initialise on DOMContentLoaded.
     ============================================================ */

  /* ---------- copy-chip ---------- */
  function copyText(txt){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(txt).catch(()=>fallbackCopy(txt));
    }
    return Promise.resolve(fallbackCopy(txt));
  }
  function fallbackCopy(txt){
    const ta=document.createElement('textarea');
    ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta);
  }
  function initCopyChips(){
    document.querySelectorAll('.copychip').forEach(btn=>{
      if(btn.dataset.bound) return; btn.dataset.bound='1';
      const orig = btn.textContent;
      btn.addEventListener('click',()=>{
        let src=null;
        const sel=btn.getAttribute('data-copy');
        if(sel) src=document.querySelector(sel);
        if(!src){ const box=btn.closest('.promptbox'); if(box) src=box.querySelector('pre,code,textarea'); }
        if(!src) return;
        const txt=('value' in src && src.tagName==='TEXTAREA') ? src.value : src.textContent;
        copyText(txt.trim());
        btn.classList.add('done'); btn.textContent='Copied ✓';
        setTimeout(()=>{btn.classList.remove('done'); btn.textContent=orig;},1600);
      });
    });
  }

  /* ---------- ai-gate ---------- */
  function initGates(){
    const gates=[...document.querySelectorAll('.ai-gate[data-gate]')];
    if(!gates.length) return;
    function refresh(){
      const cap=loadCap();
      gates.forEach(g=>{
        const key=g.getAttribute('data-gate');
        const min=parseInt(g.getAttribute('data-gate-min')||'1',10);
        const val=(cap[key]||'').trim();
        g.classList.toggle('open', val.length>=min);
      });
    }
    refresh();
    document.addEventListener('aft:capture',refresh);
  }

  /* ---------- spectrum ---------- */
  function initSpectrums(){
    document.querySelectorAll('.spectrum[data-zones]').forEach(sp=>{
      const range=sp.querySelector('input[type=range]');
      const out=sp.querySelector('.sp-readout');
      if(!range||!out) return;
      const zones=sp.getAttribute('data-zones').split('|');
      function readout(){
        const v=Number(range.value);
        const idx=Math.min(zones.length-1, Math.floor(v/(100.0001/zones.length)));
        out.textContent='Your position: '+zones[idx]+' ('+v+'/100)';
      }
      range.addEventListener('input',readout);
      readout();
    });
  }

  /* ---------- tabs ---------- */
  function initTabs(){
    document.querySelectorAll('[data-tabs]').forEach(t=>{
      const tabs=[...t.querySelectorAll('.tab')];
      const panes=[...t.querySelectorAll('.tabpane')];
      tabs.forEach(tab=>{
        tab.addEventListener('click',()=>{
          tabs.forEach(x=>x.classList.remove('on'));
          panes.forEach(x=>x.classList.remove('on'));
          tab.classList.add('on');
          const p=t.querySelector('.tabpane[data-pane="'+tab.getAttribute('data-tab')+'"]');
          if(p) p.classList.add('on');
        });
      });
    });
  }

  /* ---------- sorter (tap item, tap column; tap placed item to return) ---------- */
  function initSorters(){
    document.querySelectorAll('.sorter[data-sorter]').forEach(s=>{
      const key=s.getAttribute('data-sorter');
      const cols=s.getAttribute('data-cols').split('|');
      const pool=s.querySelector('.sorter-pool');
      const items=[...pool.querySelectorAll('.chipitem')];
      items.forEach((it,i)=>it.dataset.idx=String(i));
      const colWrap=document.createElement('div');
      colWrap.className='sorter-cols'; colWrap.style.setProperty('--cols',cols.length);
      colWrap.innerHTML=cols.map((c,ci)=>'<div class="scol" data-col="'+ci+'"><h5>'+c+'</h5><div class="sdrop"></div></div>').join('');
      s.appendChild(colWrap);
      let armed=null;
      function save(){
        const state={};
        colWrap.querySelectorAll('.scol').forEach(col=>{
          col.querySelectorAll('.chipitem').forEach(it=>{ state[it.dataset.idx]=col.getAttribute('data-col'); });
        });
        window.AFT.setCaptureValue(key, JSON.stringify(state));
        document.dispatchEvent(new CustomEvent('aft:capture',{detail:{key}}));
      }
      function arm(it){
        if(armed===it){ disarm(); return; }
        disarm(); armed=it; it.classList.add('sel');
        colWrap.querySelectorAll('.scol').forEach(c=>c.classList.add('armed'));
      }
      function disarm(){
        if(armed) armed.classList.remove('sel');
        armed=null;
        colWrap.querySelectorAll('.scol').forEach(c=>c.classList.remove('armed'));
      }
      s.addEventListener('click',e=>{
        const it=e.target.closest('.chipitem');
        if(it){
          if(it.parentElement.classList.contains('sdrop') && armed!==it){ pool.appendChild(it); disarm(); save(); return; }
          arm(it); return;
        }
        const col=e.target.closest('.scol');
        if(col && armed){ col.querySelector('.sdrop').appendChild(armed); disarm(); save(); }
      });
      /* restore */
      try{
        const state=JSON.parse((loadCap()[key])||'{}');
        Object.keys(state).forEach(idx=>{
          const it=items[Number(idx)];
          const col=colWrap.querySelector('.scol[data-col="'+state[idx]+'"] .sdrop');
          if(it&&col) col.appendChild(it);
        });
      }catch(e){}
    });
  }

  /* ---------- reveal ---------- */
  function initReveals(){
    document.querySelectorAll('.reveal').forEach(r=>{
      const steps=[...r.querySelectorAll('.rv-step')];
      const btn=r.querySelector('.rv-next');
      if(!steps.length||!btn) return;
      let i=0; steps[0].classList.add('shown');
      const orig=btn.textContent;
      btn.addEventListener('click',()=>{
        if(i>=steps.length-1) return;
        i++; steps[i].classList.add('shown');
        if(i===steps.length-1){ btn.classList.add('doneAll'); btn.textContent=btn.getAttribute('data-done')||'Story complete'; }
        else if(btn.getAttribute('data-count')!=='off'){ btn.textContent=orig+' ('+(steps.length-1-i)+' left)'; }
      });
    });
  }

  /* ---------- flagset ---------- */
  function initFlagsets(){
    document.querySelectorAll('.flagset').forEach(f=>{
      const flags=[...f.querySelectorAll('.flag')];
      const score=f.querySelector('.fs-score');
      const total=flags.filter(x=>x.getAttribute('data-good')==='1').length;
      function update(){
        if(!score) return;
        const found=f.querySelectorAll('.flag.hit').length;
        score.textContent='Found '+found+' of '+total+' details worth verifying.'+(found===total?' All caught — nice scepticism.':'');
      }
      flags.forEach(fl=>{
        fl.addEventListener('click',()=>{
          if(fl.classList.contains('hit')||fl.classList.contains('miss')) return;
          fl.classList.add(fl.getAttribute('data-good')==='1'?'hit':'miss');
          update();
        });
      });
      update();
    });
  }

  /* ---------- timer chip ---------- */
  function initTimers(){
    document.querySelectorAll('.timerchip[data-minutes]').forEach(t=>{
      const mins=Number(t.getAttribute('data-minutes'));
      let left=mins*60, iv=null;
      function fmt(s){ return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
      function render(){ t.textContent='⏱ '+fmt(Math.max(0,left)); }
      render();
      t.addEventListener('click',()=>{
        if(iv){ clearInterval(iv); iv=null; left=mins*60; t.classList.remove('running','up'); render(); return; }
        t.classList.add('running');
        iv=setInterval(()=>{
          left--;
          if(left<=0){ clearInterval(iv); iv=null; left=0; t.classList.remove('running'); t.classList.add('up'); t.textContent='⏱ Time'; return; }
          render();
        },1000);
      });
    });
  }

  /* ---------- checklist ---------- */
  function initChecklists(){
    document.querySelectorAll('.checklist[data-checklist]').forEach(cl=>{
      const key=cl.getAttribute('data-checklist');
      const boxes=[...cl.querySelectorAll('input[type=checkbox]')];
      boxes.forEach((b,i)=>{ if(!b.dataset.ck) b.dataset.ck='item'+i; });
      try{
        const state=JSON.parse((loadCap()[key])||'[]');
        boxes.forEach(b=>{ b.checked = state.indexOf(b.dataset.ck)>-1; });
      }catch(e){}
      cl.addEventListener('change',()=>{
        const state=boxes.filter(b=>b.checked).map(b=>b.dataset.ck);
        window.AFT.setCaptureValue(key, JSON.stringify(state));
        document.dispatchEvent(new CustomEvent('aft:capture',{detail:{key}}));
      });
    });
  }

  /* ---------- pinned challenge strip (re-display a12_challenge) ---------- */
  function initPins(){
    document.querySelectorAll('[data-pin]').forEach(p=>{
      function refresh(){
        const key=p.getAttribute('data-pin');
        const val=(loadCap()[key]||'').trim();
        p.innerHTML = val
          ? val.replace(/&/g,'&amp;').replace(/</g,'&lt;')
          : '<span class="empty">Not captured yet — set this in '+(p.getAttribute('data-pin-from')||'the Welcome page')+'.</span>';
      }
      refresh();
      document.addEventListener('aft:capture',refresh);
    });
  }

  /* ---------- print button ---------- */
  function initPrint(){
    document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
  }

  window.AFT.components = { initCopyChips, initGates, initSpectrums, initTabs, initSorters, initReveals, initFlagsets, initTimers, initChecklists, initPins, initPrint };

  document.addEventListener('DOMContentLoaded',()=>{
    initMode(); initCapture(); initSpy(); initLightbox(); recordLast(); initMedia(); initSkip();
    initCopyChips(); initGates(); initSpectrums(); initTabs(); initSorters();
    initReveals(); initFlagsets(); initTimers(); initChecklists(); initPins(); initPrint();
  });
})();
