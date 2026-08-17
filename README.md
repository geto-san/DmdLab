# DeepMinds Research Lab (DmdLab)

A centralized hub for the AI/ML research lab at MUST (Mbarara University of Science and Technology): research articles, lab discussion videos, applied ML projects, and a Drupal-style in-place CMS that lets admins edit content directly on the pages.

## Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript + Tailwind CSS v4 — single app, deployed to Vercel.
- **Neon Postgres + Drizzle ORM** — articles, announcements, members, posts, about, videos, video clicks, CMS content blocks (`client/db/schema.ts`).
- **Managed Neon Auth** (`@neondatabase/auth`) — admin sessions; admin role = `neon_auth.user.role = 'admin'`.
- **Resend** — contact form email (`/api/contact`).
- **YouTube Data API** — live video proxy (`lib/youtube.ts`) plus OAuth-based management (`lib/youtube-manage.ts`, `lib/youtube-oauth.ts`): upload, edit metadata, set thumbnails, delete, and manage playlists straight from the site's edit mode.
- **Cloudinary** — article image uploads from the in-place article editor.

## Getting started

```bash
cd client
cp .env.example .env   # fill in Neon, Neon Auth, Resend, Cloudinary, YouTube values
npm install
npm run dev            # http://localhost:3000
```

### Seed data & admin

```bash
npm run seed           # sample articles / announcements / content blocks / team members
npm run create-admin   # create the admin account (password via ADMIN_PASSWORD or first arg)
```

Sign in at `/manage/login`, then flip the **Edit** toggle in the header to edit
articles, announcements, team members, content blocks, and videos in place on the
public pages. The Videos library gets an extra admin bar (upload / connect / playlists).

### YouTube management (upload & editing)

Read-only video listing only needs `YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID`.
Uploading, editing, deleting, thumbnails, and playlists go through Google OAuth:

1. In **Google Cloud Console**, enable the **YouTube Data API v3** for your project.
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → *Web application*.
   Add the redirect URI: `<APP_URL>/api/videos/oauth/callback`
   (e.g. `http://localhost:3000/api/videos/oauth/callback` for local dev).
3. On the **OAuth consent screen**, set the app to *Testing* and add the channel
   owner's Google account as a **test user** (unverified apps only work for test users).
4. Set env vars:
   ```bash
   GOOGLE_OAUTH_CLIENT_ID=...
   GOOGLE_OAUTH_CLIENT_SECRET=...
   YOUTUBE_REDIRECT_URI=...   # optional; defaults to <APP_URL>/api/videos/oauth/callback
   ```
5. In edit mode on `/videos`, click **Connect YouTube account**, complete the Google
   consent screen, and the site can then upload / edit / delete / manage playlists on
   the channel. New uploads appear on the site once YouTube finishes processing them.

> Note: large video uploads are buffered in memory server-side — Vercel serverless
> functions may time out or hit memory limits on multi-GB files. Consider uploading
> smaller files directly from the site and re-uploading big ones in Studio for now.

### Database migrations

```bash
npm run db:generate    # new migration from schema changes
npm run db:migrate     # apply migrations
npm run db:studio      # Drizzle Studio
```

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` (eslint) · `npm run typecheck` (tsc --noEmit)

## License

Led by the DeepMinds Research Lab at MUST. All rights reserved.
