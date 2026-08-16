# AGENTS.md

Single Next.js app; the old Express/Mongo `server/` package was deleted in the Postgres migration. No root manifest, no tests, no CI. Verification is `npm run typecheck`, `npm run lint`, and `npm run build` in `client/` (all currently clean).

## Layout & stack

- `client/` — Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. **ESM**; CommonJS (`require`) is only used inside the `server`-adjacent legacy scripts — do not convert.
- Tailwind v4 uses `@tailwindcss/postcss`; there is **no `tailwind.config.js`** — theme tokens and the `.dark` custom variant live in `client/app/globals.css` (`@theme`, `@custom-variant dark`).
- DB is Neon Postgres + Drizzle ORM (`drizzle-orm/neon-http`). Schema: `client/db/schema.ts`, client `client/db/index.ts`, config `client/drizzle.config.ts` (`schemaFilter: ["public"]`).
- Auth is **Managed Neon Auth** (`@neondatabase/auth`), not a hand-rolled JWT. Session/account tables live in the `neon_auth` schema (managed by Neon — excluded from Drizzle). Admin role is `neon_auth.user.role = 'admin'`, gated by `app/api/admin/guard.ts` (`auth.getSession()` → role check → 401) and `proxy.ts` (redirects unauthenticated `/admin/*` → `/admin/login`).
- Email is Resend via `app/api/contact` (validated + per-IP rate-limited) → `CONTACT_EMAIL`, with `CONTACT_FROM` defaulting to the Resend sandbox (`onboarding@resend.dev`).
- YouTube data is a live proxy to the YouTube Data API (`lib/youtube.ts`), not the DB. `GET /videos*` needs `YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID`; a channel URL/`@handle` auto-resolves to a raw `UC...` id. Related-video clicks are stored in the `video_clicks` table.

## Setup

```bash
cd client && cp .env.example .env   # fill in real values
npm install
npm run dev                          # http://localhost:3000
```

`client/.env` (gitignored) must contain: `DATABASE_URL` (Neon pooled URL), `DATABASE_URL_UNPOOLED` (same host minus `-pooler`, used by drizzle-kit migrations and scripts), `NEON_AUTH_BASE_URL` (the `*.neonauth.<region>.aws.neon.tech/<db>/auth` URL), `NEON_AUTH_COOKIE_SECRET`, `ADMIN_EMAIL`, `RESEND_API_KEY`, `CONTACT_EMAIL` (defaults to `ADMIN_EMAIL`), `CONTACT_FROM`, plus `CLOUDINARY_*` and `YOUTUBE_*`.

## Scripts (in `client/`)

- `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` — Drizzle kit. Migrations output to `drizzle/`. `drizzle/*.sql.ignore` is gitignored.
- `npm run seed` (add) / `npm run seed:reset` (wipe Articles + Announcements + Content first) — Drizzle inserts; needs `DATABASE_URL` in `.env`.
- `npm run create-admin` — POSTs `${NEON_AUTH_BASE_URL}/sign-up/email` (password via `ADMIN_PASSWORD` env or first CLI arg; idempotent on "already exists") then sets `neon_auth.user.role='admin'`. Needs `NEON_AUTH_BASE_URL`, `ADMIN_EMAIL`, and `DATABASE_URL`. `APP_URL` (default `http://localhost:3000`) is sent as the Origin header + `callbackURL`.
- Scripts use `scripts/load-env.ts` to load `client/.env`; they dynamically import `db/index.ts` **after** loading env (the db client reads `DATABASE_URL` at import time).

## API facts

- Public: `GET /api/articles`, `/api/articles/[id]`, `/api/announcements`, `/api/content`, `/api/content/[key]`, `/api/videos`, `/api/videos/[id]`, `/api/videos/[id]/click` (POST), `/api/videos/[id]/related`, `POST /api/contact`. Read-only by design; no public write endpoints.
- Admin: `/api/admin/articles` + `/[id]` (multipart, Cloudinary `image` upload/destroy via `imagePublicId`, tags via `form.getAll("tags")`), `/api/admin/[collection]` + `/[id]` for announcements/members/posts/about/videos/content (JSON). All protected by `requireAdmin()`.
- Auth endpoints are mounted at `/api/auth/[...path]` (better-auth/Neon handler). The browser auth client (`lib/auth/client.ts`) defaults to same-origin `/api/auth`; admin SPA (`components/admin/*`) uses `authClient.useSession()` + session cookies — do not reintroduce token headers.
- Content blocks have a `key` that must match `^[a-z0-9-]+$` and a jsonb `payload`; `lib/content.ts` merges DB blocks over static fallbacks from `lib/data.ts`.

## Deploy

Vercel-only, standalone Next app. No dual server/client deploy. Set all `client/.env` vars (with `DATABASE_URL`, `NEON_AUTH_BASE_URL`, etc.) as Vercel env vars. Production build is a monolith; there is no `vercel.json` rewrite needed since Next handles routing.

## Gotchas

- Do not convert to ESM `import` in any legacy CommonJS script that runs under `tsx` with the default CJS output (no top-level await in scripts).
- `eslint-config-next` v16 ships native flat configs — do **not** reintroduce `FlatCompat` (it crashes eslint with a circular-structure error). `react-hooks/set-state-in-effect` is disabled for the intentional mount/hydration patterns.
- Never add a public `POST /api/articles` (removed previously as a security fix).
