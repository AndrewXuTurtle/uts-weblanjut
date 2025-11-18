"use client";

import { useState, useEffect } from "react";
import { FiBook, FiSearch, FiCheckCircle, FiClock, FiAward } from "react-icons/fi";
import { getMatakuliah } from '@/lib/api';

interface Matakuliah {
  mk_id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  program_studi: string;
  kurikulum_tahun: string;
  deskripsi_singkat: string;
  status_wajib: number;
  created_at: string;
  updated_at: string;
}

export default function MatakuliahPage() {
  const [data, setData] = useState<Matakuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [selectedJenis, setSelectedJenis] = useState<string>("all");

  useEffect(() => {
    fetchMatakuliah();
  }, []);

  const fetchMatakuliah = async () => {
    try {
      const response = await getMatakuliah();
      if (response.success) {
        const matakuliahData = response.data || [];
        setData(Array.isArray(matakuliahData) ? matakuliahData : []);
      } else {
        console.error("Failed to fetch matakuliah");
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching matakuliah:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((mk) => {
    const matchesSearch =
      mk.nama_mk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mk.kode_mk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mk.deskripsi_singkat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemester === "all" || mk.semester === selectedSemester;
    const matchesJenis =
      selectedJenis === "all" ||
      (selectedJenis === "wajib" && mk.status_wajib === 1) ||
      (selectedJenis === "pilihan" && mk.status_wajib === 0);
    return matchesSearch && matchesSemester && matchesJenis;
  });

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const totalSKS = data.reduce((sum, mk) => sum + mk.sks, 0);
  const totalWajib = data.filter((mk) => mk.status_wajib === 1).length;
  const totalPilihan = data.filter((mk) => mk.status_wajib === 0).length;

  // Group by semester
  const groupedBySemester: { [key: number]: Matakuliah[] } = {};
  filteredData.forEach((mk) => {
    if (!groupedBySemester[mk.semester]) {
      groupedBySemester[mk.semester] = [];
    }
    groupedBySemester[mk.semester].push(mk);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
              <FiBook className="text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Kurikulum Mata Kuliah
            </h1>
            <p className="text-lg md:text-xl text-blue-50 max-w-3xl mx-auto">
              Program Studi Teknik Perangkat Lunak - Kurikulum 2024
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <FiBook className="w-12 h-12 mx-auto mb-3 text-blue-100" />
              <div className="text-3xl font-bold mb-1">{data.length}</div>
              <div className="text-sm text-blue-100">Total Mata Kuliah</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <FiCheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
              <div className="text-3xl font-bold mb-1">{totalWajib}</div>
              <div className="text-sm text-blue-100">Mata Kuliah Wajib</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <FiAward className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
              <div className="text-3xl font-bold mb-1">{totalPilihan}</div>
              <div className="text-sm text-blue-100">Mata Kuliah Pilihan</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <FiClock className="w-12 h-12 mx-auto mb-3 text-cyan-300" />
              <div className="text-3xl font-bold mb-1">{totalSKS}</div>
              <div className="text-sm text-blue-100">Total SKS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari mata kuliah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value === "all" ? "all" : parseInt(e.target.value))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            {/* Jenis Filter */}
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Jenis</option>
              <option value="wajib">Wajib</option>
              <option value="pilihan">Pilihan</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan <span className="font-semibold text-blue-600">{filteredData.length}</span> mata kuliah
          </p>
        </div>

        {/* Mata Kuliah List by Semester */}
        {Object.keys(groupedBySemester)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((semester) => {
            const matakuliah = groupedBySemester[parseInt(semester)];
            const semesterSKS = matakuliah.reduce((sum, mk) => sum + mk.sks, 0);

            return (
              <div key={semester} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg">
                      Semester {semester}
                    </span>
                    <span className="text-base font-normal text-gray-600">
                      {matakuliah.length} Mata Kuliah • {semesterSKS} SKS
                    </span>
                  </h2>
                </div>

                <div className="grid gap-4">
                  {matakuliah.map((mk) => (
                    <div
                      key={mk.mk_id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                                <FiBook className="text-2xl text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-xl font-bold text-gray-800">{mk.nama_mk}</h3>
                                  {mk.status_wajib === 1 ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500">
                                      Wajib
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-600">
                                      Pilihan
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="font-semibold text-blue-600">{mk.kode_mk}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <FiClock className="text-lg" />
                                    {mk.sks} SKS
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{mk.deskripsi_singkat}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {filteredData.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada mata kuliah yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
