import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe("searchStocks", () => {
    beforeEach(() => {
        vi.resetModules();
        process.env.FINNHUB_API_KEY = "test-" + "token";
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        delete process.env.FINNHUB_API_KEY;
    });

    it("returns [] without an API key instead of throwing", async () => {
        delete process.env.FINNHUB_API_KEY;
        vi.spyOn(console, "error").mockImplementation(() => {});
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        const { searchStocks } = await import("@/lib/actions/finnhub.actions");
        expect(await searchStocks("AAPL")).toEqual([]);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("does not report the ticker as the exchange for search results", async () => {
        // Regression: exchange was taken from displaySymbol, so the UI showed "AAPL | AAPL".
        vi.stubGlobal("fetch", vi.fn(async () => json({
            count: 1,
            result: [{ symbol: "AAPL", description: "APPLE INC", displaySymbol: "AAPL", type: "Common Stock" }],
        })));
        const { searchStocks } = await import("@/lib/actions/finnhub.actions");
        const [first] = await searchStocks("apple");
        expect(first).toMatchObject({ symbol: "AAPL", name: "APPLE INC", exchange: "US", isInWatchlist: false });
    });

    it("uses the profile exchange for the popular list", async () => {
        const fetchMock = vi.fn(async (url: string) => {
            const sym = new URL(url).searchParams.get("symbol");
            return json({ name: `${sym} Corp`, ticker: sym, exchange: "NASDAQ NMS - GLOBAL MARKET" });
        });
        vi.stubGlobal("fetch", fetchMock);
        const { searchStocks } = await import("@/lib/actions/finnhub.actions");
        const list = await searchStocks();
        expect(list).toHaveLength(10);
        expect(list[0].exchange).toBe("NASDAQ NMS - GLOBAL MARKET");
        expect(String(fetchMock.mock.calls[0][0])).toContain("/stock/profile2?symbol=");
    });
});

describe("getNews", () => {
    beforeEach(() => {
        vi.resetModules();
        process.env.FINNHUB_API_KEY = "test-" + "token";
    });
    afterEach(() => vi.unstubAllGlobals());

    const article = (id: number, sym: string) => ({
        id, headline: `${sym} news ${id}`, summary: "s", url: `https://example.com/${sym}/${id}`,
        datetime: 1_700_000_000 + id, source: "src", related: sym,
    });

    it("round-robins company news across symbols and caps at 6", async () => {
        vi.stubGlobal("fetch", vi.fn(async (url: string) => {
            const sym = new URL(url).searchParams.get("symbol")!;
            return json([1, 2, 3, 4, 5].map((i) => article(i, sym)));
        }));
        const { getNews } = await import("@/lib/actions/finnhub.actions");
        const news = await getNews(["aapl", "msft"]);
        expect(news).toHaveLength(6);
        expect(news.filter((n) => n.related === "AAPL")).toHaveLength(3);
        expect(news.filter((n) => n.related === "MSFT")).toHaveLength(3);
    });

    it("falls back to general news when no symbols are given", async () => {
        const fetchMock = vi.fn(async (_url: string) => json([article(1, ""), article(2, "")]));
        vi.stubGlobal("fetch", fetchMock);
        const { getNews } = await import("@/lib/actions/finnhub.actions");
        const news = await getNews();
        expect(news).toHaveLength(2);
        expect(String(fetchMock.mock.calls[0][0])).toContain("/news?category=general");
    });
});
