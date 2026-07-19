const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.classList.toggle("is-open");

  mainNav?.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Otwórz menu");
  });
});

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  let lastScrollY = window.scrollY;
  const revealOffset = 90;
  const minDelta = 8;

  const isMobileMenuOpen = () => {
    return (
      navToggle?.getAttribute("aria-expanded") === "true" ||
      mainNav?.classList.contains("is-open")
    );
  };

  const updateHeaderVisibility = () => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;

    siteHeader.classList.toggle("is-scrolled", currentScrollY > 12);

    if (currentScrollY <= revealOffset || isMobileMenuOpen()) {
      siteHeader.classList.remove("is-hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (Math.abs(scrollDifference) < minDelta) return;

    if (scrollDifference > 0) {
      siteHeader.classList.add("is-hidden");
    } else {
      siteHeader.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
  window.addEventListener("resize", updateHeaderVisibility);
  updateHeaderVisibility();
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const portfolioLightbox = document.querySelector(".portfolio-lightbox");
const portfolioLightboxFigure = portfolioLightbox?.querySelector("figure");
const portfolioLightboxImage = portfolioLightbox?.querySelector("figure img");
const portfolioLightboxCaption = portfolioLightbox?.querySelector("figcaption");
const portfolioLightboxClose = portfolioLightbox?.querySelector(
  ".portfolio-lightbox__close",
);
const portfolioLightboxPrev = portfolioLightbox?.querySelector(
  ".portfolio-lightbox__nav--prev",
);
const portfolioLightboxNext = portfolioLightbox?.querySelector(
  ".portfolio-lightbox__nav--next",
);
const portfolioLightboxItems = Array.from(
  document.querySelectorAll("[data-lightbox]"),
);
let activePortfolioImage = 0;

const updatePortfolioLightbox = (index) => {
  if (
    !portfolioLightboxImage ||
    !portfolioLightboxCaption ||
    portfolioLightboxItems.length === 0
  )
    return;

  activePortfolioImage =
    (index + portfolioLightboxItems.length) % portfolioLightboxItems.length;
  const item = portfolioLightboxItems[activePortfolioImage];
  const sourceImage = item.querySelector("img");

  if (!sourceImage) return;

  portfolioLightboxImage.src =
    item.dataset.full || sourceImage.currentSrc || sourceImage.src;
  portfolioLightboxImage.alt = sourceImage.alt;
  portfolioLightboxCaption.textContent =
    item.dataset.caption || sourceImage.alt;
};

let portfolioLightboxTrigger = null;

portfolioLightboxItems.forEach((item, index) => {
  item.addEventListener("click", () => {
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

portfolioLightboxClose?.addEventListener("click", () =>
  portfolioLightbox?.close(),
);
portfolioLightboxPrev?.addEventListener("click", (event) => {
  event.stopPropagation();
  updatePortfolioLightbox(activePortfolioImage - 1);
});
portfolioLightboxNext?.addEventListener("click", (event) => {
  event.stopPropagation();
  updatePortfolioLightbox(activePortfolioImage + 1);
});

// W natywnym <dialog> kliknięcie w backdrop ma jako target sam dialog.
// Nie porównujemy współrzędnych, bo przy szerokim drugim monitorze przyciski
// ustawione position: fixed mogą znajdować się poza prostokątem dialogu.
portfolioLightbox?.addEventListener("click", (event) => {
  if (event.target === portfolioLightbox) {
    portfolioLightbox.close();
  }
});

portfolioLightbox?.addEventListener("close", () => {
  if (portfolioLightboxImage) {
    portfolioLightboxImage.style.transition = "";
    portfolioLightboxImage.style.transform = "";
    portfolioLightboxImage.style.opacity = "";
  }

  portfolioLightboxTrigger?.focus({ preventScroll: true });
  portfolioLightboxTrigger = null;
});

// Capture sprawia, że nawigacja działa niezależnie od tego,
// który element modala ma aktualnie fokus.
document.addEventListener(
  "keydown",
  (event) => {
    if (!portfolioLightbox?.open) return;

    if (event.key === "ArrowLeft" || event.code === "ArrowLeft") {
      event.preventDefault();
      updatePortfolioLightbox(activePortfolioImage - 1);
      return;
    }

    if (event.key === "ArrowRight" || event.code === "ArrowRight") {
      event.preventDefault();
      updatePortfolioLightbox(activePortfolioImage + 1);
    }
  },
  true,
);

// Mobilna nawigacja gestem w podglądzie realizacji.
// Strzałki pozostają dostępne na komputerze, a na telefonie są ukryte w CSS.
if (portfolioLightboxFigure && portfolioLightboxImage) {
  const mobileLightboxQuery = window.matchMedia(
    "(max-width: 780px), (hover: none) and (pointer: coarse)",
  );
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDeltaX = 0;
  let touchDeltaY = 0;
  let touchStartedAt = 0;
  let horizontalSwipe = false;
  let swipeAnimationRunning = false;

  const resetSwipePosition = () => {
    portfolioLightboxImage.style.transition =
      "transform 180ms ease, opacity 180ms ease";
    portfolioLightboxImage.style.transform = "translate3d(0, 0, 0)";
    portfolioLightboxImage.style.opacity = "1";
  };

  const animateSwipeChange = (direction) => {
    if (swipeAnimationRunning) return;
    swipeAnimationRunning = true;

    const exitOffset = direction > 0 ? -72 : 72;
    const enterOffset = direction > 0 ? 72 : -72;

    portfolioLightboxImage.style.transition =
      "transform 140ms ease, opacity 140ms ease";
    portfolioLightboxImage.style.transform = `translate3d(${exitOffset}px, 0, 0)`;
    portfolioLightboxImage.style.opacity = "0";

    window.setTimeout(() => {
      updatePortfolioLightbox(activePortfolioImage + direction);
      portfolioLightboxImage.style.transition = "none";
      portfolioLightboxImage.style.transform = `translate3d(${enterOffset}px, 0, 0)`;
      portfolioLightboxImage.style.opacity = "0";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          portfolioLightboxImage.style.transition =
            "transform 220ms ease, opacity 220ms ease";
          portfolioLightboxImage.style.transform = "translate3d(0, 0, 0)";
          portfolioLightboxImage.style.opacity = "1";

          window.setTimeout(() => {
            swipeAnimationRunning = false;
          }, 230);
        });
      });
    }, 145);
  };

  portfolioLightboxFigure.addEventListener(
    "touchstart",
    (event) => {
      if (
        !mobileLightboxQuery.matches ||
        event.touches.length !== 1 ||
        swipeAnimationRunning
      )
        return;

      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchDeltaX = 0;
      touchDeltaY = 0;
      touchStartedAt = performance.now();
      horizontalSwipe = false;

      portfolioLightboxImage.style.transition = "none";
    },
    { passive: true },
  );

  portfolioLightboxFigure.addEventListener(
    "touchmove",
    (event) => {
      if (
        !mobileLightboxQuery.matches ||
        event.touches.length !== 1 ||
        swipeAnimationRunning
      )
        return;

      const touch = event.touches[0];
      touchDeltaX = touch.clientX - touchStartX;
      touchDeltaY = touch.clientY - touchStartY;

      if (!horizontalSwipe) {
        horizontalSwipe =
          Math.abs(touchDeltaX) > 10 &&
          Math.abs(touchDeltaX) > Math.abs(touchDeltaY) * 1.15;
      }

      if (!horizontalSwipe) return;

      event.preventDefault();
      const dragOffset = Math.max(-130, Math.min(130, touchDeltaX * 0.72));
      const dragOpacity = Math.max(0.55, 1 - Math.abs(touchDeltaX) / 420);

      portfolioLightboxImage.style.transform = `translate3d(${dragOffset}px, 0, 0)`;
      portfolioLightboxImage.style.opacity = String(dragOpacity);
    },
    { passive: false },
  );

  portfolioLightboxFigure.addEventListener("touchend", () => {
    if (!mobileLightboxQuery.matches || swipeAnimationRunning) return;

    const elapsed = performance.now() - touchStartedAt;
    const distanceThreshold = Math.min(
      86,
      Math.max(48, window.innerWidth * 0.12),
    );
    const fastSwipe = elapsed < 280 && Math.abs(touchDeltaX) > 34;
    const farEnough = Math.abs(touchDeltaX) >= distanceThreshold;
    const mostlyHorizontal =
      Math.abs(touchDeltaX) > Math.abs(touchDeltaY) * 1.15;

    if (horizontalSwipe && mostlyHorizontal && (farEnough || fastSwipe)) {
      // Przesunięcie w lewo pokazuje następne zdjęcie, w prawo poprzednie.
      animateSwipeChange(touchDeltaX < 0 ? 1 : -1);
    } else {
      resetSwipePosition();
    }

    touchDeltaX = 0;
    touchDeltaY = 0;
    horizontalSwipe = false;
  });

  portfolioLightboxFigure.addEventListener("touchcancel", () => {
    if (!swipeAnimationRunning) resetSwipePosition();
    touchDeltaX = 0;
    touchDeltaY = 0;
    horizontalSwipe = false;
  });
}

// =========================================================
// SUBTELNE ANIMACJE + PRZYCISK „WRÓĆ NA GÓRĘ”
// =========================================================
(() => {
  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const prefersReducedMotion = () => reduceMotionQuery.matches;

  document.documentElement.classList.add("motion-enhanced");

  /*
   * Automatycznie dodaje delikatne wejścia do najważniejszych elementów.
   * Dzięki temu nie trzeba dopisywać klas w każdym pliku HTML.
   */
  const motionSelectors = [
    ".hero__content > *",
    ".hero__image",
    ".service-card",
    ".project-card",
    ".about__image",
    ".about__content > *",
    ".process-card",
    ".contact-cta__content > *",
    ".page-hero__content > *",
    ".page-hero__image",
    ".subpage-hero__content > *",
    ".subpage-hero__image",
    ".page-split__content > *",
    ".page-split__media",
    ".value-card",
    ".offer-card",
    ".package-card",
    ".timeline-step",
    ".process-deliverables__content > *",
    ".process-deliverables__image",
    ".principle-card",
    ".portfolio-hero__content > *",
    ".portfolio-hero__image",
    ".portfolio-index__heading > *",
    ".portfolio-index-card",
    ".portfolio-project__header > *",
    ".portfolio-project__intro > *",
    ".portfolio-image",
    ".contact-page__details > *",
    ".contact-form",
    ".faq-item",
    ".cta-section > *",
    ".process-cta > *",
    ".portfolio-cta__content > *",
  ];

  const candidates = Array.from(
    document.querySelectorAll(motionSelectors.join(",")),
  ).filter((element) => {
    return (
      !element.classList.contains("reveal") &&
      !element.classList.contains("motion-reveal") &&
      !element.closest(".site-header") &&
      !element.closest(".site-footer") &&
      !element.closest(".portfolio-lightbox")
    );
  });

  const siblingCounters = new WeakMap();

  candidates.forEach((element) => {
    const parent = element.parentElement;
    const siblingIndex = parent ? siblingCounters.get(parent) || 0 : 0;
    const delay = Math.min(siblingIndex, 4) * 65;

    element.classList.add("motion-reveal");
    element.style.setProperty("--motion-delay", `${delay}ms`);

    if (parent) {
      siblingCounters.set(parent, siblingIndex + 1);
    }
  });

  if (!prefersReducedMotion() && "IntersectionObserver" in window) {
    const motionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    candidates.forEach((element) => motionObserver.observe(element));
  } else {
    candidates.forEach((element) => element.classList.add("is-visible"));
  }

  // Przycisk jest tworzony w JavaScript, więc nie trzeba edytować wszystkich podstron.
  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Wróć na górę strony");
  backToTop.setAttribute("aria-hidden", "true");
  backToTop.tabIndex = -1;
  backToTop.innerHTML = `
    <svg class="back-to-top__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="back-to-top__label">Wróć na górę</span>
  `;

  document.body.append(backToTop);

  const siteFooter = document.querySelector(".site-footer, footer");
  let scrollFrameRequested = false;

  const updateBackToTop = () => {
    const shouldShow =
      window.scrollY > Math.max(520, window.innerHeight * 0.65);

    backToTop.classList.toggle("is-visible", shouldShow);
    backToTop.setAttribute("aria-hidden", String(!shouldShow));
    backToTop.tabIndex = shouldShow ? 0 : -1;

    // Gdy stopka wchodzi w obszar ekranu, przycisk płynnie przesuwa się
    // ponad nią, dzięki czemu nie zasłania ikony Instagrama ani linków.
    if (siteFooter) {
      const footerTop = siteFooter.getBoundingClientRect().top;
      const footerOverlap = Math.max(0, window.innerHeight - footerTop);
      const safeGap =
        footerOverlap > 0 ? (window.innerWidth <= 680 ? 12 : 18) : 0;

      backToTop.style.setProperty(
        "--back-to-top-footer-offset",
        `${Math.round(footerOverlap + safeGap)}px`,
      );
    } else {
      backToTop.style.setProperty("--back-to-top-footer-offset", "0px");
    }

    scrollFrameRequested = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrameRequested) return;
      scrollFrameRequested = true;
      window.requestAnimationFrame(updateBackToTop);
    },
    { passive: true },
  );

  window.addEventListener("resize", updateBackToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });

  updateBackToTop();
})();

/* === PRZEKIEROWANIA STARYCH LINKÓW REALIZACJI: START === */
(() => {
  const projectPages = {
    "#dla-niego": "realizacja-dla-niego.html",
    "#dla-pary": "realizacja-dla-pary.html",
    "#pokoj-goscinny": "realizacja-pokoj-goscinny.html",
    "#mini-kawalerka": "realizacja-mini-kawalerka.html",
    "#sypialnia-w-trzech-odslonach":
      "realizacja-sypialnia-w-trzech-odslonach.html",
  };

  const isPortfolioIndex =
    window.location.pathname.endsWith("/realizacje.html") ||
    window.location.pathname.endsWith("/realizacje");

  if (!isPortfolioIndex) return;

  const targetPage = projectPages[window.location.hash];

  if (targetPage) {
    window.location.replace(targetPage);
  }
})();
/* === PRZEKIEROWANIA STARYCH LINKÓW REALIZACJI: END === */
