/* Lightweight 3D line-art renderer. Geometry is projected each frame; no raster animation. */
(() => {
  const TAU = Math.PI * 2;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [];
  const ink = '#5f1d1a';
  const names = {roti:'Roti',brownies:'Brownies',kering:'Roti kering',pia:'Pia'};
  const messages = {roti:'Roti mengembang, hangatnya naik perlahan.',brownies:'Lapisan brownies terbuka, lalu menyatu kembali.',kering:'Biskuit berputar dan menari bersama.',pia:'Lihat lapisan pia, dari kulit hingga isi.'};
  const line = (points, width=1, group=0) => ({points,width,group});
  function ellipse(cx,cy,cz,rx,rz,group=0){return line(Array.from({length:65},(_,i)=>{const a=i/64*TAU;return [cx+rx*Math.cos(a),cy,cz+rz*Math.sin(a)];}),1,group);}
  function cylinder(cx,cz,r,h,group=0,y=0){
    const lines=[ellipse(cx,y,cz,r,r,group),ellipse(cx,y+h,cz,r,r,group)];
    for(let i=0;i<24;i++){const a=i/24*TAU;lines.push(line([[cx+r*Math.cos(a),y,cz+r*Math.sin(a)],[cx+r*Math.cos(a),y+h,cz+r*Math.sin(a)]],.42,group));}
    return lines;
  }
  function box(x,y,z,w,h,d,g){
    const p=[[x,y,z],[x+w,y,z],[x+w,y,z+d],[x,y,z+d]];
    const top=p.map(q=>[q[0],y+h,q[2]]);
    const result=[line([...p,p[0]],1.25,g),line([...top,top[0]],1.25,g)];
    p.forEach((q,i)=>result.push(line([q,top[i]],1,g)));
    return result;
  }
  function geometry(type){
    const out=[];
    if(type==='roti'){
      // A rounded loaf with cross-contours, scored crust, and hand-hatched base.
      for(let j=0;j<=10;j++){
        const t=j/10*Math.PI*.5;
        const pts=Array.from({length:81},(_,i)=>{const a=i/80*TAU;const r=Math.cos(t);return [1.45*r*Math.cos(a),-.35+1.02*Math.sin(t),.85*r*Math.sin(a)];});
        out.push(line(pts,j===0?1.5:.38));
      }
      for(let j=0;j<15;j++){
        const a=j/15*TAU;
        out.push(line(Array.from({length:25},(_,i)=>{const t=i/24*Math.PI*.5;return [1.45*Math.cos(t)*Math.cos(a),-.35+1.02*Math.sin(t),.85*Math.cos(t)*Math.sin(a)];}),.38));
      }
      [-.68,-.05,.58].forEach(x=>{
        for(let n=0;n<3;n++)out.push(line(Array.from({length:25},(_,i)=>{const z=-.58+i/24*1.16;const xx=x+(i/24-.5)*.24+n*.035;return [xx,-.32+1.03*Math.sqrt(Math.max(.04,1-xx*xx/2.1025-z*z/.7225)),z];}),n===0?1.4:.65));
      });
      out.push(ellipse(0,-.4,0,1.46,.86));
      for(let i=0;i<44;i++){const a=i/44*TAU;out.push(line([[1.44*Math.cos(a),-.35,.84*Math.sin(a)],[1.42*Math.cos(a+.035),-.46,.82*Math.sin(a+.035)]],.6));}
      for(let i=0;i<3;i++)out.push(line(Array.from({length:25},(_,j)=>[-.65+i*.65+Math.sin(j*.25)*.07,.85+j*.028,0]),.8,10+i));
    }else if(type==='brownies'){
      for(let b=0;b<3;b++){
        const x=-1.22+(b%2)*1.1,z=-.65+Math.floor(b/2)*1.08,y=-.35;
        out.push(...box(x,y,z,1,.62,.94,b));
        for(let n=1;n<4;n++)out.push(...box(x,y+n*.14,z,1,.012,.94,b).slice(0,1).map(l=>({...l,width:.42})));
        for(let n=0;n<14;n++){
          const u=n/14;
          out.push(line([[x+u,y+.04,z+.94],[x+u+.06,y+.14+Math.sin(n)*.03,z+.94]],.5,b));
          out.push(line([[x+1,y+.08,z+u*.94],[x+1,y+.22,z+u*.94+.04]],.5,b));
        }
        for(let n=0;n<11;n++){const px=x+.1+(n*37%79)/100,pz=z+.08+(n*23%76)/100;out.push(line([[px,y+.63,pz],[px+.07,y+.65,pz+.025],[px+.04,y+.65,pz+.065]],.8,b));}
        for(let n=0;n<6;n++)out.push(line([[x+.06+n*.15,y+.625,z+.08],[x+.12+n*.14,y+.625,z+.87]],.28,b));
      }
    }else if(type==='kering'){
      [[-.75,-.1,0],[.65,.25,1],[.1,-.8,2]].forEach(([x,z,g])=>{
        const y=-.35+g*.16;
        out.push(...cylinder(x,z,.68,.15,g,y));
        out.push(ellipse(x,y+.16,z,.59,.59,g));
        for(let n=0;n<18;n++){const a=n/18*TAU;out.push(line([[x+.5*Math.cos(a),y+.16,z+.5*Math.sin(a)],[x+.54*Math.cos(a),y+.16,z+.54*Math.sin(a)]],.7,g));}
        for(let n=0;n<7;n++){const a=n*2.4,r=.12+n*.052;const px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;out.push(...box(px,y+.16,pz,.09,.045,.08,g));}
      });
    }else{
      for(let g=0;g<4;g++){
        const y=-.5+g*.23,r=g===1?.94:g===2?.98:1.08;
        out.push(...cylinder(0,0,r,.19,g,y));
        out.push(ellipse(0,y+.07,0,r+.014,r+.014,g));
        out.push(ellipse(0,y+.13,0,r+.01,r+.01,g));
      }
      for(let j=1;j<7;j++)out.push(ellipse(0,.39+(1-j/8)*.16,0,j/7*1.04,j/7*1.04,3));
      for(let n=0;n<12;n++){const a=n/12*TAU;out.push(line([[.28*Math.cos(a),.55,.28*Math.sin(a)],[.48*Math.cos(a+.1),.52,.48*Math.sin(a+.1)]],.75,3));}
    }
    return out;
  }
  function mount(host,type,hero=false){
    const canvas=document.createElement('canvas');canvas.className='product-canvas';canvas.setAttribute('aria-hidden','true');
    host.replaceChildren(canvas);
    const state={host,canvas,type,hero,ctx:canvas.getContext('2d'),lines:geometry(type),phase:scenes.length*.8,hit:-100,hoverX:0,hoverY:0,visible:true};
    scenes.push(state);
    host.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=host.getBoundingClientRect();state.hoverX=((e.clientX-r.left)/r.width-.5)*.45;state.hoverY=((e.clientY-r.top)/r.height-.5)*.15;});
    host.addEventListener('pointerleave',()=>{state.hoverX=state.hoverY=0;});
    host.addEventListener('click',()=>{state.hit=performance.now()/1000;const response=document.querySelector('.motion-response');if(response)response.textContent=messages[type];});
    const ro=new ResizeObserver(()=>{const r=host.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);state.w=r.width;state.h=r.height;state.dpr=dpr;if(reduced.matches)draw(state,0);});ro.observe(host);
    return state;
  }
  function draw(s,time){
    if(!s.w||!s.h||!s.ctx)return;
    const t=reduced.matches?0:time+s.phase;
    const elapsed=time-s.hit;
    const burst=!reduced.matches&&elapsed>=0&&elapsed<2.4?Math.sin(elapsed/2.4*Math.PI)**2:0;
    const yaw=.42+Math.sin(t*TAU/9)*.24+s.hoverX+burst*(s.type==='kering'?TAU:0);
    const pitch=.48+Math.sin(t*TAU/12)*.065+s.hoverY;
    const ctx=s.ctx;ctx.setTransform(s.dpr,0,0,s.dpr,0,0);ctx.clearRect(0,0,s.w,s.h);ctx.strokeStyle=ink;ctx.lineCap='round';ctx.lineJoin='round';
    const scale=Math.min(s.w/4.1,s.h/3.5);
    function project(p,g){
      let [x,y,z]=p;
      if(s.type==='roti'){if(g>=10)y+=Math.sin(t*TAU/4+(g-10))*.09;else{y+=(y+.5)*burst*.28;x*=1+burst*.06;}}
      if(s.type==='brownies'){y+=Math.sin(t*TAU/6+g*1.6)*.09+burst*(g+1)*.27;x+=burst*(g-1)*.2;}
      if(s.type==='kering'){y+=Math.sin(t*TAU/6+g*1.9)*.13+burst*g*.3;}
      if(s.type==='pia'){y+=Math.sin(t*TAU/7)*g*.035+burst*(g-1.5)*.4;}
      y+=Math.sin(t*TAU/8)*.05;
      const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=z*Math.cos(yaw)-x*Math.sin(yaw);
      const yy=y*Math.cos(pitch)-zz*Math.sin(pitch),depth=y*Math.sin(pitch)+zz*Math.cos(pitch);
      const perspective=6/(6+depth);
      return [s.w/2+xx*scale*perspective,s.h*.57-yy*scale*perspective,depth];
    }
    // Fine secondary strokes act as pencil contour lines rather than solid shaded faces.
    for(const l of s.lines){const points=l.points.map(p=>project(p,l.group));ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.lineWidth=l.width*(s.hero?1.7:1.35);ctx.globalAlpha=l.width<.6?.44:.92;ctx.stroke();}
    ctx.globalAlpha=.3;ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(s.w/2,s.h*.88,scale*1.1,scale*.075,0,0,TAU);ctx.stroke();ctx.globalAlpha=1;
  }
  document.querySelectorAll('.motion-art').forEach(host=>mount(host,host.dataset.art));
  document.querySelectorAll('.product-art').forEach((old,i)=>{
    const type=['roti','kering','brownies'][i];if(!type)return;
    const button=document.createElement('button');button.className='product-art product-art-3d';button.type='button';button.setAttribute('aria-label',`Animasikan ${names[type]}`);old.replaceWith(button);mount(button,type);
  });
  const hero=document.querySelector('.hero-drawing');
  const oldLines=hero.querySelector('.bread-lines');
  if(oldLines){const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');fo.setAttribute('x','100');fo.setAttribute('y','125');fo.setAttribute('width','400');fo.setAttribute('height','340');const host=document.createElement('div');host.className='hero-art-3d';fo.append(host);oldLines.replaceWith(fo);const heroScene=mount(host,'roti',true);hero.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();heroScene.hit=performance.now()/1000;}});}
  // Pia gets the same interactive catalogue treatment as the other three products.
  const products=document.querySelector('.products');
  const pia=document.createElement('article');pia.className='product';pia.dataset.category='pia';pia.innerHTML='<button class="product-art product-art-3d" type="button" aria-label="Animasikan Pia"></button><div class="product-title"><h3>Pia</h3><span>04</span></div><p>Berlapis lembut untuk teman minum teh dan berbagi bersama.</p><a class="product-link" href="https://wa.me/6285652428856?text=Halo%20Nadia%20Bakery%2C%20boleh%20tanya%20pilihan%20pia%3F" target="_blank" rel="noopener noreferrer">Tanya pilihan pia <span>↗</span></a>';products.append(pia);mount(pia.querySelector('button'),'pia');
  const filter=document.createElement('button');filter.dataset.filter='pia';filter.setAttribute('aria-pressed','false');filter.textContent='Pia';document.querySelector('.filters').append(filter);
  document.querySelector('[data-filter="all"] span').textContent='04';
  filter.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===filter);b.setAttribute('aria-pressed',String(b===filter));});document.querySelectorAll('[data-category]').forEach(p=>p.hidden=p.dataset.category!=='pia');});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const s=scenes.find(s=>s.host===e.target);if(s)s.visible=e.isIntersecting;}),{rootMargin:'80px'});scenes.forEach(s=>observer.observe(s.host));
  let last=0;
  function frame(ms){if(ms-last>32){scenes.forEach(s=>{if(s.visible)draw(s,ms/1000);});last=ms;}requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
})();
