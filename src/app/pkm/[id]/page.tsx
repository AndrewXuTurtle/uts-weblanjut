"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiUsers, FiDollarSign, FiAward, FiUser, FiBookOpen } from 'react-icons/fi';

interface Mahasiswa {
    nama: string;
    nim: string;
    peran?: string;
}

interface Dosen {
    nama: string;
    nidn: string;
}

interface PKM {
    id: number;
    judul_pkm: string;
    deskripsi: string;
    jenis_pkm: string;
    dana?: number;
    status: string;
    tahun?: string;
    dosenPembimbing?: Dosen;
    mahasiswas?: Mahasiswa[];
    created_at?: string;
}

export default function PKMDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [pkm, setPKM] = useState<PKM | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pkmId = params.id as string;

    useEffect(() => {
        const fetchPKM = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/pkm/${pkmId}`);
                if (!response.ok) throw new Error("Failed to fetch PKM");
                
                const json = await response.json();
                setPKM(json.success ? json.data : json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (pkmId) {
            fetchPKM();
        }
    }, [pkmId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error || !pkm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "PKM tidak ditemukan"}</p>
                    <button
                        onClick={() => router.push('/pkm')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Kembali ke PKM
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <button
                        onClick={() => router.push('/pkm')}
                        className="flex items-center text-orange-100 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke PKM
                    </button>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                            {pkm.jenis_pkm}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            pkm.status === 'Selesai' ? 'bg-green-400/30' :
                            pkm.status === 'Sedang Berjalan' ? 'bg-yellow-400/30' :
                            'bg-gray-400/30'
                        }`}>
                            {pkm.status}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                        {pkm.judul_pkm}
                    </h1>

                    {pkm.tahun && (
                        <p className="text-orange-100 text-lg">
                            Tahun {pkm.tahun}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiBookOpen className="text-orange-600" />
                                Deskripsi Program
                            </h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {pkm.deskripsi}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* PKM Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi PKM</h3>
                            
                            <div className="space-y-4">
                                {pkm.dosenPembimbing && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-orange-100 rounded-lg p-2">
                                            <FiUser className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Dosen Pembimbing</p>
                                            <p className="text-gray-900 font-semibold">{pkm.dosenPembimbing.nama}</p>
                                            <p className="text-sm text-gray-500">NIDN: {pkm.dosenPembimbing.nidn}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 rounded-lg p-2">
                                        <FiAward className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Jenis PKM</p>
                                        <p className="text-gray-900 font-semibold">{pkm.jenis_pkm}</p>
                                    </div>
                                </div>

                                {pkm.dana && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-green-100 rounded-lg p-2">
                                            <FiDollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Dana Program</p>
                                            <p className="text-green-600 font-bold text-lg">
                                                Rp {pkm.dana.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Status</p>
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                                        pkm.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                        pkm.status === 'Sedang Berjalan' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {pkm.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        {pkm.mahasiswas && pkm.mahasiswas.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiUsers className="text-orange-600" />
                                    Tim Mahasiswa ({pkm.mahasiswas.length})
                                </h3>
                                <div className="space-y-3">
                                    {pkm.mahasiswas.map((mahasiswa, index) => (
                                        <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-shadow">
                                            <p className="font-semibold text-gray-900">{mahasiswa.nama}</p>
                                            <p className="text-sm text-gray-600">NIM: {mahasiswa.nim}</p>
                                            {mahasiswa.peran && (
                                                <p className="text-sm text-orange-600 font-medium mt-1">
                                                    {mahasiswa.peran}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/pkm')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Lihat PKM Lainnya
                    </button>
                </div>
            </div>
        </div>
    );
}
