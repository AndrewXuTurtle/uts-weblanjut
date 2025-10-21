"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiUser, FiBookOpen, FiAward, FiCalendar, FiTag, FiImage } from 'react-icons/fi';
import Image from "next/image";

type Project = {
    project_id: number;
    judul_proyek: string;
    deskripsi_singkat: string;
    nama_mahasiswa: string;
    nim_mahasiswa: string;
    program_studi: string;
    dosen_pembimbing: string;
    tahun_selesai: number;
    path_foto_utama: string;
    path_foto_galeri: string;
    foto_utama_url?: string;
    galeri_urls?: string[];
    keywords: string;
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const projectId = params.id as string;

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                // Use current host instead of hardcoded localhost for network access
                const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
                const res = await fetch(`http://${currentHost}:8000/api/project/${projectId}`);
                if (!res.ok) throw new Error("Failed to fetch project");
                const data = await res.json();
                setProject(data);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "Project not found"}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Projects
                    </button>

                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Project Details
                        </h1>
                        <p className="text-xl text-blue-100">
                            {project.judul_proyek}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Image */}
                        {project.foto_utama_url && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="relative h-96">
                                    <Image
                                        src={project.foto_utama_url}
                                        alt={project.judul_proyek}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Project Description */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Project Description</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {project.deskripsi_singkat}
                                </p>
                            </div>
                        </div>

                        {/* Gallery */}
                        {project.galeri_urls && project.galeri_urls.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                                    <FiImage className="w-8 h-8 mr-3 text-blue-600" />
                                    Project Gallery
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.galeri_urls.map((url, index) => (
                                        <div key={index} className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer">
                                            <Image
                                                src={url}
                                                alt={`Gallery image ${index + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                onClick={() => window.open(url, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiImage className="w-6 h-6 text-gray-800" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-4 text-center">
                                    Click on any image to view in full size
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Project Information</h3>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 rounded-lg p-2">
                                        <FiUser className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Student</p>
                                        <p className="text-gray-900 font-semibold text-lg">{project.nama_mahasiswa}</p>
                                        <p className="text-gray-500 text-sm">NIM: {project.nim_mahasiswa}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 rounded-lg p-2">
                                        <FiBookOpen className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Program Studi</p>
                                        <p className="text-gray-900 font-semibold">{project.program_studi}</p>
                                    </div>
                                </div>

                                {project.dosen_pembimbing && (
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-purple-100 rounded-lg p-2">
                                            <FiAward className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500">Supervisor</p>
                                            <p className="text-gray-900 font-semibold">{project.dosen_pembimbing}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start space-x-3">
                                    <div className="bg-orange-100 rounded-lg p-2">
                                        <FiCalendar className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500">Completion Year</p>
                                        <p className="text-gray-900 font-semibold text-lg">{project.tahun_selesai}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Keywords */}
                        {project.keywords && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FiTag className="w-6 h-6 mr-2 text-blue-600" />
                                    Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.keywords.split(',').map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-sm font-medium"
                                        >
                                            {keyword.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Project Stats */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Project Stats</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {project.galeri_urls ? project.galeri_urls.length : 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Gallery Images</div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {project.keywords ? project.keywords.split(',').length : 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Keywords</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}