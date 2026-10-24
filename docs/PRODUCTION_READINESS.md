# Production readiness — puffer-tracker

Audit date: 2026-10-22.

## Scope
Next.js 15 (App Router) stock dashboard: TradingView widgets on `/` and `/stocks/[symbol]`, Finnhub-backed search,
Inngest jobs (welcome + daily news e-mails via Gemini and Gmail). Based on the JavaScript Mastery "Signalist"
tutorial (upstream repo has no license). Sign-in/sign-up pages and the Better Auth route handler were removed from the
repo in an earlier commit (d2c773a); only auth helpers remain. Watchlist persistence does not exist (UI toggle only).

## Platforms / prerequisites
Node.js 22+ (verified with Node 24.19 / npm 11 on macOS arm64). Runtime: Finnhub key for search; MongoDB, Inngest,
Gemini and Gmail credentials for the e-mail jobs (none available during the audit).

## Clean-clone commands
```
git clone https://github.com/hellpuffyt/puffer-tracker.git && cd puffer-tracker
npm ci
cp .env.example .env.local
npm run dev            # or: npm run build && npm start
npm run lint && npm run typecheck && npm test
```

## Commands executed and outcomes
| Command | Exit | Result |
|---|---|---|
| baseline `npm ci` | 0 | ok |
| baseline `npx tsc --noEmit` | 2 | 7 errors (missing `user` prop, duplicate style key, undefined `UserForNewsEmail`, …) |
| baseline `npm run lint` | 1 | 6 errors, 6 warnings |
| baseline `npm run build` (no env) | 1 | prerender of `/` failed: `MONGODB_URI must be set`; type/lint checks were skipped by config |
| baseline tests | — | none existed |
| `npx tsc --noEmit` (after) | 0 | 0 errors |
| `npm run lint` (after) | 0 | 0 errors, 6 warnings (hook deps, unused vars, `<img>`) |
| `npm test` (after) | 0 | 13 passed, 0 failed, 0 skipped (4 files) |
| same tests against original sources | 1 | 7 failed, 6 passed |
| `npm run build` without any env (after) | 0 | ok |
| `next start` smoke: `/`, `/stocks/AAPL`, `/api/inngest` | — | 200, 200, 200 (no Finnhub key: search list empty) |
| `npm audit` before | 1 | many, incl. critical better-auth, next, protobufjs, fast-xml-parser |
| `npm audit` after (`--omit=dev`) | 1 | 54 (47 moderate, 7 high), no critical: OpenTelemetry chain via inngest 3 (fix: inngest 4, major), postcss via next 15 (fix: next 16, major), uuid moderate |

## Tests
Vitest (`tests/`): Finnhub search/news with mocked `fetch` (no network), MongoDB connection logging with mocked
mongoose, pure utils, and source guards (no hard-coded personal data, no third-party sender domain, no build-error
suppression, home page not tied to the missing auth routes). UI rendering and TradingView widgets are only covered by
the build + HTTP smoke test (widgets load client-side from TradingView and were not exercised in a browser).

## CI
`.github/workflows/ci.yml`: Node 22/24, `npm ci`, lint, typecheck, test, build — no secrets. Actions pinned to SHAs
resolved via the GitHub API (checkout v7.0.1, setup-node v7.1.0). Default branch: no workflow (never run); audit
branch: pending until pushed.

## Bugs fixed (regression tests)
1. Build failure / 404 redirect loop on `/` — `source-guards.test.ts` "home page does not redirect…", build in CI.
2. 7 TypeScript + 6 ESLint errors hidden by `next.config.ts` — "does not hide type or lint errors…", typecheck/lint in CI.
3. Exchange column showed the ticker — `finnhub.test.ts`.
4. MongoDB URI (with password) logged — `mongoose.test.ts`.
5. Hard-coded real name/e-mail fallback user — `source-guards.test.ts`.
6. Third-party `From:` domain — `source-guards.test.ts`.
7. Stub `/api` route logging passwords and faking success — removed.
8. Vulnerable dependencies (critical better-auth) — updated; better-auth 1.7 typing change handled in `lib/better-auth/auth.ts`.

## Security findings
- No secrets in tree or history (regex scan incl. Mongo URIs with credentials, Google/GitHub/AWS keys).
- **Personal data in history (low):** a real-looking personal Gmail address and name in `components/UserDropdown.tsx`
  in commits 9bde3c2, d2c773a, 6994537 (removed on this branch; history not rewritten).
- `/api/inngest` is public by design; requires `INNGEST_SIGNING_KEY` in production (documented).
- AI-generated text is inserted into e-mail HTML templates without escaping (`lib/nodemailer`): a prompt-injected
  news item could inject markup into e-mails. Not fixed (needs an HTML-escaping policy for the summaries); documented here.
- Remaining dependency advisories need major upgrades (Next 16, Inngest 4) that could not be verified here.

## Limitations / unverified
- Auth flow absent; watchlist not persisted; alerts not implemented.
- Inngest jobs, Gemini and Gmail sending not run (no credentials). Finnhub not called live (no key).
- No license file (owner decision); upstream tutorial is unlicensed.

## Acceptance checklist
| # | Item | Expected | Command/test | Result | Actual | Reference |
|---|---|---|---|---|---|---|
| 1 | Install | `npm ci` ok | clean clone | pass | exit 0 | package-lock.json |
| 2 | Type-safe build | tsc/lint 0 errors | `npm run typecheck`, `npm run lint` | pass | 0 errors | CI |
| 3 | Builds without secrets | ok | `npm run build` | pass | exit 0 | next.config.ts |
| 4 | Pages serve | 200 | `next start` + curl | pass | 200/200/200 | app/ |
| 5 | Search maps Finnhub data correctly | name/symbol/exchange | finnhub.test.ts | pass | — | lib/actions/finnhub.actions.ts |
| 6 | News selection | round-robin, max 6, fallback | finnhub.test.ts | pass | — | getNews |
| 7 | No secret/personal-data leaks in code | none | mongoose.test.ts, source-guards | pass | — | — |
| 8 | Live Finnhub / e-mail jobs | data / e-mails | needs credentials | not run | — | — |
| 9 | Auth | sign-in works | — | not implemented | — | README |

## Classification proposal
**Partially Verified** — dashboard, search and stock pages build and serve; tests cover data mapping and leaks;
auth/watchlist are not implemented and the e-mail jobs and live Finnhub calls were not exercised.

## Tested commit
Branch `audit/production-readiness`, commit adding this file (code at 03ce27d), 2026-10-22.
