"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiCalendar, FiAward, FiTrendingUp, FiHeart, FiEye, FiPlay } from 'react-icons/fi';
import { getKisahSukses, getKisahSuksesStatistics } from '@/lib/api';

interface Mahasiswa {
  nim: string;
  nama: string;
  email: string;
}

interface KisahSukses {
  id: number;
  nim: string;
  mahasiswa?: Mahasiswa; // Eager loaded
  judul: string;
  kisah: string;
  pencapaian: string;
  tahun_pencapaian: number;
  foto?: string;
  foto_url?: string;
  status: string; // Published, Draft
}

interface Statistics {
  total: number;
  by_status?: {
    published?: number;
    draft?: number;
  };
  by_year?: Record<string, number>;
}

export default function KisahSuksesPage() {
  const router = useRouter();
  const [data, setData] = useState<KisahSukses[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [storiesResponse, statsResponse] = await Promise.all([
        getKisahSukses({ status: 'Published' }),
        getKisahSuksesStatistics()
      ]);

      if (storiesResponse.success) {
        const storiesData = storiesResponse.data?.data || storiesResponse.data || [];
        setData(Array.isArray(storiesData) ? storiesData : []);
      }
      
      if (statsResponse.success) {
        setStatistics(statsResponse.data);
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

  const statusList = ["all", "Published", "Draft"];
  const tahunList = ["all", ...new Set(data.map((k) => k.tahun_pencapaian?.toString()).filter(Boolean))];

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.judul?.toLowerCase().includes(search.toLowerCase()) ||
      item.kisah?.toLowerCase().includes(search.toLowerCase()) ||
      item.mahasiswa?.nama?.toLowerCase().includes(search.toLowerCase()) ||
      item.pencapaian?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
              <FiAward className="text-yellow-300" />
              <span className="text-sm font-medium">Prestasi Alumni</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Kisah Sukses Alumni
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Cerita inspiratif perjalanan karir alumni
              <span className="font-semibold text-white"> Teknik Perangkat Lunak</span>
            </p>
          </div>

          {/* Statistics */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FiAward className="w-12 h-12 mx-auto mb-4 text-amber-200" />
                <div className="text-3xl font-bold mb-2">{statistics.total}</div>
                <div className="text-amber-100">Total Kisah Sukses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FiTrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-200" />
                <div className="text-3xl font-bold mb-2">{statistics.by_status?.published || 0}</div>
                <div className="text-amber-100">Published</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FiHeart className="w-12 h-12 mx-auto mb-4 text-red-200" />
                <div className="text-3xl font-bold mb-2">{statistics.by_year ? Object.keys(statistics.by_year).length : 0}</div>
                <div className="text-amber-100">Tahun Aktif</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FiUser className="w-12 h-12 mx-auto mb-4 text-yellow-200" />
                <div className="text-3xl font-bold mb-2">{filteredData.length}</div>
                <div className="text-amber-100">Ditampilkan</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Kisah Sukses</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul, cerita, atau nama alumni..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors text-gray-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors bg-white text-gray-900"
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada kisah sukses ditemukan</h3>
            <p className="text-gray-500">Coba ubah kriteria pencarian Anda</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Kisah Sukses Alumni ({filteredData.length})
              </h2>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/kisah-sukses/${item.id}`)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiAward className="w-20 h-20 text-amber-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${
                        item.status === 'Published' ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {item.kisah}
                      </p>
                      {item.pencapaian && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-3">
                          <p className="text-sm font-medium text-amber-800">
                            {item.pencapaian}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Mahasiswa Info */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-amber-100 rounded-lg p-2">
                          <FiUser className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Mahasiswa</p>
                          <p className="text-gray-900 font-semibold">{item.mahasiswa?.nama || item.nim}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <FiCalendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tahun Pencapaian</p>
                          <p className="text-gray-900 font-semibold">{item.tahun_pencapaian}</p>
                        </div>
                      </div>
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
