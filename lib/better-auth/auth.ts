import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createAuth(db: any) {
    return betterAuth({
        // mongoose bundles its own copy of the mongodb driver types, so its Db is not
        // assignable to better-auth's Db type even though it is the same runtime object.
        database: mongodbAdapter(db),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });
}

let authInstance: ReturnType<typeof createAuth> | null = null;

export async function getAuth() {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("MongoDB connection not found");

    authInstance = createAuth(db);

    return authInstance;
}
