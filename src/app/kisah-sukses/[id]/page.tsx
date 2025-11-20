"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiAward, FiCalendar, FiUser, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

interface Mahasiswa {
    nama: string;
    nim?: string;
    program_studi?: string;
    foto_url?: string;
}

interface KisahSukses {
    id: number;
    judul: string;
    kisah: string;
    pencapaian: string;
    tahun_pencapaian: string;
    mahasiswa?: Mahasiswa;
    foto_url?: string;
    created_at?: string;
}

export default function KisahSuksesDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [kisah, setKisah] = useState<KisahSukses | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const kisahId = params.id as string;

    useEffect(() => {
        const fetchKisah = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/kisah-sukses/${kisahId}`);
                if (!response.ok) throw new Error("Failed to fetch kisah sukses");
                
                const json = await response.json();
                setKisah(json.success ? json.data : json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (kisahId) {
            fetchKisah();
        }
    }, [kisahId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error || !kisah) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "Kisah sukses tidak ditemukan"}</p>
                    <button
                        onClick={() => router.push('/kisah-sukses')}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Kembali ke Kisah Sukses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={() => router.push('/kisah-sukses')}
                        className="flex items-center text-amber-100 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Kisah Sukses
                    </button>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                            <FiAward className="w-4 h-4" />
                            {kisah.tahun_pencapaian}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                        {kisah.judul}
                    </h1>

                    <div className="bg-amber-700/30 backdrop-blur-sm rounded-xl p-4 inline-block">
                        <p className="text-lg md:text-xl font-semibold flex items-center gap-2">
                            <FiTrendingUp className="w-6 h-6" />
                            {kisah.pencapaian}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Featured Image */}
                        {(kisah.foto_url || kisah.mahasiswa?.foto_url) && (
                            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="relative w-full h-[400px] bg-gradient-to-br from-amber-100 to-yellow-100">
                                    <Image
                                        src={(kisah.foto_url || kisah.mahasiswa?.foto_url) as string}
                                        alt={kisah.judul}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kisah Inspiratif</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                    {kisah.kisah}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Mahasiswa Info */}
                        {kisah.mahasiswa && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiUser className="text-amber-600" />
                                    Profil Mahasiswa
                                </h3>
                                
                                {kisah.mahasiswa.foto_url && (
                                    <div className="mb-4 rounded-xl overflow-hidden">
                                        <div className="relative w-full h-48 bg-gradient-to-br from-amber-100 to-yellow-100">
                                            <Image
                                                src={kisah.mahasiswa.foto_url}
                                                alt={kisah.mahasiswa.nama}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Nama</p>
                                        <p className="text-gray-900 font-semibold text-lg">{kisah.mahasiswa.nama}</p>
                                    </div>

                                    {kisah.mahasiswa.nim && (
                                        <div>
                                            <p className="text-sm text-gray-500">NIM</p>
                                            <p className="text-gray-900 font-semibold">{kisah.mahasiswa.nim}</p>
                                        </div>
                                    )}

                                    {kisah.mahasiswa.program_studi && (
                                        <div>
                                            <p className="text-sm text-gray-500">Program Studi</p>
                                            <p className="text-gray-900 font-semibold">{kisah.mahasiswa.program_studi}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Achievement Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Pencapaian</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-amber-100 rounded-lg p-2">
                                        <FiAward className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Prestasi</p>
                                        <p className="text-gray-900 font-semibold">{kisah.pencapaian}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-yellow-100 rounded-lg p-2">
                                        <FiCalendar className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Tahun Pencapaian</p>
                                        <p className="text-yellow-600 font-bold text-2xl">{kisah.tahun_pencapaian}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inspirational Quote */}
                        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
                            <div className="text-center">
                                <FiTrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
                                <p className="text-lg font-semibold italic">
                                    &ldquo;Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/kisah-sukses')}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Baca Kisah Sukses Lainnya
                    </button>
                </div>
            </div>
        </div>
    );
}
