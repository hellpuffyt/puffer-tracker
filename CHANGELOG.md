# Changelog

All notable changes to this project are documented here (format: Keep a Changelog).

## [Unreleased]
### Fixed
- `next build` failed without `MONGODB_URI`: the home page required a Better Auth session and redirected to `/sign-in`, a route that is not in the repository (404). The home page is now a public dashboard of TradingView market widgets.
- `tsc` reported 7 errors and ESLint 6 errors, hidden by `ignoreBuildErrors` / `ignoreDuringBuilds`; both fixed and the ignores removed.
- Stock search showed the ticker as the exchange (`displaySymbol` used as exchange).
- The user menu fell back to a hard-coded real name and e-mail address when no user was signed in; it is now hidden without a user.
### Security
- The MongoDB connection string (with password) was logged on every connection.
- Removed `app/api/route.ts`, a stub that logged the full sign-up body (including passwords) and always returned success.
- E-mails were sent with a third-party `From:` domain; now `NODEMAILER_EMAIL`.
- Dependency updates: `npm audit fix`, better-auth 1.7.12, nodemailer 10.2.1, sharp 0.35.5, vitest 5 (critical advisories in better-auth resolved).
### Added
- Vitest tests, CI workflow, `.env.example`, `SECURITY.md`, `CONTRIBUTING.md`, `.editorconfig`, `docs/PRODUCTION_READINESS.md`, `test` / `typecheck` scripts.
### Changed
- README rewritten to match what is implemented (auth pages and watchlist persistence are not in this repository).
