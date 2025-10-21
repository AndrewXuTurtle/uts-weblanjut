"use client"

import { useEffect, useState } from "react";
import { FiBookOpen, FiClock, FiUser, FiCalendar, FiFilter } from 'react-icons/fi';

type MataKuliah = {
    mk_id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: number;
    program_studi: string;
    kurikulum_tahun: number;
    deskripsi_singkat: string;
    status_wajib: 'Wajib' | 'Pilihan';
};

export default function MataKuliahPage() {
    const [data, setData] = useState<MataKuliah[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Use current host instead of hardcoded localhost for network access
            const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
            const res = await fetch(`http://${currentHost}:8000/api/matakuliah`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            setData(Array.isArray(json) ? json : []);
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const semesterList = [1, 2, 3, 4, 5, 6, 7, 8];

    const filteredData = data.filter((mk) => {
        const matchesSemester = selectedSemester === 'all' || mk.semester === selectedSemester;
        return matchesSemester;
    });

    // Group courses by semester
    const coursesBySemester = semesterList.reduce((acc, semester) => {
        acc[semester] = filteredData.filter((mk) => mk.semester === semester);
        return acc;
    }, {} as Record<number, MataKuliah[]>);

    // Calculate statistics
    const totalCourses = data.length;
    const totalSKS = data.reduce((sum, mk) => sum + mk.sks, 0);
    const wajibCourses = data.filter(mk => mk.status_wajib === 'Wajib').length;
    const pilihanCourses = data.filter(mk => mk.status_wajib === 'Pilihan').length;

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
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                            Mata Kuliah
                        </h1>
                        <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                            Kurikulum Program Studi Teknik Perangkat Lunak
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiBookOpen className="w-12 h-12 mx-auto mb-4 text-green-200" />
                            <div className="text-3xl font-bold mb-2">{totalCourses}</div>
                            <div className="text-green-100">Total Mata Kuliah</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiClock className="w-12 h-12 mx-auto mb-4 text-green-200" />
                            <div className="text-3xl font-bold mb-2">{totalSKS}</div>
                            <div className="text-green-100">Total SKS</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiUser className="w-12 h-12 mx-auto mb-4 text-green-200" />
                            <div className="text-3xl font-bold mb-2">{wajibCourses}</div>
                            <div className="text-green-100">Mata Kuliah Wajib</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiCalendar className="w-12 h-12 mx-auto mb-4 text-green-200" />
                            <div className="text-3xl font-bold mb-2">{pilihanCourses}</div>
                            <div className="text-green-100">Mata Kuliah Pilihan</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                            <div className="relative">
                                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors appearance-none bg-white text-gray-900"
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                >
                                    <option value="all">Semua Semester</option>
                                    {semesterList.map((semester) => (
                                        <option key={semester} value={semester}>
                                            Semester {semester}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                {semesterList.map((semester) => {
                    const semesterCourses = coursesBySemester[semester];
                    if (selectedSemester !== 'all' && selectedSemester !== semester) return null;
                    if (semesterCourses.length === 0) return null;

                    return (
                        <div key={semester} className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-gray-800">
                                    Semester {semester}
                                </h2>
                                <div className="text-sm text-gray-600">
                                    {semesterCourses.length} mata kuliah • {semesterCourses.reduce((sum, mk) => sum + mk.sks, 0)} SKS
                                </div>
                            </div>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {semesterCourses.map((mk) => (
                                    <div
                                        key={mk.mk_id}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="bg-green-100 rounded-lg p-3">
                                                    <FiBookOpen className="w-6 h-6 text-green-600" />
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    mk.status_wajib === 'Wajib'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {mk.status_wajib}
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {mk.nama_mk}
                                                </h3>
                                                <p className="text-green-600 font-semibold text-sm mb-2">
                                                    {mk.kode_mk}
                                                </p>
                                                {mk.deskripsi_singkat && (
                                                    <p className="text-gray-600 text-sm line-clamp-3">
                                                        {mk.deskripsi_singkat}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">SKS:</span>
                                                    <span className="font-semibold text-gray-800">{mk.sks}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Program Studi:</span>
                                                    <span className="font-semibold text-gray-800">{mk.program_studi}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Kurikulum:</span>
                                                    <span className="font-semibold text-gray-800">{mk.kurikulum_tahun}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {filteredData.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <FiBookOpen className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada mata kuliah ditemukan</h3>
                        <p className="text-gray-500">Coba ubah kriteria filter Anda</p>
                    </div>
                )}
            </div>
        </div>
    );
}