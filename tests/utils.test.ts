import { describe, expect, it } from "vitest";
import { formatArticle, getDateRange, validateArticle } from "@/lib/utils";

describe("utils", () => {
    it("getDateRange spans the requested number of days", () => {
        const { from, to } = getDateRange(5);
        const days = (Date.parse(to) - Date.parse(from)) / 86_400_000;
        expect(days).toBe(5);
    });

    it("validateArticle requires headline, summary, url and datetime", () => {
        expect(validateArticle({ headline: "h", summary: "s", url: "u", datetime: 1 } as RawNewsArticle)).toBeTruthy();
        expect(validateArticle({ headline: "h", summary: "s", url: "u" } as RawNewsArticle)).toBeFalsy();
    });

    it("formatArticle tags company news with the symbol and truncates the summary", () => {
        const a = formatArticle({ id: 1, headline: " H ", summary: "x".repeat(500), url: "u", datetime: 2 } as RawNewsArticle, true, "AAPL");
        expect(a.headline).toBe("H");
        expect(a.related).toBe("AAPL");
        expect(a.summary).toHaveLength(203);
    });
});
