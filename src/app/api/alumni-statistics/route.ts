import { NextResponse } from "next/server";

/**
 * GET /api/alumni-statistics
 * Get alumni statistics (total alumni, breakdown by year, program, etc.)
 */
export async function GET() {
    try {
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const response = await fetch(`http://${currentHost}:8000/api/alumni-statistics`);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        return NextResponse.json(json);
    } catch (error: unknown) {
        console.error("GET /api/alumni-statistics error:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Failed to fetch alumni statistics", 
                error: (error as Error).message 
            },
            { status: 500 }
        );
    }
}
