// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: Ambil semua data pengguna (kecuali password)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, nim: true, name: true, role: true, 
        fakultas: true, prodi: true, angkatan: true, createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengambil data pengguna" }, { status: 500 });
  }
}

// DELETE: Hapus akun pengguna
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID diperlukan" }, { status: 400 });

    // Proteksi: Jangan sampai Admin utama terhapus!
    const userToVerify = await prisma.user.findUnique({ where: { id } });
    if (userToVerify?.nim === "admin") {
      return NextResponse.json({ success: false, message: "Akun Admin Master tidak boleh dihapus!" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Akun berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus akun" }, { status: 500 });
  }
}

// PATCH: Reset Password
export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: "ID diperlukan" }, { status: 400 });

    // Set password default menjadi: 12345678
    const hashedPassword = await bcrypt.hash("12345678", 10);
    
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true, message: "Password di-reset ke: 12345678" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mereset password" }, { status: 500 });
  }
}