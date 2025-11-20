"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiCalendar, FiUser, FiBookOpen, FiAward, FiFolder, FiEye } from 'react-icons/fi';
import Image from "next/image";
import { getProject } from "@/lib/api";

type Mahasiswa = {
    nim: string;
    nama: string;
    email?: string;
    kelas?: string;
    prodi?: string;
};

type Project = {
    id: number;
    nim: string;
    mahasiswa?: Mahasiswa; // Eager loaded relationship
    judul_project: string;
    deskripsi: string;
    tahun: number;
    tahun_selesai: number;
    kategori: string;
    teknologi: string;
    dosen_pembimbing: string | null;
    cover_image: string | null;
    cover_image_url?: string | null;  // Laravel API field
    galeri: string | null;
    galeri_urls?: string[];           // Laravel API field
    link_demo: string | null;
    link_github: string | null;
    status: string;
    foto_utama_url?: string | null;   // Legacy support
};

export default function ProjectsPage() {
    const router = useRouter();
    const [data, setData] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedTahun, setSelectedTahun] = useState("all");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getProject();
            if (response.success) {
                // Handle both array and paginated responses
                const projects = Array.isArray(response.data) ? response.data : response.data.data || [];
                setData(projects);
            } else {
                throw new Error("Failed to fetch projects");
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

    const tahunList = ["all", ...new Set(data.map((p) => p.tahun_selesai?.toString()).filter(Boolean))].sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : Number(b) - Number(a)));

    const filteredData = data.filter((project) => {
        const matchesSearch =
            (project.judul_project && project.judul_project.toLowerCase().includes(search.toLowerCase())) ||
            (project.nim && project.nim.includes(search)) ||
            (project.mahasiswa?.nama && project.mahasiswa.nama.toLowerCase().includes(search.toLowerCase())) ||
            (project.deskripsi && project.deskripsi.toLowerCase().includes(search.toLowerCase())) ||
            (project.teknologi && project.teknologi.toLowerCase().includes(search.toLowerCase()));
        const matchesTahun = selectedTahun === "all" || project.tahun_selesai?.toString() === selectedTahun;
        return matchesSearch && matchesTahun;
    });

    // Calculate statistics
    const totalProjects = data.length;
    const uniqueStudents = new Set(data.map(p => p.nim)).size;
    const currentYear = new Date().getFullYear();
    const recentProjects = data.filter(p => p.tahun_selesai === currentYear).length;

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
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white py-20 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                            <FiFolder className="text-blue-200" />
                            <span className="text-sm font-medium">Karya Mahasiswa</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                            Galeri Proyek Mahasiswa
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Kumpulan karya inovatif mahasiswa Program Studi
                            <span className="font-semibold text-white"> Teknik Perangkat Lunak</span>
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiFolder className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <div className="text-3xl font-bold mb-2">{totalProjects}</div>
                            <div className="text-blue-100">Total Proyek</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiUser className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <div className="text-3xl font-bold mb-2">{uniqueStudents}</div>
                            <div className="text-blue-100">Mahasiswa Kreator</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FiAward className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                            <div className="text-3xl font-bold mb-2">{recentProjects}</div>
                            <div className="text-blue-100">Proyek {currentYear}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Proyek</label>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari judul proyek, nama mahasiswa, NIM, atau keywords..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="lg:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors appearance-none bg-white text-gray-900"
                                    value={selectedTahun}
                                    onChange={(e) => setSelectedTahun(e.target.value)}
                                >
                                    {tahunList.map((tahun) => (
                                        <option key={tahun} value={tahun}>
                                            {tahun === "all" ? "Semua Tahun" : tahun}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredData.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <FiFolder className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada proyek ditemukan</h3>
                        <p className="text-gray-500">Coba ubah kriteria pencarian Anda</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Proyek Mahasiswa ({filteredData.length})
                            </h2>
                        </div>

                        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {filteredData.map((project) => (
                                <div
                                    key={project.id}
                                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2 cursor-pointer"
                                    onClick={() => router.push(`/mahasiswa/${project.id}`)}
                                >
                                    {/* Project Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        {(project.cover_image_url || project.foto_utama_url) ? (
                                            <Image
                                                src={(project.cover_image_url || project.foto_utama_url) as string}
                                                alt={project.judul_project}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    // Hide image on error and show placeholder
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 flex items-center justify-center">
                                                <FiFolder className="w-20 h-20 text-blue-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                                            <span className="text-sm font-bold text-gray-800">{project.tahun_selesai}</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                                <div className="bg-white rounded-full p-3 shadow-xl">
                                                    <FiEye className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                                {project.judul_project}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {project.deskripsi}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-blue-100 rounded-lg p-2">
                                                    <FiUser className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500">Mahasiswa</p>
                                                    <p className="text-gray-900 font-semibold">
                                                        {project.mahasiswa?.nama || 'Nama tidak tersedia'}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">NIM: {project.nim}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3">
                                                <div className="bg-cyan-100 rounded-lg p-2">
                                                    <FiBookOpen className="w-4 h-4 text-cyan-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500">Kategori</p>
                                                    <p className="text-gray-900 font-semibold">{project.kategori}</p>
                                                </div>
                                            </div>

                                            {project.dosen_pembimbing && (
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-blue-100 rounded-lg p-2">
                                                        <FiAward className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-500">Dosen Pembimbing</p>
                                                        <p className="text-gray-900 font-semibold">{project.dosen_pembimbing}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Technologies */}
                                        {project.teknologi && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.teknologi.split(',').slice(0, 3).map((tech: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                                                        >
                                                            {tech.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
