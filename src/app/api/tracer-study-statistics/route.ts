import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tahunSurvey = searchParams.get('tahun_survey') || '2024';
        
        const currentHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost';
        const response = await fetch(`http://${currentHost}:8000/api/tracer-study-statistics?tahun_survey=${tahunSurvey}`);

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const json = await response.json();
        const data = json.data || {};
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error("GET /api/tracer-study-statistics error:", error);
        return NextResponse.json(
            { message: "Failed to fetch tracer study statistics", error: (error as Error).message },
            { status: 500 }
        );
    }
}
