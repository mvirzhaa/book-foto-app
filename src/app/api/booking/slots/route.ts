// src/app/api/booking/slots/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// KONFIGURASI KUOTA: Maksimal 5 mahasiswa per 1 jam
const MAX_CAPACITY = 5; 

// DAFTAR JAM OPERASIONAL STUDIO BPPSI
const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00", // Istirahat jam 12
  "14:00 - 15:00",
  "15:00 - 16:00"
];

export async function GET(req: Request) {
  try {
    // 1. Tangkap tanggal yang dipilih mahasiswa (Format: YYYY-MM-DD)
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); 

    if (!dateParam) {
      return NextResponse.json({ success: false, message: "Tanggal wajib dipilih" }, { status: 400 });
    }

    // 2. Karena di database tipenya DateTime, kita buat rentang pencarian 1 hari penuh
    // (Dari jam 00:00 sampai jam 23:59 pada tanggal tersebut)
    const startDate = new Date(`${dateParam}T00:00:00.000Z`);
    const endDate = new Date(`${dateParam}T23:59:59.999Z`);

    // 3. Cari semua pendaftaran yang metode-nya BOOKING pada tanggal tersebut
    // Kita kecualikan yang statusnya REJECTED (karena yang ditolak tidak memakan kuota)
    const existingBookings = await prisma.registration.findMany({
      where: {
        method: "STUDIO_BOOKING",
        bookingDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: "REJECTED" 
        }
      },
      select: { bookingTime: true } // Kita cuma butuh tahu mereka ambil jam berapa
    });

    // 4. Hitung dan petakan sisa kuota untuk setiap jamnya
    const slotAvailability = TIME_SLOTS.map(slot => {
      // Hitung ada berapa orang yang sudah daftar di jam ini
      const bookedCount = existingBookings.filter(b => b.bookingTime === slot).length;
      
      return {
        time: slot,
        booked: bookedCount,
        capacity: MAX_CAPACITY,
        isFull: bookedCount >= MAX_CAPACITY // TRUE jika sudah 5 orang atau lebih
      };
    });

    // 5. Kembalikan data ke frontend
    return NextResponse.json({ 
      success: true, 
      date: dateParam, 
      slots: slotAvailability 
    }, { status: 200 });

  } catch (error) {
    console.error("Error mengecek slot booking:", error);
    return NextResponse.json({ success: false, message: "Gagal mengecek jadwal studio" }, { status: 500 });
  }
}