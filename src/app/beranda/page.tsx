"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChalkboardTeacher, FaProjectDiagram, FaBookOpen, FaCode, FaRocket, FaUsers } from "react-icons/fa";

export default function Beranda() {
    const [stats, setStats] = useState({
        dosen: 0,
        projects: 0,
        matakuliah: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Use current host instead of hardcoded localhost for network access
                const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

                const [dosenRes, projectsRes, matakuliahRes] = await Promise.all([
                    fetch(`http://${currentHost}:8000/api/dosen`),
                    fetch(`http://${currentHost}:8000/api/project`),
                    fetch(`http://${currentHost}:8000/api/matakuliah`)
                ]);

                const [dosenData, projectsData, matakuliahData] = await Promise.all([
                    dosenRes.json(),
                    projectsRes.json(),
                    matakuliahRes.json()
                ]);

                // Handle Laravel response format: { success: true, data: {...} }
                const extractData = (response: { success?: boolean; data?: unknown } | unknown[] | null) => {
                    if (!response) return [];
                    
                    // Handle Laravel format
                    if (typeof response === 'object' && 'success' in response && response.success && 'data' in response) {
                        const data = response.data;
                        // If paginated: { success, data: { data: [], total, ... } }
                        if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
                            return data.data;
                        }
                        // If direct array: { success, data: [...] }
                        if (Array.isArray(data)) {
                            return data;
                        }
                    }
                    // Fallback for direct array
                    if (Array.isArray(response)) {
                        return response;
                    }
                    return [];
                };

                const dosenArray = extractData(dosenData);
                const projectsArray = extractData(projectsData);
                const matakuliahArray = extractData(matakuliahData);

                setStats({
                    dosen: dosenArray.length,
                    projects: projectsArray.length,
                    matakuliah: matakuliahArray.length
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white py-24 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">Terakreditasi A</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-fade-in">
                            Program Studi
                            <br />
                            <span className="bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text">Teknik Perangkat Lunak</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Mencetak tenaga profesional di bidang pengembangan perangkat lunak dengan 
                            <span className="font-semibold text-white"> standar industri modern</span> dan 
                            <span className="font-semibold text-white">inovasi teknologi terkini</span>
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/profil" className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                                <FaRocket className="group-hover:rotate-12 transition-transform" />
                                Tentang Program
                            </Link>
                            <Link href="/mahasiswa" className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">
                                <FaProjectDiagram className="group-hover:scale-110 transition-transform" />
                                Galeri Proyek
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-600 hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                                <FaChalkboardTeacher className="text-blue-600 group-hover:text-white text-4xl transition-colors" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-gray-800 mb-2">{loading ? '...' : stats.dosen}</p>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Dosen</h3>
                        <p className="text-gray-500 text-sm">Tenaga Pengajar Profesional</p>
                    </div>

                    <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-indigo-600 hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-indigo-100 p-4 rounded-xl group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300">
                                <FaProjectDiagram className="text-indigo-600 group-hover:text-white text-4xl transition-colors" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-gray-800 mb-2">{loading ? '...' : stats.projects}</p>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Proyek Mahasiswa</h3>
                        <p className="text-gray-500 text-sm">Karya Inovatif Mahasiswa</p>
                    </div>

                    <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                                <FaBookOpen className="text-blue-500 group-hover:text-white text-4xl transition-colors" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-gray-800 mb-2">{loading ? '...' : stats.matakuliah}</p>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Mata Kuliah</h3>
                        <p className="text-gray-500 text-sm">Kurikulum Lengkap</p>
                    </div>
                </div>
            </div>

            {/* Program Highlights */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Mengapa Teknik Perangkat Lunak?</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Keunggulan program studi yang mempersiapkan Anda untuk masa depan teknologi</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:-translate-y-2">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <FaCode className="text-white text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Teknologi Terkini</h3>
                        <p className="text-gray-600 text-center leading-relaxed">Belajar bahasa pemrograman modern, framework terkini, dan metodologi pengembangan perangkat lunak yang digunakan industri global.</p>
                    </div>
                    <div className="group bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 hover:-translate-y-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <FaUsers className="text-white text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Kolaborasi Tim</h3>
                        <p className="text-gray-600 text-center leading-relaxed">Pengalaman kerja tim dalam proyek-proyek nyata yang melibatkan mahasiswa dari berbagai disiplin ilmu dan industri.</p>
                    </div>
                    <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:-translate-y-2">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                            <FaRocket className="text-white text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Inovasi & Startup</h3>
                        <p className="text-gray-600 text-center leading-relaxed">Mendukung mahasiswa dalam mengembangkan ide inovatif dan membangun startup teknologi yang berdampak.</p>
                    </div>
                </div>
            </div>

            {/* Quick Links Section */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Eksplorasi Program</h2>
                    <p className="text-gray-600 text-lg">Jelajahi berbagai aspek program studi kami</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link href="/profil" className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 hover:border-blue-300">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                            <FaRocket className="text-white text-3xl mx-auto" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 text-center">Profil Program</h3>
                        <p className="text-gray-600 text-sm text-center">Visi, misi, dan kurikulum lengkap</p>
                    </Link>

                    <Link href="/dosen" className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 hover:border-indigo-300">
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                            <FaChalkboardTeacher className="text-white text-3xl mx-auto" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 text-center">Dosen Pengajar</h3>
                        <p className="text-gray-600 text-sm text-center">Tim pengajar profesional</p>
                    </Link>

                    <Link href="/mahasiswa" className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 hover:border-blue-300">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                            <FaProjectDiagram className="text-white text-3xl mx-auto" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 text-center">Galeri Proyek</h3>
                        <p className="text-gray-600 text-sm text-center">Karya inovatif mahasiswa</p>
                    </Link>

                    <Link href="/matakuliah" className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 hover:border-indigo-300">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                            <FaBookOpen className="text-white text-3xl mx-auto" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 text-center">Mata Kuliah</h3>
                        <p className="text-gray-600 text-sm text-center">Kurikulum program</p>
                    </Link>
                </div>
            </div>

            {/* About Section */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-12 md:p-16 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
                    
                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Bergabung dengan Komunitas Teknologi</h2>
                        <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
                            Program Studi Teknik Perangkat Lunak menyediakan lingkungan belajar yang inovatif dan mendukung,
                            di mana mahasiswa dapat mengembangkan kemampuan teknis dan soft skills yang dibutuhkan di era digital.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/profil" className="group bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                                Pelajari Lebih Lanjut
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            <Link href="/mahasiswa" className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2">
                                Lihat Proyek Mahasiswa
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}