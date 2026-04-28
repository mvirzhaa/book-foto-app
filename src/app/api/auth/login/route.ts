// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nim, password } = body;

    // 1. Cek apakah form diisi
    if (!nim || !password) {
      return NextResponse.json({ message: "NIM dan Password wajib diisi" }, { status: 400 });
    }

    // 2. Cari mahasiswa berdasarkan NIM di database
    const user = await prisma.user.findUnique({
      where: { nim }
    });

    // Jika NIM tidak ditemukan
    if (!user) {
      return NextResponse.json({ message: "NIM tidak terdaftar" }, { status: 404 });
    }

    // 3. Cocokkan password yang diketik dengan password yang dienkripsi di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password salah!" }, { status: 401 });
    }

    // 4. Jika sukses, kirim data mahasiswa (tanpa password)
    return NextResponse.json(
      { 
        message: "Login sukses", 
        user: { id: user.id, nim: user.nim, name: user.name, role: user.role } 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error saat login:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}