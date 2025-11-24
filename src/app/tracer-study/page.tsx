"use client";

import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiDollarSign, FiClock, FiAward, FiStar, FiUser } from 'react-icons/fi';
import { getTracerStudyStatistics, getTracerStudyTestimonials } from '@/lib/api';

interface Mahasiswa {
  nim: string;
  nama: string;
}

interface TracerStudy {
  id: number;
  nim: string;
  mahasiswa?: Mahasiswa; // Eager loaded
  tahun_survey: number;
  status_pekerjaan: string; // Bekerja Full Time, Wiraswasta, Melanjutkan Studi, Freelancer, Belum Bekerja
  nama_perusahaan?: string;
  posisi?: string;
  bidang_pekerjaan?: string;
  gaji?: number;
  waktu_tunggu_kerja?: number;
  kesesuaian_bidang_studi: string; // Sesuai, Tidak Sesuai
  kepuasan_prodi: number; // 1-5
  saran_prodi?: string;
  kompetensi_didapat?: string;
  saran_pengembangan?: string;
}

interface Statistics {
  total_respondents: number;
  status_pekerjaan: Record<string, number>;
  avg_kepuasan_prodi?: number;
  employment_rate?: number;
  avg_gaji?: number;
  avg_waktu_tunggu_kerja?: number;
  kesesuaian_bidang_studi?: Record<string, number>;
  waktu_tunggu_kerja_distribution?: Record<string, number>;
  top_companies?: Array<{ nama_perusahaan: string; total: number }>;
}

