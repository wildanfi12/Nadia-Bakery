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

const galleryTrack = document.querySelector('#instagram-gallery');
const gallerySlides = [...galleryTrack.querySelectorAll('.instagram-slide')];
const galleryCaption = document.querySelector('#gallery-caption');
const galleryStatus = document.querySelector('#gallery-status');
const galleryProgress = [...document.querySelectorAll('.gallery-progress span')];
let galleryIndex = 0;
let galleryScrollFrame;

function updateGallery(index, announce = false) {
  galleryIndex = index;
  gallerySlides.forEach((slide, slideIndex) => slide.setAttribute('aria-current', String(slideIndex === index)));
  galleryProgress.forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
  galleryCaption.textContent = gallerySlides[index].dataset.caption;
  if (announce) galleryStatus.textContent = `Poster ${index + 1} dari ${gallerySlides.length}: ${gallerySlides[index].querySelector('img').alt}`;
}

function goToGallerySlide(index) {
  const nextIndex = (index + gallerySlides.length) % gallerySlides.length;
  const slide = gallerySlides[nextIndex];
  const left = slide.offsetLeft - (galleryTrack.clientWidth - slide.clientWidth) / 2;
  galleryTrack.scrollTo({ left, behavior: 'smooth' });
  updateGallery(nextIndex, true);
}

galleryTrack.addEventListener('scroll', () => {
  cancelAnimationFrame(galleryScrollFrame);
  galleryScrollFrame = requestAnimationFrame(() => {
    const trackCenter = galleryTrack.scrollLeft + galleryTrack.clientWidth / 2;
    const closestIndex = gallerySlides.reduce((closest, slide, index) => {
      const center = slide.offsetLeft + slide.clientWidth / 2;
      const closestCenter = gallerySlides[closest].offsetLeft + gallerySlides[closest].clientWidth / 2;
      return Math.abs(center - trackCenter) < Math.abs(closestCenter - trackCenter) ? index : closest;
    }, 0);
    if (closestIndex !== galleryIndex) updateGallery(closestIndex);
  });
}, { passive: true });

galleryTrack.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    goToGallerySlide(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
document.querySelector('#gallery-prev').addEventListener('click', () => goToGallerySlide(galleryIndex - 1));
document.querySelector('#gallery-next').addEventListener('click', () => goToGallerySlide(galleryIndex + 1));
updateGallery(0);

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
