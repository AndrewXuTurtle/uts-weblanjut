import { NextResponse } from "next/server";

/**
 * GET /api/alumni
 * Proxy to Laravel API - List alumni with pagination and filters
 * 
 * Query Parameters:
 * - tahun_lulus (int): Filter by graduation year
 * - prodi (string): Filter by study program
 * - search (string): Search by name, email, or NIM
 * - per_page (int): Items per page (default: 15)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const apiUrl = `http://${currentHost}:8000/api/alumni${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        return NextResponse.json(json);
    } catch (error: unknown) {
        console.error("GET /api/alumni error:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Failed to fetch alumni data", 
                error: (error as Error).message 
            },
            { status: 500 }
        );
    }
}
