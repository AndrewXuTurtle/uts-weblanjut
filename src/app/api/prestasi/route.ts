import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori');
    const tingkat = searchParams.get('tingkat');
    const tahun = searchParams.get('tahun');
    
    let url = 'http://localhost:8000/api/prestasi';
    const params = new URLSearchParams();
    if (kategori) params.append('kategori', kategori);
    if (tingkat) params.append('tingkat', tingkat);
    if (tahun) params.append('tahun', tahun);
    
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
    console.error('Error fetching prestasi:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch prestasi data', data: [] },
      { status: 500 }
    );
  }
}
