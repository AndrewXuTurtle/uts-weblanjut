"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';

interface Agenda {
    id: number;
    nama_kegiatan: string;
    deskripsi: string;
    lokasi: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    waktu?: string;
    penyelenggara?: string;
    status?: string;
    created_at?: string;
}

export default function AgendaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [agenda, setAgenda] = useState<Agenda | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const agendaId = params.id as string;

    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/agenda/${agendaId}`);
                if (!response.ok) throw new Error("Failed to fetch agenda");
                
                const json = await response.json();
                setAgenda(json.success ? json.data : json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (agendaId) {
            fetchAgenda();
        }
    }, [agendaId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !agenda) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-red-500 mb-6">{error || "Agenda tidak ditemukan"}</p>
                    <button
                        onClick={() => router.push('/agenda')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                        Kembali ke Agenda
                    </button>
                </div>
            </div>
        );
    }

    const getEventStatus = () => {
        const now = new Date();
        const start = new Date(agenda.tanggal_mulai);
        const end = new Date(agenda.tanggal_selesai);

        if (now < start) {
            return { label: 'Akan Datang', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
        } else if (now >= start && now <= end) {
            return { label: 'Sedang Berlangsung', color: 'bg-green-100 text-green-700 border-green-300' };
        } else {
            return { label: 'Selesai', color: 'bg-gray-100 text-gray-700 border-gray-300' };
        }
    };

    const status = getEventStatus();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={() => router.push('/agenda')}
                        className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Agenda
                    </button>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${status.color}`}>
                            {status.label}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        {agenda.nama_kegiatan}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-5 h-5" />
                            <span>
                                {new Date(agenda.tanggal_mulai).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiMapPin className="w-5 h-5" />
                            <span>{agenda.lokasi}</span>
                        </div>
                        {agenda.waktu && (
                            <div className="flex items-center gap-2">
                                <FiClock className="w-5 h-5" />
                                <span>{agenda.waktu}</span>
                            </div>
                        )}
                        {agenda.penyelenggara && (
                            <div className="flex items-center gap-2">
                                <FiUsers className="w-5 h-5" />
                                <span>{agenda.penyelenggara}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Deskripsi Kegiatan</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {agenda.deskripsi}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Event Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Kegiatan</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 rounded-lg p-2">
                                        <FiCalendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Tanggal Mulai</p>
                                        <p className="text-gray-900 font-semibold">
                                            {new Date(agenda.tanggal_mulai).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 rounded-lg p-2">
                                        <FiCalendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Tanggal Selesai</p>
                                        <p className="text-gray-900 font-semibold">
                                            {new Date(agenda.tanggal_selesai).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-cyan-100 rounded-lg p-2">
                                        <FiMapPin className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Lokasi</p>
                                        <p className="text-gray-900 font-semibold">{agenda.lokasi}</p>
                                    </div>
                                </div>

                                {agenda.waktu && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-orange-100 rounded-lg p-2">
                                            <FiClock className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Waktu</p>
                                            <p className="text-gray-900 font-semibold">{agenda.waktu}</p>
                                        </div>
                                    </div>
                                )}

                                {agenda.penyelenggara && (
                                    <div className="flex items-start gap-3">
                                        <div className="bg-green-100 rounded-lg p-2">
                                            <FiUsers className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Penyelenggara</p>
                                            <p className="text-gray-900 font-semibold">{agenda.penyelenggara}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Status</p>
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/agenda')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Lihat Agenda Lainnya
                    </button>
                </div>
            </div>
        </div>
    );
}
