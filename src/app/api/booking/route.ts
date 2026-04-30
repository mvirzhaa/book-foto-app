// src/app/api/booking/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nim, type, bookingDate, bookingTime } = body;

    // 1. Validasi Input (Sekarang wajib ada bookingTime)
    if (!nim || !bookingDate || !bookingTime) {
      return NextResponse.json({ message: "Semua data wajib diisi" }, { status: 400 });
    }

    // 2. Cari ID Mahasiswa berdasarkan NIM
    const user = await prisma.user.findUnique({
      where: { nim }
    });

    if (!user) {
      return NextResponse.json({ message: "NIM tidak terdaftar." }, { status: 404 });
    }

    // 3. PROTEKSI LAPIS KEDUA: Cek Kuota di Backend
    const startDate = new Date(`${bookingDate}T00:00:00.000Z`);
    const endDate = new Date(`${bookingDate}T23:59:59.999Z`);
    
    const existingBookings = await prisma.registration.count({
      where: {
        method: "STUDIO_BOOKING",
        bookingDate: { gte: startDate, lte: endDate },
        bookingTime: bookingTime,
        status: { not: "REJECTED" }
      }
    });

    if (existingBookings >= 5) { // Maksimal 5 orang per jam
      return NextResponse.json({ message: "Mohon maaf, slot jam ini baru saja penuh. Silakan pilih jam lain." }, { status: 400 });
    }

    // 4. Simpan data ke tabel Registration lengkap dengan Jamnya
    const newBooking = await prisma.registration.create({
      data: {
        userId: user.id,
        type: type || "KTM",          // Jenis foto (KTM/IJAZAH)
        method: "STUDIO_BOOKING",
        bookingDate: startDate,
        bookingTime: bookingTime,
        status: "PENDING",
      }
    });

    return NextResponse.json(
      { message: "Jadwal berhasil dibooking!", data: newBooking }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saat booking:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}