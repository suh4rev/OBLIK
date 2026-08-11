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
