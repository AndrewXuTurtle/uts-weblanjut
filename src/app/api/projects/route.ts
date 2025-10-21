import { db } from "../../lib/db";
import { NextResponse } from "next/server";

export type Project = {
    project_id: number;
    judul_proyek: string;
    deskripsi_singkat: string;
    nama_mahasiswa: string;
    nim_mahasiswa: string;
    program_studi: string;
    dosen_pembimbing: string;
    tahun_selesai: number;
    path_foto_utama: string;
    path_foto_galeri: string;
    keywords: string;
};

export async function GET() {
    try {
        const [rows] = await db.query("SELECT * FROM tbl_project ORDER BY tahun_selesai DESC, project_id DESC");
        return NextResponse.json(rows as Project[]);
    } catch(error: unknown) {
        console.error("GET /api/projects error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}