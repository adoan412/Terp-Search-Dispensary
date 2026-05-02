# PaBuddy Static Catalog System

The catalog system moves heavy provider fan-out off live user sessions onto a
scheduled laptop process. Users get one fast fetch from GitHub Pages; the
laptop does all the real work on its own schedule.

```
Laptop (builder) → GitHub Pages (data/) → Users (one fetch, local filter)
```

---

## How to run the builder

```bat
npm run build:catalog
```

Requires **Node 18+**. Check with `node --version`.

The builder fetches every active PA store across all providers, normalizes
products into the shared Jane shape, hydrates Dutchie terpene data, and
hydrates Curaleaf lab data. Expect a full run to take **20–40 minutes**
depending on network conditions.

### Environment variables (optional)

| Variable | Purpose |
|---|---|
| _(none required for Phase 1)_ | Provider credentials live in the script constants |

If Algolia or Hytiva keys rotate, update the constants at the top of
`scripts/build-catalog.js`. Dutchie and Curaleaf route through the Oracle
proxy (`api.pabuddy.org`) with automatic fallback to direct GraphQL / Sweed.

---

## Output files

All output goes to `data/` in this folder.

| File | Purpose |
|---|---|
| `data/catalog-pa.json` | Full catalog with all products (pretty-printed) |
| `data/catalog-pa.min.json` | Minified copy — same data, smaller transfer |
| `data/catalog-meta.json` | Build metadata — product count, freshness, failed stores |
| `data/catalog-pa.last-good.json` | Auto-saved backup of the last successful full build |

### catalog-pa.json shape

```json
{
  "version": "1",
  "state": "PA",
  "generatedAt": "2026-05-01T12:00:00.000Z",
  "expiresAt": "2026-05-02T12:00:00.000Z",
  "providers": ["jane", "dutchie", "hytiva", "curaleaf"],
  "stores": [ { "brandId": "organic", "storeName": "Bethel Park", ... } ],
  "products": [ { ...jane-shaped product... } ],
  "failedStores": []
}
```

Each product carries source metadata added by the builder:

```json
{
  "sourceProvider":  "jane",
  "sourceStoreId":   "4365",
  "sourceStoreName": "Bethel Park",
  "sourceCity":      "Bethel Park, PA",
  "sourceBrandId":   "organic",
  "sourceBrandName": "Organic Remedies",
  "storeKey":        "jane:4365",
  "fetchedAt":       "2026-05-01T12:00:00.000Z"
}
```

---

## How GitHub Pages serves the catalog

1. Push the `data/` folder to your GitHub Pages repo (same repo or a sibling
   that the GitHub Pages site resolves).
2. GitHub serves `data/catalog-pa.json` at a URL like:
   `https://<user>.github.io/<repo>/data/catalog-pa.json`
3. The frontend fetches that URL once on first load (with `cache: 'no-cache'`
   so browsers always get the freshest build).

Make sure `data/` is **not** in `.gitignore` — it needs to be committed so
GitHub Pages can serve it.

---

## How to enable static catalog mode in the app

The flag defaults to **off** so the existing live-fetch behavior is untouched.

**Toggle on in browser console (per-session, no code change):**
```js
localStorage.setItem('paBuddy_staticCatalog', '1');
location.reload();
```

**Toggle off:**
```js
localStorage.removeItem('paBuddy_staticCatalog');
location.reload();
```

**Hard-code on** (for production deploy) — open `pa-buddy-finder.html`, find:
```js
const USE_STATIC_CATALOG = localStorage.getItem('paBuddy_staticCatalog') === '1' || false;
```
Change the trailing `false` to `true`.

When static catalog mode is active:
- Selecting a store filters `catalog-pa.json` locally — no live API call.
- Multi-store compare also filters locally — no parallel fan-out.
- Cart, compare, filters, QR code, and all UI behavior work identically.
- The browser console logs catalog age on every page load:
  ```
  [PaBuddy] Static catalog loaded: 45,231 products from 129 stores
             | generated 2026-05-01T12:00:00Z | expires 2026-05-02T12:00:00Z
  ```

---

## How often to run from Windows Task Scheduler

**Recommended: once per day**, early morning before the store opens.

### Setting up Task Scheduler

1. Open **Task Scheduler** (`taskschd.msc`).
2. Click **Create Basic Task…**
3. Name it `PaBuddy Catalog Builder`.
4. Trigger: **Daily**, e.g. 5:00 AM.
5. Action: **Start a program**
   - Program: `node`
   - Arguments: `scripts/build-catalog.js`
   - Start in: `C:\Users\adoan\Pa Buddy Finder - Laptop`
6. Finish. The task runs `npm run build:catalog` equivalent every morning.

After each successful run, copy (or `git push`) the `data/` folder to GitHub
Pages. You can automate this with a second task or a post-build script.

### Quick manual push after a build

```bat
cd "C:\Users\adoan\Pa Buddy Finder - Laptop"
git add data/
git commit -m "catalog: rebuild $(date /t)"
git push
```

---

## How to verify catalog freshness

**Browser console** — open the site and look for the `[PaBuddy]` log line.

**catalog-meta.json** — fetch it directly:
```
https://<your-github-pages-url>/data/catalog-meta.json
```

**Expiry warning** — if the catalog is older than 24 hours, the browser
console prints:
```
[PaBuddy] Catalog is expired — run npm run build:catalog on the laptop.
```

---

## Failed stores

If any stores fail during a build, they appear in:
- `data/catalog-meta.json` → `failedStores[]`
- Console output at the end of the build run

The builder preserves the last good catalog if:
- Zero products were fetched (total failure)
- The new product count is < 10% of the previous build (catastrophic drop)

A partially successful build (some stores failed, most succeeded) is still
written — `failedStores` documents which stores were skipped.

---

## Adding or removing stores

Edit `scripts/stores.pa.json`. The format mirrors the `BRANDS` array in
`pa-buddy-finder.html` — keep them in sync when new brands or store IDs are
discovered.

Set `"active": false` to exclude a brand from builds without deleting it.

---

## Phase 2 ideas (not implemented yet)

- `.br` / `.gz` pre-compressed catalog for faster GitHub Pages delivery
- Split catalog by provider (`catalog-pa-jane.json`, etc.) for partial refreshes
- Hash-named catalog files + `catalog-meta.json` redirect for cache busting
- Stale-while-revalidate badge on the UI showing catalog age
- GitHub Actions workflow to build + push catalog automatically
