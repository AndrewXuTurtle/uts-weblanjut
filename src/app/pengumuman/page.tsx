"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiCalendar, FiAlertTriangle, FiInfo, FiCheckCircle, FiClock, FiUser } from 'react-icons/fi';
import { getPengumuman } from '@/lib/api';

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  gambar?: string;
  gambar_url?: string;
  penulis: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  prioritas: string; // tinggi, sedang, rendah
  aktif: boolean;
}

export default function PengumumanPage() {
  const router = useRouter();
  const [data, setData] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPrioritas, setSelectedPrioritas] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPengumuman();
      if (response.success) {
        // Handle paginated response (Format B - auto-normalized)
        const pengumumanData = response.data?.data || response.data || [];
        setData(Array.isArray(pengumumanData) ? pengumumanData : []);
      } else {
        throw new Error("Failed to fetch pengumuman");
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

  const prioritasList = ["all", ...new Set(data.map((p) => p.prioritas).filter(Boolean))];

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.isi.toLowerCase().includes(search.toLowerCase()) ||
      item.penulis.toLowerCase().includes(search.toLowerCase());
    const matchesPrioritas = selectedPrioritas === "all" || item.prioritas === selectedPrioritas;
    return matchesSearch && matchesPrioritas && item.aktif;
  });

  // Calculate statistics
  const totalPengumuman = data.filter(p => p.aktif).length;
  const tinggiPrioritas = data.filter(p => p.prioritas === 'tinggi' && p.aktif).length;
  const sedangPrioritas = data.filter(p => p.prioritas === 'sedang' && p.aktif).length;
  const rendahPrioritas = data.filter(p => p.prioritas === 'rendah' && p.aktif).length;

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
              <FiAlertTriangle className="text-yellow-300" />
              <span className="text-sm font-medium">Informasi Penting</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Pengumuman
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Informasi dan pengumuman terbaru Program Studi
              <span className="font-semibold text-white"> Teknik Perangkat Lunak</span>
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiInfo className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <div className="text-3xl font-bold mb-2">{totalPengumuman}</div>
              <div className="text-blue-100">Total Pengumuman</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiAlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-200" />
              <div className="text-3xl font-bold mb-2">{tinggiPrioritas}</div>
              <div className="text-blue-100">Prioritas Tinggi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiClock className="w-12 h-12 mx-auto mb-4 text-yellow-200" />
              <div className="text-3xl font-bold mb-2">{sedangPrioritas}</div>
              <div className="text-blue-100">Prioritas Sedang</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiCheckCircle className="w-12 h-12 mx-auto mb-4 text-green-200" />
              <div className="text-3xl font-bold mb-2">{rendahPrioritas}</div>
              <div className="text-blue-100">Prioritas Rendah</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Pengumuman</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul, isi, atau penulis..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-white text-gray-900"
                value={selectedPrioritas}
                onChange={(e) => setSelectedPrioritas(e.target.value)}
              >
                {prioritasList.map((prioritas) => (
                  <option key={prioritas} value={prioritas}>
                    {prioritas === "all" ? "Semua Prioritas" : prioritas.charAt(0).toUpperCase() + prioritas.slice(1)}
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
              <FiInfo className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada pengumuman ditemukan</h3>
            <p className="text-gray-500">Coba ubah kriteria pencarian Anda</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Pengumuman ({filteredData.length})
              </h2>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/pengumuman/${item.id}`)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer hover:-translate-y-2"
                >
                  {/* Header with priority */}
                  <div className={`p-4 ${
                    item.prioritas === 'tinggi' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    item.prioritas === 'sedang' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold text-sm capitalize">{item.prioritas}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.prioritas === 'tinggi' ? 'bg-red-200 text-red-800' :
                        item.prioritas === 'sedang' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {item.prioritas}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-4">
                        {item.isi}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <FiCalendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">Tanggal Mulai</p>
                          <p className="text-gray-900 font-semibold">
                            {new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 rounded-lg p-2">
                          <FiInfo className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">Penulis</p>
                          <p className="text-gray-900 font-semibold">{item.penulis}</p>
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