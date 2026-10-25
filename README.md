# Puffer Tracker

![CI](https://github.com/hellpuffyt/puffer-tracker/actions/workflows/ci.yml/badge.svg)

[Case study ↗](https://hellpuff.dev/work/puffer)

<img src="docs/assets/overview.svg" width="100%" alt="Architecture diagram: browser pages embed TradingView widgets that load data from TradingView directly; the header search calls the searchStocks server action, which queries Finnhub; /api/inngest runs the sign-up e-mail and daily news summary jobs using MongoDB, Finnhub news, Gemini and Gmail; sign-in pages are not in the repository.">

A Next.js stock-market dashboard: market overview, heatmap, top stories and quotes (TradingView widgets), stock search
backed by the [Finnhub](https://finnhub.io) API, and per-symbol pages with charts, technical analysis, company profile
and financials. Optional background jobs (Inngest + Gemini + Gmail) e-mail a welcome message and a daily news summary.

**Status:** experimental 0.1.0 — not production-ready. It is based on the JavaScript Mastery "Signalist" tutorial app.

## Features
**Implemented**
- Dashboard at `/` with TradingView market widgets (prices and charts come from TradingView, rendered client-side).
- Stock search (⌘K / Ctrl-K) via Finnhub `/search`; popular-symbol list via Finnhub `/stock/profile2`.
- Stock detail page `/stocks/<SYMBOL>` with TradingView symbol-info, candlestick and baseline charts,
  technical-analysis, company-profile and financials widgets, plus the (non-persistent) watchlist button.
- Inngest functions served at `/api/inngest`: welcome e-mail on `app/user.created`, daily news summary
  (cron `0 12 * * *` UTC, or the `app/send.daily.news` event) per user watchlist, summarised by Gemini and sent via Gmail. Code present; **not verified** (needs MongoDB, Inngest, Gemini and Gmail credentials).

**Not implemented in this repository**
- Sign-in / sign-up / sessions: the auth pages and the Better Auth route handler are not in the repo (only the helper
  `lib/better-auth/auth.ts` and `lib/actions/auth.actions.ts`). No page passes a user to the header, so the user
  menu (`UserDropdown`) is never shown.
- Watchlist persistence: the "Add to Watchlist" button only toggles local UI state; nothing is saved.
- Alerts.

<img src="docs/assets/stock-detail.webp" width="100%" alt="Puffer Tracker /stocks/AAPL page with symbol info, a candlestick chart, a technical-analysis gauge and financials, all rendered by TradingView widgets">

*Real screenshot of `/stocks/AAPL` from a production build with no API keys. Everything below the header except the
yellow watchlist button is an embedded third-party TradingView widget; the prices, charts, ratings and financials
come from TradingView, not from this app.*

## Quick start
Requires Node.js 22+ (verified locally with Node 24 / npm 11; CI runs 22 and 24).
```bash
git clone https://github.com/hellpuffyt/puffer-tracker.git && cd puffer-tracker
npm ci
cp .env.example .env.local   # then set FINNHUB_API_KEY
npm run dev
```
Open http://localhost:3000. Without `FINNHUB_API_KEY` the app still runs; the TradingView widgets work, the search
list is empty and the server logs `Error in stock search: Error: FINNHUB API key is not configured`.
For a production server instead: `npm run build && npm start`.

## Configuration
See [.env.example](.env.example). `FINNHUB_API_KEY` is the only variable the pages need; the rest are for the
e-mail jobs and the auth helpers. The dashboard is prerendered at build time, so set `FINNHUB_API_KEY` before
`npm run build` if you want the popular-stock list in a production build.

`/api/inngest` answers `401 {"message":"Unauthorized"}` unless `INNGEST_SIGNING_KEY` is set (production) or
`INNGEST_DEV=1` is set (local, with the [Inngest dev server](https://www.inngest.com/docs/local-development)); with
`INNGEST_DEV=1` it returns the Inngest introspection JSON listing the 2 functions.

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
npm run test:db   # optional: connects to MONGODB_URI from .env and reports OK/ERROR
```
`npm run lint` currently reports 0 errors and 6 warnings. CI (`.github/workflows/ci.yml`) runs lint, typecheck, test
and build on Node 22 and 24 with no secrets.
See [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) for what has been verified.

## Limitations
- No authentication, no persisted watchlist, no alerts (see above).
- The e-mail jobs, live Finnhub calls, Gemini and Gmail have not been run end to end (they need credentials).
- On screens narrower than 640 px the header navigation, including Search, is hidden (`hidden sm:block`) and no mobile
  menu replaces it, so search is not reachable on phones.
- AI-generated summaries are inserted into the e-mail HTML without escaping; see
  [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md).

## Security
Report vulnerabilities via [GitHub private advisories](https://github.com/hellpuffyt/puffer-tracker/security/advisories/new);
see [SECURITY.md](SECURITY.md). Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md).
Never commit `.env*` files (they are git-ignored, except `.env.example`).

## License
This repository does not currently include a license file.
