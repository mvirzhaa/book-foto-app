// src/app/api/master-data/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Ambil data Angkatan (diurutkan dari tahun terkecil ke terbesar)
    const angkatan = await prisma.angkatan.findMany({
      orderBy: { tahun: 'asc' },
    });

    // 2. Ambil data Fakultas SEKALIGUS dengan data Prodi di dalamnya
    const fakultas = await prisma.fakultas.findMany({
      include: {
        prodi: true, // Ini keajaiban Prisma, merelasikan data secara otomatis!
      },
      orderBy: { nama: 'asc' },
    });

    // 3. Bungkus dan kirimkan ke frontend
    return NextResponse.json(
      {
        success: true,
        data: { angkatan, fakultas }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching master data:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data dari server" },
      { status: 500 }
    );
  }
}

// Tambahkan di bagian bawah file src/app/api/master-data/route.ts

// FUNGSI UNTUK MENAMBAH DATA BARU
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, nama, tahun, fakultasId } = body;

    if (type === "FAKULTAS") {
      const res = await prisma.fakultas.create({ data: { nama } });
      return NextResponse.json({ success: true, data: res });
    }
    if (type === "PRODI") {
      const res = await prisma.prodi.create({ data: { nama, fakultasId } });
      return NextResponse.json({ success: true, data: res });
    }
    if (type === "ANGKATAN") {
      const res = await prisma.angkatan.create({ data: { tahun } });
      return NextResponse.json({ success: true, data: res });
    }

    return NextResponse.json({ success: false, message: "Tipe tidak valid" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menyimpan data" }, { status: 500 });
  }
}

// FUNGSI UNTUK MENGHAPUS DATA
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!id || !type) return NextResponse.json({ success: false }, { status: 400 });

    if (type === "FAKULTAS") await prisma.fakultas.delete({ where: { id } });
    if (type === "PRODI") await prisma.prodi.delete({ where: { id } });
    if (type === "ANGKATAN") await prisma.angkatan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 500 });
  }
}