const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Buka menu');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-category]').forEach(product => {
      product.hidden = button.dataset.filter !== 'all' && product.dataset.category !== button.dataset.filter;
    });
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();

const galleryItems = [
  {
    src: './assets/brownies-nadia.jpg',
    alt: 'Aneka brownies Nadia Bakery yang sudah dipotong dan dikemas',
    caption: '01 / BROWNIES DARI DAPUR NADIA'
  },
  {
    src: './assets/brownies-pandan.jpg',
    alt: 'Foto peluncuran brownies Nadia Bakery dari Instagram resmi',
    caption: '02 / SEPOTONG MANIS DARI NADIA'
  }
];
let galleryIndex = 0;
function changePhoto(direction) {
  galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  const image = document.querySelector('#gallery-image');
  image.src = item.src;
  image.alt = item.alt;
  document.querySelector('#gallery-caption').textContent = item.caption;
  document.querySelector('#gallery-status').textContent = `Foto ${galleryIndex + 1} dari ${galleryItems.length}: ${item.alt}`;
}
document.querySelector('#gallery-prev').addEventListener('click', () => changePhoto(-1));
document.querySelector('#gallery-next').addEventListener('click', () => changePhoto(1));

const faqTriggers = [...document.querySelectorAll('.faq-trigger')];
faqTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
    faqTriggers.forEach(item => item.setAttribute('aria-expanded', 'false'));
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  });
});
