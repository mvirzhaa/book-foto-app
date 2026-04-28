// src/app/api/booking/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nim, type, bookingDate } = body;

    // 1. Validasi Input
    if (!nim || !type || !bookingDate) {
      return NextResponse.json({ message: "Semua data wajib diisi" }, { status: 400 });
    }

    // 2. Cari ID Mahasiswa berdasarkan NIM yang dimasukkan
    const user = await prisma.user.findUnique({
      where: { nim }
    });

    if (!user) {
      return NextResponse.json({ message: "NIM tidak terdaftar. Pastikan Anda sudah login/mendaftar." }, { status: 404 });
    }

    // 3. Simpan data ke tabel Registration (Prisma sangat pintar mengurus relasi ini)
    const newBooking = await prisma.registration.create({
      data: {
        userId: user.id,            // Mengambil ID asli dari database
        type: type,                 // KTM atau IJAZAH
        method: "STUDIO_BOOKING",   // Menandakan ini jalur booking studio
        bookingDate: new Date(bookingDate), // Mengubah teks ke format Waktu Database
        status: "PENDING",          // Status awal
      }
    });

    return NextResponse.json(
      { message: "Booking berhasil disimpan!", data: newBooking }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saat booking:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}