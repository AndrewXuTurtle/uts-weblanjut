"use client";

import { useState, useEffect } from "react";
import { FiDownload, FiEye, FiFileText, FiX, FiSearch } from "react-icons/fi";

interface Peraturan {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  jenis: string;
  file_url: string;
  file_name: string;
  file_size: string;
  urutan: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PeraturanData {
  Akademik: Peraturan[];
  Kemahasiswaan: Peraturan[];
  Administratif: Peraturan[];
  Keuangan: Peraturan[];
}

export default function PeraturanPage() {
  const [peraturanData, setPeraturanData] = useState<PeraturanData>({
    Akademik: [],
    Kemahasiswaan: [],
    Administratif: [],
    Keuangan: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<keyof PeraturanData>("Akademik");
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPeraturan();
  }, []);

  const fetchPeraturan = async () => {
    try {
      const response = await fetch("/api/peraturan");
      const result = await response.json();

      if (result.success) {
        setPeraturanData(result.data);
      }
    } catch (error) {
      console.error("Error fetching peraturan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (url: string) => {
    setPdfViewUrl(url);
  };

  const handleDownloadPDF = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closePDFViewer = () => {
    setPdfViewUrl(null);
  };

  const filteredPeraturan = peraturanData[activeTab].filter((item) =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: Array<keyof PeraturanData> = ["Akademik", "Kemahasiswaan", "Administratif", "Keuangan"];

  const getTabColor = (tab: string) => {
    switch (tab) {
      case "Akademik":
        return "from-blue-500 to-cyan-500";
      case "Kemahasiswaan":
        return "from-purple-500 to-pink-500";
      case "Administratif":
        return "from-green-500 to-teal-500";
      case "Keuangan":
        return "from-orange-500 to-red-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

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
              <FiFileText className="text-blue-200" />
              <span className="text-sm font-medium">Dokumen Peraturan</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Peraturan & Dokumen
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Kumpulan peraturan dan dokumen penting Program Studi
              <span className="font-semibold text-white"> Teknik Perangkat Lunak</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari peraturan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-lg p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? `bg-gradient-to-r ${getTabColor(tab)} text-white shadow-lg transform scale-105`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPeraturan.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchQuery ? "Tidak ada hasil yang ditemukan" : "Belum ada peraturan tersedia"}
                </p>
              </div>
            ) : (
              filteredPeraturan.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${getTabColor(activeTab)}`}>
                            <FiFileText className="text-2xl text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {item.judul}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTabColor(activeTab)}`}>
                                {item.jenis}
                              </span>
                              <span className="text-sm text-gray-500">
                                {item.file_size}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {item.deskripsi}
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleViewPDF(item.file_url)}
                            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getTabColor(activeTab)} text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold`}
                          >
                            <FiEye className="text-lg" />
                            Lihat PDF
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(item.file_url, item.file_name)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 hover:shadow-lg transition-all duration-300 font-semibold"
                          >
                            <FiDownload className="text-lg" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {pdfViewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">PDF Viewer</h3>
              <button
                onClick={closePDFViewer}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="text-2xl text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={pdfViewUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
