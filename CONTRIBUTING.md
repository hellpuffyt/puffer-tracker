# Contributing

1. Node.js 22+. `npm ci`, then copy `.env.example` to `.env.local` and set `FINNHUB_API_KEY` for local runs.
2. Before a pull request: `npm run lint && npm run typecheck && npm test && npm run build` (CI runs the same).
3. Add a Vitest test in `tests/` for every bug fix. Tests must not call real APIs; mock `fetch`.
4. Never commit secrets, `.env.local`, or personal data (names, e-mails) in code or fixtures.
5. Do not re-enable `ignoreBuildErrors` / `ignoreDuringBuilds` in `next.config.ts`.
