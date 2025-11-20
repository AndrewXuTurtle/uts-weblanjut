"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiUsers, FiCalendar, FiDollarSign, FiBookOpen, FiUser } from 'react-icons/fi';

interface Dosen {
    nidn: string;
    nama: string;
}

interface Penelitian {
    id: number;
    judul_penelitian: string;
    abstrak?: string;
    jenis_penelitian: string;
    ketua_peneliti_nidn: string;
    ketuaPeneliti?: Dosen;
    tahun_mulai: string;
    tahun_selesai?: string;
    dana?: number;
    status: string;
    publikasi?: string;
    created_at: string;
}

export default function PenelitianDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [penelitian, setPenelitian] = useState<Penelitian | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const penelitianId = params.id as string;

    useEffect(() => {
        const fetchPenelitian = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/penelitian/${penelitianId}`);
                if (!response.ok) throw new Error("Failed to fetch penelitian");
                
                const json = await response.json();
                setPenelitian(json.success ? json.data : json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (penelitianId) {
            fetchPenelitian();
        }
    }, [penelitianId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error || !penelitian) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "Penelitian tidak ditemukan"}</p>
                    <button
                        onClick={() => router.push('/penelitian')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Kembali ke Penelitian
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <button
                        onClick={() => router.push('/penelitian')}
                        className="flex items-center text-green-100 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Penelitian
                    </button>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                            {penelitian.jenis_penelitian}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            penelitian.status === 'Selesai' ? 'bg-green-400/30' :
                            penelitian.status === 'Sedang Berjalan' ? 'bg-yellow-400/30' :
                            'bg-gray-400/30'
                        }`}>
                            {penelitian.status}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        {penelitian.judul_penelitian}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-green-100">
                        <div className="flex items-center gap-2">
                            <FiUser className="w-5 h-5" />
                            <span>{penelitian.ketuaPeneliti?.nama || 'Tidak tersedia'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-5 h-5" />
                            <span>{penelitian.tahun_mulai} - {penelitian.tahun_selesai || 'Ongoing'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {penelitian.abstrak && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Abstrak</h2>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {penelitian.abstrak}
                                    </p>
                                </div>
                            </div>
                        )}

                        {penelitian.publikasi && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiBookOpen className="text-green-600" />
                                    Publikasi
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {penelitian.publikasi}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Research Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Penelitian</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Ketua Peneliti</p>
                                    <p className="text-gray-900 font-semibold">
                                        {penelitian.ketuaPeneliti?.nama || 'Tidak tersedia'}
                                    </p>
                                    <p className="text-sm text-gray-500">NIDN: {penelitian.ketua_peneliti_nidn}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Jenis Penelitian</p>
                                    <p className="text-gray-900 font-semibold">{penelitian.jenis_penelitian}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Periode</p>
                                    <p className="text-gray-900 font-semibold">
                                        {penelitian.tahun_mulai} - {penelitian.tahun_selesai || 'Ongoing'}
                                    </p>
                                </div>

                                {penelitian.dana && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Dana Penelitian</p>
                                        <div className="flex items-center gap-2 text-green-600">
                                            <FiDollarSign className="w-5 h-5" />
                                            <p className="font-bold text-lg">
                                                Rp {penelitian.dana.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                        penelitian.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                        penelitian.status === 'Sedang Berjalan' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {penelitian.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/penelitian')}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center gap-2"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Lihat Penelitian Lainnya
                    </button>
                </div>
            </div>
        </div>
    );
}
