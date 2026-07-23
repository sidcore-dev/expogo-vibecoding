# Fix-It First

Describe what's broken around the house and get the 3 most likely causes, a difficulty rating (5-Minute DIY / Weekend Project / Call a Pro), safety red flags, ballpark DIY vs. pro cost, and Amazon links for the parts you'd need.

Built with [TanStack Start](https://tanstack.com/start), React, and Tailwind CSS.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How diagnosis works

`src/lib/diagnose.functions.ts` matches the problem description against a set of household-repair profiles (plumbing, electrical, appliances, HVAC, drywall, etc.) and returns a structured diagnosis. It's rule-based today — swap the body of `diagnoseProblem` for a call to your preferred LLM API (with your own key) to make it fully AI-driven.

## Project structure

- `src/routes/index.tsx` — the app UI (problem form + results view)
- `src/lib/diagnose.functions.ts` — diagnosis engine and types
- `src/styles.css` — theme tokens (Tailwind v4, light/dark via `prefers-color-scheme`)
