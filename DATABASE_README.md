# Database & Project Structure Documentation

## Overview
This document provides comprehensive documentation for the Software Engineering Program (Teknik Perangkat Lunak) website database structure, API endpoints, and page components.

## Database Structure

### Additional Fields
Laravel API provides additional computed fields:
- **Lecturers:** `foto_url` (full image URL)
- **Projects:** `foto_utama_url`, `galeri_urls` (array of full image URLs)

### Next.js Image Configuration
To display images from Laravel API, update your `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
};
```

**Important**: Restart Next.js server after configuration changes.1. tbl_dosen (Lecturers Table)
Stores information about faculty members and lecturers.

```sql
CREATE TABLE tbl_dosen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nidn VARCHAR(50) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    program_studi VARCHAR(255) NOT NULL DEFAULT 'Teknik Perangkat Lunak',
    jabatan VARCHAR(255) NOT NULL,
    bidang_keahlian TEXT,
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields Description:**
- `id`: Primary key (auto-increment)
- `nidn`: National Lecturer Identification Number
- `nama`: Full name of the lecturer
- `email`: Email address
- `program_studi`: Study program (default: 'Teknik Perangkat Lunak')
- `jabatan`: Position/title (e.g., 'Dosen', 'Ketua Program Studi')
- `bidang_keahlian`: Area of expertise/specialization
- `foto`: Profile photo filename/path
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### 2. tbl_mahasiswa (Students Table)
Stores information about students.

```sql
CREATE TABLE tbl_mahasiswa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nim VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    program_studi VARCHAR(255) NOT NULL DEFAULT 'Teknik Perangkat Lunak',
    angkatan INT NOT NULL,
    status ENUM('Aktif', 'Lulus', 'Cuti', 'Drop Out') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields Description:**
- `id`: Primary key (auto-increment)
- `nim`: Student Identification Number (unique)
- `nama`: Full name of the student
- `email`: Email address
- `program_studi`: Study program (default: 'Teknik Perangkat Lunak')
- `angkatan`: Academic year/batch
- `status`: Student status (Active, Graduate, Leave, Drop Out)

### 3. tbl_project (Student Projects Table)
Stores information about student projects and portfolios.

