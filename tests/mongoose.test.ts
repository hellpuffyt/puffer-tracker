import { describe, expect, it, vi } from "vitest";

vi.mock("mongoose", () => ({ default: { connect: vi.fn(async () => ({ connection: {} })) } }));

describe("connectToDatabase", () => {
    it("never logs the connection string (it contains the DB password)", async () => {
        // Regression: the URI, including credentials, was printed on every cold start.
        const secret = "pa" + "ss-w0rd";
        process.env.MONGODB_URI = `mongodb+srv://user:${secret}@cluster.example.net/db`;
        const log = vi.spyOn(console, "log").mockImplementation(() => {});
        const { connectToDatabase } = await import("@/database/mongoose");
        await connectToDatabase();
        const printed = log.mock.calls.flat().join(" ");
        expect(printed).not.toContain(secret);
        expect(printed).not.toContain("mongodb+srv://");
    });
});
