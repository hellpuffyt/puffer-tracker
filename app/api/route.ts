import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("SIGNUP API RECEIVED:", body);

        // TODO: create user in DB here
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Signup failed" },
            { status: 500 }
        );
    }
}

