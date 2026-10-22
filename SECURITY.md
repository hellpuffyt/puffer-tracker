# Security Policy

Report vulnerabilities privately via https://github.com/hellpuffyt/puffer-tracker/security/advisories/new
(please do not open a public issue).

## Notes for deployers
- Keep secrets in `.env.local` / your host's secret store; `.env*` files are git-ignored (except `.env.example`).
- Prefer `FINNHUB_API_KEY` over `NEXT_PUBLIC_FINNHUB_API_KEY`; `NEXT_PUBLIC_*` values are inlined into client
  bundles when referenced from client code.
- In production set `INNGEST_SIGNING_KEY` so `/api/inngest` only accepts signed requests from Inngest.
- `MONGODB_URI` is never logged by the app.
- Known dependency advisories that need major upgrades (Next.js 16, Inngest 4) are listed in docs/PRODUCTION_READINESS.md.
