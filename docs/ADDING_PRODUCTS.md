# Adding, Editing, and Removing Products

The entire blinds catalog lives in **one file**: `data/products.json`.
Both the homepage's "Featured Blinds" section and the full catalog on
`products.html` are generated automatically from this file by
`js/products.js` — you never need to touch HTML to change a product.

## The Product Fields

Each product is one object in the JSON array, shaped like this:

```json
{
  "id": "classic-faux-wood",
  "name": "Classic Faux Wood Blinds",
  "category": "Blinds",
  "description": "Durable, moisture-resistant faux wood blinds that give the warm look of real wood — ideal for kitchens and bathrooms.",
  "priceLabel": "Starting at $99",
  "image": "assets/images/products/classic-faux-wood.svg",
  "featured": true
}
```

| Field         | Required | Notes                                                                 |
|---------------|----------|------------------------------------------------------------------------|
| `id`          | Yes      | Unique, lowercase, hyphenated (e.g. `cordless-blinds`). Used internally. |
| `name`        | Yes      | Shown as the product title.                                           |
| `category`    | Yes      | Shown as a small label and used to build the filter buttons on `products.html`. Introducing a new value (e.g. `"Shades"`) automatically adds a new filter button — no other changes needed. |
| `description` | Yes      | One or two sentences, shown under the name.                           |
| `priceLabel`  | Yes      | Free-form text, e.g. `"Starting at $99"` or `"Call for pricing"`.     |
| `image`       | Yes      | Path to the product photo, relative to the `website` folder.          |
| `featured`    | No       | Set to `true` to show this product in the homepage's "Featured Blinds" section (max 4 shown). Omit or set `false` to keep it catalog-only. |

## Adding a New Product

1. **Add the photo**: drop an image file into `assets/images/products/`
   (JPG, PNG, or WEBP; roughly 800×600px works well — this matches the
   4:3 shape the product cards use).
2. **Add the entry**: open `data/products.json` and add a new object to
   the array (copy an existing one and edit the values). Don't forget a
   comma between objects.
3. Save the file and refresh the site (via a local server — see
   [README.md](./README.md), "Previewing the Site Locally"). The new
   product appears automatically on `products.html`, and on the
   homepage too if `"featured": true`.

## Editing a Product

Find its object in `data/products.json` by `id` or `name`, and edit any
field. Save and refresh.

## Removing a Product

Delete its entire `{ ... }` object from the `data/products.json` array
(and remove the now-unused image from `assets/images/products/` if you
like). Make sure the surrounding commas still form valid JSON — the
easiest way to check is opening the file in VS Code, which will
underline any syntax errors in red.

## Adding a New Category

Just use a new value in the `category` field of one or more products
(e.g. `"Shades"` or `"Shutters"`) — the filter buttons on `products.html`
are generated from whatever category values exist in the file, so a new
category appears automatically.

## A Note on Scale

This JSON-file approach is great for a catalog of dozens of products.
If WHL's catalog grows into the hundreds, or multiple people need to
edit products at once through a proper admin screen, see
[ARCHITECTURE.md](./ARCHITECTURE.md) for the recommended upgrade path
to a real database/backend — it's designed to be a small change, not a
rewrite.
