import { NextResponse } from "next/server";

export async function GET() {
    try {
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const response = await fetch(`http://${currentHost}:8000/api/kisah-sukses-featured`);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        const data = json.data || [];
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error("GET /api/kisah-sukses-featured error:", error);
        return NextResponse.json(
            { message: "Failed to fetch featured kisah sukses", error: (error as Error).message },
            { status: 500 }
        );
    }
}
