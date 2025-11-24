"use client";

import { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiUser, FiEye, FiHeart, FiShare2, FiAward, FiX } from 'react-icons/fi';
import { getBerita } from '@/lib/api';
import Image from 'next/image';

interface Berita {
  id: number;
  judul: string;
  isi?: string;           // API uses 'isi' not 'konten'
  slug?: string;
  konten?: string;
  gambar?: string;
  gambar_url?: string;
  penulis: string;
  tanggal?: string;        // API uses 'tanggal'
  tanggal_publish?: string;
  kategori?: string;
  is_prestasi: boolean;
  views?: number;
}

export default function BeritaPage() {
  const [data, setData] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("all");
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getBerita();
      if (response.success) {
        // Handle paginated response (Format B - auto-normalized)
        const beritaData = response.data?.data || response.data || [];
        setData(Array.isArray(beritaData) ? beritaData : []);
      } else {
        throw new Error("Failed to fetch berita");
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

  const kategoriList = ["all", ...new Set(data.map((b) => b.kategori).filter(Boolean))];

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.judul?.toLowerCase().includes(search.toLowerCase()) ||
      item.konten?.toLowerCase().includes(search.toLowerCase()) ||
      item.penulis?.toLowerCase().includes(search.toLowerCase());
    const matchesKategori = selectedKategori === "all" || item.kategori === selectedKategori;
    return matchesSearch && matchesKategori;
  });

  // Calculate statistics
  const totalBerita = data.length;
  const totalViews = data.reduce((sum, b) => sum + (b.views || 0), 0);
  const prestasiCount = data.filter(b => b.is_prestasi).length;
  const kategoriCount = new Set(data.map(b => b.kategori)).size;

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
              <span className="text-sm font-medium">Berita & Informasi</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Berita
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Informasi terkini dan berita terbaru dari Program Studi
              <span className="font-semibold text-white"> Teknik Perangkat Lunak</span>
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiEye className="w-12 h-12 mx-auto mb-4 text-purple-200" />
              <div className="text-3xl font-bold mb-2">{totalBerita}</div>
              <div className="text-purple-100">Total Berita</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiCalendar className="w-12 h-12 mx-auto mb-4 text-pink-200" />
              <div className="text-3xl font-bold mb-2">{prestasiCount}</div>
              <div className="text-purple-100">Berita Prestasi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiUser className="w-12 h-12 mx-auto mb-4 text-red-200" />
              <div className="text-3xl font-bold mb-2">{kategoriCount}</div>
              <div className="text-purple-100">Kategori</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <FiEye className="w-12 h-12 mx-auto mb-4 text-orange-200" />
              <div className="text-3xl font-bold mb-2">{totalViews}</div>
              <div className="text-purple-100">Total Views</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Berita</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul, isi, atau penulis..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors text-gray-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors bg-white text-gray-900"
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
              >
                {kategoriList.map((kategori) => (
                  <option key={kategori || 'all'} value={kategori || 'all'}>
                    {kategori === "all" ? "Semua Kategori" : (kategori || 'Uncategorized').charAt(0).toUpperCase() + (kategori || '').slice(1)}
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
              <FiEye className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada berita ditemukan</h3>
            <p className="text-gray-500">Coba ubah kriteria pencarian Anda</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Berita ({filteredData.length})
              </h2>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer hover:-translate-y-2"
                  onClick={() => setSelectedBerita(item)}
                >
                  {/* Image */}
                  {(item.gambar_url || item.gambar) && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.gambar_url || item.gambar}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                          {item.is_prestasi ? 'Prestasi' : 'Berita'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {item.konten}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 rounded-lg p-2">
                          <FiUser className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">Penulis</p>
                          <p className="text-gray-900 font-semibold">{item.penulis}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <FiCalendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">Tanggal Publikasi</p>
                          <p className="text-gray-900 font-semibold">
                            {new Date(item.tanggal || item.tanggal_publish || Date.now()).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FiEye className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{item.views || 0} views</span>
                          </div>
                          {item.is_prestasi && (
                            <div className="flex items-center space-x-1">
                              <FiAward className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-600">Prestasi</span>
                            </div>
                          )}
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 transition-colors">
                          <FiShare2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Popup */}
      {selectedBerita && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedBerita(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedBerita(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all hover:rotate-90 duration-300 z-10"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>

            {/* Header with Image */}
            {(selectedBerita.gambar_url || selectedBerita.gambar) && (
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <Image
                  src={selectedBerita.gambar_url || selectedBerita.gambar || ''}
                  alt={selectedBerita.judul}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedBerita.is_prestasi 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {selectedBerita.is_prestasi ? '🏆 Prestasi' : '📰 Berita'}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedBerita.judul}
              </h2>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUser className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{selectedBerita.penulis}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="w-5 h-5 text-blue-600" />
                  <span>
                    {new Date(selectedBerita.tanggal || selectedBerita.tanggal_publish || '').toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {selectedBerita.views !== undefined && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiEye className="w-5 h-5 text-green-600" />
                    <span>{selectedBerita.views.toLocaleString()} views</span>
                  </div>
                )}
                {selectedBerita.kategori && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {selectedBerita.kategori}
                    </span>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedBerita.isi || selectedBerita.konten || 'Konten tidak tersedia'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-100 flex justify-between items-center">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                  <FiHeart className="w-5 h-5" />
                  <span className="font-medium">Suka</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                  <FiShare2 className="w-5 h-5" />
                  <span className="font-medium">Bagikan</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedBerita(null)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl transition-all hover:shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}