/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * API Client for UTS Web Lanjut
 * Base URL: http://localhost:8000/api
 * 
 * This client normalizes different response formats from the Laravel backend
 * and provides type-safe methods for all API endpoints.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Generic fetch wrapper that normalizes API responses
 * Handles different response formats:
 * - Direct arrays (dosen, matakuliah)
 * - Direct pagination objects (berita, pengumuman, agenda, galeri)
 * - Success wrapper with data (mahasiswa, penelitian, prestasi, etc.)
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Normalize response format
    if (data.success !== undefined) {
      return data; // Already has success wrapper
    } else if (Array.isArray(data)) {
      return { success: true, data } as T; // Wrap direct arrays
    } else if (data.current_page && data.data) {
      return { success: true, data } as T; // Wrap pagination objects
    }

    return { success: true, data } as T;
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

// ============================================================================
// CORE RESOURCES
// ============================================================================

/**
 * DOSEN API
 */
export const getDosen = (params?: { search?: string; status?: string }) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/dosen${query}`);
};

export const getDosenById = (id: number) => {
  return fetchAPI<any>(`/dosen/${id}`);
};

/**
 * MAHASISWA API
 */
export const getMahasiswa = (params?: {
  search?: string;
  status?: string;
  tahun_masuk?: number;
  kelas?: string;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/mahasiswa${query}`);
};

export const getMahasiswaById = (id: number) => {
  return fetchAPI<any>(`/mahasiswa/${id}`);
};

/**
 * ALUMNI API
 */
export const getAlumni = (params?: { search?: string; pekerjaan_saat_ini?: string }) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/alumni${query}`);
};

export const getAlumniStatistics = () => {
  return fetchAPI<any>('/alumni-statistics');
};

/**
 * PROJECT API
 */
export const getProject = (params?: {
  search?: string;
  tahun?: number;
  kategori?: string;
  status?: string;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/project${query}`);
};

export const getProjectById = (id: number) => {
  return fetchAPI<any>(`/project/${id}`);
};

/**
 * MATAKULIAH API
 */
export const getMatakuliah = (params?: {
  search?: string;
  semester?: number;
  status_wajib?: boolean;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/matakuliah${query}`);
};

/**
 * PROFIL PRODI API
 */
export const getProfilProdi = () => {
  return fetchAPI<any>('/profil-prodi');
};

// ============================================================================
// CONTENT MANAGEMENT
// ============================================================================

/**
 * BERITA API
 */
export const getBerita = (params?: {
  search?: string;
  is_prestasi?: boolean;
  kategori?: string;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/berita${query}`);
};

export const getBeritaById = (id: number) => {
  return fetchAPI<any>(`/berita/${id}`);
};

/**
 * PENGUMUMAN API
 */
export const getPengumuman = (params?: { prioritas?: string; aktif?: boolean }) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/pengumuman${query}`);
};

/**
 * AGENDA API
 */
export const getAgenda = (params?: {
  kategori?: string;
  upcoming?: boolean;
  aktif?: boolean;
  month?: number;
  year?: number;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/agenda${query}`);
};

/**
 * GALERI API
 */
export const getGaleri = (params?: { kategori?: string; tampilkan_di_home?: boolean }) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/galeri${query}`);
};

export const getGaleriByKategori = (kategori: string) => {
  return fetchAPI<any>(`/galeri-kategori/${kategori}`);
};

/**
 * PERATURAN API
 */
export const getPeraturan = (params?: {
  kategori?: string;
  jenis?: string;
  include_inactive?: boolean;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/peraturan${query}`);
};

export const getPeraturanByKategori = (kategori: string) => {
  return fetchAPI<any>(`/peraturan-kategori/${kategori}`);
};

export const getPeraturanById = (id: number) => {
  return fetchAPI<any>(`/peraturan/${id}`);
};

// ============================================================================
// RESEARCH & PROJECTS
// ============================================================================

/**
 * PENELITIAN API
 */
export const getPenelitian = (params?: {
  search?: string;
  tahun?: number;
  status?: string;
  jenis_penelitian?: string;
  ketua_peneliti_id?: number;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/penelitian${query}`);
};

export const getPenelitianByDosen = (dosenId: number) => {
  return fetchAPI<any>(`/penelitian-dosen/${dosenId}`);
};

export const getPenelitianStatistics = () => {
  return fetchAPI<any>('/penelitian-statistics');
};

/**
 * PKM API
 */
export const getPKM = (params?: {
  search?: string;
  tahun?: number;
  jenis_pkm?: string;
  status?: string;
  dosen_pembimbing_id?: number;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/pkm${query}`);
};

export const getPKMByDosen = (dosenId: number) => {
  return fetchAPI<any>(`/pkm-dosen/${dosenId}`);
};

export const getPKMByMahasiswa = (mahasiswaId: number) => {
  return fetchAPI<any>(`/pkm-mahasiswa/${mahasiswaId}`);
};

export const getPKMStatistics = () => {
  return fetchAPI<any>('/pkm-statistics');
};

// ============================================================================
// ALUMNI & ACHIEVEMENTS
// ============================================================================

/**
 * KISAH SUKSES API
 */
export const getKisahSukses = (params?: {
  search?: string;
  status?: string;
  tahun_pencapaian?: number;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/kisah-sukses${query}`);
};

export const getKisahSuksesFeatured = () => {
  return fetchAPI<any>('/kisah-sukses-featured');
};

export const getKisahSuksesStatistics = () => {
  return fetchAPI<any>('/kisah-sukses-statistics');
};

/**
 * TRACER STUDY API
 */
export const getTracerStudy = (params?: {
  tahun_survey?: number;
  status_pekerjaan?: string;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/tracer-study${query}`);
};

export const getTracerStudyStatistics = (params?: { tahun_survey?: number }) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/tracer-study-statistics${query}`);
};

export const getTracerStudyTestimonials = () => {
  return fetchAPI<any>('/tracer-study-testimonials');
};

/**
 * PRESTASI API
 */
export const getPrestasi = (params?: {
  search?: string;
  tingkat?: string;
  jenis?: string;
  tahun?: number;
}) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchAPI<any>(`/prestasi${query}`);
};

export const getPrestasiStatistics = () => {
  return fetchAPI<any>('/prestasi/statistics');
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Build query string from params object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

/**
 * Generic API fetcher for use with SWR or React Query
 */
export const apiFetcher = (url: string) => fetch(url).then((res) => res.json());

export default fetchAPI;
