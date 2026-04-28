// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    // 1. Terima data dari form (menggunakan FormData karena ini berisi file, bukan JSON biasa)
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const nim = formData.get("nim") as string;
    const type = formData.get("type") as string;

    if (!file || !nim || !type) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // 2. Cek apakah NIM terdaftar
    const user = await prisma.user.findUnique({
      where: { nim }
    });

    if (!user) {
      return NextResponse.json({ message: "NIM tidak terdaftar." }, { status: 404 });
    }

    // 3. Persiapkan File untuk disimpan
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Buat nama file yang unik agar tidak bentrok (Format: NIM_Jenis_AngkaAcak.ekstensi)
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${nim}_${type}_${Date.now()}${fileExtension}`;
    
    // Tentukan alamat penyimpanan ke folder public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, uniqueFilename);

    // 4. Simpan file fisik ke dalam server
    await writeFile(filePath, buffer);

    // 5. Simpan data ke database
    const photoUrl = `/uploads/${uniqueFilename}`; // URL yang bisa diakses dari browser
    
    const newUpload = await prisma.registration.create({
      data: {
        userId: user.id,
        type: type as "KTM" | "IJAZAH",
        method: "UPLOAD",
        photoUrl: photoUrl,
        status: "PENDING", // Menunggu verifikasi admin
      }
    });

    return NextResponse.json({ message: "Foto berhasil diunggah", data: newUpload }, { status: 201 });

  } catch (error) {
    console.error("Error saat upload:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}