# Duck Duck Cackling Goose

A small browser game: tell two **iNaturalist** species apart from research-grade photos or audio. Defaults to **Cackling Goose** vs **Canada Goose**; open **Species pair** for presets or tap the **circular taxon photos** to search iNaturalist species (taxa with at least one observation; quiz media is still research-grade). The production build is written to **`docs/`** for [GitHub Pages](https://pages.github.com/).

Stack: **React 19**, **TypeScript**, **Vite 6**, **Jotai** (see `package.json`).

## Development

Install dependencies (Node 20+ recommended; Node 18+ should work):

```bash
npm install
```

Start the Vite dev server (hot reload):

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Edit files under **`src/`** only; the dev server serves the app from the project root `index.html` and `src/main.tsx`.

## Build

Run a production build (TypeScript check, then Vite bundle):

```bash
npm run build
```

This runs `tsc -p tsconfig.app.json --noEmit` and then `vite build`. Output goes to **`docs/`** (`outDir` in [`vite.config.ts`](vite.config.ts)), with `base: "./"` so asset paths work on GitHub Pages project sites.

A **Husky** [`.husky/pre-commit`](.husky/pre-commit) hook runs `npm run build` and stages **`docs/`** so commits stay aligned with the built site. After a fresh clone, run `npm install` once so the `prepare` script installs Husky.

## Run the built site locally

After `npm run build`, serve the contents of **`docs/`** (use a real HTTP server so `localStorage` behaves predictably):

```bash
npx --yes serve docs
```

Or use Vite’s preview server (serves the same `docs/` output from [`vite.config.ts`](vite.config.ts)):

```bash
npx vite preview
```

Open the URL shown in the terminal (for example `http://localhost:4173` for `vite preview`, or the port `serve` prints).

### URL parameters (share a species pair)

On load, if both are present, **`taxonA`** and **`taxonB`** set the active pair (iNaturalist taxon IDs). Short aliases **`a`** and **`b`** work the same. Example:

`http://localhost:4173/?taxonA=59220&taxonB=7089`

The app resolves names from the taxa API, persists the pair, and keeps the query string in sync with **`history.replaceState`** when you change species (other query parameters are preserved).

## Deploy on GitHub Pages

1. **Build** so `docs/` is up to date: `npm run build` (or commit via the pre-commit hook so `docs/` is included).
2. Push to your repository’s default branch.
3. On GitHub: **Settings → Pages → Build and deployment**.
4. Under **Branch**, select your default branch (for example **`main`**) and folder **`/docs`**, then save.
5. After a short build, the site is available at:

   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

For a **user or organization** site (`username.github.io`), you can use the same **`/docs`** source on the `main` branch, or build into another branch—just ensure the built `index.html` and assets are what Pages serves.

## iNaturalist access

The game loads photos with **anonymous** `fetch` requests to `https://api.inaturalist.org/v1/observations` (no login, no API token). You may still see **HTTP 403** from the API under heavy use or WAF rules; the game retries automatically.

Each round picks a **random time within the last year**, queries observations for the taxon with `d1`/`d2`, sorts by `observed_on` descending, and uses the **most recent observation at or before** that time (scanning up to a few pages if needed). The response must match the requested `taxon_id` and include photos.

On first load, any legacy **`ddcg_inat_jwt`** value in `localStorage` from an older build is cleared.

## Preset species pairs (taxon IDs)

| Pair | Species A (left button) | Species B (right button) |
|------|-------------------------|--------------------------|
| Geese (default) | Cackling Goose `59220` | Canada Goose `7089` |
| Finches | Purple Finch `199841` | House Finch `199840` |
| Swallows | Violet-green Swallow `11931` | Tree Swallow `11935` |

IDs follow [iNaturalist](https://www.inaturalist.org/) taxa; verify on the taxon page if names change.

## Project layout

| Path | Purpose |
|------|--------|
| `index.html` | Vite entry (root `div`, loads `src/main.tsx`) |
| `src/main.tsx`, `src/App.tsx` | React bootstrap and app shell |
| `src/components/quiz/` | Quiz UI (game area, modals, header) |
| `src/quiz/` | Game logic, iNat API, Jotai atoms, persistence |
| `docs/` | **Production build output** — do not hand-edit; run `npm run build` |
| `vite.config.ts` | Vite + React; `build.outDir: "docs"` for GitHub Pages |

**Storage:** Active species pair and **per-pair** stats (streaks, totals, confusion matrix) live in **`localStorage`** under `ddcg_v2`. A legacy **`ddcg_stats`** cookie from older builds is migrated once into the default geese pair (`59220-7089`) and then cleared.

## API

The game calls `https://api.inaturalist.org/v1/observations` with `quality_grade=research`, `photos=true`, `order_by=observed_on`, `order=desc`, date bounds `d1`/`d2`, and the active pair’s taxon IDs. Photo credit uses the observation’s observer login from the API response.
