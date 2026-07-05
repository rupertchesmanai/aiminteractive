/* ============================================================
   airspace3d.js — reusable three.js "airspace" scene
   Five stacked altitude bands a decision rises through.
   window.Airspace.mount(canvas, {labels, onReady}) -> { setLevel(i), destroy() }
   Falls back gracefully (returns null) if WebGL/three is unavailable.
   ============================================================ */
(function(){
  const SRCS = [
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"
  ];
  const COLORS = [0x53DFCB, 0x2ec9bb, 0x00C0AF, 0xE2A23B, 0xDC5A46]; // low -> high
  let loading=null;
  function ensureTHREE(cb){
    if(window.THREE) return cb(true);
    if(loading){ loading.push(cb); return; }
    loading=[cb];
    let i=0;
    (function tryLoad(){
      const s=document.createElement('script'); s.src=SRCS[i];
      s.onload=()=>{ loading.forEach(f=>f(true)); loading=null; };
      s.onerror=()=>{ i++; if(i<SRCS.length){ tryLoad(); } else { loading.forEach(f=>f(false)); loading=null; } };
      document.head.appendChild(s);
    })();
  }

  function mount(canvas, opts){
    opts=opts||{};
    let api=null;
    ensureTHREE(function(ok){
      if(!ok || !window.THREE){ if(opts.onReady) opts.onReady(false); return; }
      api = build(canvas, opts);
      if(opts.onReady) opts.onReady(true, api);
    });
    // proxy so callers can call setLevel before load completes
    const proxy={ _lvl:0,
      setLevel(i){ this._lvl=i; if(api) api.setLevel(i); },
      destroy(){ if(api) api.destroy(); }
    };
    const realReady=opts.onReady;
    opts.onReady=function(ok,a){ api=a; if(a) a.setLevel(proxy._lvl); if(realReady) realReady(ok,a); };
    return proxy;
  }

  function build(canvas, opts){
    const host=canvas.parentElement;
    const scene=new THREE.Scene();
    scene.fog=new THREE.FogExp2(0x0c1416,0.055);
    let W=host.clientWidth,H=host.clientHeight;
    const cam=new THREE.PerspectiveCamera(50,W/H,0.1,100);
    cam.position.set(0,2.4,12); cam.lookAt(0,2.2,0);
    const r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
    r.setPixelRatio(Math.min(devicePixelRatio,2)); r.setSize(W,H,false);

    const bandGroup=new THREE.Group(); scene.add(bandGroup);
    const bands=[]; const edges=[];
    const N=5, gap=1.18, w=14, d=3.4;
    for(let i=0;i<N;i++){
      const g=new THREE.PlaneGeometry(w,d,1,1);
      const m=new THREE.MeshBasicMaterial({color:COLORS[i],transparent:true,opacity:0.07,side:THREE.DoubleSide});
      const p=new THREE.Mesh(g,m); p.rotation.x=-Math.PI/2; p.position.y=0.5+i*gap; bandGroup.add(p); bands.push(p);
      const eg=new THREE.EdgesGeometry(g);
      const lm=new THREE.LineBasicMaterial({color:COLORS[i],transparent:true,opacity:0.30});
      const le=new THREE.LineSegments(eg,lm); le.rotation.x=-Math.PI/2; le.position.y=0.5+i*gap; bandGroup.add(le); edges.push(le);
    }

    // grid floor
    const grid=new THREE.GridHelper(40,40,0x00C0AF,0x12302d);
    grid.material.opacity=0.14; grid.material.transparent=true; scene.add(grid);

    // rising particles
    const PN=260, pg=new THREE.BufferGeometry(), pp=new Float32Array(PN*3), ps=new Float32Array(PN);
    for(let i=0;i<PN;i++){ pp[i*3]=(Math.random()-0.5)*16; pp[i*3+1]=Math.random()*(0.5+N*gap); pp[i*3+2]=(Math.random()-0.5)*3.2; ps[i]=0.0015+Math.random()*0.006; }
    pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
    const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9beadf,size:0.05,transparent:true,opacity:0.5})); scene.add(pts);

    // decision token
    const token=new THREE.Mesh(new THREE.IcosahedronGeometry(0.32,1), new THREE.MeshBasicMaterial({color:0xffffff}));
    scene.add(token);
    const halo=new THREE.Mesh(new THREE.RingGeometry(0.44,0.5,40), new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.85,side:THREE.DoubleSide}));
    scene.add(halo);

    let level=0, targetY=0.5;
    const reduced = window.RAL && window.RAL.reducedMotion;

    function setLevel(i){
      level=Math.max(0,Math.min(N-1,i));
      targetY=0.5+level*gap;
      for(let b=0;b<N;b++){
        const on=(b===level);
        bands[b].material.opacity = on?0.26:0.06;
        edges[b].material.opacity = on?0.85:0.22;
        halo.material.color.setHex(COLORS[level]);
        const sc=on?1.04:1.0; bands[b].scale.set(sc,1,sc); edges[b].scale.set(sc,1,sc);
      }
    }
    setLevel(0);

    let t=0, tokY=0.5, raf=null;
    function frame(){
      t+=0.01;
      tokY += (targetY - tokY)*0.08;
      const x=Math.sin(t*0.7)*0.5;
      token.position.set(x,tokY,1.7); halo.position.set(x,tokY,1.7); halo.lookAt(cam.position);
      token.rotation.y+=0.02; token.rotation.x+=0.012;
      const pa=pg.attributes.position.array;
      for(let i=0;i<PN;i++){ pa[i*3+1]+=ps[i]; if(pa[i*3+1]>0.5+N*gap) pa[i*3+1]=0; }
      pg.attributes.position.needsUpdate=true;
      bandGroup.rotation.y=Math.sin(t*0.25)*0.05;
      cam.position.y += ((2.2 + level*0.18) - cam.position.y)*0.04;
      cam.lookAt(0, 0.5+level*gap*0.7, 0);
      r.render(scene,cam);
      raf=requestAnimationFrame(frame);
    }
    if(reduced){ token.position.set(0,targetY,1.7); halo.position.set(0,targetY,1.7); halo.lookAt(cam.position); r.render(scene,cam); }
    else frame();

    function onResize(){ W=host.clientWidth;H=host.clientHeight;cam.aspect=W/H;cam.updateProjectionMatrix();r.setSize(W,H,false); if(reduced) r.render(scene,cam); }
    addEventListener('resize',onResize);

    return {
      setLevel,
      destroy(){ if(raf)cancelAnimationFrame(raf); removeEventListener('resize',onResize); r.dispose(); }
    };
  }

  window.Airspace={ mount };
})();
