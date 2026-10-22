# Puffer Tracker

![CI](https://github.com/hellpuffyt/puffer-tracker/actions/workflows/ci.yml/badge.svg)

A Next.js stock-market dashboard: market overview, heatmap, top stories and quotes (TradingView widgets), stock search
backed by the [Finnhub](https://finnhub.io) API, and per-symbol pages with charts, technical analysis, company profile
and financials. Optional background jobs (Inngest + Gemini + Gmail) e-mail a welcome message and a daily news summary.

**Status:** experimental 0.1.0 — not production-ready. It is based on the JavaScript Mastery "Signalist" tutorial app.

## Features
**Implemented**
- Dashboard at `/` with TradingView market widgets (prices and charts come from TradingView, rendered client-side).
- Stock search (⌘K / Ctrl-K) via Finnhub `/search`; popular-symbol list via Finnhub `/stock/profile2`.
- Stock detail page `/stocks/<SYMBOL>` with TradingView chart, technical-analysis, profile and financials widgets.
- Inngest functions: welcome e-mail on `app/user.created`, daily news summary (cron 12:00 UTC) per user watchlist,
  summarised by Gemini and sent via Gmail. Code present; **not verified** (needs MongoDB, Inngest, Gemini and Gmail credentials).

**Not implemented in this repository**
- Sign-in / sign-up / sessions: the auth pages and the Better Auth route handler are not in the repo (only the helper
  `lib/better-auth/auth.ts` and `lib/actions/auth.actions.ts`). The user menu is hidden when there is no user.
- Watchlist persistence: the "Add to Watchlist" button only toggles local UI state; nothing is saved.
- Alerts.

## Quick start
Requires Node.js 22+ (verified locally with Node 24 / npm 11; CI runs 22 and 24).
```bash
git clone https://github.com/hellpuffyt/puffer-tracker.git && cd puffer-tracker
npm ci
cp .env.example .env.local   # then set FINNHUB_API_KEY
npm run dev
```
Open http://localhost:3000. Without `FINNHUB_API_KEY` the app still runs; the TradingView widgets work, the search
list is empty and the server logs `FINNHUB API key is not configured`.

## Configuration
See [.env.example](.env.example). `FINNHUB_API_KEY` is the only variable the pages need; the rest are for the
e-mail jobs and the auth helpers. The dashboard is prerendered at build time, so set `FINNHUB_API_KEY` before
`npm run build` if you want the popular-stock list in a production build.

## Project structure
```
app/          → routes (App Router): / , /stocks/[symbol], /api/inngest
components/   → UI components (shadcn/ui in components/ui)
lib/          → Finnhub actions, Inngest jobs, mailer, auth helpers, constants
database/     → MongoDB connection and watchlist model
tests/        → Vitest unit tests
```

## Development
```bash
npm run lint
npm run typecheck
npm test          # vitest; no network, Finnhub calls are mocked
npm run build
```
See [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) for what has been verified.

## Security
Report vulnerabilities via [GitHub private advisories](https://github.com/hellpuffyt/puffer-tracker/security/advisories/new).
Never commit `.env*` files (they are git-ignored, except `.env.example`).

## License
This repository does not currently include a license file.
