# AGENTS.md

Two independent npm packages; no root manifest, no tests, no CI. Verification is `npm run lint` in each package (server lint is clean; client lint currently reports ~17 pre-existing `no-unused-vars`/`react-refresh` errors in the working tree).

## Layout & stack

- `server/` — Express + Mongoose + Socket.io. **CommonJS** (`require`); the eslint config sets `sourceType: 'commonjs'` — do not convert to ESM.
- `client/` — React 19 + Vite + Tailwind v4. ESM. Tailwind v4 uses `@tailwindcss/vite`; there is **no `tailwind.config.js`** — theme tokens and the `.dark` custom variant live in `client/src/index.css` (`@theme`, `@custom-variant dark`).
- Client routes are declared in `client/src/main.jsx`. Note the typo'd file `Pages/VideoListePage.jsx` is imported as `VideoListPage` there — rename only if you update the import too.

## Setup

```bash
# server (port 8500)
cd server && cp server.env.example .env   # file is server.env.example, not .env.example
npm run dev                                # nodemon; npm start for prod

# client (port 5173)
cd client && npm run dev
```

- Server reads `server/.env` via dotenv. Client env vars must be `VITE_`-prefixed or Vite won't expose them; the unprefixed fallbacks in `client/src/utils/api.js` are dead code. `VITE_API_BASE` overrides the `http://localhost:8500` default.
- Seed sample data: `cd server && node seed.js` (adds docs) or `node seed.js --reset` (wipes Article + Announcement first). Requires `MONGO_URI`/`DB_NAME` in `server/.env`.
- `DB_NAME` must be a database name, not an Atlas cluster name — the server warns (`/^cluster\d*$/i`) and would otherwise create a bogus DB.

## Deploy model

- `npm run build` inside `server/` actually builds the **client** (`cd ../client && npm run build`); `npm run build-and-start` does both. This enables a monolith deploy: if `client/dist/index.html` exists, the server serves the built SPA (with catch-all routing); otherwise it runs API-only (health check at `/`, JSON 404s elsewhere). Client also deploys standalone to Vercel (`vercel.json` rewrite → `/index.html`).
- CORS is a hard allowlist plus optional suffix matching (`CORS_ORIGIN_SUFFIXES`) because Vercel preview URLs are hash-unique. Match this pattern when adding origins.

## API facts

- Admin API is mounted at `/admin/*` and protected by a Bearer JWT (`middleware/adminAuth.js`). Defaults when unset: `admin`/`password`, secret `deepminds-secret` — change before deploying.
- Article create/update/delete exist **only** under `/admin/articles` (Multer + Cloudinary upload via field `image`). Public `GET /articles` is read-only by design; do not re-add a public POST (removed previously as a security fix).
- `GET /videos*` is a live proxy to the YouTube Data API, not the DB. Needs `YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID`; a channel URL/`@handle` is auto-resolved to a raw `UC...` id.
- Socket.io attaches to the native HTTP server only after Mongo connects; the process `exit(1)`s if Mongo fails.
- `server/DmdLab.postman_collection.json` documents the API endpoints.
