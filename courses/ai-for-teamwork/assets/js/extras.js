/* ============================================================
   AI for Teamwork — Fun Extras engine (E1)
   - extras strip renderer: a module page declares its extras in
     a <div class="extras-strip" data-extras='[...]'> and this
     file draws the cards and wires Launch buttons.
   - overlay shell: full-screen game panel, Esc/click-close,
     scroll lock, replay.
   - game registry: AFTX.register(id, factory). A factory gets
     ({root, ui, close, replay}) and builds its game into root.
   - ui primitives: deck, vote, order, spinner, score, reveal,
     pointCard — shared by every game (E2–E5 add the games).
   Scores are ephemeral: nothing here writes to aft.capture.
   ============================================================ */
(function(){
  var GAMES = {};
  var overlay, panel, headImg, headType, headTitle, bodyEl, replayBtn, lastFocus=null, current=null;

  window.AFTX = {
    register: function(id, factory){ GAMES[id] = factory; },
    has: function(id){ return !!GAMES[id]; },
    launch: launch,
    ui: {}
  };

  /* ---------------- overlay shell ---------------- */
  function ensureOverlay(){
    if(overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'gx-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML =
      '<div class="gx-panel">'
      + '<div class="gx-head"><img alt=""><button class="gx-close" aria-label="Close game">&times;</button>'
      + '<div class="gx-ht"><div class="gx-type"></div><div class="gx-title"></div></div></div>'
      + '<div class="gx-body"></div>'
      + '<div class="gx-foot"><span style="font-family:var(--head);font-size:12.5px;color:rgba(255,255,255,.55)">Optional extra · scores are just for the room</span>'
      + '<button class="btn dark gx-replay" type="button">↻ Play again</button></div>'
      + '</div>';
    document.body.appendChild(overlay);
    headImg = overlay.querySelector('.gx-head img');
    headType = overlay.querySelector('.gx-type');
    headTitle = overlay.querySelector('.gx-title');
    bodyEl = overlay.querySelector('.gx-body');
    replayBtn = overlay.querySelector('.gx-replay');
    overlay.querySelector('.gx-close').addEventListener('click', closeGame);
    overlay.addEventListener('click', function(e){ if(e.target===overlay) closeGame(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && overlay.classList.contains('open')) closeGame(); });
    replayBtn.addEventListener('click', function(){ if(current) boot(current); });
  }

  function launch(meta){
    if(!GAMES[meta.id]) return;
    ensureOverlay();
    current = meta;
    lastFocus = document.activeElement;
    headImg.src = meta.imgSrc || '';
    headType.textContent = 'Extra · ' + (meta.type||'Game');
    headTitle.textContent = meta.title || '';
    overlay.classList.add('open');
    document.body.classList.add('gx-open');
    boot(meta);
    var c = overlay.querySelector('.gx-close');
    if(c && c.focus){ try{ c.focus(); }catch(e){} }
  }

  function boot(meta){
    bodyEl.innerHTML = '';
    stopTimers();
    GAMES[meta.id]({ root: bodyEl, ui: window.AFTX.ui, close: closeGame });
  }

  function closeGame(){
    if(!overlay) return;
    overlay.classList.remove('open');
    document.body.classList.remove('gx-open');
    stopTimers();
    bodyEl.innerHTML='';
    current=null;
    if(lastFocus && lastFocus.focus){ try{ lastFocus.focus(); }catch(e){} }
  }

  /* live timers so close/replay can cancel them */
  var timers=[];
  function addTimer(t){ timers.push(t); return t; }
  function stopTimers(){ timers.forEach(clearInterval); timers.forEach(clearTimeout); timers=[]; }

  /* ---------------- helpers ---------------- */
  function el(tag, cls, html){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(html!==undefined) n.innerHTML=html;
    return n;
  }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  window.AFTX.ui.el = el; window.AFTX.ui.esc = esc; window.AFTX.ui.shuffle = shuffle;

  /* ---------------- scoreboard ---------------- */
  /* var s = ui.score(root); s.add(1); s.miss(); s.set('7 / 10'); */
  window.AFTX.ui.score = function(root){
    var box = el('div','gx-score','<span class="pts">0</span><span>pts</span><span class="streak"></span>');
    root.appendChild(box);
    var pts=0, streak=0;
    return {
      add:function(n){ pts+=(n===undefined?1:n); streak++; render(); },
      miss:function(){ streak=0; render(); },
      value:function(){ return pts; },
      set:function(text){ box.querySelector('.pts').textContent=text; box.querySelector('.streak').textContent=''; },
      el: box
    };
    function render(){
      box.querySelector('.pts').textContent = pts;
      box.querySelector('.streak').textContent = streak>=3 ? '🔥 streak ×'+streak : '';
    }
  };

  /* ---------------- point card ---------------- */
  window.AFTX.ui.pointCard = function(root, text){
    var p = el('div','gx-point','<div class="pt-tag">The point</div><div class="pt-text">'+esc(text)+'</div>');
    root.appendChild(p);
    p.scrollIntoView({block:'nearest',behavior:'smooth'});
    return p;
  };

  /* ---------------- reveal box ---------------- */
  window.AFTX.ui.reveal = function(root, html, bad){
    var r = el('div','gx-reveal'+(bad?' bad':''), html);
    root.appendChild(r);
    requestAnimationFrame(function(){ r.classList.add('show'); });
    return r;
  };

  /* ---------------- vote row ---------------- */
  /* ui.vote(root, {options:[{label,correct?,why?}], onDone(pickedIdx, wasCorrect)}) */
  window.AFTX.ui.vote = function(root, cfg){
    var wrap = el('div','gx-votes');
    var done=false;
    (cfg.options||[]).forEach(function(o,i){
      var b = el('button','gx-vote', esc(o.label));
      b.type='button';
      b.addEventListener('click', function(){
        if(done) return; done=true;
        b.classList.add('sel');
        var hasKey = (cfg.options||[]).some(function(x){ return x.correct; });
        wrap.querySelectorAll('.gx-vote').forEach(function(x,xi){
          x.disabled=true;
          if(hasKey){
            if(cfg.options[xi].correct) x.classList.add('right');
            else if(xi===i) x.classList.add('wrong');
          }
        });
        var correct = hasKey ? !!o.correct : null;
        if(o.why || (hasKey && !correct && keyWhy())){
          window.AFTX.ui.reveal(wrap.parentElement, esc(o.why || keyWhy()), hasKey && !correct);
        }
        if(cfg.onDone) cfg.onDone(i, correct);
        function keyWhy(){ var k=(cfg.options||[]).filter(function(x){return x.correct;})[0]; return k && k.why; }
      });
      wrap.appendChild(b);
    });
    root.appendChild(wrap);
    return wrap;
  };

  /* ---------------- timed deck ---------------- */
  /* ui.deck(root, {rounds:[fn(container, next)], label:'Round', onEnd}) */
  window.AFTX.ui.deck = function(root, cfg){
    var i=-1;
    var holder = el('div');
    root.appendChild(holder);
    function next(){
      i++;
      if(i>=cfg.rounds.length){ if(cfg.onEnd) cfg.onEnd(); return; }
      holder.innerHTML='';
      var lab = el('div','gx-round', esc((cfg.label||'Round')+' '+(i+1)+' of '+cfg.rounds.length));
      holder.appendChild(lab);
      cfg.rounds[i](holder, next, i);
      holder.scrollIntoView({block:'nearest'});
    }
    next();
    return { next: next };
  };

  /* ---------------- countdown bar ---------------- */
  /* ui.countdown(root, seconds, onExpire) → {stop} */
  window.AFTX.ui.countdown = function(root, seconds, onExpire){
    var bar = el('div','gx-timerbar','<i></i>');
    root.appendChild(bar);
    var left = seconds, fill = bar.querySelector('i');
    var iv = addTimer(setInterval(function(){
      left -= 0.25;
      var pct = Math.max(0, left/seconds*100);
      fill.style.width = pct+'%';
      if(left/seconds < 0.25) bar.classList.add('low');
      if(left<=0){ clearInterval(iv); if(onExpire) onExpire(); }
    },250));
    return { stop: function(){ clearInterval(iv); }, el: bar };
  };

  /* ---------------- order list (tap two to swap) ---------------- */
  /* ui.order(root, {items:[label], answer:[labels in correct order], onSolved(movesUsed)}) */
  window.AFTX.ui.order = function(root, cfg){
    var currentOrder = shuffle(cfg.items);
    /* ensure we don't start solved */
    if(currentOrder.join('|')===cfg.answer.join('|')) currentOrder.reverse();
    var wrap = el('div','gx-order');
    root.appendChild(wrap);
    var selIdx=null, locked=false;
    function render(){
      wrap.innerHTML='';
      currentOrder.forEach(function(label, idx){
        var b = el('button','gx-oitem','<span class="gx-num">'+(idx+1)+'</span><span>'+esc(label)+'</span>');
        b.type='button';
        if(idx===selIdx) b.classList.add('sel');
        b.addEventListener('click', function(){
          if(locked) return;
          if(selIdx===null){ selIdx=idx; render(); return; }
          if(selIdx===idx){ selIdx=null; render(); return; }
          var t=currentOrder[selIdx]; currentOrder[selIdx]=currentOrder[idx]; currentOrder[idx]=t;
          selIdx=null; render(); check();
        });
        wrap.appendChild(b);
      });
    }
    function check(){
      var right = currentOrder.every(function(l,i){ return l===cfg.answer[i]; });
      if(right){
        locked=true;
        wrap.querySelectorAll('.gx-oitem').forEach(function(x){ x.classList.add('right'); });
        if(cfg.onSolved) cfg.onSolved();
      }
    }
    render();
    return {
      grade: function(){ /* mark rights/wrongs without solving */
        wrap.querySelectorAll('.gx-oitem').forEach(function(x,i){
          x.classList.add(currentOrder[i]===cfg.answer[i] ? 'right' : 'wrong');
        });
        return currentOrder.filter(function(l,i){ return l===cfg.answer[i]; }).length;
      },
      current: function(){ return currentOrder.slice(); }
    };
  };

  /* ---------------- spinner ---------------- */
  /* ui.spinner(root, {segments:[{label,color?}], button:'Spin', onLand(segment,idx)}) */
  window.AFTX.ui.spinner = function(root, cfg){
    var segs = cfg.segments||[];
    var colors = ['#00C0AF','#F1EEDE','#DC5A46','#2D7DD2','#53DFCB','#B53D2C','#7EB8EE','#008D80'];
    var stops=[], per=360/segs.length;
    segs.forEach(function(s,i){
      var c = s.color || colors[i%colors.length];
      stops.push(c+' '+(i*per)+'deg '+((i+1)*per)+'deg');
    });
    var wrap = el('div','gx-spinwrap');
    var wheelBox = el('div',null,'');
    wheelBox.style.position='relative';
    var wheel = el('div','gx-wheel');
    wheel.style.background = 'conic-gradient('+stops.join(',')+')';
    var pointer = el('div','gx-pointer');
    wheelBox.appendChild(wheel); wheelBox.appendChild(pointer);
    var result = el('div','gx-spinresult');
    var btn = el('button','btn accent', esc(cfg.button||'Spin'));
    btn.type='button';
    var big = el('div','sr-big','&nbsp;');
    result.appendChild(btn); result.appendChild(big);
    wrap.appendChild(wheelBox); wrap.appendChild(result);
    root.appendChild(wrap);
    var rot=0, spinning=false;
    btn.addEventListener('click', function(){
      if(spinning) return; spinning=true; btn.disabled=true;
      big.innerHTML='&nbsp;';
      var idx = Math.floor(Math.random()*segs.length);
      /* pointer at top = 0deg; land centre of segment idx under pointer */
      var target = 360*4 + (360 - (idx*per + per/2));
      rot += target - (rot % 360);
      wheel.style.transform = 'rotate('+rot+'deg)';
      addTimer(setTimeout(function(){
        spinning=false; btn.disabled=false;
        big.textContent = segs[idx].label;
        if(cfg.onLand) cfg.onLand(segs[idx], idx);
      }, 3400));
    });
    return { spin: function(){ btn.click(); }, button: btn, resultEl: big };
  };

  /* ---------------- lead paragraph ---------------- */
  window.AFTX.ui.lead = function(root, text){
    var p = el('p','gx-lead', esc(text));
    root.appendChild(p);
    return p;
  };

  /* ---------------- strip renderer ---------------- */
  function initStrips(){
    document.querySelectorAll('.extras-strip[data-extras]').forEach(function(strip){
      if(strip.dataset.built) return; strip.dataset.built='1';
      var list=[];
      try{ list = JSON.parse(strip.getAttribute('data-extras')); }catch(e){ return; }
      var picsBase = strip.getAttribute('data-pics') || '../assets/media/pics/';
      strip.innerHTML =
        '<div class="ex-eyebrow">Extras</div>'
        + '<div class="ex-label">Optional — if we have time</div>'
        + '<div class="ex-grid"></div>';
      var grid = strip.querySelector('.ex-grid');
      list.forEach(function(x){
        var ready = window.AFTX.has(x.id);
        var card = el('button','ex-card'+(ready?'':' soon'));
        card.type='button';
        card.innerHTML =
          '<span class="ex-img"><img src="'+picsBase+esc(x.img||'')+'" alt=""></span>'
          + '<span class="ex-body"><span class="ex-type">Extra · '+esc(x.type||'Game')+'</span>'
          + '<span class="ex-title">'+esc(x.title||'')+'</span>'
          + '<span class="ex-go">'+(ready?'Launch →':'In production')+'</span></span>';
        if(ready){
          card.addEventListener('click', function(){
            launch({ id:x.id, type:x.type, title:x.title, imgSrc: picsBase+(x.img||'') });
          });
        } else { card.disabled = true; }
        grid.appendChild(card);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initStrips);
  window.AFTX.initStrips = initStrips;
})();
