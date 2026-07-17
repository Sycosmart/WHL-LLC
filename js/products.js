/**
 * products.js
 * ---------------------------------------------------------------------
 * Loads the product catalog from data/products.json and renders it into
 * the page. This is the ONLY place that reads products.json — HTML pages
 * just provide an empty container element for this script to fill in.
 *
 * Why fetch() instead of hardcoding products in HTML:
 * Keeping the catalog in one JSON file means adding, editing, or removing
 * a product never requires touching HTML or CSS (see
 * docs/ADDING_PRODUCTS.md). It also means that later, if WHL wants a real
 * database/backend, only the URL below needs to change (e.g. from
 * "data/products.json" to "/api/products") — everything else in this file
 * keeps working unchanged, because both return the same JSON shape.
 *
 * NOTE: Some browsers (notably Chrome) block fetch() of local files when
 * a page is opened directly via double-click (file:// URLs). Run the site
 * through a local static server while developing — see docs/README.md,
 * "Previewing the site locally".
 * ---------------------------------------------------------------------
 */

const PRODUCTS_URL = "data/products.json";

document.addEventListener("DOMContentLoaded", () => {
  const featuredContainer = document.querySelector("#featured-products");
  const catalogContainer = document.querySelector("#product-grid");

  if (!featuredContainer && !catalogContainer) return;

  fetchProducts()
    .then((products) => {
      if (featuredContainer) {
        renderFeatured(featuredContainer, products);
      }
      if (catalogContainer) {
        renderCatalog(catalogContainer, products);
      }
    })
    .catch((error) => {
      console.error("Could not load products.json:", error);
      const target = catalogContainer || featuredContainer;
      if (target) {
        target.innerHTML =
          '<p class="empty-state">Products could not be loaded right now. Please refresh the page or contact us directly.</p>';
      }
    });
});

async function fetchProducts() {
  const response = await fetch(PRODUCTS_URL);
  if (!response.ok) {
    throw new Error(`Failed to load ${PRODUCTS_URL}: ${response.status}`);
  }
  return response.json();
}

/**
 * Homepage "Featured Styles" carousel: a horizontally-scrolling row of
 * large photo tiles (see #featured-products / .gallery-track in
 * index.html, and the matching carousel arrow buttons wired up in
 * js/main.js's setupCarousels()). Every tile always shows its name; the
 * description and two buttons only appear while hovering/focusing that
 * tile's photo. Shows up to 5 real products flagged "featured": true in
 * data/products.json, plus one hardcoded promo tile mixed in at position 3.
 */
function renderFeatured(container, products) {
  const featured = products.filter((p) => p.featured).slice(0, 5);
  container.innerHTML = "";

  const toTile = (product) =>
    buildGalleryTile({
      name: product.name,
      description: product.description,
      image: product.image,
      primaryLabel: "Shop Now",
      primaryHref: "products.html",
      secondaryLabel: "Learn More",
      secondaryHref: buildConsultationMailto(product.name),
    });

  featured.slice(0, 2).forEach((product) => container.appendChild(toTile(product)));
  container.appendChild(buildPromoTile());
  featured.slice(2).forEach((product) => container.appendChild(toTile(product)));
}

/**
 * Builds one gallery tile: a photo with the name always visible, and a
 * description + two buttons that fade in on hover/focus (see the
 * .gallery-tile__hover rules in css/styles.css). Used for both real
 * products and the promo tile below, so they behave identically.
 */
