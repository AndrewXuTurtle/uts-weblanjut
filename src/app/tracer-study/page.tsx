"use client";

import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiDollarSign, FiClock, FiAward, FiMessageSquare, FiBarChart2, FiStar, FiUser } from 'react-icons/fi';
import { getTracerStudy, getTracerStudyStatistics, getTracerStudyTestimonials } from '@/lib/api';

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FiUsers className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <div className="text-3xl font-bold mb-2">{statistics.total_respondents}</div>
                <div className="text-blue-100">Total Responden</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FiBriefcase className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
                <div className="text-3xl font-bold mb-2">{statistics.employment_rate || 0}%</div>
                <div className="text-blue-100">Employment Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <FiStar className="w-12 h-12 mx-auto mb-4 text-purple-200" />
                <div className="text-3xl font-bold mb-2">
                  {statistics.avg_kepuasan_prodi !== null && statistics.avg_kepuasan_prodi !== undefined 
                    ? Number(statistics.avg_kepuasan_prodi).toFixed(1) 
                    : 'N/A'}/5
                </div>
                <div className="text-blue-100">Kepuasan Prodi</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {statistics && (
          <>
            {/* Status Pekerjaan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <FiBriefcase className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Status Pekerjaan Alumni</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(statistics.status_pekerjaan).map(([key, value]) => (
                  <div key={key} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
                    <div className="text-sm text-gray-600">{getStatusPekerjaanLabel(key)}</div>
                  </div>
                ))}
              </div>
            </div>

        {/* Testimonials */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <FiMessageSquare className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Saran Alumni untuk Prodi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <FiUser className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.mahasiswa?.nama || 'Alumni'}</h3>
                    <p className="text-sm text-gray-600">NIM: {item.nim}</p>
                    {item.posisi && item.nama_perusahaan && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.posisi} - {item.nama_perusahaan}
                      </p>
                    )}
                  </div>
                </div>

                {item.saran_prodi && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                    <p className="text-sm text-gray-700">{item.saran_prodi}</p>
                  </div>
                )}
                
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                  <div>Status: {item.status_pekerjaan}</div>
                  {item.gaji && <div>Gaji: Rp {item.gaji.toLocaleString('id-ID')}</div>}
                </div>
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
