import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function StocksPage() {
    const auth = await getAuth();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    return (
        <>
            <div>Stocks Dashboard</div>
            <img src="https://ik.imagekit.io/a6fkjou7d/dashboard-preview.png?updatedAt=1756378548102" alt="Puffer Dashboard Preview" width="100%" style={{width: "520px", width: "100%", height: "auto"}}/>
        </>
    )
}
