# Architecture & Scaling Path

This document explains *why* the site is built the way it is, and the
concrete steps to grow it later without a rewrite.

## Current Stack: Plain HTML/CSS/JS + JSON

- **No build step, no framework, no server.** Every page is a real
  `.html` file you can open directly; styling is one shared
  `css/styles.css`; behavior is two small scripts (`js/main.js`,
  `js/products.js`).
- **Why**: at launch size (4 pages, a handful of products), this is the
  fastest to build, the easiest to host (any static host works,
  including free options like GitHub Pages), and the easiest to hand to
  a non-developer to maintain — there's nothing to install and nothing
  to break.
- **The one deliberate scalability decision**: the product catalog is
  *data*, not markup. `data/products.json` is the single source of
  truth, and `js/products.js` fetches it and renders cards into empty
  container elements (`#featured-products`, `#product-grid`). This
  mirrors exactly how a real API-backed site would work.

## Upgrade Path 1: Add a Real Backend/Database

When WHL wants product management through an admin panel, multiple
editors, or a catalog too large to hand-edit as JSON, add a small
backend (e.g. Node.js/Express, or a hosted option like Supabase) with a
database (SQLite/Postgres) behind an API endpoint that returns the same
JSON shape as `data/products.json` today (see the field table in
[ADDING_PRODUCTS.md](./ADDING_PRODUCTS.md)).

The only code change required is in `js/products.js`:

```js
// Before:
const PRODUCTS_URL = "data/products.json";

// After:
const PRODUCTS_URL = "https://api.whlllc.com/products";
```

Because `renderFeatured()` and `renderCatalog()` already treat the
response as "an array of product objects," nothing else in the front
end needs to change.

## Upgrade Path 2: Replace the Contact Form's Backend

The contact form (`contact.html` + `setupContactForm()` in
`js/main.js`) currently just opens the visitor's email client — no
server involved. To collect leads properly (e.g. into an inbox or CRM
without relying on the visitor's own email client), point the form at
a form service such as Formspree, or a custom backend endpoint. See
the "Replacing the Consultation Email" section of
[README.md](./README.md) for the exact steps.

## Upgrade Path 3: Eliminate Repeated Header/Footer Markup

Right now, the header and footer HTML is copy-pasted into all four
pages (a limitation of plain HTML with no includes). This is fine for
4 pages, but becomes tedious to maintain past roughly 6–8 pages. When
that happens, the recommended move is a **static site generator** like
[11ty (Eleventy)](https://www.11ty.dev/):

- It still outputs plain static HTML/CSS/JS in the end — hosting
  (including GitHub Pages) doesn't change.
- The header/footer/product-card markup gets written **once** in a
  shared template/include, and every page is generated from it.
- `data/products.json` can be fed directly into 11ty's templates
  instead of (or alongside) being fetched client-side.

This is a moderate, well-scoped migration — not a rewrite — because the
CSS, the JSON data shape, and the overall page structure all carry over
unchanged.

## Upgrade Path 4: Framework Rewrite (Only If Truly Needed)

If WHL's needs grow to include user accounts, a shopping cart/checkout,
or heavily interactive features, a full framework (e.g. React/Next.js)
becomes worth the added complexity. This is intentionally *not* the
starting point, since it requires a build pipeline and Node.js hosting
for anything beyond static pages — but the same JSON-shaped product
data and the same design tokens in `css/styles.css` (colors, fonts,
spacing) can be carried over directly, keeping the visual identity
consistent through the migration.

## Hosting: GitHub Pages

The site requires no build step, so deployment is:

1. `git init`, commit the `website/` contents, push to a GitHub
   repository.
2. In the repo's **Settings → Pages**, set "Deploy from a branch" to
   `main` (root).
3. The site is live at `https://<username>.github.io/<repo>/` within a
   few minutes.

A custom domain (e.g. `whlllc.com`) can be attached later via a
`CNAME` file in the repo root plus DNS records at your domain
registrar — see [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
when ready.

Every future content update (new product, new photo, edited copy) is
just: edit the file → commit → push → live within a minute or two —
including edits made directly in GitHub's web-based file editor, which
means a non-technical maintainer never needs to install anything
locally to update the catalog.
