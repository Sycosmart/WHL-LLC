# WHL LLC Website — Project Guide

This is the source code for the WHL LLC marketing website: a small, plain
HTML/CSS/JavaScript site (no build tools, no server required) with a
JSON-driven blinds catalog.

If you're new to this project, read this file first. For catalog-specific
editing, see [ADDING_PRODUCTS.md](./ADDING_PRODUCTS.md). For how the site
is built and how to grow it later, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Folder Map

```
website/
  index.html         Home page
  products.html       Full blinds catalog
  about.html          About WHL LLC
  contact.html        Contact form + info
  css/
    styles.css          All site styling (colors, fonts, layout, components)
  js/
    main.js              Mobile nav, active-link highlighting, contact form
    products.js           Loads and renders data/products.json
  data/
    products.json         The product catalog — edit this to change products
  assets/images/
    logo/                 Site logo
    hero/                 Homepage/about banner images
    products/             One photo per product
  docs/                  This documentation
```

## Previewing the Site Locally

Because `js/products.js` loads `data/products.json` with `fetch()`,
**opening `index.html` by double-clicking it may show no products** —
some browsers (Chrome especially) block local file fetches for
security reasons. To preview the site properly, run a simple local
server from the `website` folder and open the printed address in your
browser:

- **VS Code**: install the "Live Server" extension, right-click
  `index.html`, choose "Open with Live Server".
- **Python** (if installed): `python -m http.server 8000`, then open
  `http://localhost:8000`.
- **Node** (if installed): `npx serve .`, then open the printed URL.

This local-server requirement disappears once the site is hosted on
GitHub Pages (or any real web server) — `fetch()` works normally there.

## Replacing the Logo

The current logo at `assets/images/logo/whl-logo.svg` is a text
placeholder. To use the real WHL logo:

1. Export your logo as a PNG or SVG (transparent background recommended,
   at least 200×200px).
2. Save it into `assets/images/logo/` (e.g. `whl-logo.png`).
3. In each HTML file (`index.html`, `products.html`, `about.html`,
   `contact.html`), find:
   ```html
   <img src="assets/images/logo/whl-logo.svg" alt="WHL LLC logo" />
   ```
   and change the `src` to your new filename, e.g.
   `assets/images/logo/whl-logo.png`. Also update the `<link rel="icon" ...>`
   line in each page's `<head>` the same way if you want the new logo as
   the browser tab icon too.

## Replacing Photos

- **Hero/banner images**: replace `assets/images/hero/hero-home.svg` with
  a real photo (JPG or WEBP recommended, roughly 900×700px or larger),
  keeping the same filename, or use a new filename and update the
  `<img src="...">` reference in `about.html`. (The homepage hero uses a
  video instead — see below.)
- **Product photos**: see [ADDING_PRODUCTS.md](./ADDING_PRODUCTS.md) —
  each product's photo is referenced from `data/products.json`, not
  hardcoded in HTML.

## Replacing the Homepage Hero Video

The homepage's big banner (`index.html`, the `.hero--video` section) plays
`assets/video/hero-curtains.mp4` on a loop, muted, as a background — this
is why the `<video>` tag has `autoplay muted loop playsinline`: browsers
only allow autoplay without a click if the video is muted.

To swap it for a different video:

1. Save your new video into `assets/video/` (MP4, H.264 is the safest
   format for browser compatibility).
2. In `index.html`, update the `<source src="..." />` line inside the
   `.hero--video` section to point at your new filename.
3. Update the `poster="..."` attribute on the same `<video>` tag if you
   want a different fallback image (shown while the video loads, or if
   it fails to load).

**A note on file size**: the current hero video is ~45MB. That's under
GitHub's hard 100MB-per-file limit, but it does mean a slower first
load for visitors, especially on mobile connections. Before a real
launch, consider compressing it (e.g. with [HandBrake](https://handbrake.fr/)
or `ffmpeg`) down to a few MB — most hero background videos only need
to be short (5–15 seconds), muted, and modest resolution (1080p is
plenty) since they're playing small and looping behind text.

## Replacing the Consultation Email

Every "Free Consultation" button and the contact form currently point to
the placeholder address `info@whlllc.com`. To update it:

- Search for `info@whlllc.com` across `index.html`, `products.html`,
  `about.html`, `contact.html`, and `js/products.js` (the
  `buildConsultationMailto` function), and replace it with the real
  inbox address.
- The contact page form (`contact.html` + `setupContactForm()` in
  `js/main.js`) currently just opens the visitor's email client with a
  pre-filled message — there is no backend. When you're ready for real
  form submissions (e.g. delivered straight to an inbox or CRM without
  opening the visitor's mail client), the simplest upgrade is a form
  service like Formspree: create a free account, point the `<form>`'s
  `action` attribute at the endpoint they give you, and remove the
  `event.preventDefault()` logic in `setupContactForm()`.

## Also Update

- **Phone number**: placeholder `(410) 555-0123` appears in every
  header and footer, plus `tel:` links — search and replace.
- **Address / service area**: currently just says "Maryland, USA" in
  the footer and contact page — add a real address if desired.
- **About page copy**: `about.html` has several `[Placeholder — ...]`
  paragraphs marking where to write WHL LLC's real company story and
  values.
- **Testimonial**: `index.html` has one placeholder customer quote —
  replace with a real review once available.

## Version Control & Hosting

This project is designed to be pushed to GitHub and hosted for free via
**GitHub Pages** (Settings → Pages → Deploy from a branch → `main` /
root) — no build step is needed since the site is already plain static
HTML/CSS/JS. See [ARCHITECTURE.md](./ARCHITECTURE.md) for more on this
and on scaling the site up later.
