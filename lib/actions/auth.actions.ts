"use server";

import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function signInWithEmail(email: string, password: string) {
    const auth = await getAuth();

    try {
        const res = await auth.api.signInEmail({
            body: { email, password },
            headers: await headers(),
        });

        return { success: true, data: res };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Invalid credentials" };
    }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
    const auth = await getAuth();

    try {
        const res = await auth.api.signUpEmail({
            body: { email, password, name },
            headers: await headers(),
        });

        return { success: true, data: res };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Sign up failed" };
    }
}

export async function signOut() {
    const auth = await getAuth();
    await auth.api.signOut({ headers: await headers() });
}
