/* Realistic rendered product imagery with layered, accessible motion. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const names = {roti:'Roti',brownies:'Brownies',kering:'Roti kering',pia:'Pia'};
  const descriptions = {
    roti:'Ilustrasi roti susu dengan kulit keemasan dan serat bagian dalam yang lembut',
    brownies:'Render brownies pandan, mocca, dan coklat bertabur wijen berdasarkan foto Nadia',
    kering:'Ilustrasi irisan roti kering panggang dengan tekstur renyah',
    pia:'Ilustrasi pia dengan kulit berlapis dan bagian dalam yang terlihat'
  };
  const responses = {roti:'Lihat serat lembut di balik kulit keemasannya.',brownies:'Pandan, mocca, dan coklat. Tiga warna, tiga rasa.',kering:'Irisan renyah dengan tekstur panggang yang terlihat jelas.',pia:'Kulit berlapis tipis dengan isi di bagian tengah.'};
  function mount(host,type,hero=false){
    host.classList.add('render-scene');host.dataset.render=type;
    if(host.tagName==='BUTTON')host.setAttribute('aria-label',`Lihat detail ${names[type]}`);
    const tilt=document.createElement('span');tilt.className='render-tilt';
    const loop=document.createElement('span');loop.className='render-loop';
    const action=document.createElement('span');action.className='render-action';
    const img=document.createElement('img');img.className='real-product';img.src=`./assets/render-${type}.png`;img.alt=descriptions[type];img.width=1024;img.height=1024;img.decoding='async';img.loading=hero?'eager':'lazy';img.draggable=false;
    action.append(img);loop.append(action);tilt.append(loop);host.replaceChildren(tilt);
    const hint=document.createElement('span');hint.className='render-hint';hint.textContent='Sentuh untuk melihat lebih dekat';if(!hero)host.append(hint);
    let timer;
    host.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=host.getBoundingClientRect();host.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-.5)*12}deg`);host.style.setProperty('--rx',`${-((e.clientY-r.top)/r.height-.5)*9}deg`);});
    host.addEventListener('pointerleave',()=>{host.style.setProperty('--ry','0deg');host.style.setProperty('--rx','0deg');});
    function activate(){clearTimeout(timer);host.classList.remove('inspect-product');void host.offsetWidth;host.classList.add('inspect-product');const response=document.querySelector('.motion-response');if(response)response.textContent=responses[type];timer=setTimeout(()=>host.classList.remove('inspect-product'),1700);}
    host.addEventListener('click',activate);
    return activate;
  }
  document.querySelectorAll('.motion-art').forEach(host=>mount(host,host.dataset.art));
  document.querySelectorAll('.product-art').forEach((old,i)=>{
    const type=['roti','kering','brownies'][i];if(!type)return;
    const button=document.createElement('button');button.className='product-art product-art-3d';button.type='button';button.setAttribute('aria-label',`Lihat detail ${names[type]}`);old.replaceWith(button);mount(button,type);
  });
  const hero=document.querySelector('.hero-drawing');
  const oldLines=hero.querySelector('.bread-lines');
  if(oldLines){const fo=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');fo.setAttribute('x','90');fo.setAttribute('y','135');fo.setAttribute('width','420');fo.setAttribute('height','335');const host=document.createElement('div');host.className='hero-art-3d';fo.append(host);oldLines.replaceWith(fo);const activate=mount(host,'roti',true);hero.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});}
  const products=document.querySelector('.products');
  const pia=document.createElement('article');pia.className='product';pia.dataset.category='pia';pia.innerHTML='<button class="product-art product-art-3d" type="button" aria-label="Lihat detail Pia"></button><div class="product-title"><h3>Pia</h3><span>04</span></div><p>Berlapis lembut untuk teman minum teh dan berbagi bersama.</p><a class="product-link" href="https://wa.me/6285652428856?text=Halo%20Nadia%20Bakery%2C%20boleh%20tanya%20pilihan%20pia%3F" target="_blank" rel="noopener noreferrer">Tanya pilihan pia <span>↗</span></a>';products.append(pia);mount(pia.querySelector('button'),'pia');
  const filter=document.createElement('button');filter.dataset.filter='pia';filter.setAttribute('aria-pressed','false');filter.textContent='Pia';document.querySelector('.filters').append(filter);document.querySelector('[data-filter="all"] span').textContent='04';
  filter.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===filter);b.setAttribute('aria-pressed',String(b===filter));});document.querySelectorAll('[data-category]').forEach(p=>p.hidden=p.dataset.category!=='pia');});
  const note=document.createElement('p');note.className='render-note';note.textContent='Visual produk merupakan ilustrasi. Brownies mengacu pada foto Nadia; bentuk dan pilihan produk lain dapat dikonfirmasi saat memesan.';document.querySelector('.catalog-note').before(note);
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('render-visible',e.isIntersecting)),{rootMargin:'60px'});document.querySelectorAll('.render-scene').forEach(el=>observer.observe(el));}
  else document.querySelectorAll('.render-scene').forEach(el=>el.classList.add('render-visible'));
})();
