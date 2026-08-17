const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  document.body.classList.remove("nav-open");
  header?.classList.remove("nav-active");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Открыть меню");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-active");
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

const lightbox = document.querySelector("[data-lightbox-root]");
const lightboxImage = document.querySelector("[data-lightbox-image]");

const closeLightbox = () => {
  lightbox?.classList.remove("is-open");
  document.body.style.overflow = "";
};

document.querySelectorAll("[data-lightbox]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!lightbox || !lightboxImage) return;
    event.preventDefault();
    const preview = link.querySelector("img");
    lightboxImage.src = link.href;
    lightboxImage.alt = preview ? preview.alt : "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });
});

document.querySelectorAll("[data-process]").forEach((timeline) => {
  const steps = Array.from(timeline.querySelectorAll("[data-process-step]"));
  const panels = Array.from(timeline.querySelectorAll("[data-process-panel]"));

  if (steps.length !== panels.length || !steps.length) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  let hoverTimer;

  const setActiveStep = (activeIndex) => {
    window.clearTimeout(hoverTimer);

    steps.forEach((step, index) => {
      const isActive = index === activeIndex;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-expanded", String(isActive));
      panels[index].classList.toggle("is-active", isActive);
    });
  };

  steps.forEach((step, index) => {
    step.addEventListener("click", () => setActiveStep(index));
    step.addEventListener("focus", () => setActiveStep(index));

    // небольшая задержка: провести мышью через список, не перещёлкивая все карточки
    step.addEventListener("mouseenter", () => {
      if (!canHover.matches) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => setActiveStep(index), 130);
    });

    step.addEventListener("mouseleave", () => window.clearTimeout(hoverTimer));
  });

  setActiveStep(0);
});

document.querySelectorAll("[data-works-gallery]").forEach((gallery) => {
  const thumbs = Array.from(gallery.querySelectorAll("[data-works-thumb]"));
  const activeLink = gallery.querySelector("[data-works-active]");
  const activeImage = gallery.querySelector("[data-works-active-image]");
  const previous = gallery.querySelector("[data-works-prev]");
  const next = gallery.querySelector("[data-works-next]");
  const currentCounter = gallery.querySelector("[data-works-counter-current]");
  const totalCounter = gallery.querySelector("[data-works-counter-total]");

  if (!thumbs.length || !activeLink || !activeImage || !previous || !next || !currentCounter || !totalCounter) return;

  let activeIndex = 0;

  const setActivePhoto = (nextIndex, { keepThumbVisible = true } = {}) => {
    activeIndex = Math.max(0, Math.min(nextIndex, thumbs.length - 1));
    const thumb = thumbs[activeIndex];
    const source = thumb.dataset.src;
    const alt = thumb.dataset.alt;

    if (!source || !alt) return;

    activeLink.href = source;
    activeImage.src = source;
    activeImage.alt = alt;
    currentCounter.textContent = String(activeIndex + 1).padStart(2, "0");
    totalCounter.textContent = `/ ${String(thumbs.length).padStart(2, "0")}`;
    previous.hidden = activeIndex === 0;
    next.hidden = activeIndex === thumbs.length - 1;

    thumbs.forEach((item, index) => {
      const isActive = index === activeIndex;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    if (keepThumbVisible) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => setActivePhoto(index));
  });

  previous.addEventListener("click", () => setActivePhoto(activeIndex - 1));
  next.addEventListener("click", () => setActivePhoto(activeIndex + 1));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && activeIndex > 0) {
      event.preventDefault();
      setActivePhoto(activeIndex - 1);
    }

    if (event.key === "ArrowRight" && activeIndex < thumbs.length - 1) {
      event.preventDefault();
      setActivePhoto(activeIndex + 1);
    }
  });

  setActivePhoto(0, { keepThumbVisible: false });
});

document.querySelectorAll("[data-review-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-review-carousel-track]");
  const prev = carousel.querySelector("[data-review-carousel-prev]");
  const next = carousel.querySelector("[data-review-carousel-next]");

  if (!track || !prev || !next) return;

  let index = 0;

  const updateControls = () => {
    const items = Array.from(track.querySelectorAll("a"));
    const visibleCount = track.clientWidth < 360 ? 1 : 2;
    const maxIndex = Math.max(0, items.length - visibleCount);
    const firstItem = items[0];
    const trackStyles = getComputedStyle(track);
    const columnGap = parseFloat(trackStyles.columnGap);
    const gap = Number.isFinite(columnGap) ? columnGap : parseFloat(trackStyles.gap) || 0;
    const step = firstItem ? firstItem.getBoundingClientRect().width + gap : 0;

    index = Math.min(index, maxIndex);
    track.scrollTo({ left: index * step, behavior: "smooth" });
    prev.hidden = index === 0;
    next.hidden = index >= maxIndex;
  };

  const scrollCarousel = (direction) => {
    index += direction;
    updateControls();
  };

  prev.addEventListener("click", () => scrollCarousel(-1));
  next.addEventListener("click", () => scrollCarousel(1));
  window.addEventListener("resize", updateControls);
  updateControls();
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
