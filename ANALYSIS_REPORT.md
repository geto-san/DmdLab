# DmdLab — Comprehensive Analysis & Feasibility Report

**Project:** DeepMinds Research Lab (DmdLab) — AI/ML lab site for Mbarara University of Science and Technology (MUST)
**Scope:** Performance, UI, interaction, navigation, code review, logic review, security, viability vs. existing systems, and feature-import roadmap
**Date:** 2026-09-15
**Method:** 3 parallel deep-dive agents (CMS/admin, video/watch, public UI) + manual verification of 6 config/source files + `npm run typecheck` / `npm run lint` / `npm run build` + web literature research on lab sites, CMS visual editing, and video-player accessibility.

---

## 1. Executive Summary

DmdLab is a technically strong, single-repo Next.js 16 + Neon Postgres + Drizzle app with a genuinely differentiated CMS: **Drupal-style in-place editing**, an ambitious **custom YouTube watch experience** (poster-first player, playlist sidebar, comments, resume), and **OAuth-backed video management** (upload/edit/delete/thumbnails/playlists). The design system is cohesive and distinctive (display serif, mono micro-labels, dark-first tokens, grain/noise overlays).

**Verdict: HIGH viability for its purpose.** As a lab showcase + internal admin tool it already outstrips most university labs (which run generic WordPress/Wix). The main risks are (a) abuse/security on public writes, (b) YouTube-quota cost under serverless caching, (c) accessibility gaps in the custom player and scroll-reveal layer, and (d) stale docs + uncommitted WIP that currently breaks the build.

### Scorecard (1–5)

| Dimension | Score | Headline issue |
|---|---|---|
| Architecture & data flow | 4.5 | Clean RSC/ISR split; graceful DB fallbacks |
| Performance | 3.5 | YouTube cold-cache amplification; homepage full-channel scan |
| UI / design language | 4.5 | Cohesive, distinctive; some contrast/SSR-hidden content |
| Interaction design | 4.0 | Excellent player shell & admin panel; missing fullscreen/shortcuts |
| Navigation | 4.0 | Logical IA; dangling `#lab` anchor; no desktop sign-in |
| Security | 3.0 | Unthrottled/unverified `/api/apply`, mass assignment, raw errors |
| Accessibility | 3.0 | Reveal hides SSR content; custom player a11y gaps |
| Code quality | 3.5 | Dead code + duplication; lint/typecheck currently failing |
| Documentation accuracy | 2.5 | AGENTS.md/README drift from reality |

---

## 2. Verification Health (currently RED)

Contrary to `AGENTS.md` ("all currently clean"), the workspace does **not** build cleanly today:

- **`npm run typecheck` FAILS** — uncommitted `tests/lib/*.test.ts` + `vitest.config.ts` reference `vitest` (not installed) and import `normalizeContentPatch` / `pickEditable` from `lib/collections.ts`, **which do not exist**. (The tests describe a column-allowlist refactor that was written test-first but never implemented.)
- **`npm run lint` FAILS** — `client/build_doc.js` and `client/p.js` (committed-to-working-tree scratch scripts using `require("docx")`) produce 11 eslint errors (`no-unused-vars`, `no-require-imports`). ESLint's config only ignores `.next`, `node_modules`, `next-env.d.ts`, `drizzle/**`.
- **`npm run build` FAILS** — `next build` aborts at its built-in type-check stage on the same test-file errors.
- Working tree has uncommitted WIP: new player resume logic, a `docx` dependency, `0006` migration, tests, `vitest.config.ts`, `build_doc.js`, `p.js`.

**Recommendation:** either finish the WIP refactor (implement `pickEditable`/`normalizeContentPatch`, add `vitest + @vitest/...` devDeps, `npm test` script) or remove/stub it; add `tests/` and scratch scripts to eslint `ignores`; commit deliberately. Add `"test": "vitest run"`.

---

## 3. Architecture Overview

