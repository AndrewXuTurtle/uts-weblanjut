"use client";

import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCode, FaLaptop, FaProjectDiagram, FaSpinner, FaAward, FaGraduationCap, FaBriefcase, FaRocket } from "react-icons/fa";
import Image from "next/image";

interface ProfilData {
    id: number;
    nama_prodi: string;
    visi: string;
    misi: string;
    deskripsi: string;
    akreditasi: string;
    logo: string | null;
    logo_url?: string;
    kontak_email: string;
    kontak_telepon: string;
    alamat: string;
    created_at: string;
    updated_at: string;
}

export default function Profil() {
    const [profilData, setProfilData] = useState<ProfilData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfilData = async () => {
            try {
                // Use current host instead of hardcoded localhost for network access
                const currentHost = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
                const apiUrl = `http://${currentHost}:8000/api/profil-prodi`;

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                const data = await response.json();
                // API returns an array, take the first item
                if (Array.isArray(data) && data.length > 0) {
                    setProfilData(data[0]);
                } else {
                    setProfilData(data);
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfilData();
    }, []);

    if (loading) {
        return (
            <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading profile data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profilData) {
        return (
            <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">
                            <FaCode className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-lg font-semibold">Error Loading Data</p>
                        </div>
                        <p className="text-gray-600">{error || 'No profile data available'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Hero Section with Logo */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Logo Section */}
                        <div className="flex-shrink-0">
                            {profilData.logo_url ? (
                                <div className="relative w-48 h-48 md:w-64 md:h-64 bg-white rounded-full p-4 shadow-2xl">
                                    <Image
                                        src={profilData.logo_url}
                                        alt={`Logo ${profilData.nama_prodi}`}
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="w-48 h-48 md:w-64 md:h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                                    <FaGraduationCap className="w-24 h-24 md:w-32 md:h-32 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                                <FaAward className="text-yellow-300" />
                                <span className="text-sm font-semibold">Akreditasi {profilData.akreditasi}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                {profilData.nama_prodi}
                            </h1>
                            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl">
                                {profilData.deskripsi}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <FaPhone className="text-blue-200" />
                                    <span className="text-sm">{profilData.kontak_telepon}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <FaEnvelope className="text-blue-200" />
                                    <span className="text-sm">{profilData.kontak_email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500 text-center">
                        <FaGraduationCap className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">100+</h3>
                        <p className="text-gray-600">Mahasiswa Aktif</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500 text-center">
                        <FaBriefcase className="w-12 h-12 mx-auto mb-3 text-green-600" />
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">95%</h3>
                        <p className="text-gray-600">Lulusan Bekerja</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500 text-center">
                        <FaAward className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{profilData.akreditasi}</h3>
                        <p className="text-gray-600">Akreditasi</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-orange-500 text-center">
                        <FaRocket className="w-12 h-12 mx-auto mb-3 text-orange-600" />
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">20+</h3>
                        <p className="text-gray-600">Project Aktif</p>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="mb-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Visi & Misi</h2>
                        <p className="text-gray-600">Komitmen kami untuk membentuk generasi profesional IT masa depan</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-xl border border-blue-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-500 p-3 rounded-lg">
                                    <FaRocket className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Visi</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {profilData.visi}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-xl border border-green-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-500 p-3 rounded-lg">
                                    <FaAward className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Misi</h3>
                            </div>
                            <ul className="space-y-3">
                                {profilData.misi.split('\\n').map((misi, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-700">
                                        <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="leading-relaxed">{misi.replace(/^\d+\.\s*/, '')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            {/* Mata Kuliah Utama */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Mata Kuliah Utama</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Pemrograman Web</h3>
                        <p className="text-gray-600 mb-4">Pengembangan aplikasi web menggunakan HTML, CSS, JavaScript, dan framework modern.</p>
                        <div className="text-sm text-gray-500">
                            <p>Teknologi: React, Node.js, Express</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Pemrograman Mobile</h3>
                        <p className="text-gray-600 mb-4">Pengembangan aplikasi mobile untuk platform Android dan iOS.</p>
                        <div className="text-sm text-gray-500">
                            <p>Teknologi: React Native, Flutter</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Basis Data</h3>
                        <p className="text-gray-600 mb-4">Desain dan implementasi sistem basis data relasional dan non-relasional.</p>
                        <div className="text-sm text-gray-500">
                            <p>Teknologi: MySQL, PostgreSQL, MongoDB</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Machine Learning</h3>
                        <p className="text-gray-600 mb-4">Penerapan algoritma machine learning dalam pengembangan aplikasi cerdas.</p>
                        <div className="text-sm text-gray-500">
                            <p>Teknologi: Python, TensorFlow, Scikit-learn</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">DevOps</h3>
                        <p className="text-gray-600 mb-4">Praktik pengembangan perangkat lunak modern dengan continuous integration/deployment.</p>
                        <div className="text-sm text-gray-500">
                            <p>Teknologi: Docker, Kubernetes, Jenkins</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Keamanan Siber</h3>
                        <p className="text-gray-600 mb-4">Prinsip dan praktik keamanan dalam pengembangan perangkat lunak.</p>
                        <div className="text-sm text-gray-500">
                            <p>Teknologi: OWASP, Encryption, Authentication</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fasilitas */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Fasilitas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                            <FaLaptop className="text-blue-600 text-3xl" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Lab Komputer</h3>
                        <p className="text-gray-600">30 unit komputer dengan spesifikasi tinggi untuk praktikum programming</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                            <FaProjectDiagram className="text-green-600 text-3xl" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Lab Software Engineering</h3>
                        <p className="text-gray-600">Ruang khusus untuk project development dan collaboration</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                            <FaCode className="text-purple-600 text-3xl" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Server & Cloud</h3>
                        <p className="text-gray-600">Akses ke cloud computing dan server development environment</p>
                    </div>
                </div>
            </div>

            {/* Prospek Karir */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Prospek Karir</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-700 mb-6">
                        Lulusan Program Studi Teknik Perangkat Lunak memiliki peluang karir yang sangat luas di berbagai sektor industri:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Posisi di Industri:</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Software Developer/Engineer</li>
                                <li>Full Stack Developer</li>
                                <li>Mobile App Developer</li>
                                <li>Web Developer</li>
                                <li>System Analyst</li>
                                <li>DevOps Engineer</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Sektor Industri:</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Perusahaan Teknologi</li>
                                <li>Bank & Keuangan</li>
                                <li>E-commerce</li>
                                <li>Startup Digital</li>
                                <li>Pemerintah</li>
                                <li>Pendidikan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}