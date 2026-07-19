# WHL LLC Website: Project Guide

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
    products.json         The product catalog. Edit this to change products
  assets/images/
    logo/                 Site logo
    hero/                 Homepage/about banner images
    products/             One photo per product
  docs/                  This documentation
```

## Previewing the Site Locally

Because `js/products.js` loads `data/products.json` with `fetch()`,
**opening `index.html` by double-clicking it may show no products**.
Some browsers (Chrome especially) block local file fetches for
security reasons. To preview the site properly, run a simple local
server from the `website` folder and open the printed address in your
browser:

- **VS Code**: install the "Live Server" extension, right-click
  `index.html`, choose "Open with Live Server".
- **Python** (if installed): `python -m http.server 8000`, then open
  `http://localhost:8000`.
- **Node** (if installed): `npx serve .`, then open the printed URL.

This local-server requirement disappears once the site is hosted on
GitHub Pages (or any real web server): `fetch()` works normally there.

## The Logo Files

`assets/images/logo/` has two files, both derived from the real WHL
logo:

- **`whl-logo-full.jpg`**: the full lockup (deer/curtain mark + "WHL
  Window Treatments Company" + tagline), used large on `about.html`
  where there's room for the whole thing to be legible.
- **`whl-icon.png`**: just the deer/curtain mark, cropped out of the
  full logo and padded to a square (see
  `scripts/crop-logo-icon.ps1` for exactly how, if you ever need to
  redo the crop with a different logo file). Used in the compact
  header (next to the "WHL / Window Treatments Co." text) and as the
  browser tab favicon, where the full lockup's small text wouldn't be
  legible at that size.

Both have a cream background that matches the site's `--color-cream`
design token almost exactly, so they blend into the header/page
background without looking like a boxed-in image.

**To replace the logo again later** (e.g. a redesigned version):

1. Save the new full logo into `assets/images/logo/` (JPG or PNG).
2. Re-run `scripts/crop-logo-icon.ps1` after updating the `$srcPath`
   variable inside it to point at your new file (and re-tune the crop
   `Rectangle` coordinates by eye: open the script's output PNG,
   check it looks right, adjust, and re-run).
3. Update the `<img src="...">` on `about.html` if you changed the
   full logo's filename.

## Replacing Photos

- **About page image**: currently shows the full logo
  (`whl-logo-full.jpg`). Replace with a real team/showroom photo by
  changing the `<img src="...">` in `about.html`'s "Rooted in Maryland"
  section (JPG or WEBP recommended, roughly 900x700px or larger).
- **Homepage promo tile image**: `assets/images/hero/promo-consultation.svg`
  is a placeholder graphic behind the gallery's "Custom Fit, Every
  Window" tile. Replace it by changing the `image` value inside
  `buildPromoTile()` in `js/products.js`.
- **Product photos**: see [ADDING_PRODUCTS.md](./ADDING_PRODUCTS.md).
  Each product's photo is referenced from `data/products.json`, not
  hardcoded in HTML.

## Replacing Homepage Videos

The homepage has two background videos, both in `assets/video/`, both
`autoplay muted loop playsinline` (browsers only allow autoplay without
a click if the video is muted), and neither has any pause/play control
by design:

- **Top hero banner** (`.hero--video` section): `hero-curtains.mp4`.
- **Mid-page cinematic interlude** (`.video-feature` section, between
  "How It Works" and the trust strip): `curtains-motion.mp4`.

To swap either video:

1. Save your new video into `assets/video/` (MP4, H.264 is the safest
   format for browser compatibility).
2. In `index.html`, update the matching `<source src="..." />` line to
   point at your new filename.
3. Add a `poster="..."` attribute on the same `<video>` tag if you want
   a specific fallback image shown while the video loads (both
   currently fall back to a plain background color instead).
4. For the cinematic interlude, also edit the quote text in
   `.video-feature__quote` if it no longer fits the new video.

**A note on file size**: the hero video is about 45MB. That's under
GitHub's hard 100MB-per-file limit, but slow to load for visitors,
especially on mobile. The cinematic interlude video is a much more
reasonable ~7MB. Before a real launch, consider compressing the hero
video (e.g. with [HandBrake](https://handbrake.fr/) or `ffmpeg`) down
to a few MB. Most background videos only need to be short (5 to 15
seconds), muted, and modest resolution (1080p is plenty) since they're
playing small and looping behind text.

## Replacing Testimonials

`index.html` has a "What Homeowners Say" section with three sample
testimonial cards, each clearly labeled "(sample quote)" so they're
never mistaken for real reviews. Before launch, replace each card's
quote and author with a real customer review:

1. Find the three `.testimonial-card` blocks inside the
   `<!-- Testimonials -->` section of `index.html`.
2. Replace the text inside each `.testimonial-card__quote` with the
   real review, and each `.testimonial-card__author` with the
   customer's name (first name + last initial is a common, privacy-
   friendly convention, e.g. "Sarah K.") or "Verified Customer".
3. If you have fewer than three real reviews at launch, delete the
   extra `.testimonial-card` block(s) rather than leaving sample
   copy live.

## Editing the FAQ

`products.html` has a "Frequently Asked Questions" section built from
plain `<details>`/`<summary>` elements (native, expandable HTML with no
JavaScript needed). The current questions are general starter content,
written to be true for most window-treatment businesses, but written
before Louis confirmed the specifics of his own process. Once he does,
update the answers for accuracy:

1. Find the `.faq-list` block inside the `<!-- FAQ -->` section of
   `products.html`.
2. Each question is one `<details class="faq-item">` block. Edit the
   text inside `.faq-item__question` (the question) and
   `.faq-item__answer` (the answer).
3. To add a new question, copy an existing `<details class="faq-item">`
   block (including its chevron `<svg>`) and edit the text.
4. To remove a question, delete its whole `<details>...</details>`
   block.

Particularly worth confirming with Louis: exact measuring/installation
process, typical turnaround time, warranty terms (not currently
mentioned since they weren't confirmed), and the specific counties/
cities covered.

## Replacing the Consultation Email

Every "Free Consultation" button and the contact form currently point to
the placeholder address `info@whlllc.com`. To update it:

- Search for `info@whlllc.com` across `index.html`, `products.html`,
  `about.html`, `contact.html`, and `js/products.js` (the
  `buildConsultationMailto` function), and replace it with the real
  inbox address.
- The contact page form (`contact.html` + `setupContactForm()` in
  `js/main.js`) currently just opens the visitor's email client with a
  pre-filled message; there is no backend. When you're ready for real
  form submissions (e.g. delivered straight to an inbox or CRM without
  opening the visitor's mail client), the simplest upgrade is a form
  service like Formspree: create a free account, point the `<form>`'s
  `action` attribute at the endpoint they give you, and remove the
  `event.preventDefault()` logic in `setupContactForm()`.

## Also Update

- **Phone number**: placeholder `(410) 555-0123` appears in every
  header and footer, plus `tel:` links. Search and replace.
- **Address / service area**: currently just says "Maryland, USA" in
  the footer and contact page. Add a real address if desired.
- **About page copy**: `about.html` has several `[Placeholder: ...]`
  paragraphs marking where to write WHL LLC's real company story and
  values.

## Version Control & Hosting

This project is designed to be pushed to GitHub and hosted for free via
**GitHub Pages** (Settings, then Pages, then Deploy from a branch,
branch `main`, folder `/` root). No build step is needed since the
site is already plain static HTML/CSS/JS. See
[ARCHITECTURE.md](./ARCHITECTURE.md) for more on this and on scaling
the site up later.
