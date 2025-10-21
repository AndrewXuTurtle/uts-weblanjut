import { db } from "../../lib/db";
import { NextResponse } from "next/server";

export type Dosen = {
    id: number;
    nidn: string;
    nama: string;
    email: string;
    program_studi: string;
    jabatan: string;
    bidang_keahlian: string;
    created_at: Date;
    updated_at: Date;
};

export async function GET() {
    try {
        const [rows] = await db.query(`
            SELECT
                id,
                nidn,
                nama,
                email,
                program_studi,
                jabatan,
                bidang_keahlian,
                created_at,
                updated_at
            FROM tbl_dosen
        `);
        console.log("Rows:", rows);
        return NextResponse.json(rows as Dosen[]);
    } catch(error: unknown) {
        console.error("API ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { nidn, nama, email, program_studi, jabatan, bidang_keahlian } = await request.json();
        
        // Validate required fields
        if (!nidn || !nama || !email || !program_studi || !jabatan) {
            return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 });
        }
        
        // Check if NIDN already exists
        const [existingNidn] = await db.query("SELECT id FROM tbl_dosen WHERE nidn = ?", [nidn]);
        if (existingNidn && Array.isArray(existingNidn) && existingNidn.length > 0) {
            return NextResponse.json({ message: "NIDN sudah terdaftar" }, { status: 409 });
        }
        
        const [result] = await db.query(
            "INSERT INTO tbl_dosen (nidn, nama, email, program_studi, jabatan, bidang_keahlian, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [nidn, nama, email, program_studi, jabatan, bidang_keahlian || null]
        );
        const insertResult = result as { insertId: number };
        return NextResponse.json({ id: insertResult.insertId, nidn, nama, email, program_studi, jabatan, bidang_keahlian });
    } catch (error: unknown) {
        console.error("POST /api/dosen error:", error);
        return NextResponse.json({ message: (error as Error)?.message || "Internal Server Error" }, { status: 500 });
    }
}

// For PUT and DELETE, Next.js route handlers use dynamic routes for resource id
// So create [id]/route.ts for PUT and DELETE handlers