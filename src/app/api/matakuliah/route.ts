import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');
    const jenis = searchParams.get('jenis');
    
    let url = 'http://localhost:8000/api/matakuliah';
    const params = new URLSearchParams();
    if (semester) params.append('semester', semester);
    if (jenis) params.append('jenis', jenis);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
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
    console.error('Error fetching matakuliah:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch matakuliah data', data: {} },
      { status: 500 }
    );
  }
}
