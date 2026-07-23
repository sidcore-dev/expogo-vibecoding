# Fix-It First

Describe what's broken around the house and get the 3 most likely causes, a difficulty rating (5-Minute DIY / Weekend Project / Call a Pro), safety red flags, ballpark DIY vs. pro cost, and Amazon links for the parts you'd need.

Built with [TanStack Start](https://tanstack.com/start), React, Tailwind CSS, and SQLite (via `better-sqlite3`).

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For a production-style run:

```bash
npm run build
npm run start
```

## How diagnosis works

`src/lib/diagnose.functions.ts` matches the problem description against a set of household-repair profiles (plumbing, electrical, appliances, HVAC, drywall, etc.) and returns a structured diagnosis. It's rule-based today — swap the body of `diagnoseProblem` for a call to your preferred LLM API (with your own key) to make it fully model-driven.

## Admin panel

`/admin` lets you edit everything the app shows — site copy and meta tags, the frequent-questions list, Bob's greeting/fallback/FAQ, and the full diagnosis content (profiles, causes, costs, steps) — without touching code. Edits are stored in a SQLite database at `data/app.db` (gitignored) and take effect for every visitor immediately.

**This page has no authentication yet.** Anyone with the URL can edit site content. Add a login (or at least a shared password behind a middleware check) before sharing the link or deploying publicly.

## Project structure

- `src/routes/index.tsx` — the app UI (problem form + results view)
- `src/routes/admin.tsx` — the admin panel
- `src/components/admin/` — admin panel section editors
- `src/lib/diagnose.functions.ts` — diagnosis engine, types, and server functions
- `src/lib/bob.functions.ts` — Bob's FAQ matching and server functions
- `src/lib/site.functions.ts` — site copy and frequent-questions server functions
- `src/lib/db.server.ts` — SQLite content store (server-only)
- `src/styles.css` — theme tokens (Tailwind v4, light/dark via `prefers-color-scheme`)
