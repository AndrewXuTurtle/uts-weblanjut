import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori');
    
    let url = 'http://localhost:8000/api/peraturan';
    if (kategori) {
      url += `?kategori=${kategori}`;
    }

    const response = await fetch(url, {
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
    console.error('Error fetching peraturan:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch peraturan data', data: {} },
      { status: 500 }
    );
  }
}
