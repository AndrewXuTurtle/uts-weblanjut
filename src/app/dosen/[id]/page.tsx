"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiMail, FiBook, FiAward, FiFileText, FiUser } from 'react-icons/fi';
import Image from 'next/image';

interface Pendidikan {
    jenjang: string;
    institusi: string;
    tahun?: string;
}

interface Publikasi {
    judul: string;
    tahun?: string;
    penerbit?: string;
}

interface Dosen {
    id: number;
    nama: string;
    nidn: string;
    email: string;
    program_studi: string;
    jabatan_akademik?: string;
    jabatan_struktural?: string;
    bidang_keahlian?: string;
    pendidikan?: Pendidikan[];
    publikasi?: Publikasi[];
    penelitian_count?: number;
    foto_url?: string;
    created_at?: string;
}

export default function DosenDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [dosen, setDosen] = useState<Dosen | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dosenId = params.id as string;

    useEffect(() => {
        const fetchDosen = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/dosen/${dosenId}`);
                if (!response.ok) throw new Error("Failed to fetch dosen");
                
                const json = await response.json();
                setDosen(json.success ? json.data : json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (dosenId) {
            fetchDosen();
        }
    }, [dosenId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !dosen) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "Dosen tidak ditemukan"}</p>
                    <button
                        onClick={() => router.push('/dosen')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Kembali ke Dosen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <button
                        onClick={() => router.push('/dosen')}
                        className="flex items-center text-indigo-100 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Dosen
                    </button>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0">
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                                {dosen.foto_url ? (
                                    <div className="relative w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100">
                                        <Image
                                            src={dosen.foto_url}
                                            alt={dosen.nama}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                                        <FiUser className="w-20 h-20 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                {dosen.nama}
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {dosen.jabatan_akademik && (
                                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                        {dosen.jabatan_akademik}
                                    </span>
                                )}
                                {dosen.jabatan_struktural && (
                                    <span className="bg-purple-500/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                        {dosen.jabatan_struktural}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-100">
                                <div className="flex items-center gap-2">
                                    <FiUser className="w-5 h-5" />
                                    <span>NIDN: {dosen.nidn}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiMail className="w-5 h-5" />
                                    <span>{dosen.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiBook className="w-5 h-5" />
                                    <span>{dosen.program_studi}</span>
                                </div>
                                {dosen.bidang_keahlian && (
                                    <div className="flex items-center gap-2">
                                        <FiAward className="w-5 h-5" />
                                        <span>{dosen.bidang_keahlian}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Pendidikan */}
                        {dosen.pendidikan && dosen.pendidikan.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FiBook className="text-indigo-600" />
                                    Riwayat Pendidikan
                                </h2>
                                <div className="space-y-4">
                                    {dosen.pendidikan.map((pend, index) => (
                                        <div key={index} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-500">
                                            <h3 className="font-semibold text-gray-900 text-lg">{pend.jenjang}</h3>
                                            <p className="text-gray-700">{pend.institusi}</p>
                                            {pend.tahun && (
                                                <p className="text-sm text-gray-600 mt-1">{pend.tahun}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Publikasi */}
                        {dosen.publikasi && dosen.publikasi.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FiFileText className="text-purple-600" />
                                    Publikasi ({dosen.publikasi.length})
                                </h2>
                                <div className="space-y-4">
                                    {dosen.publikasi.map((pub, index) => (
                                        <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-shadow">
                                            <h3 className="font-semibold text-gray-900">{pub.judul}</h3>
                                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                                {pub.tahun && (
                                                    <span className="flex items-center gap-1">
                                                        <FiBook className="w-4 h-4" />
                                                        {pub.tahun}
                                                    </span>
                                                )}
                                                {pub.penerbit && (
                                                    <span>{pub.penerbit}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Kontak</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-100 rounded-lg p-2">
                                        <FiUser className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">NIDN</p>
                                        <p className="text-gray-900 font-semibold">{dosen.nidn}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 rounded-lg p-2">
                                        <FiMail className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <a 
                                            href={`mailto:${dosen.email}`}
                                            className="text-purple-600 font-semibold hover:underline break-all"
                                        >
                                            {dosen.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 rounded-lg p-2">
                                        <FiBook className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Program Studi</p>
                                        <p className="text-gray-900 font-semibold">{dosen.program_studi}</p>
                                    </div>
                                </div>

                                {dosen.bidang_keahlian && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-green-100 rounded-lg p-2">
                                            <FiAward className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Bidang Keahlian</p>
                                            <p className="text-gray-900 font-semibold">{dosen.bidang_keahlian}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        {dosen.penelitian_count !== undefined && (
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="text-lg font-bold mb-4">Statistik</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <FiFileText className="w-5 h-5" />
                                            Penelitian
                                        </span>
                                        <span className="text-2xl font-bold">{dosen.penelitian_count}</span>
                                    </div>
                                    {dosen.publikasi && (
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FiBook className="w-5 h-5" />
                                                Publikasi
                                            </span>
                                            <span className="text-2xl font-bold">{dosen.publikasi.length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/dosen')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Lihat Dosen Lainnya
                    </button>
                </div>
            </div>
        </div>
    );
}