- **Next.js 16 App Router**, React 19, Tailwind v4 (CSS tokens in `globals.css`, no config file), TypeScript strict, deployed on Vercel.
- **DB:** Neon Postgres + Drizzle. Public tables: `articles`, `announcements`, `members`, `applications`, `about`, `posts`, `content_blocks`; media tables: `video_clicks`, `video_comments`, `youtube_oauth`; **dead**: `videos`, `site_settings`.
- **Auth:** Managed Neon Auth (role in `neon_auth.user.role`), `requireAdmin()` guard per admin route, **no middleware**.
- **Caching:** ISR 3600 on home/article-detail/research/publications/team; `force-dynamic` on articles-list and videos; per-instance in-memory Map for YouTube list/detail; In-Memory rate-limit map.
- **CMS:** global `EditModeProvider` → `SidePanelProvider` → `<CmsPanel>`; `EditItem` pencils + `AddButton`s on public content; collection-driven side panels write via admin APIs then `router.refresh()`.
- **Video:** server-shell + client `WatchShell` SPA (pushState hot-swap); lazy YouTube IFrame API; custom controls; OAuth token stored in `youtube_oauth`.

### Verified good patterns (compare-worthy)
- Graceful degradation: home does `Promise.all` with `.catch(() => 0)`; DB reads fall back to `{}`/empty states; team/publications/research are strictly DB-driven with styled empties.
- `mergeBlock` (DB content over static fallback) is a clean content-modeling primitive.
- Side panel is a real accessible dialog (Escape, focus-on-open, focus-restore, `aria-modal`) — better than most hand-rolled CMSs.
- Poster-first player + resume-in-localStorage is a thoughtful UX (idle posters avoid autoplay-block; ≤0.95 fractions resume, finished clears).
- README/`.env.example` cover OAuth setup thoroughly.

---

## 4. Performance Analysis

### Findings (highest impact first)

1. **YouTube cold-cache amplification** (`lib/youtube.ts`): `/videos` is `force-dynamic`; on a cold Vercel function `fetchChannelVideos()` costs **~1 search call per 50 videos + 1 videos call per 50**, and the in-memory `CACHE` Map is per-instance (not shared, dies on cold start). Concurrent instances each burn full quota.
   → *Fix:* Vercel Data Cache / `unstable_cache` (or a Neon-backed cache table) with `revalidate` instead of the Map; raise ISR on the videos shell.
