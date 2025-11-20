import { NextResponse } from "next/server";

/**
 * GET /api/penelitian-statistics
 * Get research statistics (total, by type, by year, by status)
 */
export async function GET() {
    try {
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const response = await fetch(`http://${currentHost}:8000/api/penelitian-statistics`);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        return NextResponse.json(json);
    } catch (error: unknown) {
        console.error("GET /api/penelitian-statistics error:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Failed to fetch penelitian statistics", 
                error: (error as Error).message 
            },
            { status: 500 }
        );
    }
}
