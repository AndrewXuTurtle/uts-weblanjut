"use client";

import { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiAward, FiCheckCircle, FiClock, FiTrendingUp, FiBookOpen, FiUser, FiUsers } from 'react-icons/fi';
import { getPKM } from '@/lib/api';

interface Dosen {
  id: number;
  nama: string;
  nidn: string;
}

interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
}

interface PKM {
  id: number;
  judul_pkm: string;
  deskripsi: string;
  tahun: number;
  jenis_pkm: string; // PKM-KC, PKM-K, PKM-M, PKM-T, PKM-R
  status: string; // Didanai, Diajukan, Selesai
  dana?: number;
  pencapaian?: string;
  file_dokumen?: string;
  file_url?: string;
  dosen_pembimbing_id?: number;
  dosen?: Dosen; // Eager loaded dosen_pembimbing
  mahasiswa?: Mahasiswa[]; // Eager loaded mahasiswa array
}

export default function PKMPage() {
  const [data, setData] = useState<PKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPKM();
      if (response.success) {
        // Handle paginated or array response
        const pkmData = response.data?.data || response.data || [];
        setData(Array.isArray(pkmData) ? pkmData : []);
      } else {
        throw new Error("Failed to fetch PKM");
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

  const tahunList = ["all", ...new Set(data.map((p) => p.tahun?.toString()).filter(Boolean))].sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : Number(b) - Number(a)));
  const statusList = ["all", ...new Set(data.map((p) => p.status).filter(Boolean))];
  const jenisList = ["all", ...new Set(data.map((p) => p.jenis_pkm).filter(Boolean))];

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.judul_pkm?.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
      item.dosen?.nama?.toLowerCase().includes(search.toLowerCase()) ||
      item.mahasiswa?.some(m => m.nama.toLowerCase().includes(search.toLowerCase()));
    const matchesTahun = selectedTahun === "all" || item.tahun?.toString() === selectedTahun;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesTahun && matchesStatus;
  });

  // Calculate statistics - use actual status values from API
  const totalPKM = data.length;
  const didanaiPKM = data.filter(p => p.status === 'Didanai').length;
  const selesaiPKM = data.filter(p => p.status === 'Selesai').length;
  const currentYear = new Date().getFullYear();
  const recentPKM = data.filter(p => p.tahun === currentYear).length;

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
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              PKM
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Program Kreativitas Mahasiswa - Inovasi dan Pengabdian Masyarakat
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiAward className="w-12 h-12 mx-auto mb-4 text-orange-200" />
              <div className="text-3xl font-bold mb-2">{totalPKM}</div>
              <div className="text-orange-100">Total PKM</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiCheckCircle className="w-12 h-12 mx-auto mb-4 text-orange-200" />
              <div className="text-3xl font-bold mb-2">{selesaiPKM}</div>
              <div className="text-orange-100">Selesai</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiClock className="w-12 h-12 mx-auto mb-4 text-orange-200" />
              <div className="text-3xl font-bold mb-2">{didanaiPKM}</div>
              <div className="text-orange-100">Didanai</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiTrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-200" />
              <div className="text-3xl font-bold mb-2">{recentPKM}</div>
              <div className="text-orange-100">Tahun {currentYear}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari PKM</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul atau deskripsi..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-white text-gray-900"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusList.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "Semua Status" : status}
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
              <FiAward className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada PKM ditemukan</h3>
            <p className="text-gray-500">Coba ubah kriteria pencarian Anda</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                PKM ({filteredData.length})
              </h2>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Header with status */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold text-sm">{item.jenis_pkm || 'PKM'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Selesai' ? 'bg-green-200 text-green-800' :
                        item.status === 'Didanai' ? 'bg-yellow-200 text-yellow-800' :
                        item.status === 'Diajukan' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {item.judul_pkm}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {item.deskripsi}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <FiCalendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tahun</p>
                          <p className="text-gray-900 font-semibold">{item.tahun}</p>
                        </div>
                      </div>
                      {item.dosen && (
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <FiUser className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Dosen Pembimbing</p>
                            <p className="text-gray-900 font-semibold">{item.dosen.nama}</p>
                          </div>
                        </div>
                      )}
                      {item.mahasiswa && item.mahasiswa.length > 0 && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 rounded-lg p-2 mt-1">
                            <FiUsers className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Tim Mahasiswa</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.mahasiswa.slice(0, 3).map((m, idx) => (
                                <span key={idx} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {m.nama}
                                </span>
                              ))}
                              {item.mahasiswa.length > 3 && (
                                <span className="text-xs text-gray-500">+{item.mahasiswa.length - 3} lainnya</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
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