2. **Homepage scans the whole channel** — `getTotalRecordedHours()` pages *everything*, and this runs inside the homepage `Promise.all` gate (ISR 1h, but each region instance pays it). Most expensive single site in the app.
3. **Redundant metadata call** — `generateMetadata()` for `/videos/:id` calls `fetchVideoById(id)` even though the channel-list fetch already contains that video's snippet (2 Google calls per cold open; also a 404 risk on renamed videos).
4. **Unused public `/api/videos/[id]/related`** — unauthenticated endpoint that triggers a fresh 50-item channel fetch + DB aggregation; **nothing in the UI calls it**. Free quota/DoS vector.
5. **`router.refresh()` after every admin video write** re-runs the `force-dynamic` channel fetch server-side, burning quota per edit.
6. **`listPlaylistsWithItems` is N+1** (1 + N Google calls per editor open).
7. **Client re-render hotspots:** the 500 ms `setInterval` in `PlayerProvider` updates context → all `usePlayer()` consumers re-render 2×/s during playback; every `PlaylistRow` listens to `PROGRESS_EVENT` so each save re-renders **the whole playlist** (O(n) setStates every ~5 s).
8. **No streaming/Suspense** on the videos shell — a slow YouTube response blocks the whole page (route `loading.tsx` only covers soft nav of a new document).
9. **Unbounded public writes:** `POST /api/videos/[id]/click` inserts a row with no cap/dedupe; `GET /api/announcements` has no `limit` clamp (articles clamps to 50, announcements doesn't). Unbounded DB growth + trivial abuse.
10. Upload buffer: thumbnail route reads whole body with no size cap; article/member images buffered fully *before* the 10 MB check.

**Perf recommendations:** dedupe metadata from list; gate-or-delete `/related`; add ISR/shared cache for the channel list; throttle the player ticker to only the time UI; constrain `limit` on announcements; cap `/click` (unique `(from,to,ip,day)` or rate-limit); add a home `loading.tsx`.

---

## 5. UI Analysis

### Strengths
- Cohesive design system: `font-display` serif display type, `font-mono-x` micro-labels, lime `accent` + violet `accent2`, noise overlay, `rounded-blob`, hairline borders, glass header; dark-first with system-follow. Distinctive and internally consistent.
- `Reveal`, `Marquee`, `StatCounter`, and image hover zooms are well-tuned; `prefers-reduced-motion` global kill-switch exists.
- Route-level skeletons everywhere except home + manage; `articles/loading`, `videos/loading` are richer than average.
- Editorial `prose-lab` styles exist for article bodies.

### Issues
- **`Reveal` SSR-hides content** (`opacity-0` pre-hydration; requires JS + IntersectionObserver). Non-JS/no-JS users see an empty hero. Also leaves content delayed under reduced-motion (only duration zeroed, not delay). *Highest a11y severity.*
- **`StatCounter` SSR-renders `0`** — crawlers/static captures see "0 Researchers / 0 Hours".
- **Contrast fails AA:** `text-accent2` (#7c6cff on cream ≈3.3:1) used for 10–11 px labels (research numbers, card eyebrows, team roles, publication years, mobile menu numbers); `text-red-500` errors on `bg-red-500/10` (~3.9:1 dark); `text-muted/80` nav in light.
- **Weak focus indicators:** inputs use `outline-none` + 1px border swap only; `Slider` has no focus style.
- **Mobile `<dialog>` abuses native open:** always in DOM with `open`, toggled by CSS visibility; no `aria-modal`, no `inert` on background.
- Announcement rows `hover:bg-surface` but aren't clickable (false affordance).
- Header/nav: **no desktop sign-in link** (only in mobile dialog); footer has no `/manage` link.
- Micro-type scale inconsistent (`text-[0.625rem]` vs `text-[0.6875rem]` vs `font-mono-x`).
- `team/loading.tsx` shows a layout (avatar sidebar + circles) that doesn't match the real grid (portrait cards) — misleading skeleton.
- Video channel row "Subscribe" truncates to "Sub" on mobile; slight CLS/font scale issues in near-zero view counts.

---

## 6. Interaction Analysis

### Strengths
- Poster-first player + big play → trophy interaction; floating mute/volume (desktop) + mobile volume cluster; playback-speed menu; captions toggle; copy link / embed / open-in-YouTube; `tabular-nums` time to avoid jitter.
- Precise progress model: 500 ms poll, 5 s localStorage saves, finished-video cleanup, >5 s seek guard, `pendingLoadRef` for switch-before-ready.
- Watch shell: `pushState` hot-swap + `popstate` reconciliation + prop-diff effect — genuinely seamless video switching (commit `2dd591e`).
- Admin: two-click delete confirm, per-file upload queue with cancel/retry/progress, drag-drop; side panel Escape/focus handling.

### Issues
- **No fullscreen** (native controls disabled via `controls:0`, custom UI has none) and **no keyboard shortcuts** (no Space/K/J/F/M; only Escape in menus). Two of the biggest player gaps — and both violate WCAG 2.1.1/2.4.7 for a custom player.
- No PiP, no quality selector, no interactive transcript, no chapters.
- **Comments:** no moderation UI, no server persist of likes (cosmetic `localStorage`), no editing/deletion, name spoofable, oldest-first 200 cap hides new comments on active threads.
- `selectVideo`/`apiRef` race: clicking before `apiRef` publishes updates `activeId` but silently no-ops the load.
- **Click attribution bug:** module-level `tracked` Set keyed by destination only → A→B→A→B records one click attributed to the first origin.
- Dangling `href="#lab"` scroll arrow (target doesn't exist); footer `href="#"` back-to-top pollutes URL.
- **`document.title` not updated** on `pushState` video switches.
- CMS panels: playlist delete has no confirm; applications delete is optimistic with no confirm; `ArticlePanelForm`/`MemberPanelForm` never clear the file input or close on success; `URL.createObjectURL` object-URL leaks (never revoked).
- Home "03 /" orphaned counter with no denominator; hero CTA "Explore Research" → `/articles` (surprising vs `/research`).

---

## 7. Navigation Analysis

- Clear 5-section IA (Articles / Research / Videos / Publications / Team), active-state underline on desktop, numbered full-screen mobile dialog with focus-trap + Esc + focus-return. `aria-current="page"` present.
- Articles: filter chips + pagination (but `page` param unclamped → false empty state at out-of-range pages). Detail has "Back to journal".
- Videos: client-side playlist navigation with history integration — the only true SPA route.
- `/manage` instant-redirect to login (no dashboard) — acceptable but reducing.
- **Issues:** broken `#lab` anchor; no desktop sign-in path; footer non-functional back-to-top; `pathname.startsWith` active matching makes `/articles` active for `/articles/123` and any future `/articlesXYZ*` — fine today, fragile to new prefixes; research detail slugs are content-block keys (URL coupling to CMS keys).

---

## 8. Code Review (static)

### Dead / stale code
- `components/cms/video-detail-edit.tsx` — never imported.
- `PanelForm`'s `onDeleteRedirect` branch unreachable (prop never passed).
- DB tables `videos`, `site_settings` (settings lib deleted) — orphaned.
- Member columns `category/bio/experience/location` — written by seed/CMS, **never rendered on the public team page** (page splits on `alumni`).
- `ALUMNI`, `LAB_MEMBERS`, `fade-up` keyframes/token, `prose-lab` `a/blockquote/ul/ol/li` rules — unused (article renderer only emits `p/h2/h3`; **rich-text content can never be displayed**).
- `AGENTS.md`/`README.md` reference `components/cms/toolbar.tsx` and `app/api/contact` which no longer exist; claim team page is grouped by `category` (it isn't); claim edit toggle (edit mode is always-on for admins).

### Duplication
- `lib/articles-form.ts` vs `lib/members-form.ts` (identical validation/upload shape) — merge.
- Four panel forms duplicate the same busy/error/save/remove skeleton — extract a hook.
- `NOTIFIABLE_CONTENT_KEYS` declared twice; `ErrorBanner` reimplemented inline in `content-panel-form.tsx`; error markup repeated 3+ places; badge markup hand-rolled in 3 places; `ArrowUpRight` micro-interaction re-implemented 4×; logo duplicated in header desktop + dialog; date formatting duplicated (home + InfoBar) vs `formatDate`.
- `EditModeContext` exposes `enabled` **and** `isAdmin` (always identical).

### Logic issues
- Mass assignment: generic `/api/admin/[collection]` POST/PUT inserts/spreads the **raw request body** with no column allowlist (the WIP tests target exactly this).
- OAuth refresh has **no concurrency lock** (concurrent refresh races; last-write-wins).
- Thumbnail route: no size cap, no content-type validation, full buffering.
- `getChannelId` fallback silently uses the raw env value on failure → confusing downstream 400s.
- `VideoConnect` disconnect swallows errors (no catch); `refreshPlaylists` swallows errors; `api()` `AuthError` never handled → users see raw "Unauthorized" with no re-login redirect.
- Notification spam: every article PUT + every content PUT re-emails **all** active members (no diffing, no debounce, no unsubscribe); `SITE_URL` not in `.env.example` (emails would link localhost); BCC caps will silently fail at scale.
- Homepage `getTotalRecordedHours` inside the page gate; `youtube-manage` `listPlaylistsWithItems` N+1.

---

## 9. Security Review

| Severity | Finding | Location |
|---|---|---|
| **High** | `/api/apply` has **no rate limit, no CAPTCHA, no email verification** (Google-verify flow removed in `63fe2c3`); domain allowlist is client-spoofable in concept (`gmail.com`) | `app/api/apply/route.ts` |
| **High** | No explicit CSRF defense; admin mutations rely entirely on session cookie `SameSite=Lax`; OAuth `start` is a state-changing GET; callback not admin-gated (only 10-min state cookie) | all admin routes, `videos/oauth/*` |
| **Medium-High** | Mass assignment via generic collection route (raw body insert/spread) | `[collection]/route.ts`, `[collection]/[id]/route.ts` |
| **Medium** | Raw `Error.message` surfaced to clients across ~all admin/video routes (DB/SQL/Cloudinary internals) | numerous |
| **Medium** | Client-trusted `file.type` MIME validation; full-buffer-before-size-check on uploads; no max size on thumbnail | `articles-form.ts`, `members-form.ts`, `thumbnail/route.ts` |
| **Medium** | In-memory per-instance rate limiter only on comments; spoofable via `x-forwarded-for`; `/click` fully un-limitless | `rate-limit.ts` |
| **Low-Med** | Orphaned Cloudinary assets when image replaced via URL or cleared (only new file upload destroys old) | articles/members `[id]` routes |
| **Low** | Role freshness `sessionDataTtl: 300`; no central auth choke point (every route must remember `requireAdmin()`) | `lib/auth/server.ts` |
| **Low** | No comment moderation/delete API | — |

**Hardening plan:** add `Origin`/`Referer` validation helper (or middleware) for all cookie-authenticated mutations; re-add Google-verified apply flow **or** rate-limit + CAPTCHA (Turnstile) + duplicate-email suppression; implement the `pickEditable`/`normalizeContentPatch` allowlist the tests already describe; sanitize errors to stable codes; add refresh mutex; destroy previous Cloudinary public id on any photo/image change; cap thumbnail size + server-side MIME sniff; gate the OAuth callback with `requireAdmin()` too.

---

## 10. Logic Review (data-flow correctness)

- **Progress model** is sound (interval 500 ms, save 5 s, `(0.01, 0.95)` window). Risk: 4 loose copies of "current video" (`videoIdRef`, `videoId`, `pendingLoadRef`, shell `activeId`) — correct today but fragile; `load()` mutates ref before state.
- **Merge semantics** documented and consistent (arrays replace wholesale; scalar/object deep-merge).
- **ISR vs force-dynamic split is coherent**, and edits revalidate the right paths — except home article-detail staleness is bridged only by `revalidateArticlePaths("/")` on writes; `/articles` list is always-live. OK.
- **Bug:** articles pagination unclamped; **Bug:** `0{i+1}` numbering → "010"/"011" past 9 projects; **Bug:** CSS `scroll-smooth` + `data-scroll-behavior` + base rule triple-declared.
- **Video metadata category default is `"22"` (Entertainment)** — odd for a research lab, silently applied when category lookup fails.
- `POST /click` no dedupe; comment append interleave on simultaneous tabs; comments cap hides new entries on hot threads.

---

## 11. Viability & Usability vs. Existing Systems (Literature Research)

### Competitor landscape

| System | Model | Strengths | Gaps vs DmdLab |
|---|---|---|---|
| **WordPress/Drupal sites** (CUNY AI Lab, CAAI Louisiana, most labs) | Full CMS | Plug-and-play, familiar editors | No structured content, generic design, plugin bloat, no native YouTube management |
| **Static lab templates** (CAU AI Lab, starklab, CIMR-like) | Static or page-builder | Fast, simple | No in-place editing; content requires a developer; no live video layer |
| **Stanford STAIR, MIT DSL, Harvard IIS** | Bespoke | Curated publications w/ BibTeX links, research narrative | Do not ship a custom player or in-place CMS; typically form-less static |
| **Storyblok / Contentful / Sanity / Tina / dotCMS** | Headless w/ visual editing | Drag-drop blocks, live preview, role-based reviewer workflows | External SaaS cost (€90+/mo+), developer-dependent modeling; overkill for a lab |
| **YouTube Studio / Vimeo** | Media host | Best-in-class player + captions + analytics | Not a site; no lab-page narrative; no playlist-brand control |
| **Framer/Webflow/Wix labs** | No-code builder | Fast publishing | Lock-in, weak structured data, no server logic (no applications/comments/DB) |

### Market reality
- **Most AI labs do NOT do in-place editing.** DmdLab's up-front investment is a real differentiator and adoption lever — a single non-technical admin can curate articles, members, research, publications, and videos (incl. **uploading videos straight to the channel from the site**).
- Lab-site literature consistently highlights: **publications with BibTeX/export + abstract toggle + DOI links** (Harvard IIS, CLI via researchr/BibBase); **alumni tracking**; **prospective-student/join funnel with verification**; **newsletter/notification**; **events**; **funding/grants**; **interactive demos/hubs**; **faculty + student profiles**; **reading-group/seminar listings**; **SEO for paper titles**.
- Custom-video-player accessibility (Video.js, MDN, W3C WAI): a custom player must re-implement the native a11y contract — keyboard operation, visible focus, `role=slider` seek with aria values as time, live-region status announcements, **fullscreen**, and PiP. DmdLab is currently weak on exactly these (no fullscreen, no shortcuts, no live region).

### Viability conclusion
DmdLab is **more capable than ~95% of academic-lab websites** on capability-per-admin and design quality, and its architecture (single Next.js deploy on Vercel) is cheaper and simpler to run than any licensed CMS. Its realistic weaknesses versus the market are **not structural but feature-set**: missing citation/export ergonomics, comment moderation, event/seminar infra, an alumni/join verification path, and player a11y parity. These are cheap to borrow.

---

## 12. Feature-Import Roadmap (borrow from the market)

### Phase 1 — Correctness & hygiene (do first; mostly already half-written)
1. **Finish the column-allowlist refactor** the uncommitted tests demand (`pickEditable` + `normalizeContentPatch` in `lib/collections.ts`) → kills mass assignment. Add `vitest` devDeps, wire `npm test`.
2. **Restore green CI:** eslint-ignore `build_doc.js`, `p.js`, `tests/` (or delete scratch files); commit WIP deliberately.
3. **Rate-limit + protect `/api/apply`** (Turnstile or re-add Google-verify; dedupe by email) — borrow from the deleted `3b89362` flow.
4. **Origin-deny helper + `requireAdmin()` on the OAuth callback**; sanitize error payloads app-wide.

### Phase 2 — Performance & quota
5. **Shared/ISR caching for the YouTube channel list** (`unstable_cache` or Neon cache table) + reuse list-entry in `generateMetadata` + **delete or gate `/related`**.
6. Clamp `limit` on `/api/announcements`; dedupe/cap `POST /click`; paginate comments newest-first with cursor + **admin moderation delete** (borrow from Discourse/Disqus basics).
7. Throttle the player ticker; isolate it from the full context (borrow `useSyncExternalStore`/event-emitter pattern from Video.js).

### Phase 3 — Player & interaction parity (borrow from Video.js/YouTube/NPS players)
8. **Fullscreen** (`requestFullscreen` on stage) + **keyboard shortcuts** (Space, K, J/L seek ±10 s, M, F, ↑/↓ volume, Home/End) with a visible `:focus` ring; announce state via `role="status"` live region.
9. **`document.title` sync** on video switch; **theme-colored controls inherit from tokens**; optional PiP.

### Phase 4 — Lab-site features the market expects (borrow from STAIR/Harvard IIS/BibBase)
10. **Publications upgrade:** per-entry abstract toggle, BibTeX/DOI export, year filter ("2026 · 2025 …" pattern from MIT DSL), author search, optional ORCID sync.
11. **Research project pages**: richer fields (links, code/Demo repos, people, collaborators) — the `prose-lab` styles + a Markdown block are already there, unused.
12. **Events & Reading Group / Seminar list** (new `content`-block-driven section; the whole site infra already supports it).
13. **Join funnel:** verification (Google or university-domain magic-link via Resend) + status-tracking for applicants (partially present; add email + status visible to applicant), plus **email dedupe**.
14. **Newsletter/digest**: reuse `notify-members` as an opt-in list with unsubscribe (Resend supports unsubscribe headers) — fixes current spam-by-default behavior too.
15. **Staff/students + alumni grid** with socials (fields exist in schema; surface `bio`/`experience`/`location` which are currently collected-but-invisible).

### Phase 5 — CMS polish (borrow from Storyblok/Tina/dotCMS)
16. **Draft-vs-publish + preview** (content blocks already have `enabled` — a `published` flag + admin-only preview would be nearly free).
17. **Version/audit trail** for content blocks (jsonb history slice).
18. Open `EditItem` hooks on click-to-edit (currently pencil-only), + role-scoped editor accounts beyond single admin.
19. Debounce/diff `notifyMembersOfUpdate`; per-member notification prefs.

---

## 13. Prioritized 30-day Action Plan

| # | Item | Effort | Impact |
|---|---|---|---|
| 1 | Restore typecheck/lint/build (WIP tests + scratch scripts) | S | Critical (blocked CI) |
| 2 | Column allowlist (`pickEditable`/`normalizeContentPatch`) | S | Security |
| 3 | Rate-limit + verification + dedupe on `/api/apply` | M | Security/spam |
| 4 | Errors → stable codes; Origin-check helper; gate OAuth callback | S | Security |
| 5 | Delete/deprecate `/related`, dedupe metadata, ISR videos list | S–M | Quota/perf |
| 6 | Home `loading.tsx`; clamp article pagination; fix `#lab`+`href="#"` | S | UX |
| 7 | Fullscreen + keyboard shortcuts + focus ring + live region on player | M | A11y/UX |
| 8 | Comment moderation + newest-first pagination | M | Community |
| 9 | Surface member `bio`/`experience`/`location`; alumni grid | S | Lab credibility |
| 10 | Update AGENTS.md/README to reality | S | Docs |

Legend: S ≤ 1 day, M ≤ 3 days.

---

## 14. Key Source References
- `client/app/api/admin/guard.ts`, `client/app/api/admin/[collection]/route.ts`, `client/app/api/admin/[collection]/[id]/route.ts`
- `client/app/api/apply/route.ts`, `client/lib/rate-limit.ts`, `client/lib/collections.ts`
- `client/lib/youtube.ts`, `client/lib/youtube-oauth.ts`, `client/lib/youtube-manage.ts`
- `client/components/watch/*`, `client/app/videos/[[...videoId]]/page.tsx`
- `client/components/cms/*`, `client/components/header.tsx`, `client/app/page.tsx`
- `client/db/schema.ts`, `client/package.json`, `client/eslint.config.mjs`
- Tests in review: `client/tests/lib/*.test.ts`, `client/vitest.config.ts`