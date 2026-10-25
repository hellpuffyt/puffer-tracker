import { afterEach, describe, expect, it, vi } from "vitest";

const call = async (method: "GET" | "POST" | "PUT") => {
    vi.resetModules();
    const route = await import("@/app/api/inngest/route");
    const req = new Request("http://localhost:3000/api/inngest", { method });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return route[method](req as any, undefined as any);
};

afterEach(() => vi.unstubAllEnvs());

describe("/api/inngest", () => {
    it("refuses with 401 (not 500) when no signing key is configured", async () => {
        // Regression: inngest 4 defaults to cloud mode and returned 500 for every request without credentials.
        vi.stubEnv("INNGEST_SIGNING_KEY", "");
        vi.stubEnv("INNGEST_DEV", "");
        for (const method of ["GET", "POST", "PUT"] as const) {
            const res = await call(method);
            expect(res.status).toBe(401);
            expect(await res.json()).toEqual({ message: "Unauthorized" });
        }
    });

    it("serves both functions in dev mode", async () => {
        vi.stubEnv("INNGEST_SIGNING_KEY", "");
        vi.stubEnv("INNGEST_DEV", "1");
        const res = await call("GET");
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.mode).toBe("dev");
        expect(body.function_count).toBe(2);
    });

    it("keeps the triggers of both functions after the inngest 4 signature change", async () => {
        const { sendSignUpEmail, sendDailyNewsSummary } = await import("@/lib/inngest/functions");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const triggers = (fn: unknown) => (fn as any).opts.triggers;
        expect(triggers(sendSignUpEmail)).toEqual([{ event: "app/user.created" }]);
        expect(triggers(sendDailyNewsSummary)).toEqual([{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }]);
    });
});
