# Contributing to DmdLab

Thanks for your interest in improving DmdLab, the digital platform for the
Deepminds Research Lab. This is a small, actively developed project — the
guidelines below are intentionally lightweight.

## Getting set up

Follow the [Installation](./README.md#installation-local-dev) and
[Environment variables](./README.md#environment-variables) sections of the
README to get `client/` and `server/` running locally before making changes.

## Workflow

1. **Open an issue first** for anything beyond a small fix, so the change
   can be discussed before you invest time in it.
2. **Branch from `master`** using a short, descriptive name, e.g.
   `fix/article-search-debounce` or `feat/video-related-links`.
3. **Keep pull requests focused.** Prefer several small PRs over one large
   one — it's easier to review and easier to revert if needed.
4. **Write a clear PR description**: what changed, why, and how you tested
   it (screenshots are encouraged for UI changes).

## Code conventions

- **Frontend (`client/`)** — React + Vite + TailwindCSS. Reuse the existing
  design tokens in `client/src/index.css` rather than introducing new
  colors, radii, or shadows. Run `npm run lint` before opening a PR.
- **Backend (`server/`)** — Node.js + Express + Mongoose. Follow the
  existing controller/route/model structure; run `npm run lint` here too.
- Match the formatting and naming conventions already used in the file
  you're editing.

## Commit messages

Use short, imperative commit messages (e.g. `Fix video card hover state`,
not `fixed stuff`). Squash noisy work-in-progress commits before opening a
PR where practical.

## Reporting bugs / requesting features

Open a GitHub issue with:
- A clear title and description
- Steps to reproduce (for bugs), or the use case (for features)
- Screenshots or console output where relevant

## Questions

If anything in this document or the README is unclear, open an issue —
improving these docs is a welcome contribution too.
