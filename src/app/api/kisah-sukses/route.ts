import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const apiUrl = `http://${currentHost}:8000/api/kisah-sukses${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        // Return the data array from paginated response
        const data = json.data?.data || json.data || [];
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error("GET /api/kisah-sukses error:", error);
        return NextResponse.json(
            { message: "Failed to fetch kisah sukses data", error: (error as Error).message },
            { status: 500 }
        );
    }
}
