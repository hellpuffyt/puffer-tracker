import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

describe("source guards", () => {
    it("has no hard-coded fallback user (personal data) in the user menu", () => {
        // Regression: a real name and e-mail address were shown when no user was signed in.
        const src = read("components/UserDropdown.tsx");
        expect(src).not.toMatch(/@gmail\.com/);
        expect(src).not.toMatch(/\|\|\s*\{\s*name:/);
    });

    it("does not send mail from a third-party domain", () => {
        expect(read("lib/nodemailer/index.ts")).not.toMatch(/@jsmastery\.pro/);
    });

    it("does not hide type or lint errors during next build", () => {
        const cfg = read("next.config.ts");
        expect(cfg).not.toMatch(/ignoreBuildErrors/);
        expect(cfg).not.toMatch(/ignoreDuringBuilds/);
    });

    it("home page does not redirect to the missing /sign-in route", () => {
        // Regression: "/" required a session and redirected to /sign-in, which does not exist (404),
        // and it needed MongoDB at build time, so `next build` failed without MONGODB_URI.
        expect(read("app/(root)/page.tsx")).not.toMatch(/sign-in|getAuth/);
    });
});
