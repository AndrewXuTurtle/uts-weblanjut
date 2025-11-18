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
        <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-xl p-8 mb-10 text-white shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                        Program Studi Teknik Perangkat Lunak
                    </h1>
                    <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
                        Mencetak tenaga profesional di bidang pengembangan perangkat lunak dengan standar industri modern dan inovasi teknologi terkini.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/profil" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-md">
                            <FaRocket className="inline mr-2" />
                            Tentang Program
                        </Link>
                        <Link href="/mahasiswa" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition duration-300">
                            <FaProjectDiagram className="inline mr-2" />
                            Galeri Proyek
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 hover:shadow-lg transition duration-300">
                    <div className="flex items-center mb-4">
                        <FaChalkboardTeacher className="text-blue-600 text-3xl mr-4" />
                        <h3 className="text-xl font-semibold">Dosen</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.dosen}</p>
                    <p className="text-gray-500 mt-2">Tenaga Pengajar Profesional</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-500 hover:shadow-lg transition duration-300">
                    <div className="flex items-center mb-4">
                        <FaProjectDiagram className="text-cyan-500 text-3xl mr-4" />
                        <h3 className="text-xl font-semibold">Proyek Mahasiswa</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.projects}</p>
                    <p className="text-gray-500 mt-2">Karya Inovatif Mahasiswa</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition duration-300">
                    <div className="flex items-center mb-4">
                        <FaBookOpen className="text-blue-500 text-3xl mr-4" />
                        <h3 className="text-xl font-semibold">Mata Kuliah</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.matakuliah}</p>
                    <p className="text-gray-500 mt-2">Kurikulum Lengkap</p>
                </div>
            </div>

            {/* Program Highlights */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl mb-12">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Mengapa Teknik Perangkat Lunak?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCode className="text-blue-600 text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Teknologi Terkini</h3>
                        <p className="text-gray-600">Belajar bahasa pemrograman modern, framework terkini, dan metodologi pengembangan perangkat lunak terkini.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="text-cyan-600 text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Kolaborasi Tim</h3>
                        <p className="text-gray-600">Pengalaman kerja tim dalam proyek-proyek nyata yang melibatkan mahasiswa dari berbagai disiplin ilmu.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaRocket className="text-blue-600 text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Inovasi & Startup</h3>
                        <p className="text-gray-600">Mendukung mahasiswa dalam mengembangkan ide inovatif dan membangun startup teknologi.</p>
                    </div>
                </div>
            </div>

            {/* Quick Links Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Eksplorasi Program</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/profil" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 group">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                            <FaRocket className="text-blue-600 text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Profil Program</h3>
                            <p className="text-gray-600 text-sm">Visi, misi, dan kurikulum lengkap</p>
                        </div>
                    </Link>

                    <Link href="/dosen" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 group">
                        <div className="bg-cyan-100 p-3 rounded-lg mr-4 group-hover:bg-cyan-200 transition-colors">
                            <FaChalkboardTeacher className="text-cyan-600 text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Dosen Pengajar</h3>
                            <p className="text-gray-600 text-sm">Tim pengajar profesional dan berpengalaman</p>
                        </div>
                    </Link>

                    <Link href="/mahasiswa" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 group">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                            <FaProjectDiagram className="text-blue-600 text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Galeri Proyek</h3>
                            <p className="text-gray-600 text-sm">Karya inovatif mahasiswa</p>
                        </div>
                    </Link>

                    <Link href="/pengumuman" className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 group lg:col-start-2 lg:col-span-1">
                        <div className="bg-cyan-100 p-3 rounded-lg mr-4 group-hover:bg-cyan-200 transition-colors">
                            <FaBookOpen className="text-cyan-600 text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Mata Kuliah</h3>
                            <p className="text-gray-600 text-sm">Kurikulum dan mata kuliah program</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-xl shadow-sm mb-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Bergabung dengan Komunitas Teknologi</h2>
                    <p className="text-gray-700 mb-6 max-w-3xl mx-auto text-lg">
                        Program Studi Teknik Perangkat Lunak menyediakan lingkungan belajar yang inovatif dan mendukung,
                        di mana mahasiswa dapat mengembangkan kemampuan teknis dan soft skills yang dibutuhkan di era digital.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/profil" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300">
                            Pelajari Lebih Lanjut
                        </Link>
                        <Link href="/mahasiswa" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold transition duration-300">
                            Lihat Proyek Mahasiswa
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}