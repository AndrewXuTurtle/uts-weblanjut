import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const apiUrl = `http://${currentHost}:8000/api/tracer-study-testimonials${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        const data = json.data?.data || json.data || [];
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error("GET /api/tracer-study-testimonials error:", error);
        return NextResponse.json(
            { message: "Failed to fetch tracer study testimonials", error: (error as Error).message },
            { status: 500 }
        );
    }
}
