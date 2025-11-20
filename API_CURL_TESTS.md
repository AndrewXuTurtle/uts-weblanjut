# 🧪 API Testing with cURL

## Quick Test Commands

### 📰 Berita (News)
```bash
# List all berita with pagination
curl -s "http://127.0.0.1:8000/api/berita?per_page=5" | jq '.success, .data.total'

# Filter berita by date
curl -s "http://127.0.0.1:8000/api/berita?tanggal_dari=2025-10-01&tanggal_sampai=2025-10-31" | jq '.data.data[].judul'

# Search berita
curl -s "http://127.0.0.1:8000/api/berita?search=workshop" | jq '.data.data[] | {judul, tanggal}'

# Get single berita
curl -s "http://127.0.0.1:8000/api/berita/2" | jq '.data.judul'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "data": [{
      "id": 2,
      "judul": "Kerjasama Industri dengan PT Garuda Technology",
      "isi": "Program Studi Teknik Informatika...",
      "gambar": null,
      "gambar_url": null,
      "penulis": "Humas TI",
      "tanggal": "2025-10-18",
      "is_prestasi": false
    }],
    "current_page": 1,
    "total": 6
  }
}
```

---

### 📚 Kurikulum (Curriculum)
```bash
# List all mata kuliah
curl -s "http://127.0.0.1:8000/api/kurikulum?per_page=5" | jq '.success, .data.total'

# Filter by semester
curl -s "http://127.0.0.1:8000/api/kurikulum?semester=3" | jq '.data.data[] | {kode_matkul, nama_matkul, sks}'

# Get mata kuliah by semester endpoint
curl -s "http://127.0.0.1:8000/api/kurikulum-semester/1" | jq '.data[] | {kode_matkul, nama_matkul}'

# Get statistics
curl -s "http://127.0.0.1:8000/api/kurikulum-statistics" | jq '.data | {total_matkul, total_sks}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "data": [{
      "id": 1,
      "kode_matkul": "TPL101",
      "nama_matkul": "Dasar Pemrograman",
      "semester": 1,
      "sks": 4,
      "deskripsi": "Mata kuliah pengenalan konsep dasar pemrograman..."
    }],
    "total": 24
  }
}
```

**Statistics Response:**
```json
{
  "success": true,
  "data": {
    "total_matkul": 24,
    "total_sks": 76,
    "by_semester": [
      {"semester": 1, "total_matkul": 8, "total_sks": 20},
      {"semester": 2, "total_matkul": 7, "total_sks": 18}
    ]
  }
}
```

---

### 💼 Project Mahasiswa
```bash
# List all projects
curl -s "http://127.0.0.1:8000/api/project?per_page=3" | jq '.data[] | {judul_project, mahasiswa: .mahasiswa.nama, teknologi}'

# Filter by kategori
curl -s "http://127.0.0.1:8000/api/project?kategori=Website" | jq '.data[] | {id, judul_project}'

# Filter by tahun
curl -s "http://127.0.0.1:8000/api/project?tahun_selesai=2025" | jq '.data[] | .judul_project'

# Get single project with images
curl -s "http://127.0.0.1:8000/api/project/2" | jq '.data | {judul_project, cover_image_url, galeri_urls}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": [{
    "id": 2,
    "nim": "20210005",
    "mahasiswa": {
      "nim": "20210005",
      "nama": "Rizki Pratama",
      "email": "rizki.pratama@student.tpl.ac.id"
    },
    "judul_project": "Portal Management System",
    "cover_image_url": "http://127.0.0.1:8000/storage/projects/cover.png",
    "galeri_urls": ["http://127.0.0.1:8000/storage/projects/img1.png"],
    "teknologi": "Java, Python, React",
    "tahun_selesai": 2025
  }]
}
```

---

### 🎓 Tracer Study
```bash
# List all tracer study
curl -s "http://127.0.0.1:8000/api/tracer-study?per_page=3" | jq '.data.data[] | {nama: .alumni.nama, posisi, gaji}'

# Filter by status pekerjaan
curl -s "http://127.0.0.1:8000/api/tracer-study?status_pekerjaan=Bekerja%20Full%20Time" | jq '.data.data[] | {nama: .alumni.nama, perusahaan: .nama_perusahaan}'

# Filter by kesesuaian
curl -s "http://127.0.0.1:8000/api/tracer-study?kesesuaian_bidang_studi=Sangat%20Sesuai" | jq '.data.data[] | .alumni.nama'

# Filter by gaji range
curl -s "http://127.0.0.1:8000/api/tracer-study?gaji_min=5000000&gaji_max=10000000" | jq '.data.data[] | {nama: .alumni.nama, gaji}'

# Get statistics
curl -s "http://127.0.0.1:8000/api/tracer-study-statistics" | jq '.data | {total_respondents, avg_gaji, employment_rate}'

# Get testimonials
curl -s "http://127.0.0.1:8000/api/tracer-study-testimonials" | jq '.data[] | {nama: .alumni.nama, saran_prodi}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "data": [{
      "id": 4,
      "nim": "20210004",
      "alumni": {
        "nim": "20210004",
        "nama": "Dewi Lestari",
        "foto_url": null
      },
      "tahun_survey": 2025,
      "status_pekerjaan": "Bekerja Full Time",
      "nama_perusahaan": "PT Tech Indonesia",
      "posisi": "direktur",
      "gaji": "10000000.00",
      "waktu_tunggu_kerja": 1,
      "kesesuaian_bidang_studi": "Sangat Sesuai",
      "kepuasan_prodi": 5
    }]
  }
}
```

**Statistics Response:**
```json
{
  "success": true,
  "data": {
    "total_respondents": 4,
    "status_pekerjaan": {
      "Bekerja Full Time": 3,
      "Bekerja Part Time": 1
    },
    "avg_gaji": 8500000.50,
    "avg_kepuasan_prodi": 4.5,
    "employment_rate": 90.5
  }
}
```

---

### 🏆 Kisah Sukses (Success Stories)
```bash
# List published stories
curl -s "http://127.0.0.1:8000/api/kisah-sukses?status=Published&per_page=3" | jq '.data.data[] | {judul, pencapaian, mahasiswa: .mahasiswa.nama}'

# Get featured stories
curl -s "http://127.0.0.1:8000/api/kisah-sukses-featured" | jq '.data[] | {judul, tahun_pencapaian}'

# Get statistics
curl -s "http://127.0.0.1:8000/api/kisah-sukses-statistics" | jq '.data'
```

---

### 🎓 Alumni
```bash
# List all alumni
curl -s "http://127.0.0.1:8000/api/alumni?per_page=5" | jq '.[] | {nama, email, tahun_lulus}'

# Filter by tahun lulus
curl -s "http://127.0.0.1:8000/api/alumni?tahun_lulus=2024" | jq '.[] | {nama, email}'

# Search alumni
curl -s "http://127.0.0.1:8000/api/alumni?search=Ahmad" | jq '.[] | .nama'

# Get statistics
curl -s "http://127.0.0.1:8000/api/alumni-statistics" | jq '.'
```

**Note:** Alumni API returns array directly (not paginated)

---

### 🔬 Penelitian (Research)
```bash
# List all penelitian
curl -s "http://127.0.0.1:8000/api/penelitian?per_page=3" | jq '.data.data[] | {judul_penelitian, jenis_penelitian, status}'

# Filter by status
curl -s "http://127.0.0.1:8000/api/penelitian?status=Selesai" | jq '.data.data[] | .judul_penelitian'

# Get statistics
curl -s "http://127.0.0.1:8000/api/penelitian-statistics" | jq '.data'
```

---

### 📝 PKM (Student Program)
```bash
# List all PKM
curl -s "http://127.0.0.1:8000/api/pkm?per_page=3" | jq '.data.data[] | {judul_pkm, jenis_pkm, status}'

# Filter by jenis
curl -s "http://127.0.0.1:8000/api/pkm?jenis_pkm=PKM-KC" | jq '.data.data[] | .judul_pkm'

# Get statistics
curl -s "http://127.0.0.1:8000/api/pkm-statistics" | jq '.data'
```

---

### 👨‍🏫 Dosen (Lecturers)
```bash
# List all dosen
curl -s "http://127.0.0.1:8000/api/dosen" | jq '.[] | {nama, nidn, jabatan}'

# Single dosen
curl -s "http://127.0.0.1:8000/api/dosen/1" | jq '.nama, .pendidikan'
```

---

### 📅 Agenda
```bash
# List all agenda
curl -s "http://127.0.0.1:8000/api/agenda?per_page=5" | jq '.data.data[] | {nama_kegiatan, tanggal_mulai, status}'

# Filter upcoming events
curl -s "http://127.0.0.1:8000/api/agenda?status=Akan%20Datang" | jq '.data.data[] | .nama_kegiatan'
```

---

### 📢 Pengumuman (Announcements)
```bash
# List all announcements
curl -s "http://127.0.0.1:8000/api/pengumuman?per_page=5" | jq '.data.data[] | {judul, kategori, tanggal_mulai}'

# Filter by kategori
curl -s "http://127.0.0.1:8000/api/pengumuman?kategori=Akademik" | jq '.data.data[] | .judul'
```

---

### 📄 Peraturan (Regulations)
```bash
# List all documents
curl -s "http://127.0.0.1:8000/api/peraturan?per_page=5" | jq '.data.data[] | {judul_dokumen, jenis_dokumen, tahun}'
```

---

### 🎖️ Prestasi (Achievements)
```bash
# List all achievements
curl -s "http://127.0.0.1:8000/api/prestasi?per_page=5" | jq '.data.data[] | {nama_kegiatan, tingkat, mahasiswa: .mahasiswa.nama}'
```

---

### 🏢 Profil Prodi
```bash
# Get program profile
curl -s "http://127.0.0.1:8000/api/profil-prodi" | jq '.visi, .misi'
```

---

### 🖼️ Galeri
```bash
# List all gallery items
curl -s "http://127.0.0.1:8000/api/galeri?per_page=5" | jq '.data.data[] | {judul, kategori, foto_url}'
```

---

## 🧪 Complex Filter Examples

### Tracer Study Advanced Filtering
```bash
# Find alumni working full time, sesuai bidang, gaji > 5jt, tunggu < 6 bulan
curl -s "http://127.0.0.1:8000/api/tracer-study?\
status_pekerjaan=Bekerja%20Full%20Time&\
kesesuaian_bidang_studi=Sangat%20Sesuai&\
gaji_min=5000000&\
waktu_tunggu_max=6&\
per_page=10" | jq '.data.data[] | {nama: .alumni.nama, posisi, gaji, waktu_tunggu_kerja}'
```

### Project Multi-Filter
```bash
# Find website projects from 2025 using React
curl -s "http://127.0.0.1:8000/api/project?\
kategori=Website&\
tahun_selesai=2025&\
search=React" | jq '.data[] | {judul_project, teknologi, mahasiswa: .mahasiswa.nama}'
```

---

## ✅ Test All Endpoints Script

Create `test-all-endpoints.sh`:

```bash
#!/bin/bash

BASE="http://127.0.0.1:8000/api"

echo "🧪 Testing All API Endpoints..."
echo ""

echo "1️⃣  Berita:" && curl -s "$BASE/berita?per_page=1" | jq '.success'
echo "2️⃣  Kurikulum:" && curl -s "$BASE/kurikulum?per_page=1" | jq '.success'
echo "3️⃣  Kurikulum Stats:" && curl -s "$BASE/kurikulum-statistics" | jq '.success'
echo "4️⃣  Project:" && curl -s "$BASE/project?per_page=1" | jq '.success'
echo "5️⃣  Tracer Study:" && curl -s "$BASE/tracer-study?per_page=1" | jq '.success'
echo "6️⃣  Tracer Stats:" && curl -s "$BASE/tracer-study-statistics" | jq '.success'
echo "7️⃣  Kisah Sukses:" && curl -s "$BASE/kisah-sukses?per_page=1" | jq '.success'
echo "8️⃣  Alumni:" && curl -s "$BASE/alumni" | jq 'length'
echo "9️⃣  Penelitian:" && curl -s "$BASE/penelitian?per_page=1" | jq '.success'
echo "🔟 PKM:" && curl -s "$BASE/pkm?per_page=1" | jq '.success'
echo "1️⃣1️⃣ Dosen:" && curl -s "$BASE/dosen" | jq 'length'
echo "1️⃣2️⃣ Agenda:" && curl -s "$BASE/agenda?per_page=1" | jq '.success'
echo "1️⃣3️⃣ Pengumuman:" && curl -s "$BASE/pengumuman?per_page=1" | jq '.success'

echo ""
echo "✅ All tests completed!"
```

Run with:
```bash
chmod +x test-all-endpoints.sh
./test-all-endpoints.sh
```

---

## 🔍 Common Issues & Solutions

### Issue 1: Gambar tidak tampil di Berita
**Problem:** `gambar_url` return `null`

**Check:**
```bash
curl -s "http://127.0.0.1:8000/api/berita/1" | jq '.data.gambar, .data.gambar_url'
```

**Solution:** Upload gambar melalui Laravel admin atau API POST

---

### Issue 2: Cover foto project tidak tampil
**Problem:** `cover_image_url` return `null`

**Check:**
```bash
curl -s "http://127.0.0.1:8000/api/project/2" | jq '.data.cover_image_url, .data.galeri_urls'
```

**Solution:** Upload via Laravel:
```bash
curl -X POST "http://127.0.0.1:8000/api/project" \
  -F "nim=20200001" \
  -F "judul_project=Test Project" \
  -F "deskripsi=Description here" \
  -F "teknologi=React, Laravel" \
  -F "tahun=2025" \
  -F "cover_image=@/path/to/image.jpg"
```

---

### Issue 3: CORS Error
**Problem:** Browser blocks request

**Check:** Laravel CORS config
```bash
# Check if CORS allows your frontend URL
curl -I "http://127.0.0.1:8000/api/berita" \
  -H "Origin: http://localhost:3000"
```

---

## 📊 Data Analysis Examples

### Find top companies hiring alumni
```bash
curl -s "http://127.0.0.1:8000/api/tracer-study-statistics" | \
  jq '.data.top_companies[] | "\(.total) alumni at \(.nama_perusahaan)"'
```

### Calculate SKS per semester
```bash
curl -s "http://127.0.0.1:8000/api/kurikulum-statistics" | \
  jq '.data.by_semester[] | "Semester \(.semester): \(.total_sks) SKS"'
```

### List all technologies used in projects
```bash
curl -s "http://127.0.0.1:8000/api/project" | \
  jq -r '.data[].teknologi' | tr ',' '\n' | sort -u
```

---

Last updated: November 19, 2025
