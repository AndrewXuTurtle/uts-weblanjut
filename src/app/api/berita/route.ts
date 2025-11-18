import { NextResponse } from "next/server";

export async function GET() {
    try {
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const response = await fetch(`http://${currentHost}:8000/api/berita`);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        // Return only the data array from the paginated response
        const data = json.data?.data || json.data || [];
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error("GET /api/berita error:", error);
        return NextResponse.json(
            { message: "Failed to fetch berita data", error: (error as Error).message },
            { status: 500 }
        );
    }
}