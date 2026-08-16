# DeepMinds Research Lab (DmdLab)

A centralized hub for the AI/ML research lab at MUST (Mbarara University of Science and Technology): research articles, lab discussion videos, applied ML projects, and a CMS-backed admin panel.

## Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript + Tailwind CSS v4 — single app, deployed to Vercel.
- **Neon Postgres + Drizzle ORM** — articles, announcements, members, posts, about, videos, video clicks, CMS content blocks (`client/db/schema.ts`).
- **Managed Neon Auth** (`@neondatabase/auth`) — admin sessions; admin role = `neon_auth.user.role = 'admin'`.
- **Resend** — contact form email (`/api/contact`).
- **YouTube Data API** — live video proxy (`lib/youtube.ts`).
- **Cloudinary** — article image uploads from the admin panel.

## Getting started

```bash
cd client
cp .env.example .env   # fill in Neon, Neon Auth, Resend, Cloudinary, YouTube values
npm install
npm run dev            # http://localhost:3000
```

### Seed data & admin

```bash
npm run seed           # sample articles / announcements / content blocks
npm run create-admin   # create the admin account (password via ADMIN_PASSWORD or first arg)
```

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