function buildGalleryTile({
  name,
  description,
  image,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}) {
  const tile = document.createElement("div");
  tile.className = "gallery-tile";
  // tabindex makes the tile focusable so keyboard users can reveal the
  // hover content too (see :focus-within in the CSS).
  tile.tabIndex = 0;

  const img = document.createElement("img");
  img.src = image;
  img.alt = name;
  img.loading = "lazy";
  tile.appendChild(img);

  const overlay = document.createElement("div");
  overlay.className = "gallery-tile__overlay";
  tile.appendChild(overlay);

  const content = document.createElement("div");
  content.className = "gallery-tile__content";

  const label = document.createElement("h3");
  label.className = "gallery-tile__label";
  label.textContent = name;
  content.appendChild(label);

  const hover = document.createElement("div");
  hover.className = "gallery-tile__hover";

  const desc = document.createElement("p");
  desc.textContent = description;
  hover.appendChild(desc);

  const actions = document.createElement("div");
  actions.className = "gallery-tile__actions";

  const primary = document.createElement("a");
  primary.className = "btn btn--light";
  primary.href = primaryHref;
  primary.textContent = primaryLabel;
  actions.appendChild(primary);

  const secondary = document.createElement("a");
  secondary.className = "btn btn--secondary";
  secondary.href = secondaryHref;
  secondary.textContent = secondaryLabel;
  actions.appendChild(secondary);

  hover.appendChild(actions);
  content.appendChild(hover);
  tile.appendChild(content);
  return tile;
}

/**
 * The one promo tile mixed into the featured carousel. Copy here is
 * hardcoded (not from products.json) since it's a promo message, not a
 * product — edit the values directly in this function to change it.
 */
function buildPromoTile() {
  return buildGalleryTile({
    name: "Custom Fit, Every Window",
    description: "Free measuring and professional installation included with every order.",
    image: "assets/images/hero/hero-home.svg",
    primaryLabel: "Free Consultation",
    primaryHref: buildConsultationMailto(),
    secondaryLabel: "Learn More",
    secondaryHref: "products.html",
  });
}

/** Products page: show everything, with category filter pills. */
function renderCatalog(container, products) {
  const filterBar = document.querySelector("#filter-bar");
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const draw = (activeCategory) => {
    container.innerHTML = "";
    const visible =
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory);

    if (visible.length === 0) {
      container.innerHTML = '<p class="empty-state">No products in this category yet.</p>';
      return;
    }
    visible.forEach((product) => container.appendChild(buildProductCard(product)));
  };

  if (filterBar) {
    filterBar.innerHTML = "";
    categories.forEach((category, index) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "filter-pill";
      pill.textContent = category;
      pill.setAttribute("aria-pressed", String(index === 0));
      pill.addEventListener("click", () => {
        filterBar
          .querySelectorAll(".filter-pill")
          .forEach((el) => el.setAttribute("aria-pressed", "false"));
        pill.setAttribute("aria-pressed", "true");
        draw(category);
      });
      filterBar.appendChild(pill);
    });
  }

  draw("All");
}

/** Builds a single product card as a DOM node (no innerHTML with user data, to stay XSS-safe). */
function buildProductCard(product) {
  const card = document.createElement("article");
  card.className = "card product-card";

  const img = document.createElement("img");
  img.className = "product-card__image";
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";
  card.appendChild(img);

  const body = document.createElement("div");
  body.className = "product-card__body";

  const category = document.createElement("span");
  category.className = "product-card__category";
  category.textContent = product.category;
  body.appendChild(category);

  const name = document.createElement("h3");
  name.className = "product-card__name";
  name.textContent = product.name;
  body.appendChild(name);

  const description = document.createElement("p");
  description.textContent = product.description;
  body.appendChild(description);

  const price = document.createElement("span");
  price.className = "product-card__price";
  price.textContent = product.priceLabel;
  body.appendChild(price);

  const actions = document.createElement("div");
  actions.className = "product-card__actions";

  const consultLink = document.createElement("a");
  consultLink.className = "btn btn--primary";
  consultLink.href = buildConsultationMailto(product.name);
  consultLink.textContent = "Free Consultation";
  actions.appendChild(consultLink);

  body.appendChild(actions);
  card.appendChild(body);
  return card;
}

/**
 * Builds the mailto link used by every "Free Consultation" button.
 * See docs/README.md, "Replacing the consultation email", to point this
 * at a real inbox or swap it for a real form service later.
 */
function buildConsultationMailto(productName) {
  const subject = productName
    ? `Free Consultation Request — ${productName}`
    : "Free Consultation Request";
  return `mailto:info@whlllc.com?subject=${encodeURIComponent(subject)}`;
}
