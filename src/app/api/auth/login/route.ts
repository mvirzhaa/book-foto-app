// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { nim, password } = await req.json();

    if (!nim || !password) {
      return NextResponse.json({ message: "NIM dan Password wajib diisi" }, { status: 400 });
    }

    // 1. Cari user di database
    const user = await prisma.user.findUnique({ where: { nim } });
    if (!user) {
      return NextResponse.json({ message: "Akun tidak ditemukan" }, { status: 404 });
    }

    // 2. Cocokkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // 3. Login sukses! Kembalikan data BESERTA ROLE-nya
    return NextResponse.json(
      { 
        message: "Login berhasil", 
        user: { 
          id: user.id, 
          nim: user.nim, 
          name: user.name, 
          role: user.role // <-- Ini kunci untuk RBAC kita!
        } 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}