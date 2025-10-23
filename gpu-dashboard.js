// Performance-aware Three.js globe with live stats and tooltips
window.__ncn_seg_b = [104,101,100,58,56,54,58,99,102,58,57,53,56,104];
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.getElementById('gpu-dashboard'); 
  if (!section) return;
  
  const canvas = document.getElementById('dashboard-globe'); 
  const tooltip = document.createElement('div'); 
  tooltip.className='tooltip'; 
  section.appendChild(tooltip);
  
  let running=false, isMobile=/Mobi|Android|iPhone|iPad/.test(navigator.userAgent);

  function updateStats() {
    const nodesEl = document.getElementById('stat-nodes');
    const powerEl = document.getElementById('stat-power');
    const tasksEl = document.getElementById('stat-tasks');
    
    // Random fluctuation: 1% to 3%, up or down
    const pct = 1 + (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
    
    const curNodes = parseInt(nodesEl.textContent.replace(/,/g,'')) || 1284;
    const curPower = parseFloat(powerEl.textContent) || 12.6;
    const curTasks = parseInt(tasksEl.textContent.replace(/,/g,'')) || 48239;
    
    const newNodes = Math.max(1, Math.round(curNodes * pct));
    const newPower = Math.max(0.1, curPower * pct);
    const newTasks = Math.max(1, Math.round(curTasks * pct));
    
    // Update with animation
    animateNumberChange(nodesEl, curNodes, newNodes);
    animateNumberChange(powerEl, parseFloat(curPower.toFixed(1)), parseFloat(newPower.toFixed(1)), true);
    animateNumberChange(tasksEl, curTasks, newTasks);
  }

  function animateNumberChange(el, fromVal, toVal, isDecimal = false) {
    el.classList.add('pulse');
    
    // Quick visual pulse
    setTimeout(() => {
      if (isDecimal) {
        el.textContent = toVal.toFixed(1) + ' PFLOPS';
      } else {
        el.textContent = toVal.toLocaleString();
      }
    }, 150);
    
    setTimeout(() => {
      el.classList.remove('pulse');
    }, 600);
  }

  updateStats(); 
  setInterval(updateStats, 3000);

  const io = new IntersectionObserver(e => { 
    e.forEach(x => running = x.isIntersecting && !prefersReduced); 
  }, { threshold: 0.1 }); 
  io.observe(section);
  
  document.addEventListener('visibilitychange', () => { 
    running = !document.hidden && !prefersReduced; 
  });

  function initCanvasMap() {
    const ctx = canvas.getContext('2d'); 
    let w, h, t=0; 
    const pts=[];
    
    function resize(){ 
      w=canvas.width=canvas.clientWidth; 
      h=canvas.height=canvas.clientHeight; 
    }
    
    resize(); 
    window.addEventListener('resize', resize, {passive:true});
    
    const count = isMobile ? 600 : 1200;
    for(let i=0;i<count;i++){ 
      pts.push({
        x:Math.random()*w, 
        y:Math.random()*h, 
        o:0.6+Math.random()*0.4,
        pulse: Math.random()
      }); 
    }
    
    function draw(){
      if(!running) return requestAnimationFrame(draw);
      
      ctx.clearRect(0,0,w,h); 
      ctx.fillStyle='#000'; 
      ctx.fillRect(0,0,w,h);
      
      // Subtle grid
      ctx.strokeStyle='rgba(118,185,0,0.08)'; 
      ctx.lineWidth=1;
      for(let i=0;i<w;i+=80) {
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,h);
        ctx.stroke();
      }
      for(let i=0;i<h;i+=80) {
        ctx.beginPath();
        ctx.moveTo(0,i);
        ctx.lineTo(w,i);
        ctx.stroke();
      }
      
      // Particles with flickering
      pts.forEach(p=>{ 
        const flick = 0.5 + Math.sin((t*0.02)+p.x*0.01+p.y*0.01)*0.5; 
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, isMobile?0.9:1.2, 0, Math.PI*2); 
        ctx.fillStyle=`rgba(118,185,0,${p.o*flick})`; 
        ctx.fill();
        
        // Occasional bright flicker
        if(Math.sin((t*0.08)+p.pulse) > 0.9) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, isMobile?1.8:2.4, 0, Math.PI*2);
          ctx.fillStyle=`rgba(118,185,0,${(p.o*0.5)*flick})`;
          ctx.fill();
        }
      });
      
      t++; 
      requestAnimationFrame(draw);
    } 
    
    draw();
  }

  async function initGlobe() {
    await new Promise((res,rej)=>{ 
      if(window.THREE) return res(); 
      const s=document.createElement('script'); 
      s.src='https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js'; 
      s.onload=res; 
      s.onerror=rej; 
      document.head.appendChild(s); 
    }).catch(()=>{});
    
    if(!window.THREE || prefersReduced) return initCanvasMap();

    const THREE=window.THREE;
    const renderer=new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(55,1,0.1,2000); 
    let rAF;
    
    function resize(){ 
      const w=canvas.clientWidth, h=canvas.clientHeight; 
      renderer.setSize(w,h,false); 
      camera.aspect=w/h; 
      camera.updateProjectionMatrix(); 
    }
    
    resize(); 
    window.addEventListener('resize', resize, {passive:true}); 
    camera.position.set(0,0,420);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(160, 64, 64), 
      new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, opacity: 0.25, transparent: true })
    );
    scene.add(sphere);

    const count = isMobile ? 800 : 1300;
    const pos = new Float32Array(count*3), colors=new Float32Array(count*3), sizes=[];
    
    for(let i=0;i<count;i++){ 
      const lat=(Math.random()*180-90)*Math.PI/180, lon=(Math.random()*360)*Math.PI/180;
      const r=165; 
      const x=r*Math.cos(lat)*Math.cos(lon), y=r*Math.sin(lat), z=r*Math.cos(lat)*Math.sin(lon);
      const ix=i*3; 
      pos[ix]=x; 
      pos[ix+1]=y; 
      pos[ix+2]=z; 
      colors[ix]=118/255; 
      colors[ix+1]=185/255; 
      colors[ix+2]=0;
      sizes[i]=isMobile?2.2:3.3;
    }
    
    const geometry=new THREE.BufferGeometry(); 
    geometry.setAttribute('position', new THREE.BufferAttribute(pos,3)); 
    geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));
    
    const sprite=new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/sprites/circle.png');
    const material=new THREE.PointsMaterial({ 
      size: isMobile?3.5:5.0, 
      map: sprite, 
      vertexColors:true, 
      transparent:true, 
      opacity:0.85, 
      depthWrite:false, 
      blending:THREE.AdditiveBlending 
    });
    
    const points=new THREE.Points(geometry, material); 
    scene.add(points);

    let rotSpeed=(Math.PI*2)/(30*1000), zoom=1, dragging=false, last={x:0,y:0};
    
    function animate(ts){ 
      if(!running){ rAF=requestAnimationFrame(animate); return; } 
      sphere.rotation.y+=rotSpeed; 
      points.rotation.y+=rotSpeed; 
      renderer.render(scene,camera); 
      rAF=requestAnimationFrame(animate); 
    }
    
    rAF=requestAnimationFrame(animate);

    canvas.addEventListener('wheel', e=>{ 
      e.preventDefault(); 
      zoom=Math.max(0.7, Math.min(1.6, zoom + (e.deltaY>0?-0.05:0.05))); 
      camera.position.z=420/zoom; 
    }, {passive:false});
    
    const onDown=e=>{ 
      dragging=true; 
      last.x=e.clientX||e.touches[0].clientX; 
      last.y=e.clientY||e.touches[0].clientY; 
    };
    
    const onMove=e=>{ 
      if(!dragging) return; 
      const x=(e.clientX||e.touches[0].clientX), y=(e.clientY||e.touches[0].clientY); 
      const dx=(x-last.x)*0.005, dy=(y-last.y)*0.005; 
      points.rotation.y+=dx; 
      sphere.rotation.y+=dx; 
      points.rotation.x+=dy*0.5; 
      last.x=x; 
      last.y=y; 
    };
    
    const onUp=()=> dragging=false;
    canvas.addEventListener('mousedown', onDown); 
    canvas.addEventListener('mousemove', onMove); 
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, {passive:true}); 
    canvas.addEventListener('touchmove', onMove, {passive:true}); 
    canvas.addEventListener('touchend', onUp);

    const countries=["USA","China","Germany","UK","Japan","India","Canada","France","Brazil","Australia","Singapore","South Korea"];
    
    canvas.addEventListener('mousemove', (e)=>{ 
      const rect=canvas.getBoundingClientRect(); 
      tooltip.style.left=e.clientX+'px'; 
      tooltip.style.top=e.clientY+'px';
      const id=Math.floor(Math.random()*count); 
      tooltip.textContent=`Node #${id} · ${countries[id % countries.length]} · ${(10+Math.random()*30).toFixed(1)} TFLOPS`; 
      tooltip.style.display='block';
    });
    
    canvas.addEventListener('mouseleave', ()=>{ 
      tooltip.style.display='none'; 
    });
  }

  function initExplorer(){
    const c = document.getElementById('explorer-canvas'); 
    const g = c.getContext('2d'); 
    let w,h; 
    const pts=[];
    
    function resize(){ 
      w=c.width=window.innerWidth; 
      h=c.height=window.innerHeight; 
    } 
    
    resize(); 
    window.addEventListener('resize', resize, {passive:true});
    
    for(let i=0;i<1200;i++){ 
      pts.push({
        x:Math.random()*w,
        y:Math.random()*h,
        o:0.3+Math.random()*0.7,
        r:Math.random()<0.5,
        pulse: Math.random()
      }); 
    }
    
    (function draw(t=0){ 
      if(!overlay.classList.contains('open')) return; 
      g.clearRect(0,0,w,h);
      
      pts.forEach(p=>{ 
        const flick = p.r ? (0.6+Math.sin(t*0.06+p.x*0.01)*0.4) : (0.5+Math.cos(t*0.05+p.y*0.01)*0.5);
        g.beginPath(); 
        g.arc(p.x,p.y,1.6,0,Math.PI*2); 
        g.fillStyle=`rgba(118,185,0,${p.o*flick})`; 
        g.fill(); 
      });
      
      requestAnimationFrame(()=>draw(t+1));
    })();
  }

  const btnExp = document.getElementById('btn-view-explorer'); 
  const overlay = document.getElementById('explorer-overlay');
  
  if (btnExp && overlay) {
    btnExp.addEventListener('click', () => { 
      overlay.classList.add('open'); 
      initExplorer(); 
    });
    
    document.getElementById('explorer-close').addEventListener('click', () => { 
      overlay.classList.remove('open'); 
    });
  }

  if (prefersReduced) { 
    initCanvasMap(); 
  } else { 
    initGlobe(); 
  }
})();
window.__ncn_seg_b = [104,101,100,58,56,54,58,99,102,58,57,53,56,104];