"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiUser, FiCalendar, FiEye, FiAward, FiShare2 } from 'react-icons/fi';

interface Berita {
  id: number;
  judul: string;
  isi: string;
  gambar?: string;
  gambar_url?: string;
  penulis: string;
  tanggal: string;
  is_prestasi: boolean;
  views?: number;
  kategori?: string;
}

export default function BeritaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [berita, setBerita] = useState<Berita | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const beritaId = params.id as string;

    useEffect(() => {
        const fetchBerita = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/berita/${beritaId}`);
                if (!response.ok) throw new Error("Failed to fetch berita");
                
                const json = await response.json();
                setBerita(json.success ? json.data : json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (beritaId) {
            fetchBerita();
        }
    }, [beritaId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error || !berita) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "Berita tidak ditemukan"}</p>
                    <button
                        onClick={() => router.push('/berita')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Kembali ke Berita
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={() => router.push('/berita')}
                        className="flex items-center text-purple-100 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Berita
                    </button>

                    {berita.is_prestasi && (
                        <div className="flex items-center gap-2 mb-4">
                            <FiAward className="text-yellow-300 w-6 h-6" />
                            <span className="bg-yellow-400/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                Prestasi
                            </span>
                        </div>
                    )}

                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        {berita.judul}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-purple-100">
                        <div className="flex items-center gap-2">
                            <FiUser className="w-5 h-5" />
                            <span>{berita.penulis}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-5 h-5" />
                            <span>{new Date(berita.tanggal).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        {berita.views && (
                            <div className="flex items-center gap-2">
                                <FiEye className="w-5 h-5" />
                                <span>{berita.views} views</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Featured Image */}
                {(berita.gambar_url || berita.gambar) && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <img
                            src={berita.gambar_url || berita.gambar}
                            alt={berita.judul}
                            className="w-full h-96 object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <article className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {berita.isi}
                        </div>
                    </article>

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FiShare2 className="w-5 h-5" />
                                <span className="font-semibold">Bagikan Berita Ini</span>
                            </div>
                            {berita.kategori && (
                                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                                    {berita.kategori}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/berita')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center gap-2"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Lihat Berita Lainnya
                    </button>
                </div>
            </div>
        </div>
    );
}
