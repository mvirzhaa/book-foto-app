// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1. Ambil data dari form frontend (Sekarang termasuk 3 field akademik baru)
    const body = await req.json();
    const { nim, name, password, fakultas, prodi, angkatan } = body;

    // 2. Validasi: Pastikan semua data terisi (termasuk data akademik)
    if (!nim || !name || !password || !fakultas || !prodi || !angkatan) {
      return NextResponse.json({ message: "Semua kelengkapan data wajib diisi" }, { status: 400 });
    }

    // 3. Cek apakah NIM sudah pernah didaftarkan sebelumnya
    const existingUser = await prisma.user.findUnique({
      where: { nim }
    });

    if (existingUser) {
      return NextResponse.json({ message: "NIM sudah terdaftar. Silakan login." }, { status: 409 });
    }

    // 4. Enkripsi (Hash) password demi keamanan data mahasiswa
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan data mahasiswa baru ke database PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        nim,
        name,
        fakultas: fakultas,  // <-- Data baru dimasukkan ke DB
        prodi: prodi,     // <-- Data baru dimasukkan ke DB
        angkatan: angkatan,  // <-- Data baru dimasukkan ke DB
        password: hashedPassword,
        role: "STUDENT", 
      }
    });

    // 6. Beri respons sukses ke frontend
    return NextResponse.json(
      { message: "Registrasi berhasil", user: { id: newUser.id, nim: newUser.nim, name: newUser.name } }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saat registrasi:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}