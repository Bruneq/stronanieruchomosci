const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('is-open');

  mainNav?.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mainNav?.classList.remove('is-open');
    navToggle?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Otwórz menu');
  });
});

const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  let lastScrollY = window.scrollY;
  const revealOffset = 90;
  const minDelta = 8;

  const isMobileMenuOpen = () => {
    return navToggle?.getAttribute('aria-expanded') === 'true' || mainNav?.classList.contains('is-open');
  };

  const updateHeaderVisibility = () => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;

    siteHeader.classList.toggle('is-scrolled', currentScrollY > 12);

    if (currentScrollY <= revealOffset || isMobileMenuOpen()) {
      siteHeader.classList.remove('is-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    if (Math.abs(scrollDifference) < minDelta) return;

    if (scrollDifference > 0) {
      siteHeader.classList.add('is-hidden');
    } else {
      siteHeader.classList.remove('is-hidden');
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
  window.addEventListener('resize', updateHeaderVisibility);
  updateHeaderVisibility();
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const portfolioLightbox = document.querySelector('.portfolio-lightbox');
const portfolioLightboxImage = portfolioLightbox?.querySelector('figure img');
const portfolioLightboxCaption = portfolioLightbox?.querySelector('figcaption');
const portfolioLightboxClose = portfolioLightbox?.querySelector('.portfolio-lightbox__close');
const portfolioLightboxPrev = portfolioLightbox?.querySelector('.portfolio-lightbox__nav--prev');
const portfolioLightboxNext = portfolioLightbox?.querySelector('.portfolio-lightbox__nav--next');
const portfolioLightboxItems = Array.from(document.querySelectorAll('[data-lightbox]'));
let activePortfolioImage = 0;

const updatePortfolioLightbox = (index) => {
  if (!portfolioLightboxImage || !portfolioLightboxCaption || portfolioLightboxItems.length === 0) return;

  activePortfolioImage = (index + portfolioLightboxItems.length) % portfolioLightboxItems.length;
  const item = portfolioLightboxItems[activePortfolioImage];
  const sourceImage = item.querySelector('img');

  if (!sourceImage) return;

  portfolioLightboxImage.src = item.dataset.full || sourceImage.currentSrc || sourceImage.src;
  portfolioLightboxImage.alt = sourceImage.alt;
  portfolioLightboxCaption.textContent = item.dataset.caption || sourceImage.alt;
};

let portfolioLightboxTrigger = null;

portfolioLightboxItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    if (!portfolioLightbox) return;

    portfolioLightboxTrigger = item;
    updatePortfolioLightbox(index);

    if (!portfolioLightbox.open) {
      portfolioLightbox.showModal();
    }

    // Utrzymuje fokus wewnątrz modala także w Safari i przy wielu monitorach.
    requestAnimationFrame(() => {
      portfolioLightboxClose?.focus({ preventScroll: true });
    });
  });
});

portfolioLightboxClose?.addEventListener('click', () => portfolioLightbox?.close());
portfolioLightboxPrev?.addEventListener('click', (event) => {
  event.stopPropagation();
  updatePortfolioLightbox(activePortfolioImage - 1);
});
portfolioLightboxNext?.addEventListener('click', (event) => {
  event.stopPropagation();
  updatePortfolioLightbox(activePortfolioImage + 1);
});

// W natywnym <dialog> kliknięcie w backdrop ma jako target sam dialog.
// Nie porównujemy współrzędnych, bo przy szerokim drugim monitorze przyciski
// ustawione position: fixed mogą znajdować się poza prostokątem dialogu.
portfolioLightbox?.addEventListener('click', (event) => {
  if (event.target === portfolioLightbox) {
    portfolioLightbox.close();
  }
});

portfolioLightbox?.addEventListener('close', () => {
  portfolioLightboxTrigger?.focus({ preventScroll: true });
  portfolioLightboxTrigger = null;
});

// Capture sprawia, że nawigacja działa niezależnie od tego,
// który element modala ma aktualnie fokus.
document.addEventListener(
  'keydown',
  (event) => {
    if (!portfolioLightbox?.open) return;

    if (event.key === 'ArrowLeft' || event.code === 'ArrowLeft') {
      event.preventDefault();
      updatePortfolioLightbox(activePortfolioImage - 1);
      return;
    }

    if (event.key === 'ArrowRight' || event.code === 'ArrowRight') {
      event.preventDefault();
      updatePortfolioLightbox(activePortfolioImage + 1);
    }
  },
  true
);
