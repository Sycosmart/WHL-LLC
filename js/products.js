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
 * Homepage "Featured Blinds" gallery: a 3-column bento grid of large photo
 * tiles (product name overlaid on the image) with one text-only promo
 * tile mixed in at the 3rd position — styled after a big-box retailer's
 * homepage gallery, adapted to WHL's data-driven catalog. Shows up to 5
 * real products flagged "featured": true, plus the promo tile.
 */
function renderFeatured(container, products) {
  const featured = products.filter((p) => p.featured).slice(0, 5);
  container.innerHTML = "";

  featured.slice(0, 2).forEach((product) => container.appendChild(buildGalleryTile(product)));
  container.appendChild(buildPromoTile());
  featured.slice(2).forEach((product) => container.appendChild(buildGalleryTile(product)));
}

/** A large photo tile with the product name overlaid at the bottom. */
function buildGalleryTile(product) {
  const tile = document.createElement("a");
  tile.className = "gallery-tile";
  tile.href = "products.html";

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";
  tile.appendChild(img);

  const overlay = document.createElement("div");
  overlay.className = "gallery-tile__overlay";
  tile.appendChild(overlay);

  const label = document.createElement("h3");
  label.className = "gallery-tile__label";
  label.textContent = product.name;
  tile.appendChild(label);

  return tile;
}

/**
 * The one non-photo tile mixed into the featured gallery. Copy here is
 * hardcoded (not from products.json) since it's a promo message, not a
 * product — edit the text directly in this function to change it.
 */
function buildPromoTile() {
  const tile = document.createElement("div");
  tile.className = "gallery-tile gallery-tile--promo";

  const heading = document.createElement("h3");
  heading.textContent = "Custom Fit, Every Window";
  tile.appendChild(heading);

  const text = document.createElement("p");
  text.textContent = "Free measuring and professional installation included with every order.";
  tile.appendChild(text);

  const actions = document.createElement("div");
  actions.className = "gallery-tile--promo__actions";

  const consult = document.createElement("a");
  consult.className = "btn btn--primary";
  consult.href = buildConsultationMailto();
  consult.textContent = "Free Consultation";
  actions.appendChild(consult);

  const learnMore = document.createElement("a");
  learnMore.className = "btn btn--secondary";
  learnMore.href = "products.html";
  learnMore.textContent = "Learn More";
  actions.appendChild(learnMore);

  tile.appendChild(actions);
  return tile;
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
