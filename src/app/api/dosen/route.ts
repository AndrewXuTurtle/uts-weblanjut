import { NextResponse } from 'next/server';

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000/api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        const url = `${LARAVEL_API_URL}/dosen${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Laravel API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error('Error fetching from Laravel API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from Laravel API' },
            { status: 500 }
        );
    }
}