import { NextResponse } from "next/server";

/**
 * GET /api/kurikulum
 * Proxy to Laravel API - List mata kuliah with pagination and filters
 * 
 * Query Parameters:
 * - semester (int): Filter by semester 1-8
 * - search (string): Search in kode_matkul or nama_matkul
 * - sort_by (string): Column to sort by (default: semester)
 * - sort_order (string): asc/desc (default: asc)
 * - per_page (int): Items per page (default: 50)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const apiUrl = `http://${currentHost}:8000/api/kurikulum${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        return NextResponse.json(json);
    } catch (error: unknown) {
        console.error("GET /api/kurikulum error:", error);
        return NextResponse.json(
            { 
                success: false,
                message: "Failed to fetch kurikulum data", 
                error: (error as Error).message 
            },
            { status: 500 }
        );
    }
}
