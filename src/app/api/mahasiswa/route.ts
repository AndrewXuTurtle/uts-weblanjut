import { db } from "../../lib/db";
import { NextResponse } from "next/server";

export type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    email: string;
    jurusan: string;
    angkatan: Date;
    created_at: Date;
    updated_at: Date;   
};

export async function GET() {
    try {
        const [rows] = await db.query("SELECT * FROM tbl_mahasiswa");
        return NextResponse.json(rows as Mahasiswa[]);
    } catch {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { nim, nama, email, jurusan, angkatan } = await request.json();
        
        // Validate required fields
        if (!nim || !nama || !email || !jurusan || !angkatan) {
            return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 });
        }
        
        // Check if NIM already exists
        const [existingNim] = await db.query("SELECT id FROM tbl_mahasiswa WHERE nim = ?", [nim]);
        if (existingNim && Array.isArray(existingNim) && existingNim.length > 0) {
            return NextResponse.json({ message: "NIM sudah terdaftar" }, { status: 409 });
        }
        
        const [result] = await db.query(
            "INSERT INTO tbl_mahasiswa (nim, nama, email, jurusan, angkatan, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
            [nim, nama, email, jurusan, angkatan]
        );
        const insertResult = result as { insertId: number };
        return NextResponse.json({ id: insertResult.insertId, nim, nama, email, jurusan, angkatan });
    } catch (error: unknown) {
        console.error("POST /api/mahasiswa error:", error);
        return NextResponse.json({ message: (error as Error)?.message || "Internal Server Error" }, { status: 500 });
    }
}