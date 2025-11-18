import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/api/profil-prodi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching profil prodi:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profil prodi data', data: null },
      { status: 500 }
    );
  }
}