```sql
CREATE TABLE tbl_project (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    judul_proyek VARCHAR(255) NOT NULL,
    deskripsi_singkat TEXT,
    nama_mahasiswa VARCHAR(255) NOT NULL,
    nim_mahasiswa VARCHAR(50) NOT NULL,
    program_studi VARCHAR(255) NOT NULL DEFAULT 'Teknik Perangkat Lunak',
    dosen_pembimbing VARCHAR(255),
    tahun_selesai INT NOT NULL,
    path_foto_utama VARCHAR(255),
    path_foto_galeri TEXT,
    keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields Description:**
- `project_id`: Primary key (auto-increment)
- `judul_proyek`: Project title
- `deskripsi_singkat`: Brief project description
- `nama_mahasiswa`: Student name
- `nim_mahasiswa`: Student ID number
- `program_studi`: Study program
- `dosen_pembimbing`: Supervisor/advisor name
- `tahun_selesai`: Completion year
- `path_foto_utama`: Main project image path
- `path_foto_galeri`: Gallery images paths (comma-separated)
- `keywords`: Project keywords/tags (comma-separated)

### 4. tbl_matakuliah (Courses Table)
Stores curriculum and course information.

```sql
CREATE TABLE tbl_matakuliah (
    mk_id INT PRIMARY KEY AUTO_INCREMENT,
    kode_mk VARCHAR(20) NOT NULL UNIQUE,
    nama_mk VARCHAR(255) NOT NULL,
    sks INT NOT NULL,
    semester INT NOT NULL,
    program_studi VARCHAR(255) NOT NULL DEFAULT 'Teknik Perangkat Lunak',
    kurikulum_tahun INT NOT NULL,
    deskripsi_singkat TEXT,
    status_wajib ENUM('Wajib', 'Pilihan') DEFAULT 'Wajib',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields Description:**
- `mk_id`: Primary key (auto-increment)
- `kode_mk`: Course code (unique identifier)
- `nama_mk`: Course name
- `sks`: Credit hours (SKS - Satuan Kredit Semester)
- `semester`: Semester number (1-8)
- `program_studi`: Study program
- `kurikulum_tahun`: Curriculum year
- `deskripsi_singkat`: Brief course description
- `status_wajib`: Course type (Mandatory/Elective)

## API Endpoints

### Laravel API Integration
The application now integrates with a Laravel API backend running on `http://localhost:8000/api`

### 1. Lecturers API (`http://localhost:8000/api/dosen`)
- **GET** `/api/dosen` - Fetch all lecturers
- **GET** `/api/dosen/{id}` - Fetch specific lecturer by ID
- **Response Format:** `{ data: [...], message: "Success", status: "success" }`

### 2. Projects API (`http://localhost:8000/api/project`)
- **GET** `/api/project` - Fetch all student projects
- **GET** `/api/project/{id}` - Fetch specific project by ID
- **Response Format:** `{ data: [...], message: "Success", status: "success" }`
- **Note:** Endpoint uses singular "project" not plural "projects"

### 3. Courses API (`http://localhost:8000/api/matakuliah`)
- **GET** `/api/matakuliah` - Fetch all courses
- **GET** `/api/matakuliah/{id}` - Fetch specific course by ID
- **Response Format:** `{ data: [...], message: "Success", status: "success" }`

## Page Structure

### 1. Landing Page (`/`)
**File:** `src/app/page.tsx`
- Hero section with program introduction
- Quick navigation to main sections
- Clean, minimal design

### 2. Home Page (`/beranda`)
**File:** `src/app/beranda/page.tsx`
- **Features:**
  - Dynamic statistics (lecturers, projects, courses count)
  - Program highlights section
  - Quick links to all sections
  - Community engagement section
- **Data Sources:** Fetches from Laravel APIs for statistics:
  - `http://localhost:8000/api/dosen`
  - `http://localhost:8000/api/project`
  - `http://localhost:8000/api/matakuliah`

### 3. Profile Page (`/profil`)
**File:** `src/app/profil/page.tsx`
- **Features:**
  - Program vision and mission
  - Curriculum overview
  - Facilities information
  - Career prospects
- **Content:** Static content about the Software Engineering program

### 4. Lecturers Page (`/dosen`)
**File:** `src/app/dosen/page.tsx`
- **Features:**
  - Professional lecturer showcase
  - Lecturer cards with photos, positions, expertise
  - Statistics display
  - No filtering (single program focus)
- **Data Source:** `http://localhost:8000/api/dosen`
- **Layout:** Card grid with centered photo and name alignment

### 5. Student Projects Page (`/mahasiswa`)
**File:** `src/app/mahasiswa/page.tsx`
- **Features:**
  - Project gallery with images
  - Search functionality (title, student name, NIM, keywords)
  - Year-based filtering
  - Project details display
  - **NEW:** Click eye icon to view detailed project information
- **Data Source:** `http://localhost:8000/api/project`
- **Filters:** Search text, completion year
- **Navigation:** Eye icon links to `/mahasiswa/[id]` for detailed view

### 6. Project Detail Page (`/mahasiswa/[id]`)
**File:** `src/app/mahasiswa/[id]/page.tsx`
- **Features:**
  - Comprehensive project information display
  - Large main project image
  - Full project description
  - Interactive gallery with click-to-view functionality
  - Project statistics and metadata
  - Keywords display
  - Back navigation to project list
- **Data Source:** `http://localhost:8000/api/project/{id}`
- **Layout:** Two-column layout with main content and sidebar

## Component Structure

### Shared Components (`src/app/components/`)
- `Navbar.tsx` - Navigation bar
- `Footer.tsx` - Footer component
- `ui/` - UI components (buttons, cards, tables, etc.)

### Database Connection
**File:** `src/app/lib/db.ts`
- MySQL connection using connection pooling
- Environment variables for database credentials

## Design System

### Color Scheme
- **Primary:** Blue gradient (#3B82F6 to #1E40AF)
- **Secondary:** Green (#10B981 for courses), Purple (#8B5CF6 for projects)
- **Background:** Gray-blue gradient (#F9FAFB to #EFF6FF)

### Typography
- **Headings:** Bold, gradient text effects
- **Body:** Clean, readable fonts
- **Cards:** Consistent spacing and shadow effects

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Consistent spacing and alignment

## Laravel API Integration

The Next.js application has been updated to integrate with a Laravel backend API instead of using internal API routes. Key changes include:

### API Base URL
- **Laravel API:** `http://localhost:8000/api`
- **Previous Internal API:** `/api/*`

### Response Format Changes
Laravel API responses are wrapped in a standard format:
```json
{
  "data": [...],
  "message": "Success message",
  "status": "success"
}
```

### Updated Endpoints
- **Lecturers:** `/api/dosen` → `http://localhost:8000/api/dosen`
- **Projects:** `/api/projects` → `http://localhost:8000/api/project` (note: singular)
- **Courses:** `/api/matakuliah` → `http://localhost:8000/api/matakuliah`

### Additional Fields
Laravel API provides additional computed fields:
- **Lecturers:** `foto_url` (full image URL)
- **Projects:** `foto_utama_url`, `galeri_urls` (arrays of full image URLs)

### CORS Configuration
Ensure Laravel CORS is configured to allow requests from Next.js:
```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001'],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
```

### 1. Single Program Focus
- All data filtered for "Teknik Perangkat Lunak" program only
- Simplified UI without unnecessary program selection filters

### 2. Professional Presentation
- Transformed from CRUD interface to showcase website
- Focus on displaying information rather than data management
- Modern, clean design with hover effects and animations

### 3. Search and Filter Capabilities
- Projects: Text search + year filtering
- Courses: Semester-based organization and filtering
- Lecturers: Display all (no filtering needed)

### 4. Performance Optimizations
- API-based data fetching
- Loading states and error handling
- Optimized images with Next.js Image component

## Environment Variables
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=laravel
```

## Technology Stack
- **Framework:** Next.js 15.5.0 with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **Icons:** React Icons (Feather Icons)
- **Image Handling:** Next.js Image component

## Development Notes
- Server runs on port 3000 (or next available port)
- Hot reload enabled for development
- TypeScript strict mode enabled
- ESLint and formatting configured