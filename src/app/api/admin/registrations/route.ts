// src/app/api/admin/registrations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fungsi untuk MENGAMBIL semua data pendaftaran
export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        user: true, // Mengambil data nama dan NIM mahasiswa yang berelasi
      },
      orderBy: {
        createdAt: 'desc', // Mengurutkan dari yang paling baru
      },
    });

    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// Fungsi untuk MENGUBAH status (Setujui / Tolak)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: `Status berhasil diubah menjadi ${status}`, data: updatedRegistration }, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ message: "Gagal mengubah status" }, { status: 500 });
  }
}