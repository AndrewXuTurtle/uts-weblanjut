# Dokumentasi Website Prodi Teknik Perangkat Lunak

## 📋 Informasi Umum

**Nama Aplikasi**: Website Prodi Teknik Perangkat Lunak  
**Framework**: Next.js 15.5.0 (App Router)  
**Backend API**: Laravel 12.x (http://127.0.0.1:8000/api)  
**Database**: MySQL via Laravel  
**Styling**: TailwindCSS  

---

## 📁 Struktur Halaman & API

### 1. **Beranda** (`/beranda`)
- **Deskripsi**: Halaman utama website prodi
- **API**: Tidak menggunakan API eksternal
- **Tampilan**: Hero section, fitur prodi, statistik singkat

### 2. **Dosen** (`/dosen`)
- **API**: `GET /api/dosen` → Laravel API `/dosen`
- **Response**: Paginated list dosen dengan foto, NIDN, jabatan, pendidikan, bidang keahlian
- **Tampilan**: 
  - Grid cards dengan foto bulat di atas (120x120px)
  - Informasi: Jabatan, Pendidikan, Bidang Keahlian, Status
  - Modal popup untuk detail lengkap (kontak, link akademik)
- **Fitur**: Click card untuk modal detail

### 3. **Mahasiswa** (`/mahasiswa`)
- **API**: `GET /api/mahasiswa` → Laravel API `/mahasiswa`
- **Response**: Paginated list mahasiswa dengan NIM, nama, prodi, angkatan
- **Tampilan**: 
  - Grid cards mahasiswa dengan foto
  - Filter search dan angkatan
  - Detail page (`/mahasiswa/[id]`) untuk profil lengkap

### 4. **Penelitian** (`/penelitian`)
- **API**: `GET /api/penelitian` → Laravel API `/penelitian`
- **Response**: List penelitian dengan judul, deskripsi, status, tahun, dana, dosen
- **Tampilan**:
  - Grid cards dengan badge status
  - Modal popup (gradient hijau/biru) menampilkan:
    - Deskripsi penelitian
    - Info cards: Tahun, Dana (Rp), Dosen peneliti, Status progress

### 5. **PKM** (`/pkm`)
- **API**: `GET /api/pkm` → Laravel API `/pkm`
- **Response**: List PKM dengan judul, jenis PKM, status, dana, dosen, mahasiswa (array)
- **Tampilan**:
  - Grid cards dengan badge jenis PKM
  - Modal popup (gradient biru) menampilkan:
    - Deskripsi program
    - Info cards: Tahun, Dana, Dosen pembimbing
    - Grid tim mahasiswa (nama, NIM)

### 6. **Berita** (`/berita`)
- **API**: `GET /api/berita` → Laravel API `/berita`
- **Response**: List berita dengan gambar, judul, kategori, penulis, tanggal, views
- **Tampilan**:
  - Grid cards dengan gambar header
  - Badge kategori (Prestasi/Berita)
  - Modal popup menampilkan:
    - Image header dengan gradient overlay
    - Meta info: penulis, tanggal, views, kategori
    - Konten artikel dengan prose styling

### 7. **Pengumuman** (`/pengumuman`)
- **API**: `GET /api/pengumuman` → Laravel API `/pengumuman`
- **Response**: List pengumuman dengan judul, isi, prioritas, tanggal, penulis
- **Tampilan**:
  - Grid cards dengan badge prioritas (tinggi/sedang/rendah)
  - Modal popup (gradient biru) menampilkan:
    - Isi pengumuman lengkap
    - Info cards: Tanggal mulai, tanggal selesai, penulis

### 8. **Agenda** (`/agenda`)
- **API**: `GET /api/agenda` → Laravel API `/agenda`
- **Response**: List agenda dengan judul, deskripsi, tanggal, lokasi, kategori, penyelenggara
- **Tampilan**:
  - Grid cards dengan status dinamis (Mendatang/Sedang Berlangsung/Selesai)
  - Modal popup (gradient biru) menampilkan:
    - Deskripsi agenda
    - Info cards: Tanggal pelaksanaan, Lokasi, Penyelenggara, Kontak
    - Status badge aktif

### 9. **Tracer Study** (`/tracer-study`)
- **API**: 
  - `GET /api/tracer-study-statistics` → Laravel API `/tracer-study-statistics`
  - `GET /api/tracer-study-testimonials` → Laravel API `/tracer-study-testimonials`
- **Response**: Statistik agregat (employment rate, gaji, kepuasan, kesesuaian, top companies)
- **Tampilan**:
  - Hero section dengan 4 summary cards: Total Responden, Employment Rate, Rata-rata Gaji, Kepuasan Prodi
  - **Progress Bar Kesesuaian Bidang Studi** dengan warna:
    - Hijau: Sangat Sesuai
    - Biru: Sesuai
    - Kuning: Cukup Sesuai
    - Orange: Kurang Sesuai
  - Grid **Waktu Tunggu Kerja** (0-3, 4-6, 7-12, >12 bulan) dengan persentase
  - Ranking **Top Companies** tempat alumni bekerja
  - Grid **Status Pekerjaan** (Full Time, Wiraswasta, Freelancer)
  - **Profil Karir Alumni** dengan kompetensi yang didapat

### 10. **Mata Kuliah** (`/matakuliah`)
- **API**: `GET /api/matakuliah` → Laravel API `/matakuliah`
- **Response**: List mata kuliah dengan kode, nama, SKS, semester, jenis
- **Tampilan**: Grid cards mata kuliah dengan info SKS dan semester

### 11. **Profil** (`/profil`)
- **API**: `GET /api/profil-prodi` → Laravel API `/profil-prodi`
- **Response**: Informasi prodi (visi, misi, sejarah, akreditasi)
- **Tampilan**: Halaman profil lengkap prodi

---

## 🎨 Design Pattern

### Modal Popup (Detail View)
Semua halaman utama menggunakan **modal popup** untuk detail alih-alih halaman terpisah:
- **Keuntungan**: Lebih cepat, tidak perlu navigasi page
- **Fitur**: Click outside/tombol X untuk close
- **Animasi**: fadeIn (0.2s) + slideUp (0.3s)
- **Tema Warna**: Semua menggunakan gradient **blue-500 to indigo-600** (unified theme)

### API Integration Pattern
```typescript
// Proxy Pattern (Dosen only)
/api/dosen → Next.js API Route → Laravel /dosen

// Direct Call Pattern (Others)
getBerita() → fetch Laravel directly → Response
```

### Response Handling
```typescript
// Paginated Response
const data = response.data?.data || response.data || []

// Statistics Response  
const stats = response.data
```

---

## 📊 Fitur Visualisasi Data

### Tracer Study
- **Progress Bars**: Kesesuaian bidang studi dengan persentase
- **Grid Cards**: Waktu tunggu kerja dengan distribusi
- **Ranking List**: Top companies dengan jumlah alumni
- **Summary Cards**: KPI utama (Employment Rate, Gaji, Kepuasan)

### Status Badges
- **Penelitian**: Selesai (hijau), Sedang Berjalan (kuning)
- **PKM**: Selesai (hijau), Didanai (kuning), Diajukan (biru)
- **Agenda**: Mendatang (biru), Berlangsung (hijau), Selesai (abu)
- **Pengumuman**: Prioritas tinggi (merah), sedang (kuning), rendah (hijau)

---

## 🔧 Teknologi

- **Frontend**: Next.js 15.5.0, React 19, TypeScript
- **Styling**: TailwindCSS
- **Icons**: react-icons (Feather Icons)
- **Images**: next/image dengan remote patterns
- **Animation**: CSS-in-JS transitions
- **API Client**: Native fetch API
- **State Management**: React useState/useEffect

---

## 📝 Catatan Penting

1. **Semua modal menggunakan tema biru** untuk konsistensi
2. **API calls tidak menggunakan filter tahun** - data ditampilkan menyeluruh
3. **Image optimization** via next/image dengan remote patterns Laravel
4. **Responsive design** - Mobile-first approach
5. **No server-side rendering** untuk data dinamis - menggunakan client-side fetching

---

## 🚀 Build Information

- **Total Routes**: 44 (16 pages + 28 API routes)
- **Build Time**: ~2 detik
- **Bundle Size**: ~102 kB (First Load JS)
- **Static Pages**: 16 prerendered
- **Dynamic Routes**: 28 API endpoints

---

**Dibuat untuk**: UAS Web Lanjut  
**Tanggal**: November 2025
