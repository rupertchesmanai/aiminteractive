/* ============================================================
   Responsible AI Leadership — shared site behaviour
   - mode toggle (Present / Self-paced), persisted
   - capture: autosave any [data-capture] field to localStorage,
     surfaced later in My Leadership Plan
   - subnav scroll-spy
   - reduced-motion aware helpers
   ============================================================ */
(function(){
  const STORE_MODE = 'ral.mode';
  const STORE_CAP  = 'ral.capture';

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
  window.RAL = window.RAL || {};
  window.RAL.getCapture = loadCap;
  window.RAL.setCaptureValue = function(key,val){
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
  window.RAL.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- media: a11y + reduced-motion playback ---------- */
  function initMedia(){
    // hide decorative background media from assistive tech
    document.querySelectorAll('.hero-media img,.hero-media video,.qm img,.qm video')
      .forEach(el=>el.setAttribute('aria-hidden','true'));
    if(!window.RAL.reducedMotion) return;           // everyone else: autoplay stays as-is
    document.querySelectorAll('video[autoplay]').forEach(v=>{
      v.removeAttribute('autoplay');
      try{ v.pause(); }catch(e){}
      // attach the chip to a positioned ancestor that sits ABOVE the hero text layer
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
    if(p && (/^module-\d+$/.test(p) || p === 'airspace')){
      try{ localStorage.setItem('ral.last', p); }catch(e){}
    }
  }

  /* ---------- cheat-sheet lightbox ---------- */
  function initLightbox(){
    const sheets=document.querySelectorAll('[data-sheet]');
    if(!sheets.length) return;
    let lastFocus=null;
    let lb=document.getElementById('ral-lightbox');
    if(!lb){
      lb=document.createElement('div'); lb.id='ral-lightbox'; lb.className='lightbox';
      lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
      lb.setAttribute('aria-label','Cheat sheet viewer');
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

  document.addEventListener('DOMContentLoaded',()=>{
    initMode(); initCapture(); initSpy(); initLightbox(); recordLast(); initMedia(); initSkip();
  });
})();
