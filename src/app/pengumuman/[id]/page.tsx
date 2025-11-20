"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiAlertCircle, FiTag } from 'react-icons/fi';

interface Pengumuman {
    id: number;
    judul: string;
    isi: string;
    kategori: string;
    tanggal_mulai: string;
    tanggal_selesai?: string;
    prioritas?: string;
    file_lampiran?: string;
    created_at?: string;
}

export default function PengumumanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [pengumuman, setPengumuman] = useState<Pengumuman | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pengumumanId = params.id as string;

    useEffect(() => {
        const fetchPengumuman = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/pengumuman/${pengumumanId}`);
                if (!response.ok) throw new Error("Failed to fetch pengumuman");
                
                const json = await response.json();
                setPengumuman(json.success ? json.data : json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (pengumumanId) {
            fetchPengumuman();
        }
    }, [pengumumanId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error || !pengumuman) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "Pengumuman tidak ditemukan"}</p>
                    <button
                        onClick={() => router.push('/pengumuman')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Kembali ke Pengumuman
                    </button>
                </div>
            </div>
        );
    }

    const getPriorityColor = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case 'tinggi': return 'bg-red-100 text-red-700 border-red-300';
            case 'sedang': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default: return 'bg-blue-100 text-blue-700 border-blue-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-800 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={() => router.push('/pengumuman')}
                        className="flex items-center text-yellow-100 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Pengumuman
                    </button>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                            <FiTag className="w-4 h-4" />
                            {pengumuman.kategori}
                        </span>
                        {pengumuman.prioritas && (
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(pengumuman.prioritas)} bg-white/90`}>
                                <FiAlertCircle className="inline w-4 h-4 mr-1" />
                                {pengumuman.prioritas}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        {pengumuman.judul}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-yellow-100">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-5 h-5" />
                            <span>
                                {new Date(pengumuman.tanggal_mulai).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        {pengumuman.tanggal_selesai && (
                            <div className="flex items-center gap-2">
                                <span>s/d</span>
                                <span>
                                    {new Date(pengumuman.tanggal_selesai).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <article className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                            {pengumuman.isi}
                        </div>
                    </article>

                    {pengumuman.file_lampiran && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FiAlertCircle className="text-yellow-600" />
                                File Lampiran
                            </h3>
                            <a
                                href={pengumuman.file_lampiran}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                            >
                                Download Lampiran
                            </a>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/pengumuman')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Lihat Pengumuman Lainnya
                    </button>
                </div>
            </div>
        </div>
    );
}
