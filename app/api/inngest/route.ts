import {serve} from "inngest/next";
import {inngest} from "@/lib/inngest/client";
import {sendDailyNewsSummary, sendSignUpEmail} from "@/lib/inngest/functions";

const handlers = serve({
    client: inngest,
    functions: [sendSignUpEmail, sendDailyNewsSummary],
})

// Inngest 4 defaults to cloud mode and throws (HTTP 500) on every request when no signing key is set.
// Keep the documented no-credentials behaviour of Inngest 3: refuse with 401 instead of erroring.
const isDev = () => {
    const v = process.env.INNGEST_DEV;
    return Boolean(v) && v !== "0" && v !== "false";
}
const canServe = () => Boolean(process.env.INNGEST_SIGNING_KEY) || isDev();
const unauthorized = () => Response.json({ message: "Unauthorized" }, { status: 401 });

type Handler = typeof handlers.GET;
const guard = (handler: Handler): Handler =>
    (...args) => canServe() ? handler(...args) : Promise.resolve(unauthorized());

export const GET = guard(handlers.GET);
export const POST = guard(handlers.POST);
export const PUT = guard(handlers.PUT);
