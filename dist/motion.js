const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const response = document.querySelector('.motion-response');
const responses = {roti:'Roti hangat, siap menemani pagi.',brownies:'Satu potong untukmu, satu untuk temanmu.',kering:'Renyahnya bikin obrolan lebih panjang.',pia:'Lapisan demi lapisan, ada manis di dalamnya.'};
document.querySelectorAll('.motion-art').forEach(button=>{
  let timer;
  button.addEventListener('pointermove',event=>{
    if(reducedMotion.matches || event.pointerType!=='mouse') return;
    const rect=button.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    button.style.setProperty('--mx',`${x*13}px`);
    button.style.setProperty('--my',`${y*10}px`);
    button.style.setProperty('--mr',`${x*5}deg`);
  });
  button.addEventListener('pointerleave',()=>{['--mx','--my','--mr'].forEach(key=>button.style.removeProperty(key));});
  button.addEventListener('click',()=>{
    clearTimeout(timer);button.classList.remove('activated');void button.offsetWidth;button.classList.add('activated');
    response.textContent=responses[button.dataset.art];
    timer=setTimeout(()=>button.classList.remove('activated'),1250);
  });
});
const heroArt=document.querySelector('.hero-drawing');
let heroTimer;
function activateHero(){clearTimeout(heroTimer);heroArt.classList.remove('activated');void heroArt.getBoundingClientRect();heroArt.classList.add('activated');heroTimer=setTimeout(()=>heroArt.classList.remove('activated'),850);}
heroArt.addEventListener('click',activateHero);
heroArt.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activateHero();}});
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting)),{threshold:.12});
  document.querySelectorAll('.motion-product,.welcome,.section-heading,.product,.steps>div').forEach(element=>{element.classList.add('scroll-reveal');observer.observe(element);});
}
let scrollPending=false;
function updateScroll(){const rect=document.querySelector('.hero').getBoundingClientRect();if(rect.bottom>0&&!reducedMotion.matches)heroArt.style.setProperty('--hero-drift',`${Math.min(35,-rect.top*.07)}px`);scrollPending=false;}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}},{passive:true});