export default function TracerStudyPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [testimonials, setTestimonials] = useState<TracerStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("2024");

  const fetchData = async (year: string) => {
    setLoading(true);
    try {
      const [statsResponse, testimonialsResponse] = await Promise.all([
        getTracerStudyStatistics({ tahun_survey: parseInt(year) }),
        getTracerStudyTestimonials()
      ]);

      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }
      
      if (testimonialsResponse.success) {
        const testimonialsData = testimonialsResponse.data?.data || testimonialsResponse.data || [];
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const formatCurrency = (value: string | null) => {
    if (!value) return 'N/A';
    return `Rp ${parseFloat(value).toLocaleString('id-ID')}`;
  };

  const formatPercentage = (value: string | null) => {
    if (!value) return 'N/A';
    return parseFloat(value).toFixed(1);
  };

  const getStatusPekerjaanLabel = (key: string) => {
    const labels: Record<string, string> = {
      'bekerja_full_time': 'Bekerja Full Time',
      'bekerja_part_time': 'Bekerja Part Time',
      'wiraswasta': 'Wiraswasta',
      'melanjutkan_studi': 'Melanjutkan Studi',
      'tidak_bekerja': 'Tidak Bekerja',
      'freelance': 'Freelance'
    };
    return labels[key] || key;
  };

  const getWaktuTungguLabel = (key: string) => {
    const labels: Record<string, string> = {
      'kurang_3_bulan': '< 3 Bulan',
      '3_6_bulan': '3-6 Bulan',
      '6_12_bulan': '6-12 Bulan',
      'lebih_12_bulan': '> 12 Bulan',
      'belum_bekerja': 'Belum Bekerja'
    };
    return labels[key] || key;
  };

  const getKesesuaianLabel = (key: string) => {
    const labels: Record<string, string> = {
      'sangat_sesuai': 'Sangat Sesuai',
      'sesuai': 'Sesuai',
      'cukup_sesuai': 'Cukup Sesuai',
      'kurang_sesuai': 'Kurang Sesuai',
      'tidak_sesuai': 'Tidak Sesuai'
    };
    return labels[key] || key;
  };

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
              <FiBriefcase className="text-blue-200" />
              <span className="text-sm font-medium">Karir Alumni</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Tracer Study
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Pelacakan karir dan perkembangan alumni
              <span className="font-semibold text-white"> Teknik Perangkat Lunak</span>
            </p>
          </div>

          {/* Year Selector */}
          <div className="flex justify-center mb-8">
            <select
              className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2024" className="text-gray-900">Tahun 2024</option>
              <option value="2023" className="text-gray-900">Tahun 2023</option>
              <option value="2022" className="text-gray-900">Tahun 2022</option>
            </select>
          </div>

          {/* Main Statistics */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <FiUsers className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <div className="text-4xl font-bold mb-2">{statistics.total_respondents}</div>
                <div className="text-blue-100 text-sm">Total Responden</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <FiBriefcase className="w-12 h-12 mx-auto mb-4 text-green-200" />
                <div className="text-4xl font-bold mb-2">{statistics.employment_rate || 0}%</div>
                <div className="text-blue-100 text-sm">Employment Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <FiDollarSign className="w-12 h-12 mx-auto mb-4 text-yellow-200" />
                <div className="text-4xl font-bold mb-2">
                  {statistics.avg_gaji ? `${(statistics.avg_gaji / 1000000).toFixed(1)}Jt` : 'N/A'}
                </div>
                <div className="text-blue-100 text-sm">Rata-rata Gaji</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <FiStar className="w-12 h-12 mx-auto mb-4 text-purple-200" />
                <div className="text-4xl font-bold mb-2">
                  {statistics.avg_kepuasan_prodi !== null && statistics.avg_kepuasan_prodi !== undefined 
                    ? Number(statistics.avg_kepuasan_prodi).toFixed(1) 
                    : 'N/A'}/5
                </div>
                <div className="text-blue-100 text-sm">Kepuasan Prodi</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {statistics && (
          <>
            {/* Kesesuaian Bidang Studi */}
            {statistics.kesesuaian_bidang_studi && Object.keys(statistics.kesesuaian_bidang_studi).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center mb-6">
                  <FiAward className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Kesesuaian Bidang Studi dengan Pekerjaan</h2>
                </div>
                <div className="space-y-4">
                  {Object.entries(statistics.kesesuaian_bidang_studi).map(([key, value]) => {
                    const percentage = statistics.total_respondents > 0 
                      ? ((value / statistics.total_respondents) * 100).toFixed(1) 
                      : 0;
                    const colorClass = key === 'Sangat Sesuai' ? 'bg-green-500' :
                                      key === 'Sesuai' ? 'bg-blue-500' :
                                      key === 'Cukup Sesuai' ? 'bg-yellow-500' :
                                      key === 'Kurang Sesuai' ? 'bg-orange-500' : 'bg-red-500';
                    
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">{key}</span>
                          <span className="text-gray-600 text-sm">
                            {value} alumni ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Waktu Tunggu Kerja */}
            {statistics.waktu_tunggu_kerja_distribution && Object.keys(statistics.waktu_tunggu_kerja_distribution).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center mb-6">
                  <FiClock className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Waktu Tunggu Mendapat Pekerjaan</h2>
                  {statistics.avg_waktu_tunggu_kerja && (
                    <span className="ml-auto text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                      Rata-rata: {statistics.avg_waktu_tunggu_kerja} bulan
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(statistics.waktu_tunggu_kerja_distribution).map(([key, value]) => {
                    const percentage = statistics.total_respondents > 0 
                      ? ((value / statistics.total_respondents) * 100).toFixed(0) 
                      : 0;
                    const label = key.replace(/_/g, ' ').replace(/bulan/g, 'Bulan');
                    
                    return (
                      <div key={key} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">{value}</div>
                        <div className="text-sm text-gray-600 mb-1 capitalize">{label}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Companies */}
            {statistics.top_companies && statistics.top_companies.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center mb-6">
                  <FiTrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Top Perusahaan Alumni Bekerja</h2>
                </div>
                <div className="space-y-3">
                  {statistics.top_companies.slice(0, 10).map((company, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{company.nama_perusahaan}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{company.total}</div>
                        <div className="text-xs text-gray-500">alumni</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Status Pekerjaan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <FiBriefcase className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Status Pekerjaan Alumni</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(statistics.status_pekerjaan).map(([key, value]) => {
                  const percentage = statistics.total_respondents > 0 
                    ? ((value / statistics.total_respondents) * 100).toFixed(0) 
                    : 0;
                  return (
                    <div key={key} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-shadow">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{value}</div>
                      <div className="text-sm text-gray-700 font-medium mb-1">{getStatusPekerjaanLabel(key)}</div>
                      <div className="text-xs text-gray-500">{percentage}% dari total</div>
                    </div>
                  );
                })}
              </div>
            </div>

        {/* Alumni Success Stories */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <FiAward className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Profil Karir Alumni</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-3 shadow-lg">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.mahasiswa?.nama || 'Alumni'}</h3>
                    <p className="text-xs text-gray-500">NIM: {item.nim}</p>
                  </div>
                </div>

                {item.posisi && item.nama_perusahaan && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-indigo-100">
                    <div className="flex items-start gap-2 mb-2">
                      <FiBriefcase className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.posisi}</p>
                        <p className="text-xs text-gray-600">{item.nama_perusahaan}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {item.gaji && (
                    <div className="flex items-center gap-2 text-sm">
                      <FiDollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-700">Rp {item.gaji.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {item.waktu_tunggu_kerja !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <FiClock className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-600">Tunggu kerja: {item.waktu_tunggu_kerja} bulan</span>
                    </div>
                  )}
                  {item.kesesuaian_bidang_studi && (
                    <div className="flex items-center gap-2 text-sm">
                      <FiAward className="w-4 h-4 text-purple-600" />
                      <span className={`font-medium ${
                        item.kesesuaian_bidang_studi === 'Sangat Sesuai' ? 'text-green-600' :
                        item.kesesuaian_bidang_studi === 'Sesuai' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {item.kesesuaian_bidang_studi}
                      </span>
                    </div>
                  )}
                </div>

                {item.kompetensi_didapat && (
                  <div className="mt-4 pt-4 border-t border-indigo-100">
                    <p className="text-xs text-gray-500 mb-1">Kompetensi:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{item.kompetensi_didapat}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
