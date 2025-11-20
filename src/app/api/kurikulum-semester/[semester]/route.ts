import { NextResponse } from "next/server";

/**
 * GET /api/kurikulum-semester/[semester]
 * Get mata kuliah for a specific semester
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ semester: string }> }
) {
    try {
        const { semester } = await context.params;
        
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const response = await fetch(`http://${currentHost}:8000/api/kurikulum-semester/${semester}`);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        return NextResponse.json(json);
    } catch (error: unknown) {
        console.error("GET /api/kurikulum-semester/[semester] error:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Failed to fetch kurikulum by semester", 
                error: (error as Error).message 
            },
            { status: 500 }
        );
    }
}
