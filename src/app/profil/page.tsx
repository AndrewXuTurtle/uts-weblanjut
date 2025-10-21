"use client";

import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCode, FaLaptop, FaProjectDiagram, FaSpinner } from "react-icons/fa";

interface ProfilData {
    id: number;
    nama_prodi: string;
    visi: string;
    misi: string;
    deskripsi: string;
    akreditasi: string;
    logo: string | null;
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
        <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-10 text-white shadow-lg">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Profil Program Studi {profilData.nama_prodi}</h1>
                <p className="text-lg md:text-xl mb-6 max-w-3xl">
                    {profilData.deskripsi}
                </p>
            </div>

            {/* About Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Tentang Program Studi</h2>
                    <p className="text-gray-700 mb-4">
                        {profilData.deskripsi}
                    </p>
                    <div className="flex flex-col space-y-3 mt-6">
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="text-blue-600 mr-3" />
                            <span className="text-gray-700">{profilData.alamat.replace('\\n', ', ')}</span>
                        </div>
                        <div className="flex items-center">
                            <FaCode className="text-blue-600 mr-3" />
                            <span className="text-gray-700">Akreditasi: {profilData.akreditasi}</span>
                        </div>
                        <div className="flex items-center">
                            <FaPhone className="text-blue-600 mr-3" />
                            <span className="text-gray-700">{profilData.kontak_telepon}</span>
                        </div>
                        <div className="flex items-center">
                            <FaEnvelope className="text-blue-600 mr-3" />
                            <span className="text-gray-700">{profilData.kontak_email}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-48 h-48 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <FaCode className="h-24 w-24 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{profilData.nama_prodi}</h3>
                        <p className="text-gray-600 mt-2">Membangun Masa Depan Digital</p>
                    </div>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Visi & Misi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Visi</h3>
                        <p className="text-gray-700">
                            {profilData.visi}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Misi</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            {profilData.misi.split('\\n').map((misi, index) => (
                                <li key={index}>{misi.replace(/^\d+\.\s*/, '')}</li>
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
    );
}