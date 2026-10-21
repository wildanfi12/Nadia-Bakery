const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('#nav');
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.querySelector('span').textContent=open?'×':'+';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.querySelector('span').textContent='+';}));

const mascot=document.querySelector('.mascot');
const mascotMessage=document.querySelector('#mascot-message');
const messages=['Hop! Pesanan manis datang.','Aku baru keluar dari oven!','Coba klik lagi, aku suka joget.','Sudah pilih rasa favoritmu?'];
let messageIndex=0;
mascot.addEventListener('click',()=>{mascot.classList.remove('party');void mascot.offsetWidth;mascot.classList.add('party');mascotMessage.textContent=messages[messageIndex++%messages.length];setTimeout(()=>mascot.classList.remove('party'),650);});

const posters=[...document.querySelectorAll('.poster')];
const posterTrack=document.querySelector('.poster-track');
const counter=document.querySelector('#poster-count');
let currentPoster=0;
function showPoster(index){currentPoster=(index+posters.length)%posters.length;posters.forEach((p,i)=>p.classList.toggle('active',i===currentPoster));counter.textContent=String(currentPoster+1).padStart(2,'0')+' / 03';posters[currentPoster].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
document.querySelector('#poster-prev').addEventListener('click',()=>showPoster(currentPoster-1));
document.querySelector('#poster-next').addEventListener('click',()=>showPoster(currentPoster+1));
posterTrack.addEventListener('scroll',()=>{if(innerWidth>900)return;const middle=posterTrack.scrollLeft+posterTrack.clientWidth/2;let nearest=0,distance=Infinity;posters.forEach((p,i)=>{const d=Math.abs(p.offsetLeft+p.clientWidth/2-middle);if(d<distance){distance=d;nearest=i;}});currentPoster=nearest;counter.textContent=String(nearest+1).padStart(2,'0')+' / 03';},{passive:true});

const lightbox=document.querySelector('#lightbox');
const lightboxImage=lightbox.querySelector('img');
const lightboxCaption=lightbox.querySelector('p');
posters.forEach((poster,i)=>poster.addEventListener('click',()=>{const image=poster.querySelector('img');currentPoster=i;lightboxImage.src=image.src;lightboxImage.alt=image.alt;lightboxCaption.textContent=image.alt;lightbox.showModal();}));
document.querySelector('.close-lightbox').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});

const flavorData={pandan:{title:'Pandan',description:'Aromatik, ringan, dan lembut. Rasa hijau favorit yang selalu bikin ingin satu potong lagi.',note:'AROMA PANDAN · TABURAN WIJEN',color:'#779044',piece:'#809442'},mocca:{title:'Mocca',description:'Harum kopi yang lembut dengan rasa manis dan gurih yang seimbang.',note:'HARUM KOPI · LEMBUT DI TENGAH',color:'#d58c5f',piece:'#bd7650'},coklat:{title:'Coklat',description:'Pekat, legit, dan klasik. Pilihan yang selalu aman untuk dibagi bersama.',note:'COKLAT PEKAT · LEGIT DAN LEMBUT',color:'#714337',piece:'#573127'}};
const flavorSection=document.querySelector('.flavors');
document.querySelectorAll('[data-flavor]').forEach(button=>button.addEventListener('click',()=>{const data=flavorData[button.dataset.flavor];document.querySelectorAll('[data-flavor]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});document.querySelector('#flavor-title').textContent=data.title;document.querySelector('#flavor-description').textContent=data.description;document.querySelector('#flavor-note').textContent=data.note;flavorSection.style.background=data.color;document.querySelector('.brownie-piece').style.background=data.piece;}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelector('#year').textContent=new Date().getFullYear();
