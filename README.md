# DmdLab

DmdLab is the digital platform for the Deepminds Research Lab — a
multidisciplinary academic research group led by a university professor and
made up of student researchers. It's a MERN application with two apps in
this repository:

- `client/` — React + Vite frontend (TailwindCSS, React Router)
- `server/` — Node.js + Express backend (MongoDB/Mongoose, Socket.IO, JWT
  admin auth, Multer + Cloudinary for image uploads)

## What it actually does

DmdLab is a **content and admin portal**, not a social network. Visitors can
browse the lab's public content; a single admin account manages it all
through a protected dashboard.

Public site:
- Browse **Articles** with category filtering and title search, view a
  single article (with cover image, when set)
- Browse **Videos** pulled live from the lab's YouTube channel, with
  category filtering, search, and related-video click tracking
- View **Announcements**
- Quick navigation with live article/video counts

Admin dashboard (`/admin`, protected by JWT login):
- Create/edit/delete articles, with Cloudinary image upload and progress
- Create/edit/delete announcements, members, footer/about content
- Manage a separate database-backed video catalog (note: this is not the
  same list of videos shown on the public Videos page, which pulls live
  from YouTube — see "Known gaps" below)
- Dashboard stats and content lists update live over Socket.IO when any
  admin (in any open tab) makes a change

## Tech stack

### Frontend (`client/`)
- React + Vite
- TailwindCSS
- React Router
- Socket.IO client (live-updates the admin dashboard)

### Backend (`server/`)
- Node.js + Express
- MongoDB with Mongoose
- Socket.IO server (emits on admin create/update/delete)
- JWT-based admin auth (single shared admin account, not per-user accounts)
- Multer (in-memory) + Cloudinary for article image uploads
- YouTube Data API integration for the public video catalog

## Project structure

```
├── client/
│   ├── src/
│   │   ├── Pages/            # Lobby, ArticleLayout, ArticlePage, VideoListePage, VideoPage
│   │   ├── admin/             # Admin login + dashboard (articles, videos, profile)
│   │   ├── components/        # Article/Video cards, filters, search, layout
│   │   ├── hooks/              # useVideos
│   │   └── utils/              # api.js (API base URL), socket.js, articleCategories.js
│   └── public/
├── server/
│   ├── controllers/            # admin.controller.js (generic CRUD + article upload logic)
│   ├── middleware/             # adminAuth.js (JWT check)
│   ├── models/                 # Article, Announcement, Member, Post, Video, VideoClick, About
│   ├── routes/                 # articles, videos, announcements, admin
│   ├── utils/                   # cloudinary.js
│   ├── socket.js                # Socket.IO setup
│   └── server.js
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- A running MongoDB instance (Atlas or local)
- A Cloudinary account (for article image uploads)
- A YouTube Data API v3 key + the lab's channel ID (for the public video
  catalog and related-video links)

## Installation (local dev)

```bash
git clone https://github.com/geto-san/DmdLab.git
cd DmdLab

cd server && npm install
cd ../client && npm install
```

## Environment variables

Neither `server/.env` nor `client/.env` is committed (both are gitignored) —
create them yourself from the values below. **Never commit real secrets.**

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | yes | MongoDB connection string |
| `DB_NAME` | no | Overrides the DB name from the URI |
| `PORT` | no | Defaults to `8500` |
| `ADMIN_USER` | **yes in production** | Admin login username. Defaults to `admin` if unset — do not leave this default in production |
| `ADMIN_PASS` | **yes in production** | Admin login password. Defaults to `password` if unset — do not leave this default in production |
| `ADMIN_JWT_SECRET` | **yes in production** | Signs admin JWTs. Defaults to a hardcoded string if unset — do not leave this default in production |
| `ADMIN_JWT_EXPIRES` | no | Token lifetime, defaults to `8h` |
| `CLOUDINARY_CLOUD_NAME` | yes (for uploads) | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | yes (for uploads) | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | yes (for uploads) | Cloudinary API secret |
| `YOUTUBE_API_KEY` | yes (for videos) | YouTube Data API v3 key |
| `YOUTUBE_CHANNEL_ID` | yes (for videos) | The lab's YouTube channel ID |
| `CORS_ORIGINS` | no | Comma-separated extra allowed origins, beyond the deployed defaults and `localhost:5173` |

### `client/.env` (copy from `client/.env.example`)

| Variable | Description |
|---|---|
| `VITE_API_BASE` | Backend API base URL, e.g. `http://localhost:8500` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Must match the server's `CLOUDINARY_CLOUD_NAME` — used to build thumbnail URLs directly in the admin UI |

Only variables named exactly `.env`, `.env.local`, or `.env.[mode]` are
picked up by Vite automatically — don't rename this file.

## Running the app (development)

```bash
# terminal 1
cd server
npm run dev      # nodemon server.js

# terminal 2
cd client
npm run dev      # vite dev server, usually http://localhost:5173
```

The client talks to the API at whatever `VITE_API_BASE` points to.

## Production notes

- Set real, non-default values for `ADMIN_USER`, `ADMIN_PASS`, and
  `ADMIN_JWT_SECRET` — the code silently falls back to weak defaults
  (`admin` / `password` / a hardcoded JWT secret) if these are unset.
- `server.js` connects to Mongo before it starts listening at all; if the
  DB is unreachable, the process exits rather than serving a degraded app.
- CORS is restricted to a small allowlist (`server.js`) rather than `*` —
  add any additional deployed frontend origins via `CORS_ORIGINS`.

## Known gaps / things to be aware of

- The admin "Manage Videos" panel writes to a separate MongoDB `Video`
  collection, but the public Videos page reads live from the YouTube API
  instead. The two are not currently connected — admin-created video
  records aren't shown publicly. Deciding whether to unify these (e.g.
  publish DB videos, or drop the DB video model in favor of YouTube-only)
  is a product decision, not something this codebase resolves today.
- `Member`, `About`, and `Post` have admin CRUD but no public route or page
  yet — nothing on the public site currently reads them.
- Article view counts (`views`) are tracked but nothing currently
  increments them.

## Troubleshooting

- Frontend can't reach the API → check `VITE_API_BASE` in `client/.env`
  and the CORS allowlist in `server/server.js`.
- Mongo connection fails → run `node server/temp_check_mongo.js` (reads
  `MONGO_URI` from `server/.env`) to test the connection in isolation.
- Image uploads fail → double-check the three `CLOUDINARY_*` values match
  your Cloudinary account.

## Contributing

Contributions are welcome — open an issue or PR and follow the existing
code conventions in each app.
