// prisma/seed.ts
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("🌱 Memulai proses seeding data master...");

  // 1. Data Angkatan
  const angkatanList = ["2022", "2023", "2024", "2025", "2026"];
  for (const tahun of angkatanList) {
    await prisma.angkatan.upsert({
      where: { tahun },
      update: {},
      create: { tahun },
    });
  }
  console.log("✔️ Master Angkatan berhasil disuntikkan.");

  // 2. Data Fakultas & Prodi UIKA
  const fakultasData = [
    {
      nama: "Fakultas Teknik (FT)",
      prodi: ["Teknik Informatika", "Teknik Sipil", "Teknik Mesin", "Teknik Elektro"]
    },
    {
      nama: "Fakultas Ekonomi dan Bisnis (FEB)",
      prodi: ["Manajemen", "Akuntansi"]
    },
    {
      nama: "Fakultas Agama Islam (FAI)",
      prodi: ["Pendidikan Agama Islam", "Komunikasi Penyiaran Islam", "Ekonomi Syariah"]
    },
    {
      nama: "Fakultas Ilmu Pengetahuan Kesehatan (FIKES)",
      prodi: ["Kesehatan Masyarakat"]
    }
  ];

  for (const fak of fakultasData) {
    const fakultasRecord = await prisma.fakultas.upsert({
      where: { nama: fak.nama },
      update: {},
      create: { nama: fak.nama },
    });

    for (const namaProdi of fak.prodi) {
      // Cari prodi ini sudah ada atau belum di fakultas tersebut
      const existingProdi = await prisma.prodi.findFirst({
        where: { nama: namaProdi, fakultasId: fakultasRecord.id }
      });

      if (!existingProdi) {
        await prisma.prodi.create({
          data: {
            nama: namaProdi,
            fakultasId: fakultasRecord.id
          }
        });
      }
    }
  }
  console.log("✔️ Master Fakultas & Prodi berhasil disuntikkan.");
  console.log("✨ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });