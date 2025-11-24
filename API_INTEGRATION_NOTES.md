# API Integration Notes - Modal Conversion

## Cara Kerja API yang Benar (SEBELUM DIUBAH KE MODAL)

### 1. BERITA (`/app/berita/page.tsx`)
**API Call:**
```typescript
import { getBerita } from '@/lib/api';

const response = await getBerita();
if (response.success) {
  const beritaData = response.data?.data || response.data || [];
  setData(Array.isArray(beritaData) ? beritaData : []);
}
```

**Response Structure Laravel:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ...array berita... ]
  }
}
```

**Navigation ke Detail:**
```typescript
onClick={() => router.push(`/berita/${item.id}`)}
```

**Detail Page:** `/berita/[id]/page.tsx` - Fetch by ID dari Laravel

---

### 2. PENELITIAN (`/app/penelitian/page.tsx`)
**API Call:**
```typescript
import { getPenelitian } from '@/lib/api';

const response = await getPenelitian();
if (response.success) {
  const penelitianData = response.data?.data || response.data || [];
  setData(Array.isArray(penelitianData) ? penelitianData : []);
}
```

**Response Structure Laravel:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ...array penelitian... ]
  }
}
```

**Navigation ke Detail:**
```typescript
onClick={() => router.push(`/penelitian/${item.id}`)}
```

**Detail Page:** `/penelitian/[id]/page.tsx` - Fetch by ID dari Laravel

---

### 3. PKM (`/app/pkm/page.tsx`)
**API Call:**
```typescript
import { getPKM } from '@/lib/api';

const response = await getPKM();
if (response.success) {
  const pkmData = response.data?.data || response.data || [];
  setData(Array.isArray(pkmData) ? pkmData : []);
}
```

**Response Structure Laravel:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ...array pkm... ]
  }
}
```

**Navigation ke Detail:**
```typescript
onClick={() => router.push(`/pkm/${item.id}`)}
```

**Detail Page:** `/pkm/[id]/page.tsx` - Fetch by ID dari Laravel

---

### 4. PENGUMUMAN (`/app/pengumuman/page.tsx`)
**API Call:**
```typescript
import { getPengumuman } from '@/lib/api';

const response = await getPengumuman();
if (response.success) {
  const pengumumanData = response.data?.data || response.data || [];
  setData(Array.isArray(pengumumanData) ? pengumumanData : []);
}
```

**Response Structure Laravel:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ...array pengumuman... ]
  }
}
```

**Navigation ke Detail:**
```typescript
onClick={() => router.push(`/pengumuman/${item.id}`)}
```

**Detail Page:** `/pengumuman/[id]/page.tsx` - Fetch by ID dari Laravel

---

### 5. AGENDA (`/app/agenda/page.tsx`)
**API Call:**
```typescript
import { getAgenda } from '@/lib/api';

const response = await getAgenda();
if (response.success) {
  const agendaData = response.data?.data || response.data || [];
  setData(Array.isArray(agendaData) ? agendaData : []);
}
```

**Response Structure Laravel:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ...array agenda... ]
  }
}
```

**Navigation ke Detail:**
```typescript
onClick={() => router.push(`/agenda/${item.id}`)}
```

**Detail Page:** `/agenda/[id]/page.tsx` - Fetch by ID dari Laravel

---

## ✅ DOSEN (SUDAH DIUBAH KE MODAL - WORKING!)

**API Call (BENAR):**
```typescript
// Langsung fetch ke Next.js API proxy
const response = await fetch('/api/dosen');
const json = await response.json();

// Handle Laravel paginated response
let dosenData = [];
if (json.success && json.data) {
  dosenData = json.data.data || json.data;
} else if (Array.isArray(json)) {
  dosenData = json;
}
setData(Array.isArray(dosenData) ? dosenData : []);
```

**Next.js API Proxy (`/api/dosen/route.ts`):**
```typescript
import { NextResponse } from 'next/server';

const LARAVEL_API_URL = 'http://127.0.0.1:8000/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const url = `${LARAVEL_API_URL}/dosen${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

**Modal Implementation:**
```typescript
const [selectedDosen, setSelectedDosen] = useState<Dosen | null>(null);

// Klik card
onClick={() => setSelectedDosen(dosen)}

// Modal popup
{selectedDosen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
    {/* Modal content */}
  </div>
)}
```

---

## RENCANA KONVERSI KE MODAL

### Step-by-step untuk setiap halaman:

1. **Hapus import useRouter** dan router instance
2. **Tambah state:** `const [selectedItem, setSelectedItem] = useState<Type | null>(null);`
3. **Ubah onClick:** dari `router.push()` ke `setSelectedItem(item)`
4. **Tambah Modal Component** di bawah list dengan semua info detail
5. **Hapus folder detail page** (`[id]` folder)
6. **JANGAN UBAH API CALL** - Tetap pakai yang sudah ada (getBerita, getPenelitian, dll)

### Keuntungan Modal:
- ✅ Lebih cepat (no navigation)
- ✅ Lebih modern (smooth animation)
- ✅ Data sudah ada di list (no extra fetch)
- ✅ Better UX (langsung tutup, kembali ke posisi scroll)

---

## IMPORTANT NOTES:

### ❌ JANGAN:
- Ubah cara pemanggilan API yang sudah ada
- Hapus import `getBerita`, `getPenelitian`, dll dari `/lib/api`
- Ubah response handler yang sudah working
- Buat API proxy baru jika tidak perlu

### ✅ LAKUKAN:
- Tetap gunakan API call yang ada (working dengan benar)
- Hanya ubah navigasi dari router.push() ke modal
- Gunakan data yang sudah di-fetch di list page
- Tambah modal component dengan animation
- Hapus halaman detail [id] setelah modal selesai

---

## Template Modal Component:

```typescript
{selectedItem && (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    onClick={() => setSelectedItem(null)}
  >
    <div 
      className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button onClick={() => setSelectedItem(null)}>
        <FiX />
      </button>
      
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-[color] to-[color] text-white p-8">
        {/* Title, badges, meta info */}
      </div>
      
      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Info sections with icons */}
      </div>
      
      {/* Footer */}
      <div className="p-6 bg-gray-50 rounded-b-3xl border-t">
        <button onClick={() => setSelectedItem(null)}>Tutup</button>
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
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
  .animate-slideUp { animation: slideUp 0.3s ease-out; }
`}</style>
```

---

**Status:** Dokumentasi lengkap cara kerja API sebelum konversi ke modal ✅
