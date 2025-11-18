"use client"

import { useEffect, useState } from "react";
import { FiMail, FiBookOpen, FiBriefcase, FiUsers, FiAward, FiExternalLink } from 'react-icons/fi';
import Image from "next/image";
import { getDosen } from '@/lib/api';

type Dosen = {
    id: number;
    nidn: string;
    nama: string;
    email: string;
    no_hp?: string;
    jabatan: string;
    pendidikan_terakhir?: string;
    bidang_keahlian?: string;
    google_scholar_link?: string;
    sinta_link?: string;
    scopus_link?: string;
    foto_url?: string;
    status?: string;
};


export default function Profil() {
    const [data, setData] = useState<Dosen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getDosen({ status: 'Aktif' });
            if (response.success) {
                // Handle direct array response (Format A - auto-normalized)
                const dosenData = Array.isArray(response.data) ? response.data : [];
                setData(dosenData);
            } else {
                throw new Error("Failed to fetch dosen");
            }
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // No filtering needed since we only have one program studi
    const filteredData = data;

    // Calculate statistics
    const totalDosen = data.length;

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-4 rounded-lg text-red-600">Error: {error}</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Dosen Berkualitas
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Tenaga Pengajar Profesional Program Studi Teknik Perangkat Lunak
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiUsers className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <div className="text-3xl font-bold mb-2">{totalDosen}</div>
                            <div className="text-blue-100">Total Dosen</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiBookOpen className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <div className="text-3xl font-bold mb-2">15+</div>
                            <div className="text-blue-100">Tahun Pengalaman</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiAward className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <div className="text-3xl font-bold mb-2">100%</div>
                            <div className="text-blue-100">Berkualitas</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Results */}
                {filteredData.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <FiUsers className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada data dosen</h3>
                        <p className="text-gray-500">Coba ubah kriteria pencarian Anda</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Daftar Dosen ({filteredData.length})
                            </h2>
                        </div>

                        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {filteredData.map((dosen) => (
                                <div
                                    key={dosen.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                                >
                                    {/* Header with Photo */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="absolute bottom-4 left-6 flex items-center space-x-4">
                                            <div className="bg-white rounded-full p-1 shadow-lg">
                                                {dosen.foto_url ? (
                                                    <Image
                                                        src={dosen.foto_url}
                                                        alt={`Foto ${dosen.nama}`}
                                                        width={80}
                                                        height={80}
                                                        className="w-20 h-20 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                                        {dosen.nama.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-white">
                                                <h3 className="text-xl font-bold mb-1">{dosen.nama}</h3>
                                                <p className="text-blue-100 text-sm">NIDN: {dosen.nidn}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-blue-100 rounded-lg p-2">
                                                    <FiBriefcase className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Jabatan</p>
                                                    <p className="text-gray-900 font-semibold">{dosen.jabatan}</p>
                                                    {dosen.bidang_keahlian && (
                                                        <p className="text-gray-600 text-sm mt-1">{dosen.bidang_keahlian}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <div className="bg-green-100 rounded-lg p-2">
                                                    <FiBookOpen className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Pendidikan</p>
                                                    <p className="text-gray-900 font-semibold">{dosen.pendidikan_terakhir || 'S2'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <div className="bg-purple-100 rounded-lg p-2">
                                                    <FiMail className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                                    <p className="text-gray-900 font-semibold break-all">{dosen.email}</p>
                                                </div>
                                            </div>

                                            {/* Academic Links */}
                                            {(dosen.google_scholar_link || dosen.sinta_link || dosen.scopus_link) && (
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-blue-100 rounded-lg p-2">
                                                        <FiExternalLink className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-500 mb-2">Profil Akademik</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {dosen.google_scholar_link && (
                                                                <a href={dosen.google_scholar_link} target="_blank" rel="noopener noreferrer" 
                                                                   className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100">
                                                                    Google Scholar
                                                                </a>
                                                            )}
                                                            {dosen.sinta_link && (
                                                                <a href={dosen.sinta_link} target="_blank" rel="noopener noreferrer"
                                                                   className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100">
                                                                    SINTA
                                                                </a>
                                                            )}
                                                            {dosen.scopus_link && (
                                                                <a href={dosen.scopus_link} target="_blank" rel="noopener noreferrer"
                                                                   className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded hover:bg-orange-100">
                                                                    Scopus
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>Dosen Tetap</span>
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    {dosen.status || 'Aktif'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}