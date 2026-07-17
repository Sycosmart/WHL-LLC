/**
 * main.js
 * Shared behavior loaded on every page: mobile navigation toggle and
 * marking the current page's nav link as active. Page-specific logic
 * (like rendering the product catalog) lives in products.js instead.
 */

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  highlightActiveNavLink();
  setupContactForm();
  setupCarousels();
});

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  // Close the mobile menu after clicking a link, so navigating feels instant.
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/**
 * The contact page form has no backend yet, so submitting it opens the
 * visitor's email client with a pre-filled message instead of posting
 * anywhere. This keeps the "Free Consultation" flow working with zero
 * server setup. See docs/README.md, "Replacing the consultation email",
 * for how to swap this for a real form service (e.g. Formspree) later —
 * only this function needs to change, the HTML form fields can stay
 * the same.
 */
function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const phone = form.elements["phone"].value.trim();
    const message = form.elements["message"].value.trim();

    const subject = "Free Consultation Request";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailto = `mailto:info@whlllc.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
}

/**
 * Wires up the prev/next arrow buttons on any ".gallery-carousel" (the
 * homepage's featured styles section, see index.html and
 * js/products.js). The tiles themselves scroll natively via CSS
 * (overflow-x + scroll-snap) — the buttons just nudge that scroll
 * position, so dragging/swiping the row still works even without them.
 * Wired up once at load time, independent of when products.js finishes
 * fetching and inserting the actual tiles.
 */
function setupCarousels() {
  document.querySelectorAll(".gallery-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".gallery-track");
    const prevBtn = carousel.querySelector(".carousel-arrow--prev");
    const nextBtn = carousel.querySelector(".carousel-arrow--next");
    if (!track || !prevBtn || !nextBtn) return;

    const scrollByOneTile = (direction) => {
      const tile = track.querySelector(".gallery-tile");
      const tileWidth = tile ? tile.getBoundingClientRect().width : track.clientWidth * 0.8;
      track.scrollBy({ left: direction * (tileWidth + 16), behavior: "smooth" });
    };

    prevBtn.addEventListener("click", () => scrollByOneTile(-1));
    nextBtn.addEventListener("click", () => scrollByOneTile(1));
  });
}
