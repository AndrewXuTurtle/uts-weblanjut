"use client";

import { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiClock, FiMapPin, FiUser, FiUsers, FiAlertCircle, FiPhone, FiX } from 'react-icons/fi';
import { getAgenda } from '@/lib/api';

interface Agenda {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  kategori: string; // seminar, workshop, acara
  penyelenggara: string;
  kontak?: string;
  poster?: string;
  gambar_url?: string;
  aktif: boolean;
}

export default function AgendaPage() {
  const [data, setData] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAgenda();
      if (response.success) {
        // Handle paginated response (Format B - auto-normalized)
        const agendaData = response.data?.data || response.data || [];
        setData(Array.isArray(agendaData) ? agendaData : []);
      } else {
        throw new Error("Failed to fetch agenda");
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

  const kategoriList = ["all", ...new Set(data.map((a) => a.kategori).filter(Boolean))];

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.judul?.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
      item.penyelenggara?.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(search.toLowerCase());
    const matchesKategori = selectedKategori === "all" || item.kategori === selectedKategori;
    return matchesSearch && matchesKategori;
  });

  // Calculate statistics
  const totalAgenda = data.length;
  const upcomingEvents = data.filter(a => new Date(a.tanggal_mulai) > new Date()).length;
  const ongoingEvents = data.filter(a => {
    const now = new Date();
    const start = new Date(a.tanggal_mulai);
    const end = new Date(a.tanggal_selesai);
    return now >= start && now <= end;
  }).length;
  const kategoriCount = new Set(data.map(a => a.kategori)).size;

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
              <FiCalendar className="text-blue-200" />
              <span className="text-sm font-medium">Jadwal Kegiatan</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Agenda Kegiatan
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Jadwal kegiatan dan acara Program Studi
              <span className="font-semibold text-white"> Teknik Perangkat Lunak</span>
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiCalendar className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">{totalAgenda}</div>
              <div className="text-blue-100">Total Agenda</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiClock className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">{upcomingEvents}</div>
              <div className="text-blue-100">Agenda Mendatang</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiAlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">{ongoingEvents}</div>
              <div className="text-blue-100">Sedang Berlangsung</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiUsers className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">{kategoriCount}</div>
              <div className="text-orange-100">Kategori</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Agenda</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul, deskripsi, atau lokasi..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors text-gray-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors bg-white text-gray-900"
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
              >
                {kategoriList.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori === "all" ? "Semua Kategori" : kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <FiCalendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada agenda ditemukan</h3>
            <p className="text-gray-500">Coba ubah kriteria pencarian Anda</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Agenda ({filteredData.length})
              </h2>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((item) => {
                const now = new Date();
                const startDate = new Date(item.tanggal_mulai);
                const endDate = new Date(item.tanggal_selesai);
                const isUpcoming = startDate > now;
                const isOngoing = now >= startDate && now <= endDate;
                const isPast = endDate < now;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAgenda(item)}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer hover:-translate-y-2"
                  >
                    {/* Header with status */}
                    <div className={`p-4 ${
                      isOngoing ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      isUpcoming ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-sm capitalize">{item.kategori}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isOngoing ? 'bg-green-200 text-green-800' :
                          isUpcoming ? 'bg-blue-200 text-blue-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {isOngoing ? 'Sedang Berlangsung' : isUpcoming ? 'Mendatang' : 'Selesai'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {item.judul}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {item.deskripsi}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-orange-100 rounded-lg p-2">
                            <FiCalendar className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Tanggal</p>
                            <p className="text-gray-900 font-semibold">
                              {new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}
                              {item.tanggal_mulai !== item.tanggal_selesai && ` - ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID')}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 rounded-lg p-2">
                            <FiMapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Lokasi</p>
                            <p className="text-gray-900 font-semibold">{item.lokasi}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 rounded-lg p-2">
                            <FiUser className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Penyelenggara</p>
                            <p className="text-gray-900 font-semibold">{item.penyelenggara}</p>
                          </div>
                        </div>
                        {item.kontak && (
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                              <FiPhone className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-500">Kontak</p>
                              <p className="text-gray-900 font-semibold">{item.kontak}</p>
                            </div>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-100">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            item.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.aktif ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal Detail Agenda */}
      {selectedAgenda && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedAgenda(null)}
          style={{
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            {/* Header with dynamic status */}
            {(() => {
              const now = new Date();
              const startDate = new Date(selectedAgenda.tanggal_mulai);
              const endDate = new Date(selectedAgenda.tanggal_selesai);
              const isUpcoming = startDate > now;
              const isOngoing = now >= startDate && now <= endDate;

              return (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative">
                  <button
                    onClick={() => setSelectedAgenda(null)}
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <FiCalendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedAgenda.judul}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {selectedAgenda.kategori}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {isOngoing ? 'Sedang Berlangsung' : isUpcoming ? 'Mendatang' : 'Selesai'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Deskripsi */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiAlertCircle className="text-blue-600" />
                  Deskripsi Agenda
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedAgenda.deskripsi}
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Tanggal */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 rounded-lg p-2">
                      <FiCalendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Tanggal Pelaksanaan</p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(selectedAgenda.tanggal_mulai).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {selectedAgenda.tanggal_mulai !== selectedAgenda.tanggal_selesai && (
                          <> sampai {new Date(selectedAgenda.tanggal_selesai).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 rounded-lg p-2">
                      <FiMapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Lokasi</p>
                      <p className="text-lg font-bold text-gray-900">{selectedAgenda.lokasi}</p>
                    </div>
                  </div>
                </div>

                {/* Penyelenggara */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 rounded-lg p-2">
                      <FiUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Penyelenggara</p>
                      <p className="text-lg font-bold text-gray-900">{selectedAgenda.penyelenggara}</p>
                    </div>
                  </div>
                </div>

                {/* Kontak */}
                {selectedAgenda.kontak && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 md:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 rounded-lg p-2">
                        <FiPhone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Kontak</p>
                        <p className="text-lg font-bold text-gray-900">{selectedAgenda.kontak}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  selectedAgenda.aktif ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedAgenda.aktif ? '✓ Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedAgenda(null)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}